// RULE: Functions with "use cache" must use createAdminClient() (service role).
// Do NOT use createClient() (cookie-based) inside "use cache" contexts.
// Dynamic request APIs (cookies(), headers()) must not mix with cached execution.

export const CACHE_TAGS = {
  products: "products",
  categories: "categories",
  delivery: "delivery",
  promoCodes: "promo_codes",
  analytics: "analytics",
  orders: "orders",
  users: "users",
  addresses: "addresses",

  product:   (id: number | string) => `product:${id}`,
  category:  (id: number | string) => `category:${id}`,
  deliverySetting: (id: number | string) => `delivery:${id}`,
  order:     (id: number | string) => `order:${id}`,
  user:      (id: string)          => `user:${id}`,
  promoCode: (id: number | string) => `promoCode:${id}`,
  address:   (id: number | string) => `address:${id}`,
};
