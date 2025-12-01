from sqlalchemy.orm import Session
from sqlalchemy import desc
from .models import RiskAnalysis, Recommendation
from datetime import datetime, timedelta
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)


class AnalysisRepository:
    """Repository for analysis-related database operations"""
    
    def __init__(self, db: Session):
        self.db = db
    
    async def get_latest_analysis(self, user_id: int) -> Optional[RiskAnalysis]:
        """Get user's most recent risk analysis"""
        return self.db.query(RiskAnalysis).filter(
            RiskAnalysis.user_id == user_id
        ).order_by(desc(RiskAnalysis.analysis_date)).first()
    
    async def get_analysis_history(self, user_id: int, limit: int = 10) -> List[RiskAnalysis]:
        """Get user's analysis history"""
        return self.db.query(RiskAnalysis).filter(
            RiskAnalysis.user_id == user_id
        ).order_by(desc(RiskAnalysis.analysis_date)).limit(limit).all()
    
    async def create_analysis(
        self,
        user_id: int,
        overall_score: float,
        social_media_risk: float,
        data_exposure_risk: float,
        privacy_settings_risk: float,
        risk_factors: dict,
        algorithm_version: str = "1.0"
    ) -> RiskAnalysis:
        """Create new risk analysis"""
        analysis = RiskAnalysis(
            user_id=user_id,
            overall_score=overall_score,
            social_media_risk=social_media_risk,
            data_exposure_risk=data_exposure_risk,
            privacy_settings_risk=privacy_settings_risk,
            risk_factors=risk_factors,
            algorithm_version=algorithm_version
        )
        
        self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)
        
        logger.info(f"Analysis created for user {user_id}: score={overall_score}")
        return analysis
    
    async def add_recommendation(
        self,
        analysis_id: int,
        user_id: int,
        title: str,
        description: str,
        priority: str,
        category: str,
        impact_score: float
    ) -> Recommendation:
        """Add recommendation to analysis"""
        recommendation = Recommendation(
            analysis_id=analysis_id,
            user_id=user_id,
            title=title,
            description=description,
            priority=priority,
            category=category,
            impact_score=impact_score
        )
        
        self.db.add(recommendation)
        self.db.commit()
        self.db.refresh(recommendation)
        
        return recommendation
    
    async def get_recommendations(self, analysis_id: int) -> List[Recommendation]:
        """Get recommendations for analysis"""
        return self.db.query(Recommendation).filter(
            Recommendation.analysis_id == analysis_id
        ).all()
    
    async def mark_recommendation_complete(self, recommendation_id: int) -> Recommendation:
        """Mark recommendation as completed"""
        rec = self.db.query(Recommendation).filter(
            Recommendation.id == recommendation_id
        ).first()
        
        if rec:
            rec.is_completed = True
            rec.completed_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(rec)
        
        return rec
    
    async def get_pending_recommendations(self, user_id: int) -> List[Recommendation]:
        """Get incomplete recommendations for user"""
        return self.db.query(Recommendation).filter(
            Recommendation.user_id == user_id,
            Recommendation.is_completed == False
        ).order_by(Recommendation.priority).all()
