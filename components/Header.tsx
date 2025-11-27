'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { MobileMenu } from './MobileMenu';
import { getLocalizedPath } from '@/lib/routing';

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale() as 'en' | 'fr';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/' as const, label: t('home'), route: '/' as const },
    { href: '/about' as const, label: t('about'), route: '/about' as const },
    { href: '/services' as const, label: t('services'), route: '/services' as const },
    { href: '/portfolio' as const, label: t('portfolio'), route: '/portfolio' as const },
    { href: '/news' as const, label: t('news'), route: '/news' as const },
    { href: '/careers' as const, label: t('careers'), route: '/careers' as const },
    { href: '/contact' as const, label: t('contact'), route: '/contact' as const },
  ];

  const switchLanguage = (newLocale: 'en' | 'fr') => {
    const currentPath = window.location.pathname;
    // Extract the path after the locale
    const pathWithoutLocale = currentPath.replace(/^\/(en|fr)/, '') || '/';
    
    // Map French slugs back to route keys
    const slugToRoute: Record<string, string> = {
      '/': '/',
      '/a-propos': '/about',
      '/about': '/about',
      '/nos-services': '/services',
      '/services': '/services',
      '/projets': '/portfolio',
      '/portfolio': '/portfolio',
      '/actualites': '/news',
      '/news': '/news',
      '/carrieres': '/careers',
      '/careers': '/careers',
      '/nous-contacter': '/contact',
      '/contact': '/contact',
      '/confidentialite': '/privacy',
      '/privacy': '/privacy',
    };
    
    const route = (slugToRoute[pathWithoutLocale] || pathWithoutLocale) as '/' | '/about' | '/services' | '/portfolio' | '/news' | '/careers' | '/contact' | '/privacy';
    const newPath = getLocalizedPath(route, newLocale);
    window.location.href = newPath;
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#cccccc] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            <Link href="/" className="flex items-center space-x-3 md:space-x-4">
              <Image
                src="/images/logo_ligne-updated.webp"
                alt="Ligne Carré"
                width={50}
                height={50}
                className="object-contain md:w-[60px] md:h-[60px]"
                priority
              />
              <div>
                <div className="font-medium text-base md:text-xl lg:text-2xl text-foreground">
                  Ligne Carré
                </div>
                <div className="text-[10px] md:text-xs lg:text-sm text-gray-600 font-light leading-tight">
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

