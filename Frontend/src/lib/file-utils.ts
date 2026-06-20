import { MAX_UPLOAD_SIZE_BYTES } from "@/constants/file.constants";

export function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }

  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateUploadFile(file: File): string | null {
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return "File size cannot exceed 5 MB";
  }

  if (
    file.type !== "image/jpeg" &&
    file.type !== "image/png" &&
    file.type !== "application/pdf"
  ) {
    return "Invalid file type. Allowed types: JPG, PNG, PDF";
  }

  return null;
}
