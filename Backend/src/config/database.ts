import mongoose from "mongoose";
import { env } from "@/config/env";
import { logger } from "@/config/logger";
import "@/modules/user/user.model";
import "@/modules/profile/profile.model";
// import { Profile } from "@/modules/profile/profile.model";
// import { User } from "@/modules/user/user.model";

mongoose.set("strictQuery", true);

export async function connectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    return;
  }

  await mongoose.connect(env.mongodbUri);

  // await User.syncIndexes();
  // await Profile.syncIndexes();

  logger.info("MongoDB connected", {
    database: mongoose.connection.name,
    host: mongoose.connection.host,
  });
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  // await mongoose.connection.close(false); // more aggressive than disconnect
  await mongoose.disconnect();
  logger.info("MongoDB disconnected");
}

export function getDatabaseConnectionState(): string {
  const states: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  return states[mongoose.connection.readyState] ?? "unknown";
}
