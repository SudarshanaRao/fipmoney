import React from 'react';
import { Gift, Share2, Copy, Clock, UserPlus, Wallet } from 'lucide-react';
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

        {/* Referral Link Box */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 w-full mt-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left w-full md:w-auto">
              <h3 className="font-extrabold text-slate-800 text-xl">Your Referral Link</h3>
              <p className="text-sm text-slate-500 mt-1">Share with friends to start earning.</p>
            </div>
            {isLoggedIn && user ? (
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 w-full sm:w-72">
                  <span className="text-slate-600 font-bold text-sm truncate flex-1">{referralLink}</span>
                  <button className="text-indigo-600 hover:text-indigo-800 transition-colors shrink-0 ml-3 cursor-pointer bg-indigo-50 p-2 rounded-lg border-none outline-none">
                    <Copy size={18} />
                  </button>
                </div>
                <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all cursor-pointer border-none outline-none shadow-md shadow-indigo-600/20">
                  <Share2 size={18} /> Share Now
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 w-full md:w-auto">
                <p className="text-slate-700 font-bold text-sm">Login now and get your referral link</p>
                <button 
                  onClick={() => onNavigate?.('login')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer border-none outline-none shrink-0 shadow-md shadow-indigo-600/20"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>

        {/* How It Works Horizontal Stepper */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mt-4">
          <div className="flex items-center gap-2.5 mb-8">
            <Clock size={20} className="text-indigo-600" />
            <h3 className="font-extrabold text-slate-800 text-xl">How It Works</h3>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-0 relative px-4">
            {/* Horizontal line for desktop */}
            <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-[2px] bg-slate-100 -z-10" />

            {[
              { step: 1, title: "Share your link", desc: "Invite your friends using your unique referral link", icon: Share2, color: "text-emerald-600", bg: "bg-emerald-100" },
              { step: 2, title: "They join & verify", desc: "Your friend signs up and completes KYC", icon: UserPlus, color: "text-amber-600", bg: "bg-amber-100" },
              { step: 3, title: "Purchase Digital Gold", desc: "Friend purchases ₹250 worth of digital gold within 30 days", icon: Wallet, color: "text-blue-600", bg: "bg-blue-100" },
              { step: 4, title: "You both earn rewards", desc: "You both get ₹50 worth of digital gold as earnings", icon: Gift, color: "text-purple-600", bg: "bg-purple-100" }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-row md:flex-col items-center md:text-center gap-4 w-full md:w-1/4 relative bg-white">
                <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center border-[6px] border-white shadow-sm shrink-0`}>
                  <item.icon size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 md:mt-2">Step {item.step}</div>
                  <h4 className="font-extrabold text-slate-800 text-base mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-[200px] md:mx-auto font-medium">{item.desc}</p>
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
