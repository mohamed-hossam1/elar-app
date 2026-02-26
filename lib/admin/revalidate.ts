"use server"
import { CACHE_TAGS } from "@/constants/cacheTages";
import { updateTag } from "next/cache";


function updateTags(tags: string[]) {
  for (const tag of tags) {
    updateTag(tag);
  }
}

export async function revalidateCatalogPaths(productId?: number | string) {
  updateTags([CACHE_TAGS.products, CACHE_TAGS.categories]);

  if (productId) {
    updateTag(CACHE_TAGS.product(productId));
  }
}

export async function revalidateCategoryPaths(categoryId?: number | string) {
  updateTags([CACHE_TAGS.categories]);

  if (categoryId) {
    updateTag(CACHE_TAGS.category(categoryId));
  }
}

export async function revalidatePromoPaths(promoId?: number | string) {
  updateTags([CACHE_TAGS.promoCodes]);
}

export async function revalidateDeliveryPaths(deliveryId?: number | string) {
  updateTags([CACHE_TAGS.delivery]);
}

export async function revalidateOrderPaths(orderId?: number | string) {
  updateTags([CACHE_TAGS.orders]);

  if (orderId) {
    updateTag(CACHE_TAGS.order(orderId));
  }
}

export async function revalidateUserPaths(userId?: string) {
  updateTags([CACHE_TAGS.users]);

  if (userId) {
    updateTag(CACHE_TAGS.user(userId));
  }
}
