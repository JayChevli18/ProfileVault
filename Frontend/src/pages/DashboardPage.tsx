import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import {
  ProfileSummary,
  ProfileSummaryEmpty,
} from "@/components/dashboard/ProfileSummary";
import { QuickActions } from "@/components/dashboard/QuickActions";
import {
  UploadedDocuments,
  UploadedDocumentsEmpty,
} from "@/components/dashboard/UploadedDocuments";
import { getApiErrorMessage } from "@/types/api";
import { useAuth } from "@/providers/AuthProvider";
import { getProfile } from "@/services/profile.service";

export function DashboardPage() {
  const { user } = useAuth();

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const profile = profileQuery.data;
  const hasProfile = Boolean(profile);

  if (profileQuery.isLoading) {
    return <DashboardSkeleton />;
  }

  if (profileQuery.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Unable to load dashboard</AlertTitle>
        <AlertDescription>
          {getApiErrorMessage(profileQuery.error, "Failed to load profile data")}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {user?.username}. Here&apos;s an overview of your
          ProfileVault account.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {profile ? (
            <ProfileSummary profile={profile} />
          ) : (
            <ProfileSummaryEmpty username={user?.username ?? "there"} />
          )}

          {profile ? (
            <UploadedDocuments documents={profile.documents} />
          ) : (
            <UploadedDocumentsEmpty hasProfile={hasProfile} />
          )}
        </div>

        <QuickActions hasProfile={hasProfile} />
      </div>
    </div>
  );
}
