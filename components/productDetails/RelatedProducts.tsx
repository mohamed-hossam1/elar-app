import { getRelatedProducts } from "@/lib/queries/products";
import CardList from "../showProducts/CardList";

export default async function RelatedProducts({
  categoryId,
  productId,
}: {
  categoryId: number;
  productId: number;
}) {
  const productsRes = await getRelatedProducts(categoryId, productId);

  const products = productsRes.success ? productsRes.data : [];

  if (products.length === 0) return null;

  return (
    <div>
      <CardList products={products} />
    </div>
  );
}
