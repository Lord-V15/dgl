import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface PolaroidCardProps {
  src: string;
  caption?: string;
  date?: string;
  index?: number;
}

// Tape colors for variety
const tapeColors = [
  'rgba(212, 175, 55, 0.2)',
  'rgba(244, 194, 194, 0.3)',
  'rgba(196, 183, 213, 0.25)',
  'rgba(188, 184, 138, 0.25)',
];

export default function PolaroidCard({ src, caption, date, index = 0 }: PolaroidCardProps) {
  const [isFullSize, setIsFullSize] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const rotation = useMemo(() => ((index * 7 + 3) % 9) - 4, [index]);
  const tapeColor = tapeColors[index % tapeColors.length];
  const tapeRotation = useMemo(() => ((index * 13 + 5) % 20) - 10, [index]);

  useEffect(() => {
    if (!isFullSize) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullSize(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isFullSize]);

  return (
    <>
      <motion.div
        className="relative cursor-pointer"
        whileHover={{ y: -6, transition: { duration: 0.3 } }}
        onClick={() => setIsFullSize(true)}
      >
        {/* Washi tape */}
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 z-10 rounded-sm"
          style={{
            background: tapeColor,
            transform: `translateX(-50%) rotate(${tapeRotation}deg)`,
            backdropFilter: 'blur(1px)',
          }}
        />

        <motion.div
          className="bg-white p-3 pb-14 relative"
          style={{
            rotate: rotation,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div className="aspect-square overflow-hidden bg-cream/50 relative">
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                />
              </div>
            )}
            <img
              src={src}
              alt={caption || 'Memory'}
              className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
            />
          </div>

          <div className="absolute bottom-2 left-3 right-3">
            {caption && (
              <p
                className="font-caveat text-base text-ink/60 truncate"
                style={{ transform: `rotate(${((index * 3) % 5) - 2}deg)` }}
              >
                {caption}
              </p>
            )}
            {date && (
              <p className="font-inter text-[10px] text-ink/25 mt-0.5">
                {format(new Date(date), 'MMM d, yyyy')}
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Full size overlay with ornate frame */}
      <AnimatePresence>
        {isFullSize && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer p-6"
            style={{ background: 'rgba(44, 24, 16, 0.5)', backdropFilter: 'blur(10px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullSize(false)}
          >
            <motion.div
              className="relative max-w-2xl max-h-[85vh]"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gold picture frame */}
              <div
                className="p-3 md:p-4"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #B8941F, #E8D48B, #D4AF37)',
                  borderRadius: '4px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                }}
              >
                <div className="bg-white p-2">
                  <img
                    src={src}
                    alt={caption || 'Memory'}
                    className="max-w-full max-h-[65vh] object-contain mx-auto block"
                  />
                </div>
              </div>

              {/* Caption strip */}
              {(caption || date) && (
                <motion.div
                  className="text-center mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {caption && (
                    <p className="font-caveat text-xl text-cream/90">{caption}</p>
                  )}
                  {date && (
                    <p className="font-inter text-xs text-cream/50 mt-1">
                      {format(new Date(date), 'MMMM d, yyyy')}
                    </p>
                  )}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
