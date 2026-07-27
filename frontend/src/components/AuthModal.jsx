import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { X, Lock, Mail, User, Sparkles, LogIn, UserPlus, Globe2, MapPin, Compass } from "lucide-react";

// Curated collections of high-resolution global location imagery
const LOGIN_DESTINATIONS = [
  {
    location: "Paris, France",
    quote: "Explore the City of Lights with personalized multi-agent itineraries.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80"
  },
  {
    location: "Tokyo, Japan",
    quote: "Discover futuristic skylines and ancient heritage tailored to your style.",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80"
  },
  {
    location: "Rome, Italy",
    quote: "Step back in history with seamless daily activity routes and maps.",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80"
  },
  {
    location: "Santorini, Greece",
    quote: "Experience unforgettable coastal sunsets and effortless travel planning.",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1000&q=80"
  }
];

const SIGNUP_DESTINATIONS = [
  {
    location: "Bali, Indonesia",
    quote: "Unlock hidden tropical paradises and custom cultural excursions.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80"
  },
  {
    location: "Swiss Alps, Switzerland",
    quote: "Embark on breathtaking mountain adventures with smart budget optimization.",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80"
  },
  {
    location: "Kyoto, Japan",
    quote: "Immerse in peaceful bamboo groves and timeless traditional tea houses.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80"
  },
  {
    location: "Machu Picchu, Peru",
    quote: "Start your journey to ancient wonders with our intelligent travel planner.",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1000&q=80"
  }
];

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authMode, setAuthMode, login, signup } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [currentDestination, setCurrentDestination] = useState(LOGIN_DESTINATIONS[0]);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (isAuthModalOpen) {
      setIsFading(true);
      const pool = authMode === "login" ? LOGIN_DESTINATIONS : SIGNUP_DESTINATIONS;
      const randomIndex = Math.floor(Math.random() * pool.length);
      const nextDest = pool[randomIndex];

      const timer = setTimeout(() => {
        setCurrentDestination(nextDest);
        setIsFading(false);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isAuthModalOpen, authMode]);

  if (!isAuthModalOpen) return null;

  const handleNameChange = (e) => {
    const value = e.target.value;
    setFullName(value);
    if (value && !/^[a-zA-Z\s]{3,50}$/.test(value)) {
      setError("Invalid input: Name should only contain letters and spaces (min 3 chars).");
    } else {
      if (error.includes("Name")) setError("");
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    // We only show error dynamically if they've typed enough or it's clearly invalid, 
    // but for immediate feedback as requested:
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Invalid input: Please enter a valid email address.");
    } else {
      if (error.includes("email")) setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (authMode === "signup" && !/^[a-zA-Z\s]{3,50}$/.test(fullName)) {
      setError("Invalid input: Name should only contain letters and spaces (min 3 chars).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid input: Please enter a valid email address.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      if (authMode === "login") {
        await login(email, password);
      } else {
        await signup(fullName, email, password);
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1712]/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-[#173d2e] border border-emerald-900/40 rounded-3xl shadow-2xl overflow-hidden text-white grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Seamless Crossfade Banner */}
        <div className="relative hidden md:flex flex-col justify-between p-8 overflow-hidden min-h-[500px] bg-[#173d2e]">
          <div
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out ${
              isFading ? "opacity-0" : "opacity-100"
            }`}
            style={{ backgroundImage: `url(${currentDestination.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#173d2e] via-[#173d2e]/40 to-black/30 pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="relative z-10 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-[#eaff9d]">
              <Globe2 className="h-5 w-5" />
            </div>
            <span className="text-sm font-black tracking-wider uppercase text-white drop-shadow">
              TripForge AI
            </span>
          </div>

          {/* Bottom Location Quote & Badge */}
          <div className={`relative z-10 transition-opacity duration-500 ${isFading ? "opacity-0" : "opacity-100"}`}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#173d2e]/90 border border-emerald-400/40 text-emerald-300 text-xs font-bold mb-3 backdrop-blur-md shadow-lg">
              <MapPin className="w-3.5 h-3.5 text-[#eaff9d]" />
              <span>{currentDestination.location}</span>
            </div>
            <p className="text-lg font-bold text-white leading-snug drop-shadow-md">
              "{currentDestination.quote}"
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#cbd9cf]">
              <Compass className="w-4 h-4 text-[#eaff9d]" />
              <span>Multi-Agent AI Travel Assistant</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="relative p-6 sm:p-8 md:p-10 bg-white text-[#17211a] flex flex-col justify-between">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-slate-400 hover:text-[#173d2e] p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div>
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[#edf8d9] text-[#173d2e] mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#17211a]">
                {authMode === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-sm text-[#6b776e] mt-1 font-medium">
                {authMode === "login"
                  ? "Sign in to plan, view, and sync your global journeys"
                  : "Join TripForge to craft personalized AI travel plans"}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === "signup" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#46544b] mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={handleNameChange}
                      placeholder="Alex Morgan"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#fbfdf9] border border-[#dce6d5] text-[#17211a] placeholder-slate-400 focus:outline-none focus:border-[#39734f] focus:ring-2 focus:ring-[#edf8d9] transition text-sm font-medium"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#46544b] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="explorer@tripforge.ai"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#fbfdf9] border border-[#dce6d5] text-[#17211a] placeholder-slate-400 focus:outline-none focus:border-[#39734f] focus:ring-2 focus:ring-[#edf8d9] transition text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#46544b] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#fbfdf9] border border-[#dce6d5] text-[#17211a] placeholder-slate-400 focus:outline-none focus:border-[#39734f] focus:ring-2 focus:ring-[#edf8d9] transition text-sm font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#173d2e] hover:bg-[#20533f] font-bold text-white shadow-lg shadow-green-900/15 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                {submitting ? (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : authMode === "login" ? (
                  <>
                    <LogIn className="w-4 h-4 text-[#eaff9d]" /> Sign In to Continue
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 text-[#eaff9d]" /> Register Account
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-sm text-[#6b776e]">
            {authMode === "login" ? (
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => {
                    setError("");
                    setAuthMode("signup");
                  }}
                  className="text-[#39734f] hover:underline font-extrabold cursor-pointer"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already registered?{" "}
                <button
                  onClick={() => {
                    setError("");
                    setAuthMode("login");
                  }}
                  className="text-[#39734f] hover:underline font-extrabold cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
