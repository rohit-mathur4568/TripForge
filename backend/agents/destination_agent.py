from typing import Any
from services.location_service import get_location_info

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

    loc_info = get_location_info(destination)

    return {
        "source": source,
        "destination": destination,
        "travelStyle": travel_style,
        "focusAreas": selected_interests,
        "overview": (
            f"A bespoke {travel_style.lower()} exploration from {source} to "
            f"{destination}, meticulously tailored to your passion for "
            f"{', '.join(selected_interests[:3])}."
        ),
        "latitude": loc_info["lat"],
        "longitude": loc_info["lng"],
        "heroImage": loc_info["cover"],
        "thumbnail": loc_info["image"],
        "landmarks": loc_info["landmarks"],
        "weather": loc_info["weather"],
        "country": loc_info.get("country", "Global Destination")
    }