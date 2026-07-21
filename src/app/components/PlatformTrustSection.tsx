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
      title: "Bank-Grade Security",
      desc: "Your data and transactions are protected with advanced encryption and security protocols.",
      icon: Shield,
    },
    {
      title: "Lightning Fast",
      desc: "Experience instant payments and smooth transactions every time, every where.",
      icon: Zap,
    },
    {
      title: "Reliable & Efficient",
      desc: "Our robust infrastructure ensures high availability and uninterrupted services.",
      icon: Award,
    },
    {
      title: "Always Here for You",
      desc: "Our dedicated support team is available round the clock to assist you.",
      icon: Headphones,
    },
    {
      title: "Built for Simplicity",
      desc: "A clean, intuitive and easy-to-use experience designed for everyone.",
      icon: Smartphone,
    },
  ];

  const features = [
    { label: "Fraud Detection", icon: Shield },
    { label: "Real-time Monitoring", icon: Lock },
    { label: "Trusted Partners", icon: Users },
    { label: "Data Protection", icon: Database },
  ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl space-y-16">
        
        {/* TOP SECTION: A Platform You Can Count On */}
        <div className="space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <motion.div 
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#fdfaf2] border border-[#f5ebd0] text-[#c59325] text-xs font-black tracking-wider uppercase shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Shield className="w-3.5 h-3.5 fill-[#c59325]/10" />
              SECURE, RELIABLE & ALWAYS WITH YOU
            </motion.div>
            
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              A Platform You Can Count On
            </h2>
            
            <p className="text-sm md:text-base font-semibold text-slate-500 leading-relaxed max-w-2xl mx-auto">
              We combine technology, security and innovation to deliver
              a seamless financial experience you can trust.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {cards.map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <motion.div
                  key={idx}
                  className="bg-white border border-slate-100 rounded-[2rem] p-6 flex flex-col justify-between items-center text-center hover:shadow-xl hover:border-amber-100/50 transition-all duration-300 group"
                  whileHover={{ y: -6 }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className="flex flex-col items-center">
                    {/* Icon Container */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#fffbeb] to-[#fef3c7] flex items-center justify-center text-[#c59325] mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-7 h-7 stroke-[2]" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-black text-slate-900 mb-3">
                      {card.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-xs font-semibold text-slate-500 leading-relaxed mb-6">
                      {card.desc}
                    </p>
                  </div>

                  {/* Arrow Button */}
                  <div className="w-9 h-9 rounded-full bg-[#fdfdfd] border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#fff9e6] group-hover:border-[#ffeebf] group-hover:text-[#c59325] transition-all duration-300 cursor-pointer shadow-sm">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM SECTION: Secure Transactions Banner */}
        <motion.div
          className="rounded-[2.5rem] bg-gradient-to-r from-[#fdfaf2] via-[#fdfbf7] to-white border border-[#f5ebd0]/60 p-8 md:p-12 relative overflow-hidden"
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
