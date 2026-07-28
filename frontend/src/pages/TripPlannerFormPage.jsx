import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getObfuscatedRoute } from "../utils/routeUtils";
import {
  ArrowLeft, ArrowRight, CalendarDays, Check, CircleDollarSign, Compass,
  Hotel, MapPin, Route, Sparkles, Utensils, Lock, ChevronRight, ChevronLeft
} from "lucide-react";
import AiChatbotPlannerPage from "./AiChatbotPlannerPage";

const travelStyles = ["Relaxing", "Adventure", "Cultural", "Family", "Romantic", "Business"];

function getDynamicDestinationInterests(destName = "") {
  const norm = (destName || "").toLowerCase();

  const destinationInterestsMap = {
    bali: ["🏝️ Beach Clubs & Shacks", "🌊 Surfing & Watersports", "🌴 Jungle Swings", "🧘 Spa & Wellness", "🛕 Ancient Temples", "🌋 Volcanic Trekking"],
    goa: ["🌅 Sunset Shacks", "🍹 Beach Nightlife", "⛵ Mandovi Cruises", "🏰 Portuguese Heritage", "🍤 Goan Seafood", "🌊 Water Sports"],
    paris: ["🗼 Eiffel Tower Views", "🎨 Louvre & Fine Arts", "🥐 Parisian Bakery Tours", "🍷 Wine Tasting", "🛍️ Haute Couture Shopping", "⛵ Seine River Cruises"],
    manali: ["❄️ Snow Sports & Skiing", "🪂 Tandem Paragliding", "🏔️ Mountain Trekking", "♨️ Hot Thermal Springs", "☕ Riverside Wooden Cafes", "⛺ Alpine Camping"],
    jaipur: ["🏰 Royal Fort Tours", "🎈 Hot Air Ballooning", "🐘 Elephant & Palace Walks", "🛍️ Johari Jewelry Shopping", "🍛 Authentic Rajasthani Thali", "📸 Historic Photography"],
    dubai: ["🏙️ Burj Khalifa Skyscraper", "🏜️ Desert Dune Safari", "🛍️ Luxury Gold Souk", "⛵ Yacht Cruises", "🎡 Theme Parks"],
    tokyo: ["🏮 Anime & Tech Districts", "🌸 Cherry Blossom Walks", "🍣 Authentic Sushi Dining", "⛩️ Shinto Shrines", "🗼 Skyline Viewpoints"],
    thailand: ["🏝️ Island Hopping", "🐘 Elephant Sanctuaries", "🍜 Street Food Night Markets", "🧘 Thai Massage", "🥊 Muay Thai Shows"],
    swiss: ["⛷️ Alpine Skiing", "🏔️ Glacier Cable Cars", "🍫 Swiss Chocolate Tours", "🚂 Scenic Mountain Trains", "🏞️ Eco Nature Trails"],
    maldives: ["🌊 Overwater Villa Stays", "🐠 Manta Ray Snorkeling", "🌅 Sunset Dolphin Cruises", "🏝️ Private Island Picnic", "🤿 Scuba Diving"]
  };

  const matchedKey = Object.keys(destinationInterestsMap).find((k) => norm.includes(k));
  if (matchedKey) return destinationInterestsMap[matchedKey];

  // High quality dynamic fallback for any destination
  return [
    `🏛️ Historic Sights in ${destName || "City"}`,
    `🍲 Famous Local Food & Dining`,
    `🛍️ Popular Tourist Bazaars`,
    `📸 Panoramic Scenic Photography`,
    `☕ Cozy Local Cafes`,
    `🎭 Cultural Performances`
  ];
}

function getSuggestedDestinations(style = "Relaxing") {
  const suggestions = {
    Relaxing: [
      { name: "Bali", icon: "🏝️", tag: "Tropical Beaches" },
      { name: "Goa", icon: "🌅", tag: "Beach Resort" },
      { name: "Kerala", icon: "🌴", tag: "Backwaters" },
      { name: "Maldives", icon: "🌊", tag: "Overwater Stays" },
    ],
    Adventure: [
      { name: "Manali", icon: "🏔️", tag: "Trekking & Snow" },
      { name: "Leh Ladakh", icon: "🏍️", tag: "High Pass Roads" },
      { name: "Swiss Alps", icon: "⛷️", tag: "Skiing & Peaks" },
      { name: "Rishikesh", icon: "🚣‍♂️", tag: "Rafting & Camping" },
    ],
    Cultural: [
      { name: "Jaipur", icon: "🏰", tag: "Royal Palaces" },
      { name: "Varanasi", icon: "🛕", tag: "Spiritual Heritage" },
      { name: "Rome", icon: "🏛️", tag: "Historic Monuments" },
      { name: "Kyoto", icon: "⛩️", tag: "Ancient Temples" },
    ],
    Family: [
      { name: "Singapore", icon: "🎡", tag: "Theme Parks & Zoo" },
      { name: "Dubai", icon: "🏙️", tag: "Safaris & Wonders" },
      { name: "Ooty", icon: "🚂", tag: "Toy Train & Gardens" },
      { name: "London", icon: "🏰", tag: "Museums & Sights" },
    ],
    Romantic: [
      { name: "Paris", icon: "🗼", tag: "City of Love" },
      { name: "Udaipur", icon: "⛵", tag: "Lake Palaces" },
      { name: "Santorini", icon: "🌅", tag: "Sunset Views" },
      { name: "Swiss Alps", icon: "❄️", tag: "Romantic Chalets" },
    ],
    Business: [
      { name: "Tokyo", icon: "🗼", tag: "Tech & Finance Hub" },
      { name: "New York", icon: "🏙️", tag: "Global Corporate" },
      { name: "Singapore", icon: "💼", tag: "Business District" },
      { name: "Mumbai", icon: "🏙️", tag: "Financial Hub" },
    ]
  };
  return suggestions[style] || suggestions.Relaxing;
}

