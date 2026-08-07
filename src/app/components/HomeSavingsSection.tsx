"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  TrendingUp,
  ArrowRight,
  Layers,
  Scale,
  Sparkles,
  ChevronRight
} from "lucide-react";

interface HomeSavingsSectionProps {
  onNavigate?: (page: string) => void;
}

// --- Banner Ribbon Tag Component ---
function BannerTag({ text, color = "#6D28D9" }: { text: string; color?: string }) {
  return (
    <div
      className="absolute top-0 right-0 z-20 text-white font-black text-[10px] tracking-wider uppercase px-4 py-1.5 flex items-center justify-center pointer-events-none shadow-xs"
      style={{
        backgroundColor: color,
        borderTopRightRadius: "24px",
        borderBottomLeftRadius: "14px",
        clipPath: "polygon(14px 0%, 100% 0%, 100% 100%, 0% 100%)"
      }}
    >
      <span className="pl-2 pr-0.5">{text}</span>
    </div>
  );
}

const savingsPlans = [
  {
    id: "daily",
    type: "Daily Savings",
    amount: "₹10 / day",
    desc: "Micro-savings that build huge wealth over time.",
    tag: "MOST POPULAR",
    tagColorHex: "#6D28D9",
    pillBorder: "border-purple-200",
    pillBg: "bg-purple-50/50",
    pillText: "text-[#6D28D9]",
    suggestedBoxBg: "bg-[#F7F5FF] border-[#EDE9FE]",
    amountColor: "text-[#6D28D9]",
    projected: "₹3,650/yr",
    image: "/daily_savings.png",
    subIcon: Layers,
    subIconBg: "bg-purple-100/70 text-[#6D28D9]",
    subTextTitle: "Small Steps",
    subTextSubtitle: "Big Future",
    btnBg: "bg-[#6D28D9] hover:bg-[#5B21B6]"
  },
  {
    id: "weekly",
    type: "Weekly Savings",
    amount: "₹1,000 / week",
    desc: "Perfect for matching your steady weekly expenses.",
    tag: "STEADY GROWTH",
    tagColorHex: "#059669",
    pillBorder: "border-emerald-200",
    pillBg: "bg-emerald-50/50",
    pillText: "text-[#059669]",
    suggestedBoxBg: "bg-[#F0FDF4] border-[#DCFCE7]",
    amountColor: "text-[#059669]",
    projected: "₹52,000/yr",
    image: "/weekly_savings.png",
    subIcon: TrendingUp,
    subIconBg: "bg-emerald-100/70 text-[#059669]",
    subTextTitle: "Stay Consistent",
    subTextSubtitle: "Stay Ahead",
    btnBg: "bg-[#059669] hover:bg-[#047857]"
  },
  {
    id: "monthly",
    type: "Monthly Savings",
    amount: "₹5,000 / month",
    desc: "Serious wealth building directly from your salary.",
    tag: "WEALTH BUILDER",
    tagColorHex: "#D97706",
    pillBorder: "border-amber-200",
    pillBg: "bg-amber-50/50",
    pillText: "text-[#D97706]",
    suggestedBoxBg: "bg-[#FFFBEB] border-[#FEF3C7]",
    amountColor: "text-[#D97706]",
    projected: "₹60,000/yr",
    image: "/monthly_savings.png",
    subIcon: Scale,
    subIconBg: "bg-amber-100/70 text-[#D97706]",
    subTextTitle: "Build Wealth",
    subTextSubtitle: "Secure Future",
    btnBg: "bg-[#D97706] hover:bg-[#B45309]"
  }
];

export default function HomeSavingsSection({ onNavigate }: HomeSavingsSectionProps) {
  const handleOpenPlan = (planId: string) => {
    onNavigate?.('savings');
  };

  return (
    <section className="w-full py-16 bg-[#FAFAFE] border-b border-slate-100 font-sans relative overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100/70 text-[#6D28D9] text-[11px] font-black uppercase tracking-wider">
            <Sparkles size={13} />
            <span>GOLD SIP SAVINGS</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Automate Your Gold Savings
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            Start small. Stay consistent. Build long-term wealth in 24K Pure Digital Gold.
          </p>
        </div>

        {/* 3 SIP Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {savingsPlans.map((plan) => {
            const SubIcon = plan.subIcon;

            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleOpenPlan(plan.id)}
                className="bg-white rounded-[26px] border border-slate-200/80 p-6 shadow-xs hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between cursor-pointer group"
              >
                {/* Top-Right Banner Tag */}
                <BannerTag text={plan.tag} color={plan.tagColorHex} />

                {/* Top Content */}
                <div className="relative z-10">
                  {/* Auto-Invest Pill */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${plan.pillBorder} ${plan.pillBg} ${plan.pillText}`}>
                    <Clock size={13} strokeWidth={2.5} />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">AUTO-INVEST</span>
                  </div>

                  {/* Flex row: Title & Description Left, 3D Asset Right */}
                  <div className="flex items-start justify-between mt-3 min-h-[85px]">
                    <div className="flex-1 pr-1">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                        {plan.type}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 max-w-[170px] mt-1.5 leading-relaxed">
                        {plan.desc}
                      </p>
                    </div>

                    {/* 3D Image Asset */}
                    <img
                      src={plan.image}
                      alt={plan.type}
                      className="w-28 h-auto object-contain drop-shadow-md shrink-0 -mt-2 -mr-2 transform group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                    />
                  </div>
                </div>

                {/* Suggested Start Box */}
                <div className={`rounded-2xl p-4 border my-4 ${plan.suggestedBoxBg}`}>
                  <span className="text-[11px] font-bold text-slate-500">
                    Suggested Start
                  </span>
                  <div className={`text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5 ${plan.amountColor}`}>
                    {plan.amount}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">
                    Projected: {plan.projected}
                  </div>
                </div>

                {/* Card Bottom Row: Sub Info & CTA Button */}
                <div className="flex items-center justify-between pt-1 mt-auto">
                  {/* Left Sub-Info */}
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${plan.subIconBg}`}>
                      <SubIcon size={16} strokeWidth={2.5} />
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 leading-tight">
                      <div>{plan.subTextTitle}</div>
                      <div className="text-slate-500 font-semibold">{plan.subTextSubtitle}</div>
                    </div>
                  </div>

                  {/* Right CTA Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenPlan(plan.id);
                    }}
                    className={`px-4.5 py-2.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border-none outline-none ${plan.btnBg}`}
                  >
                    <span>Start Plan</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Savings CTA Footer Bar */}
        <div className="flex items-center justify-center pt-2">
          <button
            onClick={() => onNavigate?.('savings')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-[#6D28D9] hover:text-[#5B21B6] bg-purple-50/80 hover:bg-purple-100/80 border border-purple-200/80 px-6 py-3 rounded-full transition-all cursor-pointer outline-none shadow-2xs"
          >
            <span>View All Gold Savings Plans & Growth Calculators</span>
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </div>

      </div>
    </section>
  );
}
