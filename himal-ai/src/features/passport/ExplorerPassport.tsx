import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, X, MapPin, Zap, Shield, Sparkles, RefreshCw, Trophy, Mountain, Activity, Medal, Star, Search } from 'lucide-react';
import { usePassport } from '../../hooks/usePassport';

// --- TYPES ---
interface TrekkerProfile {
  id: string;
  rank: number;
  name: string;
  location: string;
  points: number;
  level: string;
  avatarUrl: string;
  recentTrek: string;
  bio: string;
  badges: string[];
}

// --- MOCK DATA (10 Profiles) ---
const MOCK_TREKKERS: TrekkerProfile[] = [
  { id: 'usr_01', rank: 1, name: 'Nima Sherpa', location: 'Chitwan National Park Edge', points: 12450, level: 'Everest Vanguard', avatarUrl: 'https://i.pravatar.cc/150?u=nima', recentTrek: 'Annapurna Circuit (Winter)', bio: 'Born in the Khumbu, currently exploring the lower hills. Speed record holder for the local Devghat ridge trail.', badges: ['High Altitude Specialist', 'Winter Survivor', '1000km Club'] },
  { id: 'usr_02', rank: 2, name: 'Sarah Jenkins', location: 'Bharatpur Heights', points: 11200, level: 'Alpine Master', avatarUrl: 'https://i.pravatar.cc/150?u=sarah', recentTrek: 'Mardi Himal Base Camp', bio: 'Mapping every hidden trail in Bagmati Province. Always pack extra Diamox and dark chocolate.', badges: ['Trail Mapper', 'Solo Trekker'] },
  { id: 'usr_03', rank: 3, name: 'Rajesh Gurung', location: 'Sauraha', points: 10800, level: 'Ridge Runner', avatarUrl: 'https://i.pravatar.cc/150?u=rajesh', recentTrek: 'Poon Hill Sunrise', bio: 'Weekend warrior. I run a local cafe by day and hit the trails by night.', badges: ['Night Hiker', 'Local Legend'] },
  { id: 'usr_04', rank: 4, name: 'Akarshan', location: 'Bharatpur, Nepal', points: 9450, level: 'Trail Architect', avatarUrl: 'https://i.pravatar.cc/150?u=akarshan', recentTrek: 'Langtang Valley', bio: 'Balancing full-stack dev projects, machine learning algorithms, and weekend hikes. Building apps and bagging peaks.', badges: ['Tech Pioneer', 'Endurance Scholar'] },
  { id: 'usr_05', rank: 5, name: 'Elena Rostova', location: 'Narayangarh', points: 8900, level: 'Valley Explorer', avatarUrl: 'https://i.pravatar.cc/150?u=elena', recentTrek: 'Gokyo Ri', bio: 'Photography and high altitudes. Seeking the perfect alpine sunrise.', badges: ['Shutterbug', 'Glacier Crosser'] },
  { id: 'usr_06', rank: 6, name: 'David Chen', location: 'Bharatpur, Nepal', points: 8100, level: 'Steep Ascender', avatarUrl: 'https://i.pravatar.cc/150?u=david', recentTrek: 'Khopra Danda', bio: 'If it\'s not steep, I\'m not interested. Training for the Manaslu circuit next season.', badges: ['Vertical Climber'] },
  { id: 'usr_07', rank: 7, name: 'Maya Thapa', location: 'Devghat', points: 7650, level: 'Pathfinder', avatarUrl: 'https://i.pravatar.cc/150?u=maya', recentTrek: 'Shivapuri Peak', bio: 'Connecting with nature through ancient trade routes. Slow and steady wins the trek.', badges: ['Heritage Hiker', 'Leave No Trace'] },
  { id: 'usr_08', rank: 8, name: 'John Doe', location: 'Bharatpur, Nepal', points: 7200, level: 'Wanderer', avatarUrl: 'https://i.pravatar.cc/150?u=john', recentTrek: 'Kathmandu Valley Rim', bio: 'Just here to close my activity rings and enjoy the local momos at the teahouses.', badges: ['Teahouse Critic'] },
  { id: 'usr_09', rank: 9, name: 'Anita Shrestha', location: 'Tandi', points: 6800, level: 'Wanderer', avatarUrl: 'https://i.pravatar.cc/150?u=anita', recentTrek: 'Sikles Village Trek', bio: 'Exploring my backyard one weekend at a time.', badges: ['Weekend Warrior'] },
  { id: 'usr_10', rank: 10, name: 'Alex Rivera', location: 'Bharatpur, Nepal', points: 6100, level: 'Novice Hiker', avatarUrl: 'https://i.pravatar.cc/150?u=alex', recentTrek: 'Chandragiri Hills', bio: 'Just bought my first pair of trekking boots. Let\'s see where this goes.', badges: ['First Blood'] }
];

