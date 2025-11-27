'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { AnimatedSection } from '@/components/AnimatedSection';
import { PageBanner } from '@/components/PageBanner';

export default function CareersPage() {
  const t = useTranslations('careers');

  return (
    <div>
      <PageBanner title={t('title')} subtitle={t('subtitle')} />
      
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">

          <div className="space-y-8">
            <AnimatedSection delay={0.1}>
              <div className="space-y-6">
                <h2 className="font-season-mix text-3xl text-foreground">
                  {t('whyJoin.title')}
                </h2>
                <p className="text-base lg:text-lg text-foreground leading-relaxed font-light">
                  {t('whyJoin.description')}
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="space-y-6">
                <h2 className="font-season-mix text-3xl text-foreground">
                  {t('openPositions.title')}
                </h2>
                <p className="text-base lg:text-lg text-foreground leading-relaxed font-light">
                  {t('openPositions.description')}
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="pt-8">
                <Link
                  href="/contact"
                  className="inline-block px-8 py-4 border-2 border-foreground text-foreground font-light hover:bg-foreground hover:text-white transition-all duration-300"
                >
                  {t('contactUs')}
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}

