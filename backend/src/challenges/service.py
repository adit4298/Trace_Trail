from sqlalchemy.orm import Session
from .repository import ChallengeRepository
from .schemas import ChallengeResponse, UserProgress
from typing import List
import logging

logger = logging.getLogger(__name__)


class ChallengeService:
    """Service layer for challenge-related business logic"""

    def __init__(self, db: Session):
        self.repository = ChallengeRepository(db)

    async def get_all_challenges(self, user_id: int) -> List[ChallengeResponse]:
        """Get all challenges with completion status for a user"""
        challenges = await self.repository.get_all_challenges()
        completed = await self.repository.get_user_completed_challenges(user_id)
        completed_ids = {c.challenge_id for c in completed}

        result = []
        for challenge in challenges:
            challenge_dict = {
                "id": challenge.id,
                "title": challenge.title,
                "description": challenge.description,
                "category": challenge.category,
                "difficulty": challenge.difficulty,
                "points": challenge.points,
                "badge_name": challenge.badge_name,
                "is_completed": challenge.id in completed_ids,
            }
            result.append(ChallengeResponse(**challenge_dict))
        return result

    async def complete_challenge(self, user_id: int, challenge_id: int) -> ChallengeResponse:
        """Mark a challenge as completed by a user"""
        completed = await self.repository.complete_challenge(user_id, challenge_id)
        return ChallengeResponse(
            id=completed.challenge.id,
            title=completed.challenge.title,
            description=completed.challenge.description,
            category=completed.challenge.category,
            difficulty=completed.challenge.difficulty,
            points=completed.challenge.points,
            badge_name=completed.challenge.badge_name,
            is_completed=True,
        )

    async def get_user_progress(self, user_id: int) -> UserProgress:
        """Compute user's progress across all challenges"""
        all_challenges = await self.repository.get_all_challenges()
        completed = await self.repository.get_user_completed_challenges(user_id)

        total_points = sum(c.challenge.points for c in completed)
        completed_count = len(completed)
        total_count = len(all_challenges)
        percentage = (completed_count / total_count * 100) if total_count > 0 else 0
        badges = list({c.challenge.badge_name for c in completed if c.challenge.badge_name})

        return UserProgress(
            total_points=total_points,
            challenges_completed=completed_count,
            total_challenges=total_count,
            completion_percentage=round(percentage, 2),
            badges_earned=badges,
        )
