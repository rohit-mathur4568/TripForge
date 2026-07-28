import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getObfuscatedRoute } from "../utils/routeUtils";
import {
  Send, Bot, User, Sparkles, MapPin, Calendar, Users, DollarSign,
  Compass, ArrowRight, LoaderCircle, RefreshCw, CheckCircle2, MessageSquare,
  Zap, ShieldCheck, HelpCircle, CornerDownLeft, Sliders, Play, Layers
} from "lucide-react";
import { generateTrip } from "../services/tripService";

const INITIAL_BOT_MESSAGE = {
  id: "init-1",
  sender: "bot",
  text: "Welcome to **ForgeAI Copilot Suite**. Describe your travel vision in natural language, or click one of our curated prompt presets below to launch your multi-agent trip generation.",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const PROMPT_PRESETS = [
  "Plan a 5-day luxury trip to Bali for 2 adults with ₹80,000 budget starting from Delhi.",
  "Create a 4-day heritage & food tour in Jaipur for 4 friends under ₹40,000.",
  "Design a 7-day adventure and trekking itinerary in Swiss Alps starting from Zurich."
];

export default function AiChatbotPlannerPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([INITIAL_BOT_MESSAGE]);
  const [inputMessage, setInputMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Extracted slot state tracked visually for user
  const [extractedSlots, setExtractedSlots] = useState({
    source: "",
    destination: "",
    duration: "",
    startDate: "",
    adults: 1,
    budget: "",
    travelStyle: "Relaxing"
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Parsing user message dynamically into parameters
  const parseUserIntent = (text) => {
    const textLower = text.toLowerCase();
    const updated = { ...extractedSlots };

    // Destination & Source patterns
    if (textLower.includes("to ")) {
      const destMatch = text.match(/to\s+([A-Za-z\s]+?)(?=\s+for|\s+from|\s+with|\s+next|\s+in|\s+under|\.|$)/i);
      if (destMatch && destMatch[1]) updated.destination = destMatch[1].trim();
    }
    if (textLower.includes("from ")) {
      const srcMatch = text.match(/from\s+([A-Za-z\s]+?)(?=\s+to|\s+for|\s+with|\s+next|\s+in|\s+under|\.|$)/i);
      if (srcMatch && srcMatch[1]) updated.source = srcMatch[1].trim();
    }

    // Days / Duration
    const dayMatch = text.match(/(\d+)\s*(?:day|days|night|nights)/i);
    if (dayMatch) updated.duration = parseInt(dayMatch[1]);

    // Budget matching (k, lakh, rupees, numbers)
    const budgetMatch = text.match(/(?:budget|cost|under|of)?\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|lakh|lakhs)?/i);
    if (budgetMatch) {
      let val = parseFloat(budgetMatch[1].replace(/,/g, ""));
      if (budgetMatch[2]) {
        const multiplier = budgetMatch[2].toLowerCase();
        if (multiplier === "k") val *= 1000;
        if (multiplier.includes("lakh")) val *= 100000;
      }
      if (val >= 1000) updated.budget = val;
    }

    // People / Adults
    const peopleMatch = text.match(/(\d+)\s*(?:people|adults|persons|person|travellers|travelers)/i);
    if (peopleMatch) updated.adults = parseInt(peopleMatch[1]);

    // Travel Style
    if (textLower.includes("adventure") || textLower.includes("trek") || textLower.includes("hiking")) updated.travelStyle = "Adventure";
    if (textLower.includes("relax") || textLower.includes("beach") || textLower.includes("peaceful")) updated.travelStyle = "Relaxing";
    if (textLower.includes("cultural") || textLower.includes("history") || textLower.includes("temple")) updated.travelStyle = "Cultural";
    if (textLower.includes("luxury") || textLower.includes("romantic") || textLower.includes("honeymoon")) updated.travelStyle = "Romantic";

    return updated;
  };

  const handleSendMessage = async (textOverride) => {
    const userText = textOverride || inputMessage.trim();
    if (!userText || isGenerating) return;

    if (!textOverride) setInputMessage("");

    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    // Parse slots
    const newSlots = parseUserIntent(userText);
    setExtractedSlots(newSlots);

    // Check if we have essential information to build full trip payload
    const missing = [];
    if (!newSlots.destination) missing.push("Destination City");
    if (!newSlots.source) missing.push("Departure City");
    if (!newSlots.duration) missing.push("Trip Duration (Days)");
    if (!newSlots.budget) missing.push("Budget Limit");

    if (missing.length > 0) {
      setTimeout(() => {
        const botReply = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: `I registered your travel preferences. To trigger our multi-agent trip builder, please specify: **${missing.join(", ")}**.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botReply]);
      }, 500);
      return;
    }

    // All slots ready -> Trigger AI Multi-Agent Generation directly!
    setIsGenerating(true);
    const botThinkingMsg = {
      id: `bot-gen-${Date.now()}`,
      sender: "bot",
      text: "⚡ **Parameters Locked!** Invoking multi-agent AI framework (Supervisor, Destination, Budget & Itinerary agents)...",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, botThinkingMsg]);

    try {
      const today = new Date();
      const start = new Date(today.setDate(today.getDate() + 7)).toISOString().split("T")[0];
      const end = new Date(today.setDate(today.getDate() + (newSlots.duration || 3))).toISOString().split("T")[0];

      const payload = {
        source: newSlots.source || "Mumbai",
        destination: newSlots.destination,
        startDate: start,
        endDate: end,
        adults: newSlots.adults || 2,
        children: 0,
        budget: newSlots.budget || 50000,
        travelStyle: newSlots.travelStyle || "Relaxing",
        transportPreference: "Any",
        accommodationPreference: "Comfortable",
        foodPreference: "Any",
        interests: ["Nature", "Local Food", "Sightseeing"],
        additionalNotes: `Generated via ForgeAI Copilot Suite.`,
      };

      const generatedTrip = await generateTrip(payload);

      // Persist in localStorage so refresh/direct URL doesn't blank out
      try {
        localStorage.setItem("tripforge_last_generated_trip", JSON.stringify(generatedTrip));
      } catch (e) {
        console.error("Failed saving last trip to storage", e);
      }

      // Redirect directly to generated itinerary results page
      navigate(getObfuscatedRoute(user, "/result"), {
        state: { generatedTrip },
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text: `❌ Generation Error: ${err.message || "Failed to communicate with multi-agent backend"}. Please try again.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-12 font-sans">
      {/* Executive Copilot Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-[#121417] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-teal-500/20">
            <Sparkles className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">ForgeAI Copilot Workspace</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
                GPT-4o Multi-Agent
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Conversational trip architecture & real-time parameter synthesis</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMessages([INITIAL_BOT_MESSAGE])}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Clear Session
          </button>
          <button
            onClick={() => navigate(getObfuscatedRoute(user, "/create-trip"))}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs shadow-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition"
          >
            <Sliders className="w-3.5 h-3.5" /> Switch to Form Engine
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-14rem)] min-h-[600px]">
        {/* Main Conversation Stream */}
        <div className="lg:col-span-8 flex flex-col bg-white dark:bg-[#121417] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
          {/* Chat Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold shadow-sm ${
                    msg.sender === "user"
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950"
                      : "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20"
                  }`}
                >
                  {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div
                    className={`p-4 sm:p-5 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md rounded-tr-none"
                        : "bg-slate-50 dark:bg-white/[0.03] text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-white/5 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className={`text-[10px] text-slate-400 block px-2 ${msg.sender === "user" ? "text-right" : ""}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isGenerating && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/40 text-teal-700 dark:text-teal-300 text-xs font-bold animate-pulse">
                <LoaderCircle className="w-4 h-4 animate-spin text-teal-600" />
                <span>Multi-agent framework synthesizing routes, Leaflet coordinates & budget distribution...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Chips */}
          <div className="px-6 py-2 border-t border-slate-100 dark:border-white/5 flex items-center gap-2 overflow-x-auto bg-slate-50/50 dark:bg-white/[0.01]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">Presets:</span>
            {PROMPT_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(preset)}
                className="px-3 py-1 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-[11px] font-medium hover:border-teal-500/50 truncate max-w-xs transition shrink-0"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Type your travel requirements (destination, days, budget, travelers)..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isGenerating}
                className="w-full pl-5 pr-14 py-4 rounded-2xl bg-white dark:bg-[#1a1d21] border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isGenerating}
                className="absolute right-2 p-3 rounded-xl bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-teal-400 disabled:opacity-40 transition shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Parameter Inspector Panel */}
        <div className="lg:col-span-4 space-y-5 flex flex-col">
          <div className="bg-white dark:bg-[#121417] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm flex-1 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-500" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Parameters Extractor</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Live NLU</span>
            </div>

            <div className="space-y-3">
              <SlotItem icon={MapPin} label="Destination" value={extractedSlots.destination || "Not specified"} active={!!extractedSlots.destination} />
              <SlotItem icon={Compass} label="Departure City" value={extractedSlots.source || "Not specified"} active={!!extractedSlots.source} />
              <SlotItem icon={Calendar} label="Duration" value={extractedSlots.duration ? `${extractedSlots.duration} Days` : "Not specified"} active={!!extractedSlots.duration} />
              <SlotItem icon={DollarSign} label="Budget Limit" value={extractedSlots.budget ? `₹${extractedSlots.budget.toLocaleString("en-IN")}` : "Not specified"} active={!!extractedSlots.budget} />
              <SlotItem icon={Users} label="Passanger Count" value={`${extractedSlots.adults} Adults`} active={true} />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 space-y-2 text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Agent Workflow</span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Supervisor Agent validates slots $\rightarrow$ Budget Agent allocates expenses $\rightarrow$ Itinerary Agent constructs Leaflet coordinates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlotItem({ icon: Icon, label, value, active }) {
  return (
    <div className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
      active
        ? "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
        : "bg-slate-50/40 dark:bg-white/[0.01] border-dashed border-slate-200 dark:border-white/5 text-slate-400"
    }`}>
      <div className="flex items-center gap-2.5">
        <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${active ? "bg-teal-500/10 text-teal-600 dark:text-teal-400" : "bg-slate-100 dark:bg-white/5 text-slate-400"}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-bold">{label}</span>
      </div>
      <span className={`text-xs truncate max-w-[120px] ${active ? "font-black text-teal-600 dark:text-teal-400" : "font-semibold text-slate-400"}`}>{value}</span>
    </div>
  );
}

