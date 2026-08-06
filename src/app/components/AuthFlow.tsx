"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CheckCircle, RefreshCw,
  ShieldCheck, Smartphone, Eye, EyeOff, Loader2, XCircle,
  Shield, Coins, BarChart3, Globe, ChevronDown, User, CheckCircle2, ArrowRight
} from "lucide-react";
import fipMoneyLogo from "../../imports/fipmoney_logo_final.png";
import { saveLoggedInUser, MongoUser } from "../utils/userStorage";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../utils/apiConfig";
import { authTranslations, Language } from "../utils/translations";

const ease = [0.22, 1, 0.36, 1] as const;
type Step = "mobile" | "otp" | "profile" | "tpin" | "success";

const REG_KEY = (m: string) => `fm_registered_${m}`;
const isRegistered  = (m: string) => {
  return !!localStorage.getItem(REG_KEY(m));
};
const markRegistered = (m: string) => {
  localStorage.setItem(REG_KEY(m), "1");
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
  const [lang, setLang] = useState<Language>("en");
  const t = authTranslations[lang];

  const [step,     setStep]     = useState<Step>("mobile");
  const [dir,      setDir]      = useState(1);
  const [mobile,   setMobile]   = useState("");
  const [otp,      setOtp]      = useState("");
  const [err,      setErr]      = useState("");
  


  const [checking,    setChecking]    = useState(false);
  const [regStatus,   setRegStatus]   = useState<"registered" | "new" | null>(null);

  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<'checking' | 'available' | 'taken' | null>(null);
  const [showTpin, setShowTpin] = useState(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const [tpin, setTpin] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [referredByStatus, setReferredByStatus] = useState<'checking' | 'valid' | 'invalid' | null>(null);
  const [referrerName, setReferrerName] = useState("");

  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameStatus(null);
      return;
    }
    setUsernameStatus('checking');
    const timerId = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users/check-username`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username })
        });
        const data = await res.json();
        if (data.available) {
          setUsernameStatus('available');
        } else {
          setUsernameStatus('taken');
        }
      } catch (err) {
        setUsernameStatus(null);
      }
    }, 500);
    return () => clearTimeout(timerId);
  }, [username]);

  useEffect(() => {
    if (!referredBy || referredBy.trim().length < 5) {
      setReferredByStatus(null);
      setReferrerName("");
      return;
    }
    setReferredByStatus('checking');
    const timerId = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users/check-referral`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ referralCode: referredBy })
        });
        const data = await res.json();
        if (data.success && data.valid) {
          setReferredByStatus('valid');
          setReferrerName(data.referrerName);
        } else {
          setReferredByStatus('invalid');
          setReferrerName("");
        }
      } catch (err) {
        setReferredByStatus(null);
        setReferrerName("");
      }
    }, 500);
    return () => clearTimeout(timerId);
  }, [referredBy]);

  const { timer, canResend, reset } = useResendTimer(30);

  const go   = (fn: () => void) => { setDir(1);  fn(); };
  const back = (fn: () => void) => { setDir(-1); fn(); };

  const [currentUser, setCurrentUser] = useState<MongoUser | null>(null);

  const handleMobileChange = async (raw: string) => {
    const val = raw.replace(/\D/g,"").slice(0,10);
    setMobile(val);
    setErr("");
    setRegStatus(null);
    setCurrentUser(null);

    if (val.length === 10) {
      setChecking(true);
      try {
        const res = await fetch(`${API_BASE_URL}/users/check-mobile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile: val })
        });
        const data = await res.json();
        setChecking(false);
        if (data.exists) {
          setRegStatus("registered");
          // Optionally fetch user data, but for auth flow we don't strictly need full user yet
        } else {
          setRegStatus("new");
        }
      } catch (err) {
        setChecking(false);
        setErr("Failed to connect to backend server");
        toast.error("Failed to connect to backend server");
      }
    }
  };

  const validateMobile = () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) { setErr("Enter a valid 10-digit mobile number"); return false; }
    setErr(""); return true;
  };

  const isNew        = regStatus === "new";

  const handlePrimaryBtn = async () => {
    if (!validateMobile()) return;
    
    const loadingToast = toast.loading("Sending OTP...");
    try {
      const res = await fetch(`${API_BASE_URL}/users/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        toast.success("OTP Sent!", { id: loadingToast });
        reset();
        go(() => setStep("otp"));
      } else {
        toast.error(data.message || "Failed to send OTP", { id: loadingToast });
      }
    } catch (e) {
      toast.error("Network error. Please try again.", { id: loadingToast });
    }
  };

  const handleOtpVerify = async () => {
    try {
      setErr("");
      // Verify OTP first
      const verifyRes = await fetch(`${API_BASE_URL}/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp })
      });
      const verifyData = await verifyRes.json();
      
      if (!verifyRes.ok || !verifyData.success) {
        setErr(verifyData.message || "Invalid OTP code.");
        toast.error(verifyData.message || "Invalid OTP code.", { position: "top-center" });
        return;
      }

      if (isNew) {
        go(() => setStep("profile"));
      } else {
        markRegistered(mobile);
        const res = await fetch(`${API_BASE_URL}/users/auth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile })
        });
        const data = await res.json();
        if (data.success && data.data) {
          saveLoggedInUser(data.data);
          setCurrentUser(data.data);
          toast.success("Welcome back!", { position: "top-center" });
          go(() => setStep("success"));
        } else {
          setErr("Login failed: " + (data.message || "Unknown error"));
          toast.error(data.message || "Unknown error", { position: "top-center" });
        }
      }
    } catch (e) {
      setErr("Failed to connect to backend server");
      toast.error("Failed to connect to backend server", { position: "top-center" });
    }
  };

  const handleProfileContinue = () => {
    go(() => setStep("tpin"));
  };

  const handleCreateAccount = async () => {
    markRegistered(mobile);
    try {
      const res = await fetch(`${API_BASE_URL}/users/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, username, dateOfBirth, tpin, referredBy })
      });
      const data = await res.json();
      if (data.success && data.data) {
        saveLoggedInUser(data.data);
        setCurrentUser(data.data);
        toast.success("Account created successfully!", { position: "top-center" });
        go(() => setStep("success"));
      } else {
        setErr("Registration failed: " + (data.message || "Unknown error"));
        toast.error(data.message || "Registration failed", { position: "top-center" });
      }
    } catch (e) {
      setErr("Failed to connect to backend server");
      toast.error("Failed to connect to backend server", { position: "top-center" });
    }
  };

  // Removed password strength calculation

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
         <div className="w-full p-6 lg:p-8 flex justify-between lg:justify-end items-center z-20 shrink-0">
            <div className="flex lg:hidden items-center gap-2">
              <img src={fipMoneyLogo} alt="FipMoney" className="h-7 object-contain" />
              <span className="font-black text-xl text-[#1e1b4b]">Fipmoney</span>
            </div>
            
            <div className="flex items-center gap-3 relative group">
               <button onClick={() => onNavigate("home")} className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer outline-none shadow-sm">
                 <ArrowLeft size={14} /> {t.backToHome}
               </button>
               
               <div className="relative">
                 <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm text-sm font-semibold text-[#1e1b4b] hover:bg-gray-50 transition-colors cursor-pointer outline-none group">
                   <Globe size={16} className="text-gray-500" />
                   {lang === 'en' ? 'English' : lang === 'te' ? 'Telugu' : 'Hindi'}
                   <ChevronDown size={14} className="text-gray-500" />
                 </button>
                 {/* Dropdown menu */}
                 <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                    <button onClick={() => setLang('en')} className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors ${lang === 'en' ? 'text-[#d89221] bg-amber-50/50' : 'text-gray-700'}`}>English</button>
                    <button onClick={() => setLang('te')} className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors ${lang === 'te' ? 'text-[#d89221] bg-amber-50/50' : 'text-gray-700'}`}>Telugu (తెలుగు)</button>
                    <button onClick={() => setLang('hi')} className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors ${lang === 'hi' ? 'text-[#d89221] bg-amber-50/50' : 'text-gray-700'}`}>Hindi (हिंदी)</button>
                 </div>
               </div>
            </div>
         </div>

         {/* Form Container */}
         <div className="flex-1 flex flex-col justify-center max-w-[400px] mx-auto w-full px-6 relative z-10 overflow-y-auto hide-scrollbar pb-10">
            
            {/* ══ STEPPER UI (Only for setup steps) ══ */}
            <AnimatePresence>
              {(step === "profile" || step === "tpin") && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 w-full flex items-center relative">
                  
                  <button onClick={() => back(() => setStep(step === "tpin" ? "profile" : "otp"))} className="absolute left-0 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors bg-white cursor-pointer outline-none z-10 shrink-0 shadow-sm">
                     <ArrowLeft size={18} />
                  </button>

                  <div className="flex items-center justify-between relative w-full max-w-[220px] mx-auto">
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 -z-10 -translate-y-1/2" />
                    <motion.div className="absolute top-1/2 left-0 h-[2px] bg-[#d89221] -z-10 -translate-y-1/2" 
                      initial={{ width: "0%" }}
                      animate={{ width: step === "tpin" ? "100%" : "0%" }}
                      transition={{ duration: 0.4 }}
                    />
                    
                    <div className="flex flex-col items-center gap-1.5 bg-white px-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shadow-sm transition-colors ${step === "profile" || step === "tpin" ? "bg-[#d89221] text-white border-2 border-white shadow-amber-500/30" : "bg-gray-100 text-gray-400"}`}>1</div>
                      <span className={`text-[10px] font-bold ${step === "profile" || step === "tpin" ? "text-[#1e1b4b]" : "text-gray-400"}`}>{t.profile}</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-1.5 bg-white px-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shadow-sm transition-colors ${step === "tpin" ? "bg-[#d89221] text-white border-2 border-white shadow-amber-500/30" : "bg-gray-100 text-gray-400"}`}>2</div>
                      <span className={`text-[10px] font-bold ${step === "tpin" ? "text-[#1e1b4b]" : "text-gray-400"}`}>{t.security}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait" custom={dir}>
              {/* ══ STEP 1: MOBILE ══ */}
              {step === "mobile" && (
                 <FormSlide key="mobile" dir={dir}>
                    <div className="text-center mb-8">
                        <h2 className="text-[28px] leading-tight font-black text-[#1e1b4b] mb-2 tracking-tight">
                          {regStatus === "registered" ? (
                            <>{t.welcomeBack}</>
                          ) : regStatus === "new" ? (
                            <>{t.createAccount}</>
                          ) : checking ? (
                            <>{t.verifyingNumber}</>
                          ) : (
                            <>{t.welcomeToFipmoney}</>
                          )}
                        </h2>
                        <p className="text-[#64748b] text-[14px] font-medium leading-relaxed max-w-[340px] mx-auto">
                          {regStatus === "registered" ? (
                            <>{t.accountFound.replace('{mobile}', mobile)}</>
                          ) : regStatus === "new" ? (
                            <>{t.newUserDetected.replace('{mobile}', mobile)}</>
                          ) : checking ? (
                            <>{t.checkingDatabase}</>
                          ) : (
                            <>{t.enterMobileText}</>
                          )}
                        </p>
                    </div>

                    <div className="flex justify-center mb-8">
                       <div className="w-[120px] h-[120px] rounded-full bg-[#f8f9fa] flex items-center justify-center shadow-inner">
                          <img src={fipMoneyLogo} className="w-[95px] h-[95px] object-contain drop-shadow-sm" alt="Logo" />
                       </div>
                    </div>

                    <div className="mb-6">
                       <label className="block text-[14px] font-bold text-[#1e1b4b] mb-2.5">{t.enterMobileNumber}</label>
                       <div className={`flex items-center rounded-xl border-2 ${err ? 'border-red-400' : 'border-gray-200'} focus-within:border-[#d89221] transition-all bg-white h-[56px] relative`}>
                          <div className="flex items-center gap-2 px-4 border-r-2 border-gray-200 cursor-pointer h-full rounded-l-xl hover:bg-gray-50 transition-colors">
                             <span className="text-[18px]">🇮🇳</span>
                             <span className="text-[14px] font-bold text-[#1e1b4b]">+91</span>
                             <ChevronDown size={14} className="text-gray-400" />
                          </div>
                          <input 
                             type="tel" inputMode="numeric" maxLength={10} value={mobile} autoFocus
                             onChange={e => handleMobileChange(e.target.value)}
                             placeholder={t.mobilePlaceholder}
                             className="flex-1 min-w-0 border-none outline-none bg-transparent px-4 text-[15px] font-bold text-[#1e1b4b] placeholder:font-medium placeholder:text-gray-400 h-full"
                          />
                          
                          {checking && <div className="absolute right-4"><Loader2 size={18} className="animate-spin text-[#d89221]" /></div>}
                       </div>
                       {err && <p className="text-red-500 text-[12px] mt-2 font-semibold">{err}</p>}
                       {!err && regStatus === "registered" && (
                           <p className="text-[#10b981] text-[12px] mt-2 font-bold flex items-center justify-center gap-1 bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-200/60">
                              <CheckCircle size={14}/> {t.registeredAccountFound}
                           </p>
                        )}
                        {!err && regStatus === "new" && (
                           <p className="text-[#d89221] text-[12px] mt-2 font-bold flex items-center justify-center gap-1 bg-amber-50 py-1.5 px-3 rounded-lg border border-amber-200/60">
                              {t.newUserSetup}
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
                              <Loader2 size={18} className="animate-spin" /> {t.verifying}
                           </span>
                        ) : regStatus === "registered" ? (
                           t.continueToLogin
                        ) : regStatus === "new" ? (
                           t.continueToRegister
                        ) : (
                           t.continueBtn
                        )}
                    </button>

                    <div className="mt-4 flex items-start justify-center gap-2 px-2">
                       <ShieldCheck size={16} className="text-gray-400 shrink-0 mt-0.5" />
                       <p className="text-[12px] font-medium text-gray-500 text-center leading-[1.5]">
                          {t.byContinuing} <span className="text-[#d89221] font-bold cursor-pointer hover:underline">{t.termsOfService}</span><br/>{t.and} <span className="text-[#d89221] font-bold cursor-pointer hover:underline">{t.privacyPolicy}</span>
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
                         {t.verifyMobile}
                       </h2>
                       <p className="text-[#64748b] text-[14px] font-medium">
                         {t.secureCodeSent.replace('{mobile}', mobile)}
                       </p>
                    </div>

                    <div className="space-y-6">
                       <div>
                         <OtpBoxes value={otp} onChange={(v) => { setOtp(v); setErr(""); }} />
                         {err && (
                           <motion.p 
                             initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} 
                             className="text-red-500 text-[13px] font-semibold text-center mt-3 bg-red-50 py-2 rounded-lg border border-red-100"
                           >
                             {err}
                           </motion.p>
                         )}
                       </div>
                       
                       <div className="text-[14px] font-medium text-gray-500 text-center">
                         {canResend
                           ? <button onClick={reset} className="flex items-center gap-1.5 border-none bg-transparent cursor-pointer font-bold text-[#d89221] outline-none hover:underline">
                               <RefreshCw size={14} /> {t.resendOtp}
                             </button>
                           : <span>{t.resendIn}<strong className="text-[#1e1b4b]">0:{timer.toString().padStart(2,"0")}</strong></span>}
                       </div>
                       
                       <button 
                         onClick={handleOtpVerify}
                         disabled={otp.length !== 6}
                         className={`w-full h-[56px] rounded-xl text-[15px] font-bold text-white transition-all shadow-sm flex items-center justify-center border-none outline-none cursor-pointer ${otp.length !== 6 ? 'bg-gray-200 text-gray-400' : 'bg-[#d89221] hover:bg-[#c2811a] hover:shadow-lg'}`}
                       >
                         {isNew ? t.verifyAndContinue : t.verifyAndLogin}
                       </button>
                    </div>
                 </FormSlide>
              )}

              {/* ══ STEP 3: PROFILE (new users only) ══ */}
              {step === "profile" && (
                 <FormSlide key="profile" dir={dir}>
                    <div className="mb-6">
                       <h2 className="text-[28px] font-black text-[#1e1b4b] mb-2 tracking-tight">
                         {t.completeProfile}
                       </h2>
                       <p className="text-[#64748b] text-[14px] font-medium">{t.almostThere}</p>
                    </div>

                    <div className="space-y-5">
                       <div>
                         <label className="block text-[13px] font-bold text-[#1e1b4b] mb-2">{t.username}</label>
                         <div className="relative">
                           <input type="text" value={username} 
                             onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 16))}
                             placeholder={t.usernamePlaceholder}
                             className={`w-full h-[56px] rounded-xl border-2 outline-none font-bold text-[14px] text-[#1e1b4b] px-4 pr-12 transition-all bg-white
                                ${usernameStatus === 'taken' ? 'border-red-400' : 'border-gray-200 focus:border-[#d89221]'}`}
                           />
                           <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              {usernameStatus === 'checking' && <Loader2 size={18} className="animate-spin text-gray-400" />}
                              {usernameStatus === 'available' && <CheckCircle size={18} className="text-emerald-500" />}
                              {usernameStatus === 'taken' && <XCircle size={18} className="text-red-500" />}
                           </div>
                         </div>
                         {usernameStatus === 'taken' && <p className="text-red-500 text-[12px] mt-2 font-semibold">{t.usernameTaken}</p>}
                         {username && usernameStatus !== 'taken' && username.length < 3 && <p className="text-gray-400 text-[12px] mt-2 font-medium">{t.min3chars}</p>}
                       </div>
                       <div>
                         <label className="block text-[13px] font-bold text-[#1e1b4b] mb-2">Date of Birth</label>
                         <input type="date" value={dateOfBirth}
                           onChange={e => setDateOfBirth(e.target.value)}
                           className="w-full h-[56px] rounded-xl border-2 border-gray-200 outline-none text-[14px] font-medium text-[#1e1b4b] px-4 focus:border-[#d89221] transition-all bg-white"
                         />
                       </div>

                       <div>
                         <label className="block text-[13px] font-bold text-[#1e1b4b] mb-2">{t.referralCode}</label>
                         <div className="relative">
                           <input type="text" value={referredBy}
                             onChange={e => setReferredBy(e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 6))} placeholder={t.referralPlaceholder}
                             className={`w-full h-[56px] rounded-xl border-2 outline-none text-[14px] font-bold text-[#1e1b4b] px-4 pr-12 transition-all bg-white uppercase
                                ${referredByStatus === 'invalid' ? 'border-red-400' : 'border-gray-200 focus:border-[#d89221]'}`}
                           />
                           <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              {referredByStatus === 'checking' && <Loader2 size={18} className="animate-spin text-gray-400" />}
                              {referredByStatus === 'valid' && <CheckCircle size={18} className="text-emerald-500" />}
                              {referredByStatus === 'invalid' && <XCircle size={18} className="text-red-500" />}
                           </div>
                         </div>
                         {referredByStatus === 'invalid' && <p className="text-red-500 text-[12px] mt-2 font-semibold">Invalid referral code.</p>}
                         {referredByStatus === 'valid' && <p className="text-emerald-500 text-[12px] mt-2 font-semibold flex items-center gap-1"><CheckCircle size={14}/> Found: {referrerName}</p>}
                       </div>
                       
                       <button 
                         onClick={handleProfileContinue}
                         disabled={usernameStatus !== 'available' || !dateOfBirth || referredByStatus === 'invalid'}
                         className={`w-full h-[56px] mt-2 rounded-xl text-[15px] font-bold text-white transition-all shadow-sm flex items-center justify-center border-none outline-none cursor-pointer ${(usernameStatus !== 'available' || !dateOfBirth || referredByStatus === 'invalid') ? 'bg-gray-200 text-gray-400' : 'bg-[#d89221] hover:bg-[#c2811a] hover:shadow-lg'}`}
                       >
                         {t.continueBtn}
                       </button>

                       <div className="text-center mt-4">
                         <button onClick={() => setShowGuidelinesModal(true)} className="text-[12px] text-[#d89221] font-bold bg-transparent border-none outline-none cursor-pointer hover:underline">
                            Read username & security instructions - Click here
                         </button>
                       </div>
                    </div>
                 </FormSlide>
              )}

              {/* ══ STEP 3.5: T-PIN SETUP ══ */}
              {step === "tpin" && (
                 <FormSlide key="tpin" dir={dir}>
                    <div className="mb-6">
                       <h2 className="text-[28px] font-black text-[#1e1b4b] mb-2 tracking-tight">
                         {t.setupSecurity}
                       </h2>
                       <p className="text-[#64748b] text-[14px] font-medium leading-relaxed">
                         {t.secureYourApp}
                       </p>
                    </div>

                    <div className="space-y-6">
                       <div className="flex justify-center flex-col items-center gap-4">
                         <div className="relative h-14 w-full max-w-[240px]">
                           <input
                             type="tel" inputMode="numeric" maxLength={4} value={tpin} autoFocus
                             onChange={e => setTpin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                             className="absolute inset-0 opacity-0 w-full h-full cursor-text z-10"
                           />
                           <div className="flex gap-4 pointer-events-none h-full">
                             {[0,1,2,3].map(i => {
                               const char = tpin[i] || "";
                               const isActive = tpin.length === i;
                               return (
                                 <motion.div key={i} animate={{ scale: char ? 1.05 : 1 }}
                                   className={`flex items-center justify-center text-2xl font-black flex-1 rounded-xl transition-all border-2
                                     ${isActive ? 'border-[#d89221] shadow-[0_0_0_4px_rgba(216,146,33,0.1)] bg-white' : char ? 'border-[#d89221]/40 bg-[#d89221]/5 text-[#1e1b4b]' : 'border-gray-200 bg-gray-50 text-gray-300'}
                                   `}
                                 >
                                   {char ? (showTpin ? char : "•") : (isActive
                                     ? <motion.div className="w-0.5 h-6 rounded-full bg-[#d89221]"
                                         animate={{ opacity: [0,1,0] }} transition={{ duration: 1, repeat: Infinity }} />
                                     : "·")}
                                 </motion.div>
                               );
                             })}
                           </div>
                         </div>
                         <button onClick={() => setShowTpin(!showTpin)} className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer text-[13px] font-bold">
                            {showTpin ? <EyeOff size={16}/> : <Eye size={16}/>} {showTpin ? "Hide" : "Show"} PIN
                         </button>
                         <div className="mt-1 flex items-start gap-2 bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                           <ShieldCheck size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                           <p className="text-[11px] font-medium text-emerald-700 m-0 leading-relaxed">
                             Your secure T-PIN is stored in an encrypted format using military-grade <strong className="font-black">SHA-256 one-way cryptographic hashing</strong> to ensure complete privacy.
                           </p>
                         </div>
                       </div>
                       
                       <button 
                         onClick={handleCreateAccount}
                         disabled={tpin.length !== 4}
                         className={`w-full h-[56px] rounded-xl text-[15px] font-bold text-white transition-all shadow-sm flex items-center justify-center border-none outline-none cursor-pointer mt-4 ${tpin.length !== 4 ? 'bg-gray-200 text-gray-400' : 'bg-[#d89221] hover:bg-[#c2811a] hover:shadow-lg'}`}
                       >
                         {t.continueBtn}
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
                       {(currentUser?.userCode || currentUser?.userId) && (
                          <div className="flex flex-col items-center gap-2 mb-4">
                            {currentUser?.userCode && (
                              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-black shadow-xs">
                                <span>User Code:</span>
                                <span className="font-mono text-purple-900 tracking-wider">#{currentUser.userCode}</span>
                              </div>
                            )}
                            {currentUser?.userId && (
                              <p className="text-[11px] font-mono text-gray-400">
                                UUID: {currentUser.userId}
                              </p>
                            )}
                          </div>
                        )}
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
      {/* ── GUIDELINES MODAL ── */}
      <AnimatePresence>
        {showGuidelinesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#1e1b4b]/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-[400px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="text-[20px] font-black text-[#1e1b4b]">Security Guidelines</h3>
                 <button onClick={() => setShowGuidelinesModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 border-none cursor-pointer">
                   <XCircle size={18} />
                 </button>
              </div>
              <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                 <div>
                    <h4 className="text-[14px] font-bold text-[#1e1b4b] mb-2 flex items-center gap-2"><User size={16} className="text-[#d89221]"/> Username Instructions</h4>
                    <ul className="text-[13px] text-gray-600 space-y-1.5 list-disc pl-5 m-0">
                       <li>Must be unique and not already taken.</li>
                       <li>Maximum 16 characters long.</li>
                       <li>Only alphabets, numbers, and underscores (_) are allowed.</li>
                       <li>Spaces and special characters (@, #, etc.) are strictly prohibited.</li>
                    </ul>
                 </div>
                 <div>
                    <h4 className="text-[14px] font-bold text-[#1e1b4b] mb-2 flex items-center gap-2"><ShieldCheck size={16} className="text-[#d89221]"/> Password Strength</h4>
                    <ul className="text-[13px] text-gray-600 space-y-1.5 list-disc pl-5 m-0">
                       <li>Must be at least 8 characters long.</li>
                       <li>Include at least one uppercase letter and one number for a "Strong" rating.</li>
                    </ul>
                 </div>
                 <div>
                    <h4 className="text-[14px] font-bold text-[#1e1b4b] mb-2 flex items-center gap-2"><Shield size={16} className="text-[#d89221]"/> T-PIN Security</h4>
                    <p className="text-[13px] text-gray-600 m-0 leading-relaxed">
                       Your 4-digit Transactional PIN is highly sensitive. We do not store the actual numbers in our database. Instead, it is secured using <strong>SHA-256 one-way cryptographic hashing</strong>. This means even our database administrators cannot see or decrypt your PIN.
                    </p>
                 </div>
              </div>
              <div className="p-4 border-t border-gray-100">
                 <button onClick={() => setShowGuidelinesModal(false)} className="w-full py-3 rounded-xl bg-[#1e1b4b] text-white font-bold text-[14px] border-none cursor-pointer hover:bg-[#2e2b60]">
                   I Understand
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
