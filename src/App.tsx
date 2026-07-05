import { Routes, Route } from "react-router";
import CaseSelector from "./pages/CaseSelector";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CaseSelector />} />
      <Route path="/dashboard/:caseId" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
