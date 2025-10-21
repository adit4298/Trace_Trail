from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import engine, get_db

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TraceTrail API",
    description="Privacy Dashboard Backend",
    version="1.0.0"
)

# Health checks
@app.get("/")
def read_root():
    return {"message": "TraceTrail Backend API Running"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "TraceTrail Backend"}

@app.get("/test-db")
def test_database(db: Session = Depends(get_db)):
    try:
        db.execute("SELECT 1")
        return {"database": "connected"}
    except Exception as e:
        return {"database": "error", "message": str(e)}

# User endpoints
@app.post("/auth/signup", response_model=schemas.User)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

# Dashboard endpoint
@app.get("/dashboard/{user_id}")
def get_dashboard_data(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    privacy_score = crud.get_latest_privacy_score(db, user_id=user_id)
    social_connections = crud.get_user_social_connections(db, user_id=user_id)
    
    return {
        "user": user,
        "privacy_score": privacy_score,
        "social_connections": social_connections,
        "recommendations": [
            "Enable two-factor authentication",
            "Review app permissions",
            "Adjust privacy settings on social media"
        ]
    }