# 🚀 Hosting your JobGuard Backend for Free (Render)

To make your Vercel app work, your Python backend needs to be live. **Render** is one of the best free options for FastAPI.

### 1. Push your code to GitHub
If you haven't already, push your entire project (including the `backend` folder) to a GitHub repository.

### 2. Create a "Web Service" on Render
1.  Go to [Render.com](https://render.com) and sign up with GitHub.
2.  Click **New +** → **Web Service**.
3.  Connect your GitHub repository.
4.  Configure the service:
    - **Name:** `jobguard-api`
    - **Root Directory:** `backend` (⚠️ Very important)
    - **Environment:** `Python 3`
    - **Build Command:** `pip install -r requirements.txt`
    - **Start Command:** `gunicorn -k uvicorn.workers.UvicornWorker main:app`
    - **Plan:** Free

### 3. Set Environment Variables
In the Render dashboard for your new service, go to **Environment** and add:
- `GROQ_API_KEY`: your-key-here
- `HF_API_KEY`: your-key-here
- `VT_API_KEY`: your-key-here
- `ALLOWED_ORIGINS`: `https://your-vercel-app.vercel.app` (The URL of your frontend site)

### 4. Update Vercel
Once Render finishes deploying (it takes 2-3 minutes), copy the "onrender.com" URL they give you.
1. Go to your **Vercel Dashboard** → **Settings** → **Environment Variables**.
2. Add/Update **`VITE_API_URL`** with your Render URL (e.g., `https://jobguard-api-xyz.onrender.com`).
3. **Re-deploy** your Vercel project by clicking "Redeploy" in the CLI or "Deploy" in the dashboard.

---

### Why Render?
- No credit card required.
- Automatically builds from your `requirements.txt`.
- FREE tier handles your Python 3 environment perfectly.

*Note: Free instances "spin down" after 15 minutes of inactivity. The very first request after a break might take 30-40 seconds to start.*
