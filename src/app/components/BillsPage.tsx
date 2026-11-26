"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone, Car, Tv, MonitorPlay, Flame, Droplets, Zap,
  FileText, Wifi, GraduationCap, Home, Play,
  Shield, CheckCircle2, CreditCard, Clock, AlertCircle, ChevronRight,
  Star, Bell, Receipt, Users, Banknote, Sparkles, X, Check, Landmark
} from "lucide-react";
import { API_BASE_URL } from "../utils/apiConfig";
import FipmoneySignature from "./ui/FipmoneySignature";

interface BillsPageProps {
  onNavigate: (page: string) => void;
}

interface ServiceItem {
  label: string;
  Icon: any;
  color: string;
  bg: string;
  category: "recharge" | "utilities" | "financial" | "entertainment" | "other";
}

const services: ServiceItem[] = [
  { label: "Mobile Prepaid", Icon: Smartphone, color: "#047857", bg: "#ecfdf5", category: "recharge" },
  { label: "Electricity", Icon: Zap, color: "#d97706", bg: "#fef3c7", category: "utilities" },
  { label: "DTH", Icon: Tv, color: "#059669", bg: "#ecfdf5", category: "recharge" },
  { label: "FASTag", Icon: Car, color: "#10b981", bg: "#d1fae5", category: "recharge" },
  { label: "Broadband", Icon: Wifi, color: "#0d9488", bg: "#ccfbf1", category: "utilities" },
  { label: "Credit Card", Icon: CreditCard, color: "#dc2626", bg: "#fee2e2", category: "financial" },
  { label: "Gas Cylinder", Icon: Flame, color: "#ea580c", bg: "#ffedd5", category: "utilities" },
  { label: "Piped Gas", Icon: Flame, color: "#f97316", bg: "#fff7ed", category: "utilities" },
  { label: "Water", Icon: Droplets, color: "#0284c7", bg: "#e0f2fe", category: "utilities" },
  { label: "Mobile Postpaid", Icon: Smartphone, color: "#047857", bg: "#ecfdf5", category: "recharge" },
  { label: "Landline", Icon: FileText, color: "#047857", bg: "#ecfdf5", category: "utilities" },
  { label: "House Rent", Icon: Home, color: "#059669", bg: "#d1fae5", category: "financial" },
  { label: "Education Fees", Icon: GraduationCap, color: "#4f46e5", bg: "#e0e7ff", category: "other" },
  { label: "Insurance Premium", Icon: Shield, color: "#0891b2", bg: "#cffafe", category: "financial" },
  { label: "Google Play", Icon: Play, color: "#10b981", bg: "#d1fae5", category: "entertainment" },
  { label: "Cable TV", Icon: MonitorPlay, color: "#059669", bg: "#ecfdf5", category: "entertainment" },
  { label: "Subscriptions", Icon: Sparkles, color: "#7c3aed", bg: "#ede9fe", category: "entertainment" },
  { label: "Municipal Taxes", Icon: Landmark, color: "#475569", bg: "#f1f5f9", category: "other" }
];

