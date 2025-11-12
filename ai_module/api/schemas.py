"""
Pydantic schemas for API requests and responses.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

# Request Schemas

class UserData(BaseModel):
    """User profile data."""
    user_id: int
    email: str
    username: str
    full_name: Optional[str] = None
    age: Optional[int] = None
    join_date: Optional[str] = None
    is_active: bool = True

class ConnectionData(BaseModel):
    """Social media connection data."""
    connection_id: int
    user_id: int
    platform: str
    platform_username: str
    connected_at: str
    is_active: bool = True
    post_count: int = 0
    follower_count: int = 0
    privacy_setting: str = 'friends'
    profile_visibility: str = 'friends'
    shares_location: bool = False
    shares_contacts: bool = False

class ActivityData(BaseModel):
    """User activity data."""
    connection_id: int
    date: str
    content_type: str
    has_personal_info: bool = False
    has_location: bool = False
    engagement_score: float = 0.0

class ScoreHistory(BaseModel):
    """Historical risk score."""
    date: str
    score: float

class RiskScoreRequest(BaseModel):
    """Request for risk score calculation."""
    user_id: int
    user_data: UserData
    connections: List[ConnectionData]
    activities: Optional[List[ActivityData]] = None

class RecommendationRequest(BaseModel):
    """Request for recommendations."""
    user_id: int
    risk_score: float
    risk_breakdown: Dict[str, float]
    connections: List[ConnectionData]
    max_recommendations: int = Field(default=5, ge=1, le=10)

class TrendAnalysisRequest(BaseModel):
    """Request for trend analysis."""
    user_id: int
    score_history: List[ScoreHistory]

# Response Schemas

class RiskScoreResponse(BaseModel):
    """Response with risk score."""
    user_id: int
    overall_score: float = Field(ge=0, le=100)
    category: str  # 'low', 'medium', 'high'
    breakdown: Dict[str, float]
    top_risk_factors: List[str]

class RecommendationResponse(BaseModel):
    """Individual recommendation."""
    id: str
    title: str
    description: str
    impact: str  # 'high', 'medium', 'low'
    effort: str  # 'high', 'medium', 'low'
    priority: int
    platform: str

class TrendAnalysisResponse(BaseModel):
    """Trend analysis results."""
    user_id: int
    trend: str  # 'improving', 'worsening', 'stable'
    direction: str
    rate_of_change: float
    predicted_score_7d: Optional[float]
    predicted_score_30d: Optional[float]
    data_points: int

class HealthCheckResponse(BaseModel):
    """Health check response."""
    status: str
    service: str
    version: str