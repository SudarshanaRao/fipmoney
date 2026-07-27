"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  RefreshCw, 
  Sparkles, 
  Coins, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  Award,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Scale
} from "lucide-react";
import { fetchLatestMetalPrices, ParsedMetalPrices } from "../utils/metalPriceApi";

interface MiniMetalTrackerProps {
  onNavigate?: (page: string) => void;
}

export default function MiniMetalTracker({ onNavigate }: MiniMetalTrackerProps) {
  const [data, setData] = useState<ParsedMetalPrices | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMetal, setActiveMetal] = useState<"gold" | "silver">("gold");
  const [selectedWeight, setSelectedWeight] = useState<1 | 8 | 10 | 100>(1);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const loadData = async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchLatestMetalPrices(force);
      setData(result);
      setLastRefreshed(new Date(result.fetchedAt || result.timestamp));
    } catch (err: any) {
      setError("Live rates temporarily unavailable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(false);
  }, []);

  const formatINR = (val: number, decimals = 0) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }).format(val);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-amber-50/40 via-white to-slate-50/60 border-y border-amber-100/60 relative overflow-hidden" id="live-prices-mini">
      
      {/* Background ambient lighting aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-80 bg-gradient-to-b from-amber-200/20 via-yellow-100/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 md:px-8 max-w-7xl relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-amber-100/70 border border-amber-300/60 text-amber-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              ⚡ Live Bullion Market Exchange
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Live Market Rates <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent">& Interactive Price Tracker</span>
            </h2>
            <p className="text-sm md:text-base font-semibold text-slate-600 max-w-2xl leading-relaxed">
              Real-time 24K, 22K, 18K Gold and 99.9% Pure Silver benchmark prices updated directly from verified bullion markets.
            </p>
          </div>

          {/* Controls: Segmented Metal Switcher & Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Metal Type Switcher */}
            <div className="bg-slate-100/90 border border-slate-200/80 p-1.5 rounded-2xl flex items-center gap-1 shadow-inner">
              <button
                onClick={() => setActiveMetal("gold")}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-300 cursor-pointer ${
                  activeMetal === "gold"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Coins className="w-4 h-4" />
                <span>Digital Gold</span>
              </button>
              <button
                onClick={() => setActiveMetal("silver")}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-300 cursor-pointer ${
                  activeMetal === "silver"
                    ? "bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-md shadow-slate-800/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Digital Silver</span>
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => loadData(true)}
              disabled={loading}
              className="p-3 bg-white hover:bg-amber-50/60 border border-slate-200 text-slate-700 hover:text-amber-600 rounded-2xl transition-all cursor-pointer shadow-sm hover:shadow"
              title="Refresh Live Rates"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-amber-600" : ""}`} />
            </button>

            {/* Full Analytics Button */}
            <button
              onClick={() => onNavigate?.('live-metal-tracker')}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs font-extrabold text-white bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 rounded-2xl transition-all shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02] cursor-pointer"
            >
              <span>Full Analytics Tracker</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Weight Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm w-fit">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mr-2 pl-2">
            <Scale className="w-3.5 h-3.5 text-amber-500" />
            <span>Select Weight:</span>
          </div>
          {([1, 8, 10, 100] as const).map((wt) => (
            <button
              key={wt}
              onClick={() => setSelectedWeight(wt)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedWeight === wt
                  ? "bg-amber-100 text-amber-800 border border-amber-300/80 shadow-sm"
                  : "bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100"
              }`}
            >
              {wt} Grams
            </button>
          ))}
        </div>

        {/* Live Cards Grid */}
        <AnimatePresence mode="wait">
          {activeMetal === "gold" ? (
            <motion.div 
              key="gold-cards"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* 24K Pure Gold Hero Card */}
              <motion.div 
                whileHover={{ y: -6, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                className="relative bg-gradient-to-br from-[#fffdf5] via-white to-[#fffbeb] border-2 border-amber-300/90 rounded-3xl p-7 flex flex-col justify-between shadow-[0_12px_35px_rgba(245,158,11,0.12)] hover:shadow-[0_20px_45px_rgba(245,158,11,0.22)] transition-all group overflow-hidden"
              >
                {/* Gold Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-600" />
                
                <div>
                  {/* Card Header Badges */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex items-center gap-1.5 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm tracking-wider">
                      <Award className="w-3.5 h-3.5 text-slate-950" /> 24K 99.99% Pure
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg shadow-xs">
                      <TrendingUp className="w-3.5 h-3.5" /> +0.48% Today
                    </span>
                  </div>

                  <div className="text-xs font-extrabold uppercase tracking-wider text-amber-700 mb-1">
                    Bullion Benchmark
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                    24K Pure Gold
                  </h3>

                  {/* Dynamic Calculated Price Tag */}
                  <div className="mt-6 space-y-1">
                    <div className="text-4xl font-black text-slate-900 tracking-tight">
                      {data ? formatINR(data.gold.perGram24K * selectedWeight) : "₹7,650"}
                      <span className="text-xs font-bold text-slate-500 tracking-normal ml-1">
                        / {selectedWeight} Gram{selectedWeight > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 pt-3 border-t border-amber-200/60 mt-3">
                      <span>Rate per Gram:</span>
                      <span className="text-amber-700 font-extrabold text-sm">
                        {data ? formatINR(data.gold.perGram24K) : "₹7,650"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action CTA Button */}
                <button 
                  onClick={() => onNavigate?.('login')}
                  className="mt-8 w-full py-3.5 px-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-300 hover:shadow-lg hover:shadow-amber-400 cursor-pointer flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                >
                  <span>Buy 24K Gold Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* 22K Gold Card */}
              <motion.div 
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                className="relative bg-white border border-slate-200/90 hover:border-amber-300/80 rounded-3xl p-7 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all group overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400" />
                
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
                      91.6% Jewelry Standard
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                      22K Standard
                    </span>
                  </div>

                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Jewelry Standard Rate
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">
                    22K Gold
                  </h3>

                  {/* Dynamic Price Tag */}
                  <div className="mt-6 space-y-1">
                    <div className="text-4xl font-black text-slate-900 tracking-tight">
                      {data ? formatINR(data.gold.perGram22K * selectedWeight) : "₹7,012"}
                      <span className="text-xs font-bold text-slate-500 tracking-normal ml-1">
                        / {selectedWeight} Gram{selectedWeight > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 pt-3 border-t border-slate-100 mt-3">
                      <span>Rate per Gram:</span>
                      <span className="text-slate-900 font-extrabold text-sm">
                        {data ? formatINR(data.gold.perGram22K) : "₹7,012"}
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => onNavigate?.('login')}
                  className="mt-8 w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Buy 22K Gold</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* 18K Gold Card */}
              <motion.div 
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                className="relative bg-white border border-slate-200/90 hover:border-slate-300 rounded-3xl p-7 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all group overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-300" />
                
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
                      75.0% Purity
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                      18K Standard
                    </span>
                  </div>

                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Affordable Gold Rate
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">
                    18K Gold
                  </h3>

                  {/* Dynamic Price Tag */}
                  <div className="mt-6 space-y-1">
                    <div className="text-4xl font-black text-slate-900 tracking-tight">
                      {data ? formatINR(data.gold.perGram18K * selectedWeight) : "₹5,738"}
                      <span className="text-xs font-bold text-slate-500 tracking-normal ml-1">
                        / {selectedWeight} Gram{selectedWeight > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 pt-3 border-t border-slate-100 mt-3">
                      <span>Rate per Gram:</span>
                      <span className="text-slate-900 font-extrabold text-sm">
                        {data ? formatINR(data.gold.perGram18K) : "₹5,738"}
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => onNavigate?.('login')}
                  className="mt-8 w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-slate-200 flex items-center justify-center gap-2"
                >
                  <span>Buy 18K Gold</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="silver-cards"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Pure Silver per Gram Hero Card */}
              <motion.div 
                whileHover={{ y: -6, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100/60 border-2 border-slate-300 rounded-3xl p-7 flex flex-col justify-between shadow-[0_12px_35px_rgba(15,23,42,0.06)] hover:shadow-xl transition-all group overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-600" />
                
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex items-center gap-1.5 bg-slate-800 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-slate-200" /> 99.9% Fine Silver
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                      <TrendingUp className="w-3.5 h-3.5" /> Live
                    </span>
                  </div>

                  <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Micro Investment Benchmark
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-slate-700 transition-colors">
                    Digital Silver (Gram Rate)
                  </h3>

                  {/* Dynamic Price Tag */}
                  <div className="mt-6 space-y-1">
                    <div className="text-4xl font-black text-slate-900 tracking-tight">
                      {data ? formatINR(data.silver.perGram * selectedWeight, 2) : "₹92.50"}
                      <span className="text-xs font-bold text-slate-500 tracking-normal ml-1">
                        / {selectedWeight} Gram{selectedWeight > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 pt-3 border-t border-slate-200/80 mt-3">
                      <span>Rate per Gram:</span>
                      <span className="text-slate-900 font-extrabold text-sm">
                        {data ? formatINR(data.silver.perGram, 2) : "₹92.50"}
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => onNavigate?.('login')}
                  className="mt-8 w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                >
                  <span>Buy Digital Silver</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Pure Silver 1 KG Card */}
              <motion.div 
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                className="relative bg-white border border-slate-200/90 hover:border-slate-300 rounded-3xl p-7 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all group overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-400" />
                
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
                      Bulk Bullion Rate
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                      1 KG Vault Bar
                    </span>
                  </div>

                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Institutional Bullion Rate
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">
                    Digital Silver (1 KG Bar)
                  </h3>

                  {/* Price Tag */}
                  <div className="mt-6 space-y-1">
                    <div className="text-4xl font-black text-slate-900 tracking-tight">
                      {data ? formatINR(data.silver.perKg, 0) : "₹92,500"}
                      <span className="text-xs font-bold text-slate-500 tracking-normal ml-1">/ 1 KG</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 pt-3 border-t border-slate-100 mt-3">
                      <span>Vault Storage:</span>
                      <span className="text-emerald-700 font-extrabold text-xs">
                        100% Bank Grade Insured
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => onNavigate?.('login')}
                  className="mt-8 w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-slate-200 flex items-center justify-center gap-2"
                >
                  <span>Buy Silver Bars</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust Badges Footer Bar */}
        <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-6 text-xs font-bold text-slate-600">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-amber-800 bg-amber-50 border border-amber-200/60 px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>24K 99.99% BIS Hallmarked Purity</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Instant Buy, Sell & Physical Doorstep Delivery</span>
            </div>
          </div>
          {lastRefreshed && (
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[11px]">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Market rates updated: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
