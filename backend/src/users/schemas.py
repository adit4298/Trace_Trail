from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List


class UserProfileUpdate(BaseModel):
    """Schema for updating user profile"""
    full_name: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
    username: Optional[str] = Field(None, min_length=3, max_length=50)


class UserPublicProfile(BaseModel):
    """Public user profile (no sensitive data)"""
    id: int
    username: str
    full_name: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class UserDetailResponse(BaseModel):
    """Detailed user response with statistics"""
    id: int
    email: EmailStr
    username: str
    full_name: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime

    # Statistics
    total_connections: int = 0
    current_risk_score: Optional[float] = None
    challenges_completed: int = 0

    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    """Paginated list of users"""
    users: List[UserPublicProfile]
    total: int
    page: int
    page_size: int
