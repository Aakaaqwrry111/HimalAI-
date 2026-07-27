import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Compass, Shield, User, Camera, Award, MessageSquare, Coffee, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import ExplorerPassport from '../../features/passport/ExplorerPassport'; 
import SubscriptionPlans from '../../features/billing/SubscriptionPlans';
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isPassportOpen, setIsPassportOpen] = useState(false); 

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-background-dark/50 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-accent-rhododendron to-accent-temple-gold flex items-center justify-center shadow-lg">
              <span className="font-display font-bold text-white text-lg group-hover:scale-110 transition-transform">H</span>
            </div>
            <span className="font-display font-semibold text-xl tracking-wide text-glow">Himal AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 glass-panel px-8 py-3 rounded-full">
            <NavLink to="/journey" icon={<Compass size={16} />} text="Journey Builder" />
            <NavLink to="/explore" icon={<Map size={16} />} text="Smart Map" />
            <NavLink to="/treksafe" icon={<Shield size={16} />} text="TrekSafe" />
            <NavLink to="/vision" icon={<Camera size={16} />} text="AI Lens" />
            <NavLink to="/community" icon={<MessageSquare size={16} />} text="Community" />
            <NavLink to="/teahouses" icon={<User size={16} />} text="Teahouses" />
          </div>

          {/* --- RIGHT SIDE ACTIONS (PRO & PASSPORT) --- */}
          <div className="flex items-center gap-3">
            
            <Link 
              to="/billing/SubscriptionPlans"
              className="flex items-center gap-1.5 bg-accent-temple-gold/10 hover:bg-accent-temple-gold/20 border border-accent-temple-gold/30 text-accent-temple-gold px-4 py-2.5 rounded-full transition-all active:scale-95 shadow-lg shadow-accent-temple-gold/5 hover:scale-105"
            >
              <Zap size={14} className="fill-accent-temple-gold" />
              <span className="text-xs font-bold uppercase tracking-wider mt-0.5">Pro</span>
            </Link>

            <button 
              onClick={() => setIsPassportOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-accent-temple-gold/20 to-orange-500/20 border border-accent-temple-gold/40 hover:border-accent-temple-gold px-5 py-2.5 rounded-full transition-all active:scale-95 text-accent-temple-gold shadow-lg shadow-accent-temple-gold/10 group"
            >
              <Award size={16} className="group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-bold tracking-wide">Passport</span>
            </button>

          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isPassportOpen && <ExplorerPassport onClose={() => setIsPassportOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function NavLink({ to, icon, text }: { to: string; icon: React.ReactNode; text: string }) {
  return (
    <Link to={to} className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm font-medium">
      {icon}
      <span>{text}</span>
    </Link>
  );
}