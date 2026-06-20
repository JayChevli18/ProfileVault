import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileDetail } from "@/components/profile/ProfileDetail";
import {
  formatDateForDisplay,
  formatDateTime,
} from "@/lib/format-date";
import type { Profile } from "@/types/profile";

interface ProfileViewProps {
  profile: Profile;
  onEdit: () => void;
}

export function ProfileView({ profile, onEdit }: ProfileViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Details</CardTitle>
        <CardDescription>
          Your profile information used for document generation
        </CardDescription>
        <CardAction>
          <Button onClick={onEdit}>Edit Profile</Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2">
          <ProfileDetail label="Full Name" value={profile.fullName} />
          <ProfileDetail
            label="Date of Birth"
            value={formatDateForDisplay(profile.dob)}
          />
          <ProfileDetail label="Email" value={profile.email} />
          <ProfileDetail label="Mobile" value={profile.mobile} />
          <ProfileDetail
            label="Address"
            value={profile.address}
            className="sm:col-span-2"
          />
          <ProfileDetail
            label="Documents"
            value={
              profile.documents.length > 0
                ? `${profile.documents.length} uploaded`
                : "No documents uploaded yet"
            }
            className="sm:col-span-2"
          />
          <ProfileDetail
            label="Last Updated"
            value={formatDateTime(profile.updatedAt)}
            className="sm:col-span-2"
          />
        </dl>
      </CardContent>
    </Card>
  );
}
