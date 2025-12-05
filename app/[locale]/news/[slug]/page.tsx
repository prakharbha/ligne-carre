import { getNewsArticleBySlug, getNewsArticles } from '@/lib/sanity/fetch';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { getLocalizedField } from '@/lib/sanity/utils';
import { PageBanner } from '@/components/PageBanner';
import { Metadata } from 'next';

interface NewsArticlePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getNewsArticleBySlug(slug, locale as 'en' | 'fr');

  if (!article) {
    return {
      title: 'News Article Not Found',
    };
  }

  const title = getLocalizedField(article, locale as 'en' | 'fr', 'title');
  const excerpt = getLocalizedField(article, locale as 'en' | 'fr', 'excerpt');
  const seo = article.seo;
  
  // Use SEO fields if available, otherwise use excerpt
  const metaTitle = seo 
    ? (getLocalizedField(seo, locale as 'en' | 'fr', 'metaTitle') || `${title} | Ligne Carré`)
    : `${title} | Ligne Carré`;
  
  const description = seo
    ? (getLocalizedField(seo, locale as 'en' | 'fr', 'metaDescription') || excerpt)
    : excerpt;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lignecarre.com';
  const newsPath = locale === 'fr' ? 'actualites' : 'news';
  const currentSlug = locale === 'fr' ? article.slug_fr?.current : article.slug_en?.current;
  const currentUrl = `${baseUrl}/${locale}/${newsPath}/${currentSlug}`;
  const imageUrl = article.featuredImage ? urlFor(article.featuredImage).width(1200).height(630).url() : `${baseUrl}/images/logo_ligne.png`;

  return {
    title: metaTitle,
    description: description || `${title} - News from Ligne Carré`,
    openGraph: {
      title: metaTitle,
      description: description || `${title} - News from Ligne Carré`,
      url: currentUrl,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      type: 'article',
      publishedTime: article.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: description || `${title} - News from Ligne Carré`,
      images: [imageUrl],
    },
    alternates: {
      canonical: currentUrl,
      languages: {
        en: article.slug_en?.current ? `${baseUrl}/en/news/${article.slug_en.current}` : undefined,
        fr: article.slug_fr?.current ? `${baseUrl}/fr/actualites/${article.slug_fr.current}` : undefined,
      },
    },
  };
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { locale, slug } = await params;
  const article = await getNewsArticleBySlug(slug, locale as 'en' | 'fr');

  if (!article) {
    notFound();
  }

  const title = getLocalizedField(article, locale as 'en' | 'fr', 'title');
  const content = getLocalizedField(article, locale as 'en' | 'fr', 'content');
  const date = new Date(article.date).toLocaleDateString(
    locale === 'fr' ? 'fr-CA' : 'en-CA',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  const portableTextComponents = {
    block: {
      h2: ({ children }: any) => (
        <h2 className="font-medium text-2xl lg:text-3xl text-foreground mb-4 mt-8 first:mt-0">
          {children}
        </h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="font-medium text-xl lg:text-2xl text-foreground mb-3 mt-6">
          {children}
        </h3>
      ),
      normal: ({ children }: any) => (
        <p className="text-base lg:text-lg text-foreground leading-relaxed font-light mb-4">
          {children}
        </p>
      ),
      bullet: ({ children }: any) => (
        <ul className="list-disc list-inside mb-4 space-y-2 text-base lg:text-lg text-foreground leading-relaxed font-light ml-4">
          {children}
        </ul>
      ),
      number: ({ children }: any) => (
        <ol className="list-decimal list-inside mb-4 space-y-2 text-base lg:text-lg text-foreground leading-relaxed font-light ml-4">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }: any) => (
        <li className="ml-4">{children}</li>
      ),
      number: ({ children }: any) => (
        <li className="ml-4">{children}</li>
      ),
    },
    types: {
      image: ({ value }: any) => {
        if (!value?.asset) return null;
        return (
          <div className="my-8">
            <Image
              src={urlFor(value).width(1200).url()}
              alt={value.alt || 'Article image'}
              width={1200}
              height={600}
              className="w-full h-auto rounded-lg"
            />
          </div>
        );
      },
    },
  };

  return (
    <div>
      <PageBanner title={title} subtitle={date} />
      
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {article.featuredImage && (
            <div className="mb-12">
              <Image
                src={urlFor(article.featuredImage).width(1200).height(600).url()}
                alt={title}
                width={1200}
                height={600}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
          
          <div className="prose prose-lg max-w-none">
            <PortableText value={content} components={portableTextComponents} />
          </div>
        </div>
      </section>
    </div>
  );
}

