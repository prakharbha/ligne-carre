'use client';

import { useTranslations } from 'next-intl';
import { AnimatedSection } from '@/components/AnimatedSection';
import { PageBanner } from '@/components/PageBanner';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div>
      <PageBanner title={t('title')} subtitle="Our Story, Philosophy & Team" />
      
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">

          <div className="space-y-12">
            <AnimatedSection delay={0.1}>
              <div className="space-y-6">
                <div>
                  <h2 className="font-season-mix text-3xl lg:text-4xl text-foreground mb-4">
                    {t('founder.name')}
                  </h2>
                  <p className="text-lg text-gray-600 font-light mb-6">
                    {t('founder.title')}
                  </p>
                </div>
                <p className="text-base lg:text-lg text-foreground leading-relaxed font-light">
                  {t('founder.bio')}
                </p>
                <p className="text-base lg:text-lg text-foreground leading-relaxed font-light">
                  {t('founder.goal')}
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="pt-12 border-t border-gray-200">
                <h3 className="font-season-mix text-2xl text-foreground mb-6">
                  Our Philosophy
                </h3>
                <p className="text-base lg:text-lg text-foreground leading-relaxed font-light">
                  At Ligne Carré, we believe that precision in architecture begins with every line we draw. 
                  Our approach combines meticulous attention to detail with innovative design solutions, 
                  creating spaces that are both functional and inspiring. We take pride in our holistic 
                  methodology, ensuring seamless integration between architecture and project management 
                  to deliver exceptional results.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}

