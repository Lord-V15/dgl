import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollProgress from './components/layout/ScrollProgress';
import AmbientToggle from './components/effects/AmbientToggle';
import HomePage from './pages/HomePage';
import WriteLetterPage from './pages/WriteLetterPage';
import ArchivePage from './pages/ArchivePage';
import MemoriesPage from './pages/MemoriesPage';
import TimelinePage from './pages/TimelinePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} {...pageTransition}>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/write" element={<WriteLetterPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/memories" element={<MemoriesPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <ScrollProgress />
          <Navbar />
          <main className="flex-1">
            <AnimatedRoutes />
          </main>
          <Footer />
          <AmbientToggle />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
