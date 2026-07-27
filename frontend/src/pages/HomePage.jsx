import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getObfuscatedRoute } from "../utils/routeUtils";
import AuthModal from "../components/AuthModal";
import ChatBot from "../components/ChatBot";
import WhyTripForge from "../components/WhyTripForge";
import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  Compass,
  Globe2,
  MapPin,
  Menu,
  Sparkles,
  UserCheck,
  LogIn,
  LogOut,
  X,
  Play,
  ArrowUpRight
} from "lucide-react";

const trendingDestinations = [
  { name: "Paris, France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80", tag: "Romantic" },
  { name: "Tokyo, Japan", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80", tag: "Modern" },
  { name: "Bali, Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80", tag: "Tropical" },
  { name: "Rome, Italy", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80", tag: "Historic" },
  { name: "Swiss Alps", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80", tag: "Adventure" },
  { name: "Kyoto, Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80", tag: "Cultural" }
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout, openAuthModal } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState(null);

  const handleStartPlanning = (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal("login");
    } else {
      navigate(getObfuscatedRoute(user, "/create-trip"));
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden text-[#17211a] bg-[#fbfdf9] font-sans selection:bg-[#eaff9d] selection:text-[#173d2e]">
      <AuthModal />

      {/* Bright & Airy Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-[#e1eadb] transition-all">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173d2e] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-emerald-900/10">
              <Globe2 className="h-5 w-5 text-[#eaff9d]" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-[#173d2e]">TripForge</h1>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-bold text-[#637068] lg:flex">
            <a className="transition hover:text-[#173d2e]" href="#features">Platform</a>
            <a className="transition hover:text-[#173d2e]" href="#destinations">Destinations</a>
            
            {user && (
               <Link to={getObfuscatedRoute(user, "/history")} className="transition hover:text-[#173d2e]">
                 My Dashboard
               </Link>
            )}

            {user ? (
              <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                <div className="flex items-center gap-2">
                   <UserCheck className="w-4 h-4 text-[#173d2e]" />
                   <span className="text-[#173d2e]">{user.fullName || user.email}</span>
                </div>
                <button onClick={logout} title="Log out" className="text-slate-400 hover:text-red-500 transition cursor-pointer">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                <button onClick={() => openAuthModal("login")} className="hover:text-[#173d2e] cursor-pointer transition">
                  Sign In
                </button>
                <button onClick={() => openAuthModal("signup")} className="flex items-center gap-2 rounded-full bg-[#173d2e] px-5 py-2.5 text-xs font-black text-white shadow-md hover:bg-[#20533f] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                  <LogIn className="w-3.5 h-3.5 text-[#eaff9d]" /> Start Free
                </button>
              </div>
            )}
          </div>

          <div className="lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-[#173d2e] p-2">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-[#e1eadb] py-5 px-5 flex flex-col gap-5 text-sm font-bold text-[#173d2e] z-50 shadow-2xl">
            <a onClick={() => setIsMobileMenuOpen(false)} href="#features">Platform</a>
            <a onClick={() => setIsMobileMenuOpen(false)} href="#destinations">Destinations</a>
            {user && (
               <Link onClick={() => setIsMobileMenuOpen(false)} to={getObfuscatedRoute(user, "/history")}>My Dashboard</Link>
            )}
            {!user ? (
               <button onClick={() => { setIsMobileMenuOpen(false); openAuthModal("signup"); }} className="mt-2 w-full rounded-full bg-[#173d2e] px-5 py-3 text-center text-xs font-black text-white">
                 Start Free
               </button>
            ) : (
               <button onClick={() => { setIsMobileMenuOpen(false); logout(); }} className="mt-2 w-full rounded-full bg-red-50 text-red-600 px-5 py-3 text-center text-xs font-black border border-red-100">
                 Log Out
               </button>
            )}
          </div>
        )}
      </header>

      {/* Bright, Airy Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-[#eef7f1]">
        {/* Subtle Background Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#d9f99d] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-200 rounded-full mix-blend-multiply filter blur-[150px] opacity-20 pointer-events-none" />
        
        <div className="relative mx-auto max-w-7xl px-5 md:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div className="z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-6 text-emerald-800 shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-bold tracking-wide uppercase">AI Travel Planner</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-black tracking-tighter leading-[1.05] text-[#17211a] mb-6">
              Plan less.<br/><span className="text-[#39734f]">Explore more.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#637068] max-w-lg mb-10 leading-relaxed font-medium">
              Create hyper-personalized, budget-optimized global journeys in seconds using our advanced multi-agent AI engine.
            </p>
            
            <div className="flex flex-wrap items-center gap-5">
              <button 
                onClick={handleStartPlanning}
                className="group flex items-center gap-3 bg-[#173d2e] text-white px-8 py-4 rounded-full font-black text-lg shadow-[0_15px_30px_rgba(23,61,46,0.15)] hover:shadow-[0_20px_40px_rgba(23,61,46,0.25)] hover:-translate-y-1 transition-all duration-300"
              >
                {user ? "Enter Dashboard" : "Start Planning"}
                <div className="w-8 h-8 rounded-full bg-[#eaff9d] text-[#173d2e] flex items-center justify-center transition-transform group-hover:scale-110">
                   <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>

          {/* Staggered Travel Collage */}
          <div className="relative z-10 h-[500px] hidden lg:block">
             {/* Main Image */}
             <div className="absolute top-0 right-0 w-[350px] h-[450px] rounded-[32px] overflow-hidden shadow-2xl border-8 border-white z-20 transition-transform duration-700 hover:scale-[1.02] hover:-rotate-1">
                <img src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80" alt="Paris" className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#eaff9d] rounded-full flex items-center justify-center text-[#173d2e]">
                         <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                         <div className="text-sm font-black text-[#17211a]">Paris, France</div>
                         <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">AI Curated</div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Secondary Image */}
             <div className="absolute bottom-0 left-0 w-[280px] h-[350px] rounded-[32px] overflow-hidden shadow-2xl border-8 border-white z-10 transition-transform duration-700 hover:scale-[1.02] hover:rotate-2">
                <img src="https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=600&q=80" alt="Machu Picchu" className="w-full h-full object-cover" />
             </div>
          </div>
        </div>
      </section>

      {/* Framer-Style Feature Cards Section */}
      <section id="features" className="py-24 bg-white border-y border-[#e1eadb]/60 relative">
        <div className="text-center max-w-2xl mx-auto mb-16 px-5">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#4f765d]">Smart Capabilities</p>
          <h2 className="mt-4 text-4xl md:text-5xl font-black text-[#17211a] tracking-tight">Powerful tools.<br/>Effortless planning.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-5 md:px-8">
          {[
            {
               title: "Multi-Agent AI",
               desc: "Our supervisor agent coordinates specialized sub-agents to build, route, and budget your perfect trip simultaneously.",
               icon: Compass,
               bg: "bg-[#173d2e]",
               text: "text-white",
               iconBg: "bg-white/10 text-[#eaff9d]"
            },
            {
               title: "Smart Budgeting",
               desc: "Real-time currency optimization and precise cost breakdowns for every meal, stay, and activity in your journey.",
               icon: CircleDollarSign,
               bg: "bg-[#eaff9d]",
               text: "text-[#173d2e]",
               iconBg: "bg-white/50 text-[#173d2e]"
            },
            {
               title: "1-Click Export",
               desc: "Seamlessly export your entire AI-generated itinerary directly to Apple or Google Calendar in seconds.",
               icon: CalendarDays,
               bg: "bg-[#f4f7f1]",
               text: "text-[#17211a]",
               iconBg: "bg-white text-[#173d2e]"
            }
          ].map((feature, idx) => {
             const isExpanded = expandedFeature === idx;
             return (
               <div 
                  key={idx} 
                  onClick={() => setExpandedFeature(isExpanded ? null : idx)}
                  className={`relative rounded-[32px] p-8 md:p-10 ${feature.bg} ${feature.text} border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer overflow-hidden transition-all duration-500`}
               >
                  <div className="relative z-10 flex flex-col justify-start">
                     <div className="flex justify-between items-start mb-8">
                        <div className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center shadow-sm`}>
                           <feature.icon className="w-7 h-7" />
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-500 ${feature.iconBg} ${isExpanded ? 'rotate-90' : ''}`}>
                           <ArrowRight className="w-5 h-5" />
                        </div>
                     </div>
                     
                     <div>
                        <h3 className="text-2xl font-black mb-3">{feature.title}</h3>
                        <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                           <div className="overflow-hidden">
                              <p className="font-medium opacity-90 leading-relaxed text-sm md:text-base">{feature.desc}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
             )
          })}
        </div>
      </section>

      {/* Framer-Style Horizontal Slider for Destinations */}
      <section id="destinations" className="py-24 bg-[#fbfdf9] overflow-hidden">
         <div className="max-w-7xl mx-auto px-5 md:px-8 mb-12">
            <div>
               <p className="text-sm font-black uppercase tracking-[0.2em] text-[#4f765d]">Curated Journeys</p>
               <h2 className="mt-3 text-4xl md:text-5xl font-black text-[#17211a] tracking-tight">Trending Destinations</h2>
            </div>
         </div>

         {/* Snap Scrolling Container */}
         <div className="w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-12 pl-5 md:pl-8 xl:pl-[calc((100vw-1280px)/2+32px)]">
            <div className="flex gap-6 pr-8 w-max">
               {trendingDestinations.map((dest, i) => (
                   <div 
                     key={i} 
                     onClick={handleStartPlanning}
                     className="relative w-[300px] md:w-[380px] h-[500px] rounded-[32px] overflow-hidden shrink-0 snap-start shadow-[0_15px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)] cursor-pointer group transition-shadow duration-500"
                   >
                      <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110" />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#091811]/90 via-[#091811]/20 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
                      
                      <div className="absolute top-6 right-6 translate-y-4 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-y-0 group-hover:opacity-100">
                         <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40">
                            <ArrowRight className="w-5 h-5 -rotate-45" />
                         </div>
                      </div>

                      <div className="absolute bottom-8 left-8 right-8 transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-2">
                         <div className="inline-block bg-[#eaff9d] text-[#163c2d] text-xs font-black uppercase tracking-widest mb-3 px-3 py-1.5 rounded-lg shadow-sm">{dest.tag}</div>
                         <div className="text-3xl font-black text-white whitespace-normal leading-tight">{dest.name}</div>
                      </div>
                   </div>
               ))}
            </div>
         </div>
      </section>

      {/* Embedded Components */}
      <WhyTripForge />

      <ChatBot />

      {/* Hide Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </main>
  );
}