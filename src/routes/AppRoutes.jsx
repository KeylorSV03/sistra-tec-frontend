import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ui/ProtectedRoute";

// ── Public ──────────────────────────────────────────────────────────────────
import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";

// ── Donor (tipoUsuario === 2) ────────────────────────────────────────────────
import DonorDashboard from "../pages/donor/DonorDashboard";
import RegisterDonationPage from "../pages/donor/RegisterDonationPage";
import MyDonationsPage from "../pages/donor/MyDonationsPage";
import DonorNotificationsPage from "../pages/donor/DonorNotificationsPage";

// ── Admin (tipoUsuario === 1) ────────────────────────────────────────────────
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminDonationsPage from "../pages/admin/AdminDonationsPage";
import AdminInventoryPage from "../pages/admin/AdminInventoryPage";
import AdminTransportersPage from "../pages/admin/AdminTransportersPage";
import CreateTransporterPage from "../pages/admin/CreateTransporterPage";
import AdminNotificationsPage from "../pages/admin/AdminNotificationsPage";

// ── Transporter (tipoUsuario === 3) ──────────────────────────────────────────
import TransporterDashboard from "../pages/transporter/TransporterDashboard";
import TransporterAssignmentsPage from "../pages/transporter/TransporterAssignmentsPage";
import AssignmentDetailPage from "../pages/transporter/AssignmentDetailPage";
import ConfirmActionPage from "../pages/transporter/ConfirmActionPage";
import TransporterNotificationsPage from "../pages/transporter/TransporterNotificationsPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ── Donor ── */}
      <Route element={<ProtectedRoute role={2} />}>
        <Route path="/donor" element={<Navigate to="/donor/dashboard" replace />} />
        <Route path="/donor/dashboard" element={<DonorDashboard />} />
        <Route path="/donor/register-donation" element={<RegisterDonationPage />} />
        <Route path="/donor/my-donations" element={<MyDonationsPage />} />
        <Route path="/donor/notifications" element={<DonorNotificationsPage />} />
      </Route>

      {/* ── Admin ── */}
      <Route element={<ProtectedRoute role={1} />}>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/donations" element={<AdminDonationsPage />} />
        <Route path="/admin/inventory" element={<AdminInventoryPage />} />
        <Route path="/admin/transporters" element={<AdminTransportersPage />} />
        <Route path="/admin/create-transporter" element={<CreateTransporterPage />} />
        <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
      </Route>

      {/* ── Transporter ── */}
      <Route element={<ProtectedRoute role={3} />}>
        <Route path="/transporter" element={<Navigate to="/transporter/dashboard" replace />} />
        <Route path="/transporter/dashboard" element={<TransporterDashboard />} />
        <Route path="/transporter/assignments" element={<TransporterAssignmentsPage />} />
        <Route path="/transporter/assignments/:id" element={<AssignmentDetailPage />} />
        <Route path="/transporter/confirm-action" element={<ConfirmActionPage />} />
        <Route path="/transporter/notifications" element={<TransporterNotificationsPage />} />
      </Route>

      {/* ── Catch-all ── */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
