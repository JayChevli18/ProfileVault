import { useMutation } from "@tanstack/react-query";
import {
  FileDown,
  KeyRound,
  LogOut,
  Pencil,
  Upload,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChangePasswordDialog } from "@/components/dashboard/ChangePasswordDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getApiErrorMessage } from "@/types/api";
import { useAuth } from "@/providers/AuthProvider";
import { logoutUser } from "@/services/auth.service";
import {
  downloadProfileDocx,
  downloadProfilePdf,
} from "@/services/document.service";

interface QuickActionsProps {
  hasProfile: boolean;
}

export function QuickActions({ hasProfile }: QuickActionsProps) {
  const navigate = useNavigate();
  const { clearSession } = useAuth();

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      clearSession();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      clearSession();
      toast.error(getApiErrorMessage(error, "Logout failed"));
      navigate("/login", { replace: true });
    },
  });

  const pdfMutation = useMutation({
    mutationFn: downloadProfilePdf,
    onSuccess: () => {
      toast.success("PDF download started");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to download PDF"));
    },
  });

  const docxMutation = useMutation({
    mutationFn: downloadProfileDocx,
    onSuccess: () => {
      toast.success("DOCX download started");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to download DOCX"));
    },
  });

  const isDownloading = pdfMutation.isPending || docxMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks for managing your account and profile
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/profile">
            {hasProfile ? (
              <>
                <Pencil className="size-4" />
                Edit Profile
              </>
            ) : (
              <>
                <UserRound className="size-4" />
                Create Profile
              </>
            )}
          </Link>
        </Button>

        {hasProfile ? (
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link to="/profile">
              <Upload className="size-4" />
              Upload Documents
            </Link>
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
            disabled
          >
            <Upload className="size-4" />
            Upload Documents
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full justify-start"
          disabled={!hasProfile || isDownloading}
          onClick={() => pdfMutation.mutate()}
        >
          <FileDown className="size-4" />
          {pdfMutation.isPending ? "Preparing PDF..." : "Download PDF"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full justify-start"
          disabled={!hasProfile || isDownloading}
          onClick={() => docxMutation.mutate()}
        >
          <FileDown className="size-4" />
          {docxMutation.isPending ? "Preparing DOCX..." : "Download DOCX"}
        </Button>

        <ChangePasswordDialog
          trigger={
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
            >
              <KeyRound className="size-4" />
              Change Password
            </Button>
          }
        />

        <Button
          type="button"
          variant="outline"
          className="w-full justify-start text-destructive hover:text-destructive"
          disabled={logoutMutation.isPending}
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="size-4" />
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
      </CardContent>
    </Card>
  );
}
