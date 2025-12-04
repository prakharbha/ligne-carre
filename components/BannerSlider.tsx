'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { urlFor } from '@/sanity/lib/image';

interface BannerImage {
  _id: string;
  image: any;
  altText_en: string;
  altText_fr: string;
}

interface BannerContent {
  heading_en?: string;
  heading_fr?: string;
  text_en?: string;
  text_fr?: string;
}

interface BannerSliderProps {
  images: BannerImage[];
  bannerContent?: BannerContent;
}

export function BannerSlider({ images, bannerContent }: BannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = useTranslations('home');
  const locale = useLocale() as 'en' | 'fr';

  const bannerImages = images || [];

  // Auto-play functionality
  useEffect(() => {
    if (bannerImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    if (bannerImages.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  const goToNext = () => {
    if (bannerImages.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
  };

  if (bannerImages.length === 0) {
    return null;
  }

  const currentImage = bannerImages[currentIndex];
  const altText = locale === 'fr' ? currentImage.altText_fr : currentImage.altText_en;
  const heading = locale === 'fr' 
    ? (bannerContent?.heading_fr || t('title')) 
    : (bannerContent?.heading_en || t('title'));
  const text = locale === 'fr' 
    ? (bannerContent?.text_fr || t('slogan').replace(/Ligne Carré\s*:\s*/, '')) 
    : (bannerContent?.text_en || t('slogan').replace(/Ligne Carré\s*:\s*/, ''));
  
  if (!currentImage.image) {
    return null;
  }
  
  const imageUrl = urlFor(currentImage.image).width(1920).height(1080).url();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with Fade Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={imageUrl}
            alt={altText}
            fill
            priority={currentIndex === 0}
            className="object-cover"
            quality={90}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          key={`content-${currentIndex}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.8 }}
        >
          {heading && (
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-medium text-5xl lg:text-7xl xl:text-8xl text-white mb-8"
            >
              {heading}
            </motion.h1>
          )}
          {text && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-2xl lg:text-4xl xl:text-5xl text-white/90 font-light"
            >
              {text}
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 group"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="group"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/40 group-hover:bg-white/60'
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

