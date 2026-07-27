import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, Mountain, CloudSnow, Wind, Droplet, 
  Signal, WifiOff, PhoneCall, Activity, AlertTriangle, 
  CheckCircle2, Circle, HeartPulse, Map, Navigation, 
  BatteryWarning, Flame
} from 'lucide-react';
import BiometricStream from './BiometricStream';
// --- MOCK TELEMETRY DATA ---
const TELEMETRY = {
  location: "Dingboche, Khumbu",
  altitude: 4410,
  maxAltitude: 5364, // EBC
  o2Level: 59, // % of sea level oxygen
  temp: -4,
  wind: 28,
  riskScore: 68, // Out of 100
  difficulty: "Strenuous",
  cellSignal: "Weak (2G/Edge)",
  nearestWater: "1.2 km ahead (Teahouse)",
  nearestMed: "Pheriche HRA Clinic (4.5 km descent)"
};

const INITIAL_CHECKLIST = [
  { id: 1, text: "Acclimatization day completed", done: true },
  { id: 2, text: "Water purified (3 Liters)", done: false },
  { id: 3, text: "Diamox (Acetazolamide) packed", done: true },
  { id: 4, text: "Headlamp batteries checked", done: false },
  { id: 5, text: "Offline maps downloaded", done: true },
];

const ALERTS = [
  { id: 1, type: "danger", text: "Landslide debris cleared near Phakding, proceed with caution." },
  { id: 2, type: "warning", text: "High winds (45km/h) expected above 5,000m after 2 PM." },
];

