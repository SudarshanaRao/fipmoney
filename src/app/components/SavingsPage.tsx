"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Calendar as CalendarIcon,
  PiggyBank,
  TrendingUp,
  ShieldCheck,
  ArrowLeft,
  Info,
  CheckCircle2,
  ChevronRight,
  Target,
  ArrowUpRight,
  Shield,
  Layers,
  Scale,
  Sparkles,
  Wallet,
  Zap,
  Smartphone,
  ArrowRight,
  Check,
  X
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type PlanType = 'daily' | 'weekly' | 'monthly' | null;

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
    tagWidth: 145,
    tagBg: "bg-[#6D28D9]",
    btnBg: "bg-[#6D28D9] hover:bg-[#5B21B6]",
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
    defaults: { amount: 10, minAmount: 10, maxAmount: 1000, step: 10 },
    theme: { bg: "bg-purple-600", text: "text-[#6D28D9]", light: "bg-purple-50", dark: "#4c1d95", accent: "#6D28D9" },
    gradient: "linear-gradient(135deg, #4c1d95 0%, #6D28D9 100%)"
  },
  {
    id: "weekly",
    type: "Weekly Savings",
    amount: "₹1,000 / week",
    desc: "Perfect for matching your steady weekly expenses.",
    tag: "STEADY GROWTH",
    tagColorHex: "#059669",
    tagWidth: 150,
    tagBg: "bg-[#059669]",
    btnBg: "bg-[#059669] hover:bg-[#047857]",
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
    defaults: { amount: 1000, minAmount: 100, maxAmount: 10000, step: 100 },
    theme: { bg: "bg-emerald-600", text: "text-[#059669]", light: "bg-emerald-50", dark: "#064e3b", accent: "#059669" },
    gradient: "linear-gradient(135deg, #064e3b 0%, #059669 100%)"
  },
  {
    id: "monthly",
    type: "Monthly Savings",
    amount: "₹5,000 / month",
    desc: "Serious wealth building directly from your salary.",
    tag: "WEALTH BUILDER",
    tagColorHex: "#D97706",
    tagWidth: 155,
    tagBg: "bg-[#D97706]",
    btnBg: "bg-[#D97706] hover:bg-[#B45309]",
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
    defaults: { amount: 5000, minAmount: 500, maxAmount: 50000, step: 500 },
    theme: { bg: "bg-amber-600", text: "text-[#D97706]", light: "bg-amber-50", dark: "#78350f", accent: "#D97706" },
    gradient: "linear-gradient(135deg, #78350f 0%, #D97706 100%)"
  }
];

const ANNUAL_RETURN_RATE = 0.11;

