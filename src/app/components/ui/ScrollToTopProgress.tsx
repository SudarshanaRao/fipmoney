"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

interface ScrollToTopProgressProps {
  containerId?: string;
}

export default function ScrollToTopProgress({ containerId }: ScrollToTopProgressProps = {}) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const getTarget = () => (containerId ? document.getElementById(containerId) : null);

    const handleScroll = () => {
      const targetElement = getTarget();
      if (targetElement) {
        const total = targetElement.scrollHeight - targetElement.clientHeight;
        const current = targetElement.scrollTop;
        if (total > 0) {
          const percent = Math.min(100, Math.max(0, (current / total) * 100));
          setProgress(percent);
        }
        setIsVisible(current > 150);
      } else {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        if (totalScroll > 0) {
          const percent = Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100));
          setProgress(percent);
        }
        setIsVisible(currentScroll > 150);
      }
    };

    const targetEl = getTarget();
    if (targetEl) {
      targetEl.addEventListener("scroll", handleScroll, { passive: true });
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (targetEl) {
        targetEl.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [containerId]);

  const scrollToTop = () => {
    const targetElement = containerId ? document.getElementById(containerId) : null;
    if (targetElement) {
      targetElement.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const size = 52;
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={`Scroll to top (${Math.round(progress)}%)`}
          className="fixed bottom-24 right-5 sm:bottom-8 sm:right-8 z-50 w-[52px] h-[52px] rounded-full bg-white/95 backdrop-blur-md shadow-xl shadow-emerald-950/20 border border-slate-200/90 flex items-center justify-center cursor-pointer group outline-none"
          aria-label="Scroll to top"
        >
          {/* Circular Progress SVG */}
          <svg className="w-[52px] h-[52px] absolute inset-0 -rotate-90 pointer-events-none">
            {/* Background track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-slate-200/70"
              fill="transparent"
            />
            {/* Animated progress stroke */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#emerald-progress-grad)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-[stroke-dashoffset] duration-150 ease-out"
            />
            <defs>
              <linearGradient id="emerald-progress-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#064e3b" />
                <stop offset="50%" stopColor="#047857" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          {/* Centered Arrow */}
          <div className="relative z-10 w-8 h-8 rounded-full bg-emerald-50 text-[#047857] group-hover:bg-[#047857] group-hover:text-white transition-all flex items-center justify-center shadow-2xs">
            <ArrowUp size={18} strokeWidth={2.75} className="group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

