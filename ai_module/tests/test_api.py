"""
Tests for API endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_endpoint():
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert "service" in response.json()
    assert "version" in response.json()

def test_health_check():
    """Test health check endpoint."""
    response = client.get("/api/ai/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_risk_score_endpoint():
    """Test risk score calculation endpoint."""
    request_data = {
        "user_id": 1,
        "user_data": {
            "user_id": 1,
            "email": "test@example.com",
            "username": "testuser",
            "is_active": True
        },
        "connections": [
            {
                "connection_id": 1,
                "user_id": 1,
                "platform": "facebook",
                "platform_username": "testuser_fb",
                "connected_at": "2024-01-01",
                "is_active": True,
                "post_count": 500,
                "follower_count": 1000,
                "privacy_setting": "public",
                "profile_visibility": "public",
                "shares_location": True,
                "shares_contacts": False
            }
        ]
    }
    response = client.post("/api/ai/risk-score", json=request_data)
    assert response.status_code == 200

    data = response.json()
    assert "overall_score" in data
    assert "category" in data
    assert "breakdown" in data

def test_recommendations_endpoint():
    """Test recommendations endpoint."""
    request_data = {
        "user_id": 1,
        "risk_score": 75.0,
        "risk_breakdown": {
            "privacy_settings": 80.0,
            "post_frequency": 70.0,
            "personal_info_exposure": 75.0,
            "third_party_apps": 65.0
        },
        "connections": [
            {
                "connection_id": 1,
                "user_id": 1,
                "platform": "facebook",
                "platform_username": "testuser_fb",
                "connected_at": "2024-01-01",
                "is_active": True,
                "post_count": 500,
                "follower_count": 1000,
                "privacy_setting": "public",
                "profile_visibility": "public",
                "shares_location": True,
                "shares_contacts": False
            }
        ],
        "max_recommendations": 5
    }

    response = client.post("/api/ai/recommendations", json=request_data)
    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, list)
    assert len(data) <= 5