import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, loginUser, signupUser } from "../services/tripService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" | "signup"

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("tf_token");
      if (token) {
        try {
          const res = await getCurrentUser();
          setUser(res.user);
        } catch (err) {
          console.warn("Invalid or expired session token", err);
          localStorage.removeItem("tf_token");
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await loginUser(email, password);
    localStorage.setItem("tf_token", res.token);
    setUser(res.user);
    setIsAuthModalOpen(false);
    return res;
  };

  const signup = async (fullName, email, password) => {
    const res = await signupUser(fullName, email, password);
    localStorage.setItem("tf_token", res.token);
    setUser(res.user);
    setIsAuthModalOpen(false);
    return res;
  };

  const logout = () => {
    localStorage.removeItem("tf_token");
    setUser(null);
  };

  const openAuthModal = (mode = "login") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthModalOpen,
        authMode,
        setAuthMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
