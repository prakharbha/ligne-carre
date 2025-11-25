'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const t = useTranslations('nav');
  const tFooter = useTranslations('footer');
  const locale = useLocale();

  const footerNavItems = [
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/services`, label: t('services') },
    { href: `/${locale}/portfolio`, label: t('portfolio') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <footer className="bg-gray-800 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-8">
          {/* Logo Section */}
          <div>
            <Link href={`/${locale}`} className="flex items-center space-x-4 mb-4">
              <Image
                src="/images/logo_ligne.png"
                alt="Ligne Carré"
                width={50}
                height={50}
                className="object-contain"
              />
              <div>
                <div className="font-season-mix text-lg text-white">
                  Ligne Carré
                </div>
                <div className="text-xs text-gray-400 font-light">
                  {locale === 'en' ? 'Architecture and Project Management' : 'Architecture et Gestion de Projets'}
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Section */}
          <div>
            <h3 className="text-white font-season-mix text-sm uppercase tracking-wide mb-4">
              Navigation
            </h3>
            <nav className="flex flex-col space-y-3">
              {footerNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-300 font-light"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-white font-season-mix text-sm uppercase tracking-wide mb-4">
              Contact
            </h3>
            <div className="space-y-2 text-sm text-gray-300 font-light">
              <p>Montreal, Quebec, Canada</p>
              <p className="text-gray-400">info@lignecarre.com</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8">
          <div className="text-center">
            <p className="text-sm text-gray-400 font-light">
              {tFooter('copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

