import { SEO_CONFIG } from '../seo-config';
import { getCanonicalUrl } from './canonical';
import { StructuredData } from './types';

export function getOrganizationSchema(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SEO_CONFIG.SITE_NAME,
    url: SEO_CONFIG.SITE_URL,
    logo: `${SEO_CONFIG.SITE_URL}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SEO_CONFIG.PHONE,
      contactType: 'customer service',
      areaServed: 'EG',
      availableLanguage: ['en', 'ar'],
      email: SEO_CONFIG.CONTACT_EMAIL,
    },
    sameAs: [
      SEO_CONFIG.SOCIAL_MEDIA.FACEBOOK,
      SEO_CONFIG.SOCIAL_MEDIA.INSTAGRAM,
      SEO_CONFIG.SOCIAL_MEDIA.TWITTER,
    ].filter(Boolean) as string[],
  };
}

export function getWebsiteSchema(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO_CONFIG.SITE_NAME,
    url: SEO_CONFIG.SITE_URL,
    inLanguage: 'en-EG',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SEO_CONFIG.SITE_URL}/products?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getBreadcrumbSchema(
  items: { name: string; item: string }[]
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.item),
    })),
  };
}

export function getProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: string;
  currency: string;
  sku?: string;
  brand?: string;
  path: string;
}): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [product.image],
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand || SEO_CONFIG.SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      url: getCanonicalUrl(product.path),
      priceCurrency: product.currency,
      price: product.price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
}