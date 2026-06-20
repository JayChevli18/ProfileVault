import { useAuth } from "@/providers/AuthProvider";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome back, {user?.username}. Dashboard content will be added in Phase 14.
      </p>
    </div>
  );
}
