from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.api.v1 import trading
from app.models.database import get_db, engine, Base
from app.services.price_feed import start_price_feed
import uvicorn

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MemeFi API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(trading.router, prefix="/api/v1/trading", tags=["trading"])

# Health check endpoint
@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    return {"status": "healthy", "version": "1.0.0", "database": "connected"}

@app.on_event("startup")
async def startup_event():
    """Start the price feed service when the application starts"""
    start_price_feed()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
