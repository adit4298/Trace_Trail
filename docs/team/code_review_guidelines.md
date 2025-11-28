# Code Review Guidelines

Effective reviews keep Trace Trail stable and maintainable. Use this checklist to
standardize expectations across squads.

---

## Reviewer Responsibilities

1. **Understand the context** — Read PR description, linked issues, and relevant
   docs updates before reviewing code.
2. **Assess correctness** — Ensure logic matches requirements, edge cases are
   handled, and contracts remain backward compatible.
3. **Consider impact** — Think about performance, security, privacy, and
   maintainability.
4. **Communicate clearly** — Offer actionable feedback, cite files/lines, and
   be respectful.

---

## Checklist

- Tests added/updated (`pytest`, `npm run test`, `ai_module/tests`).
- Linting/formatting passes.
- Docs updated (`docs/`, Postman collection).
- Feature flags or migration plans noted for risky changes.
- No secrets or large files committed.

---

## Comment Types

- **Nitpick** — Style/readability improvements; non-blocking.
- **Suggestion** — Provide alternative code snippet or approach.
- **Issue** — Blocking; must be resolved before merge.
- **Question** — Clarify assumptions to understand change.

---

## Time Expectations

- Respond to review requests within one business day.
- For large PRs (>500 LOC), request a pairing session or split the PR.

---

## Approvals

- Minimum of one reviewer per domain (backend/frontend/AI) impacted.
- DevOps changes require a platform engineer review.

---

## Tools

- Use GitHub review templates (see `.github/PULL_REQUEST_TEMPLATE.md` when
  available).
- Tag `@trace-trail/security` for sensitive code.
- Capture architectural decisions in `docs/architecture/` if design changes
  emerge during review.


