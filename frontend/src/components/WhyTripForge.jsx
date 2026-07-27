import React from "react";
import { CheckCircle2, Navigation, Clock, ShieldCheck, Share2, Download } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export default function WhyTripForge() {
  const { openAuthModal } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-white border-y border-[#e2eadc]">
      {/* Why Choose Section */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#4f765d]">
              Why Choose TripForge
            </p>
            <h2 className="mt-4 text-3xl md:text-5xl font-black text-[#17211a] tracking-tight leading-tight">
              Smarter Planning. <br /> Better Journeys.
            </h2>
            <p className="mt-6 text-lg text-[#637068] leading-relaxed">
              We replace endless research with intelligent, multi-agent AI orchestration. Get a hyper-personalized route, a realistic budget, and day-by-day mapping in seconds.
            </p>
            
            <div className="mt-10 space-y-6">
              {[
                { icon: Clock, title: "Save 10+ Hours of Research", desc: "Our agents scan thousands of locations and reviews instantly." },
                { icon: ShieldCheck, title: "AI-Verified Feasibility", desc: "We ensure you have enough time to travel between spots." },
                { icon: Navigation, title: "Interactive Geo-Mapping", desc: "Visual routes using Leaflet maps to guide you on the ground." },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#edf8d9] text-[#163c2d] flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#17211a]">{item.title}</h4>
                    <p className="text-sm text-[#637068] mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Collage / Cutouts */}
          <div className="relative h-[500px] w-full hidden md:block">
            <div className="absolute top-0 right-0 w-2/3 h-4/5 rounded-[32px] overflow-hidden shadow-2xl z-10 border-4 border-white">
              <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80" alt="Travel scenery" className="w-full h-full object-cover" />
            </div>
            
            <div className="absolute bottom-0 left-0 w-3/5 h-2/3 rounded-[32px] overflow-hidden shadow-2xl z-20 border-4 border-white translate-y-8">
              <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" alt="Beach destination" className="w-full h-full object-cover" />
            </div>

            {/* Floating Advertisement Element */}
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 z-30 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-[#163c2d] text-[#eaff9d] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
               </div>
               <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Trusted by</div>
                  <div className="text-lg font-black text-[#17211a]">10,000+ Travelers</div>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* Share the Journey Advertisement Section */}
      <section className="bg-[#173d2e] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80')] opacity-10 bg-cover bg-center" />
        <div className="mx-auto max-w-7xl px-5 md:px-8 relative z-10 text-center">
           <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Share the Journey
           </h2>
           <p className="text-[#c9d9cd] text-lg max-w-2xl mx-auto mb-10">
              TripForge isn't just about planning; it's about experiencing the world together. Export your itineraries to your calendar or share your AI-generated maps with friends and family in one click.
           </p>
           
           <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-white">
                <Download className="w-6 h-6 text-[#eaff9d]" />
                <span className="font-bold">1-Click .ICS Export</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-white">
                <Share2 className="w-6 h-6 text-[#eaff9d]" />
                <span className="font-bold">Shareable Route Maps</span>
              </div>
           </div>

           <button 
             onClick={() => openAuthModal("signup")}
             className="mt-12 bg-[#eaff9d] hover:bg-white text-[#173d2e] px-8 py-4 rounded-full font-black text-lg transition duration-300 shadow-xl shadow-green-900/30"
           >
             Start Your Adventure Now
           </button>
        </div>
      </section>
    </div>
  );
}
