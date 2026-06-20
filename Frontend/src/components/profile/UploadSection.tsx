import { useRef, useState, type ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, FileText, ImageIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDateTime } from "@/lib/format-date";
import { formatFileSize, validateUploadFile } from "@/lib/file-utils";
import { uploadProfileDocument } from "@/services/profile.service";
import { getApiErrorMessage } from "@/types/api";
import type { Profile } from "@/types/profile";

interface UploadSectionProps {
  profile: Profile;
}

function isPreviewableImage(mimeType: string): boolean {
  return mimeType === "image/jpeg" || mimeType === "image/png";
}

export function UploadSection({ profile }: UploadSectionProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadMutation = useMutation({
    mutationFn: (file: File) =>
      uploadProfileDocument(file, {
        onUploadProgress: (progress) => setUploadProgress(progress),
      }),
    onMutate: () => {
      setUploadProgress(0);
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profile"], updatedProfile);
      toast.success("File uploaded successfully");
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to upload file"));
      setUploadProgress(0);
    },
  });

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const validationMessage = validateUploadFile(file);
    if (validationMessage) {
      toast.error(validationMessage);
      event.target.value = "";
      return;
    }

    uploadMutation.mutate(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supporting Documents</CardTitle>
        <CardDescription>
          Upload JPG, PNG, or PDF files up to 5 MB each.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
          onChange={handleFileChange}
        />

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={handleChooseFile}
            disabled={uploadMutation.isPending}
          >
            <Upload className="size-4" />
            {uploadMutation.isPending ? "Uploading..." : "Upload File"}
          </Button>
          <span className="text-sm text-muted-foreground">
            {profile.documents.length} file(s) uploaded
          </span>
        </div>

        {uploadMutation.isPending ? (
          <div className="space-y-2">
            <div className="h-2 w-full overflow-hidden rounded bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Upload progress: {uploadProgress}%
            </p>
          </div>
        ) : null}

        {profile.documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No uploaded documents yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {[...profile.documents]
              .sort(
                (a, b) =>
                  new Date(b.uploadedAt).getTime() -
                  new Date(a.uploadedAt).getTime()
              )
              .map((document) => (
                <li
                  key={document.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {document.originalName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(document.size)} -{" "}
                      {formatDateTime(document.uploadedAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {isPreviewableImage(document.mimeType) ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline" size="sm">
                            <Eye className="size-4" />
                            Preview
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{document.originalName}</DialogTitle>
                          </DialogHeader>
                          <img
                            src={document.url}
                            alt={document.originalName}
                            className="max-h-[70vh] w-full rounded-md object-contain"
                          />
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <FileText className="size-3.5" />
                        PDF
                      </span>
                    )}

                    <Button type="button" variant="outline" size="sm" asChild>
                      <a
                        href={document.url}
                        target="_blank"
                        rel="noreferrer"
                        download={document.originalName}
                      >
                        {isPreviewableImage(document.mimeType) ? (
                          <ImageIcon className="size-4" />
                        ) : (
                          <FileText className="size-4" />
                        )}
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
