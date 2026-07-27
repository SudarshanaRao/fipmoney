"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet, Zap, Eye, Send, Plus, CreditCard, ChevronRight,
  Shield, CheckCircle2, TrendingUp, ArrowUpRight, ArrowDownRight,
  Smartphone, MonitorPlay, GraduationCap, Gift, Play, Flame, Tv, Wifi, Droplets, Car, FileText, Home, AlertCircle,
  Search, Bell, ChevronDown, Check, Building, RefreshCw, Grid, Award, Download, Clock
} from "lucide-react";
import { Sidebar, MobileNav, Tab } from "./Navigation";
import cardBgGold from "../../assets/card_bg_gold.jpg";
import cardBgSilver from "../../assets/card_bg_silver.jpg";
import SettingsPage from "./SettingsPage";
import DigitalGoldSilver from "./DigitalGoldSilver";
import HistoryPage from "./HistoryPage";
import BillsPage from "./BillsPage";
import PortfolioPage from "./PortfolioPage";

type Metal = "gold" | "silver";

const GOLD = { G: "#d89221", G_LT: "#efb652", G_DK: "#b87312", BG: "#fdf8f0" };
const SILVER = { G: "#7c93a8", G_LT: "#a8bfce", G_DK: "#4d6373", BG: "#f4f7f9" };
const POS = "#10b981"; 

