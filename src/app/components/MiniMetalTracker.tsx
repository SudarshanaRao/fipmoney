"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Lock, Activity, Tag, IndianRupee, ArrowDownUp } from "lucide-react";
import { Button } from "./ui/button";

interface MiniMetalTrackerProps {
  onNavigate?: (page: string) => void;
}

export default function MiniMetalTracker({ onNavigate }: MiniMetalTrackerProps) {
  const [activeTab, setActiveTab] = useState<"gold" | "silver">("gold");
  const [inputMode, setInputMode] = useState<"rupees" | "grams">("rupees");
  const [inputValue, setInputValue] = useState<string>("2100");

  const goldPrice = 14000.00;
  const silverPrice = 90.00;

  const currentPrice = activeTab === "gold" ? goldPrice : silverPrice;
  const quickAmounts = inputMode === "rupees" ? ["500", "1000", "2000", "5000"] : ["1", "5", "10", "50"];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev === "gold" ? "silver" : "gold"));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    if (val.split('.').length > 2) return;
    setInputValue(val);
  }

  const toggleInputMode = () => {
    setInputMode(prev => prev === "rupees" ? "grams" : "rupees");
    setInputValue("");
  }

  let converted = "0.0000";
  const numVal = parseFloat(inputValue || "0");
  if (inputMode === "rupees") {
    converted = (numVal / currentPrice).toFixed(4);
  } else {
    converted = (numVal * currentPrice).toFixed(2);
  }

  const isGold = activeTab === "gold";

  // Structural Theme Colors
  const accentColor = isGold ? "text-amber-500" : "text-slate-700";
  const bgAccent = isGold ? "bg-amber-50" : "bg-slate-100";

  return (
    <section className="bg-white relative font-sans py-24 flex flex-col justify-center border-b border-slate-100">
      <div className="container mx-auto px-6 md:px-12 max-w-[1200px]">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center justify-between">
          
          {/* Left Side: Editorial Typography & Features */}
          <div className="w-full lg:w-1/2 space-y-10">
             
             <div className="space-y-6">
               <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold tracking-wide uppercase bg-slate-50 text-slate-500 border border-slate-200">
                 <Lock size={14} /> Bank-Grade Security
               </div>
               
               <h1 className="text-[48px] md:text-[64px] font-semibold text-slate-900 leading-[1.1] tracking-tight">
                 Build wealth <br/>
                 with pure <span className={isGold ? "text-amber-500" : "text-slate-400 transition-colors duration-500"}>{isGold ? "Gold" : "Silver"}</span>.
               </h1>
               
               <p className="text-slate-500 text-[18px] md:text-[20px] font-normal leading-relaxed max-w-[500px]">
                 Start your digital {isGold ? "gold" : "silver"} journey today. Buy, sell, and track live market rates instantly with zero making charges.
               </p>
             </div>

             <div className="grid grid-cols-2 gap-x-8 gap-y-10 pt-4">
               {[
                 { title: "Zero Markup", desc: "Buy at live market price", icon: <Tag size={20} /> },
                 { title: `${isGold ? '24K' : '99.9%'} Purity`, desc: "Certified by trusted partners", icon: <ShieldCheck size={20} /> },
                 { title: "Live Rates", desc: "Prices update every second", icon: <Activity size={20} /> },
                 { title: "Instant Sell", desc: "Withdraw to your bank anytime", icon: <IndianRupee size={20} /> }
               ].map((feature, idx) => (
                 <div key={idx} className="flex flex-col gap-3">
                   <div className={`w-10 h-10 rounded-lg ${bgAccent} ${accentColor} flex items-center justify-center shrink-0 transition-colors duration-500`}>
                     {feature.icon}
                   </div>
                   <div>
                     <div className="text-[15px] font-semibold text-slate-900 mb-0.5">{feature.title}</div>
                     <div className="text-[14px] text-slate-500 leading-snug">{feature.desc}</div>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Right Side: Clean Structural Widget */}
          <div className="w-full lg:w-[460px] shrink-0">
            <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
               
               {/* Segmented Control Tabs */}
               <div className="flex bg-slate-50 p-1 rounded-xl mb-10 border border-slate-200/60">
                 <button 
                   onClick={() => setActiveTab("gold")}
                   className={`flex-1 py-2.5 text-[14px] font-medium rounded-lg transition-all ${isGold ? 'text-slate-900 bg-white shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   Digital Gold
                 </button>
                 <button 
                   onClick={() => setActiveTab("silver")}
                   className={`flex-1 py-2.5 text-[14px] font-medium rounded-lg transition-all ${!isGold ? 'text-slate-900 bg-white shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   Digital Silver
                 </button>
               </div>

               {/* Live Price Header */}
               <div className="mb-8 text-center flex flex-col items-center">
                 <div className="text-[13px] font-medium text-slate-500 flex items-center gap-2 mb-2">
                   <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                   </span>
                   Current Buy Price
                 </div>
                 
                 <div className="flex items-baseline gap-1 justify-center">
                   <span className="text-[24px] font-medium text-slate-400">₹</span>
                   <motion.div 
                     key={activeTab + "-price"}
                     initial={{ opacity: 0, y: -5 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="text-[48px] font-semibold text-slate-900 tracking-tight leading-none"
                   >
                     {currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                   </motion.div>
                   <span className="text-[18px] text-slate-400 font-medium ml-1">/g</span>
                 </div>
                 <div className="text-[13px] font-medium text-emerald-600 mt-2 bg-emerald-50 px-2 py-0.5 rounded text-center inline-block">+0.48% (24h)</div>
               </div>

               {/* Input Section (Exchange Style) */}
               <div className="space-y-4 mb-8">
                 
                 <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-100 transition-all">
                    <div className="p-4 bg-slate-100/50 border-b border-slate-200/60 flex justify-between items-center">
                       <span className="text-[13px] font-medium text-slate-500">You Pay</span>
                       <button onClick={toggleInputMode} className="text-[12px] font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">
                         <ArrowDownUp size={12} /> Switch to {inputMode === 'rupees' ? 'Grams' : 'INR'}
                       </button>
                    </div>
                    <div className="p-4 flex items-center gap-2 bg-white">
                       <span className="text-[28px] font-medium text-slate-300">{inputMode === 'rupees' ? '₹' : ''}</span>
                       <input 
                         type="text" 
                         value={inputValue}
                         onChange={handleInputChange}
                         className="w-full bg-transparent border-none outline-none text-[36px] font-semibold text-slate-900 p-0 focus:ring-0 placeholder-slate-200"
                         placeholder="0"
                       />
                       <span className="text-[24px] font-medium text-slate-300">{inputMode === 'grams' ? 'g' : ''}</span>
                    </div>
                    <div className="px-4 pb-4 pt-2 flex justify-between items-center bg-white">
                       <span className="text-[13px] font-medium text-slate-500">You Receive</span>
                       <span className="text-[16px] font-semibold text-slate-800">
                          {inputMode === "rupees" ? `${converted} g` : `₹${converted}`}
                       </span>
                    </div>
                 </div>

                 {/* Quick Select */}
                 <div className="flex gap-2">
                   {quickAmounts.map((amt) => (
                     <button 
                       key={amt}
                       onClick={() => setInputValue(amt)}
                       className={`flex-1 bg-white border py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                         inputValue === amt 
                          ? `border-slate-900 text-slate-900 bg-slate-50`
                          : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                       }`}
                     >
                       {inputMode === "rupees" ? `₹${amt}` : `${amt}g`}
                     </button>
                   ))}
                 </div>
               </div>

               {/* CTA */}
               <Button 
                 onClick={() => onNavigate?.('login')}
                 className={`w-full h-[56px] rounded-xl font-semibold text-[16px] transition-all flex items-center justify-center gap-2 text-white ${isGold ? 'bg-amber-500 hover:bg-amber-600 shadow-md shadow-amber-500/20' : 'bg-slate-900 hover:bg-slate-800 shadow-md shadow-slate-900/20'}`}
               >
                 Start Investing <ArrowRight size={18} />
               </Button>
               
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

