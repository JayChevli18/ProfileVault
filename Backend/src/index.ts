import { createApp } from "@/app";
import { connectDatabase } from "@/config/database";
import { env, validateEnv } from "@/config/env";
import { logger } from "@/config/logger";

async function bootstrap(): Promise<void> {
  validateEnv();
  await connectDatabase();

  const app = createApp();

  app.listen(env.port, () => {
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
