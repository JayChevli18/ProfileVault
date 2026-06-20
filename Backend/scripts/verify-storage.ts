import fs from "fs/promises";
import path from "path";
import { env, validateEnv } from "@/config/env";
import { getStorageProvider } from "@/services/storage/index";

async function verifyStorage(): Promise<void> {
  validateEnv();

  const provider = getStorageProvider();
  const providerName = env.useBlobStorage ? "blob" : "local";

  console.log(`Storage provider: ${providerName}`);
  console.log("MongoDB database: profile_vault");
  console.log(`Environment: ${env.nodeEnv}`);

  const testFile = {
    originalName: "phase1-verify.txt",
    mimeType: "text/plain",
    size: 13,
    buffer: Buffer.from("phase1-verify"),
  };

  const uploaded = await provider.upload(testFile);
  console.log("Upload successful:", uploaded);

  await provider.delete({
    url: uploaded.url,
    storageType: uploaded.storageType,
  });
  console.log("Delete successful");

  if (!env.useBlobStorage) {
    const verifyPath = path.join(process.cwd(), env.uploadsDir, uploaded.url);

    try {
      await fs.access(verifyPath);
      throw new Error("Local file was not deleted after cleanup");
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;

      if (nodeError.code !== "ENOENT") {
        throw error;
      }
    }
  }

  console.log("Phase 1 storage verification passed.");
}

verifyStorage().catch((error: Error) => {
  console.error("Phase 1 storage verification failed:", error.message);
  process.exit(1);
});
