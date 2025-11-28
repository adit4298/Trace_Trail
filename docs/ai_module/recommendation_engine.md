# Recommendation Engine

The recommendation engine translates risk insights into prioritized actions for
users. This doc explains the architecture shared between the AI module
(`ai_module/models/recommender.py`) and backend service (`backend/src/analysis/recommendation_engine.py`).

---

## Inputs

| Signal                    | Source                                           |
| ------------------------- | ------------------------------------------------ |
| Risk scores               | `RiskEngine.calculate_risks()` (overall + facets)|
| Risk factors (JSON)       | `risk_analyses.risk_factors`                     |
| Social connection metrics | `social_connections` table                       |
| Challenge progress        | `completed_challenges`                           |

---

## Scoring Workflow

1. **Feature extraction** — `FeatureExtractor` collects normalized metrics
   (exposure ratio, stale credentials, public visibility) and converts them into
   a vector.
2. **Template matching** — `RecommendationTemplates` map feature thresholds to
   candidate actions (e.g. "Rotate passwords" when exposure > 0.7).
3. **Prioritization** — Each candidate receives an `impactScore` and `priority`
   based on severity, effort, and historical effectiveness.
4. **Deduplication** — Remove duplicates using `(user_id, category, title)` keys.
5. **Persistence** — Backend stores final recommendations through
   `AnalysisRepository.add_recommendation`.

---

## Output Schema

```json
{
  "title": "Revoke third-party app access",
  "description": "Several apps still access your LinkedIn data...",
  "priority": "high",
  "category": "security",
  "impactScore": 0.82,
  "actions": [
    "Visit LinkedIn settings",
    "Review authorized apps",
    "Revoke unused integrations"
  ]
}
```

Frontend displays the payload via `RecommendationCard`.

---

## Extending Recommendations

1. Update templates in `ai_module/data/datasets/recommendation_templates.json`.
2. Modify `models/recommender.py` to consider new features or contexts.
3. Adjust backend `RecommendationEngine` when additional persistence fields are
   required.
4. Document new categories in `docs/frontend/component_documentation.md`.

---

## Evaluation

- Use `ai_module/tests/test_recommender.py` to cover new rules.
- Track metrics (precision@k, adoption rate) via `ai_module/utils/metrics.py`.
- Store experiment reports under `docs/ai_module/` or `ai_module/reports/`.


