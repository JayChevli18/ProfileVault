import jwt from "jsonwebtoken";
import { TOKEN_TYPES } from "@/constants/auth.constants";
import { env } from "@/config/env";

export interface AccessTokenPayload {
  userId: string;
  username: string;
  tokenVersion: number;
  type: typeof TOKEN_TYPES.ACCESS;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
  type: typeof TOKEN_TYPES.REFRESH;
}

function parsePayload<T extends AccessTokenPayload | RefreshTokenPayload>(
  decoded: unknown,
  expectedType: T["type"]
): T {
  if (typeof decoded === "string" || !decoded || typeof decoded !== "object") {
    throw new Error("Invalid token payload");
  }

  const payload = decoded as T;

  if (!payload.userId || payload.type !== expectedType) {
    throw new Error("Invalid token payload");
  }

  if (typeof payload.tokenVersion !== "number") {
    throw new Error("Invalid token payload");
  }

  return payload;
}

export function signAccessToken(payload: Omit<AccessTokenPayload, "type">): string {
  return jwt.sign({ ...payload, type: TOKEN_TYPES.ACCESS }, env.jwtSecret, {
    expiresIn: env.jwtAccessExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

export function signRefreshToken(payload: Omit<RefreshTokenPayload, "type">): string {
  return jwt.sign({ ...payload, type: TOKEN_TYPES.REFRESH }, env.jwtSecret, {
    expiresIn: env.jwtRefreshExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.jwtSecret);
  const payload = parsePayload<AccessTokenPayload>(decoded, TOKEN_TYPES.ACCESS);

  if (!payload.username) {
    throw new Error("Invalid token payload");
  }

  return payload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, env.jwtSecret);
  return parsePayload<RefreshTokenPayload>(decoded, TOKEN_TYPES.REFRESH);
}
