import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout & Home
import Navbar from '../components/layout/Navbar';
import IntroSequence from '../features/home/IntroSequence';
import HeroSection from '../features/home/HeroSection';
import HiddenGems from '../features/hiddengems/HiddenGems';

// Features
import JourneyBuilder from '../features/journey/JourneyBuilder';
import SmartMap from '../features/map/SmartMap';
import TrekSafeDashboard from '../features/treksafe/TrekSafeDashboard';
import VisionAnalyzer from '../features/vision/VisionAnalyzer'; 
import CommunityFeed from '../features/community/CommunityFeed';
import TeahouseLedger from '../features/teahouse/TeahouseLedger';
import BiometricStream from '../features/treksafe/BiometricStream';
import SubscriptionPlans from '../features/billing/SubscriptionPlans';

// Context
import { AuthProvider } from '../context/AuthContext';

function Home() {
  return (
    <div className="w-full flex flex-col">
      <HeroSection />
      <HiddenGems />
      <div className="h-screen bg-background-dark flex items-center justify-center">
        <h2 className="text-white/30 font-display text-2xl text-center px-4">Scroll to explore</h2>
      </div>
    </div>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background-dark text-text-primary selection:bg-accent-rhododendron selection:text-white flex flex-col overflow-x-hidden relative">
          
          <AnimatePresence>
            {showIntro && <IntroSequence onComplete={() => setShowIntro(false)} />}
          </AnimatePresence>
          
          {!showIntro && (
            <>
              <Navbar />
              
              {/* 
                SPACING FIX: 
                Added 'pt-20 md:pt-24' so route pages start below the navbar 
                with generous breathing room, solving the compact/overlapping look.
              */}
              <main className="flex-grow w-full flex flex-col pt-20 md:pt-24">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/journey" element={<JourneyBuilder />} />
                  <Route path="/explore" element={<SmartMap />} />
                  <Route path="/treksafe" element={<TrekSafeDashboard />} />
                  <Route path="/vision" element={<VisionAnalyzer />} />
                  <Route path="/community" element={<CommunityFeed />} />
                  <Route path="/teahouses" element={<TeahouseLedger />} />
                  <Route path="/biometric-stream" element={<BiometricStream />} />
                  <Route path="/billing/SubscriptionPlans" element={<SubscriptionPlans />} />
                  
                  {/* Fallback 404 Route */}
                  <Route 
                    path="*" 
                    element={
                      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                        <h2 className="text-3xl md:text-4xl font-black text-white/50 mb-4">404 - Off Trail</h2>
                        <p className="text-white/70">Looks like you wandered off the map.</p>
                      </div>
                    } 
                  />
                </Routes>
              </main>
            </>
          )}

        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}