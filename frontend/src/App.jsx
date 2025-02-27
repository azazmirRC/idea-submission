import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import IdeaForm from "./components/IdeaForm";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IdeaForm />} />
        <Route path="/HRYF8M6TXF" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
