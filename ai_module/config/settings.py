"""
Runtime configuration for the TraceTrail AI module.

The settings object is used across the API layer, services, and notebooks to
ensure we read a single source of truth for environment specific values.
"""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import List, Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Strongly typed application configuration backed by environment variables."""

    model_config = SettingsConfigDict(
        env_prefix="AI_",
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    environment: Literal["local", "staging", "production"] = "local"
    debug: bool = True

    app_name: str = "TraceTrail AI Module"
    app_version: str = "1.1.0"
    log_level: Literal["CRITICAL", "ERROR", "WARNING", "INFO", "DEBUG"] = "INFO"

    ai_api_host: str = "0.0.0.0"
    ai_api_port: int = 8082
    ai_api_reload: bool = True

    api_key: str | None = None
    cors_origins: List[str] = Field(default_factory=lambda: ["*"])

    telemetry_sample_rate: float = Field(default=0.1, ge=0.0, le=1.0)
    request_timeout_seconds: int = Field(default=15, ge=1, le=60)

    model_config_path: Path = Field(
        default=Path(__file__).with_name("model_config.json")
    )
    dataset_dir: Path = Field(
        default=Path(__file__).resolve().parent.parent / "data"
    )
    log_dir: Path = Field(
        default=Path(__file__).resolve().parent.parent / "logs"
    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached Settings instance to avoid repeatedly reading env files."""
    return Settings()


__all__ = ["Settings", "get_settings"]