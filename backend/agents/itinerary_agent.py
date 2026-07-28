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
        # Default smart budget-friendly sightseeing activities tailored to destination
        selected_activities = [
            f"Guided walking tour of iconic landmarks and heritage spots in {destination}",
            f"Sampling authentic local street food delicacies and fresh cafes in {destination}",
            f"Visiting scenic panoramic viewpoints and public garden parks in {destination}",
            f"Exploring famous local craft markets, souvenir souks & artisan bazaars",
            f"Relaxing evening sunset stroll & cultural photo opportunities in {destination}",
        ]

    itinerary = []

    for day_number in range(1, total_days + 1):
        landmark_index = (day_number - 1) % len(landmarks)
        current_landmark = landmarks[landmark_index]

        # Waypoint coordinates
        offset_lat = round(base_lat + (day_number * 0.012) - 0.005, 4)
        offset_lng = round(base_lng + (day_number * 0.015) - 0.006, 4)

        if day_number == 1:
            title = f"Day 1: Arrival & Evening at {current_landmark}"
            activities = [
                f"Travel from {source} to {destination}",
                "Check-in to accommodation and refresh",
                f"Evening walk & orientation around {current_landmark}",
                f"Welcome dinner sampling signature {destination} local delicacies"
            ]

        elif day_number == total_days:
            title = f"Day {day_number}: Final Exploration at {current_landmark} & Departure"
            activities = [
                "Morning breakfast and checkout preparation",
                f"Souvenir shopping & photo stops at {current_landmark}",
                f"Farewell tea & departure journey back to {source}"
            ]

        else:
            selected_activity = selected_activities[
                (day_number - 2) % len(selected_activities)
            ]

            title = f"Day {day_number} {travel_style} Expedition: {current_landmark}"
            activities = [
                f"Morning visit & guided exploration of {current_landmark}",
                selected_activity,
                f"Authentic local lunch near {current_landmark}",
                f"Afternoon scenic walk & cultural photography",
                "Relaxing evening dinner & local street nightlife"
            ]

        # High quality imagery mapping for specific day landmarks
        landmark_image_map = {
            "big ben": "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=1000&q=80",
            "tower bridge": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80",
            "british museum": "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1000&q=80",
            "london eye": "https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=1000&q=80",
            "buckingham": "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1000&q=80",
            "hyde park": "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1000&q=80",
            "camden": "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1000&q=80",
            "piccadilly": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80",
            
            "eiffel": "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1000&q=80",
            "louvre": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1000&q=80",
            "notre": "https://images.unsplash.com/photo-1478359844494-1092259d93e4?auto=format&fit=crop&w=1000&q=80",
            "arc de triomphe": "https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=1000&q=80",
            
            "burj": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80",
            "dubai mall": "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1000&q=80",
            "palm": "https://images.unsplash.com/photo-1526495124112-1056c40e0485?auto=format&fit=crop&w=1000&q=80",
            
            "ubud": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80",
            "tanah": "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1000&q=80",
            "baga": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1000&q=80",
            "aguada": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80",
            "solang": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80",
            "hadimba": "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=1000&q=80",
            "hawa": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80",
            "amer": "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=1000&q=80",
        }

        lm_key = current_landmark.lower()
        matched_image = None
        for key, img_url in landmark_image_map.items():
            if key in lm_key:
                matched_image = img_url
                break

        if not matched_image:
            # Fallback to city default image or rotated travel photo
            fallback_photos = [
                "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80"
            ]
            matched_image = loc_info.get("image") or fallback_photos[(day_number - 1) % len(fallback_photos)]

        day_image = matched_image

        itinerary.append(
            {
                "day": day_number,
                "title": title,
                "activities": activities,
                "locationName": current_landmark,
                "latitude": offset_lat,
                "longitude": offset_lng,
                "image": day_image
            }
        )

    return itinerary