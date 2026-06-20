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

export interface UploadProgressOptions {
  onUploadProgress?: (progress: number) => void;
}

export async function uploadProfileDocument(
  file: File,
  options?: UploadProgressOptions
): Promise<Profile> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<ApiSuccessResponse<unknown>>(
    "/api/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (event) => {
        if (!options?.onUploadProgress || !event.total) {
          return;
        }

        const progress = Math.round((event.loaded / event.total) * 100);
        options.onUploadProgress(progress);
      },
    }
  );

  if (!response.data.success) {
    throw new Error("Upload failed");
  }

  const profileResponse = await apiClient.get<ApiSuccessResponse<Profile>>(
    "/api/profile"
  );

  if (!profileResponse.data.success || !profileResponse.data.data) {
    throw new Error("Failed to refresh profile after upload");
  }

  return profileResponse.data.data;
}
