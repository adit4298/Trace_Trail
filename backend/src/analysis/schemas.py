from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Dict, Optional


class RiskFactor(BaseModel):
    """Schema for individual risk factor"""
    name: str
    severity: str  # low, medium, high, critical
    description: str
    platform: Optional[str] = None


class RecommendationResponse(BaseModel):
    """Schema for recommendation response"""
    id: int
    title: str
    description: str
    priority: str
    category: str
    impact_score: float
    is_completed: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class AnalysisRequest(BaseModel):
    """Schema for analysis request"""
    scan_type: str = Field(default="full")  # full, quick, social_media
    include_recommendations: bool = True


class AnalysisResponse(BaseModel):
    """Schema for analysis response"""
    overall_score: float = Field(ge=0, le=100)
    social_media_risk: float = Field(ge=0, le=100)
    data_exposure_risk: float = Field(ge=0, le=100)
    privacy_settings_risk: float = Field(ge=0, le=100)
    risk_factors: List[RiskFactor]
    recommendations: List[RecommendationResponse]
    analysis_date: datetime
    algorithm_version: str
    
    class Config:
        from_attributes = True


class AnalysisHistory(BaseModel):
    """Schema for analysis history"""
    id: int
    overall_score: float
    analysis_date: datetime
    
    class Config:
        from_attributes = True


class AnalysisSummary(BaseModel):
    """Schema for quick analysis summary"""
    current_score: float
    risk_category: str
    key_risks: List[str]
    urgent_recommendations: List[str]
