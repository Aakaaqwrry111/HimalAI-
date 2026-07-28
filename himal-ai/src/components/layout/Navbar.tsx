import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Compass, Shield, User, Camera, Award, MessageSquare, Zap, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import ExplorerPassport from '../../features/passport/ExplorerPassport'; 
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isPassportOpen, setIsPassportOpen] = useState(false); 
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Destructure loginWithGoogle directly from useAuth
  const { user, loginWithGoogle, logout } = useAuth();
  
  // Ref to detect clicks outside the profile dropdown
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Scroll listener for sticky navigation styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

          {/* --- RIGHT SIDE ACTIONS (PRO, PASSPORT, & AVATAR/LOGIN) --- */}
          <div className="flex items-center gap-3 relative">
            
            <Link 
              to="/billing"
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

            {/* --- DIRECT GOOGLE AUTH AVATAR / SIGN IN TRIGGER --- */}
            {user ? (
              <div className="relative" ref={profileMenuRef}>
<button
  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
  className="w-10 h-10 rounded-full border-2 border-accent-temple-gold overflow-hidden transition-transform hover:scale-105 ml-2 flex items-center justify-center bg-neutral-800"
>
  <img 
    src={user.avatar} 
    alt={user.name} 
    referrerPolicy="no-referrer"
    onError={(e) => {
      // Automatic fallback to clean letter avatar if Google image fails to load
      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=D97706&color=fff`;
    }}
    className="w-full h-full object-cover" 
  />
</button>

                {/* Animated Profile Dropdown */}
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 glass-panel bg-neutral-900/95 border border-white/10 rounded-2xl p-2 shadow-2xl z-50"
                    >
                      <div className="p-3 border-b border-white/10 mb-1">
                        <p className="font-bold text-sm text-white truncate">{user.name}</p>
                        <p className="text-xs text-white/50 truncate">{user.email}</p>
                      </div>
                      
                      <div className="p-2 border-b border-white/10 mb-1 flex items-center justify-between text-xs text-white/70">
                        <span>Status</span>
                        {user.isPro ? (
                          <span className="text-accent-temple-gold font-bold flex items-center gap-1"><Zap size={10}/> Pro Member</span>
                        ) : (
                          <span>Explorer</span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 ml-2"
              >
                Sign In
              </button>
            )}

          </div>
        </div>
      </motion.nav>

      {/* Passport Modal */}
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