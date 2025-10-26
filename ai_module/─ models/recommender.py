from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class Recommender:
    """Generate personalized privacy recommendations."""

    RECOMMENDATIONS = {
        'high_privacy_risk': {
            'public_profile': {
                'title': 'Set Profile to Private',
                'description': 'Your profile is set to public. Change it to private to limit who can see your information.',
                'impact': 'high',
                'effort': 'low',
                'priority': 1
            },
            'location_sharing': {
                'title': 'Disable Location Sharing',
                'description': 'You are sharing your location. Turn off location services to protect your privacy.',
                'impact': 'high',
                'effort': 'low',
                'priority': 2
            },
            'contact_sharing': {
                'title': 'Stop Sharing Contacts',
                'description': 'You are allowing apps to access your contacts. Disable this to protect your network.',
                'impact': 'medium',
                'effort': 'low',
                'priority': 3
            }
        },
        'medium_privacy_risk': {
            'review_posts': {
                'title': 'Review Recent Posts',
                'description': 'Review your recent posts and delete any that contain sensitive personal information.',
                'impact': 'medium',
                'effort': 'medium',
                'priority': 1
            },
            'limit_visibility': {
                'title': 'Limit Post Visibility',
                'description': 'Set default post visibility to "Friends Only" instead of public.',
                'impact': 'medium',
                'effort': 'low',
                'priority': 2
            },
            'review_apps': {
                'title': 'Review Connected Apps',
                'description': 'Remove third-party apps you no longer use from your account.',
                'impact': 'medium',
                'effort': 'medium',
                'priority': 3
            }
        },
        'low_privacy_risk': {
            'two_factor': {
                'title': 'Enable Two-Factor Authentication',
                'description': 'Add an extra layer of security by enabling two-factor authentication.',
                'impact': 'medium',
                'effort': 'low',
                'priority': 1
            },
            'periodic_review': {
                'title': 'Schedule Privacy Review',
                'description': 'Set a reminder to review your privacy settings every 3 months.',
                'impact': 'low',
                'effort': 'low',
                'priority': 2
            }
        }
    }

    def __init__(self):
        logger.info("Recommender initialized")

    def generate_recommendations(
        self,
        risk_score: float,
        risk_breakdown: Dict[str, float],
        connections: List[Dict[str, Any]],
        max_recommendations: int = 5
    ) -> List[Dict[str, Any]]:
        recommendations = []

        # Determine risk category
        if risk_score >= 71:
            category = 'high_privacy_risk'
        elif risk_score >= 41:
            category = 'medium_privacy_risk'
        else:
            category = 'low_privacy_risk'

        # Get base recommendations
        base_recs = self.RECOMMENDATIONS.get(category, {})

        # Add connection-specific recommendations
        for conn in connections:
            specific_recs = self._get_connection_recommendations(conn)
            recommendations.extend(specific_recs)

        # Add general recommendations
        for key, rec in base_recs.items():
            if len(recommendations) >= max_recommendations:
                break
            recommendations.append({
                'id': key,
                'title': rec['title'],
                'description': rec['description'],
                'impact': rec['impact'],
                'effort': rec['effort'],
                'priority': rec['priority'],
                'platform': 'general'
            })

        # Sort and trim
        recommendations.sort(key=lambda x: x['priority'])
        return recommendations[:max_recommendations]

    def _get_connection_recommendations(self, connection: Dict[str, Any]) -> List[Dict[str, Any]]:
        recommendations = []
        platform = connection.get('platform', 'unknown')

        if connection.get('privacy_setting') == 'public':
            recommendations.append({
                'id': f"{platform}_privacy",
                'title': f"Change {platform.title()} Privacy Settings",
                'description': f"Your {platform.title()} account is set to public. Consider changing to friends-only.",
                'impact': 'high',
                'effort': 'low',
                'priority': 1,
                'platform': platform
            })

        if connection.get('shares_location'):
            recommendations.append({
                'id': f"{platform}_location",
                'title': f"Disable Location on {platform.title()}",
                'description': f"You're sharing your location on {platform.title()}. Turn this off for better privacy.",
                'impact': 'high',
                'effort': 'low',
                'priority': 2,
                'platform': platform
            })

        if connection.get('shares_contacts'):
            recommendations.append({
                'id': f"{platform}_contacts",
                'title': f"Stop Sharing Contacts on {platform.title()}",
                'description': f"Disable contact sharing on {platform.title()} to protect your contacts' privacy.",
                'impact': 'medium',
                'effort': 'low',
                'priority': 3,
                'platform': platform
            })

        return recommendations

    def get_recommendation_by_id(self, rec_id: str) -> Dict[str, Any]:
        for category in self.RECOMMENDATIONS.values():
            if rec_id in category:
                return category[rec_id]
        return {}

    def estimate_impact(self, recommendation_id: str, current_risk_score: float) -> Dict[str, Any]:
        rec = self.get_recommendation_by_id(recommendation_id)
        if not rec:
            return {'error': 'Recommendation not found'}

        impact_map = {
            'high': 15,
            'medium': 8,
            'low': 3
        }
        reduction = impact_map.get(rec['impact'], 5)
        new_score = max(0, current_risk_score - reduction)

        return {
            'current_score': current_risk_score,
            'estimated_new_score': new_score,
            'score_reduction': reduction,
            'effort_required': rec['effort'],
            'time_to_implement': self._estimate_time(rec['effort'])
        }

    def _estimate_time(self, effort: str) -> str:
        time_map = {
            'low': '5–10 minutes',
            'medium': '15–30 minutes',
            'high': '30–60 minutes'
        }
        return time_map.get(effort, '15 minutes')