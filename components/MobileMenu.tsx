'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: Array<{ href: '/' | '/about' | '/services' | '/portfolio' | '/news' | '/careers' | '/contact'; label: string }>;
  locale: string;
  onLanguageSwitch: (locale: 'en' | 'fr') => void;
}

export function MobileMenu({ isOpen, onClose, navItems, locale, onLanguageSwitch }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-white"
        >
          <div className="h-full flex flex-col">
            <div className="flex justify-end p-6">
              <button
                onClick={onClose}
                className="p-2 text-foreground hover:text-gray-600 transition-colors"
                aria-label="Close menu"
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
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center items-center space-y-8 px-6">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="text-2xl uppercase tracking-wide font-normal text-foreground hover:text-gray-600 transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="flex justify-center items-center space-x-4 pb-12">
              <button
                onClick={() => {
                  onLanguageSwitch('en');
                  onClose();
                }}
                className={`px-4 py-2 text-base font-light border transition-all ${
                  locale === 'en' ? 'border-foreground text-foreground bg-foreground/5' : 'border-gray-300 text-gray-600 hover:border-foreground hover:text-foreground'
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => {
                  onLanguageSwitch('fr');
                  onClose();
                }}
                className={`px-4 py-2 text-base font-light border transition-all ${
                  locale === 'fr' ? 'border-foreground text-foreground bg-foreground/5' : 'border-gray-300 text-gray-600 hover:border-foreground hover:text-foreground'
                }`}
                aria-label="Switch to French"
              >
                FR
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

