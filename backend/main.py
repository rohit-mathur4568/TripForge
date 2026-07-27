from datetime import date
from typing import List, Optional
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr

from agents.supervisor_agent import create_complete_journey
from agents.assistant_agent import generate_chat_response
from database.db_store import (
    save_trip_db,
    get_all_trips_db,
    get_trip_by_id_db,
    delete_trip_db,
    create_user,
    get_user_by_email,
    get_user_by_id,
    hash_password,
)
from auth import create_access_token, decode_access_token

app = FastAPI(
    title="TripForge Professional Service",
    description="Multi-agent travel planning and journey management service with JWT Auth & Maps",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SignupRequest(BaseModel):
    fullName: str = Field(min_length=2, max_length=100)
    email: str = Field(min_length=5, max_length=100)
    password: str = Field(min_length=6, max_length=100)

class LoginRequest(BaseModel):
    email: str
    password: str

class ChatMessageRequest(BaseModel):
    message: str = Field(min_length=1, max_length=500)

class TripRequest(BaseModel):
    source: str = Field(min_length=2, max_length=100)
    destination: str = Field(min_length=2, max_length=100)
    startDate: date
    endDate: date
    adults: int = Field(ge=1, le=20)
    children: int = Field(default=0, ge=0, le=20)
    budget: float = Field(ge=100)
    travelStyle: str
    transportPreference: str = "Any"
    accommodationPreference: str = "Comfortable"
    foodPreference: str = "Any"
    interests: List[str] = Field(default_factory=list)
    additionalNotes: str = Field(default="", max_length=500)

def get_current_user_optional(authorization: Optional[str] = Header(None)) -> Optional[dict]:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        return None
    return get_user_by_id(payload["sub"])

@app.get("/")
def root():
    return {
        "message": "TripForge AI Service is running successfully",
        "status": "success",
        "version": "2.0.0"
    }

@app.get("/health")
def health_check():
    return {
        "service": "TripForge",
        "status": "healthy",
    }

# Chatbot Assistant Endpoint
@app.post("/chat")
def chat_with_assistant(req: ChatMessageRequest):
    return generate_chat_response(req.message)

# Auth Routes
@app.post("/auth/signup")
def signup(req: SignupRequest):
    try:
        user_id = str(uuid4())
        user = create_user(user_id, req.email, req.password, req.fullName)
        token = create_access_token({"sub": user["id"], "email": user["email"]})
        return {
            "status": "success",
            "token": token,
            "user": user
        }
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err))

@app.post("/auth/login")
def login(req: LoginRequest):
    user = get_user_by_email(req.email)
    if not user or user["password_hash"] != hash_password(req.password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    token = create_access_token({"sub": user["id"], "email": user["email"]})
    return {
        "status": "success",
        "token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "fullName": user["full_name"]
        }
    }

@app.get("/auth/me")
def me(current_user: Optional[dict] = Depends(get_current_user_optional)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {"status": "success", "user": current_user}

# Trip Endpoints
@app.post("/trips/generate")
def generate_trip(trip: TripRequest, current_user: Optional[dict] = Depends(get_current_user_optional)):
    if trip.endDate < trip.startDate:
        raise HTTPException(
            status_code=400,
            detail="End date must be after the start date.",
        )

    if trip.source.strip().lower() == trip.destination.strip().lower():
        raise HTTPException(
            status_code=400,
            detail="Starting location and destination must be different.",
        )

    total_days = (trip.endDate - trip.startDate).days + 1

    if total_days > 30:
        raise HTTPException(
            status_code=400,
            detail="Trips longer than 30 days are not currently supported.",
        )

    trip_data = trip.model_dump()
    journey = create_complete_journey(trip_data)
    if current_user:
        journey["userId"] = current_user["id"]
    return journey

@app.post("/trips/save")
def save_generated_trip(trip_data: dict, current_user: Optional[dict] = Depends(get_current_user_optional)):
    if "tripId" not in trip_data:
        raise HTTPException(
            status_code=400,
            detail="Trip ID is required.",
        )

    user_id = current_user["id"] if current_user else trip_data.get("userId")
    try:
        result = save_trip_db(trip_data, user_id=user_id)
        return {
            "status": "success",
            **result,
        }
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        ) from error

@app.get("/trips")
def get_saved_trips(current_user: Optional[dict] = Depends(get_current_user_optional)):
    try:
        user_id = current_user["id"] if current_user else None
        trips = get_all_trips_db(user_id=user_id)

        return {
            "status": "success",
            "count": len(trips),
            "trips": trips,
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        ) from error

@app.get("/trips/{trip_id}")
def get_saved_trip(trip_id: str):
    try:
        trip = get_trip_by_id_db(trip_id)

        if not trip:
            raise HTTPException(
                status_code=404,
                detail="Journey not found.",
            )

        return {
            "status": "success",
            "trip": trip,
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        ) from error

@app.delete("/trips/{trip_id}")
def remove_saved_trip(trip_id: str):
    try:
        deleted = delete_trip_db(trip_id)

        if not deleted:
            raise HTTPException(
                status_code=404,
                detail="Journey not found.",
            )

        return {
            "status": "success",
            "message": "Journey deleted successfully.",
            "tripId": trip_id,
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        ) from error