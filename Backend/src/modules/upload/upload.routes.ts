import { Router } from "express";
import { uploadSingleFile } from "@/config/multer.config";
import { authenticate } from "@/middlewares/auth.middleware";
import { uploadFile } from "@/modules/upload/upload.controller";

const uploadRouter = Router();

uploadRouter.post("/", authenticate, uploadSingleFile, uploadFile);

export { uploadRouter };
