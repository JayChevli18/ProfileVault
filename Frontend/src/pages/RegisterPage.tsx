import { Link } from "react-router-dom";

export function RegisterPage() {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-xl font-semibold text-foreground">Create account</h1>
      <p className="text-sm text-muted-foreground">
        Registration UI will be implemented in Phase 10.
      </p>
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
