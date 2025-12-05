import { getBannerImages, getSiteSettings, getServices, getFeaturedPortfolioItems, getNewsArticles } from '@/lib/sanity/fetch';
import HomePage from './page-client';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [bannerImages, siteSettings, services, portfolioItems, newsArticles] = await Promise.all([
    getBannerImages(),
    getSiteSettings(),
    getServices(),
    getFeaturedPortfolioItems(),
    getNewsArticles(),
  ]);

  // Get 3 most recent news articles
  const recentNews = newsArticles ? newsArticles.slice(0, 3) : [];

  return (
    <HomePage
      bannerImages={bannerImages || []}
      siteSettings={siteSettings}
      services={services || []}
      portfolioItems={portfolioItems || []}
      newsArticles={recentNews}
      locale={locale as 'en' | 'fr'}
    />
  );
}
