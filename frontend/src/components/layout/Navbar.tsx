import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import WaxSeal from '../effects/WaxSeal';

const isProd = import.meta.env.VITE_SERVER === 'prod';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/write', label: 'Write' },
  ...(!isProd ? [{ to: '/archive', label: 'Archive' }] : []),
  { to: '/timeline', label: 'Our Story' },
];

function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`w-9 h-9 rounded-full glass flex items-center justify-center cursor-pointer border-none ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.svg
            key="moon"
            width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.5"
            className="text-gold"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </motion.svg>
        ) : (
          <motion.svg
            key="sun"
            width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.5"
            className="text-gold"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();
  const { theme } = useTheme();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 60);
  });

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navBg = theme === 'dark'
    ? (scrolled ? 'rgba(11,15,26,0.85)' : 'rgba(11,15,26,0.45)')
    : (scrolled ? 'rgba(255,248,236,0.85)' : 'rgba(255,248,236,0.45)');

  const mobileOverlayBg = theme === 'dark'
    ? 'linear-gradient(180deg, #0B0F1A 0%, #141825 100%)'
    : 'linear-gradient(180deg, #FFF8EC 0%, #F5ECD7 100%)';

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 md:top-[14px] md:left-[14px] md:right-[14px] md:rounded-t"
        style={{
          borderRadius: 0,
          backdropFilter: 'blur(16px)',
          background: navBg,
          borderBottom: scrolled ? '1px solid var(--t-glass-border)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
        }}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo monogram */}
          <Link to="/" className="no-underline">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
              <WaxSeal size={32} />
            </motion.div>
          </Link>

          {/* Desktop Links + Theme Toggle */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative no-underline font-cormorant text-lg text-ink/70 hover:text-gold transition-colors duration-300"
              >
                {link.label}
                {location.pathname === link.to && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-[1.5px]"
                    style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }}
                    layoutId="nav-underline"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  />
                )}
              </Link>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              className="flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <motion.span
                className="block w-6 h-0.5 bg-ink"
                animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              />
              <motion.span
                className="block w-6 h-0.5 bg-ink"
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              />
              <motion.span
                className="block w-6 h-0.5 bg-ink"
                animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Full-screen mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[55] md:hidden flex flex-col items-center justify-center"
            style={{ background: mobileOverlayBg }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-6 bg-transparent border-none cursor-pointer p-2"
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>

            <WaxSeal size={56} className="mb-8" />

            <nav className="flex flex-col items-center gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  <Link
                    to={link.to}
                    className={`no-underline font-playfair text-2xl transition-colors duration-300 ${
                      location.pathname === link.to ? 'text-gold' : 'text-ink/70'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Decorative bottom border */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
