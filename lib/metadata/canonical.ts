import { SEO_CONFIG } from '../seo-config';

function getBaseUrl(): string {
  return SEO_CONFIG.SITE_URL.replace(/\/+$/, '').toLowerCase();
}

function normalizePath(path: string = ''): string {
  if (!path) return '';

  let normalized = decodeURIComponent(path.trim());

  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }

  normalized = normalized.replace(/\/{2,}/g, '/');

  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }

  return normalized.toLowerCase();
}

export function getCanonicalUrl(path: string = ''): string {
  const baseUrl = getBaseUrl();
  const normalizedPath = normalizePath(path);

  return normalizedPath ? `${baseUrl}${normalizedPath}` : baseUrl;
}

export function getCanonicalUrlWithPage(
  path: string,
  page: number
): string {
  const base = getCanonicalUrl(path);

  if (!page || page <= 1) return base;

  return `${base}?page=${page}`;
}