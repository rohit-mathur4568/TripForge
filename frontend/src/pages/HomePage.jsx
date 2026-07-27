import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import ChatBot from "../components/ChatBot";
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
  UserCheck,
  LogIn,
  LogOut,
  Star,
  Lock,
  X,
} from "lucide-react";

const featureCards = [
  {
    icon: Compass,
    title: "Personalised Multi-Agent Journey",
    description:
      "Receive an intelligent, automated travel plan based on your destination, dates, budget and interests with live weather & maps.",
  },
  {
    icon: CircleDollarSign,
    title: "Smart Budget Planning",
    description:
      "Get a clear estimated breakdown for transport, accommodation, food and activities with currency optimization.",
  },
  {
    icon: CalendarDays,
    title: "Interactive Day-wise Itinerary",
    description:
      "Follow an interactive map-enabled daily schedule designed around your travel style with 1-click calendar export.",
  },
];

const trendingDestinations = [
  {
    name: "Paris, France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
    tag: "Romantic & Cultural",
    rating: "4.9"
  },
  {
    name: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    tag: "Modern & Historic",
    rating: "4.95"
  },
  {
    name: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
    tag: "Tropical Paradise",
    rating: "4.88"
  },
  {
    name: "Rome, Italy",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80",
    tag: "Ancient Wonder",
    rating: "4.92"
  }
];

const journeyServices = [
  {
    icon: Compass,
    title: "Supervisor Agent",
    description: "Orchestrating multi-agent workflows",
    statusColor: "bg-[#f6c945]",
  },
  {
    icon: CircleDollarSign,
    title: "Budget Optimization Agent",
    description: "Maximizing travel cost efficiency",
    statusColor: "bg-[#77a982]",
  },
  {
    icon: Route,
    title: "Itinerary Geo Agent",
    description: "Structuring routes & map waypoints",
    statusColor: "bg-[#77a982]",
  },
];

