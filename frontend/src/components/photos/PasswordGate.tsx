import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import api from '../../lib/api';
import WaxSeal from '../effects/WaxSeal';

interface PasswordGateProps {
  onAuthenticated: () => void;
}

export default function PasswordGate({ onAuthenticated }: PasswordGateProps) {
  const [password, setPassword] = useState('');

  const authenticate = useMutation({
    mutationFn: async (pwd: string) => {
      const { data } = await api.post<{ access_token: string }>('/auth/verify', {
        password: pwd,
      });
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem('dgl_token', data.access_token);
      onAuthenticated();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    authenticate.mutate(password);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'linear-gradient(180deg, #FFFDF5 0%, #F0E6CE 100%)',
        backdropFilter: 'blur(8px)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
    >
      <motion.div
        className="max-w-sm w-full mx-6 text-center"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {/* Diary illustration */}
        <motion.div
          className="relative inline-block mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
        >
          {/* Book shape */}
          <svg width="100" height="120" viewBox="0 0 100 120" fill="none" className="mx-auto">
            {/* Book cover */}
            <rect x="15" y="10" width="70" height="100" rx="4" fill="#8B4513" opacity="0.15" stroke="rgba(212,175,55,0.3)" strokeWidth="1" />
            <rect x="18" y="13" width="64" height="94" rx="3" fill="#F5ECD7" stroke="rgba(212,175,55,0.2)" strokeWidth="0.5" />
            {/* Spine */}
            <rect x="15" y="10" width="6" height="100" rx="2" fill="rgba(139,69,19,0.1)" />
            {/* Gold clasp */}
            <motion.rect
              x="75" y="52" width="14" height="16" rx="3"
              fill="none" stroke="#D4AF37" strokeWidth="1.5"
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <circle cx="82" cy="60" r="2" fill="#D4AF37" opacity="0.6" />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <WaxSeal size={36} />
          </div>
        </motion.div>

        <motion.h2
          className="font-playfair text-2xl font-semibold text-ink mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Enter the secret
        </motion.h2>

        <motion.p
          className="font-cormorant text-lg text-ink/40 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          to unlock our memories
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Whisper the password..."
            className="w-full bg-cream/60 border border-gold/20 rounded-xl px-4 py-3 font-cormorant text-lg text-ink text-center outline-none focus:border-gold/50 transition-colors duration-300 placeholder:text-ink/25 mb-4"
            animate={authenticate.isError ? { x: [0, -8, 8, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          />

          {authenticate.isError && (
            <p className="font-inter text-sm text-rose/80 mb-4">
              That wasn't quite right. Try again, dear.
            </p>
          )}

          <motion.button
            type="submit"
            disabled={authenticate.isPending || !password}
            className="w-full bg-gradient-to-r from-gold/80 to-gold text-cream font-playfair text-lg py-3 px-6 rounded-full border-none cursor-pointer disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {authenticate.isPending ? 'Verifying...' : 'Unlock'}
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}
