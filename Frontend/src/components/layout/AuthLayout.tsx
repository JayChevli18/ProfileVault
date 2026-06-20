import { Link, Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-4 py-12">
        <div className="mb-8 text-center">
          <Link to="/" className="text-2xl font-semibold text-foreground">
            ProfileVault
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            Secure profile and document management
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
