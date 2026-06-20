import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/async-handler";
import {
  getProfileDocxBuffer,
  getProfilePdfBuffer,
} from "@/modules/document/document.service";

export const downloadProfilePdf = asyncHandler(async (req: Request, res: Response) => {
  const buffer = await getProfilePdfBuffer(req.user!._id.toString());

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="profile.pdf"');
  res.send(buffer);
});

export const downloadProfileDocx = asyncHandler(async (req: Request, res: Response) => {
  const buffer = await getProfileDocxBuffer(req.user!._id.toString());

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
  res.setHeader("Content-Disposition", 'attachment; filename="profile.docx"');
  res.send(buffer);
});
