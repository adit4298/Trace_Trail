from typing import Dict, Any, List, Tuple
import pandas as pd
import logging

logger = logging.getLogger(__name__)

class DataValidator:
    """Validate data before processing."""

    REQUIRED_CONNECTION_FIELDS = [
        'user_id', 'platform', 'platform_username', 'connected_at'
    ]
    VALID_PLATFORMS = ['facebook', 'instagram', 'twitter', 'linkedin']
    VALID_PRIVACY_SETTINGS = ['public', 'friends', 'private']

    def __init__(self):
        logger.info("DataValidator initialized")

    def validate_connection(self, connection: Dict[str, Any]) -> Tuple[bool, List[str]]:
        errors = []

        # Check required fields
        for field in self.REQUIRED_CONNECTION_FIELDS:
            if field not in connection:
                errors.append(f"Missing required field: {field}")

        # Validate platform
        if 'platform' in connection:
            if connection['platform'] not in self.VALID_PLATFORMS:
                errors.append(f"Invalid platform: {connection['platform']}")

        # Validate privacy setting
        if 'privacy_setting' in connection:
            if connection['privacy_setting'] not in self.VALID_PRIVACY_SETTINGS:
                errors.append(f"Invalid privacy setting: {connection['privacy_setting']}")

        # Validate numeric fields
        if 'post_count' in connection:
            if not isinstance(connection['post_count'], (int, float)) or connection['post_count'] < 0:
                errors.append("post_count must be a non-negative number")

        if 'follower_count' in connection:
            if not isinstance(connection['follower_count'], (int, float)) or connection['follower_count'] < 0:
                errors.append("follower_count must be a non-negative number")

        is_valid = len(errors) == 0
        if not is_valid:
            logger.warning(f"Connection validation failed: {errors}")
        return is_valid, errors

    def validate_dataframe(self, df: pd.DataFrame, required_columns: List[str]) -> Tuple[bool, List[str]]:
        errors = []

        # Check if DataFrame is empty
        if df.empty:
            errors.append("DataFrame is empty")
            return False, errors

        # Check required columns
        missing_columns = set(required_columns) - set(df.columns)
        if missing_columns:
            errors.append(f"Missing columns: {missing_columns}")

        # Check for null values in required columns
        for col in required_columns:
            if col in df.columns:
                null_count = df[col].isnull().sum()
                if null_count > 0:
                    errors.append(f"Column '{col}' has {null_count} null values")

        is_valid = len(errors) == 0
        if not is_valid:
            logger.warning(f"DataFrame validation failed: {errors}")
        return is_valid, errors

    def validate_risk_score(self, score: float) -> bool:
        if not isinstance(score, (int, float)):
            logger.error(f"Risk score must be numeric, got {type(score)}")
            return False
        if not 0 <= score <= 100:
            logger.error(f"Risk score must be between 0 and 100, got {score}")
            return False
        return True

    def sanitize_input(self, data: Dict[str, Any]) -> Dict[str, Any]:
        sanitized = {}
        for key, value in data.items():
            if isinstance(value, str):
                # Remove basic SQL injection patterns
                value = value.replace("'", "").replace('"', "").replace(';', "")
                value = value.strip()
            sanitized[key] = value
        return sanitized