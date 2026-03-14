import { useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/layout/PageHeader';
import LetterArchive from '../components/letter/LetterArchive';

type FilterTab = 'all' | 'pending' | 'sent';

const tabs: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'All Letters' },
  { value: 'pending', label: 'Pending' },
  { value: 'sent', label: 'Delivered' },
];

export default function ArchivePage() {
  const [filter, setFilter] = useState<FilterTab>('all');

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Letter"
          highlightWord="Archive"
          subtitle="Your sealed letters, preserved like pressed flowers."
        />

        {/* Filter tabs */}
        <motion.div
          className="flex justify-center gap-1 mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`relative font-cormorant text-lg px-6 py-2.5 rounded-full border cursor-pointer transition-all duration-300 ${
                filter === tab.value
                  ? 'bg-gold/10 text-gold border-gold/30'
                  : 'bg-transparent text-ink/40 border-transparent hover:text-ink/60'
              }`}
            >
              {tab.label}
              {filter === tab.value && (
                <motion.div
                  className="absolute bottom-0 left-1/4 right-1/4 h-[1.5px]"
                  style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }}
                  layoutId="filter-tab"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        <LetterArchive filter={filter} />
      </div>
    </div>
  );
}
