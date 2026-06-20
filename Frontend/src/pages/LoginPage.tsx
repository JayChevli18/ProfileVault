import { Link } from "react-router-dom";

export function LoginPage() {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-xl font-semibold text-foreground">Sign in</h1>
      <p className="text-sm text-muted-foreground">
        Authentication UI will be implemented in Phase 10.
      </p>
      <p className="text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-medium text-primary underline-offset-4 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
