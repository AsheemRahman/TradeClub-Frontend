"use client";

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import WelcomeScreen from '@/components/user/welcomeScreen';
import Navbar from "@/components/user/navbar";
import { HomeHero } from '@/components/user/HomeComponent';
import JoinOptions from '@/components/user/JoinOptions';
import { SubscriptionPlans } from '@/components/user/SubscriptionList';
import UserFooter from "@/components/user/footer";

import { RetroGrid } from "@/components/magicui/retro-grid";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowWelcome(true);
      sessionStorage.setItem("hasVisited", "true");
    }
  }, []);

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
          <SubscriptionPlans />
          <UserFooter />
        </>
      )}
    </main>
  );
}
