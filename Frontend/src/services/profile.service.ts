import { isAxiosError } from "axios";
import apiClient from "@/lib/api-client";
import type { ApiSuccessResponse } from "@/types/api";
import type { Profile } from "@/types/profile";
import type { ProfileFormInput } from "@/validations/profile.validation";

export function isNotFoundError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 404;
}

export async function getProfile(): Promise<Profile | null> {
  try {
    const response = await apiClient.get<ApiSuccessResponse<Profile>>(
      "/api/profile"
    );

    if (!response.data.success || !response.data.data) {
      return null;
    }

    return response.data.data;
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }

    throw error;
  }
}

export async function createProfile(input: ProfileFormInput): Promise<Profile> {
  const response = await apiClient.post<ApiSuccessResponse<Profile>>(
    "/api/profile",
    input
  );

  if (!response.data.success || !response.data.data) {
    throw new Error("Failed to create profile");
  }

  return response.data.data;
}

export async function updateProfile(input: ProfileFormInput): Promise<Profile> {
  const response = await apiClient.put<ApiSuccessResponse<Profile>>(
    "/api/profile",
    input
  );

  if (!response.data.success || !response.data.data) {
    throw new Error("Failed to update profile");
  }

  return response.data.data;
}
