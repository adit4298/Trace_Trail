# Frontend State Management

Trace Trail prefers lightweight, context-driven state with targeted hooks over
global stores. This guide explains the existing contexts and how to extend them.

---

## Context Providers (`src/context/`)

| Context               | File                               | Responsibility                                  |
| --------------------- | ---------------------------------- | ----------------------------------------------- |
| `AuthContext`         | `context/AuthContext.tsx`          | Stores user session, tokens, and auth helpers   |
| `DashboardContext`    | `context/DashboardContext.tsx`     | Caches dashboard metrics + provides refresh APIs|
| `NotificationContext` | `context/NotificationContext.tsx`  | Global toast + banner queue                     |
| `ThemeContext`        | `context/ThemeContext.tsx`         | Light/dark mode & prefers-color-scheme binding  |

Each provider is mounted in `src/main.tsx` so hooks like `useAuth()` can assume
the context exists for every route.

---

## Custom Hooks (`src/hooks/`)

- `useAuth` — Wraps `AuthContext`, exposes login/logout/refresh, syncs tokens to
  `localStorage`.
- `useFetch` — Axios-powered data fetching with cancellation + loading states.
- `useToast` — Accessor for the notification queue.
- `useDebounce`, `useMediaQuery`, `useLocalStorage` — Utility hooks for UX.

When adding hooks:

1. Keep them pure and testable; no direct DOM manipulation.
2. Document expected inputs/outputs via TypeScript interfaces.
3. Co-locate tests with the hook or under `src/__tests__/`.

---

## Data Fetching Strategy

1. Create API wrappers in `src/services/` (one file per backend router).
2. Consume them inside route components or context providers, not deep within
   child components.
3. Cache high-value data (dashboard summaries) inside `DashboardContext`.
4. For realtime updates, leverage WebSockets when `EXTENSION_WEBSOCKET_ENABLED`
   is true; otherwise poll via `useEffect` + `setInterval`.

---

## Forms & Validation

- `react-hook-form` + `zodResolver` (see `SignupForm`, `LoginForm`).
- Shared validation schemas live in `src/utils/validators.ts`.
- Persist draft data to local storage when forms are long-lived (profile edit).

---

## When to Introduce a Store

Redux/Zustand are intentionally left out. Only introduce a heavier store if:

1. Multiple disconnected routes need to mutate the same data concurrently.
2. Context value churn causes noticeable performance hits.
3. Server state (SWR/React Query) becomes complex; consider `@tanstack/query`
   as a middle ground instead of reinventing caching logic.

Document any new state architecture decisions in `docs/frontend/state_management.md`.


