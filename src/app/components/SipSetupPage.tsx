import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Check
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export type MetalType = 'gold' | 'silver';
export type PlanFrequency = 'daily' | 'weekly' | 'monthly';

interface SipSetupPageProps {
  initialMetal?: MetalType;
  initialPlan?: PlanFrequency;
  onNavigate: (page: string) => void;
}

const ANNUAL_RETURN_RATE = 0.11;

export default function SipSetupPage({ initialMetal = 'gold', initialPlan = 'daily', onNavigate }: SipSetupPageProps) {
  const savedMetal = (typeof window !== 'undefined' ? sessionStorage.getItem('fm_setup_metal') : null) as MetalType | null;
  const savedPlan = (typeof window !== 'undefined' ? sessionStorage.getItem('fm_setup_plan') : null) as PlanFrequency | null;

  const [metal, setMetal] = useState<MetalType>(savedMetal || initialMetal);
  const [frequency, setFrequency] = useState<PlanFrequency>(savedPlan || initialPlan);
  const [amount, setAmount] = useState<number>(() => {
    if (frequency === 'daily') return 50;
    if (frequency === 'weekly') return 500;
    return 1000;
  });
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [weeklyDay, setWeeklyDay] = useState<string>('Monday');
  const [monthlyDate, setMonthlyDate] = useState<number>(5);
  const [step, setStep] = useState<'configure' | 'success'>('configure');

  useEffect(() => {
    if (frequency === 'daily' && (amount > 500 || amount < 10)) {
      setAmount(50);
    } else if (frequency === 'weekly' && (amount > 10000 || amount < 100)) {
      setAmount(500);
    } else if (frequency === 'monthly' && (amount > 50000 || amount < 500)) {
      setAmount(1000);
    }
  }, [frequency]);

  const liveGramPrice = metal === 'gold' ? 8450 : 98;

  // Calculation Logic
  const calculationData = useMemo(() => {
    let periodsPerYear = 12;
    if (frequency === 'daily') periodsPerYear = 365;
    if (frequency === 'weekly') periodsPerYear = 52;

    const ratePerPeriod = ANNUAL_RETURN_RATE / periodsPerYear;
    const chartData = [];
    let currentInvested = 0;
    let currentValue = 0;

    for (let yr = 1; yr <= tenureYears; yr++) {
      const n = yr * periodsPerYear;
      const P = amount;
      const r = ratePerPeriod;

      const invested = P * n;
      const fv = (P * (Math.pow(1 + r, n) - 1)) / r * (1 + r);
      const returns = fv - invested;

      chartData.push({
        year: `Yr ${yr}`,
        Total: Math.round(fv)
      });

      if (yr === tenureYears) {
        currentInvested = invested;
        currentValue = fv;
      }
    }

    const estimatedReturn = Math.round(currentValue - currentInvested);
    const percentageGain = currentInvested > 0 ? Number(((estimatedReturn / currentInvested) * 100).toFixed(1)) : 0;
    const estimatedGrams = Number((currentValue / liveGramPrice).toFixed(2));

    return {
      chartData,
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
    <div className="min-h-screen bg-slate-50/70 pb-20 pt-3 sm:pt-6">
      <div className="max-w-2xl mx-auto px-4">

        {/* Minimal Header */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => onNavigate(metal === 'silver' ? 'silver-savings' : 'savings')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200/80 px-3.5 py-2 rounded-xl shadow-2xs hover:bg-slate-50 cursor-pointer outline-none"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          {/* Minimal Metal Toggle */}
          <div className="bg-slate-200/70 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => {
                setMetal('gold');
                sessionStorage.setItem('fm_setup_metal', 'gold');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border-none outline-none ${
                metal === 'gold'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gold
            </button>

            <button
              onClick={() => {
                setMetal('silver');
                sessionStorage.setItem('fm_setup_metal', 'silver');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border-none outline-none ${
                metal === 'silver'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Silver
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'configure' ? (
            <motion.div
              key="configure"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Card Container */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
                
                {/* Title */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <img
                      src={metal === 'gold' ? "/gold-bars.png" : "/silver.png"}
                      alt={metal === 'gold' ? "Gold Bars" : "Silver Bars"}
                      className="w-6 h-6 object-contain"
                    />
                    <span>{metal === 'gold' ? '24K Gold SIP' : '999 Silver SIP'} Setup</span>
                  </h1>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    Live Rate: ₹{liveGramPrice}/g
                  </p>
                </div>

                {/* 1. Frequency Segment Control */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Frequency</label>
                  <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl">
                    {(['daily', 'weekly', 'monthly'] as PlanFrequency[]).map((f) => {
                      const active = frequency === f;
                      return (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFrequency(f)}
                          className={`py-2.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer border-none outline-none ${
                            active
                              ? 'bg-white text-slate-900 shadow-xs font-black'
                              : 'text-slate-500 hover:text-slate-900'
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
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">SIP Amount</label>
                    <span className="text-xs font-semibold text-slate-400">
                      Per {frequency === 'daily' ? 'Day' : frequency === 'weekly' ? 'Week' : 'Month'}
                    </span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">₹</span>
                    <input
                      type="number"
                      min={10}
                      value={amount}
                      onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-4 py-3 font-black text-slate-900 text-xl focus:outline-none focus:border-purple-600 transition-all"
                    />
                  </div>

                  {/* Preset Pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {frequency === 'daily'
                      ? [10, 20, 50, 100, 200].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setAmount(amt)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border-none outline-none ${
                              amount === amt ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            ₹{amt}
                          </button>
                        ))
                      : frequency === 'weekly'
                      ? [200, 500, 1000, 2000].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setAmount(amt)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border-none outline-none ${
                              amount === amt ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            ₹{amt}
                          </button>
                        ))
                      : [500, 1000, 2500, 5000].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setAmount(amt)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border-none outline-none ${
                              amount === amt ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            ₹{amt}
                          </button>
                        ))}
                  </div>
                </div>

                {/* 3. Day / Date Selector (if weekly or monthly) */}
                {frequency === 'weekly' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Debit Day</label>
                    <div className="grid grid-cols-7 gap-1">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setWeeklyDay(day)}
                          className={`py-2 rounded-xl text-xs font-bold cursor-pointer border-none outline-none ${
                            weeklyDay === day ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {frequency === 'monthly' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Debit Date</label>
                    <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                      {[1, 5, 10, 15, 20, 25, 28].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setMonthlyDate(d)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 cursor-pointer border-none outline-none ${
                            monthlyDate === d ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {d}th
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Tenure Selector */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tenure</label>
                    <span className="text-xs font-bold text-purple-700">{tenureYears} Years</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 3, 5, 10].map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setTenureYears(yr)}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none outline-none ${
                          tenureYears === yr
                            ? 'bg-purple-600 text-white font-black shadow-2xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {yr} {yr === 1 ? 'Yr' : 'Yrs'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Projected Returns Card */}
                <div className="bg-gradient-to-br from-slate-900 to-purple-950 text-white rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[11px] font-bold text-purple-300">Expected Value ({tenureYears} Yrs)</div>
                      <div className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                        ₹{calculationData.totalValue.toLocaleString()}
                      </div>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-300 font-bold text-xs px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      +{calculationData.percentageGain}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-purple-800/50">
                    <div>
                      <span className="text-purple-300">Invested: </span>
                      <span className="font-bold">₹{calculationData.totalInvested.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-purple-300">Est. Returns: </span>
                      <span className="font-bold text-emerald-400">+₹{calculationData.estimatedReturn.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={() => {
                    setStep('success');
                    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer border-none outline-none transition-all"
                >
                  <span>Confirm SIP Mandate</span>
                  <ArrowRight size={16} />
                </button>

              </div>
            </motion.div>
          ) : (
            /* Minimal Success Screen */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 text-center space-y-5"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">SIP Active!</h2>
                <p className="text-xs font-semibold text-slate-400 mt-1">
                  {frequency.toUpperCase()} {metal === 'gold' ? 'Gold' : 'Silver'} SIP configured for ₹{amount.toLocaleString()}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-2 text-left border border-slate-200/60">
                <div className="flex justify-between">
                  <span className="text-slate-500">Asset</span>
                  <span className="font-bold text-slate-900">{metal === 'gold' ? '24K Gold' : '999 Silver'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Frequency</span>
                  <span className="font-bold text-purple-700 capitalize">{frequency} ({getNextAutoPayDate()})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tenure</span>
                  <span className="font-bold text-slate-900">{tenureYears} Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Est. Portfolio ({tenureYears} Yrs)</span>
                  <span className="font-bold text-emerald-600">₹{calculationData.totalValue.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onNavigate(metal === 'silver' ? 'silver-savings' : 'savings')}
                  className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-bold text-xs cursor-pointer border-none outline-none"
                >
                  View SIP Dashboard
                </button>
                <button
                  onClick={() => onNavigate('home')}
                  className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer border-none outline-none"
                >
                  Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
