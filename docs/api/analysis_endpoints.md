# Analysis Endpoints

Base path: `/analysis`

These endpoints orchestrate the risk engine and recommendation generator. All
routes require authentication (`Authorization: Bearer <token>`).

---

## POST `/analysis/run`

Trigger a full analysis and optionally persist recommendations.

### Request Body

```json
{
  "includeRecommendations": true,
  "context": {
    "platforms": ["facebook", "instagram"],
    "triggers": ["manual", "extension"]
  }
}
```

`AnalysisRequest` schema located in `backend/src/analysis/schemas.py`.

### Response

```json
{
  "status": "success",
  "data": {
    "overallScore": 78,
    "socialMediaRisk": 65,
    "dataExposureRisk": 54,
    "privacySettingsRisk": 82,
    "riskFactors": [
      {"name": "Public Instagram profile", "severity": "high"}
    ],
    "recommendations": [
      {
        "title": "Lock Instagram account",
        "priority": "high",
        "impactScore": 0.84
      }
    ],
    "analysisDate": "2025-11-28T11:43:00Z",
    "algorithmVersion": "1.0"
  }
}
```

---

## GET `/analysis/summary`

Returns the latest analysis snapshot for the authenticated user.

### Response

```json
{
  "status": "success",
  "data": {
    "currentScore": 78,
    "riskCategory": "Medium Risk",
    "keyRisks": ["Public Instagram profile"],
    "urgentRecommendations": ["Lock Instagram account"]
  }
}
```

---

## GET `/analysis/history`

Lists previous analyses (descending by date). Supports pagination via
`?page=1&pageSize=10`.

### Response

```json
{
  "status": "success",
  "data": [
    {
      "overallScore": 78,
      "analysisDate": "2025-11-28T11:43:00Z",
      "algorithmVersion": "1.0"
    },
    {
      "overallScore": 70,
      "analysisDate": "2025-10-15T09:12:00Z",
      "algorithmVersion": "0.9"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 2
    }
  }
}
```

---

## Errors

- `404 ANALYSIS_NOT_FOUND` — No analyses exist for the user.
- `400 ANALYSIS_IN_PROGRESS` — Optional when running asynchronous jobs.
- `500 ANALYSIS_ENGINE_FAILURE` — Unexpected error inside risk/recommendation
  engine; logs include `requestId` for tracing.


