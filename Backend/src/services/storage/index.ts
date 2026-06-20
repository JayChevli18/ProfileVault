import { env } from "@/config/env";
import { BlobStorageProvider } from "@/services/storage/BlobStorageProvider";
import { LocalStorageProvider } from "@/services/storage/LocalStorageProvider";
import { StorageProvider } from "@/services/storage/StorageProvider";

let storageProviderInstance: StorageProvider | null = null;

export function createStorageProvider(): StorageProvider {
  if (env.useBlobStorage) {
    return new BlobStorageProvider();
  }

  return new LocalStorageProvider();
}

export function getStorageProvider(): StorageProvider {
  if (!storageProviderInstance) {
    storageProviderInstance = createStorageProvider();
  }

  return storageProviderInstance;
}

export function resetStorageProvider(): void {
  storageProviderInstance = null;
}

export { StorageProvider } from "@/services/storage/StorageProvider";
export { LocalStorageProvider } from "@/services/storage/LocalStorageProvider";
export { BlobStorageProvider } from "@/services/storage/BlobStorageProvider";
