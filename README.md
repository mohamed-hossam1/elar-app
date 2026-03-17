# ELAR — Full-Stack E-Commerce Platform

A production-grade e-commerce application built to demonstrate end-to-end full-stack engineering across storefront UX, transactional backend logic, real-time admin tooling, and infrastructure concerns like caching, auth, image delivery, and SEO.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4, CVA, clsx + tailwind-merge |
| State Management | Zustand 5 (client), TanStack React Query 5 (server) |
| Backend / DB | Supabase (PostgreSQL + Auth + Row-Level Security) |
| Caching | Next.js `"use cache"` directive with custom cache tags |
| Image CDN | ImageKit (upload, transformation, blur placeholder) |
| Forms | Formik 2 + Yup 1 |
| UI Primitives | shadcn/ui (Radix Nova), Radix UI, Headless UI |
| Animations | Motion (Framer Motion) 12 |
| Drag & Drop | dnd-kit (core, sortable, utilities) |
| Package Manager | npm |

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     Next.js App Router                   │
│  ┌───────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ Storefront│  │  Auth    │  │  Admin   │  │   API    │ │
│  │ Pages     │  │  Pages   │  │  Pages   │  │  Routes  │ │
│  └────┬──────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘ │
│       │              │             │             │       │
│  ┌────▼──────────────▼─────────────▼─────────────▼──────┐│
│  │               Server Actions + Queries               ││
│  │          (Cached with "use cache" + custom tags)     ││
│  └────────────────────────┬─────────────────────────────┘│
│                           │                              │
│  ┌────────────────────────▼─────────────────────────────┐│
│  │              Supabase (PostgreSQL + Auth)            ││
│  │          ImageKit CDN  │  Vercel Analytics           ││
│  └──────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

### Key Design Decisions

**Server Components by default.** Interactive islands use `"use client"` boundaries. All data fetching happens server-side where possible, minimizing client bundle size.

**Server Actions for all mutations.** Cart operations, auth, orders, and every admin CRUD operation goes through `"use server"` functions — no dedicated REST endpoints for mutations.

**Two Supabase clients.** A cookie-based SSR client (`createClient`) handles user-scoped requests. A service-role admin client (`createAdminClient`) is used exclusively inside `"use cache"` contexts to avoid mixing dynamic request APIs with cached execution.

**Custom cache tag system.** Every cached query is tagged (e.g. `product:42`, `orders`, `promo_codes`). Mutations call `updateTag()` on the relevant tags, giving fine-grained on-demand revalidation without global cache busting.

**Guest-first checkout.** A UUID-based guest ID is persisted in a browser cookie. Guests can browse, add to cart, and complete checkout without an account. On sign-in, the guest cart is merged into the user's cart server-side.

**Server-side order validation.** Prices, stock levels, delivery fees, and coupon constraints are all re-validated on the server at `createOrder` time. Client-submitted totals are compared against server-computed values and rejected on mismatch.

---

## Project Structure

```
app/
  (admin)/admin/       # Admin dashboard pages (analytics, products, orders, etc.)
  (app)/               # Storefront pages (home, products, cart, checkout, orders)
  (auth)/              # Sign-in / sign-up pages
  api/upload/          # ImageKit auth + delete API routes

actions/               # Server Actions — one file per domain
  cartAction.ts
  ordersAction.ts
  productsAction.ts
  userAction.ts
  ...

components/
  admin/               # Admin UI components (tables, forms, charts, rank editor)
  cart/                # Cart list and order summary
  checkout/            # Multi-step checkout (address, payment)
  home/                # Hero, product sections, category grid
  navbar/              # Sticky nav, search, user menu, cart icon
  productDetails/      # Image slider, variant picker, FAQ accordion
  products/            # Listing, filters sidebar, pagination
  profile/             # Account settings, address management
  skeleton/            # Loading skeletons for every major view

lib/
  auth/admin.ts        # getCurrentUserProfile, isAdminRole, requireAdmin
  cache/               # Cache tags and revalidation helpers
  queries/             # Cached server-side data fetching (products, orders, etc.)
  products/listing.ts  # Query normalization and serialization
  metadata/            # Canonical URLs, OG cards, JSON-LD schemas
  supabase/            # Client, server, admin, and middleware Supabase instances

stores/
  cartStore.ts         # Zustand cart store with optimistic updates
  userStore.ts         # Zustand user store with lazy initialization

types/                 # TypeScript interfaces for all domain entities
```

