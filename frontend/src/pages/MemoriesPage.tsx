import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PasswordGate from '../components/photos/PasswordGate';
import PhotoUpload from '../components/photos/PhotoUpload';
import PolaroidGallery from '../components/photos/PolaroidGallery';
import PageHeader from '../components/layout/PageHeader';

export default function MemoriesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    return () => {
      localStorage.removeItem('dgl_token');
    };
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 relative">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(244, 194, 194, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(196, 183, 213, 0.12) 0%, transparent 50%)',
        }}
      />

      <AnimatePresence>
        {!isAuthenticated && (
          <PasswordGate onAuthenticated={() => setIsAuthenticated(true)} />
        )}
      </AnimatePresence>

      {isAuthenticated && (
        <div className="relative z-10 max-w-5xl mx-auto">
          <PageHeader
            title="Our"
            highlightWord="Memories"
            subtitle="Moments frozen in time, like polaroids scattered on a table."
          />

          {/* Add memory toggle */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={() => setShowUpload(!showUpload)}
              className="border border-gold/30 bg-transparent text-gold font-cormorant text-lg px-6 py-2.5 rounded-full cursor-pointer"
              whileHover={{ borderColor: 'rgba(212, 175, 55, 0.6)', backgroundColor: 'rgba(212, 175, 55, 0.05)' }}
            >
              {showUpload ? 'Cancel' : '+ Add a memory'}
            </motion.button>
          </motion.div>

          <AnimatePresence>
            {showUpload && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-10"
              >
                <PhotoUpload onUploaded={() => setShowUpload(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <PolaroidGallery />
          </motion.div>
        </div>
      )}
    </div>
  );
}
