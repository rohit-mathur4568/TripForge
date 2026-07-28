import { useEffect, useState } from "react";
import {
  Users, MapPin, TrendingUp, Activity, BarChart3,
  PieChart as PieChartIcon, Database, Shield,
  CheckCircle2, AlertTriangle, RefreshCw, Globe2,
  Clock, Cpu,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, LineChart, Line,
} from "recharts";
import { getSavedTrips } from "../services/tripService";

const COLORS = ["#2dd4bf", "#0f766e", "#7c3aed", "#f59e0b", "#ef4444"];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AdminSystemAnalyticsPage() {
  const [allTrips, setAllTrips] = useState([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  const [serverTime, setServerTime] = useState(new Date());
  const uptime = "24d 12h";

  useEffect(() => {
    fetchTrips();
    const timer = setInterval(() => setServerTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  async function fetchTrips() {
    try {
      setIsLoadingTrips(true);
      const res = await getSavedTrips();
      setAllTrips(res.trips || []);
    } catch {
      setAllTrips([]);
    } finally {
      setIsLoadingTrips(false);
    }
  }

  // Derived analytics from real data
  const totalBudget = allTrips.reduce((s, t) => s + (t.budgetBreakdown?.totalBudget || 0), 0);
  const destinations = [...new Set(allTrips.map((t) => t.summary?.destination).filter(Boolean))];
  const travelStyles = allTrips.reduce((acc, t) => {
    const s = t.summary?.travelStyle;
    if (s) acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  const styleChart = Object.entries(travelStyles).map(([name, value]) => ({ name, value }));

  const destChart = Object.entries(
    allTrips.reduce((acc, t) => {
      const d = t.summary?.destination;
      if (d) acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name: name.split(",")[0], count }));

  const budgetByStyle = Object.entries(
    allTrips.reduce((acc, t) => {
      const s = t.summary?.travelStyle || "Other";
      acc[s] = (acc[s] || 0) + (t.budgetBreakdown?.totalBudget || 0);
      return acc;
    }, {})
  ).map(([name, budget]) => ({ name, budget }));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0a0a0a] dark:text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-semibold">
            Real-time platform activity, trip stats, and system performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 px-4 py-2 text-xs font-black flex items-center gap-2 border border-teal-200 dark:border-teal-500/30">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            Live System
          </div>
          <button onClick={fetchTrips} className="p-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] text-gray-500 hover:text-[#173d2e] dark:hover:text-teal-400 transition shadow-sm" title="Refresh Data">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Core Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={MapPin} label="Total Trips" value={isLoadingTrips ? "..." : allTrips.length} delta="Generated" color="teal" />
        <KpiCard icon={Globe2} label="Destinations" value={isLoadingTrips ? "..." : destinations.length} delta="Unique Cities" color="purple" />
        <KpiCard icon={TrendingUp} label="Total Volume" value={isLoadingTrips ? "..." : fmtCurrency(totalBudget)} delta="Planned Budget" color="yellow" isFormatted />
        <KpiCard icon={Activity} label="System Status" value="Operational" delta="99.9% Uptime" color="green" />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Destinations */}
        <div className="bg-white dark:bg-[#111] rounded-[20px] border border-gray-200 dark:border-white/10 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">Destinations</p>
              <h2 className="text-base font-black text-[#0a0a0a] dark:text-white mt-0.5">Top Travel Locations</h2>
            </div>
            <MapPin className="w-5 h-5 text-gray-300 dark:text-gray-600" />
          </div>
          <div className="h-[220px]">
            {destChart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={destChart} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" opacity={0.15} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 11 }} width={80} />
                  <Tooltip contentStyle={{ borderRadius: "10px", border: "none", backgroundColor: "#0f0f0f", color: "#fff", fontSize: 12 }} />
                  <Bar dataKey="count" fill="#2dd4bf" radius={[0, 4, 4, 0]} maxBarSize={20} name="Trips" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-400 dark:text-gray-600 font-bold">No trip data yet</div>
            )}
          </div>
        </div>

        {/* Travel Style Distribution */}
        <div className="bg-white dark:bg-[#111] rounded-[20px] border border-gray-200 dark:border-white/10 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">Preferences</p>
              <h2 className="text-base font-black text-[#0a0a0a] dark:text-white mt-0.5">Travel Style Split</h2>
            </div>
            <PieChartIcon className="w-5 h-5 text-gray-300 dark:text-gray-600" />
          </div>
          <div className="h-[220px]">
            {styleChart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={styleChart} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                    {styleChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "10px", border: "none", backgroundColor: "#0f0f0f", color: "#fff", fontSize: 12 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-400 dark:text-gray-600 font-bold">No trip data yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Trips Table */}
      <div className="bg-white dark:bg-[#111] rounded-[20px] border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
          <div>
            <h2 className="text-base font-black text-[#0a0a0a] dark:text-white">Recent Platform Activity</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-medium">All generated itineraries across the platform</p>
          </div>
          <span className="text-xs font-bold bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 px-2.5 py-1 rounded-full">{allTrips.length} Total</span>
        </div>
        <div className="overflow-x-auto">
          {isLoadingTrips ? (
            <div className="flex items-center justify-center py-12 gap-3 text-gray-400 dark:text-gray-600">
              <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-bold">Loading activity...</span>
            </div>
          ) : allTrips.length === 0 ? (
            <div className="text-center py-12 text-sm font-bold text-gray-400 dark:text-gray-600">No trips generated yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 text-left">
                  <th className="px-5 py-3 text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">Route</th>
                  <th className="px-5 py-3 text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">Owner</th>
                  <th className="px-5 py-3 text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">Style</th>
                  <th className="px-5 py-3 text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">Budget</th>
                  <th className="px-5 py-3 text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">Duration</th>
                  <th className="px-5 py-3 text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {allTrips.slice(0, 10).map((trip, i) => {
                  const s = trip.summary || {};
                  return (
                    <tr key={trip.tripId || i} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/3 transition-colors">
                      <td className="px-5 py-3 font-black text-[#0a0a0a] dark:text-white whitespace-nowrap">
                        {s.source || "—"} <span className="text-teal-500 dark:text-teal-400 mx-1">→</span> {s.destination || "—"}
                      </td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">{trip.ownerName || trip.ownerEmail || "—"}</td>
                      <td className="px-5 py-3">
                        {s.travelStyle ? (
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 text-xs font-black">{s.travelStyle}</span>
                        ) : "—"}
                      </td>
                      <td className="px-5 py-3 font-black text-[#0a0a0a] dark:text-white whitespace-nowrap">{fmtCurrency(s.estimatedBudget || 0)}</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-400 font-bold">{s.duration || "—"}</td>
                      <td className="px-5 py-3 text-gray-400 dark:text-gray-500 font-medium text-xs whitespace-nowrap">{fmtDate(trip.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, delta, color, isFormatted }) {
  const colorMap = {
    teal: { bg: "bg-teal-50 dark:bg-teal-500/10", text: "text-teal-600 dark:text-teal-400", border: "border-teal-100 dark:border-teal-500/20" },
    yellow: { bg: "bg-yellow-50 dark:bg-yellow-500/10", text: "text-yellow-600 dark:text-yellow-400", border: "border-yellow-100 dark:border-yellow-500/20" },
    purple: { bg: "bg-purple-50 dark:bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", border: "border-purple-100 dark:border-purple-500/20" },
    green: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-100 dark:border-emerald-500/20" },
    blue: { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-100 dark:border-blue-500/20" },
  };
  const c = colorMap[color] || colorMap.teal;
  return (
    <div className="bg-white dark:bg-[#111] rounded-[20px] border border-gray-200 dark:border-white/10 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <p className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">{label}</p>
        <div className={`w-9 h-9 rounded-xl ${c.bg} ${c.text} border ${c.border} flex items-center justify-center`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-black text-[#0a0a0a] dark:text-white">{value}</p>
      <p className="mt-1 text-xs font-bold text-teal-600 dark:text-teal-400">{delta}</p>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, sub, statusGreen }) {
  return (
    <div className="bg-white dark:bg-[#111] rounded-[20px] border border-gray-200 dark:border-white/10 p-5 shadow-sm flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">{label}</p>
        <p className="font-black text-[#0a0a0a] dark:text-white text-sm">{value}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-0.5 flex items-center gap-1.5">
          {statusGreen && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
          {sub}
        </p>
      </div>
    </div>
  );
}

function StatusRow({ label, status, green }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 px-4 py-3">
      <span className="text-sm font-bold text-[#0a0a0a] dark:text-white">{label}</span>
      <span className={`flex items-center gap-1.5 text-xs font-black ${green ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
        <span className={`w-2 h-2 rounded-full ${green ? "bg-emerald-500" : "bg-red-500"} ${green ? "animate-pulse" : ""}`} />
        {status}
      </span>
    </div>
  );
}

function fmtCurrency(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function fmtDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}
