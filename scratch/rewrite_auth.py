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
    <div className="relative h-14">
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
              className={`flex items-center justify-center text-xl font-black flex-1 rounded-xl transition-all border-2
                ${isActive ? 'border-[#d97706] shadow-[0_0_0_4px_rgba(217,119,6,0.1)] bg-white' : char ? 'border-[#d97706]/40 bg-[#d97706]/5 text-[#1e1b4b]' : 'border-gray-200 bg-gray-50 text-gray-300'}
              `}
            >
              {char || (isActive
                ? <motion.div className="w-0.5 h-6 rounded-full bg-[#d97706]"
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
      <div className="hidden lg:flex w-[50%] flex-col relative overflow-hidden bg-gradient-to-br from-[#fffdf5] to-[#f4e6c3] p-12">
         {/* Ambient stars/sparkles effect */}
         <div className="absolute top-[10%] right-[15%] w-4 h-4 bg-white rounded-full blur-[2px] opacity-70 animate-pulse" />
         <div className="absolute top-[40%] right-[30%] w-6 h-6 bg-white/40 blur-[8px] rounded-full animate-pulse" />
         <div className="absolute top-[60%] left-[10%] w-3 h-3 bg-white rounded-full blur-[1px] opacity-50 animate-pulse" />
         
         <div className="absolute -top-[20%] -right-[20%] w-[80%] h-[80%] bg-gradient-to-b from-white/40 to-transparent rounded-full blur-3xl opacity-60" />

         <div className="relative z-10 flex flex-col h-full">
           {/* Top Logo */}
           <div className="flex items-center gap-2 mb-12">
              <img src={fipMoneyLogo} className="w-10 h-10 object-contain" alt="Logo" />
              <span className="text-[26px] font-black text-[#1e1b4b] tracking-tight">Fipmoney</span>
           </div>

           <div className="max-w-[420px]">
              <h1 className="text-[44px] leading-[1.1] font-black text-[#1e1b4b] mb-4 tracking-tight">Secure Your Wealth with Fipmoney</h1>
              <p className="text-[#4b5563] text-[15px] font-medium mb-12 leading-relaxed max-w-[340px]">
                 Invest in 24K gold & 99.9% pure silver with complete security and transparency.
              </p>

              <div className="flex flex-col gap-8">
                 {/* Feature 1 */}
                 <div className="flex gap-5">
                    <div className="w-14 h-14 rounded-[18px] bg-[#fef0cd] flex items-center justify-center shrink-0 text-[#d97706] shadow-sm">
                       <Shield size={26} strokeWidth={2.5} />
                    </div>
                    <div>
                       <h3 className="text-[#1e1b4b] font-bold text-[16px] mb-1">100% Insured Storage</h3>
                       <p className="text-[#6b7280] text-[14px] font-medium leading-snug">Your gold & silver is stored in<br/>insured vaults.</p>
                    </div>
                 </div>
                 {/* Feature 2 */}
                 <div className="flex gap-5">
                    <div className="w-14 h-14 rounded-[18px] bg-[#fef0cd] flex items-center justify-center shrink-0 text-[#d97706] shadow-sm">
                       <Coins size={26} strokeWidth={2.5} />
                    </div>
                    <div>
                       <h3 className="text-[#1e1b4b] font-bold text-[16px] mb-1">Buy & Sell Anytime</h3>
                       <p className="text-[#6b7280] text-[14px] font-medium leading-snug">Invest, sell or redeem anytime<br/>at live market prices.</p>
                    </div>
                 </div>
                 {/* Feature 3 */}
                 <div className="flex gap-5">
                    <div className="w-14 h-14 rounded-[18px] bg-[#fef0cd] flex items-center justify-center shrink-0 text-[#d97706] shadow-sm">
                       <BarChart3 size={26} strokeWidth={2.5} />
                    </div>
                    <div>
                       <h3 className="text-[#1e1b4b] font-bold text-[16px] mb-1">Real-time Prices</h3>
                       <p className="text-[#6b7280] text-[14px] font-medium leading-snug">Track live gold & silver prices<br/>and market trends.</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Vault Image */}
           <div className="absolute bottom-20 right-[-2rem] w-[500px] z-0 pointer-events-none drop-shadow-2xl">
              <img src="/login_image.png" alt="Vault" className="w-full object-contain" />
           </div>

           {/* Bottom Glass Badge */}
           <div className="mt-auto relative z-10 w-full max-w-[480px]">
              <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-5 flex justify-between items-center shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <div className="flex gap-3 items-center">
                   <div className="text-[#d97706]"><ShieldCheck size={20} /></div>
                   <div>
                      <div className="text-[#1e1b4b] text-xs font-black uppercase tracking-wider">Secure</div>
                      <div className="text-[#6b7280] text-[10px] font-semibold mt-0.5">Bank-grade<br/>Security</div>
                   </div>
                </div>
                <div className="w-px h-8 bg-black/5" />
                <div className="flex gap-3 items-center">
                   <div className="text-[#d97706]"><User size={20} /></div>
                   <div>
                      <div className="text-[#1e1b4b] text-xs font-black uppercase tracking-wider">Trusted</div>
                      <div className="text-[#6b7280] text-[10px] font-semibold mt-0.5">By Millions of<br/>Users</div>
                   </div>
                </div>
                <div className="w-px h-8 bg-black/5" />
                <div className="flex gap-3 items-center">
                   <div className="text-[#d97706]"><CheckCircle2 size={20} /></div>
                   <div>
                      <div className="text-[#1e1b4b] text-xs font-black uppercase tracking-wider">Certified</div>
                      <div className="text-[#6b7280] text-[10px] font-semibold mt-0.5">Purity<br/>Assured</div>
                   </div>
                </div>
              </div>
           </div>
         </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col relative bg-white">
         {/* Top right language dropdown & mobile logo/home */}
         <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
            <div className="flex lg:hidden items-center gap-2">
              <img src={fipMoneyLogo} alt="FipMoney" className="h-8 object-contain" />
              <span className="font-black text-lg text-[#1e1b4b]">FipMoney</span>
            </div>
            
            <div className="flex items-center gap-3 ml-auto">
               <button onClick={() => onNavigate("home")} className="lg:hidden flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 border-none">
                 <ArrowLeft size={12} /> Home
               </button>
               <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm text-[13px] font-semibold text-[#1e1b4b] hover:bg-gray-50 transition-colors cursor-pointer outline-none">
                 <Globe size={16} className="text-gray-500" />
                 English
                 <ChevronDown size={14} className="text-gray-500" />
               </button>
            </div>
         </div>

         {/* Form Container */}
         <div className="flex-1 flex flex-col justify-center max-w-[440px] mx-auto w-full px-6 py-12 relative z-10">
            <AnimatePresence mode="wait" custom={dir}>
              {/* ══ STEP 1: MOBILE ══ */}
              {step === "mobile" && (
                 <FormSlide key="mobile" dir={dir}>
                    <div className="text-center mb-8">
                       <h2 className="text-[32px] font-black text-[#1e1b4b] mb-2 flex items-center justify-center gap-2 tracking-tight">
                         Welcome Back! <span className="text-3xl">👋</span>
                       </h2>
                       <p className="text-gray-500 text-[15px] font-medium">Login to continue to your account</p>
                    </div>

                    <div className="flex justify-center mb-10">
                       <div className="w-[100px] h-[100px] rounded-full bg-gray-50 flex items-center justify-center shadow-inner">
                          <img src={fipMoneyLogo} className="w-[50px] h-[50px] object-contain drop-shadow-md" alt="Logo" />
                       </div>
                    </div>

                    <div className="mb-6">
                       <label className="block text-[14px] font-bold text-[#1e1b4b] mb-2.5">Enter your mobile number</label>
                       <div className={`flex items-center rounded-xl border ${err ? 'border-red-400' : 'border-gray-200'} focus-within:border-[#d97706] focus-within:ring-4 focus-within:ring-[#d97706]/10 transition-all bg-white h-14`}>
                          <div className="flex items-center gap-2 px-4 border-r border-gray-200 cursor-pointer hover:bg-gray-50 h-full rounded-l-xl transition-colors">
                             <span className="text-xl">🇮🇳</span>
                             <span className="text-[15px] font-bold text-[#1e1b4b]">+91</span>
                             <ChevronDown size={14} className="text-gray-400" />
                          </div>
                          <input 
                             type="tel" inputMode="numeric" maxLength={10} value={mobile} autoFocus
                             onChange={e => handleMobileChange(e.target.value)}
                             placeholder="Enter mobile number"
                             className="flex-1 min-w-0 border-none outline-none bg-transparent px-4 text-[16px] font-bold text-[#1e1b4b] placeholder:font-medium placeholder:text-gray-400"
                          />
                          
                          {checking && <div className="pr-4"><Loader2 size={18} className="animate-spin text-[#d97706]" /></div>}
                       </div>
                       {err && <p className="text-red-500 text-xs mt-2 font-semibold">{err}</p>}
                       {!err && regStatus === "registered" && <p className="text-[#10b981] text-xs mt-2 font-bold">✓ Account found. Ready to login.</p>}
                       {!err && regStatus === "new" && <p className="text-[#d97706] text-xs mt-2 font-bold">New user detected. We'll set up your account.</p>}
                    </div>

                    <button 
                      onClick={handlePrimaryBtn}
                      disabled={btnDisabled}
                      className={`w-full h-14 rounded-xl text-[15px] font-bold text-white transition-all shadow-md flex items-center justify-center border-none outline-none cursor-pointer ${btnDisabled ? 'bg-gray-200 shadow-none text-gray-400' : 'bg-[#d97706] hover:bg-[#c26a05] hover:shadow-[0_8px_20px_rgba(217,119,6,0.25)]'}`}
                    >
                       Continue
                    </button>

                    <div className="mt-5 flex items-start gap-2 justify-center px-4">
                       <ShieldCheck size={16} className="text-gray-400 shrink-0 mt-0.5" />
                       <p className="text-[12px] font-medium text-gray-500 text-center leading-relaxed">
                          By continuing, you agree to our <span className="text-[#d97706] font-bold cursor-pointer hover:underline">Terms of Service</span><br/>and <span className="text-[#d97706] font-bold cursor-pointer hover:underline">Privacy Policy</span>
                       </p>
                    </div>

                    <div className="flex items-center gap-4 my-8">
                       <div className="flex-1 h-[1px] bg-gray-100" />
                       <span className="text-[12px] font-bold text-gray-400 bg-white px-2">OR</span>
                       <div className="flex-1 h-[1px] bg-gray-100" />
                    </div>

                    <button className="w-full bg-white border border-gray-200 rounded-[16px] p-4 flex items-center gap-4 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer outline-none shadow-sm group">
                       <div className="w-12 h-12 rounded-xl bg-[#fffdf5] border border-[#fef0cd] text-[#d97706] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Smartphone size={22} />
                       </div>
                       <div className="flex-1 text-left">
                          <div className="text-[14px] font-bold text-[#1e1b4b] mb-0.5">We'll send you a secure OTP</div>
                          <div className="text-[12px] font-medium text-gray-500">to verify your mobile number</div>
                       </div>
                       <ArrowRight size={18} className="text-[#d97706]" />
                    </button>
                    
                    <div className="mt-10 text-center">
                       <span className="text-[14px] font-medium text-gray-500">New to Fipmoney? </span>
                       <button onClick={() => {}} className="text-[14px] font-bold text-[#d97706] border-none bg-transparent cursor-pointer hover:underline outline-none">Create an account</button>
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
                       <h2 className="text-[32px] font-black text-[#1e1b4b] mb-2 tracking-tight">
                         Verify Mobile
                       </h2>
                       <p className="text-gray-500 text-[15px] font-medium">
                         Secure code sent to <span className="font-bold text-[#1e1b4b]">+91 {mobile}</span>
                       </p>
                    </div>

                    <div className="space-y-6">
                       <OtpBoxes value={otp} onChange={setOtp} />
                       
                       <div className="text-[14px] font-medium text-gray-500">
                         {canResend
                           ? <button onClick={reset} className="flex items-center gap-1.5 border-none bg-transparent cursor-pointer font-bold text-[#d97706] outline-none hover:underline">
                               <RefreshCw size={14} /> Resend OTP
                             </button>
                           : <span>Resend in <strong className="text-[#1e1b4b]">0:{timer.toString().padStart(2,"0")}</strong></span>}
                       </div>
                       
                       <button 
                         onClick={handleOtpVerify}
                         disabled={otp.length !== 6}
                         className={`w-full h-14 mt-4 rounded-xl text-[15px] font-bold text-white transition-all shadow-md flex items-center justify-center border-none outline-none cursor-pointer ${otp.length !== 6 ? 'bg-gray-200 shadow-none text-gray-400' : 'bg-[#d97706] hover:bg-[#c26a05] hover:shadow-[0_8px_20px_rgba(217,119,6,0.25)]'}`}
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
                       <h2 className="text-[32px] font-black text-[#1e1b4b] mb-2 tracking-tight">
                         Complete Profile
                       </h2>
                       <p className="text-gray-500 text-[15px] font-medium">Almost there — just a few details.</p>
                    </div>

                    <div className="space-y-5">
                       <div>
                         <label className="block text-[13px] font-bold text-[#1e1b4b] mb-2">Full Name (as per PAN)</label>
                         <input type="text" value={panName} onChange={e => setPanName(e.target.value.toUpperCase())}
                           placeholder="RAHUL KUMAR SHARMA"
                           className="w-full h-14 rounded-xl border border-gray-200 outline-none font-bold uppercase tracking-wide text-[15px] text-[#1e1b4b] px-4 focus:border-[#d97706] focus:ring-4 focus:ring-[#d97706]/10 transition-all bg-white"
                         />
                       </div>
                       <div>
                         <label className="block text-[13px] font-bold text-[#1e1b4b] mb-2">Create Password</label>
                         <div className="relative">
                           <input type={showPw ? "text" : "password"} value={password}
                             onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters"
                             className="w-full h-14 rounded-xl border border-gray-200 outline-none text-[15px] font-medium text-[#1e1b4b] px-4 pr-12 focus:border-[#d97706] focus:ring-4 focus:ring-[#d97706]/10 transition-all bg-white"
                           />
                           <button onClick={() => setShowPw(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer text-gray-400 outline-none">
                             {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                           </button>
                         </div>
                         {password && (
                           <div className="mt-3">
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
                             className={`w-full h-14 rounded-xl border outline-none text-[15px] font-medium text-[#1e1b4b] px-4 pr-12 transition-all bg-white
                               ${confirm && password !== confirm ? 'border-red-400 focus:ring-red-400/10' : 'border-gray-200 focus:border-[#d97706] focus:ring-[#d97706]/10'} focus:ring-4`}
                           />
                           <button onClick={() => setShowCp(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer text-gray-400 outline-none">
                             {showCp ? <EyeOff size={18} /> : <Eye size={18} />}
                           </button>
                         </div>
                         {confirm && password !== confirm && <p className="text-red-500 text-xs mt-2 font-semibold">Passwords don't match</p>}
                       </div>
                       
                       <button 
                         onClick={handleCreateAccount}
                         disabled={!panName || password.length < 8 || password !== confirm}
                         className={`w-full h-14 mt-4 rounded-xl text-[15px] font-bold text-white transition-all shadow-md flex items-center justify-center border-none outline-none cursor-pointer ${(!panName || password.length < 8 || password !== confirm) ? 'bg-gray-200 shadow-none text-gray-400' : 'bg-[#d97706] hover:bg-[#c26a05] hover:shadow-[0_8px_20px_rgba(217,119,6,0.25)]'}`}
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
                         className="w-28 h-28 rounded-full mx-auto mb-8 flex items-center justify-center bg-[#d97706] shadow-[0_0_60px_rgba(217,119,6,0.4)] relative">
                         <div className="absolute inset-2 border-2 border-white/40 rounded-full" />
                         <CheckCircle size={54} color="white" strokeWidth={2.5} />
                       </motion.div>
                       <h2 className="font-black text-[32px] text-[#1e1b4b] mb-3 tracking-tight">
                         {isNew ? "Account Created!" : "Welcome back!"}
                       </h2>
                       <p className="text-[15px] mb-10 text-gray-500 font-medium">Your premium digital gold portfolio awaits.</p>
                       <button 
                         onClick={() => onNavigate("dashboard")}
                         className="w-full h-14 rounded-xl text-[15px] font-bold text-white bg-[#1e1b4b] hover:bg-[#111827] transition-all shadow-[0_8px_20px_rgba(30,27,75,0.25)] flex items-center justify-center border-none outline-none cursor-pointer"
                       >
                         Go to Dashboard <ArrowRight size={18} className="ml-2" />
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

print("AuthFlow.tsx rewritten successfully.")
