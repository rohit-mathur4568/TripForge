import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getObfuscatedRoute } from "../utils/routeUtils";
import {
  CalendarDays, CircleDollarSign, Compass, LoaderCircle, MapPin,
  Trash2, Users, Eye, PieChart as PieChartIcon, Plus, Search, X,
  TrendingUp, Globe2, RefreshCw, AlertTriangle, ArrowUpRight, Sparkles,
  Plane, Hotel, Briefcase, Filter, ChevronRight, ShieldCheck, Tag, Zap, Clock
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { deleteSavedTrip, getSavedTrips } from "../services/tripService";

const COLORS = ["#0f766e", "#0d9488", "#2563eb", "#d97706", "#7c3aed"];

function getDestinationImage(destination = "") {
  const imageMap = {
    paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
    bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
    london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
    dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    singapore: "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=800&q=80",
    goa: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
    kerala: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
  };
  const d = destination.toLowerCase();
  for (const [key, url] of Object.entries(imageMap)) {
    if (d.includes(key)) return url;
  }
  return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";
}

export default function UserDashboardHistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingTripId, setDeletingTripId] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [styleFilter, setStyleFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("all");

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

  function handleViewTrip(trip) {
    navigate(getObfuscatedRoute(user, "/result"), { state: { generatedTrip: trip } });
  }

  const analytics = useMemo(() => {
    const totalBudget = trips.reduce((s, t) => s + (t.budgetBreakdown?.totalBudget || t.summary?.estimatedBudget || 0), 0);
    const totalDays = trips.reduce((s, t) => s + (t.summary?.duration || 0), 0);
    const totalTravellers = trips.reduce((s, t) => s + (t.summary?.travellers || 1), 0);
    
    const transport = trips.reduce((s, t) => s + (t.budgetBreakdown?.transport || (t.summary?.estimatedBudget || 0) * 0.35), 0);
    const stays = trips.reduce((s, t) => s + (t.budgetBreakdown?.accommodation || (t.summary?.estimatedBudget || 0) * 0.40), 0);
    const food = trips.reduce((s, t) => s + (t.budgetBreakdown?.food || (t.summary?.estimatedBudget || 0) * 0.15), 0);
    const activities = trips.reduce((s, t) => s + (t.budgetBreakdown?.activities || (t.summary?.estimatedBudget || 0) * 0.10), 0);
    
    const budgetChart = [
      { name: "Flights & Transit", value: Math.round(transport) },
      { name: "Luxury Stays", value: Math.round(stays) },
      { name: "Dining & Gourmet", value: Math.round(food) },
      { name: "Curated Experiences", value: Math.round(activities) },
    ].filter((x) => x.value > 0);

    const monthlyMap = {};
    trips.forEach((t) => {
      if (!t.createdAt) return;
      const month = new Date(t.createdAt).toLocaleString("en-US", { month: "short" });
      monthlyMap[month] = (monthlyMap[month] || 0) + (t.budgetBreakdown?.totalBudget || t.summary?.estimatedBudget || 0);
    });

    const spendTrend = Object.entries(monthlyMap).map(([month, spend]) => ({ month, spend }));
    const styles = [...new Set(trips.map((t) => t.summary?.travelStyle).filter(Boolean))];
    
    return { totalBudget, totalDays, totalTravellers, budgetChart, spendTrend, styles };
  }, [trips]);

  const filteredTrips = useMemo(() => {
    return trips.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || t.summary?.destination?.toLowerCase().includes(q) || t.summary?.source?.toLowerCase().includes(q) || t.summary?.travelStyle?.toLowerCase().includes(q);
      const matchesStyle = styleFilter === "All" || t.summary?.travelStyle === styleFilter;
      
      const isUpcoming = t.summary?.startDate ? new Date(t.summary.startDate) >= new Date() : true;
      const matchesTab = activeTab === "all" || (activeTab === "upcoming" ? isUpcoming : !isUpcoming);

      return matchesSearch && matchesStyle && matchesTab;
    });
  }, [trips, searchQuery, styleFilter, activeTab]);

  const upcomingTrips = useMemo(() => {
    return trips.filter(t => !t.summary?.startDate || new Date(t.summary.startDate) >= new Date());
  }, [trips]);

  const nextTrip = upcomingTrips[0] || trips[0];

  const allStyles = ["All", ...analytics.styles];

  return (
    <div className="space-y-8 pb-16 max-w-[1600px] mx-auto font-sans">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-[#123326] to-teal-900 text-white p-6 lg:p-8 shadow-2xl border border-emerald-800/30">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> AI Travel Intelligence Hub
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-400">{user?.name || "Explorer"}</span>
            </h1>
            <p className="text-emerald-100/80 text-sm lg:text-base font-normal leading-relaxed">
              Manage your high-precision itineraries, analyze trip logistics, and seamlessly coordinate with global travel providers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <Link
              to={getObfuscatedRoute(user, "/create-trip")}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-teal-900/30 hover:shadow-teal-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" /> Plan New Journey
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#121417] p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-4 hover:border-emerald-500/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Plane className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">Flight Concierge</h4>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">Live API</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Real-time fare tracking & seat updates</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div className="bg-white dark:bg-[#121417] p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-4 hover:border-emerald-500/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Hotel className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">Stays & Resorts</h4>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">Verified</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">SaaS exclusive rates & upgrades</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div className="bg-white dark:bg-[#121417] p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-4 hover:border-emerald-500/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">Trip Insurance</h4>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">Shield</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">100% cancellation protection coverage</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        <StatCard 
          icon={Globe2} 
          label="Total Journeys" 
          value={trips.length} 
          subtext="Active itineraries"
          trend="+12% this month"
          color="teal" 
        />
        <StatCard 
          icon={CircleDollarSign} 
          label="Total Travel Investment" 
          value={formatCurrency(analytics.totalBudget)} 
          subtext="Estimated total outlay"
          trend="Optimized via AI"
          color="amber" 
        />
        <StatCard 
          icon={CalendarDays} 
          label="Total Exploration Time" 
          value={`${analytics.totalDays} Days`} 
          subtext="Across planned trips"
          trend="Avg 4.5 days/trip"
          color="purple" 
        />
        <StatCard 
          icon={Users} 
          label="Passenger Headcount" 
          value={`${analytics.totalTravellers} Travelers`} 
          subtext="Group & solo expeditions"
          trend="Sync active"
          color="blue" 
        />
      </div>

      {nextTrip && (
        <div className="bg-white dark:bg-[#121417] rounded-3xl border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-md">
          <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">Featured Active Expedition</h3>
            </div>
            <button 
              onClick={() => handleViewTrip(nextTrip)} 
              className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1 hover:underline"
            >
              Open Full Master Itinerary <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 relative h-56 lg:h-64 rounded-2xl overflow-hidden shadow-inner">
              <img 
                src={nextTrip.journeyOverview?.cover || getDestinationImage(nextTrip.summary?.destination)} 
                alt={nextTrip.summary?.destination} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="inline-block px-2.5 py-1 rounded-full bg-teal-500/80 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-widest mb-1.5">
                  {nextTrip.summary?.travelStyle || "Premium Exploration"}
                </div>
                <h2 className="text-2xl font-black">{nextTrip.summary?.source} → {nextTrip.summary?.destination}</h2>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400">Total Budget</span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {formatCurrency(nextTrip.budgetBreakdown?.totalBudget || nextTrip.summary?.estimatedBudget || 0)}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400">Duration</span>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{nextTrip.summary?.duration || 0} Days</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400">Travelers</span>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{nextTrip.summary?.travellers || 1} People</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 space-y-2">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">AI Logistics Overview</h4>
                <p className="text-xs lg:text-sm text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {nextTrip.journeyOverview?.description || `High-efficiency travel itinerary designed for ${nextTrip.summary?.destination}. Fully synced with provider schedules and optimal day-wise distribution.`}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleViewTrip(nextTrip)}
                  className="flex-1 py-3 px-5 rounded-xl bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 font-bold text-sm hover:bg-slate-800 dark:hover:bg-teal-400 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Eye className="w-4 h-4" /> View Day-by-Day Plan
                </button>
                <button
                  onClick={() => setDeleteConfirmId(nextTrip.tripId)}
                  className="p-3 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  title="Archive or Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {trips.length > 0 && analytics.budgetChart.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-2 bg-white dark:bg-[#121417] rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Logistics Allocation</p>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">Budget Breakdown</h3>
              </div>
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500">
                <PieChartIcon className="w-5 h-5" />
              </div>
            </div>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={analytics.budgetChart} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                    {analytics.budgetChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: "14px", border: "none", backgroundColor: "#0f172a", color: "#fff", fontSize: 12, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)" }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="xl:col-span-3 bg-white dark:bg-[#121417] rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Financial Velocity</p>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">Monthly Investment Trend</h3>
              </div>
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.spendTrend.length > 0 ? analytics.spendTrend : [{ month: "Current", spend: analytics.totalBudget }]}>
                  <defs>
                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.15} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: "14px", border: "none", backgroundColor: "#0f172a", color: "#fff", fontSize: 12, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)" }} />
                  <Area type="monotone" dataKey="spend" stroke="#0d9488" strokeWidth={3} fill="url(#spendGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#121417] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-white/5 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                Saved Itineraries
                {filteredTrips.length > 0 && (
                  <span className="text-xs font-bold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full">
                    {filteredTrips.length}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Filter and manage your travel portfolios</p>
            </div>

            <div className="flex items-center bg-slate-100 dark:bg-white/5 p-1 rounded-2xl w-fit">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition ${activeTab === "all" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
              >
                All Journeys
              </button>
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition ${activeTab === "upcoming" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
              >
                Upcoming
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search destination, style or departure..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1a1d21] border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {allStyles.length > 1 && (
              <select
                value={styleFilter}
                onChange={(e) => setStyleFilter(e.target.value)}
                className="px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1a1d21] border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              >
                {allStyles.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            )}

            <button onClick={loadTrips} title="Refresh" className="p-2.5 rounded-2xl bg-slate-50 dark:bg-[#1a1d21] border border-slate-200 dark:border-white/10 text-slate-500 hover:text-teal-600 transition">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {errorMessage && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 p-4 text-red-700 dark:text-red-400 text-sm font-bold">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="flex-1">{errorMessage}</p>
              <button onClick={loadTrips} className="text-xs underline">Retry</button>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
              <LoaderCircle className="h-10 w-10 animate-spin text-teal-600" />
              <p className="text-sm font-bold text-slate-400">Synchronizing your itineraries with cloud database...</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[320px] text-center py-12">
              <div className="w-20 h-20 rounded-3xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-5 text-teal-600 dark:text-teal-400">
                <Compass className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">No Planned Journeys Found</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm font-medium leading-relaxed">
                Generate your first AI-driven travel plan with full provider cost breakdowns and route optimization.
              </p>
              <Link 
                to={getObfuscatedRoute(user, "/create-trip")} 
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg hover:from-teal-600 hover:to-emerald-600 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" /> Launch Trip Engine
              </Link>
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[240px] text-center">
              <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-base font-bold text-slate-600 dark:text-slate-300">No matching itineraries found</p>
              <button 
                onClick={() => { setSearchQuery(""); setStyleFilter("All"); setActiveTab("all"); }} 
                className="mt-3 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredTrips.map((trip) => (
                <TripCard
                  key={trip.tripId}
                  trip={trip}
                  isDeleting={deletingTripId === trip.tripId}
                  onDelete={() => setDeleteConfirmId(trip.tripId)}
                  onView={() => handleViewTrip(trip)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#121417] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 max-w-md w-full animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Delete Journey?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">This action will erase all saved itineraries and provider logs.</p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setDeleteConfirmId(null)} 
                className="flex-1 rounded-2xl border border-slate-200 dark:border-white/10 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => confirmDelete(deleteConfirmId)} 
                disabled={!!deletingTripId} 
                className="flex-1 rounded-2xl bg-red-600 hover:bg-red-700 py-3 text-sm font-bold text-white transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deletingTripId ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Confirm Erase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, subtext, trend, color }) {
  const colorMap = {
    teal: { bg: "bg-teal-500/10", text: "text-teal-600 dark:text-teal-400", border: "border-teal-500/20" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/20" },
    blue: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/20" },
  };
  const c = colorMap[color];
  return (
    <div className="bg-white dark:bg-[#121417] rounded-3xl border border-slate-200/80 dark:border-white/10 p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <p className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
        <div className={`w-10 h-10 rounded-2xl ${c.bg} ${c.text} border ${c.border} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-white/5 text-[11px]">
          <span className="text-slate-400 font-medium">{subtext}</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">{trend}</span>
        </div>
      </div>
    </div>
  );
}

function TripCard({ trip, isDeleting, onDelete, onView }) {
  const summary = trip.summary || {};
  const thumbnail = trip.journeyOverview?.cover || trip.journeyOverview?.thumbnail || trip.journeyOverview?.heroImage || getDestinationImage(summary.destination);
  const daysAgo = trip.createdAt ? Math.floor((Date.now() - new Date(trip.createdAt)) / 86400000) : null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#181b20] shadow-sm hover:shadow-xl dark:hover:border-teal-500/30 transition-all duration-300">
      <div className="relative h-48 overflow-hidden bg-slate-900">
        <img src={thumbnail} alt={`${summary.source} to ${summary.destination}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md bg-teal-500/80 backdrop-blur-sm text-[10px] font-extrabold uppercase tracking-widest text-white">
              {summary.travelStyle || "Exploration"}
            </span>
            {daysAgo !== null && (
              <span className="text-[10px] font-bold text-slate-300 bg-slate-900/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                {daysAgo === 0 ? "Saved Today" : `${daysAgo}d ago`}
              </span>
            )}
          </div>
          <h3 className="text-lg font-black leading-tight text-white line-clamp-1">{summary.source} → {summary.destination}</h3>
        </div>
      </div>

      <div className="flex-1 p-5 space-y-4">
        <div className="grid grid-cols-2 gap-2.5">
          <Detail icon={CalendarDays} label="Duration" value={`${summary.duration || 0} Days`} />
          <Detail icon={Users} label="Travelers" value={`${summary.travellers || 1} People`} />
          <Detail icon={CircleDollarSign} label="Est. Budget" value={formatCurrency(summary.estimatedBudget || 0)} />
          <Detail icon={ShieldCheck} label="Status" value="Verified API" />
        </div>
      </div>

      <div className="p-5 pt-0 flex items-center gap-2">
        <button 
          onClick={onView} 
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-slate-900 dark:bg-white py-3 text-xs font-bold text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-sm"
        >
          <Eye className="w-4 h-4" /> Open Itinerary
        </button>
        <button 
          onClick={onDelete} 
          disabled={isDeleting} 
          title="Delete Journey" 
          className="p-3 rounded-2xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 transition disabled:opacity-50"
        >
          {isDeleting ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
      </div>
    </article>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02] p-2.5">
      <div className="flex items-center gap-1.5 mb-1 text-slate-400">
        <Icon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xs font-black text-slate-900 dark:text-white truncate">{value}</p>
    </div>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}
