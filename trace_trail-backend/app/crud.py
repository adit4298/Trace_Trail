from sqlalchemy.orm import Session
from . import models, schemas
from .auth import get_password_hash

# User operations
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email, 
        hashed_password=hashed_password,
        full_name=user.full_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

# Social Connection operations
def create_social_connection(db: Session, social_connection: schemas.SocialConnectionCreate):
    db_social_connection = models.SocialConnection(**social_connection.dict())
    db.add(db_social_connection)
    db.commit()
    db.refresh(db_social_connection)
    return db_social_connection

def get_user_social_connections(db: Session, user_id: int):
    return db.query(models.SocialConnection).filter(models.SocialConnection.user_id == user_id).all()

# Privacy Score operations
def create_privacy_score(db: Session, privacy_score: schemas.PrivacyScoreCreate):
    db_privacy_score = models.PrivacyScore(**privacy_score.dict())
    db.add(db_privacy_score)
    db.commit()
    db.refresh(db_privacy_score)
    return db_privacy_score

def get_latest_privacy_score(db: Session, user_id: int):
    return db.query(models.PrivacyScore).filter(
        models.PrivacyScore.user_id == user_id
    ).order_by(models.PrivacyScore.calculated_at.desc()).first()