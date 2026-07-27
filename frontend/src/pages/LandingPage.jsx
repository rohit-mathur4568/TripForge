import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getObfuscatedRoute } from "../utils/routeUtils";
import ChatBot from "../components/ChatBot";
import Footer from "../components/Footer";
import PlatformFeaturesShowcase from "../components/PlatformFeaturesShowcase";
import PremiumDashboardPreview from "../components/PremiumDashboardPreview";
import {
  ArrowRight,
  Globe2,
  Menu,
  UserCheck,
  LogIn,
  LogOut,
  X,
  Play,
  MapPin
} from "lucide-react";

const trendingDestinations = [
  { name: "Paris, France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80", span: "md:col-span-2 md:row-span-2" },
  { name: "Tokyo, Japan", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80", span: "md:col-span-1 md:row-span-1" },
  { name: "Bali, Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80", span: "md:col-span-1 md:row-span-1" },
  { name: "Rome, Italy", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80", span: "md:col-span-1 md:row-span-1" },
  { name: "Swiss Alps", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80", span: "md:col-span-1 md:row-span-1" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleStartPlanning = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
    } else {
      navigate(getObfuscatedRoute(user, "/create-trip"));
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden text-[#0a0a0a] dark:text-[#ededed] bg-[#fafafa] dark:bg-black font-sans selection:bg-[#173d2e] dark:selection:bg-teal-500/30 selection:text-white transition-colors duration-300">

      {/* Pristine Minimalist Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/70 dark:bg-black/50 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 transition-colors duration-300">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <Link to="/" className="flex items-center gap-2 group">
            <Globe2 className="h-6 w-6 text-[#173d2e] dark:text-teal-400" />
            <h1 className="text-xl font-black tracking-tight text-[#173d2e] dark:text-white">TripForge</h1>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold text-gray-600 dark:text-gray-300 lg:flex">
            <a className="transition hover:text-[#173d2e] dark:hover:text-teal-400" href="#platform">Platform</a>
            <a className="transition hover:text-[#173d2e] dark:hover:text-teal-400" href="#destinations">Destinations</a>
            
            {user && (
               <Link 
                 to={user.isAdmin ? "/admin" : getObfuscatedRoute(user, "/history")} 
                 className="transition hover:text-[#173d2e] dark:hover:text-teal-400"
               >
                 <PremiumDashboardPreview />
               </Link>
            )}

            {user ? (
              <div className="flex items-center gap-4 border-l border-gray-200 dark:border-white/10 pl-6">
                <div className="flex items-center gap-2 text-[#173d2e] dark:text-white">
                   <UserCheck className="w-4 h-4 text-[#173d2e] dark:text-teal-400" />
                   <span>{user.fullName || user.email}</span>
                </div>
                <button onClick={logout} title="Log out" className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition cursor-pointer">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 border-l border-gray-200 dark:border-white/10 pl-6">
                <Link to="/login" className="hover:text-[#173d2e] dark:hover:text-teal-400 font-semibold cursor-pointer transition">
                  Sign In
                </Link>
                <Link to="/register" className="flex items-center gap-2 rounded-lg bg-[#173d2e] dark:bg-white px-5 py-2.5 text-xs font-bold text-white dark:text-black shadow-sm hover:bg-[#0f281e] dark:hover:bg-gray-200 transition-all cursor-pointer">
                  Start Free
                </Link>
              </div>
            )}
          </div>

          <div className="lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-[#173d2e] dark:text-white p-2">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full h-[calc(100vh-73px)] bg-white dark:bg-black border-b border-gray-100 dark:border-white/10 py-8 px-6 flex flex-col gap-6 text-base font-bold text-[#173d2e] dark:text-white z-50">
            <a onClick={() => setIsMobileMenuOpen(false)} href="#platform" className="py-2 border-b border-gray-50 dark:border-white/5">Platform</a>
            <a onClick={() => setIsMobileMenuOpen(false)} href="#destinations" className="py-2 border-b border-gray-50 dark:border-white/5">Destinations</a>
            {user && (
               <Link onClick={() => setIsMobileMenuOpen(false)} to={user.isAdmin ? "/admin" : getObfuscatedRoute(user, "/history")} className="py-2 border-b border-gray-50 dark:border-white/5">Dashboard</Link>
            )}
            <div className="mt-auto pb-10">
               {!user ? (
                 <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full rounded-lg bg-[#173d2e] dark:bg-white px-5 py-4 text-center text-sm font-bold text-white dark:text-black flex items-center justify-center">
                   Start Free
                 </Link>
               ) : (
                 <button onClick={() => { setIsMobileMenuOpen(false); logout(); }} className="w-full rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-5 py-4 text-center text-sm font-bold border border-red-100 dark:border-red-900/50">
                   Log Out
                 </button>
               )}
            </div>
          </div>
        )}
      </header>

      {/* Cinematic SaaS Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 overflow-hidden bg-transparent">
        {/* Abstract Glowing Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#d9f99d]/30 dark:bg-teal-900/40 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-[#fef08a]/30 dark:bg-emerald-900/30 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 md:px-8 text-center flex flex-col items-center z-10">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-8 text-gray-600 dark:text-gray-300 text-xs font-bold tracking-widest uppercase shadow-sm backdrop-blur-sm">
            Introducing TripForge v2.0
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[85px] font-black tracking-tight leading-[1.05] text-[#0a0a0a] dark:text-white max-w-5xl mx-auto">
            Travel planning, <br className="hidden md:block" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#173d2e] to-[#39734f] dark:from-teal-300 dark:to-emerald-400">perfected for you.</span>
          </h1>
          
          <p className="mt-8 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Generate hyper-personalized, budget-optimized global itineraries in seconds. No more endless tabs.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
             <button 
               onClick={handleStartPlanning}
               className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-[#173d2e] dark:bg-white text-white dark:text-black px-8 py-4 rounded-lg font-bold text-base shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_0_40px_rgba(45,212,191,0.3)] hover:bg-[#0f281e] dark:hover:bg-gray-200 transition-all"
             >
               Start Planning Free
               <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
             </button>
             
             <a href="#platform" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-[#111] text-[#173d2e] dark:text-white px-8 py-4 rounded-lg font-bold text-base border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#222] transition-all shadow-sm">
               <Play className="w-4 h-4 text-[#173d2e] dark:text-teal-400" />
               See how it works
             </a>
          </div>

          {/* Social Proof Logos */}
          <div className="mt-24 pt-10 border-t border-gray-200 dark:border-white/10 w-full relative">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest mb-6">Trusted by modern travelers worldwide</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 dark:opacity-40 grayscale transition-opacity hover:grayscale-0 dark:hover:opacity-100 duration-500">
               {/* Mock Logos for SaaS feel */}
               <div className="flex items-center gap-2 text-xl font-black dark:text-white"><Globe2/> ACME Travel</div>
               <div className="flex items-center gap-2 text-xl font-black dark:text-white"><Menu/> GlobalTrek</div>
               <div className="flex items-center gap-2 text-xl font-black dark:text-white"><MapPin/> Wanderlust Inc</div>
               <div className="flex items-center gap-2 text-xl font-black dark:text-white"><Globe2/> Nimbus Routes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Bento Box Components */}
      <PlatformFeaturesShowcase />

      {/* Pristine Grid for Destinations */}
      <section id="destinations" className="py-24 bg-[#f8f8f8] dark:bg-[#050505] border-t border-gray-200 dark:border-white/10 transition-colors duration-300 relative">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-teal-500/50 to-transparent" />
         
         <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
            <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-4">
               <div>
                  <h2 className="text-3xl md:text-4xl font-black text-[#0a0a0a] dark:text-white tracking-tight">Curated Escapes</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Explore smart optimized routes for top global destinations.</p>
               </div>
               <button onClick={handleStartPlanning} className="text-[#173d2e] dark:text-teal-400 font-bold text-sm hover:underline flex items-center gap-1">
                  View all destinations <ArrowRight className="w-4 h-4" />
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
               {trendingDestinations.map((dest, i) => (
                   <div 
                     key={i} 
                     onClick={handleStartPlanning}
                     className={`relative rounded-2xl overflow-hidden cursor-pointer group bg-gray-200 dark:bg-[#111] dark:ring-1 dark:ring-white/10 ${dest.span}`}
                   >
                      <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      <div className="absolute bottom-6 left-6 right-6">
                         <div className="text-white text-xl md:text-2xl font-bold tracking-tight">{dest.name}</div>
                      </div>
                   </div>
               ))}
            </div>
         </div>
      </section>

      <ChatBot />

    </main>
  );
}