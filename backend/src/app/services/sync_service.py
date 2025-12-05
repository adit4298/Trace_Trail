"""Services responsible for syncing OAuth providers and detecting anomalies."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Dict, List

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..core.constants import SEVERITY_LABELS, SUPPORTED_PROVIDERS
from ..models import Anomaly, OAuthConnection, Signal, User, UserProfile
from ..oauth import BaseOAuthClient
from ..utils.crypto import decrypt_token, encrypt_token
from .activity_service import record_activity
from .health_service import SystemHealthService


@dataclass
class SyncResult:
    provider: str
    synced_signals: int
    detected_anomalies: int


class SyncService:
    """Orchestrates sync flows for all providers."""

    def __init__(self, db: Session, oauth_registry: Dict[str, BaseOAuthClient], health_service: SystemHealthService):
        self.db = db
        self.oauth_registry = oauth_registry
        self.health_service = health_service

    def sync_provider(self, user: User, provider: str) -> SyncResult:
        provider = provider.lower()
        if provider not in SUPPORTED_PROVIDERS:
            raise ValueError(f"Unsupported provider {provider}")

        connection = self.db.scalar(
            select(OAuthConnection).where(OAuthConnection.user_id == user.id, OAuthConnection.provider == provider)
        )
        if not connection:
            raise ValueError("Provider not connected")

        client = self.oauth_registry[provider]
        access_token = decrypt_token(connection.access_token)
        refresh_token = decrypt_token(connection.refresh_token) if connection.refresh_token else None

        if connection.expires_at and connection.expires_at < datetime.now(timezone.utc) and refresh_token:
            tokens = client.refresh_access_token(refresh_token)
            access_token = tokens.access_token
            if tokens.refresh_token:
                refresh_token = tokens.refresh_token
            connection.access_token = encrypt_token(access_token)
            if refresh_token:
                connection.refresh_token = encrypt_token(refresh_token)
            connection.expires_at = tokens.expires_at
            connection.scope = tokens.scope

        profile_data = client.fetch_profile(access_token)
        metadata = client.fetch_metadata(access_token)

        self._upsert_profile(user_id=user.id, provider=provider, profile_data=profile_data, raw_metadata=metadata)
        signals = self._store_signals(user_id=user.id, provider=provider, metadata=metadata)
        anomalies = self._detect_anomalies(user_id=user.id, provider=provider, signals=signals)

        connection.updated_at = datetime.now(timezone.utc)
        self.db.add(connection)

        self.health_service.update_score(user.id)

        record_activity(
            self.db,
            user_id=user.id,
            action_type="sync_finished",
            message=f"Synced {provider} account",
            metadata={"signals": len(signals), "anomalies": len(anomalies)},
        )
        self.db.commit()
        return SyncResult(provider=provider, synced_signals=len(signals), detected_anomalies=len(anomalies))

    def sync_all_for_user(self, user: User) -> List[SyncResult]:
        results = []
        for provider in SUPPORTED_PROVIDERS:
            connection = self.db.scalar(
                select(OAuthConnection).where(OAuthConnection.user_id == user.id, OAuthConnection.provider == provider)
            )
            if connection:
                try:
                    results.append(self.sync_provider(user, provider))
                except Exception as exc:  # pylint: disable=broad-except
                    record_activity(
                        self.db,
                        user_id=user.id,
                        action_type="sync_error",
                        message=f"{provider} sync failed",
                        metadata={"error": str(exc)},
                    )
                    self.db.rollback()
        return results

    def sync_all_connected_users(self) -> None:
        user_ids = [
            row[0]
            for row in self.db.execute(
                select(OAuthConnection.user_id).distinct()
            )
        ]
        for user_id in user_ids:
            user = self.db.get(User, user_id)
            if user:
                self.sync_all_for_user(user)

    def _upsert_profile(self, user_id, provider: str, profile_data: dict, raw_metadata: dict) -> None:
        profile = self.db.scalar(
            select(UserProfile).where(UserProfile.user_id == user_id, UserProfile.platform == provider)
        )
        if profile:
            profile.username = profile_data.get("username")
            profile.full_name = profile_data.get("name")
            profile.email = profile_data.get("email")
            profile.profile_image_url = profile_data.get("picture")
            profile.followers = profile_data.get("followers")
            profile.following = profile_data.get("following")
            profile.posts_count = profile_data.get("posts")
            profile.raw_json = raw_metadata
            profile.synced_at = datetime.now(timezone.utc)
        else:
            profile = UserProfile(
                user_id=user_id,
                platform=provider,
                platform_user_id=profile_data.get("id"),
                username=profile_data.get("username"),
                full_name=profile_data.get("name"),
                email=profile_data.get("email"),
                profile_image_url=profile_data.get("picture"),
                followers=profile_data.get("followers"),
                following=profile_data.get("following"),
                posts_count=profile_data.get("posts"),
                raw_json=raw_metadata,
            )
            self.db.add(profile)
        self.db.flush()

    def _store_signals(self, user_id, provider: str, metadata: dict | None) -> List[Signal]:
        metadata = metadata or {}
        activities = metadata.get("activities") or metadata.get("events") or []
        if not activities:
            fallback = metadata.get("data") or metadata.get("items")
            if isinstance(fallback, list):
                activities = fallback
        if isinstance(metadata, list):
            activities = metadata
        stored: List[Signal] = []
        for activity in activities:
            if not isinstance(activity, dict):
                continue
            severity = activity.get("severity", 3)
            severity = max(1, min(5, int(severity)))
            signal = Signal(
                user_id=user_id,
                provider=provider,
                category=activity.get("category", "activity"),
                title=activity.get("title", f"{provider.title()} activity"),
                description=activity.get("description"),
                severity=severity,
                metadata=activity,
            )
            self.db.add(signal)
            stored.append(signal)
        self.db.flush()
        return stored

    def _detect_anomalies(self, user_id, provider: str, signals: List[Signal]) -> List[Anomaly]:
        anomalies: List[Anomaly] = []
        now = datetime.now(timezone.utc)
        cutoff = now - timedelta(hours=12)

        recent_high = [
            s for s in signals if s.severity >= 4 or (s.metadata or {}).get("is_unusual")
        ]
        for signal in recent_high:
            anomaly = Anomaly(
                user_id=user_id,
                provider=provider,
                signal_id=signal.id,
                anomaly_type="high_severity_signal",
                confidence_score=min(1.0, 0.6 + (signal.severity * 0.08)),
                risk_level=signal.severity,
                details={"reason": SEVERITY_LABELS.get(signal.severity, "medium"), "metadata": signal.metadata},
            )
            self.db.add(anomaly)
            anomalies.append(anomaly)

        # Detect rapid repeated logins
        rapid_logins = [s for s in signals if s.category == "login" and (s.metadata or {}).get("timestamp")]
        recent_logins = []
        for signal in rapid_logins:
            timestamp_str = (signal.metadata or {}).get("timestamp")
            try:
                timestamp = datetime.fromisoformat(timestamp_str)
                if timestamp.tzinfo is None:
                    timestamp = timestamp.replace(tzinfo=timezone.utc)
            except (TypeError, ValueError):
                continue
            if timestamp >= cutoff:
                recent_logins.append(signal)
        if len(recent_logins) >= 5:
            anomaly = Anomaly(
                user_id=user_id,
                provider=provider,
                signal_id=recent_logins[-1].id,
                anomaly_type="rapid_login_spike",
                confidence_score=0.75,
                risk_level=4,
                details={
                    "count": len(recent_logins),
                    "window_hours": 12,
                },
            )
            self.db.add(anomaly)
            anomalies.append(anomaly)

        self.db.flush()
        return anomalies

