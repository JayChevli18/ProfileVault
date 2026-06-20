import mongoose, { Schema } from "mongoose";
import type { IUserDocument, IUserModel } from "@/modules/user/user.types";

const userSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minlength: [8, "Password must be at least 8 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    refreshTokenHash: {
      type: String,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.password;
        delete ret.refreshTokenHash;
        return ret;
      },
    },
  }
);

export const User: IUserModel =
  (mongoose.models.User as IUserModel) ||
  mongoose.model<IUserDocument, IUserModel>("User", userSchema);
