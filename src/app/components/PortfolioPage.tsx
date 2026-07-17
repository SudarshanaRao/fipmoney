"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, 
  Coins, Sparkles, ChevronRight, ArrowRight, ShieldCheck, 
  Activity, CircleDollarSign, Percent
} from "lucide-react";

interface PortfolioPageProps {
  onNavigate?: (page: string) => void;
}

export default function PortfolioPage({ onNavigate }: PortfolioPageProps) {
  // Load live prices and holdings from localStorage or set defaults
  const [goldPrice, setGoldPrice] = useState<number>(6420.50);
  const [silverPrice, setSilverPrice] = useState<number>(84.20);
  
  const [goldHoldings, setGoldHoldings] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fip_gold_holdings");
      return saved ? parseFloat(saved) : 12.4502;
    }
    return 12.4502;
  });

  const [silverHoldings, setSilverHoldings] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fip_silver_holdings");
      return saved ? parseFloat(saved) : 340.2005;
    }
    return 340.2005;
  });

  // Calculate portfolio values
  const goldValue = goldHoldings * goldPrice;
  const silverValue = silverHoldings * silverPrice;
  const cashBalance = 5250.00; // Mock wallet cash balance
  const totalValue = goldValue + silverValue + cashBalance;

  // Mock Average Purchase Prices to calculate gains
  const avgGoldBuyPrice = 5850.00;
  const avgSilverBuyPrice = 76.50;

  const goldCostBasis = goldHoldings * avgGoldBuyPrice;
  const silverCostBasis = silverHoldings * avgSilverBuyPrice;
  const totalCostBasis = goldCostBasis + silverCostBasis + cashBalance;

  const totalGain = totalValue - totalCostBasis;
  const totalGainPercent = totalCostBasis > 0 ? (totalGain / totalCostBasis) * 100 : 0;

  // Sync holdings from localStorage periodically
  useEffect(() => {
    const handleStorageChange = () => {
      const savedGold = localStorage.getItem("fip_gold_holdings");
      if (savedGold) setGoldHoldings(parseFloat(savedGold));
      const savedSilver = localStorage.getItem("fip_silver_holdings");
      if (savedSilver) setSilverHoldings(parseFloat(savedSilver));
    };

    window.addEventListener("storage", handleStorageChange);
    // Poll every second as well in case of single page navigation changes
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Allocation percentages
  const goldAlloc = totalValue > 0 ? (goldValue / totalValue) * 100 : 0;
  const silverAlloc = totalValue > 0 ? (silverValue / totalValue) * 100 : 0;
  const cashAlloc = totalValue > 0 ? (cashBalance / totalValue) * 100 : 0;

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#f8fafc] pb-24 relative">
      {/* Decorative Floating Mesh Gradients */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-200/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-80 right-10 w-80 h-80 bg-slate-200/20 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Portfolio</h1>
            <p className="text-sm font-semibold text-slate-400 mt-1">Real-time valuation of your precious metal holdings and cash balance.</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2 rounded-2xl text-xs font-bold shadow-sm">
            <ShieldCheck size={16} className="text-emerald-600" /> Secure Vault Storage Verified
          </div>
        </div>

        {/* Portfolio Summary Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Balance Card */}
          <div className="lg:col-span-8 bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(15,23,42,0.15)] relative overflow-hidden flex flex-col justify-between min-h-[250px]">
            {/* Glossy Overlay Pattern */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/95 to-slate-800 opacity-90" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-3xl" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total Portfolio Value</span>
                <span className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={12} className="text-amber-400" /> Live Feed Active
                </span>
              </div>
              
              <div className="space-y-1">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                  ₹{Math.round(totalValue).toLocaleString()}
                </h1>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-0.5 text-xs font-black px-2 py-0.5 rounded-full ${totalGain >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                    {totalGain >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {totalGain >= 0 ? "+" : ""}₹{Math.round(Math.abs(totalGain)).toLocaleString()} ({totalGainPercent.toFixed(2)}%)
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">Total Returns</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="relative z-10 grid grid-cols-3 gap-4 pt-6 border-t border-white/10 mt-6">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Metal Value</span>
                <h3 className="text-base font-black mt-1">₹{Math.round(goldValue + silverValue).toLocaleString()}</h3>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cash Wallet</span>
                <h3 className="text-base font-black mt-1">₹{Math.round(cashBalance).toLocaleString()}</h3>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cost Basis</span>
                <h3 className="text-base font-black mt-1">₹{Math.round(totalCostBasis).toLocaleString()}</h3>
              </div>
            </div>
          </div>

          {/* Allocation Breakdown Chart */}
          <div className="lg:col-span-4 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
              <Coins size={14} className="text-amber-500" /> Asset Allocation
            </h3>

            {/* Custom Interactive Allocation Bar */}
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              <div className="h-6 w-full rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                  style={{ width: `${goldAlloc}%` }}
                  title={`Gold: ${goldAlloc.toFixed(1)}%`}
                />
                <div 
                  className="h-full bg-gradient-to-r from-slate-400 to-slate-300 transition-all duration-500"
                  style={{ width: `${silverAlloc}%` }}
                  title={`Silver: ${silverAlloc.toFixed(1)}%`}
                />
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                  style={{ width: `${cashAlloc}%` }}
                  title={`Cash: ${cashAlloc.toFixed(1)}%`}
                />
              </div>

              {/* Allocation Legend */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                    <span>24K Gold</span>
                  </div>
                  <span className="font-extrabold text-slate-900">{goldAlloc.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <span className="w-3 h-3 rounded-full bg-slate-400 shrink-0" />
                    <span>99.9 Silver</span>
                  </div>
                  <span className="font-extrabold text-slate-900">{silverAlloc.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                    <span>Cash Wallet</span>
                  </div>
                  <span className="font-extrabold text-slate-900">{cashAlloc.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Performance Cards */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">Vault Holdings Detail</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Gold Vault Card */}
            <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.01)] space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-100 py-1 px-3 rounded-full uppercase tracking-wider">
                    24K Gold Vault
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">{goldHoldings.toFixed(4)} grams</h3>
                  <p className="text-xs font-semibold text-slate-400">Average Buy Price: ₹{avgGoldBuyPrice.toLocaleString()}/g</p>
                </div>
                <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
                  <Coins size={22} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Current Value</span>
                  <span className="font-extrabold text-slate-950 text-base">₹{Math.round(goldValue).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Total Returns</span>
                  <span className={`font-extrabold text-base flex items-center gap-0.5 ${(goldValue - goldCostBasis) >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                    {(goldValue - goldCostBasis) >= 0 ? "+" : ""}
                    {(((goldValue - goldCostBasis) / (goldCostBasis || 1)) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Silver Vault Card */}
            <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.01)] space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-600 bg-slate-50 border border-slate-100 py-1 px-3 rounded-full uppercase tracking-wider">
                    99.9 Silver Vault
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">{silverHoldings.toFixed(4)} grams</h3>
                  <p className="text-xs font-semibold text-slate-400">Average Buy Price: ₹{avgSilverBuyPrice.toLocaleString()}/g</p>
                </div>
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-500 shrink-0">
                  <Coins size={22} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Current Value</span>
                  <span className="font-extrabold text-slate-950 text-base">₹{Math.round(silverValue).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Total Returns</span>
                  <span className={`font-extrabold text-base flex items-center gap-0.5 ${(silverValue - silverCostBasis) >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                    {(silverValue - silverCostBasis) >= 0 ? "+" : ""}
                    {(((silverValue - silverCostBasis) / (silverCostBasis || 1)) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-800">Quick Metal Investments</h4>
              <p className="text-xs text-slate-400 font-semibold">Instantly purchase digital gold or silver directly from your cash balance.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onNavigate?.("sip")}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-500 text-white font-extrabold text-xs py-3 px-6 rounded-xl border-none outline-none cursor-pointer transition-transform active:scale-95 hover:scale-102 shadow-md"
            >
              Buy Metals <ChevronRight size={14} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => onNavigate?.("history")}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-extrabold text-xs py-3 px-6 rounded-xl border border-slate-200 outline-none cursor-pointer transition-transform active:scale-95"
            >
              Transaction Logs
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
