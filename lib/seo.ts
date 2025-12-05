import { Metadata } from 'next';
import { getLocalizedField, extractTextFromPortableText } from '@/lib/sanity/utils';
import { getLocalizedPath } from '@/lib/routing';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lignecarre.com';

/**
 * Generate metadata for pages that use pageContent
 */
export function generatePageMetadata(
  pageContent: any,
  locale: 'en' | 'fr',
  route: '/' | '/about' | '/services' | '/portfolio' | '/news' | '/careers' | '/contact' | '/privacy'
): Metadata {
  const title = pageContent ? getLocalizedField(pageContent, locale, 'title') : '';
  const seo = pageContent?.seo;
  
  // Use SEO fields if available, otherwise generate from content
  const metaTitle = seo 
    ? (getLocalizedField(seo, locale, 'metaTitle') || `${title} | Ligne Carré`)
    : (title ? `${title} | Ligne Carré` : 'Ligne Carré');
  
  const description = seo
    ? (getLocalizedField(seo, locale, 'metaDescription') || extractTextFromPortableText(getLocalizedField(pageContent, locale, 'content')))
    : extractTextFromPortableText(getLocalizedField(pageContent, locale, 'content'));

  const currentPath = getLocalizedPath(route, locale);
  const currentUrl = `${baseUrl}${currentPath}`;
  const ogLocale = locale === 'fr' ? 'fr_CA' : 'en_CA';

  return {
    title: metaTitle,
    description: description || `${title} - Ligne Carré`,
    openGraph: {
      title: metaTitle,
      description: description || `${title} - Ligne Carré`,
      url: currentUrl,
      siteName: 'Ligne Carré Inc.',
      locale: ogLocale,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/images/logo_ligne.png`,
          width: 1200,
          height: 630,
          alt: 'Ligne Carré Inc.',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: description || `${title} - Ligne Carré`,
      images: [`${baseUrl}/images/logo_ligne.png`],
    },
    alternates: {
      canonical: currentUrl,
      languages: {
        en: `${baseUrl}${getLocalizedPath(route, 'en')}`,
        fr: `${baseUrl}${getLocalizedPath(route, 'fr')}`,
        'x-default': `${baseUrl}${getLocalizedPath(route, 'en')}`,
      },
    },
  };
}

/**
 * Generate metadata for listing pages (portfolio, news, services)
 */
export function generateListingMetadata(
  locale: 'en' | 'fr',
  route: '/portfolio' | '/news' | '/services',
  titleKey: string
): Metadata {
  const titles: Record<string, Record<string, string>> = {
    '/portfolio': {
      en: 'Portfolio | Ligne Carré',
      fr: 'Portfolio | Ligne Carré',
    },
    '/news': {
      en: 'News | Ligne Carré',
      fr: 'Actualités | Ligne Carré',
    },
    '/services': {
      en: 'Services | Ligne Carré',
      fr: 'Nos Services | Ligne Carré',
    },
  };

  const descriptions: Record<string, Record<string, string>> = {
    '/portfolio': {
      en: 'Explore our portfolio of architectural projects including residential, commercial, institutional, and cultural sports projects.',
      fr: 'Découvrez notre portfolio de projets architecturaux incluant des projets résidentiels, commerciaux, institutionnels et culturels sportifs.',
    },
    '/news': {
      en: 'Stay updated with the latest news and updates from Ligne Carré.',
      fr: 'Restez informé des dernières nouvelles et mises à jour de Ligne Carré.',
    },
    '/services': {
      en: 'Professional architectural design and project management services in Montreal.',
      fr: 'Services professionnels de conception architecturale et de gestion de projet à Montréal.',
    },
  };

  const currentPath = getLocalizedPath(route, locale);
  const currentUrl = `${baseUrl}${currentPath}`;
  const ogLocale = locale === 'fr' ? 'fr_CA' : 'en_CA';

  return {
    title: titles[route][locale],
    description: descriptions[route][locale],
    openGraph: {
      title: titles[route][locale],
      description: descriptions[route][locale],
      url: currentUrl,
      siteName: 'Ligne Carré Inc.',
      locale: ogLocale,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/images/logo_ligne.png`,
          width: 1200,
          height: 630,
          alt: 'Ligne Carré Inc.',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[route][locale],
      description: descriptions[route][locale],
      images: [`${baseUrl}/images/logo_ligne.png`],
    },
    alternates: {
      canonical: currentUrl,
      languages: {
        en: `${baseUrl}${getLocalizedPath(route, 'en')}`,
        fr: `${baseUrl}${getLocalizedPath(route, 'fr')}`,
        'x-default': `${baseUrl}${getLocalizedPath(route, 'en')}`,
      },
    },
  };
}

