'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { AnimatedSection } from '@/components/AnimatedSection';
import { PageBanner } from '@/components/PageBanner';
import { PortableText } from '@portabletext/react';
import { getLocalizedField } from '@/lib/sanity/utils';

interface CareersPageProps {
  pageContent: any;
  pageBanner?: any;
  locale: 'en' | 'fr';
}

export default function CareersPage({ pageContent, pageBanner, locale }: CareersPageProps) {
  const t = useTranslations('careers');
  
  const bannerImage = pageBanner?.image;
  const bannerAltText = pageBanner ? getLocalizedField(pageBanner, locale, 'altText') : undefined;

  // Don't render if no content
  if (!pageContent) return null;

  const title = getLocalizedField(pageContent, locale, 'title');
  const subtitle = getLocalizedField(pageContent, locale, 'subtitle');
  const content = getLocalizedField(pageContent, locale, 'content');

  return (
    <div>
      <PageBanner 
        title={title} 
        subtitle={subtitle || undefined}
        bannerImage={bannerImage}
        altText={bannerAltText}
      />
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="prose prose-lg max-w-none">
              {content && content.length > 0 ? (
                <PortableText 
                  value={content}
                  components={{
                    block: {
                      h2: ({ children }) => (
                        <h2 className="font-medium text-2xl lg:text-3xl text-foreground mb-4 mt-8 first:mt-0">
                          {children}
                        </h2>
                      ),
                      normal: ({ children }) => (
                        <p className="text-base lg:text-lg text-foreground leading-relaxed font-light mb-4">
                          {children}
                        </p>
                      ),
                      bullet: ({ children }: any) => (
                        <ul className="list-disc list-outside mb-4 space-y-2 text-base lg:text-lg text-foreground leading-relaxed font-light pl-6">
                          {children}
                        </ul>
                      ),
                      number: ({ children }: any) => (
                        <ol className="list-decimal list-outside mb-4 space-y-2 text-base lg:text-lg text-foreground leading-relaxed font-light pl-6">
                          {children}
                        </ol>
                      ),
                    },
                    listItem: {
                      bullet: ({ children }: any) => (
                        <li className="pl-2 [&>ol]:list-[lower-alpha] [&>ol]:list-outside [&>ol]:pl-6 [&>ol]:mt-2 [&>ol]:mb-2 [&>ul]:list-disc [&>ul]:list-outside [&>ul]:pl-6 [&>ul]:mt-2 [&>ul]:mb-2">
                          {children}
                        </li>
                      ),
                      number: ({ children }: any) => (
                        <li className="pl-2 [&>ol]:list-[lower-alpha] [&>ol]:list-outside [&>ol]:pl-6 [&>ol]:mt-2 [&>ol]:mb-2 [&>ul]:list-disc [&>ul]:list-outside [&>ul]:pl-6 [&>ul]:mt-2 [&>ul]:mb-2">
                          {children}
                        </li>
                      ),
                    },
                  }}
                />
              ) : (
                <p className="text-base lg:text-lg text-foreground leading-relaxed font-light">
                  {t('whyJoin.description')}
                </p>
              )}
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
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
      </section>
    </div>
  );
}

