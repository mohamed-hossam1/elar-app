export type Product = {
  id: number;
  title: string;
  description: string | null;
  category_id: number | null;
  image_cover: string | null;
  is_deleted: boolean;
  created_at: string;
  new_arrival_rank: number | null;
  top_selling_rank: number | null;
  category_rank: number | null;
};

export type ProductListItem = {
  id: number;
  title: string;
  image_cover: string | null;
  created_at: string;

  new_arrival_rank: number | null;
  top_selling_rank: number | null;
  category_rank: number | null;
  category_id: number | null;

  min_price: number;
  min_price_before: number;
};

export type ProductVariant = {
  id: number;
  product_id: number;
  color: string;
  size: string;
  price: number;
  price_before: number | null;
  stock: number;
  sku: string | null;
};

export type ProductImage = {
  id: number;
  product_id: number;
  url: string;
};

export type ProductDetails = Product & {
  variants: ProductVariant[];
  images: ProductImage[];
};


export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'top_selling' | 'new_arrivals';

export type ProductListingQuery = {
  search?: string;
  category?: string;
  sort: SortOption;
  min_price?: number;
  max_price?: number;
  in_stock: boolean;
  on_sale: boolean;
  page: number;
  pageSize: number;
};

export type ProductPaginationState = {
  data: ProductListItem[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};
