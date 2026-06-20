import apiClient from "@/lib/api-client";

function triggerFileDownload(blob: Blob, fileName: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function downloadProfilePdf(): Promise<void> {
  const response = await apiClient.get("/api/documents/pdf", {
    responseType: "blob",
  });

  triggerFileDownload(response.data as Blob, "profile.pdf");
}

export async function downloadProfileDocx(): Promise<void> {
  const response = await apiClient.get("/api/documents/docx", {
    responseType: "blob",
  });

  triggerFileDownload(response.data as Blob, "profile.docx");
}
