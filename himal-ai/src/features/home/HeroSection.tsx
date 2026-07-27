import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, Coffee, Mountain, Camera } from 'lucide-react';

const chips = [
  { icon: <Mountain size={14} />, label: "Trekking" },
  { icon: <MapPin size={14} />, label: "Hidden Gems" },
  { icon: <Coffee size={14} />, label: "Culture & Food" },
  { icon: <Camera size={14} />, label: "Photography" },
];

export default function HeroSection() {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    navigate('/journey', { state: { initialPrompt: prompt } });
  };

  const handleChipClick = (label: string) => {
    navigate('/journey', { state: { initialPrompt: `Plan a trip focused on ${label}` } });
  };

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=100&w=2500" 
          alt="Nepal Sunrise" 
          className="w-full h-full object-cover"
        />
        {/* FIX: Stronger dark overlays for contrast */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background-dark/80 via-transparent to-background-dark"></div>
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 text-center mt-20">
        {/* FIX: Added drop-shadow-2xl for text readability */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 text-white drop-shadow-2xl"
        >
          Your next story begins <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 drop-shadow-lg">where the earth touches the sky.</span>
        </motion.h1>

        {/* AI Search Bar Form */}
        <motion.form 
          onSubmit={handleGenerate}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative mt-8 group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-accent-rhododendron to-accent-temple-gold rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          {/* FIX: Made the glass panel darker */}
          <div className="relative bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center p-2 pl-6 shadow-2xl">
            <Sparkles className="text-accent-temple-gold mr-3 animate-pulse" size={24} />
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Where do you want your next story to begin?"
              className="bg-transparent w-full text-lg md:text-xl outline-none placeholder:text-white/60 text-white h-14"
            />
            <button 
              type="submit"
              className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors ml-2 flex-shrink-0"
            >
              Generate Journey
            </button>
          </div>
        </motion.form>

        {/* Suggestion Chips */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-3 mt-8"
        >
          {chips.map((chip, idx) => (
            <button 
              key={idx}
              onClick={() => handleChipClick(chip.label)}
              // FIX: Darker background for chips
              className="flex items-center gap-2 bg-black/40 border border-white/10 backdrop-blur-md hover:bg-black/60 px-4 py-2 rounded-full text-sm font-medium text-white transition-all hover:-translate-y-0.5"
            >
              {chip.icon}
              {chip.label}
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}