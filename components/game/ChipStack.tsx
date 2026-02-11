'use client';

import Image from 'next/image';
import { ChipDisc } from '@/lib/chip-visuals';

interface ChipStackProps {
  discs: ChipDisc[];
  size?: 'sm' | 'md';
}

/**
 * Renders a visual stack or pile of poker chip images.
 * Each chip is absolutely positioned using its offset values.
 */
export default function ChipStack({ discs, size = 'sm' }: ChipStackProps) {
  if (discs.length === 0) return null;

  // Image dimensions based on size variant
  const imgW = size === 'sm' ? 20 : 28;
  const imgH = size === 'sm' ? 12 : 17;

  // Calculate container height based on stack offsets
  const minY = Math.min(...discs.map(d => d.offsetY));
  const containerHeight = Math.abs(minY) + (size === 'sm' ? 14 : 20);
  const containerWidth = size === 'sm' ? 28 : 36;

  return (
    <div
      className="relative pointer-events-none"
      style={{ height: `${containerHeight}px`, width: `${containerWidth}px` }}
    >
      {discs.map((disc, i) => (
        <Image
          key={i}
          src="/chip.png"
          alt=""
          width={imgW}
          height={imgH}
          className="chip-disc"
          style={{
            left: `calc(50% + ${disc.offsetX}px)`,
            bottom: `${-disc.offsetY}px`,
            transform: 'translateX(-50%)',
            zIndex: i,
          }}
          draggable={false}
        />
      ))}
    </div>
  );
}
