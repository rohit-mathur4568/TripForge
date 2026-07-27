import React from "react";
import { Link } from "react-router";
import { 
  ShieldCheck, 
  Compass, 
  CircleDollarSign, 
  CalendarDays, 
  Navigation, 
  Share2, 
  Download,
  BrainCircuit,
  Globe2,
  Cpu
} from "lucide-react";

export default function WhyTripForge() {
  return (
    <div id="platform" className="bg-gray-50 dark:bg-[#0b1120] border-t border-gray-100 dark:border-slate-800 py-24 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
           <h2 className="text-3xl md:text-5xl font-black text-[#0a0a0a] dark:text-white tracking-tight mb-4">
             Intelligence at <br className="hidden md:block" /> every coordinate.
           </h2>
           <p className="text-gray-500 dark:text-slate-400 font-medium text-lg">
             TripForge doesn't just list places. It operates an entire fleet of AI agents to orchestrate, budget, and map your journey.
           </p>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 lg:gap-6 auto-rows-[300px]">
           
           {/* Large Box 1: Multi-Agent AI */}
           <div className="md:col-span-2 md:row-span-2 bg-white dark:bg-[#0f172a] rounded-3xl p-8 lg:p-10 border border-gray-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col transition-colors duration-300">
              <div className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-gray-100 dark:border-slate-700 mb-6 shrink-0 transition-colors duration-300">
                 <BrainCircuit className="w-6 h-6 text-[#173d2e] dark:text-emerald-400" />
              </div>
              <div className="relative z-10 max-w-md">
                 <h3 className="text-2xl lg:text-3xl font-black text-[#0a0a0a] dark:text-white tracking-tight mb-3">Multi-Agent Orchestration</h3>
                 <p className="text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
                   Behind the scenes, a Supervisor AI directs specialized sub-agents. One agent hunts for the best stays, another maps the most efficient routes, and a third balances your budget—all working in parallel.
                 </p>
              </div>
              
              {/* Abstract Illustration */}
              <div className="absolute right-[-10%] bottom-[-10%] w-3/4 h-3/4 bg-gradient-to-tl from-[#eaff9d]/20 dark:from-emerald-500/10 to-transparent rounded-full blur-3xl" />
              <div className="hidden md:block absolute right-8 bottom-8">
                 <div className="grid grid-cols-2 gap-3 opacity-80 dark:opacity-60">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-2 text-slate-800 dark:text-slate-200"><Cpu className="w-4 h-4 text-[#39734f] dark:text-emerald-400"/> Routing</div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-2 text-slate-800 dark:text-slate-200"><CircleDollarSign className="w-4 h-4 text-[#39734f] dark:text-emerald-400"/> Budget</div>
                    <div className="bg-[#173d2e] dark:bg-emerald-600 p-4 rounded-xl border border-[#173d2e] dark:border-emerald-500 shadow-sm flex items-center gap-2 text-white col-span-2 justify-center"><Compass className="w-4 h-4 text-[#eaff9d] dark:text-emerald-100"/> Supervisor</div>
                 </div>
              </div>
           </div>

           {/* Small Box 1: Export */}
           <div className="md:col-span-1 md:row-span-1 bg-[#173d2e] dark:bg-emerald-900 rounded-3xl p-8 border border-[#173d2e] dark:border-emerald-800 shadow-sm relative overflow-hidden flex flex-col justify-between group transition-colors duration-300">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                 <CalendarDays className="w-5 h-5 text-[#eaff9d] dark:text-emerald-300" />
              </div>
              <div className="relative z-10 mt-6">
                 <h3 className="text-xl font-bold text-white mb-2">1-Click Export</h3>
                 <p className="text-[#a7b5ac] dark:text-emerald-200 text-sm font-medium">
                   Export your entire itinerary to Apple or Google Calendar instantly.
                 </p>
              </div>
              <Download className="absolute top-8 right-8 w-12 h-12 text-white/5 transform group-hover:scale-110 transition-transform duration-500" />
           </div>

           {/* Small Box 2: Mapping */}
           <div className="md:col-span-1 md:row-span-1 bg-white dark:bg-[#0f172a] rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between group transition-colors duration-300">
              <div className="w-10 h-10 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-gray-100 dark:border-slate-700 shrink-0 transition-colors duration-300">
                 <Navigation className="w-5 h-5 text-[#173d2e] dark:text-emerald-400" />
              </div>
              <div className="relative z-10 mt-6">
                 <h3 className="text-xl font-bold text-[#0a0a0a] dark:text-white mb-2">Geo-Mapping</h3>
                 <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">
                   Interactive maps ensure spatial feasibility. No more rushing between impossible coordinates.
                 </p>
              </div>
              <Globe2 className="absolute top-8 right-8 w-12 h-12 text-gray-100 dark:text-slate-800 transform group-hover:scale-110 transition-transform duration-500" />
           </div>

        </div>
      </div>
    </div>
  );
}
