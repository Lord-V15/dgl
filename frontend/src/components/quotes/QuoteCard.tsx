import { motion } from 'framer-motion';
import type { Quote } from '../../data/quotes';

interface QuoteCardProps {
  quote: Quote;
  className?: string;
}

export default function QuoteCard({ quote, className = '' }: QuoteCardProps) {
  return (
    <motion.div
      className={`glass p-8 md:p-10 text-center relative overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      {/* Corner ornaments */}
      <svg className="absolute top-3 left-3 w-5 h-5 text-gold/15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M2 14 C2 6 6 2 14 2" />
      </svg>
      <svg className="absolute bottom-3 right-3 w-5 h-5 text-gold/15 rotate-180" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M2 14 C2 6 6 2 14 2" />
      </svg>

      {/* Ornate opening quote */}
      <svg className="absolute top-4 left-6 w-8 h-8 text-gold/15" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M8 20c-2.2 0-4-1.8-4-4s1.8-4 4-4c0-4-2-8-6-10l2-2c6 4 10 10 10 16 0 2.2-1.8 4-4 4zm16 0c-2.2 0-4-1.8-4-4s1.8-4 4-4c0-4-2-8-6-10l2-2c6 4 10 10 10 16 0 2.2-1.8 4-4 4z" />
      </svg>

      {/* Quote text */}
      <p className="font-cormorant text-xl md:text-2xl italic text-ink leading-relaxed relative z-10 px-4 py-3">
        {quote.text}
      </p>

      {/* Source with decorative divider */}
      <div className="mt-5 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-8 h-px bg-gold/25" />
          <svg width="8" height="8" viewBox="0 0 8 8" fill="rgba(212,175,55,0.3)">
            <path d="M4 0L5.5 2.5L8 4L5.5 5.5L4 8L2.5 5.5L0 4L2.5 2.5Z" />
          </svg>
          <div className="w-8 h-px bg-gold/25" />
        </div>
        <p className="font-inter text-sm text-ink/45">
          {quote.source}
          {quote.character && (
            <span className="text-gold"> &mdash; {quote.character}</span>
          )}
        </p>
      </div>
    </motion.div>
  );
}
