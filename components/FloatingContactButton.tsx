'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingContactButton() {
  const t = useTranslations('contact');
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
        className="relative"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Tooltip/Bubble */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute right-full mr-2 md:mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap hidden md:block"
            >
              <div className="bg-foreground text-white px-4 py-2 rounded-lg shadow-lg relative">
                <span className="text-sm font-light">{t('title')}</span>
                {/* Arrow pointing to button */}
                <div className="absolute left-full top-1/2 -translate-y-1/2">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-foreground"></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Button */}
        <Link href="/contact">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              y: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
            className="w-14 h-14 md:w-16 md:h-16 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center text-white transition-colors duration-300 group"
            aria-label={t('title')}
          >
            {/* Pulse animation ring */}
            <motion.div
              className="absolute inset-0 rounded-full bg-blue-600"
              animate={{
                scale: [1, 1.5, 1.5],
                opacity: [0.6, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
            
            {/* Icon */}
            <svg
              className="w-6 h-6 md:w-7 md:h-7 relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}

