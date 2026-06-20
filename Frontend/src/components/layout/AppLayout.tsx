import { useMutation } from "@tanstack/react-query";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/types/api";
import { useAuth } from "@/providers/AuthProvider";
import { logoutUser } from "@/services/auth.service";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/profile", label: "Profile" },
];

export function AppLayout() {
  const navigate = useNavigate();
  const { user, clearSession } = useAuth();

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      clearSession();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      clearSession();
      toast.error(getApiErrorMessage(error, "Logout failed"));
      navigate("/login", { replace: true });
    },
  });

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/dashboard" className="text-lg font-semibold text-foreground">
            ProfileVault
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user?.username}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
