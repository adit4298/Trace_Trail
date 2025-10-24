from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from src.core.database import Base


class Challenge(Base):
    """Privacy improvement challenges for gamification"""
    __tablename__ = "challenges"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    difficulty = Column(String, default="easy")
    points = Column(Integer, default=10)
    badge_name = Column(String, nullable=True)

    # Relationship with CompletedChallenge
    completed_by = relationship("CompletedChallenge", back_populates="challenge")


class CompletedChallenge(Base):
    """User challenge completion records"""
    __tablename__ = "completed_challenges"

    id = Column(Integer, primary_key=True, index=True)
    completed_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)

    # Relationships
    user = relationship("User", back_populates="completed_challenges")
    challenge = relationship("Challenge", back_populates="completed_by")
