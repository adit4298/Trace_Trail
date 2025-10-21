from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import models
from .database import engine, get_db

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TraceTrail API",
    description="Privacy Dashboard Backend",
    version="1.0.0"
)

@app.get("/")
def read_root():
    return {"message": "TraceTrail Backend API Running"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "TraceTrail Backend"}

@app.get("/test-db")
def test_database(db: Session = Depends(get_db)):
    try:
        # Test database connection
        db.execute("SELECT 1")
        return {"database": "connected"}
    except Exception as e:
        return {"database": "error", "message": str(e)}