export default function ExplorerPassport({ onClose }: { onClose: () => void }) {
  const { passport, currentRank, progressToNext, addXp, unlockRandomStamp, resetPassport } = usePassport();
  const [activeTab, setActiveTab] = useState<'stamps' | 'stats' | 'leaderboard'>('stamps');
  const [selectedTrekker, setSelectedTrekker] = useState<TrekkerProfile | null>(null);
  
  // --- SEARCH STATE ---
  const [searchQuery, setSearchQuery] = useState('');

  // Clear search when switching tabs
  useEffect(() => {
    setSearchQuery('');
  }, [activeTab]);

  // --- FILTERING LOGIC ---
  const filteredStamps = passport.stamps.filter((stamp: any) => 
    stamp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    stamp.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTrekkers = MOCK_TREKKERS.filter((trekker) => 
    trekker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trekker.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to style the top 3 ranks
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/50', icon: <Trophy size={18} /> };
      case 2: return { color: 'text-gray-300', bg: 'bg-gray-300/10', border: 'border-gray-300/50', icon: <Medal size={18} /> };
      case 3: return { color: 'text-amber-600', bg: 'bg-amber-600/10', border: 'border-amber-600/50', icon: <Medal size={18} /> };
      default: return { color: 'text-white/40', bg: 'bg-white/5', border: 'border-white/10', icon: <span className="font-bold text-sm">{rank}</span> };
    }
  };

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
          <div className="flex gap-6 overflow-x-auto custom-scrollbar pb-1">
            <button 
              onClick={() => setActiveTab('stamps')}
              className={`font-display font-bold text-lg transition-colors relative whitespace-nowrap ${activeTab === 'stamps' ? 'text-accent-temple-gold' : 'text-white/50 hover:text-white'}`}
            >
              Visas & Stamps
              {activeTab === 'stamps' && <motion.div layoutId="activeTab" className="absolute -bottom-5 left-0 right-0 h-0.5 bg-accent-temple-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]" />}
            </button>
            
            <button 
              onClick={() => setActiveTab('stats')}
              className={`font-display font-bold text-lg transition-colors relative whitespace-nowrap ${activeTab === 'stats' ? 'text-accent-temple-gold' : 'text-white/50 hover:text-white'}`}
            >
              Explorer Stats
              {activeTab === 'stats' && <motion.div layoutId="activeTab" className="absolute -bottom-5 left-0 right-0 h-0.5 bg-accent-temple-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]" />}
            </button>
            
            {/* EXPLICIT LEADERBOARD TAB */}
            <button 
              onClick={() => setActiveTab('leaderboard')}
              className={`font-display font-bold text-lg transition-colors relative whitespace-nowrap flex items-center gap-2 ${activeTab === 'leaderboard' ? 'text-accent-temple-gold' : 'text-white/50 hover:text-white'}`}
            >
              <Trophy size={16} /> Leaderboard
              {activeTab === 'leaderboard' && <motion.div layoutId="activeTab" className="absolute -bottom-5 left-0 right-0 h-0.5 bg-accent-temple-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]" />}
            </button>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Dynamic Search Bar */}
            {activeTab !== 'stats' && (
              <div className="relative group hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-accent-temple-gold transition-colors" size={16} />
                <input 
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent-temple-gold/50 focus:bg-white/5 transition-all w-48 focus:w-64"
                />
              </div>
            )}
            <button onClick={onClose} className="text-white/50 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10 hover:rotate-90 duration-300">
              <X size={20} />
            </button>
          </div>
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
                </div>
              </div>
            </div>

            {/* Level Up Progress Bar */}
            <div className="w-full md:w-64 glass-panel bg-black/50 p-4 rounded-2xl border border-white/15">
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
            </div>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="px-8 pb-8 flex-1 overflow-y-auto custom-scrollbar relative">
          <AnimatePresence mode="wait">
            
            {/* STAMPS TAB */}
            {activeTab === 'stamps' && (
              <motion.div 
                key="stamps"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {filteredStamps.length === 0 ? (
                  <div className="text-center py-12 text-white/40">No stamps found matching "{searchQuery}"</div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {filteredStamps.map((stamp: any, idx: number) => (
                      <motion.div 
                        key={stamp.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`relative p-5 rounded-3xl border flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-500 ${
                          stamp.unlocked 
                            ? 'bg-gradient-to-b from-white/10 to-black/40 border-accent-temple-gold/40 hover:border-accent-temple-gold shadow-lg shadow-accent-temple-gold/5 group' 
                            : 'bg-black/40 border-white/5 opacity-50 grayscale'
                        }`}
                      >
                        {stamp.unlocked && <div className="absolute inset-0 bg-accent-temple-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
                        <div className={`text-5xl mb-3 transition-transform duration-500 ${stamp.unlocked ? 'group-hover:scale-110 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]' : ''}`}>
                          {stamp.icon}
                        </div>
                        <h4 className="font-bold text-sm leading-tight text-white/90">{stamp.name}</h4>
                        <p className="text-xs text-white/50 mt-1">{stamp.region}</p>
                        
                        <div className={`mt-4 text-[10px] uppercase font-mono px-3 py-1 rounded-full border ${
                          stamp.unlocked ? 'bg-black/50 border-accent-temple-gold/30 text-accent-temple-gold' : 'bg-white/5 border-white/10 text-white/40'
                        }`}>
                          {stamp.unlocked ? stamp.date : 'Undiscovered'}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* STATS TAB */}
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
                      <p className="text-xl font-bold text-white">12 Read</p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl"><Sparkles size={24} /></div>
                    <div>
                      <p className="text-sm text-white/50">AI Lens Scans</p>
                      <p className="text-xl font-bold text-white">8 Landmarks</p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 text-green-400 rounded-xl"><Zap size={24} /></div>
                    <div>
                      <p className="text-sm text-white/50">Journeys Built</p>
                      <p className="text-xl font-bold text-white">3 Planned</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* LEADERBOARD TAB */}
            {activeTab === 'leaderboard' && (
              <motion.div 
                key="leaderboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {filteredTrekkers.length === 0 ? (
                   <div className="text-center py-12 text-white/40">No trailblazers found matching "{searchQuery}"</div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filteredTrekkers.map((trekker, index) => {
                      const rankStyle = getRankStyle(trekker.rank);
                      
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.04 }}
                          key={trekker.id}
                          onClick={() => setSelectedTrekker(trekker)}
                          className={`group relative flex items-center justify-between p-4 rounded-2xl border backdrop-blur-sm cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${rankStyle.bg} ${rankStyle.border}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${rankStyle.color} bg-black/40 border border-white/5 shrink-0`}>
                              {rankStyle.icon}
                            </div>
                            <div className="flex items-center gap-3">
                              <img src={trekker.avatarUrl} alt={trekker.name} className={`w-11 h-11 rounded-full object-cover border-2 ${rankStyle.border}`} />
                              <div>
                                <h4 className="font-bold text-white text-base group-hover:text-accent-temple-gold transition-colors">{trekker.name}</h4>
                                <p className="text-xs text-white/50 flex items-center gap-1">
                                  <Mountain size={12} /> {trekker.level}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-4">
                            <div className="hidden sm:block text-right">
                              <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Recent</p>
                              <p className="text-xs text-white/80 truncate max-w-[130px]">{trekker.recentTrek}</p>
                            </div>
                            <div>
                              <span className={`text-xl font-black ${rankStyle.color}`}>{trekker.points.toLocaleString()}</span>
                              <span className="text-[10px] text-white/40 ml-1">pts</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Profile Inspector Modal - MOVED OUTSIDE of the main motion.div */}
      <AnimatePresence>
        {selectedTrekker && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTrekker(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[70] p-4"
            >
              <div className="bg-[#0a0a0a] border border-white/15 rounded-3xl overflow-hidden shadow-2xl">
                <div className="h-28 bg-gradient-to-br from-neutral-800 to-neutral-900 relative">
                  <div className="absolute inset-0 bg-mesh-aurora opacity-30" />
                  <button 
                    onClick={() => setSelectedTrekker(null)}
                    className="absolute top-4 right-4 p-2 bg-black/40 text-white/70 hover:text-white rounded-full backdrop-blur-md transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="px-6 pb-6 relative">
                  <div className="absolute -top-10 left-6 p-1 bg-[#0a0a0a] rounded-full border border-white/10">
                    <img 
                      src={selectedTrekker.avatarUrl} 
                      alt={selectedTrekker.name} 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  </div>

                  <div className="absolute top-4 right-6 bg-white/5 border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold text-white">
                    <Star size={12} className="text-accent-temple-gold" /> Rank #{selectedTrekker.rank}
                  </div>

                  <div className="mt-14">
                    <h3 className="text-2xl font-display font-bold text-white">{selectedTrekker.name}</h3>
                    <p className="text-accent-temple-gold flex items-center gap-1.5 mt-0.5 text-sm font-medium">
                      <MapPin size={14} /> {selectedTrekker.location}
                    </p>

                    <div className="my-4 p-3.5 bg-white/[0.03] rounded-2xl border border-white/5 leading-relaxed text-white/70 text-xs">
                      "{selectedTrekker.bio}"
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <p className="text-[10px] text-white/40 uppercase mb-0.5">Total Score</p>
                        <p className="text-xl font-black text-white">{selectedTrekker.points.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <p className="text-[10px] text-white/40 uppercase mb-0.5">Current Status</p>
                        <p className="text-sm font-bold text-white truncate">{selectedTrekker.level}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2.5 flex items-center gap-1.5">
                        <Award size={12} /> Earned Stamps
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedTrekker.badges.map((badge, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-accent-temple-gold/10 border border-accent-temple-gold/20 text-accent-temple-gold text-[11px] font-bold rounded-full">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}