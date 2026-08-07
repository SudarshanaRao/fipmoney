import React from 'react';
import { Gift, UserPlus, ShoppingCart, User, Infinity, Copy, Share2, ShieldCheck, Coins, UserCheck } from 'lucide-react';
import { getLoggedInUser } from '../utils/userStorage';

const ReferralProgramSection = ({ onNavigate }: { onNavigate?: (page: string) => void }) => {
  const isLoggedIn = typeof window !== 'undefined' ? !!sessionStorage.getItem("fm_logged_in_mobile") : false;
  const user = typeof window !== 'undefined' ? getLoggedInUser() : null;
  const referralCode = user?.referralCode || "FM123456";
  const referralLink = `https://test.fipmoney.com/register?ref=${referralCode}`;

  return (
    <section className="w-full py-16 bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Main Container */}
      <div className="w-full max-w-[1300px] bg-[#fefcf6] border border-[#f0e3c5] rounded-[32px] p-6 sm:p-8 lg:p-12 flex flex-col gap-10 shadow-sm relative overflow-hidden">
        
        {/* Top Section (Left Content + Right Image) */}
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-0">
          
          {/* Left Content */}
          <div className="w-full lg:w-[55%] flex flex-col justify-center pr-0 lg:pr-10 z-10">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4e6c3] text-[#a47b2c] text-[12px] font-bold w-fit mb-5">
              <Gift size={14} />
              <span>REFER & EARN</span>
            </div>
            
            {/* Title */}
            <h2 className="text-[36px] xl:text-[46px] font-extrabold text-[#1c223a] leading-[1.1] tracking-tight mb-4">
              Refer Friends.<br />
              <span className="text-[#b8860b]">Earn ₹50.</span> They Get ₹50.
            </h2>
            
            {/* Description */}
            <p className="text-[#5a6279] text-[15px] xl:text-[17px] leading-relaxed max-w-[90%] mb-8">
              Invite your friends to Fipmoney, When they sign up and purchase min. <span className="text-[#b8860b] font-bold">₹250/-</span> worth gold within <span className="text-[#b8860b] font-bold">30 days</span>, you both get <span className="text-[#b8860b] font-bold">₹50</span> in your wallet.
            </p>
            
            {/* Info Circles */}
            <div className="flex flex-wrap items-center gap-4 xl:gap-6 mb-8">
              {/* 1 */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 xl:w-14 xl:h-14 rounded-full bg-[#fdf2d5] flex items-center justify-center shrink-0">
                  <UserPlus className="text-[#b8860b]" size={24} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-semibold text-[#5a6279]">You Get</span>
                  <span className="text-[22px] xl:text-[26px] font-extrabold text-[#1c223a] leading-none mb-0.5">₹50</span>
                  <span className="text-[11px] font-semibold text-[#8b92a5]">in your wallet</span>
                </div>
              </div>
              
              <div className="hidden md:block w-px h-10 bg-[#f0e3c5]"></div>
              
              {/* 2 */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 xl:w-14 xl:h-14 rounded-full bg-[#fdf2d5] flex items-center justify-center shrink-0">
                  <ShoppingCart className="text-[#b8860b]" size={24} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-semibold text-[#5a6279]">They Buy</span>
                  <span className="text-[22px] xl:text-[26px] font-extrabold text-[#1c223a] leading-none mb-0.5">₹250+</span>
                  <span className="text-[11px] font-semibold text-[#8b92a5]">worth gold<br/>within 30 days</span>
                </div>
              </div>
              
              <div className="hidden md:block w-px h-10 bg-[#f0e3c5]"></div>

              {/* 3 */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 xl:w-14 xl:h-14 rounded-full bg-[#fdf2d5] flex items-center justify-center shrink-0">
                  <User className="text-[#b8860b]" size={24} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-semibold text-[#5a6279]">They Get</span>
                  <span className="text-[22px] xl:text-[26px] font-extrabold text-[#1c223a] leading-none mb-0.5">₹50</span>
                  <span className="text-[11px] font-semibold text-[#8b92a5]">in their wallet</span>
                </div>
              </div>
            </div>
            
            {/* Infinity Text */}
            <div className="flex items-center gap-2 mb-8">
              <Infinity className="text-[#b8860b]" size={18} strokeWidth={3} />
              <span className="text-[14px] font-bold text-[#1c223a]">Refer more. Earn more. There's no limit!</span>
            </div>
            
            {/* Referral Link Box */}
            <div className="bg-[#fdf9ef] border border-[#f0e3c5] rounded-[16px] p-5 max-w-[550px] w-full">
              <label className="block text-[13px] font-extrabold text-[#1c223a] mb-3">Your Referral Link</label>
              {isLoggedIn && user ? (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex-1 w-full flex items-center bg-[#fefcf6] border border-[#ebdcb9] rounded-[10px] px-3 py-2.5">
                    <input 
                      type="text" 
                      value={referralLink} 
                      readOnly 
                      className="w-full bg-transparent border-none outline-none text-[#5a6279] text-[13px] font-medium truncate"
                    />
                    <button className="text-[#b8860b] hover:text-[#886421] transition-colors shrink-0 ml-2 cursor-pointer bg-[#fdf2d5] hover:bg-[#f9e9be] w-8 h-8 rounded flex items-center justify-center border-none outline-none">
                      <Copy size={16} />
                    </button>
                  </div>
                  <button className="w-full sm:w-auto bg-[#b8860b] hover:bg-[#a67c29] text-white px-6 py-3 rounded-[10px] flex items-center justify-center gap-2 font-bold text-[14px] transition-all cursor-pointer border-none outline-none shrink-0 shadow-sm">
                    <Share2 size={16} /> Share Now
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-[#fefcf6] border border-[#ebdcb9] rounded-[10px] px-4 py-4">
                  <p className="text-[#1c223a] font-bold text-[14px]">Login now and get your referral link</p>
                  <button 
                    onClick={() => onNavigate?.('login')}
                    className="bg-[#b8860b] hover:bg-[#a67c29] text-white px-5 py-2.5 rounded-lg font-bold text-[13px] transition-all cursor-pointer border-none outline-none shrink-0"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
            
          </div>
          
          {/* Right Asset Area */}
          <div className="w-full lg:w-[45%] flex items-center justify-center relative z-0">
            <img 
              src="/Referral_asset.png" 
              alt="Referral Rewards" 
              className="w-[110%] max-w-[650px] object-contain drop-shadow-2xl lg:absolute lg:right-[-10%] lg:top-1/2 lg:transform lg:-translate-y-1/2" 
            />
          </div>
          
        </div>
        
      </div>
    </section>
  );
};

export default ReferralProgramSection;
