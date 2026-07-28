import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getObfuscatedRoute } from "../utils/routeUtils";
import {
  CalendarDays, CircleDollarSign, Compass, LoaderCircle, MapPin,
  Trash2, Users, Eye, Search, X, RefreshCw, AlertTriangle, Plus, Grid, List
} from "lucide-react";
import { deleteSavedTrip, getSavedTrips } from "../services/tripService";

function getDestinationImage(destination = "") {
  const imageMap = {
    paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
    tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80",
    bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
    rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80",
  };
  const d = destination.toLowerCase();
  for (const [key, url] of Object.entries(imageMap)) {
    if (d.includes(key)) return url;
  }
  return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80";
}

export default function MyJourneysPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingTripId, setDeletingTripId] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => { loadTrips(); }, []);

  async function loadTrips() {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await getSavedTrips();
      setTrips(response.trips || []);
    } catch (error) {
      setErrorMessage(error.message || "Unable to load saved journeys.");
    } finally {
      setIsLoading(false);
    }
  }

  async function confirmDelete(tripId) {
    try {
      setDeletingTripId(tripId);
      await deleteSavedTrip(tripId);
      setTrips((prev) => prev.filter((t) => t.tripId !== tripId));
    } catch (error) {
      setErrorMessage(error.message || "Unable to delete this journey.");
    } finally {
      setDeletingTripId("");
      setDeleteConfirmId(null);
    }
  }

  const filteredTrips = useMemo(() => {
    return trips.filter((t) => {
      const q = searchQuery.toLowerCase();
      return !q || t.summary?.destination?.toLowerCase().includes(q) || t.summary?.source?.toLowerCase().includes(q);
    });
  }, [trips, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0a0a0a] dark:text-white tracking-tight">My Saved Journeys</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-semibold">
            Dedicated view of all itineraries created for your account.
          </p>
        </div>
        <Link
          to={getObfuscatedRoute(user, "/create-trip")}
          className="inline-flex items-center gap-2 rounded-xl bg-[#173d2e] dark:bg-white px-5 py-2.5 text-sm font-black text-white dark:text-black shadow-lg hover:bg-[#0f281e] transition-all"
        >
          <Plus className="w-4 h-4" /> Create New Journey
        </Link>
      </div>

      <div className="bg-white dark:bg-[#111] rounded-[20px] border border-gray-200 dark:border-white/10 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search saved journeys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 py-2 w-full rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 text-sm font-medium text-[#0a0a0a] dark:text-white"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl border ${viewMode === "grid" ? "bg-[#173d2e] text-white border-transparent" : "bg-gray-50 dark:bg-[#1a1a1a] text-gray-500 border-gray-200 dark:border-white/10"}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-xl border ${viewMode === "list" ? "bg-[#173d2e] text-white border-transparent" : "bg-gray-50 dark:bg-[#1a1a1a] text-gray-500 border-gray-200 dark:border-white/10"}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button onClick={loadTrips} className="p-2 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 text-gray-500 hover:text-teal-400">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
            <LoaderCircle className="h-8 w-8 animate-spin text-teal-500" />
            <p className="text-sm font-bold text-gray-400">Fetching your journeys...</p>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="text-center py-16">
            <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-black text-[#0a0a0a] dark:text-white">No Journeys Found</h3>
            <p className="text-sm text-gray-400 mt-1">Start planning a trip to populate your journey collection.</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTrips.map((trip) => {
              const s = trip.summary || {};
              const img = getDestinationImage(s.destination);
              return (
                <div key={trip.tripId} className="group rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="h-40 relative">
                      <img src={img} alt={s.destination} className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-end">
                        <h3 className="text-lg font-black text-white">{s.source} → {s.destination}</h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-2 text-xs">
                      <div className="flex justify-between text-gray-500 dark:text-gray-400">
                        <span>Duration: <strong>{s.duration} Days</strong></span>
                        <span>Budget: <strong>₹{s.estimatedBudget}</strong></span>
                      </div>
                      <div className="flex justify-between text-gray-500 dark:text-gray-400">
                        <span>Travellers: <strong>{s.travellers}</strong></span>
                        <span>Style: <strong>{s.travelStyle || "Custom"}</strong></span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-0 flex gap-2">
                    <button
                      onClick={() => navigate(getObfuscatedRoute(user, "/result"), { state: { generatedTrip: trip } })}
                      className="flex-1 bg-[#173d2e] dark:bg-white text-white dark:text-black font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-2"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                    <button onClick={() => setDeleteConfirmId(trip.tripId)} className="p-2.5 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTrips.map((trip) => {
              const s = trip.summary || {};
              return (
                <div key={trip.tripId} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#1a1a1a]">
                  <div>
                    <h3 className="font-black text-[#0a0a0a] dark:text-white text-base">{s.source} → {s.destination}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{s.duration} Days · {s.travellers} People · ₹{s.estimatedBudget}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(getObfuscatedRoute(user, "/result"), { state: { generatedTrip: trip } })}
                      className="px-4 py-2 bg-[#173d2e] dark:bg-white text-white dark:text-black font-black text-xs rounded-xl flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> Open
                    </button>
                    <button onClick={() => setDeleteConfirmId(trip.tripId)} className="p-2 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#111] rounded-[24px] border border-gray-200 dark:border-white/10 p-6 max-w-sm w-full">
            <h3 className="font-black text-lg text-[#0a0a0a] dark:text-white">Delete Journey?</h3>
            <p className="text-xs text-gray-400 mt-1">This journey will be permanently removed.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 text-xs font-bold border border-gray-200 dark:border-white/10 rounded-xl">Cancel</button>
              <button onClick={() => confirmDelete(deleteConfirmId)} className="flex-1 py-2.5 text-xs font-black bg-red-600 text-white rounded-xl">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
