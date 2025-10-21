from sqlalchemy.orm import Session
from app import models, crud
import random

def create_demo_user(db: Session):
    # Create a demo user if not exists
    user = crud.get_user_by_email(db, "demo@tracetrail.com")
    if not user:
        user = crud.create_user(db, schemas.UserCreate(
            email="demo@tracetrail.com",
            password="demopassword",
            full_name="Demo User"
        ))

    # Create demo social connections
    platforms = ['facebook', 'instagram', 'twitter', 'linkedin']
    for platform in platforms:
        connection = models.SocialConnection(
            user_id=user.id,
            platform=platform,
            connection_count=random.randint(100, 500),
            data_shared='{"posts": true, "friends": true, "location": false}',
            privacy_settings='{"public": false, "friends_only": true}'
        )
        db.add(connection)

    # Create demo privacy scores
    risk_score = models.PrivacyScore(
        user_id=user.id,
        overall_score=65.5,
        social_media_risk=70.0,
        data_exposure_risk=60.0
    )
    db.add(risk_score)

    db.commit()
    return user