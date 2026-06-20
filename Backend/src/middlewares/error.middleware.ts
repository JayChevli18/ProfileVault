import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { HTTP_STATUS } from "@/constants/http-status";
import { env } from "@/config/env";
import { logger } from "@/config/logger";
import { AppError } from "@/utils/AppError";
import { errorResponse } from "@/utils/api-response";

function handleMongooseValidationError(error: mongoose.Error.ValidationError): AppError {
  const errors = Object.values(error.errors).map((item) => ({
    field: item.path,
    message: item.message,
  }));

  return new AppError(
    HTTP_STATUS.BAD_REQUEST,
    "Validation failed",
    errors
  );
}

function handleMongooseDuplicateKeyError(error: {
  keyValue?: Record<string, unknown>;
}): AppError {
  const field = error.keyValue ? Object.keys(error.keyValue)[0] : "field";

  return new AppError(
    HTTP_STATUS.CONFLICT,
    `Duplicate value for ${field}`,
    error.keyValue
  );
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(HTTP_STATUS.NOT_FOUND, `Route not found: ${req.originalUrl}`));
}

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  let appError: AppError;

  if (error instanceof AppError) {
    appError = error;
  } else if (error instanceof mongoose.Error.ValidationError) {
    appError = handleMongooseValidationError(error);
  } else if (
    error instanceof mongoose.mongo.MongoServerError &&
    error.code === 11000
  ) {
    appError = handleMongooseDuplicateKeyError(
      error as mongoose.mongo.MongoServerError & {
        keyValue?: Record<string, unknown>;
      }
    );
  } else {
    logger.error("Unhandled error", {
      message: error.message,
      stack: error.stack,
    });

    appError = new AppError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      env.nodeEnv === "production" ? "Internal server error" : error.message,
      undefined,
      false
    );
  }

  if (!appError.isOperational) {
    logger.error("Critical error", {
      message: appError.message,
      stack: error.stack,
    });
  } else {
    logger.warn("Operational error", {
      statusCode: appError.statusCode,
      message: appError.message,
    });
  }

  res.status(appError.statusCode).json(errorResponse(appError.message, appError.errors));
}
