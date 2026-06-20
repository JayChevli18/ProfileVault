import { ZodError } from "zod";

export function formatZodErrors(error: ZodError): Array<{ field: string; message: string }> {
  return error.errors.map((issue) => ({
    field: issue.path.join(".") || "body",
    message: issue.message,
  }));
}
