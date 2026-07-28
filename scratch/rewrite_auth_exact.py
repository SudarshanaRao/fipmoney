import sys

content = """\"\"\"use client\"\"\";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CheckCircle, XCircle, RefreshCw,
  LockKeyhole, ShieldCheck, Smartphone, Eye, EyeOff, Loader2,
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
    <div className="relative h-12">
      <input
        type="tel" inputMode="numeric" maxLength={6} value={value} autoFocus
        onChange={e => onChange(e.target.value.replace(/\\D/g, "").slice(0, 6))}
        className="absolute inset-0 opacity-0 w-full h-full cursor-text z-10"
      />
      <div className="flex gap-2 pointer-events-none h-full">
        {[0,1,2,3,4,5].map(i => {
          const char = value[i] || "";
          const isActive = value.length === i;
          return (
            <motion.div key={i} animate={{ scale: char ? 1.05 : 1 }}
              className={`flex items-center justify-center text-[18px] font-black flex-1 rounded-xl transition-all border
                ${isActive ? 'border-[#d89221] shadow-[0_0_0_3px_rgba(216,146,33,0.1)] bg-white' : char ? 'border-[#d89221]/40 bg-[#d89221]/5 text-[#1e1b4b]' : 'border-gray-200 bg-gray-50 text-gray-300'}
              `}
            >
              {char || (isActive
                ? <motion.div className="w-0.5 h-5 rounded-full bg-[#d89221]"
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
    const val = raw.replace(/\\D/g,"").slice(0,10);
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
    if (!/^[6-9]\\d{9}$/.test(mobile)) { setErr("Enter a valid 10-digit mobile number"); return false; }
    setErr(""); return true;
  };

  const isNew        = regStatus === "new";
  const btnDisabled  = mobile.length !== 10 || checking || regStatus === null;

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

  const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : /[A-Z]/.test(password) && /\\d/.test(password) ? 4 : 3;
  const pwColors   = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
  const pwLabels   = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="w-full min-h-screen flex font-sans bg-white overflow-hidden">
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex w-[48%] flex-col relative overflow-hidden bg-gradient-to-br from-[#fffef7] via-[#fffbf0] to-[#faebcf] p-10 lg:p-14">
         {/* Ambient stars/sparkles effect */}
         <div className="absolute top-[8%] right-[12%] w-3 h-3 bg-white rounded-full blur-[1px] opacity-80 animate-pulse" />
         <div className="absolute top-[35%] right-[25%] w-4 h-4 bg-white/60 blur-[4px] rounded-full animate-pulse" />
         <div className="absolute top-[50%] left-[8%] w-2 h-2 bg-white rounded-full blur-[1px] opacity-60 animate-pulse" />
         
         {/* Large soft glow top right */}
         <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-gradient-to-b from-white/60 to-transparent rounded-full blur-3xl opacity-80 pointer-events-none" />

         <div className="relative z-20 flex flex-col h-full">
           {/* Top Logo */}
           <div className="flex items-center gap-2 mb-10">
              <img src={fipMoneyLogo} className="w-7 h-7 object-contain" alt="Logo" />
              <span className="text-[20px] font-black text-[#1e1b4b] tracking-tight">Fipmoney</span>
           </div>

           <div className="max-w-[420px]">
              <h1 className="text-[34px] leading-[1.2] font-black text-[#1e1b4b] mb-3 tracking-tight">
                Secure Your Wealth<br/>with Fipmoney
              </h1>
              <p className="text-[#64748b] text-[13px] font-medium mb-10 leading-relaxed max-w-[300px]">
                 Invest in 24K gold & 99.9% pure silver<br/>with complete security and transparency.
              </p>

              <div className="flex flex-col gap-6">
                 {/* Feature 1 */}
                 <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-[14px] bg-[#fef2d6] flex items-center justify-center shrink-0 text-[#d89221] shadow-sm">
                       <Shield size={20} strokeWidth={2.5} />
                    </div>
                    <div className="pt-0.5">
                       <h3 className="text-[#1e1b4b] font-bold text-[14px] mb-0.5">100% Insured Storage</h3>
                       <p className="text-[#64748b] text-[12px] font-medium leading-[1.4]">Your gold & silver is stored in<br/>insured vaults.</p>
                    </div>
                 </div>
                 {/* Feature 2 */}
                 <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-[14px] bg-[#fef2d6] flex items-center justify-center shrink-0 text-[#d89221] shadow-sm">
                       <Coins size={20} strokeWidth={2.5} />
                    </div>
                    <div className="pt-0.5">
                       <h3 className="text-[#1e1b4b] font-bold text-[14px] mb-0.5">Buy & Sell Anytime</h3>
                       <p className="text-[#64748b] text-[12px] font-medium leading-[1.4]">Invest, sell or redeem anytime<br/>at live market prices.</p>
                    </div>
                 </div>
                 {/* Feature 3 */}
                 <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-[14px] bg-[#fef2d6] flex items-center justify-center shrink-0 text-[#d89221] shadow-sm">
                       <BarChart3 size={20} strokeWidth={2.5} />
                    </div>
                    <div className="pt-0.5">
                       <h3 className="text-[#1e1b4b] font-bold text-[14px] mb-0.5">Real-time Prices</h3>
                       <p className="text-[#64748b] text-[12px] font-medium leading-[1.4]">Track live gold & silver prices<br/>and market trends.</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Vault Image Container */}
           <div className="absolute -bottom-10 right-[-3rem] w-[500px] z-0 pointer-events-none drop-shadow-2xl opacity-95">
              <img src="/login_image.png" alt="Vault" className="w-full h-auto object-contain" />
           </div>

           {/* Bottom Glass Badge */}
           <div className="mt-auto relative z-20 w-full max-w-[420px]">
              <div className="bg-white/50 backdrop-blur-md border border-white/80 rounded-2xl p-4 flex justify-between items-center shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                <div className="flex gap-2.5 items-center">
                   <div className="text-[#d89221]"><ShieldCheck size={18} /></div>
                   <div>
                      <div className="text-[#1e1b4b] text-[11px] font-black tracking-wide">Secure</div>
                      <div className="text-[#64748b] text-[10px] font-medium mt-0.5 leading-[1.1]">Bank-grade<br/>Security</div>
                   </div>
                </div>
                <div className="w-[1px] h-6 bg-black/5" />
                <div className="flex gap-2.5 items-center">
                   <div className="text-[#d89221]"><User size={18} /></div>
                   <div>
                      <div className="text-[#1e1b4b] text-[11px] font-black tracking-wide">Trusted</div>
                      <div className="text-[#64748b] text-[10px] font-medium mt-0.5 leading-[1.1]">By Millions of<br/>Users</div>
                   </div>
                </div>
                <div className="w-[1px] h-6 bg-black/5" />
                <div className="flex gap-2.5 items-center">
                   <div className="text-[#d89221]"><CheckCircle2 size={18} /></div>
                   <div>
                      <div className="text-[#1e1b4b] text-[11px] font-black tracking-wide">Certified</div>
                      <div className="text-[#64748b] text-[10px] font-medium mt-0.5 leading-[1.1]">Purity<br/>Assured</div>
                   </div>
                </div>
              </div>
           </div>
         </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col relative bg-white">
         {/* Top right language dropdown & mobile logo/home */}
         <div className="absolute top-6 left-6 right-6 lg:left-auto flex justify-between lg:justify-end items-center z-20">
            <div className="flex lg:hidden items-center gap-2">
              <img src={fipMoneyLogo} alt="FipMoney" className="h-6 object-contain" />
              <span className="font-black text-base text-[#1e1b4b]">Fipmoney</span>
            </div>
            
            <div className="flex items-center gap-3">
               <button onClick={() => onNavigate("home")} className="lg:hidden flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 border-none">
                 <ArrowLeft size={12} /> Home
               </button>
               <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm text-[12px] font-semibold text-[#1e1b4b] hover:bg-gray-50 transition-colors cursor-pointer outline-none">
                 <Globe size={14} className="text-gray-500" />
                 English
                 <ChevronDown size={12} className="text-gray-500" />
               </button>
            </div>
         </div>

         {/* Form Container */}
         <div className="flex-1 flex flex-col justify-center max-w-[360px] mx-auto w-full px-4 py-8 relative z-10">
            <AnimatePresence mode="wait" custom={dir}>
              {/* ══ STEP 1: MOBILE ══ */}
              {step === "mobile" && (
                 <FormSlide key="mobile" dir={dir}>
                    <div className="text-center mb-6">
                       <h2 className="text-[26px] font-black text-[#1e1b4b] mb-1.5 flex items-center justify-center gap-2 tracking-tight">
                         Welcome Back! <span className="text-[24px]">👋</span>
                       </h2>
                       <p className="text-[#64748b] text-[13px] font-medium">Login to continue to your account</p>
                    </div>

                    <div className="flex justify-center mb-8">
                       <div className="w-[72px] h-[72px] rounded-full bg-gray-50 flex items-center justify-center shadow-sm">
                          <img src={fipMoneyLogo} className="w-[34px] h-[34px] object-contain drop-shadow-sm" alt="Logo" />
                       </div>
                    </div>

                    <div className="mb-5">
                       <label className="block text-[13px] font-bold text-[#1e1b4b] mb-2">Enter your mobile number</label>
                       <div className={`flex items-center rounded-xl border ${err ? 'border-red-400' : 'border-gray-200'} focus-within:border-[#d89221] transition-all bg-white h-[46px]`}>
                          <div className="flex items-center gap-2 px-3 border-r border-gray-200 cursor-pointer h-full rounded-l-xl">
                             <span className="text-base">🇮🇳</span>
                             <span className="text-[13px] font-bold text-[#1e1b4b]">+91</span>
                             <ChevronDown size={12} className="text-gray-400" />
                          </div>
                          <input 
                             type="tel" inputMode="numeric" maxLength={10} value={mobile} autoFocus
                             onChange={e => handleMobileChange(e.target.value)}
                             placeholder="Enter mobile number"
                             className="flex-1 min-w-0 border-none outline-none bg-transparent px-3 text-[14px] font-semibold text-[#1e1b4b] placeholder:font-medium placeholder:text-gray-400"
                          />
                          
                          {checking && <div className="pr-3"><Loader2 size={16} className="animate-spin text-[#d89221]" /></div>}
                       </div>
                       {err && <p className="text-red-500 text-[11px] mt-1.5 font-semibold">{err}</p>}
                       {!err && regStatus === "registered" && <p className="text-[#10b981] text-[11px] mt-1.5 font-bold">✓ Account found. Ready to login.</p>}
                       {!err && regStatus === "new" && <p className="text-[#d89221] text-[11px] mt-1.5 font-bold">New user detected. We'll set up your account.</p>}
                    </div>

                    <button 
                      onClick={handlePrimaryBtn}
                      disabled={btnDisabled}
                      className={`w-full h-[46px] rounded-xl text-[14px] font-bold text-white transition-all shadow-sm flex items-center justify-center border-none outline-none cursor-pointer ${btnDisabled ? 'bg-gray-200 text-gray-400' : 'bg-[#d89221] hover:bg-[#c2811a]'}`}
                    >
                       Continue
                    </button>

                    <div className="mt-4 flex items-start justify-center px-2">
                       <ShieldCheck size={14} className="text-gray-400 shrink-0 mt-0.5 mr-1.5" />
                       <p className="text-[11px] font-medium text-gray-500 text-center leading-[1.4]">
                          By continuing, you agree to our <span className="text-[#d89221] font-bold cursor-pointer">Terms of Service</span><br/>and <span className="text-[#d89221] font-bold cursor-pointer">Privacy Policy</span>
                       </p>
                    </div>

                    <div className="flex items-center gap-3 my-6">
                       <div className="flex-1 h-[1px] bg-gray-100" />
                       <span className="text-[11px] font-bold text-gray-400 bg-white">OR</span>
                       <div className="flex-1 h-[1px] bg-gray-100" />
                    </div>

                    <button className="w-full bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer outline-none group h-[64px]">
                       <div className="w-10 h-10 rounded-lg bg-[#fffdf5] border border-[#fef0cd] text-[#d89221] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Smartphone size={18} />
                       </div>
                       <div className="flex-1 text-left">
                          <div className="text-[13px] font-bold text-[#1e1b4b] mb-0.5">We'll send you a secure OTP</div>
                          <div className="text-[11px] font-medium text-gray-500">to verify your mobile number</div>
                       </div>
                       <ChevronDown size={16} className="text-[#d89221] -rotate-90" />
                    </button>
                    
                    <div className="mt-8 text-center">
                       <span className="text-[13px] font-medium text-gray-500">New to Fipmoney? </span>
                       <button onClick={() => {}} className="text-[13px] font-bold text-[#d89221] border-none bg-transparent cursor-pointer hover:underline outline-none">Create an account</button>
                    </div>
                 </FormSlide>
              )}

              {/* ══ STEP 2: OTP ══ */}
              {step === "otp" && (
                 <FormSlide key="otp" dir={dir}>
                    <div className="mb-6">
                       <button onClick={() => back(() => setStep("mobile"))} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors bg-white cursor-pointer outline-none mb-4">
                          <ArrowLeft size={16} />
                       </button>
                       <h2 className="text-[26px] font-black text-[#1e1b4b] mb-1.5 tracking-tight">
                         Verify Mobile
                       </h2>
                       <p className="text-[#64748b] text-[13px] font-medium">
                         Secure code sent to <span className="font-bold text-[#1e1b4b]">+91 {mobile}</span>
                       </p>
                    </div>

                    <div className="space-y-5">
                       <OtpBoxes value={otp} onChange={setOtp} />
                       
                       <div className="text-[13px] font-medium text-gray-500">
                         {canResend
                           ? <button onClick={reset} className="flex items-center gap-1.5 border-none bg-transparent cursor-pointer font-bold text-[#d89221] outline-none hover:underline">
                               <RefreshCw size={12} /> Resend OTP
                             </button>
                           : <span>Resend in <strong className="text-[#1e1b4b]">0:{timer.toString().padStart(2,"0")}</strong></span>}
                       </div>
                       
                       <button 
                         onClick={handleOtpVerify}
                         disabled={otp.length !== 6}
                         className={`w-full h-[46px] rounded-xl text-[14px] font-bold text-white transition-all shadow-sm flex items-center justify-center border-none outline-none cursor-pointer ${otp.length !== 6 ? 'bg-gray-200 text-gray-400' : 'bg-[#d89221] hover:bg-[#c2811a]'}`}
                       >
                         {isNew ? "Verify & Continue" : "Verify & Login"}
                       </button>
                    </div>
                 </FormSlide>
              )}

              {/* ══ STEP 3: PROFILE (new users only) ══ */}
              {step === "profile" && (
                 <FormSlide key="profile" dir={dir}>
                    <div className="mb-6">
                       <button onClick={() => back(() => setStep("otp"))} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors bg-white cursor-pointer outline-none mb-4">
                          <ArrowLeft size={16} />
                       </button>
                       <h2 className="text-[26px] font-black text-[#1e1b4b] mb-1.5 tracking-tight">
                         Complete Profile
                       </h2>
                       <p className="text-[#64748b] text-[13px] font-medium">Almost there — just a few details.</p>
                    </div>

                    <div className="space-y-4">
                       <div>
                         <label className="block text-[12px] font-bold text-[#1e1b4b] mb-1.5">Full Name (as per PAN)</label>
                         <input type="text" value={panName} onChange={e => setPanName(e.target.value.toUpperCase())}
                           placeholder="RAHUL KUMAR SHARMA"
                           className="w-full h-[46px] rounded-xl border border-gray-200 outline-none font-bold uppercase tracking-wide text-[13px] text-[#1e1b4b] px-3 focus:border-[#d89221] transition-all bg-white"
                         />
                       </div>
                       <div>
                         <label className="block text-[12px] font-bold text-[#1e1b4b] mb-1.5">Create Password</label>
                         <div className="relative">
                           <input type={showPw ? "text" : "password"} value={password}
                             onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters"
                             className="w-full h-[46px] rounded-xl border border-gray-200 outline-none text-[13px] font-medium text-[#1e1b4b] px-3 pr-10 focus:border-[#d89221] transition-all bg-white"
                           />
                           <button onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer text-gray-400 outline-none">
                             {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                           </button>
                         </div>
                         {password && (
                           <div className="mt-2">
                             <div className="flex gap-1 mb-1">
                               {[1,2,3,4].map(i => (
                                 <div key={i} className="h-1 flex-1 rounded-full"
                                   style={{ background: i <= pwStrength ? pwColors[pwStrength] : "#f3f4f6", transition: "background 0.3s" }} />
                               ))}
                             </div>
                             <p className="text-[10px] font-bold uppercase tracking-wider m-0" style={{ color: pwColors[pwStrength] }}>{pwLabels[pwStrength]}</p>
                           </div>
                         )}
                       </div>
                       <div>
                         <label className="block text-[12px] font-bold text-[#1e1b4b] mb-1.5">Confirm Password</label>
                         <div className="relative">
                           <input type={showCp ? "text" : "password"} value={confirm}
                             onChange={e => setConfirm(e.target.value)} placeholder="Re-enter password"
                             className={`w-full h-[46px] rounded-xl border outline-none text-[13px] font-medium text-[#1e1b4b] px-3 pr-10 transition-all bg-white
                               ${confirm && password !== confirm ? 'border-red-400' : 'border-gray-200 focus:border-[#d89221]'}`}
                           />
                           <button onClick={() => setShowCp(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer text-gray-400 outline-none">
                             {showCp ? <EyeOff size={16} /> : <Eye size={16} />}
                           </button>
                         </div>
                         {confirm && password !== confirm && <p className="text-red-500 text-[11px] mt-1.5 font-semibold">Passwords don't match</p>}
                       </div>
                       
                       <button 
                         onClick={handleCreateAccount}
                         disabled={!panName || password.length < 8 || password !== confirm}
                         className={`w-full h-[46px] mt-2 rounded-xl text-[14px] font-bold text-white transition-all shadow-sm flex items-center justify-center border-none outline-none cursor-pointer ${(!panName || password.length < 8 || password !== confirm) ? 'bg-gray-200 text-gray-400' : 'bg-[#d89221] hover:bg-[#c2811a]'}`}
                       >
                         Create Account
                       </button>
                    </div>
                 </FormSlide>
              )}

              {/* ══ STEP 4: SUCCESS ══ */}
              {step === "success" && (
                 <FormSlide key="success" dir={dir}>
                    <div className="text-center py-8">
                       <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                         transition={{ type: "spring", stiffness: 200, damping: 14 }}
                         className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-[#d89221] shadow-[0_0_40px_rgba(216,146,33,0.3)] relative">
                         <div className="absolute inset-1.5 border border-white/40 rounded-full" />
                         <CheckCircle size={40} color="white" strokeWidth={2.5} />
                       </motion.div>
                       <h2 className="font-black text-[26px] text-[#1e1b4b] mb-2 tracking-tight">
                         {isNew ? "Account Created!" : "Welcome back!"}
                       </h2>
                       <p className="text-[14px] mb-8 text-[#64748b] font-medium">Your premium digital gold portfolio awaits.</p>
                       <button 
                         onClick={() => onNavigate("dashboard")}
                         className="w-full h-[46px] rounded-xl text-[14px] font-bold text-white bg-[#1e1b4b] hover:bg-[#111827] transition-all flex items-center justify-center border-none outline-none cursor-pointer"
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
"""

with open('src/app/components/AuthFlow.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("AuthFlow.tsx rewritten precisely to match font sizes and layout proportions.")
