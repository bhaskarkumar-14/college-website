# Purnea Engineering College - Student & Faculty Portal

A modern, responsive web application for Purnea Engineering College, featuring student result checking, faculty dashboards, attendance management, and biometric access simulation.

## Features

-   **Public Portal**:
    -   Academic programs and admission info.
    -   Campus facilities and photo gallery.
-   **Student Services**:
    -   **Result Portal**: Search semester results by Roll Number.
    -   **Attendance Dashboard**: View subject-wise attendance and biometric logs.
-   **Faculty Dashboard**:
    -   Manage student lists.
    -   Update attendance (Present/Absent).
    -   Post announcements.
-   **Security**:
    -   JWT Authentication.
    -   Face ID Verification UI (Simulated).

## Tech Stack

-   **Frontend**: React, Vite, Framer Motion, Lucide Icons.
-   **Backend**: Node.js, Express.js.
-   **Database**: MongoDB.

## Getting Started

### 1. Installation

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 2. Running Locally

You need two terminals:

**Terminal 1 (Backend):**
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
# In the root project directory
npm run dev
# App runs on http://localhost:5173
```

### 3. Database Seeding

To populate the database with sample data (students, results, announcements):
```bash
cd server
node seeder.js
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to production.
