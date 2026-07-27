import React from 'react';
import { motion } from 'framer-motion';
import { X, Mail } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md glass-panel p-8 rounded-3xl overflow-hidden"
      >
        {/* Subtle mesh background inside modal */}
        <div className="absolute inset-0 bg-mesh-aurora opacity-30 pointer-events-none" />

        <button onClick={onClose} className="absolute top-6 right-6 text-text-secondary hover:text-white transition-colors">
          <X size={20} />
        </button>

        <div className="text-center mb-8 relative z-10">
          <h2 className="font-display text-3xl font-semibold mb-2">Begin Your Journey</h2>
          <p className="text-text-secondary text-sm">Unlock your Digital Explorer Passport.</p>
        </div>

        <div className="space-y-4 relative z-10">
          <button className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
          
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-text-secondary text-xs">OR</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 glass-panel hover:bg-surface-glass-hover py-3 rounded-xl font-medium transition-colors border border-white/10">
            <Mail size={18} />
            Continue with Email
          </button>
        </div>

        <div className="mt-8 text-center relative z-10">
          <button onClick={onClose} className="text-sm text-text-secondary hover:text-white hover:underline transition-all">
            Continue as Guest
          </button>
        </div>
      </motion.div>
    </div>
  );
}