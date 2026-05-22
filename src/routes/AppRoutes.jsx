import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ui/ProtectedRoute";

// Paginas publicas
import LoginPage from "../pages/public/LoginPage";

// Paginas admin
import AdminDashboard from "../pages/admin/AdminDashboard";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Publicas */}
            <Route path="/login" element={<LoginPage />} />

            {/* Admin */}
            <Route element={<ProtectedRoute role={1} />}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}
