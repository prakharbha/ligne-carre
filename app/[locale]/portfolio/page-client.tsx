'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { AnimatedSection } from '@/components/AnimatedSection';
import { PageBanner } from '@/components/PageBanner';
import { PortfolioGrid } from '@/components/PortfolioGrid';
import { PortfolioMasonry } from '@/components/PortfolioMasonry';

type ViewType = 'grid' | 'masonry';
type Category = 'all' | 'sports' | 'health' | 'education' | 'residential';

interface PortfolioItem {
  _id: string;
  title_en: string;
  title_fr: string;
  image: any;
  category: string;
  slug_en?: { current: string };
  slug_fr?: { current: string };
}

interface PortfolioPageProps {
  items: PortfolioItem[];
  locale: 'en' | 'fr';
}

export default function PortfolioPage({ items, locale }: PortfolioPageProps) {
  const t = useTranslations('portfolio');
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const categories: Category[] = ['all', 'sports', 'health', 'education', 'residential'];

  // Transform Sanity items to match component interface
  const portfolioItems = items.map((item) => ({
    id: item._id,
    title: locale === 'fr' ? item.title_fr : item.title_en,
    category: item.category,
    image: item.image,
    slug: locale === 'fr' ? item.slug_fr?.current : item.slug_en?.current,
  }));

  return (
    <div>
      <PageBanner title={t('title')} subtitle={t('subtitle')} />
      
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Filters and View Toggle */}
          <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 text-sm font-light border transition-all duration-300 ${
                    selectedCategory === category
                      ? 'border-foreground text-foreground bg-foreground/5'
                      : 'border-gray-300 text-gray-600 hover:border-foreground hover:text-foreground'
                  }`}
                >
                  {t(`filter.${category}`)}
                </button>
              ))}
            </div>

            <div className="flex gap-2 border border-gray-300">
              <button
                onClick={() => setViewType('grid')}
                className={`px-4 py-2 text-sm font-light transition-all duration-300 ${
                  viewType === 'grid'
                    ? 'bg-foreground text-white'
                    : 'text-gray-600 hover:text-foreground'
                }`}
              >
                {t('view.grid')}
              </button>
              <button
                onClick={() => setViewType('masonry')}
                className={`px-4 py-2 text-sm font-light transition-all duration-300 ${
                  viewType === 'masonry'
                    ? 'bg-foreground text-white'
                    : 'text-gray-600 hover:text-foreground'
                }`}
              >
                {t('view.masonry')}
              </button>
            </div>
          </div>

          {/* Grid View */}
          {viewType === 'grid' && (
            <PortfolioGrid items={portfolioItems} selectedCategory={selectedCategory} />
          )}

          {/* Masonry View */}
          {viewType === 'masonry' && (
            <PortfolioMasonry items={portfolioItems} selectedCategory={selectedCategory} />
          )}
        </div>
      </section>
    </div>
  );
}

