import React, { useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { LogOut, UserRound } from "lucide-react";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      const currentPath = encodeURIComponent(
        location.pathname + location.search
      );
      navigate(`/login?redirect=${currentPath}`, {
        replace: true,
      });
    } else if (!loading && user && adminOnly && !user.isAdmin) {
       navigate("/", { replace: true });
    }
  }, [loading, user, adminOnly, location, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfdf9]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#173d2e] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && !user.isAdmin) {
     return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return <>{children}</>;
}
