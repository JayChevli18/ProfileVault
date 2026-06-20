import { getProfileByUserId } from "@/modules/profile/profile.service";
import { generateProfileDocx } from "@/services/document/docx.generator";
import { generateProfilePdf } from "@/services/document/pdf.generator";

export async function getProfilePdfBuffer(userId: string): Promise<Buffer> {
  const profile = await getProfileByUserId(userId);
  return generateProfilePdf(profile);
}

export async function getProfileDocxBuffer(userId: string): Promise<Buffer> {
  const profile = await getProfileByUserId(userId);
  return generateProfileDocx(profile);
}
