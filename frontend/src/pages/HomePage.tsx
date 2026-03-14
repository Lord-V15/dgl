import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { addDays } from 'date-fns';
import api from '../lib/api';
import { useTypewriter } from '../hooks/useTypewriter';
import { staggerContainer, fadeInUp } from '../hooks/useScrollAnimation';
import FloatingPetals from '../components/effects/FloatingPetals';
import GlassCard from '../components/layout/GlassCard';
import QuotesCarousel from '../components/quotes/QuotesCarousel';
import CountdownTimer from '../components/letter/CountdownTimer';
import WaxSeal from '../components/effects/WaxSeal';
import OrnateFlourish from '../components/effects/OrnateFlourish';
import type { Quote } from '../data/quotes';
import localQuotes from '../data/quotes';

const featureCards = [
  {
    title: 'Write a Letter',
    description: 'Pen heartfelt letters to your future self, sealed with love and delivered on the perfect day.',
    link: '/write',
    // Quill icon
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2">
        <path d="M20 2C17 5 14 8 12 12C10 16 9 19 9 21L11 20C12 18 13 16 15 13C17 10 19 7 21 4L20 2Z" />
        <path d="M9 21C9 21 7 20 5 18" strokeLinecap="round" />
        <path d="M15 7L17 5" strokeLinecap="round" />
      </svg>
    ),
    // Botanical watermark - rose
    watermark: (
      <svg className="absolute bottom-3 right-3 w-20 h-20 text-gold/[0.06]" viewBox="0 0 80 80" fill="currentColor">
        <path d="M40 10C45 20 55 25 55 35C55 45 48 50 40 55C32 50 25 45 25 35C25 25 35 20 40 10Z" />
        <path d="M40 55C40 60 38 70 38 75M38 65C34 63 30 62 28 60M38 68C42 66 46 65 48 63" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    ),
  },
  {
    title: 'Our Memories',
    description: 'A gallery of cherished moments, displayed like polaroids from our love story.',
    link: '/memories',
    // Camera icon
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
    watermark: (
      <svg className="absolute bottom-3 right-3 w-20 h-20 text-gold/[0.06]" viewBox="0 0 80 80" fill="currentColor">
        <path d="M40 15C50 15 58 23 58 33C58 43 50 55 40 65C30 55 22 43 22 33C22 23 30 15 40 15Z" />
      </svg>
    ),
  },
  {
    title: 'Letter Archive',
    description: 'Your sealed letters preserved like pressed flowers between the pages of time.',
    link: '/archive',
    // Envelope icon
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 4L12 13L22 4" />
      </svg>
    ),
    watermark: (
      <svg className="absolute bottom-3 right-3 w-20 h-20 text-gold/[0.06]" viewBox="0 0 80 80" fill="currentColor">
        <path d="M20 25C30 15 50 15 60 25C65 30 65 45 55 55C45 65 35 65 25 55C15 45 15 35 20 25Z" />
      </svg>
    ),
  },
  {
    title: 'Our Story',
    description: 'The milestones that mark our journey — every chapter a treasure.',
    link: '/timeline',
    // Book icon
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.2">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        <path d="M8 7h8M8 11h6" strokeLinecap="round" />
      </svg>
    ),
    watermark: (
      <svg className="absolute bottom-3 right-3 w-20 h-20 text-gold/[0.06]" viewBox="0 0 80 80" fill="currentColor">
        <path d="M35 15L45 15L50 25L55 15L65 15L57 35L65 65L50 50L35 65L43 35Z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const { displayText: subtitle } = useTypewriter({
    text: 'Letters sealed with love, delivered by time.',
    delay: 55,
    startDelay: 800,
  });

  const { data: apiQuotes } = useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      try {
        const { data } = await api.get<Quote[]>('/quotes');
        return data;
      } catch {
        return null;
      }
    },
    staleTime: 60000,
  });

  const allQuotes = apiQuotes || localQuotes;

  const featured = useMemo(() => {
    const shuffled = [...allQuotes].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, [allQuotes]);

  const nextDelivery = useMemo(() => addDays(new Date(), 7), []);

  return (
    <div className="relative min-h-screen">
      <FloatingPetals />

      {/* ── Hero + Quotes (side-by-side on desktop) ── */}
      <section className="relative z-10 min-h-[85vh] flex items-center px-6 pt-20 pb-10">
        <div className="w-full max-w-6xl mx-auto md:grid md:grid-cols-2 md:gap-12 md:items-center">
          {/* Left column — Hero */}
          <div className="text-center md:text-left">
            {/* Animated laurel wreath around seal */}
            <motion.div
              className="relative mb-6 inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Laurel branches */}
              <svg className="absolute -inset-5 w-[calc(100%+40px)] h-[calc(100%+40px)]" viewBox="0 0 120 120" fill="none">
                <motion.path
                  d="M30 95 C20 80 15 60 20 40 C25 25 35 15 50 12"
                  stroke="rgba(212,175,55,0.3)"
                  strokeWidth="1"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                />
                {/* Leaves on left branch */}
                <motion.path
                  d="M22 70C18 68 16 64 20 62C24 60 26 64 22 70Z M25 55C21 52 20 48 24 47C28 46 29 50 25 55Z M30 42C26 39 26 35 30 34C34 33 34 37 30 42Z M38 30C34 27 35 23 39 23C43 23 42 27 38 30Z"
                  fill="rgba(212,175,55,0.2)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                />
                <motion.path
                  d="M90 95 C100 80 105 60 100 40 C95 25 85 15 70 12"
                  stroke="rgba(212,175,55,0.3)"
                  strokeWidth="1"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                />
                {/* Leaves on right branch */}
                <motion.path
                  d="M98 70C102 68 104 64 100 62C96 60 94 64 98 70Z M95 55C99 52 100 48 96 47C92 46 91 50 95 55Z M90 42C94 39 94 35 90 34C86 33 86 37 90 42Z M82 30C86 27 85 23 81 23C77 23 78 27 82 30Z"
                  fill="rgba(212,175,55,0.2)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                />
              </svg>
              <WaxSeal size={64} animate />
            </motion.div>

            <motion.h1
              className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-ink mb-4 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Dearest Gentle
              <br />
              <span className="text-gold italic">Reader</span>
            </motion.h1>

            <OrnateFlourish variant="simple" className="mb-5" />

            <motion.p
              className="font-cormorant text-xl md:text-2xl text-ink/60 h-8 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {subtitle}
              <motion.span
                className="inline-block w-0.5 h-6 bg-gold/60 ml-1 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              />
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center md:items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Link to="/write">
                <motion.button
                  className="relative bg-gradient-to-r from-gold/80 to-gold text-cream font-playfair text-lg py-4 px-10 rounded-full border-none cursor-pointer shadow-lg flex items-center gap-3 overflow-hidden"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 8px 30px rgba(212, 175, 55, 0.3)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Quill icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 2C17 5 14 8 12 12C10 16 9 19 9 21L11 20C12 18 13 16 15 13C17 10 19 7 21 4L20 2Z" />
                  </svg>
                  Begin Writing
                </motion.button>
              </Link>

              <Link to="/timeline">
                <motion.button
                  className="border border-gold/30 bg-transparent text-gold font-playfair text-lg py-4 px-8 rounded-full cursor-pointer flex items-center gap-2"
                  whileHover={{
                    borderColor: 'rgba(212, 175, 55, 0.6)',
                    backgroundColor: 'rgba(212, 175, 55, 0.05)',
                  }}
                >
                  View Our Story
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Right column — Quotes (stacks below hero on mobile) */}
          <div className="mt-12 md:mt-0">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-ink mb-3">
                Words That <span className="text-gold italic">Move Us</span>
              </h2>
              <p className="font-cormorant text-lg text-ink/50">
                From the stories that shaped our hearts.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <QuotesCarousel quotes={featured} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Countdown ── */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        <CountdownTimer targetDate={nextDelivery} />
      </section>

      {/* ── Feature Cards ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <OrnateFlourish variant="wide" className="mb-8" />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featureCards.map((card) => (
            <motion.div key={card.title} variants={fadeInUp}>
              <Link to={card.link} className="no-underline block">
                <GlassCard hover flourish className="h-full text-center relative overflow-hidden">
                  <div className="flex justify-center mb-5">{card.icon}</div>
                  <h3 className="font-playfair text-xl font-semibold text-ink mb-2">
                    {card.title}
                  </h3>
                  <p className="font-cormorant text-base text-ink/55 leading-relaxed">
                    {card.description}
                  </p>
                  {card.watermark}
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="relative z-10 text-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <OrnateFlourish variant="simple" className="mb-8" />
          <p className="font-cormorant text-2xl text-ink/40 mb-8 italic max-w-lg mx-auto leading-relaxed">
            "Every letter is a love letter, if written from the heart."
          </p>
          <Link to="/write">
            <motion.button
              className="border border-gold/30 bg-transparent text-gold font-playfair text-lg py-3 px-8 rounded-full cursor-pointer"
              whileHover={{
                borderColor: 'rgba(212, 175, 55, 0.7)',
                backgroundColor: 'rgba(212, 175, 55, 0.06)',
                scale: 1.03,
              }}
            >
              Write Your First Letter
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
