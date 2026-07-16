"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Lock, Unlock, TrendingUp, Coins, ArrowUpRight, ArrowDownRight,
  Sparkles, Clock, Wallet, DollarSign, AlertCircle, CheckCircle2, Calculator, Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";

interface DigitalGoldSilverProps {
  onNavigate: (page: string) => void;
  kycStatus: string;
}

export default function DigitalGoldSilver({ onNavigate, kycStatus }: DigitalGoldSilverProps) {
  const [metal, setMetal] = useState<"gold" | "silver">("gold");
  const [txType, setTxType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState<string>("");
  const [grams, setGrams] = useState<string>("");
  
  // Vault state
  const [vaultLocked, setVaultLocked] = useState<boolean>(false);
  const [goldPrice, setGoldPrice] = useState<number>(6420.50);
  const [silverPrice, setSilverPrice] = useState<number>(84.20);
  
  // User holdings state (persisted or defaults)
  const [goldHoldings, setGoldHoldings] = useState<number>(12.4502);
  const [silverHoldings, setSilverHoldings] = useState<number>(340.2005);
  
  // Checkout flow state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [txSuccess, setTxSuccess] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [lastTxId, setLastTxId] = useState<string>("");

  // Live price simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setGoldPrice(prev => {
        const change = (Math.random() - 0.5) * 1.5;
        return Number((prev + change).toFixed(2));
      });
      setSilverPrice(prev => {
        const change = (Math.random() - 0.5) * 0.08;
        return Number((prev + change).toFixed(2));
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const activePrice = metal === "gold" ? goldPrice : silverPrice;
  const holdings = metal === "gold" ? goldHoldings : silverHoldings;
  const holdingUnit = metal === "gold" ? "g" : "g";
  const label = metal === "gold" ? "Gold" : "Silver";

  // Handle amount to grams calculation
  const handleAmountChange = (val: string) => {
    setAmount(val);
    if (!val || isNaN(Number(val))) {
      setGrams("");
      return;
    }
    const calculatedGrams = (Number(val) / activePrice).toFixed(4);
    setGrams(calculatedGrams);
  };

  // Handle grams to amount calculation
  const handleGramsChange = (val: string) => {
    setGrams(val);
    if (!val || isNaN(Number(val))) {
      setAmount("");
      return;
    }
    const calculatedAmount = Math.round(Number(val) * activePrice).toString();
    setAmount(calculatedAmount);
  };

  // Quick select amounts
  const quickAmounts = [100, 500, 1000, 5000];

  const handleQuickAmount = (val: number) => {
    handleAmountChange(val.toString());
  };

  const handleTransaction = async () => {
    if (!amount || Number(amount) <= 0) return;
    
    // Check KYC status limit
    const isMinKyc = kycStatus.toLowerCase().includes("min");
    const numAmount = Number(amount);
    if (isMinKyc && numAmount > 10000) {
      alert("Minimum KYC limit reached. Please upgrade to Full KYC to invest more than ₹10,000.");
      return;
    }

    // Check vault lock for selling
    if (txType === "sell" && vaultLocked) {
      return;
    }

    // Check holdings check for selling
    if (txType === "sell" && Number(grams) > holdings) {
      alert(`Insufficient ${label} holdings in your vault.`);
      return;
    }

    setIsProcessing(true);
    
    // Simulating transaction
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsProcessing(false);
    const txId = "FIP" + Math.floor(100000 + Math.random() * 900000);
    setLastTxId(txId);
    
    if (txType === "buy") {
      if (metal === "gold") setGoldHoldings(prev => prev + Number(grams));
      else setSilverHoldings(prev => prev + Number(grams));
      setSuccessMsg(`Successfully purchased ${grams}g of 24K Digital ${label}!`);
    } else {
      if (metal === "gold") setGoldHoldings(prev => prev - Number(grams));
      else setSilverHoldings(prev => prev - Number(grams));
      setSuccessMsg(`Successfully sold ${grams}g of Digital ${label}. Funds credited to linked bank account!`);
    }
    
    setTxSuccess(true);
    setAmount("");
    setGrams("");
  };

  const isMinKyc = kycStatus.toLowerCase().includes("min");
  const isLimitWarning = isMinKyc && Number(amount) > 10000;

  // Static mock transactions history
  const [transactions, setTransactions] = useState([
    { id: "FIP839120", type: "Buy", metal: "Gold", amount: "₹5,000", grams: "0.7788 g", date: "Today, 10:14 AM", status: "Completed" },
    { id: "FIP728193", type: "Buy", metal: "Silver", amount: "₹2,500", grams: "29.6912 g", date: "12 Jul 2026", status: "Completed" },
    { id: "FIP619283", type: "Sell", metal: "Gold", amount: "₹8,000", grams: "1.2461 g", date: "05 Jul 2026", status: "Completed" },
    { id: "FIP510293", type: "Buy", metal: "Gold", amount: "₹150", grams: "0.0234 g", date: "01 Jul 2026", status: "Completed" }
  ]);

  useEffect(() => {
    if (txSuccess && successMsg) {
      setTransactions(prev => [
        {
          id: lastTxId,
          type: txType === "buy" ? "Buy" : "Sell",
          metal: metal === "gold" ? "Gold" : "Silver",
          amount: `₹${Number(amount || Math.round(Number(grams) * activePrice)).toLocaleString()}`,
          grams: `${Number(grams).toFixed(4)} g`,
          date: "Just now",
          status: "Completed"
        },
        ...prev
      ]);
    }
  }, [txSuccess]);

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#fcfdfd]">
      <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-6 pb-24 lg:pb-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Digital Gold & Silver</h1>
            <p className="text-xs text-gray-400 font-semibold mt-1">Invest in 24K Pure Gold and 99.9% Pure Silver secured in safe physical vaults.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-500">Secure Storage Partner:</span>
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-gray-100 shadow-sm">
              <Shield size={14} className="text-[#b87312]" />
              <span className="text-[10px] font-black text-gray-700 tracking-wider">MMTC-PAMP & AUGMONT</span>
            </div>
          </div>
        </div>

        {/* Dynamic KYC Warning Alert for Min KYC */}
        {isMinKyc && (
          <div className="bg-[#fffbeb] rounded-3xl p-5 border border-[#fef3c7] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={22} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-800">Minimum KYC Investment Limit (₹10,000)</p>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  As a Minimum KYC user, you can invest up to ₹10,000 per transaction. Complete your quick Video KYC verification to unlock unlimited digital asset vault transactions.
                </p>
              </div>
            </div>
            <button 
              onClick={() => onNavigate("settings")}
              className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer outline-none border-none shrink-0 self-start sm:self-center shadow-sm"
            >
              Upgrade KYC Now
            </button>
          </div>
        )}

        {/* Row 1: Live Tickers & Vault balance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Live rates */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Gold Ticker */}
            <div 
              onClick={() => setMetal("gold")}
              className={`bg-white rounded-3xl p-6 border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-44 shadow-[0_4px_24px_rgba(0,0,0,0.02)]
                ${metal === "gold" ? "border-amber-400 ring-2 ring-amber-100 scale-[1.02]" : "border-gray-100 hover:border-gray-200"}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Coins size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-800">24K Digital Gold</h4>
                    <p className="text-[10px] text-gray-400 font-bold">99.9% Purity Guaranteed</p>
                  </div>
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border border-emerald-100 text-[10px] font-extrabold flex items-center gap-0.5">
                  <ArrowUpRight size={10} strokeWidth={3} /> LIVE RATE
                </Badge>
              </div>
              
              <div className="mt-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Buying Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-gray-900">₹{goldPrice.toLocaleString()}<span className="text-xs text-gray-500 font-bold">/g</span></span>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-amber-500/5 rounded-tl-full pointer-events-none" />
            </div>

            {/* Silver Ticker */}
            <div 
              onClick={() => setMetal("silver")}
              className={`bg-white rounded-3xl p-6 border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-44 shadow-[0_4px_24px_rgba(0,0,0,0.02)]
                ${metal === "silver" ? "border-slate-400 ring-2 ring-slate-100 scale-[1.02]" : "border-gray-100 hover:border-gray-200"}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center">
                    <Coins size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-800">99.9% Digital Silver</h4>
                    <p className="text-[10px] text-gray-400 font-bold">Locker Grade Pure Silver</p>
                  </div>
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border border-emerald-100 text-[10px] font-extrabold flex items-center gap-0.5">
                  <ArrowUpRight size={10} strokeWidth={3} /> LIVE RATE
                </Badge>
              </div>
              
              <div className="mt-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Buying Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-gray-900">₹{silverPrice.toLocaleString()}<span className="text-xs text-gray-500 font-bold">/g</span></span>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-slate-500/5 rounded-tl-full pointer-events-none" />
            </div>
            
          </div>

          {/* Vault Holdings & Locking */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[176px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unified Secure Vault</h3>
                <div className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  <Shield size={10} /> 100% INSURED
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400">GOLD BALANCE</p>
                  <p className="text-base font-extrabold text-gray-800">{goldHoldings.toFixed(4)} g</p>
                  <p className="text-[10px] font-semibold text-gray-500">≈ ₹{(goldHoldings * goldPrice).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400">SILVER BALANCE</p>
                  <p className="text-base font-extrabold text-gray-800">{silverHoldings.toFixed(4)} g</p>
                  <p className="text-[10px] font-semibold text-gray-500">≈ ₹{(silverHoldings * silverPrice).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                </div>
              </div>
            </div>

            {/* Vault Lock Security Switch */}
            <div className="border-t border-gray-50 pt-4 mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {vaultLocked ? (
                  <Lock size={16} className="text-amber-600 animate-pulse" />
                ) : (
                  <Unlock size={16} className="text-gray-400" />
                )}
                <div>
                  <p className="text-xs font-bold text-gray-700">Vault Sell Lock</p>
                  <p className="text-[9px] text-gray-400 font-semibold">Prevents sells for maximum protection</p>
                </div>
              </div>
              <Switch checked={vaultLocked} onCheckedChange={setVaultLocked} />
            </div>

          </div>

        </div>

        {/* Row 2: Transaction Forms & Statement log */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Transaction Console */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="flex gap-4 border-b border-gray-100 pb-4 mb-6">
              <button 
                onClick={() => setTxType("buy")}
                className={`text-sm font-extrabold pb-2 bg-transparent cursor-pointer outline-none border-none transition-colors
                  ${txType === "buy" ? "text-gray-900 border-b-2 border-gray-900 font-black" : "text-gray-400 hover:text-gray-600"}`}
              >
                Buy Digital {label}
              </button>
              <button 
                onClick={() => setTxType("sell")}
                className={`text-sm font-extrabold pb-2 bg-transparent cursor-pointer outline-none border-none transition-colors
                  ${txType === "sell" ? "text-gray-900 border-b-2 border-gray-900 font-black" : "text-gray-400 hover:text-gray-600"}`}
              >
                Sell {label}
              </button>
            </div>

            {/* Sell Lock Notification */}
            {txType === "sell" && vaultLocked && (
              <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl mb-6 text-xs font-semibold flex items-center gap-3">
                <Lock size={18} className="shrink-0 text-red-500" />
                <div>
                  <p className="font-bold text-red-800">Vault Sell Lock is Active</p>
                  <p className="text-[11px] text-red-600 mt-0.5">Please turn off the Vault Sell Lock security switch above before placing a sell order.</p>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Rupees input */}
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1.5">Amount in Rupees (INR)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                    <Input 
                      type="text" 
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder="0.00"
                      disabled={isProcessing}
                      className="pl-7 pr-4 py-6 rounded-xl border-gray-200 outline-none focus-visible:ring-amber-500 focus-visible:border-amber-500 font-bold"
                    />
                  </div>
                </div>

                {/* Grams input */}
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1.5">Weight in Grams (g)</label>
                  <div className="relative">
                    <Input 
                      type="text" 
                      value={grams}
                      onChange={(e) => handleGramsChange(e.target.value)}
                      placeholder="0.0000"
                      disabled={isProcessing}
                      className="px-4 py-6 rounded-xl border-gray-200 outline-none focus-visible:ring-amber-500 focus-visible:border-amber-500 font-bold"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">g</span>
                  </div>
                </div>

              </div>

              {/* Quick Select Buttons (Only for Buying) */}
              {txType === "buy" && (
                <div className="flex flex-wrap gap-2">
                  {quickAmounts.map((q) => (
                    <button 
                      key={q} 
                      onClick={() => handleQuickAmount(q)}
                      disabled={isProcessing}
                      className="px-3.5 py-2 text-xs font-bold bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl border border-gray-100 transition-colors cursor-pointer outline-none"
                    >
                      +₹{q.toLocaleString()}
                    </button>
                  ))}
                </div>
              )}

              {/* Transaction Limits info */}
              <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                  <span>Vault Storage Fee:</span>
                  <span className="text-emerald-600">FREE (Insured by MMTC-PAMP)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                  <span>Current Live Purity:</span>
                  <span className="text-gray-800">{metal === "gold" ? "24K (99.99%)" : "99.90% Pure"}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                  <span>Daily Trans. Limit:</span>
                  <span className="text-gray-800">{isMinKyc ? "₹10,000 (Min KYC)" : "₹25,00,000 (Full KYC)"}</span>
                </div>
              </div>

              {/* Action Button */}
              {isLimitWarning ? (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-red-500 flex items-center gap-1"><AlertCircle size={14} /> Amount exceeds Minimum KYC limit of ₹10,000.</p>
                  <Button 
                    className="w-full py-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md"
                    onClick={() => onNavigate("settings")}
                  >
                    Upgrade KYC to Invest More
                  </Button>
                </div>
              ) : (
                <Button 
                  disabled={!amount || Number(amount) <= 0 || isProcessing || (txType === "sell" && vaultLocked)}
                  onClick={handleTransaction}
                  className="w-full py-6 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 border-none cursor-pointer text-white"
                  style={{
                    background: (!amount || Number(amount) <= 0 || (txType === "sell" && vaultLocked))
                      ? "#e5e7eb" 
                      : txType === "buy" ? "#10b981" : `linear-gradient(135deg, #b87312, #efb652)`,
                    color: (!amount || Number(amount) <= 0 || (txType === "sell" && vaultLocked)) ? "#9ca3af" : "white"
                  }}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing order...
                    </>
                  ) : (
                    `${txType === "buy" ? "Buy" : "Sell"} Digital ${label}`
                  )}
                </Button>
              )}

            </div>
          </div>

          {/* Vault Statement & Logs */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col">
            <h3 className="text-sm font-extrabold text-gray-800 mb-6 flex items-center gap-2">
              <Clock size={16} className="text-gray-400" /> Vault Transaction Statement
            </h3>
            
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[360px] pr-1">
              {transactions.map((tx, idx) => (
                <div key={idx} className="flex justify-between items-center p-3.5 bg-gray-50/50 rounded-2xl border border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs
                      ${tx.type === "Buy" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-[#b87312]"}`}>
                      {tx.type === "Buy" ? "+" : "-"}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{tx.type} Digital {tx.metal}</p>
                      <p className="text-[10px] text-gray-450 font-semibold">{tx.date} • {tx.grams}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-gray-800">{tx.amount}</p>
                    <span className="text-[9px] font-extrabold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 text-center">
              <p className="text-[10px] text-gray-400 font-semibold leading-normal flex items-center justify-center gap-1">
                <Shield size={12} className="text-emerald-500 shrink-0" />
                Physical equivalents are stored in secure physical vault vaults managed by Sequel.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Checkout Processing Overlay Dialog */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl border border-gray-50"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto animate-pulse">
                <Loader2 size={32} className="animate-spin" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-gray-900">Securing Physical Vault Lock</h3>
                <p className="text-xs text-gray-500 leading-normal px-2">We are confirming live prices and allocating 99.9% certified metal with MMTC-PAMP secure lockers. Please do not close this screen.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction Success Overlay Dialog */}
      <AnimatePresence>
        {txSuccess && (
          <motion.div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl border border-gray-50"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-100 shadow-inner">
                <CheckCircle2 size={32} strokeWidth={2.5} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-gray-900">Transaction Successful!</h3>
                <p className="text-xs text-emerald-600 font-semibold bg-emerald-50/50 py-1.5 px-3 rounded-lg border border-emerald-100 inline-block">{successMsg}</p>
                <p className="text-[10px] text-gray-400 font-bold block pt-2">Transaction ID: {lastTxId} • Completed Live</p>
              </div>
              
              <Button 
                onClick={() => setTxSuccess(false)}
                className="w-full bg-[#111827] text-white hover:bg-gray-800 py-3 rounded-xl font-bold text-xs"
              >
                Done
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
