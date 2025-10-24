from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from src.core.database import Base


class RiskAnalysis(Base):
    """
    Detailed risk analysis results for users.
    Stores breakdown of risk factors and recommendations.
    """
    __tablename__ = "risk_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    overall_score = Column(Float, nullable=False)
    social_media_risk = Column(Float, default=0.0)
    data_exposure_risk = Column(Float, default=0.0)
    privacy_settings_risk = Column(Float, default=0.0)
    
    # Risk factors as JSON
    risk_factors = Column(JSON, default=dict)
    
    # Analysis metadata
    analysis_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    algorithm_version = Column(String, default="1.0")
    
    # Foreign key
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationship
    user = relationship("User", back_populates="analysis")
    recommendations = relationship("Recommendation", back_populates="analysis", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<RiskAnalysis(id={self.id}, score={self.overall_score}, user_id={self.user_id})>"


class Recommendation(Base):
    """
    Privacy improvement recommendations.
    Generated based on risk analysis results.
    """
    __tablename__ = "recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(String, nullable=False)  # high, medium, low
    category = Column(String, nullable=False)
    impact_score = Column(Float, default=0.0)
    
    # Analysis reference
    analysis_id = Column(Integer, ForeignKey("risk_analyses.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Status
    is_completed = Column(String, default=False)
    completed_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    analysis = relationship("RiskAnalysis", back_populates="recommendations")
    user = relationship("User")
    
    def __repr__(self):
        return f"<Recommendation(id={self.id}, title='{self.title}', priority='{self.priority}')>"
