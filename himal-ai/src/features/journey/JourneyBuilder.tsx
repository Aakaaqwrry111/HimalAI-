import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, Loader2, Tent, Coffee, Sparkles, CheckCircle2, ChevronRight, 
  Calculator, CalendarDays, Star, MapPin, Calendar, X, Languages, ShieldCheck, Users,
  BookmarkCheck, Trash2, ArrowDown
} from 'lucide-react';
import { generateJourney, JourneyPlan } from '../../lib/gemini';
import Timeline from './Timeline';


// --- MOCK DATA FOR GUIDES ---
const MOCK_GUIDES = [
  {
    id: 'g1',
    name: 'Lakpa Sherpa',
    rating: 4.9,
    reviews: 142,
    experience: '12 Years',
    pricePerDay: 35,
    languages: ['English', 'Nepali', 'Sherpa'],
    specialty: 'High Altitude Rescues',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 'g2',
    name: 'Nima Tamang',
    rating: 4.8,
    reviews: 98,
    experience: '8 Years',
    pricePerDay: 30,
    languages: ['English', 'Hindi', 'Nepali'],
    specialty: 'Flora & Fauna',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 'g3',
    name: 'Pasang Lhamu',
    rating: 5.0,
    reviews: 215,
    experience: '15 Years',
    pricePerDay: 40,
    languages: ['English', 'French', 'Nepali'],
    specialty: 'Emergency First Aid',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400',
  }
];

