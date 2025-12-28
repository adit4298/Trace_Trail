# TraceTrail Migration to Free Platforms - Complete Deployment Guide

## Overview

This guide covers the complete migration from AWS to free platforms:
- **Frontend**: Vercel (Next.js)
- **Backend**: Render (FastAPI)
- **Database**: Render PostgreSQL (free tier)

---

## PART 1: FRONTEND DEPLOYMENT (Vercel)

### Prerequisites
- GitHub account
- Vercel account (free tier, no credit card required)

### Step 1: Prepare Repository
1. Ensure all changes are committed and pushed to GitHub
2. The frontend is already configured to use `NEXT_PUBLIC_API_URL`

### Step 2: Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

#### Option B: Via Vercel CLI
```bash
npm install -g vercel
cd frontend
vercel login
vercel --prod
```

### Step 3: Configure Environment Variables in Vercel

Go to **Project Settings → Environment Variables** and add:

```
NEXT_PUBLIC_API_URL=https://api.tracetrail.in
```

**Important**: 
- Use the exact name `NEXT_PUBLIC_API_URL`
- Value must be `https://api.tracetrail.in` (no trailing slash)
- Apply to **Production**, **Preview**, and **Development** environments

### Step 4: Custom Domain Setup (app.tracetrail.in)

1. In Vercel dashboard, go to **Settings → Domains**
2. Add domain: `app.tracetrail.in`
3. Follow DNS instructions (see Part 3 below)
4. Vercel will automatically provision SSL certificate

---

## PART 2: BACKEND DEPLOYMENT (Render)

### Prerequisites
- GitHub account
- Render account (free tier, no credit card required)

### Step 1: Prepare Repository
1. Ensure `backend/render.yaml` exists (already created)
2. Ensure `backend/Dockerfile` is updated (already done)
3. Commit and push to GitHub

### Step 2: Create PostgreSQL Database on Render

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `tracetrail-db`
   - **Database**: `trace_trail`
   - **User**: `tracetrail_user`
   - **Region**: Choose closest to you
   - **Plan**: **Free** (no credit card required)
4. Click **"Create Database"**
5. **IMPORTANT**: Wait for database to be ready, then:
   - Copy the **Internal Database URL** (starts with `postgresql://`)
   - This will be used in the web service

### Step 3: Deploy Web Service on Render

#### Option A: Using render.yaml (Recommended)
1. Go to **Dashboard** → **"New +"** → **"Blueprint"**
2. Connect your GitHub repository
3. Render will detect `backend/render.yaml`
4. Review configuration and click **"Apply"**

