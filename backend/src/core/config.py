from pydantic import PostgresDsn, field_validator
from pydantic_settings import BaseSettings
from typing import Literal, List


class Settings(BaseSettings):
    """
    Application configuration settings loaded from environment variables.
    Uses Pydantic for validation and type checking.
    """
    
    # Application Settings
    APP_NAME: str = "TraceTrail API"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: Literal["development", "staging", "production"] = "development"
    DEBUG: bool = True
    
    # Database Configuration
    DATABASE_URL: PostgresDsn
    DB_ECHO: bool = False  # Set to True for SQL query logging
    
    # Security Settings
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]
    
    # API Documentation
    SHOW_DOCS: bool = True
    
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = True
    
    # External Services
    SOCIAL_MEDIA_API_KEY: str | None = None

    # Extension feature flags and settings (added)
    EXTENSION_ENABLED: bool = False
    EXTENSION_WEBSOCKET_ENABLED: bool = False
    EXTENSION_API_VERSION: str = "1.0"
    EXTENSION_RATE_LIMIT: int = 100

    @field_validator("CORS_ORIGINS", mode="before")
    def parse_cors_origins(cls, value):
        """Parse CORS origins from string or list"""
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",")]
        return value
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"


# Global settings instance
settings = Settings()
