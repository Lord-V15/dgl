import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { format, differenceInDays } from 'date-fns';
import api from '../../lib/api';
import { staggerContainer, fadeInUp } from '../../hooks/useScrollAnimation';

interface Letter {
  id: string;
  sender_name: string;
  subject: string;
  body: string;
  delivery_date: string;
  status: 'pending' | 'sent';
  created_at: string;
}

interface LetterArchiveProps {
  filter?: 'all' | 'pending' | 'sent';
}

export default function LetterArchive({ filter = 'all' }: LetterArchiveProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: letters = [], isLoading } = useQuery({
    queryKey: ['letters', filter],
    queryFn: async () => {
      const params = filter !== 'all' ? { status: filter } : {};
      const { data } = await api.get<Letter[]>('/letters', { params });
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <motion.div
          className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
      </div>
    );
  }

  if (letters.length === 0) {
    return (
      <motion.div
        className="text-center py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <svg className="mx-auto mb-4 text-gold/20" width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="16" width="48" height="32" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 16L32 36L56 16" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <p className="font-playfair text-2xl text-ink/30 mb-2">No letters yet</p>
        <p className="font-cormorant text-lg text-ink/20">
          Your sealed letters will appear here, like pressed flowers in a book.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid gap-5 md:grid-cols-2"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter) => {
        const daysSinceSent = differenceInDays(new Date(), new Date(letter.created_at));
        const sepiaAmount = Math.min(daysSinceSent * 2, 50);
        const isExpanded = expandedId === letter.id;

        return (
          <motion.div key={letter.id} variants={fadeInUp}>
            <motion.div
              className="relative p-6 md:p-8 cursor-pointer gold-shimmer overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(255,253,245,0.8), rgba(240,230,206,0.5))',
                borderRadius: '1.5rem',
                border: '1px solid rgba(212, 175, 55, 0.15)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                filter: letter.status === 'sent' ? `sepia(${sepiaAmount}%)` : 'none',
              }}
              onClick={() => setExpandedId(isExpanded ? null : letter.id)}
              whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.07)' }}
              transition={{ duration: 0.2 }}
            >
              {/* Envelope flap decoration */}
              <div
                className="absolute top-0 left-0 right-0 h-8 pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, rgba(212,175,55,0.04), transparent)',
                }}
              />

              <div className="flex items-start justify-between mb-3">
                <h3 className="font-playfair text-lg font-semibold text-ink pr-4">
                  {letter.subject}
                </h3>
                {/* Status badge styled as vintage stamp */}
                <span
                  className={`font-inter text-[10px] uppercase tracking-widest px-3 py-1 border rotate-[-3deg] shrink-0 ${
                    letter.status === 'sent'
                      ? 'border-sage-deep/40 text-sage-deep'
                      : 'border-gold/40 text-gold'
                  }`}
                  style={{ borderStyle: 'dashed', borderRadius: '2px' }}
                >
                  {letter.status === 'sent' ? 'Delivered' : 'Pending'}
                </span>
              </div>

              <p className="font-inter text-xs text-ink/35 mb-3 tracking-wide">
                {letter.status === 'sent'
                  ? `Delivered ${format(new Date(letter.delivery_date), 'MMMM d, yyyy')}`
                  : `To be delivered ${format(new Date(letter.delivery_date), 'MMMM d, yyyy')}`}
              </p>

              <p className="font-cormorant text-base text-ink/50 line-clamp-2">
                {letter.body}
              </p>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                    style={{ transformOrigin: 'top' }}
                  >
                    <div className="pt-5 mt-5" style={{ borderTop: '1px solid rgba(212,175,55,0.1)' }}>
                      <p className="font-caveat text-lg text-ink whitespace-pre-wrap leading-relaxed">
                        {letter.body}
                      </p>
                      <p className="font-cormorant text-sm text-ink/35 mt-5 italic">
                        Written by {letter.sender_name}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
