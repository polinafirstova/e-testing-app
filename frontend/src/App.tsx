import { BrowserRouter, Route, Routes } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminEditPage from "./pages/AdminEditPage";
import AdminLogsPage from "./pages/AdminLogsPage";
import AdminPage from "./pages/AdminPage";
import AdminQuestionPage from "./pages/AdminQuestionPage";
import AdminStatisticPage from "./pages/AdminStatisticPage";
import HomePage from "./pages/HomePage";
import ResultsPage from "./pages/ResultsPage";
import TestPage from "./pages/TestPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/results/:id" element={<ResultsPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/questions" element={<AdminQuestionPage />} />
          <Route path="/admin/edit" element={<AdminEditPage />} />
          <Route path="/admin/statistics" element={<AdminStatisticPage />} />
          <Route path="/admin/logs" element={<AdminLogsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
