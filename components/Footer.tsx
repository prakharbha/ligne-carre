'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { getLocalizedField } from '@/lib/sanity/utils';

interface FooterProps {
  siteSettings?: any;
}

export function Footer({ siteSettings }: FooterProps) {
  const t = useTranslations('nav');
  const tFooter = useTranslations('footer');
  const locale = useLocale() as 'en' | 'fr';

  const footerNavItems = [
    { href: '/about' as const, label: t('about') },
    { href: '/services' as const, label: t('services') },
    { href: '/portfolio' as const, label: t('portfolio') },
    { href: '/contact' as const, label: t('contact') },
  ];

  const footerContact = siteSettings?.footerContact;
  const address = footerContact
    ? getLocalizedField(footerContact, locale, 'address')
    : 'Montreal, Quebec, Canada';
  const email = footerContact?.email || 'info@lignecarre.com';

  return (
    <footer className="bg-gray-800 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-8">
          {/* Logo Section */}
          <div>
            <Link href="/" className="flex items-center space-x-4 mb-4">
              <Image
                src="/images/logo_ligne-updated.webp"
                alt="Ligne Carré"
                width={50}
                height={50}
                className="object-contain"
              />
              <div>
                <div className="font-medium text-lg text-white">
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
            <h3 className="text-white font-medium text-sm uppercase tracking-wide mb-4">
              {tFooter('navigation')}
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
            <h3 className="text-white font-medium text-sm uppercase tracking-wide mb-4">
              {tFooter('contact')}
            </h3>
            <div className="space-y-2 text-sm text-gray-300 font-light">
              <p>{address}</p>
              <p className="text-gray-400">{email}</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 font-light">
              {tFooter('copyright')}
            </p>
            <Link
              href="/privacy"
              className="text-sm text-gray-400 hover:text-white transition-colors duration-300 font-light"
            >
              {tFooter('privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