#### Option B: Manual Setup
1. Go to **Dashboard** → **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `tracetrail-api`
   - **Region**: Same as database
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install --upgrade pip && pip install -r requirements/base.txt`
   - **Start Command**: `python -c "import os; import uvicorn; port = int(os.environ.get('PORT', 8000)); uvicorn.run('src.main:app', host='0.0.0.0', port=port)"`
   - **Health Check Path**: `/health`

### Step 4: Configure Environment Variables in Render

Go to **Environment** tab and add:

#### Required Variables:
```
ENVIRONMENT=production
DEBUG=false
SHOW_DOCS=true
DATABASE_URL=<from PostgreSQL service - Internal Database URL>
JWT_SECRET_KEY=<generate a strong random string>
ENCRYPTION_KEY=<generate a strong random string>
OAUTH_STATE_SECRET=<generate a strong random string>
```

#### CORS & OAuth Variables:
```
CORS_ORIGINS=["https://app.tracetrail.in","http://localhost:5173","http://localhost:3000"]
FRONTEND_OAUTH_CALLBACK_URL=https://app.tracetrail.in/oauth/callback
GOOGLE_REDIRECT_URI=https://api.tracetrail.in/auth/google/callback
INSTAGRAM_REDIRECT_URI=https://api.tracetrail.in/auth/instagram/callback
FACEBOOK_REDIRECT_URI=https://api.tracetrail.in/auth/facebook/callback
TWITTER_REDIRECT_URI=https://api.tracetrail.in/auth/twitter/callback
```

#### OAuth Client Credentials (if using OAuth):
```
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
INSTAGRAM_CLIENT_ID=<your-instagram-client-id>
INSTAGRAM_CLIENT_SECRET=<your-instagram-client-secret>
FACEBOOK_CLIENT_ID=<your-facebook-client-id>
FACEBOOK_CLIENT_SECRET=<your-facebook-client-secret>
TWITTER_CLIENT_ID=<your-twitter-client-id>
TWITTER_CLIENT_SECRET=<your-twitter-client-secret>
```

**Note**: For `CORS_ORIGINS`, use the exact JSON array format shown above.

### Step 5: Run Database Migrations

After the service is deployed:

1. Go to **Shell** tab in Render dashboard
2. Run:
```bash
cd backend
alembic upgrade head
```

Or use Render's **Manual Deploy** → **Run Command**:
```bash
cd backend && alembic upgrade head
```

### Step 6: Custom Domain Setup (api.tracetrail.in)

1. In Render dashboard, go to **Settings** → **Custom Domains**
2. Add custom domain: `api.tracetrail.in`
3. Follow DNS instructions (see Part 3 below)
4. Render will automatically provision SSL certificate

---

## PART 3: DNS CONFIGURATION (GoDaddy)

### Prerequisites
- Access to GoDaddy DNS management for `tracetrail.in`

### DNS Records to Add

Log in to GoDaddy and go to **DNS Management** for `tracetrail.in`.

#### For Frontend (app.tracetrail.in → Vercel)

1. **Get Vercel DNS Target**:
   - In Vercel dashboard → **Settings → Domains**
   - Find `app.tracetrail.in`
   - Copy the **CNAME target** (e.g., `cname.vercel-dns.com`)

2. **Add CNAME Record in GoDaddy**:
   - **Type**: `CNAME`
   - **Host**: `app`
   - **Value**: `<vercel-cname-target>` (from step 1)
   - **TTL**: `600` (or default)

#### For Backend (api.tracetrail.in → Render)

1. **Get Render DNS Target**:
   - In Render dashboard → **Settings → Custom Domains**
   - Find `api.tracetrail.in`
   - Copy the **CNAME target** (e.g., `tracetrail-api.onrender.com`)

2. **Add CNAME Record in GoDaddy**:
   - **Type**: `CNAME`
   - **Host**: `api`
   - **Value**: `<render-cname-target>` (from step 1)
   - **TTL**: `600` (or default)

### DNS Propagation

- DNS changes typically propagate in **5-60 minutes**
- Use [whatsmydns.net](https://www.whatsmydns.net) to check propagation
- Both Vercel and Render will provision SSL certificates automatically once DNS is verified

---

## PART 4: POST-DEPLOYMENT VERIFICATION

### 1. Health Check
- Frontend: Visit `https://app.tracetrail.in`
- Backend: Visit `https://api.tracetrail.in/health`
  - Should return: `{"status":"healthy","timestamp":"...","version":"2.0.0","environment":"production"}`

### 2. API Connection
- Open browser console on `https://app.tracetrail.in`
- Check for API calls to `https://api.tracetrail.in`
- Verify no CORS errors

### 3. OAuth Flow (if configured)
- Test OAuth login flow
- Verify redirects work correctly

---

## PART 5: ENVIRONMENT VARIABLES SUMMARY

### Vercel Environment Variables

```
NEXT_PUBLIC_API_URL=https://api.tracetrail.in
```

### Render Environment Variables

#### Core Settings:
```
ENVIRONMENT=production
DEBUG=false
SHOW_DOCS=true
DATABASE_URL=<from PostgreSQL service>
JWT_SECRET_KEY=<strong-random-string>
ENCRYPTION_KEY=<strong-random-string>
OAUTH_STATE_SECRET=<strong-random-string>
```

#### CORS & Frontend:
```
CORS_ORIGINS=["https://app.tracetrail.in","http://localhost:5173","http://localhost:3000"]
FRONTEND_OAUTH_CALLBACK_URL=https://app.tracetrail.in/oauth/callback
```

#### OAuth Redirect URIs:
```
GOOGLE_REDIRECT_URI=https://api.tracetrail.in/auth/google/callback
INSTAGRAM_REDIRECT_URI=https://api.tracetrail.in/auth/instagram/callback
FACEBOOK_REDIRECT_URI=https://api.tracetrail.in/auth/facebook/callback
TWITTER_REDIRECT_URI=https://api.tracetrail.in/auth/twitter/callback
```

