"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone, Car, Tv, MonitorPlay, Flame, Droplets, Zap,
  FileText, Wifi, GraduationCap, Home, Gift, Play, Search,
  Shield, CheckCircle2, CreditCard, ArrowRight, Clock, AlertCircle, ChevronRight
} from "lucide-react";

interface BillsPageProps {
  onNavigate: (page: string) => void;
}

const GOLD = { G_DK: "#b87312", G_LT: "#efb652", BG: "#fdf8f0" };

const services = [
  { label: "Mobile Prepaid", Icon: Smartphone, color: "#8b5cf6", bg: "#f3e8ff", shadow: "rgba(139, 92, 246, 0.15)", category: "recharge" },
  { label: "FASTag", Icon: Car, color: "#10b981", bg: "#d1fae5", shadow: "rgba(16, 185, 129, 0.15)", category: "recharge" },
  { label: "DTH", Icon: Tv, color: "#f59e0b", bg: "#fef3c7", shadow: "rgba(245, 158, 11, 0.15)", category: "recharge" },
  { label: "Cable TV", Icon: MonitorPlay, color: "#ec4899", bg: "#fce7f3", shadow: "rgba(236, 72, 153, 0.15)", category: "recharge" },
  { label: "Google Play", Icon: Play, color: "#10b981", bg: "#d1fae5", shadow: "rgba(16, 185, 129, 0.15)", category: "recharge" },
  
  { label: "Electricity", Icon: Zap, color: "#eab308", bg: "#fef08a", shadow: "rgba(234, 179, 8, 0.15)", category: "utilities" },
  { label: "Gas", Icon: Flame, color: "#f97316", bg: "#ffedd5", shadow: "rgba(249, 115, 22, 0.15)", category: "utilities" },
  { label: "LPG Gas", Icon: Flame, color: "#ef4444", bg: "#fee2e2", shadow: "rgba(239, 68, 68, 0.15)", category: "utilities" },
  { label: "Water", Icon: Droplets, color: "#3b82f6", bg: "#dbeafe", shadow: "rgba(59, 130, 246, 0.15)", category: "utilities" },
  { label: "Broadband", Icon: Wifi, color: "#06b6d4", bg: "#cffafe", shadow: "rgba(6, 182, 212, 0.15)", category: "utilities" },
  { label: "Landline Postpaid", Icon: Wifi, color: "#ec4899", bg: "#fce7f3", shadow: "rgba(236, 72, 153, 0.15)", category: "utilities" },
  { label: "Mobile Postpaid", Icon: FileText, color: "#8b5cf6", bg: "#f3e8ff", shadow: "rgba(139, 92, 246, 0.15)", category: "utilities" },

  { label: "Tuition Fees", Icon: GraduationCap, color: "#6366f1", bg: "#e0e7ff", shadow: "rgba(99, 102, 241, 0.15)", category: "financial" },
  { label: "Education Fees", Icon: GraduationCap, color: "#6366f1", bg: "#e0e7ff", shadow: "rgba(99, 102, 241, 0.15)", category: "financial" },
  { label: "Rent", Icon: Home, color: "#14b8a6", bg: "#ccfbf1", shadow: "rgba(20, 184, 166, 0.15)", category: "financial" },
  { label: "Credit Card", Icon: CreditCard, color: "#ef4444", bg: "#fee2e2", shadow: "rgba(239, 68, 68, 0.15)", category: "financial" },
  
  { label: "Brand Vouchers", Icon: Gift, color: "#d946ef", bg: "#fae8ff", shadow: "rgba(217, 70, 239, 0.15)", category: "other" },
  { label: "Subscriptions", Icon: MonitorPlay, color: "#3b82f6", bg: "#dbeafe", shadow: "rgba(59, 130, 246, 0.15)", category: "other" }
];

