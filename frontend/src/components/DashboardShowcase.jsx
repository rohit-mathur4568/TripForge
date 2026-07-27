import React from "react";
import { LayoutDashboard, Activity, Settings, PieChart, Users, MapPin, CalendarDays, Compass, ArrowRight, ShieldCheck, Database, Zap } from "lucide-react";

export default function DashboardShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 relative">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#4f765d]">
          Platform Experience
        </p>
        <h2 className="mt-4 text-4xl md:text-5xl font-black text-[#17211a] tracking-tight">
          Powerful Dashboards for Everyone
        </h2>
        <p className="mt-5 text-lg text-[#637068]">
          Whether you are an explorer planning your next adventure or a platform admin monitoring multi-agent performance, our interfaces are designed for ultimate clarity and control.
        </p>
      </div>

      <div className="space-y-24">
        {/* User Dashboard Mockup */}
        <div className="relative group">
          <div className="absolute -inset-1 rounded-[40px] bg-gradient-to-r from-[#d9f99d] to-[#77a982] opacity-30 blur-2xl group-hover:opacity-50 transition duration-500" />
          <div className="relative rounded-[32px] border border-[#e1eadb] bg-white p-2 shadow-2xl overflow-hidden">
            {/* Browser Header Bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-[#fbfdf9] rounded-t-[28px]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="mx-auto bg-white border border-slate-200 text-slate-400 text-xs py-1 px-24 rounded-md flex items-center justify-center font-medium">
                tripforge.ai/dashboard
              </div>
            </div>
            
            {/* Dashboard Content */}
            <div className="flex bg-[#fbfdf9] h-[500px]">
              {/* Sidebar */}
              <div className="w-64 border-r border-[#e1eadb] p-6 hidden md:block">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-8 h-8 rounded-lg bg-[#163c2d] flex items-center justify-center text-[#eaff9d]">
                    <Compass className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-[#17211a]">Explorer Panel</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2.5 bg-[#edf8d9] text-[#163c2d] rounded-xl font-bold text-sm">
                    <LayoutDashboard className="w-4 h-4" /> My Journeys
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5 text-[#637068] hover:bg-slate-50 rounded-xl font-semibold text-sm">
                    <MapPin className="w-4 h-4" /> Saved Routes
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5 text-[#637068] hover:bg-slate-50 rounded-xl font-semibold text-sm">
                    <Settings className="w-4 h-4" /> Preferences
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="flex-1 p-8 overflow-hidden relative">
                <h3 className="text-2xl font-black text-[#17211a] mb-6">Welcome back, Alex!</h3>
                <div className="grid grid-cols-3 gap-5 mb-8">
                  <div className="bg-white p-5 rounded-2xl border border-[#e1eadb] shadow-sm">
                    <div className="text-slate-500 text-xs font-bold uppercase mb-2">Upcoming Trips</div>
                    <div className="text-3xl font-black text-[#163c2d]">2</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-[#e1eadb] shadow-sm">
                    <div className="text-slate-500 text-xs font-bold uppercase mb-2">Saved Places</div>
                    <div className="text-3xl font-black text-[#163c2d]">14</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-[#e1eadb] shadow-sm">
                    <div className="text-slate-500 text-xs font-bold uppercase mb-2">Total Miles</div>
                    <div className="text-3xl font-black text-[#163c2d]">4,200</div>
                  </div>
                </div>
                
                <h4 className="font-bold text-[#17211a] mb-4">Active Itinerary: Tokyo</h4>
                <div className="bg-white border border-[#e1eadb] rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#163c2d] text-[#eaff9d] flex items-center justify-center">
                        <CalendarDays className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-[#17211a]">Day 1: Arrival & Shibuya</div>
                        <div className="text-xs text-slate-500 font-medium">4 Activities Planned</div>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      In Progress
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#163c2d] w-1/3 rounded-full" />
                  </div>
                </div>
                
                {/* Floating Advertisement Element */}
                <div className="absolute bottom-8 right-8 bg-[#163c2d] text-white p-5 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center gap-4 max-w-sm animate-bounce-slow">
                  <div className="w-12 h-12 rounded-full bg-[#eaff9d] text-[#163c2d] flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#eaff9d]">User Dashboard</div>
                    <div className="text-xs text-slate-300 mt-1 leading-tight">Everything you need to manage your personal travel experiences in one place.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Dashboard Mockup */}
        <div className="relative group">
          <div className="absolute -inset-1 rounded-[40px] bg-gradient-to-l from-[#f8df58] to-[#163c2d] opacity-20 blur-2xl group-hover:opacity-40 transition duration-500" />
          <div className="relative rounded-[32px] border border-[#e1eadb] bg-white p-2 shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse">
            
            {/* Dashboard Content */}
            <div className="flex-1 bg-[#101820] h-[500px] rounded-[28px] overflow-hidden flex flex-col relative border border-slate-800">
               {/* Browser Header Bar Dark */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#0a0f14]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                </div>
                <div className="bg-[#1a232c] border border-slate-700 text-slate-400 text-xs py-1 px-16 rounded-md flex items-center justify-center font-medium">
                  admin.tripforge.ai
                </div>
                <div className="w-10"></div>
              </div>

              <div className="flex flex-1 overflow-hidden text-slate-300">
                {/* Admin Sidebar */}
                <div className="w-16 md:w-56 border-r border-slate-800 p-4 flex flex-col items-center md:items-start bg-[#0a0f14]">
                  <div className="flex items-center gap-3 mb-10 mt-2 px-2">
                    <ShieldCheck className="w-6 h-6 text-[#eaff9d]" />
                    <span className="font-bold text-white hidden md:block tracking-wide">SysAdmin</span>
                  </div>
                  <div className="space-y-4 w-full">
                    <div className="flex items-center justify-center md:justify-start gap-3 p-2 bg-slate-800/50 text-[#eaff9d] rounded-xl border border-slate-700">
                      <Activity className="w-5 h-5" />
                      <span className="text-sm font-bold hidden md:block">Overview</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-3 p-2 hover:bg-slate-800/30 rounded-xl cursor-pointer">
                      <Users className="w-5 h-5 text-slate-400" />
                      <span className="text-sm font-medium hidden md:block">Users</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-3 p-2 hover:bg-slate-800/30 rounded-xl cursor-pointer">
                      <Database className="w-5 h-5 text-slate-400" />
                      <span className="text-sm font-medium hidden md:block">AWS DynamoDB</span>
                    </div>
                  </div>
                </div>

                {/* Admin Main */}
                <div className="flex-1 p-6 md:p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl md:text-2xl font-black text-white">System Analytics</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-500">Live Services</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: "Active Agents", value: "24", change: "+12%" },
                      { label: "Queries/min", value: "1,240", change: "+5%" },
                      { label: "DB Latency", value: "24ms", change: "-2ms", good: true },
                      { label: "Error Rate", value: "0.01%", change: "stable", good: true }
                    ].map((stat) => (
                      <div key={stat.label} className="bg-[#1a232c] p-4 rounded-2xl border border-slate-700">
                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">{stat.label}</div>
                        <div className="text-2xl font-black text-white">{stat.value}</div>
                        <div className={`text-[10px] font-bold mt-2 ${stat.good ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {stat.change}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Graph Mockup */}
                  <div className="bg-[#1a232c] border border-slate-700 rounded-2xl p-5 h-40 flex items-end gap-2 px-6">
                     {[40, 60, 45, 80, 55, 90, 75, 100, 85, 60, 70, 95].map((height, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-[#173d2e] to-[#77a982] rounded-t-sm transition-all duration-1000" style={{ height: `${height}%` }} />
                     ))}
                  </div>

                </div>
              </div>
              
              {/* Floating Advertisement Element */}
              <div className="absolute top-20 right-8 bg-white text-[#17211a] p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-200 flex items-center gap-3 max-w-[260px] animate-bounce-slow" style={{ animationDelay: '1s' }}>
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-[#eaff9d] flex items-center justify-center shrink-0">
                    <PieChart className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-black">Admin Control Center</div>
                    <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">Monitor multi-agent AI performance and AWS database metrics in real-time.</div>
                  </div>
                </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
