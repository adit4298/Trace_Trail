"""
Tests for DataGenerator.
"""

import pytest
from data.data_generator import DataGenerator
import pandas as pd

@pytest.fixture
def data_generator():
    """Create data generator instance."""
    return DataGenerator(seed=42)

def test_generate_users(data_generator):
    """Test user generation."""
    users = data_generator.generate_users(count=10)
    assert len(users) == 10
    assert all('user_id' in u for u in users)
    assert all('email' in u for u in users)
    assert all('username' in u for u in users)

def test_generate_social_connections(data_generator):
    """Test social connection generation."""
    user_ids = [1, 2, 3, 4, 5]
    connections = data_generator.generate_social_connections(
        user_ids=user_ids,
        avg_connections_per_user=3
    )
    assert isinstance(connections, pd.DataFrame)
    assert len(connections) > 0
    assert 'user_id' in connections.columns
    assert 'platform' in connections.columns
    assert 'privacy_setting' in connections.columns

def test_generate_user_activity(data_generator):
    """Test activity generation."""
    activities = data_generator.generate_user_activity(
        connection_id=1,
        days=30
    )
    assert isinstance(activities, list)
    assert all('connection_id' in a for a in activities)
    assert all('date' in a for a in activities)
    assert all('content_type' in a for a in activities)

def test_calculate_base_risk_score(data_generator):
    """Test base risk score calculation."""
    connection = {
        'privacy_setting': 'public',
        'shares_location': True,
        'profile_visibility': 'public'
    }
    activities = [
        {'has_personal_info': True, 'has_location': True},
        {'has_personal_info': False, 'has_location': True}
    ]
    score = data_generator.calculate_base_risk_score(connection, activities)

    assert isinstance(score, float)
    assert 0 <= score <= 100