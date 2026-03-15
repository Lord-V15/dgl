import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import api from '../lib/api';
import GlassCard from '../components/layout/GlassCard';
import PageHeader from '../components/layout/PageHeader';
import WaxSeal from '../components/effects/WaxSeal';
import PhotoUpload from '../components/photos/PhotoUpload';
import PolaroidGallery from '../components/photos/PolaroidGallery';
import { slideInLeft, slideInRight } from '../hooks/useScrollAnimation';

interface Milestone {
  id: string;
  milestone_date: string;
  title: string;
  description: string | null;
  photo_id?: string | null;
}

function toRoman(num: number): string {
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  let result = '';
  for (let i = 0; i < vals.length; i++) {
    while (num >= vals[i]) {
      result += syms[i];
      num -= vals[i];
    }
  }
  return result;
}

export default function TimelinePage() {
  const [showForm, setShowForm] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [memoriesUnlocked, setMemoriesUnlocked] = useState(false);
  const [memoriesPassword, setMemoriesPassword] = useState('');
  const [memoriesAuthError, setMemoriesAuthError] = useState(false);
  const [memoriesRevealed, setMemoriesRevealed] = useState(false);
  const [showMemoryUpload, setShowMemoryUpload] = useState(false);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    title: '',
    description: '',
  });
  const queryClient = useQueryClient();

  const { data: milestones = [], isLoading } = useQuery({
    queryKey: ['milestones'],
    queryFn: async () => {
      try {
        const { data } = await api.get<Milestone[]>('/timeline');
        return data;
      } catch {
        return [];
      }
    },
  });

  const authenticate = useMutation({
    mutationFn: async (pwd: string) => {
      const { data } = await api.post<{ access_token: string }>('/auth/verify', { password: pwd });
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem('dgl_token', data.access_token);
      setNeedsAuth(false);
      setPassword('');
      setAuthError(false);
      setShowForm(true);
      setMemoriesUnlocked(true);
    },
    onError: () => {
      setAuthError(true);
    },
  });

  const authenticateMemories = useMutation({
    mutationFn: async (pwd: string) => {
      const { data } = await api.post<{ access_token: string }>('/auth/verify-memories', { password: pwd });
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem('dgl_token', data.access_token);
      setNeedsMemoriesAuth(false);
      setMemoriesPassword('');
      setMemoriesAuthError(false);
      setMemoriesRevealed(true);
    },
    onError: () => {
      setMemoriesAuthError(true);
    },
  });

  const deleteMilestone = useMutation({
    mutationFn: (id: string) => api.delete(`/timeline/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['milestones'] }),
    onError: (err: any) => {
      if (err?.response?.status === 401) setNeedsAuth(true);
    },
  });

  const addMilestone = useMutation({
    mutationFn: (data: typeof formData) =>
      api.post('/timeline', { title: data.title, description: data.description, milestone_date: data.date }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
      setShowForm(false);
      setFormData({ date: format(new Date(), 'yyyy-MM-dd'), title: '', description: '' });
    },
    onError: (err: any) => {
      // If 401, need to authenticate first
      if (err?.response?.status === 401) {
        setNeedsAuth(true);
      }
    },
  });

  const handleAddClick = () => {
    if (!memoriesUnlocked) {
      setNeedsAuth(true);
    } else {
      setShowForm(!showForm);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    authenticate.mutate(password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMilestone.mutate(formData);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Our"
          highlightWord="Story"
          subtitle="The milestones that mark our journey together."
        />

        {/* Add milestone button — always visible */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={handleAddClick}
            className="border border-gold/30 bg-transparent text-gold font-cormorant text-lg px-6 py-2.5 rounded-full cursor-pointer"
            whileHover={{ borderColor: 'rgba(212, 175, 55, 0.6)', backgroundColor: 'rgba(212, 175, 55, 0.05)' }}
          >
            {showForm ? 'Cancel' : '+ Add a chapter'}
          </motion.button>
        </motion.div>

        {/* Password prompt (inline) */}
        <AnimatePresence>
          {needsAuth && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-10"
            >
              <GlassCard className="max-w-sm mx-auto text-center">
                <WaxSeal size={40} className="mb-4" />
                <p className="font-cormorant text-lg text-ink/50 mb-4">
                  Enter the password to make changes
                </p>
                <form onSubmit={handleAuthSubmit} className="space-y-3">
                  <motion.input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setAuthError(false); }}
                    placeholder="Whisper the password..."
                    className="w-full bg-ivory/60 border border-gold/20 rounded-xl px-4 py-2.5 font-cormorant text-lg text-ink text-center outline-none focus:border-gold/50 transition-colors placeholder:text-ink/25"
                    animate={authError ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  />
                  {authError && (
                    <p className="font-inter text-sm text-rose/80">
                      That wasn't quite right. Try again.
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setNeedsAuth(false); setPassword(''); setAuthError(false); }}
                      className="flex-1 border border-gold/20 bg-transparent text-ink/50 font-cormorant text-base py-2 rounded-full cursor-pointer"
                    >
                      Cancel
                    </button>
                    <motion.button
                      type="submit"
                      disabled={authenticate.isPending || !password}
                      className="flex-1 bg-gradient-to-r from-gold/80 to-gold text-cream font-playfair py-2 rounded-full border-none cursor-pointer disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {authenticate.isPending ? 'Verifying...' : 'Unlock'}
                    </motion.button>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add milestone form */}
        <AnimatePresence>
          {showForm && !needsAuth && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12"
            >
              <GlassCard className="max-w-lg mx-auto">
                <h3 className="font-playfair text-lg text-ink/60 mb-4 text-center">
                  Chapter {toRoman(milestones.length + 1)}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="font-inter text-xs uppercase tracking-wider text-ink/50 mb-1 block">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                      required
                      className="w-full bg-ivory/60 border border-gold/20 rounded-xl px-4 py-2 font-cormorant text-lg text-ink outline-none focus:border-gold/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-inter text-xs uppercase tracking-wider text-ink/50 mb-1 block">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                      required
                      placeholder="A chapter in our story"
                      className="w-full bg-ivory/60 border border-gold/20 rounded-xl px-4 py-2 font-cormorant text-lg text-ink outline-none focus:border-gold/50 transition-colors placeholder:text-ink/30"
                    />
                  </div>
                  <div>
                    <label className="font-inter text-xs uppercase tracking-wider text-ink/50 mb-1 block">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                      required
                      placeholder="Tell the story of this moment..."
                      rows={3}
                      className="w-full bg-ivory/60 border border-gold/20 rounded-xl px-4 py-2 font-cormorant text-lg text-ink outline-none focus:border-gold/50 transition-colors placeholder:text-ink/30 resize-y"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={addMilestone.isPending}
                    className="w-full bg-gradient-to-r from-gold/80 to-gold text-cream font-playfair py-2.5 px-6 rounded-full border-none cursor-pointer disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {addMilestone.isPending ? 'Saving...' : 'Add Chapter'}
                  </motion.button>
                </form>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timeline */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <motion.div
              className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            />
          </div>
        ) : milestones.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <svg className="mx-auto mb-6 text-gold/20" width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect x="15" y="10" width="50" height="60" rx="4" stroke="currentColor" strokeWidth="1.5" />
              <path d="M25 25h30M25 35h20M25 45h25" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <path d="M55 55L60 60" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M58 48C62 44 66 42 68 44C70 46 68 50 64 54C60 58 56 60 54 58C52 56 54 52 58 48Z" stroke="currentColor" strokeWidth="1" />
            </svg>
            <p className="font-playfair text-2xl text-ink/30 mb-2">
              Every love story has a beginning
            </p>
            <p className="font-cormorant text-lg text-ink/20">
              Add your first chapter to start your timeline.
            </p>
          </motion.div>
        ) : (
          <div className="relative">
            {/* Vine line — desktop center */}
            <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 hidden md:block">
              <div className="w-[2px] h-full" style={{ background: `linear-gradient(180deg, transparent, var(--t-glass-border) 10%, var(--t-glass-border) 90%, transparent)` }} />
            </div>
            {/* Vine line — mobile left */}
            <div className="absolute left-6 top-0 bottom-0 md:hidden">
              <div className="w-[2px] h-full" style={{ background: `linear-gradient(180deg, transparent, var(--t-glass-border) 10%, var(--t-glass-border) 90%, transparent)` }} />
            </div>

            <div className="space-y-16">
              {milestones.map((milestone, index) => {
                const isLeft = index % 2 === 0;
                const variants = isLeft ? slideInLeft : slideInRight;
                const chapter = toRoman(index + 1);

                return (
                  <motion.div
                    key={milestone.id}
                    className={`relative flex items-start gap-6 ${
                      isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                    variants={variants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                  >
                    <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'} pl-14 md:pl-0`}>
                      <GlassCard className="inline-block text-left relative overflow-hidden group">
                        <span className="absolute top-3 right-4 font-playfair text-5xl font-bold text-gold/[0.06] select-none">
                          {chapter}
                        </span>
                        {memoriesUnlocked && (
                          <button
                            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full text-ink/20 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer disabled:opacity-50"
                            onClick={() => { if (confirm('Delete this chapter?')) deleteMilestone.mutate(milestone.id); }}
                            disabled={deleteMilestone.isPending}
                            title="Delete chapter"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                            </svg>
                          </button>
                        )}
                        <p className="font-inter text-xs text-gold uppercase tracking-widest mb-2">
                          {format(new Date(milestone.milestone_date), 'MMMM d, yyyy')}
                        </p>
                        <h3 className="font-playfair text-xl font-semibold text-ink mb-3">
                          {milestone.title}
                        </h3>
                        {milestone.description && (
                          <p className="font-cormorant text-base text-ink/55 leading-relaxed drop-cap">
                            {milestone.description}
                          </p>
                        )}
                      </GlassCard>
                    </div>

                    <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 z-10">
                      <WaxSeal size={24} />
                    </div>

                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
        {/* Memories section — revealed after timeline auth */}
        <AnimatePresence>
          {memoriesUnlocked && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: 20 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: 20 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden mt-20"
            >
              {/* Divider */}
              <div className="h-px mb-16 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

              {/* Section header */}
              <div className="text-center mb-10">
                <WaxSeal size={36} className="mb-3" />
                <p className="font-playfair italic text-gold text-xl mb-1">
                  A secret chapter has been unlocked
                </p>
                <p className="font-cormorant text-ink/50 text-lg">
                  Our private memories await within.
                </p>
              </div>

              {/* Memories password gate */}
              {!memoriesRevealed ? (
                <GlassCard className="max-w-sm mx-auto text-center" style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}>
                  <p className="font-cormorant text-lg text-ink/50 mb-4">
                    Enter the password to view our memories
                  </p>
                  <form onSubmit={(e) => { e.preventDefault(); authenticateMemories.mutate(memoriesPassword); }} className="space-y-3">
                    <motion.input
                      type="password"
                      value={memoriesPassword}
                      onChange={(e) => { setMemoriesPassword(e.target.value); setMemoriesAuthError(false); }}
                      placeholder="Whisper the password..."
                      className="w-full bg-ivory/60 border border-gold/20 rounded-xl px-4 py-2.5 font-cormorant text-lg text-ink text-center outline-none focus:border-gold/50 transition-colors placeholder:text-ink/25"
                      animate={memoriesAuthError ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                      transition={{ duration: 0.4 }}
                    />
                    {memoriesAuthError && (
                      <p className="font-inter text-sm text-rose/80">
                        That wasn't quite right. Try again.
                      </p>
                    )}
                    <motion.button
                      type="submit"
                      disabled={authenticateMemories.isPending || !memoriesPassword}
                      className="w-full bg-gradient-to-r from-gold/80 to-gold text-cream font-playfair py-2.5 rounded-full border-none cursor-pointer disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {authenticateMemories.isPending ? 'Verifying...' : 'Unlock Memories'}
                    </motion.button>
                  </form>
                </GlassCard>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Add memory toggle */}
                  <div className="text-center mb-10">
                    <motion.button
                      onClick={() => setShowMemoryUpload(!showMemoryUpload)}
                      className="border border-gold/30 bg-transparent text-gold font-cormorant text-lg px-6 py-2.5 rounded-full cursor-pointer"
                      whileHover={{ borderColor: 'rgba(212, 175, 55, 0.6)', backgroundColor: 'rgba(212, 175, 55, 0.05)' }}
                    >
                      {showMemoryUpload ? 'Cancel' : '+ Add a memory'}
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {showMemoryUpload && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-10"
                      >
                        <PhotoUpload onUploaded={() => setShowMemoryUpload(false)} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <PolaroidGallery />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
