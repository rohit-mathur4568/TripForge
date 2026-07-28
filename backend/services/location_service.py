# Location geocoding coordinates, high-res destination visual imagery, and weather data helper

CITY_METADATA = {
    "paris": {
        "name": "Paris",
        "country": "France",
        "lat": 48.8566,
        "lng": 2.3522,
        "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
        "cover": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=80",
        "landmarks": ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Arc de Triomphe"],
        "weather": "18°C, Partly Cloudy"
    },
    "tokyo": {
        "name": "Tokyo",
        "country": "Japan",
        "lat": 35.6762,
        "lng": 139.6503,
        "image": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
        "cover": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80",
        "landmarks": ["Senso-ji Temple", "Tokyo Tower", "Shibuya Crossing", "Meiji Shrine"],
        "weather": "22°C, Clear Skies"
    },
    "new york": {
        "name": "New York",
        "country": "USA",
        "lat": 40.7128,
        "lng": -74.0060,
        "image": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
        "cover": "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=1600&q=80",
        "landmarks": ["Statue of Liberty", "Central Park", "Times Square", "Empire State Building"],
        "weather": "24°C, Sunny"
    },
    "london": {
        "name": "London",
        "country": "United Kingdom",
        "lat": 51.5074,
        "lng": -0.1278,
        "image": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
        "cover": "https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=1600&q=80",
        "landmarks": [
            "Big Ben & Palace of Westminster",
            "Tower Bridge & River Thames",
            "British Museum",
            "London Eye & Southbank",
            "Buckingham Palace & St James Park",
            "Hyde Park & Kensington Gardens",
            "Camden Market & Regent's Canal",
            "Piccadilly Circus & West End Theatres"
        ],
        "weather": "17°C, Mild"
    },
    "rome": {
        "name": "Rome",
        "country": "Italy",
        "lat": 41.9028,
        "lng": 12.4964,
        "image": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
        "cover": "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1600&q=80",
        "landmarks": ["Colosseum", "Trevi Fountain", "Vatican Museums", "Pantheon"],
        "weather": "26°C, Sunny"
    },
    "dubai": {
        "name": "Dubai",
        "country": "UAE",
        "lat": 25.2048,
        "lng": 55.2708,
        "image": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
        "cover": "https://images.unsplash.com/photo-1526495124112-1056c40e0485?auto=format&fit=crop&w=1600&q=80",
        "landmarks": ["Burj Khalifa", "Dubai Mall", "Palm Jumeirah", "Desert Safari"],
        "weather": "34°C, Warm"
    },
    "bali": {
        "name": "Bali",
        "country": "Indonesia",
        "lat": -8.4095,
        "lng": 115.1889,
        "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
        "cover": "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1600&q=80",
        "landmarks": ["Ubud Monkey Forest", "Tanah Lot", "Tegallalang Rice Terraces", "Uluwatu Temple"],
        "weather": "29°C, Tropical Breeze"
    },
    "goa": {
        "name": "Goa",
        "country": "India",
        "lat": 15.2993,
        "lng": 74.1240,
        "image": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
        "cover": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80",
        "landmarks": ["Baga Beach", "Calangute Beach", "Aguada Fort", "Dudhsagar Falls"],
        "weather": "30°C, Sunny Beach"
    },
    "manali": {
        "name": "Manali",
        "country": "India",
        "lat": 32.2432,
        "lng": 77.1892,
        "image": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
        "cover": "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=1600&q=80",
        "landmarks": ["Solang Valley", "Rohtang Pass", "Hadimba Temple", "Old Manali Cafes"],
        "weather": "14°C, Cool Mountain"
    },
    "mumbai": {
        "name": "Mumbai",
        "country": "India",
        "lat": 19.0760,
        "lng": 72.8777,
        "image": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
        "cover": "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1600&q=80",
        "landmarks": ["Gateway of India", "Marine Drive", "Juhu Beach", "Elephanta Caves"],
        "weather": "31°C, Humid Breeze"
    },
    "delhi": {
        "name": "New Delhi",
        "country": "India",
        "lat": 28.6139,
        "lng": 77.2090,
        "image": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
        "cover": "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80",
        "landmarks": ["India Gate", "Qutub Minar", "Humayun's Tomb", "Red Fort"],
        "weather": "30°C, Clear"
    },
    "jaipur": {
        "name": "Jaipur",
        "country": "India",
        "lat": 26.9124,
        "lng": 75.7873,
        "image": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
        "cover": "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=1600&q=80",
        "landmarks": ["Hawa Mahal", "Amer Fort", "City Palace", "Jantar Mantar"],
        "weather": "32°C, Warm"
    }
}

DEFAULT_FALLBACK = {
    "lat": 20.5937,
    "lng": 78.9629,
    "image": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
    "cover": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80",
    "landmarks": ["Central Plaza", "Historical Center", "City Viewpoint", "Local Market"],
    "weather": "23°C, Pleasant"
}

def get_location_info(location_name: str) -> dict:
    key = location_name.strip().lower()
    for name, data in CITY_METADATA.items():
        if name in key or key in name:
            return data
    
    # Generate dynamic offset lat/lng based on city hash if not matched
    city_hash = sum(ord(c) for c in location_name)
    lat = round(10.0 + (city_hash % 50) + (city_hash % 100) / 100.0, 4)
    lng = round(10.0 + ((city_hash * 3) % 120) + (city_hash % 100) / 100.0, 4)

    return {
        "name": location_name.title(),
        "country": "Global Destination",
        "lat": lat,
        "lng": lng,
        "image": DEFAULT_FALLBACK["image"],
        "cover": DEFAULT_FALLBACK["cover"],
        "landmarks": DEFAULT_FALLBACK["landmarks"],
        "weather": DEFAULT_FALLBACK["weather"]
    }
