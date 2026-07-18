# Render Deployment Guide

Follow these steps to deploy your backend.

## 1. Create Web Service
1.  Log in to [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository: `college-website`.

## 2. Configure Service
Fill in the form exactly as follows:

| Setting | Value | Note |
| :--- | :--- | :--- |
| **Name** | `pce-backend` | Or any name you like |
| **Region** | `Singapore` | Or closest to you |
| **Branch** | `main` | Default |
| **Root Directory** | `server` | **CRITICAL: This tells Render the app is in the server folder** |
| **Runtime** | `Node` | |
| **Build Command** | `npm install` | |
| **Start Command** | `npm start` | |
| **Instance Type** | `Free` | |

## 3. Environment Variables
Scroll down to the "Environment Variables" section and add these:

1.  **Key**: `MONGO_URI`
    *   **Value**: `mongodb+srv://...` (Your actual MongoDB connection string from `server/.env`)
2.  **Key**: `JWT_SECRET`
    *   **Value**: `some_random_secret_text`

## 4. Deploy
Click **Create Web Service**.

## 5. Get URL
Wait for the deployment to finish. You should see "Live" in green.
Copy the URL at the top (e.g., `https://pce-backend.onrender.com`).
**You will need this URL for the frontend deployment.**
