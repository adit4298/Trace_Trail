# Data Generation & Datasets

Trace Trail ships with synthetic datasets to bootstrap model training and
testing. Everything resides under `ai_module/data/`.

---

## Folder Structure

```
data/
├── datasets/
│   ├── challenge_templates.json
│   ├── platform_risk_profiles.json
│   ├── recommendation_templates.json
│   ├── sample_users.json
│   └── simulated_connections.csv
├── data_generator.py
├── preprocessor.py
└── validator.py
```

---

## Generating Data

`data_generator.py` can synthesize user profiles, connection graphs, and risk
factors:

```bash
python data/data_generator.py --output data/datasets/sample_users.json --count 500
```

Flags:

- `--platforms` to limit social networks.
- `--seed` for reproducibility.
- `--format` (`json` or `csv`).

---

## Validation Pipeline

1. Generate raw dataset.
2. Run `python data/validator.py --input <file>` to ensure schema compliance
   (required fields, ranges, enum values).
3. Use `preprocessor.py` to normalize/scale numeric features before feeding them
   into models (`min-max`, `z-score`, etc.).

---

## Dataset Contents

- `sample_users.json` — Synthetic user demographics + privacy behaviors.
- `platform_risk_profiles.json` — Baseline risk by platform (Facebook, LinkedIn,
  etc.).
- `challenge_templates.json` — Descriptions, difficulty, and reward points.
- `recommendation_templates.json` — Reusable remediation steps with impact
  scoring.
- `simulated_connections.csv` — Tabular representation of cross-platform
  networks for graph analyses.

---

## Best Practices

- Commit small datasets (<1 MB) to the repo; use object storage for larger corpora.
- Document generation parameters in PR descriptions for reproducibility.
- Version datasets when they influence production scoring (e.g. `v1`, `v2`).
- Never mix synthetic + real user data in the same file.


