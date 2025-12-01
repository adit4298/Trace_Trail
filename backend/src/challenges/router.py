from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from .schemas import ChallengeResponse, UserProgress
from .service import ChallengeService
from src.auth.models import User
from src.core.database import get_db
from src.core.security import get_current_user

router = APIRouter(prefix="/api/challenges", tags=["Challenges"])


@router.get("/", response_model=List[ChallengeResponse])
async def get_challenges(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all challenges with user's completion status"""
    service = ChallengeService(db)
    return await service.get_all_challenges(current_user.id)


@router.post("/{challenge_id}/complete")
async def complete_challenge(
    challenge_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark a challenge as completed by the current user"""
    service = ChallengeService(db)
    await service.complete_challenge(current_user.id, challenge_id)
    return {"message": "Challenge completed"}


@router.get("/progress", response_model=UserProgress)
async def get_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current user's progress across all challenges"""
    service = ChallengeService(db)
    return await service.get_user_progress(current_user.id)
