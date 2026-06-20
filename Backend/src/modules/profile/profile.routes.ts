import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { validateBody } from "@/middlewares/validate.middleware";
import {
  createProfileHandler,
  getProfileHandler,
  updateProfileHandler,
} from "@/modules/profile/profile.controller";
import {
  createProfileSchema,
  updateProfileSchema,
} from "@/modules/profile/profile.validation";

const profileRouter = Router();

profileRouter.use(authenticate);

profileRouter.post("/", validateBody(createProfileSchema), createProfileHandler);
profileRouter.get("/", getProfileHandler);
profileRouter.put("/", validateBody(updateProfileSchema), updateProfileHandler);

export { profileRouter };
