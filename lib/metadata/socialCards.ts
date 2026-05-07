import { Metadata } from 'next';
import { SEO_CONFIG } from '../seo-config';
import { getCanonicalUrl } from './canonical';

export function getOgMetadata(
  title?: string,
  description?: string,
  path: string = '',
  image?: string,
  type: 'website' | 'article' = 'website'
): Metadata['openGraph'] {
  return {
    title: title || SEO_CONFIG.SITE_NAME,
    description: description || SEO_CONFIG.SITE_DESCRIPTION,
    url: getCanonicalUrl(path),
    siteName: SEO_CONFIG.SITE_NAME,
    images: [
      {
        url: image || SEO_CONFIG.DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${title || SEO_CONFIG.SITE_NAME} | ELAR Egypt`,
      },
    ],
    locale: 'en_EG',
    alternateLocale: ['ar_EG'],
    type: type as any,
  };
}

export function getTwitterCardMetadata(
  title?: string,
  description?: string,
  image?: string
): Metadata['twitter'] {
  return {
    card: 'summary_large_image',
    title: title || `${SEO_CONFIG.SITE_NAME} | Men's Fashion Egypt`,
    description:
      description ||
      'Shop men clothing in Egypt. Discover stylish outfits, t-shirts, shirts, and more with fast delivery.',
    images: [image || SEO_CONFIG.DEFAULT_OG_IMAGE],
    creator: '@elar',
  };
}