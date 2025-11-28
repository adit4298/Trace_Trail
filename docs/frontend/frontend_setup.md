# Frontend Setup Guide

This guide covers everything required to work on the Trace Trail SPA located in
`frontend/`. The stack uses Vite + React + TypeScript with Tailwind utilities.

---

## 1. Dependencies

- Node.js 20.x LTS
- npm 10+ (ships with Node 20)
- Recommended: VS Code with ESLint + Prettier extensions enabled

Install node modules:

```bash
cd frontend
npm install
```

---

## 2. Environment Variables

Create `frontend/.env` (copy from `.env.example` if present) and define:

```
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_BASE_URL=ws://localhost:8000
```

Add feature flags as needed (e.g. `VITE_ENABLE_MOCKS=true` during development).

---

## 3. Available Scripts

| Command          | Description                                              |
| ---------------- | -------------------------------------------------------- |
| `npm run dev`    | Starts Vite dev server with HMR on `localhost:5173`.     |
| `npm run build`  | Type-checks and outputs production assets to `dist/`.    |
| `npm run preview`| Serves the built assets locally for smoke testing.       |
| `npm run lint`   | Runs ESLint with TypeScript plugin.                      |
| `npm run format` | Formats `src/**/*.{ts,tsx,css}` via Prettier.            |

Ensure the backend is running at `VITE_API_BASE_URL` so API calls from
`src/services/*.ts` succeed.

---

## 4. Project Structure

```
src/
├── components/         # Feature-based component folders
├── pages/              # Route-level components
├── context/            # React Context providers (Auth, Dashboard, etc.)
├── hooks/              # Reusable hooks (useAuth, useFetch, useToast)
├── services/           # Axios wrappers for backend APIs
├── styles/             # Global CSS + variables
└── utils/              # Formatters, validators, helpers
```

Use absolute imports (configured via Vite/tsconfig) such as `@components/...`.

---

## 5. API Integration

- HTTP calls are centralized in `src/services/`. Each service aligns with a
  backend router (`analysisService.ts`, `challengeService.ts`, etc.).
- Axios base URL and interceptors are configured in `src/services/api.ts`.
- Authentication tokens are stored via `AuthContext` + `useAuth()` hook.

---

## 6. UI & Styling

- Tailwind + CSS variables (`src/styles/variables.css`) power most tokens.
- Component-level styles live in `globals.css` and `animations.css`.
- Motion/Charts rely on `framer-motion` and `recharts`.

---

## 7. Testing (Coming Soon)

- Add Vitest + React Testing Library under `tests/` or alongside components.
- Snapshot charts with Storybook or Chromatic when they are introduced.

---

## 8. Troubleshooting

- If absolute imports fail, run `npm run dev -- --host` after clearing Vite
  cache (`rm -rf node_modules/.vite`).
- If Tailwind classes do not apply, ensure `tailwind.config.js` includes the new
  paths under `content`.
- When API calls fail with 401, verify backend `.env` tokens and that
  `AuthContext` is reading the refreshed JWT.


