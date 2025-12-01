from __future__ import annotations

import sys
from pathlib import Path
from typing import Generator

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from src.core.app import create_app
from src.core.config import Settings, get_settings

PROJECT_ROOT = Path(__file__).resolve().parents[1]
SRC_PATH = PROJECT_ROOT / "src"

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


@pytest.fixture(scope="session")
def test_settings() -> Settings:
    base_settings = get_settings()
    return base_settings.model_copy(update={"DEBUG": False, "SHOW_DOCS": False})


@pytest.fixture(scope="session")
def app(test_settings: Settings) -> FastAPI:
    """Return a FastAPI application instance for tests."""
    return create_app(custom_settings=test_settings)


@pytest.fixture(scope="session")
def client(app: FastAPI) -> Generator[TestClient, None, None]:
    with TestClient(app) as test_client:
        yield test_client
