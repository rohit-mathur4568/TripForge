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

function UserSignUpPage() {
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-2 bg-[#fafafa] dark:bg-black text-[#0a0a0a] transition-colors duration-300">
      <div className="pointer-events-none absolute left-[-100px] top-10 h-80 w-80 rounded-full bg-[#d9f99d]/60 dark:bg-teal-900/40 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-[-100px] h-80 w-80 rounded-full bg-[#fef08a]/55 dark:bg-emerald-900/30 blur-[120px]" />

      <section className="relative grid w-full max-w-[900px] overflow-hidden rounded-[32px] border border-gray-200 dark:border-white/10 dark:ring-1 dark:ring-white/5 bg-white/90 dark:bg-[#111]/80 shadow-[0_30px_90px_rgba(0,0,0,0.05)] dark:shadow-none backdrop-blur-xl md:grid-cols-[0.8fr_1.2fr]">
        <div className="relative overflow-hidden p-6 text-white flex flex-col justify-between hidden md:flex md:min-h-[480px]">
          <div 
             className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
             style={{ backgroundImage: `url(${bgImage})` }} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />

          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-black/50 border border-transparent dark:border-white/10 text-[#0a0a0a] dark:text-teal-400 shadow-lg backdrop-blur-md">
                <Globe2 className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white shadow-sm">TripForge</h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#eaff9d] dark:text-teal-400">
                  Smart Planner
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-black leading-tight text-white">
              Start your journey today.
            </h2>
            <p className="mt-2 text-sm leading-snug text-gray-300 max-w-[200px]">
              Unlock hyper-personalized smart travel planning.
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col justify-center">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500 dark:text-teal-400">
            Create account
          </p>

          <h2 className="mt-1.5 text-2xl font-black dark:text-white">
            Register to continue
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enter your details to create a TripForge account.
          </p>

          {errorMessage && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-3 text-red-700 dark:text-red-400">
              <CircleAlert className="h-4 w-4 shrink-0" />
              <p className="text-xs font-bold">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            <label className="block">
              <span className="mb-1.5 block text-xs font-extrabold dark:text-gray-300">
                Full name
              </span>
              <div className="relative">
                <UserRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  minLength={2}
                  autoComplete="name"
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#173d2e] dark:focus:border-teal-500 focus:ring-2 focus:ring-[#173d2e]/20 dark:focus:ring-teal-500/20 dark:text-white dark:placeholder-gray-600"
                  placeholder="Enter your full name"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-extrabold dark:text-gray-300">
                Email address
              </span>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#173d2e] dark:focus:border-teal-500 focus:ring-2 focus:ring-[#173d2e]/20 dark:focus:ring-teal-500/20 dark:text-white dark:placeholder-gray-600"
                  placeholder="Enter your email"
                />
              </div>
            </label>

            <div className="grid grid-cols-2 gap-3">
               <label className="block">
                 <span className="mb-1.5 block text-xs font-extrabold dark:text-gray-300">
                   Password
                 </span>
                 <div className="relative">
                   <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                   <input
                     type={showPassword ? "text" : "password"}
                     name="password"
                     value={formData.password}
                     onChange={handleInputChange}
                     required
                     minLength={8}
                     maxLength={72}
                     autoComplete="new-password"
                     className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-[#173d2e] dark:focus:border-teal-500 focus:ring-2 focus:ring-[#173d2e]/20 dark:focus:ring-teal-500/20 dark:text-white dark:placeholder-gray-600"
                     placeholder="Password"
                   />
                   <button
                     type="button"
                     onClick={() => setShowPassword((current) => !current)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                   >
                     {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                   </button>
                 </div>
               </label>
   
               <label className="block">
                 <span className="mb-1.5 block text-xs font-extrabold dark:text-gray-300">
                   Confirm password
                 </span>
                 <div className="relative">
                   <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                   <input
                     type={showConfirmPassword ? "text" : "password"}
                     name="confirmPassword"
                     value={formData.confirmPassword}
                     onChange={handleInputChange}
                     required
                     minLength={8}
                     maxLength={72}
                     autoComplete="new-password"
                     className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-[#173d2e] dark:focus:border-teal-500 focus:ring-2 focus:ring-[#173d2e]/20 dark:focus:ring-teal-500/20 dark:text-white dark:placeholder-gray-600"
                     placeholder="Confirm"
                   />
                   <button
                     type="button"
                     onClick={() => setShowConfirmPassword((current) => !current)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                   >
                     {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                   </button>
                 </div>
               </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a0a0a] dark:bg-white px-5 py-2.5 mt-2 text-sm font-extrabold text-white dark:text-black shadow-md transition hover:bg-[#222] dark:hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 border-t border-gray-200 dark:border-white/10 pt-3 text-center">
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Already have an account?
            </p>
            <Link
              to="/login"
              className="mt-1.5 inline-flex text-xs font-extrabold text-[#173d2e] dark:text-teal-400 transition hover:text-[#0a0a0a] dark:hover:text-white"
            >
              Sign in to your account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default UserSignUpPage;
