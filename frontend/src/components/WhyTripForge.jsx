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
    <div id="platform" className="bg-[#fafafa] dark:bg-black border-t border-gray-200 dark:border-white/10 py-24 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Grid Pattern for Tech Feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]" />

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
           <h2 className="text-3xl md:text-5xl font-black text-[#0a0a0a] dark:text-white tracking-tight mb-4">
             Intelligence at <br className="hidden md:block" /> every coordinate.
           </h2>
           <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
             TripForge doesn't just list places. It operates a smart engine to orchestrate, budget, and map your journey.
           </p>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 lg:gap-6 auto-rows-[300px]">
           
           {/* Large Box 1: Multi-Agent AI */}
           <div className="md:col-span-2 md:row-span-2 bg-white dark:bg-[#111] rounded-[32px] p-8 lg:p-10 border border-gray-200 dark:border-white/10 dark:ring-1 dark:ring-white/5 shadow-sm dark:shadow-none relative overflow-hidden flex flex-col transition-colors duration-300 group">
              <div className="w-12 h-12 bg-gray-50 dark:bg-[#222] rounded-xl flex items-center justify-center border border-gray-200 dark:border-white/10 mb-6 shrink-0 transition-colors duration-300 group-hover:scale-110">
                 <BrainCircuit className="w-6 h-6 text-[#173d2e] dark:text-teal-400" />
              </div>
              <div className="relative z-10 max-w-md">
                 <h3 className="text-2xl lg:text-3xl font-black text-[#0a0a0a] dark:text-white tracking-tight mb-3">Smart Orchestration</h3>
                 <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                   Behind the scenes, a Supervisor engine directs specialized modules. One module hunts for the best stays, another maps the most efficient routes, and a third balances your budget—all working in parallel.
                 </p>
              </div>
              
              {/* Abstract Illustration */}
              <div className="absolute right-[-10%] bottom-[-10%] w-3/4 h-3/4 bg-gradient-to-tl from-[#eaff9d]/20 dark:from-teal-500/20 to-transparent rounded-full blur-[80px] group-hover:blur-[100px] transition-all duration-700" />
              <div className="hidden md:block absolute right-8 bottom-8">
                 <div className="grid grid-cols-2 gap-3 opacity-80 dark:opacity-100">
                    <div className="bg-white dark:bg-[#0a0a0a] p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-2 text-[#0a0a0a] dark:text-gray-300"><Cpu className="w-4 h-4 text-[#39734f] dark:text-teal-400"/> Routing</div>
                    <div className="bg-white dark:bg-[#0a0a0a] p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-2 text-[#0a0a0a] dark:text-gray-300"><CircleDollarSign className="w-4 h-4 text-[#39734f] dark:text-teal-400"/> Budget</div>
                    <div className="bg-[#173d2e] dark:bg-teal-500/10 p-4 rounded-xl border border-[#173d2e] dark:border-teal-500/30 shadow-sm flex items-center gap-2 text-white dark:text-teal-300 col-span-2 justify-center"><Compass className="w-4 h-4 text-[#eaff9d] dark:text-teal-400"/> Supervisor</div>
                 </div>
              </div>
           </div>

           {/* Small Box 1: Export */}
           <div className="md:col-span-1 md:row-span-1 bg-[#173d2e] dark:bg-gradient-to-br dark:from-teal-900/40 dark:to-[#111] rounded-[32px] p-8 border border-[#173d2e] dark:border-white/10 shadow-sm dark:shadow-none dark:ring-1 dark:ring-white/5 relative overflow-hidden flex flex-col justify-between group transition-colors duration-300">
              <div className="w-10 h-10 bg-white/10 dark:bg-teal-500/20 rounded-xl flex items-center justify-center border border-white/10 dark:border-teal-500/30 shrink-0 group-hover:scale-110 transition-transform">
                 <CalendarDays className="w-5 h-5 text-[#eaff9d] dark:text-teal-400" />
              </div>
              <div className="relative z-10 mt-6">
                 <h3 className="text-xl font-bold text-white mb-2">1-Click Export</h3>
                 <p className="text-[#a7b5ac] dark:text-teal-100/70 text-sm font-medium">
                   Export your entire itinerary to Apple or Google Calendar instantly.
                 </p>
              </div>
              <Download className="absolute top-8 right-8 w-12 h-12 text-white/5 dark:text-teal-500/10 transform group-hover:scale-125 transition-transform duration-500" />
           </div>

           {/* Small Box 2: Mapping */}
           <div className="md:col-span-1 md:row-span-1 bg-white dark:bg-[#111] rounded-[32px] p-8 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none dark:ring-1 dark:ring-white/5 relative overflow-hidden flex flex-col justify-between group transition-colors duration-300">
              <div className="w-10 h-10 bg-gray-50 dark:bg-[#222] rounded-xl flex items-center justify-center border border-gray-200 dark:border-white/10 shrink-0 group-hover:scale-110 transition-transform">
                 <Navigation className="w-5 h-5 text-[#173d2e] dark:text-teal-400" />
              </div>
              <div className="relative z-10 mt-6">
                 <h3 className="text-xl font-bold text-[#0a0a0a] dark:text-white mb-2">Geo-Mapping</h3>
                 <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                   Interactive maps ensure spatial feasibility. No more rushing between impossible coordinates.
                 </p>
              </div>
              <Globe2 className="absolute top-8 right-8 w-12 h-12 text-gray-100 dark:text-gray-800 transform group-hover:scale-125 transition-transform duration-500" />
           </div>

        </div>
      </div>
    </div>
  );
}
