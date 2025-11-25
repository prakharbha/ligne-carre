'use client';

import { useTranslations } from 'next-intl';
import { AnimatedSection } from '@/components/AnimatedSection';
import { PageBanner } from '@/components/PageBanner';
import { motion } from 'framer-motion';

export default function NewsPage() {
  const t = useTranslations('news');

  const newsItems = [
    {
      id: 1,
      title: 'New Project Announcement',
      date: 'January 2025',
      excerpt: 'We are excited to announce our latest architectural project in the MENA region.',
    },
    {
      id: 2,
      title: 'Award Recognition',
      date: 'December 2024',
      excerpt: 'Ligne Carré receives recognition for excellence in sustainable architecture.',
    },
    {
      id: 3,
      title: 'Team Expansion',
      date: 'November 2024',
      excerpt: 'We are growing our team to better serve our clients across Montreal and the MENA region.',
    },
  ];

  return (
    <div>
      <PageBanner title={t('title')} subtitle="Latest Updates & Announcements" />
      
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">

          <div className="space-y-12">
            {newsItems.map((item, index) => (
              <AnimatedSection key={item.id} delay={index * 0.1}>
                <motion.article
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="border-b border-gray-200 pb-12 last:border-0"
                >
                  <div className="text-sm text-gray-500 font-light mb-2">{item.date}</div>
                  <h2 className="font-season-mix text-2xl lg:text-3xl text-foreground mb-4">
                    {item.title}
                  </h2>
                  <p className="text-base lg:text-lg text-foreground leading-relaxed font-light">
                    {item.excerpt}
                  </p>
                </motion.article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

