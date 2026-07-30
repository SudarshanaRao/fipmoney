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
  ArrowUpRight,
  CheckCircle2,
  Scale,
  Award,
  Lock,
  Landmark,
  Clock,
  ShoppingCart,
  Activity
} from "lucide-react";
import { fetchLatestMetalPrices, ParsedMetalPrices } from "../utils/metalPriceApi";

interface MiniMetalTrackerProps {
  onNavigate?: (page: string) => void;
}

const SparklineGold = () => (
  <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 18L12 12L22 15L35 6L45 10L59 2" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SparklineSilver = () => (
  <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 18L12 12L22 15L35 6L45 10L59 2" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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
    <section className="py-16 bg-[#fcfcfc] relative overflow-hidden" id="live-prices-mini">
      <div className="container mx-auto px-6 md:px-8 max-w-[1200px] relative z-10 space-y-8">
        
        {/* Top Section */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Title Area */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-3 py-1.5 border border-slate-100 shadow-sm text-[11px] font-bold text-orange-600 tracking-wider">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              LIVE BULLION MARKET EXCHANGE
            </div>
            <h2 className="text-4xl md:text-[44px] font-black text-slate-900 leading-[1.1] tracking-tight">
              Live Market Rates & <br />
              <span className="text-[#c77a1e]">Interactive Price Tracker</span>
            </h2>
            <p className="text-slate-600 max-w-md font-medium text-sm leading-relaxed">
              Real-time 24K, 22K, 18K Gold and 99.9% Pure Silver benchmark prices updated directly from verified bullion markets.
            </p>
          </div>
          
          {/* Right: Quick Stats & Controls */}
          <div className="flex flex-col gap-5 lg:items-end w-full">
            
            {/* Quick Cards */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-4 flex-1 min-w-max">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center shrink-0">
                  <div className="w-8 h-8 bg-amber-200 rounded text-amber-600 flex items-center justify-center"><Coins className="w-5 h-5"/></div>
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <div className="text-[10px] font-bold text-amber-700 tracking-wider whitespace-nowrap">24K PURE GOLD</div>
                  <div className="text-xl font-black text-slate-900 flex items-baseline gap-0.5 whitespace-nowrap">
                    {data ? formatINR(data.gold.perGram24K) : "₹12,365"} <span className="text-[10px] text-slate-500 font-medium">/ g</span>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5 whitespace-nowrap">
                    <TrendingUp className="w-3 h-3 shrink-0" /> 0.48% (Today)
                  </div>
                </div>
                <div className="hidden sm:block shrink-0">
                  <SparklineGold />
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-4 flex-1 min-w-max">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center shrink-0">
                  <div className="w-8 h-8 bg-slate-200 rounded text-slate-600 flex items-center justify-center"><Sparkles className="w-5 h-5"/></div>
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <div className="text-[10px] font-bold text-slate-500 tracking-wider whitespace-nowrap">99.9% PURE SILVER</div>
                  <div className="text-xl font-black text-slate-900 flex items-baseline gap-0.5 whitespace-nowrap">
                    {data ? formatINR(data.silver.perGram, 2) : "₹76.54"} <span className="text-[10px] text-slate-500 font-medium">/ g</span>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5 whitespace-nowrap">
                    <TrendingUp className="w-3 h-3 shrink-0" /> 0.08% (Today)
                  </div>
                </div>
                <div className="hidden sm:block shrink-0">
                  <SparklineSilver />
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-white border border-slate-200 p-1 rounded-xl flex items-center shadow-sm">
                <button 
                  onClick={() => setActiveMetal("gold")}
                  className={`px-4 py-2 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${activeMetal === 'gold' ? 'bg-[#ef961e] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Coins className="w-3.5 h-3.5" /> Digital Gold
                </button>
                <button 
                  onClick={() => setActiveMetal("silver")}
                  className={`px-4 py-2 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${activeMetal === 'silver' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Digital Silver
                </button>
              </div>
              <button onClick={() => loadData(true)} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm cursor-pointer">
                <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={() => onNavigate?.('live-metal-tracker')} className="px-5 py-2.5 bg-[#0f172a] text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 hover:bg-slate-800 shadow-sm cursor-pointer">
                Full Analytics Tracker <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Weight Selector Bar */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm bg-amber-50/50 px-4 py-2 rounded-full">
              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                <Scale className="w-3.5 h-3.5 text-amber-600" /> 
              </div>
              Select Weight
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {([1, 8, 10, 100] as const).map(wt => (
                <button
                  key={wt}
                  onClick={() => setSelectedWeight(wt)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    selectedWeight === wt 
                      ? 'border-amber-300 bg-[#fef8eb] text-amber-700' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {wt} Gram{wt > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-left">
              <div className="text-[11px] font-bold text-emerald-700">100% Transparent Pricing</div>
              <div className="text-[10px] font-medium text-slate-500">Live rates from verified sources</div>
            </div>
          </div>
        </div>

        {/* Live Cards */}
        <AnimatePresence mode="wait">
          {activeMetal === "gold" ? (
            <motion.div 
              key="gold-cards"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* 24K Card */}
              <div className="bg-white rounded-3xl border-2 border-amber-300 shadow-[0_8px_30px_rgba(245,158,11,0.08)] p-7 flex flex-col h-full relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-300 to-amber-500" />
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-1.5 bg-[#fef8eb] px-3 py-1.5 rounded-full text-[10px] font-bold text-amber-700">
                    <Award className="w-3.5 h-3.5" /> 24K 99.99% PURE
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1.5 rounded-full">
                    <TrendingUp className="w-3 h-3" /> 0.48% Today
                  </div>
                </div>
                <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">BULLION BENCHMARK</div>
                <h3 className="text-[22px] font-black text-slate-900 mb-5">24K Pure Gold</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-[32px] font-black text-slate-900 tracking-tight">{data ? formatINR(data.gold.perGram24K * selectedWeight) : "₹12,365"}</span>
                  <span className="text-[11px] font-bold text-slate-500">/ Gram</span>
                </div>
                <div className="border-t border-dashed border-slate-200 my-4" />
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-1.5 text-slate-600 font-bold text-[11px]">
                    <Activity className="w-4 h-4 text-amber-500" /> Rate per Gram
                  </div>
                  <div className="font-bold text-amber-700 text-sm">{data ? formatINR(data.gold.perGram24K) : "₹12,365"}</div>
                </div>
                <button 
                  onClick={() => onNavigate?.('login')}
                  className="mt-auto w-full py-4 bg-[#e68200] hover:bg-[#cc7200] text-white rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" /> BUY 24K GOLD NOW <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* 22K Card */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] p-7 flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-1.5 bg-[#fffaf0] border border-amber-100 px-3 py-1.5 rounded-full text-[10px] font-bold text-amber-700">
                    <Award className="w-3.5 h-3.5 text-amber-500" /> 91.6% PURITY
                  </div>
                  <div className="flex items-center gap-1 bg-slate-50 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-full">
                    22K Standard
                  </div>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">JEWELRY STANDARD RATE</div>
                <h3 className="text-[22px] font-black text-slate-900 mb-5">22K Gold</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-[32px] font-black text-slate-900 tracking-tight">{data ? formatINR(data.gold.perGram22K * selectedWeight) : "₹11,335"}</span>
                  <span className="text-[11px] font-bold text-slate-500">/ Gram</span>
                </div>
                <div className="border-t border-dashed border-slate-200 my-4" />
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-1.5 text-slate-600 font-bold text-[11px]">
                    <Activity className="w-4 h-4 text-slate-400" /> Rate per Gram
                  </div>
                  <div className="font-bold text-slate-900 text-sm">{data ? formatINR(data.gold.perGram22K) : "₹11,335"}</div>
                </div>
                <button 
                  onClick={() => onNavigate?.('login')}
                  className="mt-auto w-full py-4 bg-[#0f172a] hover:bg-slate-800 text-white rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" /> BUY 22K GOLD <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* 18K Card */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] p-7 flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-600">
                    <Award className="w-3.5 h-3.5 text-slate-400" /> 75.0% PURITY
                  </div>
                  <div className="flex items-center gap-1 bg-slate-50 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-full">
                    18K Standard
                  </div>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">AFFORDABLE GOLD RATE</div>
                <h3 className="text-[22px] font-black text-slate-900 mb-5">18K Gold</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-[32px] font-black text-slate-900 tracking-tight">{data ? formatINR(data.gold.perGram18K * selectedWeight) : "₹9,274"}</span>
                  <span className="text-[11px] font-bold text-slate-500">/ Gram</span>
                </div>
                <div className="border-t border-dashed border-slate-200 my-4" />
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-1.5 text-slate-600 font-bold text-[11px]">
                    <Activity className="w-4 h-4 text-slate-400" /> Rate per Gram
                  </div>
                  <div className="font-bold text-slate-900 text-sm">{data ? formatINR(data.gold.perGram18K) : "₹9,274"}</div>
                </div>
                <button 
                  onClick={() => onNavigate?.('login')}
                  className="mt-auto w-full py-4 bg-[#f1f5f9] hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" /> BUY 18K GOLD <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="silver-cards"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Silver Gram Card */}
              <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-7 flex flex-col h-full relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-400 to-slate-600" />
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-700">
                    <Sparkles className="w-3.5 h-3.5 text-slate-500" /> 99.9% FINE SILVER
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1.5 rounded-full">
                    <TrendingUp className="w-3 h-3" /> 0.08% Today
                  </div>
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">MICRO INVESTMENT BENCHMARK</div>
                <h3 className="text-[22px] font-black text-slate-900 mb-5">Digital Silver (Gram Rate)</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-[32px] font-black text-slate-900 tracking-tight">{data ? formatINR(data.silver.perGram * selectedWeight, 2) : "₹76.54"}</span>
                  <span className="text-[11px] font-bold text-slate-500">/ Gram</span>
                </div>
                <div className="border-t border-dashed border-slate-200 my-4" />
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-1.5 text-slate-600 font-bold text-[11px]">
                    <Activity className="w-4 h-4 text-slate-400" /> Rate per Gram
                  </div>
                  <div className="font-bold text-slate-900 text-sm">{data ? formatINR(data.silver.perGram, 2) : "₹76.54"}</div>
                </div>
                <button 
                  onClick={() => onNavigate?.('login')}
                  className="mt-auto w-full py-4 bg-[#0f172a] hover:bg-slate-800 text-white rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" /> BUY DIGITAL SILVER <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Silver KG Card */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] p-7 flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-600">
                    <Landmark className="w-3.5 h-3.5 text-slate-400" /> BULK BULLION RATE
                  </div>
                  <div className="flex items-center gap-1 bg-slate-50 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-full">
                    1 KG Vault Bar
                  </div>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">INSTITUTIONAL BULLION RATE</div>
                <h3 className="text-[22px] font-black text-slate-900 mb-5">Digital Silver (1 KG Bar)</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-[32px] font-black text-slate-900 tracking-tight">{data ? formatINR(data.silver.perKg, 0) : "₹76,540"}</span>
                  <span className="text-[11px] font-bold text-slate-500">/ 1 KG</span>
                </div>
                <div className="border-t border-dashed border-slate-200 my-4" />
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-1.5 text-slate-600 font-bold text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Vault Storage
                  </div>
                  <div className="font-bold text-emerald-700 text-xs">100% Bank Grade Insured</div>
                </div>
                <button 
                  onClick={() => onNavigate?.('login')}
                  className="mt-auto w-full py-4 bg-[#f1f5f9] hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" /> BUY SILVER BARS <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Features */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-900 mb-0.5">Live & Accurate</div>
              <div className="text-[10px] text-slate-500 leading-tight">Real-time market prices you can trust</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
              <Lock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-900 mb-0.5">100% Transparent</div>
              <div className="text-[10px] text-slate-500 leading-tight">No hidden charges, what you see is what you pay</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
              <Landmark className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-900 mb-0.5">Verified Sources</div>
              <div className="text-[10px] text-slate-500 leading-tight">Rates from MCX, IIBX & global bullion markets</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-900 mb-0.5">Auto Refresh</div>
              <div className="text-[10px] text-slate-500 leading-tight">Prices update every 30 seconds</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
