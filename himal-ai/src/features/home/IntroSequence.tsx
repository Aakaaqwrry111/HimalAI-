import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const phases = [
  { text: "Earth", scale: 1 },
  { text: "Asia", scale: 1.5 },
  { text: "Nepal", scale: 2 },
  { text: "The Himalayas", scale: 3 },
];

export default function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    if (phaseIndex >= phases.length) {
      setTimeout(onComplete, 1000);
      return;
    }
    const timer = setTimeout(() => {
      setPhaseIndex(prev => prev + 1);
    }, 1500); // 1.5s per phase = 6s total
    return () => clearTimeout(timer);
  }, [phaseIndex, onComplete]);

  return (
    <motion.div 
      exit={{ opacity: 0 }} 
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="fixed inset-0 z-50 bg-background-dark overflow-hidden flex items-center justify-center"
    >
      {/* Background scaling to simulate dive */}
      <motion.div
        animate={{ scale: phaseIndex < phases.length ? phases[phaseIndex].scale : 4 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=100&w=2000" 
          alt="Himalayas" 
          className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
        />
      </motion.div>

      {/* Text Sequence */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <AnimatePresence mode="wait">
          {phaseIndex < phases.length && (
            <motion.h1
              key={phases[phaseIndex].text}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-display font-semibold tracking-widest text-glow"
            >
              {phases[phaseIndex].text}
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      <button 
        onClick={onComplete}
        className="absolute bottom-12 right-12 z-20 text-sm tracking-widest text-white/50 hover:text-white transition-colors"
      >
        SKIP PREVIEW
      </button>
    </motion.div>
  );
}