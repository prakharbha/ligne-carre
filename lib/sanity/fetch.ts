import { client } from '@/sanity/lib/client';
import {
  bannerImagesQuery,
  servicesQuery,
  portfolioItemsQuery,
  newsArticlesQuery,
  newsArticleBySlugQuery,
  pageContentQuery,
  siteSettingsQuery,
} from './queries';

export async function getBannerImages() {
  return await client.fetch(bannerImagesQuery);
}

export async function getServices() {
  return await client.fetch(servicesQuery);
}

export async function getPortfolioItems() {
  return await client.fetch(portfolioItemsQuery);
}

export async function getNewsArticles() {
  return await client.fetch(newsArticlesQuery);
}

export async function getNewsArticleBySlug(slug: string, locale: 'en' | 'fr') {
  return await client.fetch(newsArticleBySlugQuery, { slug });
}

export async function getPageContent(pageType: string) {
  return await client.fetch(pageContentQuery(pageType), { pageType });
}

export async function getSiteSettings() {
  return await client.fetch(siteSettingsQuery);
}

