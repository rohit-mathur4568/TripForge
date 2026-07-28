from typing import Any


def create_budget_plan(trip_data: dict[str, Any]) -> dict[str, Any]:
    total_budget = float(trip_data.get("budget", 40000))
    base_currency = trip_data.get("baseCurrency", "INR")
    destination = str(trip_data.get("destination", "")).lower().strip()
    source = str(trip_data.get("source", "")).lower().strip()
    accommodation_type = trip_data.get("accommodationPreference", "Comfortable")
    interests = trip_data.get("interests", [])
    adults = int(trip_data.get("adults", 0))
    children = int(trip_data.get("children", 0))

    # Weighting: 1 Adult = 1.0, 1 Child = 0.6
    total_weighted_travelers = max(0.6, adults + (children * 0.6))

    # Base Currency to INR Conversion Rate
    currency_to_inr = {
        "INR": 1.0,
        "USD": 83.5,
        "EUR": 90.2,
        "GBP": 106.0,
        "AED": 22.7,
    }
    rate_to_inr = currency_to_inr.get(base_currency, 1.0)
    budget_in_inr = total_budget * rate_to_inr

    # Interdependent Entity Multipliers
    # Base daily cost per adult traveler by destination tier
    base_daily_inr = 2500.0  # Domestic Default (Goa, Manali, Jaipur)
    if any(k in destination for k in ["bali", "thailand", "dubai", "indonesia"]):
        base_daily_inr = 5500.0
    elif any(k in destination for k in ["paris", "swiss", "london", "rome", "tokyo", "japan", "france", "italy"]):
        base_daily_inr = 12000.0

    # Stay Multiplier (Compounding factor across all travelers)
    stay_multiplier = {
        "Budget": 0.85,
        "Comfortable": 1.0,
        "Premium": 1.4,
        "Luxury": 2.0,
    }.get(accommodation_type, 1.0)

    # Interests Activity Multiplier (Compounding per traveler & interest activity load)
    interests_count = len(interests) if isinstance(interests, list) else 0
    # Every additional interest beyond 1 adds +12% cost per traveler
    interest_multiplier = 1.0 + (max(0, interests_count - 1) * 0.12)

    # Interdependent Compounded Daily Cost (Travelers x Stay x Interests)
    effective_daily_inr = base_daily_inr * stay_multiplier * interest_multiplier

    # Estimated Days
    total_days = 3
    start_date = trip_data.get("startDate")
    end_date = trip_data.get("endDate")
    if start_date and end_date:
        try:
            from datetime import date
            d1 = date.fromisoformat(str(start_date))
            d2 = date.fromisoformat(str(end_date))
            diff = (d2 - d1).days + 1
            if diff > 0:
                total_days = diff
        except Exception:
            pass

    # Interdependent Required Total Calculation
    required_total_inr = effective_daily_inr * total_days * total_weighted_travelers
    required_total_base = round(required_total_inr / rate_to_inr)
    is_enough = budget_in_inr >= required_total_inr
    deficit_base = max(0, required_total_base - round(total_budget))

    # Allocation Percentages
    accommodation_pct = {
        "Budget": 0.25,
        "Comfortable": 0.30,
        "Premium": 0.35,
        "Luxury": 0.40,
    }.get(accommodation_type, 0.30)
    transport_pct = 0.25
    food_pct = 0.15
    activities_pct = 0.15
    reserve_pct = max(0.05, 1.0 - (accommodation_pct + transport_pct + food_pct + activities_pct))

    per_adult_share = round(total_budget / max(1.0, total_weighted_travelers))
    per_child_share = round(per_adult_share * 0.6)

    # Dynamic Interdependent Advice & Status
    status = "sufficient"
    advice = "Your budget is well-balanced for your selected group size, stay style, and interests."
    
    if not is_enough:
        status = "deficit"
        advice = f"Your budget of {total_budget:.0f} {base_currency} is insufficient for {total_weighted_travelers:.1f} weighted traveler(s) seeking a {accommodation_type} stay with {interests_count} selected interest(s). Minimum required total is {required_total_base:.0f} {base_currency}. Consider reducing group size, selecting a Budget stay, or deselecting extra interests."
    elif total_budget > (required_total_base * 1.4):
        status = "surplus"
        advice = f"Great news! You have a surplus budget of {round(total_budget - required_total_base):.0f} {base_currency}. You can upgrade your stay or add more luxury activities!"

    return {
        "transport": round(total_budget * transport_pct),
        "accommodation": round(total_budget * accommodation_pct),
        "food": round(total_budget * food_pct),
        "activities": round(total_budget * activities_pct),
        "reserve": round(total_budget * reserve_pct),
        "totalBudget": round(total_budget),
        "baseCurrency": base_currency,
        "adultsCount": adults,
        "childrenCount": children,
        "totalWeightedTravelers": round(total_weighted_travelers, 1),
        "perAdultShare": per_adult_share,
        "perChildShare": per_child_share,
        "requiredTotalBase": required_total_base,
        "isEnough": is_enough,
        "deficitBase": deficit_base,
        "evaluationStatus": status,
        "agentAdvice": advice,
    }