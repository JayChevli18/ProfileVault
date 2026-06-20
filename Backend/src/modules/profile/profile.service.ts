import { ConflictError, NotFoundError } from "@/utils/AppError";
import { Profile } from "@/modules/profile/profile.model";
import type {
  IProfileDocument,
  ProfileResponse,
} from "@/modules/profile/profile.types";
import type {
  CreateProfileInput,
  UpdateProfileInput,
} from "@/modules/profile/profile.validation";

function toProfileResponse(profile: IProfileDocument): ProfileResponse {
  return {
    id: profile._id.toString(),
    userId: profile.userId.toString(),
    fullName: profile.fullName,
    dob: profile.dob,
    email: profile.email,
    mobile: profile.mobile,
    address: profile.address,
    documents: profile.documents.map((document) => ({
      id: document._id?.toString() ?? "",
      storageType: document.storageType,
      originalName: document.originalName,
      mimeType: document.mimeType,
      size: document.size,
      url: document.url,
      uploadedAt: document.uploadedAt,
    })),
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

export async function createProfile(
  userId: string,
  input: CreateProfileInput
): Promise<ProfileResponse> {
  const existingProfile = await Profile.findOne({ userId });

  if (existingProfile) {
    throw new ConflictError("Profile already exists for this user");
  }

  const profile = await Profile.create({
    userId,
    ...input,
  });

  return toProfileResponse(profile);
}

export async function getProfileByUserId(userId: string): Promise<ProfileResponse> {
  const profile = await Profile.findOne({ userId });

  if (!profile) {
    throw new NotFoundError("Profile not found");
  }

  return toProfileResponse(profile);
}

export async function updateProfile(
  userId: string,
  input: UpdateProfileInput
): Promise<ProfileResponse> {
  const profile = await Profile.findOne({ userId });

  if (!profile) {
    throw new NotFoundError("Profile not found");
  }

  Object.assign(profile, input);
  await profile.save();

  return toProfileResponse(profile);
}
