<div align="center">

# TraceTrail AI Module

Privacy-risk analytics, anomaly detection, and recommendation services that power TraceTrail’s dashboard.

</div>

## What’s inside

- **FastAPI service** exposing `/api/ai/*` endpoints plus a `/metrics` Prometheus scrape target.
- **Inference pipeline** (`services/pipeline.py`) that orchestrates feature extraction, risk scoring, anomaly signals, recommendations, and trend projections with observability hooks.
- **Configurable models** wired through `config/model_config.json` and `.env` variables (see `config/settings.py` for the complete schema). ML checkpoints are loaded from `models/checkpoints/*.pkl` when present.
- **Synthetic data + notebooks** to explore features (`data/`, `notebooks/`).
- **Pytest suite** for API, instrumentation, and model smoke tests in `tests/`.
- **Training utilities** under `ai_module/scripts/` to regenerate ML checkpoints.

## Quick start

```bash
cd ai_module
python -m venv .venv && source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn ai_module.main:app --reload --host 0.0.0.0 --port 8082
```

Environment variables (all prefixed with `AI_`) can be added to `.env`. Useful ones:

| Variable | Default | Description |
| --- | --- | --- |
| `AI_ENVIRONMENT` | `local` | Controls logging + docs exposure. |
| `AI_API_HOST` / `AI_API_PORT` | `0.0.0.0` / `8082` | Network binding for FastAPI. |
| `AI_API_KEY` | *empty* | Optional header auth (`X-API-Key`). Leave unset for local dev. |
| `AI_MODEL_CONFIG_PATH` | `config/model_config.json` | Path to model weights + feature names. |
| `AI_LOG_LEVEL` | `INFO` | Logger threshold. |
| `AI_LOG_DIR` | `./logs` | Filesystem directory for log files. |

## Testing & linting

```bash
cd ai_module
pytest
```

The pytest suite hits the live FastAPI app using `TestClient`, asserts `/metrics` exposure, and checks the synthetic data utilities. Extend `tests/` as you add new services.

## Training ML checkpoints

```bash
cd ai_module
python -m ai_module.scripts.train_models --output-dir models/checkpoints --samples 500
```

The generated joblib files (`risk_random_forest.pkl`, `anomaly_isolation_forest.pkl`) are read automatically when referenced in `config/model_config.json`.

## Observability

- Latency + request counters recorded via Prometheus middleware.
- `/metrics` exposes scrape data for Prometheus/Grafana.
- Pipeline increases inference counters for each model and gauges the latest anomaly count.

## Project layout

```
api/          # FastAPI routers, dependencies, pydantic schemas
config/       # Pydantic settings + JSON model config
data/         # Generators, validators, and sample datasets
models/       # Risk scoring, recommenders, anomaly detector, trend analyzer
services/     # High-level pipeline orchestration
scripts/      # CLI utilities (model training, etc.)
observability/# Prometheus instrumentation helpers
utils/        # Logging, constants, helper functions
tests/        # pytest suites
```

Happy shipping! 🚀
