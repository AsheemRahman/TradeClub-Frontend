
"use client";

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import WelcomeScreen from '@/components/user/welcomeScreen';
import UserFooter from "@/components/user/footer";
import TradeClubHero from "@/components/user/JoinOptions";
import Navbar from "@/components/user/navbar";
import TextPressure from "@/components/user/TextPressure";

import { Globe } from "@/components/magicui/globe";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";
import { RetroGrid } from "@/components/magicui/retro-grid";

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
            <div className='flex'>
              <Globe />
              <TextPressure text="Welcome to TradeClub!" flex={true} alpha={false} stroke={false} width={true} weight={true} italic={true} strokeColor="#ff0000" minFontSize={36} />
            </div>
          </div>
            <VelocityScroll>Crypto Forex Stock </VelocityScroll>
            <TradeClubHero />
            <UserFooter />
        </>
      )}
    </main>
  );
}