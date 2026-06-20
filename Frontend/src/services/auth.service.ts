import apiClient from "@/lib/api-client";
import type { ApiSuccessResponse } from "@/types/api";
import type { AuthTokenResponse } from "@/types/auth";
import type { LoginInput, RegisterInput } from "@/validations/auth.validation";

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
