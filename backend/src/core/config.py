from functools import lru_cache
from typing import List, Literal

from pydantic import PostgresDsn, SecretStr, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application configuration settings loaded from environment variables.
    Uses Pydantic for validation and type checking.
    """

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

    # Application Settings
    APP_NAME: str = "TraceTrail API"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: Literal["development", "staging", "production"] = "development"
    DEBUG: bool = True
    SHOW_DOCS: bool = True

    # Database Configuration
    DB_USER: str = "postgres"
    DB_PASSWORD: SecretStr = SecretStr("postgres")
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "trace_trail"
    DATABASE_URL: PostgresDsn | None = None
    DB_ECHO: bool = False  # Set to True for SQL query logging

    # Security Settings
    SECRET_KEY: str = "change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # Middleware / HTTP concerns
    CORS_ORIGINS: List[str] | str = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://app.tracetrail.in",
    ]
    TRUSTED_HOSTS: List[str] = ["*"]
    ENABLE_RATE_LIMITS: bool = False
    RATE_LIMIT_MAX_REQUESTS: int = 100
    REQUEST_ID_HEADER: str = "X-Request-ID"
    ENABLE_SECURE_HEADERS: bool = True

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
    @classmethod
    def parse_cors_origins(cls, value):
        """Parse CORS origins from string or list."""
        if isinstance(value, str):
            value = value.strip()
            if value.startswith("["):
                import json

                try:
                    return json.loads(value)
                except json.JSONDecodeError:
                    pass
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @model_validator(mode="after")
    def assemble_database_url(self):
        if not self.DATABASE_URL:
            self.DATABASE_URL = PostgresDsn.build(
                scheme="postgresql+psycopg2",
                username=self.DB_USER,
                password=self.DB_PASSWORD.get_secret_value(),
                host=self.DB_HOST,
                port=str(self.DB_PORT),
                path=f"/{self.DB_NAME}",
            )
        return self


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached Settings instance."""
    return Settings()


# Backwards compatibility import for modules that expect a module-level settings object
settings = get_settings()
