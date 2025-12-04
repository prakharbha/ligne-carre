'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

const COOKIE_CONSENT_COOKIE = 'cookie-consent';

export function CookieBanner() {
  const t = useTranslations('cookieBanner');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${COOKIE_CONSENT_COOKIE}=`));
    
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    // Set consent cookie (expires in 1 year)
    document.cookie = `${COOKIE_CONSENT_COOKIE}=accepted; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    setIsVisible(false);
    // The middleware will set the locale preference cookie on the next request if geolocation detected a locale
  };

  const handleDecline = () => {
    // Set declined consent cookie (expires in 1 year)
    document.cookie = `${COOKIE_CONSENT_COOKIE}=declined; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-gray-600 font-light text-center sm:text-left flex-1">
                {t('message')}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDecline}
                  className="px-4 py-1.5 text-xs sm:text-sm font-light border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-300 whitespace-nowrap"
                >
                  {t('decline')}
                </button>
                <button
                  onClick={handleAccept}
                  className="px-4 py-1.5 text-xs sm:text-sm font-light bg-foreground text-white hover:bg-gray-700 transition-colors duration-300 whitespace-nowrap"
                >
                  {t('agree')}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