#### OAuth Client Credentials (optional):
```
GOOGLE_CLIENT_ID=<your-id>
GOOGLE_CLIENT_SECRET=<your-secret>
INSTAGRAM_CLIENT_ID=<your-id>
INSTAGRAM_CLIENT_SECRET=<your-secret>
FACEBOOK_CLIENT_ID=<your-id>
FACEBOOK_CLIENT_SECRET=<your-secret>
TWITTER_CLIENT_ID=<your-id>
TWITTER_CLIENT_SECRET=<your-secret>
```

---

## PART 6: COMMON ISSUES & TROUBLESHOOTING

### Issue: Frontend can't connect to backend
**Solution**:
- Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Check CORS_ORIGINS includes `https://app.tracetrail.in`
- Verify backend is running (check Render logs)

### Issue: CORS errors in browser
**Solution**:
- Ensure `CORS_ORIGINS` in Render includes the exact frontend URL
- Use JSON array format: `["https://app.tracetrail.in","http://localhost:5173"]`
- Restart Render service after changing CORS_ORIGINS

### Issue: Database connection fails
**Solution**:
- Use **Internal Database URL** from Render PostgreSQL service
- Verify `DATABASE_URL` is set correctly
- Check database is running (Render dashboard)

### Issue: OAuth redirects fail
**Solution**:
- Verify all OAuth redirect URIs use `https://api.tracetrail.in`
- Update OAuth app settings in provider dashboards (Google, Facebook, etc.)
- Ensure `FRONTEND_OAUTH_CALLBACK_URL` is `https://app.tracetrail.in/oauth/callback`

### Issue: Build fails on Render
**Solution**:
- Check Render build logs for specific errors
- Verify `requirements/base.txt` is correct
- Ensure Python 3.11 is available (Render auto-detects)

### Issue: Health check fails
**Solution**:
- Verify `/health` endpoint exists (already implemented)
- Check Render service logs
- Ensure service is running (not sleeping - free tier sleeps after inactivity)

---

## PART 7: FREE TIER LIMITATIONS

### Vercel Free Tier
- ✅ Unlimited deployments
- ✅ Automatic SSL
- ✅ Custom domains
- ⚠️ Build time limits (usually sufficient)
- ⚠️ Bandwidth limits (generous for demos)

### Render Free Tier
- ✅ Web services (sleeps after 15 min inactivity)
- ✅ PostgreSQL database (90-day retention, 1GB storage)
- ✅ Automatic SSL
- ✅ Custom domains
- ⚠️ Services spin down after inactivity (first request may be slow)
- ⚠️ Database backups: Manual only on free tier

**Note**: For production demos, consider upgrading to paid tiers for:
- No sleep on web services
- Automatic database backups
- Better performance

---

## PART 8: DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All code committed and pushed to GitHub
- [ ] Frontend builds successfully (`npm run build` in `frontend/`)
- [ ] Backend requirements are up to date
- [ ] Database migrations are ready

### Vercel Deployment
- [ ] Repository connected to Vercel
- [ ] Root directory set to `frontend`
- [ ] `NEXT_PUBLIC_API_URL` environment variable set
- [ ] Custom domain `app.tracetrail.in` added
- [ ] DNS CNAME record added in GoDaddy
- [ ] SSL certificate provisioned (automatic)

### Render Deployment
- [ ] PostgreSQL database created
- [ ] Web service created and connected to GitHub
- [ ] All environment variables set
- [ ] Database migrations run (`alembic upgrade head`)
- [ ] Custom domain `api.tracetrail.in` added
- [ ] DNS CNAME record added in GoDaddy
- [ ] SSL certificate provisioned (automatic)

### Post-Deployment
- [ ] Health check passes: `https://api.tracetrail.in/health`
- [ ] Frontend loads: `https://app.tracetrail.in`
- [ ] API calls work from frontend
- [ ] No CORS errors in browser console
- [ ] OAuth flows work (if configured)
- [ ] Database connections work

---

## SUPPORT & RESOURCES

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **GoDaddy DNS Help**: https://www.godaddy.com/help

---

## MODIFIED FILES SUMMARY

### Backend Changes:
1. `backend/Dockerfile` - Updated CMD to use PORT env var
2. `backend/src/app/core/config.py` - Updated OAuth redirect URIs and CORS
3. `backend/render.yaml` - Created Render deployment configuration

### Frontend Changes:
- No code changes required (already uses `NEXT_PUBLIC_API_URL`)
- Only environment variable configuration needed

### Documentation:
- `DEPLOYMENT_GUIDE.md` - This file

---

**Migration Complete!** 🎉

Your TraceTrail application is now running on free platforms with no AWS dependencies.

