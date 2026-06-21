import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/types/api";
import { useAuth } from "@/providers/AuthProvider";
import { registerUser } from "@/services/auth.service";
import {
  registerSchema,
  type RegisterInput,
} from "@/validations/auth.validation";

export function RegisterPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setSession(data);
      toast.success("Registration successful");
      navigate("/dashboard", { replace: true });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Registration failed"));
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold text-foreground">Create account</h1>
        <p className="text-sm text-muted-foreground">
          Register to start managing your profile
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={handleSubmit((values) => registerMutation.mutate(values))}
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="yourname"
            aria-invalid={Boolean(errors.username)}
            {...register("username")}
          />
          {errors.username ? (
            <p className="text-sm text-destructive">{errors.username.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
