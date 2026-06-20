import { connectDatabase, disconnectDatabase } from "@/config/database";
import { env, validateEnv } from "@/config/env";
import { Profile } from "@/modules/profile/profile.model";
import { User } from "@/modules/user/user.model";

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;
const TEST_USERNAME = `uploaduser_${Date.now()}`;
const TEST_PASSWORD = "password123";

const PROFILE_DATA = {
  fullName: "Upload Test User",
  dob: "1995-06-15",
  email: `upload.${Date.now()}@example.com`,
  mobile: "9876543210",
  address: "123 Upload Street, Mumbai, India",
};

interface ApiResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

async function requestJson<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ status: number; body: ApiResult<T> }> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const body = (await response.json()) as ApiResult<T>;

  return { status: response.status, body };
}

async function verifyUpload(): Promise<void> {
  validateEnv();

  if (!env.useBlobStorage) {
    throw new Error("USE_BLOB_STORAGE must be true for blob upload verification");
  }

  await connectDatabase();

  console.log(`Storage provider: ${env.useBlobStorage ? "blob" : "local"}`);

  const register = await requestJson<{ accessToken: string }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username: TEST_USERNAME,
      password: TEST_PASSWORD,
    }),
  });

  if (!register.body.data?.accessToken) {
    throw new Error("User registration failed");
  }

  const token = register.body.data.accessToken;
  const authHeader = { Authorization: `Bearer ${token}` };

  const createProfile = await requestJson("/api/profile", {
    method: "POST",
    headers: authHeader,
    body: JSON.stringify(PROFILE_DATA),
  });

  if (createProfile.status !== 201) {
    throw new Error("Profile creation failed");
  }

  console.log("Testing POST /api/upload");

  const pngBuffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64"
  );

  const formData = new FormData();
  formData.append(
    "file",
    new Blob([pngBuffer], { type: "image/png" }),
    "verify-upload.png"
  );

  const uploadResponse = await fetch(`${BASE_URL}/api/upload`, {
    method: "POST",
    headers: authHeader,
    body: formData,
  });

  const uploadBody = (await uploadResponse.json()) as ApiResult<{
    storageType: string;
    url: string;
    mimeType: string;
    originalName: string;
  }>;

  if (
    uploadResponse.status !== 201 ||
    !uploadBody.success ||
    uploadBody.data?.storageType !== "blob" ||
    !uploadBody.data?.url.startsWith("http")
  ) {
    throw new Error("File upload to Vercel Blob failed");
  }

  console.log("Upload successful:", uploadBody.data);

  const profile = await Profile.findOne({
    userId: (await User.findOne({ username: TEST_USERNAME }))?._id,
  });

  if (!profile || profile.documents.length === 0) {
    throw new Error("Uploaded file metadata was not saved to profile");
  }

  console.log("Metadata saved to profile");

  const user = await User.findOne({ username: TEST_USERNAME });

  if (user) {
    await Profile.deleteOne({ userId: user._id });
    await User.deleteOne({ _id: user._id });
  }

  await disconnectDatabase();
  console.log("Phase 6 upload verification passed.");
}

verifyUpload().catch(async (error: Error) => {
  console.error("Phase 6 upload verification failed:", error.message);
  await disconnectDatabase().catch(() => undefined);
  process.exit(1);
});
