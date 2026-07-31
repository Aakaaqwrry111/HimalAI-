import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Loader2, Tent, Coffee, Sparkles, CheckCircle2, ChevronRight, Calculator, CalendarDays } from 'lucide-react';
import { generateJourney, JourneyPlan } from '../../lib/gemini';
import Timeline from './Timeline';

// Define the 3 budget tiers based on standard Nepal trekking rates
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

export default function JourneyBuilder() {
  // 1. Persist the user's prompt
  const [prompt, setPrompt] = useState(() => {
    if (typeof window === 'undefined') return '';
    const saved = localStorage.getItem('treksafe_journey_prompt');
    return saved ? JSON.parse(saved) : '';
  });

  // 2. Persist the generated plan
  const [plan, setPlan] = useState<JourneyPlan | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('treksafe_journey_plan');
    return saved ? JSON.parse(saved) : null;
  });

  // 3. Persist the selected budget tier
  const [selectedTier, setSelectedTier] = useState<TierKey>(() => {
    if (typeof window === 'undefined') return 'moderate';
    const saved = localStorage.getItem('treksafe_journey_tier');
    return saved ? JSON.parse(saved) : 'moderate';
  });

  // Loading state (does not need to be persisted to prevent getting stuck on refresh)
  const [isGenerating, setIsGenerating] = useState(false);

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('treksafe_journey_prompt', JSON.stringify(prompt));
  }, [prompt]);

  useEffect(() => {
    localStorage.setItem('treksafe_journey_plan', JSON.stringify(plan));
  }, [plan]);

  useEffect(() => {
    localStorage.setItem('treksafe_journey_tier', JSON.stringify(selectedTier));
  }, [selectedTier]);

  // Dynamically calculate days based on the AI generated plan
  const journeyDays = plan?.days && Array.isArray(plan.days) ? plan.days.length : 0;
  
  // Calculate total cost based on the active tier and the exact journey duration
  const activeData = BUDGET_TIERS[selectedTier];
  const totalCost = activeData.dailyRate * journeyDays;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setPlan(null); // Clear previous plan while generating
    try {
      const result = await generateJourney(prompt);
      setPlan(result);
    } catch (error) {
      console.error(error);
      alert("The fog is too thick. Could not generate the journey.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20 flex flex-col gap-16">
      
      {/* Header Section */}
      <div className="flex flex-col max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-glow text-white">
          Journey Canvas
        </h1>
        <p className="text-white/60 text-base md:text-lg leading-relaxed">
          Define your parameters. Our AI will architect a hyper-personalized route through the Himalayas, complete with logistics, interactive mapping, and dynamic budgeting based on your exact route.
        </p>
      </div>

      {/* Input Canvas Section */}
      <div className="w-full">
        <div className="glass-panel p-2 rounded-3xl relative overflow-hidden group border border-white/10 shadow-2xl">
          <div className="absolute inset-0 bg-mesh-aurora opacity-20 pointer-events-none transition-opacity group-hover:opacity-40" />
          
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., I love photography and ancient temples. I hate crowds. I have $500 and want a 4-day trip near Kathmandu."
            className="w-full h-40 bg-transparent text-white placeholder:text-white/30 resize-none p-6 outline-none text-lg relative z-10"
          />
          
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 relative z-10 border-t border-white/10 gap-4">
            <span className="text-xs text-white/50 flex items-center gap-2">
              <Compass size={14} className="text-accent-temple-gold animate-spin-slow" /> Natural Language Engine Active
            </span>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="w-full sm:w-auto bg-white text-black px-8 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={18} /> : null}
              Architect Route
            </button>
          </div>
        </div>
      </div>

      {/* Loading State Animation */}
      <AnimatePresence mode="wait">
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            className="h-64 glass-panel rounded-3xl flex flex-col items-center justify-center gap-4 border border-white/10"
          >
            <div className="w-12 h-12 rounded-full border-t-2 border-accent-rhododendron animate-spin" />
            <p className="text-white/70 font-medium tracking-wide animate-pulse">
              Surveying trails and calculating logistics...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Plan, Timeline, and Budget (Only shows when plan exists) */}
      {!isGenerating && plan && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full flex flex-col gap-16"
        >
          {/* Timeline Section */}
          <div className="w-full flex flex-col gap-10">
            <div className="border-l-4 border-accent-temple-gold pl-6 py-2">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-accent-temple-gold">
                {plan.title}
              </h2>
              <p className="text-white/50 text-sm mt-1">Custom generated expedition blueprint</p>
            </div>
            
            <Timeline plan={plan} />
          </div>

          <div className="w-full h-px bg-white/10" />

          {/* Budget Section */}
          <div className="w-full flex flex-col gap-10 bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-12 backdrop-blur-md shadow-2xl">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white flex items-center gap-3">
                  <Calculator className="text-accent-temple-gold" size={28} />
                  Architected Budget
                </h3>
                <p className="text-white/60 mt-2 text-sm md:text-base">
                  Estimated expenses based on your <strong className="text-white">{journeyDays}-day</strong> generated itinerary.
                </p>
              </div>
              <div className="text-left md:text-right bg-white/5 p-4 rounded-2xl border border-white/10">
                <span className="text-xs text-white/40 uppercase tracking-widest block font-bold mb-1">Estimated Total</span>
                <span className="text-3xl md:text-4xl font-black text-accent-temple-gold">${totalCost.toLocaleString()}</span>
              </div>
            </div>

            {/* Read-only Duration Display (Replaces the manual slider) */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
              <div className="p-3 bg-accent-temple-gold/10 text-accent-temple-gold rounded-xl">
                <CalendarDays size={24} />
              </div>
              <div>
                <label className="text-white/70 text-sm font-bold uppercase tracking-wider block mb-1">
                  Locked Itinerary Duration
                </label>
                <div className="text-lg text-white font-medium">
                  Cost calculated exactly for <span className="text-accent-temple-gold font-bold">{journeyDays} days</span> on the trail.
                </div>
              </div>
            </div>

            {/* 3 Tiers Grid: Backpacker, Standard, Luxury */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {(Object.keys(BUDGET_TIERS) as TierKey[]).map((tierKey) => {
                const tier = BUDGET_TIERS[tierKey];
                const isSelected = selectedTier === tierKey;
                const Icon = tier.icon;

                return (
                  <motion.div
                    key={tier.id}
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTier(tierKey)}
                    className={`relative cursor-pointer rounded-3xl overflow-hidden transition-all duration-300 border-2 ${
                      isSelected 
                        ? `${tier.borderColor} ${tier.bgLight} ${tier.glow}` 
                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background-dark/80 pointer-events-none" />
                    )}

                    <div className="p-8 relative z-10 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`p-4 rounded-2xl ${isSelected ? tier.color + ' bg-black/40' : 'text-white/40 bg-white/5'}`}>
                          <Icon size={26} />
                        </div>
                        {isSelected && (
                          <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={tier.color}
                          >
                            <CheckCircle2 size={26} />
                          </motion.div>
                        )}
                      </div>

                      <h4 className="text-2xl font-bold text-white mb-2">{tier.name}</h4>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className={`text-3xl font-black ${isSelected ? tier.color : 'text-white/90'}`}>
                          ${tier.dailyRate}
                        </span>
                        <span className="text-sm text-white/50 font-medium">/ day</span>
                      </div>
                      
                      <p className="text-sm text-white/60 mb-8 min-h-[40px] leading-relaxed">
                        {tier.description}
                      </p>

                      <div className="space-y-3.5 pt-6 border-t border-white/10 mt-auto">
                        {tier.perks.map((perk, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm text-white/80">
                            <ChevronRight size={15} className={isSelected ? tier.color : 'text-white/30'} />
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
        </motion.div>
      )}

    </div>
  );
}