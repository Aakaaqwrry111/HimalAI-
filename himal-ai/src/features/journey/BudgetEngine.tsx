import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, PieChart, TrendingUp } from 'lucide-react';
import { JourneyPlan } from '../../lib/gemini';

export default function BudgetEngine({ plan }: { plan: JourneyPlan }) {
  const total = plan.budgetBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const currency = plan.budgetBreakdown[0]?.currency || 'USD';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 rounded-3xl sticky top-32"
    >
      <div className="flex items-center gap-3 mb-6">
        <Wallet className="text-accent-temple-gold" />
        <h3 className="font-display text-xl font-semibold">Budget Projection</h3>
      </div>

      <div className="text-4xl font-display font-bold mb-8 text-glow">
        {total} <span className="text-xl text-text-secondary">{currency}</span>
      </div>

      <div className="space-y-4">
        {plan.budgetBreakdown.map((item, idx) => {
          const percentage = Math.round((item.amount / total) * 100);
          return (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">{item.category}</span>
                <span className="font-medium">{item.amount} {currency}</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                  className="h-full bg-gradient-to-r from-accent-rhododendron to-accent-temple-gold rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-sm text-text-secondary">
        <span className="flex items-center gap-2"><TrendingUp size={14} /> Difficulty:</span>
        <span className="text-white font-medium capitalize">{plan.difficulty}</span>
      </div>
    </motion.div>
  );
}