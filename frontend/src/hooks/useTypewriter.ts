import { useState, useEffect, useCallback } from 'react';

interface UseTypewriterOptions {
  text: string;
  delay?: number;
  startDelay?: number;
  loop?: boolean;
}

interface UseTypewriterReturn {
  displayText: string;
  isComplete: boolean;
  reset: () => void;
}

export function useTypewriter({
  text,
  delay = 80,
  startDelay = 0,
  loop = false,
}: UseTypewriterOptions): UseTypewriterReturn {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(startDelay === 0);

  const reset = useCallback(() => {
    setDisplayText('');
    setCurrentIndex(0);
    setIsComplete(false);
    setHasStarted(startDelay === 0);
  }, [startDelay]);

  useEffect(() => {
    if (startDelay > 0 && !hasStarted) {
      const timer = setTimeout(() => setHasStarted(true), startDelay);
      return () => clearTimeout(timer);
    }
  }, [startDelay, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
      if (loop) {
        const timer = setTimeout(() => {
          reset();
          setHasStarted(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [currentIndex, text, delay, hasStarted, loop, reset]);

  return { displayText, isComplete, reset };
}
