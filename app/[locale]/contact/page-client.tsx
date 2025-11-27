'use client';

import { useTranslations } from 'next-intl';
import { AnimatedSection } from '@/components/AnimatedSection';
import { PageBanner } from '@/components/PageBanner';
import { ContactForm } from '@/components/ContactForm';
import { PortableText } from '@portabletext/react';
import { getLocalizedField } from '@/lib/sanity/utils';

interface ContactPageProps {
  pageContent: any;
  siteSettings: any;
  locale: 'en' | 'fr';
}

export default function ContactPage({ pageContent, siteSettings, locale }: ContactPageProps) {
  const t = useTranslations('contact');

  const title = pageContent ? getLocalizedField(pageContent, locale, 'title') : t('title');
  const subtitle = pageContent ? getLocalizedField(pageContent, locale, 'subtitle') : t('subtitle');
  const content = pageContent ? getLocalizedField(pageContent, locale, 'content') : null;

  const footerContact = siteSettings?.footerContact;
  const address = footerContact ? getLocalizedField(footerContact, locale, 'address') : t('office.value');
  const email = footerContact?.email || t('email.value');
  const phone = footerContact?.phone || t('phone.value');

  return (
    <div>
      <PageBanner title={title} subtitle={subtitle || undefined} />
      
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <AnimatedSection delay={0.1}>
              <div className="space-y-8">
                {content && content.length > 0 ? (
                  <div className="prose prose-lg max-w-none mb-8">
                    <PortableText value={content} />
                  </div>
                ) : (
                  <div>
                    <h2 className="font-season-mix text-2xl text-foreground mb-4">
                      {t('getInTouch.title')}
                    </h2>
                    <p className="text-base text-foreground leading-relaxed font-light mb-6">
                      {t('getInTouch.description')}
                    </p>
                  </div>
                )}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div>
                    <h3 className="font-season-mix text-lg text-foreground mb-2">
                      {t('office.label')}
                    </h3>
                    <p className="text-sm text-gray-600 font-light">{address || t('office.value')}</p>
                  </div>
                  <div>
                    <h3 className="font-season-mix text-lg text-foreground mb-2">
                      {t('email.label')}
                    </h3>
                    <p className="text-sm text-gray-600 font-light">
                      <a href={`mailto:${email || t('email.value')}`} className="hover:text-foreground transition-colors">
                        {email || t('email.value')}
                      </a>
                    </p>
                  </div>
                  <div>
                    <h3 className="font-season-mix text-lg text-foreground mb-2">
                      {t('phone.label')}
                    </h3>
                    <p className="text-sm text-gray-600 font-light">
                      <a href={`tel:${phone || t('phone.value')}`} className="hover:text-foreground transition-colors">
                        {phone || t('phone.value')}
                      </a>
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

