import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { StateProvider } from "@/providers/state-provider";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";

import QueryProvider from "@/providers/query-provider";

export const metadata: Metadata = {
  metadataBase: new URL('https://elar.app'),
  title: {
    template: "%s | ELAR",
    default: "ELAR | Premium Fashion Store",
  },
  description: "Experience a curated collection of premium fashion designed for the modern individual.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <StateProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />

              <Analytics />
            </ThemeProvider>
          </StateProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
