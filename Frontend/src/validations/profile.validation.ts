import { z } from "zod";
import {
  PROFILE_EMAIL_REGEX,
  PROFILE_MOBILE_REGEX,
} from "@/constants/profile.constants";

export const profileFormSchema = z.object({
  fullName: z
    .string({ error: "Full name is required" })
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  dob: z
    .string({ error: "Date of birth is required" })
    .min(1, "Date of birth is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Invalid date of birth",
    })
    .refine((value) => new Date(value) <= new Date(), {
      message: "Date of birth cannot be in the future",
    }),
  email: z
    .string({ error: "Email is required" })
    .trim()
    .toLowerCase()
    .regex(PROFILE_EMAIL_REGEX, "Please provide a valid email address"),
  mobile: z
    .string({ error: "Mobile number is required" })
    .trim()
    .regex(PROFILE_MOBILE_REGEX, "Please provide a valid mobile number"),
  address: z
    .string({ error: "Address is required" })
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address cannot exceed 500 characters"),
});

export type ProfileFormInput = z.infer<typeof profileFormSchema>;
