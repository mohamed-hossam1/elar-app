import { getProductById } from "@/lib/queries/products";
import {
  getBreadcrumbSchema,
  getProductSchema,
} from "@/lib/metadata/structuredData";
import ProductDetails from "./ProductDetails";

export default async function ProductPageContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productRes = await getProductById(Number(id));
  const product = productRes.success ? productRes.data : null;

  const breadcrumbItems = [
    { name: "Home", item: "/" },
    { name: "Products", item: "/products" },
  ];

  if (product) {
    breadcrumbItems.push({ name: product.title, item: `/products/${id}` });
  }

  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);

  const productSchema = product
    ? getProductSchema({
        name: product.title,
        description: product.description || "",
        image: product.image_cover || "",
        price: product.variants[0]?.price.toString() || "0",
        currency: "EGP",
        path: `/products/${id}`,
        sku: product.variants[0]?.sku || undefined,
      })
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <ProductDetails product={product} />
    </>
  );
}
