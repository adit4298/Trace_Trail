from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime
from typing import Optional
import re

class UserBase(BaseModel):
    """Base user schema with common fields"""
    email: EmailStr
    username: str = Field(min_length=3, max_length=50)
    full_name: Optional[str] = Field(None, max_length=100)

class UserCreate(UserBase):
    """Schema for user registration"""
    password: str = Field(min_length=8, max_length=100)
    
    @field_validator("password")
    def validate_password_strength(cls, value):
        """Validate password complexity"""
        if not re.search(r"[A-Z]", value):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", value):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", value):
            raise ValueError("Password must contain at least one digit")
        return value
    
    @field_validator("username")
    def validate_username(cls, value):
        """Validate username format"""
        if not re.match(r"^[a-zA-Z0-9_-]+$", value):
            raise ValueError(
                "Username can only contain letters, numbers, underscores, and hyphens"
            )
        return value

class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str

class UserResponse(UserBase):
    """Schema for user response"""
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    """Schema for user profile update"""
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    username: Optional[str] = None

class PasswordChange(BaseModel):
    """Schema for password change"""
    old_password: str
    new_password: str = Field(min_length=8, max_length=100)

class TokenResponse(BaseModel):
    """Schema for authentication token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    """Schema for token payload data"""
    user_id: Optional[int] = None
    email: Optional[str] = None

class RefreshTokenRequest(BaseModel):
    """Schema for token refresh request"""
    refresh_token: str
