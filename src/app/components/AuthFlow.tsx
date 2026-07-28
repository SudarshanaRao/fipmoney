"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CheckCircle, RefreshCw,
  ShieldCheck, Smartphone, Eye, EyeOff, Loader2,
  Shield, Coins, BarChart3, Globe, ChevronDown, User, CheckCircle2, ArrowRight
} from "lucide-react";
import fipMoneyLogo from "../../imports/fipmoney_logo_final.png";

const ease = [0.22, 1, 0.36, 1] as const;
type Step = "mobile" | "otp" | "profile" | "success";

const PREDEFINED_USERS = {
  "7013302191": { name: "Dharsh", kyc: "full kyc" },
  "9491841941": { name: "Finpages", kyc: "Min Kyc" },
  "7893863597": { name: "purna", kyc: "pending" }
};

const REG_KEY = (m: string) => `fm_registered_${m}`;
const isRegistered  = (m: string) => {
  if (m in PREDEFINED_USERS) return true;
  return !!localStorage.getItem(REG_KEY(m));
};
const markRegistered = (m: string) => {
  localStorage.setItem(REG_KEY(m), "1");
  if (m in PREDEFINED_USERS) {
    const user = PREDEFINED_USERS[m];
    localStorage.setItem(`fm_user_name_${m}`, user.name);
    localStorage.setItem(`fm_user_kyc_${m}`, user.kyc);
  }
};

function useResendTimer(secs = 30) {
  const [t, setT]     = useState(secs);
  const [can, setCan] = useState(false);
  useEffect(() => {
    if (t <= 0) { setCan(true); return; }
    const id = setTimeout(() => setT(v => v - 1), 1000);
    return () => clearTimeout(id);
  }, [t]);
  return { timer: t, canResend: can, reset: () => { setT(secs); setCan(false); } };
}

