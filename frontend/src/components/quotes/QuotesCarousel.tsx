import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Quote } from '../../data/quotes';
import QuoteCard from './QuoteCard';

interface QuotesCarouselProps {
  quotes: Quote[];
  interval?: number;
}

export default function QuotesCarousel({
  quotes,
  interval = 6000,
}: QuotesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  }, [quotes.length]);

  useEffect(() => {
    if (isPaused || quotes.length <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [isPaused, next, interval, quotes.length]);

  if (quotes.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="min-h-[200px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <QuoteCard
            key={currentIndex}
            quote={quotes[currentIndex]}
            className="w-full max-w-2xl mx-auto"
          />
        </AnimatePresence>
      </div>

      {/* Navigation dots */}
      {quotes.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full border-none cursor-pointer transition-all duration-300 ${
                i === currentIndex
                  ? 'bg-gold w-6'
                  : 'bg-gold/20 hover:bg-gold/40'
              }`}
              aria-label={`Go to quote ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
