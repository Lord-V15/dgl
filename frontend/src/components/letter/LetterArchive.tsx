import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, differenceInDays } from 'date-fns';
import api from '../../lib/api';
import { staggerContainer, fadeInUp } from '../../hooks/useScrollAnimation';

interface Letter {
  id: string;
  sender_name: string;
  subject: string;
  delivery_date: string;
  status: 'pending' | 'sent' | 'failed';
  created_at: string;
}

interface LetterArchiveProps {
  filter?: 'all' | 'pending' | 'sent';
}

export default function LetterArchive({ filter = 'all' }: LetterArchiveProps) {
  const queryClient = useQueryClient();

  const { data: letters = [], isLoading } = useQuery({
    queryKey: ['letters', filter],
    queryFn: async () => {
      const params = filter !== 'all' ? { status: filter } : {};
      const { data } = await api.get<Letter[]>('/letters', { params });
      return data;
    },
  });

  const cancelLetter = useMutation({
    mutationFn: (id: string) => api.delete(`/letters/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letters'] });
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

        return (
          <motion.div key={letter.id} variants={fadeInUp}>
            <div
              className="relative p-6 md:p-8 gold-shimmer overflow-hidden"
              style={{
                background: 'var(--t-glass-bg)',
                borderRadius: '1.5rem',
                border: '1px solid var(--t-glass-border)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                filter: letter.status === 'sent' ? `sepia(${sepiaAmount}%)` : 'none',
              }}
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
                      : letter.status === 'failed'
                        ? 'border-red-400/40 text-red-500'
                        : 'border-gold/40 text-gold'
                  }`}
                  style={{ borderStyle: 'dashed', borderRadius: '2px' }}
                >
                  {letter.status === 'sent' ? 'Delivered' : letter.status === 'failed' ? 'Failed' : 'Pending'}
                </span>
              </div>

              <p className="font-inter text-xs text-ink/35 mb-1 tracking-wide">
                From {letter.sender_name}
              </p>

              <p className="font-inter text-xs text-ink/35 tracking-wide">
                {letter.status === 'sent'
                  ? `Delivered ${format(new Date(letter.delivery_date), 'MMMM d, yyyy')}`
                  : `To be delivered ${format(new Date(letter.delivery_date), 'MMMM d, yyyy')}`}
              </p>

              {letter.status === 'pending' && (
                <motion.button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Cancel this letter? It will be permanently deleted.')) {
                      cancelLetter.mutate(letter.id);
                    }
                  }}
                  disabled={cancelLetter.isPending}
                  className="mt-4 font-inter text-xs uppercase tracking-widest text-red-500/60 border border-red-400/20 bg-transparent px-4 py-1.5 rounded-full cursor-pointer hover:bg-red-500/10 hover:text-red-500 transition-colors duration-300 disabled:opacity-50"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Cancel Letter
                </motion.button>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
