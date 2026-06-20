import type { Server } from "http";
import { createApp } from "@/app";
import { connectDatabase, disconnectDatabase } from "@/config/database";
import { env, validateEnv } from "@/config/env";
import { logger } from "@/config/logger";

let server: Server | undefined;
let isShuttingDown = false;

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  logger.info(`Shutting down (${signal})...`);

  const forceExitTimer = setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 5000);

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server!.close((error) => (error ? reject(error) : resolve()));
      });
      server = undefined;
    }

    await disconnectDatabase();
    clearTimeout(forceExitTimer);
    logger.info("Shutdown complete");
    process.exit(0);
  } catch (error) {
    clearTimeout(forceExitTimer);
    logger.error("Error during shutdown", {
      message: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

function registerShutdownHandlers(): void {
  const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];

  for (const signal of signals) {
    process.on(signal, () => {
      void shutdown(signal);
    });
  }

  if (process.platform === "win32") {
    process.on("SIGBREAK", () => {
      void shutdown("SIGBREAK");
    });
  }
}

async function bootstrap(): Promise<void> {
  registerShutdownHandlers();

  validateEnv();
  await connectDatabase();

  const app = createApp();

  server = app.listen(env.port, () => {
    logger.info(`Server started on port ${env.port}`, {
      environment: env.nodeEnv,
      clientUrl: env.clientUrl,
    });
  });
}

bootstrap().catch((error: Error) => {
  logger.error("Failed to start server", {
    message: error.message,
    stack: error.stack,
  });
  process.exit(1);
});