export default function TrekSafeDashboard() {
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);
  const [offlineMode, setOfflineMode] = useState(true);
  const [sosActive, setSosActive] = useState(false);

  const toggleChecklist = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-accent-temple-gold mb-2 font-mono text-sm uppercase tracking-widest">
            <Activity size={16} /> Live Telemetry Active
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-display font-bold text-white">
            TrekSafe <span className="text-white/50">Command</span>
          </motion.h1>
        </div>
        
        {/* Offline Toggle */}
        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          onClick={() => setOfflineMode(!offlineMode)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all ${
            offlineMode ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
          }`}
        >
          {offlineMode ? <Map size={16} /> : <WifiOff size={16} />}
          <span className="font-bold text-sm">{offlineMode ? 'Offline Maps Ready' : 'Enable Offline Mode'}</span>
        </motion.button>
      </div>

      {/* BENTO BOX GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {/* 1. Risk Score & Difficulty (Spans 2 columns on large) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 glass-panel bg-black/40 border border-white/10 p-6 rounded-3xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 text-accent-temple-gold/10"><ShieldAlert size={200} /></div>
          <h3 className="text-white/50 text-sm font-bold uppercase tracking-wider mb-6">Current Assessment</h3>
          <div className="flex items-center gap-8">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" className="stroke-white/10" strokeWidth="12" fill="none" />
                <circle cx="64" cy="64" r="56" className="stroke-orange-500" strokeWidth="12" fill="none" strokeDasharray="351.8" strokeDashoffset={351.8 - (351.8 * TELEMETRY.riskScore) / 100} strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-display font-bold text-orange-400">{TELEMETRY.riskScore}</span>
                <span className="text-[10px] text-white/50 uppercase">Risk Index</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1">{TELEMETRY.location}</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs font-bold uppercase">Moderate Risk</span>
                <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-bold uppercase">{TELEMETRY.difficulty}</span>
              </div>
              <p className="text-sm text-white/60 text-balance">Altitude and dropping temperatures are the primary risk factors for the next 4 hours.</p>
            </div>
          </div>
        </motion.div>

        {/* 2. Altitude Profile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel bg-black/40 border border-white/10 p-6 rounded-3xl flex flex-col justify-between">
          <h3 className="text-white/50 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><Mountain size={16}/> Altitude Profile</h3>
          <div className="my-auto">
            <div className="flex items-end gap-2 mb-1">
              <span className="text-4xl font-display font-bold text-white">{TELEMETRY.altitude}</span>
              <span className="text-white/50 mb-1">m</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(TELEMETRY.altitude / TELEMETRY.maxAltitude) * 100}%` }} />
            </div>
            <div className="flex justify-between text-xs text-white/40 mt-2">
              <span>Start</span>
              <span>Max: {TELEMETRY.maxAltitude}m</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-sm">
            <span className="text-white/60">Available O₂</span>
            <span className="font-bold text-red-400">{TELEMETRY.o2Level}% of Sea Level</span>
          </div>
        </motion.div>

        {/* 3. Weather & Signal */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel bg-black/40 border border-white/10 p-6 rounded-3xl flex flex-col gap-4">
          <div className="flex-1 bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
            <div>
              <p className="text-white/50 text-xs font-bold uppercase mb-1">Temp / Wind</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-blue-300">{TELEMETRY.temp}°C</span>
                <span className="text-white/20">|</span>
                <span className="text-lg text-white/80">{TELEMETRY.wind} km/h</span>
              </div>
            </div>
            <CloudSnow size={32} className="text-blue-300/50" />
          </div>
          <div className="flex-1 bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
            <div>
              <p className="text-white/50 text-xs font-bold uppercase mb-1">Cell Signal</p>
              <p className="text-sm font-bold text-yellow-400">{TELEMETRY.cellSignal}</p>
            </div>
            <Signal size={24} className="text-yellow-400/50" />
          </div>
        </motion.div>

        {/* 4. Live Alerts (Spans 2 columns) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="md:col-span-2 glass-panel bg-black/40 border border-white/10 p-6 rounded-3xl">
          <h3 className="text-white/50 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2"><AlertTriangle size={16}/> Trail Intelligence</h3>
          <div className="space-y-3">
            {ALERTS.map(alert => (
              <div key={alert.id} className={`p-4 rounded-xl border flex gap-4 items-start ${
                alert.type === 'danger' ? 'bg-red-500/10 border-red-500/20 text-red-200' : 'bg-orange-500/10 border-orange-500/20 text-orange-200'
              }`}>
                <AlertTriangle size={20} className={`shrink-0 mt-0.5 ${alert.type === 'danger' ? 'text-red-400' : 'text-orange-400'}`} />
                <p className="text-sm leading-relaxed">{alert.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 5. Safety Checklist */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-panel bg-black/40 border border-white/10 p-6 rounded-3xl">
          <h3 className="text-white/50 text-sm font-bold uppercase tracking-wider mb-4">Safety Checklist</h3>
          <div className="space-y-3 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
            {checklist.map(item => (
              <button 
                key={item.id} 
                onClick={() => toggleChecklist(item.id)}
                className="w-full flex items-start gap-3 text-left group"
              >
                <div className="mt-0.5">
                  {item.done ? <CheckCircle2 size={18} className="text-green-400" /> : <Circle size={18} className="text-white/30 group-hover:text-white/50" />}
                </div>
                <span className={`text-sm transition-colors ${item.done ? 'text-white/40 line-through' : 'text-white/90'}`}>
                  {item.text}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* 6. Resources & Emergency SOS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-panel bg-black/40 border border-white/10 p-6 rounded-3xl flex flex-col">
          <h3 className="text-white/50 text-sm font-bold uppercase tracking-wider mb-4">Logistics & Rescue</h3>
          
          <div className="space-y-3 mb-6 flex-1">
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Droplet size={16} /></div>
              <div>
                <p className="text-white/40 text-xs">Water Refill</p>
                <p className="text-white">{TELEMETRY.nearestWater}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 bg-red-500/20 text-red-400 rounded-lg"><HeartPulse size={16} /></div>
              <div>
                <p className="text-white/40 text-xs">Medical Facility</p>
                <p className="text-white">{TELEMETRY.nearestMed}</p>
              </div>
            </div>
          </div>

          {/* SOS BUTTON */}
          <button 
            onClick={() => setSosActive(!sosActive)}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
              sosActive 
                ? 'bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.5)] animate-pulse' 
                : 'bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20'
            }`}
          >
            <PhoneCall size={18} />
            {sosActive ? 'SENDING GPS TO RESCUE...' : 'EMERGENCY SOS'}
          </button>
        </motion.div>

      </div>
      <div className="mt-12 pt-12 border-t border-white/10">
        <h2 className="text-2xl font-display font-bold mb-6 text-white/90">Live Biometrics</h2>
        
        <BiometricStream />
        
      </div>
    </div>
  );
}