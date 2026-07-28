"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Lock, Unlock, TrendingUp, Coins, ArrowUpRight, ArrowDownRight,
  Sparkles, Clock, Wallet, AlertCircle, CheckCircle2, Calculator,
  Loader2, Truck, Gift, Info, BarChart3, HelpCircle, ChevronRight, X, ArrowRight, ShieldCheck, Bell, RefreshCw, FileText } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { useFipModal } from "./FipModal";
import { addTransaction } from "../utils/transactionStorage";
import { fetchLatestMetalPrices } from "../utils/metalPriceApi";

interface DigitalGoldSilverProps {
  onNavigate: (page: string) => void;
  kycStatus: string;
}

type TimeFrame = "1D" | "1W" | "1M" | "1Y" | "5Y";

// Price datasets for Gold and Silver based on Timeframe
const GOLD_DATASETS: Record<TimeFrame, number[]> = {
  "1D": [6410, 6415, 6408, 6425, 6420, 6432, 6420.50],
  "1W": [6350, 6380, 6410, 6390, 6440, 6410, 6420.50],
  "1M": [6200, 6290, 6250, 6380, 6350, 6450, 6420.50],
  "1Y": [5600, 5800, 5750, 6100, 5950, 6300, 6420.50],
  "5Y": [4100, 4800, 5200, 5100, 5800, 6100, 6420.50]
};

const SILVER_DATASETS: Record<TimeFrame, number[]> = {
  "1D": [83.9, 84.1, 83.8, 84.5, 84.2, 84.6, 84.20],
  "1W": [82.5, 83.1, 84.2, 83.6, 84.8, 83.9, 84.20],
  "1M": [79.0, 81.2, 80.5, 82.8, 82.1, 84.9, 84.20],
  "1Y": [68.0, 72.0, 70.5, 78.0, 75.0, 82.0, 84.20],
  "5Y": [48.0, 56.0, 64.0, 61.0, 72.0, 78.0, 84.20]
};

// Physical Delivery Products Catalog
const DELIVERY_PRODUCTS = [
  { id: "g1", metal: "gold", name: "24K Gold Coin", weight: 1, reqHoldings: 1.0, image: "🪙", purity: "999.9 Purity" },
  { id: "g5", metal: "gold", name: "24K Gold Bar", weight: 5, reqHoldings: 5.0, image: "💳", purity: "999.9 Purity" },
  { id: "s10", metal: "silver", name: "99.9 Fine Silver Coin", weight: 10, reqHoldings: 10.0, image: "🪙", purity: "999 Purity" },
  { id: "s50", metal: "silver", name: "99.9 Silver Bar", weight: 50, reqHoldings: 50.0, image: "🥈", purity: "999 Purity" },
];

