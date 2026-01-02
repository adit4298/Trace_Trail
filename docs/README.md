# TraceTrail Documentation Hub

Welcome to the living documentation for the TraceTrail platform. This folder
collects product overviews, setup instructions, API contracts, deployment
runbooks, and presentation-ready material so every squad can stay aligned while
moving fast.

## 🚀 Current Deployment Status

**Production Environment:**
- **Frontend**: Deployed on [Vercel](https://vercel.com) at `https://app.tracetrail.in`
- **Backend**: Deployed on [Render](https://render.com) at `https://api.tracetrail.in`
- **Database**: Render PostgreSQL (free tier)
- **Domain**: `tracetrail.in` (GoDaddy)

**Migration Complete**: Successfully migrated from AWS to free platforms (no credit card required).

---

## 🤖 For AI Project Report Generation

**If you're feeding documentation to an AI for project reports, start here:**

1. **`AI_PROJECT_REPORT_GUIDE.md`** - Instructions for AI systems
2. **`AI_READING_LIST.md`** - Complete list of documents to read
3. **`COMPLETE_SYSTEM_OVERVIEW.md`** - Master system architecture document

**Core Documents for AI** (read in order):
- `COMPLETE_SYSTEM_OVERVIEW.md` - System architecture and data flows
- `PROJECT_STATUS.md` - Current status and deployment
- `FRONTEND_IMPLEMENTATION.md` - Frontend details
- `BACKEND_IMPLEMENTATION.md` - Backend details
- `API_SPECIFICATION.md` - API contracts
- `DATABASE_SCHEMA.md` - Database structure
- `INTEGRATION_GUIDE.md` - Component integration

All documents are designed to be AI-readable with clear structure, code examples, and comprehensive coverage.

## How to Navigate

- `getting_started.md` — fastest path to run the project locally.
- `overviewproject.md` — platform vision, personas, and feature flyover.
- `frontend/` & `backend/` — implementation notes that mirror the actual
  codebase (`frontend/src` and `backend/src`).
- `api/` — HTTP contract per service plus a ready-to-import Postman collection.
- `architecture/` — traceable decisions and diagrams for reviewers.
- `deployment/` — environment templates and rollout steps for each surface.
- `ai_module/` — documentation for the ML/Risk engine housed in `ai_module/`.
- `team/`, `user_guides/`, `presentations/` — operational collateral for demos
  and onboarding.

## Keeping Docs Accurate

1. Update documentation in the same PR as code changes; link commit hashes when
   you introduce new APIs, models, or workflows.
2. Prefer short lived, high-signal updates over long rewrites.
3. When unsure where a topic belongs, add a short note in `overviewproject.md`
   and open a follow-up issue so it is not lost.

## Suggested Reading Order

### For Project Reports (AI-Friendly)

1. **`COMPLETE_SYSTEM_OVERVIEW.md`** - ⭐ **START HERE** - Complete system architecture, data flows, and integration points
2. **`PROJECT_STATUS.md`** - Current project status, deployment info, and roadmap
3. **`FRONTEND_IMPLEMENTATION.md`** - Detailed frontend architecture and implementation
4. **`BACKEND_IMPLEMENTATION.md`** - Detailed backend architecture and implementation
5. **`API_SPECIFICATION.md`** - Complete API documentation with examples
6. **`DATABASE_SCHEMA.md`** - Database schema, relationships, and data flow

### For Development

1. `PROJECT_STATUS.md` - Current project status
2. `overviewproject.md` - Platform vision and feature overview
3. `getting_started.md` - Local development setup
4. `deployment/production_deployment.md` - Production deployment guide
5. `architecture/system_architecture.md` - System architecture details
6. Everything else that applies to your squad (AI, API, deployment, etc.)

> **Tip:** Every markdown file is referenced from the project root, so you can
> quickly open them from any IDE or docs portal without breaking links.


