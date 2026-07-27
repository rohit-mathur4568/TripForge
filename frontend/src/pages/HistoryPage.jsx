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
    <main className="min-h-screen px-5 py-8 text-[#17211a] md:px-8 md:py-10 bg-[#fbfdf9]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#526459] transition hover:text-[#173d2e]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <Link
            to={getObfuscatedRoute(user, "/create-trip")}
            className="rounded-full bg-[#173d2e] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#20533f]"
          >
            Plan new journey
          </Link>
        </div>

        <section className="mt-7 rounded-[34px] bg-[#173d2e] px-7 py-9 text-white shadow-[0_30px_80px_rgba(40,65,45,0.15)] md:px-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex-1">
             <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#eaff9d]">
               User Dashboard
             </p>
             <h1 className="mt-3 text-4xl font-black md:text-5xl">
               Welcome to your Analytics.
             </h1>
             <p className="mt-4 max-w-2xl leading-7 text-[#d8e3da]">
               Track your travel history, total expenditure, and AI-curated saved journeys.
             </p>
          </div>

          {analyticsData && (
             <div className="w-full md:w-auto grid grid-cols-2 gap-4 shrink-0">
                <div className="bg-white/10 border border-white/20 p-5 rounded-3xl backdrop-blur-md">
                   <div className="text-xs font-bold uppercase text-[#c9d9cd]">Total Trips</div>
                   <div className="text-3xl font-black text-[#eaff9d] mt-2">{trips.length}</div>
                </div>
                <div className="bg-white/10 border border-white/20 p-5 rounded-3xl backdrop-blur-md">
                   <div className="text-xs font-bold uppercase text-[#c9d9cd]">Total Budget</div>
                   <div className="text-2xl font-black text-[#eaff9d] mt-2">{formatCurrency(analyticsData.totalBudget)}</div>
                </div>
             </div>
          )}
        </section>

        {analyticsData && (
           <section className="mt-7 bg-white rounded-[32px] p-8 border border-[#e1eadb] shadow-[0_20px_55px_rgba(40,65,45,0.05)]">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-[#edf8d9] text-[#173d2e] rounded-xl flex items-center justify-center">
                    <PieChartIcon className="w-5 h-5" />
                 </div>
                 <div>
                    <h2 className="text-xl font-black">Expenditure Overview</h2>
                    <p className="text-sm text-[#708078]">Average budget distribution across all your trips.</p>
                 </div>
              </div>
              <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={analyticsData.chartData}
                       cx="50%"
                       cy="50%"
                       innerRadius={80}
                       outerRadius={120}
                       paddingAngle={5}
                       dataKey="value"
                     >
                       {analyticsData.chartData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                     />
                     <Legend verticalAlign="bottom" height={36}/>
                   </PieChart>
                 </ResponsiveContainer>
              </div>
           </section>
        )}

        {errorMessage && (
          <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
            <p className="font-bold">{errorMessage}</p>

            <button
              type="button"
              onClick={loadTrips}
              className="mt-3 rounded-full bg-red-700 px-5 py-2.5 text-sm font-bold text-white"
            >
              Try again
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <div className="text-center">
              <LoaderCircle className="mx-auto h-9 w-9 animate-spin text-[#39734f]" />
              <p className="mt-4 font-bold text-[#617068]">
                Loading your dashboard...
              </p>
            </div>
          </div>
        ) : trips.length === 0 ? (
          <section className="mt-7 rounded-[32px] border border-dashed border-[#cbdac1] bg-white/80 p-12 text-center">
            <MapPin className="mx-auto h-12 w-12 text-[#78a083]" />

            <h2 className="mt-5 text-2xl font-black">
              No saved journeys yet
            </h2>

            <p className="mx-auto mt-3 max-w-xl leading-7 text-[#6b776e]">
              Create your first travel plan and save it for future reference.
            </p>

            <Link
              to={getObfuscatedRoute(user, "/create-trip")}
              className="mt-6 inline-flex rounded-full bg-[#173d2e] px-6 py-3 font-extrabold text-white"
            >
              Create a journey
            </Link>
          </section>
        ) : (
          <section className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {trips.map((trip) => (
              <TripCard
                key={trip.tripId}
                trip={trip}
                isDeleting={deletingTripId === trip.tripId}
                onDelete={() => handleDeleteTrip(trip.tripId)}
                onView={() => handleViewTrip(trip)}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

function TripCard({ trip, isDeleting, onDelete, onView }) {
  const summary = trip.summary || {};
  const thumbnail = trip.journeyOverview?.thumbnail || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80";

  return (
    <article className="overflow-hidden rounded-[30px] border border-[#e1eadb] bg-white shadow-[0_20px_55px_rgba(40,65,45,0.08)] flex flex-col justify-between">
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

          <div className="mt-5 rounded-2xl bg-[#f4f9ef] p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#718078]">
              Travel dates
            </p>

            <p className="mt-2 font-bold text-[#34443a]">
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
          className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#173d2e] px-4 py-3 font-extrabold text-white transition hover:bg-[#20533f] text-sm cursor-pointer"
        >
          <Eye className="w-4 h-4" /> View Trip
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="flex items-center justify-center p-3 rounded-full border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100 disabled:opacity-60 cursor-pointer"
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
    <div className="rounded-2xl border border-[#e2eadc] bg-[#fbfdf9] p-4">
      <Icon className="h-5 w-5 text-[#39734f]" />

      <p className="mt-3 text-xs font-bold text-[#78847c]">
        {label}
      </p>

      <p className="mt-1 text-sm font-black">{value}</p>
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