'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CTASection } from '@/components/CTASection';
import { AnimatedSection } from '@/components/AnimatedSection';
import { NewsletterCTA } from '@/components/NewsletterCTA';

export default function HomePage() {
  const t = useTranslations('home');
  const tNav = useTranslations('nav');
  const locale = useLocale();

  return (
    <div className="pt-20 lg:pt-24">
      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/images/home-banner.jpg"
            alt="Ligne Carré Architecture"
            fill
            priority
            className="object-cover"
            quality={90}
          />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-season-mix text-5xl lg:text-7xl xl:text-8xl text-white mb-8"
          >
            {t('title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-2xl lg:text-4xl xl:text-5xl text-white/90 font-light"
          >
            {t('slogan').replace('Ligne Carré: ', '')}
          </motion.p>
        </div>
      </section>

      {/* About Section Preview */}
      <section className="py-24 lg:py-32 bg-gray-50">
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
              <h2 className="font-season-mix text-4xl lg:text-5xl text-foreground mb-6">
                {tNav('about')}
              </h2>
              <p className="text-lg text-gray-600 font-light mb-8 leading-relaxed">
                Licensed Architect (OAQ) with 25+ years of experience in Montreal and the MENA area. 
                Specializing in Sports, Health, Education, and Residential projects.
              </p>
              <Link
                href={`/${locale}/about`}
                className="inline-block px-8 py-3 bg-foreground text-white hover:bg-gray-700 transition-colors duration-300"
              >
                Learn More
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services Section Preview */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="font-season-mix text-4xl lg:text-5xl text-foreground mb-16 text-center">
              {tNav('services')}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {['Sports', 'Health', 'Education', 'Residential'].map((service, index) => (
              <AnimatedSection key={service} delay={index * 0.1}>
                <div className="text-center">
                  <div className="relative h-48 mb-6 overflow-hidden">
                    <Image
                      src="/images/home-banner.jpg"
                      alt={service}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-season-mix text-xl text-foreground mb-2">
                    {service}
                  </h3>
                  <p className="text-sm text-gray-600 font-light">
                    Professional {service.toLowerCase()} architecture services
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section Preview */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="font-season-mix text-4xl lg:text-5xl text-foreground mb-16 text-center">
              {tNav('portfolio')}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {[1, 2, 3].map((item, index) => (
              <AnimatedSection key={item} delay={index * 0.1}>
                <Link href={`/${locale}/portfolio`}>
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
                    <h3 className="font-season-mix text-xl text-foreground mb-2">
                      Featured Project {item}
                    </h3>
                    <p className="text-sm text-gray-600 font-light">
                      Architectural excellence in modern design
                    </p>
                  </motion.div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href={`/${locale}/portfolio`}
              className="inline-block px-8 py-3 bg-foreground text-white hover:bg-gray-700 transition-colors duration-300"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* News Section Preview */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="font-season-mix text-4xl lg:text-5xl text-foreground mb-16 text-center">
              {tNav('news')}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item, index) => (
              <AnimatedSection key={item} delay={index * 0.1}>
                <div className="bg-gray-50 p-6">
                  <div className="text-sm text-gray-500 mb-2">November 2025</div>
                  <h3 className="font-season-mix text-xl text-foreground mb-3">
                    Latest Update {item}
                  </h3>
                  <p className="text-sm text-gray-600 font-light mb-4">
                    Stay informed about our latest projects and industry insights.
                  </p>
                  <Link
                    href={`/${locale}/news`}
                    className="text-sm text-foreground hover:text-gray-600 transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Careers Section Preview */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-season-mix text-4xl lg:text-5xl text-foreground mb-6">
              {tNav('careers')}
            </h2>
            <p className="text-lg text-gray-600 font-light mb-8 max-w-2xl mx-auto">
              Join our team of talented architects and project managers. 
              We're always looking for passionate individuals to help shape the future.
            </p>
            <Link
              href={`/${locale}/careers`}
              className="inline-block px-8 py-3 bg-foreground text-white hover:bg-gray-700 transition-colors duration-300"
            >
              View Opportunities
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <NewsletterCTA />
    </div>
  );
}