function getDestinationHighlights(destName = "Goa", style = "Relaxing") {
  const norm = (destName || "Goa").toLowerCase();

  const database = {
    bali: {
      title: "Bali, Indonesia",
      quote: "Get ready for mystical clifftop ocean temples, lush jungle swings, and turquoise beach clubs!",
      bgCover: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
      vibe: "✨ Tropical Island Freedom & Spiritual Calm",
      attractions: [
        { name: "Uluwatu Sunset Temple", image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=400&q=80", rating: "4.9 ⭐", desc: "Clifftop ocean views & Kecak fire dance" },
        { name: "Tegallalang Rice Terraces", image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=400&q=80", rating: "4.8 ⭐", desc: "Emerald green valley swings & coffee farms" },
        { name: "Nusa Penida Kelingking Cliff", image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=400&q=80", rating: "5.0 ⭐", desc: "Iconic T-Rex shaped cliff over turquoise waters" },
      ],
      experiences: ["Floating Breakfast in Private Villa", "Snorkeling with Manta Rays", "Canggu Beach Club Sunset Party"]
    },
    goa: {
      title: "Goa, India",
      quote: "Sun, golden sands, palm shacks, and electrifying beach vibes await your ultimate vacation!",
      bgCover: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
      vibe: "🌅 Coastal Shacks & Electric Nightlife",
      attractions: [
        { name: "Vagator & Palolem Beaches", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80", rating: "4.8 ⭐", desc: "Golden sands, cliff cafes & sunset music" },
        { name: "Dudhsagar Milky Falls", image: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=400&q=80", rating: "4.9 ⭐", desc: "4-tier roaring waterfall in deep jungle" },
        { name: "Fontainhas Latin Quarter", image: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=400&q=80", rating: "4.7 ⭐", desc: "Bright Portuguese villas & vintage bakeries" },
      ],
      experiences: ["Sunset Mandovi River Cruise", "Parasailing over Baga Beach", "Authentic Goan Prawn Curry Tasting"]
    },
    paris: {
      title: "Paris, France",
      quote: "Step into a world of sparkling golden lights, iconic art museums, and romantic boulevard cafes!",
      bgCover: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
      vibe: "🗼 Unmatched Romance, Fashion & Fine Arts",
      attractions: [
        { name: "Eiffel Tower Sparkle View", image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=400&q=80", rating: "5.0 ⭐", desc: "Iconic tower glittering under night skies" },
        { name: "Louvre Museum Glass Pyramid", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=400&q=80", rating: "4.9 ⭐", desc: "Home to Mona Lisa & timeless sculpture galleries" },
        { name: "Seine River Historic Bridges", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80", rating: "4.8 ⭐", desc: "Charming stone bridges & boat cruises" },
      ],
      experiences: ["Champagne Sunset Boat Cruise", "Fresh Butter Croissants in Montmartre", "Palace of Versailles Royal Gardens"]
    },
    manali: {
      title: "Manali, Himachal Pradesh",
      quote: "Feel the thrill of snow-capped Himalayan peaks, pine forests, and high-altitude mountain chill!",
      bgCover: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
      vibe: "❄️ Snow Peaks & High Altitude Adventure",
      attractions: [
        { name: "Solang Valley Snow Park", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=400&q=80", rating: "4.9 ⭐", desc: "Paragliding, skiing & ATV snow rides" },
        { name: "Rohtang Glacier Pass", image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=400&q=80", rating: "5.0 ⭐", desc: "13,000 ft snow walls & panoramic peaks" },
        { name: "Old Manali Wooden Cafes", image: "https://images.unsplash.com/photo-1565354045330-802525c79808?auto=format&fit=crop&w=400&q=80", rating: "4.8 ⭐", desc: "Cozy riverside cafes & live acoustic music" },
      ],
      experiences: ["Tandem Paragliding over Valley", "Natural Hot Water Dip at Vashisht", "Riverside Bonfire & Wood-fired Pizza"]
    },
    jaipur: {
      title: "Jaipur, Rajasthan",
      quote: "Immerse yourself in royal palaces, hilltop fortresses, and the vibrant heritage of the Pink City!",
      bgCover: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
      vibe: "🏰 Royal Fortresses & Timeless Heritage",
      attractions: [
        { name: "Hawa Mahal (Palace of Winds)", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=400&q=80", rating: "4.9 ⭐", desc: "Honeycomb pink sandstone latticework windows" },
        { name: "Amer Fort Hilltop Palace", image: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=400&q=80", rating: "4.9 ⭐", desc: "Majestic hilltop fort with Sheesh Mahal mirrors" },
        { name: "Jal Mahal Lake View", image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=400&q=80", rating: "4.8 ⭐", desc: "Floating palace in serene Man Sagar Lake" },
      ],
      experiences: ["Hot Air Ballooning at Sunrise", "Authentic Dal Baati Churma Thali", "Jewelry & Handloom Shopping at Johari Bazaar"]
    },
    tokyo: {
      title: "Tokyo, Japan",
      quote: "Experience futuristic cyberpunk neon streets, ancient Shinto shrines, and world-class ramen!",
      bgCover: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
      vibe: "🏮 Neon Cyberpunk & Ancient Tradition",
      attractions: [
        { name: "Shibuya Crossing Neon", image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=400&q=80", rating: "5.0 ⭐", desc: "World's busiest pedestrian crosswalk with giant screens" },
        { name: "Senso-ji Temple Asakusa", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80", rating: "4.9 ⭐", desc: "Ancient 7th-century Buddhist pagoda & lanterns" },
        { name: "Tokyo Skytree Skyline", image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=400&q=80", rating: "4.8 ⭐", desc: "2,080 ft tower with panoramic Mount Fuji views" },
      ],
      experiences: ["Authentic Tonkotsu Ramen Tasting", "Anime & Arcade Gaming in Akihabara", "Cherry Blossom Park Stroll"]
    },
    dubai: {
      title: "Dubai, UAE",
      quote: "Witness sky-piercing skyscrapers, thrilling desert dune bashing, and ultra-luxury shopping!",
      bgCover: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
      vibe: "🏙️ Ultra-Modern Luxury & Desert Thrills",
      attractions: [
        { name: "Burj Khalifa Observation Deck", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80", rating: "5.0 ⭐", desc: "World's tallest building overlooking Arabian Gulf" },
        { name: "Red Dune Desert Safari", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80", rating: "4.9 ⭐", desc: "4x4 dune bashing, quad biking & Bedouin BBQ" },
        { name: "Dubai Marina Yacht Promenade", image: "https://images.unsplash.com/photo-1526495124112-1056c40e0485?auto=format&fit=crop&w=400&q=80", rating: "4.8 ⭐", desc: "Luxury yacht harbor & illuminated skyline" },
      ],
      experiences: ["Dubai Fountain Light Show", "Luxury Yacht Sunset Cruise", "Gold & Spice Souk Walking Tour"]
    }
  };

  const foundKey = Object.keys(database).find((k) => norm.includes(k));
  if (foundKey) return database[foundKey];

  return {
    title: destName || "Your Dream Destination",
    quote: `You are taking the best decision of your life! Get ready for unbelievable moments in ${destName || "your journey"}.`,
    bgCover: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
    vibe: `✨ Incredible ${style} Vacation Experience`,
    attractions: [
      { name: `Top Sights in ${destName}`, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80", rating: "4.9 ⭐", desc: "Breathtaking landmarks & photo points" },
      { name: `Local Culture & Food`, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80", rating: "4.8 ⭐", desc: "Authentic culinary delights & night markets" },
      { name: `Scenic Viewpoints`, image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80", rating: "5.0 ⭐", desc: "Unforgettable panoramic landscapes" },
    ],
    experiences: ["Curated Local Sightseeing", "Luxury Hotel Stays", "AI Guided Itinerary Map"]
  };
}

function getRealWorldCurrencyConversion(destName = "", budgetAmt = 40000, userBaseCurrency = "INR", sourceName = "") {
  const normDest = (destName || "").toLowerCase();
  const normSource = (sourceName || "").toLowerCase();
  const amt = Number(budgetAmt) || 0;

  // Country/City Location to Currency Code Detector
  const locationToCurrency = {
    // US & Americas
    "usa": "USD", "united states": "USD", "new york": "USD", "california": "USD", "miami": "USD", "chicago": "USD", "los angeles": "USD",
    // UK & Europe
    "uk": "GBP", "london": "GBP", "england": "GBP", "manchester": "GBP",
    "france": "EUR", "paris": "EUR", "germany": "EUR", "berlin": "EUR", "italy": "EUR", "rome": "EUR", "spain": "EUR", "madrid": "EUR",
    "switzerland": "CHF", "swiss": "CHF", "zurich": "CHF", "geneva": "CHF",
    // Middle East & Asia
    "uae": "AED", "dubai": "AED", "abu dhabi": "AED",
    "japan": "JPY", "tokyo": "JPY", "kyoto": "JPY", "osaka": "JPY",
    "indonesia": "IDR", "bali": "IDR", "jakarta": "IDR",
    "thailand": "THB", "bangkok": "THB", "phuket": "THB",
    "singapore": "SGD",
    "maldives": "MVR", "male": "MVR",
    // India
    "india": "INR", "delhi": "INR", "mumbai": "INR", "goa": "INR", "manali": "INR", "jaipur": "INR", "kerala": "INR", "bangalore": "INR"
  };

  // Determine Source Currency: use matched source location or fallback to userBaseCurrency dropdown
  let sourceCurrency = userBaseCurrency;
  const matchedSourceKey = Object.keys(locationToCurrency).find((k) => normSource.includes(k));
  if (matchedSourceKey) {
    sourceCurrency = locationToCurrency[matchedSourceKey];
  }

  // Determine Destination Currency: use matched destination location or default to source currency
  let destCurrency = sourceCurrency;
  const matchedDestKey = Object.keys(locationToCurrency).find((k) => normDest.includes(k));
  if (matchedDestKey) {
    destCurrency = locationToCurrency[matchedDestKey];
  }

  // Forex USD Cross Rates (1 USD = X Local Currency)
  const usdCrossRates = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    INR: 83.5,
    AED: 3.67,
    JPY: 155.0,
    IDR: 15950,
    THB: 36.5,
    CHF: 0.88,
    SGD: 1.35,
    MVR: 15.4
  };

  const currencyDetails = {
    USD: { symbol: "$", flag: "🇺🇸", name: "US Dollar", ppp: 1.0 },
    EUR: { symbol: "€", flag: "🇪🇺", name: "Euro", ppp: 0.85 },
    GBP: { symbol: "£", flag: "🇬🇧", name: "British Pound", ppp: 0.80 },
    INR: { symbol: "₹", flag: "🇮🇳", name: "Indian Rupee", ppp: 3.5 },
    AED: { symbol: "AED ", flag: "🇦🇪", name: "UAE Dirham", ppp: 0.9 },
    JPY: { symbol: "¥", flag: "🇯🇵", name: "Japanese Yen", ppp: 1.2 },
    IDR: { symbol: "Rp ", flag: "🇮🇩", name: "Indonesian Rupiah", ppp: 2.4 },
    THB: { symbol: "฿", flag: "🇹🇭", name: "Thai Baht", ppp: 2.1 },
    CHF: { symbol: "CHF ", flag: "🇨🇭", name: "Swiss Franc", ppp: 0.6 },
    SGD: { symbol: "S$", flag: "🇸🇬", name: "Singapore Dollar", ppp: 0.85 },
    MVR: { symbol: "Rf ", flag: "🇲🇻", name: "Maldivian Rufiyaa", ppp: 0.7 }
  };

  // Convert budgetAmt from sourceCurrency -> USD -> destCurrency
  const srcUsdRate = usdCrossRates[sourceCurrency] || 1.0;
  const destUsdRate = usdCrossRates[destCurrency] || 1.0;

  const budgetInUSD = amt / srcUsdRate;
  const convertedValue = budgetInUSD * destUsdRate;

  // 1 Source Currency = X Destination Currency Rate
  const directRate = (1 / srcUsdRate) * destUsdRate;

  const srcInfo = currencyDetails[sourceCurrency] || { symbol: sourceCurrency, flag: "🌐", name: sourceCurrency };
  const destInfo = currencyDetails[destCurrency] || { symbol: destCurrency, flag: "🌐", name: destCurrency, ppp: 1.0 };

  const isDomestic = sourceCurrency === destCurrency;

  let pppNote = `Standard purchasing power for ${destName || "your destination"}.`;
  if (destInfo.ppp > 1.5) {
    pppNote = `🚀 High Purchasing Power! Your ${sourceCurrency} money goes ${destInfo.ppp}x further in ${destName || "destination"}!`;
  } else if (destInfo.ppp < 0.7) {
    pppNote = `⚠️ Premium Destination: Expenses in ${destName || "destination"} are ~30-40% higher. Plan budget carefully.`;
  }

  return {
    sourceCurrency,
    destCurrency,
    sourceSymbol: srcInfo.symbol,
    sourceFlag: srcInfo.flag,
    sourceName: srcInfo.name,
    destSymbol: destInfo.symbol,
    destFlag: destInfo.flag,
    destName: destInfo.name,
    convertedValue: Math.round(convertedValue).toLocaleString("en-US"),
    directRate: directRate > 100 ? directRate.toFixed(1) : directRate.toFixed(2),
    pppNote,
    isDomestic
  };
}

function analyzeRealWorldBudget({ destination, budget, baseCurrency = "INR", startDate, endDate, adults = 0, children = 0, accommodationPreference = "Comfortable", interests = [] }) {
  const budgetNum = Number(budget) || 0;
  const numAdults = Number(adults);
  const numChildren = Number(children);
  const interestsCount = Array.isArray(interests) ? interests.length : 0;

  // Weighted travelers: 1 Adult = 1.0, 1 Child = 0.6
  const totalWeightedTravelers = Math.max(0.6, numAdults + (numChildren * 0.6));

  // Base currencies to INR rate for threshold calculation
  const currencyToINR = { INR: 1.0, USD: 83.5, EUR: 90.2, GBP: 106.0, AED: 22.7 };
  const rateToINR = currencyToINR[baseCurrency] || 1.0;
  const budgetInINR = budgetNum * rateToINR;

  let days = 3;
  if (startDate && endDate) {
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
    if (diff > 0) days = diff;
  }

  const destLower = (destination || "").toLowerCase();
  let baseDailyPerPersonINR = 2500;

  if (destLower.includes("bali") || destLower.includes("thailand") || destLower.includes("dubai")) {
    baseDailyPerPersonINR = 5500;
  } else if (destLower.includes("paris") || destLower.includes("swiss") || destLower.includes("london") || destLower.includes("rome") || destLower.includes("tokyo")) {
    baseDailyPerPersonINR = 12000;
  }

  // Stay Multiplier: Budget (0.9x), Comfortable (1.0x), Premium (1.35x), Luxury (1.8x)
  const stayMultiplier = { Budget: 0.9, Comfortable: 1.0, Premium: 1.35, Luxury: 1.8 }[accommodationPreference] || 1.0;

  // Interests Activity Multiplier: Base includes 2 core interests. Each extra interest adds +10% activity cost
  const interestMultiplier = 1.0 + (Math.max(0, interestsCount - 2) * 0.10);

  // Effective daily rate incorporating stay choice & interests load
  const effectiveDailyPerPersonINR = baseDailyPerPersonINR * stayMultiplier * interestMultiplier;

  const estimatedMinTotalINR = effectiveDailyPerPersonINR * days * totalWeightedTravelers;
  const estimatedMinTotalBase = Math.round(estimatedMinTotalINR / rateToINR);
  const isEnough = budgetInINR >= estimatedMinTotalINR;
  const deficit = estimatedMinTotalINR - budgetInINR;

  const currSymbol = { INR: "₹", USD: "$", EUR: "€", GBP: "£", AED: "AED " }[baseCurrency] || "₹";

  let alternatives = [];
  if (destLower.includes("paris") || destLower.includes("swiss") || destLower.includes("rome")) {
    alternatives = [
      { name: "Manali & Solang Valley", budget: `₹${(days * 3000 * numAdults).toLocaleString("en-IN")}`, desc: "Enjoy snow peaks & mountain views at 70% lower cost!" },
      { name: "Pondicherry", budget: `₹${(days * 2500 * numAdults).toLocaleString("en-IN")}`, desc: "French colonial streets & beach cafes in India!" }
    ];
  } else if (destLower.includes("bali") || destLower.includes("maldives")) {
    alternatives = [
      { name: "Gokarna & North Goa", budget: `₹${(days * 2000 * numAdults).toLocaleString("en-IN")}`, desc: "Prisitive beaches, cliff cafes & relaxing shacks!" },
      { name: "Varkala, Kerala", budget: `₹${(days * 2200 * numAdults).toLocaleString("en-IN")}`, desc: "Cliffside ocean views & backwaters!" }
    ];
  } else {
    alternatives = [
      { name: "Rishikesh & Mussoorie", budget: `₹${(days * 1800 * numAdults).toLocaleString("en-IN")}`, desc: "Budget camping, river rafting & mountain chill!" },
      { name: "Udaipur & Pushkar", budget: `₹${(days * 2000 * numAdults).toLocaleString("en-IN")}`, desc: "Lake views & heritage hostels!" }
    ];
  }

  const worstCaseHacks = [
    "🏨 Stay: Book Backpacking Hostels (Zostel/Hosteller) or Homestays (~₹600-₹900/night)",
    "🚆 Travel: Choose Sleeper/3AC Trains or Overnight State Buses instead of flights",
    "🍱 Food: Eat at popular local street dhabas/markets instead of tourist restaurants",
    "🎟️ Sightseeing: Group up with co-travelers to split auto/cab rentals!"
  ];

  return {
    isEnough,
    estimatedMinTotal: estimatedMinTotalBase,
    estimatedMinTotalINR,
    currSymbol,
    deficit,
    days,
    alternatives,
    worstCaseHacks
  };
}

const initialFormData = {
  source: "",
  destination: "",
  startDate: "",
  endDate: "",
  adults: 1,
  children: 0,
  budget: "",
  baseCurrency: "INR",
  travelStyle: "Relaxing",
  transportPreference: "Any",
  accommodationPreference: "Comfortable",
  foodPreference: "Any",
  interests: [],
  additionalNotes: "",
};

function TripPlannerFormPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [plannerMode, setPlannerMode] = useState("form"); // "form" | "bot"

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  const minimumDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleInterestChange(interest) {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists ? prev.interests.filter((i) => i !== interest) : [...prev.interests, interest],
      };
    });
  }

  // STEP REORDER:
  // Step 1: Budget & Travel Style (Inputs: budget, travelStyle, accommodationPreference, foodPreference)
  // Step 2: Destination & Route (Inputs: source, destination + Recommended Destination Chips & Real-world budget check)
  // Step 3: Dates, Travellers & Interests (Inputs: startDate, endDate, adults, children, interests)
  function validateStep(step) {
    const errs = {};
    if (step === 1) {
      if (!formData.source.trim()) errs.source = "Starting location is required.";
      if (!formData.budget || Number(formData.budget) < 100) {
        errs.budget = "Valid budget required.";
      }
    } else if (step === 2) {
      if (!formData.destination.trim()) errs.destination = "Destination is required.";
    } else if (step === 3) {
      if (!formData.startDate) errs.startDate = "Start date required.";
      if (!formData.endDate) errs.endDate = "End date required.";
      if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
        errs.endDate = "End date must be after start date.";
      }
      if (Number(formData.adults) < 1) errs.adults = "At least 1 adult required.";
    }
    return errs;
  }

  function handleNext() {
    const errs = validateStep(currentStep);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    if (currentStep < 3) {
      setCurrentStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  }

  function handlePrev() {
    setErrors({});
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  }

  function handleSubmit() {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(getObfuscatedRoute(user, "/processing"), {
      state: {
        tripData: {
          ...formData,
          adults: Number(formData.adults),
          children: Number(formData.children),
          budget: Number(formData.budget),
        },
      },
    });
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-4 font-sans">
      {/* Header with Mode Switcher (Step Form vs Conversational AI Bot) */}
      <div className="bg-white dark:bg-[#121417] px-5 py-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Plan Your Trip</h1>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Choose how you want to build your itinerary: step-by-step form or conversational AI bot.
          </p>
        </div>

        {/* Mode Selector Pill */}
        <div className="flex items-center bg-slate-100 dark:bg-white/5 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setPlannerMode("form")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              plannerMode === "form"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Manual Form</span>
          </button>

          <button
            onClick={() => setPlannerMode("bot")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              plannerMode === "bot"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Conversational AI Bot</span>
          </button>
        </div>
      </div>

      {plannerMode === "bot" ? (
        <AiChatbotPlannerPage />
      ) : (
        <div className="space-y-4">
          {/* Step Progress Header */}
          <div className="bg-white dark:bg-[#121417] px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Step {currentStep} of 3</span>
            <div className="flex items-center gap-2">
              {[
                { num: 1, label: "Budget & Style" },
                { num: 2, label: "Destination & Route" },
                { num: 3, label: "Dates & Guests" },
              ].map((s) => (
                <div
                  key={s.num}
                  onClick={() => {
                    if (s.num < currentStep) setCurrentStep(s.num);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                    currentStep === s.num
                      ? "bg-slate-900 dark:bg-teal-500/20 text-white dark:text-teal-400"
                      : currentStep > s.num
                      ? "bg-emerald-50 dark:bg-white/5 text-emerald-600 dark:text-emerald-400"
                      : "bg-slate-100 dark:bg-white/5 text-slate-400"
                  }`}
                >
                  <span>{s.num}.</span>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content Card */}
          <div className="bg-white dark:bg-[#121417] p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
            
            {/* STEP 1: Budget & Travel Style (REORDERED STEP 1) */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black">
                      <CircleDollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-slate-900 dark:text-white">Step 1: Budget & Travel Style</h2>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Define your financial limit and vacation mood first.</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    AI Budget Agent Active
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left Column: Location & Budget & Preferences inputs */}
                  <div className="lg:col-span-7 space-y-3.5">
                    {/* Starting Location & Budget Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      {/* Starting Location */}
                      <div className="sm:col-span-6">
                        <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Starting Location *</label>
                        <input
                          type="text"
                          name="source"
                          value={formData.source}
                          onChange={handleInputChange}
                          placeholder="e.g. Delhi, Mumbai, New York"
                          className={inputStyle(errors.source)}
                        />
                        {errors.source && <p className="text-[11px] text-red-500 mt-0.5 font-bold">{errors.source}</p>}
                      </div>

                      {/* Total Budget Input with Clean Badge */}
                      <div className="sm:col-span-6">
                        <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Total Estimated Budget *</label>
                        <div className="flex items-center">
                          <span className="py-2.5 px-3 bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-r-0 border-slate-200 dark:border-white/10 rounded-l-xl flex items-center font-black text-sm shrink-0 select-none">
                            {{ INR: "₹", USD: "$", EUR: "€", GBP: "£", AED: "AED" }[formData.baseCurrency] || "₹"}
                          </span>
                          <input
                            type="number"
                            name="budget"
                            min="100"
                            value={formData.budget}
                            onChange={handleInputChange}
                            placeholder="40000"
                            className={`${inputStyle(errors.budget)} rounded-l-none border-l-0`}
                          />
                        </div>
                        {errors.budget && <p className="text-[11px] text-red-500 mt-0.5 font-bold">{errors.budget}</p>}
                      </div>
                    </div>

                    {/* Currency Selector Row */}
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Select Your Home Currency</label>
                      <select name="baseCurrency" value={formData.baseCurrency} onChange={handleInputChange} className={inputStyle()}>
                        <option value="INR">₹ INR (Indian Rupee)</option>
                        <option value="USD">$ USD (US Dollar)</option>
                        <option value="EUR">€ EUR (Euro)</option>
                        <option value="GBP">£ GBP (British Pound)</option>
                        <option value="AED">AED (UAE Dirham)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1.5">Select Travel Style</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {travelStyles.map((style) => {
                          const sel = formData.travelStyle === style;
                          return (
                            <button
                              key={style}
                              type="button"
                              onClick={() => setFormData((p) => ({ ...p, travelStyle: style }))}
                              className={`p-2.5 rounded-xl border text-[11px] font-extrabold text-left transition flex items-center justify-between ${
                                sel
                                  ? "border-teal-500 bg-teal-500/10 text-teal-600 dark:text-teal-400 font-black shadow-sm"
                                  : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] text-slate-600 dark:text-slate-300 hover:border-slate-300"
                              }`}
                            >
                              {style}
                              {sel && <Check className="w-3 h-3 text-teal-600 dark:text-teal-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Stay Preference</label>
                        <select name="accommodationPreference" value={formData.accommodationPreference} onChange={handleInputChange} className={inputStyle()}>
                          <option value="Budget">Budget Stay</option>
                          <option value="Comfortable">Comfortable Stay</option>
                          <option value="Premium">Premium Resort</option>
                          <option value="Luxury">Luxury Hotel</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Food Preference</label>
                        <select name="foodPreference" value={formData.foodPreference} onChange={handleInputChange} className={inputStyle()}>
                          <option value="Any">Any Food</option>
                          <option value="Vegetarian">Vegetarian</option>
                          <option value="Non-Vegetarian">Non-Veg</option>
                          <option value="Vegan">Vegan</option>
                          <option value="Local Cuisine">Local Cuisine</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Backend Budget Agent Allocation Card */}
                  <div className="lg:col-span-5 bg-slate-50 dark:bg-[#1a1d21] p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/5 pb-2">
                      <div className="flex items-center gap-1.5 text-amber-500 text-[11px] font-black uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Budget Agent Live Allocation</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[9px] font-bold">
                        Smart Splits
                      </span>
                    </div>

                    {(() => {
                      const budgetNum = Number(formData.budget) || 40000;
                      const sym = { INR: "₹", USD: "$", EUR: "€", GBP: "£", AED: "AED " }[formData.baseCurrency] || "₹";
                      const adults = Number(formData.adults) || 1;
                      const children = Number(formData.children) || 0;
                      const totalWeighted = adults + (children * 0.6);
                      const perAdultShare = Math.round(budgetNum / totalWeighted);
                      const perChildShare = Math.round(perAdultShare * 0.6);

                      const accRate = { Budget: 0.25, Comfortable: 0.30, Premium: 0.35, Luxury: 0.40 }[formData.accommodationPreference] || 0.30;
                      const transport = Math.round(budgetNum * 0.25);
                      const accommodation = Math.round(budgetNum * accRate);
                      const food = Math.round(budgetNum * 0.15);
                      const activities = Math.round(budgetNum * 0.15);
                      const reserve = Math.round(budgetNum * Math.max(0.05, 1 - (accRate + 0.55)));

                      return (
                        <div className="space-y-2">
                          <div className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex justify-between items-center">
                            <div>
                              <span className="text-xs font-black text-slate-900 dark:text-white block">Budget Pool</span>
                              <span className="text-[10px] text-slate-400 font-bold">{adults} Adult{adults > 1 ? "s" : ""}{children > 0 ? `, ${children} Child${children > 1 ? "ren" : ""}` : ""}</span>
                            </div>
                            <span className="text-sm font-black text-teal-600 dark:text-teal-400">{sym}{budgetNum.toLocaleString("en-IN")}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5">
                              <span className="text-slate-400 block text-[10px] font-bold">🏨 Stay ({Math.round(accRate * 100)}%)</span>
                              <span className="font-extrabold text-slate-800 dark:text-slate-200">{sym}{accommodation.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5">
                              <span className="text-slate-400 block text-[10px] font-bold">✈️ Transport (25%)</span>
                              <span className="font-extrabold text-slate-800 dark:text-slate-200">{sym}{transport.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5">
                              <span className="text-slate-400 block text-[10px] font-bold">🍱 Food & Dining (15%)</span>
                              <span className="font-extrabold text-slate-800 dark:text-slate-200">{sym}{food.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5">
                              <span className="text-slate-400 block text-[10px] font-bold">🎯 Activities (15%)</span>
                              <span className="font-extrabold text-slate-800 dark:text-slate-200">{sym}{activities.toLocaleString("en-IN")}</span>
                            </div>
                          </div>

                          {children > 0 && (
                            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-800 dark:text-amber-300 space-y-0.5">
                              <span className="font-bold block">👥 Adult vs Child Allocation Weighting:</span>
                              <span>Per Adult Share: <strong>{sym}{perAdultShare.toLocaleString("en-IN")}</strong> | Per Child Share (0.6x): <strong>{sym}{perChildShare.toLocaleString("en-IN")}</strong></span>
                            </div>
                          )}

                          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex justify-between items-center text-[10px]">
                            <span className="font-bold text-emerald-700 dark:text-emerald-300">🛡️ Emergency Reserve</span>
                            <span className="font-black text-emerald-700 dark:text-emerald-400">{sym}{reserve.toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Destination & Route (REORDERED STEP 2) */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-black">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-slate-900 dark:text-white">Step 2: Destination & Route</h2>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Select destination matched with your budget & style.</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                    AI Destination Agent Active
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left Column: Location Inputs */}
                  <div className="lg:col-span-7 space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Target Destination *</label>
                      <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        placeholder="e.g. Goa, Bali, Tokyo, Paris"
                        className={inputStyle(errors.destination)}
                      />
                      {errors.destination && <p className="text-[11px] text-red-500 mt-0.5 font-bold">{errors.destination}</p>}
                    </div>

                    {/* Forex & Purchasing Power Analysis Box */}
                    {(() => {
                      const budgetNum = Number(formData.budget) || 40000;
                      const fx = getRealWorldCurrencyConversion(formData.destination, budgetNum, formData.baseCurrency, formData.source);
                      const realWorld = analyzeRealWorldBudget(formData);

                      return (
                        <div className="space-y-2">
                          {/* Forex Box */}
                          <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 text-white border border-slate-700 shadow-md space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase text-teal-400 flex items-center gap-1">
                                💱 Forex ({fx.sourceFlag} {fx.sourceCurrency} ➔ {fx.destFlag} {fx.destCurrency})
                              </span>
                              <span className="text-[9px] font-extrabold text-teal-300 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                                {fx.isDomestic ? "Domestic Travel" : "Real-World Exchange"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-0.5">
                              <div>
                                <span className="text-[10px] text-slate-400 block font-medium">Converted Budget in {formData.destination || "Destination"}:</span>
                                <span className="text-base font-black text-emerald-400">
                                  {fx.destSymbol} {fx.convertedValue}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] text-slate-400 block font-bold">1 {fx.sourceCurrency} = {fx.directRate} {fx.destCurrency}</span>
                                <span className="text-[9px] font-semibold text-teal-300">{fx.destName}</span>
                              </div>
                            </div>

                            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[10px] text-slate-300 leading-snug">
                              <span className="font-bold text-amber-400 block">💡 Real-World Purchasing Power:</span>
                              <span>{fx.pppNote}</span>
                            </div>
                          </div>

                          {/* Feasibility Check */}
                          {!realWorld.isEnough ? (
                            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] space-y-1.5">
                              <span className="font-black text-amber-600 dark:text-amber-400 block">⚠️ Budget Feasibility Notice:</span>
                              <p className="text-slate-700 dark:text-slate-300 text-[10px] leading-snug">
                                Your budget of <strong>{realWorld.currSymbol}{budgetNum.toLocaleString("en-IN")}</strong> is below minimum estimate of <strong>{realWorld.currSymbol}{realWorld.estimatedMinTotal.toLocaleString("en-IN")}</strong> for {realWorld.days} days in {formData.destination || "destination"}.
                              </p>
                              <div className="space-y-1 pt-1">
                                <span className="font-extrabold text-[9px] text-teal-600 dark:text-teal-400 uppercase block">💡 Smart Alternative Destinations:</span>
                                <div className="grid grid-cols-1 gap-1">
                                  {realWorld.alternatives.map((alt, idx) => (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => setFormData((p) => ({ ...p, destination: alt.name }))}
                                      className="w-full p-1.5 rounded-lg bg-white dark:bg-white/10 border border-amber-500/20 text-left text-[10px] hover:border-teal-500 transition flex justify-between items-center"
                                    >
                                      <div>
                                        <span className="font-black text-slate-900 dark:text-white">{alt.name}</span>
                                        <span className="text-slate-400 block text-[9px]">{alt.desc}</span>
                                      </div>
                                      <span className="font-extrabold text-teal-600 dark:text-teal-400 shrink-0">{alt.budget}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[10px] font-bold text-teal-700 dark:text-teal-300">
                              ✅ Verified Sufficient: Your {realWorld.currSymbol}{budgetNum.toLocaleString("en-IN")} budget matches this destination!
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Right Column: AI Destination Agent Suggestions */}
                  <div className="lg:col-span-5 bg-slate-50 dark:bg-[#1a1d21] p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 flex flex-col justify-between space-y-2.5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 text-[11px] font-black uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Recommended for "{formData.travelStyle}"</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[9px] font-bold border border-teal-500/20">
                          1-Click Fill
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-1.5">
                        {getSuggestedDestinations(formData.travelStyle).map((dest) => (
                          <button
                            key={dest.name}
                            type="button"
                            onClick={() => {
                              setFormData((p) => ({ ...p, destination: dest.name }));
                              setErrors((prev) => ({ ...prev, destination: "" }));
                            }}
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-bold transition flex items-center justify-between cursor-pointer ${
                              formData.destination.toLowerCase() === dest.name.toLowerCase()
                                ? "bg-teal-600 text-white border-transparent shadow-sm"
                                : "bg-white dark:bg-white/5 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-teal-500"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-lg">{dest.icon}</span>
                              <span className="font-extrabold text-sm">{dest.name}</span>
                            </div>
                            <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${
                              formData.destination.toLowerCase() === dest.name.toLowerCase()
                                ? "bg-white/20 text-white"
                                : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300"
                            }`}>
                              {dest.tag}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Dates, Guests & Interests (REORDERED STEP 3) */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Hero Excitement Banner */}
                {(() => {
                  const highlights = getDestinationHighlights(formData.destination, formData.travelStyle);
                  return (
                    <div className="relative rounded-2xl overflow-hidden border border-teal-500/20 shadow-lg group">
                      <img
                        src={highlights.bgCover}
                        alt={highlights.title}
                        className="w-full h-28 sm:h-32 object-cover brightness-[0.4] group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-3.5 flex flex-col justify-end">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-teal-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-sm">
                            🌟 Amazing Decision!
                          </span>
                          <span className="text-[10px] font-bold text-teal-300">{highlights.vibe}</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                          {highlights.title}
                        </h3>
                        <p className="text-[11px] text-slate-200 font-medium italic mt-0.5 line-clamp-1">
                          "{highlights.quote}"
                        </p>
                      </div>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left Column: Dates & Guest Count */}
                  <div className="lg:col-span-6 space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-2">
                      <CalendarDays className="w-4 h-4 text-teal-500" />
                      <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Schedule & Guests</h3>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Start Date *</label>
                        <input
                          type="date"
                          name="startDate"
                          min={minimumDate}
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className={inputStyle(errors.startDate)}
                        />
                        {errors.startDate && <p className="text-[11px] text-red-500 mt-0.5 font-bold">{errors.startDate}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">End Date *</label>
                        <input
                          type="date"
                          name="endDate"
                          min={formData.startDate || minimumDate}
                          value={formData.endDate}
                          onChange={handleInputChange}
                          className={inputStyle(errors.endDate)}
                        />
                        {errors.endDate && <p className="text-[11px] text-red-500 mt-0.5 font-bold">{errors.endDate}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Adults (12+ yrs) *</label>
                        <input
                          type="number"
                          name="adults"
                          min="1"
                          max="20"
                          value={formData.adults}
                          onChange={handleInputChange}
                          className={inputStyle(errors.adults)}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Children</label>
                        <input
                          type="number"
                          name="children"
                          min="0"
                          max="20"
                          value={formData.children}
                          onChange={handleInputChange}
                          className={inputStyle()}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-extrabold uppercase text-slate-400">
                          Famous Tourist Interests in {formData.destination || "Destination"}
                        </label>
                        <span className="text-[10px] font-bold text-teal-500 bg-teal-500/10 px-2 py-0.5 rounded-full">
                          Dynamic Options
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {getDynamicDestinationInterests(formData.destination).map((item) => {
                          const sel = formData.interests.includes(item);
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => handleInterestChange(item)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                                sel
                                  ? "bg-slate-900 dark:bg-teal-500 text-white border-transparent shadow-sm"
                                  : "bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-teal-500"
                              }`}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: AI Recommendation Agent Visual Attractions */}
                  <div className="lg:col-span-6 bg-slate-50 dark:bg-[#1a1d21] p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/10 space-y-2.5">
                    {(() => {
                      const highlights = getDestinationHighlights(formData.destination, formData.travelStyle);
                      return (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black uppercase text-teal-600 dark:text-teal-400 tracking-wider flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" /> AI Recommendation Agent ({formData.destination || "Trip"})
                            </span>
                            <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                              Active Agent
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            {highlights.attractions.map((spot, idx) => (
                              <div key={idx} className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm bg-slate-900">
                                <img
                                  src={spot.image}
                                  alt={spot.name}
                                  className="w-full h-20 object-cover brightness-[0.75] group-hover:scale-110 transition duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent p-1.5 flex flex-col justify-end">
                                  <span className="text-[9px] font-bold text-amber-400">{spot.rating}</span>
                                  <p className="text-[10px] font-black text-white leading-tight truncate">{spot.name}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-between text-[11px]">
                            <span className="font-bold text-teal-700 dark:text-teal-300">🔥 Highlights:</span>
                            <span className="font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[220px]">
                              {highlights.experiences.join(" • ")}
                            </span>
                          </div>

                          {/* Final AI Agent Budget & Desire Audit Box */}
                          {(() => {
                            const realWorld = analyzeRealWorldBudget(formData);
                            const budgetNum = Number(formData.budget) || 0;
                            const isSurplus = realWorld.isEnough && budgetNum > (realWorld.estimatedMinTotal * 1.4);

                            return (
                              <div className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase text-amber-500 flex items-center gap-1">
                                    🤖 AI Supervisor Audit: Budget vs Desires
                                  </span>
                                  <span className="text-[9px] font-extrabold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                    Real-Time Check
                                  </span>
                                </div>

                                {!realWorld.isEnough ? (
                                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] space-y-1 text-slate-700 dark:text-slate-300">
                                    <p className="font-bold text-amber-600 dark:text-amber-400">
                                      ⚠️ Budget Deficit Warning ({realWorld.currSymbol}{budgetNum.toLocaleString("en-IN")}):
                                    </p>
                                    <p className="leading-tight">
                                      Required: <strong>{realWorld.currSymbol}{realWorld.estimatedMinTotal.toLocaleString("en-IN")}</strong> for {realWorld.days} days in {formData.destination || "destination"} with <em>{formData.accommodationPreference} Stay</em> & <em>{formData.interests.length} Interests</em>.
                                    </p>
                                    <p className="text-[9.5px] font-semibold text-amber-600 dark:text-amber-400 pt-0.5">
                                      <strong>💡 AI Advice:</strong> Switch stay to "Budget Stay" or deselect extra interests to fit your budget pool!
                                    </p>
                                  </div>
                                ) : isSurplus ? (
                                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] space-y-1 text-emerald-800 dark:text-emerald-300">
                                    <p className="font-bold text-emerald-600 dark:text-emerald-400">
                                      ✨ Generous Surplus Budget ({realWorld.currSymbol}{budgetNum.toLocaleString("en-IN")}):
                                    </p>
                                    <p className="leading-tight">
                                      Awesome! You have ample budget available. <strong>Agent Advice:</strong> You can upgrade your Stay to <em>Luxury Resort</em> or select more premium interests like <em>Helicopter Tours, Nightlife & Fine Dining</em>!
                                    </p>
                                  </div>
                                ) : (
                                  <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[10px] text-teal-800 dark:text-teal-300 font-semibold leading-tight">
                                    🎯 Perfect Balance: Your selected budget ({realWorld.currSymbol}{budgetNum.toLocaleString("en-IN")}) perfectly matches your <em>{formData.accommodationPreference} Stay</em> & <em>{formData.interests.length} selected interests</em>!
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Step Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 mt-4">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-black text-slate-600 dark:text-slate-300 flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-white/5 transition"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous Step
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-xs flex items-center gap-1.5 hover:bg-slate-800 shadow-md transition"
              >
                {currentStep === 3 ? "Generate AI Itinerary" : "Next Step"}
                {currentStep === 3 ? <Sparkles className="w-4 h-4 text-emerald-400 dark:text-emerald-600" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function inputStyle(error) {
  return `w-full rounded-xl border bg-slate-50 dark:bg-[#1e232a] px-3.5 py-2.5 text-sm font-bold text-slate-900 dark:text-white outline-none transition [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-[#1e232a] dark:[&>option]:text-white ${
    error ? "border-red-500" : "border-slate-200 dark:border-white/10 focus:border-teal-500"
  }`;
}

export default TripPlannerFormPage;
