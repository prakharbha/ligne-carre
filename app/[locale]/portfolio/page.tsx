'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatedSection } from '@/components/AnimatedSection';
import { PageBanner } from '@/components/PageBanner';
import { PortfolioGrid } from '@/components/PortfolioGrid';
import { PortfolioMasonry } from '@/components/PortfolioMasonry';

type ViewType = 'grid' | 'masonry';
type Category = 'all' | 'sports' | 'health' | 'education' | 'residential';

export default function PortfolioPage() {
  const t = useTranslations('portfolio');
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  // Sample portfolio items
  const portfolioItems = [
    { id: 1, title: 'Sports Complex Dubai', category: 'sports', image: '/placeholder.jpg' },
    { id: 2, title: 'Medical Center Montreal', category: 'health', image: '/placeholder.jpg' },
    { id: 3, title: 'University Campus Qatar', category: 'education', image: '/placeholder.jpg' },
    { id: 4, title: 'Luxury Residence KSA', category: 'residential', image: '/placeholder.jpg' },
    { id: 5, title: 'Stadium Project Vision 2030', category: 'sports', image: '/placeholder.jpg' },
    { id: 6, title: 'Hospital Expansion', category: 'health', image: '/placeholder.jpg' },
    { id: 7, title: 'School Complex', category: 'education', image: '/placeholder.jpg' },
    { id: 8, title: 'Modern Villa', category: 'residential', image: '/placeholder.jpg' },
    { id: 9, title: 'Athletic Center', category: 'sports', image: '/placeholder.jpg' },
  ];

  const categories: Category[] = ['all', 'sports', 'health', 'education', 'residential'];

  return (
    <div>
      <PageBanner title={t('title')} subtitle="Explore Our Architectural Excellence" />
      
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

