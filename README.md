# FestZone 2025 — College Fest Management System

A full-stack web application to manage college fest events, participant registrations, and volunteer management.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Material UI 5, Recharts, React Router v6 |
| Backend | Node.js, Express.js, JWT Auth, bcryptjs |
| Database | MySQL 8 with triggers & views |
| Fonts | Fraunces (serif display) + Instrument Sans |

---

## Quick Start

### 1. Database Setup
```sql
-- Run these in order in MySQL Workbench or CLI
source database/schema.sql
source database/triggers.sql
source database/views.sql
source database/seed.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env        # Fill in your DB credentials
npm install
npm run dev                  # Runs on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm start                    # Runs on http://localhost:3000
```

---

## Features

### Participant Flow
- Browse all events with category filtering
- View event details (date, venue, prize pool, capacity)
- Register as a **Participant** with confirmation
- Student dashboard with registered events list

### Volunteer Flow
- Apply to volunteer for any event from the event detail page
- Choose preferred role (Coordinator, Stage Management, Photography, etc.)
- Set availability (All 3 Days, Day 1 only, etc.)
- View volunteer shifts in dashboard

### Admin
- Dashboard with stats, bar chart, pie chart
- Events table with full details
- All registrations table
- All volunteer applications table
- Create new events

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@college.edu | admin123 |
| Student | aarav.sharma@college.edu | password123 |

> ⚠️ Seed data uses placeholder hashes. For production, re-hash passwords with bcrypt.

---

## Project Structure

```
festzone/
├── database/
│   ├── schema.sql          # 8 tables with FK constraints
│   ├── triggers.sql        # Over-registration prevention
│   ├── views.sql           # Reporting views
│   └── seed.sql            # 50+ sample records
├── backend/
│   ├── config/db.js        # MySQL connection pool
│   ├── controllers/        # Auth, Event, Registration, Volunteer, Sponsor, Analytics
│   ├── middleware/auth.js  # JWT + admin middleware
│   ├── routes/             # Express route handlers
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/     # Navbar, EventCard
    │   ├── context/        # AuthContext
    │   ├── pages/          # Landing, Events, EventDetail, Auth, Dashboard, Admin
    │   ├── services/api.js # Axios with interceptors
    │   └── App.js
    └── package.json
```

---

## Database Reference

- Detailed DB documentation: [database/README.md](database/README.md)

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | — | Register student |
| POST | /api/auth/login | — | Login |
| GET | /api/events | — | List all events |
| GET | /api/events/:id | — | Event detail |
| POST | /api/events | Admin | Create event |
| POST | /api/registrations | Student | Register as participant |
| GET | /api/registrations/my | Student | My registrations |
| GET | /api/registrations/all | Admin | All registrations |
| POST | /api/volunteers/apply-event | Student | Apply to volunteer |
| GET | /api/volunteers/my-assignments | Student | My volunteer shifts |
| GET | /api/volunteers/assignments/all | Admin | All volunteer applications |
| GET | /api/analytics/stats | Admin | Dashboard stats |

