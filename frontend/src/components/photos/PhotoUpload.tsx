import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import api from '../../lib/api';
import GlassCard from '../layout/GlassCard';

interface PhotoUploadProps {
  onUploaded?: () => void;
}

export default function PhotoUpload({ onUploaded }: PhotoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const upload = useMutation({
    mutationFn: async () => {
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      if (caption) formData.append('caption', caption);
      formData.append('taken_date', date);
      return api.post('/photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      setFile(null);
      setPreview(null);
      setCaption('');
      setDate(format(new Date(), 'yyyy-MM-dd'));
      onUploaded?.();
    },
  });

  const handleFile = useCallback((f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f && f.type.startsWith('image/')) {
        handleFile(f);
      }
    },
    [handleFile]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) upload.mutate();
  };

  return (
    <GlassCard className="mb-8">
      <form onSubmit={handleSubmit}>
        <h3 className="font-playfair text-xl font-semibold text-ink mb-4">
          Add a memory
        </h3>

        {/* Drop zone */}
        <motion.div
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors duration-300 mb-4 ${
            isDragging
              ? 'border-gold bg-gold/5'
              : 'border-gold/20 hover:border-gold/40'
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          whileHover={{ scale: 1.01 }}
        >
          {preview ? (
            <div className="flex flex-col items-center gap-3">
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 rounded-lg object-contain"
              />
              <p className="font-inter text-xs text-ink/40">Click to change</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(212, 175, 55, 0.4)"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <p className="font-cormorant text-lg text-ink/40">
                Drop a photo here or click to browse
              </p>
            </div>
          )}
        </motion.div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        {/* Caption & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="font-inter text-xs uppercase tracking-wider text-ink/50 mb-1 block">
              Caption
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="A moment to remember..."
              className="w-full bg-cream/60 border border-gold/20 rounded-xl px-4 py-2 font-cormorant text-lg text-ink outline-none focus:border-gold/50 transition-colors duration-300 placeholder:text-ink/30"
            />
          </div>
          <div>
            <label className="font-inter text-xs uppercase tracking-wider text-ink/50 mb-1 block">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-cream/60 border border-gold/20 rounded-xl px-4 py-2 font-cormorant text-lg text-ink outline-none focus:border-gold/50 transition-colors duration-300"
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={!file || upload.isPending}
          className="bg-gradient-to-r from-gold/80 to-gold text-cream font-playfair py-2 px-6 rounded-full border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {upload.isPending ? 'Uploading...' : 'Save Memory'}
        </motion.button>

        {upload.isError && (
          <p className="font-inter text-sm text-red-600/80 mt-2">
            Upload failed. Please try again.
          </p>
        )}
      </form>
    </GlassCard>
  );
}
