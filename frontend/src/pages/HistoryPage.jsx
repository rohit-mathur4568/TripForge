import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getObfuscatedRoute } from "../utils/routeUtils";
import {
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  Compass,
  LoaderCircle,
  MapPin,
  Trash2,
  Users,
  Eye,
  PieChart as PieChartIcon
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

import {
  deleteSavedTrip,
  getSavedTrips,
} from "../services/tripService";

const COLORS = ['#2dd4bf', '#0f766e', '#115e59', '#134e4a', '#a7f3d0'];

function HistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingTripId, setDeletingTripId] = useState("");

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await getSavedTrips();

      setTrips(response.trips || []);
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to load saved journeys."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteTrip(tripId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this journey?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingTripId(tripId);

      await deleteSavedTrip(tripId);

      setTrips((currentTrips) =>
        currentTrips.filter((trip) => trip.tripId !== tripId)
      );
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to delete this journey."
      );
    } finally {
      setDeletingTripId("");
    }
  }

  function handleViewTrip(trip) {
    navigate(getObfuscatedRoute(user, "/result"), {
      state: { generatedTrip: trip },
    });
  }

  // Aggregate Data for Analytics
  const analyticsData = useMemo(() => {
    if (trips.length === 0) return null;

    let totalBudget = 0;
    const categories = { Transport: 0, Accommodation: 0, Food: 0, Activities: 0 };

    trips.forEach(trip => {
      const budget = trip.budgetBreakdown || {};
      totalBudget += budget.totalBudget || 0;
      categories.Transport += budget.transport || 0;
      categories.Accommodation += budget.accommodation || 0;
      categories.Food += budget.food || 0;
      categories.Activities += budget.activities || 0;
    });

    const chartData = [
      { name: "Transport", value: categories.Transport },
      { name: "Stays", value: categories.Accommodation },
      { name: "Food", value: categories.Food },
      { name: "Activities", value: categories.Activities }
    ].filter(item => item.value > 0);

    return { totalBudget, chartData };
  }, [trips]);

  return (
    <div className="space-y-7 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
             <h1 className="text-2xl font-black text-[#0a0a0a] dark:text-white">
               Dashboard Overview
             </h1>
             <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-bold">
               Welcome back, {user?.name || "Traveller"} 👋
             </p>
          </div>
          <Link
            to={getObfuscatedRoute(user, "/create-trip")}
            className="rounded-lg bg-[#0a0a0a] dark:bg-white px-5 py-2.5 text-sm font-black text-white dark:text-black transition hover:bg-[#222] dark:hover:bg-gray-200 shadow-md"
          >
            Plan new journey
          </Link>
        </div>

        {analyticsData && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white dark:bg-[#111] rounded-[24px] p-5 border border-gray-200 dark:border-white/10 dark:ring-1 dark:ring-white/5 shadow-sm dark:shadow-none flex items-start justify-between transition-colors duration-300 hover:dark:ring-white/10">
                 <div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Trips</p>
                    <p className="text-2xl font-black text-[#0a0a0a] dark:text-white mt-1">{trips.length}</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-transparent dark:border-teal-500/20">
                    <MapPin className="w-5 h-5" />
                 </div>
              </div>
              <div className="bg-white dark:bg-[#111] rounded-[24px] p-5 border border-gray-200 dark:border-white/10 dark:ring-1 dark:ring-white/5 shadow-sm dark:shadow-none flex items-start justify-between transition-colors duration-300 hover:dark:ring-white/10">
                 <div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Budget</p>
                    <p className="text-2xl font-black text-[#0a0a0a] dark:text-white mt-1">{formatCurrency(analyticsData.totalBudget)}</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center border border-transparent dark:border-yellow-500/20">
                    <CircleDollarSign className="w-5 h-5" />
                 </div>
              </div>
              <div className="bg-white dark:bg-[#111] rounded-[24px] p-5 border border-gray-200 dark:border-white/10 dark:ring-1 dark:ring-white/5 shadow-sm dark:shadow-none flex items-start justify-between transition-colors duration-300 hover:dark:ring-white/10">
                 <div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Travellers</p>
                    <p className="text-2xl font-black text-[#0a0a0a] dark:text-white mt-1">{trips.reduce((acc, trip) => acc + (trip.summary?.travellers || 0), 0)}</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-transparent dark:border-blue-500/20">
                    <Users className="w-5 h-5" />
                 </div>
              </div>
              <div className="bg-white dark:bg-[#111] rounded-[24px] p-5 border border-gray-200 dark:border-white/10 dark:ring-1 dark:ring-white/5 shadow-sm dark:shadow-none flex items-start justify-between transition-colors duration-300 hover:dark:ring-white/10">
                 <div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Days</p>
                    <p className="text-2xl font-black text-[#0a0a0a] dark:text-white mt-1">{trips.reduce((acc, trip) => acc + (trip.summary?.duration || 0), 0)}</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-transparent dark:border-purple-500/20">
                    <CalendarDays className="w-5 h-5" />
                 </div>
              </div>
           </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-7">
           {/* Chart Section */}
           {analyticsData && (
              <div className="xl:col-span-1 bg-white dark:bg-[#111] rounded-[24px] p-6 border border-gray-200 dark:border-white/10 dark:ring-1 dark:ring-white/5 shadow-sm dark:shadow-none flex flex-col transition-colors duration-300">
                 <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-black text-[#0a0a0a] dark:text-white">Expenditure Breakdown</h2>
                    <PieChartIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                 </div>
                 <div className="flex-1 min-h-[250px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {analyticsData.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                           formatter={(value) => formatCurrency(value)}
                           contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', backgroundColor: '#111', color: '#fff' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }}/>
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           )}

           {/* Trips Section */}
           <div className={`bg-white dark:bg-[#111] rounded-[24px] p-6 border border-gray-200 dark:border-white/10 dark:ring-1 dark:ring-white/5 shadow-sm dark:shadow-none transition-colors duration-300 ${analyticsData ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-base font-black text-[#0a0a0a] dark:text-white">Recent Journeys</h2>
                 <Link to="#" className="text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline">View All</Link>
              </div>

              {errorMessage && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30 p-4 text-red-800 dark:text-red-400 text-sm font-bold flex justify-between items-center">
                  <p>{errorMessage}</p>
                  <button onClick={loadTrips} className="bg-white dark:bg-transparent text-red-700 dark:text-red-400 px-3 py-1 rounded-lg border border-red-200 dark:border-red-800 hover:dark:bg-red-900/50">Retry</button>
                </div>
              )}

              {isLoading ? (
                <div className="flex min-h-[200px] items-center justify-center">
                  <LoaderCircle className="h-8 w-8 animate-spin text-teal-600 dark:text-teal-400" />
                </div>
              ) : trips.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-[#1a1a1a] p-10 text-center">
                  <MapPin className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" />
                  <h3 className="mt-4 text-lg font-black text-[#0a0a0a] dark:text-white">No saved journeys yet</h3>
                  <p className="mx-auto mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                    Create your first travel plan and it will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  {trips.slice(0, 4).map((trip) => (
                    <TripCard
                      key={trip.tripId}
                      trip={trip}
                      isDeleting={deletingTripId === trip.tripId}
                      onDelete={() => handleDeleteTrip(trip.tripId)}
                      onView={() => handleViewTrip(trip)}
                    />
                  ))}
                </div>
              )}
           </div>
        </div>
    </div>
  );
}

function TripCard({ trip, isDeleting, onDelete, onView }) {
  const summary = trip.summary || {};
  const thumbnail = trip.journeyOverview?.thumbnail || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80";

  return (
    <article className="overflow-hidden rounded-[24px] border border-gray-200 dark:border-white/10 dark:ring-1 dark:ring-white/5 bg-white dark:bg-[#1a1a1a] shadow-sm dark:shadow-none flex flex-col justify-between transition-colors duration-300 group hover:dark:ring-white/10">
      <div>
        <div className="relative h-44 bg-teal-900 overflow-hidden">
          <img
            src={thumbnail}
            alt={summary.destination}
            className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 flex flex-col justify-end text-white">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
              Saved journey
            </p>
            <h2 className="text-2xl font-black leading-tight">
              {summary.source} to {summary.destination}
            </h2>
            <p className="text-xs text-gray-300 mt-1">
              Saved on {formatDate(trip.createdAt)}
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-3">
            <TripDetail
              icon={CalendarDays}
              label="Duration"
              value={`${summary.duration || 0} days`}
            />

            <TripDetail
              icon={Users}
              label="Travellers"
              value={`${summary.travellers || 0} people`}
            />

            <TripDetail
              icon={CircleDollarSign}
              label="Budget"
              value={formatCurrency(summary.estimatedBudget || 0)}
            />

            <TripDetail
              icon={Compass}
              label="Style"
              value={summary.travelStyle || "Not selected"}
            />
          </div>

          <div className="mt-5 rounded-xl bg-gray-50 dark:bg-[#222] p-4 border border-transparent dark:border-white/5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
              Travel dates
            </p>

            <p className="mt-2 font-bold text-[#0a0a0a] dark:text-white">
              {formatTripDate(summary.startDate)} -{" "}
              {formatTripDate(summary.endDate)}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 flex items-center gap-3">
        <button
          type="button"
          onClick={onView}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#0a0a0a] dark:bg-white px-4 py-3 font-extrabold text-white dark:text-black transition hover:bg-[#222] dark:hover:bg-gray-200 text-sm cursor-pointer shadow-sm"
        >
          <Eye className="w-4 h-4" /> View Trip
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="flex items-center justify-center p-3 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 transition hover:bg-red-100 disabled:opacity-60 cursor-pointer"
          title="Delete journey"
        >
          {isDeleting ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </article>
  );
}

function TripDetail({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#222] p-4 transition-colors duration-300">
      <Icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />

      <p className="mt-3 text-xs font-bold text-gray-500 dark:text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-black dark:text-white">{value}</p>
    </div>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTripDate(value) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatDate(value) {
  if (!value) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default HistoryPage;