import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/types/api";
import {
  createProfile,
  updateProfile,
} from "@/services/profile.service";
import {
  profileFormSchema,
  type ProfileFormInput,
} from "@/validations/profile.validation";

interface ProfileFormProps {
  mode: "create" | "update";
  defaultValues?: ProfileFormInput;
  onCancel?: () => void;
  onSuccess?: () => void;
}

const emptyValues: ProfileFormInput = {
  fullName: "",
  dob: "",
  email: "",
  mobile: "",
  address: "",
};

export function ProfileForm({
  mode,
  defaultValues,
  onCancel,
  onSuccess,
}: ProfileFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<ProfileFormInput>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: defaultValues ?? emptyValues,
  });

  useEffect(() => {
    form.reset(defaultValues ?? emptyValues);
  }, [defaultValues, form]);

  const mutation = useMutation({
    mutationFn: mode === "create" ? createProfile : updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(
        mode === "create"
          ? "Profile created successfully"
          : "Profile updated successfully"
      );
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          mode === "create" ? "Failed to create profile" : "Failed to update profile"
        )
      );
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const isPending = mutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Create Profile" : "Update Profile"}
        </CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Fill in your personal details to get started"
            : "Update your personal details below"}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                aria-invalid={Boolean(errors.fullName)}
                {...register("fullName")}
              />
              {errors.fullName ? (
                <p className="text-sm text-destructive">{errors.fullName.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                aria-invalid={Boolean(errors.dob)}
                {...register("dob")}
              />
              {errors.dob ? (
                <p className="text-sm text-destructive">{errors.dob.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="+1234567890"
                aria-invalid={Boolean(errors.mobile)}
                {...register("mobile")}
              />
              {errors.mobile ? (
                <p className="text-sm text-destructive">{errors.mobile.message}</p>
              ) : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              {errors.email ? (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                rows={4}
                placeholder="Street, city, state, postal code"
                aria-invalid={Boolean(errors.address)}
                {...register("address")}
              />
              {errors.address ? (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              ) : null}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          {mode === "update" && onCancel ? (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
              Cancel
            </Button>
          ) : null}
          <Button type="submit" disabled={isPending}>
            {isPending
              ? mode === "create"
                ? "Creating..."
                : "Saving..."
              : mode === "create"
                ? "Create Profile"
                : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
