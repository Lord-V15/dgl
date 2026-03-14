import { motion } from 'framer-motion';

interface WaxSealProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export default function WaxSeal({ size = 64, className = '', animate = false }: WaxSealProps) {
  const showDrips = size >= 48;
  const Wrapper = animate ? motion.div : 'div';
  const wrapperProps = animate
    ? {
        initial: { scale: 0, rotate: -180 },
        animate: { scale: 1, rotate: 0 },
        transition: { type: 'spring', stiffness: 200, damping: 15 },
      }
    : {};

  return (
    // @ts-expect-error - motion.div vs div prop types
    <Wrapper className={`inline-block ${className}`} {...wrapperProps}>
      <svg
        width={size}
        height={showDrips ? size * 1.15 : size}
        viewBox={showDrips ? '0 0 100 115' : '0 0 100 100'}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 3D dome gradient */}
          <radialGradient id="sealGrad" cx="40%" cy="38%" r="55%">
            <stop offset="0%" stopColor="#C41010" />
            <stop offset="50%" stopColor="#8B0000" />
            <stop offset="100%" stopColor="#5A0000" />
          </radialGradient>
          {/* Glossy highlight */}
          <radialGradient id="sealShine" cx="35%" cy="30%" r="30%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          {/* Inner circle gradient */}
          <radialGradient id="innerGrad" cx="45%" cy="42%" r="50%">
            <stop offset="0%" stopColor="#B01515" />
            <stop offset="100%" stopColor="#7A0000" />
          </radialGradient>
        </defs>

        {/* Wax drips */}
        {showDrips && (
          <>
            <path d="M30 88 Q30 105 32 108 Q34 112 36 108 Q38 100 36 88" fill="url(#sealGrad)" />
            <path d="M62 90 Q61 102 63 106 Q65 109 67 105 Q68 98 66 90" fill="url(#sealGrad)" />
            <path d="M46 92 Q45 100 46 103 Q47 105 48 103 Q49 99 48 92" fill="url(#sealGrad)" opacity="0.8" />
          </>
        )}

        {/* Outer seal shape */}
        <path
          d="M50 5 L58 15 L70 8 L72 22 L85 20 L82 34 L95 38 L88 50 L95 62 L82 66 L85 80 L72 78 L70 92 L58 85 L50 95 L42 85 L30 92 L28 78 L15 80 L18 66 L5 62 L12 50 L5 38 L18 34 L15 20 L28 22 L30 8 L42 15 Z"
          fill="url(#sealGrad)"
          stroke="#5A0000"
          strokeWidth="0.5"
        />

        {/* Glossy highlight overlay */}
        <path
          d="M50 5 L58 15 L70 8 L72 22 L85 20 L82 34 L95 38 L88 50 L95 62 L82 66 L85 80 L72 78 L70 92 L58 85 L50 95 L42 85 L30 92 L28 78 L15 80 L18 66 L5 62 L12 50 L5 38 L18 34 L15 20 L28 22 L30 8 L42 15 Z"
          fill="url(#sealShine)"
        />

        {/* Inner circle */}
        <circle cx="50" cy="50" r="28" fill="url(#innerGrad)" />

        {/* Decorative ring */}
        <circle cx="50" cy="50" r="32" fill="none" stroke="#D4AF37" strokeWidth="0.7" opacity="0.5" />
        <circle cx="50" cy="50" r="24" fill="none" stroke="#D4AF37" strokeWidth="0.3" opacity="0.3" />

        {/* DGL text with subtle emboss */}
        <text
          x="50" y="55"
          textAnchor="middle"
          fill="#1a0000"
          fontSize="17"
          fontFamily="'Playfair Display', serif"
          fontWeight="700"
          letterSpacing="2"
          opacity="0.3"
        >
          DGL
        </text>
        <text
          x="50" y="54"
          textAnchor="middle"
          fill="#D4AF37"
          fontSize="17"
          fontFamily="'Playfair Display', serif"
          fontWeight="700"
          letterSpacing="2"
        >
          DGL
        </text>
      </svg>
    </Wrapper>
  );
}
