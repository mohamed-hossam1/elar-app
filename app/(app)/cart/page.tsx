import Cart from "@/components/cart/Cart";
import { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/metadata/canonical";
import { getOgMetadata, getTwitterCardMetadata } from "@/lib/metadata/socialCards";
import { getWebsiteSchema } from "@/lib/metadata/structuredData";

export const metadata: Metadata = {
  title: "Shopping Cart | ELAR",
  description:
    "Review your selected fashion items and proceed to a secure checkout at ELAR Egypt.",
  alternates: {
    canonical: getCanonicalUrl("/cart"),
  },
  openGraph: getOgMetadata(
    "Shopping Cart | ELAR",
    "Review your selected fashion items and proceed to a secure checkout at ELAR Egypt.",
    "/cart"
  ),
  twitter: getTwitterCardMetadata(
    "Shopping Cart | ELAR",
    "Review your selected fashion items and proceed to a secure checkout at ELAR Egypt."
  ),
};


export default function CartPage() {
  const websiteSchema = getWebsiteSchema();

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Cart />
    </div>
  );
}
