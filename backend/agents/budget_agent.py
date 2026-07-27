from typing import Any


def create_budget_plan(trip_data: dict[str, Any]) -> dict[str, int]:
    total_budget = float(trip_data["budget"])
    accommodation_type = trip_data.get(
        "accommodationPreference",
        "Comfortable",
    )

    accommodation_percentage = {
        "Budget": 0.25,
        "Comfortable": 0.30,
        "Premium": 0.35,
        "Luxury": 0.40,
    }.get(accommodation_type, 0.30)

    transport_percentage = 0.25
    food_percentage = 0.15
    activities_percentage = 0.15

    allocated_percentage = (
        accommodation_percentage
        + transport_percentage
        + food_percentage
        + activities_percentage
    )

    reserve_percentage = max(0.05, 1 - allocated_percentage)

    return {
        "transport": round(total_budget * transport_percentage),
        "accommodation": round(
            total_budget * accommodation_percentage
        ),
        "food": round(total_budget * food_percentage),
        "activities": round(total_budget * activities_percentage),
        "reserve": round(total_budget * reserve_percentage),
        "totalBudget": round(total_budget),
    }