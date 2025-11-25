'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { MobileMenu } from './MobileMenu';

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/services`, label: t('services') },
    { href: `/${locale}/portfolio`, label: t('portfolio') },
    { href: `/${locale}/news`, label: t('news') },
    { href: `/${locale}/careers`, label: t('careers') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  const switchLanguage = (newLocale: string) => {
    const path = window.location.pathname;
    const newPath = path.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = newPath;
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            <Link href={`/${locale}`} className="flex items-center space-x-4">
              <Image
                src="/images/logo_ligne.png"
                alt="Ligne Carré"
                width={60}
                height={60}
                className="object-contain"
                priority
              />
              <div className="hidden md:block">
                <div className="font-season-mix text-xl lg:text-2xl text-foreground">
                  Ligne Carré
                </div>
                <div className="text-xs lg:text-sm text-gray-600 font-light">
                  {locale === 'en' ? 'Architecture and Project Management' : 'Architecture et Gestion de Projets'}
                </div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm uppercase tracking-wide text-foreground hover:text-gray-600 transition-colors duration-300 font-normal"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => switchLanguage('en')}
                  className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${
                    locale === 'en' ? 'border-foreground' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  aria-label="Switch to English"
                >
                  <Image
                    src="https://flagcdn.com/w40/us.png"
                    alt="English"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </button>
                <button
                  onClick={() => switchLanguage('fr')}
                  className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${
                    locale === 'fr' ? 'border-foreground' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  aria-label="Switch to French"
                >
                  <Image
                    src="https://flagcdn.com/w40/fr.png"
                    alt="Français"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </button>
              </div>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-foreground"
                aria-label="Open menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
        locale={locale}
        onLanguageSwitch={switchLanguage}
      />
    </>
  );
}

