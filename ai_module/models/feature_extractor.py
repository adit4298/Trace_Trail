import numpy as np
from typing import Dict, Any, List
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class FeatureExtractor:
    """Extract features from user data for ML models."""

    def __init__(self):
        """Initialize feature extractor."""
        logger.info("FeatureExtractor initialized")

    def extract_user_features(
        self,
        user_data: Dict[str, Any],
        connections: List[Dict[str, Any]],
        activities: List[Dict[str, Any]] = None
    ) -> Dict[str, float]:
        """Extract comprehensive feature set for a user."""
        features = {}

        # User demographic features
        features['user_age'] = user_data.get('age', 30)
        features['account_age_days'] = self._calculate_account_age(user_data.get('join_date'))
        features['is_active'] = 1 if user_data.get('is_active') else 0

        # Connection features
        features['total_connections'] = len(connections)
        features['active_connections'] = sum(1 for c in connections if c.get('is_active', False))

        # Platform distribution
        platform_counts = self._count_by_platform(connections)
        for platform, count in platform_counts.items():
            features[f'connections_{platform}'] = count

        # Privacy settings aggregation
        privacy_features = self._aggregate_privacy_settings(connections)
        features.update(privacy_features)

        # Activity features
        if activities:
            activity_features = self._extract_activity_features(activities)
            features.update(activity_features)

        # Engagement metrics
        features['avg_followers'] = np.mean([
            c.get('follower_count', 0) for c in connections
        ]) if connections else 0

        features['avg_posts'] = np.mean([
            c.get('post_count', 0) for c in connections
        ]) if connections else 0

        logger.debug(f"Extracted {len(features)} features")
        return features

    def _calculate_account_age(self, join_date: str = None) -> float:
        """Calculate account age in days."""
        if not join_date:
            return 365.0  # Default 1 year
        try:
            join_dt = datetime.fromisoformat(join_date)
            age = (datetime.now() - join_dt).days
            return float(age)
        except:
            return 365.0

    def _count_by_platform(self, connections: List[Dict[str, Any]]) -> Dict[str, int]:
        """Count connections by platform."""
        platforms = ['facebook', 'instagram', 'twitter', 'linkedin']
        counts = {platform: 0 for platform in platforms}
        for conn in connections:
            platform = conn.get('platform', '').lower()
            if platform in platforms:
                counts[platform] += 1
        return counts

    def _aggregate_privacy_settings(self, connections: List[Dict[str, Any]]) -> Dict[str, float]:
        """Aggregate privacy settings across connections."""
        if not connections:
            return {
                'public_ratio': 0.0,
                'friends_ratio': 0.0,
                'private_ratio': 0.0,
                'location_sharing_ratio': 0.0,
                'contact_sharing_ratio': 0.0
            }

        privacy_counts = {'public': 0, 'friends': 0, 'private': 0}
        location_count = 0
        contact_count = 0

        for conn in connections:
            privacy = conn.get('privacy_setting', 'friends')
            privacy_counts[privacy] = privacy_counts.get(privacy, 0) + 1
            if conn.get('shares_location'):
                location_count += 1
            if conn.get('shares_contacts'):
                contact_count += 1

        total = len(connections)
        return {
            'public_ratio': privacy_counts['public'] / total,
            'friends_ratio': privacy_counts['friends'] / total,
            'private_ratio': privacy_counts['private'] / total,
            'location_sharing_ratio': location_count / total,
            'contact_sharing_ratio': contact_count / total
        }

    def _extract_activity_features(self, activities: List[Dict[str, Any]]) -> Dict[str, float]:
        """Extract features from activity history."""
        if not activities:
            return {
                'total_activities': 0,
                'avg_engagement': 0.0,
                'personal_info_ratio': 0.0,
                'location_post_ratio': 0.0,
                'recent_activity_trend': 0.0
            }

        features = {}
        features['total_activities'] = len(activities)

        engagements = [a.get('engagement_score', 0) for a in activities]
        features['avg_engagement'] = np.mean(engagements)
        features['max_engagement'] = np.max(engagements)
        features['std_engagement'] = np.std(engagements)

        personal_info_count = sum(1 for a in activities if a.get('has_personal_info', False))
        location_count = sum(1 for a in activities if a.get('has_location', False))

        features['personal_info_ratio'] = personal_info_count / len(activities)
        features['location_post_ratio'] = location_count / len(activities)

        features['recent_activity_trend'] = self._calculate_activity_trend(activities)
        return features

    def _calculate_activity_trend(self, activities: List[Dict[str, Any]]) -> float:
        """Calculate trend in activity (increasing or decreasing)."""
        if len(activities) < 2:
            return 0.0

        sorted_activities = sorted(
            activities,
            key=lambda x: x.get('date', ''),
            reverse=True
        )

        recent_count = len([a for a in sorted_activities[:10]])
        older_count = len([a for a in sorted_activities[-10:]])

        if older_count == 0:
            return 1.0

        trend = (recent_count - older_count) / older_count
        return trend

    def create_feature_vector(
        self,
        features: Dict[str, float],
        feature_names: List[str]
    ) -> np.ndarray:
        """Create ordered feature vector for model input."""
        vector = [features.get(name, 0.0) for name in feature_names]
        return np.array(vector)