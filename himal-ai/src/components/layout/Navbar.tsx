import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Compass, Shield, User, Camera, Award, MessageSquare, Zap, LogOut, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import ExplorerPassport from '../../features/passport/ExplorerPassport'; 
import { useAuth } from '../../context/AuthContext';
import { HimalLogo } from '../HimalLogo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isPassportOpen, setIsPassportOpen] = useState(false); 
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, loginWithGoogle, logout } = useAuth();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when navigating
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled || isMobileMenuOpen ? 'bg-background-dark/90 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-4 md:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-12 flex justify-between items-center">
          
          {/* --- LOGO --- */}
          <Link to="/" onClick={closeMobileMenu} className="hover:opacity-95 transition-opacity z-50">
            <HimalLogo className="w-8 h-8 md:w-9 md:h-9" showText={true} />
          </Link>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden lg:flex items-center gap-8 glass-panel px-8 py-3 rounded-full">
            <NavLink to="/journey" icon={<Compass size={16} />} text="Journey Builder" />
            <NavLink to="/explore" icon={<Map size={16} />} text="Smart Map" />
            <NavLink to="/treksafe" icon={<Shield size={16} />} text="TrekSafe" />
            <NavLink to="/vision" icon={<Camera size={16} />} text="AI Lens" />
            <NavLink to="/community" icon={<MessageSquare size={16} />} text="Community" />
            <NavLink to="/teahouses" icon={<User size={16} />} text="Teahouses" />
          </div>

          {/* --- RIGHT ACTIONS & MOBILE TOGGLE --- */}
          <div className="flex items-center gap-2 md:gap-3 relative z-50">
            
            {/* Pro Button (Hidden on very small screens, moved to mobile menu) */}
            <Link 
              to="/billing/SubscriptionPlans"
              className="hidden sm:flex items-center gap-1.5 bg-accent-temple-gold/10 hover:bg-accent-temple-gold/20 border border-accent-temple-gold/30 text-accent-temple-gold px-4 py-2.5 rounded-full transition-all active:scale-95 shadow-lg"
            >
              <Zap size={14} className="fill-accent-temple-gold" />
              <span className="text-xs font-bold uppercase tracking-wider mt-0.5">Pro</span>
            </Link>

            {/* Passport Button */}
            <button 
              onClick={() => setIsPassportOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-accent-temple-gold/20 to-orange-500/20 border border-accent-temple-gold/40 hover:border-accent-temple-gold px-5 py-2.5 rounded-full transition-all text-accent-temple-gold shadow-lg group"
            >
              <Award size={16} className="group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-bold tracking-wide">Passport</span>
            </button>

            {/* --- AUTH AVATAR / SIGN IN --- */}
            {user ? (
              <div className="relative hidden sm:block" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="w-10 h-10 rounded-full border-2 border-accent-temple-gold overflow-hidden transition-transform hover:scale-105 flex items-center justify-center bg-neutral-800"
                >
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=D97706&color=fff`;
                    }}
                    className="w-full h-full object-cover" 
                  />
                </button>

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
                      <button
                        onClick={() => { logout(); setIsProfileMenuOpen(false); }}
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
                className="hidden sm:block bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors ml-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* --- MOBILE DROPDOWN MENU --- */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/10 bg-background-dark overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-4">
                <MobileNavLink to="/journey" icon={<Compass size={20} />} text="Journey Builder" onClick={closeMobileMenu} />
                <MobileNavLink to="/explore" icon={<Map size={20} />} text="Smart Map" onClick={closeMobileMenu} />
                <MobileNavLink to="/treksafe" icon={<Shield size={20} />} text="TrekSafe" onClick={closeMobileMenu} />
                <MobileNavLink to="/vision" icon={<Camera size={20} />} text="AI Lens" onClick={closeMobileMenu} />
                <MobileNavLink to="/community" icon={<MessageSquare size={20} />} text="Community" onClick={closeMobileMenu} />
                <MobileNavLink to="/teahouses" icon={<User size={20} />} text="Teahouses" onClick={closeMobileMenu} />
                
                <hr className="border-white/10 my-2" />

                {/* Mobile Auth & Actions */}
                <button 
                  onClick={() => { setIsPassportOpen(true); closeMobileMenu(); }}
                  className="flex items-center gap-3 text-accent-temple-gold py-2 font-bold"
                >
                  <Award size={20} /> Explorer Passport
                </button>
                
                <Link 
                  to="/billing/SubscriptionPlans" 
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 text-accent-temple-gold py-2 font-bold"
                >
                  <Zap size={20} /> Upgrade to Pro
                </Link>

                {user ? (
                  <button onClick={() => { logout(); closeMobileMenu(); }} className="flex items-center gap-3 text-red-400 py-2 font-bold mt-2">
                    <LogOut size={20} /> Sign Out
                  </button>
                ) : (
                  <button onClick={() => { loginWithGoogle(); closeMobileMenu(); }} className="w-full bg-white/10 border border-white/20 text-white py-3 rounded-xl font-bold mt-2">
                    Sign In with Google
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AnimatePresence>
        {isPassportOpen && <ExplorerPassport onClose={() => setIsPassportOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

// Sub-components for clean rendering
function NavLink({ to, icon, text }: { to: string; icon: React.ReactNode; text: string }) {
  return (
    <Link to={to} className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm font-medium">
      {icon}
      <span>{text}</span>
    </Link>
  );
}

function MobileNavLink({ to, icon, text, onClick }: { to: string; icon: React.ReactNode; text: string; onClick: () => void }) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-3 text-white/80 hover:text-white py-2 text-lg font-medium transition-colors">
      {icon}
      <span>{text}</span>
    </Link>
  );
}