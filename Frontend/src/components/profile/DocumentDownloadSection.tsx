import { useMutation } from "@tanstack/react-query";
import { FileDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  downloadProfileDocx,
  downloadProfilePdf,
} from "@/services/document.service";
import { getApiErrorMessage } from "@/types/api";

export function DocumentDownloadSection() {
  const pdfMutation = useMutation({
    mutationFn: downloadProfilePdf,
    onSuccess: () => {
      toast.success("PDF download started");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to download PDF"));
    },
  });

  const docxMutation = useMutation({
    mutationFn: downloadProfileDocx,
    onSuccess: () => {
      toast.success("DOCX download started");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to download DOCX"));
    },
  });

  const isDownloading = pdfMutation.isPending || docxMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Documents</CardTitle>
        <CardDescription>
          Download your profile details as PDF or DOCX.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => pdfMutation.mutate()}
          disabled={isDownloading}
        >
          <FileDown className="size-4" />
          {pdfMutation.isPending ? "Preparing PDF..." : "Download PDF"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => docxMutation.mutate()}
          disabled={isDownloading}
        >
          <FileDown className="size-4" />
          {docxMutation.isPending ? "Preparing DOCX..." : "Download DOCX"}
        </Button>
      </CardContent>
    </Card>
  );
}
