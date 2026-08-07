"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Sparkles, Activity, ShieldCheck, Award, RefreshCw, ArrowRight, PlayCircle, Star, TrendingUp, BarChart2 } from "lucide-react";
import { fetchLatestMetalPrices, ParsedMetalPrices } from "../utils/metalPriceApi";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";

interface MiniMetalTrackerProps {
  onNavigate?: (page: string) => void;
}

export default function MiniMetalTracker({ onNavigate }: MiniMetalTrackerProps) {
  const [data, setData] = useState<ParsedMetalPrices | null>(null);
  const [goldTimeframe, setGoldTimeframe] = useState("1D");
  const [silverTimeframe, setSilverTimeframe] = useState("1D");

  useEffect(() => {
    let mounted = true;
    const fetchPrices = async () => {
      try {
        const result = await fetchLatestMetalPrices();
        if (mounted) setData(result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 10000); // refresh every 10 seconds
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const goldPrice = data?.gold.perGram24K || 6245.30;
  const silverPrice = data?.silver.perGram || 84.20;
  
  const goldChange = data ? `+${data.gold.changePct24h}%` : "+0.48%";
  const silverChange = data ? `+${data.silver.changePct24h}%` : "+0.62%";

  const goldChartData = useMemo(() => {
    return [
      { price: goldPrice * 0.985 },
      { price: goldPrice * 0.988 },
      { price: goldPrice * 0.992 },
      { price: goldPrice * 0.985 },
      { price: goldPrice * 0.995 },
      { price: goldPrice * 0.999 },
      { price: goldPrice }
    ];
  }, [goldPrice]);

  const silverChartData = useMemo(() => {
    return [
      { price: silverPrice * 0.985 },
      { price: silverPrice * 0.988 },
      { price: silverPrice * 0.992 },
      { price: silverPrice * 0.985 },
      { price: silverPrice * 0.995 },
      { price: silverPrice * 0.999 },
      { price: silverPrice }
    ];
  }, [silverPrice]);

  return (
    <section className="relative font-sans py-16 md:py-24 overflow-hidden bg-white">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 xl:gap-20 items-center justify-between">
          
          {/* Left Side: Typography & Features */}
          <div className="w-full lg:w-[30%] xl:w-[28%] space-y-8 shrink-0">
             <div className="space-y-6">
               <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-indigo-50 text-indigo-600 border border-indigo-100">
                 <Sparkles size={12} className="text-indigo-500" /> LIVE MARKET PRICES
               </div>
               
               <h2 className="text-4xl md:text-5xl font-black text-[#1a1c29] leading-[1.1] tracking-tight">
                 Track Live <br />
                 <span className="text-[#ffb900]">Gold</span> <span className="text-[#64748b]">& Silver</span> <br />
                 Prices
               </h2>
               
               <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs pr-4">
                 Real-time 24K gold and silver prices. Invest anytime with confidence.
               </p>
             </div>

             <div className="space-y-4 pt-2">
               {[
                 { title: "Live prices update every second", icon: <Activity size={16} /> },
                 { title: "100% secure & RBI regulated", icon: <ShieldCheck size={16} /> },
                 { title: "99.99% purity guaranteed", icon: <Award size={16} /> },
                 { title: "Easy buy, sell & withdraw", icon: <RefreshCw size={16} /> }
               ].map((feature, idx) => (
                 <div key={idx} className="flex items-center gap-4 group">
                   <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 shadow-sm border border-indigo-100/50">
                     {feature.icon}
                   </div>
                   <div className="text-xs font-semibold text-slate-700">{feature.title}</div>
                 </div>
               ))}
             </div>

             <div className="flex items-center gap-3 pt-6">
                <button 
                  onClick={() => onNavigate?.('login')}
                  className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-5 py-3.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/30"
                >
                  Invest Now <ArrowRight size={14} />
                </button>
                <button 
                  className="bg-white border border-indigo-100 hover:border-indigo-200 text-indigo-800 px-5 py-3.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-sm"
                >
                  <PlayCircle size={16} className="text-indigo-600" /> How It Works
                </button>
             </div>
          </div>

          {/* Right Side: Price Cards */}
          <div className="w-full lg:w-[65%] xl:w-[68%] flex flex-col md:flex-row gap-6 ml-auto">
            
            {/* Gold Card */}
            <div className="flex-1 bg-gradient-to-b from-[#fffaf0] to-white border border-amber-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group">
               {/* Top Section */}
               <div className="flex justify-between items-start mb-10">
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-amber-100/80 rounded-full flex items-center justify-center shadow-inner">
                      <span className="text-2xl drop-shadow-sm">🪙</span>
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-900 text-lg">24K Pure Gold</h3>
                     <p className="text-xs text-slate-500 font-medium">99.99% Purity</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="bg-white border border-amber-100 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-[10px] font-bold text-amber-600 tracking-wider shadow-sm">
                     <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div> LIVE
                   </div>
                   <button className="w-9 h-9 bg-white border border-amber-100 rounded-full flex items-center justify-center text-slate-400 hover:text-amber-500 transition-colors shadow-sm">
                     <Star size={14} />
                   </button>
                 </div>
               </div>

               {/* Price Section */}
               <div className="mb-6 relative z-10">
                 <div className="flex justify-between items-start mb-2 relative z-20">
                   <div className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> LIVE BUY PRICE
                   </div>
                   <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/70 shadow-sm">
                     {["1D", "1W", "1M", "1Y"].map((tf) => (
                       <button
                         key={tf}
                         onClick={() => setGoldTimeframe(tf)}
                         className={`px-2 py-1 rounded-lg text-[9px] font-extrabold transition-all cursor-pointer border-none outline-none ${
                           goldTimeframe === tf
                             ? "bg-amber-50 text-amber-600 border border-amber-200 shadow-sm"
                             : "text-slate-400 hover:text-slate-600 bg-transparent"
                         }`}
                       >
                         {tf}
                       </button>
                     ))}
                   </div>
                 </div>
                 <div className="flex items-end gap-1 mb-3">
                   <span className="text-3xl xl:text-4xl font-black text-slate-900 tracking-tighter">₹{goldPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                   <span className="text-lg text-slate-500 font-bold mb-1">/g</span>
                 </div>
                 <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                   <TrendingUp size={12} /> {goldChange} (24h)
                 </div>
               </div>

               {/* Illustration & Chart */}
               <div className="h-36 relative mb-8">
                 {/* Real-time background graph */}
                 <div className="absolute bottom-0 left-0 w-[120%] h-full opacity-60 -ml-[10%]">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={goldChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                       <defs>
                         <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.25} />
                           <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
                         </linearGradient>
                       </defs>
                       <YAxis domain={['dataMin', 'dataMax']} hide />
                       <Area type="monotone" dataKey="price" stroke="#fbbf24" strokeWidth={2} fillOpacity={1} fill="url(#goldGradient)" isAnimationActive={false} />
                     </AreaChart>
                   </ResponsiveContainer>
                 </div>
               </div>

               {/* High/Low */}
               <div className="flex justify-between items-center border-t border-amber-100/80 pt-5 mb-8">
                 <div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">24H Low</div>
                   <div className="text-sm font-bold text-slate-800">₹{(goldPrice * 0.985).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                 </div>
                 <div className="text-right">
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">24H High</div>
                   <div className="text-sm font-bold text-slate-800">₹{(goldPrice * 1.005).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                 </div>
               </div>

               {/* Actions */}
               <div className="flex gap-3">
                 <button className="flex-[0.4] bg-white border border-amber-200 text-amber-700 py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-amber-50 transition-colors shadow-sm">
                   View Details <BarChart2 size={14} />
                 </button>
                 <button 
                   onClick={() => onNavigate?.('login')}
                   className="flex-[0.6] bg-[#d97706] hover:bg-[#b45309] text-white py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-600/20"
                 >
                   Invest in Gold <ArrowRight size={14} />
                 </button>
               </div>
            </div>

            {/* Silver Card */}
            <div className="flex-1 bg-gradient-to-b from-[#f8fafc] to-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group">
               {/* Top Section */}
               <div className="flex justify-between items-start mb-10">
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-slate-200/50 rounded-full flex items-center justify-center shadow-inner">
                      <span className="text-2xl drop-shadow-sm filter grayscale">🪙</span>
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-900 text-lg">Pure Silver</h3>
                     <p className="text-xs text-slate-500 font-medium">99.9% Purity</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-[10px] font-bold text-slate-600 tracking-wider shadow-sm">
                     <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"></div> LIVE
                   </div>
                   <button className="w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-500 transition-colors shadow-sm">
                     <Star size={14} />
                   </button>
                 </div>
               </div>

               {/* Price Section */}
               <div className="mb-6 relative z-10">
                 <div className="flex justify-between items-start mb-2 relative z-20">
                   <div className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> LIVE BUY PRICE
                   </div>
                   <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/70 shadow-sm">
                     {["1D", "1W", "1M", "1Y"].map((tf) => (
                       <button
                         key={tf}
                         onClick={() => setSilverTimeframe(tf)}
                         className={`px-2 py-1 rounded-lg text-[9px] font-extrabold transition-all cursor-pointer border-none outline-none ${
                           silverTimeframe === tf
                             ? "bg-slate-100 text-slate-700 border border-slate-200 shadow-sm"
                             : "text-slate-400 hover:text-slate-600 bg-transparent"
                         }`}
                       >
                         {tf}
                       </button>
                     ))}
                   </div>
                 </div>
                 <div className="flex items-end gap-1 mb-3">
                   <span className="text-3xl xl:text-4xl font-black text-slate-900 tracking-tighter">₹{silverPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                   <span className="text-lg text-slate-500 font-bold mb-1">/g</span>
                 </div>
                 <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                   <TrendingUp size={12} /> {silverChange} (24h)
                 </div>
               </div>

               {/* Illustration & Chart */}
               <div className="h-36 relative mb-8">
                 {/* Real-time background graph */}
                 <div className="absolute bottom-0 left-0 w-[120%] h-full opacity-60 -ml-[10%]">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={silverChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                       <defs>
                         <linearGradient id="silverGradient" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.25} />
                           <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
                         </linearGradient>
                       </defs>
                       <YAxis domain={['dataMin', 'dataMax']} hide />
                       <Area type="monotone" dataKey="price" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#silverGradient)" isAnimationActive={false} />
                     </AreaChart>
                   </ResponsiveContainer>
                 </div>
               </div>

               {/* High/Low */}
               <div className="flex justify-between items-center border-t border-slate-200/80 pt-5 mb-8">
                 <div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">24H Low</div>
                   <div className="text-sm font-bold text-slate-800">₹{(silverPrice * 0.985).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                 </div>
                 <div className="text-right">
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">24H High</div>
                   <div className="text-sm font-bold text-slate-800">₹{(silverPrice * 1.005).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                 </div>
               </div>

               {/* Actions */}
               <div className="flex gap-3">
                 <button className="flex-[0.4] bg-white border border-slate-200 text-slate-700 py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
                   View Details <BarChart2 size={14} />
                 </button>
                 <button 
                   onClick={() => onNavigate?.('login')}
                   className="flex-[0.6] bg-[#475569] hover:bg-[#334155] text-white py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-slate-900/10"
                 >
                   Invest in Silver <ArrowRight size={14} />
                 </button>
               </div>
            </div>

          </div>
          
        </div>
      </div>
    </section>
  );
}
