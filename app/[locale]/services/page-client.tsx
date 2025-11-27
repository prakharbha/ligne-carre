'use client';

import { useTranslations, useLocale } from 'next-intl';
import { AnimatedSection } from '@/components/AnimatedSection';
import { PageBanner } from '@/components/PageBanner';
import { motion } from 'framer-motion';
import { getLocalizedField } from '@/lib/sanity/utils';

interface Service {
  _id: string;
  title_en: string;
  title_fr: string;
  description_en: string;
  description_fr: string;
  order: number;
  slug: { current: string };
}

interface ServicesPageProps {
  services: Service[];
  locale: 'en' | 'fr';
}

export default function ServicesPage({ services, locale }: ServicesPageProps) {
  const t = useTranslations('services');

  return (
    <div>
      <PageBanner title={t('title')} subtitle={t('subtitle')} />
      
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {services.map((service, index) => {
              const title = getLocalizedField(service, locale, 'title');
              const description = getLocalizedField(service, locale, 'description');
              
              return (
                <AnimatedSection key={service._id} delay={index * 0.1}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="p-8 lg:p-12 border border-gray-200 hover:border-foreground transition-colors duration-300"
                  >
                    <h2 className="font-medium text-2xl lg:text-3xl text-foreground mb-4">
                      {title}
                    </h2>
                    <p className="text-base lg:text-lg text-foreground leading-relaxed font-light">
                      {description}
                    </p>
                  </motion.div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

