import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("dashboardTheme") || "light");
  const [manualTheme, setManualThemeState] = useState(() => {
    return localStorage.getItem("dashboardTheme") || "light";
  });
  
  const location = useLocation();

  const setManualTheme = (newTheme) => {
    setManualThemeState(newTheme);
    localStorage.setItem("dashboardTheme", newTheme);
  };

  useEffect(() => {
    const isDashboardRoute =
      location.pathname.startsWith("/app") ||
      location.pathname.startsWith("/admin") ||
      location.pathname.includes("/history") ||
      location.pathname.includes("/settings") ||
      location.pathname.includes("/my-journeys") ||
      location.pathname.includes("/create-trip");

    if (isDashboardRoute) {
      setTheme(manualTheme);
    } else {
      const currentHour = new Date().getHours();
      const isNight = currentHour >= 18 || currentHour < 6;
      setTheme(isNight ? "dark" : "light");
    }
  }, [location.pathname, manualTheme]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleManualTheme = () => {
    const nextTheme = manualTheme === "light" ? "dark" : "light";
    setManualTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, manualTheme, setManualTheme, toggleManualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

