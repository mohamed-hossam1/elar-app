export const CACHE_TAGS = {
  products: "products",
  categories: "categories",
  delivery: "delivery",
  promoCodes: "promo-codes",
  orders: "orders",
  users: "users",

  product:   (id: number | string) => `product:${id}`,
  category:  (id: number | string) => `category:${id}`,
  order:     (id: number | string) => `order:${id}`,
  user:      (id: string)          => `user:${id}`,
};
