import sys

content = """"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone, Car, Tv, MonitorPlay, Flame, Droplets, Zap,
  FileText, Wifi, GraduationCap, Home, Gift, Play, Search,
  Shield, CheckCircle2, CreditCard, ArrowRight, Clock, AlertCircle, ChevronRight,
  LayoutGrid, Landmark, Plane, MoreHorizontal, Star, Wallet, Bell, Receipt
} from "lucide-react";

interface BillsPageProps {
  onNavigate: (page: string) => void;
}

const services = [
  { label: "Mobile Prepaid", Icon: Smartphone, color: "#8b5cf6", bg: "#f3e8ff", shadow: "rgba(139, 92, 246, 0.15)", category: "recharge" },
  { label: "DTH", Icon: Tv, color: "#a855f7", bg: "#f3e8ff", shadow: "rgba(168, 85, 247, 0.15)", category: "recharge" },
  { label: "Electricity", Icon: Zap, color: "#f59e0b", bg: "#fef3c7", shadow: "rgba(245, 158, 11, 0.15)", category: "utilities" },
  { label: "FASTag", Icon: Car, color: "#10b981", bg: "#d1fae5", shadow: "rgba(16, 185, 129, 0.15)", category: "recharge" },
  { label: "Broadband", Icon: Wifi, color: "#3b82f6", bg: "#dbeafe", shadow: "rgba(59, 130, 246, 0.15)", category: "utilities" },
  { label: "Landline Postpaid", Icon: FileText, color: "#ec4899", bg: "#fce7f3", shadow: "rgba(236, 72, 153, 0.15)", category: "utilities" },
  { label: "Gas", Icon: Flame, color: "#ef4444", bg: "#fee2e2", shadow: "rgba(239, 68, 68, 0.15)", category: "utilities" },
  { label: "Water", Icon: Droplets, color: "#3b82f6", bg: "#dbeafe", shadow: "rgba(59, 130, 246, 0.15)", category: "utilities" },
  { label: "Google Play", Icon: Play, color: "#10b981", bg: "#d1fae5", shadow: "rgba(16, 185, 129, 0.15)", category: "recharge" },
  { label: "Cable TV", Icon: MonitorPlay, color: "#ec4899", bg: "#fce7f3", shadow: "rgba(236, 72, 153, 0.15)", category: "entertainment" },
  { label: "Mobile Postpaid", Icon: Smartphone, color: "#8b5cf6", bg: "#f3e8ff", shadow: "rgba(139, 92, 246, 0.15)", category: "recharge" },
  { label: "LPG Gas", Icon: Flame, color: "#ef4444", bg: "#fee2e2", shadow: "rgba(239, 68, 68, 0.15)", category: "utilities" },
  { label: "Credit Card", Icon: CreditCard, color: "#ef4444", bg: "#fee2e2", shadow: "rgba(239, 68, 68, 0.15)", category: "financial" },
  { label: "Rent", Icon: Home, color: "#10b981", bg: "#d1fae5", shadow: "rgba(16, 185, 129, 0.15)", category: "financial" },
  { label: "Education Fees", Icon: GraduationCap, color: "#8b5cf6", bg: "#f3e8ff", shadow: "rgba(139, 92, 246, 0.15)", category: "education" },
  { label: "Insurance", Icon: Shield, color: "#06b6d4", bg: "#cffafe", shadow: "rgba(6, 182, 212, 0.15)", category: "financial" },
  { label: "Subscriptions", Icon: Shield, color: "#8b5cf6", bg: "#f3e8ff", shadow: "rgba(139, 92, 246, 0.15)", category: "entertainment" },
  { label: "More", Icon: MoreHorizontal, color: "#3b82f6", bg: "#dbeafe", shadow: "rgba(59, 130, 246, 0.15)", category: "other" }
];

const CATEGORIES = [
  { id: "all", label: "All Payments", Icon: LayoutGrid },
  { id: "recharge", label: "Recharges", Icon: Smartphone },
  { id: "utilities", label: "Utilities", Icon: Zap },
  { id: "financial", label: "Financial Services", Icon: Landmark },
  { id: "entertainment", label: "Entertainment", Icon: MonitorPlay },
  { id: "travel", label: "Travel", Icon: Plane },
  { id: "education", label: "Education", Icon: GraduationCap },
  { id: "other", label: "Others", Icon: Clock }
];

export default function BillsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<string>("all");

  const handleBillClick = (label: string) => {
    sessionStorage.setItem("selectedBillLabel", label);
    onNavigate("recharge-details");
  };

  const filteredServices = services.filter(service => {
    const matchesTab = activeSubTab === "all" || service.category === activeSubTab;
    const matchesSearch = service.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#FAFAFA] pb-24 text-slate-800 font-sans">
      <div className="p-4 md:p-6 lg:p-10 max-w-[1400px] mx-auto space-y-6">
        
        {/* Split Category sidebar Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Left Column: Sidebar Tabs */}
          <div className="w-full lg:w-64 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] shrink-0 flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wide block mb-3 px-2">Categories</span>
            
            {CATEGORIES.map(tab => {
              const active = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`w-full text-left px-4 py-3.5 rounded-2xl font-semibold text-sm outline-none border-none cursor-pointer transition-all duration-300 flex items-center justify-between group
                    ${active ? "bg-[#f5f3ff] text-[#6d28d9]" : "bg-transparent text-slate-600 hover:bg-slate-50"}`}
                >
                  <div className="flex items-center gap-3">
                    <tab.Icon size={18} className={active ? "text-[#6d28d9]" : "text-slate-400 group-hover:text-slate-500"} />
                    <span>{tab.label}</span>
                  </div>
                  {active && <ChevronRight size={16} className="text-[#6d28d9]" />}
                </button>
              );
            })}
          </div>

          {/* Right Column: Grid list */}
          <div className="flex-1 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] min-h-[300px]">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Popular Services</h2>
               <button className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 bg-transparent border-none outline-none cursor-pointer hover:text-indigo-700 transition-colors">
                  <Star size={16} /> Manage Favourites
               </button>
            </div>

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
                  className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 gap-y-6"
                  layout
                >
                  {filteredServices.map((item, i) => (
                    <motion.div 
                      key={item.label}
                      onClick={() => handleBillClick(item.label)} 
                      className="bg-white rounded-3xl p-4 border border-slate-100 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 select-none hover:shadow-md hover:border-slate-200"
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.2), duration: 0.3 }}
                    >
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 mb-3"
                        style={{ background: item.bg, color: item.color }}
                      >
                        <item.Icon size={20} strokeWidth={2.5} />
                      </div>
                      
                      <span className="text-xs font-bold text-slate-800 leading-tight transition-colors">
                        {item.label}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Feature Info Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                 <Shield size={22} strokeWidth={2} />
              </div>
              <div>
                 <h4 className="text-sm font-extrabold text-slate-900">Secure Payments</h4>
                 <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">Bank-grade security<br/>for all transactions</p>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                 <Zap size={22} strokeWidth={2} />
              </div>
              <div>
                 <h4 className="text-sm font-extrabold text-slate-900">Instant Payments</h4>
                 <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">Fast and hassle-free<br/>payment experience</p>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                 <Wallet size={22} strokeWidth={2} />
              </div>
              <div>
                 <h4 className="text-sm font-extrabold text-slate-900">Multiple Options</h4>
                 <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">Pay using UPI, Cards,<br/>Net Banking & more</p>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                 <Bell size={22} strokeWidth={2} />
              </div>
              <div>
                 <h4 className="text-sm font-extrabold text-slate-900">Auto Reminders</h4>
                 <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">Never miss a due date<br/>with smart reminders</p>
              </div>
           </div>
        </div>

        {/* BBPS Security Panel */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Logo Mark for BBPS */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center justify-center bg-orange-500 text-white font-extrabold tracking-tighter w-12 h-12 rounded-lg text-center text-2xl font-sans select-none">
                B
              </div>
              <div className="flex flex-col text-indigo-900 font-black tracking-tighter uppercase leading-none">
                 <span className="text-lg">Bharat</span>
                 <span className="text-lg">BillPay</span>
              </div>
            </div>

            <div className="space-y-1 max-w-lg">
              <h4 className="text-sm font-extrabold text-indigo-700">
                Secure Payments Assured
              </h4>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                All recharge and bill transactions are processed securely via the national BBPS network. Invoices generated represent certified legal receipts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 flex-wrap justify-center lg:justify-end">
             <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50/50 px-3 py-1.5 rounded-lg border border-emerald-100/50">
                <Shield size={16} strokeWidth={2} />
                <span className="text-[11px] font-bold text-slate-600">100% Safe & Secure</span>
             </div>
             <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50/50 px-3 py-1.5 rounded-lg border border-emerald-100/50">
                <CheckCircle2 size={16} strokeWidth={2} />
                <span className="text-[11px] font-bold text-slate-600">Instant Confirmation</span>
             </div>
             <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50/50 px-3 py-1.5 rounded-lg border border-emerald-100/50">
                <Receipt size={16} strokeWidth={2} />
                <span className="text-[11px] font-bold text-slate-600">Official Receipts</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
"""

with open("src/app/components/BillsPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("BillsPage redesigned!")
