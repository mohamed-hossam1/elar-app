import Footer from "@/components/footer/Footer";
import React, { Suspense } from "react";
import { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/metadata/canonical";
import {
  getOgMetadata,
  getTwitterCardMetadata,
} from "@/lib/metadata/socialCards";
import {
  getOrganizationSchema,
  getWebsiteSchema,
} from "@/lib/metadata/structuredData";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: {
    template: "%s | ELAR",
    default: "ELAR | Premium Men's Fashion in Egypt",
  },
  alternates: {
    canonical: getCanonicalUrl("/"),
  },
  openGraph: getOgMetadata(
    "ELAR | Men's Fashion Egypt",
    "Shop high-quality men's clothing in Egypt. Premium t-shirts, shirts, pants, and more with fast delivery.",
  ),
  twitter: getTwitterCardMetadata(
    "ELAR | Men's Fashion Egypt",
    "Shop high-quality men's clothing in Egypt. Premium t-shirts, shirts, pants, and more with fast delivery.",
  ),
};

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Suspense
        fallback={
          <div className="h-20 w-full bg-white border-b border-black" />
        }
      >
        <Navbar />
      </Suspense>
      {children}
      <Footer />
    </>
  );
}
