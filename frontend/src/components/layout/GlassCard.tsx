import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'parchment';
  flourish?: boolean;
  tilt?: boolean;
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

export default function GlassCard({
  children,
  className = '',
  hover = false,
  onClick,
  variant = 'default',
  flourish = false,
  tilt = false,
}: GlassCardProps) {
  const isParchment = variant === 'parchment';
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!tilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTiltStyle({ rotateX: -y * 8, rotateY: x * 8 });
  }, [tilt]);

  const handleMouseLeave = useCallback(() => {
    if (tilt) setTiltStyle({ rotateX: 0, rotateY: 0 });
  }, [tilt]);

  return (
    <motion.div
      ref={cardRef}
      className={`${isParchment ? 'deckled-edge' : 'glass'} p-6 md:p-8 relative gold-shimmer ${className}`}
      style={{
        ...(isParchment ? {
          background: 'linear-gradient(145deg, var(--color-ivory), var(--color-parchment))',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06), inset 0 1px 2px rgba(255,255,255,0.5)',
        } : {}),
        cursor: onClick ? 'pointer' : undefined,
        perspective: tilt ? 800 : undefined,
      }}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-30px' }}
      animate={tilt ? {
        rotateX: tiltStyle.rotateX,
        rotateY: tiltStyle.rotateY,
      } : undefined}
      whileHover={
        hover
          ? {
              y: -4,
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12), 0 0 30px rgba(212, 175, 55, 0.08), 0 0 0 1px rgba(212, 175, 55, 0.3)',
            }
          : undefined
      }
      transition={{ duration: 0.3, type: tilt ? 'spring' : 'tween', stiffness: 300, damping: 20 }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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
