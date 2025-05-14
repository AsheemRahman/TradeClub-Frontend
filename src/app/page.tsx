
"use client";

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import WelcomeScreen from '@/components/user/welcomeScreen';
import UserFooter from "@/components/user/footer";
import TradeClubHero from "@/components/user/JoinOptions";
import Navbar from "@/components/user/navbar";

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <main className="min-h-screen">
      <AnimatePresence mode="wait">
        {showWelcome && (
          <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      {!showWelcome && (
        <>
          <Navbar />
          <TradeClubHero />
          <UserFooter />
        </>
      )}
    </main>
  );
}