function FormSlide({ children, dir }: { children: React.ReactNode; dir: number }) {
  return (
    <motion.div
      custom={dir}
      initial={(d: number) => ({ x: d * 32, opacity: 0 })}
      animate={{ x: 0, opacity: 1 }}
      exit={(d: number) => ({ x: d * -32, opacity: 0 })}
      transition={{ duration: 0.26, ease }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

function OtpBoxes({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative h-14">
      <input
        type="tel" inputMode="numeric" maxLength={6} value={value} autoFocus
        onChange={e => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        className="absolute inset-0 opacity-0 w-full h-full cursor-text z-10"
      />
      <div className="flex gap-3 pointer-events-none h-full">
        {[0,1,2,3,4,5].map(i => {
          const char = value[i] || "";
          const isActive = value.length === i;
          return (
            <motion.div key={i} animate={{ scale: char ? 1.05 : 1 }}
              className={`flex items-center justify-center text-2xl font-black flex-1 rounded-xl transition-all border-2
                ${isActive ? 'border-[#d89221] shadow-[0_0_0_4px_rgba(216,146,33,0.1)] bg-white' : char ? 'border-[#d89221]/40 bg-[#d89221]/5 text-[#1e1b4b]' : 'border-gray-200 bg-gray-50 text-gray-300'}
              `}
            >
              {char || (isActive
                ? <motion.div className="w-0.5 h-6 rounded-full bg-[#d89221]"
                    animate={{ opacity: [0,1,0] }} transition={{ duration: 1, repeat: Infinity }} />
                : "·")}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function AuthFlow({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [step,     setStep]     = useState<Step>("mobile");
  const [dir,      setDir]      = useState(1);
  const [mobile,   setMobile]   = useState("");
  const [otp,      setOtp]      = useState("");
  const [err,      setErr]      = useState("");
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!localStorage.getItem("fm_registered_7013302191")) {
        localStorage.setItem("fm_registered_7013302191", "1");
        localStorage.setItem("fm_user_name_7013302191", "Dharsh");
        localStorage.setItem("fm_user_kyc_7013302191", "full kyc");
      }
      if (!localStorage.getItem("fm_registered_9491841941")) {
        localStorage.setItem("fm_registered_9491841941", "1");
        localStorage.setItem("fm_user_name_9491841941", "Finpages");
        localStorage.setItem("fm_user_kyc_9491841941", "Min Kyc");
      }
      if (!localStorage.getItem("fm_registered_7893863597")) {
        localStorage.setItem("fm_registered_7893863597", "1");
        localStorage.setItem("fm_user_name_7893863597", "purna");
        localStorage.setItem("fm_user_kyc_7893863597", "pending");
      }
    }
  }, []);

  const [checking,    setChecking]    = useState(false);
  const [regStatus,   setRegStatus]   = useState<"registered" | "new" | null>(null);

  const [panName,  setPanName]  = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [showCp,   setShowCp]   = useState(false);

  const { timer, canResend, reset } = useResendTimer(30);

  const go   = (fn: () => void) => { setDir(1);  fn(); };
  const back = (fn: () => void) => { setDir(-1); fn(); };

  const handleMobileChange = (raw: string) => {
    const val = raw.replace(/\D/g,"").slice(0,10);
    setMobile(val);
    setErr("");
    setRegStatus(null);

    if (val.length === 10) {
      setChecking(true);
      setTimeout(() => {
        setChecking(false);
        setRegStatus(isRegistered(val) ? "registered" : "new");
      }, 700);
    }
  };

  const validateMobile = () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) { setErr("Enter a valid 10-digit mobile number"); return false; }
    setErr(""); return true;
  };

  const isNew        = regStatus === "new";

  const handlePrimaryBtn = () => {
    if (!validateMobile()) return;
    reset();
    go(() => setStep("otp"));
  };

  const handleOtpVerify = () => {
    if (isNew) {
      go(() => setStep("profile"));
    } else {
      markRegistered(mobile);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("fm_logged_in_mobile", mobile);
      }
      go(() => setStep("success"));
    }
  };

  const handleCreateAccount = () => {
    markRegistered(mobile);
    if (typeof window !== "undefined") {
      localStorage.setItem(`fm_user_name_${mobile}`, panName);
      localStorage.setItem(`fm_user_kyc_${mobile}`, "full kyc");
      sessionStorage.setItem("fm_logged_in_mobile", mobile);
    }
    go(() => setStep("success"));
  };

  const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : /[A-Z]/.test(password) && /\d/.test(password) ? 4 : 3;
  const pwColors   = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
  const pwLabels   = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="w-full min-h-screen flex font-sans bg-white overflow-hidden">
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex w-[48%] flex-col relative overflow-hidden bg-gradient-to-br from-[#fffef7] via-[#fffbf0] to-[#faebcf]">
         {/* Ambient Background Effects */}
         <div className="absolute top-[10%] right-[20%] w-4 h-4 bg-white rounded-full blur-[2px] opacity-70 animate-pulse" />
         <div className="absolute top-[40%] right-[30%] w-6 h-6 bg-white/40 blur-[4px] rounded-full animate-pulse" />
         <div className="absolute top-[60%] left-[10%] w-3 h-3 bg-white rounded-full blur-[1px] opacity-50 animate-pulse" />
         <div className="absolute -top-[10%] -right-[10%] w-[70%] h-[70%] bg-gradient-to-b from-white/70 to-transparent rounded-full blur-3xl opacity-80 pointer-events-none" />

         <div className="relative z-20 flex flex-col h-full p-12 lg:p-16 w-full">
           {/* Top Logo */}
           <div className="flex items-center gap-3 mb-12">
              <img src={fipMoneyLogo} className="w-16 h-16 object-contain" alt="Logo" />
              <span className="text-4xl font-black text-[#1e1b4b] tracking-tight">Fipmoney</span>
           </div>

           <div className="max-w-[420px] relative z-20">
              <h1 className="text-[40px] leading-[1.1] font-black text-[#1e1b4b] mb-4 tracking-tight">
                Secure Your Wealth<br/>with Fipmoney
              </h1>
              <p className="text-[#64748b] text-[15px] font-medium mb-12 leading-relaxed max-w-[340px]">
                 Invest in 24K gold & 99.9% pure silver<br/>with complete security and transparency.
              </p>

              <div className="flex flex-col gap-6">
                 {/* Feature 1 */}
                 <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#fef2d6] flex items-center justify-center shrink-0 text-[#d89221] shadow-sm">
                       <Shield size={24} strokeWidth={2} />
                    </div>
                    <div className="flex flex-col justify-center">
                       <h3 className="text-[#1e1b4b] font-bold text-[14px] mb-1">100% Insured Storage</h3>
                       <p className="text-[#64748b] text-[11px] font-medium leading-[1.4]">Your gold & silver is stored in<br/>insured vaults.</p>
                    </div>
                 </div>
                 {/* Feature 2 */}
                 <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#fef2d6] flex items-center justify-center shrink-0 text-[#d89221] shadow-sm">
                       <Coins size={24} strokeWidth={2} />
                    </div>
                    <div className="flex flex-col justify-center">
                       <h3 className="text-[#1e1b4b] font-bold text-[14px] mb-1">Buy & Sell Anytime</h3>
                       <p className="text-[#64748b] text-[11px] font-medium leading-[1.4]">Invest, sell or redeem anytime<br/>at live market prices.</p>
                    </div>
                 </div>
                 {/* Feature 3 */}
                 <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#fef2d6] flex items-center justify-center shrink-0 text-[#d89221] shadow-sm">
                       <BarChart3 size={24} strokeWidth={2} />
                    </div>
                    <div className="flex flex-col justify-center">
                       <h3 className="text-[#1e1b4b] font-bold text-[14px] mb-1">Real-time Prices</h3>
                       <p className="text-[#64748b] text-[11px] font-medium leading-[1.4]">Track live gold & silver prices<br/>and market trends.</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Vault Image - Placed precisely at Bottom Right */}
           <div className="absolute bottom-[110px] right-[-20px] w-[500px] z-10 pointer-events-none opacity-100">
              <img src="/login_image.png" alt="Vault" className="w-full h-auto object-contain object-bottom right" />
           </div>

           {/* Bottom Glass Badge - Placed precisely at Bottom Left */}
           <div className="absolute bottom-12 left-12 lg:left-16 z-20">
              <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[16px] px-6 py-4 flex gap-6 items-center shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <div className="flex gap-3 items-center">
                   <div className="text-[#d89221]"><ShieldCheck size={20} /></div>
                   <div>
                      <div className="text-[#1e1b4b] text-[11px] font-black uppercase tracking-wider">Secure</div>
                      <div className="text-[#64748b] text-[10px] font-semibold mt-0.5 leading-[1.1]">Bank-grade<br/>Security</div>
                   </div>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="flex gap-3 items-center">
                   <div className="text-[#d89221]"><User size={20} /></div>
                   <div>
                      <div className="text-[#1e1b4b] text-[11px] font-black uppercase tracking-wider">Trusted</div>
                      <div className="text-[#64748b] text-[10px] font-semibold mt-0.5 leading-[1.1]">By Millions of<br/>Users</div>
                   </div>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="flex gap-3 items-center">
                   <div className="text-[#d89221]"><CheckCircle2 size={20} /></div>
                   <div>
                      <div className="text-[#1e1b4b] text-[11px] font-black uppercase tracking-wider">Certified</div>
                      <div className="text-[#64748b] text-[10px] font-semibold mt-0.5 leading-[1.1]">Purity<br/>Assured</div>
                   </div>
                </div>
              </div>
           </div>
         </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col relative bg-white h-screen">
         {/* Top right language dropdown & mobile logo */}
         <div className="absolute top-8 left-8 right-8 lg:left-auto flex justify-between lg:justify-end items-center z-20">
            <div className="flex lg:hidden items-center gap-2">
              <img src={fipMoneyLogo} alt="FipMoney" className="h-7 object-contain" />
              <span className="font-black text-xl text-[#1e1b4b]">Fipmoney</span>
            </div>
            
            <div className="flex items-center gap-3">
               <button onClick={() => onNavigate("home")} className="lg:hidden flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-gray-100 text-gray-600 border-none">
                 <ArrowLeft size={14} /> Home
               </button>
               <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm text-sm font-semibold text-[#1e1b4b] hover:bg-gray-50 transition-colors cursor-pointer outline-none">
                 <Globe size={16} className="text-gray-500" />
                 English
                 <ChevronDown size={14} className="text-gray-500" />
               </button>
            </div>
         </div>

         {/* Form Container */}
         <div className="flex-1 flex flex-col justify-center max-w-[400px] mx-auto w-full px-6 relative z-10 overflow-y-auto hide-scrollbar">
            <AnimatePresence mode="wait" custom={dir}>
              {/* ══ STEP 1: MOBILE ══ */}
              {step === "mobile" && (
                 <FormSlide key="mobile" dir={dir}>
                    <div className="text-center mb-8">
                        <h2 className="text-[28px] leading-tight font-black text-[#1e1b4b] mb-2 tracking-tight">
                          {regStatus === "registered" ? (
                            <>Welcome Back! <span className="inline-block">👋</span></>
                          ) : regStatus === "new" ? (
                            <>Create Your Account <span className="inline-block">✨</span></>
                          ) : checking ? (
                            <>Verifying Number... <span className="inline-block animate-pulse">🔍</span></>
                          ) : (
                            <>Welcome to Fipmoney <span className="inline-block">👋</span></>
                          )}
                        </h2>
                        <p className="text-[#64748b] text-[14px] font-medium leading-relaxed max-w-[340px] mx-auto">
                          {regStatus === "registered" ? (
                            <>Account found for <span className="font-bold text-[#1e1b4b]">+91 {mobile}</span>. Click continue to log in.</>
                          ) : regStatus === "new" ? (
                            <>New user detected for <span className="font-bold text-[#1e1b4b]">+91 {mobile}</span>. Click continue to sign up.</>
                          ) : checking ? (
                            <>Checking database for registered account...</>
                          ) : (
                            <>Enter your mobile number to sign in or create an account</>
                          )}
                        </p>
                    </div>

                    <div className="flex justify-center mb-8">
                       <div className="w-[120px] h-[120px] rounded-full bg-[#f8f9fa] flex items-center justify-center shadow-inner">
                          <img src={fipMoneyLogo} className="w-[95px] h-[95px] object-contain drop-shadow-sm" alt="Logo" />
                       </div>
                    </div>

                    <div className="mb-6">
                       <label className="block text-[14px] font-bold text-[#1e1b4b] mb-2.5">Enter your mobile number</label>
                       <div className={`flex items-center rounded-xl border-2 ${err ? 'border-red-400' : 'border-gray-200'} focus-within:border-[#d89221] transition-all bg-white h-[56px] relative`}>
                          <div className="flex items-center gap-2 px-4 border-r-2 border-gray-200 cursor-pointer h-full rounded-l-xl hover:bg-gray-50 transition-colors">
                             <span className="text-[18px]">🇮🇳</span>
                             <span className="text-[14px] font-bold text-[#1e1b4b]">+91</span>
                             <ChevronDown size={14} className="text-gray-400" />
                          </div>
                          <input 
                             type="tel" inputMode="numeric" maxLength={10} value={mobile} autoFocus
                             onChange={e => handleMobileChange(e.target.value)}
                             placeholder="Enter mobile number"
                             className="flex-1 min-w-0 border-none outline-none bg-transparent px-4 text-[15px] font-bold text-[#1e1b4b] placeholder:font-medium placeholder:text-gray-400 h-full"
                          />
                          
                          {checking && <div className="absolute right-4"><Loader2 size={18} className="animate-spin text-[#d89221]" /></div>}
                       </div>
                       {err && <p className="text-red-500 text-[12px] mt-2 font-semibold">{err}</p>}
                       {!err && regStatus === "registered" && (
                           <p className="text-[#10b981] text-[12px] mt-2 font-bold flex items-center justify-center gap-1 bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-200/60">
                              <CheckCircle size={14}/> Registered Account Found
                           </p>
                        )}
                        {!err && regStatus === "new" && (
                           <p className="text-[#d89221] text-[12px] mt-2 font-bold flex items-center justify-center gap-1 bg-amber-50 py-1.5 px-3 rounded-lg border border-amber-200/60">
                              ✨ New User Account Setup
                           </p>
                        )}
                    </div>

                    <button 
                      onClick={handlePrimaryBtn}
                      disabled={mobile.length !== 10 || checking}
                      className={`w-full h-[56px] rounded-xl text-[15px] font-bold text-white transition-all shadow-sm flex items-center justify-center border-none outline-none cursor-pointer ${
                          mobile.length !== 10 || checking 
                             ? 'bg-[#d89221]/80 hover:bg-[#d89221]/90 opacity-80 cursor-not-allowed' 
                             : 'bg-[#d89221] hover:bg-[#c2811a] hover:shadow-lg active:scale-[0.99]'
                       }`}
                    >
                        {checking ? (
                           <span className="flex items-center gap-2">
                              <Loader2 size={18} className="animate-spin" /> Verifying...
                           </span>
                        ) : regStatus === "registered" ? (
                           "Continue to Login"
                        ) : regStatus === "new" ? (
                           "Continue to Register"
                        ) : (
                           "Continue"
                        )}
                    </button>

                    <div className="mt-4 flex items-start justify-center gap-2 px-2">
                       <ShieldCheck size={16} className="text-gray-400 shrink-0 mt-0.5" />
                       <p className="text-[12px] font-medium text-gray-500 text-center leading-[1.5]">
                          By continuing, you agree to our <span className="text-[#d89221] font-bold cursor-pointer hover:underline">Terms of Service</span><br/>and <span className="text-[#d89221] font-bold cursor-pointer hover:underline">Privacy Policy</span>
                       </p>
                    </div>


                    

                 </FormSlide>
              )}

              {/* ══ STEP 2: OTP ══ */}
              {step === "otp" && (
                 <FormSlide key="otp" dir={dir}>
                    <div className="mb-8">
                       <button onClick={() => back(() => setStep("mobile"))} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors bg-white cursor-pointer outline-none mb-6">
                          <ArrowLeft size={18} />
                       </button>
                       <h2 className="text-[28px] font-black text-[#1e1b4b] mb-2 tracking-tight">
                         Verify Mobile
                       </h2>
                       <p className="text-[#64748b] text-[14px] font-medium">
                         Secure code sent to <span className="font-bold text-[#1e1b4b]">+91 {mobile}</span>
                       </p>
                    </div>

                    <div className="space-y-6">
                       <OtpBoxes value={otp} onChange={setOtp} />
                       
                       <div className="text-[14px] font-medium text-gray-500">
                         {canResend
                           ? <button onClick={reset} className="flex items-center gap-1.5 border-none bg-transparent cursor-pointer font-bold text-[#d89221] outline-none hover:underline">
                               <RefreshCw size={14} /> Resend OTP
                             </button>
                           : <span>Resend in <strong className="text-[#1e1b4b]">0:{timer.toString().padStart(2,"0")}</strong></span>}
                       </div>
                       
                       <button 
                         onClick={handleOtpVerify}
                         disabled={otp.length !== 6}
                         className={`w-full h-[56px] rounded-xl text-[15px] font-bold text-white transition-all shadow-sm flex items-center justify-center border-none outline-none cursor-pointer ${otp.length !== 6 ? 'bg-gray-200 text-gray-400' : 'bg-[#d89221] hover:bg-[#c2811a] hover:shadow-lg'}`}
                       >
                         {isNew ? "Verify & Continue" : "Verify & Login"}
                       </button>
                    </div>
                 </FormSlide>
              )}

              {/* ══ STEP 3: PROFILE (new users only) ══ */}
              {step === "profile" && (
                 <FormSlide key="profile" dir={dir}>
                    <div className="mb-8">
                       <button onClick={() => back(() => setStep("otp"))} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors bg-white cursor-pointer outline-none mb-6">
                          <ArrowLeft size={18} />
                       </button>
                       <h2 className="text-[28px] font-black text-[#1e1b4b] mb-2 tracking-tight">
                         Complete Profile
                       </h2>
                       <p className="text-[#64748b] text-[14px] font-medium">Almost there — just a few details.</p>
                    </div>

                    <div className="space-y-5">
                       <div>
                         <label className="block text-[13px] font-bold text-[#1e1b4b] mb-2">Full Name (as per PAN)</label>
                         <input type="text" value={panName} onChange={e => setPanName(e.target.value.toUpperCase())}
                           placeholder="RAHUL KUMAR SHARMA"
                           className="w-full h-[56px] rounded-xl border-2 border-gray-200 outline-none font-bold uppercase tracking-wide text-[14px] text-[#1e1b4b] px-4 focus:border-[#d89221] transition-all bg-white"
                         />
                       </div>
                       <div>
                         <label className="block text-[13px] font-bold text-[#1e1b4b] mb-2">Create Password</label>
                         <div className="relative">
                           <input type={showPw ? "text" : "password"} value={password}
                             onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters"
                             className="w-full h-[56px] rounded-xl border-2 border-gray-200 outline-none text-[14px] font-medium text-[#1e1b4b] px-4 pr-12 focus:border-[#d89221] transition-all bg-white"
                           />
                           <button onClick={() => setShowPw(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer text-gray-400 outline-none">
                             {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                           </button>
                         </div>
                         {password && (
                           <div className="mt-2.5">
                             <div className="flex gap-1.5 mb-1.5">
                               {[1,2,3,4].map(i => (
                                 <div key={i} className="h-1.5 flex-1 rounded-full"
                                   style={{ background: i <= pwStrength ? pwColors[pwStrength] : "#f3f4f6", transition: "background 0.3s" }} />
                               ))}
                             </div>
                             <p className="text-[11px] font-bold uppercase tracking-wider m-0" style={{ color: pwColors[pwStrength] }}>{pwLabels[pwStrength]}</p>
                           </div>
                         )}
                       </div>
                       <div>
                         <label className="block text-[13px] font-bold text-[#1e1b4b] mb-2">Confirm Password</label>
                         <div className="relative">
                           <input type={showCp ? "text" : "password"} value={confirm}
                             onChange={e => setConfirm(e.target.value)} placeholder="Re-enter password"
                             className={`w-full h-[56px] rounded-xl border-2 outline-none text-[14px] font-medium text-[#1e1b4b] px-4 pr-12 transition-all bg-white
                               ${confirm && password !== confirm ? 'border-red-400' : 'border-gray-200 focus:border-[#d89221]'}`}
                           />
                           <button onClick={() => setShowCp(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer text-gray-400 outline-none">
                             {showCp ? <EyeOff size={18} /> : <Eye size={18} />}
                           </button>
                         </div>
                         {confirm && password !== confirm && <p className="text-red-500 text-[12px] mt-2 font-semibold">Passwords don't match</p>}
                       </div>
                       
                       <button 
                         onClick={handleCreateAccount}
                         disabled={!panName || password.length < 8 || password !== confirm}
                         className={`w-full h-[56px] mt-2 rounded-xl text-[15px] font-bold text-white transition-all shadow-sm flex items-center justify-center border-none outline-none cursor-pointer ${(!panName || password.length < 8 || password !== confirm) ? 'bg-gray-200 text-gray-400' : 'bg-[#d89221] hover:bg-[#c2811a] hover:shadow-lg'}`}
                       >
                         Create Account
                       </button>
                    </div>
                 </FormSlide>
              )}

              {/* ══ STEP 4: SUCCESS ══ */}
              {step === "success" && (
                 <FormSlide key="success" dir={dir}>
                    <div className="text-center py-10">
                       <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                         transition={{ type: "spring", stiffness: 200, damping: 14 }}
                         className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center bg-[#d89221] shadow-[0_0_50px_rgba(216,146,33,0.3)] relative">
                         <div className="absolute inset-1.5 border-2 border-white/40 rounded-full" />
                         <CheckCircle size={48} color="white" strokeWidth={2.5} />
                       </motion.div>
                       <h2 className="font-black text-[32px] text-[#1e1b4b] mb-2 tracking-tight">
                         {isNew ? "Account Created!" : "Welcome to Fipmoney!"}
                       </h2>
                       <p className="text-[15px] mb-10 text-[#64748b] font-medium">Your premium digital gold portfolio awaits.</p>
                       <button 
                         onClick={() => onNavigate("dashboard")}
                         className="w-full h-[56px] rounded-xl text-[15px] font-bold text-white bg-[#1e1b4b] hover:bg-[#111827] transition-all flex items-center justify-center border-none outline-none cursor-pointer shadow-md"
                       >
                         Go to Dashboard <ChevronDown size={16} className="ml-1 -rotate-90" />
                       </button>
                    </div>
                 </FormSlide>
              )}

            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
