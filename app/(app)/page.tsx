
import { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/metadata/canonical";
import { getOgMetadata, getTwitterCardMetadata } from "@/lib/metadata/socialCards";

export const metadata: Metadata = {
  title: "ELAR | Premium Men's Fashion in Egypt",
  description:
    "Shop high-quality men's clothing in Egypt. Discover stylish outfits, t-shirts, shirts, and pants with high-quality fabrics and modern designs. Fast delivery across Egypt.",
  alternates: {
    canonical: getCanonicalUrl("/"),
  },
  openGraph: getOgMetadata(
    "ELAR | Premium Men's Fashion in Egypt",
    "Shop high-quality men's clothing in Egypt. Discover stylish outfits, t-shirts, shirts, and pants with high-quality fabrics and modern designs. Fast delivery across Egypt.",
    "/"
  ),
  twitter: getTwitterCardMetadata(
    "ELAR | Premium Men's Fashion in Egypt",
    "Shop high-quality men's clothing in Egypt. Discover stylish outfits, t-shirts, shirts, and pants with high-quality fabrics and modern designs. Fast delivery across Egypt."
  ),
};

export default function Home() {
  return (
    <main>

    </main>
  );
}

