import { Navigate, Route, Routes, useLocation } from "react-router";
import { useAuth } from "./context/AuthContext";
import { getObfuscatedRoute } from "./utils/routeUtils";
import UserSignUpPage from "./pages/UserSignUpPage";
import UserSignInPage from "./pages/UserSignInPage";
import LandingPage from "./pages/LandingPage";
import TripPlannerFormPage from "./pages/TripPlannerFormPage";
import ItineraryGeneratingPage from "./pages/ItineraryGeneratingPage";
import GeneratedTripItineraryPage from "./pages/GeneratedTripItineraryPage";
import UserDashboardHistoryPage from "./pages/UserDashboardHistoryPage";
import MyJourneysPage from "./pages/MyJourneysPage";
import UserSettingsPage from "./pages/UserSettingsPage";
import AdminSystemAnalyticsPage from "./pages/AdminSystemAnalyticsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminReportsPage from "./pages/AdminReportsPage";
import AiChatbotPlannerPage from "./pages/AiChatbotPlannerPage";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

// Auto-redirects logged-in users away from the landing page to their dashboard
function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#173d2e] border-t-transparent" />
      </div>
    );
  }

  if (user) {
    if (user.isAdmin) return <Navigate to="/admin" replace />;
    return <Navigate to={getObfuscatedRoute(user, "/history")} replace />;
  }

  return <LandingPage />;
}

function App() {
  const location = useLocation();
  const isDashboardRoute =
    location.pathname.startsWith("/app") ||
    location.pathname.startsWith("/admin");
  const hideFooterRoutes = ["/login", "/register", "/admin"];
  const shouldHideFooter =
    hideFooterRoutes.includes(location.pathname) || isDashboardRoute;

  return (
    <div className={`flex flex-col min-h-screen ${isDashboardRoute ? "bg-[#f4f7f6]" : ""}`}>
      <div className="flex-1">
        <Routes>
          {/* "/" → dashboard if logged in, landing page if guest */}
          <Route path="/" element={<HomeRedirect />} />

          <Route path="/login" element={<UserSignInPage />} />
          <Route path="/register" element={<UserSignUpPage />} />

          {/* Admin Routes */}
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
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly={true}>
                <DashboardLayout>
                  <AdminUsersPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute adminOnly={true}>
                <DashboardLayout>
                  <AdminReportsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* User App Routes */}
          <Route
            path="/app/:sessionId/create-trip"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <TripPlannerFormPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/:sessionId/chatbot-planner"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AiChatbotPlannerPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/:sessionId/processing"
            element={<ProtectedRoute><ItineraryGeneratingPage /></ProtectedRoute>}
          />
          <Route
            path="/app/:sessionId/result"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <GeneratedTripItineraryPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
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
          <Route
            path="/app/:sessionId/my-journeys"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MyJourneysPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/:sessionId/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UserSettingsPage />
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