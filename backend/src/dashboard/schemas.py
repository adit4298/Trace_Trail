from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional


class PrivacyScoreBase(BaseModel):
    """Base schema for privacy score"""
    score: float = Field(ge=0, le=100)
    category: Optional[str] = None


class PrivacyScoreCreate(PrivacyScoreBase):
    """Schema for creating privacy score"""
    user_id: int


class PrivacyScoreResponse(PrivacyScoreBase):
    """Response schema for privacy score"""
    id: int
    date_recorded: datetime
    user_id: int

    class Config:
        from_attributes = True


class SocialConnectionBase(BaseModel):
    """Base schema for social connection"""
    platform: str
    connection_count: int = 0
    data_exposure: float = Field(ge=0.0, le=1.0)


class SocialConnectionCreate(SocialConnectionBase):
    """Schema for creating social connection"""
    pass


class SocialConnectionResponse(SocialConnectionBase):
    """Response schema for social connection"""
    id: int
    last_synced: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class DashboardOverview(BaseModel):
    """Complete dashboard overview"""
    user_id: int
    username: str
    current_risk_score: Optional[float]
    risk_category: Optional[str]
    total_connections: int
    recent_scores: List[PrivacyScoreResponse]
    social_connections: List[SocialConnectionResponse]


class PlatformExposure(BaseModel):
    """Platform-wise data exposure"""
    platform: str
    exposure: float
    connection_count: int


class DashboardStats(BaseModel):
    """Dashboard statistics"""
    total_users: int
    average_risk_score: float
    high_risk_users: int
    medium_risk_users: int
    low_risk_users: int

