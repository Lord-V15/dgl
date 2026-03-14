import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { differenceInSeconds } from 'date-fns';
import { staggerContainer, fadeInUp } from '../../hooks/useScrollAnimation';
import OrnateFlourish from '../effects/OrnateFlourish';

interface CountdownTimerProps {
  targetDate: Date;
  label?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(target: Date): TimeLeft {
  const totalSeconds = Math.max(0, differenceInSeconds(target, new Date()));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export default function CountdownTimer({
  targetDate,
  label = 'Your next letter shall arrive in',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' },
  ];

  return (
    <motion.div
      className="text-center"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <OrnateFlourish variant="simple" className="mb-6" />
      <motion.p
        className="font-cormorant text-lg italic text-ink/50 mb-8"
        variants={fadeInUp}
      >
        {label}
      </motion.p>

      <div className="flex justify-center gap-3 sm:gap-5 md:gap-6">
        {units.map((unit) => (
          <motion.div
            key={unit.label}
            className="flex flex-col items-center"
            variants={fadeInUp}
          >
            <div
              className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 flex items-center justify-center relative"
              style={{
                border: '1.5px solid rgba(212, 175, 55, 0.25)',
                borderRadius: '50%',
                background: 'rgba(255, 253, 245, 0.5)',
                backdropFilter: 'blur(8px)',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              {/* Decorative tick marks */}
              {[0, 90, 180, 270].map((deg) => (
                <div
                  key={deg}
                  className="absolute w-px h-1.5 bg-gold/20"
                  style={{
                    transform: `rotate(${deg}deg) translateY(-calc(50% - 2px))`,
                    top: deg === 0 ? '3px' : deg === 180 ? 'auto' : '50%',
                    bottom: deg === 180 ? '3px' : 'auto',
                    left: deg === 90 ? 'auto' : deg === 270 ? '3px' : '50%',
                    right: deg === 90 ? '3px' : 'auto',
                    width: deg === 90 || deg === 270 ? '4px' : '1px',
                    height: deg === 90 || deg === 270 ? '1px' : '4px',
                  }}
                />
              ))}

              <motion.span
                className="font-playfair text-2xl md:text-3xl font-bold text-ink"
                key={unit.value}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                {String(unit.value).padStart(2, '0')}
              </motion.span>
            </div>
            <span className="font-inter text-[10px] text-ink/40 mt-2 uppercase tracking-widest">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
