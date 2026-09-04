import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Shield,
  Layers,
  Scale,
  Calendar as CalendarIcon,
  CheckCircle2,
  X,
  Check,
  ChevronLeft,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

type PlanType = 'daily' | 'weekly' | 'monthly' | null;

// --- Banner Ribbon Tag Component ---
export function SilverBannerTag({
  text,
  color = "#334155",
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

// --- Silver Savings Plans Configuration ---
const silverSavingsPlans = [
  {
    id: "daily",
    type: "Daily Silver Savings",
    amount: "₹10 / day",
    desc: "Micro-savings in 999 Pure Silver that build massive wealth over time.",
    tag: "MOST POPULAR",
    tagColorHex: "#334155",
    tagWidth: 145,
    tagBg: "bg-slate-700",
    btnBg: "bg-slate-800 hover:bg-slate-900",
    pillBorder: "border-slate-300",
    pillBg: "bg-slate-100",
    pillText: "text-slate-800",
    suggestedBoxBg: "bg-slate-50 border-slate-200",
    amountColor: "text-slate-900",
    projected: "₹3,650/yr",
    image: "/silver_daily.png",
    subIcon: Layers,
    subIconBg: "bg-slate-200 text-slate-800",
    subTextTitle: "Small Steps",
    subTextSubtitle: "Silver Future",
    defaults: { amount: 10, minAmount: 10, maxAmount: 1000, step: 10 },
    theme: { bg: "bg-slate-700", text: "text-slate-800", light: "bg-slate-50", dark: "#0f172a", accent: "#334155" },
    gradient: "linear-gradient(135deg, #0f172a 0%, #334155 100%)"
  },
  {
    id: "weekly",
    type: "Weekly Silver Savings",
    amount: "₹500 / week",
    desc: "Steady weekly 999 Silver savings matching your weekly routine.",
    tag: "STEADY GROWTH",
    tagColorHex: "#0284C7",
    tagWidth: 150,
    tagBg: "bg-sky-600",
    btnBg: "bg-sky-600 hover:bg-sky-700",
    pillBorder: "border-sky-200",
    pillBg: "bg-sky-50",
    pillText: "text-sky-700",
    suggestedBoxBg: "bg-sky-50/60 border-sky-100",
    amountColor: "text-sky-700",
    projected: "₹26,000/yr",
    image: "/silver_weekly.png",
    subIcon: TrendingUp,
    subIconBg: "bg-sky-100 text-sky-700",
    subTextTitle: "Stay Consistent",
    subTextSubtitle: "Silver Growth",
    defaults: { amount: 500, minAmount: 100, maxAmount: 10000, step: 100 },
    theme: { bg: "bg-sky-600", text: "text-sky-700", light: "bg-sky-50", dark: "#075985", accent: "#0284c7" },
    gradient: "linear-gradient(135deg, #075985 0%, #0284c7 100%)"
  },
  {
    id: "monthly",
    type: "Monthly Silver Savings",
    amount: "₹2,000 / month",
    desc: "Serious wealth creation directly in 999 Pure Digital Silver.",
    tag: "WEALTH BUILDER",
    tagColorHex: "#475569",
    tagWidth: 155,
    tagBg: "bg-slate-600",
    btnBg: "bg-slate-900 hover:bg-black",
    pillBorder: "border-slate-300",
    pillBg: "bg-slate-100",
    pillText: "text-slate-800",
    suggestedBoxBg: "bg-slate-50 border-slate-200",
    amountColor: "text-slate-900",
    projected: "₹24,000/yr",
    image: "/silver_monthly.png",
    subIcon: Scale,
    subIconBg: "bg-slate-200 text-slate-800",
    subTextTitle: "Build Wealth",
    subTextSubtitle: "Secure Silver",
    defaults: { amount: 2000, minAmount: 500, maxAmount: 50000, step: 500 },
    theme: { bg: "bg-slate-800", text: "text-slate-800", light: "bg-slate-100", dark: "#0f172a", accent: "#1e293b" },
    gradient: "linear-gradient(135deg, #0f172a 0%, #334155 100%)"
  }
];

const ANNUAL_RETURN_RATE = 0.11;

export default function SilverSavingsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
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
      sessionStorage.setItem('fm_setup_metal', 'silver');
      sessionStorage.setItem('fm_setup_plan', planId);
    }
    if (onNavigate) {
      onNavigate('setup-silver-sip');
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

  const activePlanData = useMemo(() => silverSavingsPlans.find(p => p.id === (activeSetup || mobileSelectedPlan)), [activeSetup, mobileSelectedPlan]);

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
            <span className="font-black text-sky-400">₹{payload[0].payload.Total.toLocaleString()}</span>
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
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Silver SIP Savings</span>
                    <span className="text-sm bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-0.5 rounded-full font-bold">
                      999 Pure Silver
                    </span>
                  </h1>
                  <p className="text-xs md:text-sm font-medium text-slate-500 mt-1">
                    Discipline today, prosperity tomorrow. Automate your savings in 999 pure Digital Silver.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full border border-slate-200 shadow-xs self-start md:self-auto">
                  <ShieldCheck size={16} className="text-slate-700" />
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    100% SECURE & REGULATED
                  </span>
                </div>
              </div>

              {/* Choose Your Plan Title */}
              <div>
                <div className="flex items-center gap-2 text-xs md:text-sm font-extrabold uppercase tracking-wider text-slate-700 mb-4">
                  <TrendingUp size={16} className="text-slate-700" />
                  <span>CHOOSE YOUR SILVER PLAN</span>
                </div>

                {/* 3 Silver SIP Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {silverSavingsPlans.map((plan) => {
                    const SubIcon = plan.subIcon;

                    return (
                      <div
                        key={plan.id}
                        onClick={() => handleOpenSetup(plan.id as PlanType)}
                        className="bg-white border border-slate-200/90 rounded-[28px] p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between cursor-pointer group hover:-translate-y-1 overflow-hidden"
                      >
                        {/* Top Ribbon Tag */}
                        <SilverBannerTag text={plan.tag} color={plan.tagColorHex} />

                        <div>
                          {/* Main Graphic Illustration */}
                          <div className="w-full h-36 rounded-2xl bg-gradient-to-b from-slate-100/60 to-slate-50/20 flex items-center justify-center mb-5 p-3 relative overflow-hidden group-hover:scale-102 transition-transform duration-300">
                            <img
                              src={plan.image}
                              alt={plan.type}
                              className="h-28 object-contain drop-shadow-md z-10"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/20 via-transparent to-transparent pointer-events-none" />
                          </div>

                          {/* Plan Name & Tagline */}
                          <h3 className="text-lg font-black text-slate-900 tracking-tight">
                            {plan.type}
                          </h3>
                          <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed min-h-[36px]">
                            {plan.desc}
                          </p>

                          {/* Sub-Feature Badge */}
                          <div className="mt-4 inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100/70 border border-slate-200/60">
                            <div className={`p-1.5 rounded-lg ${plan.subIconBg}`}>
                              <SubIcon size={14} />
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider">
                                {plan.subTextTitle}
                              </span>
                              <span className="text-[11px] font-semibold text-slate-500">
                                {plan.subTextSubtitle}
                              </span>
                            </div>
                          </div>

                          {/* Key Numbers / Dynamic Pill */}
                          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                            <div>
                              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                Starting From
                              </div>
                              <div className={`text-xl font-black ${plan.amountColor} mt-0.5`}>
                                {plan.amount}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                Projected
                              </div>
                              <div className="text-xs font-black text-emerald-600 mt-0.5">
                                {plan.projected}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-6">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenSetup(plan.id as PlanType);
                            }}
                            className={`w-full py-3 rounded-xl ${plan.btnBg} text-white font-black text-xs sm:text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition-all border-none cursor-pointer outline-none group-hover:gap-3`}
                          >
                            <span>Setup Plan</span>
                            <ArrowRight size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Security & Vault Guarantee Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-[28px] p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0 text-slate-200">
                    <ShieldCheck size={26} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white tracking-tight">
                      100% Insured 999 Digital Silver Storage
                    </h4>
                    <p className="text-xs font-medium text-slate-300 mt-0.5">
                      Your Silver is stored in Brink's physical vaults and audited by independent trustees.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-extrabold bg-slate-800 text-slate-200 border border-slate-600 px-3.5 py-1.5 rounded-full">
                    99.9% Purity Certified
                  </span>
                </div>
              </div>

            </motion.div>
          ) : (

            /* --- DESKTOP SETUP SIP CALCULATOR & VIEW --- */
            <motion.div
              key="setup-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Back Button Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                <button
                  onClick={handleCloseSetup}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-extrabold text-sm transition-colors border-none bg-transparent cursor-pointer outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                    <ChevronLeft size={18} />
                  </div>
                  <span>Back to Silver Plans</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${activePlanData?.pillBg} ${activePlanData?.pillText} border ${activePlanData?.pillBorder}`}>
                    {activePlanData?.type}
                  </span>
                </div>
              </div>

              {/* Setup Main 2-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Left Controls Card (5 cols) */}
                <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-[28px] p-6 md:p-7 shadow-xs space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      Customize Your {activePlanData?.type}
                    </h2>
                    <p className="text-xs font-medium text-slate-500 mt-1">
                      Adjust your contribution & duration to calculate projected returns in 999 Pure Silver.
                    </p>
                  </div>

                  {/* Amount Slider */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                        Investment Amount
                      </label>
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl">
                        <span className="text-xs font-bold text-slate-400">₹</span>
                        <input
                          type="number"
                          value={sipAmount}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setSipAmount(val);
                          }}
                          className="w-20 text-sm font-black text-slate-900 bg-transparent text-right outline-none border-none"
                        />
                      </div>
                    </div>

                    <input
                      type="range"
                      min={activePlanData?.defaults.minAmount || 10}
                      max={activePlanData?.defaults.maxAmount || 50000}
                      step={activePlanData?.defaults.step || 10}
                      value={sipAmount}
                      onChange={(e) => setSipAmount(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                    />

                    {/* Quick Amount Selector Pills */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {[
                        activePlanData?.defaults.amount || 10,
                        (activePlanData?.defaults.amount || 10) * 2,
                        (activePlanData?.defaults.amount || 10) * 5,
                        (activePlanData?.defaults.amount || 10) * 10
                      ].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setSipAmount(amt)}
                          className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                            sipAmount === amt
                              ? 'bg-slate-800 text-white border-slate-800 shadow-2xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          ₹{amt.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration Slider */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                        Investment Horizon
                      </label>
                      <span className="text-xs font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-xl">
                        {sipDuration} {sipDuration === 1 ? 'Year' : 'Years'}
                      </span>
                    </div>

                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={sipDuration}
                      onChange={(e) => setSipDuration(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                    />

                    <div className="flex justify-between text-[10px] font-extrabold text-slate-400">
                      <span>1 Year</span>
                      <span>5 Years</span>
                      <span>10 Years</span>
                    </div>
                  </div>

                  {/* Setup Mandate CTA Button */}
                  <div className="pt-4">
                    <button
                      onClick={() => handleSetupPlanClick(activePlanData?.id as PlanType, sipAmount)}
                      className={`w-full py-4 rounded-2xl ${activePlanData?.btnBg} text-white font-black text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all border-none cursor-pointer outline-none`}
                    >
                      <span>Proceed to Mandate</span>
                      <ArrowRight size={18} strokeWidth={2.5} />
                    </button>

                    <p className="text-[11px] font-semibold text-center text-slate-400 mt-2.5 flex items-center justify-center gap-1">
                      <ShieldCheck size={14} className="text-slate-600" />
                      <span>Zero setup fee • Pause or cancel anytime</span>
                    </p>
                  </div>
                </div>

                {/* Right Analytics & Chart Card (7 cols) */}
                <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-[28px] p-6 md:p-7 shadow-xs space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      Growth Projection (999 Digital Silver)
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      Estimated returns calculated at ~11% historical annualized growth.
                    </p>
                  </div>

                  {/* Growth Chart */}
                  <div className="h-64 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={calculationData.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="silverTotalGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="silverInvestedGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#64748b" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94A3B8' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94A3B8' }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="Total" name="Total Value" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#silverTotalGrad)" />
                        <Area type="monotone" dataKey="Invested" name="Invested Amount" stroke="#64748b" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#silverInvestedGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Summary Breakdown Stats */}
                  <div className="grid grid-cols-3 gap-3 bg-slate-50/80 border border-slate-200/60 rounded-2xl p-4">
                    <div>
                      <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                        Invested
                      </div>
                      <div className="text-sm font-black text-slate-900 mt-1">
                        ₹{calculationData.totalInvested.toLocaleString()}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                        Est. Returns
                      </div>
                      <div className="text-sm font-black text-sky-600 mt-1">
                        +₹{calculationData.estimatedReturn.toLocaleString()}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                        Total Value
                      </div>
                      <div className="text-base font-black text-slate-900 mt-0.5">
                        ₹{calculationData.totalValue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Key Benefits & Plan Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Key Benefits */}
                <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-[28px] p-6 md:p-7 shadow-2xs">
                  <h3 className="text-base font-black text-slate-900 tracking-tight mb-4">
                    Key Benefits of Silver SIP
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        <CalendarIcon size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">Habitual Discipline</div>
                        <div className="text-[11px] font-semibold text-slate-500 mt-0.5 leading-snug">
                          Build consistent silver accumulation without market timing stress.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        <TrendingUp size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">Silver Growth Potential</div>
                        <div className="text-[11px] font-semibold text-slate-500 mt-0.5 leading-snug">
                          Capitalize on industrial silver demand & global metal appreciation.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">100% Instant Liquidity</div>
                        <div className="text-[11px] font-semibold text-slate-500 mt-0.5 leading-snug">
                          Sell or convert your silver to cash 24/7 directly to bank account.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        <Shield size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">Transparent & Secure</div>
                        <div className="text-[11px] font-semibold text-slate-500 mt-0.5 leading-snug">
                          Zero hidden charges with 100% physical vault backing.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plan Summary */}
                <div className="bg-white border border-slate-200/80 rounded-[28px] p-6 shadow-2xs flex flex-col justify-between space-y-3">
                  <h3 className="text-base font-black text-slate-900 tracking-tight mb-1">
                    Silver Plan Summary
                  </h3>

                  <div className="space-y-2.5 divide-y divide-slate-100">
                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="font-semibold text-slate-500">Plan Name</span>
                      <span className="font-black text-slate-900">{activePlanData?.type}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-2">
                      <span className="font-semibold text-slate-500">Asset</span>
                      <span className="font-black text-slate-900">999 Pure Digital Silver</span>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-2">
                      <span className="font-semibold text-slate-500">Minimum Amount</span>
                      <span className="font-black text-slate-900">{activePlanData?.amount}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-2">
                      <span className="font-semibold text-slate-500">Lock-in Period</span>
                      <span className="font-black text-slate-900">No Lock-in</span>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-2">
                      <span className="font-semibold text-slate-500">Payout</span>
                      <span className="font-black text-slate-900">Silver in grams</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom CTA Banner */}
              <div className="bg-slate-900 rounded-[28px] p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-slate-800 relative overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0 text-sky-400">
                    <Clock size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                      Start your {activePlanData?.type} today!
                    </h3>
                    <p className="text-xs font-semibold text-slate-300 mt-0.5">
                      Invest ₹{sipAmount} per {activePlanData?.id === 'weekly' ? 'week' : activePlanData?.id === 'monthly' ? 'month' : 'day'} and build your silver wealth.
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
                  className="bg-sky-600 hover:bg-sky-500 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-full flex items-center gap-2 shadow-md transition-all cursor-pointer border-none outline-none shrink-0 self-stretch sm:self-auto justify-center"
                >
                  <span>Set Up Silver SIP Mandate</span>
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile SIP Setup Overlays & Sheets */}
        <AnimatePresence>
          {mobileSipStep !== 'none' && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
              
              {/* 1. DAILY SILVER SIP TENURE & RETURNS MODAL */}
              {mobileSipStep === 'daily_tenure' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-md bg-white rounded-[32px] p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 border border-slate-200 max-h-[85vh] overflow-y-auto my-auto"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-black">
                        <Clock size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black tracking-wider uppercase text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          DAILY SILVER SIP SETUP
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
                    Set up your recurring daily silver investment of ₹{sipAmount}/day and preview expected returns.
                  </p>

                  {/* Tenure Selector */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock size={14} className="text-slate-700" />
                        <span>Investment Tenure</span>
                      </label>
                      <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full">
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
                              ? 'bg-slate-800 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {years} {years === 1 ? 'Yr' : 'Yrs'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Expected Returns Box */}
                  <div className="bg-gradient-to-br from-slate-50 to-sky-50/60 border border-slate-200 rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-200">
                      <span className="font-extrabold text-slate-600 flex items-center gap-1">
                        <TrendingUp size={14} className="text-sky-600" />
                        Expected Returns ({sipDuration} {sipDuration === 1 ? 'Year' : 'Years'})
                      </span>
                      <span className="font-black text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md text-[11px]">
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
                        <div className="text-xs font-black text-sky-600 mt-0.5">
                          +₹{calculationData.estimatedReturn.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Total Value</div>
                        <div className="text-xs font-black text-slate-900 mt-0.5">
                          ₹{calculationData.totalValue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setMobileSipStep('success')}
                    className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg border-none outline-none cursor-pointer transition-all mt-2"
                  >
                    <span>Confirm & Set Daily Silver SIP</span>
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
                  className="w-full max-w-md bg-white rounded-[32px] p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 border border-sky-100 max-h-[85vh] overflow-y-auto my-auto"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-black">
                        <CalendarIcon size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black tracking-wider uppercase text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                          SILVER WEEKLY SIP SCHEDULE
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
                    Select day of the week for your ₹{sipAmount} weekly silver SIP.
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
                              ? 'border-sky-500 bg-sky-50/70 text-slate-900 shadow-xs'
                              : 'border-slate-200/80 bg-white hover:border-sky-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                              isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {day.slice(0, 3)}
                            </div>
                            <div>
                              <div className="text-sm font-extrabold text-slate-900">{day}</div>
                              <div className="text-[11px] font-semibold text-slate-400">{label}</div>
                            </div>
                          </div>

                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-sky-600 bg-sky-600 text-white' : 'border-slate-300'
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
                        <Clock size={14} className="text-sky-700" />
                        <span>Investment Tenure</span>
                      </label>
                      <span className="text-xs font-extrabold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full">
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
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {years} {years === 1 ? 'Yr' : 'Yrs'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Expected Returns Box */}
                  <div className="bg-gradient-to-br from-sky-50 to-slate-50 border border-sky-200/80 rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs pb-1 border-b border-sky-200/50">
                      <span className="font-extrabold text-slate-600 flex items-center gap-1">
                        <TrendingUp size={14} className="text-sky-600" />
                        Expected Returns ({sipDuration} {sipDuration === 1 ? 'Year' : 'Years'})
                      </span>
                      <span className="font-black text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md text-[11px]">
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
                        <div className="text-xs font-black text-sky-600 mt-0.5">
                          +₹{calculationData.estimatedReturn.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Total Value</div>
                        <div className="text-xs font-black text-slate-900 mt-0.5">
                          ₹{calculationData.totalValue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setMobileSipStep('success')}
                    className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20 border-none outline-none cursor-pointer transition-all mt-2"
                  >
                    <span>Confirm & Set Weekly Silver SIP</span>
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
                  className="w-full max-w-md bg-white rounded-[32px] p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 border border-slate-200 max-h-[85vh] overflow-y-auto my-auto"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-black">
                        <CalendarIcon size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black tracking-wider uppercase text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          SILVER MONTHLY CALENDAR
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
                    Choose day of month for your recurring ₹{sipAmount} monthly silver SIP auto-debit.
                  </p>

                  {/* Calendar Grid (1-28) */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs font-black text-slate-700 pb-1 border-b border-slate-200/60">
                      <span>Select Date</span>
                      <span className="text-slate-800 font-extrabold bg-slate-200 px-2 py-0.5 rounded-md">
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
                                ? 'bg-slate-800 text-white shadow-md scale-105 font-black'
                                : 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-200/60'
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
                        <Clock size={14} className="text-slate-700" />
                        <span>Investment Tenure</span>
                      </label>
                      <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full">
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
                              ? 'bg-slate-800 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {years} {years === 1 ? 'Yr' : 'Yrs'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Expected Returns Box */}
                  <div className="bg-gradient-to-br from-slate-50 to-sky-50/60 border border-slate-200 rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-200">
                      <span className="font-extrabold text-slate-600 flex items-center gap-1">
                        <TrendingUp size={14} className="text-sky-600" />
                        Expected Returns ({sipDuration} {sipDuration === 1 ? 'Year' : 'Years'})
                      </span>
                      <span className="font-black text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md text-[11px]">
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
                        <div className="text-xs font-black text-sky-600 mt-0.5">
                          +₹{calculationData.estimatedReturn.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Total Value</div>
                        <div className="text-xs font-black text-slate-900 mt-0.5">
                          ₹{calculationData.totalValue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setMobileSipStep('success')}
                    className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg border-none outline-none cursor-pointer transition-all mt-2"
                  >
                    <span>Confirm & Set Monthly Silver SIP</span>
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
                  className="w-full max-w-md bg-white rounded-[32px] p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 border border-slate-200 text-center relative overflow-hidden my-auto max-h-[85vh] overflow-y-auto"
                >
                  {/* Confetti Accent */}
                  <div className="absolute -top-12 -left-12 w-32 h-32 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

                  {/* Animated Check Badge */}
                  <div className="flex justify-center pt-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.15, 1] }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="w-20 h-20 rounded-full bg-gradient-to-tr from-sky-500 to-emerald-500 p-1 shadow-xl shadow-sky-500/20"
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
                      Silver SIP Set Successfully!
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      Your 999 Pure Digital Silver SIP is configured & ready.
                    </p>
                  </div>

                  {/* Details Box */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-3">
                    <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/60">
                      <span className="font-semibold text-slate-500">Plan Type</span>
                      <span className="font-black text-slate-900 uppercase">
                        {mobileSelectedPlan === 'weekly' ? 'Weekly Silver Savings' : mobileSelectedPlan === 'monthly' ? 'Monthly Silver Savings' : 'Daily Silver Savings'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/60">
                      <span className="font-semibold text-slate-500">SIP Schedule</span>
                      <span className="font-black text-sky-700">
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
                      <span className="font-black text-sky-600">
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
                        <span>999 Digital Silver</span>
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
                    className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-sm shadow-lg border-none outline-none cursor-pointer transition-all"
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
