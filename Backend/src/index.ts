import type { Server } from "http";
import { createApp } from "@/app";
import { connectDatabase, disconnectDatabase } from "@/config/database";
import { env, validateEnv } from "@/config/env";
import { logger } from "@/config/logger";

let server: Server | undefined;
let isShuttingDown = false;

// --------------------------------------------------
// SERVICE LAYER (replace all consumers/workers here)
// --------------------------------------------------

async function initializeServices(): Promise<void> {
  logger.info("Initializing services...");

  await connectDatabase();
  logger.info("Services initialized");
}

// --------------------------------------------------

async function freeDevPort(): Promise<void> {
  if (env.nodeEnv !== "development") return;

  try {
    const { default: killPort } = await import("kill-port");
    await killPort(env.port);
    await new Promise((r) => setTimeout(r, 300));
  } catch {
    // ignore
  }
}

// --------------------------------------------------

async function closeResources(): Promise<void> {
  if (server) {
    server.closeAllConnections?.();

    await new Promise<void>((resolve, reject) => {
      server!.close((err) => (err ? reject(err) : resolve()));
    });

    server = undefined;
  }

  await disconnectDatabase();
}

// --------------------------------------------------

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) return;

  isShuttingDown = true;
  logger.info(`Shutting down (${signal})...`);

  const forceExitTimer = setTimeout(() => {
    logger.error("Forced shutdown timeout");
    process.exit(1);
  }, 10000);

  try {
    await closeResources();

    clearTimeout(forceExitTimer);
    logger.info("Shutdown complete");

    process.exit(0);
  } catch (error) {
    clearTimeout(forceExitTimer);

    logger.error("Shutdown error", {
      message: error instanceof Error ? error.message : String(error),
    });

    process.exit(1);
  }
}

// --------------------------------------------------

function registerShutdownHandlers(): void {
  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));

  if (process.platform === "win32") {
    process.on("SIGBREAK", () => void shutdown("SIGBREAK"));
  }
}

// --------------------------------------------------

async function bootstrap(): Promise<void> {
  registerShutdownHandlers();

  validateEnv();
  await freeDevPort();

  await initializeServices();

  const app = createApp();

  await new Promise<void>((resolve, reject) => {
    server = app.listen(env.port, () => {
      logger.info(`Server started on port ${env.port}`, {
        environment: env.nodeEnv,
        clientUrl: env.clientUrl,
      });
      resolve();
    });

    server.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        logger.error(
          `Port ${env.port} already in use. Run dev:clean or kill process.`
        );
      }
      reject(err);
    });
  });
}

// --------------------------------------------------

bootstrap().catch((error: Error) => {
  logger.error("Bootstrap failed", {
    message: error.message,
    stack: error.stack,
  });

  process.exit(1);
});