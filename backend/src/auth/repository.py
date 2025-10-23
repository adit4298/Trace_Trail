from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from .models import User
from src.shared.exceptions import EmailAlreadyExists, UsernameAlreadyExists, UserNotFound
import logging

logger = logging.getLogger(__name__)

class AuthRepository:
    """
    Repository for authentication-related database operations.
    Handles all database queries for user authentication.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    async def create_user(
        self,
        email: str,
        username: str,
        hashed_password: str,
        full_name: str | None = None
    ) -> User:
        """
        Create a new user in the database.
        
        Args:
            email: User's email address
            username: User's username
            hashed_password: Bcrypt hashed password
            full_name: User's full name (optional)
            
        Returns:
            Created User object
            
        Raises:
            EmailAlreadyExists: If email is already registered
            UsernameAlreadyExists: If username is already taken
        """
        try:
            user = User(
                email=email,
                username=username,
                hashed_password=hashed_password,
                full_name=full_name
            )
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
            
            logger.info(f"User created successfully: {user.email}")
            return user
            
        except IntegrityError as e:
            self.db.rollback()
            logger.error(f"User creation failed: {e}")
            
            # Check which constraint was violated
            if "email" in str(e.orig):
                raise EmailAlreadyExists()
            elif "username" in str(e.orig):
                raise UsernameAlreadyExists()
            else:
                raise
    
    async def get_user_by_email(self, email: str) -> User | None:
        """
        Retrieve a user by email address.
        
        Args:
            email: User's email address
            
        Returns:
            User object if found, None otherwise
        """
        return self.db.query(User).filter(User.email == email).first()
    
    async def get_user_by_username(self, username: str) -> User | None:
        """
        Retrieve a user by username.
        
        Args:
            username: User's username
            
        Returns:
            User object if found, None otherwise
        """
        return self.db.query(User).filter(User.username == username).first()
    
    async def get_user_by_id(self, user_id: int) -> User | None:
        """
        Retrieve a user by ID.
        
        Args:
            user_id: User's ID
            
        Returns:
            User object if found, None otherwise
        """
        return self.db.query(User).filter(User.id == user_id).first()
    
    async def update_user_password(self, user_id: int, hashed_password: str) -> User:
        """
        Update a user's password.
        
        Args:
            user_id: User's ID
            hashed_password: New hashed password
            
        Returns:
            Updated User object
            
        Raises:
            UserNotFound: If user doesn't exist
        """
        user = await self.get_user_by_id(user_id)
        if not user:
            raise UserNotFound()
        
        user.hashed_password = hashed_password
        self.db.commit()
        self.db.refresh(user)
        
        logger.info(f"Password updated for user: {user.email}")
        return user
    
    async def deactivate_user(self, user_id: int) -> User:
        """
        Deactivate a user account.
        
        Args:
            user_id: User's ID
            
        Returns:
            Updated User object
            
        Raises:
            UserNotFound: If user doesn't exist
        """
        user = await self.get_user_by_id(user_id)
        if not user:
            raise UserNotFound()
        
        user.is_active = False
        self.db.commit()
        self.db.refresh(user)
        
        logger.info(f"User deactivated: {user.email}")
        return user
