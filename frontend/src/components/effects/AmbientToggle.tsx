import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

// ── WAV blob generation from raw float samples ──

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

function floatsToWavBlob(samples: Float32Array, sampleRate: number): Blob {
  const n = samples.length;
  const buf = new ArrayBuffer(44 + n * 2);
  const v = new DataView(buf);

  writeString(v, 0, 'RIFF');
  v.setUint32(4, 36 + n * 2, true);
  writeString(v, 8, 'WAVE');
  writeString(v, 12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, sampleRate, true);
  v.setUint32(28, sampleRate * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  writeString(v, 36, 'data');
  v.setUint32(40, n * 2, true);

  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    v.setInt16(44 + i * 2, s * 0x7fff, true);
  }

  return new Blob([buf], { type: 'audio/wav' });
}

function lpFilter(samples: Float32Array, cutoff: number, sampleRate: number): Float32Array {
  const rc = 1.0 / (cutoff * 2 * Math.PI);
  const dt = 1.0 / sampleRate;
  const alpha = dt / (rc + dt);
  const out = new Float32Array(samples.length);
  out[0] = samples[0] * alpha;
  for (let i = 1; i < samples.length; i++) {
    out[i] = out[i - 1] + alpha * (samples[i] - out[i - 1]);
  }
  return out;
}

// ── Piano: layered sine-wave chords with envelopes ──

function generatePiano(sampleRate: number, durationSec: number): Float32Array {
  const n = sampleRate * durationSec;
  const out = new Float32Array(n);

  const chords = [
    [261.63, 329.63, 392.0],
    [220.0, 277.18, 329.63],
    [174.61, 220.0, 261.63],
    [196.0, 246.94, 293.66],
    [261.63, 311.13, 392.0],
    [220.0, 261.63, 329.63],
    [174.61, 220.0, 277.18],
    [196.0, 261.63, 329.63],
  ];

  let pos = 0;
  const chordDuration = 5.0;
  let chordIdx = 0;

  while (pos < durationSec - 1) {
    const chord = chords[chordIdx % chords.length];
    const startSample = Math.floor(pos * sampleRate);

    chord.forEach((freq) => {
      const f = freq * (1 + (Math.random() - 0.5) * 0.004);
      const sustainSamples = Math.floor(chordDuration * sampleRate);

      for (let i = 0; i < sustainSamples && startSample + i < n; i++) {
        const t = i / sampleRate;
        const attack = Math.min(1, t / 0.15);
        const decay = Math.exp(-t * 0.8);
        const env = attack * decay;

        const sample =
          Math.sin(2 * Math.PI * f * t) * 0.7 +
          Math.sin(2 * Math.PI * f * 2 * t) * 0.15 +
          Math.sin(2 * Math.PI * f * 3 * t) * 0.05;

        out[startSample + i] += sample * env * 0.12;
      }
    });

    pos += 2.5 + Math.random() * 2.5;
    chordIdx++;
  }

  const filtered = lpFilter(out, 2000, sampleRate);

  const fade = Math.floor(sampleRate * 1.0);
  for (let i = 0; i < fade; i++) {
    const t = i / fade;
    filtered[n - fade + i] = filtered[n - fade + i] * (1 - t) + filtered[i] * t;
  }

  for (let i = 0; i < n; i++) {
    filtered[i] = Math.max(-1, Math.min(1, filtered[i]));
  }

  return filtered;
}

// ── Cache blob URL ──

let pianoUrl: string | null = null;

function getPianoUrl(): string {
  if (pianoUrl) return pianoUrl;
  const samples = generatePiano(44100, 25);
  const blob = floatsToWavBlob(samples, 44100);
  pianoUrl = URL.createObjectURL(blob);
  return pianoUrl;
}

// ── Component ──

export default function AmbientToggle() {
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Start piano on mount
  useEffect(() => {
    const url = getPianoUrl();
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0.8;
    audioRef.current = audio;

    audio
      .play()
      .then(() => setReady(true))
      .catch(() => {
        // Autoplay blocked — wait for first user click anywhere
        const unlock = () => {
          audio
            .play()
            .then(() => setReady(true))
            .catch(() => {});
          document.removeEventListener('click', unlock);
        };
        document.addEventListener('click', unlock);
      });

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (muted) {
      audio.play().then(() => setReady(true)).catch(() => {});
      // Fade in
      audio.volume = 0;
      const fadeIn = () => {
        if (audio.volume < 0.75) {
          audio.volume = Math.min(0.8, audio.volume + 0.05);
          requestAnimationFrame(fadeIn);
        } else {
          audio.volume = 0.8;
        }
      };
      fadeIn();
    } else {
      // Fade out
      const fadeOut = () => {
        if (audio.volume > 0.05) {
          audio.volume = Math.max(0, audio.volume - 0.05);
          requestAnimationFrame(fadeOut);
        } else {
          audio.pause();
        }
      };
      fadeOut();
    }

    setMuted(!muted);
  }, [muted]);

  return (
    <motion.button
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 glass w-12 h-12 flex items-center justify-center cursor-pointer border-none"
      style={{ borderRadius: '50%' }}
      onClick={toggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={muted ? 'Unmute ambient piano' : 'Mute ambient piano'}
    >
      {muted ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink/60">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <motion.div
          animate={ready ? { scale: [1, 1.15, 1] } : undefined}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M15.54 8.46a5 5 0 010 7.07" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}
