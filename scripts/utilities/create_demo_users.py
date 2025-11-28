#!/usr/bin/env python3
"""
Create disposable demo users directly in the database.

Usage:
    python scripts/utilities/create_demo_users.py --count 5
"""

from __future__ import annotations

import argparse
from datetime import datetime
from pathlib import Path
import sys

ROOT_DIR = Path(__file__).resolve().parents[2] / "backend"
sys.path.insert(0, str(ROOT_DIR))

from src.core.database import SessionLocal  # type: ignore # noqa: E402
from src.core.security import get_password_hash  # type: ignore # noqa: E402
from src.auth.models import User  # type: ignore # noqa: E402


def create_users(count: int) -> None:
    session = SessionLocal()
    try:
        for idx in range(count):
            suffix = datetime.utcnow().strftime("%Y%m%d%H%M%S") + f"{idx:02d}"
            email = f"demo_{suffix}@tracetrail.com"
            user = User(
                email=email,
                username=f"demo_{suffix}",
                full_name=f"Demo User {idx + 1}",
                hashed_password=get_password_hash("ChangeMe123!"),
                is_active=True,
                is_superuser=False,
            )
            session.add(user)
        session.commit()
        print(f"✔ Created {count} demo users.")
    except Exception as exc:  # noqa: BLE001
        session.rollback()
        raise SystemExit(f"Failed to create users: {exc}") from exc
    finally:
        session.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Create demo users.")
    parser.add_argument("--count", type=int, default=3, help="Number of users to create.")
    args = parser.parse_args()
    create_users(args.count)


if __name__ == "__main__":
    main()
