"use client";

import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Lock, 
  Coins, 
  Truck, 
  Banknote, 
  Gem, 
  CheckCircle2, 
  ArrowRight, 
  Shield, 
  Sparkles,
  Award
} from "lucide-react";
import securityIllustration from "../../assets/security_banner_illustration.png";

export default function PlatformTrustSection() {
  const securityFeatures = [
    {
      title: "Real 24K Gold",
      subtitle: "99.99% Purity Guaranteed",
      desc: "Every rupee becomes physical 24K 99.99% pure gold bought at real-time market prices with official hallmark certification.",
      icon: Coins,
      iconBg: "bg-amber-100/80 text-amber-600 border-amber-200",
      accentBorder: "group-hover:border-amber-400"
    },
    {
      title: "Stored in a Brink's Vault",
      subtitle: "Bank-Grade Security",
      desc: "Housed in multi-tier, 24x7 monitored physical bank vaults with 100% Lloyds-backed insurance coverage for total peace of mind.",
      icon: Lock,
      iconBg: "bg-blue-100/80 text-blue-600 border-blue-200",
      accentBorder: "group-hover:border-blue-400"
    },
    {
      title: "Gold Held in Your Name",
      subtitle: "Vistra Trustee Safeguard",
      desc: "Independent trustee Vistra legally holds ownership strictly in your name, protecting your gold independent of FipMoney.",
      icon: ShieldCheck,
      iconBg: "bg-emerald-100/80 text-emerald-600 border-emerald-200",
      accentBorder: "group-hover:border-emerald-400"
    }
  ];

  const withdrawalChoices = [
    {
      title: "24K Gold Delivered",
      subtitle: "Doorstep Physical Delivery",
      desc: "Coins and bars shipped securely to your home anywhere in India with insured tamper-proof packaging.",
      icon: Truck,
      iconBg: "bg-amber-100/80 text-amber-600 border-amber-200"
    },
    {
      title: "Sell for Cash, Easily",
      subtitle: "Instant 24x7 Payout",
      desc: "Sell at live market prices with funds credited straight to your bank account via instant UPI or IMPS transfer.",
      icon: Banknote,
      iconBg: "bg-emerald-100/80 text-emerald-600 border-emerald-200"
    },
    {
      title: "Make Jewellery",
      subtitle: "Partner Outlet Redemption",
      desc: "Use your gold balance seamlessly at leading partner jewellery outlets like Tanishq & CaratLane.",
      icon: Gem,
      iconBg: "bg-purple-100/80 text-purple-600 border-purple-200"
    }
  ];

  return (
    <section className="py-14 md:py-16 bg-white text-slate-900 relative overflow-hidden">
      
      {/* LIGHT GRADIENT BLURS */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/40 via-indigo-50/20 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-emerald-100/50 via-teal-50/40 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* CONCEPT 1: SECURITY OF OWNERSHIP */}
        <div className="space-y-12">
          <div className="text-center">
            <span className="text-sm font-black tracking-widest text-[#d89221] uppercase block mb-6">SECURITY OF OWNERSHIP</span>
            <h3 className="text-4xl md:text-6xl font-bold text-slate-800 tracking-tight mb-4">
              Real, Vaulted, and Yours
            </h3>
            <p className="text-sm md:text-base font-semibold text-slate-500 max-w-lg mx-auto">
              Every rupee becomes physical 24K — stored under bank-grade security and held in your name, not ours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {securityFeatures.map((feat, idx) => {
              const IconComponent = feat.icon;
              return (
                <motion.div
                  key={idx}
                  className={`bg-white border border-slate-200/80 ${feat.accentBorder} rounded-3xl p-7 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-14 h-14 rounded-2xl ${feat.iconBg} border flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                        <IconComponent className="w-7 h-7 stroke-[2.2]" />
                      </div>
                      <span className="text-xs font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        {feat.subtitle}
                      </span>
                    </div>

                    <h4 className="text-2xl font-black text-slate-900 tracking-tight pt-2">
                      {feat.title}
                    </h4>

                    <p className="text-sm font-semibold text-slate-500 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-sm font-extrabold text-[#d89221] group-hover:text-amber-600 transition-colors mt-6">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={15} className="text-emerald-500" /> Fully Verified & Protected
                    </span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CONCEPT 2: YOUR GOLD, YOUR CHOICE (WITHDRAWAL OPTIONS) */}
        <div className="space-y-12 pt-4">
          <div className="text-center">
            <span className="text-sm font-black tracking-widest text-emerald-600 uppercase block mb-6">YOUR GOLD, YOUR CHOICE</span>
            <h3 className="text-4xl md:text-6xl font-bold text-slate-800 tracking-tight mb-4">
              Withdraw It However You Like
            </h3>
            <p className="text-sm md:text-base font-semibold text-slate-500 max-w-lg mx-auto">
              Once you've saved enough, take it out your way with instant flexibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {withdrawalChoices.map((choice, idx) => {
              const IconComponent = choice.icon;
              return (
                <motion.div
                  key={idx}
                  className="bg-white border border-slate-200/80 hover:border-emerald-400 rounded-3xl p-7 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-14 h-14 rounded-2xl ${choice.iconBg} border flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                        <IconComponent className="w-7 h-7 stroke-[2.2]" />
                      </div>
                      <span className="text-xs font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        {choice.subtitle}
                      </span>
                    </div>

                    <h4 className="text-2xl font-black text-slate-900 tracking-tight pt-2">
                      {choice.title}
                    </h4>

                    <p className="text-sm font-semibold text-slate-500 leading-relaxed">
                      {choice.desc}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-sm font-extrabold text-emerald-600 group-hover:text-emerald-700 transition-colors mt-6">
                    <span>Instant Execution</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

