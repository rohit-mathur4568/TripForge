import { useState } from "react";
import { Navigate, Link, useLocation } from "react-router";
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

function ResultPage() {
  const location = useLocation();
  const { user } = useAuth();
  const generatedTrip = location.state?.generatedTrip;

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [notification, setNotification] = useState(null);

  if (!generatedTrip) {
    return <Navigate to={getObfuscatedRoute(user, "/create-trip")} replace />;
  }

  const {
    journeyOverview,
    summary,
    budgetBreakdown,
    itinerary,
    recommendations,
    travelTips,
    additionalNotes,
  } = generatedTrip;

  const heroImage = journeyOverview?.heroImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80";

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
        "You can now view this journey in your saved trips."
      );
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
    <main className="min-h-screen px-5 py-7 text-[#17211a] md:px-8 md:py-10 bg-[#fbfdf9]">
      {notification && (
        <NotificationToast
          notification={notification}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to={getObfuscatedRoute(user, "/create-trip")}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#526459] transition hover:text-[#173d2e]"
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
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-extrabold shadow-sm transition ${
                isSaved
                  ? "cursor-default border-[#b9d4ae] bg-[#edf8d9] text-[#173d2e]"
                  : "border-[#dce6d5] bg-white text-[#34443a] hover:border-[#b8ccac]"
              } disabled:opacity-80 cursor-pointer`}
            >
              {isSaving ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Saving journey...
                </>
              ) : isSaved ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Journey saved
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
        <section className="relative mt-7 overflow-hidden rounded-[36px] bg-[#173d2e] px-7 py-9 text-white shadow-[0_30px_80px_rgba(40,65,45,0.16)] md:px-10 md:py-11">
          <div
            className="absolute inset-0 opacity-30 bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: `url(${heroImage})` }}
          />

          <div className="relative z-10">
            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-2 text-sm font-bold text-[#e4ece6] border border-white/20">
                  <CheckCircle2 className="h-4 w-4 text-[#eaff9d]" />
                  Verified Multi-Agent Journey
                  {journeyOverview?.weather && (
                    <span className="ml-2 flex items-center gap-1 text-cyan-300">
                      <CloudSun className="w-3.5 h-3.5" /> {journeyOverview.weather}
                    </span>
                  )}
                </div>

                <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
                  {summary.source}
                  <span className="mx-3 text-[#9fbea9]">to</span>
                  {summary.destination}
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-[#d4e0d7]">
                  {journeyOverview?.overview ||
                    "A complete journey prepared around your selected dates, travellers, budget and preferences."}
                </p>
              </div>

              <div className="rounded-[26px] bg-[#eaff9d] px-6 py-5 text-[#173d2e] shadow-xl">
                <p className="text-xs font-black uppercase tracking-[0.18em]">
                  Estimated budget
                </p>

                <p className="mt-2 text-3xl font-black">
                  {formatCurrency(summary.estimatedBudget)}
                </p>
              </div>
            </div>

            <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* Interactive Map Visualizer */}
        <section className="mt-7 rounded-[32px] border border-[#e1eadb] bg-white p-6 shadow-[0_22px_60px_rgba(40,65,45,0.08)] md:p-8">
          <SectionHeader
            icon={MapIcon}
            eyebrow="Interactive Route Map"
            title={`Journey Map: ${summary.destination}`}
            description="Explore your day-by-day itinerary waypoints and route."
          />
          <div className="mt-6">
            <TripMap
              itinerary={itinerary}
              centerLat={journeyOverview?.latitude}
              centerLng={journeyOverview?.longitude}
              destinationName={summary.destination}
            />
          </div>
        </section>

        <div className="mt-7 grid items-start gap-7 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-7">
            <section className="rounded-[32px] border border-[#e1eadb] bg-white p-6 shadow-[0_22px_60px_rgba(40,65,45,0.08)] md:p-8">
              <SectionHeader
                icon={Route}
                eyebrow="Daily plan"
                title="Your day-wise itinerary"
                description="Follow this organised schedule throughout your journey."
              />

              <div className="mt-8 space-y-5">
                {itinerary.map((day) => (
                  <article
                    key={day.day}
                    className="relative rounded-[26px] border border-[#e2eadc] bg-[#fbfdf9] p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#173d2e] text-lg font-black text-white shadow-md">
                        {day.day}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#708078]">
                            Day {day.day}
                          </p>
                          {day.locationName && (
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                              📍 {day.locationName}
                            </span>
                          )}
                        </div>

                        <h3 className="mt-2 text-xl font-black">
                          {day.title}
                        </h3>

                        <div className="mt-5 space-y-3">
                          {day.activities.map((activity) => (
                            <div
                              key={activity}
                              className="flex items-start gap-3 text-[#5f6d64]"
                            >
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#568064]" />

                              <p className="leading-6">{activity}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[32px] border border-[#e1eadb] bg-white p-6 shadow-[0_22px_60px_rgba(40,65,45,0.08)] md:p-8">
              <SectionHeader
                icon={Sparkles}
                eyebrow="Recommendations"
                title="Helpful journey suggestions"
                description="Practical options for travel, accommodation and food."
              />

              <div className="mt-8 grid gap-5 md:grid-cols-3">
                <RecommendationCard
                  icon={Car}
                  title="Transport"
                  items={recommendations.transport}
                />

                <RecommendationCard
                  icon={BedDouble}
                  title="Accommodation"
                  items={recommendations.accommodation}
                />

                <RecommendationCard
                  icon={Utensils}
                  title="Food"
                  items={recommendations.food}
                />
              </div>
            </section>
          </div>

          <aside className="space-y-7 lg:sticky lg:top-7">
            <section className="rounded-[32px] border border-[#e1eadb] bg-white p-6 shadow-[0_22px_60px_rgba(40,65,45,0.08)]">
              <SectionHeader
                icon={CircleDollarSign}
                eyebrow="Expense plan"
                title="Budget breakdown"
                description="An estimated distribution of your total budget."
              />

              <div className="mt-7 space-y-4">
                <BudgetRow
                  label="Transport"
                  value={budgetBreakdown.transport}
                />

                <BudgetRow
                  label="Accommodation"
                  value={budgetBreakdown.accommodation}
                />

                <BudgetRow
                  label="Food"
                  value={budgetBreakdown.food}
                />

                <BudgetRow
                  label="Activities"
                  value={budgetBreakdown.activities}
                />

                <BudgetRow
                  label="Reserve"
                  value={budgetBreakdown.reserve}
                />

                <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#173d2e] px-5 py-4 text-white shadow-md">
                  <span className="font-black">Total budget</span>

                  <span className="text-xl font-black">
                    {formatCurrency(budgetBreakdown.totalBudget)}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-[32px] border border-[#e1eadb] bg-[#fff9cf] p-6 shadow-[0_22px_60px_rgba(40,65,45,0.06)]">
              <SectionHeader
                icon={CheckCircle2}
                eyebrow="Travel reminders"
                title="Before you leave"
                description="Keep these important points in mind."
              />

              <div className="mt-6 space-y-4">
                {travelTips.map((tip) => (
                  <div key={tip} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#39734f]" />

                    <p className="text-sm leading-6 text-[#56665c]">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {additionalNotes && (
              <section className="rounded-[32px] border border-[#e1eadb] bg-white p-6 shadow-[0_22px_60px_rgba(40,65,45,0.06)]">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#718078]">
                  Your additional note
                </p>

                <p className="mt-3 leading-7 text-[#59675e]">
                  {additionalNotes}
                </p>
              </section>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

function NotificationToast({ notification, onClose }) {
  const isSuccess = notification.type === "success";

  return (
    <div className="fixed right-5 top-5 z-50 w-[calc(100%-40px)] max-w-md">
      <div
        className={`flex items-start gap-4 rounded-[22px] border p-5 shadow-[0_20px_60px_rgba(30,50,35,0.18)] ${
          isSuccess
            ? "border-[#bfd9b4] bg-[#f3faec]"
            : "border-red-200 bg-red-50"
        }`}
      >
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
            isSuccess
              ? "bg-[#173d2e] text-[#eaff9d]"
              : "bg-red-100 text-red-700"
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
            className={`font-black ${
              isSuccess ? "text-[#173d2e]" : "text-red-900"
            }`}
          >
            {notification.title}
          </p>

          <p
            className={`mt-1 text-sm leading-6 ${
              isSuccess ? "text-[#627067]" : "text-red-700"
            }`}
          >
            {notification.message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="rounded-lg p-1 text-[#758078] transition hover:bg-black/5"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
      <Icon className="h-5 w-5 text-[#eaff9d]" />

      <p className="mt-4 text-xs font-bold text-[#c8d7cc]">
        {label}
      </p>

      <p className="mt-1 font-black">{value}</p>
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
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf8d9] text-[#39734f]">
        <Icon className="h-6 w-6" />
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7d8a82]">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-2xl font-black">{title}</h2>

        <p className="mt-2 text-sm leading-6 text-[#6b776e]">
          {description}
        </p>
      </div>
    </div>
  );
}

function RecommendationCard({ icon: Icon, title, items }) {
  return (
    <article className="rounded-[26px] border border-[#e2eadc] bg-[#fbfdf9] p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#173d2e] text-[#eaff9d]">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-5 text-lg font-black">{title}</h3>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#568064]" />

            <p className="text-sm leading-6 text-[#66736b]">
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
    <div className="flex items-center justify-between border-b border-[#e8eee4] pb-4 last:border-b-0">
      <span className="font-bold text-[#66736b]">{label}</span>

      <span className="font-black text-[#173d2e]">
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

export default ResultPage;