import bcrypt from "bcryptjs";
import { BCRYPT_SALT_ROUNDS } from "@/constants/auth.constants";
import { ConflictError, UnauthorizedError } from "@/utils/AppError";
import { hashToken } from "@/utils/token-hash";
import { User } from "@/modules/user/user.model";
import type { IUserDocument } from "@/modules/user/user.types";
import type {
  AuthTokenResponse,
  AuthUserResponse,
  MessageResponse,
} from "@/modules/auth/auth.types";
import type {
  ChangePasswordInput,
  LoginInput,
  RefreshTokenInput,
  RegisterInput,
} from "@/modules/auth/auth.validation";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/services/token.service";

function toAuthUser(user: IUserDocument): AuthUserResponse {
  return {
    id: user._id.toString(),
    username: user.username,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function persistRefreshToken(
  userId: string,
  refreshToken: string
): Promise<void> {
  await User.findByIdAndUpdate(userId, {
    refreshTokenHash: hashToken(refreshToken),
  });
}

async function createAuthResponse(user: IUserDocument): Promise<AuthTokenResponse> {
  const refreshToken = signRefreshToken({
    userId: user._id.toString(),
    tokenVersion: user.tokenVersion,
  });

  await persistRefreshToken(user._id.toString(), refreshToken);

  return {
    user: toAuthUser(user),
    accessToken: signAccessToken({
      userId: user._id.toString(),
      username: user.username,
      tokenVersion: user.tokenVersion,
    }),
    refreshToken,
  };
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

async function comparePassword(
  candidatePassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, hashedPassword);
}

async function revokeAllUserTokens(user: IUserDocument): Promise<void> {
  user.tokenVersion += 1;
  user.refreshTokenHash = null;
  await user.save();
}

export async function registerUser(input: RegisterInput): Promise<AuthTokenResponse> {
  const existingUser = await User.findOne({ username: input.username });

  if (existingUser) {
    throw new ConflictError("Username is already taken");
  }

  const hashedPassword = await hashPassword(input.password);

  const user = await User.create({
    username: input.username,
    password: hashedPassword,
  });

  return createAuthResponse(user);
}

export async function loginUser(input: LoginInput): Promise<AuthTokenResponse> {
  const user = await User.findOne({ username: input.username }).select(
    "+password +refreshTokenHash"
  );

  if (!user || !user.isActive) {
    throw new UnauthorizedError("Invalid username or password");
  }

  const isPasswordValid = await comparePassword(input.password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid username or password");
  }

  user.lastLoginAt = new Date();
  await user.save();

  return createAuthResponse(user);
}

export async function refreshAccessToken(
  input: RefreshTokenInput
): Promise<AuthTokenResponse> {
  let payload;

  try {
    payload = verifyRefreshToken(input.refreshToken);
  } catch {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }

  const user = await User.findById(payload.userId).select("+refreshTokenHash");

  if (!user || !user.isActive) {
    throw new UnauthorizedError("User not found or inactive");
  }

  if (user.tokenVersion !== payload.tokenVersion) {
    throw new UnauthorizedError("Refresh token has been revoked");
  }

  if (!user.refreshTokenHash || user.refreshTokenHash !== hashToken(input.refreshToken)) {
    throw new UnauthorizedError("Refresh token has been revoked");
  }

  return createAuthResponse(user);
}

export async function getCurrentUser(userId: string): Promise<AuthUserResponse> {
  const user = await User.findById(userId);

  if (!user || !user.isActive) {
    throw new UnauthorizedError("User not found or inactive");
  }

  return toAuthUser(user);
}

export async function changeUserPassword(
  userId: string,
  input: ChangePasswordInput
): Promise<AuthTokenResponse> {
  const user = await User.findById(userId).select("+password +refreshTokenHash");

  if (!user || !user.isActive) {
    throw new UnauthorizedError("User not found or inactive");
  }

  const isCurrentPasswordValid = await comparePassword(
    input.currentPassword,
    user.password
  );

  if (!isCurrentPasswordValid) {
    throw new UnauthorizedError("Current password is incorrect");
  }

  user.password = await hashPassword(input.newPassword);
  await revokeAllUserTokens(user);

  return createAuthResponse(user);
}

export async function logoutUser(userId: string): Promise<MessageResponse> {
  const user = await User.findById(userId).select("+refreshTokenHash");

  if (!user) {
    throw new UnauthorizedError("User not found or inactive");
  }

  await revokeAllUserTokens(user);

  return { message: "Logged out successfully" };
}