export default function DigitalGoldSilver({ onNavigate, kycStatus }: DigitalGoldSilverProps) {
  const { showAlert, ModalComponent } = useFipModal();
  const [metal, setMetal] = useState<"gold" | "silver">("gold");
  const [txType, setTxType] = useState<"buy" | "sell">("buy");
  const [timeframe, setTimeframe] = useState<TimeFrame>("1D");

  // Dynamic inputs
  const [amount, setAmount] = useState<string>("");
  const [grams, setGrams] = useState<string>("");

  // Security locks & live prices from MetalpriceAPI
  const [vaultLocked, setVaultLocked] = useState<boolean>(false);
  const [goldPrice, setGoldPrice] = useState<number>(6420.50);
  const [silverPrice, setSilverPrice] = useState<number>(84.20);

  useEffect(() => {
    const loadLiveRates = async () => {
      try {
        const live = await fetchLatestMetalPrices();
        if (live && live.gold && live.silver) {
          setGoldPrice(live.gold.perGram24K);
          setSilverPrice(live.silver.perGram);
        }
      } catch (err) {
        console.warn("MetalpriceAPI live fetch error:", err);
      }
    };
    loadLiveRates();
  }, []);

  // User simulated holdings
  const loggedInMobile = typeof window !== 'undefined' ? sessionStorage.getItem("fm_logged_in_mobile") || "7013302191" : "7013302191";
  const isDemoUser = ["7013302191", "9491841941", "7893863597"].includes(loggedInMobile);

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

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`fip_gold_holdings_${loggedInMobile}`, goldHoldings.toString());
  }, [goldHoldings, loggedInMobile]);

  useEffect(() => {
    localStorage.setItem(`fip_silver_holdings_${loggedInMobile}`, silverHoldings.toString());
  }, [silverHoldings, loggedInMobile]);

  // Calculator inputs
  const [calcMonthly, setCalcMonthly] = useState<number>(1000);
  const [calcYears, setCalcYears] = useState<number>(3);

  // Checkout & physical delivery flow
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [txSuccess, setTxSuccess] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [lastTxId, setLastTxId] = useState<string>("");
  const [activeDelivery, setActiveDelivery] = useState<any | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliverySuccess, setDeliverySuccess] = useState(false);

  // Static mock transactions history
  const [transactions, setTransactions] = useState([
    { id: "FIP839120", type: "Buy", metal: "Gold", amount: "₹5,000", grams: "0.7788 g", date: "Today, 10:14 AM", status: "Completed" },
    { id: "FIP728193", type: "Buy", metal: "Silver", amount: "₹2,500", grams: "29.6912 g", date: "12 Jul 2026", status: "Completed" },
    { id: "FIP619283", type: "Sell", metal: "Gold", amount: "₹8,000", grams: "1.2461 g", date: "05 Jul 2026", status: "Completed" },
    { id: "FIP510293", type: "Buy", metal: "Gold", amount: "₹150", grams: "0.0234 g", date: "01 Jul 2026", status: "Completed" }
  ]);

  useEffect(() => {
    if (txSuccess && successMsg) {
      const amtVal = Number(amount || Math.round(Number(grams) * activePrice));

      // Save to localStorage history
      addTransaction({
        type: txType === "buy" ? "Buy" : "Sell",
        category: metal === "gold" ? "Gold" : "Silver",
        amount: amtVal,
        grams: `${Number(grams).toFixed(4)} g`,
        status: "Completed",
        paymentMethod: "UPI",
        source: metal === "gold" ? "Gold Vault" : "Silver Vault"
      });

      setTransactions(prev => [
        {
          id: lastTxId,
          type: txType === "buy" ? "Buy" : "Sell",
          metal: metal === "gold" ? "Gold" : "Silver",
          amount: `₹${amtVal.toLocaleString()}`,
          grams: `${Number(grams).toFixed(4)} g`,
          date: "Just now",
          status: "Completed"
        },
        ...prev
      ]);
    }
  }, [txSuccess]);

  // Live price simulator
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
  const label = metal === "gold" ? "Gold" : "Silver";
  const metalName = label;

  // Handle input conversions
  const handleAmountChange = (val: string) => {
    setAmount(val);
    if (!val || isNaN(Number(val))) {
      setGrams("");
      return;
    }
    setGrams((Number(val) / activePrice).toFixed(4));
  };

  const handleGramsChange = (val: string) => {
    setGrams(val);
    if (!val || isNaN(Number(val))) {
      setAmount("");
      return;
    }
    setAmount(Math.round(Number(val) * activePrice).toString());
  };

  // Limits calculations based on KYC tier
  const isKycPending = kycStatus.toLowerCase() === "pending";
  const isMinKyc = kycStatus.toLowerCase().includes("min");
  const isFullKyc = kycStatus.toLowerCase().includes("full");

  const dailyBuyLimit = isKycPending ? 0 : isMinKyc ? 10000 : 2500000;
  const dailySellLimit = isKycPending ? 0 : isMinKyc ? 5000 : 1000000;
  const maxStorage = isKycPending ? 0 : isMinKyc ? 50 : 1000;

  // Visual limits used (mocked used buy limits)
  const buyUsed = 2400; // Mocked amount bought today in rupees

  // Handle transaction submit
  const handleTransaction = async () => {
    if (isKycPending) {
      showAlert("Verification Pending. Please upgrade your KYC settings to start transacting.", "warning", "KYC Required");
      return;
    }

    const numAmount = Number(amount);
    if (txType === "buy") {
      if (numAmount + buyUsed > dailyBuyLimit) {
        showAlert(`This exceeds your daily KYC purchase limit of ₹${dailyBuyLimit.toLocaleString()}.`, "error", "Transaction Blocked");
        return;
      }
    } else {
      if (vaultLocked) return;
      if (Number(grams) > holdings) {
        showAlert(`Insufficient vault holdings. You only have ${holdings.toFixed(4)}g.`, "error", "Insufficient Holdings");
        return;
      }
      if (numAmount > dailySellLimit) {
        showAlert(`This exceeds your daily KYC sell limit of ₹${dailySellLimit.toLocaleString()}.`, "error", "Transaction Blocked");
        return;
      }
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);

    const txId = "FIP" + Math.floor(100000 + Math.random() * 900000);
    setLastTxId(txId);

    if (txType === "buy") {
      if (metal === "gold") setGoldHoldings(prev => prev + Number(grams));
      else setSilverHoldings(prev => prev + Number(grams));
      setSuccessMsg(`Successfully bought ${Number(grams).toFixed(4)}g of 24K pure Digital ${label}!`);
    } else {
      if (metal === "gold") setGoldHoldings(prev => prev - Number(grams));
      else setSilverHoldings(prev => prev - Number(grams));
      setSuccessMsg(`Successfully sold ${Number(grams).toFixed(4)}g of Digital ${label}. Funds credited to your Bank account.`);
    }

    setTxSuccess(true);
    setAmount("");
    setGrams("");
  };

  // Savings Auto-Save projection formulas
  const calculateAutoSaveProjection = () => {
    const rate = 0.12; // +12% p.a gold growth projection
    const monthlyAmt = calcMonthly;
    const months = calcYears * 12;
    let totalInvested = monthlyAmt * months;

    // Future value of SIP formula
    let futureValue = 0;
    const monthlyRate = rate / 12;
    futureValue = monthlyAmt * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);

    return {
      invested: totalInvested,
      projected: Math.round(futureValue),
      growth: Math.round(futureValue - totalInvested)
    };
  };

  const projection = calculateAutoSaveProjection();

  // Dynamic SVG Path Calculations for Chart line
  const activeDataset = metal === "gold" ? GOLD_DATASETS[timeframe] : SILVER_DATASETS[timeframe];
  const chartWidth = 500;
  const chartHeight = 150;

  const minVal = Math.min(...activeDataset);
  const maxVal = Math.max(...activeDataset);
  const valRange = maxVal - minVal || 1;

  const points = activeDataset.map((val, idx) => {
    const x = (idx / (activeDataset.length - 1)) * chartWidth;
    const y = chartHeight - ((val - minVal) / valRange) * (chartHeight - 30) - 15;
    return `${x},${y}`;
  });

  const linePath = `M ${points.join(" L ")}`;
  // Gradient fill area
  const fillPath = `${linePath} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`;

  // Percentage performance change in timeframe
  const firstVal = activeDataset[0];
  const lastVal = activeDataset[activeDataset.length - 1];
  const performanceChange = (((lastVal - firstVal) / firstVal) * 100).toFixed(2);
  const isPositive = Number(performanceChange) >= 0;

  // Handle Physical Delivery Redemption
  const handleRedeemProduct = (prod: any) => {
    if (isKycPending) {
      showAlert("Verification Pending. Please upgrade your KYC settings to link physical addresses.", "warning", "KYC Required");
      return;
    }
    const userHoldings = prod.metal === "gold" ? goldHoldings : silverHoldings;
    if (userHoldings < prod.reqHoldings) {
      showAlert(`Insufficient holdings. You need at least ${prod.reqHoldings}g of digital ${prod.metal} in your vault to redeem this.`, "error", "Cannot Redeem");
      return;
    }
    setActiveDelivery(prod);
    setDeliveryAddress("");
    setDeliverySuccess(false);
  };

  const submitDeliveryRequest = async () => {
    if (!deliveryAddress) return;
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);

    if (activeDelivery.metal === "gold") {
      setGoldHoldings(prev => prev - activeDelivery.reqHoldings);
    } else {
      setSilverHoldings(prev => prev - activeDelivery.reqHoldings);
    }
    setDeliverySuccess(true);
  };

  return (
    <>
    <div className="flex-1 h-screen overflow-y-auto bg-[#f8f9fa] text-gray-900 font-sans">
      <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 pb-28">

        {/* Dynamic KYC Warning Banner - Kept from original */}
        {isKycPending ? (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertCircle size={24} className="animate-pulse" />
              </div>
              <div>
                <p className="text-base font-extrabold text-red-900">KYC Verification Required</p>
                <p className="text-xs text-red-600/80 mt-1 leading-relaxed">
                  Your digital assets vault is currently locked. Link your Aadhaar and PAN database under profile configurations to activate purchases, transfers, and physical coin deliveries.
                </p>
              </div>
            </div>
            <button onClick={() => onNavigate("settings")} className="shrink-0 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all outline-none border-none cursor-pointer">
              Complete KYC
            </button>
          </div>
        ) : isMinKyc ? (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <AlertCircle size={24} />
              </div>
              <div>
                <p className="text-base font-extrabold text-amber-900">Minimum KYC Active</p>
                <p className="text-xs text-amber-700/80 mt-1 leading-relaxed">
                  You are restricted to ₹10,000 daily purchase limit. Complete Video KYC to unlock full limits and physical delivery.
                </p>
              </div>
            </div>
            <button onClick={() => onNavigate("settings")} className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all outline-none border-none cursor-pointer">
              Upgrade Limits
            </button>
          </div>
        ) : null}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-black tracking-tight text-[#111827]">Digital Gold & Silver Assets</h1>
            <p className="text-[13px] font-medium text-gray-500 mt-1">Invest in 24K gold & 99.9% pure silver with complete security.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 text-emerald-600 px-4 py-2.5 rounded-xl flex items-center gap-2 border border-emerald-100 shadow-sm cursor-default">
              <ShieldCheck size={16} />
              <span className="text-[11px] font-bold">100% Insured Storage</span>
            </div>
            <button className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 shadow-sm outline-none cursor-pointer transition-colors">
              <Bell size={18} />
            </button>
          </div>
        </div>

        {/* Top Asset Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gold Card */}
          <div className="bg-[#fffbeb] border border-amber-100 rounded-[24px] p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white text-xl">
                  🪙
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Digital Gold Balance</h3>
                  <div className="text-2xl font-black text-amber-950">{goldHoldings.toFixed(4)} g</div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-end justify-between">
              <div>
                <div className="text-[15px] font-black text-amber-900">≈ ₹{(goldHoldings * goldPrice).toLocaleString()}</div>
                <div className="text-[11px] font-semibold text-amber-700/60 mt-0.5">Value at ₹{goldPrice.toLocaleString()}/g</div>
              </div>
              <button onClick={() => setMetal("gold")} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-amber-600 shadow-sm border-none outline-none cursor-pointer hover:bg-amber-50 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Silver Card */}
          <div className="bg-[#f8fafc] border border-slate-200 rounded-[24px] p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white text-xl">
                  🥈
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Digital Silver Balance</h3>
                  <div className="text-2xl font-black text-slate-800">{silverHoldings.toFixed(4)} g</div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-end justify-between">
              <div>
                <div className="text-[15px] font-black text-slate-700">≈ ₹{(silverHoldings * silverPrice).toLocaleString()}</div>
                <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Value at ₹{silverPrice.toLocaleString()}/g</div>
              </div>
              <button onClick={() => setMetal("silver")} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm border border-slate-100 outline-none cursor-pointer hover:bg-slate-50 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Vault Value Card */}
          <div className="bg-[#f5f3ff] border border-purple-100 rounded-[24px] p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 border border-purple-200 shadow-sm">
                  <Shield size={22} />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-1">Total Vault Value</h3>
                  <div className="text-[28px] font-black text-[#2e1065]">₹{((goldHoldings * goldPrice) + (silverHoldings * silverPrice)).toLocaleString()}</div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-end justify-between">
              <div className="text-[11px] font-bold text-purple-800/60 leading-tight">
                Locker Insured by<br/>Our Certified Partner
              </div>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm">
                <ShieldCheck size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Features Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-between gap-4 overflow-x-auto hide-scrollbar relative">
          <div className="flex items-center gap-12 px-4 whitespace-nowrap">
            <div className="flex items-center gap-3">
              <div className="text-amber-500 bg-amber-50 w-10 h-10 rounded-full flex items-center justify-center"><Coins size={20} /></div>
              <div>
                <div className="text-[12px] font-bold text-gray-900">24K Pure Gold</div>
                <div className="text-[10px] font-medium text-gray-500">99.9% Pure</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-purple-500 bg-purple-50 w-10 h-10 rounded-full flex items-center justify-center"><ShieldCheck size={20} /></div>
              <div>
                <div className="text-[12px] font-bold text-gray-900">100% Secure</div>
                <div className="text-[10px] font-medium text-gray-500">Insurance Cover</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-blue-500 bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center"><RefreshCw size={20} /></div>
              <div>
                <div className="text-[12px] font-bold text-gray-900">Buy & Sell</div>
                <div className="text-[10px] font-medium text-gray-500">Anytime</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-emerald-500 bg-emerald-50 w-10 h-10 rounded-full flex items-center justify-center"><Wallet size={20} /></div>
              <div>
                <div className="text-[12px] font-bold text-gray-900">Low Entry</div>
                <div className="text-[10px] font-medium text-gray-500">Start from ₹1</div>
              </div>
            </div>
            <div className="flex items-center gap-3 pr-8">
              <div className="text-indigo-500 bg-indigo-50 w-10 h-10 rounded-full flex items-center justify-center"><BarChart3 size={20} /></div>
              <div>
                <div className="text-[12px] font-bold text-gray-900">Real-time Price</div>
                <div className="text-[10px] font-medium text-gray-500">Live Market Rate</div>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent flex items-center justify-end pr-4 pointer-events-none">
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        </div>

        {/* Middle Section - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
          
          {/* Left: Graph/Stats */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 lg:p-8 shadow-sm flex flex-col relative overflow-hidden">
             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
               <div>
                 <h3 className="text-[13px] font-bold text-gray-900 mb-1">Real-time {metalName} Price</h3>
                 <div className="flex items-baseline gap-2">
                   <span className="text-2xl font-black text-gray-900">₹{activePrice.toLocaleString()}</span>
                   <span className="text-sm font-bold text-gray-400">/gram</span>
                   <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} ml-2`}>
                     {isPositive ? '+' : ''}{performanceChange}%
                   </span>
                 </div>
                 <div className="text-[10px] font-medium text-gray-400 mt-2">As on 17 Jul 2026, 03:30 PM</div>
               </div>
               
               {/* Timeframe Tabs */}
               <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
                 {["1D", "1W", "1M", "1Y", "5Y"].map((tf) => (
                   <button 
                     key={tf}
                     onClick={() => setTimeframe(tf as TimeFrame)}
                     className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border-none outline-none cursor-pointer ${timeframe === tf ? 'bg-[#5b21b6] text-white shadow-sm' : 'bg-transparent text-gray-500 hover:bg-gray-100'}`}
                   >
                     {tf}
                   </button>
                 ))}
               </div>
             </div>

             {/* Graph Placeholder */}
             <div className="flex-1 min-h-[200px] relative w-full mb-8">
               <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                 <defs>
                   <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor={metal === 'gold' ? '#f59e0b' : '#64748b'} stopOpacity="0.2" />
                     <stop offset="100%" stopColor={metal === 'gold' ? '#f59e0b' : '#64748b'} stopOpacity="0" />
                   </linearGradient>
                 </defs>
                 <path d={fillPath} fill="url(#gradientFill)" />
                 <path d={linePath} fill="none" stroke={metal === 'gold' ? '#f59e0b' : '#64748b'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                 
                 {/* Live dot */}
                 <circle 
                    cx={points[points.length - 1].split(',')[0]} 
                    cy={points[points.length - 1].split(',')[1]} 
                    r="4" 
                    fill={metal === 'gold' ? '#f59e0b' : '#64748b'} 
                    className="animate-pulse"
                 />
                 <circle 
                    cx={points[points.length - 1].split(',')[0]} 
                    cy={points[points.length - 1].split(',')[1]} 
                    r="10" 
                    fill={metal === 'gold' ? '#f59e0b' : '#64748b'} 
                    opacity="0.2"
                    className="animate-ping"
                 />
               </svg>
             </div>

             {/* Bottom Stats */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
               <div>
                 <div className="text-[10px] font-semibold text-gray-500 mb-1">Lowest Price</div>
                 <div className="text-[13px] font-bold text-gray-900">₹{minVal.toLocaleString()}/g</div>
               </div>
               <div>
                 <div className="text-[10px] font-semibold text-gray-500 mb-1">Highest Price</div>
                 <div className="text-[13px] font-bold text-gray-900">₹{maxVal.toLocaleString()}/g</div>
               </div>
               <div>
                 <div className="text-[10px] font-semibold text-gray-500 mb-1">Today's Open</div>
                 <div className="text-[13px] font-bold text-gray-900">₹{activeDataset[0].toLocaleString()}/g</div>
               </div>
               <div>
                 <div className="text-[10px] font-semibold text-gray-500 mb-1">Vault Storage Tax</div>
                 <div className="text-[13px] font-bold text-emerald-600">0% (Lifetime Free)</div>
               </div>
             </div>
          </div>

          {/* Right: Buy/Sell Form */}
          <div className="bg-white rounded-[24px] border border-gray-100 p-6 lg:p-8 shadow-sm flex flex-col relative">
             <div className="flex items-center justify-between border-b border-gray-100 mb-6">
               <button 
                 onClick={() => setTxType("buy")}
                 className={`flex-1 pb-3 text-[13px] font-bold transition-all border-b-2 bg-transparent outline-none cursor-pointer ${txType === 'buy' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
               >
                 Buy {metalName}
               </button>
               <button 
                 onClick={() => setTxType("sell")}
                 className={`flex-1 pb-3 text-[13px] font-bold transition-all border-b-2 bg-transparent outline-none cursor-pointer ${txType === 'sell' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
               >
                 Sell {metalName}
               </button>
             </div>

             <div className="flex-1 flex flex-col gap-5">
                <div>
                  <div className="text-[11px] font-bold text-gray-500 mb-2">Investment Amount (₹)</div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-bold">₹</span>
                    <input 
                      type="number"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full bg-white border border-gray-100 rounded-xl py-3 pl-8 pr-4 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-300 transition-all placeholder:font-medium placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-gray-500 mb-2">You will get (approx.)</div>
                  <div className="relative">
                    <input 
                      type="number"
                      value={grams}
                      onChange={(e) => handleGramsChange(e.target.value)}
                      placeholder="0.0000"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-300 transition-all placeholder:font-medium placeholder:text-gray-400"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">g</span>
                  </div>
                </div>

                {txType === "buy" && (
                  <div className="flex flex-wrap gap-2">
                    {["+₹500", "+₹1,000", "+₹5,000", "+₹10,000"].map(val => (
                      <button 
                        key={val}
                        onClick={() => handleAmountChange((Number(amount) + Number(val.replace(/\D/g, ''))).toString())}
                        className="flex-1 px-2 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer outline-none"
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-4">
                   <div className="text-[10px] font-bold text-gray-400">Use Daily Limit</div>
                   <div className="text-[10px] font-bold text-gray-700">₹{buyUsed.toLocaleString()} / ₹{(txType === "buy" ? dailyBuyLimit : dailySellLimit).toLocaleString()}</div>
                </div>
             </div>

             <button 
               onClick={handleTransaction}
               disabled={isProcessing}
               className={`w-full py-4 mt-6 rounded-xl font-bold text-sm shadow-sm transition-all outline-none border-none cursor-pointer flex justify-center items-center gap-2
                 ${isProcessing ? 'bg-gray-200 text-gray-500' : 'bg-[#eab308] hover:bg-[#ca8a04] text-white shadow-amber-500/20'}
               `}
             >
               {isProcessing ? <Loader2 className="animate-spin" size={18} /> : `${txType === 'buy' ? 'Buy' : 'Sell'} 24K ${metalName}`}
             </button>

             <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-600">
               <ShieldCheck size={12} /> Secure • Insured • 99.9% Pure
             </div>
          </div>
        </div>

        {/* Lower Section: Estimator and Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
          
          {/* Left: Auto-Save and Security Banner */}
          <div className="space-y-6">
             <div className="bg-white border border-gray-100 rounded-[24px] p-6 lg:p-8 shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                     <Calculator size={20} />
                   </div>
                   <div>
                     <h3 className="text-sm font-bold text-gray-900">Auto-Save Wealth Estimator</h3>
                     <p className="text-[11px] font-medium text-gray-500 mt-0.5">Estimate your future wealth by auto-saving in pure gold regularly.</p>
                   </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                   <div className="flex-1 flex flex-col gap-6">
                     <div>
                       <div className="flex items-center justify-between mb-4">
                         <label className="text-[11px] font-bold text-gray-900">Monthly Investment Amount</label>
                         <span className="text-[13px] font-black text-gray-900">₹{calcMonthly.toLocaleString()}</span>
                       </div>
                       <input 
                         type="range" min="500" max="10000" step="500" 
                         value={calcMonthly} 
                         onChange={(e) => setCalcMonthly(Number(e.target.value))}
                         className="w-full accent-amber-500 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer outline-none"
                       />
                     </div>
                     <div>
                       <label className="text-[11px] font-bold text-gray-900 block mb-4">Investment Period</label>
                       <div className="flex gap-2">
                         {[1, 3, 5, 10].map(y => (
                           <button 
                             key={y} onClick={() => setCalcYears(y)}
                             className={`flex-1 py-2.5 text-[10px] font-bold rounded-xl transition-colors border outline-none cursor-pointer ${calcYears === y ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-500 border-gray-200 hover:border-amber-300'}`}
                           >
                             {y} Year{y>1?'s':''}
                           </button>
                         ))}
                       </div>
                     </div>
                   </div>

                   <div className="flex-1 bg-[#fcfcfc] border border-gray-100 rounded-[20px] p-5 flex flex-col relative overflow-hidden shadow-sm">
                     <div className="flex justify-between items-center mb-3">
                       <span className="text-[10px] font-bold text-gray-500 uppercase">Total Invested Capital</span>
                       <span className="text-[12px] font-black text-gray-900">₹{projection.invested.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center mb-6">
                       <span className="text-[10px] font-bold text-gray-500 uppercase">Estimated Gold Returns (12% p.a.)</span>
                       <span className="text-[12px] font-black text-emerald-600">+₹{projection.growth.toLocaleString()}</span>
                     </div>
                     <div className="w-full h-[1px] bg-gray-100 mb-4" />
                     <div className="mt-auto relative z-10 flex flex-col justify-end">
                       <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Estimated Portfolio Value</div>
                       <div className="text-3xl font-black text-amber-500">₹{projection.projected.toLocaleString()}</div>
                     </div>
                     
                     {/* Decorative mini graph in bg */}
                     <div className="absolute bottom-0 right-0 left-0 h-24 opacity-30 pointer-events-none">
                        <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
                           <path d="M0,40 L0,30 L20,35 L40,20 L60,25 L80,10 L100,5 L100,40 Z" fill="#fbbf24" />
                           <path d="M0,30 L20,35 L40,20 L60,25 L80,10 L100,5" fill="none" stroke="#d97706" strokeWidth="1.5" />
                        </svg>
                     </div>
                   </div>
                </div>
             </div>

             {/* Security Banner */}
             <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-purple-100 rounded-[24px] p-6 flex items-center justify-between relative overflow-hidden border border-purple-100 shadow-sm">
                <div className="relative z-10 max-w-[200px] sm:max-w-[250px]">
                  <div className="w-8 h-8 rounded-full bg-[#5b21b6] text-white flex items-center justify-center mb-3 shadow-md">
                     <ShieldCheck size={14} />
                  </div>
                  <h3 className="text-[15px] font-black text-gray-900 mb-1 leading-tight">Your Wealth, 100% Secure</h3>
                  <p className="text-[11px] font-medium text-gray-600 mb-4 leading-relaxed">All your gold & silver is stored in insured vaults with top-tier security.</p>
                  <button className="bg-white text-purple-600 text-[11px] font-bold px-4 py-2 rounded-xl flex items-center gap-1 hover:bg-purple-50 transition-colors shadow-sm outline-none border border-transparent cursor-pointer">
                    Learn More <ArrowRight size={12} />
                  </button>
                </div>
                {/* 3D Safe Placeholder Box */}
                <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 mr-2">
                   <div className="w-full h-full bg-indigo-500 rounded-[20px] shadow-lg flex flex-col items-center justify-center border-b-[6px] border-indigo-700 relative overflow-hidden">
                      <div className="absolute inset-2 bg-indigo-400 rounded-xl border-l-[4px] border-indigo-600 flex flex-col p-2 gap-2">
                        <div className="flex-1 bg-indigo-800/30 rounded flex items-center justify-center"><div className="w-6 h-3 bg-amber-400 rounded-sm" /></div>
                        <div className="flex-1 bg-indigo-800/30 rounded flex items-center justify-center"><div className="w-6 h-3 bg-amber-400 rounded-sm" /></div>
                        <div className="flex-1 bg-indigo-800/30 rounded flex items-center justify-center"><div className="w-6 h-3 bg-slate-300 rounded-sm" /></div>
                      </div>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-200 border-4 border-gray-400 shadow-inner flex items-center justify-center">
                        <div className="w-3 h-1 bg-gray-800 rounded-full" />
                      </div>
                   </div>
                   <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white p-2 rounded-2xl shadow-lg border-2 border-white">
                      <ShieldCheck size={24} />
                   </div>
                </div>
             </div>
          </div>

          {/* Right: Security Lock and Log */}
          <div className="space-y-6 flex flex-col h-full">
             <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      {vaultLocked ? <Lock size={20} /> : <Unlock size={20} />}
                   </div>
                   <div>
                     <h3 className="text-[13px] font-bold text-gray-900">Security Vault Lock</h3>
                     <p className="text-[10px] font-medium text-gray-500 mt-0.5 max-w-[140px] leading-tight">Protects assets and transactions if active</p>
                   </div>
                </div>
                <Switch checked={vaultLocked} onCheckedChange={setVaultLocked} className="data-[state=checked]:bg-purple-600" />
             </div>

             <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm flex-1 flex flex-col">
                <h3 className="text-[13px] font-bold text-gray-900 mb-6 flex items-center gap-2"><FileText size={16} className="text-purple-600" /> Vault Statement Log</h3>
                
                <div className="flex-1 flex flex-col gap-5">
                  {transactions.slice(0, 3).map((t, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-[12px] shadow-sm ${t.type === 'Buy' && t.metal === 'Gold' ? 'bg-emerald-500' : t.type === 'Buy' && t.metal === 'Silver' ? 'bg-blue-500' : 'bg-amber-500'}`}>
                            {t.metal === 'Gold' ? '🪙' : '🥈'}
                         </div>
                         <div>
                           <div className="text-[11px] font-bold text-gray-900">{t.type} {t.metal}</div>
                           <div className="text-[9px] font-medium text-gray-400 mt-0.5">{t.date} • {t.grams}</div>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className={`text-[11px] font-bold ${t.type === 'Buy' ? 'text-gray-900' : 'text-gray-900'}`}>{t.type === 'Buy' ? '+' : '-'}{t.amount}</div>
                         <div className="text-[8px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded uppercase mt-1 inline-block">{t.status}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => onNavigate("history")} className="mt-6 text-[11px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none transition-colors">
                  View All Transactions <ArrowRight size={14} />
                </button>
             </div>
          </div>
        </div>

        {/* Physical Metal Delivery Section */}
        <div className="bg-white rounded-[24px] border border-gray-100 p-6 lg:p-8 shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-gray-100 pb-4">
             <div>
               <h2 className="text-lg font-black text-gray-900 tracking-tight">Doorstep Delivery of Vault Physical Metal</h2>
               <p className="text-[11px] font-medium text-gray-500 mt-1">Redeem your virtual balance for certified 24K Gold & 99.9% Silver physical coins.</p>
             </div>
             <button className="text-[11px] font-bold text-purple-600 flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none">
               How it Works? <ArrowRight size={14} />
             </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DELIVERY_PRODUCTS.map((prod, i) => {
               const isGold = prod.metal === "gold";
               const colorClass = isGold ? "amber" : "purple";
               
               return (
                 <div key={i} className="bg-gray-50 border border-gray-100 rounded-[20px] p-6 flex flex-col items-center text-center hover:border-gray-300 transition-colors shadow-sm relative">
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-gray-500 shadow-sm border border-gray-100">
                      {prod.weight}g
                    </div>
                    {/* Circle Image Placeholder */}
                    <div className="w-20 h-20 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center text-3xl mb-4">
                      {prod.image}
                    </div>
                    
                    <h3 className="text-[12px] font-black text-gray-900">{prod.name}</h3>
                    <p className="text-[9px] font-bold text-gray-400 mt-1">{prod.weight}g - {prod.purity}</p>
                    
                    <div className="mt-6 mb-4 w-full">
                       <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Requires</div>
                       <div className={`text-lg font-black text-${colorClass}-600`}>{prod.reqHoldings} g</div>
                    </div>
                    
                    <button 
                      onClick={() => handleRedeemProduct(prod)}
                      className={`w-full py-2.5 rounded-xl text-[11px] font-bold text-white shadow-sm outline-none cursor-pointer border-none
                        ${isGold ? 'bg-[#eab308] hover:bg-[#ca8a04]' : 'bg-[#5b21b6] hover:bg-[#4c1d95]'}
                      `}
                    >
                      Redeem Item
                    </button>
                 </div>
               )
            })}
          </div>
        </div>

        {/* Footer Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600"><ShieldCheck size={14} /></div>
             <div>
               <div className="text-[10px] font-black text-gray-900">100% Secure</div>
               <div className="text-[9px] font-medium text-gray-500 leading-tight">Insured Storage</div>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600"><CheckCircle2 size={14} /></div>
             <div>
               <div className="text-[10px] font-black text-gray-900">Certified Purity</div>
               <div className="text-[9px] font-medium text-gray-500 leading-tight">99.9% Assurance</div>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600"><RefreshCw size={14} /></div>
             <div>
               <div className="text-[10px] font-black text-gray-900">Easy Buy & Sell</div>
               <div className="text-[9px] font-medium text-gray-500 leading-tight">Anytime, Anywhere</div>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600"><HelpCircle size={14} /></div>
             <div>
               <div className="text-[10px] font-black text-gray-900">24/7 Support</div>
               <div className="text-[9px] font-medium text-gray-500 leading-tight">We're here for you</div>
             </div>
          </div>
        </div>

      </div>
    </div>
    
    {ModalComponent}

    <AnimatePresence>
      {activeDelivery && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative"
          >
            <button onClick={() => setActiveDelivery(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 outline-none border-none bg-transparent cursor-pointer">
              <X size={24} />
            </button>

            {deliverySuccess ? (
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Truck size={40} className="text-emerald-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Delivery Scheduled!</h3>
                <p className="text-slate-500 text-sm mb-8">
                  Your physical {activeDelivery.name} is being processed for delivery. You will receive tracking details via SMS shortly.
                </p>
                <button 
                  onClick={() => setActiveDelivery(null)}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-colors border-none outline-none cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Redeem Physical Coin</h3>
                <p className="text-slate-500 text-sm mb-6">Convert your digital holdings into physical delivery.</p>

                <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4 mb-6 border border-slate-100">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-2xl">
                    {activeDelivery.image}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{activeDelivery.name}</h4>
                    <p className="text-xs text-slate-500">Requires {activeDelivery.reqHoldings}g holding</p>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Delivery Address</label>
                  <textarea 
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter complete shipping address"
                    className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all resize-none h-24"
                  />
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                    <Shield size={14} className="text-emerald-500" /> 
                    <span>100% Insured Delivery via Securitas</span>
                  </div>
                </div>

                <button 
                  onClick={submitDeliveryRequest}
                  disabled={isProcessing || !deliveryAddress}
                  className={`w-full py-4 rounded-xl font-bold text-sm shadow-sm transition-all flex justify-center items-center gap-2 outline-none border-none cursor-pointer
                    ${isProcessing || !deliveryAddress ? 'bg-slate-100 text-slate-400' : 'bg-[#10b981] hover:bg-[#059669] text-white shadow-emerald-500/30'}
                  `}
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={18} /> : "Confirm Redemption"}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}