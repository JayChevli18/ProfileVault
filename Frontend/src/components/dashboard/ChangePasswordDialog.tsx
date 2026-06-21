import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { getApiErrorMessage } from "@/types/api";
import { useAuth } from "@/providers/AuthProvider";
import { changePassword } from "@/services/auth.service";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/validations/auth.validation";

interface ChangePasswordDialogProps {
  trigger?: ReactNode;
}

export function ChangePasswordDialog({ trigger }: ChangePasswordDialogProps) {
  const navigate = useNavigate();
  const { clearSession } = useAuth();
  const [open, setOpen] = useState(false);

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: ChangePasswordInput) =>
      changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    onSuccess: () => {
      form.reset();
      setOpen(false);
      clearSession();
      toast.success("Password changed successfully. Please sign in again.");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to change password"));
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button" variant="outline" className="w-full justify-start">
            Change Password
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new one. Your new password
            must be at least 8 characters.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <PasswordInput
              id="currentPassword"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.currentPassword)}
              {...register("currentPassword")}
            />
            {errors.currentPassword ? (
              <p className="text-sm text-destructive">
                {errors.currentPassword.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <PasswordInput
              id="newPassword"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.newPassword)}
              {...register("newPassword")}
            />
            {errors.newPassword ? (
              <p className="text-sm text-destructive">
                {errors.newPassword.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <PasswordInput
              id="confirmNewPassword"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmNewPassword)}
              {...register("confirmNewPassword")}
            />
            {errors.confirmNewPassword ? (
              <p className="text-sm text-destructive">
                {errors.confirmNewPassword.message}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
