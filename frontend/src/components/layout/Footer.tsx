import { motion } from 'framer-motion';
import WaxSeal from '../effects/WaxSeal';
import OrnateFlourish from '../effects/OrnateFlourish';

export default function Footer() {
  return (
    <motion.footer
      className="relative py-12 text-center overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* Ornamental top divider */}
      <OrnateFlourish variant="wide" className="mb-8" />

      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-4">
        <WaxSeal size={28} />
        <p className="font-cormorant text-lg italic text-ink/40">
          Composed with the deepest affection
        </p>
        <div className="flex items-center gap-3 text-ink/25">
          <div className="w-8 h-px bg-gold/20" />
          <p className="font-inter text-xs tracking-wider uppercase">
            Dearest Gentle Reader
          </p>
          <div className="w-8 h-px bg-gold/20" />
        </div>
      </div>
    </motion.footer>
  );
}
