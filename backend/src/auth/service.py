from sqlalchemy.orm import Session
from datetime import timedelta
from .repository import AuthRepository
from .schemas import UserCreate, UserLogin, TokenResponse, PasswordChange
from src.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token
)
from src.shared.exceptions import InvalidCredentials, UserNotFound
from src.core.config import settings
import logging

logger = logging.getLogger(__name__)

class AuthService:
    """
    Service layer for authentication business logic.
    Coordinates between repository and external services.
    """
    
    def __init__(self, db: Session):
        self.repository = AuthRepository(db)
    
    async def register_user(self, user_data: UserCreate) -> TokenResponse:
        """
        Register a new user and return authentication tokens.
        
        Args:
            user_data: User registration data
            
        Returns:
            TokenResponse with access and refresh tokens
        """
        # Hash the password
        hashed_password = get_password_hash(user_data.password)
        
        # Create user in database
        user = await self.repository.create_user(
            email=user_data.email,
            username=user_data.username,
            hashed_password=hashed_password,
            full_name=user_data.full_name
        )
        
        # Generate tokens
        access_token = create_access_token({"sub": user.id})
        refresh_token = create_refresh_token({"sub": user.id})
        
        logger.info(f"User registered and tokens generated: {user.email}")
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token
        )
    
    async def login_user(self, login_data: UserLogin) -> TokenResponse:
        """
        Authenticate user and return tokens.
        
        Args:
            login_data: User login credentials
            
        Returns:
            TokenResponse with access and refresh tokens
            
        Raises:
            InvalidCredentials: If credentials are invalid
        """
        # Get user by email
        user = await self.repository.get_user_by_email(login_data.email)
        
        # Verify user exists and password is correct
        if not user or not verify_password(login_data.password, user.hashed_password):
            logger.warning(f"Failed login attempt for email: {login_data.email}")
            raise InvalidCredentials()
        
        # Check if user is active
        if not user.is_active:
            logger.warning(f"Inactive user login attempt: {user.email}")
            raise InvalidCredentials("Account is inactive")
        
        # Generate tokens
        access_token = create_access_token({"sub": user.id})
        refresh_token = create_refresh_token({"sub": user.id})
        
        logger.info(f"User logged in successfully: {user.email}")
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token
        )
    
    async def refresh_access_token(self, refresh_token: str) -> TokenResponse:
        """
        Generate new access token from refresh token.
        
        Args:
            refresh_token: Valid refresh token
            
        Returns:
            TokenResponse with new access token
            
        Raises:
            InvalidCredentials: If refresh token is invalid
        """
        # Decode refresh token
        payload = decode_token(refresh_token)
        
        # Verify token type
        if payload.get("type") != "refresh":
            raise InvalidCredentials("Invalid token type")
        
        user_id = payload.get("sub")
        if not user_id:
            raise InvalidCredentials("Invalid token payload")
        
        # Verify user exists
        user = await self.repository.get_user_by_id(user_id)
        if not user:
            raise UserNotFound()
        
        # Generate new tokens
        access_token = create_access_token({"sub": user.id})
        new_refresh_token = create_refresh_token({"sub": user.id})
        
        logger.info(f"Tokens refreshed for user: {user.email}")
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token
        )
    
    async def change_password(
        self,
        user_id: int,
        password_data: PasswordChange
    ) -> dict:
        """
        Change user password.
        
        Args:
            user_id: User's ID
            password_data: Old and new password
            
        Returns:
            Success message
            
        Raises:
            UserNotFound: If user doesn't exist
            InvalidCredentials: If old password is incorrect
        """
        # Get user
        user = await self.repository.get_user_by_id(user_id)
        if not user:
            raise UserNotFound()
        
        # Verify old password
        if not verify_password(password_data.old_password, user.hashed_password):
            raise InvalidCredentials("Current password is incorrect")
        
        # Hash new password
        new_hashed_password = get_password_hash(password_data.new_password)
        
        # Update password
        await self.repository.update_user_password(user_id, new_hashed_password)
        
        logger.info(f"Password changed for user: {user.email}")
        
        return {"message": "Password changed successfully"}
