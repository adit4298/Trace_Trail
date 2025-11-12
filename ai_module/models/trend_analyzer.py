import numpy as np
from typing import List, Dict, Any
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
import logging
logger = logging.getLogger(__name__)

class TrendAnalyzer:
    """Analyze trends in privacy risk scores over time. """

    def __init__(self):
        """Initialize trend analyzer. """
        self.model = LinearRegression()
        logger.info("TrendAnalyzer initialized")

    def analyze_trend(
        self,
        score_history: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Analyze trend in risk scores.

        Args:
            score_history: List of historical score records
            Each record should have 'date' and 'score'

        Returns:
            Dictionary with trend analysis
        """
        if len(score_history) < 2:
            return {
                'trend': 'insufficient_data',
                'direction': 'stable',
                'rate_of_change': 0.0,
                'predicted_score_7d': None,
                'predicted_score_30d': None
            }

        # Sort by date
        sorted_history = sorted(
            score_history,
            key=lambda x: datetime.fromisoformat(x['date'])
        )

        # Prepare data
        dates = [datetime.fromisoformat(s['date']) for s in sorted_history]
        scores = [s['score'] for s in sorted_history]

        # Convert dates to days since first record
        base_date = dates[0]
        X = np.array([(d - base_date).days for d in dates]).reshape(-1, 1)
        y = np.array(scores)

        # Fit linear model
        self.model.fit(X, y)

        # Calculate trend metrics
        slope = self.model.coef_[0]

        # Determine direction
        if slope > 1:
            direction = 'increasing'
            trend = 'worsening'
        elif slope < -1:
            direction = 'decreasing'
            trend = 'improving'
        else:
            direction = 'stable'
            trend = 'stable'

        # Make predictions
        current_days = X[-1][0]

        pred_7d = self.model.predict([[current_days + 7]])[0]
        pred_30d = self.model.predict([[current_days + 30]])[0]

        # Clip predictions to valid range
        pred_7d = max(0, min(100, pred_7d))
        pred_30d = max(0, min(100, pred_30d))

        return {
            'trend': trend,
            'direction': direction,
            'rate_of_change': float(slope),
            'predicted_score_7d': round(pred_7d, 2),
            'predicted_score_30d': round(pred_30d, 2),
            'data_points': len(score_history)
        }

    def calculate_velocity(
        self,
        score_history: List[Dict[str, Any]],
        window_days: int = 7
    ) -> float:
        """
        Calculate velocity of risk score changes.

        Args:
            score_history: Historical scores
            window_days: Time window for velocity calculation

        Returns:
            Velocity (points per day)
        """
        if len(score_history) < 2:
            return 0.0

        sorted_history = sorted(
            score_history,
            key=lambda x: datetime.fromisoformat(x['date']),
            reverse=True
        )

        # Get recent window
        cutoff_date = datetime.now() - timedelta(days=window_days)
        recent_scores = [
            s for s in sorted_history
            if datetime.fromisoformat(s['date']) >= cutoff_date
        ]

        if len(recent_scores) < 2:
            return 0.0

        # Calculate average daily change
        first_score = recent_scores[-1]['score']
        last_score = recent_scores[0]['score']
        days_diff = (
            datetime.fromisoformat(recent_scores[0]['date']) -
            datetime.fromisoformat(recent_scores[-1]['date'])
        ).days

        if days_diff == 0:
            return 0.0

        velocity = (last_score - first_score) / days_diff
        return round(velocity, 3)

    def identify_inflection_points(
        self,
        score_history: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Identify significant turning points in risk score history.

        Args:
            score_history: Historical scores

        Returns:
            List of inflection points
        """
        if len(score_history) < 3:
            return []

        sorted_history = sorted(
            score_history,
            key=lambda x: datetime.fromisoformat(x['date'])
        )

        inflection_points = []

        for i in range(1, len(sorted_history) - 1):
            prev_score = sorted_history[i-1]['score']
            curr_score = sorted_history[i]['score']
            next_score = sorted_history[i+1]['score']

            # Check for local maxima or minima
            if curr_score > prev_score and curr_score > next_score:
                inflection_points.append({
                    'date': sorted_history[i]['date'],
                    'score': curr_score,
                    'type': 'peak',
                    'change_magnitude': abs(curr_score - prev_score) + abs(curr_score - next_score)
                })
            elif curr_score < prev_score and curr_score < next_score:
                inflection_points.append({
                    'date': sorted_history[i]['date'],
                    'score': curr_score,
                    'type': 'valley',
                    'change_magnitude': abs(curr_score - prev_score) + abs(curr_score - next_score)
                })

        # Sort by magnitude
        inflection_points.sort(key=lambda x: x['change_magnitude'], reverse=True)
        logger.info(f"Identified {len(inflection_points)} inflection points")
        return inflection_points