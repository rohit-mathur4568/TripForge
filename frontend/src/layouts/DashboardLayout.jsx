import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
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
   UserRound
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
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
    <div className="flex h-screen bg-[#f4f7f6] overflow-hidden font-sans text-[#17211a]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#e2eadc] flex flex-col hidden md:flex shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-[#e2eadc]">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#173d2e] text-[#eaff9d] flex items-center justify-center font-black text-xl">
                 T
              </div>
              <span className="font-black text-lg text-[#173d2e]">TripForge</span>
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
           <p className="px-3 text-xs font-bold uppercase tracking-wider text-[#708078] mb-4">Main Menu</p>
           {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive 
                    ? "bg-[#edf8d9] text-[#173d2e]" 
                    : "text-[#5d7a65] hover:bg-gray-50 hover:text-[#173d2e]"
                  }`}
                >
                  <link.icon className={`w-5 h-5 ${isActive ? "text-[#39734f]" : "text-[#708078]"}`} />
                  {link.name}
                </Link>
              )
           })}
        </div>

        <div className="p-4 border-t border-[#e2eadc]">
           <div className="bg-[#173d2e] rounded-2xl p-4 text-center text-white relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#eaff9d]/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <p className="text-sm font-bold">Need Help?</p>
              <button className="mt-3 w-full bg-white text-[#173d2e] rounded-lg py-2 text-xs font-black transition hover:bg-gray-100">
                 Contact Support
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
         {/* Top Header */}
         <header className="h-16 bg-white border-b border-[#e2eadc] flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
            <div className="flex items-center gap-4">
               <button className="md:hidden text-[#708078] hover:text-[#173d2e]">
                  <Menu className="w-6 h-6" />
               </button>
               <div className="hidden sm:flex items-center relative">
                  <Search className="w-4 h-4 absolute left-3 text-[#708078]" />
                  <input 
                    type="text" 
                    placeholder="Search modules..." 
                    className="pl-9 pr-4 py-2 bg-[#f4f7f6] rounded-lg text-sm border-none focus:ring-2 focus:ring-[#edf8d9] outline-none w-64 text-[#17211a]"
                  />
               </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
               <button className="relative text-[#708078] hover:text-[#173d2e] transition">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
               </button>
               
               <div className="h-8 w-px bg-[#e2eadc] hidden sm:block"></div>

               <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                     <p className="text-sm font-black text-[#173d2e]">{user?.name || "Traveller"}</p>
                     <p className="text-xs font-bold text-[#708078]">{user?.isAdmin ? "Admin" : "User"}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#edf8d9] text-[#173d2e] flex items-center justify-center border border-[#dce6d5]">
                     <UserRound className="w-5 h-5" />
                  </div>
                  <button onClick={handleLogout} className="text-[#708078] hover:text-red-600 transition ml-2" title="Logout">
                     <LogOut className="w-5 h-5" />
                  </button>
               </div>
            </div>
         </header>

         {/* Scrollable Page Content */}
         <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
               {children}
            </div>
         </main>
      </div>
    </div>
  );
}
