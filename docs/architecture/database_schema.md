# Database Schema Overview

Trace Trail persists operational data in PostgreSQL via SQLAlchemy models
located under `backend/src/*/models.py`. This document summarizes the key
tables, relationships, and how they map to features.

---

## Core Tables

| Table             | Source Model                    | Description                                     |
| ----------------- | --------------------------------| ----------------------------------------------- |
| `users`           | `src.auth.models.User`          | Accounts, credentials, profile metadata         |
| `privacy_scores`  | `src.dashboard.models.PrivacyScore` | Historical KPI snapshots per user          |
| `social_connections` | `src.dashboard.models.SocialConnection` | Linked platforms + sync stats      |
| `risk_analyses`   | `src.analysis.models.RiskAnalysis` | Detailed risk breakdowns                        |
| `recommendations` | `src.analysis.models.Recommendation` | Actionable guidance items                     |
| `challenges`      | `src.challenges.models.Challenge` | Gamified tasks                                  |
| `completed_challenges` | `src.challenges.models.CompletedChallenge` | User progress records              |

Additional modules (reports, extension) store their own tables as features ship.

---

## Relationships

- `users` ←→ `social_connections` — one-to-many.
- `users` ←→ `privacy_scores` — one-to-many (score timeline).
- `users` ←→ `risk_analyses` — one-to-many (analysis history).
- `risk_analyses` ←→ `recommendations` — one-to-many with cascade deletes.
- `users` ←→ `completed_challenges` ←→ `challenges` — many-to-many via join table.

These are declared via SQLAlchemy `relationship()` definitions to enable eager
loading in repositories.

---

## Notable Columns

- `risk_analyses.risk_factors` — JSON blob storing structured factors (name,
  severity, context) to avoid rigid schema changes.
- `social_connections.data_exposure` — normalized float (0–1) used by the risk
  engine.
- `recommendations.priority` — enum-like string (`high`, `medium`, `low`)
  consumed by frontend badges.
- `completed_challenges.completed_at` — timestamp for leaderboard ordering.

---

## Migrations

- Managed via Alembic (`docs/backend/database_migrations.md`).
- Model imports must be registered in `src/core/database.py` so Alembic detects
  schema changes when autogenerating revisions.

---

## Future Considerations

- Introduce `reports` table for generated artifacts (status, download URL).
- Add `audit_logs` table to store user actions (viewed data, accepted
  recommendation) for compliance.
- Normalize enums (platform names, risk categories) using dedicated lookup
  tables once the list stabilizes.


