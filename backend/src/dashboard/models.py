# Users use the same User model from auth.models

# No additional models needed for basic user management

from src.auth.models import User

__all__ = ["User"]
