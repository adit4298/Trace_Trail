"""
FastAPI routes for AI module.
Exposes ML models as REST API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException
from typing import List

from .dependencies import get_pipeline, rate_limit_check, verify_api_key
from .schemas import (
    HealthCheckResponse,
    RecommendationRequest,
    RecommendationResponse,
    RiskScoreRequest,
    RiskScoreResponse,
    TrendAnalysisRequest,
    TrendAnalysisResponse
)
from ..services import AIPipeline
from ..utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/api/ai", tags=["AI Module"])

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

@router.post(
    "/risk-score",
    response_model=RiskScoreResponse,
    dependencies=[Depends(rate_limit_check), Depends(verify_api_key)]
)
async def calculate_risk_score(
    request: RiskScoreRequest,
    pipeline: AIPipeline = Depends(get_pipeline)
):
    """
    Calculate privacy risk score for a user.

    Args:
        request: Risk score calculation request

    Returns:
        Calculated risk score with breakdown
    """
    try:
        logger.info("Calculating risk score for user_id=%s", request.user_id)
        result = pipeline.score_user(
            user_data=request.user_data.model_dump(exclude_none=True),
            connections=[c.model_dump(exclude_none=True) for c in request.connections],
            activities=[a.model_dump(exclude_none=True) for a in request.activities] if request.activities else None
        )
        return RiskScoreResponse(user_id=request.user_id, **result)

    except Exception as e:
        logger.error(f"Error calculating risk score: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post(
    "/recommendations",
    response_model=List[RecommendationResponse],
    dependencies=[Depends(rate_limit_check), Depends(verify_api_key)]
)
async def get_recommendations(
    request: RecommendationRequest,
    pipeline: AIPipeline = Depends(get_pipeline)
):
    """
    Get personalized privacy recommendations.

    Args:
        request: Recommendation request

    Returns:
        List of recommendations
    """
    try:
        logger.info("Generating recommendations for user_id=%s", request.user_id)
        recommendations = pipeline.recommend(
            risk_score=request.risk_score,
            risk_breakdown=request.risk_breakdown,
            connections=[c.model_dump(exclude_none=True) for c in request.connections],
            max_recommendations=request.max_recommendations
        )
        return [RecommendationResponse(**rec) for rec in recommendations]

    except Exception as e:
        logger.error(f"Error generating recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post(
    "/trend-analysis",
    response_model=TrendAnalysisResponse,
    dependencies=[Depends(rate_limit_check), Depends(verify_api_key)]
)
async def analyze_trend(
    request: TrendAnalysisRequest,
    pipeline: AIPipeline = Depends(get_pipeline)
):
    """
    Analyze risk score trends.

    Args:
        request: Trend analysis request

    Returns:
        Trend analysis results
    """
    try:
        logger.info("Analyzing trend for user_id=%s", request.user_id)
        result = pipeline.analyze_trends([s.model_dump(exclude_none=True) for s in request.score_history])
        return TrendAnalysisResponse(user_id=request.user_id, **result)

    except Exception as e:
        logger.error(f"Error analyzing trend: {e}")
        raise HTTPException(status_code=500, detail=str(e))