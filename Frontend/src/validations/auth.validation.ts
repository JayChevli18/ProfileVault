import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string({ error: "Username is required" })
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters"),
  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  username: z
    .string({ error: "Username is required" })
    .trim()
    .toLowerCase(),
  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
