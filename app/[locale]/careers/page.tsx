'use client';

import { useTranslations, useLocale } from 'next-intl';
import { AnimatedSection } from '@/components/AnimatedSection';
import { PageBanner } from '@/components/PageBanner';

export default function CareersPage() {
  const t = useTranslations('careers');
  const locale = useLocale();

  return (
    <div>
      <PageBanner title={t('title')} subtitle={t('subtitle')} />
      
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">

          <div className="space-y-8">
            <AnimatedSection delay={0.1}>
              <div className="space-y-6">
                <h2 className="font-season-mix text-3xl text-foreground">
                  Why Join Ligne Carré?
                </h2>
                <p className="text-base lg:text-lg text-foreground leading-relaxed font-light">
                  At Ligne Carré, we are committed to excellence in architecture and project management. 
                  We offer opportunities to work on diverse projects across Montreal and the MENA region, 
                  including sports facilities, healthcare buildings, educational institutions, and residential 
                  developments. Join a team that values precision, innovation, and professional growth.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="space-y-6">
                <h2 className="font-season-mix text-3xl text-foreground">
                  Open Positions
                </h2>
                <p className="text-base lg:text-lg text-foreground leading-relaxed font-light">
                  We are always looking for talented architects, project managers, and design professionals 
                  who share our passion for precision and excellence. Please contact us to learn about 
                  current opportunities.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="pt-8">
                <a
                  href={`/${locale}/contact`}
                  className="inline-block px-8 py-4 border-2 border-foreground text-foreground font-light hover:bg-foreground hover:text-white transition-all duration-300"
                >
                  Contact Us
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}

