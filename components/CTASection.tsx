'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function CTASection() {
  const t = useTranslations('home');
  const locale = useLocale();

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-season-mix text-3xl lg:text-4xl text-foreground mb-6">
            {t('cta')}
          </h2>
          <Link
            href={`/${locale}/portfolio`}
            className="inline-block px-8 py-3 border-2 border-foreground text-foreground font-light hover:bg-foreground hover:text-white transition-all duration-300"
          >
            {t('cta')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

