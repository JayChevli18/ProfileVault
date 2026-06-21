import { Link } from "react-router-dom";
import { FileText, ImageIcon } from "lucide-react";
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
import { formatDateTime } from "@/lib/format-date";
import { formatFileSize } from "@/lib/file-utils";
import type { Profile, ProfileDocument } from "@/types/profile";

interface UploadedDocumentsProps {
  documents: ProfileDocument[];
}

function isPreviewableImage(mimeType: string): boolean {
  return mimeType === "image/jpeg" || mimeType === "image/png";
}

function DocumentIcon({ mimeType }: { mimeType: string }) {
  if (isPreviewableImage(mimeType)) {
    return <ImageIcon className="size-4 shrink-0 text-muted-foreground" />;
  }

  return <FileText className="size-4 shrink-0 text-muted-foreground" />;
}

export function UploadedDocuments({ documents }: UploadedDocumentsProps) {
  const sortedDocuments = [...documents].sort(
    (a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded Documents</CardTitle>
        <CardDescription>
          Supporting files attached to your profile
        </CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" asChild>
            <Link to="/profile">Manage Uploads</Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {sortedDocuments.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No documents uploaded yet.
            </p>
            <Button variant="link" size="sm" className="mt-2" asChild>
              <Link to="/profile">Upload your first document</Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-2">
            {sortedDocuments.map((document) => (
              <li
                key={document.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <DocumentIcon mimeType={document.mimeType} />
                  <div className="min-w-0 space-y-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {document.originalName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(document.size)} ·{" "}
                      {formatDateTime(document.uploadedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {isPreviewableImage(document.mimeType) ? "Image" : "PDF"}
                  </Badge>
                  <Button type="button" variant="outline" size="sm" asChild>
                    <a
                      href={document.url}
                      target="_blank"
                      rel="noreferrer"
                      download={document.originalName}
                    >
                      Download
                    </a>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

interface UploadedDocumentsEmptyProps {
  hasProfile: boolean;
}

export function UploadedDocumentsEmpty({ hasProfile }: UploadedDocumentsEmptyProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded Documents</CardTitle>
        <CardDescription>
          Supporting files attached to your profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-dashed border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">
            {hasProfile
              ? "No documents uploaded yet."
              : "Create a profile before uploading documents."}
          </p>
          {hasProfile ? (
            <Button variant="link" size="sm" className="mt-2" asChild>
              <Link to="/profile">Upload documents</Link>
            </Button>
          ) : (
            <Button variant="link" size="sm" className="mt-2" asChild>
              <Link to="/profile">Create profile</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
