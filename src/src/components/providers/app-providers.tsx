"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { domAnimation, LazyMotion, MotionConfig } from "framer-motion";
import { ThemeProvider, useTheme } from "next-themes";
import { useState } from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ApiError } from "@/lib/api/client";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10_000,
        refetchOnWindowFocus: true,
        // Do not hammer the server on auth or validation errors.
        retry: (count, error) =>
          !(
            error instanceof ApiError &&
            error.status >= 400 &&
            error.status < 500
          ) && count < 2,
      },
    },
  });
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <MotionConfig reducedMotion="user">
          <LazyMotion features={domAnimation} strict>
            <TooltipProvider>{children}</TooltipProvider>
          </LazyMotion>
        </MotionConfig>
        <ThemedToaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

/** Sonner needs the resolved theme explicitly, otherwise it stays light in dark mode. */
function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="bottom-right"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "bg-surface-raised text-ink border border-hairline shadow-e2 rounded-[var(--radius-lg)]",
          description: "text-ink-2",
          error: "border-l-[3px] border-l-danger",
        },
      }}
    />
  );
}
