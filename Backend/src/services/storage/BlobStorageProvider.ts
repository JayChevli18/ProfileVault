import { del, put } from "@vercel/blob";
import { env } from "@/config/env";
import type {
  DeleteFilePayload,
  StoredFile,
  UploadFile,
} from "@/types/storage";
import { StorageProvider } from "@/services/storage/StorageProvider";

export class BlobStorageProvider extends StorageProvider {
  async upload(file: UploadFile): Promise<StoredFile> {
    const blob = await put(file.originalName, file.buffer, {
      access: "public",
      token: env.blobReadWriteToken,
      contentType: file.mimeType,
      addRandomSuffix: true,
    });

    return {
      storageType: "blob",
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      url: blob.url,
      uploadedAt: new Date(),
    };
  }

  async delete(file: DeleteFilePayload): Promise<void> {
    await del(file.url, { token: env.blobReadWriteToken });
  }
}