// --- BUDGET TIERS ---
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
  // --- REFS ---
  const itineraryRef = useRef<HTMLDivElement>(null);

  // --- STATE ---
  const [prompt, setPrompt] = useState(() => {
    if (typeof window === 'undefined') return '';
    const saved = localStorage.getItem('treksafe_journey_prompt');
    return saved ? JSON.parse(saved) : '';
  });

  const [plan, setPlan] = useState<JourneyPlan | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('treksafe_journey_plan');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedTier, setSelectedTier] = useState<TierKey>(() => {
    if (typeof window === 'undefined') return 'moderate';
    const saved = localStorage.getItem('treksafe_journey_tier');
    return saved ? JSON.parse(saved) : 'moderate';
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [hasSavedPlan, setHasSavedPlan] = useState(false);

  // --- GUIDE BOOKING STATE ---
  const [selectedGuide, setSelectedGuide] = useState<typeof MOCK_GUIDES[0] | null>(null);
  const [bookingState, setBookingState] = useState<'idle' | 'processing' | 'success'>('idle');

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem('treksafe_journey_prompt', JSON.stringify(prompt));
  }, [prompt]);

  useEffect(() => {
    if (plan) {
      localStorage.setItem('treksafe_journey_plan', JSON.stringify(plan));
      setHasSavedPlan(true);
    }
  }, [plan]);

  useEffect(() => {
    localStorage.setItem('treksafe_journey_tier', JSON.stringify(selectedTier));
  }, [selectedTier]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('treksafe_journey_plan');
      setHasSavedPlan(!!saved);
    }
  }, []);

  // --- CALCULATIONS ---
  const journeyDays = plan?.days && Array.isArray(plan.days) ? plan.days.length : 0;
  const activeData = BUDGET_TIERS[selectedTier];
  const totalCost = activeData.dailyRate * journeyDays;

  // --- HANDLERS ---
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setPlan(null); 
    try {
      const result = await generateJourney(prompt);
      setPlan(result);
      setTimeout(() => {
        itineraryRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (error) {
      console.error(error);
      alert("The fog is too thick. Could not generate the journey.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGoToSavedItinerary = () => {
    if (!plan) {
      const saved = localStorage.getItem('treksafe_journey_plan');
      if (saved) {
        setPlan(JSON.parse(saved));
      }
    }
    setTimeout(() => {
      itineraryRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleClearSavedPlan = () => {
    if (window.confirm("Are you sure you want to clear your saved itinerary?")) {
      setPlan(null);
      localStorage.removeItem('treksafe_journey_plan');
      setHasSavedPlan(false);
    }
  };

  const handleBookGuide = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingState('processing');
    setTimeout(() => {
      setBookingState('success');
    }, 1500);
  };

  const closeAndResetGuide = () => {
    setSelectedGuide(null);
    setTimeout(() => setBookingState('idle'), 300);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20 flex flex-col gap-16">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-full">
        <div className="flex flex-col max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-glow text-white">
            Journey Canvas
          </h1>
          <p className="text-white/60 text-base md:text-lg leading-relaxed">
            Define your parameters. Our AI will architect a hyper-personalized route through the Himalayas, complete with logistics, interactive mapping, and dynamic budgeting based on your exact route.
          </p>
        </div>

        {/* Go To Saved Itinerary Quick Button */}
        {hasSavedPlan && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleGoToSavedItinerary}
            className="self-start md:self-auto bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/50 text-amber-300 px-5 py-3 rounded-2xl font-medium transition-all flex items-center gap-2.5 shadow-lg backdrop-blur-md"
          >
            <BookmarkCheck className="w-5 h-5 text-amber-400" />
            <span>Go to Saved Itinerary</span>
            <ArrowDown className="w-4 h-4 opacity-70" />
          </motion.button>
        )}
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

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
              {hasSavedPlan && (
                <button
                  type="button"
                  onClick={handleGoToSavedItinerary}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <BookmarkCheck size={16} className="text-accent-temple-gold" />
                  View Saved Itinerary
                </button>
              )}

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full sm:w-auto bg-white text-black px-8 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={18} /> : null}
                Architect Route
              </button>
            </div>
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
            <div className="w-12 h-12 rounded-full border-t-2 border-accent-temple-gold animate-spin" />
            <p className="text-white/70 font-medium tracking-wide animate-pulse">
              Surveying trails and calculating logistics...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Plan, Timeline, Budget, and Guides */}
      {!isGenerating && plan && (
        <motion.div 
          ref={itineraryRef}
          id="itinerary-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full flex flex-col gap-16 scroll-mt-8"
        >
          {/* 1. Timeline Section */}
          <div className="w-full flex flex-col gap-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-l-4 border-accent-temple-gold pl-6 py-2 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-accent-temple-gold">
                  {plan.title}
                </h2>
                <p className="text-white/50 text-sm mt-1">Custom generated expedition blueprint</p>
              </div>

              <button
                onClick={handleClearSavedPlan}
                className="self-start md:self-auto text-xs text-red-400/80 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-xl border border-red-500/20 transition-all flex items-center gap-2"
              >
                <Trash2 size={14} />
                Clear Saved Itinerary
              </button>
            </div>

            <Timeline plan={plan} />
          </div>

          <div className="w-full h-px bg-white/10" />

          {/* 2. Budget Section */}
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
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 pointer-events-none" />
                    )}
                    <div className="p-8 relative z-10 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`p-4 rounded-2xl ${isSelected ? tier.color + ' bg-black/40' : 'text-white/40 bg-white/5'}`}>
                          <Icon size={26} />
                        </div>
                        {isSelected && (
                          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={tier.color}>
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

          <div className="w-full h-px bg-white/10" />

          {/* 3. Guide Booking Section */}
          <div className="w-full flex flex-col gap-10 bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-12 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white flex items-center gap-3">
                  <Users className="text-accent-temple-gold" size={28} />
                  Verified Local Guides
                </h3>
                <p className="text-white/60 mt-2 text-sm md:text-base">
                  Book certified Himalayan experts. Their profiles and SOS data will sync directly to your offline manifest.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_GUIDES.map((guide) => (
                <motion.div 
                  key={guide.id}
                  whileHover={{ y: -5 }}
                  className="bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 rounded-3xl overflow-hidden shadow-xl transition-all"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img src={guide.image} alt={guide.name} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center text-sm font-medium border border-white/10 text-white">
                      <Star className="w-4 h-4 text-accent-temple-gold mr-1 fill-accent-temple-gold" />
                      {guide.rating} ({guide.reviews})
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white">{guide.name}</h3>
                      <span className="text-accent-temple-gold font-bold">${guide.pricePerDay}/day</span>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-white/60 text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-white/40" /> {guide.specialty}
                      </div>
                      <div className="flex items-center text-white/60 text-sm">
                        <ShieldCheck className="w-4 h-4 mr-2 text-white/40" /> {guide.experience} Experience
                      </div>
                      <div className="flex items-center text-white/60 text-sm">
                        <Languages className="w-4 h-4 mr-2 text-white/40" /> {guide.languages.join(', ')}
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedGuide(guide)}
                      className="w-full py-3 bg-white text-black hover:bg-gray-200 font-semibold rounded-xl transition-colors flex items-center justify-center"
                    >
                      <Calendar className="w-5 h-5 mr-2" /> Reserve Guide
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Guide Booking Modal */}
          <AnimatePresence>
            {selectedGuide && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
              >
                <motion.div 
                  initial={{ scale: 0.95, y: 20 }} 
                  animate={{ scale: 1, y: 0 }} 
                  exit={{ scale: 0.95, y: 20 }}
                  className="bg-[#0f1014] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
                >
                  <button 
                    onClick={closeAndResetGuide}
                    className="absolute top-4 right-4 text-white/40 hover:text-white z-10"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  {bookingState === 'idle' && (
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-1">Book {selectedGuide.name}</h3>
                      <p className="text-white/50 text-sm mb-6">Your data syncs offline automatically once confirmed.</p>
                      
                      <form onSubmit={handleBookGuide} className="space-y-4">
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4 mb-4">
                           <CalendarDays className="text-accent-temple-gold" size={24} />
                           <div>
                             <p className="text-xs text-white/40 uppercase font-bold">Auto-Linked to Trip</p>
                             <p className="text-white font-medium">{journeyDays} Days Duration</p>
                           </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/60 mb-1">Start Date</label>
                          <input type="date" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-temple-gold [color-scheme:dark]" />
                        </div>

                        <div className="pt-4 mt-4 border-t border-white/10 flex justify-between items-center mb-6">
                          <span className="text-white/60">Estimated Guide Total</span>
                          <span className="text-xl font-bold text-accent-temple-gold">${selectedGuide.pricePerDay * journeyDays}</span>
                        </div>

                        <button type="submit" className="w-full py-4 bg-white text-black hover:bg-gray-200 font-bold rounded-xl transition-all">
                          Confirm Secure Booking
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Processing State */}
                  {bookingState === 'processing' && (
                    <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-12 h-12 border-4 border-white/10 border-t-accent-temple-gold rounded-full mb-4"
                      />
                      <h3 className="text-lg font-medium animate-pulse text-white/70">Securing Offline Profile...</h3>
                    </div>
                  )}

                  {/* Success State */}
                  {bookingState === 'success' && (
                    <div className="p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
                      <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 text-emerald-400 border border-emerald-500/20"
                      >
                        <CheckCircle2 className="w-10 h-10" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
                      <p className="text-white/50 mb-8 leading-relaxed">
                        {selectedGuide.name}'s biometric profile and emergency contact info is now cached to your device for offline access.
                      </p>
                      <button 
                        onClick={closeAndResetGuide}
                        className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/10"
                      >
                        Return to Dashboard
                      </button>
                    </div>
                  )}

                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}

    </div>
  );
}