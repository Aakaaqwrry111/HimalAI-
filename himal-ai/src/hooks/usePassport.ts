import { useState, useEffect } from 'react';

// The Rank System
const RANKS = [
  { max: 1000, title: "Basecamp Novice" },
  { max: 2500, title: "Trail Wanderer" },
  { max: 5000, title: "High Altitude Explorer" },
  { max: 10000, title: "Himalayan Pathfinder" },
  { max: Infinity, title: "Apex Sherpa" }
];

export interface Stamp {
  id: string;
  name: string;
  region: string;
  date: string | null;
  icon: string;
  unlocked: boolean;
}

const DEFAULT_PASSPORT = {
  explorerName: "Akarshan",
  homeBase: "Bharatpur, Nepal",
  totalXp: 850,
  stamps: [
    { id: "s1", name: "Kathmandu Valley", region: "Bagmati", date: "2026-04-10", icon: "🛕", unlocked: true },
    { id: "s2", name: "Poon Hill", region: "Gandaki", date: "2026-04-14", icon: "🌄", unlocked: true },
    { id: "s3", name: "Everest Base Camp", region: "Khumbu", date: null, icon: "🏔️", unlocked: false },
    { id: "s4", name: "Upper Mustang", region: "Gandaki", date: null, icon: "🐎", unlocked: false },
    { id: "s5", name: "Phoksundo", region: "Dolpo", date: null, icon: "🌊", unlocked: false },
    { id: "s6", name: "Lumbini", region: "Lumbini", date: null, icon: "☸️", unlocked: false },
  ]
};

export function usePassport() {
  const [passport, setPassport] = useState(() => {
    const saved = localStorage.getItem('himal_passport');
    return saved ? JSON.parse(saved) : DEFAULT_PASSPORT;
  });

  useEffect(() => {
    localStorage.setItem('himal_passport', JSON.stringify(passport));
  }, [passport]);

  // Calculate current rank and progress to next rank
  const currentRank = RANKS.find(r => passport.totalXp < r.max) || RANKS[RANKS.length - 1];
  const previousRankMax = RANKS[RANKS.indexOf(currentRank) - 1]?.max || 0;
  const progressToNext = ((passport.totalXp - previousRankMax) / (currentRank.max - previousRankMax)) * 100;

  // Gamification Actions
  const addXp = (amount: number) => {
    setPassport((prev: any) => ({ ...prev, totalXp: prev.totalXp + amount }));
  };

  const unlockRandomStamp = () => {
    setPassport((prev: any) => {
      const lockedStamps = prev.stamps.filter((s: Stamp) => !s.unlocked);
      if (lockedStamps.length === 0) return prev; // All unlocked!

      const randomStamp = lockedStamps[Math.floor(Math.random() * lockedStamps.length)];
      const updatedStamps = prev.stamps.map((s: Stamp) => 
        s.id === randomStamp.id 
          ? { ...s, unlocked: true, date: new Date().toISOString().split('T')[0] } 
          : s
      );

      return { ...prev, stamps: updatedStamps, totalXp: prev.totalXp + 500 }; // Unlocking gives 500 XP
    });
  };

  const resetPassport = () => setPassport(DEFAULT_PASSPORT);

  return { passport, currentRank, progressToNext, addXp, unlockRandomStamp, resetPassport };
}