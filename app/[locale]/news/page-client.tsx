'use client';

import { useTranslations, useLocale } from 'next-intl';
import { AnimatedSection } from '@/components/AnimatedSection';
import { PageBanner } from '@/components/PageBanner';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getLocalizedField } from '@/lib/sanity/utils';

interface NewsArticle {
  _id: string;
  title_en: string;
  title_fr: string;
  slug_en: { current: string };
  slug_fr: { current: string };
  date: string;
  excerpt_en: string;
  excerpt_fr: string;
  featuredImage?: any;
}

interface NewsPageProps {
  articles: NewsArticle[];
  locale: 'en' | 'fr';
}

export default function NewsPage({ articles, locale }: NewsPageProps) {
  const t = useTranslations('news');

  return (
    <div>
      <PageBanner title={t('title')} subtitle={t('subtitle')} />
      
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="space-y-12">
            {articles.map((article, index) => {
              const title = getLocalizedField(article, locale, 'title');
              const excerpt = getLocalizedField(article, locale, 'excerpt');
              const slug = locale === 'en' ? article.slug_en?.current : article.slug_fr?.current;
              const date = new Date(article.date).toLocaleDateString(
                locale === 'fr' ? 'fr-CA' : 'en-CA',
                { year: 'numeric', month: 'long', day: 'numeric' }
              );

              return (
                <AnimatedSection key={article._id} delay={index * 0.1}>
                  <Link href={`/${locale}/news/${slug}`}>
                    <motion.article
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-gray-200 pb-12 last:border-0 cursor-pointer"
                    >
                      <div className="text-sm text-gray-500 font-light mb-2">{date}</div>
                      <h2 className="font-medium text-2xl lg:text-3xl text-foreground mb-4">
                        {title}
                      </h2>
                      <p className="text-base lg:text-lg text-foreground leading-relaxed font-light">
                        {excerpt}
                      </p>
                    </motion.article>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

