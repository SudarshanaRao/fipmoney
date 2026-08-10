import React from 'react';
import { Gift, Share2, Copy, Clock, UserPlus, Wallet, ArrowRight } from 'lucide-react';
import { getLoggedInUser } from '../utils/userStorage';

const ReferralProgramSection = ({ onNavigate }: { onNavigate?: (page: string) => void }) => {
  const isLoggedIn = typeof window !== 'undefined' ? !!sessionStorage.getItem("fm_logged_in_mobile") : false;
  const user = typeof window !== 'undefined' ? getLoggedInUser() : null;
  const referralCode = user?.referralCode || "DHARSH123";
  const referralLink = `https://fipmoney.com/ref/${referralCode}`;

  return (
    <section className="w-full py-14 md:py-16 bg-white font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col space-y-6">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-4">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200/50 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">
            🎁 Rewards Program
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Refer & Earn
          </h2>
          <p className="text-sm md:text-base font-semibold text-slate-500 leading-relaxed">
            Invite your friends to Fipmoney and earn exciting rewards! Both you and your friend receive a bonus when they complete their first transaction.
          </p>
        </div>

        {/* Hero Banner Component */}
        <div className="w-full bg-gradient-to-r from-[#1B1147] via-[#1E1256] to-[#120B30] rounded-[20px] md:rounded-[24px] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row shadow-[0_12px_40px_rgb(0,0,0,0.15)] mt-4">
          
          {/* Left Content */}
          <div className="w-full md:w-[60%] z-10 relative text-left">
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-white mb-6 leading-tight tracking-tight">
              Invite. <span className="text-[#FBC740]">Earn.</span> Repeat! 🚀
            </h2>
            <div className="text-white/90 text-sm md:text-[17px] mb-10 md:mb-14 max-w-lg leading-relaxed space-y-1.5 md:space-y-2 font-medium">
              <p>Share your referral link with friends.</p>
              <p>When they join and complete their first transaction,</p>
              <p>you both earn rewards!</p>
            </div>

            {/* Path UI */}
            <div className="relative flex items-center justify-between h-20 w-full max-w-[320px] md:max-w-[400px]">
              {/* SVG Path */}
              <svg className="absolute left-7 right-7 w-[calc(100%-3.5rem)] top-1/2 h-[60px] -translate-y-1/2 overflow-visible z-0" viewBox="0 0 200 60" preserveAspectRatio="none">
                <path d="M 5,30 Q 50,80 100,30 T 195,30" fill="none" stroke="#FBC740" strokeWidth="2.5" strokeDasharray="5 5" />
                <circle cx="100" cy="30" r="3.5" fill="none" stroke="#FBC740" strokeWidth="2.5" />
                <path d="M 5,30 L 14,22 M 5,30 L 14,38" fill="none" stroke="#FBC740" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 195,30 L 186,22 M 195,30 L 186,38" fill="none" stroke="#FBC740" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              
              <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full border-[2px] border-[#FBC740] bg-[#4B2F99] flex items-center justify-center z-10 shadow-[0_0_20px_rgba(251,199,64,0.3)] shrink-0">
                <UserPlus className="text-[#FBC740] w-7 h-7 md:w-8 md:h-8" />
              </div>
              
              <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full border-[2px] border-[#FBC740] bg-[#4B2F99] flex items-center justify-center z-10 shadow-[0_0_20px_rgba(251,199,64,0.3)] shrink-0">
                <Gift className="text-[#FBC740] w-7 h-7 md:w-8 md:h-8" />
              </div>
            </div>
          </div>

          {/* Right Side - Coins Image */}
          <div className="w-full md:w-[40%] h-48 md:h-auto mt-6 md:mt-0 relative flex justify-end items-center md:absolute right-0 top-0 bottom-0 pointer-events-none pr-4 md:pr-0">
            <img 
              src="/gold_refer.png" 
              alt="Referral Rewards" 
              className="h-full max-h-[220px] md:max-h-[300px] w-auto object-contain drop-shadow-2xl md:absolute md:right-8 md:top-1/2 md:-translate-y-1/2" 
            />
          </div>
        </div>

        {/* Unified Referral & How It Works Card */}
        <div className="bg-white rounded-[32px] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 w-full mt-10 flex flex-col">
          
          {/* Top Section: Your Referral Link */}
          <div className="flex flex-col xl:flex-row items-center justify-between gap-10 w-full">
            
            {/* Left: Link Icon, Text, Input */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 w-full xl:w-auto">
              <div className="w-[84px] h-[84px] rounded-full bg-gradient-to-br from-white to-amber-50 flex items-center justify-center shadow-[0_8px_24px_rgba(251,199,64,0.15)] shrink-0 relative border border-amber-100/50">
                <svg className="w-9 h-9 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <div className="absolute top-2.5 left-2.5 w-1.5 h-1.5 bg-amber-400 rounded-full rotate-45"></div>
                <div className="absolute bottom-4 right-2.5 w-2 h-2 bg-amber-400 rounded-full rotate-45"></div>
              </div>
              
              <div className="flex flex-col items-center sm:items-start w-full">
                <h3 className="text-[28px] md:text-3xl font-extrabold text-slate-800 tracking-tight">
                  Your <span className="text-amber-500">Referral</span> Link
                </h3>
                <p className="text-[15px] text-slate-500 mt-1.5 mb-6">Share with friends to start earning rewards together!</p>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                  <div className="bg-[#fffcf5] border border-amber-200/60 rounded-xl px-4 py-3.5 w-full sm:w-[340px]">
                    <span className="text-slate-700 font-bold text-sm truncate block w-full text-center sm:text-left">
                      {isLoggedIn ? referralLink : "Login to view referral code"}
                    </span>
                  </div>
                  {isLoggedIn ? (
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-amber-200 text-amber-600 font-bold text-sm px-7 py-3.5 rounded-xl hover:bg-amber-50 transition-colors shadow-sm bg-white cursor-pointer">
                      <Copy size={18} /> Copy Link
                    </button>
                  ) : (
                    <button onClick={() => onNavigate?.('login')} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-7 py-3.5 rounded-xl transition-colors shadow-md shadow-indigo-600/20 cursor-pointer">
                      Login <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Rewards Banner (Always showing Share box) */}
            <div className="bg-slate-50/80 border border-slate-100 rounded-3xl p-6 sm:p-8 flex items-center justify-between gap-6 relative overflow-hidden w-full xl:w-auto min-w-[340px]">
              <div className="z-10 flex flex-col items-start pt-2">
                <p className="text-slate-700 font-bold text-[15px] whitespace-nowrap leading-snug mb-5">
                  Share directly with your friends!
                </p>
                <button onClick={() => !isLoggedIn && onNavigate?.('login')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 cursor-pointer">
                  <Share2 size={16} /> Share Now
                </button>
              </div>
              <div className="absolute right-0 bottom-0 h-[120%] w-[180px] pointer-events-none translate-y-3 translate-x-3">
                <img src="/gold_refer.png" alt="Rewards" className="object-contain h-full w-full object-right-bottom drop-shadow-xl" />
              </div>
            </div>
          </div>

          {/* Separator & How It Works */}
          <div className="relative flex flex-col items-center justify-center mt-8 mb-8 w-full">
            <div className="absolute left-0 right-0 top-[50%] -translate-y-1/2 h-[1px] border-t border-slate-100 -z-10"></div>
            
            <div className="flex items-center justify-center gap-4 bg-white px-6 z-10">
              <div className="h-[2px] w-12 sm:w-20 bg-amber-200 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400"></div>
              </div>
              <h3 className="text-xl md:text-[22px] font-black text-[#1B1147]">How It Works</h3>
              <div className="h-[2px] w-12 sm:w-20 bg-amber-200 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400"></div>
              </div>
            </div>
          </div>

          {/* Stepper Cards */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 md:gap-4 relative px-2 sm:px-6 w-full mb-4">
            {/* Horizontal dashed line for desktop */}
            <div className="hidden md:block absolute top-[44px] left-[12%] right-[12%] h-[1.5px] border-t-[1.5px] border-dashed border-slate-200 -z-10" />

            {[
              { step: "01", title: "Share your link", desc: "Invite your friends using your unique referral link.", icon: Share2, color: "text-emerald-500", bg: "bg-emerald-50", badgeBg: "#10b981" },
              { step: "02", title: "They join & verify", desc: "Your friends sign up and complete KYC.", icon: UserPlus, color: "text-amber-500", bg: "bg-amber-50", badgeBg: "#f59e0b" },
              { step: "03", title: "Purchase Digital Gold", desc: "Friend purchases ₹500 worth of digital gold within 30 days.", icon: Wallet, color: "text-blue-500", bg: "bg-blue-50", badgeBg: "#3b82f6" },
              { step: "04", title: "You both earn rewards", desc: "You both get ₹50 wallet credit as a reward for investing!", icon: Gift, color: "text-purple-500", bg: "bg-purple-50", badgeBg: "#8b5cf6" }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center gap-5 w-full md:w-1/4 relative bg-white group">
                <div className={`w-[88px] h-[88px] rounded-full ${item.bg} ${item.color} flex items-center justify-center border-[8px] border-white shadow-[0_4px_15px_rgba(0,0,0,0.04)] shrink-0 relative z-10 transition-transform group-hover:-translate-y-1`}>
                  <item.icon size={30} strokeWidth={2} />
                  {/* Step bubble */}
                  <div className="absolute -bottom-3 w-8 h-8 rounded-full text-white flex items-center justify-center text-[11px] font-black border-2 border-white shadow-sm" style={{ backgroundColor: item.badgeBg }}>
                     {item.step}
                  </div>
                </div>
                <div className="mt-1 flex flex-col items-center">
                  <h4 className="font-extrabold text-slate-800 text-base mb-2">{item.title}</h4>
                  <p className="text-[13px] text-slate-500 leading-relaxed max-w-[190px] font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default ReferralProgramSection;
