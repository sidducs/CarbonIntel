import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Analysis from "../pages/Analysis";
import Optimization from "../pages/Optimization";
import Reports from "../pages/Reports";
import About from "../pages/About";
import Copilot from "../pages/Copilot";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/optimization" element={<Optimization />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/about" element={<About />} />
            <Route path="/copilot" element={<Copilot />} />
        </Routes>
    );
}

export default AppRoutes;