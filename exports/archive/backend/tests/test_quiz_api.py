"""Backend API tests for Aham Arogyam TCM Quiz."""
import os
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://arogyam-quiz.preview.emergentagent.com").rstrip("/")
ADMIN_EMAIL = "admin@ahamarogyam.com"
ADMIN_PASSWORD = "aham@2026"


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


@pytest.fixture(scope="module")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ---- Auth ----
def test_login_success():
    r = requests.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200
    data = r.json()
    assert "access_token" in data and data["access_token"]
    assert data["user"]["email"] == ADMIN_EMAIL
    assert data["user"]["role"] == "admin"


def test_login_wrong_password():
    r = requests.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"}, timeout=30)
    assert r.status_code == 401


def test_me_with_token(auth_headers):
    r = requests.get(f"{BASE_URL}/api/auth/me", headers=auth_headers, timeout=30)
    assert r.status_code == 200
    assert r.json()["email"] == ADMIN_EMAIL


def test_me_without_token():
    r = requests.get(f"{BASE_URL}/api/auth/me", timeout=30)
    assert r.status_code == 401


# ---- Quiz Submit ----
def _make_answers(elements):
    return [{"question_id": f"q{i+1}", "element": e} for i, e in enumerate(elements)]


def test_quiz_submit_success():
    elems = ["wood"] * 4 + ["fire"] * 3 + ["earth", "metal", "water"]
    payload = {
        "name": "TEST_User",
        "email": "test_user@example.com",
        "dob": "1990-05-15",
        "age": 34,
        "gender": "female",
        "location": "Bengaluru",
        "answers": _make_answers(elems),
    }
    r = requests.post(f"{BASE_URL}/api/quiz/submit", json=payload, timeout=30)
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["dominant_element"] == "wood"
    assert d["scores"] == {"wood": 4, "fire": 3, "earth": 1, "metal": 1, "water": 1}
    assert "id" in d and "created_at" in d
    assert d["email"] == "test_user@example.com"


def test_quiz_submit_invalid_element():
    payload = {
        "name": "TEST_User2",
        "email": "test_user2@example.com",
        "answers": [{"question_id": "q1", "element": "fake"}],
    }
    r = requests.post(f"{BASE_URL}/api/quiz/submit", json=payload, timeout=30)
    assert r.status_code == 400


def test_quiz_submit_no_auth_needed():
    # Just ensure no auth header passes
    payload = {
        "name": "TEST_NoAuth",
        "email": "test_noauth@example.com",
        "answers": _make_answers(["fire"] * 10),
    }
    r = requests.post(f"{BASE_URL}/api/quiz/submit", json=payload, timeout=30)
    assert r.status_code == 200
    assert r.json()["dominant_element"] == "fire"


# ---- Admin endpoints ----
def test_submissions_requires_auth():
    r = requests.get(f"{BASE_URL}/api/quiz/submissions", timeout=30)
    assert r.status_code == 401


def test_submissions_list(auth_headers):
    r = requests.get(f"{BASE_URL}/api/quiz/submissions", headers=auth_headers, timeout=30)
    assert r.status_code == 200
    docs = r.json()
    assert isinstance(docs, list)
    if len(docs) >= 2:
        # Sorted desc by created_at
        assert docs[0]["created_at"] >= docs[-1]["created_at"]
    # No _id leak
    for d in docs[:5]:
        assert "_id" not in d


def test_stats_requires_auth():
    r = requests.get(f"{BASE_URL}/api/quiz/stats", timeout=30)
    assert r.status_code == 401


def test_stats(auth_headers):
    r = requests.get(f"{BASE_URL}/api/quiz/stats", headers=auth_headers, timeout=30)
    assert r.status_code == 200
    d = r.json()
    assert "total" in d
    assert set(d["by_element"].keys()) == {"wood", "fire", "earth", "metal", "water"}
