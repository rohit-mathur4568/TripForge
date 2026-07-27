import os
from typing import Any
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

KNOWLEDGE_BASE = """
TripForge is an intelligent, multi-agent AI travel planner designed for global exploration.
It generates personalized day-by-day itineraries, interactive Leaflet route maps, estimated budget breakdowns, and 1-click Google Calendar / iCal (.ics) exports tailored to your dates and travel preferences!
Using TripForge is simple:
1. Click 'Start Planning' on the homepage.
2. Register or Sign In to your account.
3. Enter your travel dates, budget, starting point, and destination.
4. Let our AI multi-agent system synthesize your custom route, map, and daily schedule!

TripForge features include:
• Specialized Multi-Agent AI (Supervisor, Budget, Destination & Itinerary agents)
• Interactive Leaflet route maps with location waypoints
• 1-Click iCal (.ics) export and Google Calendar sync
• JWT-secured user trip history
• High-resolution location imagery & live weather previews

TripForge plans journeys worldwide! Popular destinations include Paris, Tokyo, Bali, Rome, London, New York, Dubai, Sydney, New Delhi, Jaipur, and many more.
Our Budget Agent calculates optimized expense distributions for transport, accommodation, food, activities, and emergency reserves so you get maximum value for your travel budget.
"""

def generate_chat_response(message: str) -> dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY")
    
    # If no API key is provided, fallback to rule-based generic message
    if not api_key or api_key == "your_openai_api_key":
        return _fallback_response(message)
        
    try:
        client = OpenAI(api_key=api_key)
        
        system_prompt = (
            "You are the TripForge AI Assistant, a friendly and helpful chatbot that lives on the TripForge landing page. "
            "Your job is to answer questions strictly about the TripForge platform using the provided context.\n\n"
            f"Context about TripForge:\n{KNOWLEDGE_BASE}\n\n"
            "Keep your answers concise, engaging, and friendly. Do not answer questions unrelated to travel or the TripForge platform."
        )
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        reply = response.choices[0].message.content
        
        return {
            "reply": reply,
            "suggestions": [
                "What is TripForge?",
                "How do I start planning a trip?",
                "What features are included?",
                "Popular destinations"
            ]
        }
    except Exception as e:
        print(f"OpenAI API Error: {e}")
        return _fallback_response(message)

def _fallback_response(message: str) -> dict[str, Any]:
    msg_lower = message.strip().lower()
    
    if any(k in msg_lower for k in ["what is", "about tripforge", "explain"]):
        reply = "TripForge is an intelligent, multi-agent AI travel planner designed for global exploration. It generates personalized day-by-day itineraries, interactive Leaflet route maps, estimated budget breakdowns, and 1-click Google Calendar exports!"
    elif any(k in msg_lower for k in ["how to", "get started", "start", "use"]):
        reply = "Using TripForge is simple:\n1. Click 'Start Planning' on the homepage.\n2. Register or Sign In to your account.\n3. Enter your travel dates, budget, starting point, and destination.\n4. Let our AI multi-agent system synthesize your custom route!"
    elif any(k in msg_lower for k in ["feature", "capability", "capabilities", "can you do"]):
        reply = "TripForge features include:\n• Specialized Multi-Agent AI\n• Interactive Leaflet route maps\n• 1-Click iCal (.ics) export\n• JWT-secured user trip history\n• High-resolution location imagery"
    elif any(k in msg_lower for k in ["destination", "where", "place", "city", "countries"]):
        reply = "TripForge plans journeys worldwide! Popular destinations include Paris, Tokyo, Bali, Rome, London, New York, Dubai, Sydney, New Delhi, Jaipur, and many more."
    elif any(k in msg_lower for k in ["budget", "cost", "price", "expense"]):
        reply = "Our Budget Agent calculates optimized expense distributions for transport, accommodation, food, activities, and emergency reserves so you get maximum value for your travel budget."
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
