# Dashboard Endpoints

Base path: `/dashboard`

Provide data for the main dashboard widgets. All endpoints require an access
token.

---

## GET `/dashboard/summary`

Returns KPI cards (overall score, exposure, completed challenges, trends).

### Response

```json
{
  "status": "success",
  "data": {
    "overallScore": 78,
    "trend": "+4",
    "completedChallenges": 3,
    "connections": 5
  }
}
```

---

## GET `/dashboard/activity`

Recent privacy events (new recommendations, completed challenges, alerts).

### Query Params

- `page`, `pageSize` (optional)

### Response

```json
{
  "status": "success",
  "data": [
    {
      "type": "recommendation_completed",
      "message": "Revoked 2 risky apps",
      "timestamp": "2025-11-28T10:01:00Z"
    }
  ]
}
```

---

## GET `/dashboard/insights`

Aggregated datasets for charts (risk trend, platform breakdown, exposure heatmap).

```json
{
  "status": "success",
  "data": {
    "riskTrend": [
      {"date": "2025-11-21", "score": 70},
      {"date": "2025-11-28", "score": 78}
    ],
    "platformBreakdown": [
      {"platform": "linkedin", "risk": 0.42}
    ],
    "exposureHeatmap": [...]
  }
}
```

---

## Caching & Freshness

- Data is cached per user in `DashboardContext` (frontend) and may be cached on
  the backend to avoid recomputing metrics.
- Force refresh via query parameter `?force=true` (planned) or by running a new
  analysis.

---

## Error Codes

- `404 DASHBOARD_NOT_READY` — User has not completed initial analysis.
- `500 DASHBOARD_AGGREGATION_FAILED` — Upstream services failed; check logs with
  returned `requestId`.


