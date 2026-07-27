from datetime import date
from typing import Any
from uuid import uuid4

from agents.budget_agent import create_budget_plan
from agents.destination_agent import create_destination_plan
from agents.itinerary_agent import create_itinerary
from agents.recommendation_agent import (
    create_recommendations,
    create_travel_tips,
)


def create_complete_journey(
    trip_data: dict[str, Any],
) -> dict[str, Any]:
    start_date = _parse_date(trip_data["startDate"])
    end_date = _parse_date(trip_data["endDate"])

    total_days = (end_date - start_date).days + 1
    total_travellers = (
        int(trip_data["adults"])
        + int(trip_data.get("children", 0))
    )

    destination_plan = create_destination_plan(trip_data)
    budget_plan = create_budget_plan(trip_data)
    itinerary = create_itinerary(trip_data, total_days)
    recommendations = create_recommendations(trip_data)
    travel_tips = create_travel_tips()

    return {
        "tripId": str(uuid4()),
        "status": "completed",
        "journeyOverview": destination_plan,
        "summary": {
            "source": destination_plan["source"],
            "destination": destination_plan["destination"],
            "startDate": start_date.isoformat(),
            "endDate": end_date.isoformat(),
            "duration": total_days,
            "travellers": total_travellers,
            "adults": int(trip_data["adults"]),
            "children": int(trip_data.get("children", 0)),
            "travelStyle": trip_data["travelStyle"],
            "estimatedBudget": round(float(trip_data["budget"])),
        },
        "budgetBreakdown": budget_plan,
        "itinerary": itinerary,
        "recommendations": recommendations,
        "travelTips": travel_tips,
        "additionalNotes": trip_data.get("additionalNotes", ""),
    }


def _parse_date(value: Any) -> date:
    if isinstance(value, date):
        return value

    return date.fromisoformat(str(value))