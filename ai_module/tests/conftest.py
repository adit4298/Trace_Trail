"""
Shared pytest fixtures for the ai_module test suite.
"""

from __future__ import annotations

from pathlib import Path
from typing import Generator

import pytest


@pytest.fixture(scope="session", autouse=True)
def set_package_root() -> Generator[None, None, None]:
    """
    Ensure the repository root is on sys.path so package imports like
    ``import ai_module...`` work regardless of where pytest is invoked.
    """
    import sys

    repo_root = Path(__file__).resolve().parents[1]
    if str(repo_root) not in sys.path:
        sys.path.insert(0, str(repo_root))
    yield


@pytest.fixture(scope="session")
def fixtures_path() -> Path:
    """Provide a common path to the fixtures directory when needed."""
    return Path(__file__).resolve().parent / "fixtures"

