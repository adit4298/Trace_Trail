"""
FastAPI routes for AI module.
Exposes ML models as REST API endpoints.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List
import logging

from .schemas import (
    RiskScoreRequest,
    RiskScoreResponse,
    RecommendationRequest,
    RecommendationResponse,
    TrendAnalysisRequest,
    TrendAnalysisResponse,
    HealthCheckResponse
)
from ..models.risk_scorer import RiskScorer
from ..models.recommender import Recommender
from ..models.trend_analyzer import TrendAnalyzer
from ..utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/api/ai", tags=["AI Module"])

# Initialize models (in production, these would be loaded from saved models)
risk_scorer = RiskScorer(model_type='rule_based')
recommender = Recommender()
trend_analyzer = TrendAnalyzer()

@router.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """
    Health check endpoint.

    Returns:
        Service health status
    """
    return {
        'status': 'healthy',
        'service': 'TraceTrail AI Module',
        'version': '1.0.0'
    }

@router.post("/risk-score", response_model=RiskScoreResponse)
async def calculate_risk_score(request: RiskScoreRequest):
    """
    Calculate privacy risk score for a user.

    Args:
        request: Risk score calculation request

    Returns:
        Calculated risk score with breakdown
    """
    try:
        logger.info(f"Calculating risk score for user {request.user_id}")
        # Calculate risk score
        result = risk_scorer.calculate_risk_score(
            user_data=request.user_data.dict(),
            connections=[c.dict() for c in request.connections],
            activities=[a.dict() for a in request.activities] if request.activities else None
        )
        return RiskScoreResponse(
            user_id=request.user_id,
            overall_score=result['overall_score'],
            category=result['category'],
            breakdown=result['breakdown'],
            top_risk_factors=result['recommendations']
        )

    except Exception as e:
        logger.error(f"Error calculating risk score: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recommendations", response_model=List[RecommendationResponse])
async def get_recommendations(request: RecommendationRequest):
    """
    Get personalized privacy recommendations.

    Args:
        request: Recommendation request

    Returns:
        List of recommendations
    """
    try:
        logger.info(f"Generating recommendations for user {request.user_id}")
        # Generate recommendations
        recommendations = recommender.generate_recommendations(
            risk_score=request.risk_score,
            risk_breakdown=request.risk_breakdown,
            connections=[c.dict() for c in request.connections],
            max_recommendations=request.max_recommendations
        )

        return [RecommendationResponse(**rec) for rec in recommendations]

    except Exception as e:
        logger.error(f"Error generating recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/trend-analysis", response_model=TrendAnalysisResponse)
async def analyze_trend(request: TrendAnalysisRequest):
    """
    Analyze risk score trends.

    Args:
        request: Trend analysis request

    Returns:
        Trend analysis results
    """
    try:
        logger.info(f"Analyzing trend for user {request.user_id}")

        # Analyze trend
        result = trend_analyzer.analyze_trend(
            [s.dict() for s in request.score_history]
        )

        return TrendAnalysisResponse(
            user_id=request.user_id,
            trend=result['trend'],
            direction=result['direction'],
            rate_of_change=result['rate_of_change'],
            predicted_score_7d=result['predicted_score_7d'],
            predicted_score_30d=result['predicted_score_30d'],
            data_points=result['data_points']
        )

    except Exception as e:
        logger.error(f"Error analyzing trend: {e}")
        raise HTTPException(status_code=500, detail=str(e))