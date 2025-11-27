'use client';

import { motion } from 'framer-motion';
import { PortfolioItem } from './PortfolioItem';

interface PortfolioMasonryProps {
  items: Array<{
    id: string;
    title: string;
    category: string;
    image: any;
  }>;
  selectedCategory: string;
}

export function PortfolioMasonry({ items, selectedCategory }: PortfolioMasonryProps) {
  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.category === selectedCategory);

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 lg:gap-8 space-y-6 lg:space-y-8">
      {filteredItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.4 }}
          className="break-inside-avoid mb-6 lg:mb-8"
        >
          <PortfolioItem item={item} />
        </motion.div>
      ))}
    </div>
  );
}

