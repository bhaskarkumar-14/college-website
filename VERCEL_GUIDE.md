# Frontend Deployment Guide (Vercel)

Now that your Backend is running on Render, we connect the Frontend to it using Vercel.

## ⚠️ Prerequisite: Update Configuration

1.  **Get Backend URL**: Copy the URL from Render (e.g., `https://pce-backend.onrender.com`).
2.  **Edit `vercel.json`**:
    *   Open `vercel.json` in your project.
    *   Find: `"destination": "https://YOUR_BACKEND_URL_ON_RENDER.onrender.com/api/:path*"`
    *   **Replace** `https://YOUR_BACKEND_URL_ON_RENDER.onrender.com` with your **actual** Render URL.
3.  **Push to GitHub**:
    ```bash
    git add vercel.json
    git commit -m "config: update backend url"
    git push
    ```

## 1. Create Vercel Project

1.  Log in to [vercel.com](https://vercel.com).
2.  Click **Add New...** -> **Project**.
3.  Import from **GitHub**.
4.  Find `purnea-college-website` (or whatever you named it) and click **Import**.

## 2. Configure Vercel

Leave most settings as default.

| Setting | Value |
| :--- | :--- |
| **Framework Preset** | `Vite` (Should detect automatically) |
| **Root Directory** | `./` (Default, leave empty) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

## 3. Deploy

1.  Click **Deploy**.
2.  Wait for the confetti! 🎉
3.  Click the screenshot to view your live website.

## 4. Test It

Try searching for a result on your new website. If it works, the Frontend and Backend are talking correctly!
