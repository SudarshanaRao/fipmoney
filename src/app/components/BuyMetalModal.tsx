"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  CreditCard,
  Smartphone,
  Check,
  Sparkles,
  Info,
  ChevronRight,
  Lock,
  ArrowRight,
  TrendingUp,
  Shield,
  Layers,
  ChevronDown,
  Award,
  Zap,
  BadgePercent,
  Building2,
  AlertTriangle,
  XCircle
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot
} from "recharts";

type Step = "input" | "payment" | "processing" | "success";
type Provider = "safeGold" | "mmtc" | "augmont";
type Timeframe = "1H" | "24H" | "7D" | "1M" | "1Y";

interface BuyMetalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number, grams: number) => void;
  metal: "gold" | "silver";
  basePrice: number;
  initialAmount?: string;
  initialGrams?: string;
  initialMode?: "amount" | "grams";
}

const providersData: Record<Provider, { name: string; subtitle: string; priceDiff: number }> = {
  safeGold: { name: "SafeGold", subtitle: "Highly Secure & Trusted", priceDiff: 0 },
  mmtc: { name: "MMTC-PAMP", subtitle: "LBMA Good Delivery", priceDiff: 2.5 },
  augmont: { name: "Augmont", subtitle: "India's Most Trusted", priceDiff: 3.0 }
};

const generateChartData = (base: number) => {
  return [
    { time: "12 AM", price: 11980 },
    { time: "4 AM", price: 12220 },
    { time: "8 AM", price: 12150 },
    { time: "12 PM", price: base },
    { time: "4 PM", price: 12280 },
    { time: "8 PM", price: 12410 },
    { time: "12 AM", price: base * 1.002 }
  ];
};

