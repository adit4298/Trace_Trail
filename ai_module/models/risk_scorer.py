import logging
from pathlib import Path
from typing import Dict, Any, List, Optional

import joblib
import numpy as np
from sklearn.ensemble import RandomForestRegressor

logger = logging.getLogger(__name__)

class RiskScorer:
    """
    Calculate privacy risk scores for users based on their social media activity.

    Risk Score Range: 0-100
    - 0–40: Low Risk
    - 41–70: Medium Risk
    - 71–100: High Risk
    """

    FEATURE_WEIGHTS = {
        'privacy_setting': 0.30,
        'post_frequency': 0.25,
        'personal_info_exposure': 0.25,
        'third_party_apps': 0.20
    }

    def __init__(
        self,
        model_type: str = 'rule_based',
        feature_weights: Optional[Dict[str, float]] = None,
        thresholds: Optional[Dict[str, float]] = None,
        model_checkpoint: Optional[str] = None
    ):
        self.model_type = model_type
        self.model = None
        self.is_trained = False
        self.feature_weights = self._normalize_feature_weights(
            feature_weights or self.FEATURE_WEIGHTS
        )
        threshold_config = thresholds or {'low': 40, 'high': 70}
        self.threshold_low = threshold_config.get('low', 40)
        self.threshold_high = threshold_config.get('high', 70)
        if model_type == 'ml':
            if model_checkpoint:
                checkpoint_path = Path(model_checkpoint)
                if checkpoint_path.exists():
                    self.model = joblib.load(checkpoint_path)
                    self.is_trained = True
                    logger.info("Loaded trained risk scorer from %s", checkpoint_path)
                else:
                    logger.warning("Checkpoint %s not found, falling back to fresh model", checkpoint_path)
            if self.model is None:
                self.model = RandomForestRegressor(n_estimators=200, random_state=42)
        logger.info(
            "RiskScorer initialized model_type=%s thresholds=%s",
            model_type,
            threshold_config
        )

    def calculate_risk_score(
        self,
        user_data: Dict[str, Any],
        connections: List[Dict[str, Any]],
        activities: List[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        if not connections:
            return {
                'overall_score': 0.0,
                'category': 'low',
                'breakdown': {},
                'recommendations': []
            }

        privacy_score = self._calculate_privacy_settings_score(connections)
        frequency_score = self._calculate_post_frequency_score(connections)
        exposure_score = self._calculate_exposure_score(connections, activities)
        app_score = self._calculate_third_party_apps_score(connections)

        overall_score = (
            privacy_score * self.feature_weights['privacy_setting'] +
            frequency_score * self.feature_weights['post_frequency'] +
            exposure_score * self.feature_weights['personal_info_exposure'] +
            app_score * self.feature_weights['third_party_apps']
        )

        category = self._get_risk_category(overall_score)
        breakdown = {
            'privacy_settings': round(privacy_score, 2),
            'post_frequency': round(frequency_score, 2),
            'personal_info_exposure': round(exposure_score, 2),
            'third_party_apps': round(app_score, 2)
        }
        recommendations = self._generate_risk_factors(breakdown)

        result = {
            'overall_score': round(overall_score, 2),
            'category': category,
            'breakdown': breakdown,
            'recommendations': recommendations
        }
        logger.info(f"Calculated risk score: {overall_score:.2f} ({category})")
        return result

    def _calculate_privacy_settings_score(self, connections: List[Dict[str, Any]]) -> float:
        if not connections:
            return 0.0
        scores = []
        for conn in connections:
            setting = conn.get('privacy_setting', 'friends')
            visibility = conn.get('profile_visibility', 'friends')
            score = 50.0 if setting == 'friends' else 80.0 if setting == 'public' else 20.0
            score += 15 if visibility == 'public' else 5 if visibility == 'friends' else 0
            scores.append(min(score, 100))
        return np.mean(scores)

    def _calculate_post_frequency_score(self, connections: List[Dict[str, Any]]) -> float:
        if not connections:
            return 0.0
        scores = []
        for conn in connections:
            daily_posts = conn.get('post_count', 0) / 365.0
            if daily_posts > 5:
                score = 90.0
            elif daily_posts > 3:
                score = 70.0
            elif daily_posts > 1:
                score = 50.0
            else:
                score = 30.0
            scores.append(score)
        return np.mean(scores)

    def _calculate_exposure_score(
        self,
        connections: List[Dict[str, Any]],
        activities: List[Dict[str, Any]] = None
    ) -> float:
        if not connections:
            return 0.0
        scores = []
        for conn in connections:
            score = 0.0
            if conn.get('shares_location'):
                score += 40.0
            if conn.get('shares_contacts'):
                score += 30.0
            if conn.get('profile_visibility') == 'public':
                score += 20.0
            scores.append(min(score, 100))
        base_score = np.mean(scores)

        if activities:
            personal_info_count = sum(1 for a in activities if a.get('has_personal_info'))
            location_count = sum(1 for a in activities if a.get('has_location'))
            if len(activities) > 0:
                bonus = ((personal_info_count + location_count) / len(activities)) * 20
                base_score = min(base_score + bonus, 100)
        return base_score

    def _calculate_third_party_apps_score(self, connections: List[Dict[str, Any]]) -> float:
        # Placeholder logic
        return 50.0

    def _get_risk_category(self, score: float) -> str:
        if score >= self.threshold_high:
            return 'high'
        elif score >= self.threshold_low:
            return 'medium'
        else:
            return 'low'

    def _generate_risk_factors(self, breakdown: Dict[str, float]) -> List[str]:
        factors = []
        sorted_items = sorted(breakdown.items(), key=lambda x: x[1], reverse=True)
        for component, score in sorted_items[:3]:
            if score >= 70:
                label = component.replace('_', ' ').title()
                factors.append(f"High {label}: {score:.1f}/100")
        return factors

    def train(self, X: np.ndarray, y: np.ndarray):
        if self.model_type != 'ml':
            logger.warning("Cannot train rule-based model")
            return
        self.model.fit(X, y)
        self.is_trained = True
        logger.info(f"Model trained on {len(X)} samples")

    def predict_ml(self, features: np.ndarray) -> float:
        if self.model is None or not self.is_trained:
            raise ValueError("Model not trained")
        prediction = self.model.predict(features.reshape(1, -1))[0]
        return max(0, min(100, prediction))

    @staticmethod
    def _normalize_feature_weights(weights: Dict[str, float]) -> Dict[str, float]:
        total = sum(weights.values())
        if not total:
            return RiskScorer.FEATURE_WEIGHTS.copy()
        return {key: value / total for key, value in weights.items()}