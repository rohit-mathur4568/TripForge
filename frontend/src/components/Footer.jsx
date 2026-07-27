import React from "react";
import { Link } from "react-router";
import { Globe2, Heart, ShieldCheck, Mail, MapPin, Phone, ArrowUpRight, Compass, Route } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-[#dce6d5] bg-[#173d2e] text-white pt-16 pb-12 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#eaff9d]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#f8df58]/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-[#eaff9d]">
                <Globe2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-white">TripForge</h3>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#cbd9cf]">
                  Professional AI Travel Planner
                </p>
              </div>
            </Link>

            <p className="text-sm leading-6 text-[#d4e0d7] max-w-sm">
              Empowering global explorers with specialized multi-agent AI itineraries, interactive Leaflet route maps, smart budget optimization, and instant calendar sync.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-[#eaff9d] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified Routes
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-emerald-300 font-semibold">
                <Compass className="w-3.5 h-3.5" /> Global Geocoding
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[#eaff9d] mb-4">
              Explore
            </p>
            <ul className="space-y-2.5 text-sm text-[#cbd9cf]">
              <li>
                <Link to="/" className="hover:text-white transition flex items-center gap-1">
                  Home <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/create-trip" className="hover:text-white transition flex items-center gap-1">
                  Plan a Trip <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-white transition flex items-center gap-1">
                  Saved Journeys <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <a href="/#destinations" className="hover:text-white transition flex items-center gap-1">
                  Trending Destinations
                </a>
              </li>
            </ul>
          </div>

          {/* Features Column */}
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[#eaff9d] mb-4">
              AI Capabilities
            </p>
            <ul className="space-y-2.5 text-sm text-[#cbd9cf]">
              <li className="flex items-center gap-2">
                <Route className="w-3.5 h-3.5 text-[#eaff9d]" /> Multi-Agent Supervisor
              </li>
              <li className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-[#eaff9d]" /> Geo Waypoint Mapping
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#eaff9d]" /> Budget Optimization
              </li>
              <li className="flex items-center gap-2">
                <Globe2 className="w-3.5 h-3.5 text-[#eaff9d]" /> 1-Click iCal Export
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[#eaff9d] mb-4">
              Connect & Support
            </p>
            <div className="space-y-3 text-sm text-[#cbd9cf]">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#eaff9d]" /> support@tripforge.ai
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#eaff9d]" /> +1 (800) 555-TRIP
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#eaff9d]" /> Global HQ, Earth
              </p>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#cbd9cf]">
          <p className="flex items-center gap-1.5">
            © {new Date().getFullYear()} TripForge AI Travel Inc. Crafting adventures with{" "}
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" /> worldwide.
          </p>

          <button
            onClick={scrollToTop}
            className="text-[#eaff9d] hover:underline font-bold cursor-pointer flex items-center gap-1"
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
