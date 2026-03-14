import { type Variants } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right';

interface ScrollAnimationOptions {
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
}

const directionOffsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
};

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export function useScrollAnimation({
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 40,
}: ScrollAnimationOptions = {}) {
  const offset = directionOffsets[direction];
  const scale = distance / 40;

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: offset.x * scale,
      y: offset.y * scale,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: EASE,
      },
    },
  };

  return {
    variants,
    initial: 'hidden' as const,
    whileInView: 'visible' as const,
    viewport: { once: true, margin: '-50px' },
  };
}

// Reusable animation variants
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};
