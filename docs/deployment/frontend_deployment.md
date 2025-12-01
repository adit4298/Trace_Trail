# Frontend Deployment Guide

Use this guide to build and deploy the React SPA contained in `frontend/`.

---

## 1. Build Artifacts

```bash
cd frontend
npm install
npm run build
```

Vite outputs assets to `frontend/dist/`. Files are ready for any static host.

---

## 2. Hosting Options

| Platform                | Notes                                                     |
| ---------------------- | --------------------------------------------------------- |
| AWS S3 + CloudFront    | Upload `dist/` to S3, enable compression + cache headers. |
| Azure Static Web Apps  | Connect repo, configure workflow to run `npm run build`.  |
| Netlify/Vercel         | Set build command `npm run build`, output directory `dist`.|
| Custom Nginx container | Serve `/dist` via Nginx, configure SPA fallback.          |

Ensure SPA fallback rewrites unknown routes to `index.html`.

---

## 3. Environment Variables

- At build time, set `VITE_API_BASE_URL` and other vars via platform settings.
- For static hosts, you must re-build when environment values change.

Example (Netlify):

```
VITE_API_BASE_URL=https://api.staging.tracetrail.com
```

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


