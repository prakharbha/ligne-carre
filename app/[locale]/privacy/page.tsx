'use client';

import { useTranslations } from 'next-intl';
import { AnimatedSection } from '@/components/AnimatedSection';
import { PageBanner } from '@/components/PageBanner';

export default function PrivacyPage() {
  const t = useTranslations('privacy');

  const sections = [
    {
      key: 'introduction',
    },
    {
      key: 'informationCollection',
    },
    {
      key: 'informationUse',
    },
    {
      key: 'informationSharing',
    },
    {
      key: 'dataSecurity',
    },
    {
      key: 'yourRights',
    },
    {
      key: 'contact',
    },
  ];

  return (
    <div>
      <PageBanner title={t('title')} subtitle={t('lastUpdated')} />
      
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <AnimatedSection key={section.key} delay={index * 0.1}>
                <div className="space-y-4">
                  <h2 className="font-season-mix text-2xl lg:text-3xl text-foreground">
                    {t(`sections.${section.key}.title`)}
                  </h2>
                  <p className="text-base lg:text-lg text-foreground leading-relaxed font-light">
                    {t(`sections.${section.key}.content`)}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
