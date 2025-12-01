# Contributing Guide

Trace Trail is maintained by cross-functional squads. This document captures the
expectations for code contributions, documentation updates, and reviews.

---

## Branching & Workflow

1. Fork or branch off `main`.
2. Name branches using `<team>/<ticket>-<short-desc>` (e.g.
   `frontend/TT-142-dashboard-filters`).
3. Keep PRs scoped; avoid touching unrelated modules or reformatting untouched
   files.
4. Link issues in the PR description and summarize notable design decisions.

---

## Coding Standards

- **Backend:** Python 3.11, FastAPI, SQLAlchemy. Run `ruff` (if configured) and
  `pytest`. Respect typing hints and keep services/repositories focused.
- **Frontend:** React + TypeScript. Run `npm run lint` + `npm run test` (once
  enabled). Follow component folder boundaries and rely on hooks/contexts when
  sharing logic.
- **AI Module:** Keep notebooks reproducible; document datasets in
  `ai_module/data/README` before checking in. Run `pytest` in `ai_module/tests/`.
- Write or update docs in `docs/` when you add new endpoints, env vars, or
  workflows. No feature ships without documentation.

---

## Testing Expectations

| Layer      | Required actions                                                |
| ---------- | ----------------------------------------------------------------|
| Backend    | Add/extend unit tests under `backend/tests/`. Mock external APIs.|
| Frontend   | Component/unit tests (Vitest) for new hooks/components.         |
| AI Module  | Ensure datasets, metrics, and pipelines have regression tests.  |
| E2E        | Optional for now; when affected update the Postman collection.  |

---

## Commit Hygiene

- Keep commits atomic. Rebase before merging.
- Message format: `<type>(scope): <summary>` (e.g. `feat(analysis): add risk
  thresholds`).
- No direct commits to `main`. Use PRs and request reviews from at least one
  backend + one frontend/AI reviewer when cross-cutting changes occur.

---

## Documentation & Knowledge Sharing

- Update relevant markdown files in `docs/` whenever you:
  - Add a new endpoint.
  - Modify database schemas or migrations.
  - Introduce configuration flags.
  - Change deployment behavior.
- Record architectural decisions under `docs/architecture/`.
- Keep `docs/presentations/` slide decks in sync before demos.

---

## Code Review Checklist

Before approving, reviewers confirm:

1. Tests pass locally/CI.
2. Security concerns (PII, auth, rate limiting) are addressed.
3. Performance trade-offs acknowledged.
4. Documentation updated.
5. Rollback/feature flag plan exists for high-risk work.

---

## Communication

- Use the `#trace-trail-dev` Slack channel for quick questions.
- Weekly triage meetings review open PRs and docs debt.
- File RFCs in `docs/architecture/` for proposals that impact multiple squads.