---

## Notable Implementation Details

### Caching Strategy

Queries in `lib/queries/` use Next.js's `"use cache"` directive with `cacheTag()` and `cacheLife()`. Tags map to domain entities and are structured hierarchically:

```ts
// lib/cache/tags.ts
export const CACHE_TAGS = {
  products: "products",
  product: (id) => `product:${id}`,
  orders: "orders",
  order: (id) => `order:${id}`,
  // ...
};
```

Mutations invalidate only the affected tags:

```ts
// After updating a product
updateTag(CACHE_TAGS.products);
updateTag(CACHE_TAGS.product(productId));
```

### Cart with Optimistic Updates

The Zustand cart store applies state changes locally before the server call completes. On server error, it rolls back to the previous state and re-fetches from the server:

```ts
// Optimistic apply
applyCart(updatedCart);

try {
  const result = await updateQuantity(item.id, quantity);
  if (!result.success) {
    applyCart(originalCart); // rollback
    await get().initCart();  // re-sync
  }
} catch {
  applyCart(originalCart);
}
```

### Order Validation (Server-Side)

`createOrder` re-fetches all variant prices, stock levels, delivery fees, and coupon state from the database. It then computes the expected totals and rejects the request if they differ from the client-submitted values:

```ts
// Price mismatch → reject
if (roundCurrency(orderData.subtotal) !== serverSubtotal) {
  return { success: false, message: "Cart totals changed." };
}
```

### Image Pipeline

Images are uploaded from the browser via the ImageKit SDK after fetching a signed upload token from `/api/upload/auth`. Files are compressed client-side (WebP/AVIF, max 0.5MB) before upload using a custom `compressImage` utility built on the Canvas API. The custom `ImageOptimization` component wraps `next/image` with an ImageKit loader and a CSS-based blur placeholder generated from a low-quality `/tr:w-40,q-10,bl-90` transform URL.

### Admin Analytics

The analytics dashboard computes KPIs, revenue trends, status distributions, top products, and customer retention metrics entirely in TypeScript from raw order and user data. There are no aggregation stored procedures — all computation runs server-side in `lib/queries/analytics.ts` against data fetched from Supabase.

### SEO

Every page generates canonical URLs, Open Graph tags, Twitter cards, and JSON-LD structured data (Organization, WebSite, BreadcrumbList, Product schemas). Metadata is composed through a set of utility functions in `lib/metadata/`.

---

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project (PostgreSQL + Auth)
- An ImageKit account

### Setup

```bash
git clone https://github.com/your-username/elar-store.git
cd elar-store
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

```bash
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

### Deployment

Optimized for Vercel. Production config in `next.config.ts`: gzip compression, no `X-Powered-By` header, no source maps, ImageKit + Supabase remote patterns.

```bash
vercel --prod
```

---

## Features Implemented

**Storefront**
- Product catalog with grid/list views, category + price + stock + sale filters, sort options, and pagination
- Product detail pages with image gallery/slider, color + size variant picker, quantity selector, and FAQ accordion
- Related products by category
- Shopping cart with optimistic quantity updates and stock enforcement
- Guest checkout with UUID cookie persistence and cart merge on sign-in
- Multi-step checkout: address selection → payment method → order review
- Promo code validation (percentage and fixed, with min purchase and expiry checks)
- Order history with status tracking

**Admin Dashboard**
- Analytics: KPIs (revenue, AOV, unique buyers, repeat buyer rate), trend charts, order status and payment distributions, top products table, recent transactions
- Full CRUD for products (with color/size/price/stock variants and gallery images)
- Bulk variant generator with color picker and size presets
- Drag-and-drop product ranking for category, top-selling, and new-arrival placements
- Order management with search, status/payment/date filters, and inline status updates
- Promo code management (percentage/fixed discounts, expiry, max uses, active toggle)
- Delivery fee management by city
- User management with role assignment and account deactivation