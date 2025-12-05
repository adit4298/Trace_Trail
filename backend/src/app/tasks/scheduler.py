"""Background scheduler for automated syncs."""

from __future__ import annotations

from apscheduler.schedulers.background import BackgroundScheduler

from ..core.config import Settings
from ..db.session import session_scope
from ..oauth import build_oauth_registry
from ..services.health_service import SystemHealthService
from ..services.sync_service import SyncService


class SyncScheduler:
    """Runs automated sync jobs on a fixed cadence."""

    def __init__(self, settings: Settings):
        self.settings = settings
        self.scheduler = BackgroundScheduler(timezone="UTC")
        self.started = False

    def start(self) -> None:
        if self.started:
            return
        self.scheduler.add_job(self._run_job, "interval", hours=self.settings.SYNC_INTERVAL_HOURS, max_instances=1)
        self.scheduler.start()
        self.started = True

    def stop(self) -> None:
        if not self.started:
            return
        self.scheduler.shutdown(wait=False)
        self.started = False

    def _run_job(self) -> None:
        registry = build_oauth_registry(self.settings)
        with session_scope() as session:
            health_service = SystemHealthService(db=session)
            sync_service = SyncService(db=session, oauth_registry=registry, health_service=health_service)
            sync_service.sync_all_connected_users()

