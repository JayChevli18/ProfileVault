import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";
import { validateBody } from "@/middlewares/validate.middleware";
import {
  changePassword,
  getMe,
  login,
  logout,
  refreshToken,
  register,
} from "@/modules/auth/auth.controller";
import {
  changePasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "@/modules/auth/auth.validation";

const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.post("/refresh", validateBody(refreshTokenSchema), refreshToken);
authRouter.get("/me", authenticate, getMe);
authRouter.post("/logout", authenticate, logout);
authRouter.put("/change-password", authenticate, validateBody(changePasswordSchema), changePassword);

export { authRouter };
