def test_health_check(client):
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_app_runs(client):
    """Test that app initializes"""
    assert client is not None
