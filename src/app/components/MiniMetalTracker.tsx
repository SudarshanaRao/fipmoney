"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, TrendingUp, ShieldCheck, CheckCircle2, ChevronRight, Calculator } from "lucide-react";
import { Button } from "./ui/button";

interface MiniMetalTrackerProps {
  onNavigate?: (page: string) => void;
}

export default function MiniMetalTracker({ onNavigate }: MiniMetalTrackerProps) {
  // state for Gold / Silver toggle
  const [activeTab, setActiveTab] = useState<"gold" | "silver">("gold");
  
  // state for Rupees / Grams toggle
  const [inputMode, setInputMode] = useState<"rupees" | "grams">("rupees");
  
  // input value string
  const [inputValue, setInputValue] = useState<string>("5100");

  const goldPrice = 14000.00;
  const silverPrice = 260.00;

  const currentPrice = activeTab === "gold" ? goldPrice : silverPrice;

  // quick amounts based on mode
  const quickAmounts = inputMode === "rupees" ? ["5100", "2100", "1100", "500"] : ["1", "5", "10", "50"];

  // handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // only allow digits and one decimal
    const val = e.target.value.replace(/[^0-9.]/g, '');
    if (val.split('.').length > 2) return;
    setInputValue(val);
  }

  // calculate conversion
  let converted = "0.0000";
  const numVal = parseFloat(inputValue || "0");
  if (inputMode === "rupees") {
    converted = (numVal / currentPrice).toFixed(4); // show grams
  } else {
    converted = (numVal * currentPrice).toFixed(2); // show rupees
  }

  return (
    <section className="bg-[#050B14] relative overflow-hidden font-sans min-h-[50vh] flex flex-col justify-center border-b border-white/5">
      
      {/* Deep Space / Gold Aura Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] bg-gradient-to-br from-amber-500/20 to-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] bg-gradient-to-tl from-indigo-500/20 to-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-screen" />

      {/* Top Marquee Ticker */}
      <div className="absolute top-0 w-full bg-white/5 backdrop-blur-md border-b border-white/10 py-2.5 overflow-hidden flex whitespace-nowrap z-20">
        <motion.div 
          animate={{ x: [0, -1000] }} 
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="flex items-center gap-16 font-bold text-[13px] text-white/70"
        >
          {Array(8).fill(0).map((_, i) => (
            <React.Fragment key={i}>
              <span className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-white/60 tracking-wider">24K GOLD</span> 
                <span className="text-amber-400 font-black tracking-tight text-[14px]">₹{goldPrice.toFixed(2)}</span> 
                <TrendingUp size={14} className="text-amber-500"/>
              </span>
              <span className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-100"></span>
                </span>
                <span className="text-white/60 tracking-wider">99.9% SILVER</span> 
                <span className="text-slate-200 font-black tracking-tight text-[14px]">₹{silverPrice.toFixed(2)}</span> 
                <TrendingUp size={14} className="text-slate-300"/>
              </span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      <div className="container mx-auto px-6 md:px-8 max-w-[1300px] py-14 lg:py-16 relative z-10 mt-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center justify-between">
          
          {/* Left Side: Bold Promotional Copy */}
          <div className="flex-1 space-y-8 lg:max-w-[540px]">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="inline-flex items-center gap-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(245,158,11,0.2)] backdrop-blur-sm"
             >
               <ShieldCheck size={16} strokeWidth={2.5} className="text-amber-400" /> Bank-Grade Security
             </motion.div>
             
             <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="text-[46px] md:text-[64px] font-black text-white leading-[1.05] tracking-tight"
             >
               Build wealth <br/>
               with <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.4)]">Pure Gold</span>
             </motion.h1>
             
             <motion.p 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="text-slate-400 text-[18px] font-medium leading-relaxed max-w-[480px]"
             >
               Start your digital gold journey today. Buy, sell, and track live market rates instantly with zero making charges.
             </motion.p>

             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3 }}
               className="grid grid-cols-2 gap-x-6 gap-y-8 pt-4"
             >
               {[
                 { title: "Zero Markup", desc: "Buy directly at market price" },
                 { title: "24K 99.9% Purity", desc: "Certified by trusted partners" },
                 { title: "Live Rates", desc: "Prices update every second" },
                 { title: "Instant Sell", desc: "Withdraw to your bank anytime" }
               ].map((feature, idx) => (
                 <div key={idx} className="flex flex-col gap-2 group">
                   <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all duration-300">
                     <CheckCircle2 size={20} strokeWidth={2.5} />
                   </div>
                   <div>
                     <div className="text-[15px] font-bold text-white group-hover:text-amber-400 transition-colors">{feature.title}</div>
                     <div className="text-[13px] font-medium text-slate-500 leading-snug">{feature.desc}</div>
                   </div>
                 </div>
               ))}
             </motion.div>
          </div>

          {/* Right Side: The Ultra-Premium Buy Widget */}
          <div className="w-full lg:w-[460px] shrink-0 relative perspective-1000">
            {/* Glowing backdrop shadow */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-[40px] blur-3xl transform translate-y-6 scale-[0.95] -z-10" />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
              className="bg-[#0f172a]/80 backdrop-blur-3xl rounded-[32px] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 relative z-10 overflow-hidden"
            >
               {/* Internal Glass Highlight */}
               <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
               <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

               {/* Minimal Pill Tabs */}
               <div className="flex bg-[#0a0f1c] p-1.5 rounded-2xl mb-8 relative border border-white/5">
                 <button 
                   onClick={() => setActiveTab("gold")}
                   className={`flex-1 py-3 text-[14px] font-black rounded-xl transition-all relative z-10 ${activeTab === "gold" ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                   Digital Gold
                   {activeTab === "gold" && (
                     <motion.div layoutId="premiumDarkTab" className="absolute inset-0 bg-white/5 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10 -z-10" />
                   )}
                 </button>
                 <button 
                   onClick={() => setActiveTab("silver")}
                   className={`flex-1 py-3 text-[14px] font-black rounded-xl transition-all relative z-10 ${activeTab === "silver" ? 'text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                   Digital Silver
                   {activeTab === "silver" && (
                     <motion.div layoutId="premiumDarkTab" className="absolute inset-0 bg-white/5 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10 -z-10" />
                   )}
                 </button>
               </div>

               {/* Massive Live Price */}
               <div className="mb-8 text-center relative z-10">
                 <div className="inline-flex items-center gap-2 text-slate-400 font-bold text-[11px] tracking-[0.15em] uppercase mb-4 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                   <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                   </span>
                   Live Market Price
                 </div>
                 <div className="flex items-baseline justify-center gap-1.5">
                   <span className="text-[24px] font-black text-slate-500">₹</span>
                   <div className="text-[56px] font-black text-white tracking-tighter leading-none drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">
                     {currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                   </div>
                   <span className="text-[20px] text-slate-500 font-bold">/g</span>
                 </div>
                 <div className="text-[12px] font-bold text-emerald-400 mt-2 tracking-wide">+0.4% from yesterday</div>
               </div>

               {/* Input Section */}
               <div className="space-y-4 mb-8 relative z-10">
                 <div className="flex items-center justify-between text-[13px] font-bold text-slate-400 px-1">
                   <span>I want to buy in</span>
                   <div className="flex items-center gap-3">
                     <button 
                       onClick={() => { setInputMode("rupees"); setInputValue("5100"); }}
                       className={`transition-colors ${inputMode === "rupees" ? "text-amber-400" : "hover:text-white"}`}
                     >Rupees</button>
                     <span className="text-slate-600">|</span>
                     <button 
                       onClick={() => { setInputMode("grams"); setInputValue("10"); }}
                       className={`transition-colors ${inputMode === "grams" ? "text-amber-400" : "hover:text-white"}`}
                     >Grams</button>
                   </div>
                 </div>

                 <div className="bg-[#0a0f1c] focus-within:bg-[#0f172a] border border-white/5 focus-within:border-amber-500/50 focus-within:shadow-[0_0_20px_rgba(245,158,11,0.1)] rounded-2xl p-6 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-[24px] font-black text-slate-600">{inputMode === "rupees" ? "₹" : ""}</span>
                        <input 
                          type="text" 
                          value={inputValue}
                          onChange={handleInputChange}
                          className="bg-transparent border-none outline-none text-[36px] font-black text-white w-[150px] p-0 placeholder-slate-700 focus:ring-0"
                          placeholder="0"
                        />
                        <span className="text-[24px] font-black text-slate-600">{inputMode === "grams" ? "g" : ""}</span>
                      </div>
                      <div className="text-[16px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl">
                        = {inputMode === "rupees" ? `${converted} g` : `₹${converted}`}
                      </div>
                    </div>
                 </div>

                 {/* Quick Select */}
                 <div className="flex gap-2 pt-2">
                   {quickAmounts.map((amt) => (
                     <button 
                       key={amt}
                       onClick={() => setInputValue(amt)}
                       className="flex-1 bg-white/5 border border-white/10 py-3 rounded-xl text-[14px] font-bold text-slate-300 hover:border-amber-500/50 hover:text-amber-400 hover:bg-amber-500/10 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all"
                     >
                       {inputMode === "rupees" ? `₹${amt}` : `${amt}g`}
                     </button>
                   ))}
                 </div>
               </div>

               {/* CTA */}
               <Button 
                 onClick={() => onNavigate?.('login')}
                 className="w-full h-[64px] rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:via-amber-400 hover:to-orange-400 text-[#050B14] font-black text-[18px] shadow-[0_10px_30px_-10px_rgba(245,158,11,0.6)] border-none hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
               >
                 <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-[-20deg]" />
                 Start Investing Now <ArrowUpRight size={22} strokeWidth={3} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative z-10" />
               </Button>
               
               <p className="text-center text-[10px] font-bold text-slate-500 mt-5 uppercase tracking-[0.2em]">
                 Prices are inclusive of 3% GST
               </p>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
