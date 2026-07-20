"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import allInOneGold from "../../assets/all_in_one_gold.png";
import allInOneSilver from "../../assets/all_in_one_silver.png";
import allInOneBills from "../../assets/all_in_one_bills.png";
import allInOneSavings from "../../assets/all_in_one_savings.png";

interface AllInOneSectionProps {
  onNavigate?: (page: string) => void;
}

export default function AllInOneSection({ onNavigate }: AllInOneSectionProps) {
  const cards = [
    {
      title: "Digital Gold",
      desc: "Invest in 24K 99.99% pure gold starting from just ₹1.",
      btnText: "Invest Now",
      action: () => onNavigate?.('digital-gold'),
      bg: "bg-gradient-to-b from-[#fffdf5] to-[#fffbeb] border-[#fef3c7]",
      titleColor: "text-amber-700",
      btnBorder: "border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white",
      image: allInOneGold,
    },
    {
      title: "Digital Silver",
      desc: "Diversify your portfolio with pure silver starting from ₹1.",
      btnText: "Invest Now",
      action: () => onNavigate?.('digital-silver'),
      bg: "bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] border-[#e2e8f0]",
      titleColor: "text-slate-700",
      btnBorder: "border-slate-500 text-slate-700 hover:bg-slate-500 hover:text-white",
      image: allInOneSilver,
    },
    {
      title: "Pay Bills",
      desc: "Pay all your bills from credit card and earn exciting rewards.",
      btnText: "Pay Now",
      action: () => {
        if (typeof window !== 'undefined' && sessionStorage.getItem("fm_logged_in_mobile")) {
          onNavigate?.('dashboard');
        } else {
          onNavigate?.('login');
        }
      },
      bg: "bg-gradient-to-b from-[#faf5ff] to-[#f3e8ff] border-[#f3e8ff]",
      titleColor: "text-purple-700",
      btnBorder: "border-purple-500 text-purple-700 hover:bg-purple-500 hover:text-white",
      image: allInOneBills,
    },
    {
      title: "Smart Savings",
      desc: "Automate your savings and achieve your financial goals.",
      btnText: "Start Saving",
      action: () => onNavigate?.('daily-savings'),
      bg: "bg-gradient-to-b from-[#f0fdf4] to-[#dcfce7] border-[#dcfce7]",
      titleColor: "text-emerald-700",
      btnBorder: "border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white",
      image: allInOneSavings,
    },
  ];

  return (
    <section className="py-16 bg-white" id="all-in-one-services">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-px bg-amber-500/50" />
            <div className="text-amber-700 text-xs font-black uppercase tracking-wider">
              Manage, Invest & Pay – All in One Place
            </div>
            <div className="w-12 h-px bg-amber-500/50" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Everything You Need, All in One App.
          </h2>
        </div>

        {/* Responsive Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              className={`border rounded-[2rem] p-8 flex flex-col justify-between hover:shadow-xl transition-all group ${card.bg}`}
              whileHover={{ y: -6 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div>
                {/* Title */}
                <h3 className={`text-2xl font-black mb-3 ${card.titleColor}`}>
                  {card.title}
                </h3>
                {/* Description */}
                <p className="text-sm font-semibold text-slate-600 leading-relaxed mb-6">
                  {card.desc}
                </p>
                {/* Button */}
                <button
                  onClick={card.action}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border bg-white font-extrabold text-xs transition-all duration-300 ${card.btnBorder} cursor-pointer shadow-sm`}
                >
                  {card.btnText} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Image Container */}
              <div className="mt-8 flex justify-center items-center h-44 overflow-hidden relative">
                <img
                  src={card.image}
                  alt={card.title}
                  className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
