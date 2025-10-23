from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from .database import get_db
from .security import get_current_user
import logging

logger = logging.getLogger(__name__)

async def verify_user_access(
    resource_user_id: int,
    current_user = Depends(get_current_user)
) -> bool:
    """
    Verify that the current user has access to a resource.
    
    Args:
        resource_user_id: User ID that owns the resource
        current_user: Currently authenticated user
        
    Returns:
        True if user has access
        
    Raises:
        HTTPException: If user doesn't have access
    """
    if current_user.id != resource_user_id and not current_user.is_superuser:
        logger.warning(
            f"User {current_user.id} attempted unauthorized access "
            f"to user {resource_user_id}'s resource"
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource"
        )
    return True

class CommonQueryParams:
    """Common query parameters for list endpoints"""
    
    def __init__(
        self,
        skip: int = 0,
        limit: int = 100,
        sort_by: str | None = None,
        sort_order: str = "asc"
    ):
        self.skip = skip
        self.limit = min(limit, 1000)  # Max 1000 items
        self.sort_by = sort_by
        self.sort_order = sort_order