function HomePage() {
  const navigate = useNavigate();
  const { user, logout, openAuthModal } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleStartPlanning = (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal("login");
    } else {
      navigate("/create-trip");
    }
  };

  return (
    <main className="min-h-screen overflow-hidden text-[#17211a] bg-[#fbfdf9]">
      <AuthModal />

      <header className="relative z-20 border-b border-[#dfe8d8]/80 bg-white/85 backdrop-blur-xl sticky top-0">
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
                Professional AI Planner
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold text-[#58665c] lg:flex">
            <a className="transition hover:text-[#163c2d]" href="#features">
              Features
            </a>

            <a className="transition hover:text-[#163c2d]" href="#destinations">
              Destinations
            </a>

            <a className="transition hover:text-[#163c2d]" href="#how-it-works">
              How it works
            </a>

            <Link
              to="/history"
              className="rounded-full border border-[#dce6d5] bg-white px-5 py-2.5 transition hover:border-[#b8ccac] hover:bg-[#f7faf4]"
            >
              Saved trips
            </Link>

            {user ? (
              <div className="flex items-center gap-3 bg-[#e8f5e5] px-4 py-2 rounded-full border border-[#c4e0be]">
                <UserCheck className="w-4 h-4 text-[#163c2d]" />
                <span className="text-xs font-bold text-[#163c2d]">
                  {user.fullName || user.email}
                </span>
                <button
                  onClick={logout}
                  title="Log out"
                  className="text-slate-500 hover:text-red-600 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openAuthModal("login")}
                  className="text-sm font-bold text-[#163c2d] hover:underline cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal("signup")}
                  className="flex items-center gap-2 rounded-full bg-[#163c2d] px-5 py-2.5 text-xs font-bold text-[#eaff9d] shadow-md transition hover:bg-[#20533f] cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" /> Register
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {user ? (
              <button onClick={logout} className="p-2 text-slate-600">
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={() => openAuthModal("login")} className="p-2 text-[#163c2d]">
                <LogIn className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              className="rounded-xl border border-[#dce6d5] bg-white p-2.5 cursor-pointer transition hover:bg-slate-50"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-[#dfe8d8] shadow-lg lg:hidden py-4 px-5 flex flex-col gap-4 text-sm font-semibold text-[#58665c] z-50">
            <a onClick={() => setIsMobileMenuOpen(false)} className="py-2 transition hover:text-[#163c2d]" href="#features">Features</a>
            <a onClick={() => setIsMobileMenuOpen(false)} className="py-2 transition hover:text-[#163c2d]" href="#destinations">Destinations</a>
            <a onClick={() => setIsMobileMenuOpen(false)} className="py-2 transition hover:text-[#163c2d]" href="#how-it-works">How it works</a>
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/history" className="py-2 transition hover:text-[#163c2d]">Saved trips</Link>
            
            {!user && (
               <button onClick={() => { setIsMobileMenuOpen(false); openAuthModal("signup"); }} className="mt-2 w-full rounded-full bg-[#163c2d] px-5 py-3 text-center text-xs font-bold text-[#eaff9d] shadow-md transition hover:bg-[#20533f]">
                 Register Now
               </button>
            )}
          </div>
        )}
      </header>

      <section className="relative">
        <div className="pointer-events-none absolute left-[-100px] top-20 h-72 w-72 rounded-full bg-[#d9f99d]/55 blur-3xl" />
        <div className="pointer-events-none absolute right-[-80px] top-10 h-72 w-72 rounded-full bg-[#fef08a]/45 blur-3xl" />

        <div className="relative mx-auto grid min-h-[82vh] max-w-7xl items-center gap-14 px-5 py-16 md:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:py-20">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d7e7c9] bg-white/80 px-4 py-2 text-sm font-bold text-[#315c45] shadow-sm">
              <Sparkles className="h-4 w-4 text-[#d29d00]" />
              Multi-Agent AI & Custom Interactive Maps
            </div>

            <h2 className="max-w-3xl text-5xl font-black leading-[1.06] tracking-[-0.045em] text-[#17211a] md:text-7xl">
              Plan less.

              <span className="block text-[#39734f]">
                Experience global journeys.
              </span>
            </h2>

            <p className="mt-7 max-w-xl text-lg leading-8 text-[#637068]">
              Create a personalized journey with specialized multi-agent AI, interactive Leaflet route maps, calendar exports, accommodation suggestions, and curated high-resolution photography.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button
                onClick={handleStartPlanning}
                className="group flex items-center gap-3 rounded-full bg-[#173d2e] px-7 py-4 font-bold text-white shadow-xl shadow-green-950/15 transition duration-300 hover:-translate-y-1 hover:bg-[#20533f] cursor-pointer"
              >
                Start planning

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eaff9d] text-[#173d2e]">
                  {user ? (
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </span>
              </button>

              <Link
                to="/history"
                className="rounded-full border border-[#cfddc7] bg-white/85 px-7 py-4 font-bold text-[#34443a] shadow-sm transition hover:bg-white"
              >
                View saved trips
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-[#66746b]">
              {[
                "Protected User Accounts",
                "Interactive Waypoint Maps",
                "1-Click Calendar Sync (.ics)",
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
              <div className="relative rounded-[28px] overflow-hidden bg-[#173d2e] p-6 text-white md:p-8">
                <div
                  className="absolute inset-0 opacity-25 bg-cover bg-center pointer-events-none"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80')`
                  }}
                />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-[#cbd9cf]">
                        Featured AI Journey
                      </p>

                      <h3 className="mt-2 text-3xl font-black">
                        London to Paris
                      </h3>
                    </div>

                    <div className="shrink-0 rounded-full bg-[#eaff9d] px-4 py-2 text-xs font-black uppercase tracking-wide text-[#173d2e]">
                      AI Verified Route
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-3">
                    <TripDetail
                      icon={CalendarDays}
                      label="Duration"
                      value="7 Days"
                    />

                    <TripDetail
                      icon={Users}
                      label="Travellers"
                      value="2 Adults"
                    />

                    <TripDetail
                      icon={CircleDollarSign}
                      label="Est. Budget"
                      value="$2,400"
                    />

                    <TripDetail
                      icon={Compass}
                      label="Travel Style"
                      value="Cultural Luxury"
                    />
                  </div>

                  <div className="mt-5 rounded-3xl bg-white/10 p-5 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f8df58] text-[#173d2e]">
                        <MapPin className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm text-[#cbd9cf]">
                          Multi-Agent Route
                        </p>

                        <p className="font-bold">
                          Eiffel Tower · Louvre · Champs-Élysées
                        </p>
                      </div>
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

      {/* Trending Destinations Section */}
      <section id="destinations" className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#4f765d]">
            World Exploration
          </p>
          <h3 className="text-3xl md:text-4xl font-black mt-2">
            Trending Destinations Planned by TripForge
          </h3>
          <p className="text-slate-600 mt-2 text-sm">
            Discover curated global destinations powered with real-time location insights and multi-agent recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingDestinations.map((dest) => (
            <div
              key={dest.name}
              className="group relative overflow-hidden rounded-3xl border border-[#e1eadb] bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="h-52 w-full overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    {dest.tag}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{dest.rating}</span>
                  </div>
                </div>
                <h4 className="text-xl font-black mt-3 text-slate-800">{dest.name}</h4>
                <button
                  onClick={handleStartPlanning}
                  className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#163c2d] hover:underline cursor-pointer"
                >
                  Plan this trip <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="features"
        className="mx-auto max-w-7xl px-5 py-16 md:px-8"
      >
        <div className="grid gap-5 md:grid-cols-3">
          {featureCards.map(
            ({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-[28px] border border-[#e1eadb] bg-white p-7 shadow-[0_15px_45px_rgba(40,65,45,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(40,65,45,0.11)]"
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
                title: "Register & Authenticate",
                description:
                  "Sign in to your personal account to ensure secure itinerary generation & saving.",
              },
              {
                number: "02",
                title: "Multi-Agent Synthesis",
                description:
                  "Our specialized agents construct your interactive route map, optimized daily itinerary, and budget breakdown.",
              },
              {
                number: "03",
                title: "Save, Sync & Explore",
                description:
                  "Sync your trip to Google Calendar or export to .ics while keeping your saved journeys secure in your account.",
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

      <ChatBot />
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