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
  UserRound,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000";

const travelImages = [
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80", // Paris
  "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80", // Machu Picchu
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80", // Bali
  "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80", // Rome
  "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80"  // Alps
];

function RegisterPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bgImage, setBgImage] = useState(travelImages[1]);

  // On mount, select a random image
  useState(() => {
    const randomIndex = Math.floor(Math.random() * travelImages.length);
    setBgImage(travelImages[randomIndex]);
  }, []);

  if (user) {
    if (user.isAdmin) return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (formData.name.trim().length < 2) {
      setErrorMessage("Name must contain at least 2 characters.");
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.detail || "Unable to register. Please try again."
        );
      }

      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error("Registration successful, but unable to sign in.");
      }

      // Use Context
      login(loginData.user, loginData.accessToken);

      if (loginData.user.email === "admin@tripforge.com") {
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-4 text-[#17211a]">
      <div className="pointer-events-none absolute left-[-100px] top-10 h-80 w-80 rounded-full bg-[#d9f99d]/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[-100px] h-80 w-80 rounded-full bg-[#fef08a]/55 blur-3xl" />

      <section className="relative grid w-full max-w-5xl overflow-hidden rounded-[36px] border border-white bg-white/90 shadow-[0_30px_90px_rgba(40,65,45,0.15)] backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative overflow-hidden p-6 text-white md:p-8 flex flex-col justify-between min-h-[400px]">
          <div 
             className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
             style={{ backgroundImage: `url(${bgImage})` }} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#091811]/90 via-[#091811]/40 to-[#091811]/20" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaff9d] text-[#173d2e] shadow-lg">
                <Globe2 className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-2xl font-black text-white shadow-sm">TripForge</h1>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#eaff9d]">
                  Smart Travel Planner
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-14">
            <h2 className="text-4xl font-black leading-tight md:text-5xl text-white">
              Start your journey today.
            </h2>
            <p className="mt-4 max-w-md leading-7 text-slate-300">
              Create an account to unlock hyper-personalized, multi-agent AI travel planning for free.
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#5d7a65]">
            Create account
          </p>

          <h2 className="mt-3 text-3xl font-black md:text-4xl">
            Register to continue
          </h2>

          <p className="mt-3 text-[#6b776e]">
            Enter your details to create a TripForge account.
          </p>

          {errorMessage && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <CircleAlert className="h-5 w-5 shrink-0" />
              <p className="text-sm font-bold">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                Full name
              </span>

              <div className="relative">
                <UserRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#78867d]" />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  minLength={2}
                  autoComplete="name"
                  className="w-full rounded-2xl border border-[#dce6d5] bg-[#fbfdf9] py-3 pl-12 pr-4 outline-none transition focus:border-[#679173] focus:ring-4 focus:ring-[#dff0d9]"
                  placeholder="Enter your full name"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                Email address
              </span>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#78867d]" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  autoComplete="email"
                  className="w-full rounded-2xl border border-[#dce6d5] bg-[#fbfdf9] py-3 pl-12 pr-4 outline-none transition focus:border-[#679173] focus:ring-4 focus:ring-[#dff0d9]"
                  placeholder="Enter your email"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                Password
              </span>

              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#78867d]" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-[#dce6d5] bg-[#fbfdf9] py-3 pl-12 pr-12 outline-none transition focus:border-[#679173] focus:ring-4 focus:ring-[#dff0d9]"
                  placeholder="Create a password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#65736a]"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                Confirm password
              </span>

              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#78867d]" />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-[#dce6d5] bg-[#fbfdf9] py-3 pl-12 pr-12 outline-none transition focus:border-[#679173] focus:ring-4 focus:ring-[#dff0d9]"
                  placeholder="Confirm your password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#65736a]"
                >
                  {showConfirmPassword ? (
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
              className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#173d2e] px-7 py-3 font-extrabold text-white shadow-lg shadow-green-950/15 transition hover:bg-[#20533f] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 border-t border-[#e4ebe0] pt-4 text-center">
            <p className="text-xs text-[#6b776e]">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="mt-3 inline-flex font-extrabold text-[#39734f] transition hover:text-[#173d2e]"
            >
              Sign in to your account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default RegisterPage;