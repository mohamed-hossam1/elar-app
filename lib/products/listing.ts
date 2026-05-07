import { ProductListingQuery, SortOption } from "@/types/Product";

export const DEFAULT_PAGE_SIZE = 20;


export function normalizeListingQuery(params: { [key: string]: string | string[] | undefined }): ProductListingQuery {
  const search = typeof params.search === 'string' ? params.search.trim() : undefined;
  const category = typeof params.category === 'string' ? params.category : undefined;

    const validSorts: SortOption[] = ['newest', 'price_asc', 'price_desc', 'top_selling', 'new_arrivals'];
  const sort = (typeof params.sort === 'string' && validSorts.includes(params.sort as SortOption)) 
    ? (params.sort as SortOption) 
    : 'newest';

  const min_price = typeof params.min_price === 'string' ? Math.max(0, parseFloat(params.min_price)) : undefined;
  const max_price = typeof params.max_price === 'string' ? Math.max(0, parseFloat(params.max_price)) : undefined;

  const in_stock = params.in_stock === 'true';
  const on_sale = params.on_sale === 'true';

  const page = Math.max(1, parseInt(typeof params.page === 'string' ? params.page : '1') || 1);
  const pageSize = DEFAULT_PAGE_SIZE;


    let normalizedMaxPrice = max_price;
  if (min_price !== undefined && max_price !== undefined && max_price < min_price) {
    normalizedMaxPrice = min_price;
  }

  return {
    search: search || undefined,
    category,
    sort,
    min_price,
    max_price: normalizedMaxPrice,
    in_stock,
    on_sale,
    page,
    pageSize,
  };
}


export function serializeListingQuery(query: Partial<ProductListingQuery>): string {
  const params = new URLSearchParams();

  if (query.search) params.set('search', query.search);
  if (query.category) params.set('category', query.category);
  if (query.sort && query.sort !== 'newest') params.set('sort', query.sort);
  if (query.min_price !== undefined) params.set('min_price', query.min_price.toString());
  if (query.max_price !== undefined) params.set('max_price', query.max_price.toString());
  if (query.in_stock) params.set('in_stock', 'true');
  if (query.on_sale) params.set('on_sale', 'true');
  if (query.page && query.page > 1) params.set('page', query.page.toString());

  return params.toString();
}
