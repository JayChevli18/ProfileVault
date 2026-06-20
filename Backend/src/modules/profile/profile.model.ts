import mongoose, { Schema } from "mongoose";
import { profileDocumentSchema } from "@/modules/profile/document.schema";
import type { IProfileDocument, IProfileModel } from "@/modules/profile/profile.types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^\+?[0-9]{10,15}$/;

const profileSchema = new Schema<IProfileDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
      validate: {
        validator(value: Date) {
          return value <= new Date();
        },
        message: "Date of birth cannot be in the future",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [EMAIL_REGEX, "Please provide a valid email address"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      match: [MOBILE_REGEX, "Please provide a valid mobile number"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      minlength: [5, "Address must be at least 5 characters"],
      maxlength: [500, "Address cannot exceed 500 characters"],
    },
    documents: {
      type: [profileDocumentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Profile: IProfileModel =
  (mongoose.models.Profile as IProfileModel) ||
  mongoose.model<IProfileDocument, IProfileModel>("Profile", profileSchema);
