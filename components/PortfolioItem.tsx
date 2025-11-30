'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';

interface PortfolioItemProps {
  item: {
    id: string;
    title: string;
    category: string;
    image: any; // Sanity image object
    slug?: string; // Optional slug for linking
  };
}

export function PortfolioItem({ item }: PortfolioItemProps) {
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
      <h3 className="font-medium text-xl text-foreground mb-2">
        {item.title}
      </h3>
      <p className="text-base text-gray-600 font-light capitalize">
        {item.category}
      </p>
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

