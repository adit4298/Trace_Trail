"""Application settings for the refactored backend."""

from __future__ import annotations

from functools import lru_cache
from typing import List, Literal, Sequence

from pydantic import PostgresDsn, SecretStr, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central configuration loaded from environment variables."""

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

    # App
    APP_NAME: str = "TraceTrail Digital Identity API"
    APP_VERSION: str = "2.0.0"
    ENVIRONMENT: Literal["development", "staging", "production"] = "development"
    DEBUG: bool = True
    SHOW_DOCS: bool = True
    FRONTEND_APP_URL: str = "http://localhost:3000"
    FRONTEND_OAUTH_CALLBACK_URL: str = "http://localhost:3000/oauth/callback"

    # Database
    DB_USER: str = "postgres"
    DB_PASSWORD: SecretStr = SecretStr("postgres")
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "trace_trail"
    DATABASE_URL: PostgresDsn | None = None
    DB_ECHO: bool = False

    # Security & auth
    JWT_SECRET_KEY: str = "change-me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ENCRYPTION_KEY: str = "jS5oYjoPLD114F8bGZ4HzyBbs6k8ZZrVSu2Ce279b9k="
    OAUTH_STATE_SECRET: str = "state-secret"

    # OAuth client configuration
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: SecretStr = SecretStr("")
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/auth/google/callback"

    INSTAGRAM_CLIENT_ID: str = ""
    INSTAGRAM_CLIENT_SECRET: SecretStr = SecretStr("")
    INSTAGRAM_REDIRECT_URI: str = "http://localhost:8000/auth/instagram/callback"

    FACEBOOK_CLIENT_ID: str = ""
    FACEBOOK_CLIENT_SECRET: SecretStr = SecretStr("")
    FACEBOOK_REDIRECT_URI: str = "http://localhost:8000/auth/facebook/callback"

    TWITTER_CLIENT_ID: str = ""
    TWITTER_CLIENT_SECRET: SecretStr = SecretStr("")
    TWITTER_REDIRECT_URI: str = "http://localhost:8000/auth/twitter/callback"

    # Scheduler
    SYNC_INTERVAL_HOURS: int = 6

    # HTTP / middleware
    CORS_ORIGINS: Sequence[str] | str = (
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://app.tracetrail.in",
    )

    TRUSTED_HOSTS: Sequence[str] = ("*",)

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: Sequence[str] | str) -> List[str]:
        if isinstance(value, str):
            value = value.strip()
            if value.startswith("["):
                import json

                try:
                    return json.loads(value)
                except json.JSONDecodeError:
                    return [value]
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return list(value)

    @model_validator(mode="after")
    def build_database_url(self) -> "Settings":
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
    """Return cached settings."""

    settings = Settings()
    return settings


settings = get_settings()

