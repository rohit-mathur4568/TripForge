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

function App() {
  const location = useLocation();
  const hideFooterRoutes = ["/login", "/register", "/admin"];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          
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
            element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

export default App;