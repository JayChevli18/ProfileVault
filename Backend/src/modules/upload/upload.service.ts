import { BadRequestError, NotFoundError } from "@/utils/AppError";
import { toAllowedMimeType } from "@/config/multer.config";
import { Profile } from "@/modules/profile/profile.model";
import type { UploadedFileResponse } from "@/modules/upload/upload.types";
import { getStorageProvider } from "@/services/storage/index";

export async function uploadProfileDocument(
  userId: string,
  file: Express.Multer.File
): Promise<UploadedFileResponse> {
  if (!file) {
    throw new BadRequestError("File is required");
  }

  const profile = await Profile.findOne({ userId });

  if (!profile) {
    throw new NotFoundError("Profile not found. Create a profile before uploading documents");
  }

  const mimeType = toAllowedMimeType(file.mimetype);
  const storageProvider = getStorageProvider();

  const storedFile = await storageProvider.upload({
    originalName: file.originalname,
    mimeType,
    size: file.size,
    buffer: file.buffer,
  });

  profile.documents.push({
    storageType: storedFile.storageType,
    originalName: storedFile.originalName,
    mimeType,
    size: storedFile.size,
    url: storedFile.url,
    uploadedAt: storedFile.uploadedAt,
  });

  await profile.save();

  const uploadedDocument = profile.documents[profile.documents.length - 1];

  return {
    id: uploadedDocument._id?.toString() ?? "",
    storageType: uploadedDocument.storageType,
    originalName: uploadedDocument.originalName,
    mimeType: uploadedDocument.mimeType,
    size: uploadedDocument.size,
    url: uploadedDocument.url,
    uploadedAt: uploadedDocument.uploadedAt,
  };
}
