import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import InvestorDashboard from "./pages/InvestorDashboard";
import PartnerDashboard from "./pages/PartnerDashboard";
import AdminPage from "./pages/AdminDashboard";
import Unauthorized from "./components/Unauthorized";

// import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Investor Dashboard */}
      <Route
        path="/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={["investor"]}>
            <InvestorDashboard />
          </RoleProtectedRoute>
        }
      />

      {/* Partner Dashboard */}
      <Route
        path="/partner"
        element={
          <RoleProtectedRoute allowedRoles={["partner"]}>
            <PartnerDashboard />
          </RoleProtectedRoute>
        }
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <RoleProtectedRoute allowedRoles={["admin"]}>
            <AdminPage />
          </RoleProtectedRoute>
        }
      />

      {/* Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
