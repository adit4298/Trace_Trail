from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class ChallengeResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    difficulty: str
    points: int
    badge_name: Optional[str] = None
    is_completed: bool = False

    class Config:
        from_attributes = True


class CompletedChallengeResponse(BaseModel):
    id: int
    challenge_id: int
    completed_at: datetime

    class Config:
        from_attributes = True


class UserProgress(BaseModel):
    total_points: int
    challenges_completed: int
    total_challenges: int
    completion_percentage: float
    badges_earned: List[str]
