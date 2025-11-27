'use client';

import { useTranslations } from 'next-intl';
import { AnimatedSection } from '@/components/AnimatedSection';
import { PageBanner } from '@/components/PageBanner';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div>
      <PageBanner title={t('title')} subtitle={t('subtitle')} />
      
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="space-y-16">
            {/* Our Story Section */}
            <AnimatedSection delay={0.1}>
              <div className="space-y-6">
                <h2 className="font-medium text-3xl lg:text-4xl text-foreground mb-6">
                  {t('story.title')}
                </h2>
                <p className="text-base lg:text-lg text-foreground leading-relaxed font-light">
                  {t('story.paragraph1')}
                </p>
                <p className="text-base lg:text-lg text-foreground leading-relaxed font-light">
                  {t('story.paragraph2')}
                </p>
              </div>
            </AnimatedSection>

            {/* Our Philosophy Section */}
            <AnimatedSection delay={0.2}>
              <div className="pt-12 border-t border-gray-200">
                <h2 className="font-medium text-3xl lg:text-4xl text-foreground mb-6">
                  {t('philosophy.title')}
                </h2>
                <p className="text-base lg:text-lg text-foreground leading-relaxed font-light mb-6">
                  {t('philosophy.paragraph1')}
                </p>
                <p className="text-base lg:text-lg text-foreground leading-relaxed font-light">
                  {t('philosophy.paragraph2')}
                </p>
              </div>
            </AnimatedSection>

            {/* Team Section */}
            <AnimatedSection delay={0.3}>
              <div className="pt-12 border-t border-gray-200">
                <h2 className="font-medium text-3xl lg:text-4xl text-foreground mb-8">
                  {t('team.title')}
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-2xl lg:text-3xl text-foreground mb-2">
                      {t('team.member.name')}
                    </h3>
                    <p className="text-lg text-gray-600 font-light mb-6">
                      {t('team.member.title')}
                    </p>
                  </div>
                  <p className="text-base lg:text-lg text-foreground leading-relaxed font-light">
                    {t('team.member.bio')}
                  </p>
                  <p className="text-base lg:text-lg text-foreground leading-relaxed font-light">
                    {t('team.member.founder')}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}

