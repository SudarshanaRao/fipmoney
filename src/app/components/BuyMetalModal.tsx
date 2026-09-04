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
  XCircle,
  ArrowLeft,
  HelpCircle,
  Scale
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

const generateChartData = (base: number) => {
  return [
    { time: "12 AM", price: base * 0.98 },
    { time: "4 AM", price: base * 0.988 },
    { time: "8 AM", price: base * 0.985 },
    { time: "12 PM", price: base },
    { time: "4 PM", price: base * 0.991 },
    { time: "8 PM", price: base * 0.997 },
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

  const isGold = metal === "gold";

  // Dynamic metal strings
  const metalName = isGold ? "Gold" : "Silver";
  const metalPurity = isGold ? "24K 99.99% Pure Digital Gold" : "99.9% Fine Pure Digital Silver";

  // Dynamic theme colors (Gold vs Silver)
  const metalImage = isGold ? "/gold.png" : "/silver.png";
  const themeCardGradient = isGold 
    ? "bg-gradient-to-r from-amber-50/90 via-amber-100/80 to-amber-50/90 border-amber-200/90" 
    : "bg-gradient-to-r from-blue-50/90 via-sky-100/80 to-blue-50/90 border-blue-200/90";
  const themeBadgeBg = isGold ? "bg-amber-500 text-white" : "bg-[#1d4ed8] text-white";
  const themeText = isGold ? "text-amber-600" : "text-[#1d4ed8]";
  const themeFocusBorder = isGold ? "border-amber-300 focus-within:border-amber-500" : "border-blue-200 focus-within:border-[#1d4ed8]";
  const themePresetBtn = isGold 
    ? "text-amber-700 bg-amber-50/70 border-amber-200/80 hover:bg-amber-100" 
    : "text-[#1d4ed8] bg-blue-50/70 border-blue-200/80 hover:bg-blue-100";
  const themeCtaBtn = isGold 
    ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-600/25" 
    : "bg-[#1d4ed8] hover:bg-[#1e40af] text-white shadow-blue-600/30";
  const themeSubCardBg = isGold ? "bg-amber-500/10 text-amber-600" : "bg-[#eff6ff] text-[#1d4ed8]";

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
  const [isBreakdownOpen, setIsBreakdownOpen] = useState<boolean>(true);

  // Timeframe
  const [timeframe, setTimeframe] = useState<Timeframe>("24H");

  // Current locked price (SafeGold +0/g)
  const currentLockedPrice = lockedRate;

  // Chart Data
  const chartData = useMemo(() => generateChartData(lockedRate), [lockedRate]);
  const lowPrice = useMemo(() => Math.min(...chartData.map(d => d.price)), [chartData]);
  const highPrice = useMemo(() => Math.max(...chartData.map(d => d.price)), [chartData]);

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

  const prevIsOpenRef = React.useRef(false);

  // Initialize mode & inputs only on modal open transition
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
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
    prevIsOpenRef.current = isOpen;
  }, [isOpen, basePrice, initialAmount, initialGrams, initialMode]);

  // Timer Countdown Effect
  useEffect(() => {
    if (!isOpen || isTimedOut) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimedOut(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isTimedOut]);

  // Live market price ticks
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.48) * 5;
      setLiveMarketRate(prev => Number((prev + delta).toFixed(2)));
    }, 3500);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleAddPreset = (value: number) => {
    setBuyMode("amount");
    const current = Number(amountInput) || 0;
    setAmountInput((current + value).toString());
  };

  const handleProcessPayment = () => {
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      if (onSuccess) {
        onSuccess(totalPayable, calculatedGrams);
      }
    }, 2000);
  };

  const handleRefreshRate = () => {
    setLockedRate(liveMarketRate);
    setTimeLeft(300);
    setIsTimedOut(false);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
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
        className="fixed inset-0 z-[100] bg-white lg:bg-slate-950/60 lg:backdrop-blur-sm flex flex-col lg:items-center lg:justify-center p-0 lg:p-5 overflow-y-auto lg:overflow-hidden w-full h-full min-h-screen"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white w-full min-h-screen lg:min-h-0 lg:rounded-[32px] lg:max-w-[1160px] lg:max-h-[90vh] overflow-y-auto lg:overflow-hidden lg:shadow-2xl relative border-none lg:border lg:border-slate-100 p-4 sm:p-5 lg:p-7 text-slate-800 font-sans hide-scrollbar flex flex-col justify-between"
        >

          {/* Close Button Top-Right for Desktop */}
          <button
            onClick={onClose}
            className="hidden lg:block absolute top-5 right-5 z-30 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors cursor-pointer border-none outline-none"
          >
            <X size={18} />
          </button>

          {/* Timeout Overlay banner if price lock expires */}
          {isTimedOut && (
            <div className="absolute inset-x-0 top-0 z-40 bg-amber-500 text-white p-3 text-center flex items-center justify-center gap-2 text-xs font-bold shadow-md">
              <AlertCircle size={16} />
              <span>Price lock expired! Rate updated to live market price.</span>
              <button
                onClick={handleRefreshRate}
                className="ml-2 bg-white text-amber-900 px-2.5 py-1 rounded-lg text-xs font-black hover:bg-amber-50 cursor-pointer border-none outline-none flex items-center gap-1"
              >
                <RefreshCw size={16} /> Refresh Live Rate & Retry
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* MOBILE VIEW ONLY (< lg screens) Dynamic Gold/Silver Theme */}
          {/* ======================================================== */}
          <div className="lg:hidden flex flex-col space-y-3.5 w-full max-w-md mx-auto text-slate-800 font-sans p-1 mt-12">
            
            {/* Top Bar Header */}
            <div className="relative flex items-center justify-between pb-2 border-b border-slate-100">
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-700 flex items-center justify-center border-none outline-none cursor-pointer z-10"
              >
                <ArrowLeft size={18} />
              </button>
              <h2 className="text-lg font-bold text-[#0f172a] tracking-tight absolute inset-x-0 text-center pointer-events-none">
                Buy {metalName}
              </h2>
              <button className="w-8 h-8 rounded-full border border-slate-300 text-slate-400 flex items-center justify-center bg-white outline-none cursor-pointer z-10">
                <HelpCircle size={16} />
              </button>
            </div>

            {/* 1. Live Gold/Silver Price Card */}
            <div className={`rounded-2xl p-3.5 border shadow-2xs flex items-center justify-between relative overflow-hidden ${
              isGold ? "bg-gradient-to-br from-[#fffdf5] via-[#fffef7] to-[#fffbeb] border-amber-200/80" : "bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] border-slate-200/80"
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isGold ? "bg-[#fef3c7] text-[#d97706]" : "bg-blue-100 text-[#1d4ed8]"
                  }`}>
                    <TrendingUp size={16} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-tight">Live {metalName} Price</h3>
                </div>
                <div className="flex items-baseline gap-1 pt-1">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    ₹{lockedRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">/gm</span>
                  <span className="bg-[#dcfce7] text-[#15803d] text-xs font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-0.5 ml-2">
                    ▲ 1.25%
                  </span>
                </div>
              </div>
              <img src={metalImage} alt={metalName} className="w-16 h-auto object-contain shrink-0" />
            </div>

            {/* 2. PROMINENTLY HIGHLIGHTED PRICE LOCKED CARD (Lighter Background) */}
            <div className={`rounded-2xl p-3.5 shadow-2xs flex items-center justify-between relative overflow-hidden border ${themeCardGradient}`}>
              <div className="flex items-center gap-3 relative z-10">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                  isGold ? "bg-amber-500 text-white" : "bg-[#1d4ed8] text-white"
                }`}>
                  <Lock size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-slate-900 text-xs tracking-tight uppercase">Price Locked</h4>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Rate guaranteed for next 5 mins</p>
                </div>
              </div>

              {/* Timer Badge pill on light bg */}
              <div className={`rounded-xl px-3 py-1.5 flex flex-col items-center justify-center text-center shrink-0 relative z-10 shadow-2xs min-w-[65px] ${
                isGold ? "bg-amber-500 text-white" : "bg-[#1d4ed8] text-white"
              }`}>
                <span className="text-sm font-black leading-none tracking-wider">{formatTimer(timeLeft)}</span>
                <span className="text-[8px] font-bold text-white/90 uppercase tracking-widest leading-none mt-0.5">Locked</span>
              </div>
            </div>

            {/* 3. Sleek Segmented Control Switcher */}
            <div className="bg-slate-100/90 p-1 rounded-2xl flex items-center border border-slate-200/60 shadow-2xs">
              <button
                type="button"
                onClick={() => handleSwitchMode("amount")}
                className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border-none outline-none ${
                  buyMode === "amount"
                    ? `${themeBadgeBg} shadow-sm`
                    : "text-slate-600 hover:text-slate-900 bg-transparent"
                }`}
              >
                <span className="font-black text-sm">₹</span>
                <span>Buy in Rupees</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchMode("grams")}
                className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border-none outline-none ${
                  buyMode === "grams"
                    ? `${themeBadgeBg} shadow-sm`
                    : "text-slate-600 hover:text-slate-900 bg-transparent"
                }`}
              >
                <Scale size={14} strokeWidth={2.5} />
                <span>Buy in Grams</span>
              </button>
            </div>

            {/* 4. Enter Amount Input Section */}
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1.5 uppercase tracking-wider">
                {buyMode === "amount" ? "Enter Amount" : "Enter Grams"}
              </label>
              <div className={`bg-white border-2 rounded-2xl p-2.5 flex items-center justify-between shadow-2xs ${themeFocusBorder}`}>
                <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-800 font-bold text-base flex items-center justify-center mr-2 shrink-0">
                  {buyMode === "amount" ? "₹" : "g"}
                </div>
                <input
                  type="number"
                  placeholder={buyMode === "amount" ? "1000" : "0.15"}
                  value={buyMode === "amount" ? amountInput : gramsInput}
                  onChange={(e) => {
                    if (buyMode === "amount") setAmountInput(e.target.value);
                    else setGramsInput(e.target.value);
                  }}
                  className="w-full text-xl font-black text-slate-900 border-none outline-none bg-transparent placeholder:text-slate-300"
                />
                {(buyMode === "amount" ? amountInput : gramsInput) && (
                  <button
                    onClick={() => { setAmountInput(""); setGramsInput(""); }}
                    className="w-6 h-6 rounded-full bg-slate-200/80 text-slate-400 hover:text-slate-600 flex items-center justify-center text-xs font-bold border-none outline-none cursor-pointer shrink-0 ml-2"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* 4 Quick Preset Amount Pills */}
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[500, 1000, 2000, 5000].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleAddPreset(val)}
                    className={`py-2 px-1 rounded-xl text-xs font-extrabold text-center transition cursor-pointer border outline-none shadow-2xs ${themePresetBtn}`}
                  >
                    + ₹{val.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. You Will Get & GST Summary Card */}
            <div className="bg-[#fafafa] rounded-2xl p-3 border border-slate-100/90 flex items-center justify-between">
              <div className="flex-1 text-center">
                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  You Will Get
                </div>
                <div className="text-lg font-black text-slate-900 mt-0.5">
                  {calculatedGrams.toFixed(4)} gm
                </div>
              </div>
              <div className="w-px h-7 bg-slate-200/80 mx-2"></div>
              <div className="flex-1 text-center">
                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  GST (3%)
                </div>
                <div className="text-lg font-black text-slate-900 mt-0.5">
                  ₹{gstAmount.toFixed(2)}
                </div>
              </div>
            </div>

            {/* 6. Price Breakdown Accordion */}
            <div
              onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
              className="bg-[#fafafa] rounded-2xl p-3 border border-slate-100/90 flex items-center justify-between cursor-pointer hover:bg-slate-100/50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${themeSubCardBg}`}>
                  <Layers size={16} />
                </div>
                <h4 className="font-extrabold text-slate-900 text-xs">Price Breakdown</h4>
              </div>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${isBreakdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Expanded Price Breakdown Details if open */}
            {isBreakdownOpen && (
              <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Base Amount</span>
                  <span className="font-bold">₹{calculatedAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (3%)</span>
                  <span className="font-bold">₹{gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-1.5">
                  <span>Total Amount</span>
                  <span>₹{totalPayable.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* 7. Total Payable & Buy CTA Button */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Total Payable</span>
                <span className={`text-xl font-black block ${themeText}`}>
                  ₹{totalPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <button
                disabled={calculatedAmount <= 0}
                onClick={handleProcessPayment}
                className={`py-3 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer border-none outline-none transition-all flex-1 max-w-[190px] ${
                  calculatedAmount <= 0
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                    : themeCtaBtn
                }`}
              >
                <span>Buy {metalName}</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* 8. Trust Badges Footer */}
            <div className="mt-5 bg-[#fafafa] rounded-2xl p-3.5 border border-slate-100/90 grid grid-cols-3 gap-1 text-center">
              <div className="flex flex-col items-center">
                <Shield size={14} className={themeText} />
                <span className="text-[10px] font-bold text-slate-700 leading-tight mt-0.5">100% Insured</span>
              </div>
              <div className="flex flex-col items-center border-x border-slate-200/80">
                <Lock size={14} className={themeText} />
                <span className="text-[10px] font-bold text-slate-700 leading-tight mt-0.5">Vault Stored</span>
              </div>
              <div className="flex flex-col items-center">
                <Award size={14} className={themeText} />
                <span className="text-[10px] font-bold text-slate-700 leading-tight mt-0.5">{isGold ? "24K Pure" : "99.9% Pure"}</span>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* DESKTOP VIEW ONLY (lg:flex)                               */}
          {/* ======================================================== */}
          <div className="hidden lg:flex flex-col justify-between h-full space-y-4">

          {/* Top Modal Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 shrink-0 pr-12 sm:pr-10">
            {/* Left: Dynamic Title & Subtitle */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0">
                <Sparkles size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                  Buy Digital {metalName}
                </h1>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  {metalPurity}
                </p>
              </div>
            </div>

            {/* Middle: Live Market Rate */}
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                LIVE MARKET RATE
              </span>
              <div className="flex items-baseline gap-1">
                <span className={`text-lg sm:text-xl font-black tracking-tight ${
                  isMarketHigherOrEqual ? "text-emerald-600" : "text-rose-600"
                }`}>
                  ₹{liveMarketRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-xs font-bold text-slate-400">/g</span>
              </div>
              <span className={`text-xs font-extrabold px-2 py-0.5 rounded-lg flex items-center gap-0.5 ${
                isMarketHigherOrEqual ? "text-emerald-700 bg-emerald-100/80" : "text-rose-700 bg-rose-100/80"
              }`}>
                {isMarketHigherOrEqual ? `▲ +₹${marketDiff}` : `▼ -₹${Math.abs(Number(marketDiff))}`}
              </span>
            </div>
          </div>

          {/* Time Ticking Urgent Warning Banner */}
          <AnimatePresence>
            {timeLeft <= 90 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 border shadow-2xs mt-3 shrink-0 ${
                  timeLeft <= 45
                    ? "bg-rose-500 text-white border-rose-600 animate-bounce"
                    : "bg-amber-100 text-amber-900 border-amber-300"
                }`}
              >
                <AlertTriangle size={16} className="shrink-0" />
                <span>
                  {timeLeft <= 45
                    ? `⚠️ HURRY UP! Time is ticking! Only ${timeLeft}s remaining! Complete transaction now!`
                    : `⏰ Time is ticking! Rate lock expires in ${formatTimer(timeLeft)}. Complete now to keep this rate!`}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main 2-Column Split Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-4 flex-1 items-stretch">

            {/* LEFT COLUMN (Width: 7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4 lg:space-y-5 h-full">

              {/* 1. RATE LOCKED Info Box */}
              <div className="bg-[#F9F8FF] border border-[#ECE7FE] rounded-2xl p-4 sm:p-5 relative shadow-2xs">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <Lock size={14} strokeWidth={2.5} />
                      </div>
                      <span className="text-xs font-extrabold text-[#6D28D9] uppercase tracking-wider">
                        RATE LOCKED
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-400 block pt-0.5">
                      Locked Price
                    </span>
                    <div className="text-2xl font-black text-slate-900 tracking-tight">
                      ₹{currentLockedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-sm font-bold text-slate-400"> /g</span>
                    </div>
                  </div>

                  {/* Oval Pill Timer Gauge */}
                  <div className={`px-5 py-2.5 rounded-2xl border-2 flex flex-col items-center justify-center shadow-xs shrink-0 min-w-[104px] ${
                    timeLeft <= 60 ? "border-rose-500 bg-rose-50/80 animate-pulse" : "border-emerald-500 bg-[#ECFDF5]"
                  }`}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Lock size={12} className={timeLeft <= 60 ? "text-rose-600" : "text-emerald-600"} />
                      <span className="text-sm font-black text-slate-900 leading-none">
                        {formatTimer(timeLeft)}
                      </span>
                    </div>
                    <span className={`text-[9px] font-extrabold uppercase tracking-wider ${
                      timeLeft <= 60 ? "text-rose-700" : "text-emerald-700"
                    }`}>
                      REMAINING
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. LIVE PRICE Chart Box */}
              <div className="bg-[#FAFAFC] border border-slate-200/60 rounded-2xl p-4 sm:p-5 relative flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                        LIVE {metalName.toUpperCase()} PRICE (₹/G)
                      </span>
                      <span className="bg-emerald-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                        ● LIVE
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-0.5 bg-red-500 rounded-full" /> 24H Low: <span className="text-red-500 font-extrabold">₹{lowPrice.toFixed(2)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-0.5 bg-emerald-500 rounded-full" /> 24H High: <span className="text-emerald-500 font-extrabold">₹{highPrice.toFixed(2)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/70">
                    {(["1H", "24H", "7D", "1M", "1Y"] as Timeframe[]).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all border-none cursor-pointer outline-none ${
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

                <div className="h-32 sm:h-36 w-full pt-2 relative">
                  <div className="absolute top-1 left-[48%] -translate-x-1/2 bg-white border border-slate-200 rounded-xl px-3 py-1 shadow-xs text-center z-10">
                    <span className="text-xs font-black text-slate-900 block leading-tight">₹{lockedRate.toFixed(2)}</span>
                    <span className="text-[9px] font-bold text-slate-400 block">Today, 10:30 AM</span>
                  </div>

                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 20, right: 5, left: 5, bottom: 0 }}>
                      <defs>
                        <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }} dy={4} />
                      <YAxis
                        domain={["auto", "auto"]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                        tickFormatter={(val) => val.toLocaleString()}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0F172A",
                          borderRadius: "12px",
                          border: "none",
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: "bold",
                          padding: "6px 12px"
                        }}
                        formatter={(val: number) => [`₹${val.toFixed(2)}`, "Rate"]}
                      />
                      <Area type="monotone" dataKey="price" stroke="#7C3AED" strokeWidth={2.5} fillOpacity={1} fill="url(#purpleGrad)" />
                      <ReferenceDot x="12 PM" y={lockedRate} r={4} fill="#7C3AED" stroke="#ffffff" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 mt-2 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-[#6D28D9]" />
                    <span>{metalName} prices update in real-time based on live market rates</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                    <span>Last updated: 10:30:45 AM</span>
                    <RefreshCw size={12} className="cursor-pointer hover:text-slate-600" />
                  </div>
                </div>
              </div>

              {/* 3. Security Banner */}
              <div className="bg-gradient-to-r from-[#0F0C20] via-[#1A153B] to-[#0F0C20] rounded-2xl p-3.5 sm:p-4 text-white flex items-center justify-between shadow-xs border border-indigo-900/40 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-amber-500/20 border border-amber-400/30 rounded-xl flex items-center justify-center text-amber-400 shrink-0">
                    <Shield size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-white leading-tight">100% Secure & Insured by SafeGold</h4>
                    <p className="text-[10px] sm:text-xs text-indigo-200/80 font-medium mt-0.5">
                      Your order will be sent to SafeGold. SafeGold stores and handles your {metalName.toLowerCase()} in 100% secure, insured bank-grade vaults.
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-3 text-xs font-bold text-indigo-200 shrink-0 ml-3">
                  <div className="flex items-center gap-1">
                    <ShieldCheck size={14} className="text-amber-400" />
                    <span>SafeGold Vaults</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sparkles size={14} className="text-amber-400" />
                    <span>Pure {metalName}</span>
                  </div>
                </div>
              </div>

            </div>


            {/* RIGHT COLUMN: Configuration & Order Summary (Width: 5 cols) */}
            <div className="lg:col-span-5 space-y-4 lg:space-y-5 flex flex-col justify-between h-full">

              {/* Purchase Mode Tabs */}
              <div className="flex border-b border-slate-200 pb-1">
                <button
                  onClick={() => handleSwitchMode("amount")}
                  className={`flex-1 py-2 text-xs sm:text-sm font-extrabold text-center transition-colors cursor-pointer border-none outline-none bg-transparent ${
                    buyMode === "amount"
                      ? "text-[#6D28D9] border-b-2 border-[#6D28D9]"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Buy in Amount (₹)
                </button>
                <button
                  onClick={() => handleSwitchMode("grams")}
                  className={`flex-1 py-2 text-xs sm:text-sm font-extrabold text-center transition-colors cursor-pointer border-none outline-none bg-transparent ${
                    buyMode === "grams"
                      ? "text-[#6D28D9] border-b-2 border-[#6D28D9]"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Buy in Grams (g)
                </button>
              </div>

              {/* Amount / Grams Input Box */}
              <div className="space-y-2">
                <div className="bg-white border border-slate-200 focus-within:border-[#6D28D9] rounded-2xl p-3.5 sm:p-4 shadow-2xs transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      {buyMode === "amount" && (
                        <span className="text-lg font-black text-slate-400 mr-2 shrink-0 select-none">
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
                        className="w-full text-xl sm:text-2xl font-black text-slate-900 border-none outline-none bg-transparent placeholder:text-slate-300 placeholder:font-medium"
                      />
                      {buyMode === "grams" && (
                        <span className="text-sm font-bold text-slate-400 ml-1 shrink-0 select-none">
                          g
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (buyMode === "amount") setAmountInput("5000");
                        else setGramsInput("1.0");
                      }}
                      className="bg-purple-50 hover:bg-purple-100 text-[#6D28D9] font-black text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer outline-none border-none ml-2 shrink-0"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                {/* Roughly Calculated Value Display */}
                <div className="flex items-center justify-between text-xs sm:text-sm px-1">
                  <span className="font-bold text-slate-500">You will get roughly</span>
                  <span className="text-sm sm:text-base font-black text-slate-900">
                    {buyMode === "amount"
                      ? `${calculatedGrams.toFixed(4)} g`
                      : `₹${calculatedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </span>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs sm:text-sm">
                <h3 className="text-xs sm:text-sm font-black text-slate-800 mb-1.5">Order Summary</h3>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500">Live {metalName} Rate (per gram)</span>
                  <span className="font-black text-slate-900">
                    ₹{currentLockedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500 flex items-center gap-1">
                    Making Charges <Info size={11} className="text-slate-400" />
                  </span>
                  <span className="font-black text-slate-900">+₹0.00</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500">GST (3%)</span>
                  <span className="font-black text-slate-900">+₹{gstAmount.toFixed(2)}</span>
                </div>

                <div className="w-full h-px bg-slate-100 my-2" />

                <div className="flex justify-between items-end pt-1">
                  <span className="text-sm font-black text-slate-900">Total Payable</span>
                  <span className="text-2xl font-black text-[#6D28D9] tracking-tight">
                    ₹{totalPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Rate Locked Alert Sub-Pill */}
              <div className="bg-purple-50/90 border border-purple-100 py-2.5 px-4 rounded-xl text-center flex items-center justify-center gap-2 text-xs font-extrabold text-[#6D28D9]">
                <Lock size={14} />
                <span>
                  Rate locked at ₹{currentLockedPrice.toFixed(2)}/g for {formatTimer(timeLeft)} minutes
                </span>
              </div>

              {/* CTA Button */}
              <div className="mt-auto">
                <button
                  disabled={calculatedAmount <= 0}
                  onClick={handleProcessPayment}
                  className={`w-full py-3.5 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2 cursor-pointer border-none outline-none ${
                    calculatedAmount <= 0
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                      : "bg-[#6D28D9] hover:bg-[#5B21B6] text-white shadow-lg shadow-purple-600/30 hover:-translate-y-0.5"
                  }`}
                >
                  <Lock size={16} />
                  <span>Buy {metalName} Securely</span>
                  <ArrowRight size={18} />
                </button>

                <p className="text-[10px] font-bold text-slate-400 text-center mt-2 tracking-wide">
                  100% Secure Payment • SSL Encrypted • Trusted by 1M+ users
                </p>
              </div>

            </div>

          </div>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
