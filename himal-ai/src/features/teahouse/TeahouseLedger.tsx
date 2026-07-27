import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Flame, Wifi, BatteryCharging, ShieldCheck, MapPin, Star, ChevronRight } from 'lucide-react';

interface Teahouse {
  id: string;
  name: string;
  hostFamily: string;
  elevation: string;
  village: string;
  rating: number;
  reviews: number;
  amenities: {
    bukhari: boolean; // Traditional wood stove
    solarShower: boolean;
    satWifi: boolean;
    organicFood: boolean;
  };
  specialty: string;
  status: 'Open' | 'Full' | 'Closed for Winter';
}

const TEAHOUSES: Teahouse[] = [
  {
    id: '1',
    name: 'Annapurna Guest House',
    hostFamily: 'The Gurung Family',
    elevation: '3,210m',
    village: 'Ghorepani',
    rating: 4.8,
    reviews: 124,
    amenities: { bukhari: true, solarShower: true, satWifi: false, organicFood: true },
    specialty: 'Wood-fired Dhindo & Local Chicken',
    status: 'Open'
  },
  {
    id: '2',
    name: 'Snow Lion Lodge',
    hostFamily: 'The Sherpa Family',
    elevation: '3,860m',
    village: 'Tengboche',
    rating: 4.9,
    reviews: 210,
    amenities: { bukhari: true, solarShower: false, satWifi: true, organicFood: false },
    specialty: 'Yak Cheese Sandwiches & Butter Tea',
    status: 'Full'
  },
  {
    id: '3',
    name: 'Hidden Valley Inn',
    hostFamily: 'The Tamang Family',
    elevation: '2,800m',
    village: 'Langtang Village',
    rating: 4.7,
    reviews: 89,
    amenities: { bukhari: false, solarShower: true, satWifi: true, organicFood: true },
    specialty: 'Sea-buckthorn Juice & Fresh Dal Bhat',
    status: 'Open'
  }
];

export default function TeahouseLedger() {
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-28 pb-16 px-6 max-w-5xl mx-auto text-white">
      
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold mb-2">Heritage Teahouses</h1>
        <p className="text-white/60">Support local families, find a warm bukhari (fire), and secure your bed for the night.</p>
      </div>

      {/* Teahouse Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {TEAHOUSES.map((lodge, idx) => (
          <motion.div 
            key={lodge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setSelectedHouse(selectedHouse === lodge.id ? null : lodge.id)}
            className="glass-panel bg-black/40 border border-white/10 p-6 rounded-3xl hover:border-accent-temple-gold/50 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-accent-temple-gold transition-colors">{lodge.name}</h3>
                <p className="text-sm text-white/50 flex items-center gap-1 mt-1">
                  <MapPin size={14} className="text-accent-temple-gold" /> {lodge.village} • {lodge.elevation}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  lodge.status === 'Open' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  lodge.status === 'Full' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {lodge.status}
                </span>
                <div className="flex items-center gap-1 mt-2 text-sm font-bold text-accent-temple-gold">
                  <Star size={14} fill="currentColor" /> {lodge.rating} <span className="text-white/40 text-xs font-normal">({lodge.reviews})</span>
                </div>
              </div>
            </div>

            <div className="py-4 border-y border-white/10 mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-white/80">Hosted by {lodge.hostFamily}</span>
              <ShieldCheck size={16} className="text-green-400" />
            </div>

            {/* Amenities Icons */}
            <div className="flex gap-4 mb-4 text-white/60">
              {lodge.amenities.bukhari && <div className="flex items-center gap-1.5 text-xs" title="Warm Bukhari (Wood Stove)"><Flame size={16} className="text-orange-400" /> Stove</div>}
              {lodge.amenities.solarShower && <div className="flex items-center gap-1.5 text-xs" title="Solar Hot Shower"><BatteryCharging size={16} className="text-accent-temple-gold" /> Shower</div>}
              {lodge.amenities.organicFood && <div className="flex items-center gap-1.5 text-xs" title="Organic Farm-to-Table"><Coffee size={16} className="text-green-400" /> Organic</div>}
              {lodge.amenities.satWifi && <div className="flex items-center gap-1.5 text-xs" title="Everest Link / Satellite WiFi"><Wifi size={16} className="text-blue-400" /> Wi-Fi</div>}
            </div>

            {/* Expandable Details */}
            <AnimatePresence>
              {selectedHouse === lodge.id && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white/5 rounded-2xl p-4 mt-2">
                    <p className="text-xs text-white/60 mb-1 uppercase tracking-wider font-bold">House Specialty</p>
                    <p className="text-sm font-medium text-white mb-4">{lodge.specialty}</p>
                    
                    <button className="w-full bg-accent-temple-gold text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors">
                      Reserve via Offline Sync <ChevronRight size={16} />
                    </button>
                    <p className="text-[10px] text-center text-white/40 mt-2">
                      Request will sync when connected to lodge Wi-Fi or cellular mesh.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        ))}
      </div>
    </div>
  );
}