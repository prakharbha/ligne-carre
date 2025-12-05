import { client } from '@/sanity/lib/client';
import { createClient } from '@sanity/client';
import {
  bannerImagesQuery,
  servicesQuery,
  portfolioItemsQuery,
  portfolioItemBySlugQuery,
  newsArticlesQuery,
  newsArticleBySlugQuery,
  pageContentQuery,
  pageBannerQuery,
  teamMembersQuery,
  siteSettingsQuery,
} from './queries';

// Client without CDN for fresh data
const clientNoCdn = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '0zrzz3rh',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_READ_TOKEN,
});

export async function getBannerImages() {
  return await client.fetch(bannerImagesQuery);
}

export async function getServices() {
  // Use no-CDN client to ensure fresh data (including images)
  return await clientNoCdn.fetch(servicesQuery);
}

export async function getPortfolioItems() {
  return await client.fetch(portfolioItemsQuery);
}

export async function getPortfolioItemBySlug(slug: string, locale: 'en' | 'fr') {
  // Use no-CDN client to ensure fresh data (including year field)
  return await clientNoCdn.fetch(portfolioItemBySlugQuery, { slug });
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
  // Use no-CDN client to ensure fresh data (including images)
  return await clientNoCdn.fetch(siteSettingsQuery);
}

export async function getPageBanner(pageType: string) {
  return await client.fetch(pageBannerQuery, { pageType });
}

export async function getTeamMembers() {
  // Use no-CDN client to ensure fresh data
  return await clientNoCdn.fetch(teamMembersQuery);
}

