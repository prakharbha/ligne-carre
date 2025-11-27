'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { CTASection } from '@/components/CTASection';
import { AnimatedSection } from '@/components/AnimatedSection';
import { NewsletterCTA } from '@/components/NewsletterCTA';
import { BannerSlider } from '@/components/BannerSlider';
import { getLocalizedField } from '@/lib/sanity/utils';

interface HomePageProps {
  bannerImages: any[];
  siteSettings: any;
  locale: 'en' | 'fr';
}

export default function HomePage({ bannerImages, siteSettings, locale }: HomePageProps) {
  const t = useTranslations('home');
  const tNav = useTranslations('nav');

  const aboutDescription = siteSettings?.homepageCopy
    ? getLocalizedField(siteSettings.homepageCopy, locale, 'aboutDescription')
    : t('about.description');
  const careersDescription = siteSettings?.homepageCopy
    ? getLocalizedField(siteSettings.homepageCopy, locale, 'careersDescription')
    : t('careers.description');

  return (
    <div className="pt-20 lg:pt-24">
      {/* Hero Section with Banner Slider */}
      <BannerSlider images={bannerImages} />

      {/* About Section Preview */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="relative h-96 overflow-hidden">
                <Image
                  src="/images/home-banner.jpg"
                  alt="About Ligne Carré"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <h2 className="font-medium text-4xl lg:text-5xl text-foreground mb-6">
                {tNav('about')}
              </h2>
              <p className="text-lg text-gray-600 font-light mb-8 leading-relaxed">
                {aboutDescription}
              </p>
              <Link
                href="/about"
                className="inline-block px-8 py-3 bg-foreground text-white hover:bg-gray-700 transition-colors duration-300"
              >
                {t('about.learnMore')}
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services Section Preview */}
      <section className="py-24 lg:py-32 bg-[#dddddd]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="font-medium text-4xl lg:text-5xl text-foreground mb-16 text-center">
              {tNav('services')}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {['sports', 'health', 'education', 'residential'].map((serviceKey, index) => {
              const serviceName = t(`services.${serviceKey}`);
              return (
                <AnimatedSection key={serviceKey} delay={index * 0.1}>
                  <div className="text-center">
                    <div className="relative h-48 mb-6 overflow-hidden">
                      <Image
                        src="/images/home-banner.jpg"
                        alt={serviceName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-medium text-xl text-foreground mb-2">
                      {serviceName}
                    </h3>
                    <p className="text-sm text-gray-600 font-light">
                      {t('services.description', { service: serviceName })}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portfolio Section Preview */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="font-medium text-4xl lg:text-5xl text-foreground mb-16 text-center">
              {tNav('portfolio')}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {[1, 2, 3].map((item, index) => (
              <AnimatedSection key={item} delay={index * 0.1}>
                <Link href="/portfolio">
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative h-64 lg:h-80 mb-4 overflow-hidden">
                      <Image
                        src="/images/home-banner.jpg"
                        alt={`Featured Project ${item}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="font-medium text-xl text-foreground mb-2">
                      {t('portfolio.featuredProject', { number: item })}
                    </h3>
                    <p className="text-sm text-gray-600 font-light">
                      {t('portfolio.description')}
                    </p>
                  </motion.div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/portfolio"
              className="inline-block px-8 py-3 bg-foreground text-white hover:bg-gray-700 transition-colors duration-300"
            >
              {t('portfolio.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* News Section Preview */}
      <section className="py-24 lg:py-32 bg-[#dddddd]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="font-medium text-4xl lg:text-5xl text-foreground mb-16 text-center">
              {tNav('news')}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item, index) => (
              <AnimatedSection key={item} delay={index * 0.1}>
                <div className="bg-gray-50 p-6">
                  <div className="text-sm text-gray-500 mb-2">{t('news.date')}</div>
                  <h3 className="font-medium text-xl text-foreground mb-3">
                    {t('news.latestUpdate', { number: item })}
                  </h3>
                  <p className="text-sm text-gray-600 font-light mb-4">
                    {t('news.description')}
                  </p>
                  <Link
                    href="/news"
                    className="text-sm text-foreground hover:text-gray-600 transition-colors"
                  >
                    {t('news.readMore')} →
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Careers Section Preview */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-medium text-4xl lg:text-5xl text-foreground mb-6">
              {tNav('careers')}
            </h2>
            <p className="text-lg text-gray-600 font-light mb-8 max-w-2xl mx-auto">
              {careersDescription}
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-foreground text-white hover:bg-gray-700 transition-colors duration-300"
            >
              {t('careers.letsTalk')}
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <NewsletterCTA />
    </div>
  );
}

