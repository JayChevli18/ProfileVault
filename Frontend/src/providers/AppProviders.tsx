import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "@/lib/query-client";
import { AuthProvider } from "@/providers/AuthProvider";
import { router } from "@/routes";

export function AppProviders() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster richColors closeButton position="top-right" />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
