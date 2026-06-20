import type {
  DeleteFilePayload,
  StoredFile,
  UploadFile,
} from "@/types/storage";

export abstract class StorageProvider {
  abstract upload(file: UploadFile): Promise<StoredFile>;

  abstract delete(file: DeleteFilePayload): Promise<void>;
}
