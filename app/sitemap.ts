import { MetadataRoute } from 'next';
import { getPortfolioItems, getNewsArticles } from '@/lib/sanity/fetch';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lignecarre.com';

// Static routes with their locale-specific paths
const staticRoutes = [
  { route: '/', en: '/en', fr: '/fr' },
  { route: '/about', en: '/en/about', fr: '/fr/a-propos' },
  { route: '/services', en: '/en/services', fr: '/fr/nos-services' },
  { route: '/portfolio', en: '/en/portfolio', fr: '/fr/portfolio' },
  { route: '/news', en: '/en/news', fr: '/fr/actualites' },
  { route: '/careers', en: '/en/careers', fr: '/fr/carrieres' },
  { route: '/contact', en: '/en/contact', fr: '/fr/nous-contacter' },
  { route: '/privacy', en: '/en/privacy', fr: '/fr/confidentialite' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static pages (both English and French versions)
  for (const staticRoute of staticRoutes) {
    sitemapEntries.push({
      url: `${baseUrl}${staticRoute.en}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: staticRoute.route === '/' ? 1.0 : 0.8,
    });

    sitemapEntries.push({
      url: `${baseUrl}${staticRoute.fr}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: staticRoute.route === '/' ? 1.0 : 0.8,
    });
  }

  // Add portfolio items
  try {
    const portfolioItems = await getPortfolioItems();
    if (portfolioItems && Array.isArray(portfolioItems)) {
      for (const item of portfolioItems) {
        if (item.slug_en?.current) {
          sitemapEntries.push({
            url: `${baseUrl}/en/portfolio/${item.slug_en.current}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
          });
        }

        if (item.slug_fr?.current) {
          sitemapEntries.push({
            url: `${baseUrl}/fr/portfolio/${item.slug_fr.current}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching portfolio items for sitemap:', error);
  }

  // Add news articles
  try {
    const newsArticles = await getNewsArticles();
    if (newsArticles && Array.isArray(newsArticles)) {
      for (const article of newsArticles) {
        if (article.slug_en?.current) {
          sitemapEntries.push({
            url: `${baseUrl}/en/news/${article.slug_en.current}`,
            lastModified: article.date ? new Date(article.date) : new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        }

        if (article.slug_fr?.current) {
          sitemapEntries.push({
            url: `${baseUrl}/fr/actualites/${article.slug_fr.current}`,
            lastModified: article.date ? new Date(article.date) : new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching news articles for sitemap:', error);
  }

  return sitemapEntries;
}

