"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Play,
  Check,
  Calendar as CalendarIcon,
  Layers,
  Scale,
  Sparkles,
  Smartphone,
  Shield,
  Lock,
  Star,
  Coins
} from "lucide-react";

interface PublicSavingsLandingPageProps {
  onNavigate?: (page: string) => void;
}

// --- Banner Ribbon Tag Component ---
export function BannerTag({
  text,
  color = "#6D28D9",
}: { text: string; color?: string }) {
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

// --- Savings Plans Configuration ---
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

export default function PublicSavingsLandingPage({ onNavigate }: PublicSavingsLandingPageProps) {
  const isLoggedIn = typeof window !== 'undefined' ? !!sessionStorage.getItem("fm_logged_in_mobile") : false;

  const handleStartPlan = (planId: string) => {
    if (isLoggedIn) {
      onNavigate?.('dashboard');
    } else {
      onNavigate?.('login');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-slate-800 font-sans hide-scrollbar pb-16 pt-20">

      {/* Main Container */}
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8 space-y-12 pt-4 md:pt-8">

        {/* 1. HERO SECTION */}
        <div className="bg-gradient-to-br from-[#F6F3FF] via-[#FAF8FF] to-white rounded-[28px] md:rounded-[36px] p-6 md:p-10 lg:p-12 border border-purple-100/60 shadow-xs relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Hero Left Content */}
          <div className="flex-1 space-y-5 max-w-xl text-center lg:text-left z-10">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-1.5 bg-purple-100/70 border border-purple-200/80 px-3.5 py-1.5 rounded-full text-[#6D28D9] text-[11px] font-black uppercase tracking-wider">
              <Clock size={13} strokeWidth={2.5} />
              <span>DISCIPLINE TODAY, PROSPERITY TOMORROW ✦</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl md:text-5xl lg:text-[54px] font-black text-slate-900 tracking-tight leading-[1.1]">
              Start Small. <br />
              Build Wealth. <br />
              <span className="text-[#6D28D9]">Automate with Gold SIP.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs md:text-sm lg:text-base font-semibold text-slate-500 leading-relaxed max-w-lg">
              Choose a plan that fits your goal and let Fipmoney automatically invest in 24K pure digital gold for you.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => handleStartPlan('daily')}
                className="w-full sm:w-auto bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-full flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-600/30 hover:-translate-y-0.5 cursor-pointer border-none outline-none"
              >
                <span>Start Saving Now</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => onNavigate?.('jar-how-tos')}
                className="w-full sm:w-auto bg-white border border-purple-200 text-[#6D28D9] hover:bg-purple-50 font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer outline-none"
              >
                <span>How Gold SIP Works</span>
                <Play size={13} className="fill-[#6D28D9]" />
              </button>
            </div>
          </div>

          {/* Hero Right Visual & Floating Card */}
          <div className="relative w-full max-w-[420px] flex items-center justify-center">
            {/* 3D Calendar & Coins Asset */}
            <img
              src="/daily_savings.png"
              alt="Automate Gold SIP"
              className="w-72 sm:w-88 md:w-96 h-auto object-contain drop-shadow-2xl animate-float"
            />

            {/* Floating 24K Pure Gold Badge */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-2 right-2 bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl p-3.5 shadow-xl flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck size={22} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-slate-900">24K Pure Gold</div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <Check size={11} strokeWidth={3} /> 99.99% Purity
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <Check size={11} strokeWidth={3} /> 100% Insured
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* 2. CHOOSE YOUR PLAN SECTION */}
        <div className="space-y-6">
          {/* Section Header */}
          <div className="text-center space-y-1.5">
            <div className="text-xs font-black uppercase tracking-wider text-[#6D28D9] flex items-center justify-center gap-1.5">
              <span>✦</span>
              <span>Choose Your Plan</span>
              <span>✦</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Start small. Stay consistent. Build your wealth.
            </h2>
          </div>

          {/* 3 SIP Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {savingsPlans.map((plan) => {
              const SubIcon = plan.subIcon;

              return (
                <div
                  key={plan.id}
                  onClick={() => handleStartPlan(plan.id)}
                  className="bg-white rounded-[26px] border border-slate-200/80 p-6 shadow-2xs hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between cursor-pointer group"
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
                    <div className="flex items-start justify-between mt-3 min-h-[90px]">
                      <div className="flex-1 pr-1">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                          {plan.type}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 max-w-[175px] mt-1.5 leading-relaxed">
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
                        handleStartPlan(plan.id);
                      }}
                      className={`px-4.5 py-2.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border-none outline-none ${plan.btnBg}`}
                    >
                      <span>Start Plan</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. FEATURES BAR (5 Items) */}
        <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-2xs">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Item 1 */}
            <div className="flex items-center gap-3 p-2">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#6D28D9] flex items-center justify-center shrink-0 font-bold">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">100% Secure</h4>
                <p className="text-[10px] font-semibold text-slate-400 leading-tight">Your gold savings are insured & protected.</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-3 p-2 pt-3 md:pt-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 font-bold">
                <Sparkles size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">24K Pure Gold</h4>
                <p className="text-[10px] font-semibold text-slate-400 leading-tight">Invest in 99.99% pure digital gold.</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-3 p-2 pt-3 md:pt-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 font-bold">
                <CalendarIcon size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Flexible Control</h4>
                <p className="text-[10px] font-semibold text-slate-400 leading-tight">Pause, modify or cancel your SIP anytime.</p>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex items-center gap-3 p-2 pt-3 md:pt-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
                <TrendingUp size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Better Returns</h4>
                <p className="text-[10px] font-semibold text-slate-400 leading-tight">Gold historically beats inflation.</p>
              </div>
            </div>

            {/* Item 5 */}
            <div className="flex items-center gap-3 p-2 pt-3 md:pt-2">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                <Smartphone size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Instant & Easy</h4>
                <p className="text-[10px] font-semibold text-slate-400 leading-tight">Start in minutes & track anytime.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. TRUST & REGULATION BANNER (Bottom Row) */}
        <div className="bg-[#F8F7FD] border border-purple-100/80 rounded-[28px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs relative overflow-hidden">
          {/* Left Column */}
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-xs border border-amber-200/60">
              <Shield size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-black text-slate-900">
                100% Safe & Insured Gold Savings
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5 max-w-sm">
                Build your wealth the smart and disciplined way with 24K pure digital gold.
              </p>
            </div>
          </div>

          {/* Center Column */}
          <div className="flex flex-wrap items-center gap-6 divide-x divide-purple-100">
            {/* RBI Regulated */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#6D28D9]">
                <ShieldCheck size={15} />
                <span>RBI Regulated</span>
              </div>
              <div className="text-[10px] font-bold text-slate-400">Through secure partners</div>
            </div>

            {/* Bank Grade Security */}
            <div className="pl-6 space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#6D28D9]">
                <Lock size={15} />
                <span>Bank Grade Security</span>
              </div>
              <div className="text-[10px] font-bold text-slate-400">Your safety is our priority</div>
            </div>
          </div>

          {/* Right Visual Vault Asset */}
          <div className="shrink-0 hidden lg:block">
            <img src="/sheild.png" alt="Insured Vaults" className="w-20 h-auto object-contain drop-shadow-md" />
          </div>
        </div>

      </div>
    </div>
  );
}
