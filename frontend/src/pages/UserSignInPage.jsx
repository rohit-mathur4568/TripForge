import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
  ArrowRight,
  CircleAlert,
  Eye,
  EyeOff,
  Globe2,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserPlus,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000";

const travelImages = [
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80", // Paris
  "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80", // Machu Picchu
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80", // Bali
  "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80", // Rome
  "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80"  // Alps
];

function UserSignInPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [email, setEmail] = useState("rohit@tripforge.com");
  const [password, setPassword] = useState("TripForge@123");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bgImage, setBgImage] = useState(travelImages[0]);

  // On mount, select a random image
  useState(() => {
    const randomIndex = Math.floor(Math.random() * travelImages.length);
    setBgImage(travelImages[randomIndex]);
  }, []);

  if (user) {
    if (user.isAdmin) return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.detail || "Unable to sign in. Please try again."
        );
      }

      // Use Context
      login(responseData.user, responseData.accessToken);

      if (responseData.user.email === "admin@tripforge.com") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-4 bg-[#fafafa] dark:bg-black text-[#0a0a0a] transition-colors duration-300">
      <div className="pointer-events-none absolute left-[-100px] top-10 h-80 w-80 rounded-full bg-[#d9f99d]/60 dark:bg-teal-900/40 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-[-100px] h-80 w-80 rounded-full bg-[#fef08a]/55 dark:bg-emerald-900/30 blur-[120px]" />

      <section className="relative grid w-full max-w-[900px] overflow-hidden rounded-[32px] border border-gray-200 dark:border-white/10 dark:ring-1 dark:ring-white/5 bg-white/90 dark:bg-[#111]/80 shadow-[0_30px_90px_rgba(0,0,0,0.05)] dark:shadow-none backdrop-blur-xl md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative overflow-hidden p-8 text-white flex flex-col justify-between hidden md:flex md:min-h-[480px]">
          <div 
             className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
             style={{ backgroundImage: `url(${bgImage})` }} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-black/50 border border-transparent dark:border-white/10 text-[#0a0a0a] dark:text-teal-400 shadow-lg backdrop-blur-md">
                <Globe2 className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-2xl font-black text-white shadow-sm">TripForge</h1>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#eaff9d] dark:text-teal-400">
                  Smart Travel Planner
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-14">
            <h2 className="text-4xl font-black leading-tight text-white">
              Welcome back to your journey planner.
            </h2>
            <p className="mt-4 max-w-md leading-7 text-gray-300">
              Sign in to prepare personalised travel plans and manage your
              saved journeys.
            </p>
          </div>
        </div>

        <div className="p-6 md:p-10 flex flex-col justify-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-500 dark:text-teal-400">
            Secure access
          </p>

          <h2 className="mt-2 text-3xl font-black md:text-4xl dark:text-white">
            Sign in to continue
          </h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter your registered account details.
          </p>

          {errorMessage && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-3.5 text-red-700 dark:text-red-400">
              <CircleAlert className="h-5 w-5 shrink-0" />
              <p className="text-sm font-bold">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold dark:text-gray-300">
                Email address
              </span>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-[#173d2e] dark:focus:border-teal-500 focus:ring-2 focus:ring-[#173d2e]/20 dark:focus:ring-teal-500/20 dark:text-white dark:placeholder-gray-600"
                  placeholder="Enter your email"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold dark:text-gray-300">
                Password
              </span>

              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black py-3.5 pl-12 pr-12 text-sm outline-none transition focus:border-[#173d2e] dark:focus:border-teal-500 focus:ring-2 focus:ring-[#173d2e]/20 dark:focus:ring-teal-500/20 dark:text-white dark:placeholder-gray-600"
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#0a0a0a] dark:bg-white px-7 py-3.5 font-extrabold text-white dark:text-black shadow-lg transition hover:bg-[#222] dark:hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70 mt-2"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-gray-200 dark:border-white/10 pt-5 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Do not have an account?
            </p>

            <Link
              to="/register"
              className="mt-2 inline-flex items-center gap-2 font-extrabold text-[#173d2e] dark:text-teal-400 transition hover:text-[#0a0a0a] dark:hover:text-white"
            >
              <UserPlus className="h-4 w-4" />
              Create an account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default UserSignInPage;
