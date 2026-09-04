import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Check,
  Calendar as CalendarIcon,
  ChevronDown,
  X
} from 'lucide-react';

export type PlanFrequency = 'daily' | 'weekly' | 'monthly';

interface GoldSipSetupPageProps {
  initialPlan?: PlanFrequency;
  onNavigate: (page: string) => void;
}

const ANNUAL_GOLD_RETURN_RATE = 0.11; // ~11% historical gold CAGR

export default function GoldSipSetupPage({ initialPlan = 'daily', onNavigate }: GoldSipSetupPageProps) {
  const savedPlan = (typeof window !== 'undefined' ? sessionStorage.getItem('fm_setup_plan') : null) as PlanFrequency | null;

  const [frequency, setFrequency] = useState<PlanFrequency>(savedPlan || initialPlan);
  const [amount, setAmount] = useState<number>(() => {
    if (frequency === 'daily') return 50;
    if (frequency === 'weekly') return 500;
    return 1000;
  });
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [weeklyDay, setWeeklyDay] = useState<string>('Monday');
  const [monthlyDate, setMonthlyDate] = useState<number>(5);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  useEffect(() => {
    if (frequency === 'daily' && (amount > 500 || amount < 10)) {
      setAmount(50);
    } else if (frequency === 'weekly' && (amount > 10000 || amount < 100)) {
      setAmount(500);
    } else if (frequency === 'monthly' && (amount > 50000 || amount < 500)) {
      setAmount(1000);
    }
  }, [frequency]);

  const liveGramPrice = 8450; // 24K Gold Rate per gram

  // Calculation Logic for Gold
  const calculationData = useMemo(() => {
    let periodsPerYear = 12;
    if (frequency === 'daily') periodsPerYear = 365;
    if (frequency === 'weekly') periodsPerYear = 52;

    const ratePerPeriod = ANNUAL_GOLD_RETURN_RATE / periodsPerYear;
    let currentInvested = 0;
    let currentValue = 0;

    for (let yr = 1; yr <= tenureYears; yr++) {
      const n = yr * periodsPerYear;
      const P = amount;
      const r = ratePerPeriod;

      const invested = P * n;
      const fv = (P * (Math.pow(1 + r, n) - 1)) / r * (1 + r);

      if (yr === tenureYears) {
        currentInvested = invested;
        currentValue = fv;
      }
    }

    const estimatedReturn = Math.round(currentValue - currentInvested);
    const percentageGain = currentInvested > 0 ? Number(((estimatedReturn / currentInvested) * 100).toFixed(1)) : 0;
    const estimatedGrams = Number((currentValue / liveGramPrice).toFixed(2));

    return {
      totalInvested: Math.round(currentInvested),
      estimatedReturn,
      totalValue: Math.round(currentValue),
      percentageGain,
      estimatedGrams
    };
  }, [frequency, amount, tenureYears, liveGramPrice]);

  const getNextAutoPayDate = () => {
    const now = new Date();
    if (frequency === 'daily') {
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      return tomorrow.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ' at 9:00 AM';
    }
    if (frequency === 'weekly') {
      return `Every ${weeklyDay}`;
    }
    return `Every ${monthlyDate}th of month`;
  };

  return (
    <div className="min-h-screen bg-amber-50/40 pb-20 pt-3 sm:pt-6 font-sans">
      <div className="max-w-xl mx-auto px-4">

        {/* Minimal Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => onNavigate('savings')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-amber-200/80 px-3.5 py-2 rounded-xl shadow-2xs hover:bg-amber-50 cursor-pointer outline-none"
          >
            <ArrowLeft size={16} />
            <span>Back to Gold Savings</span>
          </button>

          <span className="bg-amber-100 text-amber-900 border border-amber-300/80 px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5">
            <img src="/gold-bars.png" alt="Gold Bars" className="w-4 h-4 object-contain" />
            <span>24K Pure Gold</span>
          </span>
        </div>

        <motion.div
          key="configure"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-4"
        >
              <div className="bg-white border border-amber-200/80 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
                
                {/* Title */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <img src="/gold-bars.png" alt="Gold Bars" className="w-6 h-6 object-contain" />
                    <span>24K Gold SIP Setup</span>
                  </h1>
                  <p className="text-xs font-semibold text-amber-700 mt-0.5">
                    Live Rate: ₹{liveGramPrice.toLocaleString()}/g • Bank-Vault Insured
                  </p>
                </div>

                {/* 1. Frequency Control */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">SIP Frequency</label>
                  <div className="grid grid-cols-3 gap-2 bg-amber-50/80 p-1.5 rounded-2xl border border-amber-200/60">
                    {(['daily', 'weekly', 'monthly'] as PlanFrequency[]).map((f) => {
                      const active = frequency === f;
                      return (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFrequency(f)}
                          className={`py-2.5 rounded-xl text-xs capitalize transition-all cursor-pointer border-none outline-none ${
                            active
                              ? 'bg-amber-500 text-white shadow-xs font-black'
                              : 'text-slate-700 hover:text-slate-900 font-semibold'
                          }`}
                        >
                          {f}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Amount Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">SIP Amount</label>
                    <span className="text-xs font-semibold text-slate-400">
                      Per {frequency === 'daily' ? 'Day' : frequency === 'weekly' ? 'Week' : 'Month'}
                    </span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-amber-600 text-lg">₹</span>
                    <input
                      type="number"
                      min={10}
                      value={amount}
                      onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-amber-50/30 border border-amber-200 rounded-2xl pl-9 pr-4 py-3 font-black text-slate-900 text-xl focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>

                  {/* Preset Pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {frequency === 'daily'
                      ? [10, 20, 50, 100, 200, 500].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setAmount(amt)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border-none outline-none ${
                              amount === amt ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-amber-100'
                            }`}
                          >
                            ₹{amt}
                          </button>
                        ))
                      : frequency === 'weekly'
                      ? [200, 500, 1000, 2000, 5000].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setAmount(amt)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border-none outline-none ${
                              amount === amt ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-amber-100'
                            }`}
                          >
                            ₹{amt}
                          </button>
                        ))
                      : [500, 1000, 2500, 5000, 10000].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setAmount(amt)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border-none outline-none ${
                              amount === amt ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-amber-100'
                            }`}
                          >
                            ₹{amt}
                          </button>
                        ))}
                  </div>
                </div>

                {/* 3. Day / Date Selector */}
                {frequency === 'weekly' && (
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Debit Day</label>
                    <div className="grid grid-cols-7 gap-1">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setWeeklyDay(day)}
                          className={`py-2 rounded-xl text-xs font-bold cursor-pointer border-none outline-none ${
                            weeklyDay === day ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {frequency === 'monthly' && (
                  <div className="space-y-2 relative">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Monthly Debit Date</label>
                      <span className="text-xs font-black text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-md">
                        Every {monthlyDate}th
                      </span>
                    </div>

                    {/* Dropdown Trigger Button */}
                    <button
                      type="button"
                      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                      className="w-full flex items-center justify-between bg-amber-50/60 border border-amber-200/90 rounded-2xl px-4 py-3 text-xs font-black text-slate-800 hover:bg-amber-100/60 transition-all cursor-pointer outline-none"
                    >
                      <span className="flex items-center gap-2">
                        <CalendarIcon size={16} className="text-amber-600" />
                        <span>Date: {monthlyDate}th of every month</span>
                      </span>
                      <ChevronDown size={16} className={`transition-transform duration-200 ${isCalendarOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Calendar Dropdown Panel */}
                    <AnimatePresence>
                      {isCalendarOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -5, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -5, scale: 0.98 }}
                          className="absolute left-0 right-0 z-30 bg-white border border-amber-200/90 rounded-2xl p-3 shadow-xl space-y-2 mt-1"
                        >
                          <div className="text-[11px] font-bold text-slate-400 text-center pb-1 border-b border-slate-100">
                            Select date from 1 to 28
                          </div>
                          <div className="grid grid-cols-7 gap-1.5 text-center">
                            {Array.from({ length: 28 }, (_, i) => i + 1).map((dateNum) => {
                              const isSelected = monthlyDate === dateNum;
                              return (
                                <button
                                  key={dateNum}
                                  type="button"
                                  onClick={() => {
                                    setMonthlyDate(dateNum);
                                    setIsCalendarOpen(false); // Close dropdown on date selection!
                                  }}
                                  className={`h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer border-none outline-none ${
                                    isSelected
                                      ? 'bg-amber-500 text-white font-black shadow-xs scale-105'
                                      : 'bg-slate-50 text-slate-700 hover:bg-amber-100 border border-slate-200/60'
                                  }`}
                                >
                                  {dateNum}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* 4. Tenure Selector */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Tenure</label>
                    <span className="text-xs font-bold text-amber-700">{tenureYears} Years</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 3, 5, 10].map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setTenureYears(yr)}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none outline-none ${
                          tenureYears === yr
                            ? 'bg-amber-500 text-white font-black shadow-2xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {yr} {yr === 1 ? 'Yr' : 'Yrs'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gold Return Projections */}
                <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 text-white rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[11px] font-bold text-amber-200">Expected Gold Value ({tenureYears} Yrs)</div>
                      <div className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                        ₹{calculationData.totalValue.toLocaleString()}
                      </div>
                      <div className="text-[11px] font-bold text-amber-300 mt-0.5">
                        ~{calculationData.estimatedGrams} Grams 24K Gold
                      </div>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-300 font-bold text-xs px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      +{calculationData.percentageGain}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-amber-800/40">
                    <div>
                      <span className="text-amber-200/80">Invested: </span>
                      <span className="font-bold">₹{calculationData.totalInvested.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-amber-200/80">Est. Gains: </span>
                      <span className="font-bold text-emerald-400">+₹{calculationData.estimatedReturn.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={() => setShowSuccessModal(true)}
                  className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer border-none outline-none transition-all"
                >
                  <span>Confirm Gold SIP Mandate</span>
                  <ArrowRight size={16} />
                </button>

              </div>
        </motion.div>

        {/* Gold SIP Success Modal Popup */}
        <AnimatePresence>
          {showSuccessModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-md bg-white rounded-[32px] p-6 shadow-2xl space-y-5 border border-amber-200/80 text-center relative overflow-hidden my-auto"
              >
                {/* Background glow accents */}
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

                {/* Close Button */}
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors border-none outline-none cursor-pointer"
                >
                  <X size={18} />
                </button>

                {/* Animated Checkmark Badge */}
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
                  <span className="inline-block bg-emerald-100 text-emerald-800 font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider mb-1 border border-emerald-200">
                    AUTOPAY VERIFIED & ACTIVE
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    Gold SIP Set Successfully!
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    Your 24K Pure Digital Gold SIP is configured and automated.
                  </p>
                </div>

                {/* Receipt Box */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2.5 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                    <span className="font-semibold text-slate-500">Asset</span>
                    <span className="font-black text-amber-700 flex items-center gap-1.5">
                      <img src="/gold-bars.png" alt="Gold Bars" className="w-4 h-4 object-contain" />
                      <span>24K Pure Digital Gold</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                    <span className="font-semibold text-slate-500">SIP Schedule</span>
                    <span className="font-bold text-slate-900 capitalize">{frequency} ({getNextAutoPayDate()})</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                    <span className="font-semibold text-slate-500">Amount per debit</span>
                    <span className="font-black text-slate-900">₹{amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                    <span className="font-semibold text-slate-500">Tenure</span>
                    <span className="font-bold text-slate-900">{tenureYears} Years</span>
                  </div>
                  <div className="flex justify-between items-center pt-0.5">
                    <span className="font-semibold text-slate-500">Est. {tenureYears}-Yr Portfolio</span>
                    <span className="font-black text-emerald-600">₹{calculationData.totalValue.toLocaleString()} (~{calculationData.estimatedGrams}g)</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => onNavigate('savings')}
                    className="flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs cursor-pointer border-none outline-none transition-all shadow-md"
                  >
                    View Gold SIPs
                  </button>
                  <button
                    onClick={() => onNavigate('home')}
                    className="flex-1 py-3.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer border-none outline-none hover:bg-slate-200 transition-all"
                  >
                    Home
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
