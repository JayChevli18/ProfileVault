import { Navigate, Outlet } from "react-router-dom";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { useAuth } from "@/providers/AuthProvider";

export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