export default function BillsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"all" | "recharge" | "utilities" | "financial" | "other">("all");

  const handleBillClick = (label: string) => {
    sessionStorage.setItem("selectedBillLabel", label);
    onNavigate("recharge-details");
  };

  // Mock due bills styled like bank cards
  const dueBills = [
    { provider: "BESCOM Electricity", type: "Electricity", amount: "₹1,850", dueIn: "6 Days", icon: Zap, gradient: "linear-gradient(135deg, #7c2d12 0%, #b87312 100%)", text: "text-white" },
    { provider: "Airtel Fiber", type: "Broadband", amount: "₹999", dueIn: "3 Days", icon: Wifi, gradient: "linear-gradient(135deg, #0369a1 0%, #06b6d4 100%)", text: "text-white" },
    { provider: "Jio Mobile", type: "Prepaid", amount: "₹299", dueIn: "Expired", icon: Smartphone, gradient: "linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)", text: "text-white", expired: true }
  ];

  // Filtering services
  const filteredServices = services.filter(service => {
    const matchesTab = activeSubTab === "all" || service.category === activeSubTab;
    const matchesSearch = service.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#f8fafc] pb-24 relative">
      
      {/* Decorative Floating Mesh Gradients */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-80 right-10 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-emerald-200/15 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-10">
        
        {/* Sleek Minimal Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Recharge & Bills</h1>
            <p className="text-sm font-semibold text-slate-400 mt-1">Manage utility, recharge and other payments with bank-grade security.</p>
          </div>
          
          {/* Right Aligned Floating Search Bar */}
          <div className="relative w-full md:w-80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl border border-slate-100 bg-white overflow-hidden focus-within:border-[#b87312] transition-colors">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Search size={16} /></span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search operator or service..."
              className="w-full pl-11 pr-4 py-3 text-xs font-bold text-slate-700 bg-transparent border-none outline-none placeholder-slate-400"
            />
          </div>
        </div>

        {/* Saved & Due Bills Showcase (Smart Cards Layout) */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Clock size={16} className="text-[#b87312]" /> Pending Due Alerts
            </h2>
            <span className="text-[10px] font-black uppercase text-[#b87312] bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
              3 Payments Due
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dueBills.map((bill, i) => {
              const BillIcon = bill.icon;
              return (
                <motion.div 
                  key={i} 
                  className="rounded-[2rem] p-6 shadow-[0_10px_25px_rgba(0,0,0,0.05)] flex flex-col justify-between min-h-[175px] relative overflow-hidden group border border-solid border-white/20 text-white"
                  style={{ background: bill.gradient }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Due Date Tag on Top-Right */}
                  <div className="absolute right-6 top-6 flex items-center gap-1.5 bg-white py-1.5 px-3 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                    <span className={`w-2 h-2 rounded-full ${bill.expired ? "bg-rose-500 animate-pulse" : "bg-amber-500"}`} />
                    <span className={`text-[9px] font-black uppercase tracking-wider ${bill.expired ? "text-rose-600" : "text-amber-600"}`}>
                      {bill.expired ? "Expired" : `Due in ${bill.dueIn}`}
                    </span>
                  </div>
                  
                  <div className="space-y-1 relative z-10 pt-4">
                    <div className="flex items-center gap-2 opacity-85">
                      <BillIcon size={14} strokeWidth={2.5} />
                      <span className="text-[10px] font-extrabold uppercase tracking-wider">{bill.type}</span>
                    </div>
                    <h3 className="text-lg font-black tracking-tight mt-1">{bill.provider}</h3>
                  </div>

                  <div className="flex items-end justify-between relative z-10 mt-6 pt-4 border-t border-white/10">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">Amount due</span>
                      <h2 className="text-xl font-black">{bill.amount}</h2>
                    </div>
                    
                    <button 
                      onClick={() => handleBillClick(bill.type === "Prepaid" ? "Mobile Prepaid" : bill.type)}
                      className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-slate-800 bg-white hover:bg-slate-50 border-none outline-none font-black text-xs cursor-pointer shadow-sm transition-transform active:scale-95 hover:scale-105"
                    >
                      Pay Now <ChevronRight size={12} strokeWidth={3} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Split Category sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sidebar Tabs */}
          <div className="lg:col-span-3 bg-white p-5 rounded-[2rem] border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.01)] space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block px-3 mb-2">Categories</span>
            
            {[
              { id: "all", label: "All Payments" },
              { id: "recharge", label: "Recharges" },
              { id: "utilities", label: "Utilities" },
              { id: "financial", label: "Financial Services" },
              { id: "other", label: "Others" }
            ].map(tab => {
              const active = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className="w-full text-left px-4 py-3 rounded-xl font-bold text-xs outline-none border-none cursor-pointer transition-all duration-300 relative overflow-hidden flex items-center justify-between"
                  style={{
                    backgroundColor: active ? "rgba(184, 115, 18, 0.08)" : "transparent",
                    color: active ? "#b87312" : "#64748b"
                  }}
                >
                  <span>{tab.label}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-[#b87312]" />}
                </button>
              );
            })}
          </div>

          {/* Right Column: Grid list */}
          <div className="lg:col-span-9 bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.01)] min-h-[300px]">
            <AnimatePresence mode="popLayout">
              {filteredServices.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center p-12 text-center h-[240px]"
                >
                  <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-3">
                    <AlertCircle size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">No payment category found</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">Check your search spelling or filter another category.</p>
                </motion.div>
              ) : (
                <motion.div 
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
                  layout
                >
                  {filteredServices.map((item, i) => (
                    <motion.div 
                      key={item.label}
                      onClick={() => handleBillClick(item.label)} 
                      className="bg-white rounded-3xl p-5 border border-slate-100 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 select-none group"
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.2), duration: 0.3 }}
                      whileHover={{ 
                        y: -5,
                        boxShadow: `0 10px 25px ${item.shadow}`,
                        borderColor: item.color
                      }}
                    >
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300"
                        style={{ background: item.bg, color: item.color }}
                      >
                        <item.Icon size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                      </div>
                      
                      <span className="text-[11px] font-black text-slate-700 mt-4 leading-tight group-hover:text-slate-900 transition-colors">
                        {item.label}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* BBPS Security Panel */}
        <motion.div 
          className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col md:flex-row items-center gap-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Logo Mark for BBPS */}
          <div className="shrink-0 flex items-center justify-center bg-emerald-600 text-white font-extrabold tracking-tighter w-14 h-14 rounded-2xl shadow-sm text-center text-sm font-sans flex-col leading-none select-none">
            <span className="text-[9px] uppercase font-medium opacity-80">bharat</span>
            <span className="text-lg font-black tracking-tight">billpay</span>
          </div>

          <div className="text-center md:text-left space-y-1">
            <h4 className="text-sm font-extrabold text-slate-800 flex items-center justify-center md:justify-start gap-1.5">
              <Shield size={16} strokeWidth={2.5} className="text-emerald-600" /> RBI Authorized Security Assured
            </h4>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              All recharges and bill transactions are processed securely via the national BBPS network. Invoices generated represent certified legal receipts.
            </p>
          </div>
          
          <div className="ml-auto flex items-center gap-1.5 text-xs font-black text-slate-700 bg-slate-50 border border-slate-100 py-1.5 px-4 rounded-full shrink-0 shadow-sm">
            <CheckCircle2 size={14} className="text-emerald-600" strokeWidth={3} /> PCI-DSS Compliant
          </div>
        </motion.div>

      </div>
    </div>
  );
}
