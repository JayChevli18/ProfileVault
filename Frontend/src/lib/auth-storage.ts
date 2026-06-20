import type { AuthState, AuthTokenResponse } from "@/types/auth";

const ACCESS_TOKEN_KEY = "profilevault.accessToken";
const REFRESH_TOKEN_KEY = "profilevault.refreshToken";
const USER_KEY = "profilevault.user";

export function getStoredAuth(): AuthState {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const userRaw = localStorage.getItem(USER_KEY);

  if (!accessToken || !refreshToken || !userRaw) {
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
    };
  }

  try {
    return {
      user: JSON.parse(userRaw) as AuthState["user"],
      accessToken,
      refreshToken,
    };
  } catch {
    clearStoredAuth();
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
    };
  }
}

export function persistAuth(data: AuthTokenResponse): AuthState {
  localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));

  return {
    user: data.user,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
}

export function clearStoredAuth(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
