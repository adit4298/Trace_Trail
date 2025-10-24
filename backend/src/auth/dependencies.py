from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.core.database import get_db
from src.core.security import get_current_user
from src.auth.models import User
import logging

logger = logging.getLogger(__name__)


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to ensure user is active.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        User object if active
        
    Raises:
        HTTPException: If user is inactive
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account"
        )
    return current_user


async def get_current_superuser(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to restrict access to superusers only.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        User object if superuser
        
    Raises:
        HTTPException: If user is not a superuser
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Superuser access required."
        )
    return current_user


async def verify_user_owns_resource(
    resource_user_id: int,
    current_user: User = Depends(get_current_user)
) -> bool:
    """
    Verify that the current user owns the resource.
    
    Args:
        resource_user_id: User ID that owns the resource
        current_user: Currently authenticated user
        
    Returns:
        True if user owns resource or is superuser
        
    Raises:
        HTTPException: If user doesn't own resource
    """
    if current_user.id != resource_user_id and not current_user.is_superuser:
        logger.warning(
            f"User {current_user.id} attempted unauthorized access "
            f"to resource owned by user {resource_user_id}"
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource"
        )
    return True
