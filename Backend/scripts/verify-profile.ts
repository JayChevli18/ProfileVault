import { connectDatabase, disconnectDatabase } from "@/config/database";
import { validateEnv } from "@/config/env";
import { Profile } from "@/modules/profile/profile.model";
import { User } from "@/modules/user/user.model";

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;
const TEST_USERNAME = `profileuser_${Date.now()}`;
const TEST_PASSWORD = "password123";

const PROFILE_DATA = {
  fullName: "Jay Chevli",
  dob: "1995-06-15",
  email: `jay.${Date.now()}@example.com`,
  mobile: "9876543210",
  address: "123 Main Street, Mumbai, India",
};

interface ApiResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

async function request<T>(
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

async function verifyProfile(): Promise<void> {
  validateEnv();
  await connectDatabase();

  console.log("Registering test user");
  const register = await request<{ accessToken: string }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username: TEST_USERNAME,
      password: TEST_PASSWORD,
    }),
  });

  if (register.status !== 201 || !register.body.success || !register.body.data?.accessToken) {
    throw new Error("User registration failed");
  }

  const token = register.body.data.accessToken;
  const authHeader = { Authorization: `Bearer ${token}` };

  console.log("Testing POST /api/profile");
  const create = await request<{ fullName: string; email: string }>("/api/profile", {
    method: "POST",
    headers: authHeader,
    body: JSON.stringify(PROFILE_DATA),
  });

  if (
    create.status !== 201 ||
    !create.body.success ||
    create.body.data?.fullName !== PROFILE_DATA.fullName
  ) {
    throw new Error("Profile creation failed");
  }

  console.log("Profile creation successful");

  console.log("Testing GET /api/profile");
  const getProfile = await request<{ email: string }>("/api/profile", {
    headers: authHeader,
  });

  if (
    getProfile.status !== 200 ||
    !getProfile.body.success ||
    getProfile.body.data?.email !== PROFILE_DATA.email
  ) {
    throw new Error("Get profile failed");
  }

  console.log("Get profile successful");

  console.log("Testing PUT /api/profile");
  const update = await request<{ fullName: string; mobile: string }>("/api/profile", {
    method: "PUT",
    headers: authHeader,
    body: JSON.stringify({
      fullName: "Jay K Chevli",
      mobile: "9123456789",
    }),
  });

  if (
    update.status !== 200 ||
    !update.body.success ||
    update.body.data?.fullName !== "Jay K Chevli" ||
    update.body.data?.mobile !== "9123456789"
  ) {
    throw new Error("Profile update failed");
  }

  console.log("Profile update successful");

  const user = await User.findOne({ username: TEST_USERNAME });

  if (user) {
    await Profile.deleteOne({ userId: user._id });
    await User.deleteOne({ _id: user._id });
  }

  await disconnectDatabase();
  console.log("Phase 5 profile verification passed.");
}

verifyProfile().catch(async (error: Error) => {
  console.error("Phase 5 profile verification failed:", error.message);
  await disconnectDatabase().catch(() => undefined);
  process.exit(1);
});
