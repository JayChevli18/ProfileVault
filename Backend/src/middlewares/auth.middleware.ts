import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "@/utils/AppError";
import { asyncHandler } from "@/utils/async-handler";
import { User } from "@/modules/user/user.model";
import { verifyAccessToken } from "@/services/token.service";

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Access token is required");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("Access token is required");
    }

    let payload;

    try {
      payload = verifyAccessToken(token);
    } catch {
      throw new UnauthorizedError("Invalid or expired access token");
    }

    const user = await User.findById(payload.userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedError("User not found or inactive");
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedError("Access token has been revoked");
    }

    req.user = user;
    next();
  }
);
