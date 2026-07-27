import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Loader2 } from 'lucide-react';
import { generateJourney, JourneyPlan } from '../../lib/gemini';
import Timeline from './Timeline';
import BudgetEngine from './BudgetEngine';

export default function JourneyBuilder() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<JourneyPlan | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
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
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-glow">
          Journey Canvas
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl">
          Define your parameters. Our AI will architect a hyper-personalized route through the Himalayas, complete with logistics and interactive mapping.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Input Canvas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-2 rounded-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-mesh-aurora opacity-20 pointer-events-none transition-opacity group-hover:opacity-40" />
            
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., I love photography and ancient temples. I hate crowds. I have $500 and want a 4-day trip near Kathmandu."
              className="w-full h-40 bg-transparent text-white placeholder:text-white/30 resize-none p-6 outline-none text-lg relative z-10"
            />
            
            <div className="flex justify-between items-center p-4 relative z-10 border-t border-white/10">
              <span className="text-xs text-text-secondary flex items-center gap-2">
                <Compass size={14} /> Natural Language Engine Active
              </span>
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className="bg-white text-black px-8 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={18} /> : null}
                Architect Route
              </button>
            </div>
          </div>

          {/* Results Area */}
          <AnimatePresence mode="wait">
            {isGenerating && (
              <motion.div 
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                className="h-64 glass-panel rounded-3xl flex flex-col items-center justify-center gap-4 border border-white/5"
              >
                <div className="w-12 h-12 rounded-full border-t-2 border-accent-rhododendron animate-spin" />
                <p className="text-text-secondary font-medium tracking-wide animate-pulse">
                  Clearing the mountain fog...
                </p>
              </motion.div>
            )}

            {!isGenerating && plan && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12"
              >
                <h2 className="text-3xl font-display font-semibold mb-8 text-accent-temple-gold">
                  {plan.title}
                </h2>
                <Timeline plan={plan} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Side Panel: Budget & Meta */}
        <div className="lg:col-span-1">
          <AnimatePresence>
            {!isGenerating && plan && (
              <BudgetEngine plan={plan} />
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}