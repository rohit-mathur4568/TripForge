import { Route, Routes } from "react-router";

import HomePage from "./pages/HomePage";
import CreateTripPage from "./pages/CreateTripPage";
import ProcessingPage from "./pages/ProcessingPage";
import ResultPage from "./pages/ResultPage";
import HistoryPage from "./pages/HistoryPage";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
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
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;