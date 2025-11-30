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
  if (portfolioItem.image && portfolioItem.image.asset) {
    allImages.push(portfolioItem.image);
  }
  if (portfolioItem.gallery && Array.isArray(portfolioItem.gallery)) {
    const validGalleryImages = portfolioItem.gallery.filter((img: any) => img && img.asset);
    allImages.push(...validGalleryImages);
  }

  // Generate image URLs for lightbox - use full resolution without cropping
  const imageUrls = allImages.map((img: any) => urlFor(img).url());

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-12">
              {/* Project Info - Card Style */}
              <AnimatedSection>
                <div className="bg-white p-8 lg:p-10 rounded-lg shadow-sm border border-gray-100">
                  <h2 className="font-medium text-2xl lg:text-3xl text-foreground mb-8 pb-6 border-b border-gray-200">
                    {t('detail.projectInfo') || 'Project Information'}
                  </h2>
                  <div className="space-y-6">
                    {/* First Row: Type, Client, Area */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                      <div>
                        <h3 className="font-medium text-sm uppercase tracking-wide text-gray-500 mb-2">
                          {t('detail.type')}
                        </h3>
                        <p className="text-lg text-foreground font-light capitalize">
                          {portfolioItem.projectType || portfolioItem.category}
                        </p>
                      </div>

                      {portfolioItem.client && (
                        <div>
                          <h3 className="font-medium text-sm uppercase tracking-wide text-gray-500 mb-2">
                            {t('detail.client')}
                          </h3>
                          <p className="text-lg text-foreground font-light">
                            {portfolioItem.client}
                          </p>
                        </div>
                      )}

                      {portfolioItem.area && (
                        <div>
                          <h3 className="font-medium text-sm uppercase tracking-wide text-gray-500 mb-2">
                            {t('detail.area')}
                          </h3>
                          <p className="text-lg text-foreground font-light">
                            {portfolioItem.area}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Second Row: Estimated Cost, Role */}
                    <div className={`grid grid-cols-1 ${portfolioItem.estimatedCost ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-6 lg:gap-8`}>
                      {portfolioItem.estimatedCost && (
                        <div>
                          <h3 className="font-medium text-sm uppercase tracking-wide text-gray-500 mb-2">
                            {t('detail.cost')}
                          </h3>
                          <p className="text-lg text-foreground font-light">
                            {portfolioItem.estimatedCost}
                          </p>
                        </div>
                      )}

                      <div className={portfolioItem.estimatedCost ? '' : 'md:col-span-1'}>
                        <h3 className="font-medium text-sm uppercase tracking-wide text-gray-500 mb-2">
                          {t('detail.role')}
                        </h3>
                        <p className="text-lg text-foreground font-light">
                          {role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Description */}
              {description && description.length > 0 && (
                <AnimatedSection delay={0.2}>
                  <div className="bg-white p-8 lg:p-10 rounded-lg shadow-sm border border-gray-100">
                    <div className="prose prose-lg max-w-none">
                      <PortableText value={description} components={portableTextComponents} />
                    </div>
                  </div>
                </AnimatedSection>
              )}
            </div>

            {/* Image Sidebar - Right Side */}
            <div className="lg:col-span-1">
              {allImages.length > 0 ? (
                <AnimatedSection delay={0.1}>
                  <div className="sticky top-24">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                      <h3 className="font-medium text-xl lg:text-2xl text-foreground mb-6 pb-4 border-b border-gray-200">
                        {t('detail.gallery')}
                      </h3>
                      <div className={allImages.length > 7 ? "grid grid-cols-2 gap-4" : "space-y-4"}>
                        {allImages.map((image: any, index: number) => {
                          if (!image || !image.asset) return null;
                          const imageUrl = urlFor(image).width(800).height(600).url();
                          return (
                            <div
                              key={index}
                              onClick={() => openLightbox(index)}
                              className={`relative overflow-hidden group cursor-pointer rounded-lg border border-gray-200 hover:border-foreground/30 transition-all duration-300 ${
                                allImages.length > 7 ? 'h-40 lg:h-48' : 'h-56 lg:h-72'
                              }`}
                            >
                              <Image
                                src={imageUrl}
                                alt={`${title} - ${index + 1}`}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2">
                                <p className="text-white text-xs font-light">
                                  {index + 1} / {allImages.length}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ) : (
                <AnimatedSection delay={0.1}>
                  <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center text-gray-500">
                    <p>No images available for this project.</p>
                  </div>
                </AnimatedSection>
              )}
            </div>
          </div>
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

