"""
Constants used across AI module.
"""

# Supported social media platforms
PLATFORMS = ['facebook', 'instagram', 'twitter', 'linkedin']

# Privacy settings
PRIVACY_SETTINGS = ['public', 'friends', 'private']

# Risk categories
RISK_CATEGORIES = {
    'low': (0, 40),
    'medium': (41, 70),
    'high': (71, 100)
}

# Content types
CONTENT_TYPES = [
    'personal_photo',
    'location_check_in',
    'status_update',
    'shared_article',
    'life_event',
    'contact_info'
]

# Impact levels
IMPACT_LEVELS = ['low', 'medium', 'high']

# Effort levels
EFFORT_LEVELS = ['low', 'medium', 'high']

# Feature names for ML models
FEATURE_NAMES = [
    'user_age',
    'account_age_days',
    'total_connections',
    'active_connections',
    'public_ratio',
    'friends_ratio',
    'private_ratio',
    'location_sharing_ratio',
    'contact_sharing_ratio',
    'avg_followers',
    'avg_posts',
    'avg_engagement'
]

# Model configuration
MODEL_CONFIG = {
    'risk_scorer': {
        'type': 'rule_based',
        'version': '1.0'
    },
    'recommender': {
        'max_recommendations': 5
    },
    'anomaly_detector': {
        'contamination': 0.1
    }
}