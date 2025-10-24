from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, String
from sqlalchemy.orm import relationship
from datetime import datetime
from src.core.database import Base


class PrivacyScore(Base):
    """
    Privacy risk score history for users.
    Stores periodic snapshots of a user's privacy risk assessment.
    """
    __tablename__ = "privacy_scores"

    id = Column(Integer, primary_key=True, index=True)
    score = Column(Float, nullable=False)  # Risk score 0-100
    category = Column(String, nullable=True)  # Low, Medium, High
    date_recorded = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Foreign key
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationship
    user = relationship("User", back_populates="privacy_scores")

    def __repr__(self):
        return f"<PrivacyScore(id={self.id}, score={self.score}, user_id={self.user_id})>"


class SocialConnection(Base):
    """
    Social media connections for users.
    Tracks which platforms a user has connected.
    """
    __tablename__ = "social_connections"

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String, nullable=False)  # e.g., Facebook, Instagram
    connection_count = Column(Integer, default=0)
    data_exposure = Column(Float, default=0.0)  # 0.0 to 1.0
    last_synced = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Foreign key
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationship
    user = relationship("User", back_populates="social_connections")

    def __repr__(self):
        return f"<SocialConnection(id={self.id}, platform='{self.platform}', user_id={self.user_id})>"

