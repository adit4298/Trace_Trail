# Demo Script — Trace Trail

Use this script for 10–12 minute walkthroughs. Customize data and personas as
needed.

---

## 0: Setup (0:00–0:30)

- Share screen with browser + terminal tabs ready.
- Ensure backend (`localhost:8000`) and frontend (`localhost:5173`) are running.

---

## 1: Introduction (0:30–1:30)

> “Trace Trail helps users understand their digital risk footprint and fix
> privacy issues before they become incidents.”

Key points:

- Multi-surface ingest (social connections, chrome extension, AI insights).
- Actionable recommendations with impact scoring.

---

## 2: Onboarding Flow (1:30–3:00)

1. Navigate to `/signup`.
2. Highlight password strength meter + validation (Zod).
3. After signup, show guided tour modals (if enabled) and emphasize accessible
   design.

---

## 3: Dashboard Deep Dive (3:00–6:00)

- Show overall risk score + trend (QuickStats).
- Expand `RiskScoreCard` animation to demonstrate immediate feedback.
- Scroll to recent activity feed; point out how backend aggregates analysis +
  challenge events.
- Demo platform breakdown chart (Recharts) and mention data source
  (`/visualizations/platform-breakdown`).

---

## 4: Recommendations & Challenges (6:00–8:00)

- Visit `/recommendations`; open a `RecommendationCard`.
- Explain impact/effort scoring derived from AI module.
- Complete a recommendation → toast notification via `NotificationContext`.
- Switch to `/challenges`, accept one, and show leaderboard update.

---

## 5: Reports & Extension (8:00–9:30)

- Open `/reports`, trigger “Generate new report”.
- Briefly mention Chrome extension streaming events over WebSockets when enabled.

---

## 6: Architecture Callout (9:30–10:30)

- Flash `docs/architecture/architecture_diagram.png` or talk track:
  frontend → FastAPI → PostgreSQL/AI module.
- Mention CI/CD, testing strategy, and how docs stay in sync.

---

## 7: Q&A (10:30–12:00)

- Prep answers regarding scalability, data security, roadmap (AI integration,
  SOC2).

End with CTA: “Get access by reaching out to privacy@tracetrail.com.”


