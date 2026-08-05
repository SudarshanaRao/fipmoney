import React from 'react';
import { Gift, UserPlus, ShoppingCart, User, Infinity, Copy, Share2, ShieldCheck, Coins, UserCheck } from 'lucide-react';
import { getLoggedInUser } from '../utils/userStorage';

const ReferralProgramSection = () => {
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
        
        {/* Bottom Section (How it works + Footer) */}
        <div className="flex flex-col gap-5 z-10 w-full mt-4 lg:mt-0">
          
          {/* How It Works Container */}
          <div className="bg-[#fdfaf2] border border-[#f0e3c5] rounded-[20px] p-6 lg:p-8 w-full overflow-x-auto no-scrollbar">
            <h3 className="text-[17px] font-extrabold text-[#1c223a] mb-6 flex flex-col gap-1.5 w-fit">
              How it works?
              <div className="w-8 h-1 bg-[#b8860b] rounded-full"></div>
            </h3>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full min-w-[700px] gap-6 md:gap-0">
              
              {/* Step 1 */}
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-full bg-[#fdf2d5] flex items-center justify-center shrink-0 border-[3px] border-white shadow-sm">
                  <UserPlus className="text-[#b8860b]" size={22} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-[#1c223a] text-[14px] mb-1">1. Refer a Friend</span>
                  <span className="text-[12px] text-[#5a6279] font-medium leading-tight max-w-[140px]">Share your referral link with your friends</span>
                </div>
              </div>
              
              {/* Arrow 1 */}
              <div className="hidden md:flex flex-1 px-4 items-center justify-center text-[#d4c39f]">
                <div className="w-full border-t-[1.5px] border-dashed border-[#d4c39f] relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 border-t-[1.5px] border-r-[1.5px] border-[#d4c39f] w-2 h-2 transform rotate-45"></div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-full bg-[#fdf2d5] flex items-center justify-center shrink-0 border-[3px] border-white shadow-sm">
                  <UserCheck className="text-[#b8860b]" size={22} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-[#1c223a] text-[14px] mb-1">2. They Sign Up</span>
                  <span className="text-[12px] text-[#5a6279] font-medium leading-tight max-w-[140px]">Your friend signs up on Fipmoney</span>
                </div>
              </div>
              
              {/* Arrow 2 */}
              <div className="hidden md:flex flex-1 px-4 items-center justify-center text-[#d4c39f]">
                <div className="w-full border-t-[1.5px] border-dashed border-[#d4c39f] relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 border-t-[1.5px] border-r-[1.5px] border-[#d4c39f] w-2 h-2 transform rotate-45"></div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-full bg-[#fdf2d5] flex items-center justify-center shrink-0 border-[3px] border-white shadow-sm">
                  <ShoppingCart className="text-[#b8860b]" size={22} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-[#1c223a] text-[14px] mb-1">3. They Buy Gold</span>
                  <span className="text-[12px] text-[#5a6279] font-medium leading-tight max-w-[140px]">They purchase min. ₹250 worth gold within 30 days</span>
                </div>
              </div>
              
              {/* Arrow 3 */}
              <div className="hidden md:flex flex-1 px-4 items-center justify-center text-[#d4c39f]">
                <div className="w-full border-t-[1.5px] border-dashed border-[#d4c39f] relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 border-t-[1.5px] border-r-[1.5px] border-[#d4c39f] w-2 h-2 transform rotate-45"></div>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-full bg-[#fdf2d5] flex items-center justify-center shrink-0 border-[3px] border-white shadow-sm">
                  <Gift className="text-[#b8860b]" size={22} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-[#1c223a] text-[14px] mb-1">4. You Both Earn</span>
                  <span className="text-[12px] text-[#5a6279] font-medium leading-tight max-w-[140px]">You and your friend get ₹50 in your wallet</span>
                </div>
              </div>
              
            </div>
          </div>
          
          {/* Footer Bar */}
          <div className="bg-[#fcf2d9] rounded-[16px] py-4 px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-[#a47b2c] shrink-0" size={18} strokeWidth={2.5} />
              <span className="text-[12.5px] font-extrabold text-[#8a6b2d]">Valid only when your friend purchases min. ₹250/- worth gold within 30 days of sign up.</span>
            </div>
            <div className="flex items-center gap-3">
              <Coins className="text-[#a47b2c] shrink-0" size={18} strokeWidth={2.5} />
              <span className="text-[12.5px] font-extrabold text-[#8a6b2d]">Earn as much as you can. There's no limit on rewards!</span>
            </div>
          </div>
          
        </div>
        
      </div>
    </section>
  );
};

export default ReferralProgramSection;