export default function BuyMetalModal({
  isOpen,
  onClose,
  onSuccess,
  metal = "gold",
  basePrice = 12457.21,
  initialAmount,
  initialGrams,
  initialMode
}: BuyMetalModalProps) {
  const [step, setStep] = useState<Step>("input");

  // Stable Fixed Locked Rate
  const [lockedRate, setLockedRate] = useState<number>(basePrice);

  // Dynamic Live Market Ticker Rate
  const [liveMarketRate, setLiveMarketRate] = useState<number>(basePrice);

  // Price Lock 5-minute Timer (300 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);

  // Input & Mode State
  const [buyMode, setBuyMode] = useState<"amount" | "grams">("amount");
  const [amountInput, setAmountInput] = useState<string>("");
  const [gramsInput, setGramsInput] = useState<string>("");

  // Vaulting Provider & Timeframe
  const [selectedProvider, setSelectedProvider] = useState<Provider>("safeGold");
  const [timeframe, setTimeframe] = useState<Timeframe>("24H");

  // Current locked price with provider differential
  const currentLockedPrice = lockedRate + providersData[selectedProvider].priceDiff;

  // Chart Data
  const chartData = useMemo(() => generateChartData(lockedRate), [lockedRate]);
  const lowPrice = 12203.79;
  const highPrice = 12526.88;

  // Calculations
  const calculatedGrams = useMemo(() => {
    if (buyMode === "grams") return Number(gramsInput) || 0;
    const amt = Number(amountInput) || 0;
    return amt / currentLockedPrice;
  }, [buyMode, amountInput, gramsInput, currentLockedPrice]);

  const calculatedAmount = useMemo(() => {
    if (buyMode === "amount") return Number(amountInput) || 0;
    const g = Number(gramsInput) || 0;
    return g * currentLockedPrice;
  }, [buyMode, amountInput, gramsInput, currentLockedPrice]);

  const gstAmount = useMemo(() => calculatedAmount * 0.03, [calculatedAmount]);
  const totalPayable = useMemo(() => calculatedAmount + gstAmount, [calculatedAmount, gstAmount]);

  // Carry values seamlessly when toggling mode
  const handleSwitchMode = (mode: "amount" | "grams") => {
    if (mode === "grams" && buyMode === "amount") {
      const amt = Number(amountInput) || 0;
      if (amt > 0) {
        const g = amt / currentLockedPrice;
        setGramsInput(g.toFixed(4));
      }
    } else if (mode === "amount" && buyMode === "grams") {
      const g = Number(gramsInput) || 0;
      if (g > 0) {
        const amt = g * currentLockedPrice;
        setAmountInput(amt.toFixed(2));
      }
    }
    setBuyMode(mode);
  };

  // Strictly initialize mode & amount based on initialMode and initial props
  useEffect(() => {
    if (isOpen) {
      setLockedRate(basePrice);
      setLiveMarketRate(basePrice);
      setTimeLeft(300);
      setIsTimedOut(false);
      setStep("input");

      let targetMode: "amount" | "grams" = "amount";
      if (initialMode) {
        targetMode = initialMode;
      } else if (initialGrams && Number(initialGrams) > 0 && (!initialAmount || Number(initialAmount) === 0)) {
        targetMode = "grams";
      }

      setBuyMode(targetMode);

      if (targetMode === "amount") {
        const amtVal = initialAmount && Number(initialAmount) > 0 ? initialAmount : "1000";
        setAmountInput(amtVal);
        if (initialGrams) setGramsInput(initialGrams);
      } else {
        const gVal = initialGrams && Number(initialGrams) > 0 ? initialGrams : (Number(initialAmount || 1000) / basePrice).toFixed(4);
        setGramsInput(gVal);
        if (initialAmount) setAmountInput(initialAmount);
      }
    }
  }, [isOpen, basePrice, initialAmount, initialGrams, initialMode]);

  // Live market price ticks
  useEffect(() => {
    if (!isOpen || isTimedOut) return;
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.45) * 4.5;
      setLiveMarketRate(prev => Number((prev + delta).toFixed(2)));
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen, isTimedOut]);

  // Smooth live 1-second countdown timer
  useEffect(() => {
    if (!isOpen || isTimedOut || step === "processing" || step === "success") return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimedOut(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isTimedOut, step]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAddPreset = (value: number) => {
    setBuyMode("amount");
    const current = Number(amountInput) || 0;
    setAmountInput((current + value).toString());
  };

  const handleProcessPayment = () => {
    setStep("processing");
    setTimeout(() => {
      setStep("success");
    }, 2500);
  };

  const isMarketHigherOrEqual = liveMarketRate >= lockedRate;
  const marketDiff = (liveMarketRate - lockedRate).toFixed(2);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-3 overflow-y-auto lg:overflow-hidden"
      >
        <motion.div
          initial={{ scale: 0.96, y: 8 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 8 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-[22px] md:rounded-[28px] w-full max-w-[1140px] max-h-[96vh] lg:max-h-[89vh] overflow-y-auto lg:overflow-hidden shadow-2xl relative border border-slate-100 p-3.5 sm:p-4 lg:p-5 text-slate-800 font-sans hide-scrollbar flex flex-col justify-between"
        >

          {/* Close Button Top-Right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full p-1.5 transition-colors cursor-pointer border-none outline-none"
          >
            <X size={16} />
          </button>

          {/* Timeout Overlay & Toast Alert */}
          {isTimedOut && step !== "processing" && step !== "success" && (
            <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 rounded-[28px] text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-3 shadow-md">
                <XCircle size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">Transaction Timeout</h2>
              <p className="text-slate-600 font-bold text-xs mb-2">
                Your 5-minute price lock has expired (0:00).
              </p>
              <p className="text-slate-400 font-medium text-xs mb-6 max-w-xs">
                The transaction failed due to timeout. Please refresh to lock the latest live market rates.
              </p>
              <button
                onClick={() => { setTimeLeft(300); setIsTimedOut(false); setLockedRate(liveMarketRate); }}
                className="bg-[#6D28D9] text-white font-extrabold py-3.5 px-7 rounded-xl flex items-center gap-2 hover:bg-[#5B21B6] transition-colors cursor-pointer outline-none border-none shadow-lg shadow-purple-600/20 text-xs"
              >
                <RefreshCw size={14} /> Refresh Live Rate & Retry
              </button>
            </div>
          )}

          {/* Top Modal Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100 shrink-0">
            {/* Left: Title & Subtitle */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0">
                <Sparkles size={18} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                  Buy Digital Gold
                </h1>
                <p className="text-[10px] font-semibold text-slate-400">
                  24K 99.99% Pure Digital Gold
                </p>
              </div>
            </div>

            {/* Middle: Live Market Rate */}
            <div className="flex items-center gap-2.5 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-100">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                LIVE MARKET RATE
              </span>
              <div className="flex items-baseline gap-1">
                <span className={`text-base sm:text-lg font-black tracking-tight ${
                  isMarketHigherOrEqual ? "text-emerald-600" : "text-rose-600"
                }`}>
                  ₹{liveMarketRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] font-bold text-slate-400">/g</span>
              </div>
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                isMarketHigherOrEqual ? "text-emerald-700 bg-emerald-100/80" : "text-rose-700 bg-rose-100/80"
              }`}>
                {isMarketHigherOrEqual ? `▲ +₹${marketDiff}` : `▼ -₹${Math.abs(Number(marketDiff))}`}
              </span>
            </div>

            {/* Right: Timer Banner Pill */}
            <div className={`px-3 py-1.5 rounded-xl flex items-center gap-2 pr-10 sm:pr-3 transition-colors ${
              timeLeft <= 60
                ? "bg-rose-50 border border-rose-200 animate-pulse text-rose-700"
                : "bg-purple-50/80 border border-purple-100 text-[#6D28D9]"
            }`}>
              <Clock size={14} className="shrink-0" />
              <div>
                <div className="text-xs font-black">
                  Rate locked for {formatTimer(timeLeft)}
                </div>
                <div className="text-[9px] font-semibold opacity-80 hidden sm:block">
                  {timeLeft <= 60 ? "⚠️ Time ticking! Hurry up & buy!" : "Complete transaction before timer ends"}
                </div>
              </div>
            </div>
          </div>

          {/* Time Ticking Urgent Warning Banner */}
          <AnimatePresence>
            {timeLeft <= 90 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className={`py-1.5 px-3 rounded-lg text-xs font-black flex items-center justify-center gap-2 border shadow-2xs mt-2 shrink-0 ${
                  timeLeft <= 45
                    ? "bg-rose-500 text-white border-rose-600 animate-bounce"
                    : "bg-amber-100 text-amber-900 border-amber-300"
                }`}
              >
                <AlertTriangle size={14} className="shrink-0" />
                <span>
                  {timeLeft <= 45
                    ? `⚠️ HURRY UP! Time is ticking! Only ${timeLeft}s remaining! Complete transaction now!`
                    : `⏰ Time is ticking! Rate lock expires in ${formatTimer(timeLeft)}. Complete now to keep this rate!`}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main 2-Column Split Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2.5 flex-1 items-stretch">

            {/* LEFT COLUMN (Width: 7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-2.5 h-full">

              {/* 1. RATE LOCKED Info Box */}
              <div className="bg-[#F9F8FF] border border-[#ECE7FE] rounded-xl p-3 relative shadow-2xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <Lock size={13} strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] font-extrabold text-[#6D28D9] uppercase tracking-wider">
                        RATE LOCKED
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 block">
                      Locked at
                    </span>
                    <div className="text-xl font-black text-slate-900 tracking-tight">
                      ₹{currentLockedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-xs font-bold text-slate-400"> /g</span>
                    </div>
                  </div>

                  {/* Spacious Oval Pill Timer Gauge */}
                  <div className={`px-4 py-2 rounded-2xl border-2 flex flex-col items-center justify-center shadow-xs shrink-0 min-w-[96px] ${
                    timeLeft <= 60 ? "border-rose-500 bg-rose-50/80 animate-pulse" : "border-emerald-500 bg-[#ECFDF5]"
                  }`}>
                    <div className="flex items-center gap-1 mb-0.5">
                      <Lock size={11} className={timeLeft <= 60 ? "text-rose-600" : "text-emerald-600"} />
                      <span className="text-xs font-black text-slate-900 leading-none">
                        {formatTimer(timeLeft)}
                      </span>
                    </div>
                    <span className={`text-[8px] font-extrabold uppercase tracking-wider ${
                      timeLeft <= 60 ? "text-rose-700" : "text-emerald-700"
                    }`}>
                      REMAINING
                    </span>
                  </div>

                  {/* Why rate lock info list */}
                  <div className="hidden sm:block border-l border-purple-100 pl-3 space-y-0.5 max-w-[190px]">
                    <span className="text-[10px] font-extrabold text-[#6D28D9] block">
                      Why rate lock is important?
                    </span>
                    <ul className="text-[9px] font-semibold text-slate-600 space-y-0.5 pl-0 list-none">
                      <li className="flex items-start gap-1">
                        <span className="text-[#6D28D9] font-bold">›</span> Price updates live every second.
                      </li>
                      <li className="flex items-start gap-1">
                        <span className="text-[#6D28D9] font-bold">›</span> Lock rate now & buy at same rate.
                      </li>
                      <li className="flex items-start gap-1">
                        <span className="text-[#6D28D9] font-bold">›</span> Latest market rate on timeout.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2. LIVE GOLD PRICE Chart Box */}
              <div className="bg-[#FAFAFC] border border-slate-200/60 rounded-xl p-3 relative flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                        LIVE GOLD PRICE (₹/G)
                      </span>
                      <span className="bg-emerald-500 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        ● LIVE
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-0.5 bg-red-500 rounded-full" /> 24H Low: <span className="text-red-500 font-extrabold">₹{lowPrice.toFixed(2)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-0.5 bg-emerald-500 rounded-full" /> 24H High: <span className="text-emerald-500 font-extrabold">₹{highPrice.toFixed(2)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 bg-white p-0.5 rounded-lg border border-slate-200/70">
                    {(["1H", "24H", "7D", "1M", "1Y"] as Timeframe[]).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold transition-all border-none cursor-pointer outline-none ${
                          timeframe === tf
                            ? "bg-purple-50 text-[#6D28D9] border border-purple-200 shadow-2xs"
                            : "text-slate-400 hover:text-slate-700 bg-transparent"
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-26 sm:h-28 w-full pt-1 relative">
                  <div className="absolute top-1 left-[48%] -translate-x-1/2 bg-white border border-slate-200 rounded-lg px-2.5 py-1 shadow-xs text-center z-10">
                    <span className="text-[11px] font-black text-slate-900 block leading-tight">₹{lockedRate.toFixed(2)}</span>
                    <span className="text-[8px] font-bold text-slate-400 block">Today, 10:30 AM</span>
                  </div>

                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 20, right: 5, left: 5, bottom: 0 }}>
                      <defs>
                        <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: 700 }} dy={2} />
                      <YAxis
                        domain={[11800, 12600]}
                        ticks={[11800, 12200, 12600]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: 700 }}
                        tickFormatter={(val) => val.toLocaleString()}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0F172A",
                          borderRadius: "10px",
                          border: "none",
                          color: "#fff",
                          fontSize: "11px",
                          fontWeight: "bold",
                          padding: "4px 8px"
                        }}
                        formatter={(val: number) => [`₹${val.toFixed(2)}`, "Rate"]}
                      />
                      <Area type="monotone" dataKey="price" stroke="#7C3AED" strokeWidth={2.5} fillOpacity={1} fill="url(#purpleGrad)" />
                      <ReferenceDot x="12 PM" y={lockedRate} r={4} fill="#7C3AED" stroke="#ffffff" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/60 pt-1 mt-1 text-[10px] font-semibold text-slate-500">
                  <div className="flex items-center gap-1">
                    <ShieldCheck size={12} className="text-[#6D28D9]" />
                    <span>Gold prices update in real-time based on live market rates</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 font-bold">
                    <span>Last updated: 10:30:45 AM</span>
                    <RefreshCw size={11} className="cursor-pointer hover:text-slate-600" />
                  </div>
                </div>
              </div>

              {/* 3. Security Banner */}
              <div className="bg-gradient-to-r from-[#0F0C20] via-[#1A153B] to-[#0F0C20] rounded-xl p-2.5 text-white flex items-center justify-between shadow-xs border border-indigo-900/40 mt-auto">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-amber-500/20 border border-amber-400/30 rounded-lg flex items-center justify-center text-amber-400 shrink-0">
                    <Shield size={16} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white leading-tight">100% Secure & Insured Vaults</h4>
                    <p className="text-[9px] text-indigo-200/80 font-medium">
                      Your gold is stored in insured vaults. We never store your gold physically.
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-3 text-[9px] font-bold text-indigo-200">
                  <div className="flex items-center gap-1">
                    <ShieldCheck size={13} className="text-amber-400" />
                    <span>Bank-level</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sparkles size={13} className="text-amber-400" />
                    <span>99.99% Pure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={13} className="text-amber-400" />
                    <span>24/7</span>
                  </div>
                </div>
              </div>

            </div>


            {/* RIGHT COLUMN: Configuration & Order Summary (Width: 5 cols) */}
            <div className="lg:col-span-5 space-y-2.5 flex flex-col justify-between h-full">

              {/* Purchase Mode Tabs */}
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => handleSwitchMode("amount")}
                  className={`flex-1 py-1.5 text-xs font-extrabold text-center transition-colors cursor-pointer border-none outline-none bg-transparent ${
                    buyMode === "amount"
                      ? "text-[#6D28D9] border-b-2 border-[#6D28D9]"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Buy in Amount (₹)
                </button>
                <button
                  onClick={() => handleSwitchMode("grams")}
                  className={`flex-1 py-1.5 text-xs font-extrabold text-center transition-colors cursor-pointer border-none outline-none bg-transparent ${
                    buyMode === "grams"
                      ? "text-[#6D28D9] border-b-2 border-[#6D28D9]"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Buy in Grams (g)
                </button>
              </div>

              {/* Amount / Grams Input Box */}
              <div className="space-y-1.5">
                <div className="bg-white border border-slate-200 focus-within:border-[#6D28D9] rounded-xl p-2.5 shadow-2xs transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      {buyMode === "amount" && (
                        <span className="text-base font-black text-slate-400 mr-2 shrink-0 select-none">
                          ₹
                        </span>
                      )}
                      <input
                        type="number"
                        placeholder={buyMode === "amount" ? "Enter Amount" : "Enter Grams"}
                        value={buyMode === "amount" ? amountInput : gramsInput}
                        onChange={(e) => {
                          if (buyMode === "amount") setAmountInput(e.target.value);
                          else setGramsInput(e.target.value);
                        }}
                        className="w-full text-lg font-black text-slate-900 border-none outline-none bg-transparent placeholder:text-slate-300 placeholder:font-medium"
                      />
                      {buyMode === "grams" && (
                        <span className="text-xs font-bold text-slate-400 ml-1 shrink-0 select-none">
                          g
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (buyMode === "amount") setAmountInput("5000");
                        else setGramsInput("1.0");
                      }}
                      className="bg-purple-50 hover:bg-purple-100 text-[#6D28D9] font-black text-[10px] px-2.5 py-1 rounded-md transition-colors cursor-pointer outline-none border-none ml-2 shrink-0"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                {/* Roughly Calculated Value Display */}
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-bold text-slate-500">You will get roughly</span>
                  <span className="text-sm font-black text-slate-900">
                    {buyMode === "amount"
                      ? `${calculatedGrams.toFixed(4)} g`
                      : `₹${calculatedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </span>
                </div>

                {/* Preset Quick Buttons */}
                <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                  {[100, 500, 1000, 5000].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleAddPreset(val)}
                      className="border border-purple-200/80 bg-purple-50/40 hover:bg-purple-100 text-[#6D28D9] font-extrabold text-[10px] py-1.5 rounded-lg text-center transition-all cursor-pointer outline-none"
                    >
                      + ₹{val.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Vaulting Provider */}
              <div>
                <span className="text-[11px] font-black text-slate-800 flex items-center gap-1 mb-1">
                  Select Vaulting Provider <Info size={11} className="text-slate-400" />
                </span>

                <div className="space-y-1.5">
                  {(Object.keys(providersData) as Provider[]).map((p) => {
                    const prov = providersData[p];
                    const isSelected = selectedProvider === p;
                    return (
                      <div
                        key={p}
                        onClick={() => setSelectedProvider(p)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? "border-2 border-[#6D28D9] bg-[#F7F5FF]"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-[#6D28D9]" : "border-slate-300"}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#6D28D9]" />}
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-900">{prov.name}</div>
                            <div className="text-[9px] font-semibold text-slate-400">{prov.subtitle}</div>
                          </div>
                        </div>

                        <span className="text-xs font-extrabold text-emerald-600">
                          +{prov.priceDiff === 0 ? "₹0" : `₹${prov.priceDiff}`}/g
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-slate-100 pt-2 space-y-1 text-xs">
                <h3 className="text-xs font-black text-slate-800 mb-1">Order Summary</h3>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-slate-500">Live Gold Rate (per gram)</span>
                  <span className="font-black text-slate-900">
                    ₹{currentLockedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-slate-500 flex items-center gap-1">
                    Making Charges <Info size={10} className="text-slate-400" />
                  </span>
                  <span className="font-black text-slate-900">+₹0.00</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-slate-500">GST (3%)</span>
                  <span className="font-black text-slate-900">+₹{gstAmount.toFixed(2)}</span>
                </div>

                <div className="w-full h-px bg-slate-100 my-1" />

                <div className="flex justify-between items-end pt-0.5">
                  <span className="text-xs font-black text-slate-900">Total Payable</span>
                  <span className="text-xl font-black text-[#6D28D9] tracking-tight">
                    ₹{totalPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Rate Locked Alert Sub-Pill */}
              <div className="bg-purple-50/90 border border-purple-100 py-2 px-3 rounded-xl text-center flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-[#6D28D9]">
                <Lock size={13} />
                <span>
                  Rate locked at ₹{currentLockedPrice.toFixed(2)}/g for {formatTimer(timeLeft)} minutes
                </span>
              </div>

              {/* CTA Button */}
              <div className="mt-auto">
                <button
                  disabled={calculatedAmount <= 0}
                  onClick={handleProcessPayment}
                  className={`w-full py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border-none outline-none ${
                    calculatedAmount <= 0
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                      : "bg-[#6D28D9] hover:bg-[#5B21B6] text-white shadow-md shadow-purple-600/30 hover:-translate-y-0.5"
                  }`}
                >
                  <Lock size={15} />
                  <span>Buy Gold Securely</span>
                  <ArrowRight size={17} />
                </button>

                <p className="text-[9px] font-bold text-slate-400 text-center mt-1.5 tracking-wide">
                  100% Secure Payment • SSL Encrypted • Trusted by 1M+ users
                </p>
              </div>

            </div>

          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
