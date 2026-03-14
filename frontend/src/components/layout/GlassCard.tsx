import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'parchment';
  flourish?: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const parchmentStyle = {
  background: 'linear-gradient(145deg, #F5ECD7, #F0E6CE)',
  borderRadius: '0.5rem',
  boxShadow: '0 4px 20px rgba(0,0,0,0.06), inset 0 1px 2px rgba(255,255,255,0.5)',
};

export default function GlassCard({
  children,
  className = '',
  hover = false,
  onClick,
  variant = 'default',
  flourish = false,
}: GlassCardProps) {
  const isParchment = variant === 'parchment';

  return (
    <motion.div
      className={`${isParchment ? 'deckled-edge' : 'glass'} p-6 md:p-8 relative gold-shimmer ${className}`}
      style={{
        ...(isParchment ? parchmentStyle : {}),
        cursor: onClick ? 'pointer' : undefined,
      }}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-30px' }}
      whileHover={
        hover
          ? {
              y: -4,
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(212, 175, 55, 0.3)',
            }
          : undefined
      }
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      {flourish && (
        <>
          <svg className="absolute top-2 left-2 w-6 h-6 text-gold/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M2 12 C2 6 6 2 12 2" /><path d="M2 8 C2 4 4 2 8 2" />
          </svg>
          <svg className="absolute top-2 right-2 w-6 h-6 text-gold/20 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M2 12 C2 6 6 2 12 2" /><path d="M2 8 C2 4 4 2 8 2" />
          </svg>
          <svg className="absolute bottom-2 right-2 w-6 h-6 text-gold/20 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M2 12 C2 6 6 2 12 2" /><path d="M2 8 C2 4 4 2 8 2" />
          </svg>
          <svg className="absolute bottom-2 left-2 w-6 h-6 text-gold/20 -rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M2 12 C2 6 6 2 12 2" /><path d="M2 8 C2 4 4 2 8 2" />
          </svg>
        </>
      )}
      {children}
    </motion.div>
  );
}
