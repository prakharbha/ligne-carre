'use client';

import { AnimatedSection } from '@/components/AnimatedSection';
import { PageBanner } from '@/components/PageBanner';
import { PortableText } from '@portabletext/react';
import { getLocalizedField } from '@/lib/sanity/utils';

interface PrivacyPageProps {
  pageContent: any;
  pageBanner?: any;
  locale: 'en' | 'fr';
}

export default function PrivacyPage({ pageContent, pageBanner, locale }: PrivacyPageProps) {
  if (!pageContent) {
    return null;
  }

  const title = getLocalizedField(pageContent, locale, 'title');
  const subtitle = getLocalizedField(pageContent, locale, 'subtitle');
  const content = getLocalizedField(pageContent, locale, 'content');
  
  const bannerImage = pageBanner?.image;
  const bannerAltText = pageBanner ? getLocalizedField(pageBanner, locale, 'altText') : undefined;

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
                      <ul className="list-disc list-inside mb-4 space-y-2 text-base lg:text-lg text-foreground leading-relaxed font-light ml-4">
                        {children}
                      </ul>
                    ),
                    number: ({ children }: any) => (
                      <ol className="list-decimal list-inside mb-4 space-y-2 text-base lg:text-lg text-foreground leading-relaxed font-light ml-4">
                        {children}
                      </ol>
                    ),
                  },
                  listItem: {
                    bullet: ({ children }: any) => (
                      <li className="ml-4">{children}</li>
                    ),
                    number: ({ children }: any) => (
                      <li className="ml-4">{children}</li>
                    ),
                  },
                }}
              />
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

