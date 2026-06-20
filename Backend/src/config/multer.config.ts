import multer from "multer";
import type { AllowedMimeType } from "@/constants/file.constants";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from "@/constants/file.constants";
import { BadRequestError } from "@/utils/AppError";

const allowedMimeTypes = new Set<string>(ALLOWED_MIME_TYPES);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(
        new BadRequestError(
          "Invalid file type. Allowed types: JPG, PNG, PDF"
        )
      );
    }

    callback(null, true);
  },
});

export const uploadSingleFile = upload.single("file");

export function toAllowedMimeType(mimeType: string): AllowedMimeType {
  if (!allowedMimeTypes.has(mimeType)) {
    throw new BadRequestError(
      "Invalid file type. Allowed types: JPG, PNG, PDF"
    );
  }

  return mimeType as AllowedMimeType;
}
