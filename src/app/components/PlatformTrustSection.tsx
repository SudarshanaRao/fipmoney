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
    <section className="py-20 bg-[#FAFBFD] text-slate-900 relative overflow-hidden">
      
      {/* LIGHT GRADIENT BLURS */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-gradient-to-br from-[#fff7d6]/60 via-[#ffeed0]/30 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-emerald-100/50 via-teal-50/40 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* TOP HEADER */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-[#d89221] text-xs font-black tracking-widest uppercase shadow-xs"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <ShieldCheck className="w-4 h-4 text-[#d89221]" />
            100% BANK-GRADE SECURITY & INDEPENDENT CUSTODY
          </motion.div>

          <motion.h2 
            className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-slate-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Your Gold is <span className="bg-gradient-to-r from-[#d89221] via-[#e6a800] to-amber-600 bg-clip-text text-transparent drop-shadow-2xs">Very Safe & 100% Yours</span>
          </motion.h2>

          <motion.p 
            className="text-sm md:text-base font-semibold text-slate-600 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Every rupee becomes physical 24K gold — stored under bank-grade security and legally held in your name, not ours.
          </motion.p>
        </div>

        {/* OFFICIAL PARTNERS LOGO BANNER (BRINK'S & VISTRA) */}
        <motion.div
          className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">SECURED BY</span>
              <div className="h-6 w-px bg-slate-200" />
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-around gap-8 md:gap-12 w-full">
              {/* Brink's Logo Card */}
              <div className="flex items-center gap-4 bg-slate-50/80 border border-slate-200/70 px-6 py-3.5 rounded-2xl hover:bg-amber-50/40 transition-colors">
                <img src="/brinks-logo.svg" alt="Secured by Brink's" className="h-7 md:h-8 w-auto object-contain" />
                <div className="text-left border-l border-slate-200 pl-4">
                  <div className="text-xs font-black text-slate-900">Brink's Vault Custody</div>
                  <div className="text-[10px] font-bold text-slate-500">24x7 Monitored & 100% Insured</div>
                </div>
              </div>

              {/* Vistra Logo Card */}
              <div className="flex items-center gap-4 bg-slate-50/80 border border-slate-200/70 px-6 py-3.5 rounded-2xl hover:bg-emerald-50/40 transition-colors">
                <img src="/vistra-logo.svg" alt="Vistra Security Trustee" className="h-7 md:h-8 w-auto object-contain" />
                <div className="text-left border-l border-slate-200 pl-4">
                  <div className="text-xs font-black text-slate-900">Vistra Security Trustee</div>
                  <div className="text-[10px] font-bold text-slate-500">Independent Legal Safeguard</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CONCEPT 1: SECURITY OF OWNERSHIP */}
        <div className="space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs font-black tracking-widest text-[#d89221] uppercase">SECURITY OF OWNERSHIP</span>
            <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
              Real, Vaulted, and Yours
            </h3>
            <p className="text-xs md:text-sm font-semibold text-slate-500 max-w-lg mx-auto">
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
                      <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        {feat.subtitle}
                      </span>
                    </div>

                    <h4 className="text-xl font-black text-slate-900 tracking-tight pt-2">
                      {feat.title}
                    </h4>

                    <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#d89221] group-hover:text-amber-600 transition-colors mt-6">
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
        <div className="space-y-8 pt-4">
          <div className="text-center space-y-1">
            <span className="text-xs font-black tracking-widest text-emerald-600 uppercase">YOUR GOLD, YOUR CHOICE</span>
            <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
              Withdraw It However You Like
            </h3>
            <p className="text-xs md:text-sm font-semibold text-slate-500 max-w-lg mx-auto">
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
                      <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        {choice.subtitle}
                      </span>
                    </div>

                    <h4 className="text-xl font-black text-slate-900 tracking-tight pt-2">
                      {choice.title}
                    </h4>

                    <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                      {choice.desc}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-emerald-600 group-hover:text-emerald-700 transition-colors mt-6">
                    <span>Instant Execution</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM BANNER: SECURE TRANSACTIONS */}
        <motion.div
          className="rounded-3xl bg-gradient-to-r from-[#fdfaf2] via-[#fffdf9] to-white border border-[#f5ebd0] p-8 md:p-10 relative overflow-hidden shadow-xs"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#f5ebd0] text-[#c59325] text-xs font-black tracking-wider uppercase shadow-xs">
                <Lock className="w-3.5 h-3.5 text-[#c59325]" />
                YOUR SAFETY IS OUR PRIORITY
              </div>

              <h3 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                Bank-Grade Security,<br />Complete Peace of Mind
              </h3>

              <p className="text-xs md:text-sm font-semibold text-slate-600 leading-relaxed max-w-xl">
                Every transaction on FipMoney is protected with end-to-end 256-bit encryption and monitored 24x7 to ensure complete safety of your funds.
              </p>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <img
                src={securityIllustration}
                alt="Secure Transactions Illustration"
                className="max-h-[220px] w-auto object-contain drop-shadow-md"
              />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

