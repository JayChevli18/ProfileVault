import type { Request, Response } from "express";
import { HTTP_STATUS } from "@/constants/http-status";
import { asyncHandler } from "@/utils/async-handler";
import { successResponse } from "@/utils/api-response";
import { uploadProfileDocument } from "@/modules/upload/upload.service";

export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
  const result = await uploadProfileDocument(req.user!._id.toString(), req.file!);

  res.status(HTTP_STATUS.CREATED).json(
    successResponse(result, "File uploaded successfully")
  );
});
