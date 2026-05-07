import { CACHE_TAGS } from "@/constants/cacheTages";
import { revalidateTag } from "next/cache";


function revalidateTags(tags: string[]) {
  for (const tag of tags) {
    revalidateTag(tag, 'max');
  }
}

export function revalidateCatalogPaths(productId?: number | string) {
  revalidateTags([CACHE_TAGS.products, CACHE_TAGS.categories]);

  if (productId) {
    revalidateTag(CACHE_TAGS.product(productId), 'max');
  }
}

export function revalidateCategoryPaths(categoryId?: number | string) {
  revalidateTags([CACHE_TAGS.categories]);

  if (categoryId) {
    revalidateTag(CACHE_TAGS.category(categoryId), 'max');
  }
}

export function revalidatePromoPaths(promoId?: number | string) {
  revalidateTags([CACHE_TAGS.promoCodes]);
}

export function revalidateDeliveryPaths(deliveryId?: number | string) {
  revalidateTags([CACHE_TAGS.delivery]);
}

export function revalidateOrderPaths(orderId?: number | string) {
  revalidateTags([CACHE_TAGS.orders]);

  if (orderId) {
    revalidateTag(CACHE_TAGS.order(orderId), 'max');
  }
}

export function revalidateUserPaths(userId?: string) {
  revalidateTags([CACHE_TAGS.users]);

  if (userId) {
    revalidateTag(CACHE_TAGS.user(userId), 'max');
  }
}
