import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-semibold text-foreground">404</h1>
      <p className="max-w-md text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/dashboard"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Go to dashboard
      </Link>
    </div>
  );
}
