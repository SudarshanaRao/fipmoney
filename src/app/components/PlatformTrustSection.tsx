"use client";

import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Award, 
  Headphones, 
  Smartphone, 
  Lock, 
  Users, 
  Database 
} from "lucide-react";
import securityIllustration from "../../assets/security_banner_illustration.png";

export default function PlatformTrustSection() {
  const cards = [
    {
      title: "Bank-Grade\nSecurity",
      desc: "Your data and transactions are protected with advanced encryption and multi-layered security protocols.",
      icon: Lock,
      bg: "bg-amber-100/50",
      glow: "bg-amber-200/40",
      text: "text-amber-600",
      border: "border-amber-100",
      buttonBg: "bg-amber-50",
      buttonHover: "group-hover:bg-amber-100",
    },
    {
      title: "Lightning Fast",
      desc: "Experience instant payments and smooth transactions every time, everywhere.",
      icon: Zap,
      bg: "bg-emerald-100/50",
      glow: "bg-emerald-200/40",
      text: "text-emerald-500",
      border: "border-emerald-100",
      buttonBg: "bg-emerald-50",
      buttonHover: "group-hover:bg-emerald-100",
    },
    {
      title: "Reliable & Efficient",
      desc: "Our robust infrastructure ensures high availability and uninterrupted services you can rely on.",
      icon: Award,
      bg: "bg-blue-100/50",
      glow: "bg-blue-200/40",
      text: "text-blue-500",
      border: "border-blue-100",
      buttonBg: "bg-blue-50",
      buttonHover: "group-hover:bg-blue-100",
    },
    {
      title: "Always Here\nfor You",
      desc: "Our dedicated support team is available 24/7 to assist you whenever you need.",
      icon: Headphones,
      bg: "bg-purple-100/50",
      glow: "bg-purple-200/40",
      text: "text-purple-500",
      border: "border-purple-100",
      buttonBg: "bg-purple-50",
      buttonHover: "group-hover:bg-purple-100",
    },
    {
      title: "Built for\nSimplicity",
      desc: "A clean, intuitive and easy-to-use experience designed to make finance simple for everyone.",
      icon: Smartphone,
      bg: "bg-orange-100/50",
      glow: "bg-orange-200/40",
      text: "text-orange-500",
      border: "border-orange-100",
      buttonBg: "bg-orange-50",
      buttonHover: "group-hover:bg-orange-100",
    },
  ];

  const features = [
    { label: "Fraud Detection", icon: Shield },
    { label: "Real-time Monitoring", icon: Lock },
    { label: "Trusted Partners", icon: Users },
    { label: "Data Protection", icon: Database },
  ];

  return (
    <section className="py-20 bg-[#fafafa] overflow-hidden relative">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl space-y-16">
        
        {/* TOP SECTION: A Platform You Can Count On */}
        <div className="space-y-16 relative">
          
          {/* Subtle Background Dotted Grids */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-[radial-gradient(#d1d5db_1.5px,transparent_1.5px)] [background-size:12px_12px] opacity-40" />
          <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(#d1d5db_1.5px,transparent_1.5px)] [background-size:12px_12px] opacity-40" />
          
          {/* Swoosh SVG Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1400px] h-full pointer-events-none opacity-20 hidden md:block">
            <svg viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-amber-500">
              <path d="M0,160 C320,300 420,0 720,160 C1020,320 1120,20 1440,160" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>

          {/* Header Area with 3D Illustrations */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-[1100px] mx-auto relative z-10">
            {/* Left 3D Shield (Hidden on mobile) */}
            <motion.div 
              className="hidden lg:flex flex-1 justify-center items-center"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img src="/sheild.png" alt="Secure Shield" className="w-48 xl:w-56 h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
            </motion.div>

            {/* Center Content */}
            <div className="text-center space-y-5 flex-[2] bg-white/40 backdrop-blur-sm p-4 rounded-3xl">
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-amber-100 text-amber-500 text-[10px] font-black tracking-widest uppercase shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Shield className="w-3.5 h-3.5 fill-amber-50 text-amber-500" />
                SECURE, RELIABLE & ALWAYS WITH YOU
              </motion.div>
              
              <h2 className="text-4xl md:text-[44px] lg:text-5xl font-black tracking-tight text-[#1a202c] leading-[1.2]">
                A Platform <span className="bg-gradient-to-r from-orange-400 via-amber-500 to-orange-500 bg-clip-text text-transparent drop-shadow-sm">You Can Count On</span>
              </h2>
              
              <div className="flex items-center justify-center gap-4 py-1 opacity-40">
                <div className="h-px bg-amber-500 w-12"></div>
                <Shield className="w-4 h-4 text-amber-500" />
                <div className="h-px bg-amber-500 w-12"></div>
              </div>

              <p className="text-[13px] md:text-[15px] font-medium text-slate-500 leading-relaxed max-w-lg mx-auto">
                We combine technology, security and innovation to deliver
                a seamless financial experience you can trust.
              </p>
            </div>

            {/* Right 3D Phone (Hidden on mobile) */}
            <motion.div 
              className="hidden lg:flex flex-1 justify-center items-center"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img src="/mobile.png" alt="Mobile Platform" className="w-48 xl:w-56 h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
            </motion.div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 max-w-[1100px] mx-auto pt-6">
            {cards.map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <motion.div
                  key={idx}
                  className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between items-center text-center shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_35px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-400 group relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <div className="flex flex-col items-center z-10 w-full">
                    {/* Icon Container */}
                    <div className="relative mb-6 mt-2">
                      {/* Blurred Glow Background */}
                      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full blur-[20px] ${card.glow} opacity-80 group-hover:scale-125 transition-transform duration-500`} />
                      
                      {/* Solid Icon Circle */}
                      <div className={`relative w-16 h-16 rounded-full ${card.bg} border-[3px] border-white flex items-center justify-center ${card.text} shadow-sm group-hover:scale-110 transition-transform duration-300 z-10`}>
                        <IconComponent className="w-7 h-7 stroke-[1.75]" />
                      </div>
                    </div>

                    <h3 className="text-[15px] font-black text-slate-900 mb-3 leading-tight px-1 whitespace-pre-line">
                      {card.title}
                    </h3>
                    
                    <p className="text-[11px] font-medium text-slate-400 leading-relaxed mb-6 px-1">
                      {card.desc}
                    </p>
                  </div>

                  <div className={`w-8 h-8 rounded-full ${card.buttonBg} ${card.text} flex items-center justify-center ${card.buttonHover} transition-colors duration-300 cursor-pointer shadow-sm z-10`}>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM SECTION: Secure Transactions Banner */}
        <motion.div
          className="rounded-[2.5rem] bg-gradient-to-r from-[#fdfaf2] via-[#fdfbf7] to-white border border-[#f5ebd0]/60 p-8 md:p-12 relative overflow-hidden shadow-sm"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Subtle background glow */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-b from-[#ffeebf]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-[#f5ebd0] text-[#c59325] text-xs font-black tracking-wider uppercase shadow-sm">
                <Lock className="w-3.5 h-3.5 fill-[#c59325]/10" />
                YOUR SAFETY IS OUR PRIORITY
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                Secure Transactions,<br />Complete Peace of Mind
              </h2>

              <p className="text-sm md:text-base font-semibold text-slate-600 leading-relaxed max-w-2xl">
                Every transaction on FipMoney is monitored in real-time to detect and prevent fraud, ensuring complete safety of your money.
              </p>

              {/* Grid of Inline Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {features.map((feature, idx) => {
                  const FeatIcon = feature.icon;
                  return (
                    <div 
                      key={idx}
                      className="flex items-center gap-2.5 bg-white border border-slate-100/80 px-4 py-3 rounded-2xl shadow-sm hover:border-[#ffeebf]/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#fdfaf2] border border-[#f5ebd0]/60 flex items-center justify-center text-[#c59325] shrink-0 shadow-inner">
                        <FeatIcon className="w-4 h-4 stroke-[2]" />
                      </div>
                      <span className="text-xs font-black text-slate-800 leading-tight">
                        {feature.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Illustration */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <motion.div
                className="relative max-w-sm md:max-w-md lg:max-w-full"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={securityIllustration}
                  alt="Secure Transactions Illustration"
                  className="max-h-[320px] w-auto object-contain drop-shadow-[0_20px_50px_rgba(197,147,37,0.12)]"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
