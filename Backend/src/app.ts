import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "@/config/env";
import { morganStream } from "@/config/logger";
import { errorHandler, notFoundHandler } from "@/middlewares/error.middleware";
import { authRouter } from "@/modules/auth/auth.routes";
import { healthRouter } from "@/modules/health/health.routes";
import { profileRouter } from "@/modules/profile/profile.routes";
import { uploadRouter } from "@/modules/upload/upload.routes";

export function createApp(): express.Application {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    morgan(env.nodeEnv === "production" ? "combined" : "dev", {
      stream: morganStream,
    })
  );

  app.use(healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/profile", profileRouter);
  app.use("/api/upload", uploadRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
