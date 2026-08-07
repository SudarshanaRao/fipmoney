"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Smartphone, Zap, Tv, Droplets, PhoneCall, Wifi, Shield, Landmark, CarFront, Flame, CreditCard, GraduationCap, Building2, TrainTrack, ArrowRight, ShieldCheck
} from "lucide-react";
import { Button } from "./ui/button";

interface BillShowcaseSectionProps {
  onNavigate?: (page: string) => void;
}

const billsList = [
  { label: "Mobile Prepaid", desc: "Instant recharge on Jio, Airtel, VI, etc.", Icon: Smartphone, color: "#8b5cf6", bg: "#f3e8ff", hasPayNow: true },
  { label: "Electricity Bill", desc: "Pay electricity bills to 50+ state boards.", Icon: Zap, color: "#eab308", bg: "#fef08a", hasPayNow: true },
  { label: "DTH Connection", desc: "Recharge Tata Play, Dish TV, Airtel DTH.", Icon: Tv, color: "#f59e0b", bg: "#fef3c7", hasPayNow: true },
  { label: "Water & Piped Gas", desc: "Utility payments for water and gas.", Icon: Droplets, color: "#0ea5e9", bg: "#e0f2fe", hasPayNow: false },
  { label: "Mobile Postpaid & Landline", desc: "Pay postpaid and landline bills.", Icon: PhoneCall, color: "#8b5cf6", bg: "#f3e8ff", hasPayNow: false },
  { label: "Broadband", desc: "Pay your internet broadband bills.", Icon: Wifi, color: "#06b6d4", bg: "#cffafe", hasPayNow: false },
  { label: "Insurance Premium", desc: "Pay your insurance premiums securely.", Icon: Shield, color: "#10b981", bg: "#d1fae5", hasPayNow: false },
  { label: "Loan EMI Repayment", desc: "Pay EMIs for your ongoing loans.", Icon: Landmark, color: "#6366f1", bg: "#e0e7ff", hasPayNow: false },
  { label: "FASTag Recharge", desc: "Recharge FASTag for toll payments.", Icon: CarFront, color: "#14b8a6", bg: "#ccfbf1", hasPayNow: false },
  { label: "LPG Cylinder Booking", desc: "Book your LPG cylinder easily.", Icon: Flame, color: "#f97316", bg: "#ffedd5", hasPayNow: false },
  { label: "Credit Card Bill Payment", desc: "Pay any card dues securely.", Icon: CreditCard, color: "#ef4444", bg: "#fee2e2", hasPayNow: false },
  { label: "Education Fee Payment", desc: "Pay school and college fees.", Icon: GraduationCap, color: "#6366f1", bg: "#e0e7ff", hasPayNow: false },
  { label: "Municipal Taxes", desc: "Pay municipal taxes and services.", Icon: Building2, color: "#64748b", bg: "#f1f5f9", hasPayNow: false },
  { label: "Metro Card Recharge", desc: "Recharge your smart metro card.", Icon: TrainTrack, color: "#ec4899", bg: "#fce7f3", hasPayNow: false },
];

export default function BillShowcaseSection({ onNavigate }: BillShowcaseSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedBills = showAll ? billsList : billsList.slice(0, 10);

  return (
    <section className="pt-2 pb-20 bg-white" id="bills-showcase">
      <div className="container mx-auto px-6 md:px-8 max-w-[1400px] space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200/50 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">
            ⚡ Unified Payments Hub
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Recharge & Pay Bills
          </h2>
          <p className="text-sm md:text-base font-semibold text-slate-500 leading-relaxed">
            Maximize your utility payments! Pay bills, mobile recharges, tuition fees, and house rent securely with premium checks and fast settlement.
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {displayedBills.map((item, idx) => (
            <motion.div 
              key={idx}
              className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:bg-white hover:border-amber-200 hover:shadow-xl hover:shadow-slate-100 transition-all group cursor-pointer"
              whileHover={{ y: -3 }}
              onClick={() => onNavigate?.('login')}
            >
              <div>
                {/* Icon Circle */}
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner shrink-0 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: item.bg, color: item.color }}
                >
                  <item.Icon size={18} strokeWidth={2.5} />
                </div>
                
                <h3 className="text-sm font-extrabold text-slate-800 mt-3 group-hover:text-amber-600 transition-colors leading-tight">{item.label}</h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold mt-1.5 leading-relaxed line-clamp-2">{item.desc}</p>
              </div>

              <div className="flex items-center gap-1 text-[9px] font-black text-amber-600 uppercase tracking-widest mt-4 transition-opacity opacity-0 group-hover:opacity-100">
                <>
                  Pay Now <ArrowRight size={10} strokeWidth={3} />
                </>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => setShowAll(!showAll)}
            className="rounded-full px-8 py-6 font-bold border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            {showAll ? "View Less Services" : "View All Services"}
          </Button>
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
