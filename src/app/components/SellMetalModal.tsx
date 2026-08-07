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
  Building2,
  Truck,
  Gem,
  Calendar,
  Wallet
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

type Step = "input" | "processing" | "success";
type SettlementOption = "bank" | "physical" | "jewellery";
type Timeframe = "1H" | "24H" | "7D" | "1M" | "1Y";

interface SellMetalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number, grams: number) => void;
  metal: "gold" | "silver";
  basePrice: number;
  initialAmount?: string;
  initialGrams?: string;
  initialMode?: "amount" | "grams";
}

const settlementOptionsData: Record<SettlementOption, { name: string; subtitle: string; tag: string }> = {
  bank: { name: "Instant Bank Account Settlement", subtitle: "Direct IMPS credit to HDFC Bank ****4910", tag: "Instant" },
  physical: { name: "Physical Coin / Bar Delivery", subtitle: "Doorstep delivery of BIS Hallmarked product", tag: "Doorstep" },
  jewellery: { name: "Jewellery Showroom Voucher", subtitle: "Redeem at Tanishq / Kalyan with +1% bonus", tag: "+1% Bonus" }
};

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

export default function SellMetalModal({
  isOpen,
  onClose,
  onSuccess,
  metal = "gold",
  basePrice = 12457.21,
  initialAmount,
  initialGrams,
  initialMode
}: SellMetalModalProps) {
  const [step, setStep] = useState<Step>("input");

  // Dynamic metal strings
  const metalName = metal === "gold" ? "Gold" : "Silver";
  const metalPurity = metal === "gold" ? "24K 99.99% Pure Digital Gold" : "99.9% Fine Pure Digital Silver";

  // Day-wise Stable Fixed Locked Rate
  const [lockedRate, setLockedRate] = useState<number>(basePrice);

  // Dynamic Live Market Ticker Rate
  const [liveMarketRate, setLiveMarketRate] = useState<number>(basePrice);

  // Input & Mode State
  const [sellMode, setSellMode] = useState<"amount" | "grams">("amount");
  const [amountInput, setAmountInput] = useState<string>("");
  const [gramsInput, setGramsInput] = useState<string>("");

  // Settlement Option & Timeframe
  const [selectedSettlement, setSelectedSettlement] = useState<SettlementOption>("bank");
  const [timeframe, setTimeframe] = useState<Timeframe>("24H");

  const currentLockedPrice = lockedRate;

  // Chart Data
  const chartData = useMemo(() => generateChartData(lockedRate), [lockedRate]);
  const lowPrice = useMemo(() => Math.min(...chartData.map(d => d.price)), [chartData]);
  const highPrice = useMemo(() => Math.max(...chartData.map(d => d.price)), [chartData]);

  // Calculations
  const calculatedGrams = useMemo(() => {
    if (sellMode === "grams") return Number(gramsInput) || 0;
    const amt = Number(amountInput) || 0;
    return amt / currentLockedPrice;
  }, [sellMode, amountInput, gramsInput, currentLockedPrice]);

  const calculatedAmount = useMemo(() => {
    if (sellMode === "amount") return Number(amountInput) || 0;
    const g = Number(gramsInput) || 0;
    return g * currentLockedPrice;
  }, [sellMode, amountInput, gramsInput, currentLockedPrice]);

  const feeAmount = 0; // 0% transaction fee
  const netPayout = useMemo(() => calculatedAmount - feeAmount, [calculatedAmount, feeAmount]);

  // Carry values seamlessly when toggling mode
  const handleSwitchMode = (mode: "amount" | "grams") => {
    if (mode === "grams" && sellMode === "amount") {
      const amt = Number(amountInput) || 0;
      if (amt > 0) {
        const g = amt / currentLockedPrice;
        setGramsInput(g.toFixed(4));
      }
    } else if (mode === "amount" && sellMode === "grams") {
      const g = Number(gramsInput) || 0;
      if (g > 0) {
        const amt = g * currentLockedPrice;
        setAmountInput(amt.toFixed(2));
      }
    }
    setSellMode(mode);
  };

  // Initialize mode & inputs
  useEffect(() => {
    if (isOpen) {
      setLockedRate(basePrice);
      setLiveMarketRate(basePrice);
      setStep("input");

      let targetMode: "amount" | "grams" = "amount";
      if (initialMode) {
        targetMode = initialMode;
      } else if (initialGrams && Number(initialGrams) > 0 && (!initialAmount || Number(initialAmount) === 0)) {
        targetMode = "grams";
      }

      setSellMode(targetMode);

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
    if (!isOpen) return;
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.45) * 4.5;
      setLiveMarketRate(prev => Number((prev + delta).toFixed(2)));
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleAddPreset = (value: number) => {
    setSellMode("amount");
    const current = Number(amountInput) || 0;
    setAmountInput((current + value).toString());
  };

  const handleProcessSell = () => {
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
        className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto lg:overflow-hidden"
      >
        <motion.div
          initial={{ scale: 0.96, y: 8 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 8 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-[24px] md:rounded-[32px] w-full max-w-[1160px] max-h-[96vh] lg:max-h-[90vh] overflow-y-auto lg:overflow-hidden shadow-2xl relative border border-slate-100 p-5 sm:p-6 lg:p-7 text-slate-800 font-sans hide-scrollbar flex flex-col justify-between"
        >

          {/* Close Button Top-Right */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-30 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors cursor-pointer border-none outline-none"
          >
            <X size={18} />
          </button>

          {/* Top Modal Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 shrink-0 pr-12 sm:pr-10">
            {/* Left: Dynamic Title & Subtitle */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
                <Wallet size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                  Sell Digital {metalName} & Settle
                </h1>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  Instant Payout to Bank Account or Physical Delivery
                </p>
              </div>
            </div>

            {/* Middle: Live Market Rate */}
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                LIVE SELL RATE
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

            {/* Right: Day-wise Price Lock Banner */}
            <div className="bg-emerald-50/80 border border-emerald-100 px-3.5 py-2 rounded-xl flex items-center gap-2 text-emerald-800 self-start sm:self-auto">
              <Calendar size={15} className="text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-black text-emerald-900">
                  Same-Day Rate Lock
                </div>
                <div className="text-[10px] font-semibold text-emerald-600 hidden sm:block">
                  Rate valid till 11:59 PM Today
                </div>
              </div>
            </div>
          </div>

          {/* Main 2-Column Split Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-4 flex-1 items-stretch">

            {/* LEFT COLUMN (Width: 7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4 lg:space-y-5 h-full">

              {/* 1. RATE LOCKED Info Box */}
              <div className="bg-[#ECFDF5] border border-emerald-200/80 rounded-2xl p-4 sm:p-5 relative shadow-2xs">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-200/80 text-emerald-800 flex items-center justify-center shrink-0">
                        <Lock size={14} strokeWidth={2.5} />
                      </div>
                      <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                        SAME-DAY PRICE LOCK
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-500 block pt-0.5">
                      Locked Sell Rate
                    </span>
                    <div className="text-2xl font-black text-slate-900 tracking-tight">
                      ₹{currentLockedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-sm font-bold text-slate-400"> /g</span>
                    </div>
                  </div>

                  {/* Oval Pill Gauge for Day-wise Price Lock */}
                  <div className="px-5 py-2.5 rounded-2xl border-2 border-emerald-500 bg-white flex flex-col items-center justify-center shadow-xs shrink-0 min-w-[108px]">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Calendar size={12} className="text-emerald-600" />
                      <span className="text-sm font-black text-slate-900 leading-none">
                        TODAY
                      </span>
                    </div>
                    <span className="text-[8px] font-extrabold text-emerald-700 uppercase tracking-wider">
                      VALID TILL 11:59 PM
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
                        LIVE {metalName.toUpperCase()} TREND (₹/G)
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
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs"
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
                        <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
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
                        formatter={(val: number) => [`₹${val.toFixed(2)}`, "Sell Rate"]}
                      />
                      <Area type="monotone" dataKey="price" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#emeraldGrad)" />
                      <ReferenceDot x="12 PM" y={lockedRate} r={4} fill="#10B981" stroke="#ffffff" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 mt-2 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>Real-time {metalName.toLowerCase()} sell rate powered by SafeGold</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                    <span>Last updated: 10:30:45 AM</span>
                    <RefreshCw size={12} className="cursor-pointer hover:text-slate-600" />
                  </div>
                </div>
              </div>

              {/* 3. Security Banner */}
              <div className="bg-gradient-to-r from-[#062016] via-[#0F3827] to-[#062016] rounded-2xl p-3.5 sm:p-4 text-white flex items-center justify-between shadow-xs border border-emerald-900/40 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center text-emerald-400 shrink-0">
                    <Shield size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-white leading-tight">Instant Bank Payout via SafeGold</h4>
                    <p className="text-[10px] sm:text-xs text-emerald-200/80 font-medium mt-0.5">
                      Funds transferred directly to linked bank account within 60 seconds with 0% vault fee.
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-3 text-xs font-bold text-emerald-200 shrink-0 ml-3">
                  <div className="flex items-center gap-1">
                    <Building2 size={14} className="text-emerald-400" />
                    <span>Instant IMPS</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sparkles size={14} className="text-emerald-400" />
                    <span>0% Fee</span>
                  </div>
                </div>
              </div>

            </div>


            {/* RIGHT COLUMN: Configuration & Order Summary (Width: 5 cols) */}
            <div className="lg:col-span-5 space-y-4 lg:space-y-5 flex flex-col justify-between h-full">

              {/* Sell Mode Tabs */}
              <div className="flex border-b border-slate-200 pb-1">
                <button
                  onClick={() => handleSwitchMode("amount")}
                  className={`flex-1 py-2 text-xs sm:text-sm font-extrabold text-center transition-colors cursor-pointer border-none outline-none bg-transparent ${
                    sellMode === "amount"
                      ? "text-emerald-600 border-b-2 border-emerald-600"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Sell in Amount (₹)
                </button>
                <button
                  onClick={() => handleSwitchMode("grams")}
                  className={`flex-1 py-2 text-xs sm:text-sm font-extrabold text-center transition-colors cursor-pointer border-none outline-none bg-transparent ${
                    sellMode === "grams"
                      ? "text-emerald-600 border-b-2 border-emerald-600"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Sell in Grams (g)
                </button>
              </div>

              {/* Amount / Grams Input Box */}
              <div className="space-y-2">
                <div className="bg-white border border-slate-200 focus-within:border-emerald-600 rounded-2xl p-3.5 sm:p-4 shadow-2xs transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      {sellMode === "amount" && (
                        <span className="text-lg font-black text-slate-400 mr-2 shrink-0 select-none">
                          ₹
                        </span>
                      )}
                      <input
                        type="number"
                        placeholder={sellMode === "amount" ? "Enter Amount to Sell" : "Enter Grams to Sell"}
                        value={sellMode === "amount" ? amountInput : gramsInput}
                        onChange={(e) => {
                          if (sellMode === "amount") setAmountInput(e.target.value);
                          else setGramsInput(e.target.value);
                        }}
                        className="w-full text-xl sm:text-2xl font-black text-slate-900 border-none outline-none bg-transparent placeholder:text-slate-300 placeholder:font-medium"
                      />
                      {sellMode === "grams" && (
                        <span className="text-sm font-bold text-slate-400 ml-1 shrink-0 select-none">
                          g
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (sellMode === "amount") setAmountInput("5000");
                        else setGramsInput("1.0");
                      }}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-black text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer outline-none border-none ml-2 shrink-0"
                    >
                      SELL ALL
                    </button>
                  </div>
                </div>

                {/* Roughly Calculated Value Display */}
                <div className="flex items-center justify-between text-xs sm:text-sm px-1">
                  <span className="font-bold text-slate-500">You will sell roughly</span>
                  <span className="text-sm sm:text-base font-black text-slate-900">
                    {sellMode === "amount"
                      ? `${calculatedGrams.toFixed(4)} g`
                      : `₹${calculatedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </span>
                </div>
              </div>

              {/* Select Payout / Redemption Method */}
              <div>
                <span className="text-xs font-black text-slate-800 flex items-center gap-1 mb-1.5">
                  Select Payout / Redemption Method <Info size={12} className="text-slate-400" />
                </span>

                <div className="space-y-2">
                  {(Object.keys(settlementOptionsData) as SettlementOption[]).map((opt) => {
                    const option = settlementOptionsData[opt];
                    const isSelected = selectedSettlement === opt;
                    return (
                      <div
                        key={opt}
                        onClick={() => setSelectedSettlement(opt)}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? "border-2 border-emerald-600 bg-emerald-50/60"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-emerald-600" : "border-slate-300"}`}>
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />}
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-black text-slate-900">{option.name}</div>
                            <div className="text-[10px] font-semibold text-slate-400">{option.subtitle}</div>
                          </div>
                        </div>

                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          {option.tag}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs sm:text-sm">
                <h3 className="text-xs sm:text-sm font-black text-slate-800 mb-1.5">Order Summary</h3>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500">Live {metalName} Sell Rate (per gram)</span>
                  <span className="font-black text-slate-900">
                    ₹{currentLockedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500">Vault Transfer Fee</span>
                  <span className="font-black text-emerald-600">₹0.00 (Free)</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500">TDS / Deductions</span>
                  <span className="font-black text-slate-900">₹0.00</span>
                </div>

                <div className="w-full h-px bg-slate-100 my-2" />

                <div className="flex justify-between items-end pt-1">
                  <span className="text-sm font-black text-slate-900">Net Bank Payout</span>
                  <span className="text-2xl font-black text-emerald-600 tracking-tight">
                    ₹{netPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Day-wise Rate Lock Alert Pill */}
              <div className="bg-emerald-50/90 border border-emerald-100 py-2.5 px-4 rounded-xl text-center flex items-center justify-center gap-2 text-xs font-extrabold text-emerald-800">
                <Calendar size={14} />
                <span>
                  Same-Day Locked Sell Rate ₹{currentLockedPrice.toFixed(2)}/g (Valid till 11:59 PM)
                </span>
              </div>

              {/* CTA Button */}
              <div className="mt-auto">
                <button
                  disabled={calculatedAmount <= 0}
                  onClick={handleProcessSell}
                  className={`w-full py-3.5 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2 cursor-pointer border-none outline-none ${
                    calculatedAmount <= 0
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 hover:-translate-y-0.5"
                  }`}
                >
                  <Wallet size={16} />
                  <span>Sell {metalName} & Settle Instantly</span>
                  <ArrowRight size={18} />
                </button>

                <p className="text-[10px] font-bold text-slate-400 text-center mt-2 tracking-wide">
                  100% Guaranteed Payout • Instant IMPS Settlement • Bank Verified
                </p>
              </div>

            </div>

          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
