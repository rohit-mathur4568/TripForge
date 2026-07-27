import { Navigate, Route, Routes, useLocation } from "react-router";
import UserSignUpPage from "./pages/UserSignUpPage";
import UserSignInPage from "./pages/UserSignInPage";
import LandingPage from "./pages/LandingPage";
import TripPlannerFormPage from "./pages/TripPlannerFormPage";
import ItineraryGeneratingPage from "./pages/ItineraryGeneratingPage";
import GeneratedTripItineraryPage from "./pages/GeneratedTripItineraryPage";
import UserDashboardHistoryPage from "./pages/UserDashboardHistoryPage";
import AdminSystemAnalyticsPage from "./pages/AdminSystemAnalyticsPage";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  const location = useLocation();
  // Hide footer on auth pages and dashboard routes
  const hideFooterRoutes = ["/login", "/register", "/admin"];
  const isDashboardRoute = location.pathname.includes("/history") || location.pathname.includes("/admin");
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname) || isDashboardRoute;

  return (
    <div className={`flex flex-col min-h-screen ${isDashboardRoute ? "bg-[#f4f7f6]" : ""}`}>
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<UserSignInPage />} />
          <Route path="/register" element={<UserSignUpPage />} />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <DashboardLayout>
                  <AdminSystemAnalyticsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/app/:sessionId/create-trip" 
            element={<ProtectedRoute><TripPlannerFormPage /></ProtectedRoute>} 
          />
          <Route 
            path="/app/:sessionId/processing" 
            element={<ProtectedRoute><ItineraryGeneratingPage /></ProtectedRoute>} 
          />
          <Route 
            path="/app/:sessionId/result" 
            element={<ProtectedRoute><GeneratedTripItineraryPage /></ProtectedRoute>} 
          />
          <Route 
            path="/app/:sessionId/history" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UserDashboardHistoryPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

export default App;