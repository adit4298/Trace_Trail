import numpy as np
from typing import Dict, Any, List
from sklearn.ensemble import RandomForestRegressor
import logging

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

    def __init__(self, model_type: str = 'rule_based'):
        self.model_type = model_type
        self.model = None
        if model_type == 'ml':
            self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        logger.info(f"RiskScorer initialized with model_type={model_type}")

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
            privacy_score * self.FEATURE_WEIGHTS['privacy_setting'] +
            frequency_score * self.FEATURE_WEIGHTS['post_frequency'] +
            exposure_score * self.FEATURE_WEIGHTS['personal_info_exposure'] +
            app_score * self.FEATURE_WEIGHTS['third_party_apps']
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
        if score >= 71:
            return 'high'
        elif score >= 41:
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
        logger.info(f"Model trained on {len(X)} samples")

    def predict_ml(self, features: np.ndarray) -> float:
        if self.model is None:
            raise ValueError("Model not trained")
        prediction = self.model.predict(features.reshape(1, -1))[0]
        return max(0, min(100, prediction))