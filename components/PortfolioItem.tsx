'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';
import { useTranslations } from 'next-intl';

interface PortfolioItemProps {
  item: {
    id: string;
    title: string;
    category: string;
    image: any; // Sanity image object
    slug?: string; // Optional slug for linking
    projectType?: string;
    client?: string;
    role?: string;
    area?: string;
    estimatedCost?: string;
  };
}

export function PortfolioItem({ item }: PortfolioItemProps) {
  const t = useTranslations('portfolio.detail');
  
  // Use fallback image if no image is provided
  const imageUrl = item.image 
    ? urlFor(item.image).width(800).height(600).url()
    : '/images/home-banner.jpg';

  const content = (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
    >
      <div className="relative h-64 lg:h-80 mb-4 overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-xl text-foreground mb-2">
          {item.title}
        </h3>
        
        {item.projectType && (
          <div className="text-sm">
            <span className="text-gray-600 font-light">{t('type')}: </span>
            <span className="text-foreground font-light capitalize">{item.projectType}</span>
          </div>
        )}
        
        {item.client && (
          <div className="text-sm">
            <span className="text-gray-600 font-light">{t('client')}: </span>
            <span className="text-foreground font-light">{item.client}</span>
          </div>
        )}
        
        {item.role && (
          <div className="text-sm">
            <span className="text-gray-600 font-light">{t('role')}: </span>
            <span className="text-foreground font-light">{item.role}</span>
          </div>
        )}
        
        {item.area && (
          <div className="text-sm">
            <span className="text-gray-600 font-light">{t('area')}: </span>
            <span className="text-foreground font-light">{item.area}</span>
          </div>
        )}
        
        {item.estimatedCost && (
          <div className="text-sm">
            <span className="text-gray-600 font-light">{t('cost')}: </span>
            <span className="text-foreground font-light">{item.estimatedCost}</span>
          </div>
        )}
      </div>
    </motion.div>
  );

  // If slug is provided, wrap in Link
  if (item.slug) {
    return (
      <Link href={`/portfolio/${item.slug}`}>
        {content}
      </Link>
    );
  }

  return content;
}

