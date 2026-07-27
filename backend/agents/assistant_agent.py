from typing import Any

KNOWLEDGE_BASE = {
    "what is tripforge": (
        "TripForge is an intelligent, multi-agent AI travel planner designed for global exploration. "
        "It generates personalized day-by-day itineraries, interactive Leaflet route maps, estimated budget breakdowns, "
        "and 1-click Google Calendar / iCal (.ics) exports tailored to your dates and travel preferences!"
    ),
    "how to use": (
        "Using TripForge is simple:\n"
        "1. Click 'Start Planning' on the homepage.\n"
        "2. Register or Sign In to your account.\n"
        "3. Enter your travel dates, budget, starting point, and destination.\n"
        "4. Let our AI multi-agent system synthesize your custom route, map, and daily schedule!"
    ),
    "features": (
        "TripForge features include:\n"
        "• Specialized Multi-Agent AI (Supervisor, Budget, Destination & Itinerary agents)\n"
        "• Interactive Leaflet route maps with location waypoints\n"
        "• 1-Click iCal (.ics) export and Google Calendar sync\n"
        "• JWT-secured user trip history\n"
        "• High-resolution location imagery & live weather previews"
    ),
    "destinations": (
        "TripForge plans journeys worldwide! Popular destinations include Paris, Tokyo, Bali, Rome, London, "
        "New York, Dubai, Sydney, New Delhi, Jaipur, and many more."
    ),
    "budget": (
        "Our Budget Agent calculates optimized expense distributions for transport, accommodation, food, "
        "activities, and emergency reserves so you get maximum value for your travel budget."
    )
}

def generate_chat_response(message: str) -> dict[str, Any]:
    msg_lower = message.strip().lower()
    
    if any(k in msg_lower for k in ["what is", "about tripforge", "explain"]):
        reply = KNOWLEDGE_BASE["what is tripforge"]
    elif any(k in msg_lower for k in ["how to", "get started", "start", "use"]):
        reply = KNOWLEDGE_BASE["how to use"]
    elif any(k in msg_lower for k in ["feature", "capability", "capabilities", "can you do"]):
        reply = KNOWLEDGE_BASE["features"]
    elif any(k in msg_lower for k in ["destination", "where", "place", "city", "countries"]):
        reply = KNOWLEDGE_BASE["destinations"]
    elif any(k in msg_lower for k in ["budget", "cost", "price", "expense"]):
        reply = KNOWLEDGE_BASE["budget"]
    elif any(k in msg_lower for k in ["hi", "hello", "hey", "greetings"]):
        reply = "Hello! 👋 I'm the TripForge AI Assistant. Ask me anything about planning global trips, our multi-agent AI, interactive maps, or features!"
    else:
        reply = (
            f"TripForge is your AI assistant for planning complete global journeys! "
            f"I can help you learn about our multi-agent AI planner, interactive route maps, calendar exports, or budget optimization. "
            f"Try asking: 'What is TripForge?', 'How to start planning?', or 'What features are included?'"
        )

    return {
        "reply": reply,
        "suggestions": [
            "What is TripForge?",
            "How do I start planning a trip?",
            "What features are included?",
            "Popular destinations"
        ]
    }
