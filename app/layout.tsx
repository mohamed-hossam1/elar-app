import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { StateProvider } from "@/providers/state-provider";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { satoshi, integralCF } from "@/lib/fonts";

import QueryProvider from "@/providers/query-provider";
import { Suspense } from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://elar.app"),
  title: {
    template: "%s | ELAR",
    default: "ELAR | Premium Fashion Store",
  },
  description:
    "Experience a curated collection of premium fashion designed for the modern individual.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://ik.imagekit.io" />
      </head>
      <body
        className={`${satoshi.variable} ${integralCF.variable} font-satoshi antialiased`}
      >
        <Suspense fallback={<div className="min-h-screen" />}>
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
              </ThemeProvider>
            </StateProvider>
          </QueryProvider>
        </Suspense>

        <Analytics />
      </body>
    </html>
  );
}
