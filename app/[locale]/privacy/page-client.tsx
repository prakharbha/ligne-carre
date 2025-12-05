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
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

