# CreatorVerse.AI

> AI-powered platform for unified influencer workflow management

A full-stack web application built for content creators — combining multi-platform analytics, brand deal CRM, team management, a freelancer marketplace, and an AI intelligence layer in a single workspace.

---

## Architecture Overview

```
creatorverse/
├── frontend/          # React + Vite + Tailwind SPA
│   └── src/
│       ├── pages/     # Dashboard, Analytics, CRM, Team, Marketplace, AI, Settings
│       ├── components/# Layout (sidebar, topbar), shared UI
│       ├── context/   # AuthContext (JWT)
│       └── services/  # api.js — all backend calls
│
├── backend/           # Node.js + Express REST API
│   ├── routes/        # auth, analytics, crm, team, marketplace, ai
│   ├── middleware/    # JWT auth, rate limiting, error handling
│   ├── config/        # MongoDB connection + in-memory dev store
│   └── server.js      # Entry point
│
└── docker-compose.yml # One-command local setup
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6, Zustand, React Query, Recharts |
| Backend | Node.js, Express 4, JWT auth, express-validator, express-rate-limit, Helmet |
| Database | MongoDB (Mongoose) + Redis (caching) |
| AI Layer | **Plug-in** — see `/backend/routes/ai.js` for the interface |
| DevOps | Docker, docker-compose |

---

## Quick Start

### Option A — Docker (Recommended)

```bash
# 1. Clone / unzip the project
cd creatorverse

# 2. Copy env template
cp backend/.env.example backend/.env

# 3. Start everything
docker-compose up --build
```

- Frontend → http://localhost:3000  
- Backend API → http://localhost:5000  
- API Health → http://localhost:5000/health

### Option B — Manual

**Prerequisites:** Node.js 18+, npm, MongoDB (optional — falls back to in-memory store)

```bash
# Backend
cd backend
npm install
cp .env.example .env          # edit as needed
npm run dev                   # starts on :5000

# Frontend (new terminal)
cd frontend
npm install
npm run dev                   # starts on :3000
```

---

## Demo Login

```
Email:    demo@creatorverse.ai
Password: demo1234
```

The demo account has pre-seeded deals, tasks, team members, and analytics data.

---

## API Reference

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/profile
POST   /api/auth/change-password

GET    /api/analytics/overview
GET    /api/analytics/engagement-trend?days=30
GET    /api/analytics/platform/:platform
GET    /api/analytics/top-content
POST   /api/analytics/connect

GET    /api/crm/deals
POST   /api/crm/deals
GET    /api/crm/deals/:id
PUT    /api/crm/deals/:id
DELETE /api/crm/deals/:id
GET    /api/crm/brands
GET    /api/crm/invoices
POST   /api/crm/invoices/:dealId

GET    /api/team/members
POST   /api/team/invite
PUT    /api/team/members/:id/role
DELETE /api/team/members/:id
GET    /api/team/tasks
POST   /api/team/tasks
PUT    /api/team/tasks/:id
PATCH  /api/team/tasks/:id/status
DELETE /api/team/tasks/:id

GET    /api/marketplace/freelancers
GET    /api/marketplace/freelancers/:id
GET    /api/marketplace/listings
POST   /api/marketplace/listings
POST   /api/marketplace/listings/:id/apply
POST   /api/marketplace/hire/:freelancerId

GET    /api/ai/recommendations
POST   /api/ai/forecast
GET    /api/ai/brand-matches
GET    /api/ai/content-suggestions
GET    /api/ai/posting-time
POST   /api/ai/chat
```

All protected routes require: `Authorization: Bearer <JWT>`

---

## Plugging In Your AI Model

The AI routes in `/backend/routes/ai.js` currently return deterministic mock data.  
**Replace the handler bodies** with calls to your trained models:

```js
// Example — POST /api/ai/forecast
const { XGBoostModel } = require('../ai/engagementModel');

router.post('/forecast', auth, async (req, res) => {
  const features = extractFeatures(req.body);          // your feature pipeline
  const prediction = await XGBoostModel.predict(features);
  res.json({ success: true, forecast: prediction });
});
```

Response shapes are stable — the frontend consumes them as-is.

---

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/creatorverse
JWT_SECRET=change_me_in_production
JWT_EXPIRES_IN=7d
YOUTUBE_API_KEY=...
INSTAGRAM_APP_ID=...
INSTAGRAM_APP_SECRET=...
STRIPE_SECRET_KEY=sk_test_...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
FRONTEND_URL=http://localhost:3000
```

---

## Security Features

- JWT authentication (15-min access tokens + refresh flow ready)
- Helmet for HTTP security headers
- CORS locked to frontend origin
- Rate limiting: 500 req/15min global, 20 req/15min auth
- Input validation via express-validator
- Password hashing with bcrypt (12 rounds)
- RBAC enforced server-side on every request

---

## Authors

- Rajat Bagh — LPU CSE
- Aman Yadav — LPU CSE
- Puneet (Supervisor) — LPU

*Research prototype — CreatorVerse.AI Conference Paper, 2026*
