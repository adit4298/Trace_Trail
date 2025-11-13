"""
Model performance metrics and evaluation.
"""

import numpy as np
from typing import Dict, Any
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import logging

logger = logging.getLogger(__name__)

class ModelMetrics:
    """Calculate and track model performance metrics."""

    def __init__(self):
        """Initialize metrics tracker."""
        self.metrics = {}
        logger.info("ModelMetrics initialized")

    def calculate_regression_metrics(
        self,
        y_true: np.ndarray,
        y_pred: np.ndarray
    ) -> Dict[str, float]:
        """
        Calculate regression metrics.

        Args:
            y_true: True values
            y_pred: Predicted values

        Returns:
            Dictionary of metrics
        """
        metrics = {
            'mse': mean_squared_error(y_true, y_pred),
            'rmse': np.sqrt(mean_squared_error(y_true, y_pred)),
            'mae': mean_absolute_error(y_true, y_pred),
            'r2': r2_score(y_true, y_pred)
        }
        self.metrics.update(metrics)
        logger.info(f"Calculated metrics: {metrics}")

        return metrics

    def calculate_accuracy_within_threshold(
        self,
        y_true: np.ndarray,
        y_pred: np.ndarray,
        threshold: float = 10.0
    ) -> float:
        """
        Calculate accuracy within threshold.

        Args:
            y_true: True values
            y_pred: Predicted values
            threshold: Acceptable error threshold

        Returns:
            Accuracy percentage
        """
        errors = np.abs(y_true - y_pred)
        within_threshold = np.sum(errors <= threshold)
        accuracy = (within_threshold / len(y_true)) * 100
        logger.info(f"Accuracy within {threshold}: {accuracy:.2f}%")
        return accuracy

    def get_metrics_summary(self) -> Dict[str, Any]:
        """Get summary of all calculated metrics."""
        return self.metrics.copy()