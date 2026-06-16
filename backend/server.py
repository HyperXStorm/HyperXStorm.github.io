from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import uuid
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict
from collections import Counter

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# ---- Mongo ----
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"

app = FastAPI(title="Aham Arogyam TCM Quiz API")
api_router = APIRouter(prefix="/api")

security = HTTPBearer(auto_error=False)


# ---- Helpers ----
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=8),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_admin(
    creds: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> dict:
    if creds is None or not creds.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = creds.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user or user.get("role") != "admin":
            raise HTTPException(status_code=401, detail="Not authorized")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---- Models ----
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class QuizAnswer(BaseModel):
    question_id: str
    element: str  # one of: wood, fire, earth, metal, water


class QuizSubmitRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    email: EmailStr
    dob: Optional[str] = None  # ISO date string
    age: Optional[int] = None
    gender: Optional[str] = None
    location: Optional[str] = None
    answers: List[QuizAnswer]


class QuizSubmission(BaseModel):
    id: str
    name: str
    email: str
    dob: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    location: Optional[str] = None
    dominant_element: str
    scores: Dict[str, int]
    created_at: str


# ---- Auth ----
@api_router.post("/auth/login")
async def login(body: LoginRequest):
    email = body.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], user["email"])
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user["id"], "email": user["email"], "name": user.get("name", "Admin"), "role": user["role"]},
    }


@api_router.get("/auth/me")
async def me(admin: dict = Depends(get_current_admin)):
    return admin


# ---- Quiz ----
ELEMENTS = ["wood", "fire", "earth", "metal", "water"]


@api_router.post("/quiz/submit")
async def submit_quiz(body: QuizSubmitRequest):
    if not body.answers:
        raise HTTPException(status_code=400, detail="No answers provided")
    counter = Counter()
    for ans in body.answers:
        if ans.element not in ELEMENTS:
            raise HTTPException(status_code=400, detail=f"Invalid element: {ans.element}")
        counter[ans.element] += 1
    scores = {e: counter.get(e, 0) for e in ELEMENTS}
    dominant_element = max(scores, key=scores.get)
    submission = {
        "id": str(uuid.uuid4()),
        "name": body.name.strip(),
        "email": body.email.lower().strip(),
        "dob": body.dob,
        "age": body.age,
        "gender": body.gender,
        "location": body.location,
        "dominant_element": dominant_element,
        "scores": scores,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.quiz_submissions.insert_one(submission)
    submission.pop("_id", None)
    return submission


@api_router.get("/quiz/submissions")
async def list_submissions(admin: dict = Depends(get_current_admin)):
    docs = await db.quiz_submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs


@api_router.get("/quiz/stats")
async def quiz_stats(admin: dict = Depends(get_current_admin)):
    docs = await db.quiz_submissions.find({}, {"_id": 0, "dominant_element": 1}).to_list(10000)
    counts = Counter(d["dominant_element"] for d in docs)
    return {
        "total": len(docs),
        "by_element": {e: counts.get(e, 0) for e in ELEMENTS},
    }


@api_router.get("/")
async def root():
    return {"message": "Aham Arogyam TCM Quiz API"}


# ---- Startup ----
@app.on_event("startup")
async def startup():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.quiz_submissions.create_index("created_at")

    # Seed admin
    admin_email = os.environ["ADMIN_EMAIL"].lower().strip()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logging.info(f"Seeded admin user: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )
        logging.info("Updated admin password to match .env")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)
