"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Lock, Activity, Tag, IndianRupee, ArrowDownUp, TrendingUp, ChevronRight } from "lucide-react";

interface MiniMetalTrackerProps {
  onNavigate?: (page: string) => void;
}

export default function MiniMetalTracker({ onNavigate }: MiniMetalTrackerProps) {
  const [activeTab, setActiveTab] = useState<"gold" | "silver">("gold");
  const [inputMode, setInputMode] = useState<"rupees" | "grams">("rupees");
  const [inputValue, setInputValue] = useState<string>("2500");

  const goldPrice = 6420.50; // Updated to realistic price from earlier logic
  const silverPrice = 84.20;

  const currentPrice = activeTab === "gold" ? goldPrice : silverPrice;
  const quickAmounts = inputMode === "rupees" ? ["1000", "2500", "5000", "10000"] : ["1", "5", "10", "50"];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev === "gold" ? "silver" : "gold"));
    }, 6000);
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

  // Dynamic Theme Colors
  const accentGradient = isGold ? "from-amber-400 to-yellow-600" : "from-slate-400 to-slate-600";
  const bgAccent = isGold ? "bg-amber-50" : "bg-slate-50";
  const textAccent = isGold ? "text-amber-600" : "text-slate-600";
  const borderAccent = isGold ? "border-amber-200" : "border-slate-200";

  return (
    <section className="relative font-sans py-24 md:py-32 overflow-hidden bg-[#fafbfc]">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className={`absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 transition-colors duration-1000 ease-in-out ${isGold ? 'bg-amber-100' : 'bg-slate-200'}`}></div>
        <div className={`absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full mix-blend-multiply filter blur-[100px] opacity-40 transition-colors duration-1000 ease-in-out ${isGold ? 'bg-yellow-50' : 'bg-gray-200'}`}></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-center justify-between">
          
          {/* Left Side: Editorial Typography & Features */}
          <div className="w-full lg:w-[55%] space-y-10">
             
             <div className="space-y-6">
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase ${bgAccent} ${textAccent} ${borderAccent} border shadow-sm transition-colors duration-500`}
               >
                 <Lock size={14} /> Bank-Grade Security
               </motion.div>
               
               <motion.h1 
                 initial={{ opacity: 0, y: 10 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.1 }}
                 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight"
               >
                 Build wealth <br className="hidden md:block" />
                 with pure <br className="md:hidden" />
                 <span className={`text-transparent bg-clip-text bg-gradient-to-r transition-all duration-700 ease-in-out ${accentGradient}`}>
                   {isGold ? "Gold" : "Silver"}
                 </span>.
               </motion.h1>
               
               <motion.p 
                 initial={{ opacity: 0, y: 10 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.2 }}
                 className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-md"
               >
                 Start your digital {isGold ? "gold" : "silver"} journey today. Buy, sell, and track live market rates instantly with zero making charges.
               </motion.p>
             </div>

             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3 }}
               className="grid grid-cols-2 gap-x-8 gap-y-10 pt-4"
             >
               {[
                 { title: "Zero Markup", desc: "Buy at live market price", icon: <Tag size={20} /> },
                 { title: `${isGold ? '24K' : '99.9%'} Purity`, desc: "Certified by trusted partners", icon: <ShieldCheck size={20} /> },
                 { title: "Live Rates", desc: "Prices update every second", icon: <Activity size={20} /> },
                 { title: "Instant Sell", desc: "Withdraw to your bank anytime", icon: <IndianRupee size={20} /> }
               ].map((feature, idx) => (
                 <div key={idx} className="flex flex-col gap-3 group">
                   <div className={`w-12 h-12 rounded-2xl ${bgAccent} ${textAccent} flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:shadow-md`}>
                     {feature.icon}
                   </div>
                   <div>
                     <div className="text-base font-bold text-slate-900 mb-1">{feature.title}</div>
                     <div className="text-sm text-slate-500 font-medium leading-snug">{feature.desc}</div>
                   </div>
                 </div>
               ))}
             </motion.div>
          </div>

          {/* Right Side: Pro Trading Widget */}
          <div className="w-full lg:w-[45%] xl:w-[42%] shrink-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100/60 relative overflow-hidden"
            >
               {/* Internal Glow */}
               <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${isGold ? 'from-amber-100/40' : 'from-slate-100/50'} to-transparent rounded-full filter blur-3xl opacity-60 pointer-events-none transition-colors duration-700`}></div>
               
               {/* Pro Segmented Control */}
               <div className="relative flex p-1.5 bg-slate-100/80 backdrop-blur-sm rounded-2xl mb-10 border border-slate-200/50 z-10">
                 <button 
                   onClick={() => setActiveTab("gold")}
                   className={`relative flex-1 py-3 text-sm font-bold rounded-xl transition-all z-10 ${isGold ? 'text-amber-900' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   Digital Gold
                 </button>
                 <button 
                   onClick={() => setActiveTab("silver")}
                   className={`relative flex-1 py-3 text-sm font-bold rounded-xl transition-all z-10 ${!isGold ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   Digital Silver
                 </button>
                 
                 {/* Sliding Background */}
                 <motion.div
                   className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl shadow-sm border bg-white ${isGold ? 'left-1.5 border-amber-200/60' : 'left-[calc(50%+1.5px)] border-slate-200/60'}`}
                   layout
                   transition={{ type: "spring", stiffness: 300, damping: 30 }}
                 />
               </div>

               {/* Live Price Header */}
               <div className="mb-10 flex flex-col items-center relative z-10">
                 <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                   <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                   </span>
                   Live Buy Price
                 </div>
                 
                 <div className="flex items-start justify-center gap-1">
                   <span className="text-3xl font-medium text-slate-300 mt-2">₹</span>
                   <AnimatePresence mode="popLayout">
                     <motion.div 
                       key={currentPrice}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -20 }}
                       transition={{ duration: 0.3 }}
                       className="text-6xl font-black text-slate-800 tracking-tighter"
                     >
                       {currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                     </motion.div>
                   </AnimatePresence>
                   <span className="text-xl text-slate-400 font-bold self-end mb-2">/g</span>
                 </div>
                 
                 <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 mt-3 bg-emerald-50/80 px-3 py-1 rounded-lg border border-emerald-100">
                   <TrendingUp size={14} /> +0.48% (24h)
                 </div>
               </div>

               {/* Pro Exchange Input */}
               <div className="relative z-10 mb-8">
                 <div className="bg-slate-50 border border-slate-200/80 rounded-[1.5rem] overflow-hidden focus-within:border-slate-300 focus-within:shadow-[0_0_0_4px_rgba(241,245,249,1)] transition-all">
                    
                    {/* Top Input Area */}
                    <div className="p-5 bg-white relative">
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">You Pay</span>
                         <button 
                           onClick={toggleInputMode} 
                           className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 outline-none border-none cursor-pointer"
                         >
                           Switch to {inputMode === 'rupees' ? 'Grams' : 'INR'} <ArrowDownUp size={12} />
                         </button>
                       </div>
                       
                       <div className="flex items-center gap-2">
                         <span className="text-4xl font-medium text-slate-300 select-none">{inputMode === 'rupees' ? '₹' : ''}</span>
                         <input 
                           type="text" 
                           value={inputValue}
                           onChange={handleInputChange}
                           className="w-full bg-transparent border-none outline-none text-4xl md:text-5xl font-black text-slate-800 p-0 focus:ring-0 placeholder-slate-200 tracking-tight"
                           placeholder="0"
                         />
                         <span className="text-4xl font-medium text-slate-300 select-none">{inputMode === 'grams' ? 'g' : ''}</span>
                       </div>
                    </div>
                    
                    {/* Divider */}
                    <div className="h-px w-full bg-slate-200/80 relative">
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400">
                         <ArrowDownUp size={14} />
                       </div>
                    </div>
                    
                    {/* Bottom Output Area */}
                    <div className="p-5 bg-slate-50/50 flex justify-between items-center">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">You Receive</span>
                       <span className="text-xl font-black text-slate-800">
                          {inputMode === "rupees" ? `${converted} g` : `₹${converted}`}
                       </span>
                    </div>
                 </div>

                 {/* Quick Select Chips */}
                 <div className="flex gap-2 mt-4">
                   {quickAmounts.map((amt) => (
                     <button 
                       key={amt}
                       onClick={() => setInputValue(amt)}
                       className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border outline-none cursor-pointer ${
                         inputValue === amt 
                          ? `border-slate-800 bg-slate-800 text-white shadow-md`
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                       }`}
                     >
                       {inputMode === "rupees" ? `₹${amt}` : `${amt}g`}
                     </button>
                   ))}
                 </div>
               </div>

               {/* CTA */}
               <motion.button 
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={() => onNavigate?.('login')}
                 className={`w-full h-14 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 text-white relative z-10 border-none outline-none cursor-pointer shadow-xl ${isGold ? 'bg-gradient-to-r from-amber-500 to-yellow-500 shadow-amber-500/25 hover:shadow-amber-500/40' : 'bg-gradient-to-r from-slate-800 to-slate-900 shadow-slate-900/25 hover:shadow-slate-900/40'}`}
               >
                 Invest in {isGold ? 'Gold' : 'Silver'} <ChevronRight size={20} />
               </motion.button>
               
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
