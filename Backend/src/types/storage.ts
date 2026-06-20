export type StorageType = "local" | "blob";

export interface UploadFile {
  originalName: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
}

export interface StoredFile {
  storageType: StorageType;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

export interface DeleteFilePayload {
  url: string;
  storageType: StorageType;
}
