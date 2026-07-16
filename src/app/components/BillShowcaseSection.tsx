"use client";

import { motion } from "framer-motion";
import { 
  Smartphone, Zap, Tv, GraduationCap, Home, FileText, Flame, 
  Droplets, Wifi, Car, Gift, Play, ArrowRight, ShieldCheck, CreditCard
} from "lucide-react";
import { Button } from "./ui/button";

interface BillShowcaseSectionProps {
  onNavigate?: (page: string) => void;
}

const billsList = [
  { label: "Mobile Prepaid", desc: "Instant recharge on Jio, Airtel, VI, etc.", Icon: Smartphone, color: "#8b5cf6", bg: "#f3e8ff" },
  { label: "Electricity Bill", desc: "Pay electricity bills to 50+ state boards.", Icon: Zap, color: "#eab308", bg: "#fef08a" },
  { label: "DTH Connection", desc: "Recharge Tata Play, Dish TV, Airtel DTH.", Icon: Tv, color: "#f59e0b", bg: "#fef3c7" },
  { label: "Tuition Fees", desc: "Pay tuition fees using Credit Card.", Icon: GraduationCap, color: "#6366f1", bg: "#e0e7ff" },
  { label: "Education Fees", desc: "Pay school/college fees from Credit Card.", Icon: GraduationCap, color: "#6366f1", bg: "#e0e7ff" },
  { label: "House Rent", desc: "Transfer rent directly from CC to landlord's Bank.", Icon: Home, color: "#14b8a6", bg: "#ccfbf1" },
  { label: "Broadband Bill", desc: "Settlements for ACT, Airtel, Excitel, BSNL.", Icon: Wifi, color: "#06b6d4", bg: "#cffafe" },
  { label: "Credit Card Rent", desc: "Pay any card dues securely via BBPS.", Icon: CreditCard, color: "#ef4444", bg: "#fee2e2" },
];

export default function BillShowcaseSection({ onNavigate }: BillShowcaseSectionProps) {
  return (
    <section className="py-24 bg-white" id="bills-showcase">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200/50 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">
            ⚡ Unified Payments Hub
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Recharge & Pay Bills <br/>
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">Directly from Credit Card</span>
          </h2>
          <p className="text-sm md:text-base font-semibold text-slate-500 leading-relaxed">
            Maximize your reward cycles! Pay utility bills, mobile recharges, tuition fees, and house rent directly from your Credit Card to recipient bank accounts with premium security checks.
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {billsList.map((item, idx) => (
            <motion.div 
              key={idx}
              className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 flex flex-col justify-between hover:bg-white hover:border-amber-200 hover:shadow-xl hover:shadow-slate-100 transition-all group cursor-pointer"
              whileHover={{ y: -5 }}
              onClick={() => onNavigate?.('login')}
            >
              <div>
                {/* Icon Circle */}
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner shrink-0 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: item.bg, color: item.color }}
                >
                  <item.Icon size={20} strokeWidth={2.5} />
                </div>
                
                <h3 className="text-base font-extrabold text-slate-800 mt-5 group-hover:text-amber-600 transition-colors">{item.label}</h3>
                <p className="text-xs text-slate-500 font-semibold mt-2 leading-relaxed">{item.desc}</p>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-black text-amber-600 uppercase tracking-widest mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                Pay Now <ArrowRight size={12} strokeWidth={3} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* bottom secure guarantee banner */}
        <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <ShieldCheck size={24} strokeWidth={2} />
            </div>
            <div>
              <p className="text-base font-black text-slate-800">Secure Payments via BBPS Guarantee</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 leading-relaxed">
                Transactions are authorized via RBI-regulated Bharat Bill Payment System (BBPS) and secure multi-layer PCI-DSS credit protection protocols.
              </p>
            </div>
          </div>

          <Button 
            onClick={() => onNavigate?.('login')}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 active:translate-y-0 shrink-0 outline-none border-none cursor-pointer"
          >
            Log In to Pay Bills
          </Button>
        </div>

      </div>
    </section>
  );
}
