import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { env } from "@/config/env";
import type {
  DeleteFilePayload,
  StoredFile,
  UploadFile,
} from "@/types/storage";
import { StorageProvider } from "@/services/storage/StorageProvider";

export class LocalStorageProvider extends StorageProvider {
  private readonly uploadDir: string;

  constructor() {
    super();
    this.uploadDir = path.join(process.cwd(), env.uploadsDir);
  }

  private async ensureUploadDir(): Promise<void> {
    await fs.mkdir(this.uploadDir, { recursive: true });
  }

  private buildStoredFileName(originalName: string): string {
    const extension = path.extname(originalName);
    const uniqueId = crypto.randomUUID();

    return `${uniqueId}${extension}`;
  }

  async upload(file: UploadFile): Promise<StoredFile> {
    await this.ensureUploadDir();

    const storedFileName = this.buildStoredFileName(file.originalName);
    const filePath = path.join(this.uploadDir, storedFileName);

    await fs.writeFile(filePath, file.buffer);

    return {
      storageType: "local",
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      url: storedFileName,
      uploadedAt: new Date(),
    };
  }

  async delete(file: DeleteFilePayload): Promise<void> {
    const filePath = path.join(this.uploadDir, file.url);
    await fs.unlink(filePath);
  }
}
