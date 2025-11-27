'use client';

import { useTranslations } from 'next-intl';
import { AnimatedSection } from '@/components/AnimatedSection';
import { PageBanner } from '@/components/PageBanner';
import { motion } from 'framer-motion';

export default function ServicesPage() {
  const t = useTranslations('services');

  const services = [
    {
      key: 'residential',
      icon: '🏠',
    },
    {
      key: 'commercial',
      icon: '🏢',
    },
    {
      key: 'interior',
      icon: '✨',
    },
    {
      key: 'projectManagement',
      icon: '📋',
    },
  ];

  return (
    <div>
      <PageBanner title={t('title')} subtitle={t('subtitle')} />
      
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {services.map((service, index) => (
              <AnimatedSection key={service.key} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 lg:p-12 border border-gray-200 hover:border-foreground transition-colors duration-300"
                >
                  <div className="text-5xl mb-6">{service.icon}</div>
                  <h2 className="font-season-mix text-2xl lg:text-3xl text-foreground mb-4">
                    {t(`${service.key}.title`)}
                  </h2>
                  <p className="text-base lg:text-lg text-foreground leading-relaxed font-light">
                    {t(`${service.key}.description`)}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

