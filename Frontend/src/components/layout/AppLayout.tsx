import { Link, NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/profile", label: "Profile" },
];

export function AppLayout() {
  const { user } = useAuth();

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

          <div className="text-sm text-muted-foreground">
            {user?.username}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
