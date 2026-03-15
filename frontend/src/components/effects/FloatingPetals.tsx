import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface FloatingPetalsProps {
  opacity?: number;
  count?: number;
  enableFireflies?: boolean;
  enableStarDust?: boolean;
}

interface Petal {
  id: number;
  left: string;
  size: number;
  delay: number;
  duration: number;
  color: string;
  rotation: number;
  swayAmount: number;
  type: 'petal' | 'sparkle';
}

interface Firefly {
  id: number;
  left: string;
  top: string;
  size: number;
  driftDuration: number;
  pulseDuration: number;
  delay: number;
  swayX: number;
  swayY: number;
}

interface StarDust {
  id: number;
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  swayAmount: number;
}

const petalColors = [
  ['#F4C2C2', '#E8A0A0'],  // blush
  ['#D4AF37', '#C09B1E'],  // gold
  ['#C4B7D5', '#A899C0'],  // lavender
  ['#F5ECD7', '#E8DBBF'],  // ivory
  ['#D4A0A0', '#C08888'],  // rose
];

export default function FloatingPetals({
  opacity = 1,
  count = 30,
  enableFireflies = true,
  enableStarDust,
}: FloatingPetalsProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const showStarDust = enableStarDust ?? isDark;
  const petalFillOpacity = isDark ? 0.2 : 0.35;

  const petals = useMemo<Petal[]>(() => {
    const items: Petal[] = [];
    const sparkleCount = Math.round(count / 3);

    for (let i = 0; i < count; i++) {
      const baseLeft = (i * 61.8) % 100;
      const size = 6 + (i % 5) * 3.5;
      items.push({
        id: i,
        left: `${baseLeft}%`,
        size,
        delay: (i * 1.3) % 12 + (i % 7) * 0.5,
        duration: 14 + (i % 9) * 3,
        color: petalColors[i % petalColors.length][0],
        rotation: (i * 37) % 360,
        swayAmount: 15 + (i % 4) * 12,
        type: 'petal',
      });
    }

    for (let i = 0; i < sparkleCount; i++) {
      const baseLeft = (i * 61.8 + 30) % 100;
      items.push({
        id: 100 + i,
        left: `${baseLeft}%`,
        size: 3,
        delay: (i * 3.7) % 15 + 2,
        duration: 12 + (i % 5) * 3,
        color: '#D4AF37',
        rotation: 0,
        swayAmount: 25 + (i % 3) * 10,
        type: 'sparkle',
      });
    }

    return items;
  }, [count]);

  const fireflies = useMemo<Firefly[]>(() => {
    if (!enableFireflies) return [];
    const items: Firefly[] = [];
    const fireflyCount = 12;
    for (let i = 0; i < fireflyCount; i++) {
      items.push({
        id: 200 + i,
        left: `${(i * 61.8 + 15) % 100}%`,
        top: `${(i * 38.2 + 10) % 80 + 10}%`,
        size: 2 + (i % 3),
        driftDuration: 30 + (i % 5) * 5,
        pulseDuration: 3 + (i % 3) * 0.8,
        delay: (i * 2.3) % 10,
        swayX: 40 + (i % 4) * 20,
        swayY: 20 + (i % 3) * 15,
      });
    }
    return items;
  }, [enableFireflies]);

  const starDustParticles = useMemo<StarDust[]>(() => {
    if (!showStarDust) return [];
    const items: StarDust[] = [];
    const dustCount = 22;
    for (let i = 0; i < dustCount; i++) {
      items.push({
        id: 300 + i,
        left: `${(i * 61.8 + 45) % 100}%`,
        top: `${(i * 38.2 + 5) % 95}%`,
        size: 1 + (i % 2),
        duration: 40 + (i % 7) * 5,
        delay: (i * 1.7) % 15,
        opacity: 0.08 + (i % 4) * 0.03,
        swayAmount: 5 + (i % 3) * 3,
      });
    }
    return items;
  }, [showStarDust]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity }}
    >
      {/* Star dust (dark theme only) */}
      {starDustParticles.map((dust) => (
        <motion.div
          key={dust.id}
          className="absolute rounded-full bg-white"
          style={{
            left: dust.left,
            top: dust.top,
            width: dust.size,
            height: dust.size,
          }}
          animate={{
            x: [0, dust.swayAmount, -dust.swayAmount, 0],
            y: [0, -dust.swayAmount * 0.5, dust.swayAmount * 0.5, 0],
            opacity: [dust.opacity, dust.opacity * 2, dust.opacity, dust.opacity * 1.5, dust.opacity],
          }}
          transition={{
            duration: dust.duration,
            delay: dust.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Fireflies */}
      {fireflies.map((fly) => (
        <motion.div
          key={fly.id}
          className="absolute rounded-full"
          style={{
            left: fly.left,
            top: fly.top,
            width: fly.size,
            height: fly.size,
            background: '#D4AF37',
            boxShadow: '0 0 8px rgba(212,175,55,0.4)',
          }}
          animate={{
            x: [0, fly.swayX, -fly.swayX * 0.6, fly.swayX * 0.3, 0],
            y: [0, -fly.swayY, fly.swayY * 0.5, -fly.swayY * 0.3, 0],
            opacity: [0.15, 0.6, 0.2, 0.55, 0.15],
          }}
          transition={{
            duration: fly.driftDuration,
            delay: fly.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Petals and sparkles */}
      {petals.map((petal) =>
        petal.type === 'sparkle' ? (
          <motion.div
            key={petal.id}
            className="absolute rounded-full"
            style={{
              left: petal.left,
              width: petal.size,
              height: petal.size,
              background: petal.color,
              boxShadow: `0 0 4px ${petal.color}`,
            }}
            initial={{ top: '-3%', opacity: 0 }}
            animate={{
              top: ['-3%', '103%'],
              opacity: [0, 0.8, 0.4, 0.8, 0],
              x: [0, petal.swayAmount, -petal.swayAmount, 0],
            }}
            transition={{
              duration: petal.duration,
              delay: petal.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ) : (
          <motion.div
            key={petal.id}
            className="absolute"
            style={{ left: petal.left }}
            initial={{ top: '-5%', opacity: 0 }}
            animate={{
              top: ['-5%', '105%'],
              opacity: petal.size < 10
                ? [0, petalFillOpacity, petalFillOpacity * 0.85, petalFillOpacity, 0]
                : [0, petalFillOpacity * 1.7, petalFillOpacity * 1.4, petalFillOpacity * 1.7, 0],
              x: [0, petal.swayAmount, -petal.swayAmount * 0.7, petal.swayAmount * 0.4, 0],
              rotateZ: [petal.rotation, petal.rotation + 120, petal.rotation + 200, petal.rotation + 360],
              rotateX: [0, 40, -20, 50, 0],
            }}
            transition={{
              duration: petal.duration,
              delay: petal.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <svg
              width={petal.size}
              height={petal.size * 1.4}
              viewBox="0 0 20 28"
              fill="none"
            >
              <path
                d="M10 0 C14 6 20 12 18 20 C16 26 12 28 10 28 C8 28 4 26 2 20 C0 12 6 6 10 0Z"
                fill={petal.color}
                opacity={petalFillOpacity}
              />
              <path
                d="M10 4 C10 10 10 20 10 26"
                stroke={petalColors[petal.id % petalColors.length][1]}
                strokeWidth="0.5"
                opacity="0.3"
              />
            </svg>
          </motion.div>
        )
      )}
    </div>
  );
}
