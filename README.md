# Adlyft Backend API

A Node.js/Express microservice powering the Adlyft ad platform — connecting advertisers with publishers for targeted mobile and web advertising.

## Tech Stack

- **Node.js + Express** — REST API server
- **MongoDB + Mongoose** — database & ODM
- **Redis** — caching layer (with in-memory fallback if unavailable)
- **JWT** — authentication
- **Multer** — file uploads
- **bcryptjs** — password hashing
- **express-validator** — request validation

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, etc.
```

### 3. Seed the database (optional)
```bash
npm run seed
# Creates demo user: demo@adlyft.com / demo123
```

### 4. Start the server
```bash
npm run dev   # development with hot reload
npm start     # production
```

Server runs on `http://localhost:5000` by default.

---

## API Reference

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

| Group | Base Path | Auth |
|---|---|---|
| Auth | `/api/auth` | Mixed |
| Campaigns | `/api/campaigns` | ✓ |
| Publishers | `/api/publishers` | ✓ |
| Ad Slots | `/api/slots` | ✓ |
| Ads | `/api/ads` | ✓ |
| Serving | `/api/serve` | ✗ |
| Analytics | `/api/analytics` | ✓ |
| Billing | `/api/billing` | ✓ |
| Settings | `/api/settings` | ✓ |

## Demo Credentials (after `npm run seed`)

| Field | Value |
|---|---|
| Email | `demo@adlyft.com` |
| Password | `demo123` |
