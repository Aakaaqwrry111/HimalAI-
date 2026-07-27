import React from 'react';
import { motion } from 'framer-motion';
import { Layers, MapPin, Tent, Compass, Sparkles } from 'lucide-react';

interface FilterProps {
  activeFilters: string[];
  toggleFilter: (filter: string) => void;
}

const filters = [
  { id: 'unesco', label: 'UNESCO Sites', icon: <Compass size={14} /> },
  { id: 'hidden_gem', label: 'Hidden Gems', icon: <Sparkles size={14} /> },
  { id: 'trekking', label: 'Trails', icon: <Tent size={14} /> },
  { id: 'culture', label: 'Local Culture', icon: <MapPin size={14} /> }
];

export default function MapFilters({ activeFilters, toggleFilter }: FilterProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="absolute top-32 left-6 z-[1000] glass-panel p-4 rounded-2xl w-56 flex flex-col gap-3"
    >
      <div className="flex items-center gap-2 mb-2 text-white/80 border-b border-white/10 pb-2">
        <Layers size={16} />
        <span className="font-medium text-sm">Smart Layers</span>
      </div>
      
      {filters.map((filter) => {
        const isActive = activeFilters.includes(filter.id);
        return (
          <button
            key={filter.id}
            onClick={() => toggleFilter(filter.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-sm font-medium ${
              isActive 
                ? 'bg-accent-rhododendron text-white shadow-[0_0_15px_rgba(227,58,77,0.3)]' 
                : 'hover:bg-surface-glass-hover text-text-secondary'
            }`}
          >
            {filter.icon}
            {filter.label}
          </button>
        );
      })}
    </motion.div>
  );
}