
"use client";

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import WelcomeScreen from '@/components/user/welcomeScreen';
import UserFooter from "@/components/user/footer";
import Navbar from "@/components/user/navbar";

import JoinOptions from '@/components/user/JoinOptions';
import { HomeHero } from '@/components/user/HomeComponent';

import { RetroGrid } from "@/components/magicui/retro-grid";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";

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
          <div className="relative w-full overflow-hidden">
            <RetroGrid />
            <Navbar />
            <HomeHero />
          </div>
          <VelocityScroll>Crypto Forex Stock </VelocityScroll>
          <JoinOptions />
          <UserFooter />
        </>
      )}
    </main>
  );
}