import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import IntroSequence from '../features/home/IntroSequence';
import HeroSection from '../features/home/HeroSection';
import JourneyBuilder from '../features/journey/JourneyBuilder';
import SmartMap from '../features/map/SmartMap';
import TrekSafeDashboard from '../features/treksafe/TrekSafeDashboard';
import HiddenGems from '../features/hiddengems/HiddenGems';
import VisionAnalyzer from '../features/vision/VisionAnalyzer'; 
import CommunityFeed from '../features/community/CommunityFeed';
import TeahouseLedger from '../features/teahouse/TeahouseLedger';
import BiometricStream from '../features/treksafe/BiometricStream';
import SubscriptionPlans from '../features/billing/SubscriptionPlans';

function Home() {
  return (
    <main>
      <HeroSection />
      <HiddenGems />
      <div className="h-screen bg-background-dark flex items-center justify-center">
        <h2 className="text-white/30 font-display text-2xl">Scroll to explore</h2>
      </div>
    </main>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background-dark text-text-primary selection:bg-accent-rhododendron selection:text-white">
        <AnimatePresence>
          {showIntro && <IntroSequence onComplete={() => setShowIntro(false)} />}
        </AnimatePresence>

        {!showIntro && (
          <>
            <Navbar />
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
            </Routes>
          </>
        )}
      </div>
    </BrowserRouter>
  );
}