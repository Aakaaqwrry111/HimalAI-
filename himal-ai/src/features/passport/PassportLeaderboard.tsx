import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, MapPin, Mountain, Footprints, X, Activity, Medal, Award, Star } from 'lucide-react';

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
  {
    id: 'usr_01', rank: 1, name: 'Nima Sherpa', location: 'Chitwan National Park Edge', points: 12450, level: 'Everest Vanguard',
    avatarUrl: 'https://i.pravatar.cc/150?u=nima', recentTrek: 'Annapurna Circuit (Winter)',
    bio: 'Born in the Khumbu, currently exploring the lower hills. Speed record holder for the local Devghat ridge trail.',
    badges: ['High Altitude Specialist', 'Winter Survivor', '1000km Club']
  },
  {
    id: 'usr_02', rank: 2, name: 'Sarah Jenkins', location: 'Bharatpur Heights', points: 11200, level: 'Alpine Master',
    avatarUrl: 'https://i.pravatar.cc/150?u=sarah', recentTrek: 'Mardi Himal Base Camp',
    bio: 'Mapping every hidden trail in Bagmati Province. Always pack extra Diamox and dark chocolate.',
    badges: ['Trail Mapper', 'Solo Trekker']
  },
  {
    id: 'usr_03', rank: 3, name: 'Rajesh Gurung', location: 'Sauraha', points: 10800, level: 'Ridge Runner',
    avatarUrl: 'https://i.pravatar.cc/150?u=rajesh', recentTrek: 'Poon Hill Sunrise',
    bio: 'Weekend warrior. I run a local cafe by day and hit the trails by night.',
    badges: ['Night Hiker', 'Local Legend']
  },
  {
    id: 'usr_04', rank: 4, name: 'Akarshan', location: 'Bharatpur, Nepal', points: 9450, level: 'Trail Architect',
    avatarUrl: 'https://i.pravatar.cc/150?u=akarshan', recentTrek: 'Langtang Valley',
    bio: 'Balancing full-stack dev projects, machine learning algorithms, and weekend hikes. Building apps and bagging peaks.',
    badges: ['Tech Pioneer', 'Endurance Scholar']
  },
  {
    id: 'usr_05', rank: 5, name: 'Elena Rostova', location: 'Narayangarh', points: 8900, level: 'Valley Explorer',
    avatarUrl: 'https://i.pravatar.cc/150?u=elena', recentTrek: 'Gokyo Ri',
    bio: 'Photography and high altitudes. Seeking the perfect alpine sunrise.',
    badges: ['Shutterbug', 'Glacier Crosser']
  },
  {
    id: 'usr_06', rank: 6, name: 'David Chen', location: 'Bharatpur, Nepal', points: 8100, level: 'Steep Ascender',
    avatarUrl: 'https://i.pravatar.cc/150?u=david', recentTrek: 'Khopra Danda',
    bio: 'If it\'s not steep, I\'m not interested. Training for the Manaslu circuit next season.',
    badges: ['Vertical Climber']
  },
  {
    id: 'usr_07', rank: 7, name: 'Maya Thapa', location: 'Devghat', points: 7650, level: 'Pathfinder',
    avatarUrl: 'https://i.pravatar.cc/150?u=maya', recentTrek: 'Shivapuri Peak',
    bio: 'Connecting with nature through ancient trade routes. Slow and steady wins the trek.',
    badges: ['Heritage Hiker', 'Leave No Trace']
  },
  {
    id: 'usr_08', rank: 8, name: 'John Doe', location: 'Bharatpur, Nepal', points: 7200, level: 'Wanderer',
    avatarUrl: 'https://i.pravatar.cc/150?u=john', recentTrek: 'Kathmandu Valley Rim',
    bio: 'Just here to close my activity rings and enjoy the local momos at the teahouses.',
    badges: ['Teahouse Critic']
  },
  {
    id: 'usr_09', rank: 9, name: 'Anita Shrestha', location: 'Tandi', points: 6800, level: 'Wanderer',
    avatarUrl: 'https://i.pravatar.cc/150?u=anita', recentTrek: 'Sikles Village Trek',
    bio: 'Exploring my backyard one weekend at a time.',
    badges: ['Weekend Warrior']
  },
  {
    id: 'usr_10', rank: 10, name: 'Alex Rivera', location: 'Bharatpur, Nepal', points: 6100, level: 'Novice Hiker',
    avatarUrl: 'https://i.pravatar.cc/150?u=alex', recentTrek: 'Chandragiri Hills',
    bio: 'Just bought my first pair of trekking boots. Let\'s see where this goes.',
    badges: ['First Blood']
  }
];

