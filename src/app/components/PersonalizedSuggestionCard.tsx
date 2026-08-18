"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ChevronRight, Check } from "lucide-react";

interface PersonalizedSuggestionCardProps {
  userName: string;
  userId?: string;
  mobileNumber?: string;
  onNavigate: (page: string) => void;
}

export default function PersonalizedSuggestionCard({
  userName,
  userId = "",
  mobileNumber = "",
  onNavigate
}: PersonalizedSuggestionCardProps) {
  // Session-based random card selection (0 to 5) per login session
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sessionKey = `fm_suggestion_index_${userId || mobileNumber || "guest"}`;
      let stored = sessionStorage.getItem(sessionKey);

      if (stored === null || isNaN(parseInt(stored, 10))) {
        const randomIndex = Math.floor(Math.random() * 6);
        sessionStorage.setItem(sessionKey, randomIndex.toString());
        setActiveIndex(randomIndex);
      } else {
        setActiveIndex(parseInt(stored, 10) % 6);
      }
      setIsLoaded(true);
    }
  }, [userId, mobileNumber]);

  const cards = [
    {
      id: "card_1",
      badgeColor: "bg-[#ff9800] text-white",
      textColor: "text-[#d97706]",
      cardBg: "bg-gradient-to-b from-[#fffdf0] to-[#fff8e1] border-amber-200/80",
      activeDotColor: "bg-[#ff9800]",
      title: (
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight mb-1.5">
          Hello {userName || "Dharsh"}!
        </h3>
      ),
      description: "We have a special offer just for you. Start your Gold SIP today and build your wealth, one step at time.",
      image: "/suggestion_gold_sip.png",
      imgStyle: "w-32 sm:w-36 max-h-[130px]",
      hasTrustBadge: false,
      btnText: "Start Gold SIP Now",
      btnClass: "bg-[#ff9800] hover:bg-[#f57c00] text-slate-950 shadow-md shadow-amber-500/20",
      route: "buy-gold"
    },
    {
      id: "card_2",
      badgeColor: "bg-[#0070f3] text-white",
      textColor: "text-[#0070f3]",
      cardBg: "bg-[#f0f7ff] border-blue-100",
      activeDotColor: "bg-[#0070f3]",
      title: (
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight mb-1.5">
          Build Wealth <br /><span className="text-[#0070f3]">Every Day!</span>
        </h3>
      ),
      description: "Invest small amounts daily in gold and secure your future with Fipmoney.",
      image: "/suggestion_build_wealth.png",
      imgStyle: "w-32 sm:w-36 max-h-[135px]",
      hasTrustBadge: true,
      btnText: "Invest Now",
      btnClass: "bg-[#0070f3] hover:bg-[#005bb5] text-white shadow-md shadow-blue-500/20",
      route: "daily-savings"
    },
    {
      id: "card_3",
      badgeColor: "bg-[#10b981] text-white",
      textColor: "text-[#059669]",
      cardBg: "bg-[#f0fdf4] border-emerald-100",
      activeDotColor: "bg-[#10b981]",
      title: (
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight mb-1.5">
          Grow Your <span className="text-[#059669]">Savings</span> <br />Automatically
        </h3>
      ),
      description: "Start a Gold SIP and let your money grow with time.",
      image: "/suggestion_grow_savings.png",
      imgStyle: "w-32 sm:w-38 max-h-[130px]",
      hasTrustBadge: false,
      btnText: "Start SIP Today",
      btnClass: "bg-[#d1fae5] hover:bg-[#a7f3d0] text-[#065f46] font-black border border-emerald-300/80 shadow-xs",
      route: "buy-gold"
    },
    {
      id: "card_4",
      badgeColor: "bg-[#7c3aed] text-white",
      textColor: "text-[#7c3aed]",
      cardBg: "bg-[#faf5ff] border-purple-100",
      activeDotColor: "bg-[#7c3aed]",
      title: (
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight mb-1.5">
          Your Future, <br /><span className="text-[#6d28d9]">Secured in Gold</span>
        </h3>
      ),
      description: "Gold is a timeless asset. Invest today for a stronger tomorrow.",
      image: "/suggestion_future_savings.png",
      imgStyle: "w-32 sm:w-36 max-h-[130px]",
      hasTrustBadge: false,
      btnText: "Invest in Gold",
      btnClass: "bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-md shadow-purple-500/20",
      route: "buy-gold"
    },
    {
      id: "card_5",
      badgeColor: "bg-[#e11d48] text-white",
      textColor: "text-[#e11d48]",
      cardBg: "bg-[#fff1f2] border-rose-100",
      activeDotColor: "bg-[#e11d48]",
      title: (
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight mb-1.5">
          First SIP. Big Step. <br /><span className="text-[#be123c]">Bright Future.</span>
        </h3>
      ),
      description: "Begin your Gold SIP journey with just ₹100. It's quick, easy and rewarding.",
      image: "/suggestion_first_sip.png",
      imgStyle: "w-32 sm:w-36 max-h-[130px]",
      hasTrustBadge: false,
      btnText: "Start with ₹100",
      btnClass: "bg-[#f43f5e] hover:bg-[#e11d48] text-white shadow-md shadow-rose-500/20",
      route: "buy-gold"
    },
    {
      id: "card_6",
      badgeColor: "bg-[#0891b2] text-white",
      textColor: "text-[#0891b2]",
      cardBg: "bg-[#ecfeff] border-cyan-100",
      activeDotColor: "bg-[#0891b2]",
      title: (
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight mb-1.5">
          Limited Time Offer!
        </h3>
      ),
      description: "Start your Gold SIP this week and get extra rewards.",
      image: "/suggestion_extra_reward.png",
      imgStyle: "w-32 sm:w-38 max-h-[130px]",
      hasTrustBadge: false,
      btnText: "Start Now & Earn More",
      btnClass: "bg-[#0891b2] hover:bg-[#0e7490] text-white shadow-md shadow-cyan-500/20",
      route: "buy-gold"
    }
  ];

  const currentCard = cards[activeIndex] || cards[0];

  if (!isLoaded) return null;

  return (
    <div className="w-full relative font-sans">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`rounded-[28px] p-5 sm:p-6 ${currentCard.cardBg} border shadow-xs relative overflow-hidden flex flex-col justify-between h-auto min-h-[350px] max-h-[380px] w-full`}
        >
          {/* Top Header: Label & Mail Icon */}
          <div className="flex items-center justify-between mb-2 shrink-0">
            <span className={`text-xs sm:text-[13px] font-bold tracking-tight ${currentCard.textColor}`}>
              A message for you
            </span>
            <div className={`w-8 h-8 rounded-full ${currentCard.badgeColor} flex items-center justify-center shadow-xs`}>
              <Mail size={16} />
            </div>
          </div>

          {/* Body Content Grid: Text Left, 3D Asset Right */}
          <div className="grid grid-cols-12 gap-2 items-center flex-1 my-1">
            {/* Left Column: Heading, Description, & Trust Pill */}
            <div className="col-span-7 space-y-1.5 z-10 pr-1">
              {currentCard.title}
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {currentCard.description}
              </p>

              {/* Trust Badge Pill (Card 2 - Exact Reference Match) */}
              {currentCard.hasTrustBadge && (
                <div className="mt-2.5 inline-flex items-center gap-2.5 p-2 px-3 rounded-2xl bg-white/95 border border-blue-100/90 shadow-xs max-w-[210px] z-10 relative">
                  <div className="w-6 h-6 rounded-full bg-[#0070f3] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[#0070f3] font-bold text-[11px] leading-tight block">
                      Safe • Secure • Trusted
                    </div>
                    <div className="text-slate-500 font-semibold text-[10px] leading-tight block mt-0.5">
                      100% Insured Gold
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: 3D Asset Image */}
            <div className="col-span-5 flex items-center justify-end z-0 h-full">
              <img
                src={currentCard.image}
                alt="Suggestion Graphic"
                className={`${currentCard.imgStyle} object-contain drop-shadow-md pointer-events-none transform hover:scale-105 transition-transform duration-300`}
              />
            </div>
          </div>

          {/* Bottom Section: Primary CTA Button */}
          <div className="pt-2 shrink-0">
            <button
              onClick={() => onNavigate(currentCard.route)}
              className={`w-full py-3 px-5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1 transition-all cursor-pointer border-none outline-none active:scale-[0.98] ${currentCard.btnClass}`}
            >
              <span>{currentCard.btnText}</span>
              <ChevronRight size={16} strokeWidth={3} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
