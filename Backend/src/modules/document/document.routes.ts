import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import {
  downloadProfileDocx,
  downloadProfilePdf,
} from "@/modules/document/document.controller";

const documentRouter = Router();

documentRouter.use(authenticate);

documentRouter.get("/pdf", downloadProfilePdf);
documentRouter.get("/docx", downloadProfileDocx);

export { documentRouter };
