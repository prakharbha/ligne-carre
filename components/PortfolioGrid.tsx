'use client';

import { motion } from 'framer-motion';
import { PortfolioItem } from './PortfolioItem';

interface PortfolioGridProps {
  items: Array<{
    id: string;
    title: string;
    category: string;
    image: any;
    slug?: string;
    projectType?: string;
    client?: string;
    role?: string;
    area?: string;
    estimatedCost?: string;
  }>;
  selectedCategory: string;
}

export function PortfolioGrid({ items, selectedCategory }: PortfolioGridProps) {
  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.category === selectedCategory);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {filteredItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.4 }}
        >
          <PortfolioItem item={item} />
        </motion.div>
      ))}
    </div>
  );
}

