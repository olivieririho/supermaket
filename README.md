# Supermarket POS System

Full-stack Point of Sale system for supermarket operations in Kicukiro District.

## Technologies
- Frontend: React.js + Vite
- Backend: Node.js + Express
- Database: MySQL

## Setup

### 1. Database
1. Create the database and tables using `backend/db.sql`.
2. Update `backend/.env` with your MySQL credentials.

### 2. Backend
```bash
cd backend
npm install
npm run start
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features
- User login/logout
- Product management
- Customer management
- Sales cart and checkout
- Automatic total calculation and stock adjustment
- Sales prevention when stock is insufficient
- Daily sales and revenue reporting

## Notes
- Default admin user is seeded in `backend/db.sql`.
- Use `http://localhost:3000` for the frontend and `http://localhost:5000` for the backend.
