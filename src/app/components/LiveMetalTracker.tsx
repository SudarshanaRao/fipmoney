"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Zap,
  Info,
  ExternalLink,
  Award,
  Sparkles,
  Calculator,
  ArrowRight,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Coins,
  Scale,
  DollarSign,
  ChevronRight,
  Globe,
} from "lucide-react";
import {
  fetchLatestMetalPrices,
  ParsedMetalPrices,
  TROY_OUNCE_IN_GRAMS,
} from "../utils/metalPriceApi";

interface LiveMetalTrackerProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToBuyGold?: () => void;
  onNavigateToBuySilver?: () => void;
}

export default function LiveMetalTracker({
  onBack,
  onNavigateToHome,
  onNavigateToBuyGold,
  onNavigateToBuySilver,
}: LiveMetalTrackerProps) {
  const [data, setData] = useState<ParsedMetalPrices | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const handleGoHome = () => {
    if (onBack) onBack();
    else if (onNavigateToHome) onNavigateToHome();
    else if (typeof window !== "undefined") window.location.href = "/";
  };

  // Calculator State
  const [calcMetal, setCalcMetal] = useState<"gold24k" | "gold22k" | "gold18k" | "silver">("gold24k");
  const [calcWeight, setCalcWeight] = useState<number>(10);
  const [calcUnit, setCalcUnit] = useState<"gram" | "kg" | "oz">("gram");

  const loadData = async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchLatestMetalPrices(force);
      setData(result);
      setLastRefreshed(new Date(result.fetchedAt || result.timestamp));
    } catch (err: any) {
      setError("Unable to connect to live rates service. Showing cached market values.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only call once on component load - 24-hour cache handles quota protection
    loadData(false);
  }, []);

  // Format currency helpers
  const formatINR = (val: number, decimals = 2) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }).format(val);
  };

  // Calculator valuation computation
  const getCalculatedPrice = () => {
    if (!data) return 0;
    let ratePerGram = 0;
    if (calcMetal === "gold24k") ratePerGram = data.gold.perGram24K;
    else if (calcMetal === "gold22k") ratePerGram = data.gold.perGram22K;
    else if (calcMetal === "gold18k") ratePerGram = data.gold.perGram18K;
    else if (calcMetal === "silver") ratePerGram = data.silver.perGram;

    let grams = calcWeight;
    if (calcUnit === "kg") grams = calcWeight * 1000;
    if (calcUnit === "oz") grams = calcWeight * TROY_OUNCE_IN_GRAMS;

    return ratePerGram * grams;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-slate-50 to-amber-50/30 text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Action Bar with Back Button */}
      <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
        <button
          onClick={handleGoHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-800 font-bold text-xs sm:text-sm hover:bg-slate-100 hover:border-slate-300 transition-all duration-200 shadow-sm group cursor-pointer interactive-button"
        >
          <ArrowLeft className="w-4 h-4 text-amber-600 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block">
          FipMoney Precious Metals Tracking
        </span>
      </div>

      {/* Top Ticker Ribbon */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-3 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Institutional Bullion Feed (24H Cached)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-700">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-600 font-bold">24K Gold:</span>
              <span className="font-semibold">{data ? `${formatINR(data.gold.perGram24K)}/g` : "₹--.--"}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-bold">Fine Silver:</span>
              <span className="font-semibold">{data ? `${formatINR(data.silver.perGram)}/g` : "₹--.--"}</span>
            </div>

            <div className="hidden md:flex items-center gap-1.5">
              <span className="text-amber-700 font-bold">Gold/Oz:</span>
              <span className="font-semibold">{data ? formatINR(data.gold.perOz) : "₹--.--"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/60 text-amber-900 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 text-amber-600" />
          <span>Daily 24-Hour Locked Bullion Rates</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4"
        >
          Live <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent">Gold & Silver</span> Rate Tracking
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg font-normal"
        >
          Institutional spot prices in Indian Rupees (INR) fetched via{" "}
          <a
            href="https://metalpriceapi.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 font-bold hover:underline"
          >
            MetalpriceAPI
          </a>. Cached for 24 hours to optimize API usage.
        </motion.p>

        {/* Status Indicators */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-sm text-slate-700 font-medium">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>
              API Call Sync:{" "}
              {lastRefreshed
                ? lastRefreshed.toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "Fetching..."}
            </span>
          </div>

          {data && (
            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-sm ${
                data.isCached24h
                  ? "bg-amber-50 text-amber-800 border-amber-300"
                  : "bg-emerald-50 text-emerald-800 border-emerald-300"
              }`}
            >
              {data.isCached24h ? "🔒 24H API Quota Cache Active" : "⚡ Fresh API Data Fetched"}
            </span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Main Cards: Gold & Silver */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* GOLD SPOT CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl border border-amber-200/80 p-6 sm:p-8 shadow-xl shadow-amber-500/5 group hover:border-amber-300 hover:shadow-2xl transition-all duration-300"
          >
            {/* Background Accent Glow */}
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-amber-200/40 rounded-full blur-3xl group-hover:bg-amber-300/40 transition-all duration-500" />

            {/* Header / Symbol */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-md shadow-amber-500/20">
                  <div className="w-full h-full bg-amber-950 rounded-[14px] flex items-center justify-center text-amber-300 text-xl font-black">
                    Au
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    Digital Gold
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
                      24K • 99.9%
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Spot Ticker: INRXAU</p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  +0.42% 24h
                </span>
              </div>
            </div>

            {/* Highlighted Price Banner */}
            <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-amber-50/80 to-amber-100/50 border border-amber-200/60 flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
                  24K Gold Rate (Per Gram)
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold text-amber-900 tracking-tight">
                  {data ? formatINR(data.gold.perGram24K) : "₹--.--"}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Per 10 Grams (24K)
                </span>
                <span className="text-xl font-bold text-slate-900">
                  {data ? formatINR(data.gold.per10g24K) : "₹--.--"}
                </span>
              </div>
            </div>

            {/* Purity Rates Grid */}
            <div className="space-y-3 mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Purity & Weight Rates
              </h3>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:bg-amber-50/40 transition-colors">
                <span className="text-xs sm:text-sm font-semibold text-slate-700">24K Pure Gold (99.9%)</span>
                <span className="text-xs sm:text-sm font-extrabold text-amber-700">
                  {data ? `${formatINR(data.gold.perGram24K)} / g` : "---"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:bg-amber-50/40 transition-colors">
                <span className="text-xs sm:text-sm font-semibold text-slate-700">22K Standard Gold (91.6%)</span>
                <span className="text-xs sm:text-sm font-extrabold text-amber-700">
                  {data ? `${formatINR(data.gold.perGram22K)} / g` : "---"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:bg-amber-50/40 transition-colors">
                <span className="text-xs sm:text-sm font-semibold text-slate-700">18K Jewellery Gold (75.0%)</span>
                <span className="text-xs sm:text-sm font-extrabold text-amber-700">
                  {data ? `${formatINR(data.gold.perGram18K)} / g` : "---"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:bg-amber-50/40 transition-colors">
                <span className="text-xs sm:text-sm font-semibold text-slate-700">1 Troy Ounce (31.1035g)</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {data ? formatINR(data.gold.perOz) : "---"}
                </span>
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={onNavigateToBuyGold}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200 flex items-center justify-center gap-2 group/btn interactive-button"
            >
              <span>Buy Digital Gold at Live Rate</span>
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* SILVER SPOT CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 p-6 sm:p-8 shadow-xl shadow-slate-400/5 group hover:border-slate-300 hover:shadow-2xl transition-all duration-300"
          >
            {/* Background Accent Glow */}
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-slate-200/60 rounded-full blur-3xl group-hover:bg-slate-300/60 transition-all duration-500" />

            {/* Header / Symbol */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-400 to-slate-200 p-0.5 shadow-md shadow-slate-400/20">
                  <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-slate-100 text-xl font-black">
                    Ag
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    Digital Silver
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold border border-slate-200">
                      99.9% Fine
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Spot Ticker: INRXAG</p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  +1.15% 24h
                </span>
              </div>
            </div>

            {/* Highlighted Price Banner */}
            <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-slate-100/80 to-slate-200/50 border border-slate-200 flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Fine Silver Rate (Per Gram)
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {data ? formatINR(data.silver.perGram) : "₹--.--"}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Per 1 Kilogram (1000g)
                </span>
                <span className="text-xl font-bold text-slate-900">
                  {data ? formatINR(data.silver.perKg) : "₹--.--"}
                </span>
              </div>
            </div>

            {/* Silver Rates Grid */}
            <div className="space-y-3 mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Quantity Rates
              </h3>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:bg-slate-100/60 transition-colors">
                <span className="text-xs sm:text-sm font-semibold text-slate-700">1 Gram Silver</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {data ? formatINR(data.silver.perGram) : "---"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:bg-slate-100/60 transition-colors">
                <span className="text-xs sm:text-sm font-semibold text-slate-700">10 Grams Silver</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {data ? formatINR(data.silver.per10g) : "---"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:bg-slate-100/60 transition-colors">
                <span className="text-xs sm:text-sm font-semibold text-slate-700">1 Troy Ounce (31.1035g)</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {data ? formatINR(data.silver.perOz) : "---"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:bg-slate-100/60 transition-colors">
                <span className="text-xs sm:text-sm font-semibold text-slate-700">1 Kilogram (1000g Bar)</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {data ? formatINR(data.silver.perKg) : "---"}
                </span>
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={onNavigateToBuySilver}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-slate-950 text-white font-bold text-base shadow-lg shadow-slate-900/10 transition-all duration-200 flex items-center justify-center gap-2 group/btn interactive-button"
            >
              <span>Buy Digital Silver at Live Rate</span>
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* LIVE VALUATION CALCULATOR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-3xl bg-white/90 border border-slate-200/80 p-6 sm:p-8 shadow-xl backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-amber-100 text-amber-700 border border-amber-200">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Live Precious Metal Valuation Calculator</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Instantly calculate the INR market value for any custom weight based on live MetalpriceAPI rates.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Metal Select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Select Metal & Purity
              </label>
              <select
                value={calcMetal}
                onChange={(e: any) => setCalcMetal(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="gold24k">24K Pure Gold (99.9%)</option>
                <option value="gold22k">22K Standard Gold (91.6%)</option>
                <option value="gold18k">18K Jewellery Gold (75.0%)</option>
                <option value="silver">Fine Silver (99.9%)</option>
              </select>
            </div>

            {/* Quantity Input & Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Weight / Quantity
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm font-semibold focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Unit
                </label>
                <select
                  value={calcUnit}
                  onChange={(e: any) => setCalcUnit(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="gram">Grams (g)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="oz">Troy Ounces (oz)</option>
                </select>
              </div>
            </div>

            {/* Calculated Valuation Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-amber-100/60 to-yellow-50 border border-amber-300/80 flex flex-col justify-between shadow-sm">
              <span className="text-xs text-amber-800 font-extrabold uppercase tracking-wider">
                Calculated INR Worth
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber-950">
                {formatINR(getCalculatedPrice())}
              </span>
              <span className="text-[10px] font-semibold text-amber-800/80 mt-1">
                Real-time institutional spot rate equivalent
              </span>
            </div>
          </div>
        </motion.div>

        {/* MANDATORY METALPRICEAPI ATTRIBUTION SECTION */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <a
              href="https://metalpriceapi.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="Free Precious Metal Rates API"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-950 hover:to-slate-900 text-white px-4 py-2.5 rounded-xl shadow-sm transition-all duration-200 group"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-xs group-hover:scale-105 transition-transform">
                <Coins className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">
                  Data Provider
                </span>
                <span className="text-sm font-extrabold text-white tracking-tight leading-snug">
                  MetalpriceAPI<span className="text-amber-400">.com</span>
                </span>
              </div>
            </a>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Precious metal market rates & spot exchange data powered by{" "}
                <a
                  href="https://metalpriceapi.com/"
                  title="Free Precious Metal Rates API"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 font-extrabold underline hover:text-amber-700 inline-flex items-center gap-1"
                >
                  MetalpriceAPI.com
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Visible attribution provided in compliance with MetalpriceAPI Free Plan terms.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3.5 py-2 rounded-full border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Institutional Bullion Feed</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
