"""
Utility script to train and persist TraceTrail AI models using synthetic data.

Usage:
    python -m ai_module.scripts.train_models --output-dir models/checkpoints
"""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import List

import joblib
import numpy as np
from sklearn.ensemble import IsolationForest, RandomForestRegressor
from sklearn.model_selection import train_test_split

from ..data.data_generator import DataGenerator
from ..models.feature_extractor import FeatureExtractor
from ..models.risk_scorer import RiskScorer


def build_dataset(num_users: int) -> tuple[np.ndarray, np.ndarray]:
    """Generate synthetic feature matrix and labels."""
    generator = DataGenerator(seed=42)
    users = generator.generate_users(num_users)
    user_ids = [user["user_id"] for user in users]
    connections_df = generator.generate_social_connections(user_ids)
    connections_grouped: dict[int, List[dict]] = {
        user_id: connections_df[connections_df["user_id"] == user_id].to_dict("records")
        for user_id in user_ids
    }

    extractor = FeatureExtractor()
    baseline_scorer = RiskScorer(model_type="rule_based")

    feature_vectors: List[np.ndarray] = []
    targets: List[float] = []

    for user in users:
        user_connections = connections_grouped.get(user["user_id"], [])
        features = extractor.extract_user_features(user, user_connections)
        vector = extractor.create_feature_vector(
            features,
            feature_names=[
                "user_age",
                "account_age_days",
                "total_connections",
                "active_connections",
                "public_ratio",
                "friends_ratio",
                "private_ratio",
                "location_sharing_ratio",
                "contact_sharing_ratio",
                "avg_followers",
                "avg_posts",
                "avg_engagement"
            ]
        )
        feature_vectors.append(vector)

        score_payload = baseline_scorer.calculate_risk_score(
            user_data=user,
            connections=user_connections
        )
        targets.append(score_payload["overall_score"])

    return np.vstack(feature_vectors), np.array(targets)


def train_models(output_dir: Path, num_users: int = 300) -> None:
    """Train ML models and persist checkpoints."""
    output_dir.mkdir(parents=True, exist_ok=True)
    X, y = build_dataset(num_users)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    risk_model = RandomForestRegressor(
        n_estimators=400,
        max_depth=12,
        random_state=42,
        n_jobs=-1
    )
    risk_model.fit(X_train, y_train)
    joblib.dump(risk_model, output_dir / "risk_random_forest.pkl")

    anomaly_model = IsolationForest(
        n_estimators=300,
        contamination=0.12,
        random_state=42
    )
    anomaly_model.fit(X_train)
    joblib.dump(anomaly_model, output_dir / "anomaly_isolation_forest.pkl")

    print(f"Saved checkpoints to {output_dir}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train TraceTrail AI models.")
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("models/checkpoints"),
        help="Directory for joblib checkpoints"
    )
    parser.add_argument(
        "--samples",
        type=int,
        default=300,
        help="Number of synthetic users to generate"
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    train_models(args.output_dir, num_users=args.samples)


if __name__ == "__main__":
    main()

