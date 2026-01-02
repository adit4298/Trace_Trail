# Production Deployment Guide

This document describes the current production deployment architecture for TraceTrail on free platforms (Vercel + Render).

## Current Production Architecture

### Overview

TraceTrail is deployed using **free-tier platforms** that require no credit card:

- **Frontend**: [Vercel](https://vercel.com) - Next.js hosting
- **Backend**: [Render](https://render.com) - FastAPI web service
- **Database**: Render PostgreSQL (free tier)
- **Domain**: `tracetrail.in` (GoDaddy)

### URLs

- **Frontend**: `https://app.tracetrail.in`
- **Backend API**: `https://api.tracetrail.in`
- **API Docs**: `https://api.tracetrail.in/docs`
- **Health Check**: `https://api.tracetrail.in/health`

---

## Frontend Deployment (Vercel)

### Platform: Vercel

**Why Vercel?**
- Free tier with generous limits
- Automatic SSL certificates
- Global CDN
- Zero-config Next.js deployment
- No credit card required

### Deployment Steps

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Import repository

2. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

3. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://api.tracetrail.in
   ```

4. **Custom Domain**
   - Add `app.tracetrail.in` in Vercel dashboard
   - Configure DNS CNAME record in GoDaddy
   - SSL certificate provisions automatically

### Build Configuration

The frontend is configured to:
- Use dynamic rendering for pages that require API data
- Fall back to mock data during build time
- Handle API unavailability gracefully

---

## Backend Deployment (Render)

### Platform: Render

**Why Render?**
- Free tier web services
- Free PostgreSQL database
- Automatic SSL certificates
- No credit card required
- Simple deployment from GitHub

### Deployment Steps

1. **Create PostgreSQL Database**
   - Go to Render dashboard
   - Create new PostgreSQL database
   - Name: `tracetrail-db`
   - Plan: Free
   - Copy Internal Database URL

2. **Create Web Service**
   - Connect GitHub repository
   - Use `backend/render.yaml` (Blueprint) OR manual setup:
     - **Root Directory**: `backend`
     - **Environment**: Python 3
     - **Build Command**: `pip install --upgrade pip && pip install -r requirements/base.txt`
     - **Start Command**: `python -c "import os; import uvicorn; port = int(os.environ.get('PORT', 8000)); uvicorn.run('src.main:app', host='0.0.0.0', port=port)"`
     - **Health Check Path**: `/health`

3. **Environment Variables**
   ```
   ENVIRONMENT=production
   DEBUG=false
   SHOW_DOCS=true
   DATABASE_URL=<from PostgreSQL service - Internal Database URL>
   JWT_SECRET_KEY=<generate strong random string>
   ENCRYPTION_KEY=<generate strong random string>
   OAUTH_STATE_SECRET=<generate strong random string>
   CORS_ORIGINS=["https://app.tracetrail.in","http://localhost:5173","http://localhost:3000"]
   FRONTEND_OAUTH_CALLBACK_URL=https://app.tracetrail.in/oauth/callback
   GOOGLE_REDIRECT_URI=https://api.tracetrail.in/auth/google/callback
   INSTAGRAM_REDIRECT_URI=https://api.tracetrail.in/auth/instagram/callback
   FACEBOOK_REDIRECT_URI=https://api.tracetrail.in/auth/facebook/callback
   TWITTER_REDIRECT_URI=https://api.tracetrail.in/auth/twitter/callback
   ```

4. **Run Database Migrations**
   - Use Render Shell or Manual Deploy → Run Command:
   ```bash
   cd backend && alembic upgrade head
   ```

5. **Custom Domain**
   - Add `api.tracetrail.in` in Render dashboard
   - Configure DNS CNAME record in GoDaddy
   - SSL certificate provisions automatically

---

## DNS Configuration (GoDaddy)

### Records Required

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | `app` | `<vercel-cname-target>` | 600 |
| CNAME | `api` | `<render-cname-target>` | 600 |

### Steps

1. Log in to GoDaddy DNS management for `tracetrail.in`
2. Get CNAME targets from Vercel and Render dashboards
3. Add CNAME records as shown above
4. Wait 5-60 minutes for DNS propagation
5. SSL certificates provision automatically

---

## Free Tier Limitations

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

## Monitoring & Health Checks

### Health Endpoints

- **Backend**: `GET https://api.tracetrail.in/health`
  - Returns: `{"status":"healthy","timestamp":"...","version":"2.0.0","environment":"production"}`

### Verification Checklist

- [ ] Frontend loads: `https://app.tracetrail.in`
- [ ] Backend health check passes
- [ ] API docs accessible: `https://api.tracetrail.in/docs`
- [ ] No CORS errors in browser console
- [ ] OAuth flows work (if configured)

---

## Rollback Strategy

### Frontend (Vercel)
- Use Vercel dashboard to redeploy previous deployment
- All deployments are versioned automatically

### Backend (Render)
- Redeploy previous commit via Render dashboard
- Database migrations should be reversible (`alembic downgrade`)

---

## Security Considerations

- ✅ HTTPS enforced automatically (Vercel + Render)
- ✅ CORS restricted to production frontend URL
- ✅ Environment variables stored securely in platform dashboards
- ✅ Database uses Internal Database URL (not exposed externally)
- ⚠️ Free tier services may have rate limits

---

## Troubleshooting

### Common Issues

1. **Frontend can't connect to backend**
   - Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
   - Check CORS_ORIGINS includes `https://app.tracetrail.in`

2. **Backend service sleeping**
   - First request after inactivity may be slow (free tier limitation)
   - Consider upgrading to paid tier for always-on service

3. **Database connection fails**
   - Use Internal Database URL from Render (not External)
   - Verify database is running in Render dashboard

4. **DNS not resolving**
   - Wait 5-60 minutes for DNS propagation
   - Verify CNAME records are correct in GoDaddy

---

## Migration History

**Previous**: AWS EKS (Kubernetes) deployment
**Current**: Vercel + Render (free platforms)
**Migration Date**: 2025
**Reason**: AWS credits exhausted, need for free-tier solution

See `DEPLOYMENT_GUIDE.md` in project root for detailed migration steps.

---

## Related Documentation

- `../deployment_overview.md` - General deployment concepts
- `../frontend_deployment.md` - Frontend-specific details
- `../backend_deployment.md` - Backend-specific details
- `../../DEPLOYMENT_GUIDE.md` - Complete migration guide

