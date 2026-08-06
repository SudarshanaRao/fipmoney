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
  Wallet
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
    type: "Daily SIP",
    amount: "₹100 / day",
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
    projected: "₹36,500/yr",
    image: "/daily_savings.png",
    subIcon: Layers,
    subIconBg: "bg-purple-100/70 text-[#6D28D9]",
    subTextTitle: "Small Steps",
    subTextSubtitle: "Big Future",
    defaults: { amount: 100, minAmount: 10, maxAmount: 1000, step: 10 },
    theme: { bg: "bg-purple-600", text: "text-[#6D28D9]", light: "bg-purple-50", dark: "#4c1d95", accent: "#6D28D9" },
    gradient: "linear-gradient(135deg, #4c1d95 0%, #6D28D9 100%)"
  },
  {
    id: "weekly",
    type: "Weekly SIP",
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
    type: "Monthly SIP",
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
  const [sipAmount, setSipAmount] = useState<number>(100);
  const [sipDuration, setSipDuration] = useState<number>(5);

  const handleOpenSetup = (planId: PlanType) => {
    setActiveSetup(planId);
    const plan = savingsPlans.find(p => p.id === planId);
    if (plan) {
      setSipAmount(plan.defaults.amount);
      setSipDuration(5);
    }
  };

  const handleCloseSetup = () => {
    setActiveSetup(null);
  };

  const activePlanData = useMemo(() => savingsPlans.find(p => p.id === activeSetup), [activeSetup]);

  const calculationData = useMemo(() => {
    if (!activePlanData) return { chartData: [], totalInvested: 0, estimatedReturn: 0, totalValue: 0 };

    let periodsPerYear = 12;
    if (activePlanData.id === 'daily') periodsPerYear = 365;
    if (activePlanData.id === 'weekly') periodsPerYear = 52;

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

    return {
      chartData,
      totalInvested: Math.round(currentInvested),
      estimatedReturn: Math.round(currentValue - currentInvested),
      totalValue: Math.round(currentValue)
    };
  }, [activePlanData, sipAmount, sipDuration]);

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

        <AnimatePresence mode="wait">
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

              {/* Your Savings Goals Section */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[#6D28D9]">
                      <Target size={14} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight">
                        Your Savings Goals
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        Track and manage all your gold savings goals in one place.
                      </p>
                    </div>
                  </div>

                  <button className="text-xs font-black text-[#6D28D9] hover:text-purple-900 flex items-center gap-1 transition-colors cursor-pointer bg-transparent border-none outline-none">
                    <span>View All Goals</span>
                    <ChevronRight size={14} strokeWidth={2.5} />
                  </button>
                </div>

                {/* 4 Summary Metric Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Total Invested */}
                  <div className="bg-[#F8F9FE] border border-purple-100/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-xs font-bold text-[#6D28D9]">Total Invested</span>
                      <div className="text-xl font-black text-slate-900 tracking-tight mt-1">
                        ₹12,450.00
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">
                        Across all plans
                      </span>
                    </div>
                    <div className="w-11 h-11 rounded-full bg-purple-100/70 text-[#6D28D9] flex items-center justify-center shrink-0">
                      <Wallet size={20} strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* Card 2: Current Gold Value */}
                  <div className="bg-[#FFFDF5] border border-amber-100/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-xs font-bold text-[#D97706]">Current Gold Value</span>
                      <div className="text-xl font-black text-slate-900 tracking-tight mt-1">
                        ₹13,230.50
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">
                        Live market value
                      </span>
                    </div>
                    <div className="w-11 h-11 rounded-full bg-amber-100/70 text-[#D97706] flex items-center justify-center shrink-0">
                      <Sparkles size={20} strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* Card 3: Total Gold Owned */}
                  <div className="bg-[#F8FAFC] border border-indigo-100/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-xs font-bold text-indigo-600">Total Gold Owned</span>
                      <div className="text-xl font-black text-slate-900 tracking-tight mt-1">
                        0.1523 g
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">
                        24K pure gold
                      </span>
                    </div>
                    <div className="w-11 h-11 rounded-full bg-indigo-100/70 text-indigo-600 flex items-center justify-center shrink-0">
                      <Scale size={20} strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* Card 4: Total Returns */}
                  <div className="bg-[#F0FDF4]/60 border border-emerald-100/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-xs font-bold text-[#059669]">Total Returns</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xl font-black text-slate-900 tracking-tight">₹780.50</span>
                        <span className="text-[10px] font-extrabold text-[#059669] bg-emerald-100/80 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                          ▲ 6.27%
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">
                        Overall gain
                      </span>
                    </div>
                    <div className="w-11 h-11 rounded-full bg-emerald-100/70 text-[#059669] flex items-center justify-center shrink-0">
                      <ArrowUpRight size={22} strokeWidth={2.5} />
                    </div>
                  </div>
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
            /* Interactive SIP Plan Setup & Calculator View */
            <motion.div
              key="setup-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Setup Top Bar */}
              <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                <button
                  onClick={handleCloseSetup}
                  className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm outline-none cursor-pointer"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    Set up {activePlanData?.type}
                  </h1>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                    Configure your wealth engine
                  </p>
                </div>
              </div>

              {/* Split Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                {/* Left Panel: Growth Visualizer */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col justify-between min-h-[500px] shadow-2xl">
                  <div
                    className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] opacity-20 pointer-events-none"
                    style={{ backgroundColor: activePlanData?.theme.accent }}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[100px] opacity-10 pointer-events-none"
                    style={{ backgroundColor: activePlanData?.theme.accent }}
                  />

                  <div className="relative z-10 space-y-2 mb-8">
                    <h3 className="text-3xl font-black text-white">The Power of Compounding</h3>
                    <p className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                      <Info size={14} /> Assuming a conservative ~11% historical p.a. return on Gold.
                    </p>
                  </div>

                  <div className="relative z-10 w-full h-[300px] mt-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={calculationData.chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold' }} />
                        <Bar dataKey="Invested" stackId="a" fill="#334155" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="Returns" stackId="a" fill={activePlanData?.theme.accent} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right Panel: Configuration Engine */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
                  <div className="space-y-8">
                    {/* Amount Slider */}
                    <div>
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <label className="text-sm font-black text-slate-800 uppercase tracking-wider">
                            {activePlanData?.type} Amount
                          </label>
                          <p className="text-xs font-semibold text-slate-400 mt-1">
                            How much to invest each {activePlanData?.id}?
                          </p>
                        </div>
                        <div className={`text-3xl font-black ${activePlanData?.theme.text}`}>
                          ₹{sipAmount.toLocaleString()}
                        </div>
                      </div>

                      <div className="relative py-4">
                        <input
                          type="range"
                          min={activePlanData?.defaults.minAmount}
                          max={activePlanData?.defaults.maxAmount}
                          step={activePlanData?.defaults.step}
                          value={sipAmount}
                          onChange={(e) => setSipAmount(Number(e.target.value))}
                          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-current"
                          style={{ accentColor: activePlanData?.theme.accent }}
                        />
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
                          <span>₹{activePlanData?.defaults.minAmount.toLocaleString()}</span>
                          <span>₹{activePlanData?.defaults.maxAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Duration Slider */}
                    <div>
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <label className="text-sm font-black text-slate-800 uppercase tracking-wider">
                            Investment Duration
                          </label>
                          <p className="text-xs font-semibold text-slate-400 mt-1">For how long?</p>
                        </div>
                        <div className="text-3xl font-black text-slate-800">
                          {sipDuration} <span className="text-lg text-slate-400">Years</span>
                        </div>
                      </div>

                      <div className="relative py-4">
                        <input
                          type="range"
                          min={1}
                          max={10}
                          step={1}
                          value={sipDuration}
                          onChange={(e) => setSipDuration(Number(e.target.value))}
                          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-800"
                        />
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
                          <span>1 Yr</span>
                          <span>10 Yrs</span>
                        </div>
                      </div>
                    </div>

                    {/* Summary Box */}
                    <div className={`p-6 rounded-3xl ${activePlanData?.theme.light} border border-white/50 relative overflow-hidden`}>
                      <div className="relative z-10 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-600">Total Invested</span>
                          <span className="text-base font-black text-slate-900">
                            ₹{calculationData.totalInvested.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-600">Est. Returns (11%)</span>
                          <span className={`text-base font-black ${activePlanData?.theme.text}`}>
                            +₹{calculationData.estimatedReturn.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full h-px bg-slate-200/50" />
                        <div className="flex justify-between items-end pt-2">
                          <span className="text-sm font-black text-slate-900 uppercase tracking-wider">
                            Total Value
                          </span>
                          <span className="text-3xl font-black text-slate-900 tracking-tight">
                            ₹{calculationData.totalValue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-8">
                    <button
                      className="w-full py-4 rounded-[1.5rem] font-black text-lg text-white shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center gap-2 border-none cursor-pointer outline-none"
                      style={{
                        background: activePlanData?.gradient,
                        boxShadow: `0 10px 25px -5px ${activePlanData?.theme.accent}60`
                      }}
                      onClick={() => alert(`Initiating Mandate for ${activePlanData?.type} @ ₹${sipAmount}...`)}
                    >
                      <CheckCircle2 size={22} /> Start {activePlanData?.type} Now
                    </button>
                    <p className="text-center text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-widest">
                      Cancel or pause anytime. No hidden fees.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
