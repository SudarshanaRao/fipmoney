"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet, Zap, Eye, Send, Plus, CreditCard, ChevronRight,
  Shield, CheckCircle2, TrendingUp, ArrowUpRight, ArrowDownRight,
  Smartphone, MonitorPlay, GraduationCap, Gift, Play, Flame, Tv, Wifi, Droplets, Car, FileText, Home, AlertCircle
} from "lucide-react";
import { Sidebar, MobileNav, Tab } from "./Navigation";
import cardBgGold from "../../assets/card_bg_gold.jpg";
import cardBgSilver from "../../assets/card_bg_silver.jpg";
import SettingsPage from "./SettingsPage";
import DigitalGoldSilver from "./DigitalGoldSilver";

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

  const AllBillsContent = () => {
    const billSections = [
      {
        title: "Recharge",
        items: [
          { label: "Mobile Prepaid", Icon: Smartphone, color: "#8b5cf6", bg: "#f3e8ff" },
          { label: "FASTag", Icon: Car, color: "#10b981", bg: "#d1fae5" },
          { label: "DTH", Icon: Tv, color: "#f59e0b", bg: "#fef3c7" },
          { label: "Cable TV", Icon: MonitorPlay, color: "#ec4899", bg: "#fce7f3" },
        ]
      },
      {
        title: "Utilities",
        items: [
          { label: "Gas", Icon: Flame, color: "#ef4444", bg: "#fee2e2" },
          { label: "Water", Icon: Droplets, color: "#3b82f6", bg: "#dbeafe" },
          { label: "Electricity", Icon: Zap, color: "#eab308", bg: "#fef08a" },
          { label: "Mobile Postpaid", Icon: FileText, color: "#8b5cf6", bg: "#f3e8ff" },
          { label: "Broadband", Icon: Wifi, color: "#06b6d4", bg: "#cffafe" },
          { label: "Tuition Fees", Icon: GraduationCap, color: "#6366f1", bg: "#e0e7ff" },
          { label: "Education Fees", Icon: GraduationCap, color: "#6366f1", bg: "#e0e7ff" },
          { label: "Rent", Icon: Home, color: "#14b8a6", bg: "#ccfbf1" },
        ]
      },
      {
        title: "Purchases",
        items: [
          { label: "Brand Vouchers", Icon: Gift, color: "#d946ef", bg: "#fae8ff" },
          { label: "Google Play", Icon: Play, color: "#10b981", bg: "#d1fae5" },
          { label: "Subscriptions", Icon: MonitorPlay, color: "#3b82f6", bg: "#dbeafe" },
        ]
      }
    ];

    return (
      <div className="flex-1 h-screen overflow-y-auto bg-white sm:bg-[#fcfdfd]">
        <div className="p-6 md:p-8 lg:p-10 max-w-6xl mx-auto space-y-8 pb-24 lg:pb-10">
          <div className="flex flex-col mb-4">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Recharge & Bill Pay</h1>
            <p className="text-xs text-gray-400 font-semibold mt-1">Manage all your bills under one roof</p>
          </div>
          
          {billSections.map((section, idx) => (
            <div key={idx} className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-50 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <h3 className="text-sm font-extrabold text-gray-800 mb-6">{section.title}</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 gap-y-8">
                {section.items.map((item, i) => (
                  <div key={i} onClick={() => handleBillClick(item.label)} className="flex flex-col items-center cursor-pointer group">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 shadow-sm border border-gray-50"
                      style={{ background: item.bg, color: item.color }}>
                      <item.Icon size={24} strokeWidth={2} />
                    </div>
                    <span className="text-[10px] md:text-[11px] font-bold text-gray-500 mt-3 text-center leading-tight max-w-[85px] group-hover:text-gray-900 transition-colors">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const MainDashboard = () => (
    <div className="flex-1 h-screen overflow-y-auto bg-[#fcfdfd]">
      <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-6 pb-24 lg:pb-10">
        
        {/* ROW 1: Balances, KYC, Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-50 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-center relative overflow-hidden">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Vault Balance</h3>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold text-gray-900">{showBalance ? "124.50 g" : "******"}</h2>
              <button onClick={() => setShowBalance(!showBalance)} className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer outline-none"><Eye size={16} /></button>
            </div>
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-gray-50 rounded-tl-full -mr-4 -mb-4 opacity-50 pointer-events-none" />
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-gray-50 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-center relative overflow-hidden">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Portfolio Value</h3>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold text-gray-900">{showBalance ? "₹8,45,200" : "******"}</h2>
              <button onClick={() => setShowBalance(!showBalance)} className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer outline-none"><Eye size={16} /></button>
            </div>
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-gray-50 rounded-tl-full -mr-4 -mb-4 opacity-50 pointer-events-none" />
          </div>

          {kycStatus.toLowerCase() === "pending" ? (
            <div 
              onClick={() => setTab("settings")}
              className="bg-red-50 rounded-3xl p-5 border border-red-100 shadow-sm flex items-start gap-3 cursor-pointer hover:bg-red-100/50 transition-colors"
            >
              <AlertCircle size={20} color="#dc2626" className="shrink-0 mt-0.5 animate-pulse" />
              <div className="flex-1">
                <p className="text-sm font-bold text-red-800 leading-relaxed">Identity KYC Pending</p>
                <p className="text-xs font-semibold text-red-700 leading-relaxed mt-0.5">Please link your Aadhaar and PAN under profile settings to activate vault transactions.</p>
              </div>
            </div>
          ) : kycStatus.toLowerCase().includes("full") ? (
            <div className="bg-[#ecfdf5] rounded-3xl p-5 border border-[#d1fae5] shadow-sm flex items-start gap-3">
              <CheckCircle2 size={20} color={POS} className="shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-[#065f46] leading-relaxed">You are successfully done with Full KYC. Now you can avail all premium services.</p>
            </div>
          ) : (
            <div 
              onClick={() => setTab("settings")}
              className="bg-[#fffbeb] rounded-3xl p-5 border border-[#fef3c7] shadow-sm flex items-start gap-3 cursor-pointer hover:bg-[#fff9db] transition-colors"
            >
              <AlertCircle size={20} color="#d97706" className="shrink-0 mt-0.5 animate-pulse" />
              <div className="flex-1">
                <p className="text-sm font-bold text-[#92400e] leading-relaxed">Minimum KYC Completed</p>
                <p className="text-xs font-semibold text-[#b45309] leading-relaxed mt-0.5">Please complete Video KYC under settings to unlock full benefits and unlimited limits.</p>
              </div>
            </div>
          )}

          <div 
            onClick={() => setTab("settings")}
            className="rounded-3xl p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-center cursor-pointer hover:scale-[1.02] active:scale-95 transition-all group"
            style={{ background: `linear-gradient(135deg, ${G_DK}, ${G_LT})` }}
          >
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-[11px] font-semibold text-white/80 uppercase tracking-wider mb-1">Welcome Back</p>
                <h3 className="text-lg font-bold">{userName}</h3>
                <p className="text-xs font-medium text-white/90 mt-2 flex items-center gap-1.5"><Shield size={12} /> {userName.toLowerCase().replace(/\s+/g, "")}@fipmoney</p>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: My Vault, Fipmoney Card, Services */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-4 bg-white rounded-[2rem] p-8 border border-gray-50 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center"><Wallet size={20} /></div>
              <h2 className="text-lg font-extrabold text-gray-900">My Vault</h2>
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-400 mb-1">Current Balance</p>
              <div className="flex items-center gap-3 mb-6">
                <h1 className="text-3xl font-black text-gray-900" style={{ color: G_DK }}>{showBalance ? "124.50 g" : "******"}</h1>
                <button onClick={() => setShowBalance(!showBalance)} className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer outline-none"><Eye size={18} /></button>
              </div>
              <p className="text-xs font-bold text-gray-500 mb-1">Status: <span className={kycStatus.toLowerCase().includes("full") ? "text-emerald-500" : "text-amber-500"}>{kycStatus.toLowerCase().includes("full") ? "Full KYC" : "Min KYC"}</span></p>
              <p className="text-xs font-bold text-gray-500">Max Capacity: <span className="text-gray-800">1000 g</span></p>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setTab("sip")}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold text-sm shadow-sm hover:-translate-y-0.5 transition-all outline-none border-none cursor-pointer"
                style={{ background: POS }}
              >
                <Plus size={16} strokeWidth={3} /> Buy Gold
              </button>
              <button 
                onClick={() => setTab("sip")}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold text-sm shadow-sm hover:-translate-y-0.5 transition-all outline-none border-none cursor-pointer"
                style={{ background: `linear-gradient(135deg, ${G_DK}, ${G_LT})` }}
              >
                <Send size={16} strokeWidth={2} /> Sell Gold
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-5 bg-white rounded-[2rem] p-6 md:p-8 border border-gray-50 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-center" style={{ perspective: 1000 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-3">
                 <CreditCard size={20} className="text-gray-400" /> Premium Card
              </h2>
              <button onClick={() => setShowCardDetails(!showCardDetails)} className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer outline-none">
                <Eye size={18} />
              </button>
            </div>
            
            <motion.div 
              className="w-full aspect-[1.586/1] relative cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* FRONT OF CARD */}
              <div className="absolute inset-0 rounded-2xl p-6 md:p-8 flex flex-col justify-between text-white shadow-xl overflow-hidden"
                style={{ backfaceVisibility: "hidden", background: `linear-gradient(135deg, ${G_DK} 0%, ${G} 50%, ${G_LT} 100%)` }}>
                
                {/* Background Image Design with light opacity */}
                <img 
                  src={metal === "gold" ? cardBgGold : cardBgSilver} 
                  alt="Pattern Design" 
                  className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none mix-blend-overlay"
                />
                
                {/* Decorative background blur */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-10 w-48 h-48 bg-black/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold italic mb-3 opacity-90">Fipmoney</span>
                    {/* Chip Design */}
                    <div className="w-12 h-9 rounded bg-[#eab308] flex items-center justify-center opacity-95 border border-yellow-300 relative overflow-hidden shadow-sm">
                       <div className="absolute w-full h-px bg-yellow-600/40 top-1/2" />
                       <div className="absolute h-full w-px bg-yellow-600/40 left-1/2" />
                       <div className="absolute w-6 h-5 border border-yellow-600/40 rounded-[2px]" />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                     <span className="text-2xl font-black italic opacity-95 tracking-tight">VISA</span>
                     <Wifi size={20} className="rotate-90 opacity-80 mt-1" />
                  </div>
                </div>
                
                <div className="relative z-10 mt-auto">
                  <div className="text-xl md:text-2xl font-mono font-medium tracking-[0.15em] mb-4 drop-shadow-sm">
                    {showCardDetails ? "4289 7523 9012 8834" : "**** **** **** 8834"}
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider opacity-80 mb-0.5">Card Holder name</div>
                      <div className="text-sm font-bold tracking-wide">{userName.toUpperCase()}</div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider opacity-80 mb-0.5">Expiry Date</div>
                      <div className="text-sm font-bold tracking-wide">02/30</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BACK OF CARD */}
              <div className="absolute inset-0 rounded-2xl shadow-xl overflow-hidden flex flex-col text-white"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: `linear-gradient(135deg, ${G_DK} 0%, ${G} 50%, ${G_LT} 100%)` }}>
                
                {/* Background Image Design with light opacity */}
                <img 
                  src={metal === "gold" ? cardBgGold : cardBgSilver} 
                  alt="Pattern Design" 
                  className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none mix-blend-overlay"
                />
                
                {/* Decorative background blur */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-10 w-48 h-48 bg-black/10 rounded-full blur-2xl pointer-events-none" />
                
                {/* Magnetic Strip */}
                <div className="w-full h-10 bg-black/85 relative z-10 mt-6" />
                
                {/* Signature & CVV Area */}
                <div className="px-6 md:px-8 mt-4 relative z-10 flex flex-col gap-1">
                  <div className="text-[8px] uppercase tracking-wider opacity-80">Authorized Signature</div>
                  <div className="w-full h-10 bg-white/95 flex items-center justify-between px-4 text-black font-mono rounded-sm shadow-inner relative overflow-hidden">
                     {/* Signature Pattern */}
                     <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 1px, transparent 10px)" }} />
                     <span className="relative z-10 font-bold italic text-gray-700 text-sm tracking-wide">{userName}</span>
                     <span className="relative z-10 font-bold bg-amber-500 text-white px-2 py-0.5 rounded shadow-sm text-sm font-mono tracking-wider">
                       732
                     </span>
                  </div>
                </div>
                
                {/* Info Text & Network Logo */}
                <div className="px-6 md:px-8 pb-6 md:pb-8 relative z-10 flex justify-between items-end mt-auto">
                  <div className="max-w-[70%]">
                    <p className="text-[7px] opacity-80 leading-normal">
                      This card is issued by Fipmoney strictly for authorized use. It remains the property of Fipmoney. If found, please return to Fipmoney.
                    </p>
                  </div>
                  <div className="flex flex-col items-end opacity-95">
                    <span className="text-xs font-extrabold italic tracking-tight mb-0.5">Fipmoney</span>
                    <span className="text-sm font-black italic tracking-tighter">VISA</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-[2rem] p-8 border border-gray-50 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="flex gap-6 border-b border-gray-100 pb-4 mb-6">
               <button className="text-sm font-extrabold text-gray-900 border-b-2 border-gray-900 pb-1 bg-transparent cursor-pointer outline-none">Quick Services</button>
               <button className="text-sm font-bold text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer outline-none">Transactions</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "UPI Pay", Icon: Zap, color: "#10b981", bg: "#d1fae5" },
                { title: "Start SIP", Icon: TrendingUp, color: "#3b82f6", bg: "#dbeafe" },
                { title: "Bank Tx", Icon: ArrowUpRight, color: "#8b5cf6", bg: "#f3e8ff" },
                { title: "Vault Tx", Icon: Shield, color: G_DK, bg: GOLD.BG },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-all group">
                   <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110" style={{ background: s.bg, color: s.color }}>
                     <s.Icon size={18} strokeWidth={2.5} />
                   </div>
                   <span className="text-[11px] font-bold text-gray-700 text-center">{s.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 3: BBPS Services (Horizontal Scroll) */}
        <div className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${G_DK}, ${G_LT})` }}>
                <Zap size={16} strokeWidth={3} />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900">BBPS Services</h2>
            </div>
            <button onClick={() => setTab("bills")} className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-transparent border-none cursor-pointer outline-none flex items-center gap-1">
              View All <ChevronRight size={14} />
            </button>
          </div>
          
          <div className="w-full overflow-x-auto pb-6 hide-scrollbar flex gap-4 md:gap-8">
            {bbpsServices.map((item, i) => (
              <div key={i} onClick={() => handleBillClick(item.label)} className="flex flex-col items-center cursor-pointer group min-w-[90px] shrink-0">
                <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 shadow-sm border border-gray-50 bg-white group-hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: item.bg, color: item.color }}>
                     <item.Icon size={24} strokeWidth={2} />
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-500 mt-4 text-center leading-tight group-hover:text-gray-900 transition-colors whitespace-nowrap">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#fcfdfd] font-sans overflow-hidden text-gray-800">
      <Sidebar activeTab={tab} onTabChange={setTab} onLogout={() => onNavigate("home")} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {tab === "home" ? (
          <MainDashboard />
        ) : tab === "bills" ? (
          <AllBillsContent />
        ) : tab === "settings" ? (
          <SettingsPage />
        ) : tab === "sip" ? (
          <DigitalGoldSilver onNavigate={(target) => setTab(target as Tab)} kycStatus={kycStatus} />
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
