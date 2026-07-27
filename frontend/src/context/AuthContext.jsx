import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Standardize around tripforge_user and tripforge_access_token
    const storedUser = localStorage.getItem("tripforge_user");
    const token = localStorage.getItem("tripforge_access_token");

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Identify Admin based on email
        if (parsedUser.email === "admin@tripforge.com") {
           parsedUser.isAdmin = true;
        } else {
           parsedUser.isAdmin = false;
        }
        setUser(parsedUser);
      } catch (err) {
        console.error("Failed to parse user from local storage", err);
        localStorage.removeItem("tripforge_user");
        localStorage.removeItem("tripforge_access_token");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    if (userData.email === "admin@tripforge.com") {
       userData.isAdmin = true;
    } else {
       userData.isAdmin = false;
    }
    localStorage.setItem("tripforge_user", JSON.stringify(userData));
    localStorage.setItem("tripforge_access_token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("tripforge_user");
    localStorage.removeItem("tripforge_access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
