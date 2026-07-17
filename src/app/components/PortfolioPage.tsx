"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, 
  Coins, Sparkles, ChevronRight, ArrowRight, ShieldCheck, 
  Activity, CircleDollarSign, Percent, X
} from "lucide-react";
import { addTransaction } from "../utils/transactionStorage";

interface PortfolioPageProps {
  onNavigate?: (page: string) => void;
}

export default function PortfolioPage({ onNavigate }: PortfolioPageProps) {
  // Load logged-in user details
  const loggedInMobile = typeof window !== 'undefined' ? sessionStorage.getItem("fm_logged_in_mobile") || "7013302191" : "7013302191";
  const isDemoUser = ["7013302191", "9491841941", "7893863597"].includes(loggedInMobile);

  const [goldPrice, setGoldPrice] = useState<number>(6420.50);
  const [silverPrice, setSilverPrice] = useState<number>(84.20);

  const [goldHoldings, setGoldHoldings] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`fip_gold_holdings_${loggedInMobile}`);
      return saved ? parseFloat(saved) : (isDemoUser ? 12.4502 : 0);
    }
    return 12.4502;
  });

  const [silverHoldings, setSilverHoldings] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`fip_silver_holdings_${loggedInMobile}`);
      return saved ? parseFloat(saved) : (isDemoUser ? 340.2005 : 0);
    }
    return 340.2005;
  });

  const [cashBalance, setCashBalance] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`fip_cash_balance_${loggedInMobile}`);
      return saved ? parseFloat(saved) : (isDemoUser ? 5250.00 : 0.00);
    }
    return isDemoUser ? 5250.00 : 0.00;
  });

  // Sell modal states
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [sellMetal, setSellMetal] = useState<"gold" | "silver">("gold");
  const [sellGrams, setSellGrams] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [sellSuccess, setSellSuccess] = useState(false);
  const [sellSuccessMsg, setSellSuccessMsg] = useState("");

  const activePrice = sellMetal === "gold" ? goldPrice : silverPrice;
  const activeHoldings = sellMetal === "gold" ? goldHoldings : silverHoldings;

  // Calculate portfolio values
  const goldValue = goldHoldings * goldPrice;
  const silverValue = silverHoldings * silverPrice;
  const totalValue = goldValue + silverValue + cashBalance;

  // Mock Average Purchase Prices to calculate gains
  const avgGoldBuyPrice = 5850.00;
  const avgSilverBuyPrice = 76.50;

  const goldCostBasis = goldHoldings * avgGoldBuyPrice;
  const silverCostBasis = silverHoldings * avgSilverBuyPrice;
  const totalCostBasis = goldCostBasis + silverCostBasis + cashBalance;

  const totalGain = totalValue - totalCostBasis;
  const totalGainPercent = totalCostBasis > 0 ? (totalGain / totalCostBasis) * 100 : 0;

  // Sync holdings & cash from localStorage periodically
  useEffect(() => {
    const handleStorageChange = () => {
      const savedGold = localStorage.getItem(`fip_gold_holdings_${loggedInMobile}`);
      if (savedGold) setGoldHoldings(parseFloat(savedGold));
      const savedSilver = localStorage.getItem(`fip_silver_holdings_${loggedInMobile}`);
      if (savedSilver) setSilverHoldings(parseFloat(savedSilver));
      const savedCash = localStorage.getItem(`fip_cash_balance_${loggedInMobile}`);
      if (savedCash) setCashBalance(parseFloat(savedCash));
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [loggedInMobile]);

  // Allocation percentages
  const goldAlloc = totalValue > 0 ? (goldValue / totalValue) * 100 : 0;
  const silverAlloc = totalValue > 0 ? (silverValue / totalValue) * 100 : 0;
  const cashAlloc = totalValue > 0 ? (cashBalance / totalValue) * 100 : 0;

  const handleSellInitiate = (metal: "gold" | "silver") => {
    setSellMetal(metal);
    setSellGrams("");
    setSellAmount("");
    setSellSuccess(false);
    setIsSellModalOpen(true);
  };

  const handleGramsChange = (val: string) => {
    setSellGrams(val);
    if (!val || isNaN(Number(val))) {
      setSellAmount("");
      return;
    }
    const calculatedAmount = Number(val) * activePrice;
    setSellAmount(Math.round(calculatedAmount).toString());
  };

  const handleAmountChange = (val: string) => {
    setSellAmount(val);
    if (!val || isNaN(Number(val))) {
      setSellGrams("");
      return;
    }
    const calculatedGrams = Number(val) / activePrice;
    setSellGrams(calculatedGrams.toFixed(4));
  };

  const handleConfirmSell = () => {
    const gramsNum = Number(sellGrams);
    const amtNum = Number(sellAmount);

    if (gramsNum <= 0 || isNaN(gramsNum)) return;
    if (gramsNum > activeHoldings) return;

    const newGrams = activeHoldings - gramsNum;
    const newCash = cashBalance + amtNum;

    if (sellMetal === "gold") {
      setGoldHoldings(newGrams);
      localStorage.setItem(`fip_gold_holdings_${loggedInMobile}`, newGrams.toString());
    } else {
      setSilverHoldings(newGrams);
      localStorage.setItem(`fip_silver_holdings_${loggedInMobile}`, newGrams.toString());
    }

    setCashBalance(newCash);
    localStorage.setItem(`fip_cash_balance_${loggedInMobile}`, newCash.toString());

    // Add to transaction log
    addTransaction({
      type: "Sell",
      category: sellMetal === "gold" ? "Gold" : "Silver",
      amount: amtNum,
      grams: `${gramsNum.toFixed(4)} g`,
      status: "Completed",
      paymentMethod: "Bank Account",
      source: sellMetal === "gold" ? "Gold Vault" : "Silver Vault"
    });

    setSellSuccessMsg(`Successfully sold ${gramsNum.toFixed(4)}g of Digital ${sellMetal === "gold" ? "Gold" : "Silver"} for ₹${amtNum.toLocaleString()}! Funds added to your Cash Balance.`);
    setSellSuccess(true);
  };

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
          {/* Main Balance Card (REDESIGNED CONTAINER) */}
          <div className="lg:col-span-8 rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col justify-between min-h-[250px] shadow-[0_20px_50px_rgba(184,115,18,0.12)] border border-[#ffbf00]/25 bg-gradient-to-br from-[#1c1409] via-[#090704] to-[#120e06] text-white">
            
            {/* Visual glow element */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#ffbf00]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* Watermark Logo branding (Moved up to middle right with higher opacity) */}
            <div className="absolute right-8 top-[38%] -translate-y-1/2 opacity-[0.06] select-none text-[8rem] font-black tracking-tighter leading-none font-outfit uppercase pointer-events-none">
              VAULT
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbf00] animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-500/80">Premium Asset Vault</span>
                </div>
                <span className="bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={11} className="text-amber-400" /> Live Feed
                </span>
              </div>
              
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Total Portfolio Value</span>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                  ₹{Math.round(totalValue).toLocaleString()}
                </h1>
                
                <div className="flex items-center gap-2.5 pt-1">
                  <span className={`flex items-center gap-0.5 text-xs font-black px-2.5 py-1 rounded-full ${totalGain >= 0 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
                    {totalGain >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                    {totalGain >= 0 ? "+" : ""}₹{Math.round(Math.abs(totalGain)).toLocaleString()} ({totalGainPercent.toFixed(2)}%)
                  </span>
                  <span className="text-xs text-slate-400 font-bold">Absolute Gain</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="relative z-10 grid grid-cols-3 gap-6 pt-6 border-t border-white/10 mt-6 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
              <div>
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Bullion Value</span>
                <h3 className="text-base font-black text-white mt-1">₹{Math.round(goldValue + silverValue).toLocaleString()}</h3>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Cash Balance</span>
                <h3 className="text-base font-black text-amber-500 mt-1">₹{Math.round(cashBalance).toLocaleString()}</h3>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Cost Basis</span>
                <h3 className="text-base font-black text-slate-300 mt-1">₹{Math.round(totalCostBasis).toLocaleString()}</h3>
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
            <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.01)] space-y-6 relative overflow-hidden group flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              <div>
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

              <div className="pt-4 border-t border-slate-100/60">
                <button 
                  onClick={() => handleSellInitiate("gold")}
                  className="w-full py-2.5 rounded-xl border border-solid border-[#b87312] hover:bg-amber-50 text-[#b87312] font-black text-xs cursor-pointer bg-transparent transition-all active:scale-98"
                >
                  Sell Gold Instantly
                </button>
              </div>
            </div>

            {/* Silver Vault Card */}
            <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.01)] space-y-6 relative overflow-hidden group flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 rounded-full blur-2xl pointer-events-none" />
              <div>
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

              <div className="pt-4 border-t border-slate-100/60">
                <button 
                  onClick={() => handleSellInitiate("silver")}
                  className="w-full py-2.5 rounded-xl border border-solid border-slate-300 hover:bg-slate-50 text-slate-600 font-black text-xs cursor-pointer bg-transparent transition-all active:scale-98"
                >
                  Sell Silver Instantly
                </button>
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

      {/* QUICK SELL MODAL DIALOG */}
      <AnimatePresence>
        {isSellModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur */}
            <motion.div 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSellModalOpen(false)}
            />

            {/* Modal Box */}
            <motion.div 
              className="bg-white rounded-[2rem] p-6 max-w-md w-full relative z-10 shadow-2xl border border-slate-100 overflow-hidden flex flex-col gap-6"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Coins size={18} className={sellMetal === "gold" ? "text-amber-500" : "text-slate-400"} />
                  Sell {sellMetal === "gold" ? "Gold" : "Silver"} Instantly
                </h3>
                <button 
                  onClick={() => setIsSellModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center border-none text-slate-400 hover:text-slate-600 cursor-pointer outline-none transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {!sellSuccess ? (
                <div className="space-y-4">
                  <div className="bg-[#fdf8f0] p-4 rounded-2xl border border-amber-100/50 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block">Available Balance</span>
                      <span className="font-extrabold text-slate-800 text-sm">{activeHoldings.toFixed(4)} g</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 font-bold block">Live Sell Rate</span>
                      <span className="font-extrabold text-[#b87312] text-sm">₹{activePrice.toLocaleString()}/g</span>
                    </div>
                  </div>

                  {/* Dual Input Form */}
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Grams to Sell</label>
                      <div className="relative">
                        <input 
                          type="number"
                          step="any"
                          value={sellGrams}
                          onChange={(e) => handleGramsChange(e.target.value)}
                          placeholder="0.0000"
                          max={activeHoldings}
                          className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 outline-none focus:border-[#b87312] transition-colors"
                        />
                        <button 
                          onClick={() => handleGramsChange(activeHoldings.toString())}
                          className="absolute right-3 top-1/2 -translate-y-1/2 border-none outline-none bg-amber-50 hover:bg-amber-100 text-[#b87312] px-2.5 py-1 rounded text-[9px] font-black uppercase cursor-pointer transition-colors"
                        >
                          Sell Max
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Estimated Amount (INR)</label>
                      <div className="relative">
                        <input 
                          type="number"
                          value={sellAmount}
                          onChange={(e) => handleAmountChange(e.target.value)}
                          placeholder="₹0"
                          className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 outline-none focus:border-[#b87312] transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-100 p-3 rounded-xl leading-normal text-left">
                    ⚡ Instant Withdrawal Enabled: Upon confirmation, the specified grams will be deducted and proceeds will be credited instantly to your Cash wallet.
                  </div>

                  <button
                    disabled={!sellGrams || Number(sellGrams) <= 0 || Number(sellGrams) > activeHoldings}
                    onClick={handleConfirmSell}
                    className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 text-white font-extrabold text-xs py-3 rounded-xl border-none outline-none shadow-md cursor-pointer transition-all active:scale-98 disabled:opacity-50 disabled:pointer-events-none mt-2"
                  >
                    Confirm Sell Order
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center gap-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-500 border border-emerald-100 rounded-full flex items-center justify-center shadow-sm">
                    <ShieldCheck size={28} />
                  </div>
                  <div className="space-y-1 px-4">
                    <h4 className="text-sm font-black text-slate-900">Withdrawal Successful</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                      {sellSuccessMsg}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsSellModalOpen(false);
                      setSellSuccess(false);
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 rounded-xl border-none outline-none cursor-pointer mt-4"
                  >
                    Back to Portfolio
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
