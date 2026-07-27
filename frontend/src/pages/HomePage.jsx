import { Link } from "react-router";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Compass,
  Globe2,
  MapPin,
  Menu,
  Route,
  Sparkles,
  Users,
} from "lucide-react";

const featureCards = [
  {
    icon: Compass,
    title: "Personalised Journey",
    description:
      "Receive a complete travel plan based on your destination, dates, budget and interests.",
  },
  {
    icon: CircleDollarSign,
    title: "Smart Budget Planning",
    description:
      "Get a clear estimated breakdown for transport, accommodation, food and activities.",
  },
  {
    icon: CalendarDays,
    title: "Day-wise Itinerary",
    description:
      "Follow a well-organised daily schedule designed around your travel preferences.",
  },
];

const journeyServices = [
  {
    icon: Compass,
    title: "Journey Planner",
    description: "Ready to prepare your route",
    statusColor: "bg-[#f6c945]",
  },
  {
    icon: CircleDollarSign,
    title: "Budget Planner",
    description: "Ready to optimise costs",
    statusColor: "bg-[#77a982]",
  },
  {
    icon: Route,
    title: "Itinerary Builder",
    description: "Ready to organise your days",
    statusColor: "bg-[#77a982]",
  },
];

function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden text-[#17211a]">
      <header className="relative z-20 border-b border-[#dfe8d8]/80 bg-white/75 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#163c2d] shadow-lg shadow-green-900/10">
              <Globe2 className="h-6 w-6 text-[#eaff9d]" />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight">
                TripForge
              </h1>

              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6d7d71]">
                Smart Travel Planner
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold text-[#58665c] md:flex">
            <a
              className="transition hover:text-[#163c2d]"
              href="#features"
            >
              Features
            </a>

            <a
              className="transition hover:text-[#163c2d]"
              href="#how-it-works"
            >
              How it works
            </a>

            <Link
              to="/history"
              className="rounded-full border border-[#dce6d5] bg-white px-5 py-2.5 transition hover:border-[#b8ccac] hover:bg-[#f7faf4]"
            >
              Saved trips
            </Link>
          </div>

          <Link
            to="/history"
            aria-label="Open saved journeys"
            className="rounded-xl border border-[#dce6d5] bg-white p-2.5 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Link>
        </nav>
      </header>

      <section className="relative">
        <div className="pointer-events-none absolute left-[-100px] top-20 h-72 w-72 rounded-full bg-[#d9f99d]/55 blur-3xl" />

        <div className="pointer-events-none absolute right-[-80px] top-10 h-72 w-72 rounded-full bg-[#fef08a]/45 blur-3xl" />

        <div className="relative mx-auto grid min-h-[82vh] max-w-7xl items-center gap-14 px-5 py-16 md:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:py-20">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d7e7c9] bg-white/80 px-4 py-2 text-sm font-bold text-[#315c45] shadow-sm">
              <Sparkles className="h-4 w-4 text-[#d29d00]" />
              Personalised travel planning made simple
            </div>

            <h2 className="max-w-3xl text-5xl font-black leading-[1.06] tracking-[-0.045em] text-[#17211a] md:text-7xl">
              Plan less.

              <span className="block text-[#39734f]">
                Experience more.
              </span>
            </h2>

            <p className="mt-7 max-w-xl text-lg leading-8 text-[#637068]">
              Create a personalised trip with a complete itinerary, budget
              breakdown, accommodation suggestions and helpful travel
              guidance.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/create-trip"
                className="group flex items-center gap-3 rounded-full bg-[#173d2e] px-7 py-4 font-bold text-white shadow-xl shadow-green-950/15 transition duration-300 hover:-translate-y-1 hover:bg-[#20533f]"
              >
                Start planning

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eaff9d] text-[#173d2e]">
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>

              <Link
                to="/history"
                className="rounded-full border border-[#cfddc7] bg-white/85 px-7 py-4 font-bold text-[#34443a] shadow-sm transition hover:bg-white"
              >
                View saved trips
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-[#66746b]">
              {[
                "Personalised plans",
                "Budget optimisation",
                "Saved trip history",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#4f8b62]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[48px] bg-gradient-to-br from-[#d9f99d]/60 via-white to-[#fef08a]/55 blur-2xl" />

            <div className="relative overflow-hidden rounded-[36px] border border-white bg-white/85 p-4 shadow-[0_30px_80px_rgba(42,70,48,0.14)] backdrop-blur-xl">
              <div className="rounded-[28px] bg-[#173d2e] p-6 text-white md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[#cbd9cf]">
                      Your next adventure
                    </p>

                    <h3 className="mt-2 text-3xl font-black">
                      Delhi to Goa
                    </h3>
                  </div>

                  <div className="shrink-0 rounded-full bg-[#eaff9d] px-4 py-2 text-xs font-black uppercase tracking-wide text-[#173d2e]">
                    Journey ready
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <TripDetail
                    icon={CalendarDays}
                    label="Duration"
                    value="5 Days"
                  />

                  <TripDetail
                    icon={Users}
                    label="Travellers"
                    value="2 People"
                  />

                  <TripDetail
                    icon={CircleDollarSign}
                    label="Budget"
                    value="₹40,000"
                  />

                  <TripDetail
                    icon={Compass}
                    label="Style"
                    value="Relaxing"
                  />
                </div>

                <div className="mt-5 rounded-3xl bg-white/10 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f8df58] text-[#173d2e]">
                      <MapPin className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm text-[#cbd9cf]">
                        Suggested route
                      </p>

                      <p className="font-bold">
                        Beaches · Forts · Local markets
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 p-3 pt-4 sm:grid-cols-3">
                {journeyServices.map(
                  ({
                    icon: Icon,
                    title,
                    description,
                    statusColor,
                  }) => (
                    <article
                      key={title}
                      className="rounded-2xl border border-[#e2eadc] bg-[#f8fbf5] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <Icon className="h-5 w-5 text-[#39734f]" />

                        <span
                          className={`h-2.5 w-2.5 rounded-full ${statusColor}`}
                        />
                      </div>

                      <p className="mt-4 text-sm font-extrabold">
                        {title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#778179]">
                        {description}
                      </p>
                    </article>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto max-w-7xl px-5 pb-20 md:px-8"
      >
        <div className="grid gap-5 md:grid-cols-3">
          {featureCards.map(
            ({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-[28px] border border-[#e1eadb] bg-white/80 p-7 shadow-[0_15px_45px_rgba(40,65,45,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(40,65,45,0.11)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf8d9] text-[#39734f]">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-6 text-xl font-black">
                  {title}
                </h3>

                <p className="mt-3 leading-7 text-[#6b776e]">
                  {description}
                </p>
              </article>
            )
          )}
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-y border-[#e2eadc] bg-white/55"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#4f765d]">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
              A complete journey in three simple steps
            </h2>

            <p className="mt-5 leading-7 text-[#6b776e]">
              Share your travel preferences and receive a complete plan
              designed around your time, budget and interests.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Share your preferences",
                description:
                  "Enter your destination, dates, travellers, budget and interests.",
              },
              {
                number: "02",
                title: "Review your journey",
                description:
                  "Your route, estimated budget and daily itinerary are carefully prepared.",
              },
              {
                number: "03",
                title: "Save and explore",
                description:
                  "Review your complete journey and save it for future reference.",
              },
            ].map(({ number, title, description }) => (
              <article
                key={number}
                className="rounded-[28px] border border-[#e1eadb] bg-white p-7 shadow-[0_15px_45px_rgba(40,65,45,0.06)]"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8df58] text-sm font-black text-[#173d2e]">
                  {number}
                </span>

                <h3 className="mt-6 text-xl font-black">
                  {title}
                </h3>

                <p className="mt-3 leading-7 text-[#6b776e]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function TripDetail({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <Icon className="h-5 w-5 text-[#eaff9d]" />

      <p className="mt-4 text-xs font-medium text-[#cbd9cf]">
        {label}
      </p>

      <p className="mt-1 font-extrabold">{value}</p>
    </div>
  );
}

export default HomePage;