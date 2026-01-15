# Deployment Guide for Purnea Engineering College Portal

This project is a **MERN Stack** application (MongoDB, Express, React, Node.js).
It consists of two parts:
1.  **Frontend**: React (Vite)
2.  **Backend**: Node.js (Express)

## 1. Environment Variables

### Backend (`/server/.env`)
Ensure you have these variables set in your production environment (e.g., Render, Railway, Heroku config vars):
```env
PORT=5000
MONGO_URI=your_production_mongodb_connection_string
JWT_SECRET=your_secure_random_secret_string
```

### Frontend
The frontend uses relative paths (`/api/...`) to talk to the backend. In production, you typically serve the frontend static files *from* the backend, or use a proxy rule if they are deployed separately.

## 2. Deploying to Vercel (Frontend) + Render (Backend) [Recommended]

### Step A: Deploy Backend (Render.com)
1.  Push your code to GitHub.
2.  Create a newly **Web Service** on Render.
3.  Connect your repository.
4.  **Root Directory**: `server`
5.  **Build Command**: `npm install`
6.  **Start Command**: `npm start`
7.  Add your Environment Variables (`MONGO_URI`, `JWT_SECRET`).
8.  **Important**: Copy the URL of your deployed backend (e.g., `https://pec-backend.onrender.com`).

### Step B: Deploy Frontend (Vercel)
1.  Import your repository on Vercel.
2.  **Root Directory**: `.` (default)
3.  **Build Command**: `npm run build`
4.  **Output Directory**: `dist`
5.  **Environment Variables**:
    *   If you are not serving the frontend from the backend, you simply need to configure a **rewrite** rules in `vercel.json` to proxy `/api` calls to your Render backend URL.

    *Create a `vercel.json` in the root:*
    ```json
    {
      "rewrites": [
        {
          "source": "/api/:path*",
          "destination": "https://pec-backend.onrender.com/api/:path*"
        }
      ]
    }
    ```

## 3. Alternative: Monolith Deployment (Railway/Heroku)

If you want to host both on a single server:
1.  Run `npm run build` in the root.
2.  Configure your Node.js server (`server/index.js`) to serve the static files from `../dist`.
    ```javascript
    // In server/index.js (before starting server)
    const path = require('path');
    app.use(express.static(path.join(__dirname, '../dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
    });
    ```
3.  Deploy the entire repo.
