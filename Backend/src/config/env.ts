import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export interface EnvConfig {
  port: number;
  nodeEnv: string;
  mongodbUri: string;
  jwtSecret: string;
  jwtAccessExpiresIn: string;
  jwtRefreshExpiresIn: string;
  useBlobStorage: boolean;
  blobReadWriteToken: string;
  clientUrl: string;
  uploadsDir: string;
  logsDir: string;
}

function parseBoolean(value: string | undefined, defaultValue = false): boolean {
  if (value === undefined || value === "") {
    return defaultValue;
  }

  return value === "true" || value === "1";
}

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const useBlobStorage = parseBoolean(process.env.USE_BLOB_STORAGE, false);

export const env: EnvConfig = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  useBlobStorage,
  blobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN || "",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3002",
  uploadsDir: "uploads",
  logsDir: "logs",
};

export function validateEnv(): void {
  requireEnv("MONGODB_URI");
  requireEnv("JWT_SECRET");

  if (env.useBlobStorage && !env.blobReadWriteToken) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is required when USE_BLOB_STORAGE=true"
    );
  }
}