export default function Dashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [tab, setTab] = useState<Tab>("home");
  const [metal, setMetal] = useState<Metal>("gold");
  const [showBalance, setShowBalance] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  
  // Load dynamic logged-in user details
  const loggedInMobile = typeof window !== 'undefined' ? sessionStorage.getItem("fm_logged_in_mobile") || "7013302191" : "7013302191";
  const userName = typeof window !== 'undefined' ? localStorage.getItem(`fm_user_name_${loggedInMobile}`) || (loggedInMobile === "7013302191" ? "Dharsh" : loggedInMobile === "9491841941" ? "Finpages" : loggedInMobile === "7893863597" ? "purna" : "Rahul Kumar") : "Rahul Kumar";
  const kycStatus = typeof window !== 'undefined' ? localStorage.getItem(`fm_user_kyc_${loggedInMobile}`) || (loggedInMobile === "7013302191" ? "full kyc" : loggedInMobile === "9491841941" ? "Min Kyc" : loggedInMobile === "7893863597" ? "pending" : "full kyc") : "full kyc";
  
  const isDemoUser = ["7013302191", "9491841941", "7893863597"].includes(loggedInMobile);
  const goldPrice = 6420.50;
  const silverPrice = 84.20;
  const goldHoldings = typeof window !== 'undefined' ? parseFloat(localStorage.getItem(`fip_gold_holdings_${loggedInMobile}`) || (isDemoUser ? "12.4502" : "0")) : 12.4502;
  const silverHoldings = typeof window !== 'undefined' ? parseFloat(localStorage.getItem(`fip_silver_holdings_${loggedInMobile}`) || (isDemoUser ? "340.2005" : "0")) : 340.2005;
  const cashBalance = isDemoUser ? 5250.00 : 0.00;
  const totalGrams = goldHoldings + silverHoldings;
  const portfolioVal = (goldHoldings * goldPrice) + (silverHoldings * silverPrice) + cashBalance;
  
  const P = metal === "gold" ? GOLD : SILVER;
  const { G, G_LT, G_DK } = P;
  const metalName = metal === "gold" ? "Gold" : "Silver";

  const bbpsServices = [
    { label: "Mobile Prepaid", Icon: Smartphone, color: "#8b5cf6", bg: "#f3e8ff" },
    { label: "Electricity", Icon: Zap, color: "#eab308", bg: "#fef08a" },
    { label: "DTH", Icon: Tv, color: "#f59e0b", bg: "#fef3c7" },
    { label: "Credit Card", Icon: CreditCard, color: "#ef4444", bg: "#fee2e2" },
    { label: "Mobile Postpaid", Icon: FileText, color: "#8b5cf6", bg: "#f3e8ff" },
    { label: "Gas", Icon: Flame, color: "#f97316", bg: "#ffedd5" },
    { label: "Water", Icon: Droplets, color: "#3b82f6", bg: "#dbeafe" },
    { label: "FASTag", Icon: Car, color: "#10b981", bg: "#d1fae5" },
    { label: "Broadband", Icon: Wifi, color: "#06b6d4", bg: "#cffafe" },
    { label: "Rent", Icon: Home, color: "#14b8a6", bg: "#ccfbf1" },
  ];

  const handleBillClick = (label: string) => {
    sessionStorage.setItem("selectedBillLabel", label);
    onNavigate("recharge-details");
  };



  const MainDashboard = () => (
    <div className="flex-1 h-screen overflow-y-auto overflow-x-hidden bg-[#fcfdfd] flex flex-col">
       {/* Top Bar */}
       <div className="h-[72px] border-b border-gray-100 flex items-center justify-between px-6 md:px-8 shrink-0 bg-white sticky top-0 z-20">
         <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search services, transactions..." className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-11 pr-12 text-sm focus:outline-none focus:border-purple-200 transition-colors placeholder:text-gray-400 text-gray-700 font-medium" />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border border-gray-200 text-gray-400 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">⌘K</div>
         </div>
         <div className="flex items-center gap-6 ml-auto">
            <button className="relative bg-white border border-gray-100 w-10 h-10 rounded-full flex items-center justify-center text-gray-500 shadow-sm cursor-pointer outline-none hover:bg-gray-50">
               <Bell size={18} />
               <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center border-2 border-white">3</div>
            </button>
            <div className="flex items-center gap-3 cursor-pointer group">
               <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-gray-100" />
               <div className="flex flex-col hidden sm:flex">
                 <span className="text-[11px] text-gray-500 font-medium">Welcome back,</span>
                 <div className="flex items-center gap-1"><span className="text-sm font-bold text-gray-900 group-hover:text-purple-700 transition-colors">Dharsh</span> <ChevronDown size={14} className="text-gray-400" /></div>
               </div>
            </div>
         </div>
       </div>

       <div className="flex-1 p-6 lg:p-8 flex flex-col lg:flex-row gap-8 pb-24 lg:pb-10 max-w-[1600px] mx-auto w-full">
         
         {/* LEFT COLUMN */}
         <div className="flex-1 space-y-8 min-w-0">
            
            {/* Row 1: 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Vault Balance */}
               <div className="bg-[#f3e8ff] rounded-3xl p-6 border border-purple-100 flex flex-col justify-center relative overflow-hidden shadow-sm">
                 <h3 className="text-xs font-bold text-purple-900 mb-3 flex items-center gap-1.5">Vault Balance</h3>
                 <div className="flex items-center gap-3 mb-1 relative z-10">
                   <h2 className="text-[26px] font-black text-[#2e1065] tracking-tight">{showBalance ? "352.65 g" : "******"}</h2>
                   <button onClick={() => setShowBalance(!showBalance)} className="bg-transparent border-none outline-none cursor-pointer"><Eye size={18} className="text-purple-400 hover:text-purple-600" /></button>
                 </div>
                 <p className="text-xs font-bold text-purple-800/70 relative z-10">≈ ₹25,489.90</p>
                 <div className="absolute right-4 bottom-4 w-[52px] h-[52px] bg-white/40 rounded-2xl flex items-center justify-center text-purple-600 shadow-sm backdrop-blur-sm">
                    <Wallet size={24} />
                 </div>
               </div>
               
               {/* Portfolio Value */}
               <div className="bg-[#fffbeb] rounded-3xl p-6 border border-amber-100 flex flex-col justify-center relative overflow-hidden shadow-sm">
                 <h3 className="text-xs font-bold text-amber-900 mb-3">Portfolio Value</h3>
                 <h2 className="text-[26px] font-black text-[#78350f] mb-1 tracking-tight relative z-10">₹113,831</h2>
                 <p className="text-xs font-bold text-amber-800/70 relative z-10">Total Investments</p>
                 <div className="absolute right-4 bottom-4 w-[52px] h-[52px] bg-white/50 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm backdrop-blur-sm">
                    <TrendingUp size={24} />
                 </div>
               </div>

               {/* KYC Status */}
               <div className="bg-white rounded-3xl p-6 border border-emerald-50 flex flex-col justify-center relative overflow-hidden shadow-sm shadow-emerald-500/5">
                 <h3 className="text-xs font-bold text-emerald-900/60 mb-3">KYC Status</h3>
                 <h2 className="text-[26px] font-black text-gray-900 mb-1 tracking-tight relative z-10">Verified</h2>
                 <p className="text-xs font-bold text-gray-500 relative z-10">Full KYC Completed</p>
                 <div className="absolute right-4 bottom-4 w-[52px] h-[52px] bg-[#10b981] rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                    <Check size={28} strokeWidth={3} />
                 </div>
               </div>
            </div>

            {/* Row 2: Vault & Actions */}
            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-6">
               {/* My Vault */}
               <div className="bg-white rounded-[24px] p-6 lg:p-7 border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col">
                 <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center"><Wallet size={16} /></div>
                    <h3 className="text-lg font-bold text-gray-900">My Vault</h3>
                 </div>
                 
                 <div className="relative z-10 flex-1">
                   <p className="text-xs font-bold text-gray-400 mb-1">Current Balance</p>
                   <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-[28px] font-black text-amber-500 tracking-tight">124.50 g</h2>
                   </div>
                   <p className="text-[13px] font-bold text-gray-400 mb-6">= ₹8,972.35</p>
                   
                   <p className="text-xs font-bold text-gray-400 mb-1">Status: <span className="text-emerald-500">Full KYC •</span></p>
                   <p className="text-xs font-bold text-gray-400 mb-8">Max Capacity: <span className="text-gray-900">1000 g</span></p>
                   
                   <div className="flex gap-4">
                     <button onClick={() => setTab("sip")} className="flex-1 bg-[#6d28d9] text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 border-none outline-none cursor-pointer hover:bg-[#5b21b6] transition-colors"><Plus size={18}/> Buy Gold</button>
                     <button onClick={() => setTab("sip")} className="flex-1 bg-white text-amber-500 border border-amber-300 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 outline-none cursor-pointer hover:bg-amber-50 transition-colors"><Send size={18}/> Sell Gold</button>
                   </div>
                 </div>
                 
                 {/* Decorative Gold graphic on right */}
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-56 h-56 opacity-90 pointer-events-none hidden sm:block">
                   <div className="absolute right-12 top-14 w-28 h-20 bg-gradient-to-br from-[#ffd66b] via-[#eab308] to-[#b45309] rounded-xl transform -rotate-12 shadow-[0_10px_25px_rgba(234,179,8,0.4)] border border-yellow-300" />
                   <div className="absolute right-4 top-24 w-28 h-20 bg-gradient-to-br from-[#fde047] via-[#eab308] to-[#a16207] rounded-xl transform -rotate-12 shadow-[0_10px_25px_rgba(234,179,8,0.4)] border border-yellow-300" />
                   
                   <div className="absolute right-16 bottom-8 w-12 h-12 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-500 rounded-full shadow-lg border border-gray-100" />
                   <div className="absolute right-32 bottom-14 w-14 h-14 bg-gradient-to-br from-gray-100 via-gray-300 to-gray-400 rounded-full shadow-lg border border-gray-100" />
                   <div className="absolute right-6 bottom-20 w-10 h-10 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 rounded-full shadow-md border border-gray-100" />
                 </div>
               </div>

               {/* Quick Actions */}
               <div className="bg-white rounded-[24px] p-6 lg:p-7 border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 mb-8">Quick Actions</h3>
                  <div className="grid grid-cols-3 gap-y-8 gap-x-2 flex-1 items-center">
                     <div className="flex flex-col items-center gap-3 cursor-pointer group">
                       <div className="w-[52px] h-[52px] rounded-[18px] bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:-translate-y-1 transition-transform border border-emerald-100/50 shadow-sm"><Zap size={22} strokeWidth={2.5}/></div>
                       <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900">UPI Pay</span>
                     </div>
                     <div onClick={() => setTab("sip")} className="flex flex-col items-center gap-3 cursor-pointer group">
                       <div className="w-[52px] h-[52px] rounded-[18px] bg-blue-50 text-blue-500 flex items-center justify-center group-hover:-translate-y-1 transition-transform border border-blue-100/50 shadow-sm"><TrendingUp size={22} strokeWidth={2.5}/></div>
                       <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900">Start SIP</span>
                     </div>
                     <div className="flex flex-col items-center gap-3 cursor-pointer group">
                       <div className="w-[52px] h-[52px] rounded-[18px] bg-purple-50 text-purple-600 flex items-center justify-center group-hover:-translate-y-1 transition-transform border border-purple-100/50 shadow-sm"><Building size={22} strokeWidth={2.5}/></div>
                       <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900 text-center leading-tight whitespace-nowrap">Bank Transfer</span>
                     </div>
                     <div className="flex flex-col items-center gap-3 cursor-pointer group">
                       <div className="w-[52px] h-[52px] rounded-[18px] bg-amber-50 text-amber-500 flex items-center justify-center group-hover:-translate-y-1 transition-transform border border-amber-100/50 shadow-sm"><RefreshCw size={22} strokeWidth={2.5}/></div>
                       <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900 text-center leading-tight whitespace-nowrap">Vault Transfer</span>
                     </div>
                     <div onClick={() => setTab("bills")} className="flex flex-col items-center gap-3 cursor-pointer group">
                       <div className="w-[52px] h-[52px] rounded-[18px] bg-blue-50 text-blue-500 flex items-center justify-center group-hover:-translate-y-1 transition-transform border border-blue-100/50 shadow-sm"><FileText size={22} strokeWidth={2.5}/></div>
                       <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900 text-center leading-tight whitespace-pre-line">{"Bills &\nRecharges"}</span>
                     </div>
                     <div className="flex flex-col items-center gap-3 cursor-pointer group">
                       <div className="w-[52px] h-[52px] rounded-[18px] bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:-translate-y-1 transition-transform border border-emerald-100/50 shadow-sm"><Plus size={22} strokeWidth={2.5}/></div>
                       <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900 whitespace-nowrap">Add Money</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Row 3: Bill Payments & Recharges */}
            <div className="bg-white rounded-[24px] p-6 lg:p-7 border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
               <div className="flex justify-between items-center mb-8">
                 <h3 className="text-lg font-bold text-gray-900">Bill Payments & Recharges</h3>
                 <span onClick={() => setTab("bills")} className="text-xs font-bold text-purple-600 hover:text-purple-800 cursor-pointer transition-colors">View All</span>
               </div>
               <div className="grid grid-cols-4 md:grid-cols-8 gap-y-6 gap-x-2">
                  {[
                    { label: "Mobile\nPrepaid", Icon: Smartphone, color: "#8b5cf6" },
                    { label: "Electricity", Icon: Zap, color: "#eab308" },
                    { label: "DTH", Icon: Tv, color: "#8b5cf6" },
                    { label: "Credit Card", Icon: CreditCard, color: "#ef4444" },
                    { label: "Mobile\nPostpaid", Icon: Smartphone, color: "#8b5cf6" },
                    { label: "Gas", Icon: Flame, color: "#f97316" },
                    { label: "Water", Icon: Droplets, color: "#3b82f6" },
                    { label: "More", Icon: Grid, color: "#9ca3af" },
                  ].map((b, i) => (
                    <div key={i} onClick={() => { if(b.label !== "More") handleBillClick(b.label.replace('\n', ' ')); else setTab("bills"); }} className="flex flex-col items-center gap-3 cursor-pointer group">
                       <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center group-hover:-translate-y-1 transition-transform group-hover:shadow-md group-hover:border-purple-100" style={{ color: b.color }}>
                         <b.Icon size={22} strokeWidth={1.5}/>
                       </div>
                       <span className="text-[11px] font-bold text-gray-600 text-center leading-tight whitespace-pre-line group-hover:text-gray-900">{b.label}</span>
                    </div>
                  ))}
               </div>
            </div>
            
            {/* Row 4: Banner */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50/50 rounded-2xl p-6 border border-purple-100/50 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
               <div className="flex-1 relative z-10">
                  <h3 className="text-lg font-bold text-[#312e81] mb-1">Secure. Simple. Smart.</h3>
                  <p className="text-xs text-gray-600 font-medium">All your financial needs in one place.</p>
               </div>
               <div className="flex flex-wrap gap-4 relative z-10 justify-center">
                  <div className="bg-white/80 backdrop-blur py-2.5 px-4 rounded-xl flex items-center gap-3 border border-white shadow-sm">
                    <Shield size={18} className="text-purple-600"/>
                    <div>
                      <div className="text-[10px] font-bold text-gray-900">100% Secure</div>
                      <div className="text-[8px] text-gray-500 font-medium mt-0.5">Bank-level Security</div>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur py-2.5 px-4 rounded-xl flex items-center gap-3 border border-white shadow-sm">
                    <CheckCircle2 size={18} className="text-purple-600"/>
                    <div>
                      <div className="text-[10px] font-bold text-gray-900">Easy to Use</div>
                      <div className="text-[8px] text-gray-500 font-medium mt-0.5">Simple & Intuitive</div>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur py-2.5 px-4 rounded-xl flex items-center gap-3 border border-white shadow-sm">
                    <Clock size={18} className="text-purple-600"/>
                    <div>
                      <div className="text-[10px] font-bold text-gray-900">24/7 Support</div>
                      <div className="text-[8px] text-gray-500 font-medium mt-0.5">We're here for you</div>
                    </div>
                  </div>
               </div>
               
               {/* Decorative Avatar graphic */}
               <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none hidden lg:block">
                  <Smartphone size={120} />
               </div>
            </div>
            
         </div>
         
         {/* RIGHT COLUMN */}
         <div className="w-full lg:w-[320px] xl:w-[350px] shrink-0 space-y-6">
            
            {/* Premium Card Component */}
            <div style={{ perspective: 1000 }}>
              <motion.div 
                className="w-full aspect-[1.586/1] relative cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                 {/* FRONT */}
                 <div className="absolute inset-0 rounded-[24px] p-6 text-white shadow-[0_10px_30px_rgba(30,27,75,0.15)] flex flex-col justify-between overflow-hidden" 
                      style={{ backfaceVisibility: "hidden", background: '#1e1b4b' }}>
                    {/* Pattern overlay */}
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, #4c1d95 2px, transparent 2px)', backgroundSize: '12px 12px' }} />
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/30 blur-3xl rounded-full pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-600/30 blur-3xl rounded-full pointer-events-none" />
                    
                    <div className="relative z-10 flex justify-between items-center">
                       <span className="font-bold text-sm tracking-wide">Fipmoney Premium</span>
                       <div className="flex items-center gap-2">
                         <button 
                           onClick={(e) => { e.stopPropagation(); setShowCardDetails(!showCardDetails); }} 
                           className="bg-white/10 p-1.5 rounded-md text-indigo-200 hover:text-white border border-transparent hover:border-white/20 cursor-pointer backdrop-blur-sm transition-colors outline-none"
                         >
                           <Eye size={14} />
                         </button>
                         <span className="bg-white/10 px-2.5 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm border border-white/10">Virtual Card</span>
                       </div>
                    </div>
                    
                    <div className="relative z-10 mb-2 mt-auto">
                       <div className="w-[42px] h-[30px] rounded-[4px] bg-gradient-to-br from-[#fde047] via-[#eab308] to-[#a16207] mb-5 relative overflow-hidden shadow-sm border border-yellow-300/50">
                          <div className="absolute inset-x-0 h-[1px] top-[40%] bg-yellow-700/40" />
                          <div className="absolute inset-x-0 h-[1px] top-[60%] bg-yellow-700/40" />
                          <div className="absolute inset-y-0 w-[1px] left-[35%] bg-yellow-700/40" />
                          <div className="absolute inset-y-0 w-[1px] left-[65%] bg-yellow-700/40" />
                       </div>
                       <div className="font-mono text-[22px] tracking-[0.15em] mb-1 opacity-90 drop-shadow-md">
                         {showCardDetails ? "4289 7523 9012 8834" : "**** **** **** 8834"}
                       </div>
                    </div>
                    
                    <div className="relative z-10 flex justify-between items-end">
                       <div>
                         <div className="text-[8px] text-indigo-200 uppercase tracking-wider mb-1 font-semibold">Card Holder</div>
                         <div className="text-[13px] font-bold tracking-wide">Dharsh</div>
                       </div>
                       <div className="text-right">
                         <div className="text-[8px] text-indigo-200 uppercase tracking-wider mb-1 font-semibold">Expires</div>
                         <div className="text-[13px] font-bold tracking-wide">08/28</div>
                       </div>
                       <Wifi className="rotate-90 opacity-60 ml-2 mb-1" size={24} />
                    </div>
                 </div>

                 {/* BACK */}
                 <div className="absolute inset-0 rounded-[24px] shadow-[0_10px_30px_rgba(30,27,75,0.15)] flex flex-col text-white overflow-hidden"
                      style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: '#1e1b4b' }}>
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, #4c1d95 2px, transparent 2px)', backgroundSize: '12px 12px' }} />
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/30 blur-3xl rounded-full pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-600/30 blur-3xl rounded-full pointer-events-none" />
                    
                    <div className="w-full h-12 bg-black/85 relative z-10 mt-6 shadow-md" />
                    
                    <div className="px-6 mt-5 relative z-10 flex flex-col gap-1.5">
                      <div className="text-[8px] uppercase tracking-wider opacity-80 text-indigo-200">Authorized Signature</div>
                      <div className="w-full h-10 bg-white/95 flex items-center justify-between px-3 text-black font-mono rounded-sm shadow-inner relative overflow-hidden">
                         <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 1px, transparent 10px)" }} />
                         <span className="relative z-10 font-bold italic text-gray-700 text-[13px] tracking-wide">Dharsh</span>
                         <span className="relative z-10 font-bold bg-amber-500 text-white px-2 py-0.5 rounded shadow-sm text-[12px] font-mono tracking-wider">
                           732
                         </span>
                      </div>
                    </div>
                    
                    <div className="px-6 pb-6 relative z-10 flex justify-between items-end mt-auto">
                      <div className="max-w-[70%]">
                        <p className="text-[7px] opacity-70 leading-relaxed text-indigo-100">
                          This card is issued by Fipmoney strictly for authorized use. It remains the property of Fipmoney. If found, please return to Fipmoney.
                        </p>
                      </div>
                      <div className="flex flex-col items-end opacity-95">
                        <span className="text-xs font-extrabold italic tracking-tight mb-0.5">Fipmoney</span>
                        <span className="text-[8px] font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded border border-white/10">Virtual Card</span>
                      </div>
                    </div>
                 </div>
              </motion.div>
            </div>
            
            {/* Upgrade Card */}
            <div className="rounded-[24px] p-6 text-white relative overflow-hidden shadow-[0_10px_25px_rgba(76,29,149,0.15)]" style={{ background: 'linear-gradient(135deg, #4c1d95, #6d28d9)' }}>
               <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
               <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-purple-900/40 rounded-full blur-xl pointer-events-none" />
               
               <h3 className="text-lg font-bold mb-2 relative z-10 tracking-tight">Upgrade to Premium</h3>
               <p className="text-[11px] text-purple-200 leading-relaxed max-w-[65%] mb-5 relative z-10 font-medium">Unlock exclusive benefits and higher limits.</p>
               <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-[11px] font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer outline-none relative z-10 backdrop-blur-sm shadow-sm hover:shadow-md">Upgrade Now</button>
               
               <div className="absolute right-2 bottom-4 opacity-100 drop-shadow-xl z-0">
                 {/* Visual placeholder for the crown icon */}
                 <div className="relative">
                   <Award size={64} className="text-[#fcd34d]" strokeWidth={1.5} />
                   <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full blur-[2px]" />
                 </div>
               </div>
            </div>
            
            {/* Recent Transactions */}
            <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-6">
               <div className="flex justify-between items-center">
                 <h3 className="text-[15px] font-bold text-gray-900">Recent Transactions</h3>
                 <span onClick={() => setTab("history")} className="text-[11px] font-bold text-purple-600 hover:text-purple-800 cursor-pointer transition-colors">View All</span>
               </div>
               
               <div className="flex flex-col gap-5">
                 {[
                   { title: "Gold Purchase", date: "Today, 10:30 AM", amount: "+ 2.50 g", subAmount: "₹14,250", type: "pos", Icon: Wallet, color: "#eab308", bg: "#fef08a" },
                   { title: "UPI Payment", date: "Today, 09:15 AM", amount: "- ₹1,250", subAmount: "To Ramesh@upi", type: "neg", Icon: Zap, color: "#10b981", bg: "#d1fae5" },
                   { title: "Electricity Bill", date: "Yesterday, 07:45 PM", amount: "- ₹850", subAmount: "Paid", type: "neg", Icon: Zap, color: "#3b82f6", bg: "#dbeafe" },
                   { title: "Added to Vault", date: "Yesterday, 05:30 PM", amount: "+ 5.00 g", subAmount: "₹28,400", type: "pos", Icon: Wallet, color: "#eab308", bg: "#fef08a" },
                 ].map((t, i) => (
                   <div key={i} className="flex items-center gap-3">
                     <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-gray-50/50 shadow-sm" style={{ background: t.bg, color: t.color }}>
                        <t.Icon size={16} strokeWidth={2.5} />
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-bold text-gray-900 truncate">{t.title}</div>
                        <div className="text-[10px] font-medium text-gray-400 truncate">{t.date}</div>
                     </div>
                     <div className="text-right shrink-0 ml-2">
                        <div className={`text-[12px] font-bold ${t.type === 'pos' ? 'text-emerald-500' : 'text-gray-900'}`}>{t.amount}</div>
                        <div className="text-[10px] font-medium text-gray-400">{t.subAmount}</div>
                     </div>
                   </div>
                 ))}
               </div>
               
               <button className="mt-1 text-[11px] font-bold text-[#6d28d9] border border-purple-100 rounded-xl py-3 w-full hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 cursor-pointer bg-transparent outline-none">
                  <Download size={14} strokeWidth={2.5} /> Download Statement
               </button>
            </div>
            
         </div>

       </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#fcfdfd] font-sans overflow-hidden text-gray-800">
      <Sidebar activeTab={tab} onTabChange={setTab} onLogout={() => {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem("fm_logged_in_mobile");
          sessionStorage.removeItem("fm_logged_in_name");
        }
        onNavigate("home");
      }} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {tab === "home" ? (
          <MainDashboard />
        ) : tab === "portfolio" ? (
          <PortfolioPage onNavigate={(target) => setTab(target as Tab)} />
        ) : tab === "bills" ? (
          <BillsPage onNavigate={onNavigate} />
        ) : tab === "settings" ? (
          <SettingsPage />
        ) : tab === "sip" ? (
          <DigitalGoldSilver onNavigate={(target) => setTab(target as Tab)} kycStatus={kycStatus} />
        ) : tab === "history" ? (
          <HistoryPage />
        ) : (
          <MainDashboard />
        )}
      </div>
      <MobileNav activeTab={tab} onTabChange={setTab} />
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
