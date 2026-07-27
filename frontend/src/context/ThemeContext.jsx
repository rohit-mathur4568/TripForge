import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [manualTheme, setManualTheme] = useState(() => {
    return localStorage.getItem("dashboardTheme") || "light";
  });
  
  const location = useLocation();

  useEffect(() => {
    // Determine if we are on a dashboard route
    const isDashboard = location.pathname.includes("/admin") || location.pathname.includes("/history");

    if (isDashboard) {
      // Use manual theme for dashboards
      setTheme(manualTheme);
      localStorage.setItem("dashboardTheme", manualTheme);
    } else {
      // Use time-based theme for Landing and Auth pages
      const currentHour = new Date().getHours();
      // Night is from 18:00 (6 PM) to 06:00 (6 AM)
      const isNight = currentHour >= 18 || currentHour < 6;
      setTheme(isNight ? "dark" : "light");
    }
  }, [location.pathname, manualTheme]);

  useEffect(() => {
    // Apply theme to the HTML element
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleManualTheme = () => {
    setManualTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleManualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
