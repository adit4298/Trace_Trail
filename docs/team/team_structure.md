# Team Structure

Trace Trail operates as a matrix organization with product-focused squads and
shared platform functions. Use this reference to understand touchpoints.

---

## Squads

| Squad            | Scope                                | Key Roles                     |
| ---------------- | ------------------------------------ | ----------------------------- |
| Experience       | Frontend, UX, Chrome extension       | FE engineers, Designer        |
| Intelligence     | AI module, analysis pipelines        | ML engineers, Data scientist  |
| Platform         | Backend services, APIs, integrations | Backend engineers, Tech lead  |
| Delivery         | DevOps, CI/CD, security              | Platform engineers, SRE       |


Each squad owns its backlog but coordinates quarterly planning together.

---

## Ritual Cadence

- **Daily standup** — 15 min per squad.
- **Weekly sync** — Cross-squad alignment meeting (PM + leads).
- **Bi-weekly retro** — Inspect & adapt, rotate facilitator.
- **Monthly architecture review** — Discuss upcoming changes, share RFCs.

---

## Communication Channels

- Slack
  - `#trace-trail-dev`
  - `#trace-trail-ai`
  - `#trace-trail-platform`
  - `#trace-trail-release`
- Notion/Confluence for product specs.
- GitHub Projects for roadmap tracking.

---

## Decision Making

- Small changes → squad autonomy.
- Cross-cutting/infra changes → propose RFC, review in architecture forum.
- Incident response → follow runbook in `docs/deployment/deployment_overview.md`.

---

## Escalation Path

1. Raise issue in squad channel.
2. Tag Tech Lead/PM if blocked >1 day.
3. Escalate to leadership via `#trace-trail-leadership` or weekly sync.


