"""
Synthetic data generator for development and testing.
Generates realistic user profiles, social connections, and activity data.
"""
import json
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any
from faker import Faker
import pandas as pd
import logging

logger = logging.getLogger(__name__)
fake = Faker()

class DataGenerator:
    """Generate synthetic data for training and testing."""

    PLATFORMS = ['facebook', 'instagram', 'twitter', 'linkedin']
    PRIVACY_SETTINGS = {
        'public': {'weight': 1.0, 'risk_multiplier': 1.5},
        'friends': {'weight': 0.6, 'risk_multiplier': 1.0},
        'private': {'weight': 0.3, 'risk_multiplier': 0.5}
    }

    CONTENT_TYPES = [
        'personal_photo', 'location_check_in', 'status_update',
        'shared_article', 'life_event', 'contact_info'
    ]

    def __init__(self, seed: int = 42):
        random.seed(seed)
        Faker.seed(seed)
        logger.info(f"DataGenerator initialized with seed {seed}")

    def generate_users(self, count: int = 100) -> List[Dict[str, Any]]:
        users = []
        for i in range(count):
            user = {
                'user_id': i + 1,
                'email': fake.email(),
                'username': fake.user_name(),
                'full_name': fake.name(),
                'age': random.randint(18, 65),
                'join_date': fake.date_between(start_date='-2y', end_date='today').isoformat(),
                'is_active': random.choice([True] * 9 + [False])
            }
            users.append(user)
        logger.info(f"Generated {count} synthetic users")
        return users

    def generate_social_connections(self, user_ids: List[int], avg_connections_per_user: int = 3) -> pd.DataFrame:
        connections = []
        for user_id in user_ids:
            num_connections = random.randint(1, avg_connections_per_user * 2)
            for _ in range(num_connections):
                platform = random.choice(self.PLATFORMS)
                privacy_setting = random.choices(
                    list(self.PRIVACY_SETTINGS.keys()),
                    weights=[0.3, 0.5, 0.2]
                )[0]
                connection = {
                    'user_id': user_id,
                    'platform': platform,
                    'platform_username': fake.user_name(),
                    'connected_at': fake.date_time_between(start_date='-1y', end_date='now').isoformat(),
                    'is_active': random.choice([True] * 8 + [False] * 2),
                    'post_count': random.randint(10, 1000),
                    'follower_count': random.randint(50, 5000),
                    'privacy_setting': privacy_setting,
                    'profile_visibility': random.choice(['public', 'friends', 'private']),
                    'shares_location': random.choice([True, False]),
                    'shares_contacts': random.choice([True, False])
                }
                connections.append(connection)
        df = pd.DataFrame(connections)
        logger.info(f"Generated {len(connections)} social connections")
        return df

    def generate_user_activity(self, connection_id: int, days: int = 30) -> List[Dict[str, Any]]:
        activities = []
        posts_per_day = random.uniform(0.5, 5.0)
        for day in range(days):
            date = datetime.now() - timedelta(days=day)
            num_posts = max(0, int(random.gauss(posts_per_day, 1.5)))
            for _ in range(num_posts):
                activity = {
                    'connection_id': connection_id,
                    'date': date.date().isoformat(),
                    'content_type': random.choice(self.CONTENT_TYPES),
                    'has_personal_info': random.random() < 0.3,
                    'has_location': random.random() < 0.4,
                    'engagement_score': random.uniform(0, 100)
                }
                activities.append(activity)
        return activities

    def calculate_base_risk_score(self, connection: Dict[str, Any], activities: List[Dict[str, Any]]) -> float:
        risk_score = 0.0
        privacy_multiplier = self.PRIVACY_SETTINGS[connection['privacy_setting']]['risk_multiplier']
        risk_score += 20 * privacy_multiplier

        if len(activities) > 0:
            posts_per_day = len(activities) / 30
            if posts_per_day > 3:
                risk_score += 15
            elif posts_per_day > 1:
                risk_score += 10
            else:
                risk_score += 5

        personal_info_count = sum(1 for a in activities if a['has_personal_info'])
        risk_score += min(personal_info_count * 2, 25)

        if connection['shares_location']:
            risk_score += 15

        if connection['profile_visibility'] == 'public':
            risk_score += 10
        elif connection['profile_visibility'] == 'friends':
            risk_score += 5

        risk_score += random.uniform(-5, 5)
        risk_score = max(0, min(100, risk_score))
        return round(risk_score, 2)

    def save_to_json(self, data: Any, filepath: str):
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        logger.info(f"Data saved to {filepath}")

    def save_to_csv(self, df: pd.DataFrame, filepath: str):
        df.to_csv(filepath, index=False)
        logger.info(f"Data saved to {filepath}")