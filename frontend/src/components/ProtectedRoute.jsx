import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading, openAuthModal } = useAuth();

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

  return children;
}