export default function BillsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const handleBillClick = (label: string) => {
    sessionStorage.setItem("selectedBillLabel", label);
    onNavigate("recharge-details");
  };

  // Dynamic state for due bills
  const [dueBills, setDueBills] = useState<any[]>([]);
  const [isLoadingDues, setIsLoadingDues] = useState(true);

  React.useEffect(() => {
    const fetchDues = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/pending-dues`);
        const result = await response.json();
        if (result.success && result.data) {
          setDueBills(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch pending dues:", err);
      } finally {
        setIsLoadingDues(false);
      }
    };
    fetchDues();
  }, []);

  const promoCards = [
    { 
      title: "Refer & Earn 24K Gold", 
      desc: "Invite friends to pay bills on Fipmoney and receive digital gold rewards in your vault.", 
      icon: Users, 
      gradient: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%)", 
      action: "Refer Now",
      target: "refer-and-earn"
    },
    { 
      title: "0% Convenience Fee", 
      desc: "Enjoy zero platform charges and instant Bharat BillPay receipt generation.", 
      icon: Banknote, 
      gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)", 
      action: "Explore Perks",
      target: null
    },
    { 
      title: "Bank-Grade BBPS Security", 
      desc: "All transactions are encrypted with 256-bit bank grade security protocols.", 
      icon: Shield, 
      gradient: "linear-gradient(135deg, #134e4a 0%, #047857 50%, #059669 100%)", 
      action: "Learn More",
      target: null
    }
  ];

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#f8fafc] pb-32 text-slate-900 font-sans relative selection:bg-[#047857] selection:text-white">
      
      {/* Decorative Brand Ambient Mesh */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-96 left-0 w-80 h-80 bg-[#047857]/6 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-7 relative z-10">
        
        {/* ── RECHARGES & BILLS SECTION (No outer container) ── */}
        <div className="space-y-4 sm:space-y-5">
          {/* Main Page Title Section */}
          <div className="space-y-1.5 px-1">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-[#047857] text-[10.5px] font-black uppercase tracking-wider">
              <Zap size={12} className="fill-[#047857]" />
              <span>Bharat BillPay (BBPS) Certified</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Recharges <span className="text-[#047857]">& Bills</span>
            </h1>
          </div>

          {/* Grid of Services (Clean icon grid without separate card containers) */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-6 gap-y-5 gap-x-2 sm:gap-x-4 pt-1">
            {services.map((item, i) => (
              <motion.div 
                key={item.label}
                onClick={() => handleBillClick(item.label)} 
                className="relative flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group active:scale-95 select-none py-1 px-0.5"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.015, 0.15), duration: 0.25 }}
              >
                {/* Squircle Icon Container */}
                <div 
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl sm:rounded-3xl flex items-center justify-center transition-all duration-200 mb-2 group-hover:scale-110 shadow-xs border border-white/80"
                  style={{ background: item.bg, color: item.color }}
                >
                  <item.Icon size={24} strokeWidth={2.2} />
                </div>
                
                <span className="text-[11.5px] sm:text-xs font-bold text-slate-700 leading-tight transition-colors group-hover:text-[#047857] line-clamp-2 max-w-[85px]">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── 2. SAVED & DUE BILLS SHOWCASE (Pending Due Alerts) ── */}
        <motion.div 
          className="space-y-3.5"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#047857]" />
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-500">
                Pending Due Alerts
              </h2>
            </div>
            <span className="text-[10px] font-black uppercase text-[#047857] bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
              {dueBills.length > 0 ? `${dueBills.length} Bills Due` : "Active Auto-Reminders"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {isLoadingDues ? (
              <div className="col-span-1 md:col-span-3 flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#047857] border-t-transparent" />
              </div>
            ) : dueBills.length > 0 ? (
              dueBills.map((bill, i) => {
                const BillIcon = bill.icon || Zap;
                return (
                  <motion.div 
                    key={i} 
                    className="rounded-3xl p-5 shadow-sm flex flex-col justify-between min-h-[190px] relative overflow-hidden group border border-white/10 text-white"
                    style={{ background: bill.gradient || "linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)" }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  >
                    {/* Due Date Tag on Top-Right */}
                    <div className="absolute right-4 top-4 flex items-center gap-1.5 bg-white/95 text-slate-900 py-1 px-3 rounded-full shadow-xs">
                      <span className={`w-2 h-2 rounded-full ${bill.expired ? "bg-rose-500 animate-pulse" : "bg-amber-500"}`} />
                      <span className={`text-[9px] font-black uppercase tracking-wider ${bill.expired ? "text-rose-600" : "text-amber-700"}`}>
                        {bill.expired ? "Expired" : `Due in ${bill.dueIn}`}
                      </span>
                    </div>
                    
                    <div className="space-y-1 relative z-10 pt-2">
                      <div className="flex items-center gap-1.5 opacity-90 text-[10px] font-black uppercase tracking-wider">
                        <BillIcon size={14} strokeWidth={2.5} />
                        <span>{bill.type}</span>
                      </div>
                      <h3 className="text-lg font-black tracking-tight text-white">{bill.provider}</h3>
                    </div>
  
                    <div className="flex items-end justify-between relative z-10 mt-5 pt-3.5 border-t border-white/15">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider opacity-75">Amount due</span>
                        <h4 className="text-2xl font-black tracking-tight">{bill.amount}</h4>
                      </div>
                      
                      <button 
                        onClick={() => handleBillClick(bill.type === "Prepaid" ? "Mobile Prepaid" : bill.type)}
                        className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-slate-900 bg-white hover:bg-emerald-50 border-none outline-none font-black text-xs cursor-pointer shadow-xs active:scale-95 transition-all"
                      >
                        <span>Pay Now</span>
                        <ChevronRight size={13} strokeWidth={3} />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              // Promo Cards
              promoCards.map((promo, i) => {
                const PromoIcon = promo.icon;
                return (
                  <motion.div 
                    key={i} 
                    className="rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[190px] relative overflow-hidden group border border-white/10 text-white"
                    style={{ background: promo.gradient }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  >
                    <div className="space-y-1.5 relative z-10">
                      <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-md mb-3 shadow-2xs border border-white/20">
                        <PromoIcon size={20} className="text-white" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug">{promo.title}</h3>
                      <p className="text-xs font-medium opacity-85 leading-relaxed pt-0.5">{promo.desc}</p>
                    </div>

                    <div className="flex items-end justify-between relative z-10 mt-5 pt-3.5 border-t border-white/15">
                      <button 
                        onClick={() => promo.target ? onNavigate(promo.target) : null}
                        className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-slate-900 bg-white hover:bg-emerald-50 border-none outline-none font-black text-xs cursor-pointer shadow-xs active:scale-95 transition-all"
                      >
                        <span>{promo.action}</span>
                        <ChevronRight size={13} strokeWidth={3} />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* ── 3. TRUST & FEATURE HIGHLIGHTS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#047857] shrink-0 border border-emerald-200/60 shadow-2xs">
              <Shield size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">Bank-Grade Security</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">256-bit encrypted BBPS payment network</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-200/60 shadow-2xs">
              <Zap size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">Instant Confirmations</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">Real-time bill fetch & operator clearance</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-200/60 shadow-2xs">
              <CreditCard size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">Zero Convenience Fee</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">No hidden charges on utility bills</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0 border border-purple-200/60 shadow-2xs">
              <Receipt size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">Certified Invoices</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">Instant legal receipts & GST invoices</p>
            </div>
          </div>
        </div>

        {/* ── 4. OFFICIAL BBPS CERTIFICATION PANEL ── */}
        <div className="bg-gradient-to-br from-white to-[#f8fafc] rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            {/* Logo Mark for BBPS */}
            <div className="flex items-center gap-2 shrink-0 bg-white border border-slate-200 p-2 rounded-2xl shadow-2xs">
              <div className="flex items-center justify-center bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-black w-10 h-10 rounded-xl text-center text-xl select-none">
                B
              </div>
              <div className="flex flex-col text-slate-900 font-black tracking-tighter uppercase leading-none pr-1">
                <span className="text-xs text-orange-600">Bharat</span>
                <span className="text-xs text-indigo-900">BillPay</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-black text-slate-900">
                National Payments Corporation of India (NPCI) Certified
              </h4>
              <p className="text-[11px] text-slate-500 font-medium leading-snug">
                All recharge and utility transactions on Fipmoney are processed securely via the authorized BBPS network.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap justify-center lg:justify-end shrink-0">
            <span className="inline-flex items-center gap-1.5 text-slate-700 bg-white px-3 py-1.5 rounded-full border border-slate-200 text-xs font-bold shadow-2xs">
              <Check size={13} className="text-[#047857]" strokeWidth={3} />
              <span>100% Secure</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-700 bg-white px-3 py-1.5 rounded-full border border-slate-200 text-xs font-bold shadow-2xs">
              <Check size={13} className="text-[#047857]" strokeWidth={3} />
              <span>Instant Reciepts</span>
            </span>
          </div>
        </div>

        {/* Fipmoney Signature Watermark */}
        <FipmoneySignature />

      </div>
    </div>
  );
}
