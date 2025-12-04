import { client } from '@/sanity/lib/client';
import { createClient } from '@sanity/client';
import {
  bannerImagesQuery,
  servicesQuery,
  portfolioItemsQuery,
  featuredPortfolioItemsQuery,
  portfolioItemBySlugQuery,
  newsArticlesQuery,
  newsArticleBySlugQuery,
  pageContentQuery,
  siteSettingsQuery,
} from './queries';

// Create a client without CDN for featured items to get fresh data
const clientNoCdn = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0zrzz3rh',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false, // Disable CDN to get fresh data
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_READ_TOKEN,
});

export async function getBannerImages() {
  return await client.fetch(bannerImagesQuery);
}

export async function getServices() {
  return await client.fetch(servicesQuery);
}

export async function getPortfolioItems() {
  return await client.fetch(portfolioItemsQuery);
}

export async function getFeaturedPortfolioItems() {
  // Use client without CDN to bypass cache and get fresh data
  // This ensures featured items are always up to date
  return await clientNoCdn.fetch(featuredPortfolioItemsQuery);
}

export async function getPortfolioItemBySlug(slug: string, locale: 'en' | 'fr') {
  return await client.fetch(portfolioItemBySlugQuery, { slug });
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

