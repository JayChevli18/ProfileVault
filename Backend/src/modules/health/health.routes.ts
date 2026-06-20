import { Router } from "express";
import { getHealth } from "@/modules/health/health.controller";

const healthRouter = Router();

healthRouter.get("/health", getHealth);

export { healthRouter };
