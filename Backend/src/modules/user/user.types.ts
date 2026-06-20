import type { Document, Model } from "mongoose";

export interface IUser {
  username: string;
  password: string;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}

export type IUserModel = Model<IUserDocument>;

export type UserCreateInput = Pick<IUser, "username" | "password">;

export type SafeUser = Omit<IUser, "password">;
