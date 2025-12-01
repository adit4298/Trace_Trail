from typing import Dict, List
import logging

logger = logging.getLogger(__name__)


class RecommendationEngine:
    """
    Privacy recommendation generator.
    Generates personalized recommendations based on risk analysis.
    """
    
    RECOMMENDATIONS_DB = {
        'high_social_media_risk': {
            'title': 'Restrict Social Media Privacy Settings',
            'description': 'Set your social media profiles to private and review friend requests carefully.',
            'category': 'social_media',
            'impact_score': 8.5
        },
        'data_exposure': {
            'title': 'Remove Personal Information from Public Databases',
            'description': 'Request removal of your information from data broker websites.',
            'category': 'data_exposure',
            'impact_score': 7.5
        },
        'weak_password': {
            'title': 'Strengthen Your Passwords',
            'description': 'Use strong, unique passwords for each service. Consider a password manager.',
            'category': 'authentication',
            'impact_score': 9.0
        },
        'location_tracking': {
            'title': 'Disable Location Tracking',
            'description': 'Turn off location services for unnecessary apps.',
            'category': 'device_security',
            'impact_score': 6.5
        },
        'two_factor': {
            'title': 'Enable Two-Factor Authentication',
            'description': 'Enable 2FA on all important accounts.',
            'category': 'authentication',
            'impact_score': 9.0
        }
    }
    
    def generate_recommendations(
        self,
        user_id: int,
        scores: Dict,
        risk_factors: Dict
    ) -> List[Dict]:
        """
        Generate personalized recommendations.
        
        Args:
            user_id: User ID
            scores: Risk scores dict
            risk_factors: Risk factors dict
        
        Returns list of recommendations
        """
        recommendations = []
        
        # Social media risk recommendations
        if scores['social_media'] > 60:
            rec = self.RECOMMENDATIONS_DB['high_social_media_risk'].copy()
            rec['priority'] = 'high'
            recommendations.append(rec)
        
        # Data exposure recommendations
        if scores['data_exposure'] > 70:
            rec = self.RECOMMENDATIONS_DB['data_exposure'].copy()
            rec['priority'] = 'high'
            recommendations.append(rec)
        
        # Authentication recommendations
        rec = self.RECOMMENDATIONS_DB['weak_password'].copy()
        rec['priority'] = 'critical'
        recommendations.append(rec)
        
        # Two-factor auth
        rec = self.RECOMMENDATIONS_DB['two_factor'].copy()
        rec['priority'] = 'high'
        recommendations.append(rec)
        
        logger.info(f"Generated {len(recommendations)} recommendations for user {user_id}")
        
        return recommendations
    
    def prioritize_recommendations(self, recommendations: List[Dict]) -> List[Dict]:
        """Sort recommendations by priority and impact"""
        priority_order = {'critical': 0, 'high': 1, 'medium': 2, 'low': 3}
        
        return sorted(
            recommendations,
            key=lambda x: (priority_order.get(x.get('priority', 'low'), 999), -x.get('impact_score', 0))
        )