export default function SavingsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [activeSetup, setActiveSetup] = useState<PlanType>(null);
  const [sipAmount, setSipAmount] = useState<number>(10);
  const [sipDuration, setSipDuration] = useState<number>(5);

  // Mobile SIP setup flow states (only triggered on mobile screens)
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mobileSipStep, setMobileSipStep] = useState<'none' | 'day_select' | 'date_select' | 'daily_tenure' | 'success'>('none');
  const [mobileSelectedPlan, setMobileSelectedPlan] = useState<PlanType>(null);
  const [selectedWeeklyDay, setSelectedWeeklyDay] = useState<string>('Monday');
  const [selectedMonthlyDate, setSelectedMonthlyDate] = useState<number>(5);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSetupPlanClick = (planId: PlanType, customAmt?: number) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('fm_setup_metal', 'gold');
      sessionStorage.setItem('fm_setup_plan', planId);
    }
    if (onNavigate) {
      onNavigate('setup-sip');
    } else {
      setActiveSetup(planId);
    }
  };

  const handleOpenSetup = (planId: PlanType) => {
    handleSetupPlanClick(planId);
  };

  const handleCloseSetup = () => {
    setActiveSetup(null);
  };

  const getNextAutoPayDate = () => {
    const now = new Date();
    const plan = mobileSelectedPlan || activeSetup || 'daily';

    if (plan === 'daily') {
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      return tomorrow.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' at 09:00 AM';
    }

    if (plan === 'weekly') {
      const daysMap: Record<string, number> = {
        'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6
      };
      const targetDay = daysMap[selectedWeeklyDay] ?? 1;
      const currentDay = now.getDay();
      let distance = targetDay - currentDay;
      if (distance <= 0) distance += 7;
      const nextDate = new Date(now);
      nextDate.setDate(now.getDate() + distance);
      return nextDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    }

    if (plan === 'monthly') {
      let nextDate = new Date(now.getFullYear(), now.getMonth(), selectedMonthlyDate);
      if (nextDate <= now) {
        nextDate = new Date(now.getFullYear(), now.getMonth() + 1, selectedMonthlyDate);
      }
      return nextDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    return 'Tomorrow at 09:00 AM';
  };

  const activePlanData = useMemo(() => savingsPlans.find(p => p.id === (activeSetup || mobileSelectedPlan)), [activeSetup, mobileSelectedPlan]);

  const calculationData = useMemo(() => {
    const currentPlanId = activeSetup || mobileSelectedPlan || 'daily';
    let periodsPerYear = 12;
    if (currentPlanId === 'daily') periodsPerYear = 365;
    if (currentPlanId === 'weekly') periodsPerYear = 52;

    const ratePerPeriod = ANNUAL_RETURN_RATE / periodsPerYear;
    const chartData = [];
    let currentInvested = 0;
    let currentValue = 0;

    for (let year = 1; year <= sipDuration; year++) {
      const periodsInYear = year * periodsPerYear;
      const P = sipAmount;
      const r = ratePerPeriod;
      const n = periodsInYear;

      const invested = P * n;
      const fv = (P * (Math.pow(1 + r, n) - 1)) / r * (1 + r);
      const returns = fv - invested;

      chartData.push({
        year: `Year ${year}`,
        Invested: Math.round(invested),
        Returns: Math.round(returns),
        Total: Math.round(fv)
      });

      if (year === sipDuration) {
        currentInvested = invested;
        currentValue = fv;
      }
    }

    const estimatedReturn = Math.round(currentValue - currentInvested);
    const percentageGain = currentInvested > 0 ? Number(((estimatedReturn / currentInvested) * 100).toFixed(1)) : 0;

    return {
      chartData,
      totalInvested: Math.round(currentInvested),
      estimatedReturn,
      totalValue: Math.round(currentValue),
      percentageGain
    };
  }, [activeSetup, mobileSelectedPlan, sipAmount, sipDuration]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-xl text-white">
          <p className="font-bold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-6 text-sm mb-1">
              <span style={{ color: entry.color }} className="font-semibold">{entry.name}:</span>
              <span className="font-black">₹{entry.value.toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-slate-700 mt-2 pt-2 flex justify-between gap-6 text-sm">
            <span className="font-semibold text-white">Total Value:</span>
            <span className="font-black text-emerald-400">₹{payload[0].payload.Total.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#FAFAFC] pb-24 text-slate-800 font-sans relative hide-scrollbar">
      <div className="p-4 md:p-6 lg:p-8 max-w-[1360px] mx-auto space-y-8 relative z-10">

        <AnimatePresence mode="popLayout">
          {!activeSetup ? (
            <motion.div
              key="cards-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Header Section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    Gold SIP Savings
                  </h1>
                  <p className="text-xs md:text-sm font-medium text-slate-500 mt-1">
                    Discipline today, prosperity tomorrow. Automate your savings in 24K pure Digital Gold.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-[#F3F4FF] px-4 py-2 rounded-full border border-indigo-100/80 shadow-xs self-start md:self-auto">
                  <ShieldCheck size={16} className="text-[#6D28D9]" />
                  <span className="text-xs font-black text-[#6D28D9] uppercase tracking-wider">
                    100% SECURE & REGULATED
                  </span>
                </div>
              </div>

              {/* Choose Your Plan Title */}
              <div>
                <div className="flex items-center gap-2 text-xs md:text-sm font-extrabold uppercase tracking-wider text-[#6D28D9] mb-4">
                  <TrendingUp size={16} className="text-[#6D28D9]" />
                  <span>CHOOSE YOUR PLAN</span>
                </div>

                {/* 3 SIP Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {savingsPlans.map((plan) => {
                    const SubIcon = plan.subIcon;

                    return (
                      <div
                        key={plan.id}
                        onClick={() => handleOpenSetup(plan.id as PlanType)}
                        className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between cursor-pointer group"
                      >
                        {/* Top-Right Banner Tag */}
                        <BannerTag text={plan.tag} color={plan.tagColorHex} />

                        {/* Top Content: Auto-Invest Pill, Title, Description & 3D Image Asset */}
                        <div className="relative z-10">
                          {/* Auto-Invest Pill */}
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${plan.pillBorder} ${plan.pillBg} ${plan.pillText}`}>
                            <Clock size={13} strokeWidth={2.5} />
                            <span className="text-[10px] font-extrabold uppercase tracking-wider">AUTO-INVEST</span>
                          </div>

                          {/* Flex row: Title & Description on Left, 3D Image Asset on Right */}
                          <div className="flex items-start justify-between mt-3 min-h-[90px]">
                            <div className="flex-1 pr-1">
                              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                {plan.type}
                              </h2>
                              <p className="text-xs font-semibold text-slate-500 max-w-[175px] mt-1.5 leading-relaxed">
                                {plan.desc}
                              </p>
                            </div>

                            {/* 3D Image Asset on Right */}
                            <img
                              src={plan.image}
                              alt={plan.type}
                              className="w-28 h-auto object-contain drop-shadow-md shrink-0 -mt-2 -mr-2 transform group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                            />
                          </div>
                        </div>

                        {/* Suggested Start Box */}
                        <div className={`rounded-2xl p-4 border mt-4 ${plan.suggestedBoxBg}`}>
                          <span className="text-[11px] font-bold text-slate-500">
                            Suggested Start
                          </span>
                          <div className={`text-xl font-extrabold tracking-tight mt-0.5 ${plan.amountColor}`}>
                            {plan.amount}
                          </div>
                          <div className="text-xs font-medium text-slate-500 mt-0.5">
                            Projected: {plan.projected}
                          </div>
                        </div>

                        {/* Card Bottom Row: Sub Info & CTA Button */}
                        <div className="flex items-center justify-between mt-4 pt-1">
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
                              handleOpenSetup(plan.id as PlanType);
                            }}
                            className={`px-4 py-2.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border-none outline-none ${plan.btnBg}`}
                          >
                            <span>Setup Plan</span>
                            <ChevronRight size={14} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>


              {/* Bottom Safety & Regulation Banner */}
              <div className="bg-gradient-to-r from-[#0F0C20] via-[#1A153B] to-[#0F0C20] rounded-2xl p-5 md:p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg border border-indigo-900/40 relative overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-11 h-11 bg-amber-500/20 border border-amber-400/30 rounded-xl flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                    <Shield size={22} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-black text-white tracking-tight">
                      Safe. Secure. 24K Pure.
                    </h3>
                    <p className="text-xs text-indigo-200/80 font-medium mt-0.5">
                      Your gold savings are 100% secure, insured and regulated.
                    </p>
                  </div>
                </div>

                <button className="bg-[#EAB308] hover:bg-[#FACC15] text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer border-none outline-none shrink-0 self-stretch md:self-auto justify-center">
                  <span>Learn More</span>
                  <ChevronRight size={14} strokeWidth={3} />
                </button>
              </div>

            </motion.div>
          ) : (
            /* Interactive Daily Savings Plan Detail View (Matching Image) */
            <motion.div
              key="setup-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Setup Top Navigation & Security Badge */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleCloseSetup}
                  className="inline-flex items-center gap-2 text-xs md:text-sm font-extrabold text-slate-600 hover:text-[#6D28D9] transition-colors cursor-pointer bg-transparent border-none outline-none"
                >
                  <ArrowLeft size={16} strokeWidth={2.5} />
                  <span>Back to Savings Plans</span>
                </button>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/70 text-[#6D28D9] text-xs font-black uppercase tracking-wider">
                  <ShieldCheck size={15} strokeWidth={2.5} />
                  <span>100% SECURE & REGULATED</span>
                </div>
              </div>

              {/* Main Title & Subtitle */}
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                  {activePlanData?.type || "Daily Savings"}
                </h1>
                <p className="text-xs md:text-sm font-medium text-slate-500 mt-1">
                  {activePlanData?.desc || "Micro-savings that build huge wealth over time."}
                </p>
              </div>

              {/* Row 1: Hero Banner & Plan Highlights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Hero Card (Left 2 cols) */}
                <div className="lg:col-span-2 bg-gradient-to-br from-[#F6F3FF] via-[#FAF8FF] to-white border border-purple-100/90 rounded-[28px] p-6 md:p-8 shadow-xs relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 min-h-[250px]">
                  <div className="flex-1 space-y-4 z-10 text-left w-full">
                    {/* Tag */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/80 text-[#6D28D9] text-[10px] font-black uppercase tracking-wider border border-purple-200/60">
                      <Zap size={13} strokeWidth={2.5} />
                      <span>AUTO-INVEST PLAN</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                      {activePlanData?.id === 'weekly'
                        ? 'Save a little every week,'
                        : activePlanData?.id === 'monthly'
                        ? 'Save a little every month,'
                        : 'Save a little every day,'}<br />
                      Secure your future.
                    </h2>

                    <div className="space-y-2.5 pt-1">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-purple-100/80 text-[#6D28D9] flex items-center justify-center shrink-0">
                          <Clock size={13} strokeWidth={2.5} />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-800">
                          {activePlanData?.id === 'weekly'
                            ? 'Invest as low as ₹100 per week'
                            : activePlanData?.id === 'monthly'
                            ? 'Invest as low as ₹500 per month'
                            : 'Invest as low as ₹10 per day'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-purple-100/80 text-[#6D28D9] flex items-center justify-center shrink-0">
                          <Layers size={13} strokeWidth={2.5} />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-800">
                          Auto-invest in 24K Pure Digital Gold
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-purple-100/80 text-[#6D28D9] flex items-center justify-center shrink-0">
                          <Shield size={13} strokeWidth={2.5} />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-800">
                          100% secure, insured & regulated
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3D Asset Right */}
                  <img
                    src={activePlanData?.image || "/daily_savings.png"}
                    alt={activePlanData?.type || "Gold Savings"}
                    className="w-48 sm:w-56 md:w-64 h-auto object-contain drop-shadow-xl shrink-0 pointer-events-none transform hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Plan Highlights (Right 1 col) */}
                <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 shadow-2xs flex flex-col justify-between space-y-4">
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Plan Highlights
                  </h3>

                  <div className="space-y-4">
                    {/* Item 1 */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100/80 text-[#6D28D9] flex items-center justify-center shrink-0 mt-0.5">
                        <CalendarIcon size={18} strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">
                          {activePlanData?.id === 'weekly'
                            ? 'Weekly Auto-Investment'
                            : activePlanData?.id === 'monthly'
                            ? 'Monthly Auto-Investment'
                            : 'Daily Auto-Investment'}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-400 mt-0.5">
                          Set it once, we invest {activePlanData?.id === 'weekly' ? 'weekly' : activePlanData?.id === 'monthly' ? 'monthly' : 'daily'}
                        </div>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-[#D97706] flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles size={18} strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">24K Pure Digital Gold</div>
                        <div className="text-[11px] font-semibold text-slate-400 mt-0.5">Invest in real gold, 100% pure</div>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100/80 text-[#6D28D9] flex items-center justify-center shrink-0 mt-0.5">
                        <Layers size={18} strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">Flexible & Affordable</div>
                        <div className="text-[11px] font-semibold text-slate-400 mt-0.5">
                          {activePlanData?.id === 'weekly'
                            ? 'Start with just ₹100 per week'
                            : activePlanData?.id === 'monthly'
                            ? 'Start with just ₹500 per month'
                            : 'Start with just ₹10 per day'}
                        </div>
                      </div>
                    </div>

                    {/* Item 4 */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100/80 text-[#6D28D9] flex items-center justify-center shrink-0 mt-0.5">
                        <ShieldCheck size={18} strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">Safe & Regulated</div>
                        <div className="text-[11px] font-semibold text-slate-400 mt-0.5">Your gold savings are 100% secure</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: How Savings Works & Investment Calculator */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* How Savings Works (Left 2 cols) */}
                <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-[28px] p-6 md:p-8 shadow-2xs flex flex-col justify-between">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-8">
                    How {activePlanData?.type || 'Savings'} Works
                  </h3>

                  {/* 4 Steps Flex Row with Centered Cute Dotted Arrows */}
                  <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-1 relative px-1">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center text-center z-10 flex-1">
                      <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#F4F0FF] border border-purple-200/60 flex items-center justify-center shadow-2xs relative">
                        <div className="relative">
                          <CalendarIcon size={32} className="text-[#6D28D9]" strokeWidth={2.2} />
                          <div className="absolute -bottom-1 -right-1.5 bg-amber-400 text-amber-950 font-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
                            ₹
                          </div>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm font-black text-slate-900 mt-4 tracking-tight">
                        1. Set {activePlanData?.id === 'weekly' ? 'Weekly' : activePlanData?.id === 'monthly' ? 'Monthly' : 'Daily'} Amount
                      </div>
                      <div className="text-[11px] sm:text-xs font-semibold text-slate-400 leading-relaxed mt-1.5 max-w-[140px] mx-auto">
                        Choose how much you want to save {activePlanData?.id === 'weekly' ? 'weekly' : activePlanData?.id === 'monthly' ? 'monthly' : 'daily'}.
                      </div>
                    </div>

                    {/* Dotted Arrow Connector 1 */}
                    <div className="hidden md:flex items-center justify-center w-10 sm:w-14 shrink-0 mt-8 sm:mt-9">
                      <div className="flex items-center justify-center">
                        <div className="w-7 sm:w-9 border-t-2 border-dashed border-slate-300" />
                        <svg className="w-2.5 h-2.5 text-slate-400 shrink-0 -ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center text-center z-10 flex-1">
                      <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#F4F0FF] border border-purple-200/60 flex items-center justify-center shadow-2xs relative">
                        <div className="relative">
                          <Smartphone size={32} className="text-[#6D28D9]" strokeWidth={2.2} />
                          <div className="absolute bottom-0 right-0 bg-amber-400 text-amber-950 font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
                            ₹
                          </div>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm font-black text-slate-900 mt-4 tracking-tight">
                        2. Auto-Invest {activePlanData?.id === 'weekly' ? 'Weekly' : activePlanData?.id === 'monthly' ? 'Monthly' : 'Daily'}
                      </div>
                      <div className="text-[11px] sm:text-xs font-semibold text-slate-400 leading-relaxed mt-1.5 max-w-[140px] mx-auto">
                        We automatically invest in digital gold.
                      </div>
                    </div>

                    {/* Dotted Arrow Connector 2 */}
                    <div className="hidden md:flex items-center justify-center w-10 sm:w-14 shrink-0 mt-8 sm:mt-9">
                      <div className="flex items-center justify-center">
                        <div className="w-7 sm:w-9 border-t-2 border-dashed border-slate-300" />
                        <svg className="w-2.5 h-2.5 text-slate-400 shrink-0 -ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center text-center z-10 flex-1">
                      <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#F4F0FF] border border-purple-200/60 flex items-center justify-center shadow-2xs relative">
                        <div className="flex flex-col items-center gap-0.5">
                          <div className="w-7 h-3 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-xs shadow-2xs border border-amber-300/80" />
                          <div className="flex gap-1">
                            <div className="w-5.5 h-2.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-xs shadow-2xs border border-amber-300/80" />
                            <div className="w-5.5 h-2.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-xs shadow-2xs border border-amber-300/80" />
                          </div>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm font-black text-slate-900 mt-4 tracking-tight">
                        3. Accumulate Gold
                      </div>
                      <div className="text-[11px] sm:text-xs font-semibold text-slate-400 leading-relaxed mt-1.5 max-w-[140px] mx-auto">
                        Your gold grows every day.
                      </div>
                    </div>

                    {/* Dotted Arrow Connector 3 */}
                    <div className="hidden md:flex items-center justify-center w-10 sm:w-14 shrink-0 mt-8 sm:mt-9">
                      <div className="flex items-center justify-center">
                        <div className="w-7 sm:w-9 border-t-2 border-dashed border-slate-300" />
                        <svg className="w-2.5 h-2.5 text-slate-400 shrink-0 -ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex flex-col items-center text-center z-10 flex-1">
                      <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#F4F0FF] border border-purple-200/60 flex items-center justify-center shadow-2xs relative">
                        <div className="w-9 h-9 rounded-xl bg-[#6D28D9] text-white flex items-center justify-center shadow-xs">
                          <ShieldCheck size={24} strokeWidth={2.5} />
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm font-black text-slate-900 mt-4 tracking-tight">
                        4. Secure Future
                      </div>
                      <div className="text-[11px] sm:text-xs font-semibold text-slate-400 leading-relaxed mt-1.5 max-w-[140px] mx-auto">
                        Build wealth & achieve your goals.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Investment Calculator (Right 1 col) */}
                <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 shadow-2xs flex flex-col justify-between space-y-4">
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Investment Calculator
                  </h3>

                  <div>
                    <label className="text-xs font-extrabold text-slate-500 block mb-2">
                      {activePlanData?.id === 'weekly' ? 'Weekly' : activePlanData?.id === 'monthly' ? 'Monthly' : 'Daily'} Investment Amount
                    </label>

                    <div className="flex items-center gap-2">
                      {/* Left Amount Display / Input */}
                      <div className="flex-1 relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">₹</span>
                        <input
                          type="number"
                          value={sipAmount}
                          onChange={(e) => setSipAmount(Math.max(1, Number(e.target.value)))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2.5 font-black text-slate-900 text-sm focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      {/* Dynamic Quick Select Buttons */}
                      {activePlanData?.id === 'weekly' ? (
                        <>
                          <button
                            onClick={() => setSipAmount(500)}
                            className={`px-2.5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer border-none outline-none ${
                              sipAmount === 500 ? 'bg-[#6D28D9] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            ₹500
                          </button>
                          <button
                            onClick={() => setSipAmount(1000)}
                            className={`px-2.5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer border-none outline-none ${
                              sipAmount === 1000 ? 'bg-[#6D28D9] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            ₹1k
                          </button>
                          <button
                            onClick={() => setSipAmount(2000)}
                            className={`px-2.5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer border-none outline-none ${
                              sipAmount === 2000 ? 'bg-[#6D28D9] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            ₹2k
                          </button>
                        </>
                      ) : activePlanData?.id === 'monthly' ? (
                        <>
                          <button
                            onClick={() => setSipAmount(2000)}
                            className={`px-2.5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer border-none outline-none ${
                              sipAmount === 2000 ? 'bg-[#6D28D9] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            ₹2k
                          </button>
                          <button
                            onClick={() => setSipAmount(5000)}
                            className={`px-2.5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer border-none outline-none ${
                              sipAmount === 5000 ? 'bg-[#6D28D9] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            ₹5k
                          </button>
                          <button
                            onClick={() => setSipAmount(10000)}
                            className={`px-2.5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer border-none outline-none ${
                              sipAmount === 10000 ? 'bg-[#6D28D9] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            ₹10k
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setSipAmount(10)}
                            className={`px-2.5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer border-none outline-none ${
                              sipAmount === 10 ? 'bg-[#6D28D9] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            ₹10
                          </button>
                          <button
                            onClick={() => setSipAmount(20)}
                            className={`px-2.5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer border-none outline-none ${
                              sipAmount === 20 ? 'bg-[#6D28D9] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            ₹20
                          </button>
                          <button
                            onClick={() => setSipAmount(50)}
                            className={`px-2.5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer border-none outline-none ${
                              sipAmount === 50 ? 'bg-[#6D28D9] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            ₹50
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Tenure Selection */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-extrabold text-slate-500 flex items-center gap-1.5">
                        <Clock size={14} className="text-[#6D28D9]" />
                        <span>Investment Tenure (Years)</span>
                      </label>
                      <span className="text-xs font-black text-[#6D28D9] bg-purple-100 px-2.5 py-0.5 rounded-full">
                        {sipDuration} {sipDuration === 1 ? 'Year' : 'Years'}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {[1, 3, 5, 10].map((years) => (
                        <button
                          key={years}
                          type="button"
                          onClick={() => setSipDuration(years)}
                          className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer border-none outline-none ${
                            sipDuration === years
                              ? 'bg-[#6D28D9] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {years} {years === 1 ? 'Yr' : 'Yrs'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Projected Value & Returns Box */}
                  <div className="bg-[#F8F9FE] border border-purple-100/80 rounded-2xl p-4 relative space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-500">Projected Portfolio Value</div>
                        <div className="text-3xl font-black text-slate-900 tracking-tight mt-1">
                          ₹{calculationData.totalValue.toLocaleString()}
                        </div>
                        <div className="text-xs font-semibold text-slate-500 mt-0.5">
                          In {sipDuration} {sipDuration === 1 ? 'Year' : 'Years'} ({sipDuration * (activePlanData?.id === 'weekly' ? 52 : activePlanData?.id === 'monthly' ? 12 : 365)} installments)
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-block bg-emerald-50 border border-emerald-200/80 text-[#059669] font-black text-[11px] px-2.5 py-1 rounded-md">
                          +{calculationData.percentageGain}%
                        </span>
                        <div className="text-[10px] font-bold text-slate-400 mt-1">Est. Returns</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-100/80">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Total Invested</div>
                        <div className="text-xs font-black text-slate-800 mt-0.5">
                          ₹{calculationData.totalInvested.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Est. Capital Gain</div>
                        <div className="text-xs font-black text-[#059669] mt-0.5">
                          +₹{calculationData.estimatedReturn.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] font-semibold text-slate-400 mt-2 leading-tight pt-2 border-t border-slate-200/50">
                      Returns are calculated @ ~11% p.a. expected growth. Actual performance may vary.
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 3: Key Benefits & Plan Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Key Benefits (Left 2 cols) */}
                <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-[28px] p-6 md:p-7 shadow-2xs">
                  <h3 className="text-base font-black text-slate-900 tracking-tight mb-4">
                    Key Benefits
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Benefit 1 */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100/80 text-[#6D28D9] flex items-center justify-center shrink-0 mt-0.5">
                        <CalendarIcon size={20} strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">Discipline</div>
                        <div className="text-[11px] font-semibold text-slate-500 mt-0.5 leading-snug">
                          Build a habit of saving {activePlanData?.id === 'weekly' ? 'every week' : activePlanData?.id === 'monthly' ? 'every month' : 'every single day'}.
                        </div>
                      </div>
                    </div>

                    {/* Benefit 2 */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-[#059669] flex items-center justify-center shrink-0 mt-0.5">
                        <TrendingUp size={20} strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">Wealth Creation</div>
                        <div className="text-[11px] font-semibold text-slate-500 mt-0.5 leading-snug">
                          Small savings today, big wealth tomorrow.
                        </div>
                      </div>
                    </div>

                    {/* Benefit 3 */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-[#D97706] flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles size={20} strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">Liquidity</div>
                        <div className="text-[11px] font-semibold text-slate-500 mt-0.5 leading-snug">
                          Redeem your gold anytime you need.
                        </div>
                      </div>
                    </div>

                    {/* Benefit 4 */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100/80 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Shield size={20} strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">No Hidden Charges</div>
                        <div className="text-[11px] font-semibold text-slate-500 mt-0.5 leading-snug">
                          Transparent pricing with zero hidden fees.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plan Summary (Right 1 col) */}
                <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 shadow-2xs flex flex-col justify-between space-y-3">
                  <h3 className="text-base font-black text-slate-900 tracking-tight mb-1">
                    Plan Summary
                  </h3>

                  <div className="space-y-2.5 divide-y divide-slate-100">
                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="font-semibold text-slate-500">Plan Name</span>
                      <span className="font-black text-slate-900">{activePlanData?.type}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-2">
                      <span className="font-semibold text-slate-500">Investment Type</span>
                      <span className="font-black text-slate-900">
                        Auto-Invest ({activePlanData?.id === 'weekly' ? 'Weekly' : activePlanData?.id === 'monthly' ? 'Monthly' : 'Daily'})
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-2">
                      <span className="font-semibold text-slate-500">Minimum Amount</span>
                      <span className="font-black text-slate-900">{activePlanData?.amount}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-2">
                      <span className="font-semibold text-slate-500">Invested In</span>
                      <span className="font-black text-slate-900">
                        {selectedMetal === 'silver' ? '999 Pure Digital Silver' : '24K Pure Digital Gold'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-2">
                      <span className="font-semibold text-slate-500">Lock-in Period</span>
                      <span className="font-black text-slate-900">No Lock-in</span>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-2">
                      <span className="font-semibold text-slate-500">Payout</span>
                      <span className="font-black text-slate-900">
                        {selectedMetal === 'silver' ? 'Silver in grams' : 'Gold in grams'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom CTA Banner */}
              <div className="bg-[#6D28D9] rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-purple-900/15 relative overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0 text-amber-300">
                    <Clock size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                      Start your {activePlanData?.type} journey today!
                    </h3>
                    <p className="text-xs font-semibold text-purple-200 mt-0.5">
                      Invest ₹{sipAmount} per {activePlanData?.id === 'weekly' ? 'week' : activePlanData?.id === 'monthly' ? 'month' : 'day'} and build your {selectedMetal === 'silver' ? 'silver' : 'golden'} future.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (isMobile && activePlanData) {
                      handleSetupPlanClick(activePlanData.id as PlanType, sipAmount);
                    } else {
                      alert(`Initiating ${activePlanData?.type} Mandate @ ₹${sipAmount}...`);
                    }
                  }}
                  className="bg-white hover:bg-purple-50 text-[#6D28D9] font-black text-xs sm:text-sm px-6 py-3 rounded-full flex items-center gap-2 shadow-md transition-all cursor-pointer border-none outline-none shrink-0 self-stretch sm:self-auto justify-center"
                >
                  <span>Set Up SIP Mandate</span>
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile SIP Setup Overlays & Sheets */}
        <AnimatePresence>
          {mobileSipStep !== 'none' && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
              
              {/* 1. DAILY SIP TENURE & RETURNS MODAL */}
              {mobileSipStep === 'daily_tenure' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-md bg-white rounded-[32px] p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 border border-purple-100 max-h-[85vh] overflow-y-auto my-auto"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#6D28D9] flex items-center justify-center font-black">
                        <Clock size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black tracking-wider uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
                          DAILY SIP SETUP
                        </span>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                          Tenure & Expected Returns
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={() => setMobileSipStep('none')}
                      className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors border-none outline-none cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                    Set up your recurring daily investment of ₹{sipAmount}/day and preview expected returns.
                  </p>

                  {/* Tenure Selector */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock size={14} className="text-[#6D28D9]" />
                        <span>Investment Tenure</span>
                      </label>
                      <span className="text-xs font-extrabold text-[#6D28D9] bg-purple-100 px-2.5 py-0.5 rounded-full">
                        {sipDuration} {sipDuration === 1 ? 'Year' : 'Years'}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {[1, 3, 5, 10].map((years) => (
                        <button
                          key={years}
                          type="button"
                          onClick={() => setSipDuration(years)}
                          className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border-none outline-none ${
                            sipDuration === years
                              ? 'bg-[#6D28D9] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {years} {years === 1 ? 'Yr' : 'Yrs'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Expected Returns Box */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50/60 border border-purple-200/80 rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs pb-1 border-b border-purple-200/50">
                      <span className="font-extrabold text-slate-600 flex items-center gap-1">
                        <TrendingUp size={14} className="text-emerald-600" />
                        Expected Returns ({sipDuration} {sipDuration === 1 ? 'Year' : 'Years'})
                      </span>
                      <span className="font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md text-[11px]">
                        +{calculationData.percentageGain}%
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-left pt-0.5">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Invested</div>
                        <div className="text-xs font-black text-slate-900 mt-0.5">
                          ₹{calculationData.totalInvested.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Est. Gain</div>
                        <div className="text-xs font-black text-emerald-600 mt-0.5">
                          +₹{calculationData.estimatedReturn.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Total Value</div>
                        <div className="text-xs font-black text-purple-900 mt-0.5">
                          ₹{calculationData.totalValue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setMobileSipStep('success')}
                    className="w-full py-3.5 rounded-2xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 border-none outline-none cursor-pointer transition-all mt-2"
                  >
                    <span>Confirm & Set Daily SIP</span>
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </button>
                </motion.div>
              )}

              {/* 2. WEEKLY DAY SELECTION & TENURE MODAL */}
              {mobileSipStep === 'day_select' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-md bg-white rounded-[32px] p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 border border-amber-100 max-h-[85vh] overflow-y-auto my-auto"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 text-[#059669] flex items-center justify-center font-black">
                        <CalendarIcon size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black tracking-wider uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                          {selectedMetal === 'silver' ? 'SILVER WEEKLY SIP SCHEDULE' : 'WEEKLY SIP SCHEDULE'}
                        </span>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                          Which day of every week?
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={() => setMobileSipStep('none')}
                      className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors border-none outline-none cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                    Select day of the week for your ₹{sipAmount} weekly {selectedMetal === 'silver' ? 'silver' : 'gold'} SIP.
                  </p>

                  {/* Days Grid */}
                  <div className="space-y-2">
                    {[
                      { day: 'Monday', label: 'Salary Saver • Most Popular' },
                      { day: 'Tuesday', label: 'Mid-Week Habit' },
                      { day: 'Wednesday', label: 'Consistent Growth' },
                      { day: 'Thursday', label: 'Pre-Weekend SIP' },
                      { day: 'Friday', label: 'Payday Favourite' },
                      { day: 'Saturday', label: 'Weekend Auto-Save' },
                      { day: 'Sunday', label: 'Sunday Wealth Plan' }
                    ].map(({ day, label }) => {
                      const isSelected = selectedWeeklyDay === day;
                      return (
                        <div
                          key={day}
                          onClick={() => setSelectedWeeklyDay(day)}
                          className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50/70 text-slate-900 shadow-xs'
                              : 'border-slate-200/80 bg-white hover:border-emerald-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                              isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {day.slice(0, 3)}
                            </div>
                            <div>
                              <div className="text-sm font-extrabold text-slate-900">{day}</div>
                              <div className="text-[11px] font-semibold text-slate-400">{label}</div>
                            </div>
                          </div>

                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                          }`}>
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tenure Selector */}
                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock size={14} className="text-[#059669]" />
                        <span>Investment Tenure</span>
                      </label>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        {sipDuration} {sipDuration === 1 ? 'Year' : 'Years'}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {[1, 3, 5, 10].map((years) => (
                        <button
                          key={years}
                          type="button"
                          onClick={() => setSipDuration(years)}
                          className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer border-none outline-none ${
                            sipDuration === years
                              ? 'bg-[#059669] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {years} {years === 1 ? 'Yr' : 'Yrs'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Expected Returns Box */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200/80 rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs pb-1 border-b border-emerald-200/50">
                      <span className="font-extrabold text-slate-600 flex items-center gap-1">
                        <TrendingUp size={14} className="text-emerald-600" />
                        Expected Returns ({sipDuration} {sipDuration === 1 ? 'Year' : 'Years'})
                      </span>
                      <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-[11px]">
                        +{calculationData.percentageGain}%
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-left pt-0.5">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Invested</div>
                        <div className="text-xs font-black text-slate-900 mt-0.5">
                          ₹{calculationData.totalInvested.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Est. Gain</div>
                        <div className="text-xs font-black text-emerald-600 mt-0.5">
                          +₹{calculationData.estimatedReturn.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Total Value</div>
                        <div className="text-xs font-black text-emerald-900 mt-0.5">
                          ₹{calculationData.totalValue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setMobileSipStep('success')}
                    className="w-full py-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 border-none outline-none cursor-pointer transition-all mt-2"
                  >
                    <span>Confirm & Set Weekly SIP</span>
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </button>
                </motion.div>
              )}

              {/* 3. MONTHLY CALENDAR DATE SELECTION & TENURE MODAL */}
              {mobileSipStep === 'date_select' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-md bg-white rounded-[32px] p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 border border-amber-100 max-h-[85vh] overflow-y-auto my-auto"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-amber-100/80 text-[#D97706] flex items-center justify-center font-black">
                        <CalendarIcon size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black tracking-wider uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                          MONTHLY SIP CALENDAR
                        </span>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                          Which date of every month?
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={() => setMobileSipStep('none')}
                      className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors border-none outline-none cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                    Choose day of month for your recurring ₹{sipAmount} monthly SIP auto-debit.
                  </p>

                  {/* Calendar Grid (1-28) */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs font-black text-slate-700 pb-1 border-b border-slate-200/60">
                      <span>Select Date</span>
                      <span className="text-amber-700 font-extrabold bg-amber-100/70 px-2 py-0.5 rounded-md">
                        Every {selectedMonthlyDate}th of month
                      </span>
                    </div>

                    <div className="grid grid-cols-7 gap-2 pt-1 text-center">
                      {Array.from({ length: 28 }, (_, i) => i + 1).map((dateNum) => {
                        const isSelected = selectedMonthlyDate === dateNum;
                        return (
                          <button
                            key={dateNum}
                            type="button"
                            onClick={() => setSelectedMonthlyDate(dateNum)}
                            className={`h-10 rounded-xl font-extrabold text-sm flex items-center justify-center transition-all cursor-pointer border-none outline-none ${
                              isSelected
                                ? 'bg-[#D97706] text-white shadow-md shadow-amber-600/30 scale-105 font-black'
                                : 'bg-white text-slate-800 hover:bg-amber-50 border border-slate-200/60'
                            }`}
                          >
                            {dateNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tenure Selector */}
                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock size={14} className="text-[#D97706]" />
                        <span>Investment Tenure</span>
                      </label>
                      <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                        {sipDuration} {sipDuration === 1 ? 'Year' : 'Years'}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {[1, 3, 5, 10].map((years) => (
                        <button
                          key={years}
                          type="button"
                          onClick={() => setSipDuration(years)}
                          className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer border-none outline-none ${
                            sipDuration === years
                              ? 'bg-[#D97706] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {years} {years === 1 ? 'Yr' : 'Yrs'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Expected Returns Box */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200/80 rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs pb-1 border-b border-amber-200/50">
                      <span className="font-extrabold text-slate-600 flex items-center gap-1">
                        <TrendingUp size={14} className="text-amber-600" />
                        Expected Returns ({sipDuration} {sipDuration === 1 ? 'Year' : 'Years'})
                      </span>
                      <span className="font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md text-[11px]">
                        +{calculationData.percentageGain}%
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-left pt-0.5">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Invested</div>
                        <div className="text-xs font-black text-slate-900 mt-0.5">
                          ₹{calculationData.totalInvested.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Est. Gain</div>
                        <div className="text-xs font-black text-emerald-600 mt-0.5">
                          +₹{calculationData.estimatedReturn.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Total Value</div>
                        <div className="text-xs font-black text-amber-900 mt-0.5">
                          ₹{calculationData.totalValue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setMobileSipStep('success')}
                    className="w-full py-3.5 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 border-none outline-none cursor-pointer transition-all mt-2"
                  >
                    <span>Confirm & Set Monthly SIP</span>
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </button>
                </motion.div>
              )}

              {/* 4. AUTOPAY SUCCESS / SIP SET SUCCESSFULLY SCREEN */}
              {mobileSipStep === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-md bg-white rounded-[32px] p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 border border-amber-200/80 text-center relative overflow-hidden my-auto max-h-[85vh] overflow-y-auto"
                >
                  {/* Confetti Background Accent */}
                  <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

                  {/* Animated Success Check Badge */}
                  <div className="flex justify-center pt-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.15, 1] }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-500 p-1 shadow-xl shadow-amber-500/20"
                    >
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-emerald-600">
                        <CheckCircle2 size={44} strokeWidth={2.5} className="text-emerald-500" />
                      </div>
                    </motion.div>
                  </div>

                  <div>
                    <span className="inline-block bg-emerald-100 text-emerald-800 font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider mb-1.5 border border-emerald-200">
                      AUTOPAY VERIFIED & ACTIVE
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      SIP Set Successfully!
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      Your {selectedMetal === 'silver' ? '999 Pure Digital Silver' : '24K Pure Digital Gold'} SIP is configured & ready.
                    </p>
                  </div>

                  {/* Receipt / Details Box */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-3">
                    <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/60">
                      <span className="font-semibold text-slate-500">Plan Type</span>
                      <span className="font-black text-slate-900 uppercase">
                        {mobileSelectedPlan === 'weekly' ? 'Weekly Savings' : mobileSelectedPlan === 'monthly' ? 'Monthly Savings' : 'Daily Savings'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/60">
                      <span className="font-semibold text-slate-500">SIP Schedule</span>
                      <span className="font-black text-amber-700">
                        {mobileSelectedPlan === 'weekly'
                          ? `Every ${selectedWeeklyDay}`
                          : mobileSelectedPlan === 'monthly'
                          ? `Every ${selectedMonthlyDate}th of month`
                          : 'Daily Auto-Debit'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/60">
                      <span className="font-semibold text-slate-500">Amount & Tenure</span>
                      <span className="font-black text-slate-900 text-xs">
                        ₹{sipAmount} / {mobileSelectedPlan === 'weekly' ? 'week' : mobileSelectedPlan === 'monthly' ? 'month' : 'day'} ({sipDuration} Yrs)
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/60">
                      <span className="font-semibold text-slate-500">Expected Value ({sipDuration} Yrs)</span>
                      <span className="font-black text-emerald-600">
                        ₹{calculationData.totalValue.toLocaleString()} (+{calculationData.percentageGain}%)
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/60">
                      <span className="font-semibold text-slate-500">First Auto-Debit Date</span>
                      <span className="font-extrabold text-slate-800">
                        {getNextAutoPayDate()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-500">Asset</span>
                      <span className="font-black text-slate-900 flex items-center gap-1">
                      <span>{selectedMetal === 'silver' ? '999 Digital Silver' : '24K Digital Gold'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-500">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>100% Insured Storage by Brink's & Regulated Vault</span>
                  </div>

                  {/* Done Button */}
                  <button
                    onClick={() => {
                      setMobileSipStep('none');
                      setActiveSetup(null);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-sm shadow-lg shadow-amber-500/25 border-none outline-none cursor-pointer transition-all"
                  >
                    Done
                  </button>
                </motion.div>
              )}

            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
