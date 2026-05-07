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
