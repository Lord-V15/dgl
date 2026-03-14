import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface FloatingPetalsProps {
  opacity?: number;
  count?: number;
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

const petalColors = [
  ['#F4C2C2', '#E8A0A0'],  // blush
  ['#D4AF37', '#C09B1E'],  // gold
  ['#C4B7D5', '#A899C0'],  // lavender
  ['#F5ECD7', '#E8DBBF'],  // ivory
  ['#D4A0A0', '#C08888'],  // rose
];

export default function FloatingPetals({ opacity = 1, count = 30 }: FloatingPetalsProps) {
  const petals = useMemo<Petal[]>(() => {
    const items: Petal[] = [];
    const sparkleCount = Math.round(count / 3);

    // Rose petals — golden-ratio spacing for even distribution
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

    // Golden sparkles
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

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity }}
    >
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
                ? [0, 0.35, 0.3, 0.35, 0]
                : [0, 0.6, 0.5, 0.6, 0],
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
                opacity="0.35"
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
