import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { 
   LayoutDashboard, 
   Map, 
   Settings, 
   Users, 
   BarChart3, 
   LogOut,
   Menu,
   Bell,
   Search,
   UserRound,
   Sun,
   Moon
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggleManualTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const navLinks = user?.isAdmin
    ? [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { name: "Employee Management", path: "#", icon: Users },
        { name: "Reports & Analytics", path: "#", icon: BarChart3 },
        { name: "Settings", path: "#", icon: Settings },
      ]
    : [
        { name: "Dashboard", path: `/app/${user?.sessionId || "session"}/history`, icon: LayoutDashboard },
        { name: "My Journeys", path: "#", icon: Map },
        { name: "Settings", path: "#", icon: Settings },
      ];

  return (
    <div className="flex h-screen bg-[#fafafa] dark:bg-black transition-colors duration-300 overflow-hidden font-sans text-[#0a0a0a] dark:text-[#ededed]">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#111] border-r border-gray-200 dark:border-white/10 flex flex-col hidden md:flex shrink-0 transition-colors duration-300">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#173d2e] dark:bg-[#222] border border-transparent dark:border-white/10 text-[#eaff9d] dark:text-teal-400 flex items-center justify-center font-black text-xl shadow-sm">
                 T
              </div>
              <span className="font-black text-lg text-[#173d2e] dark:text-white tracking-tight">TripForge</span>
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
           <p className="px-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-4">Main Menu</p>
           {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isActive 
                    ? "bg-gray-100 dark:bg-teal-500/10 text-[#173d2e] dark:text-teal-400 shadow-sm" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#173d2e] dark:hover:text-white"
                  }`}
                >
                  <link.icon className={`w-5 h-5 ${isActive ? "text-[#173d2e] dark:text-teal-400" : "text-gray-400 dark:text-gray-500"}`} />
                  {link.name}
                </Link>
              )
           })}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-white/10 transition-colors duration-300">
           <div className="bg-[#173d2e] dark:bg-[#1a1a1a] rounded-2xl p-4 text-center text-white relative overflow-hidden shadow-lg border border-transparent dark:border-white/10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#eaff9d]/10 dark:bg-teal-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <p className="text-sm font-bold">Need Help?</p>
              <button className="mt-3 w-full bg-white dark:bg-[#222] text-[#173d2e] dark:text-white rounded-lg py-2 text-xs font-black transition hover:bg-gray-100 dark:hover:bg-[#333] border border-transparent dark:border-white/10">
                 Contact Support
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
         {/* Top Header */}
         <header className="h-16 bg-white/80 dark:bg-black/50 backdrop-blur-md border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 transition-colors duration-300">
            <div className="flex items-center gap-4">
               <button className="md:hidden text-gray-500 dark:text-gray-400 hover:text-[#173d2e] dark:hover:text-white transition-colors">
                  <Menu className="w-6 h-6" />
               </button>
               <div className="hidden sm:flex items-center relative">
                  <Search className="w-4 h-4 absolute left-3 text-gray-400 dark:text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Search modules..." 
                    className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#111] rounded-lg text-sm border border-transparent dark:border-white/10 focus:ring-2 focus:ring-[#173d2e]/20 dark:focus:ring-teal-500/20 outline-none w-64 text-[#0a0a0a] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 transition-colors duration-300"
                  />
               </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
               <button 
                 onClick={toggleManualTheme}
                 className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#173d2e] dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
                 title="Toggle Theme"
               >
                  {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
               </button>

               <button className="relative text-gray-500 dark:text-gray-400 hover:text-[#173d2e] dark:hover:text-white transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-black rounded-full"></span>
               </button>
               
               <div className="h-8 w-px bg-gray-200 dark:bg-white/10 hidden sm:block"></div>

               <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                     <p className="text-sm font-black text-[#173d2e] dark:text-white">{user?.name || "Traveller"}</p>
                     <p className="text-xs font-bold text-gray-500 dark:text-teal-400/80">{user?.isAdmin ? "Admin" : "User"}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#222] text-[#173d2e] dark:text-teal-400 flex items-center justify-center border border-gray-200 dark:border-white/10 shadow-sm">
                     <UserRound className="w-5 h-5" />
                  </div>
                  <button onClick={handleLogout} className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition ml-2" title="Logout">
                     <LogOut className="w-5 h-5" />
                  </button>
               </div>
            </div>
         </header>

         {/* Scrollable Page Content */}
         <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#d9f99d]/20 dark:bg-teal-900/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="max-w-7xl mx-auto relative z-10">
               {children}
            </div>
         </main>
      </div>
    </div>
  );
}
