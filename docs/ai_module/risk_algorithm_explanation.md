# Risk Algorithm Explanation

This note walks through how Trace Trail calculates overall privacy risk scores.
Implementation references:

- Backend: `backend/src/analysis/risk_engine.py`
- AI Module: `ai_module/models/risk_scorer.py`, `models/anomaly_detector.py`

---

## Score Composition

Overall risk is a weighted aggregate of three pillars:

1. **Social Media Risk** — Exposure across connected platforms (public posts,
   followers, API permissions). Derived from `social_connections` metrics.
2. **Data Exposure Risk** — Detected leaks, reused credentials, third-party
   integrations.
3. **Privacy Settings Risk** — Whether profiles, contact info, and device
   settings align with best practices.

Each pillar outputs a 0–100 score; the final score is `Σ(weight_i * pillar_i)`
with weights defined in `config/model_config.json`.

---

## Feature Engineering

- Numerical features normalized using min-max scaling.
- Categorical features encoded via ordinal/one-hot mappings (e.g. platform
  categories, exposure tiers).
- Temporal signals (last sync, password rotation) converted into decay scores.

`FeatureExtractor` handles these transformations so both backend and AI module
stay in sync.

---

## Anomaly Detection

- `models/anomaly_detector.py` uses statistical thresholds or tree-based models
  to flag unusual spikes (e.g. sudden follower surge, new high-risk apps).
- Flags feed into risk factors JSON to provide human-readable justifications.

---

## Risk Factors Output

Example payload stored in `risk_analyses.risk_factors`:

```json
{
  "factors": [
    {"name": "Public Facebook profile", "severity": "high"},
    {"name": "Reused password detected", "severity": "medium"}
  ]
}
```

Frontend surfaces top 3 factors within the dashboard summary.

---

## Tuning & Calibration

- Update weights or thresholds in `config/model_config.json`.
- Re-run evaluation notebooks (`notebooks/03_model_testing.ipynb`) to compare
  before/after results.
- Track accuracy using metrics helpers in `ai_module/utils/metrics.py`.
- Version algorithm changes by bumping `RiskAnalysis.algorithm_version`.

---

## Future Enhancements

- Incorporate NLP signals from public posts (PII leakage detection).
- Add graph-based risk propagation between connections.
- Introduce user feedback loop to adjust recommendations based on completed
  actions.


