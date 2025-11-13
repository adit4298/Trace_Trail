"""
Tests for Recommender.
"""

import pytest
from models.recommender import Recommender

@pytest.fixture
def recommender():
    """Create recommender instance."""
    return Recommender()

@pytest.fixture
def sample_connections():
    """Sample connections."""
    return [
        {
            'platform': 'facebook',
            'privacy_setting': 'public',
            'shares_location': True,
            'shares_contacts': False
        }
    ]

def test_recommender_initialization(recommender):
    """Test recommender initializes correctly."""
    assert recommender is not None

def test_generate_recommendations_high_risk(recommender, sample_connections):
    """Test recommendation generation for high risk."""
    recommendations = recommender.generate_recommendations(
        risk_score=85.0,
        risk_breakdown={
            'privacy_settings': 90.0,
            'post_frequency': 70.0,
            'personal_info_exposure': 80.0,
            'third_party_apps': 60.0
        },
        connections=sample_connections,
        max_recommendations=5
    )

    assert isinstance(recommendations, list)
    assert len(recommendations) <= 5

    for rec in recommendations:
        assert 'title' in rec
        assert 'description' in rec
        assert 'impact' in rec
        assert 'effort' in rec
        assert 'priority' in rec

def test_generate_recommendations_low_risk(recommender, sample_connections):
    """Test recommendation generation for low risk."""
    recommendations = recommender.generate_recommendations(
        risk_score=25.0,
        risk_breakdown={
            'privacy_settings': 20.0,
            'post_frequency': 30.0,
            'personal_info_exposure': 25.0,
            'third_party_apps': 25.0
        },
        connections=sample_connections,
        max_recommendations=3
    )
    assert isinstance(recommendations, list)
    assert len(recommendations) <= 3

def test_connection_specific_recommendations(recommender):
    """Test connection-specific recommendations."""
    connection = {
        'platform': 'facebook',
        'privacy_setting': 'public',
        'shares_location': True,
        'shares_contacts': True
    }
    recs = recommender._get_connection_recommendations(connection)

    assert isinstance(recs, list)
    assert len(recs) > 0

def test_estimate_impact(recommender):
    """Test impact estimation."""
    impact = recommender.estimate_impact(
        recommendation_id='public_profile',
        current_risk_score=75.0
    )
    assert 'current_score' in impact
    assert 'estimated_new_score' in impact
    assert 'score_reduction' in impact