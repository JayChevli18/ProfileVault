import type { AllowedMimeType, StorageTypeValue } from "@/constants/file.constants";

export interface UploadedFileResponse {
  id: string;
  storageType: StorageTypeValue;
  originalName: string;
  mimeType: AllowedMimeType;
  size: number;
  url: string;
  uploadedAt: Date;
}
