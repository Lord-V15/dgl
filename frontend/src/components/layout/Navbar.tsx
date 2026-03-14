import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import WaxSeal from '../effects/WaxSeal';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/write', label: 'Write' },
  { to: '/archive', label: 'Archive' },
  { to: '/memories', label: 'Memories' },
  { to: '/timeline', label: 'Our Story' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 60);
  });

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          borderRadius: 0,
          backdropFilter: 'blur(16px)',
          background: scrolled ? 'rgba(255, 253, 245, 0.85)' : 'rgba(255, 253, 245, 0.45)',
          borderBottom: scrolled ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.04)' : 'none',
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

          {/* Desktop Links */}
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
                    style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }}
                    layoutId="nav-underline"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-2"
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
      </motion.nav>

      {/* Full-screen mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[55] md:hidden flex flex-col items-center justify-center"
            style={{
              background: 'linear-gradient(180deg, #FFFDF5 0%, #F5ECD7 100%)',
            }}
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2C1810" strokeWidth="1.5">
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
