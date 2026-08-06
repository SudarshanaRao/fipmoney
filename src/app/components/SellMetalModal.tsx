import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Clock, CheckCircle2, AlertCircle, RefreshCw, CreditCard, Smartphone, Check } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import Lottie from "lottie-react";

// Types
type Step = "input" | "payment" | "processing" | "success";
type Provider = "safeGold" | "mmtc" | "augmont";
type PaymentMethod = "upi" | "card" | "fipmoney";

interface SellMetalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number, grams: number) => void;
  metal: "gold" | "silver";
  basePrice: number;
  initialAmount?: string;
  initialGrams?: string;
}

// Mock chart data for today's price
const generateChartData = (basePrice: number) => {
  const data = [];
  let currentPrice = basePrice * 0.98; // Start a bit lower
  for (let i = 0; i < 24; i++) {
    data.push({ time: `${i}:00`, price: currentPrice });
    currentPrice += (Math.random() - 0.4) * (basePrice * 0.005); 
  }
  return data;
};

const providers = {
  safeGold: { name: "SafeGold", priceDiff: 0 },
  mmtc: { name: "MMTC-PAMP", priceDiff: 2.5 },
  augmont: { name: "Augmont", priceDiff: -1.2 }
};

export default function SellMetalModal({ isOpen, onClose, onSuccess, metal, basePrice, initialAmount, initialGrams }: SellMetalModalProps) {
  const [step, setStep] = useState<Step>("input");
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isTimedOut, setIsTimedOut] = useState(false);
  
  // Input state
  const [inputType, setInputType] = useState<"amount" | "grams">(initialGrams ? "grams" : "amount");
  const [inputValue, setInputValue] = useState(initialGrams || initialAmount || "");
  
  // Selections
  const [provider, setProvider] = useState<Provider>("safeGold");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  
  // Payment Details
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [fipOtp, setFipOtp] = useState("");

  const [chartData, setChartData] = useState<{time: string, price: number}[]>([]);
  const [highPrice, setHighPrice] = useState(0);
  const [lowPrice, setLowPrice] = useState(0);

  // Locked price calculation
  const currentLockedPrice = basePrice + providers[provider].priceDiff;
  const isGold = metal === "gold";

  // Calculations
  const calcAmount = inputType === "amount" ? Number(inputValue) : Number(inputValue) * currentLockedPrice;
  const calcGrams = inputType === "grams" ? Number(inputValue) : Number(inputValue) / currentLockedPrice;

  // Init chart and timer
  useEffect(() => {
    if (isOpen) {
      startTimer();
      const data = generateChartData(basePrice);
      setChartData(data);
      setHighPrice(Math.max(...data.map(d => d.price)));
      setLowPrice(Math.min(...data.map(d => d.price)));
      
      if (initialGrams) {
        setInputType("grams");
        setInputValue(initialGrams);
      } else if (initialAmount) {
        setInputType("amount");
        setInputValue(initialAmount);
      }
    } else {
      resetModal();
    }
  }, [isOpen, basePrice, initialAmount, initialGrams]);

  const startTimer = () => {
    setTimeLeft(300);
    setIsTimedOut(false);
  };

  const resetModal = () => {
    setStep("input");
    setInputValue("");
    setInputType("amount");
    setPaymentMethod(null);
    setUpiId("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setFipOtp("");
  };

  useEffect(() => {
    if (!isOpen || isTimedOut || step === "processing" || step === "success") return;
    
    if (timeLeft <= 0) {
      setIsTimedOut(true);
      return;
    }
    
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [isOpen, timeLeft, isTimedOut, step]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft > 180) return "bg-emerald-500";
    if (timeLeft > 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const handleProcessPayment = () => {
    setStep("processing");
    setTimeout(() => {
      setStep("success");
    }, 4000);
  };

  const handleFinish = () => {
    onSuccess(calcAmount, calcGrams);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }} 
          animate={{ scale: 1, y: 0 }} 
          exit={{ scale: 0.95, y: 20 }} 
          className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
        >


          {/* Timeout Overlay */}
          {isTimedOut && step !== "processing" && step !== "success" && (
            <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 rounded-3xl text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-6">
                <Clock size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Price Expired</h2>
              <p className="text-slate-500 mb-8 max-w-sm">The 5-minute price lock window has closed. Please refresh to get the latest live market prices.</p>
              <button 
                onClick={startTimer} 
                className="bg-slate-900 text-white font-bold py-4 px-8 rounded-2xl flex items-center gap-2 hover:bg-slate-800 transition-colors border-none cursor-pointer outline-none shadow-xl shadow-slate-900/20"
              >
                <RefreshCw size={18} /> Refresh Live Price
              </button>
            </div>
          )}

          {/* Top Bar with Timer */}
          {(step === "input" || step === "payment") && (
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 pb-4">
              <div className="flex items-start justify-between mb-4 pr-2">
                <div>
                  <h2 className="text-xl font-black text-slate-800">Sell Digital {metal === "gold" ? "Gold" : "Silver"}</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Live Market Rate</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-1.5 transition-colors border-none cursor-pointer outline-none">
                    <X size={18} />
                  </button>
                  <div className="text-xl font-black text-emerald-600">₹{currentLockedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<span className="text-xs text-slate-400">/g</span></div>
                </div>
              </div>

              {/* Progress Bar Timer */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex relative">
                <motion.div 
                  className={`h-full ${getTimerColor()} transition-colors duration-1000`} 
                  initial={{ width: "100%" }}
                  animate={{ width: `${(timeLeft / 300) * 100}%` }}
                  transition={{ ease: "linear", duration: 1 }}
                />
              </div>
              <div className="flex justify-between items-center mt-2 text-xs font-bold text-slate-500">
                <span>Price Locked</span>
                <span className={`flex items-center gap-1 ${timeLeft <= 60 ? 'text-red-500 animate-pulse' : ''}`}>
                  <Clock size={12} /> {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          )}

          <div className="p-6">
            {step === "input" && (
              <div className="space-y-8">
                
                {/* Chart Section */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div className="flex justify-between items-center mb-4 text-xs font-bold text-slate-500 uppercase">
                    <span>Today's Trend</span>
                    <div className="flex gap-4">
                      <span className="text-red-500 flex items-center gap-1">L: ₹{lowPrice.toFixed(2)}</span>
                      <span className="text-emerald-500 flex items-center gap-1">H: ₹{highPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                          itemStyle={{ color: '#0f172a' }}
                          formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Price']}
                          labelStyle={{ display: 'none' }}
                        />
                        <Line type="monotone" dataKey="price" stroke={isGold ? "#d89221" : "#7c93a8"} strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Input Section */}
                <div>
                  <div className="flex bg-slate-100/50 p-1 rounded-xl w-full max-w-[240px] mx-auto mb-6 relative">
                    <div 
                      className={`absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm border border-slate-200/50 transition-transform duration-300 ${inputType === "grams" ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}`} 
                    />
                    <button 
                      onClick={() => setInputType("amount")} 
                      className={`flex-1 py-2 text-[11px] font-bold z-10 transition-colors cursor-pointer border-none outline-none bg-transparent ${inputType === "amount" ? 'text-slate-900' : 'text-slate-500'}`}
                    >
                      Sell in Amount (₹)
                    </button>
                    <button 
                      onClick={() => setInputType("grams")} 
                      className={`flex-1 py-2 text-[11px] font-bold z-10 transition-colors cursor-pointer border-none outline-none bg-transparent ${inputType === "grams" ? 'text-slate-900' : 'text-slate-500'}`}
                    >
                      Sell in Grams (g)
                    </button>
                  </div>

                  <div className="relative max-w-sm mx-auto">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-slate-300">
                      {inputType === "amount" ? '₹' : ''}
                    </span>
                    <input 
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={`Enter ${inputType === "amount" ? 'Amount' : 'Grams'}`}
                      className={`w-full bg-white border border-slate-200 focus:border-slate-800 rounded-2xl py-4 pr-6 text-xl font-black text-slate-800 outline-none transition-colors shadow-inner shadow-slate-50/50 ${inputType === "amount" ? 'pl-9' : 'pl-4'}`}
                    />
                    {inputType === "grams" && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-black text-slate-300">g</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-4 px-2">
                    <div className="text-sm font-bold text-slate-500">
                      You will get roughly
                    </div>
                    <div className="text-xl font-black text-slate-800">
                      {inputType === "amount" ? `${calcGrams.toFixed(4)} g` : `₹${calcAmount.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`}
                    </div>
                  </div>
                </div>

                {/* Provider Selection */}
                <div>
                  <h3 className="text-xs font-bold text-slate-800 mb-3 px-1">Select Vaulting Provider</h3>
                  <div className="flex flex-col gap-2">
                    {(Object.keys(providers) as Provider[]).map((p) => (
                      <button 
                        key={p}
                        onClick={() => setProvider(p)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white
                          ${provider === p ? 'border-slate-900 shadow-sm ring-1 ring-slate-900/10' : 'border-slate-100 hover:border-slate-300'}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 text-xs font-black text-slate-400">
                            {providers[p].name.charAt(0)}
                          </div>
                          <span className="text-xs font-bold text-slate-700">{providers[p].name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-emerald-600">
                            {providers[p].priceDiff < 0 ? '-' : '+'}₹{Math.abs(providers[p].priceDiff)}/g
                          </span>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${provider === p ? 'border-slate-900' : 'border-slate-200'}`}>
                            {provider === p && <div className="w-2 h-2 bg-slate-900 rounded-full" />}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  disabled={!inputValue || Number(inputValue) <= 0}
                  onClick={handleProcessPayment}
                  className={`w-full py-4 rounded-2xl font-black text-lg transition-all outline-none border-none shadow-xl cursor-pointer mt-4
                    ${!inputValue || Number(inputValue) <= 0 ? 'bg-slate-100 text-slate-400 shadow-none' : 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-1'}
                  `}
                >
                  Confirm Sale
                </button>
              </div>
            )}



            {step === "processing" && (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-48 h-48 mb-6 relative">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <RefreshCw size={48} className="animate-spin text-emerald-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Processing Transaction</h3>
                <p className="text-slate-500 font-medium">Selling {metal} and securely storing it in your Fipmoney vault.<br/>Hang tight...</p>
              </div>
            )}

            {step === "success" && (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 mb-6 rounded-full bg-emerald-50 flex items-center justify-center relative">
                   <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20" />
                   <Check size={64} strokeWidth={4} className="text-emerald-500 relative z-10" />
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-2">Sale Successful!</h3>
                <p className="text-slate-500 font-medium mb-8">
                  {calcGrams.toFixed(4)}g of {metal} has been added to your vault.<br/>Your invoice has been generated and downloaded.
                </p>
                <div className="bg-slate-50 rounded-2xl p-4 w-full border border-slate-100 text-left flex justify-between items-center mb-8">
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase">Amount Paid</span>
                    <span className="block text-lg font-black text-slate-800">₹{calcAmount.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-bold text-slate-400 uppercase">Vault Balance Added</span>
                    <span className="block text-lg font-black text-emerald-600">+{calcGrams.toFixed(4)} g</span>
                  </div>
                </div>
                <button 
                  onClick={handleFinish}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-colors border-none cursor-pointer outline-none shadow-xl shadow-slate-900/20"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
