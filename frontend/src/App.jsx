import { Route, Routes } from "react-router";

import HomePage from "./pages/HomePage";
import CreateTripPage from "./pages/CreateTripPage";
import ProcessingPage from "./pages/ProcessingPage";
import ResultPage from "./pages/ResultPage";
import HistoryPage from "./pages/HistoryPage";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-trip" element={<CreateTripPage />} />
          <Route path="/processing" element={<ProcessingPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;