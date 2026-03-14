import { motion } from 'framer-motion';
import OrnateFlourish from '../effects/OrnateFlourish';

interface PageHeaderProps {
  title: string;
  highlightWord: string;
  subtitle: string;
  className?: string;
}

export default function PageHeader({ title, highlightWord, subtitle, className = '' }: PageHeaderProps) {
  return (
    <motion.div
      className={`text-center mb-12 ${className}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-ink mb-4 leading-tight">
        {title} <span className="text-gold">{highlightWord}</span>
      </h1>
      <p className="font-cormorant text-xl md:text-2xl text-ink/50 mb-6 max-w-xl mx-auto">
        {subtitle}
      </p>
      <OrnateFlourish variant="simple" className="mt-2" />
    </motion.div>
  );
}
