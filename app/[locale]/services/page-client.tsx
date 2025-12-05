'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { AnimatedSection } from '@/components/AnimatedSection';
import { PageBanner } from '@/components/PageBanner';
import { motion } from 'framer-motion';
import { getLocalizedField } from '@/lib/sanity/utils';
import { urlFor } from '@/sanity/lib/image';

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
  pageBanner?: any;
  locale: 'en' | 'fr';
}

export default function ServicesPage({ services, pageBanner, locale }: ServicesPageProps) {
  const t = useTranslations('services');
  
  const bannerImage = pageBanner?.image;
  const bannerAltText = pageBanner ? getLocalizedField(pageBanner, locale, 'altText') : undefined;

  return (
    <div>
      <PageBanner 
        title={t('title')} 
        subtitle={t('subtitle')}
        bannerImage={bannerImage}
        altText={bannerAltText}
      />
      
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {services.map((service, index) => {
              const title = getLocalizedField(service, locale, 'title');
              const description = getLocalizedField(service, locale, 'description');
              
              // Only show if service has image
              if (!service.image) return null;
              
              const imageUrl = urlFor(service.image).width(800).height(600).url();
              
              return (
                <AnimatedSection key={service._id} delay={index * 0.1}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="border border-gray-200 hover:border-foreground transition-colors duration-300 overflow-hidden"
                  >
                    <div className="relative h-64 lg:h-80 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-8 lg:p-12">
                      <h2 className="font-medium text-2xl lg:text-3xl text-foreground mb-4">
                        {title}
                      </h2>
                      <p className="text-base lg:text-lg text-foreground leading-relaxed font-light whitespace-pre-line">
                        {description}
                      </p>
                    </div>
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

