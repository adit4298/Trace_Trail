import pandas as pd
import numpy as np
from typing import Dict, List, Any, Tuple
from sklearn.preprocessing import StandardScaler, MinMaxScaler
import logging

logger = logging.getLogger(__name__)

class DataPreprocessor:
    """Preprocess data for ML models."""

    def __init__(self):
        self.scaler = StandardScaler()
        self.min_max_scaler = MinMaxScaler()
        logger.info("DataPreprocessor initialized")

    def extract_features(
        self,
        connection_data: Dict[str, Any],
        activity_data: List[Dict[str, Any]]
    ) -> Dict[str, float]:
        features = {}

        # Connection-level features
        features['post_count'] = connection_data.get('post_count', 0)
        features['follower_count'] = connection_data.get('follower_count', 0)
        features['is_active'] = 1 if connection_data.get('is_active') else 0
        features['shares_location'] = 1 if connection_data.get('shares_location') else 0
        features['shares_contacts'] = 1 if connection_data.get('shares_contacts') else 0

        # Privacy setting encoding
        privacy_setting = connection_data.get('privacy_setting', 'friends')
        features['privacy_public'] = 1 if privacy_setting == 'public' else 0
        features['privacy_friends'] = 1 if privacy_setting == 'friends' else 0
        features['privacy_private'] = 1 if privacy_setting == 'private' else 0

        # Profile visibility encoding
        visibility = connection_data.get('profile_visibility', 'friends')
        features['visibility_public'] = 1 if visibility == 'public' else 0
        features['visibility_friends'] = 1 if visibility == 'friends' else 0
        features['visibility_private'] = 1 if visibility == 'private' else 0

        # Activity-level features
        if activity_data:
            features['activity_count'] = len(activity_data)
            features['personal_info_posts'] = sum(
                1 for a in activity_data if a.get('has_personal_info', False)
            )
            features['location_posts'] = sum(
                1 for a in activity_data if a.get('has_location', False)
            )
            features['avg_engagement'] = np.mean([
                a.get('engagement_score', 0) for a in activity_data
            ])

            content_types = [a.get('content_type', 'unknown') for a in activity_data]
            features['personal_photo_ratio'] = content_types.count('personal_photo') / len(content_types)
            features['location_checkin_ratio'] = content_types.count('location_check_in') / len(content_types)
        else:
            features['activity_count'] = 0
            features['personal_info_posts'] = 0
            features['location_posts'] = 0
            features['avg_engagement'] = 0
            features['personal_photo_ratio'] = 0
            features['location_checkin_ratio'] = 0

        # Derived features
        if features['activity_count'] > 0:
            features['personal_info_ratio'] = features['personal_info_posts'] / features['activity_count']
            features['location_ratio'] = features['location_posts'] / features['activity_count']
        else:
            features['personal_info_ratio'] = 0
            features['location_ratio'] = 0

        return features

    def normalize_features(
        self,
        features: Dict[str, float],
        method: str = 'standard'
    ) -> Dict[str, float]:
        feature_array = np.array(list(features.values())).reshape(1, -1)
        if method == 'standard':
            normalized = self.scaler.fit_transform(feature_array)
        elif method == 'minmax':
            normalized = self.min_max_scaler.fit_transform(feature_array)
        else:
            raise ValueError(f"Unknown normalization method: {method}")
        return dict(zip(features.keys(), normalized[0]))

    def prepare_training_data(
        self,
        connections_df: pd.DataFrame,
        labels: pd.Series
    ) -> Tuple[np.ndarray, np.ndarray]:
        feature_columns = [col for col in connections_df.columns if col not in ['user_id', 'connection_id']]
        X = connections_df[feature_columns].values
        y = labels.values
        X = np.nan_to_num(X, nan=0.0)
        logger.info(f"Prepared training data: X shape={X.shape}, y shape={y.shape}")
        return X, y

    def encode_platform(self, platform: str) -> Dict[str, int]:
        platforms = ['facebook', 'instagram', 'twitter', 'linkedin']
        encoding = {f'platform_{p}': 0 for p in platforms}
        if platform.lower() in platforms:
            encoding[f'platform_{platform.lower()}'] = 1
        return encoding