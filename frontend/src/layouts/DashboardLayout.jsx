import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getObfuscatedRoute } from "../utils/routeUtils";
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
   Moon,
   Compass,
   Bot,
   X
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggleManualTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const dashboardPath = getObfuscatedRoute(user, "/history");
  const myJourneysPath = getObfuscatedRoute(user, "/my-journeys");
  const settingsPath = getObfuscatedRoute(user, "/settings");
  const createTripPath = getObfuscatedRoute(user, "/create-trip");

  const navLinks = user?.isAdmin
    ? [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { name: "User Management", path: "/admin/users", icon: Users },
        { name: "Reports & Audit", path: "/admin/reports", icon: BarChart3 },
      ]
    : [
        { name: "Dashboard", path: dashboardPath, icon: LayoutDashboard },
        { name: "My Journeys", path: myJourneysPath, icon: Map },
        { name: "Plan New Trip", path: createTripPath, icon: Compass },
        { name: "Settings", path: settingsPath, icon: Settings },
      ];

  const sampleNotifications = [
    { id: 1, title: "Trip Generated Successfully", time: "5m ago" },
    { id: 2, title: "Weather Forecast Updated for Goa", time: "1h ago" },
    { id: 3, title: "System Database Synced to DynamoDB", time: "3h ago" },
  ];

  function handleSearchSubmit(e) {
    if (e.key === "Enter" && globalSearch.trim()) {
      navigate(myJourneysPath);
    }
  }

  const renderNavItems = () => (
    <div className="space-y-1">
      <p className="px-3 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">Main Menu</p>
      {navLinks.map((link) => {
        const isActive = location.pathname === link.path;
        return (
          <Link
            key={link.name}
            to={link.path}
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
              isActive 
              ? "bg-[#173d2e] dark:bg-teal-500/20 text-white dark:text-teal-400 shadow-sm" 
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#173d2e] dark:hover:text-white"
            }`}
          >
            <link.icon className={`w-5 h-5 ${isActive ? "text-white dark:text-teal-400" : "text-gray-400 dark:text-gray-500"}`} />
            {link.name}
          </Link>
        )
      })}
    </div>
  );

  return (
    <div className="flex h-screen bg-[#fafafa] dark:bg-black transition-colors duration-300 overflow-hidden font-sans text-[#0a0a0a] dark:text-[#ededed]">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#111] border-r border-gray-200 dark:border-white/10 flex flex-col hidden md:flex shrink-0 transition-colors duration-300">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
           <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#173d2e] dark:bg-[#222] border border-transparent dark:border-white/10 text-[#eaff9d] dark:text-teal-400 flex items-center justify-center font-black text-xl shadow-sm">
                 T
              </div>
              <span className="font-black text-lg text-[#173d2e] dark:text-white tracking-tight">TripForge</span>
           </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4">
           {renderNavItems()}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-white/10 transition-colors duration-300">
           <div className="bg-[#173d2e] dark:bg-[#1a1a1a] rounded-2xl p-4 text-center text-white relative overflow-hidden shadow-lg border border-transparent dark:border-white/10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#eaff9d]/10 dark:bg-teal-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <p className="text-sm font-bold">Need Help?</p>
              <button 
                onClick={() => navigate(createTripPath)}
                className="mt-3 w-full bg-white dark:bg-[#222] text-[#173d2e] dark:text-white rounded-lg py-2 text-xs font-black transition hover:bg-gray-100 dark:hover:bg-[#333] border border-transparent dark:border-white/10"
              >
                 Create New Trip
              </button>
           </div>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside className={`fixed top-0 bottom-0 left-0 w-64 bg-white dark:bg-[#111] z-50 md:hidden flex flex-col transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-white/10 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-white/10">
           <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#173d2e] dark:bg-[#222] text-[#eaff9d] dark:text-teal-400 flex items-center justify-center font-black text-xl">
                 T
              </div>
              <span className="font-black text-lg text-[#173d2e] dark:text-white tracking-tight">TripForge</span>
           </Link>
           <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500 p-1">
              <X className="w-6 h-6" />
           </button>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4">
           {renderNavItems()}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
         {/* Top Header */}
         <header className="h-16 bg-white/80 dark:bg-black/50 backdrop-blur-md border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 transition-colors duration-300">
            <div className="flex items-center gap-4">
               <button 
                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                 className="md:hidden text-gray-500 dark:text-gray-400 hover:text-[#173d2e] dark:hover:text-white transition-colors p-1"
               >
                  <Menu className="w-6 h-6" />
               </button>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 relative">
               <button 
                 onClick={toggleManualTheme}
                 className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#173d2e] dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
                 title="Toggle Theme (Light / Dark)"
               >
                  {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
               </button>

               <div className="h-8 w-px bg-gray-200 dark:bg-white/10 hidden sm:block"></div>

               <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                     <p className="text-sm font-black text-[#173d2e] dark:text-white">{user?.name || user?.fullName || "Traveller"}</p>
                     <p className="text-xs font-bold text-gray-500 dark:text-teal-400/80">{user?.isAdmin ? "Admin" : "User"}</p>
                  </div>
                  <Link to={settingsPath} className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-[#222] text-[#173d2e] dark:text-teal-400 flex items-center justify-center border border-gray-200 dark:border-white/10 shadow-sm hover:scale-105 transition">
                     {user?.avatar || localStorage.getItem("tripforge_user_avatar") ? (
                       <img src={user?.avatar || localStorage.getItem("tripforge_user_avatar")} alt="User Avatar" className="w-full h-full object-cover" />
                     ) : (
                       <UserRound className="w-5 h-5" />
                     )}
                  </Link>
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
