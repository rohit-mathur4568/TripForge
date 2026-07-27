from typing import Any
from services.location_service import get_location_info

INTEREST_ACTIVITIES = {
    "Nature": "Explore a scenic natural attraction and eco-park",
    "Beaches": "Relax at a popular coastal beach and enjoy watersports",
    "Mountains": "Visit a scenic mountain viewpoint and alpine trail",
    "History": "Explore an important historical landmark & heritage site",
    "Shopping": "Visit a bustling local shopping bazaar and boutique street",
    "Local Food": "Savor authentic regional culinary delicacies & food tours",
    "Nightlife": "Enjoy vibrant evening lounges, live music & night markets",
    "Photography": "Capture iconic skyline panoramas & historic architecture",
    "Adventure": "Embark on an exhilarating outdoor excursion or zipline tour",
    "Culture & Arts": "Immerse in local museums, art galleries & cultural performances"
}

def create_itinerary(
    trip_data: dict[str, Any],
    total_days: int,
) -> list[dict[str, Any]]:
    source = str(trip_data["source"]).strip().title()
    destination = str(trip_data["destination"]).strip().title()
    travel_style = trip_data["travelStyle"]
    interests = trip_data.get("interests", [])
    
    loc_info = get_location_info(destination)
    landmarks = loc_info.get("landmarks", ["City Center", "Main Square", "Heritage District", "Panoramic Viewpoint"])
    base_lat = loc_info.get("lat", 20.0)
    base_lng = loc_info.get("lng", 77.0)

    selected_activities = [
        INTEREST_ACTIVITIES[interest]
        for interest in interests
        if interest in INTEREST_ACTIVITIES
    ]

    if not selected_activities:
        selected_activities = [
            f"Explore the landmark highlights of {destination}",
            "Discover vibrant local markets and artisan shops",
            "Experience authentic traditional dining and architecture",
        ]

    itinerary = []

    for day_number in range(1, total_days + 1):
        landmark_index = (day_number - 1) % len(landmarks)
        current_landmark = landmarks[landmark_index]

        # Waypoint coordinates for interactive map tracking
        offset_lat = round(base_lat + (day_number * 0.012) - 0.005, 4)
        offset_lng = round(base_lng + (day_number * 0.015) - 0.006, 4)

        if day_number == 1:
            title = f"Arrival & Discovery of {destination}"
            activities = [
                f"Travel from {source} to {destination}",
                "Check-in to accommodation and refresh",
                f"Evening orientation tour around {current_landmark}",
                f"Welcome dinner sampling signature {destination} dishes"
            ]

        elif day_number == total_days:
            title = "Final Highlights & Grand Departure"
            activities = [
                "Morning gourmet breakfast and checkout preparation",
                f"Last-minute souvenir shopping at {current_landmark}",
                "Panoramic photo session & farewell tea",
                f"Begin comfortable return journey to {source}"
            ]

        else:
            selected_activity = selected_activities[
                (day_number - 2) % len(selected_activities)
            ]

            title = f"{travel_style} Expedition: {current_landmark}"
            activities = [
                f"Morning visit to {current_landmark}",
                selected_activity,
                f"Authentic local lunch near {current_landmark}",
                f"Afternoon discovery walk & photo stops",
                "Relaxing dinner and leisure evening"
            ]

        itinerary.append(
            {
                "day": day_number,
                "title": title,
                "activities": activities,
                "locationName": current_landmark,
                "latitude": offset_lat,
                "longitude": offset_lng,
                "image": loc_info.get("image")
            }
        )

    return itinerary