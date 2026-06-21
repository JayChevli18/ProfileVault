import { Link } from "react-router-dom";
import { ArrowRight, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

interface ProfileSummaryProps {
  profile: Profile;
}

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function ProfileSummary({ profile }: ProfileSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Summary</CardTitle>
        <CardDescription>
          Overview of your personal details and account activity
        </CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" asChild>
            <Link to="/profile">
              View Profile
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar size="lg" className="size-12">
            <AvatarFallback className="text-base font-medium">
              {getInitials(profile.fullName)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 space-y-1">
            <p className="truncate text-lg font-semibold text-foreground">
              {profile.fullName}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {profile.email}
            </p>
          </div>

          <Badge variant="secondary" className="ml-auto">
            {profile.documents.length} document
            {profile.documents.length === 1 ? "" : "s"}
          </Badge>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <ProfileDetail
            label="Date of Birth"
            value={formatDateForDisplay(profile.dob)}
          />
          <ProfileDetail label="Mobile" value={profile.mobile} />
          <ProfileDetail
            label="Address"
            value={profile.address}
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

interface ProfileSummaryEmptyProps {
  username: string;
}

export function ProfileSummaryEmpty({ username }: ProfileSummaryEmptyProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Summary</CardTitle>
        <CardDescription>
          Complete your profile to unlock uploads and document generation
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <UserRound className="size-6 text-muted-foreground" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="font-medium text-foreground">
            Welcome, {username}
          </p>
          <p className="text-sm text-muted-foreground">
            You haven&apos;t created a profile yet. Add your personal details
            to get started.
          </p>
        </div>
        <Button asChild>
          <Link to="/profile">Create Profile</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
