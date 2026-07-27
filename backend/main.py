from datetime import date
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from agents.supervisor_agent import create_complete_journey
from database.dynamodb import (
    delete_trip,
    get_all_trips,
    get_trip_by_id,
    save_trip,
)


app = FastAPI(
    title="TripForge Service",
    description="Travel planning and journey management service",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TripRequest(BaseModel):
    source: str = Field(min_length=2, max_length=100)
    destination: str = Field(min_length=2, max_length=100)
    startDate: date
    endDate: date
    adults: int = Field(ge=1, le=20)
    children: int = Field(default=0, ge=0, le=20)
    budget: float = Field(ge=1000)
    travelStyle: str
    transportPreference: str = "Any"
    accommodationPreference: str = "Comfortable"
    foodPreference: str = "Any"
    interests: List[str] = Field(default_factory=list)
    additionalNotes: str = Field(default="", max_length=500)


@app.get("/")
def root():
    return {
        "message": "TripForge service is running successfully",
        "status": "success",
    }


@app.get("/health")
def health_check():
    return {
        "service": "TripForge",
        "status": "healthy",
    }


@app.post("/trips/generate")
def generate_trip(trip: TripRequest):
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

    return create_complete_journey(trip.model_dump())


@app.post("/trips/save")
def save_generated_trip(trip_data: dict):
    if "tripId" not in trip_data:
        raise HTTPException(
            status_code=400,
            detail="Trip ID is required.",
        )

    try:
        result = save_trip(trip_data)

        return {
            "status": "success",
            **result,
        }

    except RuntimeError as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        ) from error


@app.get("/trips")
def get_saved_trips():
    try:
        trips = get_all_trips()

        return {
            "status": "success",
            "count": len(trips),
            "trips": trips,
        }

    except RuntimeError as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        ) from error


@app.get("/trips/{trip_id}")
def get_saved_trip(trip_id: str):
    try:
        trip = get_trip_by_id(trip_id)

        if not trip:
            raise HTTPException(
                status_code=404,
                detail="Journey not found.",
            )

        return {
            "status": "success",
            "trip": trip,
        }

    except RuntimeError as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        ) from error


@app.delete("/trips/{trip_id}")
def remove_saved_trip(trip_id: str):
    try:
        deleted = delete_trip(trip_id)

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

    except RuntimeError as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        ) from error