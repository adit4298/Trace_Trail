import numpy as np
from typing import Dict, Any, List, Tuple
from sklearn.ensemble import IsolationForest
import logging
logger = logging.getLogger(__name__)

class AnomalyDetector:
    """Detect anomalous privacy risk patterns. """

    def __init__(self, contamination: float = 0.1):
        """
        Initialize anomaly detector.

        Args:
            contamination: Expected proportion of anomalies
        """
        self.model = IsolationForest(
            contamination=contamination,
            random_state=42
        )
        self.is_trained = False
        logger.info(f"AnomalyDetector initialized with contamination={contamination}")

    def train(self, X: np.ndarray):
        """
        Train anomaly detection model.

        Args:
            X: Feature matrix
        """
        self.model.fit(X)
        self.is_trained = True
        logger.info(f"Anomaly detector trained on {len(X)} samples")

    def detect_anomalies(
        self,
        features: np.ndarray
    ) -> Tuple[bool, float]:
        """
        Detect if features represent anomalous pattern.

        Args:
            features: Feature vector

        Returns:
            Tuple of (is_anomaly, anomaly_score)
        """
        if not self.is_trained:
            logger.warning("Model not trained, returning no anomaly")
            return False, 0.0

        # Predict anomaly (-1 for anomaly, 1 for normal)
        prediction = self.model.predict(features.reshape(1, -1))[0]
        # Get anomaly score (lower is more anomalous)
        score = self.model.score_samples(features.reshape(1, -1))[0]
        is_anomaly = (prediction == -1)
        if is_anomaly:
            logger.warning(f"Anomaly detected with score {score:.3f}")

        return is_anomaly, float(score)

    def detect_user_anomalies(
        self,
        user_data: Dict[str, Any],
        connections: List[Dict[str, Any]],
        historical_data: List[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Detect anomalies in user's privacy profile.

        Args:
            user_data: Current user data
            connections: Current connections
            historical_data: Historical user data for comparison

        Returns:
            Dictionary with anomaly detection results
        """
        anomalies = []

        # Check sudden spike in connections
        if historical_data:
            recent_count = len(connections)
            historical_avg = np.mean([
                len(h.get('connections', [])) for h in historical_data
            ])

            if recent_count > historical_avg * 2:
                anomalies.append({
                    'type': 'connection_spike',
                    'severity': 'high',
                    'description': f'Unusual increase in connections: {recent_count} vs avg {historical_avg}',
                    'recommendation': 'Review recent connections for unauthorized accounts'
                })

        # Check unusual privacy settings changes
        privacy_changes = self._detect_privacy_changes(
            connections,
            historical_data
        )

        if privacy_changes:
            anomalies.extend(privacy_changes)

        # Check unusual activity patterns
        activity_anomalies = self._detect_activity_anomalies(
            user_data,
            historical_data
        )

        if activity_anomalies:
            anomalies.extend(activity_anomalies)

        return {
            'anomalies_detected': len(anomalies) > 0,
            'anomaly_count': len(anomalies),
            'anomalies': anomalies
        }

    def _detect_privacy_changes(
        self,
        connections: List[Dict[str, Any]],
        historical_data: List[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """Detect unusual privacy setting changes. """
        anomalies = []

        if not historical_data:
            return anomalies

        # Count public settings
        current_public = sum(
            1 for c in connections
            if c.get('privacy_setting') == 'public'
        )

        historical_public = []
        for h in historical_data:
            conns = h.get('connections', [])
            public_count = sum(
                1 for c in conns
                if c.get('privacy_setting') == 'public'
            )
            historical_public.append(public_count)

        if historical_public:
            avg_public = np.mean(historical_public)

            if current_public > avg_public * 1.5:
                anomalies.append({
                    'type': 'privacy_degradation',
                    'severity': 'high',
                    'description': f'Unusual increase in public profiles: {current_public} vs avg {avg_public}',
                    'recommendation': 'Review and update privacy settings on public accounts'
                })

        return anomalies

    def _detect_activity_anomalies(
        self,
        user_data: Dict[str, Any],
        historical_data: List[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """Detect unusual activity patterns. """
        anomalies = []
        # Placeholder for activity-based anomaly detection
        # In real implementation, would analyze posting patterns,
        # engagement rates, content types, etc.
        return anomalies