export default function PassportLeaderboard() {
  const [selectedTrekker, setSelectedTrekker] = useState<TrekkerProfile | null>(null);

  // Helper to style the top 3 ranks differently
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/50', icon: <Trophy size={20} /> };
      case 2: return { color: 'text-gray-300', bg: 'bg-gray-300/10', border: 'border-gray-300/50', icon: <Medal size={20} /> };
      case 3: return { color: 'text-amber-600', bg: 'bg-amber-600/10', border: 'border-amber-600/50', icon: <Medal size={20} /> };
      default: return { color: 'text-white/40', bg: 'bg-white/5', border: 'border-white/10', icon: <span className="font-bold text-lg">{rank}</span> };
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 relative">
      
      {/* Header */}
      <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white flex items-center justify-center md:justify-start gap-3">
            <Activity className="text-accent-temple-gold" />
            Local Trailblazers
          </h2>
          <p className="text-white/60 mt-2 flex items-center justify-center md:justify-start gap-2">
            <MapPin size={16} /> Top trekkers within 50km of Bharatpur
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-medium text-white/80">
          Your Rank: <span className="text-accent-temple-gold font-bold ml-1">4th</span>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="flex flex-col gap-3">
        {MOCK_TREKKERS.map((trekker, index) => {
          const rankStyle = getRankStyle(trekker.rank);
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={trekker.id}
              onClick={() => setSelectedTrekker(trekker)}
              className={`group relative flex items-center justify-between p-4 rounded-2xl border backdrop-blur-sm cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${rankStyle.bg} ${rankStyle.border} ${trekker.rank <= 3 ? 'shadow-lg' : ''}`}
            >
              <div className="flex items-center gap-4 md:gap-6">
                {/* Rank Badge */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${rankStyle.color} bg-black/40 border border-white/5 shrink-0`}>
                  {rankStyle.icon}
                </div>

                {/* Avatar & Info */}
                <div className="flex items-center gap-4">
                  <img 
                    src={trekker.avatarUrl} 
                    alt={trekker.name} 
                    className={`w-12 h-12 rounded-full object-cover border-2 ${rankStyle.border}`}
                  />
                  <div>
                    <h3 className="font-bold text-white text-lg group-hover:text-accent-temple-gold transition-colors">{trekker.name}</h3>
                    <p className="text-xs text-white/50 flex items-center gap-1">
                      <Mountain size={12} /> {trekker.level}
                    </p>
                  </div>
                </div>
              </div>

              {/* Score (Hidden on tiny screens, flex on standard) */}
              <div className="text-right flex items-center gap-6">
                <div className="hidden md:block text-right mr-4">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Recent</p>
                  <p className="text-sm text-white/80 truncate max-w-[150px]">{trekker.recentTrek}</p>
                </div>
                <div>
                  <span className={`text-2xl font-black ${rankStyle.color}`}>{trekker.points.toLocaleString()}</span>
                  <span className="text-xs text-white/40 ml-1">pts</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Profile Inspector Modal */}
      <AnimatePresence>
        {selectedTrekker && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTrekker(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-4"
            >
              <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                {/* Cover Image Area */}
                <div className="h-32 bg-gradient-to-br from-neutral-800 to-neutral-900 relative">
                  <div className="absolute inset-0 bg-mesh-aurora opacity-30" />
                  <button 
                    onClick={() => setSelectedTrekker(null)}
                    className="absolute top-4 right-4 p-2 bg-black/40 text-white/70 hover:text-white rounded-full backdrop-blur-md transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Profile Details */}
                <div className="px-8 pb-8 relative">
                  {/* Floating Avatar */}
                  <div className="absolute -top-12 left-8 p-1 bg-[#0a0a0a] rounded-full border border-white/10">
                    <img 
                      src={selectedTrekker.avatarUrl} 
                      alt={selectedTrekker.name} 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>

                  {/* Rank Tag inside Modal */}
                  <div className="absolute top-4 right-8 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-bold text-white">
                    <Star size={14} className="text-accent-temple-gold" /> Rank #{selectedTrekker.rank}
                  </div>

                  <div className="mt-16">
                    <h2 className="text-3xl font-display font-bold text-white">{selectedTrekker.name}</h2>
                    <p className="text-accent-temple-gold flex items-center gap-2 mt-1 font-medium">
                      <MapPin size={16} /> {selectedTrekker.location}
                    </p>

                    <div className="my-6 p-4 bg-white/[0.03] rounded-2xl border border-white/5 leading-relaxed text-white/70 text-sm">
                      "{selectedTrekker.bio}"
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-xs text-white/40 uppercase mb-1">Total Score</p>
                        <p className="text-2xl font-black text-white">{selectedTrekker.points.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-xs text-white/40 uppercase mb-1">Current Status</p>
                        <p className="text-lg font-bold text-white truncate">{selectedTrekker.level}</p>
                      </div>
                    </div>

                    {/* Passport Badges */}
                    <div>
                      <h4 className="text-xs text-white/40 uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                        <Award size={14} /> Earned Stamps
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTrekker.badges.map((badge, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-accent-temple-gold/10 border border-accent-temple-gold/20 text-accent-temple-gold text-xs font-bold rounded-full">
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