import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, X, MapPin, Zap, Shield, Sparkles, RefreshCw } from 'lucide-react';
import { usePassport } from '../../hooks/usePassport';

export default function ExplorerPassport({ onClose }: { onClose: () => void }) {
  const { passport, currentRank, progressToNext, addXp, unlockRandomStamp, resetPassport } = usePassport();
  const [activeTab, setActiveTab] = useState<'stamps' | 'stats'>('stamps');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl">
      <motion.div 
        initial={{ y: 50, opacity: 0, rotateX: 10 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-4xl glass-panel bg-black/80 border border-white/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.15)] flex flex-col max-h-[90vh]"
      >
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-white/5">
          <div className="flex gap-6">
            <button 
              onClick={() => setActiveTab('stamps')}
              className={`font-display font-bold text-lg transition-colors relative ${activeTab === 'stamps' ? 'text-accent-temple-gold' : 'text-white/50 hover:text-white'}`}
            >
              Visas & Stamps
              {activeTab === 'stamps' && (
                <motion.div layoutId="activeTab" className="absolute -bottom-5 left-0 right-0 h-0.5 bg-accent-temple-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={`font-display font-bold text-lg transition-colors relative ${activeTab === 'stats' ? 'text-accent-temple-gold' : 'text-white/50 hover:text-white'}`}
            >
              Explorer Stats
              {activeTab === 'stats' && (
                <motion.div layoutId="activeTab" className="absolute -bottom-5 left-0 right-0 h-0.5 bg-accent-temple-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
              )}
            </button>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10 hover:rotate-90 duration-300">
            <X size={20} />
          </button>
        </div>

        {/* Identity Header */}
        <div className="px-8 pt-8 pb-6 bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-accent-temple-gold to-orange-600 p-1 shadow-lg shadow-orange-500/20">
                <div className="h-full w-full bg-black rounded-xl flex items-center justify-center border border-white/20">
                  <span className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-accent-temple-gold to-white">
                    {passport.explorerName.charAt(0)}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-white/50 text-sm font-mono uppercase tracking-widest mb-1">
                  <MapPin size={14} /> {passport.homeBase}
                </div>
                <h2 className="text-4xl font-display font-bold text-glow tracking-wide">{passport.explorerName}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="bg-accent-temple-gold/20 text-accent-temple-gold border border-accent-temple-gold/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Award size={14} /> {currentRank.title}
                  </span>
                  <span className="text-white/40 font-mono text-xs">ID: HML-8848-X</span>
                </div>
              </div>
            </div>

            {/* Level Up Progress Bar */}
            <div className="w-full md:w-64 glass-panel bg-black/50 p-4 rounded-2xl border border-white/10">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-white/60 font-bold uppercase tracking-wider">Total XP</span>
                <span className="font-mono font-bold text-lg text-accent-temple-gold">{passport.totalXp}</span>
              </div>
              <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNext}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-accent-temple-gold rounded-full"
                />
              </div>
              <p className="text-[10px] text-right text-white/40 mt-1 uppercase">
                {Math.round(100 - progressToNext)}% to next rank
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="px-8 pb-8 flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            
            {activeTab === 'stamps' && (
              <motion.div 
                key="stamps"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-4"
              >
                {passport.stamps.map((stamp: any, idx: number) => (
                  <motion.div 
                    key={stamp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`relative p-5 rounded-3xl border flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-500 ${
                      stamp.unlocked 
                        ? 'bg-gradient-to-b from-white/10 to-black/40 border-accent-temple-gold/40 hover:border-accent-temple-gold shadow-lg shadow-accent-temple-gold/5 group' 
                        : 'bg-black/40 border-white/5 opacity-50 grayscale'
                    }`}
                  >
                    {stamp.unlocked && (
                      <div className="absolute inset-0 bg-accent-temple-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                    <div className={`text-5xl mb-3 transition-transform duration-500 ${stamp.unlocked ? 'group-hover:scale-110 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]' : ''}`}>
                      {stamp.icon}
                    </div>
                    <h4 className="font-bold text-sm leading-tight text-white/90">{stamp.name}</h4>
                    <p className="text-xs text-white/50 mt-1">{stamp.region}</p>
                    
                    <div className={`mt-4 text-[10px] uppercase font-mono px-3 py-1 rounded-full border ${
                      stamp.unlocked 
                        ? 'bg-black/50 border-accent-temple-gold/30 text-accent-temple-gold' 
                        : 'bg-white/5 border-white/10 text-white/40'
                    }`}>
                      {stamp.unlocked ? stamp.date : 'Undiscovered'}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div 
                key="stats"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl"><Shield size={24} /></div>
                    <div>
                      <p className="text-sm text-white/50">TrekSafe Alerts</p>
                      <p className="text-xl font-bold">12 Read</p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl"><Sparkles size={24} /></div>
                    <div>
                      <p className="text-sm text-white/50">AI Lens Scans</p>
                      <p className="text-xl font-bold">8 Landmarks</p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 text-green-400 rounded-xl"><Zap size={24} /></div>
                    <div>
                      <p className="text-sm text-white/50">Journeys Built</p>
                      <p className="text-xl font-bold">3 Planned</p>
                    </div>
                  </div>
                </div>

                {/* DEV CONTROLS - TO SHOW IT WORKING */}
                <div className="mt-8 p-6 border border-dashed border-red-500/30 bg-red-500/5 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-red-400 font-bold text-sm uppercase tracking-wider">Developer / Testing Engine</h4>
                    <span className="text-xs text-white/40">Simulate App Usage</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => addXp(250)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors border border-white/10"
                    >
                      + Generate Journey (250 XP)
                    </button>
                    <button 
                      onClick={unlockRandomStamp}
                      className="px-4 py-2 bg-accent-temple-gold/20 hover:bg-accent-temple-gold/30 text-accent-temple-gold rounded-xl text-sm font-medium transition-colors border border-accent-temple-gold/30 flex items-center gap-2"
                    >
                      <MapPin size={14} /> Check-in at Location
                    </button>
                    <button 
                      onClick={resetPassport}
                      className="px-4 py-2 bg-black/50 hover:bg-black text-white/50 rounded-xl text-sm font-medium transition-colors border border-white/10 ml-auto flex items-center gap-2"
                    >
                      <RefreshCw size={14} /> Hard Reset
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}