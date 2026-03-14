import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { format, addDays } from 'date-fns';
import api from '../../lib/api';
import { useTypewriter } from '../../hooks/useTypewriter';
import WaxSeal from '../effects/WaxSeal';
import EnvelopeAnimation from './EnvelopeAnimation';
import OrnateFlourish from '../effects/OrnateFlourish';

interface LetterFormData {
  sender_name: string;
  recipient_email: string;
  subject: string;
  body: string;
  delivery_date: string;
}

export default function LetterComposer() {
  const [formData, setFormData] = useState<LetterFormData>({
    sender_name: '',
    recipient_email: '',
    subject: '',
    body: '',
    delivery_date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
  });
  const [showAnimation, setShowAnimation] = useState(false);
  const [sent, setSent] = useState(false);

  const { displayText: placeholder } = useTypewriter({
    text: 'Dearest gentle reader...',
    delay: 100,
    loop: true,
  });

  const sendLetter = useMutation({
    mutationFn: (data: LetterFormData) => api.post('/letters', data),
    onSuccess: () => setShowAnimation(true),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendLetter.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAnimationComplete = useCallback(() => {
    setShowAnimation(false);
    setSent(true);
    setFormData({
      sender_name: '',
      recipient_email: '',
      subject: '',
      body: '',
      delivery_date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    });
  }, []);

  const minDate = format(addDays(new Date(), 1), 'yyyy-MM-dd');

  if (sent) {
    return (
      <motion.div
        className="glass p-12 text-center max-w-lg mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <WaxSeal size={80} animate className="mb-6" />
        <h3 className="font-playfair text-2xl text-ink mb-3">
          Your letter has been sealed
        </h3>
        <OrnateFlourish variant="simple" className="my-4" />
        <p className="font-cormorant text-lg text-ink/60 mb-8">
          It shall be delivered with the utmost care upon the chosen date.
        </p>
        <button
          onClick={() => setSent(false)}
          className="font-cormorant text-lg text-gold border border-gold/30 bg-transparent px-6 py-2.5 rounded-full cursor-pointer hover:bg-gold/10 transition-colors duration-300"
        >
          Write another letter
        </button>
      </motion.div>
    );
  }

  return (
    <>
      <EnvelopeAnimation isVisible={showAnimation} onComplete={handleAnimationComplete} />

      <motion.form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="deckled-edge relative p-8 md:p-12"
          style={{
            background: 'linear-gradient(145deg, rgba(255, 253, 245, 0.9), rgba(240, 230, 206, 0.7))',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 2px rgba(255,255,255,0.5)',
          }}
        >
          {/* DGL watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <WaxSeal size={200} />
          </div>

          {/* Header with seal */}
          <div className="flex items-center gap-3 mb-8">
            <WaxSeal size={36} />
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, rgba(212,175,55,0.3), transparent)' }} />
          </div>

          {/* From */}
          <div className="mb-6">
            <label className="font-inter text-xs uppercase tracking-widest text-ink/40 mb-1 block">
              <span className="inline-flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 2C17 5 14 8 12 12C10 16 9 19 9 21L11 20C13 16 15 13 17 10" />
                </svg>
                From
              </span>
            </label>
            <input
              type="text"
              name="sender_name"
              value={formData.sender_name}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-none font-cormorant text-xl text-ink py-2 outline-none focus:border-b-gold transition-colors duration-300 placeholder:text-ink/25"
              placeholder="Your name"
              style={{ borderBottom: '1.5px solid rgba(212, 175, 55, 0.15)' }}
            />
          </div>

          {/* To */}
          <div className="mb-6">
            <label className="font-inter text-xs uppercase tracking-widest text-ink/40 mb-1 block">
              <span className="inline-flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 4L12 13L22 4" />
                </svg>
                To
              </span>
            </label>
            <input
              type="email"
              name="recipient_email"
              value={formData.recipient_email}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-none font-cormorant text-xl text-ink py-2 outline-none focus:border-b-gold transition-colors duration-300 placeholder:text-ink/25"
              placeholder="recipient@email.com"
              style={{ borderBottom: '1.5px solid rgba(212, 175, 55, 0.15)' }}
            />
          </div>

          {/* Subject */}
          <div className="mb-6">
            <label className="font-inter text-xs uppercase tracking-widest text-ink/40 mb-1 block">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-none font-playfair text-2xl font-semibold text-ink py-2 outline-none focus:border-b-gold transition-colors duration-300 placeholder:text-ink/25 placeholder:font-normal"
              placeholder="A letter from the heart"
              style={{ borderBottom: '1.5px solid rgba(212, 175, 55, 0.15)' }}
            />
          </div>

          {/* Body */}
          <div className="mb-8">
            <label className="font-inter text-xs uppercase tracking-widest text-ink/40 mb-1 block">Your letter</label>
            <div className="relative rounded-xl p-4 stationery-lines" style={{ minHeight: '260px' }}>
              {/* Left margin line */}
              <div
                className="absolute top-0 bottom-0 left-12 w-px hidden md:block"
                style={{ background: 'rgba(212, 160, 160, 0.15)' }}
              />
              <textarea
                name="body"
                value={formData.body}
                onChange={handleChange}
                required
                className="w-full h-full min-h-[240px] bg-transparent border-none font-caveat text-xl text-ink leading-8 outline-none resize-y placeholder:text-ink/25 md:pl-8"
                placeholder={placeholder}
                style={{ lineHeight: '32px' }}
              />
            </div>
          </div>

          {/* Delivery Date */}
          <div className="mb-8">
            <label className="font-cormorant text-lg italic text-ink/50 mb-1 block">
              To be delivered upon
            </label>
            <input
              type="date"
              name="delivery_date"
              value={formData.delivery_date}
              onChange={handleChange}
              min={minDate}
              required
              className="bg-transparent border-none font-cormorant text-xl text-ink py-2 outline-none cursor-pointer"
              style={{ borderBottom: '1.5px solid rgba(212, 175, 55, 0.15)' }}
            />
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={sendLetter.isPending}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-gold/80 to-gold text-cream font-playfair text-lg py-4 px-8 rounded-full border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative"
            whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)' }}
            whileTap={{ scale: 0.98 }}
          >
            <WaxSeal size={22} />
            {sendLetter.isPending ? 'Sealing your letter...' : 'Seal & Send'}
          </motion.button>

          {sendLetter.isError && (
            <p className="text-center text-red-600/70 font-inter text-sm mt-4">
              Failed to send letter. Please try again.
            </p>
          )}
        </div>
      </motion.form>
    </>
  );
}
