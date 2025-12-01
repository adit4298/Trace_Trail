from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional


class SocialConnectionCreate(BaseModel):
    """Schema for creating social connection"""
    platform: str = Field(..., description="Social media platform name")
    connection_count: int = Field(ge=0, default=0)
    data_exposure: float = Field(ge=0.0, le=1.0, default=0.0)


class SocialConnectionUpdate(BaseModel):
    """Schema for updating social connection"""
    connection_count: Optional[int] = Field(None, ge=0)
    data_exposure: Optional[float] = Field(None, ge=0.0, le=1.0)


class SocialConnectionResponse(BaseModel):
    """Response schema for social connection"""
    id: int
    platform: str
    connection_count: int
    data_exposure: float
    last_synced: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class SocialConnectionsList(BaseModel):
    """List of social connections"""
    connections: List[SocialConnectionResponse]
    total: int


class PlatformSyncRequest(BaseModel):
    """Request to sync platform data"""
    platform: str
    access_token: Optional[str] = None  # For future OAuth integration
