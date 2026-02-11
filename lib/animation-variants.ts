import type { Variants } from 'framer-motion';

// Shared Framer Motion animation variants for casino UI
// Used across game components for consistent, polished transitions

// Panel enter/exit (ActionPanel, ShowdownPanel, GameOverPanel)
export const panelVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: { duration: 0.2 },
  },
};

// Stagger children (card dealing, leaderboard entries)
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

// Card dealing (community cards) — custom delay per card index
export const cardDeal: Variants = {
  hidden: { opacity: 0, y: -30, rotateY: 90, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      type: 'spring' as const,
      stiffness: 200,
    },
  }),
};

// Button press feedback
export const buttonTap = { scale: 0.95 };
export const buttonHover = { scale: 1.03, y: -1 };

// Error shake
export const errorShake: Variants = {
  hidden: { opacity: 0, x: 0 },
  visible: {
    opacity: 1,
    x: [0, -8, 8, -4, 4, 0],
    transition: { duration: 0.4 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

// Table surface appear
export const tableAppear: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

// Stage text swap (GameHeader stage indicator)
export const stageSwap = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.15 } },
};
