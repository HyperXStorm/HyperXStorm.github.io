# Aham Arogyam — TCM Five Element Personality Quiz

## Original Problem Statement
Build a quiz to identify a prospective customer's Five Element Personality Type according to TCM. Collect name, date of birth, age, gender, location, email. Make the quiz quick with a CTA to share and book appointment. Clinic name: "Aham Arogyam".

## User Choices
- Quick quiz: 10 questions, ~2 min
- Result: show on screen only (no email PDF)
- Book CTA: WhatsApp placeholder link (clinic to update)
- Admin dashboard: yes
- Default admin: admin@ahamarogyam.com / aham@2026
- Branding: elegant earthy/herbal palette (Cormorant Garamond + Manrope)

## Architecture
- **Backend**: FastAPI + MongoDB (motor). JWT auth (PyJWT + bcrypt). Admin seeded on startup.
- **Frontend**: React 19 + React Router 7 + Tailwind + Shadcn UI + sonner toasts + lucide-react icons + date-fns
- **Routing**: `/` landing, `/quiz` (3-stage state machine: lead → quiz → result), `/admin/login`, `/admin` (protected)

## User Personas
1. **Wellness-curious visitor** — lands on site, takes 2-min quiz, gets personalised element reading, shares with friends or books consult
2. **Clinic admin** — logs in to view all leads & element distribution stats

## Core Requirements (static)
- Lead capture: name, email, DOB (Shadcn Calendar), gender (Shadcn Select), location
- 10-question quiz, each maps to one of 5 elements (wood/fire/earth/metal/water)
- Dominant element computed by tally; result page is dynamically tinted by element color
- Share buttons: WhatsApp, Twitter, Copy
- Book appointment CTA → `https://wa.me/919999999999` placeholder
- Admin dashboard: stats cards + sortable submissions table

## What's Implemented (Feb 2026)
- ✅ Backend: JWT auth, admin seed, quiz submit/list/stats endpoints
- ✅ Frontend: Landing, multi-stage Quiz, Result with score distribution, Admin login + dashboard
- ✅ Brand identity: earthy palette, Cormorant Garamond × Manrope, glass header, grain texture
- ✅ Data-testids on all interactive elements
- ✅ E2E tested: backend 100% (11/11), frontend 95% (login error feedback added)

## Backlog (P0 → P2)
- **P1**: Replace WhatsApp placeholder URL with clinic's real number / Calendly
- **P1**: Email result PDF to user (requires Resend/SendGrid integration)
- **P2**: Rate-limit `/api/quiz/submit` (currently public, no throttle)
- **P2**: Migrate `@app.on_event` to FastAPI lifespan handler
- **P2**: Tighten CORS to explicit origin list
- **P2**: CSV export of submissions from admin dashboard
- **P3**: Multi-language support (Hindi, Tamil)
- **P3**: A/B test question ordering & dominance algorithm

## Next Tasks
1. Provide real WhatsApp/Calendly URL → update `BOOKING_URL` in `/app/frontend/src/pages/Quiz.jsx`
2. (Optional) Add Resend integration for emailing result summary
3. (Optional) Add CSV download button to admin dashboard
