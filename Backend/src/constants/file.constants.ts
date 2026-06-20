export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const STORAGE_TYPES = ["local", "blob"] as const;

export type StorageTypeValue = (typeof STORAGE_TYPES)[number];
