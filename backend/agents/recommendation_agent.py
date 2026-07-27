from typing import Any


def create_recommendations(
    trip_data: dict[str, Any],
) -> dict[str, list[str]]:
    transport_preference = trip_data.get(
        "transportPreference",
        "Any",
    )
    accommodation_preference = trip_data.get(
        "accommodationPreference",
        "Comfortable",
    )
    food_preference = trip_data.get(
        "foodPreference",
        "Any",
    )

    transport_suggestion = (
        transport_preference
        if transport_preference != "Any"
        else "Choose the most suitable option based on distance and budget"
    )

    return {
        "transport": [
            transport_suggestion,
            "Use trusted local transport for nearby attractions",
            "Keep extra travel time during busy hours",
        ],
        "accommodation": [
            (
                f"Choose a {accommodation_preference.lower()} stay "
                "near the main area"
            ),
            "Check recent guest reviews before confirming",
            "Prefer a location with convenient transport access",
        ],
        "food": [
            f"Follow the selected preference: {food_preference}",
            "Try a well-reviewed local speciality",
            "Keep drinking water and light snacks during travel",
        ],
    }


def create_travel_tips() -> list[str]:
    return [
        "Keep digital and physical copies of important documents.",
        "Confirm accommodation and transport before departure.",
        "Keep part of the budget for unexpected expenses.",
        "Check local weather conditions before the journey.",
    ]