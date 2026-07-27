import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  Compass,
  LoaderCircle,
  MapPin,
  Trash2,
  Users,
} from "lucide-react";

import {
  deleteSavedTrip,
  getSavedTrips,
} from "../services/tripService";

function HistoryPage() {
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

  return (
    <main className="min-h-screen px-5 py-8 text-[#17211a] md:px-8 md:py-10">
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
            to="/create-trip"
            className="rounded-full bg-[#173d2e] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#20533f]"
          >
            Plan new journey
          </Link>
        </div>

        <section className="mt-7 rounded-[34px] bg-[#173d2e] px-7 py-9 text-white shadow-[0_30px_80px_rgba(40,65,45,0.15)] md:px-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#c9d9cd]">
            Your saved journeys
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            Travel plans ready whenever you need them.
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-[#d8e3da]">
            Review your previously saved journeys and manage the plans you no
            longer need.
          </p>
        </section>

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
                Loading saved journeys...
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
              to="/create-trip"
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
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

function TripCard({ trip, isDeleting, onDelete }) {
  const summary = trip.summary || {};

  return (
    <article className="overflow-hidden rounded-[30px] border border-[#e1eadb] bg-white shadow-[0_20px_55px_rgba(40,65,45,0.08)]">
      <div className="bg-[#173d2e] p-6 text-white">
        <p className="text-sm font-semibold text-[#cbd9cf]">
          Saved journey
        </p>

        <h2 className="mt-2 text-2xl font-black">
          {summary.source} to {summary.destination}
        </h2>

        <p className="mt-3 text-sm text-[#d8e3da]">
          Saved on {formatDate(trip.createdAt)}
        </p>
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

        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-3 font-extrabold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Delete journey
            </>
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