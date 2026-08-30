"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SplashScreen as CapacitorSplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    // Hide native platform static splash screen so animated GIF takes over seamlessly
    if (typeof window !== "undefined" && Capacitor.isNativePlatform()) {
      CapacitorSplashScreen.hide().catch(() => {});
    }

    // Play splash screen animation for ~3.6s, then transition to homepage
    const timer = setTimeout(() => {
      onFinish();
    }, 3600);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black select-none overflow-hidden"
    >
      {/* Centered Splash Screen Animated GIF */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src="/fipmoney_logo_splash_screen.gif"
          alt="FipMoney"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-contain max-w-md max-h-screen transition-opacity duration-300 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Optional subtle skip button on web/mobile */}
      <button
        onClick={onFinish}
        className="absolute top-6 right-6 z-10 text-[11px] font-semibold text-white/50 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all border-none cursor-pointer outline-none backdrop-blur-xs"
      >
        Skip →
      </button>
    </motion.div>
  );
}
