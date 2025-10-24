from sqlalchemy.orm import Session
from .models import Challenge, CompletedChallenge
from typing import List
import logging

logger = logging.getLogger(__name__)


class ChallengeRepository:
    """Repository for challenge-related database operations"""

    def __init__(self, db: Session):
        self.db = db

    async def get_all_challenges(self) -> List[Challenge]:
        """Get all challenges"""
        return self.db.query(Challenge).all()

    async def get_user_completed_challenges(self, user_id: int) -> List[CompletedChallenge]:
        """Get all challenges completed by a specific user"""
        return (
            self.db.query(CompletedChallenge)
            .filter(CompletedChallenge.user_id == user_id)
            .all()
        )

    async def complete_challenge(self, user_id: int, challenge_id: int) -> CompletedChallenge:
        """Mark a challenge as completed by a user"""
        completed = CompletedChallenge(user_id=user_id, challenge_id=challenge_id)
        self.db.add(completed)
        self.db.commit()
        self.db.refresh(completed)
        logger.info(f"Challenge {challenge_id} completed by user {user_id}")
        return completed
