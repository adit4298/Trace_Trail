from __future__ import annotations

import argparse
import subprocess
import sys
import time
import webbrowser
from pathlib import Path
from shutil import which

PROJECT_ROOT = Path(__file__).resolve().parents[1]
COMPOSE_FILE = PROJECT_ROOT / "docker-compose.yml"
FRONTEND_URL = "http://localhost:3000"


def ensure_prerequisites() -> None:
    missing = [tool for tool in ("docker",) if which(tool) is None]
    if missing:
        raise SystemExit(
            "Missing dependencies: {}. Install Docker Desktop and ensure it is on PATH.".format(
                ", ".join(missing)
            )
        )
    if not COMPOSE_FILE.exists():
        raise SystemExit(f"docker-compose.yml not found at {COMPOSE_FILE}")


def run_compose(detached: bool) -> subprocess.Popen[bytes] | None:
    cmd = ["docker", "compose", "-f", str(COMPOSE_FILE), "up", "--build"]
    if detached:
        cmd.append("-d")
    if detached:
        subprocess.run(cmd, cwd=PROJECT_ROOT, check=True)
        return None
    return subprocess.Popen(cmd, cwd=PROJECT_ROOT)


def wait_for_frontend(timeout: int = 30) -> None:
    start = time.time()
    while time.time() - start < timeout:
        time.sleep(2)
    webbrowser.open(FRONTEND_URL)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="TraceTrail desktop launcher – boots frontend, backend, AI module via Docker."
    )
    parser.add_argument(
        "--detached",
        action="store_true",
        help="Run docker compose in detached mode (recommended for packaged executable).",
    )
    parser.add_argument(
        "--no-browser",
        action="store_true",
        help="Skip automatically opening the dashboard in your default browser.",
    )
    parser.add_argument(
        "--stop",
        action="store_true",
        help="Stop the running TraceTrail stack (docker compose down).",
    )
    return parser.parse_args()


def stop_stack() -> None:
    subprocess.run(
        ["docker", "compose", "-f", str(COMPOSE_FILE), "down"],
        cwd=PROJECT_ROOT,
        check=True,
    )


def main() -> None:
    ensure_prerequisites()
    args = parse_args()

    if args.stop:
        stop_stack()
        print("TraceTrail stack stopped.")
        return

    process = run_compose(detached=args.detached)
    print("TraceTrail stack is starting via docker compose...")

    if not args.no_browser:
        wait_for_frontend()
        print(f"Opening {FRONTEND_URL}")

    if process is not None:
        try:
            process.wait()
        except KeyboardInterrupt:
            print("\nStopping stack...")
            process.terminate()


if __name__ == "__main__":
    try:
        main()
    except subprocess.CalledProcessError as exc:
        print(f"Command failed: {exc}")
        sys.exit(exc.returncode)

