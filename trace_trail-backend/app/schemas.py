from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Authentication Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Social Connection Schemas
class SocialConnectionBase(BaseModel):
    platform: str
    connection_count: int
    data_shared: Optional[str] = None

class SocialConnectionCreate(SocialConnectionBase):
    user_id: int

class SocialConnection(SocialConnectionBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Privacy Score Schemas
class PrivacyScoreBase(BaseModel):
    overall_score: float
    social_media_risk: float
    data_exposure_risk: float

class PrivacyScoreCreate(PrivacyScoreBase):
    user_id: int

class PrivacyScore(PrivacyScoreBase):
    id: int
    user_id: int
    calculated_at: datetime

    class Config:
        from_attributes = True

# Dashboard Data Schema
class DashboardData(BaseModel):
    user: User
    privacy_score: PrivacyScore
    social_connections: List[SocialConnection]
    recommendations: List[str]