# Frontend Deployment Guide

Use this guide to build and deploy the Next.js application contained in `frontend/`.

---

## 1. Build Artifacts

```bash
cd frontend
npm install
npm run build
```

Next.js outputs optimized production build to `.next/` directory. The build includes:
- Static pages (pre-rendered)
- Dynamic pages (server-rendered on demand)
- API routes (if any)
- Optimized assets (JS, CSS, images)

---

## 2. Hosting Options

| Platform                | Notes                                                     | Status        |
| ---------------------- | --------------------------------------------------------- | ------------- |
| **Vercel**             | Zero-config Next.js deployment, automatic SSL, CDN.       | ✅ **Current** |
| Netlify                | Next.js support, set build command `npm run build`.       | Available     |
| AWS Amplify            | Next.js hosting with CI/CD integration.                   | Available     |
| Custom Node.js server  | Run `npm start` to serve Next.js production server.      | Available     |

**Current Production**: Deployed on Vercel at `https://app.tracetrail.in`

Vercel automatically:
- Detects Next.js framework
- Builds on every push to `main`
- Provisions SSL certificates
- Handles routing and API routes
- Optimizes assets and caching

---

## 3. Environment Variables

- At build time, set `NEXT_PUBLIC_*` variables via platform settings.
- These are embedded in the client bundle at build time.
- Server-side variables (without `NEXT_PUBLIC_`) are only available in API routes.

**Current Production (Vercel)**:
```
NEXT_PUBLIC_API_URL=https://api.tracetrail.in
```

**Local Development** (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Important**: 
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Never put secrets in `NEXT_PUBLIC_` variables
- Rebuild required when `NEXT_PUBLIC_` variables change

---

## 4. CDN & Caching

- Enable gzip/brotli compression.
- Cache JS/CSS assets aggressively (hash-based filenames). Keep `index.html`
  cache short (≤5 minutes) to pick up fresh bundles.
- Configure HTTP security headers (CSP, HSTS, Referrer-Policy).

---

## 5. Deployment Verification

1. Load `/` to confirm bundle loads without console errors.
2. Login flow should reach backend environment.
3. Protected routes redirect appropriately when unauthenticated.
4. Lighthouse score ≥90 for Performance/Accessibility.

---

## 6. Rollback

- Keep previous artifact versioned (S3 object versions, Netlify deploy history).
- Re-deploy prior version if issues arise while backend remains unchanged.

---

## 7. Automation

- Use CI (GitHub Actions) to:
  1. Install dependencies.
  2. Run `npm run lint`.
  3. Build artifacts.
  4. Upload to storage/CDN.
- Sample workflow stored in `deployment/github-actions/frontend.yml` (add if not
  present yet).


