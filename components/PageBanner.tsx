'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface PageBannerProps {
  title: string;
  subtitle?: string;
}

export function PageBanner({ title, subtitle }: PageBannerProps) {
  return (
    <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Image with Parallax Effect */}
      <motion.div
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/images/home-banner.jpg"
          alt={title}
          fill
          priority
          className="object-cover"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </motion.div>

      {/* Animated Overlay Pattern */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Decorative Line Above */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '80px' }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-[1px] bg-white/40 mx-auto mb-6"
          />

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-medium text-2xl md:text-3xl lg:text-4xl text-white mb-4 tracking-wide px-4"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-white/80 font-light"
            >
              {subtitle}
            </motion.p>
          )}

          {/* Decorative Line Below */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '80px' }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="h-[1px] bg-white/40 mx-auto mt-6"
          />
        </motion.div>
      </div>

      {/* Animated Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 1,
          repeat: Infinity,
          repeatType: 'reverse',
          repeatDelay: 0.5,
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-1 h-2 bg-white/50 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}

