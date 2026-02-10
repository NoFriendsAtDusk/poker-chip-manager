'use client';

import { motion } from 'framer-motion';
import { cardDeal } from '@/lib/animation-variants';

interface CommunityCardsProps {
  count: number; // 3, 4, or 5
}

export default function CommunityCards({ count }: CommunityCardsProps) {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="felt-surface rounded-lg p-4 sm:p-6 border-2 border-casino-gold-dark">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <span className="casino-text-white text-lg sm:text-xl font-semibold">Community Cards:</span>
          <div className="flex gap-2 sm:gap-3" style={{ perspective: '600px' }}>
            {Array.from({ length: count }).map((_, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={cardDeal}
                initial="hidden"
                animate="visible"
                className="w-14 h-20 sm:w-20 sm:h-28 bg-white rounded-lg border-4 border-casino-gold shadow-2xl flex items-center justify-center"
              >
                <div className="text-2xl sm:text-4xl">♠️</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
