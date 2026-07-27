import React from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { LogOut, UserRound } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { user, loading, openAuthModal, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfdf9]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#173d2e] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    setTimeout(() => {
        openAuthModal("login");
    }, 100);
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* Floating Logout Button from multi-agent-core branch */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full border border-[#dce6d5] bg-white/95 p-2 pl-4 shadow-[0_14px_45px_rgba(40,65,45,0.16)] backdrop-blur-xl">
        <div className="hidden items-center gap-2 text-sm font-bold text-[#435248] sm:flex">
          <UserRound className="h-4 w-4 text-[#39734f]" />
          {user.fullName || user.email || "Traveller"}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full bg-[#173d2e] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#20533f]"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      {children}
    </>
  );
}
