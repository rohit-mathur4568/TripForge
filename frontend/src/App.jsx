import { Navigate, Route, Routes, useLocation } from "react-router";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CreateTripPage from "./pages/CreateTripPage";
import ProcessingPage from "./pages/ProcessingPage";
import ResultPage from "./pages/ResultPage";
import HistoryPage from "./pages/HistoryPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
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
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <DashboardLayout>
                  <AdminDashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/app/:sessionId/create-trip" 
            element={<ProtectedRoute><CreateTripPage /></ProtectedRoute>} 
          />
          <Route 
            path="/app/:sessionId/processing" 
            element={<ProtectedRoute><ProcessingPage /></ProtectedRoute>} 
          />
          <Route 
            path="/app/:sessionId/result" 
            element={<ProtectedRoute><ResultPage /></ProtectedRoute>} 
          />
          <Route 
            path="/app/:sessionId/history" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <HistoryPage />
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