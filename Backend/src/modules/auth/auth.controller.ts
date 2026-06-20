import type { Request, Response } from "express";
import { HTTP_STATUS } from "@/constants/http-status";
import { asyncHandler } from "@/utils/async-handler";
import { successResponse } from "@/utils/api-response";
import {
  changeUserPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "@/modules/auth/auth.service";
import type {
  ChangePasswordInput,
  LoginInput,
  RefreshTokenInput,
  RegisterInput,
} from "@/modules/auth/auth.validation";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as RegisterInput;
  const result = await registerUser(data);

  res.status(HTTP_STATUS.CREATED).json(
    successResponse(result, "Registration successful")
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as LoginInput;
  const result = await loginUser(data);

  res.status(HTTP_STATUS.OK).json(successResponse(result, "Login successful"));
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as RefreshTokenInput;
  const result = await refreshAccessToken(data);

  res.status(HTTP_STATUS.OK).json(
    successResponse(result, "Token refreshed successfully")
  );
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await getCurrentUser(req.user!._id.toString());

  res.status(HTTP_STATUS.OK).json(successResponse(user));
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const result = await logoutUser(req.user!._id.toString());

  res.status(HTTP_STATUS.OK).json(successResponse(result, result.message));
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as ChangePasswordInput;
  const result = await changeUserPassword(req.user!._id.toString(), data);

  res.status(HTTP_STATUS.OK).json(
    successResponse(result, "Password changed successfully")
  );
});
