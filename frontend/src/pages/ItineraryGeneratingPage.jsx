import { useEffect, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router";
import { useAuth } from "../context/AuthContext";
import { getObfuscatedRoute } from "../utils/routeUtils";
import {
  Check,
  CircleAlert,
  CircleDollarSign,
  Compass,
  LoaderCircle,
  MapPin,
  Route,
} from "lucide-react";
import { generateTrip } from "../services/tripService";

const preparationSteps = [
  {
    icon: MapPin,
    title: "Reviewing your destination",
    description: "Understanding your route and preferences",
  },
  {
    icon: Compass,
    title: "Preparing travel suggestions",
    description: "Selecting suitable places and experiences",
  },
  {
    icon: CircleDollarSign,
    title: "Organising your budget",
    description: "Balancing stay, travel, food and activities",
  },
  {
    icon: Route,
    title: "Creating your daily plan",
    description: "Building a practical day-wise schedule",
  },
];

function ItineraryGeneratingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const tripData = location.state?.tripData;

  const [activeStep, setActiveStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!tripData) {
      return undefined;
    }

    let stepInterval;
    let navigationTimeout;
    let isCancelled = false;

    async function prepareJourney() {
      stepInterval = window.setInterval(() => {
        setActiveStep((currentStep) => {
          if (currentStep >= preparationSteps.length - 1) {
            return currentStep;
          }

          return currentStep + 1;
        });
      }, 900);

      try {
        const generatedTrip = await generateTrip(tripData);

        if (isCancelled) {
          return;
        }

        window.clearInterval(stepInterval);
        setActiveStep(preparationSteps.length);

        navigationTimeout = window.setTimeout(() => {
          navigate(getObfuscatedRoute(user, "/result"), {
            replace: true,
            state: {
              generatedTrip,
            },
          });
        }, 700);
      } catch (error) {
        window.clearInterval(stepInterval);

        if (!isCancelled) {
          setErrorMessage(error.message);
        }
      }
    }

    prepareJourney();

    return () => {
      isCancelled = true;
      window.clearInterval(stepInterval);
      window.clearTimeout(navigationTimeout);
    };
  }, [navigate, tripData]);

  if (!tripData) {
    return <Navigate to={getObfuscatedRoute(user, "/create-trip")} replace />;
  }

  const completedSteps = Math.min(
    activeStep,
    preparationSteps.length
  );

  const progress =
    (completedSteps / preparationSteps.length) * 100;

  function tryAgain() {
    navigate(getObfuscatedRoute(user, "/create-trip"), {
      replace: true,
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10 text-[#17211a] md:px-8">
      <section className="w-full max-w-4xl overflow-hidden rounded-[34px] border border-[#e1eadb] bg-white shadow-[0_30px_80px_rgba(40,65,45,0.12)]">
        <div className="bg-[#173d2e] px-7 py-9 text-white md:px-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#c9d9cd]">
                Preparing your journey
              </p>

              <h1 className="mt-3 text-3xl font-black md:text-4xl">
                {tripData.source} to {tripData.destination}
              </h1>

              <p className="mt-3 text-[#d8e3da]">
                Please wait while your complete travel plan is being
                prepared.
              </p>
            </div>

            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl ${
                errorMessage
                  ? "bg-red-100 text-red-700"
                  : "bg-[#eaff9d] text-[#173d2e]"
              }`}
            >
              {errorMessage ? (
                <CircleAlert className="h-8 w-8" />
              ) : activeStep >= preparationSteps.length ? (
                <Check className="h-8 w-8" />
              ) : (
                <LoaderCircle className="h-8 w-8 animate-spin" />
              )}
            </div>
          </div>

          <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-[#eaff9d] transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-3 text-right text-sm font-bold text-[#d8e3da]">
            {Math.round(progress)}% complete
          </p>
        </div>

        <div className="space-y-3 p-6 md:p-9">
          {errorMessage ? (
            <div className="rounded-[26px] border border-red-200 bg-red-50 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                  <CircleAlert className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-black text-red-900">
                    Journey preparation failed
                  </h2>

                  <p className="mt-2 leading-7 text-red-700">
                    {errorMessage}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={tryAgain}
                className="mt-5 rounded-full bg-[#173d2e] px-6 py-3 font-extrabold text-white transition hover:bg-[#20533f]"
              >
                Return to journey form
              </button>
            </div>
          ) : (
            preparationSteps.map(
              ({ icon: Icon, title, description }, index) => {
                const completed =
                  activeStep > index ||
                  activeStep >= preparationSteps.length;

                const active =
                  activeStep === index &&
                  activeStep < preparationSteps.length;

                return (
                  <article
                    key={title}
                    className={`flex items-center gap-4 rounded-2xl border p-5 transition ${
                      active
                        ? "border-[#a8c49d] bg-[#f0f8e7]"
                        : completed
                        ? "border-[#dce8d6] bg-[#f9fcf7]"
                        : "border-[#e7ede3] bg-white"
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                        completed
                          ? "bg-[#173d2e] text-white"
                          : active
                          ? "bg-[#eaff9d] text-[#173d2e]"
                          : "bg-[#f0f3ee] text-[#8b978f]"
                      }`}
                    >
                      {completed ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-black">{title}</p>
                      <p className="mt-1 text-sm text-[#6e7a72]">
                        {description}
                      </p>
                    </div>

                    {active && (
                      <LoaderCircle className="h-5 w-5 animate-spin text-[#39734f]" />
                    )}
                  </article>
                );
              }
            )
          )}

          {!errorMessage && (
            <p className="pt-3 text-center text-sm font-semibold text-[#748078]">
              Keep this page open while your journey is being prepared.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default ItineraryGeneratingPage;
