import type { Request, Response } from "express";
import { HTTP_STATUS } from "@/constants/http-status";
import { asyncHandler } from "@/utils/async-handler";
import { successResponse } from "@/utils/api-response";
import {
  createProfile,
  getProfileByUserId,
  updateProfile,
} from "@/modules/profile/profile.service";
import type {
  CreateProfileInput,
  UpdateProfileInput,
} from "@/modules/profile/profile.validation";

export const createProfileHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as CreateProfileInput;
  const profile = await createProfile(req.user!._id.toString(), data);

  res.status(HTTP_STATUS.CREATED).json(
    successResponse(profile, "Profile created successfully")
  );
});

export const getProfileHandler = asyncHandler(async (req: Request, res: Response) => {
  const profile = await getProfileByUserId(req.user!._id.toString());

  res.status(HTTP_STATUS.OK).json(successResponse(profile));
});

export const updateProfileHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as UpdateProfileInput;
  const profile = await updateProfile(req.user!._id.toString(), data);

  res.status(HTTP_STATUS.OK).json(
    successResponse(profile, "Profile updated successfully")
  );
});
