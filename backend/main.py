from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="TripForge API",
    description="Backend API for the Multi-Agent Travel Planner",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "TripForge API is running successfully",
        "status": "success",
    }


@app.get("/health")
def health_check():
    return {
        "service": "TripForge Backend",
        "status": "healthy",
    }
    