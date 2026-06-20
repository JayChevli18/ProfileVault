import type { AllowedMimeType, StorageTypeValue } from "@/constants/file.constants";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES, STORAGE_TYPES } from "@/constants/file.constants";
import { Schema } from "mongoose";

export const profileDocumentSchema = new Schema(
  {
    storageType: {
      type: String,
      enum: STORAGE_TYPES,
      required: [true, "Storage type is required"],
    },
    originalName: {
      type: String,
      required: [true, "Original file name is required"],
      trim: true,
    },
    mimeType: {
      type: String,
      enum: ALLOWED_MIME_TYPES,
      required: [true, "MIME type is required"],
    },
    size: {
      type: Number,
      required: [true, "File size is required"],
      min: [1, "File size must be greater than 0"],
      max: [MAX_FILE_SIZE_BYTES, "File size cannot exceed 5 MB"],
    },
    url: {
      type: String,
      required: [true, "File URL is required"],
      trim: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

export type ProfileDocumentSchema = {
  storageType: StorageTypeValue;
  originalName: string;
  mimeType: AllowedMimeType;
  size: number;
  url: string;
  uploadedAt: Date;
};
