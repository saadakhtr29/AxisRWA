import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) return null; // or a loader

  if (!currentUser) return <Navigate to="/login" />;

  if (!allowedRoles.includes(userRole))
    return <Navigate to="/unauthorized" replace />;

  return children;
};
