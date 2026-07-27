import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bluetooth, BluetoothConnected, HeartPulse, Droplet, Activity, Zap, ShieldAlert, X } from 'lucide-react';

// --- VISUAL & ANIMATION CONFIG ---
const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
  exit: { opacity: 0 }
};

const itemVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

const pulseGlow = {
  scale: [1, 1.05, 1],
  opacity: [0.6, 1, 0.6],
  transition: { duration: 1, repeat: Infinity, ease: "easeInOut" }
};

// --- BIOMETRIC TYPES ---
interface Telemetry {
  bpm: number;
  bp_sys: number;
  bp_dia: number;
  spo2: number;
  connected: boolean;
  isFallback: boolean;
}

// Initial Simulated State for immediate visual impact
const FALLBACK_STATE: Telemetry = {
  bpm: 72,
  bp_sys: 118,
  bp_dia: 76,
  spo2: 97,
  connected: false,
  isFallback: true
};

export default function BiometricStream() {
  const [telemetry, setTelemetry] = useState<Telemetry>(FALLBACK_STATE);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use a ref to track the characteristic for cleanup/disconnect
  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);

  // Fallback Simulation Loop: Subtle fluctuations to look authentic
  useEffect(() => {
    if (!telemetry.connected && telemetry.isFallback) {
      const fallbackInterval = setInterval(() => {
        setTelemetry(prev => ({
          ...prev,
          bpm: prev.bpm + (Math.random() > 0.5 ? 1 : -1),
          bp_sys: prev.bp_sys + (Math.random() > 0.6 ? 1 : -1),
          bp_dia: prev.bp_dia + (Math.random() > 0.6 ? 1 : -1),
          spo2: Math.min(100, Math.max(90, prev.spo2 + (Math.random() > 0.8 ? 1 : -1))),
        }));
      }, 2500); // Update frequently for demo visibility

      return () => clearInterval(fallbackInterval);
    }
  }, [telemetry.connected, telemetry.isFallback]);

  // --- WEB BLUETOOTH CONNECTION LOGIC ---
  const connectSmartwatchBLE = async () => {
    setIsConnecting(true);
    setError(null);
    setTelemetry(prev => ({ ...prev, connected: false, isFallback: true })); // Reset state on attempt

    try {
      // 1. Request standard BLE Heart Rate Service
      // We filter by 'heart_rate' which generic watches and standard medical chest straps use.
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }],
        optionalServices: ['battery_service'] // Optional, just to show multiple interfaces
      });

      console.log(`> Device requested: ${device.name}`);

      // 2. Connect to the device's GATT Server
      const server = await device.gatt?.connect();
      
      // 3. Get the Primary Heart Rate Service
      const service = await server?.getPrimaryService('heart_rate');
      
      // 4. Get the Heart Rate Measurement Characteristic
      const characteristic = await service?.getCharacteristic('heart_rate_measurement');
      characteristicRef.current = characteristic || null;

      console.log('> Got Heart Rate characteristic');

      // 5. Start Notifications for real-time streaming
      await characteristic?.startNotifications();
      
      // 6. Handle Incoming Data (Biometric Parser)
      characteristic?.addEventListener('characteristicvaluechanged', (event: any) => {
        const value = event.target.value;
        const bpm = value.getUint8(1); // The second byte is bpm in the BLE spec

        console.log(`> Live BPM Received: ${bpm}`);

        setTelemetry(prev => ({
          ...prev,
          bpm,
          connected: true,
          isFallback: false, // PAIRING SUCCESS: STOP SIMULATION
          // Simulate BP and O2 because few BLE wristwear can stream these in real-time,
          // but we tie their fluctuation subtly to heart rate for realism.
          bp_sys: Math.round(bpm * 1.6), // *Highly simulated logic*
          bp_dia: Math.round(bpm * 1.05),
          spo2: Math.min(100, Math.max(88, 100 - (bpm / 10))), // Drops slightly if HR spikes too high
        }));
      });

      device.addEventListener('gattserverdisconnected', () => {
        console.log('> Bluetooth Device disconnected');
        setTelemetry(FALLBACK_STATE); // Trigger fallback automatically on disconnect
      });

    } catch (err: any) {
      console.error("Bluetooth connection aborted:", err);
      setError(err.name === 'NotFoundError' ? 'Pairing cancelled.' : 'Failed to connect. Check Bluetooth permissions.');
      setTelemetry(FALLBACK_STATE); // Keep fallback active on error
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectBLE = async () => {
    try {
      if (characteristicRef.current) {
        await characteristicRef.current.stopNotifications();
        // GATT Server disconnect is handled by the browser context
      }
      setTelemetry(FALLBACK_STATE);
    } catch (err) {
      console.log("Error during BLE cleanup:", err);
    }
  };

  // --- DYNAMIC UI COLORING ---
  const hrColor = telemetry.bpm > 140 ? 'red' : telemetry.bpm > 110 ? 'orange' : 'green';
  const spo2Color = telemetry.spo2 < 90 ? 'red' : telemetry.spo2 < 94 ? 'orange' : 'cyan';

  return (
    <div className="w-full text-white mt-8">
      
      {/* 1. Stunning Header & Status Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-accent-temple-gold mb-1 font-mono text-xs uppercase tracking-widest">
            <Activity size={14} /> Critical Biosensor Array
          </div>
          <h1 className="text-4xl font-display font-bold">Smart Telemetry Hub</h1>
          <AnimatePresence mode="wait">
            {error && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-red-400 text-xs mt-2 flex items-center gap-1.5 font-medium">
                <ShieldAlert size={14} /> {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Connection Button */}
        <AnimatePresence mode="wait">
          {!telemetry.connected ? (
            <motion.button 
              key="connect" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={connectSmartwatchBLE}
              disabled={isConnecting}
              className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all ${
                isConnecting 
                  ? 'bg-neutral-800 border-neutral-700 text-white/50 cursor-not-allowed' 
                  : 'bg-white/5 border-white/10 text-accent-temple-gold hover:bg-white/10 hover:border-accent-temple-gold/30 hover:scale-105'
              }`}
            >
              <Bluetooth size={18} className={isConnecting ? "animate-pulse" : ""} />
              <span className="font-bold text-sm">{isConnecting ? 'Searching...' : 'Pair Live Smartwatch'}</span>
            </motion.button>
          ) : (
            <motion.button 
              key="disconnect" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={disconnectBLE}
              className="flex items-center gap-2 px-6 py-3 rounded-full border bg-green-500/10 border-green-500/30 text-green-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-colors"
            >
              <BluetoothConnected size={18} />
              <span className="font-bold text-sm">Watch Connected</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Interactive Bento Grid Display */}
      <motion.div variants={containerVariants} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* --- Metric 1: Heart Rate (The Star of the Demo) --- */}
        <motion.div variants={itemVariants} className={`lg:col-span-2 glass-panel bg-black/40 border border-white/10 p-6 rounded-3xl relative overflow-hidden transition-all duration-700 ${telemetry.bpm > 140 ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : ''}`}>
          
          {/* Animated Glow Effect based on connection state */}
          {telemetry.connected && !telemetry.isFallback && (
             <motion.div initial={{ opacity: 0.1 }} animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute -inset-10 bg-gradient-to-tr from-accent-temple-gold/10 to-orange-500/10 rounded-3xl" />
          )}

          <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${telemetry.connected && !telemetry.isFallback ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`} title={telemetry.isFallback ? 'Mock Data Fallback active' : 'Live Bluetooth stream active'}></span>
            <span className="text-white/40 font-medium">{telemetry.connected && !telemetry.isFallback ? 'Live Stream' : 'Demo Fallback'}</span>
          </div>

          <h3 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-8 flex items-center gap-2"><Activity size={14}/> Physiological Pulse</h3>
          <div className="flex items-center gap-8 justify-between">
            <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" className="stroke-white/5" strokeWidth="15" fill="none" />
                <motion.circle cx="80" cy="80" r="70" className={`stroke-${hrColor}-500 transition-colors duration-1000`} strokeWidth="15" fill="none" strokeDasharray="439.8" strokeDashoffset={439.8 - (439.8 * Math.min(180, telemetry.bpm)) / 180} strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <motion.span animate={telemetry.connected && !telemetry.isFallback ? pulseGlow : {}} className={`text-6xl font-display font-bold text-white`}>{telemetry.bpm}</motion.span>
                <span className="text-xs text-white/40 uppercase font-medium">BPM</span>
              </div>
            </div>
            
            <div className="text-right flex flex-col gap-2">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                <motion.div animate={telemetry.connected && !telemetry.isFallback ? pulseGlow : {}} className={`text-${hrColor}-400 shrink-0`}><HeartPulse size={24} /></motion.div>
                <p className={`text-xl font-bold text-white transition-colors duration-500`}>{telemetry.bpm > 140 ? 'Critical' : telemetry.bpm > 110 ? 'High Stress' : 'Resting'}</p>
              </div>
               <p className="text-xs text-white/50 text-balance leading-relaxed">Continuous stream monitored for spikes above acclimatization velocity standard. Last sync: {telemetry.connected && !telemetry.isFallback ? 'Real-time' : telemetry.bpm + ' (cached)'}</p>
            </div>
          </div>
        </motion.div>

        {/* --- Metric 2: SpO2 Blood Oxygen --- */}
        <motion.div variants={itemVariants} className="glass-panel bg-black/40 border border-white/10 p-6 rounded-3xl flex flex-col justify-between">
          <h3 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><Droplet size={14}/> Oxygenation</h3>
          <div className="my-auto">
            <div className="flex items-end gap-2 mb-1">
              <span className={`text-4xl font-display font-bold text-cyan-300`}>{telemetry.spo2}</span>
              <span className="text-white/50 mb-1 text-sm font-medium">% SpO₂</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mt-4">
              <motion.div className={`h-full bg-cyan-400 rounded-full transition-all duration-1000`} style={{ width: `${telemetry.spo2}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-white/30 mt-2 font-mono">
              <span>90% Min</span>
              <span>100% Sea Lvl</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-sm">
            <span className="text-white/60">Risk Profile</span>
            <span className={`font-bold ${spo2Color === 'cyan' ? 'text-cyan-300' : 'text-' + spo2Color + '-400'}`}>{telemetry.spo2 < 94 ? 'Moderate HACE Risk' : 'Normal'}</span>
          </div>
        </motion.div>

        {/* --- Metric 3: Blood Pressure --- */}
        <motion.div variants={itemVariants} className="glass-panel bg-black/40 border border-white/10 p-6 rounded-3xl">
          <h3 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-6 flex items-center gap-2"><HeartPulse size={14}/> Blood Pressure</h3>
          <div className="flex flex-col gap-6">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex-1">
               <div className="flex justify-between items-center mb-1">
                 <p className="text-xs font-bold uppercase text-white/50 tracking-wider">Systolic</p>
                 <span className="text-3xl font-display font-bold text-white">{telemetry.bp_sys}</span>
               </div>
               <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                 <motion.div className="h-full bg-accent-temple-gold rounded-full transition-all duration-1000" style={{ width: `${(telemetry.bp_sys / 200) * 100}%` }} />
               </div>
            </div>
             <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex-1">
               <div className="flex justify-between items-center mb-1">
                 <p className="text-xs font-bold uppercase text-white/50 tracking-wider">Diastolic</p>
                 <span className="text-3xl font-display font-bold text-white">{telemetry.bp_dia}</span>
               </div>
               <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                 <motion.div className="h-full bg-orange-400 rounded-full transition-all duration-1000" style={{ width: `${(telemetry.bp_dia / 120) * 100}%` }} />
               </div>
            </div>
          </div>
           <p className="text-[10px] text-center text-white/40 mt-6 font-mono">Standard range: 120/80 mmHg (Sea Lvl)</p>
        </motion.div>

      </motion.div>

       {/* Optional Disconnect Prompt Overlay */}
       <AnimatePresence>
        {telemetry.connected && !telemetry.isFallback && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="fixed bottom-6 right-6 z-40 bg-neutral-900 border border-white/10 px-5 py-3.5 rounded-2xl flex items-center gap-4 shadow-2xl backdrop-blur-lg">
              <BluetoothConnected className="text-green-400" size={18} />
              <p className="text-sm text-white/90 font-medium">Watch: {characteristicRef.current?.service.device.name || 'Himal-Sync_01'}</p>
              <button onClick={disconnectBLE} className="text-white/40 hover:text-red-400 transition-colors p-1.5 rounded-lg bg-white/5"><X size={16} /></button>
          </motion.div>
        )}
       </AnimatePresence>
    </div>
  );
}