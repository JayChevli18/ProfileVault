export interface AuthUserResponse {
  id: string;
  username: string;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokenResponse {
  user: AuthUserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface MessageResponse {
  message: string;
}
