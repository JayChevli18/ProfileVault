import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { ProfileView } from "@/components/profile/ProfileView";
import { formatDateForInput } from "@/lib/format-date";
import { getApiErrorMessage } from "@/types/api";
import type { Profile } from "@/types/profile";
import { getProfile } from "@/services/profile.service";
import type { ProfileFormInput } from "@/validations/profile.validation";

type ProfileMode = "view" | "create" | "update";

function profileToFormValues(profile: Profile): ProfileFormInput {
  return {
    fullName: profile.fullName,
    dob: formatDateForInput(profile.dob),
    email: profile.email,
    mobile: profile.mobile,
    address: profile.address,
  };
}

export function ProfilePage() {
  const [mode, setMode] = useState<ProfileMode>("view");

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const profile = profileQuery.data;
  const activeMode: ProfileMode = !profile
    ? "create"
    : mode === "update"
      ? "update"
      : "view";

  if (profileQuery.isLoading) {
    return <ProfileSkeleton />;
  }

  if (profileQuery.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Unable to load profile</AlertTitle>
        <AlertDescription>
          {getApiErrorMessage(profileQuery.error, "Failed to load profile")}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">
          {activeMode === "create"
            ? "Create your profile to store personal details and generate documents."
            : activeMode === "update"
              ? "Update your personal information."
              : "View and manage your personal information."}
        </p>
      </div>

      {activeMode === "create" ? (
        <ProfileForm
          mode="create"
          onSuccess={() => setMode("view")}
        />
      ) : null}

      {activeMode === "view" && profile ? (
        <ProfileView profile={profile} onEdit={() => setMode("update")} />
      ) : null}

      {activeMode === "update" && profile ? (
        <ProfileForm
          mode="update"
          defaultValues={profileToFormValues(profile)}
          onCancel={() => setMode("view")}
          onSuccess={() => setMode("view")}
        />
      ) : null}
    </div>
  );
}
