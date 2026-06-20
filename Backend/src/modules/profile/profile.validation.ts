import { z } from "zod";
import {
  PROFILE_EMAIL_REGEX,
  PROFILE_MOBILE_REGEX,
} from "@/constants/profile.constants";

const profileFieldsSchema = z.object({
  fullName: z
    .string({ required_error: "Full name is required" })
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  dob: z.coerce
    .date({ required_error: "Date of birth is required", invalid_type_error: "Invalid date of birth" })
    .refine((value) => value <= new Date(), {
      message: "Date of birth cannot be in the future",
    }),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .regex(PROFILE_EMAIL_REGEX, "Please provide a valid email address"),
  mobile: z
    .string({ required_error: "Mobile number is required" })
    .trim()
    .regex(PROFILE_MOBILE_REGEX, "Please provide a valid mobile number"),
  address: z
    .string({ required_error: "Address is required" })
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address cannot exceed 500 characters"),
});

export const createProfileSchema = profileFieldsSchema;

export const updateProfileSchema = profileFieldsSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update",
  });

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
