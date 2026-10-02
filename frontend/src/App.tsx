import { BrowserRouter, Route, Routes } from "react-router";
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
