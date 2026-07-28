import { useState } from "react";
import { Navigate, Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getObfuscatedRoute } from "../utils/routeUtils";
import {
  ArrowLeft,
  BedDouble,
  CalendarDays,
  Car,
  CheckCircle2,
  CircleAlert,
  CircleDollarSign,
  Clock3,
  Compass,
  LoaderCircle,
  MapPin,
  Route,
  Save,
  Sparkles,
  Utensils,
  Users,
  X,
  Map as MapIcon,
  CloudSun,
} from "lucide-react";

import { saveTrip } from "../services/tripService";
import TripMap from "../components/TripMap";
import CalendarExport from "../components/CalendarExport";

const DAY_IMAGES = [
  "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1523428096881-5bd79d04300f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80"
];

function GeneratedTripItineraryPage() {
  const location = useLocation();
  const { user } = useAuth();
  const generatedTrip = location.state?.generatedTrip;

  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [notification, setNotification] = useState(null);

  const activeTrip = generatedTrip || (() => {
    try {
      const saved = localStorage.getItem("tripforge_last_generated_trip");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  if (!activeTrip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-white dark:bg-[#121417] rounded-3xl border border-slate-200 dark:border-white/10 font-sans">
        <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white">No Itinerary Loaded</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm font-medium">Please plan a trip using the manual form or our AI Chatbot Planner to view your itinerary.</p>
        <div className="flex items-center gap-3 mt-6">
          <Link to={getObfuscatedRoute(user, "/chatbot-planner")} className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-xs shadow-md">
            Launch AI Chatbot
          </Link>
          <Link to={getObfuscatedRoute(user, "/history")} className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white font-bold text-xs">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const {
    journeyOverview,
    summary,
    budgetBreakdown,
    itinerary,
    recommendations,
    travelTips,
    additionalNotes,
  } = activeTrip;

  const heroImage = journeyOverview?.cover || journeyOverview?.heroImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80";

  async function handleSaveJourney() {
    if (isSaving || isSaved) {
      return;
    }

    try {
      setIsSaving(true);
      setNotification(null);

      await saveTrip(generatedTrip);

      setIsSaved(true);

      showNotification(
        "success",
        "Journey saved successfully.",
        "Redirecting you to your dashboard..."
      );

      // Redirect to dashboard after short delay so user sees the success toast
      window.setTimeout(() => {
        navigate(getObfuscatedRoute(user, "/history"), { replace: true });
      }, 1500);

    } catch (error) {
      showNotification(
        "error",
        "Unable to save journey.",
        error.message || "Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function showNotification(type, title, message) {
    setNotification({
      type,
      title,
      message,
    });

    window.setTimeout(() => {
      setNotification(null);
    }, 4000);
  }

  return (
    <main className="min-h-screen px-5 py-7 text-[#0a0a0a] dark:text-white md:px-8 md:py-10 bg-[#fafafa] dark:bg-black transition-colors duration-300">
      {notification && (
        <NotificationToast
          notification={notification}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <Link
            to={getObfuscatedRoute(user, "/create-trip")}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 transition hover:text-[#0a0a0a] dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Plan another journey
          </Link>

          <div className="flex items-center gap-3">
            <CalendarExport summary={summary} itinerary={itinerary} />

            <button
              type="button"
              onClick={handleSaveJourney}
              disabled={isSaving || isSaved}
              className={`inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-extrabold shadow-sm transition ${
                isSaved
                  ? "cursor-default border-teal-200 dark:border-teal-900/50 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400"
                  : "border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] text-[#0a0a0a] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5"
              } disabled:opacity-80 cursor-pointer`}
            >
              {isSaving ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isSaved ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-teal-500" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save journey
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hero Section with High-Res Destination Image */}
        <section className="relative mt-7 overflow-hidden rounded-[32px] bg-teal-900 px-7 py-9 text-white shadow-xl dark:shadow-none dark:ring-1 dark:ring-white/10 md:px-10 md:py-16">
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md px-4 py-2 text-sm font-bold text-white border border-white/20 shadow-sm">
                  <CheckCircle2 className="h-4 w-4 text-teal-400" />
                  Smart Multi-Agent Journey
                  {journeyOverview?.weather && (
                    <span className="ml-2 flex items-center gap-1.5 text-yellow-300">
                      <CloudSun className="w-4 h-4" /> {journeyOverview.weather}
                    </span>
                  )}
                </div>

                <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl lg:text-[72px] leading-none">
                  {summary.source}
                  <span className="mx-3 text-teal-400/70 block md:inline text-3xl md:text-6xl">to</span>
                  {summary.destination}
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300 font-medium">
                  {journeyOverview?.overview ||
                    "A complete journey prepared around your selected dates, travellers, budget and preferences."}
                </p>
              </div>

              <div className="w-full lg:w-auto rounded-2xl bg-white/10 backdrop-blur-md px-6 py-5 text-white border border-white/20 shadow-lg">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-300">
                  Estimated budget
                </p>
                <p className="mt-1.5 text-3xl font-black tracking-tight">
                  {formatCurrency(summary.estimatedBudget)}
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                icon={CalendarDays}
                label="Duration"
                value={`${summary.duration} days`}
              />
              <SummaryCard
                icon={Users}
                label="Travellers"
                value={`${summary.travellers} people`}
              />
              <SummaryCard
                icon={Compass}
                label="Travel style"
                value={summary.travelStyle}
              />
              <SummaryCard
                icon={Clock3}
                label="Travel dates"
                value={`${formatDate(summary.startDate)} - ${formatDate(
                  summary.endDate
                )}`}
              />
            </div>
          </div>
        </section>


        {/* Main Content Layout */}
        <div className="mt-8 space-y-8">
          
          {/* Details, Budget, and Itinerary */}
          <div className="space-y-8">
            
            {/* Budget Breakdown */}
            <section className="rounded-[24px] border border-gray-200 dark:border-white/10 dark:ring-1 dark:ring-white/5 bg-white dark:bg-[#111] p-6 shadow-sm dark:shadow-none transition-colors">
              <SectionHeader
                icon={CircleDollarSign}
                eyebrow="Expense plan"
                title="Budget breakdown"
                description="An estimated distribution of your total budget."
              />

              <div className="mt-7 space-y-4">
                <BudgetRow label="Transport" value={budgetBreakdown.transport} />
                <BudgetRow label="Accommodation" value={budgetBreakdown.accommodation} />
                <BudgetRow label="Food" value={budgetBreakdown.food} />
                <BudgetRow label="Activities" value={budgetBreakdown.activities} />
                <BudgetRow label="Reserve" value={budgetBreakdown.reserve} />
                <div className="mt-5 flex items-center justify-between rounded-xl bg-gray-50 dark:bg-[#222] border border-gray-200 dark:border-white/5 px-5 py-4 text-[#0a0a0a] dark:text-white shadow-sm">
                  <span className="font-black text-sm uppercase tracking-wider">Total budget</span>
                  <span className="text-xl font-black text-teal-600 dark:text-teal-400">{formatCurrency(budgetBreakdown.totalBudget)}</span>
                </div>
              </div>
            </section>

            {/* Itinerary */}
            <section className="rounded-[24px] border border-gray-200 dark:border-white/10 dark:ring-1 dark:ring-white/5 bg-white dark:bg-[#111] p-6 shadow-sm dark:shadow-none md:p-8 transition-colors">
              <SectionHeader
                icon={Route}
                eyebrow="Daily plan"
                title="Your day-wise itinerary"
                description="Follow this organised schedule throughout your journey."
              />
              <div className="mt-8 space-y-6">
                {itinerary.map((day, index) => {
                  const placeImage = day.image || DAY_IMAGES[index % DAY_IMAGES.length];
                  return (
                    <article key={day.day} className="relative rounded-[24px] border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1a1a] shadow-sm overflow-hidden group">
                      
                      {/* Image header for the itinerary card */}
                      <div className="h-32 w-full relative overflow-hidden bg-gray-200 dark:bg-gray-800">
                         <img 
                            src={placeImage} 
                            alt={day.locationName} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 dark:opacity-70"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/50 dark:from-[#1a1a1a] dark:via-[#1a1a1a]/50 to-transparent" />
                      </div>

                      <div className="p-6 pt-0 relative z-10 -mt-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-[#222] border border-gray-200 dark:border-white/10 text-xl font-black text-[#0a0a0a] dark:text-white shadow-md">
                            {day.day}
                          </div>
                          <div className="flex-1 mt-1">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-500 dark:text-teal-400">Day {day.day}</p>
                              {day.locationName && (
                                <span className="text-xs font-bold text-[#0a0a0a] dark:text-white bg-white dark:bg-[#222] border border-gray-200 dark:border-white/10 px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                                  <MapPin className="w-3 h-3 text-teal-600 dark:text-teal-400" /> {day.locationName}
                                </span>
                              )}
                            </div>
                            <h3 className="mt-2 text-xl font-black text-[#0a0a0a] dark:text-white tracking-tight">{day.title}</h3>
                            <div className="mt-5 space-y-4">
                              {day.activities.map((activity) => (
                                <div key={activity} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                                  <p className="leading-relaxed text-sm font-medium">{activity}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>

            {/* Travel Reminders & Recommendations */}
            <div className="grid sm:grid-cols-2 gap-7">
               <section className="rounded-[24px] border border-yellow-200 dark:border-yellow-900/30 bg-yellow-50 dark:bg-yellow-900/10 p-6 shadow-sm h-full">
                 <SectionHeader
                   icon={CheckCircle2}
                   eyebrow="Travel reminders"
                   title="Before you leave"
                   description="Keep these important points in mind."
                 />
                 <div className="mt-6 space-y-4">
                   {travelTips.map((tip) => (
                     <div key={tip} className="flex items-start gap-3">
                       <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-500" />
                       <p className="text-sm leading-6 text-yellow-800 dark:text-yellow-200/80 font-medium">{tip}</p>
                     </div>
                   ))}
                 </div>
               </section>

               <section className="rounded-[24px] border border-gray-200 dark:border-white/10 dark:ring-1 dark:ring-white/5 bg-white dark:bg-[#111] p-6 shadow-sm h-full flex flex-col justify-center transition-colors">
                  <SectionHeader
                    icon={Sparkles}
                    eyebrow="Recommendations"
                    title="Helpful suggestions"
                    description="Options for transport, food, etc."
                  />
                  <div className="mt-6 flex flex-wrap gap-2">
                     <span className="px-3 py-1.5 bg-gray-100 dark:bg-[#222] border border-transparent dark:border-white/10 text-[#0a0a0a] dark:text-white rounded-lg text-sm font-bold flex items-center gap-1.5">
                        <Car className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Transport: {recommendations.transport.length}
                     </span>
                     <span className="px-3 py-1.5 bg-gray-100 dark:bg-[#222] border border-transparent dark:border-white/10 text-[#0a0a0a] dark:text-white rounded-lg text-sm font-bold flex items-center gap-1.5">
                        <Utensils className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Food: {recommendations.food.length}
                     </span>
                     <span className="px-3 py-1.5 bg-gray-100 dark:bg-[#222] border border-transparent dark:border-white/10 text-[#0a0a0a] dark:text-white rounded-lg text-sm font-bold flex items-center gap-1.5">
                        <BedDouble className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Stays: {recommendations.accommodation.length}
                     </span>
                  </div>
               </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function NotificationToast({ notification, onClose }) {
  const isSuccess = notification.type === "success";

  return (
    <div className="fixed right-5 top-5 z-50 w-[calc(100%-40px)] max-w-md animate-in slide-in-from-top-4 fade-in duration-300">
      <div
        className={`flex items-start gap-4 rounded-2xl border p-4 shadow-xl backdrop-blur-md ${
          isSuccess
            ? "border-teal-200/50 bg-teal-50/90 dark:border-teal-900/50 dark:bg-[#111]/90"
            : "border-red-200/50 bg-red-50/90 dark:border-red-900/50 dark:bg-[#111]/90"
        }`}
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isSuccess
              ? "bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400"
              : "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400"
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <CircleAlert className="h-5 w-5" />
          )}
        </div>

        <div className="flex-1">
          <p
            className={`font-black text-sm ${
              isSuccess ? "text-[#0a0a0a] dark:text-white" : "text-red-900 dark:text-red-200"
            }`}
          >
            {notification.title}
          </p>

          <p
            className={`mt-1 text-xs leading-5 font-medium ${
              isSuccess ? "text-gray-600 dark:text-gray-300" : "text-red-700 dark:text-red-300"
            }`}
          >
            {notification.message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="rounded-lg p-1.5 text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <article className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md hover:bg-white/20 transition-colors">
      <Icon className="h-5 w-5 text-teal-300" />
      <p className="mt-4 text-xs font-bold text-gray-300 uppercase tracking-wider">
        {label}
      </p>
      <p className="mt-1 font-black text-white">{value}</p>
    </article>
  );
}

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 dark:bg-[#222] text-[#0a0a0a] dark:text-teal-400 border border-gray-200 dark:border-white/10 shadow-sm">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-500 dark:text-teal-400/80">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-xl md:text-2xl font-black text-[#0a0a0a] dark:text-white tracking-tight">{title}</h2>

        <p className="mt-1.5 text-sm leading-6 text-gray-500 dark:text-gray-400 font-medium">
          {description}
        </p>
      </div>
    </div>
  );
}

function RecommendationCard({ icon: Icon, title, items }) {
  return (
    <article className="rounded-[24px] border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1a1a] p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white dark:bg-[#222] text-[#0a0a0a] dark:text-teal-400 border border-gray-200 dark:border-white/10">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-5 text-lg font-black text-[#0a0a0a] dark:text-white">{title}</h3>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
            <p className="text-sm leading-6 text-gray-600 dark:text-gray-400 font-medium">
              {item}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}

function BudgetRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-4 last:border-b-0">
      <span className="font-bold text-gray-600 dark:text-gray-400 text-sm">{label}</span>
      <span className="font-black text-[#0a0a0a] dark:text-white text-sm">
        {formatCurrency(value)}
      </span>
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

function formatDate(value) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default GeneratedTripItineraryPage;
