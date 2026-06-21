import apiClient from "@/lib/api-client";
import type { ApiSuccessResponse } from "@/types/api";
import type { AuthTokenResponse } from "@/types/auth";
import type {
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
} from "@/validations/auth.validation";

export async function loginUser(input: LoginInput): Promise<AuthTokenResponse> {
  const response = await apiClient.post<ApiSuccessResponse<AuthTokenResponse>>(
    "/api/auth/login",
    input
  );

  if (!response.data.success || !response.data.data) {
    throw new Error("Login failed");
  }

  return response.data.data;
}

export async function registerUser(
  input: RegisterInput
): Promise<AuthTokenResponse> {
  const response = await apiClient.post<ApiSuccessResponse<AuthTokenResponse>>(
    "/api/auth/register",
    input
  );

  if (!response.data.success || !response.data.data) {
    throw new Error("Registration failed");
  }

  return response.data.data;
}

export async function logoutUser(): Promise<void> {
  await apiClient.post("/api/auth/logout");
}

export async function changePassword(
  input: Pick<ChangePasswordInput, "currentPassword" | "newPassword">
): Promise<void> {
  const response = await apiClient.put<ApiSuccessResponse<null>>(
    "/api/auth/change-password",
    input
  );

  if (!response.data.success) {
    throw new Error("Failed to change password");
  }
}
