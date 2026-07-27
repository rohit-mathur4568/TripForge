import { Navigate, Route, Routes } from "react-router";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CreateTripPage from "./pages/CreateTripPage";
import ProcessingPage from "./pages/ProcessingPage";
import ResultPage from "./pages/ResultPage";
import HistoryPage from "./pages/HistoryPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-trip" element={<CreateTripPage />} />
        <Route path="/processing" element={<ProcessingPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;