import { getPortfolioItemBySlug } from '@/lib/sanity/fetch';
import { notFound } from 'next/navigation';
import PortfolioItemPage from './page-client';
import { Metadata } from 'next';
import { getLocalizedField, extractTextFromPortableText } from '@/lib/sanity/utils';
import { urlFor } from '@/sanity/lib/image';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const portfolioItem = await getPortfolioItemBySlug(slug, locale as 'en' | 'fr');

  if (!portfolioItem) {
    return {
      title: 'Portfolio Item Not Found',
    };
  }

  const title = getLocalizedField(portfolioItem, locale as 'en' | 'fr', 'title');
  const seo = portfolioItem.seo;
  
  // Use SEO fields if available, otherwise generate from content
  const metaTitle = seo 
    ? (getLocalizedField(seo, locale as 'en' | 'fr', 'metaTitle') || `${title} | Ligne Carré`)
    : `${title} | Ligne Carré`;
  
  const description = seo
    ? (getLocalizedField(seo, locale as 'en' | 'fr', 'metaDescription') || extractTextFromPortableText(getLocalizedField(portfolioItem, locale as 'en' | 'fr', 'description')))
    : extractTextFromPortableText(getLocalizedField(portfolioItem, locale as 'en' | 'fr', 'description'));

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lignecarre.com';
  const currentSlug = locale === 'fr' ? portfolioItem.slug_fr?.current : portfolioItem.slug_en?.current;
  const currentUrl = `${baseUrl}/${locale}/portfolio/${currentSlug}`;
  const imageUrl = portfolioItem.image ? urlFor(portfolioItem.image).width(1200).height(630).url() : `${baseUrl}/images/logo_ligne.png`;

  return {
    title: metaTitle,
    description: description || `${title} - Architectural project by Ligne Carré`,
    openGraph: {
      title: metaTitle,
      description: description || `${title} - Architectural project by Ligne Carré`,
      url: currentUrl,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: description || `${title} - Architectural project by Ligne Carré`,
      images: [imageUrl],
    },
    alternates: {
      canonical: currentUrl,
      languages: {
        en: portfolioItem.slug_en?.current ? `${baseUrl}/en/portfolio/${portfolioItem.slug_en.current}` : undefined,
        fr: portfolioItem.slug_fr?.current ? `${baseUrl}/fr/portfolio/${portfolioItem.slug_fr.current}` : undefined,
      },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const portfolioItem = await getPortfolioItemBySlug(slug, locale as 'en' | 'fr');

  if (!portfolioItem) {
    notFound();
  }

  return (
    <PortfolioItemPage
      portfolioItem={portfolioItem}
      locale={locale as 'en' | 'fr'}
    />
  );
}

