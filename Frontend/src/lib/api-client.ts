import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import {
  clearStoredAuth,
  getStoredAuth,
  persistAuth,
} from "@/lib/auth-storage";
import type { ApiSuccessResponse } from "@/types/api";
import type { AuthTokenResponse } from "@/types/auth";

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string | null> | null = null;

function getAccessToken(): string | null {
  return getStoredAuth().accessToken;
}

function getRefreshToken(): string | null {
  return getStoredAuth().refreshToken;
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearStoredAuth();
    return null;
  }

  try {
    const response = await axios.post<ApiSuccessResponse<AuthTokenResponse>>(
      `${env.apiUrl}/api/auth/refresh`,
      { refreshToken }
    );

    if (!response.data.success || !response.data.data) {
      clearStoredAuth();
      return null;
    }

    persistAuth(response.data.data);
    return response.data.data.accessToken;
  } catch {
    clearStoredAuth();
    return null;
  }
}

function queueTokenRefresh(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/api/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const newAccessToken = await queueTokenRefresh();

    if (!newAccessToken) {
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    return apiClient(originalRequest);
  }
);

export default apiClient;
