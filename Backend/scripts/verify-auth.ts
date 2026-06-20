import { connectDatabase, disconnectDatabase } from "@/config/database";
import { validateEnv } from "@/config/env";
import { User } from "@/modules/user/user.model";

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;
const TEST_USERNAME = `testuser_${Date.now()}`;
const TEST_PASSWORD = "password123";
const NEW_PASSWORD = "newpassword123";

interface ApiResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

interface AuthData {
  accessToken: string;
  refreshToken: string;
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

async function verifyAuth(): Promise<void> {
  validateEnv();
  await connectDatabase();

  console.log("Testing POST /api/auth/register");
  const register = await request<AuthData>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username: TEST_USERNAME,
      password: TEST_PASSWORD,
    }),
  });

  if (
    register.status !== 201 ||
    !register.body.success ||
    !register.body.data?.accessToken ||
    !register.body.data?.refreshToken
  ) {
    throw new Error("Registration failed");
  }

  const initialAccessToken = register.body.data.accessToken;
  const initialRefreshToken = register.body.data.refreshToken;
  console.log("Registration successful");

  console.log("Testing POST /api/auth/login");
  const login = await request<AuthData>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      username: TEST_USERNAME,
      password: TEST_PASSWORD,
    }),
  });

  if (login.status !== 200 || !login.body.success || !login.body.data?.accessToken) {
    throw new Error("Login failed");
  }

  const accessToken = login.body.data.accessToken;
  const refreshToken = login.body.data.refreshToken;
  console.log("Login successful");

  console.log("Testing GET /api/auth/me");
  const me = await request<{ username: string }>("/api/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (me.status !== 200 || !me.body.success || me.body.data?.username !== TEST_USERNAME) {
    throw new Error("Get current user failed");
  }

  console.log("Get current user successful");

  console.log("Testing POST /api/auth/refresh");
  const refresh = await request<AuthData>("/api/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  if (
    refresh.status !== 200 ||
    !refresh.body.success ||
    !refresh.body.data?.accessToken ||
    !refresh.body.data?.refreshToken
  ) {
    throw new Error("Refresh token failed");
  }

  const refreshedAccessToken = refresh.body.data.accessToken;
  console.log("Refresh token successful");

  console.log("Testing PUT /api/auth/change-password");
  const changePassword = await request<AuthData>("/api/auth/change-password", {
    method: "PUT",
    headers: { Authorization: `Bearer ${refreshedAccessToken}` },
    body: JSON.stringify({
      currentPassword: TEST_PASSWORD,
      newPassword: NEW_PASSWORD,
    }),
  });

  if (
    changePassword.status !== 200 ||
    !changePassword.body.success ||
    !changePassword.body.data?.accessToken
  ) {
    throw new Error("Change password failed");
  }

  const newAccessToken = changePassword.body.data.accessToken;
  console.log("Change password successful");

  console.log("Testing revoked old access token");
  const revokedAccess = await request("/api/auth/me", {
    headers: { Authorization: `Bearer ${initialAccessToken}` },
  });

  if (revokedAccess.status !== 401) {
    throw new Error("Old access token should be revoked after password change");
  }

  console.log("Old access token correctly revoked");

  console.log("Testing revoked old refresh token");
  const revokedRefresh = await request("/api/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken: initialRefreshToken }),
  });

  if (revokedRefresh.status !== 401) {
    throw new Error("Old refresh token should be revoked after password change");
  }

  console.log("Old refresh token correctly revoked");

  console.log("Testing new access token after password change");
  const profileAfterChange = await request("/api/auth/me", {
    headers: { Authorization: `Bearer ${newAccessToken}` },
  });

  if (profileAfterChange.status !== 200 || !profileAfterChange.body.success) {
    throw new Error("New access token should work after password change");
  }

  console.log("New access token works after password change");

  console.log("Testing POST /api/auth/logout");
  const logout = await request("/api/auth/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${newAccessToken}` },
  });

  if (logout.status !== 200 || !logout.body.success) {
    throw new Error("Logout failed");
  }

  console.log("Logout successful");

  console.log("Testing revoked token after logout");
  const revokedAfterLogout = await request("/api/auth/me", {
    headers: { Authorization: `Bearer ${newAccessToken}` },
  });

  if (revokedAfterLogout.status !== 401) {
    throw new Error("Access token should be revoked after logout");
  }

  console.log("Access token correctly revoked after logout");

  await User.deleteOne({ username: TEST_USERNAME });
  await disconnectDatabase();

  console.log("Authentication verification passed.");
}

verifyAuth().catch(async (error: Error) => {
  console.error("Authentication verification failed:", error.message);
  await disconnectDatabase().catch(() => undefined);
  process.exit(1);
});
