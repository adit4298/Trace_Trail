from sqlalchemy.orm import Session
from .repository import AnalysisRepository
from .risk_engine import RiskEngine
from .recommendation_engine import RecommendationEngine
from .schemas import AnalysisRequest, AnalysisResponse, AnalysisSummary, RiskFactor, RecommendationResponse
from typing import List
import logging

logger = logging.getLogger(__name__)


class AnalysisService:
    """Service layer for analysis business logic"""
    
    def __init__(self, db: Session):
        self.repository = AnalysisRepository(db)
        self.risk_engine = RiskEngine()
        self.recommendation_engine = RecommendationEngine()
    
    async def run_privacy_analysis(
        self,
        user_id: int,
        analysis_request: AnalysisRequest
    ) -> AnalysisResponse:
        """Run comprehensive privacy analysis"""
        
        # Calculate risk scores
        scores = self.risk_engine.calculate_risks(user_id)
        
        # Get risk factors
        risk_factors = self.risk_engine.identify_risk_factors(user_id)
        
        # Create analysis record
        analysis = await self.repository.create_analysis(
            user_id=user_id,
            overall_score=scores['overall'],
            social_media_risk=scores['social_media'],
            data_exposure_risk=scores['data_exposure'],
            privacy_settings_risk=scores['privacy_settings'],
            risk_factors=risk_factors
        )
        
        # Generate recommendations if requested
        recommendations = []
        if analysis_request.include_recommendations:
            recs = self.recommendation_engine.generate_recommendations(
                user_id=user_id,
                scores=scores,
                risk_factors=risk_factors
            )
            
            for rec in recs:
                db_rec = await self.repository.add_recommendation(
                    analysis_id=analysis.id,
                    user_id=user_id,
                    title=rec['title'],
                    description=rec['description'],
                    priority=rec['priority'],
                    category=rec['category'],
                    impact_score=rec['impact_score']
                )
                recommendations.append(RecommendationResponse.from_orm(db_rec))
        
        # Build response
        return AnalysisResponse(
            overall_score=scores['overall'],
            social_media_risk=scores['social_media'],
            data_exposure_risk=scores['data_exposure'],
            privacy_settings_risk=scores['privacy_settings'],
            risk_factors=[RiskFactor(**rf) for rf in risk_factors],
            recommendations=recommendations,
            analysis_date=analysis.analysis_date,
            algorithm_version=analysis.algorithm_version
        )
    
    async def get_analysis_summary(self, user_id: int) -> AnalysisSummary:
        """Get quick analysis summary"""
        analysis = await self.repository.get_latest_analysis(user_id)
        
        if not analysis:
            return AnalysisSummary(
                current_score=0,
                risk_category="Not Analyzed",
                key_risks=[],
                urgent_recommendations=[]
            )
        
        # Get risk category
        if analysis.overall_score >= 80:
            risk_category = "Low Risk"
        elif analysis.overall_score >= 60:
            risk_category = "Medium Risk"
        else:
            risk_category = "High Risk"
        
        # Get key risks
        risk_factors = analysis.risk_factors.get('factors', []) if analysis.risk_factors else []
        key_risks = [rf['name'] for rf in risk_factors[:3]]
        
        # Get urgent recommendations
        recommendations = await self.repository.get_recommendations(analysis.id)
        urgent = [rec.title for rec in recommendations if rec.priority == "high"][:3]
        
        return AnalysisSummary(
            current_score=analysis.overall_score,
            risk_category=risk_category,
            key_risks=key_risks,
            urgent_recommendations=urgent
        )
    
    async def get_analysis_history(self, user_id: int) -> List[AnalysisResponse]:
        """Get user's analysis history"""
        analyses = await self.repository.get_analysis_history(user_id)
        
        results = []
        for analysis in analyses:
            recommendations = await self.repository.get_recommendations(analysis.id)
            
            response = AnalysisResponse(
                overall_score=analysis.overall_score,
                social_media_risk=analysis.social_media_risk,
                data_exposure_risk=analysis.data_exposure_risk,
                privacy_settings_risk=analysis.privacy_settings_risk,
                risk_factors=[],
                recommendations=[RecommendationResponse.from_orm(r) for r in recommendations],
                analysis_date=analysis.analysis_date,
                algorithm_version=analysis.algorithm_version
            )
            results.append(response)
        
        return results
