'use client';

import { useTranslations } from 'next-intl';
import { AnimatedSection } from '@/components/AnimatedSection';
import { PageBanner } from '@/components/PageBanner';
import { ContactForm } from '@/components/ContactForm';

export default function ContactPage() {
  const t = useTranslations('contact');

  return (
    <div>
      <PageBanner title={t('title')} subtitle={t('subtitle')} />
      
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <AnimatedSection delay={0.1}>
              <div className="space-y-8">
                <div>
                  <h2 className="font-season-mix text-2xl text-foreground mb-4">
                    {t('getInTouch.title')}
                  </h2>
                  <p className="text-base text-foreground leading-relaxed font-light mb-6">
                    {t('getInTouch.description')}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-season-mix text-lg text-foreground mb-2">
                      {t('office.label')}
                    </h3>
                    <p className="text-sm text-gray-600 font-light">
                      {t('office.value')}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-season-mix text-lg text-foreground mb-2">
                      {t('email.label')}
                    </h3>
                    <p className="text-sm text-gray-600 font-light">
                      {t('email.value')}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-season-mix text-lg text-foreground mb-2">
                      {t('phone.label')}
                    </h3>
                    <p className="text-sm text-gray-600 font-light">
                      {t('phone.value')}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <ContactForm />
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}

