import PDFDocument from "pdfkit";
import type { ProfileResponse } from "@/modules/profile/profile.types";
import { formatProfileDate } from "@/utils/date-format";

function addProfileFields(doc: PDFKit.PDFDocument, profile: ProfileResponse): void {
  const fields: Array<[string, string]> = [
    ["Full Name", profile.fullName],
    ["Date of Birth", formatProfileDate(profile.dob)],
    ["Email", profile.email],
    ["Mobile", profile.mobile],
    ["Address", profile.address],
    ["Documents", profile.documents.map((document) => `\n-File Name: ${document.originalName}\nFile URL: ${document.url}`).join("\n")],
  ];

  for (const [label, value] of fields) {
    doc.font("Helvetica-Bold").text(`${label}:`, { continued: true });
    doc.font("Helvetica").text(` ${value}`);
    doc.moveDown(0.5);
  }
}

export function generateProfilePdf(profile: ProfileResponse): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).font("Helvetica-Bold").text("ProfileVault", { align: "center" });
    doc.fontSize(14).font("Helvetica").text("Profile Document", { align: "center" });
    doc.moveDown(1.5);

    addProfileFields(doc, profile);

    doc.moveDown(1);
    doc
      .fontSize(10)
      .fillColor("#666666")
      .text(`Generated on ${formatProfileDate(new Date())}`, { align: "right" });

    doc.end();
  });
}
