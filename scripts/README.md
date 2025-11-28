# Trace Trail Scripts

Utility scripts that streamline common workflows (setup, testing, CI/CD,
deployment, database maintenance, and demo automation). Every script is written
with repository-relative paths so it can be invoked from anywhere inside the
Trace Trail project.

## Structure

| Folder        | Purpose                                                                 |
| ------------- | ----------------------------------------------------------------------- |
| `ci_cd/`      | Build/test helpers plus reusable GitHub Actions workflow snippets.      |
| `database/`   | Backup, restore, migrations, and deterministic seed data.               |
| `deployment/` | Opinionated deploy/rollback helpers for backend, frontend, and AI svc.  |
| `setup/`      | Developer onboarding scripts (deps, env prep, local DB bootstrap).      |
| `testing/`    | Aggregated test runners used locally and in pipelines.                  |
| `utilities/`  | Misc tools (health checks, demo data, cleanups).                        |

All shell scripts assume Bash with `set -euo pipefail`. Python helpers rely on
Python 3.11+ (matching `backend/` and `ai_module/`).

## Usage Tips

1. Export required environment variables before running (see `.env` in backend
   and `docs/deployment/environment_variables.md`).
2. Run scripts via `bash scripts/<path>.sh` (use Git Bash/WSL on Windows).
3. Scripts are idempotent when possible; re-running them should be safe.
4. Extend scripts instead of duplicating logic elsewhere—this folder acts as the
   single home for operational automation.
