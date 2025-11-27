/**
 * GROQ queries for fetching content from Sanity
 */

// Banner Images
export const bannerImagesQuery = `*[_type == "bannerImage"] | order(order asc) {
  _id,
  image {
    asset-> {
      _id,
      _type,
      url,
      metadata {
        dimensions
      }
    }
  },
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
  image {
    asset-> {
      _id,
      _type,
      url,
      metadata {
        dimensions
      }
    }
  },
  category,
  order
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
  featuredImage {
    asset-> {
      _id,
      _type,
      url,
      metadata {
        dimensions
      }
    }
  }
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
  featuredImage {
    asset-> {
      _id,
      _type,
      url,
      metadata {
        dimensions
      }
    }
  }
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
  homepageCopy
}`;

