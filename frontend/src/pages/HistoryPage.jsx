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

const COLORS = ['#173d2e', '#39734f', '#78a083', '#eaff9d', '#fef08a'];

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
             <h1 className="text-2xl font-black text-[#173d2e] dark:text-white">
               Dashboard Overview
             </h1>
             <p className="text-[#708078] dark:text-slate-400 mt-1 text-sm font-bold">
               Welcome back, {user?.name || "Traveller"} 👋
             </p>
          </div>
          <Link
            to={getObfuscatedRoute(user, "/create-trip")}
            className="rounded-lg bg-[#173d2e] dark:bg-emerald-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-[#20533f] dark:hover:bg-emerald-500 shadow-md"
          >
            Plan new journey
          </Link>
        </div>

        {analyticsData && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-[#e2eadc] dark:border-slate-800 shadow-sm flex items-start justify-between transition-colors duration-300">
                 <div>
                    <p className="text-xs font-bold text-[#708078] dark:text-slate-400 uppercase tracking-wider">Total Trips</p>
                    <p className="text-2xl font-black text-[#173d2e] dark:text-white mt-1">{trips.length}</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-[#edf8d9] dark:bg-slate-800 text-[#39734f] dark:text-emerald-400 flex items-center justify-center border border-transparent dark:border-slate-700">
                    <MapPin className="w-5 h-5" />
                 </div>
              </div>
              <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-[#e2eadc] dark:border-slate-800 shadow-sm flex items-start justify-between transition-colors duration-300">
                 <div>
                    <p className="text-xs font-bold text-[#708078] dark:text-slate-400 uppercase tracking-wider">Total Budget</p>
                    <p className="text-2xl font-black text-[#173d2e] dark:text-white mt-1">{formatCurrency(analyticsData.totalBudget)}</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-[#fff9cf] dark:bg-slate-800 text-[#8a7213] dark:text-yellow-400 flex items-center justify-center border border-transparent dark:border-slate-700">
                    <CircleDollarSign className="w-5 h-5" />
                 </div>
              </div>
              <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-[#e2eadc] dark:border-slate-800 shadow-sm flex items-start justify-between transition-colors duration-300">
                 <div>
                    <p className="text-xs font-bold text-[#708078] dark:text-slate-400 uppercase tracking-wider">Total Travellers</p>
                    <p className="text-2xl font-black text-[#173d2e] dark:text-white mt-1">{trips.reduce((acc, trip) => acc + (trip.summary?.travellers || 0), 0)}</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-transparent dark:border-slate-700">
                    <Users className="w-5 h-5" />
                 </div>
              </div>
              <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-[#e2eadc] dark:border-slate-800 shadow-sm flex items-start justify-between transition-colors duration-300">
                 <div>
                    <p className="text-xs font-bold text-[#708078] dark:text-slate-400 uppercase tracking-wider">Total Days</p>
                    <p className="text-2xl font-black text-[#173d2e] dark:text-white mt-1">{trips.reduce((acc, trip) => acc + (trip.summary?.duration || 0), 0)}</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-slate-800 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-transparent dark:border-slate-700">
                    <CalendarDays className="w-5 h-5" />
                 </div>
              </div>
           </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-7">
           {/* Chart Section */}
           {analyticsData && (
              <div className="xl:col-span-1 bg-white dark:bg-[#0f172a] rounded-2xl p-6 border border-[#e2eadc] dark:border-slate-800 shadow-sm flex flex-col transition-colors duration-300">
                 <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-black text-[#173d2e] dark:text-white">Expenditure Breakdown</h2>
                    <PieChartIcon className="w-5 h-5 text-[#708078] dark:text-slate-500" />
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
                           contentStyle={{ borderRadius: '12px', border: '1px solid #e2eadc', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', backgroundColor: '#fff', color: '#000' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }}/>
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           )}

           {/* Trips Section */}
           <div className={`bg-white dark:bg-[#0f172a] rounded-2xl p-6 border border-[#e2eadc] dark:border-slate-800 shadow-sm transition-colors duration-300 ${analyticsData ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-base font-black text-[#173d2e] dark:text-white">Recent Journeys</h2>
                 <Link to="#" className="text-sm font-bold text-[#39734f] dark:text-emerald-400 hover:underline">View All</Link>
              </div>

              {errorMessage && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900 p-4 text-red-800 dark:text-red-400 text-sm font-bold flex justify-between items-center">
                  <p>{errorMessage}</p>
                  <button onClick={loadTrips} className="bg-white dark:bg-transparent text-red-700 dark:text-red-400 px-3 py-1 rounded-lg border border-red-200 dark:border-red-800 hover:dark:bg-red-900/50">Retry</button>
                </div>
              )}

              {isLoading ? (
                <div className="flex min-h-[200px] items-center justify-center">
                  <LoaderCircle className="h-8 w-8 animate-spin text-[#39734f] dark:text-emerald-400" />
                </div>
              ) : trips.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#cbdac1] dark:border-slate-700 bg-[#fbfdf9] dark:bg-slate-800/50 p-10 text-center">
                  <MapPin className="mx-auto h-10 w-10 text-[#78a083] dark:text-slate-500" />
                  <h3 className="mt-4 text-lg font-black text-[#173d2e] dark:text-white">No saved journeys yet</h3>
                  <p className="mx-auto mt-2 text-sm text-[#708078] dark:text-slate-400 max-w-sm">
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
    <article className="overflow-hidden rounded-[30px] border border-[#e1eadb] dark:border-slate-700 bg-white dark:bg-[#0b1120] shadow-[0_20px_55px_rgba(40,65,45,0.08)] flex flex-col justify-between transition-colors duration-300">
      <div>
        <div className="relative h-44 bg-[#173d2e] overflow-hidden">
          <img
            src={thumbnail}
            alt={summary.destination}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent p-5 flex flex-col justify-end text-white">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
              Saved journey
            </p>
            <h2 className="text-2xl font-black leading-tight">
              {summary.source} to {summary.destination}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
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

          <div className="mt-5 rounded-2xl bg-[#f4f9ef] dark:bg-slate-800 p-4 border border-transparent dark:border-slate-700">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#718078] dark:text-slate-400">
              Travel dates
            </p>

            <p className="mt-2 font-bold text-[#34443a] dark:text-white">
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
          className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#173d2e] dark:bg-emerald-600 px-4 py-3 font-extrabold text-white transition hover:bg-[#20533f] dark:hover:bg-emerald-500 text-sm cursor-pointer shadow-sm"
        >
          <Eye className="w-4 h-4" /> View Trip
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="flex items-center justify-center p-3 rounded-full border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 transition hover:bg-red-100 disabled:opacity-60 cursor-pointer"
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
    <div className="rounded-2xl border border-[#e2eadc] dark:border-slate-700 bg-[#fbfdf9] dark:bg-slate-800/50 p-4 transition-colors duration-300">
      <Icon className="h-5 w-5 text-[#39734f] dark:text-emerald-400" />

      <p className="mt-3 text-xs font-bold text-[#78847c] dark:text-slate-400">
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