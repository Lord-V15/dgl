import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WaxSeal from '../effects/WaxSeal';

interface EnvelopeAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
}

type AnimationPhase = 'fold' | 'close' | 'seal' | 'fly' | 'burst' | 'done';

export default function EnvelopeAnimation({ isVisible, onComplete }: EnvelopeAnimationProps) {
  const [phase, setPhase] = useState<AnimationPhase>('fold');

  useEffect(() => {
    if (!isVisible) {
      setPhase('fold');
      return;
    }
    const timers = [
      setTimeout(() => setPhase('close'), 600),
      setTimeout(() => setPhase('seal'), 1200),
      setTimeout(() => setPhase('fly'), 2000),
      setTimeout(() => setPhase('burst'), 2800),
      setTimeout(() => {
        setPhase('done');
        onComplete();
      }, 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isVisible, onComplete]);

  // Petal-shaped burst particles
  const petals = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        angle: (i * Math.PI * 2) / 16,
        color: ['#F4C2C2', '#D4AF37', '#C4B7D5', '#D4A0A0'][i % 4],
        distance: 100 + Math.random() * 60,
        rotation: Math.random() * 360,
        size: 8 + Math.random() * 6,
      })),
    []
  );

  return (
    <AnimatePresence>
      {isVisible && phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(44, 24, 16, 0.15)', backdropFilter: 'blur(6px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative">
            {/* Letter folding */}
            <motion.div
              className="w-72 rounded-lg p-6 shadow-lg border border-gold/10"
              style={{ background: 'linear-gradient(145deg, #FFFDF5, #F0E6CE)', transformOrigin: 'bottom' }}
              animate={{
                scaleY: phase === 'fold' ? 1 : 0,
                opacity: phase === 'fold' ? 1 : 0,
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <div className="space-y-2">
                <div className="h-2 bg-ink/8 rounded w-3/4" />
                <div className="h-2 bg-ink/8 rounded w-full" />
                <div className="h-2 bg-ink/8 rounded w-5/6" />
                <div className="h-2 bg-ink/8 rounded w-2/3" />
              </div>
            </motion.div>

            {/* Envelope */}
            {phase !== 'fold' && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={
                  phase === 'fly'
                    ? { y: -300, opacity: 0, scale: 0.5 }
                    : { y: 0, opacity: 1, scale: 1 }
                }
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="relative w-72 h-48">
                  <svg viewBox="0 0 288 192" className="w-full h-full">
                    <defs>
                      <linearGradient id="envGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F5ECD7" />
                        <stop offset="100%" stopColor="#E8DBBF" />
                      </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="288" height="192" rx="8" fill="url(#envGrad)" stroke="#D4AF37" strokeWidth="1" />
                    <motion.path
                      d="M 0 0 L 144 96 L 288 0"
                      fill="#FFFDF5"
                      stroke="#D4AF37"
                      strokeWidth="1"
                      style={{ originY: 0, originX: '50%' }}
                      animate={{
                        rotateX: phase === 'close' || phase === 'seal' || phase === 'fly' ? 180 : 0,
                      }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />
                    <path d="M 0 192 L 144 96 L 288 192" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4" />
                  </svg>

                  {/* Wax seal stamp with glow */}
                  {(phase === 'seal' || phase === 'fly') && (
                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      initial={{ scale: 3, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    >
                      {/* Red glow behind seal */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: 'radial-gradient(circle, rgba(139,0,0,0.4) 0%, transparent 70%)',
                          transform: 'scale(2)',
                        }}
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                      <WaxSeal size={48} />
                    </motion.div>
                  )}

                  {/* Sparkle trail during fly */}
                  {phase === 'fly' &&
                    Array.from({ length: 6 }).map((_, i) => (
                      <motion.div
                        key={`spark-${i}`}
                        className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full bg-gold"
                        initial={{ opacity: 1, x: 0, y: 0 }}
                        animate={{
                          opacity: 0,
                          x: (Math.random() - 0.5) * 40,
                          y: i * 15 + 10,
                        }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                      />
                    ))}
                </div>
              </motion.div>
            )}

            {/* Petal burst */}
            {phase === 'burst' && (
              <div className="absolute inset-0 flex items-center justify-center">
                {petals.map((p, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                    animate={{
                      x: Math.cos(p.angle) * p.distance,
                      y: Math.sin(p.angle) * p.distance,
                      scale: [0, 1.2, 0],
                      opacity: [1, 1, 0],
                      rotate: p.rotation,
                    }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  >
                    <svg width={p.size} height={p.size * 1.4} viewBox="0 0 10 14" fill={p.color}>
                      <path d="M5 0 C7 3 10 6 9 10 C8 13 6 14 5 14 C4 14 2 13 1 10 C0 6 3 3 5 0Z" />
                    </svg>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
