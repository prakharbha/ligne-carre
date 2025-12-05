'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { AnimatedSection } from '@/components/AnimatedSection';
import { PageBanner } from '@/components/PageBanner';
import { getLocalizedField } from '@/lib/sanity/utils';

interface AboutPageProps {
  pageContent: any;
  locale: 'en' | 'fr';
}

export default function AboutPageClient({ pageContent, locale }: AboutPageProps) {
  const t = useTranslations('about');

  // Use Sanity content if available, fallback to translations
  const title = pageContent ? getLocalizedField(pageContent, locale, 'title') : t('title');
  const subtitle = pageContent ? getLocalizedField(pageContent, locale, 'subtitle') : t('subtitle');
  const content = pageContent ? getLocalizedField(pageContent, locale, 'content') : null;

  // Helper to check if a block is the Team heading
  const isTeamHeading = (node: any) => {
    return node.style === 'h2' && 
           node.children?.some((child: any) => 
             typeof child.text === 'string' && 
             (child.text.toLowerCase().includes('team') || child.text.toLowerCase().includes('équipe'))
           );
  };

  // Split content into sections: before Team, Team section, after Team
  const splitContent = (content: any[]) => {
    if (!content || content.length === 0) return { before: [], team: [], after: [] };
    
    const teamIndex = content.findIndex((block: any) => isTeamHeading(block));
    
    if (teamIndex === -1) {
      return { before: content, team: [], after: [] };
    }
    
    return {
      before: content.slice(0, teamIndex),
      team: content.slice(teamIndex),
      after: [],
    };
  };

  const portableTextComponents = {
    block: {
      h2: ({ children }: any) => (
        <h2 className="font-medium text-3xl lg:text-4xl text-foreground mb-6 mt-12 first:mt-0">
          {children}
        </h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="font-medium text-2xl lg:text-3xl text-foreground mb-2 mt-8">
          {children}
        </h3>
      ),
      normal: ({ children }: any) => (
        <p className="text-base lg:text-lg text-foreground leading-relaxed font-light mb-4">
          {children}
        </p>
      ),
    },
  };

  return (
    <div>
      <PageBanner title={title} subtitle={subtitle || undefined} />
      
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {content && content.length > 0 ? (() => {
            const { before, team } = splitContent(content);
            return (
              <div className="space-y-16">
                {/* Content before Team section */}
                {before.length > 0 && (
                  <AnimatedSection delay={0.1}>
                    <div className="prose prose-lg max-w-none">
                      <PortableText value={before} components={portableTextComponents} />
                    </div>
                  </AnimatedSection>
                )}
                
                {/* Team Section with Image */}
                {team.length > 0 && (
                  <AnimatedSection delay={0.3}>
                    <div className="pt-12 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        <div className="md:col-span-1">
                          <div className="relative w-full aspect-square max-w-sm mx-auto md:mx-0">
                            <Image
                              src="/images/fadi-abou-sader.webp"
                              alt={t('team.member.name')}
                              fill
                              className="object-cover rounded-lg"
                              sizes="(max-width: 768px) 100vw, 300px"
                            />
                          </div>
                          <div className="mt-4 flex justify-center md:justify-start">
                            <a
                              href="https://linkedin.com/in/fadi-abousader-104a03110"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-gray-600 hover:text-foreground transition-colors duration-300"
                              aria-label="LinkedIn"
                            >
                              <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                            </a>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <div className="prose prose-lg max-w-none">
                            <PortableText value={team} components={portableTextComponents} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                )}
              </div>
            );
          })() : (
            // Fallback to translations if no Sanity content
            <div className="space-y-16">
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

              <AnimatedSection delay={0.3}>
                <div className="pt-12 border-t border-gray-200">
                  <h2 className="font-medium text-3xl lg:text-4xl text-foreground mb-8">
                    {t('team.title')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    <div className="md:col-span-1">
                      <div className="relative w-full aspect-square max-w-sm mx-auto md:mx-0">
                        <Image
                          src="/images/fadi-abou-sader.webp"
                          alt={t('team.member.name')}
                          fill
                          className="object-cover rounded-lg"
                          sizes="(max-width: 768px) 100vw, 300px"
                        />
                      </div>
                      <div className="mt-4 flex justify-center md:justify-start">
                        <a
                          href="https://linkedin.com/in/fadi-abousader-104a03110"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-gray-600 hover:text-foreground transition-colors duration-300"
                          aria-label="LinkedIn"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-6">
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
                </div>
              </AnimatedSection>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

