"use client";

import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Smartphone, 
  CreditCard, 
  ShieldCheck, 
  Users, 
  Star, 
  Lock, 
  User, 
  Lightbulb, 
  Heart 
} from "lucide-react";

import aboutHeroFolder from "../../assets/about_hero_folder.png";
import aboutVisionMountain from "../../assets/about_vision_mountain.png";
import aboutMissionCompass from "../../assets/about_mission_compass.png";

interface AboutUsProps {
  onBack: () => void;
}

// Gold Bars Custom SVG Icon
const GoldBarsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M2 20h20" />
    <path d="M5 20l2-8h10l2 8" />
    <path d="M7 12l1.5-6h7l1.5 6" />
  </svg>
);

export default function AboutUs({ onBack }: AboutUsProps) {
  const services = [
    { label: "Recharge & Bills", icon: Smartphone },
    { label: "Credit Card Payments", icon: CreditCard },
    { label: "Digital Gold & Silver", icon: GoldBarsIcon },
    { label: "Secure & Reliable", icon: ShieldCheck },
  ];

  const values = [
    {
      title: "Customer First",
      desc: "We put our users at the heart of everything we do.",
      icon: User,
    },
    {
      title: "Trust & Transparency",
      desc: "We believe in building trust through honesty and clear communication.",
      icon: ShieldCheck,
    },
    {
      title: "Innovation",
      desc: "We constantly innovate to bring you better and smarter solutions.",
      icon: Lightbulb,
    },
    {
      title: "Security",
      desc: "Your data and money are always protected with top-notch security.",
      icon: Lock,
    },
  ];

  return (
    <motion.div
      className="min-h-screen bg-[#fafbfc] text-slate-900 pb-16 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* BACKGROUND CONCENTRIC CIRCULAR GLOW TRACKS */}
      <div className="absolute right-0 top-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <svg 
          className="absolute top-[-15%] right-[-15%] w-[85%] h-[130%] opacity-[0.28]" 
          viewBox="0 0 1000 1000" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="750" cy="250" r="180" stroke="url(#goldGrad)" strokeWidth="1.2" />
          <circle cx="750" cy="250" r="280" stroke="url(#goldGrad)" strokeWidth="1.6" />
          <circle cx="750" cy="250" r="380" stroke="url(#goldGrad)" strokeWidth="2.2" />
          <circle cx="750" cy="250" r="480" stroke="url(#goldGrad)" strokeWidth="2.6" strokeDasharray="6 6" />
          <circle cx="750" cy="250" r="580" stroke="url(#goldGrad)" strokeWidth="3.2" />
          <circle cx="750" cy="250" r="680" stroke="url(#goldGrad)" strokeWidth="3.8" />
          <circle cx="750" cy="250" r="780" stroke="url(#goldGrad)" strokeWidth="4.4" />
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c59325" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#f5ebd0" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#c59325" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Header spanning full width */}
      <header className="w-full px-6 md:px-12 lg:px-20 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-4">
          {/* Fipmoney Logo */}
          <div className="flex items-center cursor-pointer" onClick={onBack}>
            <img
              src="/fipmoney_logo_final.png"
              alt="FipMoney Logo"
              className="h-12 md:h-14 w-auto object-contain"
            />
          </div>

          <div className="h-6 w-[1.5px] bg-slate-200/80" />

          {/* About Us Heading */}
          <span className="text-[#c59325] text-xs md:text-sm font-black uppercase tracking-wider bg-amber-50/90 border border-amber-200/80 px-3.5 py-1 rounded-full shadow-2xs">
            ABOUT US
          </span>
        </div>

        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-slate-200 bg-white font-extrabold text-xs text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-sm hover:shadow z-30"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </header>

      {/* Main container spanning full width with responsive margins */}
      <div className="w-full px-6 md:px-12 lg:px-20 space-y-12 relative z-10">
        
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-4">
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight">
                Fipmoney is built to<br />
                <span className="text-[#c59325] bg-gradient-to-r from-[#c59325] to-[#e0b034] bg-clip-text text-transparent">
                  Simplify Your Finances
                </span>
              </h1>

              <p className="text-sm md:text-base font-semibold text-slate-500 leading-relaxed max-w-3xl">
                Fipmoney is your all-in-one financial companion that helps you save, pay, invest and grow — all in one secure and seamless platform.
              </p>
            </div>

            {/* Feature Icons Row */}
            <div className="grid grid-cols-4 gap-4 max-w-xl">
              {services.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="flex flex-col items-center text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[#c59325] shadow-sm hover:shadow-md hover:border-amber-100/50 hover:scale-105 transition-all duration-300">
                      <IconComponent className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-black text-slate-700 leading-tight">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 3D Illustration */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              className="relative max-w-md lg:max-w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={aboutHeroFolder}
                alt="About Fipmoney Illustration"
                className="max-h-[380px] w-auto object-contain drop-shadow-[0_20px_50px_rgba(197,147,37,0.08)]"
              />
            </motion.div>
          </div>
        </section>

        {/* STATISTICS CONTAINER */}
        <section className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Stat 1 */}
            <div className="flex items-center justify-center space-x-4 pb-6 md:pb-0 md:px-6">
              <div className="w-12 h-12 rounded-full bg-[#fdfaf2] border border-[#f5ebd0]/60 flex items-center justify-center text-[#c59325] shrink-0">
                <Users className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-black text-slate-900">100K+</div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-wider">Happy Users</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center justify-center space-x-4 py-6 md:py-0 md:px-6">
              <div className="w-12 h-12 rounded-full bg-[#fdfaf2] border border-[#f5ebd0]/60 flex items-center justify-center text-[#c59325] shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-black text-slate-900">1M+</div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-wider">Secure Transactions</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center justify-center space-x-4 pt-6 md:pt-0 md:px-6">
              <div className="w-12 h-12 rounded-full bg-[#fdfaf2] border border-[#f5ebd0]/60 flex items-center justify-center text-[#c59325] shrink-0">
                <Star className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-black text-slate-900">25+</div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-wider">Services</div>
              </div>
            </div>
          </div>
        </section>

        {/* THREE COLUMN DETAILS SECTION (Mission, Vision, Values) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* COLUMN 1: Our Mission */}
          <motion.div
            className="rounded-[1.5rem] text-white p-8 relative overflow-hidden flex flex-col justify-between h-[285px] border border-slate-950 shadow-sm"
            style={{
              background: "radial-gradient(circle at 80% 80%, rgba(197, 147, 37, 0.16) 0%, rgba(12, 13, 18, 1) 75%)"
            }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-2 z-10 max-w-[60%] relative text-left">
              <span className="text-[#ffd152] text-4xl font-serif leading-none block h-4">“</span>
              <h3 className="text-xl font-black text-[#ffd152] tracking-tight">Our Mission</h3>
              {/* Golden accent line underneath title */}
              <div className="w-8 h-[2px] bg-[#ffd152] mt-1.5 mb-2.5" />
              <p className="text-[11px] font-bold text-slate-300 leading-relaxed">
                To empower every individual in India with simple, secure and smart financial solutions.
              </p>
            </div>
            {/* Compass Image positioned in the bottom-right corner below text */}
            <div className="absolute right-0 bottom-0 w-[55%] h-[80%] pointer-events-none z-0 flex items-end justify-end">
              <img 
                src={aboutMissionCompass} 
                alt="Our Mission Compass" 
                className="max-h-full max-w-full object-contain object-right-bottom select-none"
              />
            </div>
          </motion.div>

          {/* COLUMN 2: Our Vision */}
          <motion.div
            className="rounded-[1.5rem] border border-slate-200/60 p-8 relative overflow-hidden flex flex-col justify-between h-[285px] shadow-sm"
            style={{
              background: "radial-gradient(circle at 80% 80%, rgba(245, 235, 208, 0.35) 0%, rgba(248, 250, 252, 1) 75%)"
            }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-2 z-10 max-w-[55%] relative text-left">
              <div className="h-4" /> {/* spacer */}
              <h3 className="text-xl font-black text-[#c59325] tracking-tight">Our Vision</h3>
              {/* Golden accent line underneath title */}
              <div className="w-8 h-[2px] bg-[#c59325] mt-1.5 mb-2.5" />
              <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
                To become India's most trusted financial ecosystem where everyone can achieve financial freedom effortlessly.
              </p>
            </div>
            {/* Mountain Image positioned in the bottom-right corner below text */}
            <div className="absolute right-0 bottom-0 w-[60%] h-[85%] pointer-events-none z-0 flex items-end justify-end">
              <img 
                src={aboutVisionMountain} 
                alt="Our Vision Mountain" 
                className="max-h-full max-w-full object-contain object-right-bottom select-none"
              />
            </div>
          </motion.div>

          {/* COLUMN 3: Our Values */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 rounded-[1.5rem] bg-[#f8fafc] border border-slate-200/50 p-5 flex flex-col justify-between h-[285px] shadow-sm">
            <h3 className="text-base font-black text-slate-800 text-center tracking-tight mb-2">Our Values</h3>
            
            <div className="space-y-2 flex-1 flex flex-col justify-between">
              {values.map((val, idx) => {
                const ValIcon = val.icon;
                return (
                  <div 
                    key={idx} 
                    className="flex items-center space-x-3 bg-white border border-slate-100/80 px-3 py-2 rounded-xl shadow-sm hover:border-amber-100/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-white border border-[#f5ebd0] flex items-center justify-center text-[#c59325] shrink-0 shadow-sm">
                      <ValIcon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-[10px] font-black text-slate-900 leading-tight">
                        {val.title}
                      </h4>
                      <p className="text-[9px] font-semibold text-slate-400 leading-relaxed mt-0.5">
                        {val.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BOTTOM BANNER */}
        <section className="rounded-3xl bg-[#fdfaf2] border border-[#f5ebd0]/60 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Allura&display=swap');
            .cursive-thankyou {
              font-family: 'Allura', cursive;
            }
          `}</style>
          
          <div className="flex items-center space-x-5 text-left">
            <div className="w-16 h-16 rounded-full bg-white border-4 border-[#fcf8ee] flex items-center justify-center shadow-[0_4px_12px_rgba(197,147,37,0.08)] shrink-0">
              <Heart className="w-7 h-7 fill-[#c59325] text-[#c59325] stroke-[1.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-500">Fipmoney is more than just an app,</span>
              <span className="text-base font-black text-slate-900">it's a step towards your financial freedom.</span>
            </div>
          </div>
          
          <div className="shrink-0 text-center md:text-right pr-4">
            <span className="cursive-thankyou text-4xl md:text-5xl text-[#c59325] font-normal leading-none block">
              Thank you for being a part of our journey!
            </span>
          </div>
        </section>

      </div>
    </motion.div>
  );
}