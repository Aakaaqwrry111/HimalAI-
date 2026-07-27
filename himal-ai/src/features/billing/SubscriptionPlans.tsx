import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, Map, Satellite, Tent, ArrowRight, Star } from 'lucide-react';

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

export default function SubscriptionPlans() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  return (
    <div className="min-h-screen pt-28 pb-16 px-6 max-w-6xl mx-auto text-white">
      
      {/* Header Section */}
      <div className="text-center mb-12">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 text-accent-temple-gold mb-3 font-mono text-xs uppercase tracking-widest bg-accent-temple-gold/10 px-4 py-1.5 rounded-full border border-accent-temple-gold/20">
          <Zap size={14} /> Scalable Business Model
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Unlock the Full Himalayas</h1>
        <p className="text-white/60 max-w-2xl mx-auto">
          From free safety tools for casual trekkers to military-grade offline telemetry for extreme mountaineers, and enterprise tools for local teahouses.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="glass-panel bg-black/40 border border-white/10 p-1.5 rounded-full flex items-center relative">
          <button 
            onClick={() => setBillingCycle('monthly')}
            className={`relative z-10 px-6 py-2.5 rounded-full text-sm font-bold transition-colors ${billingCycle === 'monthly' ? 'text-black' : 'text-white/60 hover:text-white'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setBillingCycle('annual')}
            className={`relative z-10 px-6 py-2.5 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${billingCycle === 'annual' ? 'text-black' : 'text-white/60 hover:text-white'}`}
          >
            Annual <span className={billingCycle === 'annual' ? 'text-red-600 font-extrabold' : 'text-accent-temple-gold'}>-20%</span>
          </button>
          
          {/* Animated Background Pill */}
          <motion.div 
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-1.5 bottom-1.5 w-[100px] bg-accent-temple-gold rounded-full"
            style={{ left: billingCycle === 'monthly' ? '6px' : '108px', width: billingCycle === 'annual' ? '128px' : '96px' }}
          />
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <motion.div variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Tier 1: Explorer (Free) */}
        <motion.div variants={cardVariants} className="glass-panel bg-black/40 border border-white/10 p-8 rounded-3xl flex flex-col h-full relative group hover:border-white/30 transition-colors">
          <h3 className="text-xl font-bold mb-2">Explorer</h3>
          <p className="text-sm text-white/50 mb-6 h-10">Essential safety and routing for popular, well-connected trails.</p>
          <div className="mb-8">
            <span className="text-4xl font-display font-bold">Free</span>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            {['Standard Smart Map & Routing', 'Live Community Trail Wire', 'Basic Teahouse Ledger', 'Real-time Weather Sync'].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                <Check size={18} className="text-white/40 shrink-0 mt-0.5" /> {feature}
              </li>
            ))}
          </ul>
          <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors border border-white/10">
            Current Plan
          </button>
        </motion.div>

        {/* Tier 2: Pathfinder Pro (Premium Consumer) */}
        <motion.div variants={cardVariants} className="glass-panel bg-neutral-900 border-2 border-accent-temple-gold p-8 rounded-3xl flex flex-col h-full relative transform md:-translate-y-4 shadow-2xl shadow-accent-temple-gold/10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent-temple-gold text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
            <Star size={12} fill="currentColor" /> Most Popular
          </div>
          
          <h3 className="text-xl font-bold mb-2 text-accent-temple-gold">Pathfinder Pro</h3>
          <p className="text-sm text-white/50 mb-6 h-10">Absolute reliability and AI foresight for extreme altitude environments.</p>
          <div className="mb-8">
            <span className="text-4xl font-display font-bold">${billingCycle === 'annual' ? '29' : '4.99'}</span>
            <span className="text-white/40 text-sm">/{billingCycle === 'annual' ? 'year' : 'mo'}</span>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            {['Everything in Explorer', 'Unlimited Offline Vector Map Caches', 'AI Acclimatization Risk Predictor', 'Satellite SMS SOS Integration', 'Zero-Fee Verified Guide Booking'].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-white/90 font-medium">
                <Check size={18} className="text-accent-temple-gold shrink-0 mt-0.5" /> {feature}
              </li>
            ))}
          </ul>
          <button className="w-full py-4 bg-gradient-to-r from-accent-temple-gold to-orange-500 text-black hover:scale-[1.02] active:scale-[0.98] rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
            Upgrade to Pro <ArrowRight size={18} />
          </button>
        </motion.div>

        {/* Tier 3: B2B Partner Portal */}
        <motion.div variants={cardVariants} className="glass-panel bg-black/40 border border-blue-500/30 p-8 rounded-3xl flex flex-col h-full relative group hover:border-blue-500/60 transition-colors">
          <div className="absolute top-4 right-4 bg-blue-500/10 text-blue-400 p-2 rounded-lg">
            <Tent size={20} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-blue-400">Teahouse SaaS</h3>
          <p className="text-sm text-white/50 mb-6 h-10">Enterprise management tools for local mountain lodges and homestays.</p>
          <div className="mb-8">
            <span className="text-4xl font-display font-bold">${billingCycle === 'annual' ? '120' : '12'}</span>
            <span className="text-white/40 text-sm">/{billingCycle === 'annual' ? 'year' : 'mo'}</span>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            {['Priority placement on Smart Map', 'Offline Ledger Booking Sync', 'Trekker Pre-order Meal Queues', 'Local Guide Network Dashboard'].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                <Check size={18} className="text-blue-400 shrink-0 mt-0.5" /> {feature}
              </li>
            ))}
          </ul>
          <button className="w-full py-4 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl font-bold transition-colors border border-blue-500/30">
            Open Partner Portal
          </button>
        </motion.div>

      </motion.div>

      {/* Guide Marketplace Commission Callout */}
      <motion.div variants={containerVariants} initial="initial" animate="animate" className="mt-12 glass-panel bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
            <Shield className="text-green-400" size={24} />
          </div>
          <div>
            <h4 className="font-bold text-lg">Verified Guide & Porter Marketplace</h4>
            <p className="text-sm text-white/60">Himal AI charges a flat <span className="text-green-400 font-bold">5% platform fee</span> on ethical guide bookings, bypassing middleman agencies.</p>
          </div>
        </div>
        <button className="px-6 py-3 bg-white/10 hover:bg-white/15 rounded-xl text-sm font-bold transition-colors whitespace-nowrap">
          View Guide Economics
        </button>
      </motion.div>

    </div>
  );
}