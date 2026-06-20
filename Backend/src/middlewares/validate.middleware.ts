import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodSchema } from "zod";
import { BadRequestError } from "@/utils/AppError";
import { formatZodErrors } from "@/utils/zod-error";

export function validateBody<T>(schema: ZodSchema<T>): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(new BadRequestError("Validation failed", formatZodErrors(result.error)));
    }

    req.body = result.data;
    next();
  };
}
