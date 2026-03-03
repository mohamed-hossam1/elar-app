"use server";
import { CACHE_TAGS } from "@/lib/cache/tags";
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

export async function revalidatePromoPaths(promoCodeId?: string | number) {
  updateTags([CACHE_TAGS.promoCodes]);

  if (promoCodeId) {
    updateTag(CACHE_TAGS.promoCode(promoCodeId));
  }
}

export async function revalidateDeliveryPaths(deliveryId?: number | string) {
  updateTags([CACHE_TAGS.delivery]);

  if (deliveryId) {
    updateTag(CACHE_TAGS.deliverySetting(deliveryId));
  }
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

export async function revalidateAddressPaths(addressId?: number | string) {
  updateTags([CACHE_TAGS.addresses]);

  if (addressId) {
    updateTag(CACHE_TAGS.address(addressId));
  }
}

export async function revalidateAnalyticsPaths() {
  updateTags([CACHE_TAGS.orders, CACHE_TAGS.users]);
}
