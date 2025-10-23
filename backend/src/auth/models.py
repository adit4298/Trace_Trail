from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from src.core.database import Base

class User(Base):
    """
    User model representing registered users in the system.
    
    Relationships:
        - social_connections: List of connected social media accounts
        - privacy_scores: History of privacy risk scores
        - completed_challenges: Gamification challenges completed
    """
    __tablename__ = "users"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Authentication Fields
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    # Profile Fields
    full_name = Column(String, nullable=True)
    
    # Status Fields
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )
    
    # Relationships
    social_connections = relationship(
        "SocialConnection",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    privacy_scores = relationship(
        "PrivacyScore",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    completed_challenges = relationship(
        "CompletedChallenge",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', username='{self.username}')>"
