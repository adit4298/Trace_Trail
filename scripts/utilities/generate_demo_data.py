#!/usr/bin/env python3
"""
High level helper to seed the database and create additional demo users.

Usage:
    python scripts/utilities/generate_demo_data.py --extra-users 5
"""

from __future__ import annotations

import argparse
import subprocess
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]


def run(cmd: list[str]) -> None:
    print(f"→ {' '.join(cmd)}")
    subprocess.run(cmd, check=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Trace Trail demo data.")
    parser.add_argument(
        "--extra-users",
        type=int,
        default=0,
        help="Number of additional demo users to create after seeding base data.",
    )
    args = parser.parse_args()

    seed_script = ROOT / "database" / "seed_data.py"
    run([sys.executable, str(seed_script)])

    if args.extra_users > 0:
        user_script = ROOT / "utilities" / "create_demo_users.py"
        run([sys.executable, str(user_script), "--count", str(args.extra_users)])

    print("✔ Demo data ready.")


if __name__ == "__main__":
    main()
