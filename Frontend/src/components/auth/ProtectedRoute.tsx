import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { useAuth } from "@/providers/AuthProvider";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
