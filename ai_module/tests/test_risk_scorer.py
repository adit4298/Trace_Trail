"""
Tests for RiskScorer.
"""

import pytest
from models.risk_scorer import RiskScorer

@pytest.fixture
def risk_scorer():
    """Create risk scorer instance."""
    return RiskScorer(model_type='rule_based')

@pytest.fixture
def sample_user_data():
    """Sample user data."""
    return {
        'user_id': 1,
        'email': 'test@example.com',
        'username': 'testuser',
        'age': 25,
        'is_active': True
    }

@pytest.fixture
def sample_connections():
    """Sample connections data."""
    return [
        {
            'connection_id': 1,
            'user_id': 1,
            'platform': 'facebook',
            'platform_username': 'testuser_fb',
            'connected_at': '2024-01-01',
            'is_active': True,
            'post_count': 500,
            'follower_count': 1000,
            'privacy_setting': 'public',
            'profile_visibility': 'public',
            'shares_location': True,
            'shares_contacts': False
        },
        {
            'connection_id': 2,
            'user_id': 1,
            'platform': 'instagram',
            'platform_username': 'testuser_ig',
            'connected_at': '2024-01-01',
            'is_active': True,
            'post_count': 300,
            'follower_count': 500,
            'privacy_setting': 'friends',
            'profile_visibility': 'friends',
            'shares_location': False,
            'shares_contacts': False
        }
    ]

def test_risk_scorer_initialization(risk_scorer):
    """Test risk scorer initializes correctly."""
    assert risk_scorer is not None
    assert risk_scorer.model_type == 'rule_based'

def test_calculate_risk_score(risk_scorer, sample_user_data, sample_connections):
    """Test risk score calculation."""
    result = risk_scorer.calculate_risk_score(
        user_data=sample_user_data,
        connections=sample_connections
    )
    assert 'overall_score' in result
    assert 'category' in result
    assert 'breakdown' in result
    assert 'recommendations' in result
    assert 0 <= result['overall_score'] <= 100
    assert result['category'] in ['low', 'medium', 'high']

def test_risk_score_with_no_connections(risk_scorer, sample_user_data):
    """Test risk score with no connections."""
    result = risk_scorer.calculate_risk_score(
        user_data=sample_user_data,
        connections=[]
    )
    assert result['overall_score'] == 0.0
    assert result['category'] == 'low'

def test_privacy_settings_score(risk_scorer, sample_connections):
    """Test privacy settings score calculation."""
    score = risk_scorer._calculate_privacy_settings_score(sample_connections)
    assert isinstance(score, float)
    assert 0 <= score <= 100

def test_get_risk_category(risk_scorer):
    """Test risk category determination."""
    assert risk_scorer._get_risk_category(30) == 'low'
    assert risk_scorer._get_risk_category(50) == 'medium'
    assert risk_scorer._get_risk_category(80) == 'high'

def test_generate_risk_factors(risk_scorer):
    """Test risk factor generation."""
    breakdown = {
        'privacy_settings': 85.0,
        'post_frequency': 60.0,
        'personal_info_exposure': 45.0,
        'third_party_apps': 30.0
    }
    factors = risk_scorer._generate_risk_factors(breakdown)
    assert isinstance(factors, list)
    assert len(factors) <= 3