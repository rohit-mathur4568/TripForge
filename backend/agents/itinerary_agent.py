from typing import Any


INTEREST_ACTIVITIES = {
    "Nature": "Explore a scenic natural attraction",
    "Beaches": "Relax at a popular beach",
    "Mountains": "Visit a scenic mountain viewpoint",
    "History": "Explore an important historical landmark",
    "Shopping": "Visit a popular local shopping area",
    "Local Food": "Try recommended local dishes",
    "Nightlife": "Enjoy a well-known evening area",
    "Photography": "Visit a scenic photography location",
}


def create_itinerary(
    trip_data: dict[str, Any],
    total_days: int,
) -> list[dict[str, Any]]:
    source = str(trip_data["source"]).strip().title()
    destination = str(trip_data["destination"]).strip().title()
    travel_style = trip_data["travelStyle"]
    interests = trip_data.get("interests", [])

    selected_activities = [
        INTEREST_ACTIVITIES[interest]
        for interest in interests
        if interest in INTEREST_ACTIVITIES
    ]

    if not selected_activities:
        selected_activities = [
            f"Explore the main attractions of {destination}",
            "Visit a popular local market",
            "Experience the local culture and cuisine",
        ]

    itinerary = []

    for day_number in range(1, total_days + 1):
        if day_number == 1:
            title = f"Arrival and introduction to {destination}"
            activities = [
                f"Travel from {source} to {destination}",
                "Check in and take some time to settle",
                f"Take a relaxed evening walk around {destination}",
            ]

        elif day_number == total_days:
            title = "Final exploration and departure"
            activities = [
                "Enjoy breakfast and complete checkout",
                "Visit a nearby attraction or shopping area",
                f"Begin the return journey to {source}",
            ]

        else:
            selected_activity = selected_activities[
                (day_number - 2) % len(selected_activities)
            ]

            title = f"{travel_style} experience in {destination}"
            activities = [
                selected_activity,
                "Have lunch at a suitable local restaurant",
                "Explore a nearby attraction",
                "Return to the accommodation and relax",
            ]

        itinerary.append(
            {
                "day": day_number,
                "title": title,
                "activities": activities,
            }
        )

    return itinerary