"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, 
  Coins, Sparkles, ChevronRight, ArrowRight, ShieldCheck, 
  Activity, CircleDollarSign, Percent, X, Check, Search, Bell, Eye, Lock, RefreshCw, BarChart2, Info, ArrowUp, Crown, LineChart, Banknote, Calendar, ChevronDown, Clock
} from "lucide-react";
import { addTransaction } from "../utils/transactionStorage";
import { fetchVaultSummaryApi } from "../utils/vaultApi";

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
      return saved ? parseFloat(saved) : 0;
    }
    return 0;
  });

  const [silverHoldings, setSilverHoldings] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`fip_silver_holdings_${loggedInMobile}`);
      return saved ? parseFloat(saved) : 0;
    }
    return 0;
  });

  const [cashBalance, setCashBalance] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`fip_cash_balance_${loggedInMobile}`);
      return saved ? parseFloat(saved) : 0;
    }
    return 0;
  });

  useEffect(() => {
    if (loggedInMobile) {
      fetchVaultSummaryApi(loggedInMobile).then((data) => {
        if (data) {
          setGoldHoldings(data.goldHoldingsGrams || 0);
          setSilverHoldings(data.silverHoldingsGrams || 0);
          setCashBalance(data.cashBalance || 0);
        }
      });
    }
  }, [loggedInMobile]);

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
    <div className="flex-1 h-screen overflow-y-auto bg-[#fcfdfd] pb-24 relative font-sans text-gray-800">

      <div className="relative z-10 p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">My Portfolio</h1>
            <p className="text-[13px] font-medium text-gray-500 mt-0.5">Real-time valuation of your precious metal holdings and cash balance.</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2.5 rounded-xl text-xs font-bold border border-emerald-100">
            <ShieldCheck size={16} /> Secure Vault Storage Verified
          </div>
        </div>

        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
           {/* PREMIUM ASSET VAULT */}
           <div className="bg-[#1a1525] rounded-[24px] p-6 lg:p-8 relative overflow-hidden text-white flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.12)] min-h-[280px]">
             {/* Background glow and graph */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-3xl rounded-full pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900/40 blur-3xl rounded-full pointer-events-none" />
             <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 500 250">
                <path d="M0,180 C100,180 180,80 250,130 C350,200 420,100 500,80 L500,250 L0,250 Z" fill="url(#wave-grad)" opacity="0.4" />
                <path d="M0,180 C100,180 180,80 250,130 C350,200 420,100 500,80" fill="none" stroke="#818cf8" strokeWidth="2.5" style={{ filter: 'drop-shadow(0px 0px 6px rgba(129,140,248,0.6))' }} />
                <circle cx="250" cy="130" r="4" fill="#fff" style={{ filter: 'drop-shadow(0px 0px 6px #fff)' }} />
                <defs>
                  <linearGradient id="wave-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </linearGradient>
                </defs>
             </svg>
             
             <div className="relative z-10 flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-amber-500 font-bold text-[11px] tracking-wider uppercase">
                   <Crown size={16} /> Premium Asset Vault
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-bold">
                   <Activity size={12} className="text-amber-400" /> Live Feed
                </div>
             </div>
             
             <div className="relative z-10">
                <div className="flex items-center gap-2 text-gray-300 text-[13px] font-medium mb-1">
                   Total Portfolio Value <Eye size={14} className="cursor-pointer hover:text-white transition-colors" />
                </div>
                <div className="text-[40px] font-black text-white tracking-tight leading-none mb-3">
                   ₹{Math.round(totalValue).toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                   <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-[11px] font-bold border border-emerald-500/20">
                      <ArrowUp size={12} strokeWidth={3} /> ₹{Math.round(Math.abs(totalGain)).toLocaleString()} ({totalGainPercent.toFixed(2)}%)
                   </span>
                   <span className="text-[12px] text-gray-400 font-medium">Absolute Gain</span>
                </div>
             </div>
             
             <div className="relative z-10 grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
                <div className="flex flex-col gap-1.5 border-r border-white/10">
                   <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Coins size={12} className="text-amber-400"/></div>
                      Bullion Value
                   </div>
                   <div className="text-[16px] font-bold ml-8">₹{Math.round(goldValue + silverValue).toLocaleString()}</div>
                </div>
                <div className="flex flex-col gap-1.5 border-r border-white/10 pl-2">
                   <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Wallet size={12} className="text-amber-500"/></div>
                      Cash Balance
                   </div>
                   <div className="text-[16px] font-bold text-amber-500 ml-8">₹{Math.round(cashBalance).toLocaleString()}</div>
                </div>
                <div className="flex flex-col gap-1.5 pl-2">
                   <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><LineChart size={12} className="text-gray-300"/></div>
                      Cost Basis
                   </div>
                   <div className="text-[16px] font-bold ml-8">₹{Math.round(totalCostBasis).toLocaleString()}</div>
                </div>
             </div>
           </div>
           
           {/* ASSET ALLOCATION */}
           <div className="bg-white rounded-[24px] p-6 lg:p-8 border border-gray-100 shadow-sm flex flex-col min-h-[280px]">
              <h3 className="text-[15px] font-bold text-gray-900 mb-6">Asset Allocation</h3>
              
              <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8">
                 {/* Donut Chart */}
                 <div className="relative w-40 h-40 shrink-0">
                    <svg viewBox="0 0 38 38" className="w-full h-full transform -rotate-90">
                       <circle cx="19" cy="19" r="15.9155" fill="transparent" stroke="#f1f5f9" strokeWidth="6" />
                       <circle cx="19" cy="19" r="15.9155" fill="transparent" stroke="#10b981" strokeWidth="6" strokeDasharray={`${cashAlloc} ${100 - cashAlloc}`} strokeDashoffset="0" />
                       <circle cx="19" cy="19" r="15.9155" fill="transparent" stroke="#94a3b8" strokeWidth="6" strokeDasharray={`${silverAlloc} ${100 - silverAlloc}`} strokeDashoffset={-cashAlloc} />
                       <circle cx="19" cy="19" r="15.9155" fill="transparent" stroke="#fbbf24" strokeWidth="6" strokeDasharray={`${goldAlloc} ${100 - goldAlloc}`} strokeDashoffset={-(cashAlloc + silverAlloc)} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white m-7 rounded-full shadow-inner">
                       <span className="text-[10px] font-bold text-gray-400 uppercase">Total</span>
                       <span className="text-[18px] font-black text-gray-900">100%</span>
                    </div>
                 </div>
                 
                 {/* Legend */}
                 <div className="flex-1 space-y-4 w-full">
                    <div className="flex justify-between items-start">
                       <div>
                          <div className="flex items-center gap-2 text-[12px] font-bold text-gray-900 mb-1">
                             <div className="w-2.5 h-2.5 rounded-full bg-amber-400" /> 24K Gold
                          </div>
                          <div className="text-[11px] text-gray-500 font-medium ml-4 pl-0.5">₹{Math.round(goldValue).toLocaleString()}</div>
                       </div>
                       <span className="text-[13px] font-bold text-gray-900">{goldAlloc.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-start">
                       <div>
                          <div className="flex items-center gap-2 text-[12px] font-bold text-gray-900 mb-1">
                             <div className="w-2.5 h-2.5 rounded-full bg-slate-400" /> 99.9 Silver
                          </div>
                          <div className="text-[11px] text-gray-500 font-medium ml-4 pl-0.5">₹{Math.round(silverValue).toLocaleString()}</div>
                       </div>
                       <span className="text-[13px] font-bold text-gray-900">{silverAlloc.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-start">
                       <div>
                          <div className="flex items-center gap-2 text-[12px] font-bold text-gray-900 mb-1">
                             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Cash Wallet
                          </div>
                          <div className="text-[11px] text-gray-500 font-medium ml-4 pl-0.5">₹{Math.round(cashBalance).toLocaleString()}</div>
                       </div>
                       <span className="text-[13px] font-bold text-gray-900">{cashAlloc.toFixed(1)}%</span>
                    </div>
                 </div>
              </div>
              
              <div className="mt-6 flex items-center gap-1.5 text-[11px] text-gray-400 font-medium pt-4 border-t border-gray-50">
                 Diversify your portfolio for better returns. <Info size={12} />
              </div>
           </div>
        </div>

        {/* Vault Holdings Section */}
        <div className="mt-8">
           <div className="flex justify-between items-center mb-4">
              <h2 className="text-[15px] font-bold text-gray-900">Vault Holdings</h2>
              <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 cursor-pointer hover:text-indigo-800 transition-colors">View All Holdings <ArrowRight size={12}/></span>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gold Vault Card */}
              <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
                 <div className="flex justify-between items-start mb-6 relative z-10">
                    <span className="bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md">24K GOLD VAULT</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center"><BarChart2 size={16}/></div>
                 </div>
                 
                 <div className="flex justify-between items-end relative z-10 mb-6">
                    <div>
                       <div className="text-[26px] font-bold text-gray-900 leading-tight mb-1">{goldHoldings.toFixed(4)} grams</div>
                       <div className="text-[11px] text-gray-500 font-medium mb-6">Average Buy Price: ₹{avgGoldBuyPrice.toLocaleString()}/g</div>
                       
                       <div className="flex gap-8">
                          <div>
                             <div className="text-[11px] text-gray-500 font-medium mb-1">Current Value</div>
                             <div className="text-[15px] font-bold text-gray-900">₹{Math.round(goldValue).toLocaleString()}</div>
                          </div>
                          <div>
                             <div className="text-[11px] text-gray-500 font-medium mb-1">Total Returns</div>
                             <div className="text-[15px] font-bold text-emerald-500 flex items-center gap-1"><ArrowUp size={12} strokeWidth={3}/> {(((goldValue - goldCostBasis) / (goldCostBasis || 1)) * 100).toFixed(2)}%</div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="absolute -right-4 bottom-16 w-32 h-32 opacity-90 pointer-events-none hidden sm:block">
                       <div className="absolute top-4 right-8 w-20 h-24 bg-gradient-to-br from-[#fef08a] via-[#eab308] to-[#854d0e] rounded-lg transform rotate-12 shadow-lg border border-yellow-300 flex items-center justify-center flex-col">
                          <span className="text-[8px] font-bold text-yellow-700 uppercase tracking-widest opacity-60">FIP</span>
                          <span className="text-[10px] font-black text-yellow-900 uppercase">GOLD</span>
                          <span className="text-[8px] font-bold text-yellow-700 uppercase tracking-widest opacity-80">24K</span>
                       </div>
                       <div className="absolute bottom-2 right-4 w-12 h-6 bg-gradient-to-br from-[#fde047] via-[#ca8a04] to-[#713f12] rounded-full shadow-md border border-yellow-400/50" />
                       <div className="absolute bottom-4 right-12 w-10 h-5 bg-gradient-to-br from-[#fde047] via-[#ca8a04] to-[#713f12] rounded-full shadow-md border border-yellow-400/50" />
                    </div>
                 </div>
                 
                 <button onClick={() => handleSellInitiate("gold")} className="w-full relative z-10 flex items-center justify-center gap-2 py-3 rounded-xl border border-amber-200 text-amber-600 bg-transparent font-bold text-[13px] hover:bg-amber-50 cursor-pointer transition-colors outline-none">
                    <Lock size={14} /> Sell Gold Instantly
                 </button>
              </div>

              {/* Silver Vault Card */}
              <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
                 <div className="flex justify-between items-start mb-6 relative z-10">
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md">99.9 SILVER VAULT</span>
                    <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center"><BarChart2 size={16}/></div>
                 </div>
                 
                 <div className="flex justify-between items-end relative z-10 mb-6">
                    <div>
                       <div className="text-[26px] font-bold text-gray-900 leading-tight mb-1">{silverHoldings.toFixed(4)} grams</div>
                       <div className="text-[11px] text-gray-500 font-medium mb-6">Average Buy Price: ₹{avgSilverBuyPrice.toLocaleString()}/g</div>
                       
                       <div className="flex gap-8">
                          <div>
                             <div className="text-[11px] text-gray-500 font-medium mb-1">Current Value</div>
                             <div className="text-[15px] font-bold text-gray-900">₹{Math.round(silverValue).toLocaleString()}</div>
                          </div>
                          <div>
                             <div className="text-[11px] text-gray-500 font-medium mb-1">Total Returns</div>
                             <div className="text-[15px] font-bold text-emerald-500 flex items-center gap-1"><ArrowUp size={12} strokeWidth={3}/> {(((silverValue - silverCostBasis) / (silverCostBasis || 1)) * 100).toFixed(2)}%</div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="absolute -right-4 bottom-16 w-32 h-32 opacity-90 pointer-events-none hidden sm:block">
                       <div className="absolute top-4 right-8 w-20 h-24 bg-gradient-to-br from-[#f8fafc] via-[#cbd5e1] to-[#64748b] rounded-lg transform rotate-12 shadow-lg border border-slate-300 flex items-center justify-center flex-col">
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest opacity-60">FIP</span>
                          <span className="text-[10px] font-black text-slate-700 uppercase">SILVER</span>
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest opacity-80">999</span>
                       </div>
                       <div className="absolute bottom-2 right-4 w-12 h-6 bg-gradient-to-br from-[#e2e8f0] via-[#94a3b8] to-[#475569] rounded-full shadow-md border border-slate-400/50" />
                       <div className="absolute bottom-4 right-12 w-10 h-5 bg-gradient-to-br from-[#e2e8f0] via-[#94a3b8] to-[#475569] rounded-full shadow-md border border-slate-400/50" />
                    </div>
                 </div>
                 
                 <button onClick={() => handleSellInitiate("silver")} className="w-full relative z-10 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-slate-600 bg-transparent font-bold text-[13px] hover:bg-slate-50 cursor-pointer transition-colors outline-none">
                    <Lock size={14} /> Sell Silver Instantly
                 </button>
              </div>
           </div>
        </div>

        {/* Third Row (Bottom 3 columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
           {/* Cash Balance */}
           <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div>
                 <div className="flex items-center gap-2 text-[14px] font-bold text-gray-900 mb-4">
                    <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center"><Wallet size={12}/></div> Cash Balance
                 </div>
                 <div className="text-[22px] font-bold text-gray-900 mb-0.5">₹{cashBalance.toFixed(2)}</div>
                 <div className="text-[10px] text-gray-500 font-medium mb-6">Available Balance</div>
              </div>
              <div className="relative z-10">
                 <button className="w-[120px] bg-emerald-50 text-emerald-600 font-bold text-[12px] py-2.5 rounded-xl border-none outline-none cursor-pointer hover:bg-emerald-100 transition-colors mb-4 block text-center">
                    Add Money
                 </button>
                 <div className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 cursor-pointer hover:text-indigo-800 transition-colors">View Transactions <ArrowRight size={12}/></div>
              </div>
              <div className="absolute -right-4 bottom-4 opacity-[0.03] pointer-events-none">
                 <Wallet size={120} />
              </div>
           </div>
           
           {/* Performance Summary */}
           <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-[14px] font-bold text-gray-900">Performance Summary</h3>
                 <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 rounded-lg text-[11px] font-medium text-gray-600 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                    Today <ChevronDown size={12}/>
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-[12px]">
                    <span className="text-gray-500 font-medium">Today's Gain</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1"><ArrowUp size={10} strokeWidth={3}/> ₹1,250 (1.12%)</span>
                 </div>
                 <div className="w-full h-px bg-gray-50" />
                 <div className="flex justify-between items-center text-[12px]">
                    <span className="text-gray-500 font-medium">Total Gain</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1"><ArrowUp size={10} strokeWidth={3}/> ₹{Math.round(Math.abs(totalGain)).toLocaleString()} ({totalGainPercent.toFixed(2)}%)</span>
                 </div>
                 <div className="w-full h-px bg-gray-50" />
                 <div className="flex justify-between items-center text-[12px]">
                    <span className="text-gray-500 font-medium">All Time Returns</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1"><ArrowUp size={10} strokeWidth={3}/> 12.48%</span>
                 </div>
                 <div className="w-full h-px bg-gray-50" />
                 <div className="flex justify-between items-center text-[12px]">
                    <span className="text-gray-500 font-medium">Invested Amount</span>
                    <span className="text-gray-900 font-bold">₹{Math.round(totalCostBasis).toLocaleString()}</span>
                 </div>
              </div>
           </div>
           
           {/* Market Updates */}
           <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[14px] font-bold text-gray-900">Market Updates</h3>
                    <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 cursor-pointer hover:text-indigo-800 transition-colors">View More <ArrowRight size={12}/></span>
                 </div>
                 
                 <div className="space-y-5">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0"><Coins size={16}/></div>
                       <div className="flex-1">
                          <div className="text-[11px] text-gray-500 font-medium mb-0.5">Gold Price (24K)</div>
                          <div className="flex items-center gap-2">
                             <span className="text-[13px] font-bold text-gray-900">₹{goldPrice.toLocaleString()} /g</span>
                             <span className="text-[10px] font-bold text-emerald-500 flex items-center"><ArrowUp size={10}/> 0.65%</span>
                          </div>
                       </div>
                       <div className="w-16 h-8 flex items-end opacity-80">
                          <svg viewBox="0 0 64 32" className="w-full h-full" preserveAspectRatio="none">
                             <path d="M0,20 L10,15 L20,22 L30,12 L40,16 L50,8 L64,12" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
                          </svg>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center shrink-0"><Coins size={16}/></div>
                       <div className="flex-1">
                          <div className="text-[11px] text-gray-500 font-medium mb-0.5">Silver Price (99.9%)</div>
                          <div className="flex items-center gap-2">
                             <span className="text-[13px] font-bold text-gray-900">₹{silverPrice.toLocaleString()} /g</span>
                             <span className="text-[10px] font-bold text-emerald-500 flex items-center"><ArrowUp size={10}/> 0.43%</span>
                          </div>
                       </div>
                       <div className="w-16 h-8 flex items-end opacity-80">
                          <svg viewBox="0 0 64 32" className="w-full h-full" preserveAspectRatio="none">
                             <path d="M0,25 L10,22 L20,24 L30,18 L40,20 L50,15 L64,12" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                          </svg>
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium pt-4 border-t border-gray-50 mt-4">
                 <Clock size={10}/> Prices updated just now
              </div>
           </div>
        </div>

        {/* Quick Actions (bottom) */}
        <div className="mt-8 pb-10">
           <h3 className="text-[14px] font-bold text-gray-900 mb-4">Quick Actions</h3>
           <div className="flex flex-wrap gap-3">
              <button onClick={() => onNavigate?.("sip")} className="flex items-center justify-center gap-2 bg-amber-50/50 text-amber-600 font-bold text-[12px] py-3.5 px-6 rounded-xl border border-amber-50 cursor-pointer hover:bg-amber-100 transition-colors flex-1 min-w-[140px] outline-none">
                 <Coins size={14} /> Buy Gold
              </button>
              <button onClick={() => onNavigate?.("sip")} className="flex items-center justify-center gap-2 bg-slate-50 text-slate-600 font-bold text-[12px] py-3.5 px-6 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors flex-1 min-w-[140px] outline-none">
                 <Coins size={14} /> Buy Silver
              </button>
              <button onClick={() => handleSellInitiate("gold")} className="flex items-center justify-center gap-2 bg-orange-50/30 text-orange-600 font-bold text-[12px] py-3.5 px-6 rounded-xl border border-orange-50 cursor-pointer hover:bg-orange-50 transition-colors flex-1 min-w-[140px] outline-none">
                 <Lock size={14} /> Sell Gold
              </button>
              <button onClick={() => handleSellInitiate("silver")} className="flex items-center justify-center gap-2 bg-slate-50/50 text-slate-600 font-bold text-[12px] py-3.5 px-6 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors flex-1 min-w-[140px] outline-none">
                 <Lock size={14} /> Sell Silver
              </button>
              <button onClick={() => onNavigate?.("history")} className="flex items-center justify-center gap-2 bg-indigo-50/50 text-indigo-600 font-bold text-[12px] py-3.5 px-6 rounded-xl border border-indigo-50 cursor-pointer hover:bg-indigo-50 transition-colors flex-1 min-w-[160px] outline-none">
                 <Activity size={14} /> Transaction Logs <ChevronRight size={14}/>
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