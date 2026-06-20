export interface AuthUser {
  id: string;
  username: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokenResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
}
