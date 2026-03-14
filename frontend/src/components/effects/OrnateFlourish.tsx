import { motion } from 'framer-motion';

interface OrnateFlourProps {
  variant?: 'simple' | 'wide';
  className?: string;
  color?: string;
  animated?: boolean;
}

export default function OrnateFlourish({
  variant = 'simple',
  className = '',
  color = 'rgba(212, 175, 55, 0.4)',
  animated = true,
}: OrnateFlourProps) {
  const Wrapper = animated ? motion.div : 'div';
  const wrapperProps = animated
    ? {
        initial: { opacity: 0, scaleX: 0 },
        whileInView: { opacity: 1, scaleX: 1 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
      }
    : {};

  if (variant === 'wide') {
    return (
      // @ts-expect-error - motion.div vs div
      <Wrapper className={`flex items-center justify-center gap-3 ${className}`} {...wrapperProps}>
        <svg width="80" height="16" viewBox="0 0 80 16" fill="none">
          <path d="M78 8C70 8 65 2 55 2C45 2 42 8 35 8C28 8 25 2 15 2C8 2 2 8 2 8" stroke={color} strokeWidth="1" fill="none" />
          <path d="M78 8C70 8 65 14 55 14C45 14 42 8 35 8C28 8 25 14 15 14C8 14 2 8 2 8" stroke={color} strokeWidth="1" fill="none" />
        </svg>
        <svg width="8" height="8" viewBox="0 0 8 8">
          <path d="M4 0L5.5 2.5L8 4L5.5 5.5L4 8L2.5 5.5L0 4L2.5 2.5Z" fill={color} />
        </svg>
        <svg width="80" height="16" viewBox="0 0 80 16" fill="none" style={{ transform: 'scaleX(-1)' }}>
          <path d="M78 8C70 8 65 2 55 2C45 2 42 8 35 8C28 8 25 2 15 2C8 2 2 8 2 8" stroke={color} strokeWidth="1" fill="none" />
          <path d="M78 8C70 8 65 14 55 14C45 14 42 8 35 8C28 8 25 14 15 14C8 14 2 8 2 8" stroke={color} strokeWidth="1" fill="none" />
        </svg>
      </Wrapper>
    );
  }

  return (
    // @ts-expect-error - motion.div vs div
    <Wrapper className={`flex items-center justify-center gap-4 ${className}`} {...wrapperProps}>
      <div className="h-px flex-1 max-w-16" style={{ background: `linear-gradient(to right, transparent, ${color})` }} />
      <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
        <path d="M2 6C5 2 8 2 12 6C16 10 19 10 22 6" stroke={color} strokeWidth="1" strokeLinecap="round" />
        <path d="M2 6C5 10 8 10 12 6C16 2 19 2 22 6" stroke={color} strokeWidth="1" strokeLinecap="round" />
      </svg>
      <div className="h-px flex-1 max-w-16" style={{ background: `linear-gradient(to left, transparent, ${color})` }} />
    </Wrapper>
  );
}
