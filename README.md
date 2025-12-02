# Room Booking Platform

A simple yet production-oriented room booking platform built with:

- **Backend**: Node.js, TypeScript, Express
- **Database**: PostgreSQL (Docker), Prisma ORM
- **Auth**: JWT-based authentication
- **Architecture**: Stateless microservice-style backend with clear separation of concerns


---

## 1. High-Level Overview

The platform provides:

- User registration and login
- Room search with filters and availability by date range
- Room booking with conflict detection (no double booking)
- Data persistence in PostgreSQL via Prisma
- Seed script to quickly populate demo data (user, rooms, bookings)

For a detailed design and architecture decisions, see:

- [`SYSTEM-DESIGN.md`](./SYSTEM-DESIGN.md)

---

## 2. Project Structure

```text
room-booking-platform/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Express route handlers
│   │   ├── routes/          # Express routers
│   │   ├── services/        # Business logic (auth, rooms, bookings)
│   │   ├── middlewares/     # Auth, validation, logging
│   │   ├── types/           # TypeScript types and interfaces
│   │   ├── utils/           # Shared helpers (e.g. date overlap)
│   │   ├── lib/
│   │   │   └── prisma.ts    # Prisma client initialization
│   │   └── index.ts         # Express app entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Prisma schema & models
│   │   └── migrations/      # Database migrations
│   ├── src/scripts/
│   │   └── seed.ts          # Seed script for demo data
│   ├── package.json
│   └── .env                 # Backend environment variables
├── docker-compose.yml       # Postgres + Adminer
└── SYSTEM-DESIGN.md         # System design / architecture document
```
## 3. Prerequisites

- Node.js (LTS)

- Docker + Docker Compose

- npm

## 4. Running the Backend Locally
### 4.1 Start PostgreSQL + Adminer (DB UI)

From the project root: 

docker compose up -d


This will start:

- Postgres on localhost:5432

- Adminer (DB UI) on http://localhost:8080

- Postgres credentials are configured in docker-compose.yml and match the DATABASE_URL in the backend .env.

### 4.2 Configure backend environment

In backend/.env:

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/room_booking?schema=public"
PORT=4000
JWT_SECRET="dev-secret-change-in-prod"
BCRYPT_SALT_ROUNDS=10

### 4.3 Install dependencies
cd backend
npm install

### 4.4 Run migrations
npx prisma migrate dev


This will create the required tables:

- User

- Room

- Booking

### 4.5 (Optional but recommended) – Seed demo data
npm run seed


The seed script will:

Clear existing User, Room and Booking data

Create a demo user:

- email: demo@example.com

- password: demo1234

- Insert 3 sample rooms (Tel Aviv & Jerusalem)

- Create a confirmed booking for one of the rooms

### 4.6 Start the backend server
npm run dev


The API will be available at:

http://localhost:4000


A simple health check:

curl http://localhost:4000/api/health

## 8. Frontend (React)

The `frontend` folder contains a simple React + TypeScript client that demonstrates:

- Login / register against the backend
- Searching rooms by location, capacity and date range
- Creating bookings
- Viewing "My bookings"

### Run frontend locally

```bash
cd frontend
npm install
npm run dev
```
The app will be available at http://localhost:5173.
