import type { Document, Model, Types } from "mongoose";
import type { AllowedMimeType, StorageTypeValue } from "@/constants/file.constants";

export interface IProfileDocumentFile {
  _id?: Types.ObjectId;
  storageType: StorageTypeValue;
  originalName: string;
  mimeType: AllowedMimeType;
  size: number;
  url: string;
  uploadedAt: Date;
}

export interface IProfile {
  userId: Types.ObjectId;
  fullName: string;
  dob: Date;
  email: string;
  mobile: string;
  address: string;
  documents: IProfileDocumentFile[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProfileDocument extends IProfile, Document {}

export type IProfileModel = Model<IProfileDocument>;

export type ProfileCreateInput = Omit<
  IProfile,
  "userId" | "documents" | "createdAt" | "updatedAt"
> & {
  userId: Types.ObjectId;
};

export type ProfileUpdateInput = Partial<
  Omit<IProfile, "userId" | "documents" | "createdAt" | "updatedAt">
>;

export interface ProfileDocumentResponse {
  id: string;
  storageType: StorageTypeValue;
  originalName: string;
  mimeType: AllowedMimeType;
  size: number;
  url: string;
  uploadedAt: Date;
}

export interface ProfileResponse {
  id: string;
  userId: string;
  fullName: string;
  dob: Date;
  email: string;
  mobile: string;
  address: string;
  documents: ProfileDocumentResponse[];
  createdAt: Date;
  updatedAt: Date;
}
