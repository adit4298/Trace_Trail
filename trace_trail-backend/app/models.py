from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Text
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SocialConnection(Base):
    __tablename__ = "social_connections"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    platform = Column(String)  # 'facebook', 'instagram', 'twitter', etc.
    connection_count = Column(Integer)
    data_shared = Column(Text)  # JSON string of shared data types
    privacy_settings = Column(Text)  # JSON string of privacy settings
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PrivacyScore(Base):
    __tablename__ = "privacy_scores"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    overall_score = Column(Float)  # 0-100%
    social_media_risk = Column(Float)
    data_exposure_risk = Column(Float)
    calculated_at = Column(DateTime(timezone=True), server_default=func.now())