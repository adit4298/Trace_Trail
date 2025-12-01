"""
High level orchestration layer for TraceTrail AI models.

The pipeline encapsulates feature extraction, scoring, recommendations, anomaly
signals, and trend analysis so the API layer can remain thin.
"""

from __future__ import annotations

from functools import cached_property
from pathlib import Path
from typing import Any, Dict, List, Optional

from ..config import Settings
from ..models import (
    AnomalyDetector,
    FeatureExtractor,
    Recommender,
    RiskScorer,
    TrendAnalyzer
)
from ..observability import record_anomaly_count, record_inference
from ..utils.helpers import load_json
from ..utils.logger import get_logger


class AIPipeline:
    """Aggregates TraceTrail's AI models behind a cohesive interface."""

    def __init__(self, settings: Settings):
        self.settings = settings
        self.logger = get_logger(
            __name__,
            level=settings.log_level,
            log_dir=settings.log_dir
        )

        config = self._load_model_config(settings.model_config_path)
        self._config = config

        risk_config = config.get("risk_scorer", {})
        self.risk_scorer = RiskScorer(
            model_type=risk_config.get("model_type", "rule_based"),
            feature_weights=risk_config.get("feature_weights"),
            thresholds=risk_config.get("thresholds"),
            model_checkpoint=risk_config.get("checkpoint_path")
        )

        recommender_cfg = config.get("recommender", {})
        self.recommender = Recommender(
            default_limit=recommender_cfg.get("max_recommendations", 5)
        )

        analyzer_cfg = config.get("trend_analyzer", {})
        self.trend_analyzer = TrendAnalyzer(
            min_data_points=analyzer_cfg.get("min_data_points", 2),
            prediction_windows=analyzer_cfg.get("prediction_window_days", [7, 30])
        )

        anomaly_cfg = config.get("anomaly_detector", {})
        self.anomaly_detector = AnomalyDetector(
            contamination=anomaly_cfg.get("contamination", 0.1),
            model_checkpoint=anomaly_cfg.get("checkpoint_path")
        )

        self.feature_extractor = FeatureExtractor()

    @staticmethod
    def _load_model_config(path: Path) -> Dict[str, Any]:
        try:
            return load_json(str(path))
        except FileNotFoundError:
            raise FileNotFoundError(
                f"Model configuration file not found at {path}. "
                "Ensure the ai_module/config/model_config.json file exists."
            )

    @cached_property
    def feature_names(self) -> List[str]:
        extractor_cfg = self._config.get("feature_extractor", {})
        return extractor_cfg.get("feature_names", [])

    def score_user(
        self,
        user_data: Dict[str, Any],
        connections: List[Dict[str, Any]],
        activities: Optional[List[Dict[str, Any]]] = None,
        history: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """Calculate risk score plus supporting analytics for a single user."""
        features = self.feature_extractor.extract_user_features(
            user_data=user_data,
            connections=connections,
            activities=activities
        )
        feature_vector = None
        if self.feature_names:
            feature_vector = self.feature_extractor.create_feature_vector(
                features=features,
                feature_names=self.feature_names
            ).tolist()

        risk_payload = self.risk_scorer.calculate_risk_score(
            user_data=user_data,
            connections=connections,
            activities=activities
        )
        record_inference("risk_scorer")

        anomaly_summary = self.anomaly_detector.detect_user_anomalies(
            user_data=user_data,
            connections=connections,
            historical_data=history
        )
        record_inference("anomaly_detector")
        record_anomaly_count(anomaly_summary.get("anomaly_count", 0))

        return {
            "overall_score": risk_payload["overall_score"],
            "category": risk_payload["category"],
            "breakdown": risk_payload["breakdown"],
            "top_risk_factors": risk_payload["recommendations"],
            "anomaly_summary": anomaly_summary,
            "feature_vector": feature_vector,
            "feature_snapshot": features
        }

    def recommend(
        self,
        *,
        risk_score: float,
        risk_breakdown: Dict[str, float],
        connections: List[Dict[str, Any]],
        max_recommendations: int
    ) -> List[Dict[str, Any]]:
        """Generate prioritized remediation steps."""
        record_inference("recommender")
        return self.recommender.generate_recommendations(
            risk_score=risk_score,
            risk_breakdown=risk_breakdown,
            connections=connections,
            max_recommendations=max_recommendations
        )

    def analyze_trends(self, score_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Run statistical analysis on an ordered list of score history."""
        trend = self.trend_analyzer.analyze_trend(score_history)
        record_inference("trend_analyzer")
        trend["velocity"] = self.trend_analyzer.calculate_velocity(score_history)
        trend["inflection_points"] = self.trend_analyzer.identify_inflection_points(
            score_history
        )
        return trend

