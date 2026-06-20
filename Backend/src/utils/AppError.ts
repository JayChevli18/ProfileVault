import { HTTP_STATUS } from "@/constants/http-status";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors?: unknown;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    errors?: unknown,
    isOperational = true
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", errors?: unknown) {
    super(HTTP_STATUS.BAD_REQUEST, message, errors);
    this.name = "BadRequestError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(HTTP_STATUS.NOT_FOUND, message);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(HTTP_STATUS.UNAUTHORIZED, message);
    this.name = "UnauthorizedError";
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", errors?: unknown) {
    super(HTTP_STATUS.CONFLICT, message, errors);
    this.name = "ConflictError";
  }
}
