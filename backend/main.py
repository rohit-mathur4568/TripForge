from datetime import date
from typing import Annotated, Any, List

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from agents.supervisor_agent import create_complete_journey
from database.dynamodb import (
    delete_trip,
    get_trip_by_id,
    get_user_trips,
    save_trip,
)
from routes.auth_routes import router as auth_router
from services.current_user import get_authenticated_user


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

app.include_router(auth_router)


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


AuthenticatedUser = Annotated[
    dict[str, Any],
    Depends(get_authenticated_user),
]


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
def generate_trip(
    trip: TripRequest,
    current_user: AuthenticatedUser,
):
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

    journey = create_complete_journey(trip.model_dump())

    journey["ownerEmail"] = current_user["email"]
    journey["ownerName"] = current_user["name"]

    return journey


@app.post("/trips/save")
def save_generated_trip(
    trip_data: dict[str, Any],
    current_user: AuthenticatedUser,
):
    if "tripId" not in trip_data:
        raise HTTPException(
            status_code=400,
            detail="Trip ID is required.",
        )

    try:
        result = save_trip(
            trip_data=trip_data,
            owner=current_user,
        )

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
def get_saved_trips(
    current_user: AuthenticatedUser,
):
    try:
        trips = get_user_trips(current_user["email"])

        total_budget = sum(
            int(
                trip.get("summary", {}).get(
                    "estimatedBudget",
                    0,
                )
            )
            for trip in trips
        )

        return {
            "status": "success",
            "count": len(trips),
            "totalBudget": total_budget,
            "trips": trips,
        }

    except RuntimeError as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        ) from error


@app.get("/trips/{trip_id}")
def get_saved_trip(
    trip_id: str,
    current_user: AuthenticatedUser,
):
    try:
        trip = get_trip_by_id(
            trip_id=trip_id,
            owner_email=current_user["email"],
        )

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
def remove_saved_trip(
    trip_id: str,
    current_user: AuthenticatedUser,
):
    try:
        deleted = delete_trip(
            trip_id=trip_id,
            owner_email=current_user["email"],
        )

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