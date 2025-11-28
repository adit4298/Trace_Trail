# Frontend Component Reference

Trace Trail follows a feature-first component structure inside
`frontend/src/components/`. This document highlights the purpose of each folder
and the shared patterns you should follow when creating new UI blocks.

---

## Layout Components (`components/layout/`)

- `Layout.tsx` — Shell that wraps all routes. Provides navbar, sidebar, footer,
  and `<Outlet />` for nested routes.
- `Navbar.tsx` — Handles navigation, notification badges, and user avatar menu.
- `Sidebar.tsx` — Displays route links grouped by feature (Dashboard, Insights,
  etc.) and highlights the active path.
- `Footer.tsx` — Static CTAs + legal copy.

These components should remain presentation-focused. Business logic belongs in
contexts or hooks.

---

## Authentication (`components/auth/`)

- `LoginForm`, `SignupForm`, `ForgotPassword` — Controlled forms powered by
  `react-hook-form` + Zod validators defined in `src/utils/validators.ts`.
- `ProtectedRoute` — Wraps private routes inside `<Route element={...} />`. It
  checks `AuthContext` for a valid user/session and redirects to `/login`.

---

## Dashboard Widgets (`components/dashboard/`)

| Component            | Responsibility                                         |
| -------------------- | ------------------------------------------------------ |
| `QuickStats`         | Displays KPI cards (overall risk, exposure, challenges)|
| `RiskScoreCard`      | Visualizes aggregate score with thresholds             |
| `AnimatedCounter`    | Animates numbers when data changes                     |
| `RecentActivity`     | Lists timeline events from `/dashboard/activity`       |
| `ConnectionsOverview`| Summaries linked accounts + last sync status           |

Data flows from `DashboardContext` → widget props to keep components stateless.

---

## Insights & Visualizations (`components/insights/` + `components/recommendations/`)

- `HeatmapChart`, `TimelineChart`, `TrendAnalysis` leverage Recharts + custom
  D3-inspired helpers found in `src/utils/formatters.ts`.
- `RecommendationCard`, `ImpactIndicator`, `ActionButton` surface AI-driven
  recommendations along with urgency tags and quick actions.

Always wrap expensive chart components with `React.memo` to avoid unnecessary
re-renders during live polling.

---

## Challenges (`components/challenges/`)

- `ChallengeCard`, `BadgeDisplay`, `LeaderboardCard`, `ProgressBar` power the
  gamified experience. They consume data from `challengeService.ts`.
- Keep the components accessible (ARIA roles) and responsive by relying on the
  shared `Card` and `Button` primitives.

---

## Common Primitives (`components/common/`)

- `Button`, `Card`, `Modal`, `Toast`, `Tooltip`, `LoadingSpinner`,
  `ErrorBoundary`.
- These building blocks should be theme-aware (light/dark) via CSS variables and
  `ThemeContext`.
- Use composition: `Card.Header`, `Card.Body`, etc., to keep APIs declarative.

---

## Social & Settings (`components/social/`, `components/settings/`)

- Social components manage connection cards, sync status, and new account modal.
- Settings components (`ProfileEditor`, `SecuritySettings`, `NotificationPreferences`)
  read/write to `/users/*` endpoints via `userService` (coming soon) or
  `authService`.

---

## Adding New Components

1. Create a folder under `components/<feature>/` when the logic is tightly
   coupled to a route/feature.
2. Export from `index.ts` when siblings need to be consumed in multiple places.
3. Write stories/tests before shipping complex UI (Storybook TBD).
4. Document new props in this file or the relevant feature doc for quick lookup.


