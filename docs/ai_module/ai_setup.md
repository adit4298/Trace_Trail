# AI Module Setup

The AI module (located in `ai_module/`) houses the privacy risk, recommendation,
and anomaly detection engines. This guide explains how to run it locally as a
standalone FastAPI service or as a library consumed by the backend.

---

## 1. Create Virtual Environment

```bash
cd ai_module
python -m venv .venv
. .venv/bin/activate             # PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

`requirements.txt` includes FastAPI, scikit-learn, pandas, numpy, and utilities
used by notebooks.

---

## 2. Environment Variables

Create `ai_module/.env` (optional) with:

```
MODEL_CONFIG_PATH=config/model_config.json
DATASET_PATH=data/datasets/
AI_API_PORT=8100
LOG_LEVEL=INFO
```

The `config/model_config.json` file defines weights, thresholds, and algorithm
toggles used by models.

---

## 3. Running the API

```bash
uvicorn main:app --reload --port ${AI_API_PORT:-8100}
```

- OpenAPI docs available at `http://localhost:8100/docs`.
- Endpoints mirror those described in `docs/ai_module/recommendation_engine.md`.

---

## 4. Using as a Library

The backend can import shared utilities directly:

```python
from ai_module.models.risk_scorer import RiskScorer

scorer = RiskScorer(config_path="ai_module/config/model_config.json")
score = scorer.calculate(user_profile)
```

When vendoring code, pin the module version or treat it as a git submodule to
avoid drift.

---

## 5. Notebooks

- Located in `ai_module/notebooks/01_*`.
- Launch Jupyter inside the virtual environment:

```bash
pip install jupyterlab
jupyter lab
```

- Store outputs (plots, metrics) under `docs/ai_module/` or `ai_module/reports/`
  instead of committing large notebook outputs.

---

## 6. Testing

```bash
pytest
```

Tests live in `ai_module/tests/` and cover API routes, data generators, and
scorers. Keep fixtures lightweight by using sample datasets under
`data/datasets/`.

---

## 7. Deployment

- Containerize similarly to the backend or package as a Python wheel.
- Scale separately if recommendation workloads spike.
- Document API changes in `docs/ai_module/recommendation_engine.md` and notify
  backend team when new fields are introduced.


