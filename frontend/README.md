# TraceTrail Frontend

Next.js 14 + TypeScript dashboard for TraceTrail's intelligence console.

## Requirements

- Node.js 20 LTS (use `nvm use 20` or `fnm use 20`)
- npm 10+

## Installation

```bash
npm install
```

## Useful scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start local dev server with fast refresh |
| `npm run build` | Production build (runs type-check + Next build) |
| `npm start` | Serve the production build |
| `npm run typecheck` | Strict TypeScript verification |
| `npm run lint` | ESLint with Next core web vitals config |
| `npm run test` | Jest + React Testing Library unit tests |
| `npm run test:e2e` | Playwright smoke tests (requires `npm run dev` in another terminal) |
| `npm run format` | Prettier format for TSX + CSS |
| `npm run check:bundle` | Build + bundle size inspection via `source-map-explorer` |

## Environment

- `NEXT_PUBLIC_API_URL` points to the backend API for live data.
- `PLAYWRIGHT_TEST_BASE_URL` overrides the default `http://127.0.0.1:3000` target for e2e runs.

## Deploy

```bash
npm run build
npm start
```

The app is fully static-export friendly for platforms such as Vercel, Netlify, or container-based deployments.

