/**
 * GROQ queries for fetching content from Sanity
 */

// Banner Images
export const bannerImagesQuery = `*[_type == "bannerImage"] | order(order asc) {
  _id,
  image,
  order,
  altText_en,
  altText_fr
}`;

// Services
export const servicesQuery = `*[_type == "service"] | order(order asc) {
  _id,
  title_en,
  title_fr,
  description_en,
  description_fr,
  order,
  slug
}`;

// Portfolio Items
export const portfolioItemsQuery = `*[_type == "portfolioItem"] | order(order asc) {
  _id,
  title_en,
  title_fr,
  slug_en,
  slug_fr,
  image,
  gallery,
  category,
  projectType,
  client,
  role_en,
  role_fr,
  area,
  estimatedCost,
  order,
  featured,
  _updatedAt
}`;

// Featured Portfolio Items (for homepage)
export const featuredPortfolioItemsQuery = `*[_type == "portfolioItem" && featured == true] | order(order asc) {
  _id,
  title_en,
  title_fr,
  slug_en,
  slug_fr,
  image,
  gallery,
  category,
  projectType,
  client,
  role_en,
  role_fr,
  area,
  estimatedCost,
  order,
  featured,
  _updatedAt
}`;

// Single Portfolio Item by slug
export const portfolioItemBySlugQuery = `*[_type == "portfolioItem" && (slug_en.current == $slug || slug_fr.current == $slug)][0] {
  _id,
  title_en,
  title_fr,
  slug_en,
  slug_fr,
  location_en,
  location_fr,
  year,
  projectType,
  role_en,
  role_fr,
  client,
  area,
  estimatedCost,
  description_en,
  description_fr,
  image,
  gallery,
  _updatedAt
}`;

// News Articles
export const newsArticlesQuery = `*[_type == "newsArticle"] | order(date desc) {
  _id,
  title_en,
  title_fr,
  slug_en,
  slug_fr,
  date,
  excerpt_en,
  excerpt_fr,
  featuredImage
}`;

// Single News Article by slug
export const newsArticleBySlugQuery = `*[_type == "newsArticle" && (slug_en.current == $slug || slug_fr.current == $slug)][0] {
  _id,
  title_en,
  title_fr,
  slug_en,
  slug_fr,
  date,
  excerpt_en,
  excerpt_fr,
  content_en,
  content_fr,
  featuredImage
}`;

// Page Content
export const pageContentQuery = (pageType: string) => `*[_type == "pageContent" && pageType == $pageType][0] {
  _id,
  pageType,
  title_en,
  title_fr,
  subtitle_en,
  subtitle_fr,
  content_en,
  content_fr
}`;

// Site Settings (Singleton)
export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  _id,
  footerContact,
  homepageCopy,
  bannerContent
}`;

