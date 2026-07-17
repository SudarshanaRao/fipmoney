"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Lock, Unlock, TrendingUp, Coins, ArrowUpRight, ArrowDownRight,
  Sparkles, Clock, Wallet, AlertCircle, CheckCircle2, Calculator,
  Loader2, Truck, Gift, Info, BarChart3, HelpCircle, ChevronRight, X
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { useFipModal } from "./FipModal";
import { addTransaction } from "../utils/transactionStorage";

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
  { id: "g1", metal: "gold", name: "24K MMTC-PAMP Gold Coin", weight: 1, reqHoldings: 1.0, image: "🪙", purity: "999.9 Purity" },
  { id: "g5", metal: "gold", name: "24K Augmont Gold Bar", weight: 5, reqHoldings: 5.0, image: "💳", purity: "999.9 Purity" },
  { id: "s10", metal: "silver", name: "99.9 Fine Silver Coin", weight: 10, reqHoldings: 10.0, image: "🪙", purity: "999 Purity" },
  { id: "s50", metal: "silver", name: "99.9 Augmont Silver Bar", weight: 50, reqHoldings: 50.0, image: "🥈", purity: "999 Purity" },
];

export default function DigitalGoldSilver({ onNavigate, kycStatus }: DigitalGoldSilverProps) {
  const { showAlert, ModalComponent } = useFipModal();
  const [metal, setMetal] = useState<"gold" | "silver">("gold");
  const [txType, setTxType] = useState<"buy" | "sell">("buy");
  const [timeframe, setTimeframe] = useState<TimeFrame>("1D");

  // Dynamic inputs
  const [amount, setAmount] = useState<string>("");
  const [grams, setGrams] = useState<string>("");

  // Security locks & simulated live prices
  const [vaultLocked, setVaultLocked] = useState<boolean>(false);
  const [goldPrice, setGoldPrice] = useState<number>(6420.50);
  const [silverPrice, setSilverPrice] = useState<number>(84.20);

  // User simulated holdings
  const [goldHoldings, setGoldHoldings] = useState<number>(12.4502);
  const [silverHoldings, setSilverHoldings] = useState<number>(340.2005);

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
    <div className="flex-1 h-screen overflow-y-auto bg-slate-50 text-slate-800">
      <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 pb-28">

        {/* Dynamic KYC Warning Banner */}
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
            <button
              onClick={() => onNavigate("settings")}
              className="bg-red-500 hover:bg-red-600 text-white text-xs font-black px-5 py-3 rounded-2xl transition-all cursor-pointer border-none shrink-0"
            >
              Verify KYC Profile
            </button>
          </div>
        ) : isMinKyc ? (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-extrabold text-amber-900">Minimum KYC Limits Applied</p>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  You can purchase up to ₹10,000 and sell up to ₹5,000 daily. Finish Video KYC to lift all transaction boundaries.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate("settings")}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition-all cursor-pointer border-none shrink-0"
            >
              Complete Video KYC
            </button>
          </div>
        ) : null}

        {/* Dynamic Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black uppercase py-0.5 px-2.5">Premium Vault</Badge>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><Shield size={12} /> 100% Insured Storage</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-2 text-slate-900">Digital Gold & Silver Assets</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMetal("gold")}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all border outline-none cursor-pointer
                ${metal === "gold"
                  ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
            >
              🪙 24K Pure Gold
            </button>
            <button
              onClick={() => setMetal("silver")}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all border outline-none cursor-pointer
                ${metal === "silver"
                  ? "bg-slate-500 text-white border-slate-500 shadow-md shadow-slate-500/20"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
            >
              🥈 99.9% Silver
            </button>
          </div>
        </div>

        {/* Vault Holdings Summary Block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-slate-100 p-6 rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-2xl shadow-inner shrink-0">🪙</div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Gold Balance</p>
              <p className="text-xl font-black text-slate-800 mt-0.5">{goldHoldings.toFixed(4)} g</p>
              <p className="text-xs font-semibold text-slate-500">Valued at: ₹{Math.round(goldHoldings * goldPrice).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center font-bold text-2xl shadow-inner shrink-0">🥈</div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Silver Balance</p>
              <p className="text-xl font-black text-slate-800 mt-0.5">{silverHoldings.toFixed(4)} g</p>
              <p className="text-xs font-semibold text-slate-500">Valued at: ₹{Math.round(silverHoldings * silverPrice).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 bg-gradient-to-r from-amber-50/50 to-orange-50/30 p-4 rounded-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-inner shrink-0">
              <Wallet size={22} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Total Vault Value</p>
              <p className="text-2xl font-black text-amber-600 mt-0.5">₹{Math.round((goldHoldings * goldPrice) + (silverHoldings * silverPrice)).toLocaleString()}</p>
              <p className="text-xs font-semibold text-slate-500">Locker Insured by MMTC-PAMP</p>
            </div>
          </div>
        </div>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Area: Live Market Rates & Interactive Graph */}
          <div className="lg:col-span-8 space-y-8">

            {/* Live Chart Container */}
            <Card className="bg-white border-slate-100 rounded-[2rem] overflow-hidden text-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <div className="p-6 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time valuation</span>
                  <div className="flex items-baseline gap-3">
                    <h2 className="text-3xl font-black tracking-tight text-slate-900">₹{activePrice.toLocaleString()}<span className="text-sm font-semibold text-slate-400">/gram</span></h2>
                    <span className={`text-xs font-bold flex items-center gap-0.5 ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
                      {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {isPositive ? "+" : ""}{performanceChange}%
                    </span>
                  </div>
                </div>

                {/* Timeframe Controls */}
                <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex gap-1">
                  {(["1D", "1W", "1M", "1Y", "5Y"] as TimeFrame[]).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider transition-all border-none outline-none cursor-pointer
                        ${timeframe === tf ? "bg-amber-500 text-white font-extrabold" : "bg-transparent text-slate-500 hover:text-slate-800"}`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic SVG Drawing Box */}
              <div className="px-6 py-4 relative">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full overflow-visible">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={metal === "gold" ? "#f59e0b" : "#64748b"} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={metal === "gold" ? "#f59e0b" : "#64748b"} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Gradient Area */}
                  <motion.path
                    d={fillPath}
                    fill="url(#chartGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Stroke Line */}
                  <motion.path
                    d={linePath}
                    fill="none"
                    stroke={metal === "gold" ? "#d97706" : "#475569"}
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />

                  {/* Endpoint marker dot */}
                  <circle
                    cx={chartWidth}
                    cy={chartHeight - ((activeDataset[activeDataset.length - 1] - minVal) / valRange) * (chartHeight - 30) - 15}
                    r="4"
                    fill={metal === "gold" ? "#d97706" : "#475569"}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Chart Stats Footer */}
              <div className="bg-slate-50 grid grid-cols-3 divide-x divide-slate-100 text-center py-4 border-t border-slate-100">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">Lowest Rate</span>
                  <span className="text-xs font-black text-slate-700 mt-1 block">₹{minVal.toLocaleString()}/g</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">Highest Rate</span>
                  <span className="text-xs font-black text-slate-700 mt-1 block">₹{maxVal.toLocaleString()}/g</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">Vault Storage Tax</span>
                  <span className="text-xs font-black text-emerald-600 mt-1 block">0% (LIFETIME FREE)</span>
                </div>
              </div>
            </Card>

            {/* Savings Auto-Save Calculator */}
            <Card className="bg-white border-slate-100 rounded-[2rem] p-6 text-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Calculator size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Auto-Save Wealth Estimator</h3>
                  <p className="text-xs text-slate-500 font-medium">Estimate your future wealth by auto-saving in pure {label} regularly.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inputs */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>Monthly investment amount</span>
                      <span className="text-amber-600 font-extrabold">₹{calcMonthly.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="20000"
                      step="500"
                      value={calcMonthly}
                      onChange={(e) => setCalcMonthly(Number(e.target.value))}
                      className="w-full accent-amber-500 h-1 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-600 block">Investment Period</span>
                    <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                      {[1, 3, 5].map((y) => (
                        <button
                          key={y}
                          onClick={() => setCalcYears(y)}
                          className={`py-2 rounded-lg text-xs font-bold outline-none border-none transition-all cursor-pointer
                            ${calcYears === y ? "bg-amber-500 text-white" : "bg-transparent text-slate-500"}`}
                        >
                          {y} {y === 1 ? "Year" : "Years"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Projection Results */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                      <span>Total Invested Capital:</span>
                      <span className="text-slate-700">₹{projection.invested.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                      <span>Estimated Gold Returns (+12% p.a.):</span>
                      <span className="text-emerald-600">₹{projection.growth.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-3.5 mt-3.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Portfolio Value</span>
                    <span className="text-2xl font-black text-amber-600">₹{projection.projected.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* DOORSTEP COIN DELIVERY */}
            <Card className="bg-white border-slate-100 rounded-[2rem] p-6 text-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Doorstep Delivery of Vault Physical Metal</h3>
                    <p className="text-xs text-slate-500 font-medium">Redeem your virtual balance for certified 24K Gold & 99.9% Silver physical coins.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {DELIVERY_PRODUCTS.map((prod) => {
                  const userHoldings = prod.metal === "gold" ? goldHoldings : silverHoldings;
                  const isEligible = userHoldings >= prod.reqHoldings;

                  return (
                    <div
                      key={prod.id}
                      className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between hover:border-slate-200 transition-all text-center relative overflow-hidden"
                    >
                      <div className="text-4xl py-3 block">{prod.image}</div>
                      <div>
                        <h4 className="text-[11px] font-extrabold text-slate-800 line-clamp-1">{prod.name}</h4>
                        <p className="text-[9px] text-slate-500 mt-1 font-bold">{prod.weight}g • {prod.purity}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-150">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Requires</span>
                        <span className="text-xs font-black text-amber-600">{prod.reqHoldings} g</span>
                      </div>

                      <button
                        onClick={() => handleRedeemProduct(prod)}
                        className={`w-full mt-3 py-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer border-none outline-none
                          ${isEligible
                            ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10"
                            : "bg-slate-200 text-slate-500 hover:bg-slate-250"}`}
                      >
                        {isEligible ? "Redeem Item" : "Buy to Unlock"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </Card>

          </div>

          {/* Right Area: Transaction Console, Lock, Limits */}
          <div className="lg:col-span-4 space-y-8">

            {/* Unified Transaction Box */}
            <Card className="bg-white border-slate-100 rounded-[2rem] p-6 text-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div>
                <div className="flex gap-4 border-b border-slate-100 pb-4 mb-6">
                  <button
                    onClick={() => { setTxType("buy"); setAmount(""); setGrams(""); }}
                    className={`text-xs font-black tracking-wider uppercase pb-2 bg-transparent cursor-pointer outline-none border-none transition-colors
                      ${txType === "buy" ? "text-amber-600 border-b-2 border-amber-500" : "text-slate-400 hover:text-slate-650"}`}
                  >
                    Buy Asset
                  </button>
                  <button
                    onClick={() => { setTxType("sell"); setAmount(""); setGrams(""); }}
                    className={`text-xs font-black tracking-wider uppercase pb-2 bg-transparent cursor-pointer outline-none border-none transition-colors
                      ${txType === "sell" ? "text-amber-600 border-b-2 border-amber-500" : "text-slate-400 hover:text-slate-650"}`}
                  >
                    Sell Asset
                  </button>
                </div>

                {/* KYC Pending Guard */}
                {isKycPending ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 text-xs font-semibold flex items-start gap-2.5">
                    <AlertCircle size={16} className="shrink-0 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-extrabold text-red-900">KYC Verification Required</p>
                      <p className="text-[11px] text-red-700/85 mt-1">Please complete Aadhaar and PAN verification under configurations to unlock buy/sell capabilities.</p>
                      <button
                        onClick={() => onNavigate("settings")}
                        className="mt-3 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black py-1.5 px-3 rounded-lg border-none cursor-pointer outline-none"
                      >
                        Verify Now
                      </button>
                    </div>
                  </div>
                ) : txType === "sell" && vaultLocked ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 text-xs font-semibold flex items-start gap-2">
                    <Lock size={16} className="shrink-0 text-red-500 mt-0.5 animate-pulse" />
                    <div>
                      <p className="font-extrabold text-red-900">Vault Locking Shield is Active</p>
                      <p className="text-[11px] text-red-700/80 mt-1">Turn off the Security Vault Lock below to allow sell orders.</p>
                    </div>
                  </div>
                ) : null}

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Investment amount (INR)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                      <Input
                        type="text"
                        value={amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        placeholder="0"
                        disabled={isProcessing || isKycPending}
                        className="pl-7 pr-4 py-5 bg-slate-50 border-slate-200 text-slate-800 focus-visible:ring-amber-500 font-bold rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Weight equivalent (grams)</label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={grams}
                        onChange={(e) => handleGramsChange(e.target.value)}
                        placeholder="0.0000"
                        disabled={isProcessing || isKycPending}
                        className="pr-8 pl-4 py-5 bg-slate-50 border-slate-200 text-slate-800 focus-visible:ring-amber-500 font-bold rounded-xl"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">g</span>
                    </div>
                  </div>

                  {/* Quick select buttons */}
                  {txType === "buy" && !isKycPending && (
                    <div className="flex gap-2">
                      {[500, 1000, 5000].map(val => (
                        <button
                          key={val}
                          onClick={() => handleAmountChange(val.toString())}
                          disabled={isProcessing}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-extrabold rounded-lg border border-slate-200 cursor-pointer"
                        >
                          +₹{val.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Limit Gauge bar */}
                  {!isKycPending && (
                    <div className="space-y-1 pt-2">
                      <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                        <span>Used Daily Limit:</span>
                        <span>
                          {txType === "buy"
                            ? `₹${(Number(amount) || 0).toLocaleString()} / ₹${dailyBuyLimit.toLocaleString()}`
                            : `₹${(Number(amount) || 0).toLocaleString()} / ₹${dailySellLimit.toLocaleString()}`
                          }
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all duration-350"
                          style={{
                            width: `${Math.min(100, (((Number(amount) || 0) / (txType === "buy" ? dailyBuyLimit : dailySellLimit)) * 100))}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action trigger button */}
              <button
                onClick={handleTransaction}
                disabled={isKycPending || isProcessing || !amount || Number(amount) <= 0 || (txType === "sell" && vaultLocked)}
                className="w-full py-4 mt-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all outline-none border-none shadow-md cursor-pointer flex items-center justify-center gap-2"
                style={{
                  background: (isKycPending || !amount || Number(amount) <= 0 || (txType === "sell" && vaultLocked))
                    ? "#cbd5e1"
                    : txType === "buy" ? "#10b981" : "linear-gradient(135deg, #b87312, #efb652)",
                  color: (isKycPending || !amount || Number(amount) <= 0 || (txType === "sell" && vaultLocked)) ? "#94a3b8" : "white"
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Executing...
                  </>
                ) : (
                  `${txType} Pure ${label}`
                )}
              </button>
            </Card>

            {/* Lock Control */}
            <Card className="bg-white border-slate-100 rounded-[2rem] p-5 text-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                {vaultLocked ? (
                  <Lock size={18} className="text-amber-500 animate-pulse" />
                ) : (
                  <Unlock size={18} className="text-slate-400" />
                )}
                <div>
                  <h4 className="text-xs font-extrabold text-slate-700">Security Vault Lock</h4>
                  <p className="text-[9px] text-slate-400 font-semibold">Prevents sells and transfers if active</p>
                </div>
              </div>
              <Switch checked={vaultLocked} onCheckedChange={setVaultLocked} />
            </Card>

            {/* History statements list */}
            <Card className="bg-white border-slate-100 rounded-[2rem] p-6 text-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col h-[320px]">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Clock size={14} /> Vault Statement Log
              </h3>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                {transactions.map((tx, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs
                        ${tx.type === "Buy" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                        {tx.type === "Buy" ? "+" : "-"}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-700">{tx.type} {tx.metal}</p>
                        <p className="text-[9px] text-slate-400 font-semibold">{tx.date} • {tx.grams}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] font-black text-slate-700">{tx.amount}</p>
                      <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

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
              className="bg-white text-slate-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl border border-slate-100"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-650 flex items-center justify-center mx-auto animate-pulse">
                <Loader2 size={28} className="animate-spin" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-extrabold text-slate-900">Connecting to MMTC-PAMP Locker</h3>
                <p className="text-xs text-slate-500 leading-normal px-2">Finalizing weights, backing virtual assets with physical bullion vaults...</p>
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
              className="bg-white text-slate-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl border border-slate-100"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-inner">
                <CheckCircle2 size={28} strokeWidth={2.5} />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-900">Transaction Confirmed</h3>
                <p className="text-xs text-emerald-600 font-semibold bg-emerald-50 py-2 px-3 rounded-lg border border-emerald-100 inline-block">{successMsg}</p>
                <p className="text-[10px] text-slate-400 font-bold block pt-2">TX Ref: {lastTxId} • Audited Vault Secure</p>
              </div>

              <Button
                onClick={() => setTxSuccess(false)}
                className="w-full bg-[#111827] text-white hover:bg-black py-3 rounded-xl font-bold text-xs"
              >
                Close Receipt
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Doorstep Physical Delivery Dialog */}
      <AnimatePresence>
        {activeDelivery && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white text-slate-800 rounded-3xl p-6 max-w-md w-full relative border border-slate-100 shadow-2xl space-y-5"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveDelivery(null)}
                className="absolute right-4 top-4 bg-transparent border-none text-slate-400 hover:text-slate-800 cursor-pointer outline-none"
              >
                <X size={18} />
              </button>

              <div className="flex gap-4 items-center border-b border-slate-100 pb-4">
                <div className="text-4xl">{activeDelivery.image}</div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-950">{activeDelivery.name}</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Doorstep Insured Transit • {activeDelivery.purity}</p>
                </div>
              </div>

              {deliverySuccess ? (
                <div className="text-center py-4 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-950">Redemption Successful!</h4>
                    <p className="text-[10px] text-slate-400 leading-normal mt-1">Your coins have been securely packed and dispatched. Track your delivery via SMS code in 24 hours.</p>
                  </div>
                  <Button
                    onClick={() => setActiveDelivery(null)}
                    className="w-full bg-[#111827] text-white py-3 rounded-xl font-bold text-xs"
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Vault Reduction</span>
                    <span className="text-sm font-black text-amber-500">-{activeDelivery.reqHoldings} g (Virtual Assets)</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Shipping Address</label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter full shipping address with PIN code..."
                      rows={3}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  <div className="bg-[#f0f9ff] p-3 rounded-xl border border-blue-50 text-[10px] text-slate-500 font-semibold leading-normal">
                    ⚠️ Physical delivery requests will permanently reduce your vault virtual holdings. Insured transit packaging fee is sponsored by MMTC-PAMP.
                  </div>

                  <Button
                    disabled={!deliveryAddress || isProcessing}
                    onClick={submitDeliveryRequest}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    {isProcessing ? <Loader2 size={12} className="animate-spin" /> : <Truck size={14} />}
                    Request Physical Delivery
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transactions list mockup */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .scrollbar-thin::-webkit-scrollbar { width: 5px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9px; }
      `}} />

    </div>
    {ModalComponent}
    </>
  );
}
