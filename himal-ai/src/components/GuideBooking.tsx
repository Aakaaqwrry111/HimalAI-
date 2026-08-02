import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Calendar, CheckCircle, X, Languages, ShieldCheck } from 'lucide-react';

// --- MOCK DATA FOR THE DEMO ---
const MOCK_GUIDES = [
  {
    id: 'g1',
    name: 'Lakpa Sherpa',
    rating: 4.9,
    reviews: 142,
    experience: '12 Years',
    pricePerDay: 35,
    languages: ['English', 'Nepali', 'Sherpa'],
    specialty: 'Everest Region, High Altitude Rescues',
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
    specialty: 'Annapurna Circuit, Flora & Fauna',
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
    specialty: 'Langtang Valley, Emergency First Aid',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400',
  }
];

export default function GuideBooking() {
  const [selectedGuide, setSelectedGuide] = useState<typeof MOCK_GUIDES[0] | null>(null);
  const [bookingState, setBookingState] = useState<'idle' | 'processing' | 'success'>('idle');

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingState('processing');
    
    // Fake network delay for the pitch demo
    setTimeout(() => {
      setBookingState('success');
    }, 1500);
  };

  const closeAndReset = () => {
    setSelectedGuide(null);
    setTimeout(() => setBookingState('idle'), 300);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header section */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Verified Local Guides</h2>
          <p className="text-gray-400">Book certified Himalayan experts directly to your offline manifest.</p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_GUIDES.map((guide) => (
            <motion.div 
              key={guide.id}
              whileHover={{ y: -5 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="h-48 overflow-hidden relative">
                <img src={guide.image} alt={guide.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center text-sm font-medium border border-gray-700">
                  <Star className="w-4 h-4 text-orange-500 mr-1 fill-orange-500" />
                  {guide.rating} ({guide.reviews})
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{guide.name}</h3>
                  <span className="text-orange-500 font-bold">${guide.pricePerDay}/day</span>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 mr-2" /> {guide.specialty}
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <ShieldCheck className="w-4 h-4 mr-2" /> {guide.experience} Experience
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Languages className="w-4 h-4 mr-2" /> {guide.languages.join(', ')}
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedGuide(guide)}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center"
                >
                  <Calendar className="w-5 h-5 mr-2" /> Reserve Guide
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Booking Modal (Framer Motion) */}
        <AnimatePresence>
          {selectedGuide && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.95, y: 20 }}
                className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
              >
                <button 
                  onClick={closeAndReset}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
                >
                  <X className="w-6 h-6" />
                </button>

                {bookingState === 'idle' && (
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-1">Book {selectedGuide.name}</h3>
                    <p className="text-gray-400 text-sm mb-6">Your data syncs offline automatically once confirmed.</p>
                    
                    <form onSubmit={handleBook} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Trekking Region</label>
                        <select required className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
                          <option>Everest Base Camp</option>
                          <option>Annapurna Circuit</option>
                          <option>Langtang Valley</option>
                          <option>Manaslu Circuit</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Start Date</label>
                          <input type="date" required className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 [color-scheme:dark]" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Duration</label>
                          <input type="number" min="1" placeholder="Days" required className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" />
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-gray-800 flex justify-between items-center mb-6">
                        <span className="text-gray-400">Rate</span>
                        <span className="text-xl font-bold text-white">${selectedGuide.pricePerDay} / day</span>
                      </div>

                      <button type="submit" className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all">
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
                      className="w-12 h-12 border-4 border-gray-800 border-t-orange-500 rounded-full mb-4"
                    />
                    <h3 className="text-lg font-medium animate-pulse text-gray-300">Securing Guide Offline Profile...</h3>
                  </div>
                )}

                {/* Success State */}
                {bookingState === 'success' && (
                  <div className="p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-500"
                    >
                      <CheckCircle className="w-10 h-10" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
                    <p className="text-gray-400 mb-8">
                      {selectedGuide.name}'s profile and emergency contact info is now cached to your device for offline access.
                    </p>
                    <button 
                      onClick={closeAndReset}
                      className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                )}

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </div>
  );
}