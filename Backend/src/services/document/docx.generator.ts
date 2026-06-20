import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import type { ProfileResponse } from "@/modules/profile/profile.types";
import { formatProfileDate } from "@/utils/date-format";

function createFieldParagraph(label: string, value: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true }),
      new TextRun({ text: value }),
    ],
    spacing: { after: 200 },
  });
}

export async function generateProfileDocx(profile: ProfileResponse): Promise<Buffer> {
  const document = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: "ProfileVault",
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "Profile Document",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 300 },
          }),
          createFieldParagraph("Full Name", profile.fullName),
          createFieldParagraph("Date of Birth", formatProfileDate(profile.dob)),
          createFieldParagraph("Email", profile.email),
          createFieldParagraph("Mobile", profile.mobile),
          createFieldParagraph("Address", profile.address),
          createFieldParagraph("Documents", profile.documents.map((document) => `\n-File Name: ${document.originalName}\nFile URL: ${document.url}`).join("\n")),
          new Paragraph({
            children: [
              new TextRun({
                text: `Generated on ${formatProfileDate(new Date())}`,
                italics: true,
                size: 20,
                color: "666666",
              }),
            ],
            spacing: { before: 400 },
          }),
        ],
      },
    ],
  });

  return Packer.toBuffer(document);
}
