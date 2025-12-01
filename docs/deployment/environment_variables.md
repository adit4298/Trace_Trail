# Environment Variables

This reference lists all environment variables used across Trace Trail services.
Keep values in sync between `.env` files (local) and managed secrets (remote).

---

## Backend (`backend/.env`)

| Variable                      | Description                                            | Example                                          |
| ----------------------------- | ------------------------------------------------------ | ------------------------------------------------ |
| `APP_NAME`                    | FastAPI title                                          | `TraceTrail API`                                 |
| `APP_VERSION`                 | Displayed in docs                                      | `1.0.0`                                          |
| `ENVIRONMENT`                 | `development` \| `staging` \| `production`             | `development`                                    |
| `DATABASE_URL`                | SQLAlchemy connection string                           | `postgresql+psycopg://user:pass@host:5432/db`    |
| `DB_ECHO`                     | Log SQL statements (`true`/`false`)                    | `false`                                          |
| `SECRET_KEY`                  | JWT signing secret                                     | `super-secret`                                   |
| `ALGORITHM`                   | JWT algorithm                                          | `HS256`                                          |
| `ACCESS_TOKEN_EXPIRE_MINUTES`| Access token TTL                                       | `30`                                             |
| `REFRESH_TOKEN_EXPIRE_DAYS`   | Refresh token TTL                                      | `30`                                             |
| `CORS_ORIGINS`                | Comma-separated allowed origins                        | `http://localhost:5173`                          |
| `SHOW_DOCS`                   | Toggle FastAPI docs                                    | `true`                                           |
| `HOST` / `PORT` / `RELOAD`    | Uvicorn server config                                  | `0.0.0.0` / `8000` / `true`                      |
| `SOCIAL_MEDIA_API_KEY`        | External API credential                                | `<key>`                                          |
| `EXTENSION_ENABLED`           | Feature flag for extension routes                      | `false`                                          |
| `EXTENSION_WEBSOCKET_ENABLED` | Enables `/ws/extension`                                | `false`                                          |
| `EXTENSION_API_VERSION`       | Version string                                         | `1.0`                                            |
| `EXTENSION_RATE_LIMIT`        | Requests per minute                                    | `100`                                            |

---

## Frontend (`frontend/.env`)

| Variable             | Description                         | Example                          |
| -------------------- | ----------------------------------- | -------------------------------- |
| `VITE_API_BASE_URL`  | REST API root                       | `http://localhost:8000`          |
| `VITE_WS_BASE_URL`   | WebSocket base                      | `ws://localhost:8000`            |
| `VITE_ENABLE_MOCKS`  | Toggle mock data (optional)         | `false`                          |
| `VITE_APP_VERSION`   | Display version badge (optional)    | `1.0.0`                          |

Add new `VITE_*` variables as needed; Vite automatically exposes them to
`import.meta.env`.

---

## AI Module (`ai_module/.env`)

| Variable            | Description                               | Example                          |
| ------------------- | ----------------------------------------- | -------------------------------- |
| `AI_API_PORT`       | Port for the standalone FastAPI service   | `8100`                           |
| `MODEL_CONFIG_PATH` | Path to JSON in `ai_module/config/`       | `config/model_config.json`       |
| `DATASET_PATH`      | Base directory for synthetic datasets     | `data/datasets/`                 |
| `LOG_LEVEL`         | Logging verbosity                         | `INFO`                           |

---

## Deployment Secrets

- Store sensitive values in secret managers (Key Vault, Secrets Manager, etc.).
- Rotate credentials quarterly and upon suspected compromise.
- Never commit `.env` files with real credentials.


