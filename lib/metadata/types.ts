export interface SiteConfig {
  siteName: string;
  siteUrl: string;
  description: string;
  defaultOgImage: string;

  language: string; 
  region: string;   

  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };

  contactEmail?: string;
  phone?: string;

  keywords: string[];
}

export interface PageMetadataProps {
  title?: string;
  description?: string;
  canonicalPath?: string;

  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';

  noIndex?: boolean;

  keywords?: string[];
  locale?: string; 

    alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
}

export interface StructuredData {
  '@context': 'https://schema.org';

  '@type':
    | 'WebSite'
    | 'Organization'
    | 'Product'
    | 'BreadcrumbList'
    | 'WebPage';

  [key: string]: any;
}