import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tent, Coffee, Sparkles, CheckCircle2, ChevronRight, Calculator } from 'lucide-react';

const BUDGET_TIERS = {
  low: {
    id: 'low',
    name: 'Backpacker',
    dailyRate: 35,
    icon: Tent,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-400',
    bgLight: 'bg-emerald-400/10',
    glow: 'shadow-[0_0_30px_rgba(52,211,153,0.15)]',
    description: 'Keep it raw and authentic.',
    perks: ['Basic teahouse beds', 'Standard Dal Bhat', 'Local transport', 'Carry own gear'],
  },
  moderate: {
    id: 'moderate',
    name: 'Standard',
    dailyRate: 75,
    icon: Coffee,
    color: 'text-accent-temple-gold',
    borderColor: 'border-accent-temple-gold',
    bgLight: 'bg-accent-temple-gold/10',
    glow: 'shadow-[0_0_30px_rgba(217,119,6,0.15)]',
    description: 'The balanced trekker experience.',
    perks: ['Rooms with attached bath', 'Varied menu options', 'Hot showers included', 'Porter shared (1:2)'],
  },
  luxury: {
    id: 'luxury',
    name: 'Luxury',
    dailyRate: 250,
    icon: Sparkles,
    color: 'text-purple-400',
    borderColor: 'border-purple-400',
    bgLight: 'bg-purple-400/10',
    glow: 'shadow-[0_0_30px_rgba(192,132,252,0.15)]',
    description: 'Premium comfort at high altitudes.',
    perks: ['Premium lodges (Yeti Home)', 'All-inclusive dining', 'Heli-return options', 'Personal guide & porter'],
  }
};

type TierKey = keyof typeof BUDGET_TIERS;

export default function BudgetEngine() {
  const [selectedTier, setSelectedTier] = useState<TierKey>('moderate');
  const [days, setDays] = useState<number>(12);

  const activeData = BUDGET_TIERS[selectedTier];
  const totalCost = activeData.dailyRate * days;

  return (
    /* ADDED: py-12 md:py-20 for massive top/bottom space, max-w-6xl for a wider spread */
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20 flex flex-col gap-12">
      
      {/* Header Section */}
      <div className="flex flex-col md:items-center md:text-center max-w-2xl mx-auto">
        <h3 className="text-3xl md:text-4xl font-display font-bold text-white flex items-center justify-center gap-4 mb-4">
          <Calculator className="text-accent-temple-gold" size={32} />
          Trek Budget Estimator
        </h3>
        <p className="text-white/60 text-base md:text-lg">
          Select your travel style and duration to calculate your on-trail expenses. 
          Prices are estimates based on current season rates.
        </p>
      </div>

      {/* Interactive Days Slider */}
      {/* ADDED: p-8 md:p-10 for a much roomier slider box */}
      <div className="glass-panel bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8">
          <div>
            <label className="text-white/50 text-sm font-bold uppercase tracking-widest block mb-2">
              Trek Duration
            </label>
            <span className="text-4xl md:text-5xl font-black text-white">
              {days} <span className="text-xl text-white/40 font-medium">days</span>
            </span>
          </div>
          <div className="md:text-right">
            <label className="text-white/50 text-sm font-bold uppercase tracking-widest block mb-2">
              Est. Total Cost
            </label>
            <span className="text-4xl md:text-5xl font-black text-accent-temple-gold">
              ${totalCost.toLocaleString()}
            </span>
          </div>
        </div>
        
        <input 
          type="range" 
          min="5" 
          max="30" 
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent-temple-gold hover:accent-orange-400 transition-all"
        />
        <div className="flex justify-between text-sm text-white/40 mt-4 font-medium px-1">
          <span>5 Days</span>
          <span className="hidden md:inline">15 Days (Base Camps)</span>
          <span>30 Days</span>
        </div>
      </div>

      {/* Budget Tiers Grid */}
      {/* ADDED: gap-6 lg:gap-10 to spread the cards out nicely on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        {(Object.keys(BUDGET_TIERS) as TierKey[]).map((tierKey) => {
          const tier = BUDGET_TIERS[tierKey];
          const isSelected = selectedTier === tierKey;
          const Icon = tier.icon;

          return (
            <motion.div
              key={tier.id}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedTier(tierKey)}
              className={`relative cursor-pointer rounded-3xl overflow-hidden transition-all duration-300 border-2 ${
                isSelected 
                  ? `${tier.borderColor} ${tier.bgLight} ${tier.glow}` 
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10'
              }`}
            >
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background-dark/80 pointer-events-none" />
              )}

              {/* ADDED: p-8 for much wider margins inside the card itself */}
              <div className="p-8 relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${isSelected ? tier.color + ' bg-black/30' : 'text-white/40 bg-white/5'}`}>
                    <Icon size={28} />
                  </div>
                  {isSelected && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={tier.color}
                    >
                      <CheckCircle2 size={28} />
                    </motion.div>
                  )}
                </div>

                <h4 className="text-2xl font-bold text-white mb-2">{tier.name}</h4>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className={`text-3xl font-black ${isSelected ? tier.color : 'text-white/80'}`}>
                    ${tier.dailyRate}
                  </span>
                  <span className="text-base text-white/50 font-medium">/ day</span>
                </div>
                
                <p className="text-base text-white/60 mb-8 flex-grow">
                  {tier.description}
                </p>

                <div className="space-y-4 pt-6 border-t border-white/10">
                  {tier.perks.map((perk, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-base text-white/80">
                      <ChevronRight size={16} className={isSelected ? tier.color : 'text-white/30'} />
                      {perk}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
    </div>
  );
}