'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { AnimatedSection } from '@/components/AnimatedSection';
import { PageBanner } from '@/components/PageBanner';
import { PortableText } from '@portabletext/react';
import { getLocalizedField } from '@/lib/sanity/utils';
import { urlFor } from '@/sanity/lib/image';
import { ImageLightbox } from '@/components/ImageLightbox';

interface PortfolioItemPageProps {
  portfolioItem: any;
  locale: 'en' | 'fr';
}

export default function PortfolioItemPage({ portfolioItem, locale }: PortfolioItemPageProps) {
  const t = useTranslations('portfolio');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const title = getLocalizedField(portfolioItem, locale, 'title');
  const location = getLocalizedField(portfolioItem, locale, 'location');
  const role = getLocalizedField(portfolioItem, locale, 'role');
  const description = getLocalizedField(portfolioItem, locale, 'description');

  // Combine main image and gallery images into one array
  const allImages = [];
  if (portfolioItem.image) {
    allImages.push(portfolioItem.image);
  }
  if (portfolioItem.gallery && Array.isArray(portfolioItem.gallery)) {
    allImages.push(...portfolioItem.gallery);
  }

  // Generate image URLs for lightbox
  const imageUrls = allImages.map((img: any) => urlFor(img).width(1920).height(1080).url());

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

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
    },
    types: {
      image: ({ value }: any) => {
        if (!value?.asset) return null;
        return (
          <div className="my-8">
            <div className="relative w-full h-96 lg:h-[500px] overflow-hidden">
              <Image
                src={urlFor(value).width(1200).height(800).url()}
                alt={value.alt || title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        );
      },
    },
  };

  return (
    <div>
      <PageBanner
        title={title}
        subtitle={`${location} – ${portfolioItem.year || ''}`}
      />

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Project Info */}
          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-gray-200">
              <div>
                <h3 className="font-medium text-lg text-gray-600 mb-2">
                  {t('detail.type')}
                </h3>
                <p className="text-base text-foreground font-light capitalize mb-6">
                  {portfolioItem.projectType || portfolioItem.category}
                </p>

                <h3 className="font-medium text-lg text-gray-600 mb-2">
                  {t('detail.role')}
                </h3>
                <p className="text-base text-foreground font-light mb-6">
                  {role}
                </p>
              </div>

              <div>
                {portfolioItem.client && (
                  <>
                    <h3 className="font-medium text-lg text-gray-600 mb-2">
                      {t('detail.client')}
                    </h3>
                    <p className="text-base text-foreground font-light mb-6">
                      {portfolioItem.client}
                    </p>
                  </>
                )}

                {portfolioItem.area && (
                  <>
                    <h3 className="font-medium text-lg text-gray-600 mb-2">
                      {t('detail.area')}
                    </h3>
                    <p className="text-base text-foreground font-light mb-6">
                      {portfolioItem.area}
                    </p>
                  </>
                )}

                {portfolioItem.estimatedCost && (
                  <>
                    <h3 className="font-medium text-lg text-gray-600 mb-2">
                      {t('detail.cost')}
                    </h3>
                    <p className="text-base text-foreground font-light mb-6">
                      {portfolioItem.estimatedCost}
                    </p>
                  </>
                )}
              </div>
            </div>
          </AnimatedSection>

          {/* Image Grid - All images in 3-column grid */}
          {allImages.length > 0 && (
            <AnimatedSection delay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {allImages.map((image: any, index: number) => {
                  const imageUrl = urlFor(image).width(800).height(600).url();
                  return (
                    <div
                      key={index}
                      onClick={() => openLightbox(index)}
                      className="relative h-64 lg:h-80 overflow-hidden group cursor-pointer"
                    >
                      <Image
                        src={imageUrl}
                        alt={`${title} - ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                  );
                })}
              </div>
            </AnimatedSection>
          )}

          {/* Description */}
          {description && description.length > 0 && (
            <AnimatedSection delay={0.2}>
              <div className="prose prose-lg max-w-none">
                <PortableText value={description} components={portableTextComponents} />
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <ImageLightbox
        images={imageUrls}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}

