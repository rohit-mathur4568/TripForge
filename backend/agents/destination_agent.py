from typing import Any


def create_destination_plan(trip_data: dict[str, Any]) -> dict[str, Any]:
    source = str(trip_data["source"]).strip().title()
    destination = str(trip_data["destination"]).strip().title()
    travel_style = trip_data["travelStyle"]
    interests = trip_data.get("interests", [])

    selected_interests = interests or [
        "Popular attractions",
        "Local culture",
        "Local food",
    ]

    return {
        "source": source,
        "destination": destination,
        "travelStyle": travel_style,
        "focusAreas": selected_interests,
        "overview": (
            f"A {travel_style.lower()} journey from {source} to "
            f"{destination}, planned around the selected interests."
        ),
    }