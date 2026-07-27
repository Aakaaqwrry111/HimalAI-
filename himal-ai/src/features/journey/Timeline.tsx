import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Sun, Moon } from 'lucide-react';
import { JourneyPlan } from '../../lib/gemini';

export default function Timeline({ plan }: { plan: JourneyPlan }) {
  return (
    <div className="relative border-l border-white/20 ml-4 md:ml-8 py-8">
      {plan.days.map((day, idx) => (
        <motion.div 
          key={day.dayNumber}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: idx * 0.2 }}
          className="mb-12 relative pl-8 md:pl-12"
        >
          {/* Glowing Node */}
          <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-accent-rhododendron shadow-[0_0_15px_rgba(227,58,77,0.8)]" />
          
          <div className="glass-panel p-6 rounded-2xl hover:bg-surface-glass-hover transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-accent-temple-gold font-bold text-sm tracking-widest uppercase">Day {day.dayNumber}</span>
              <h3 className="text-xl font-display font-semibold">{day.title}</h3>
            </div>
            
            <p className="text-text-secondary text-sm mb-4 leading-relaxed">
              {day.description}
            </p>

            <ul className="space-y-2">
              {day.activities.map((activity, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                  <MapPin size={14} className="mt-1 text-accent-temple-gold shrink-0" />
                  <span>{activity}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  );
}