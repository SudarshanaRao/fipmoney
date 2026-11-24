"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CheckCircle, RefreshCw, Users, Award, Star,
  ShieldCheck, Smartphone, Eye, EyeOff, Loader2, XCircle,
  Shield, Coins, BarChart3, Globe, ChevronDown, User, CheckCircle2, ArrowRight,
  HelpCircle, Mail, Lock, AlertCircle
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import fipMoneyLogo from "../../imports/fipmoney_logo_final.png";
import { saveLoggedInUser, MongoUser } from "../utils/userStorage";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../utils/apiConfig";
import { authTranslations, Language } from "../utils/translations";
import { LoadingSpinner } from "./LottiePlayer";
import { Capacitor } from "@capacitor/core";
import { checkBiometricAvailability, authenticateWithBiometrics, setBiometricLockEnabled } from "../utils/biometricService";

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
    <div className="relative h-14 sm:h-16 w-full max-w-[380px] mx-auto">
      <input
        type="tel" inputMode="numeric" maxLength={6} value={value} autoFocus
        onChange={e => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        className="absolute inset-0 opacity-0 w-full h-full cursor-text z-10"
      />
      <div className="flex gap-2 sm:gap-3 justify-center items-center h-full">
        {[0, 1, 2, 3, 4, 5].map(i => {
          const char = value[i] || "";
          const isActive = value.length === i;
          return (
            <motion.div key={i} animate={{ scale: char ? 1.05 : 1 }}
              className={`w-11 h-11 sm:w-13 sm:h-13 aspect-square shrink-0 flex items-center justify-center text-xl sm:text-2xl font-black rounded-2xl transition-all border-2
                ${isActive ? 'border-[#047857] shadow-[0_0_0_4px_rgba(4,120,87,0.2)] bg-[#f8fafc] text-slate-900' : char ? 'border-[#047857]/60 bg-white text-slate-900' : 'border-slate-200 bg-[#f8fafc] text-slate-300'}
              `}
            >
              {char || (isActive
                ? <motion.div className="w-0.5 h-6 rounded-full bg-[#047857]"
                    animate={{ opacity: [0,1,0] }} transition={{ duration: 1, repeat: Infinity }} />
                : "·")}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function TpinBoxes({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative h-16 w-full max-w-[300px] mx-auto">
      <input
        type="tel"
        inputMode="numeric"
        maxLength={4}
        value={value}
        autoFocus
        onChange={e => onChange(e.target.value.replace(/\D/g, "").slice(0, 4))}
        className="absolute inset-0 opacity-0 w-full h-full cursor-text z-10"
      />
      <div className="flex gap-3.5 justify-center items-center h-full">
        {[0, 1, 2, 3].map(i => {
          const char = value[i] ? "●" : "";
          const isActive = value.length === i;
          return (
            <motion.div key={i} animate={{ scale: value[i] ? 1.05 : 1 }}
              className={`w-14 h-14 sm:w-16 sm:h-16 aspect-square shrink-0 flex items-center justify-center text-2xl font-black rounded-2xl transition-all border-2
                ${isActive ? 'border-[#047857] shadow-[0_0_0_4px_rgba(4,120,87,0.2)] bg-[#f8fafc] text-slate-900' : value[i] ? 'border-[#047857]/60 bg-white text-slate-900' : 'border-slate-200 bg-[#f8fafc] text-slate-300'}
              `}
            >
              {char || (isActive
                ? <motion.div className="w-0.5 h-6 rounded-full bg-[#047857]"
                    animate={{ opacity: [0,1,0] }} transition={{ duration: 1, repeat: Infinity }} />
                : "·")}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}


function Dream60MobileBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Soft warm cream/yellow background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc] via-white to-[#f8fafc]" />
      
      {/* Ambient background yellow/gold glow orbs */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[#047857]/15 rounded-full blur-3xl" />
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
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
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [regStatus,   setRegStatus]   = useState<"registered" | "new" | null>(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<'checking' | 'available' | 'taken' | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showEmailOtpPanel, setShowEmailOtpPanel] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
  const [isVerifyingEmailOtp, setIsVerifyingEmailOtp] = useState(false);
  const [emailOtpTimer, setEmailOtpTimer] = useState(30);
  const [canResendEmailOtp, setCanResendEmailOtp] = useState(false);

  const [usernameStatus, setUsernameStatus] = useState<'checking' | 'available' | 'taken' | null>(null);
  const [showTpin, setShowTpin] = useState(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const [tpin, setTpin] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [referredByStatus, setReferredByStatus] = useState<'checking' | 'valid' | 'invalid' | null>(null);
  const [referrerName, setReferrerName] = useState("");

  useEffect(() => {
    if (!email || !email.includes("@") || !email.includes(".")) {
      setEmailStatus(null);
      setIsEmailVerified(false);
      return;
    }
    setEmailStatus('checking');
    const timerId = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users/check-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (data.exists) {
          setEmailStatus('taken');
          setIsEmailVerified(false);
        } else {
          setEmailStatus('available');
        }
      } catch (err) {
        setEmailStatus(null);
      }
    }, 500);
    return () => clearTimeout(timerId);
  }, [email]);

  useEffect(() => {
    if (!showEmailOtpPanel) return;
    if (emailOtpTimer <= 0) {
      setCanResendEmailOtp(true);
      return;
    }
    const timer = setTimeout(() => setEmailOtpTimer(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [showEmailOtpPanel, emailOtpTimer]);

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
    
    setIsActionLoading(true);
    setLoadingMsg("Securing session & sending OTP...");
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
        setTimeout(() => {
          setIsActionLoading(false);
          go(() => setStep("otp"));
        }, 400);
      } else {
        setIsActionLoading(false);
        toast.error(data.message || "Failed to send OTP", { id: loadingToast });
      }
    } catch (e) {
      setIsActionLoading(false);
      toast.error("Network error. Please try again.", { id: loadingToast });
    }
  };

  const handleOtpVerify = async () => {
    try {
      setErr("");
      setIsActionLoading(true);
      setLoadingMsg("Verifying security OTP...");
      
      // Verify OTP first
      const verifyRes = await fetch(`${API_BASE_URL}/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp })
      });
      const verifyData = await verifyRes.json();
      
      if (!verifyRes.ok || !verifyData.success) {
        setIsActionLoading(false);
        setErr(verifyData.message || "Invalid OTP code.");
        toast.error(verifyData.message || "Invalid OTP code.", { position: "top-center" });
        return;
      }

      if (isNew) {
        setTimeout(() => {
          setIsActionLoading(false);
          go(() => setStep("profile"));
        }, 400);
      } else {
        markRegistered(mobile);
        const res = await fetch(`${API_BASE_URL}/users/auth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile })
        });
        const data = await res.json();
        if (data.success && data.data) {
          const userData = { ...data.data, sessionId: data.sessionId || data.data.sessionId };
          saveLoggedInUser(userData);
          setCurrentUser(userData);
          if (data.sessionId) {
            sessionStorage.setItem("fm_session_id", data.sessionId);
            localStorage.setItem("fm_session_id", data.sessionId);
          }
          toast.success("Welcome back!", { position: "top-center" });

          // If running inside Mobile APK, trigger Biometric Authentication
          if (Capacitor.isNativePlatform()) {
            try {
              const bioCheck = await checkBiometricAvailability();
              if (bioCheck.isAvailable) {
                const bioResult = await authenticateWithBiometrics(
                  "Enable Fingerprint Login",
                  "Touch the fingerprint sensor to enable instant biometric access"
                );
                if (bioResult.success) {
                  setBiometricLockEnabled(true);
                  toast.success("Fingerprint lock enabled for your device!", { position: "top-center" });
                }
              }
            } catch (err) {
              console.warn("Biometric enrollment skipped:", err);
            }
          }

          setTimeout(() => {
            setIsActionLoading(false);
            go(() => setStep("success"));
          }, 400);
        } else {
          setIsActionLoading(false);
          setErr("Login failed: " + (data.message || "Unknown error"));
          toast.error(data.message || "Unknown error", { position: "top-center" });
        }
      }
    } catch (e) {
      setIsActionLoading(false);
      setErr("Failed to connect to backend server");
      toast.error("Failed to connect to backend server", { position: "top-center" });
    }
  };

  const handleSendEmailOtp = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (emailStatus === 'taken') {
      toast.error("Email is already registered");
      return;
    }

    setIsSendingEmailOtp(true);
    const loadingToast = toast.loading("Sending Email OTP...");
    try {
      const res = await fetch(`${API_BASE_URL}/users/send-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, userName: username || "User" })
      });
      const data = await res.json();
      setIsSendingEmailOtp(false);
      if (data.success) {
        toast.success("Email OTP sent successfully!", { id: loadingToast });
        setShowEmailOtpPanel(true);
        setEmailOtp("");
        setEmailOtpTimer(30);
        setCanResendEmailOtp(false);
      } else {
        toast.error(data.message || "Failed to send Email OTP", { id: loadingToast });
      }
    } catch (err) {
      setIsSendingEmailOtp(false);
      toast.error("Network error. Could not send OTP.", { id: loadingToast });
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp || emailOtp.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }
    setIsVerifyingEmailOtp(true);
    const loadingToast = toast.loading("Verifying Email OTP...");
    try {
      const res = await fetch(`${API_BASE_URL}/users/verify-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: emailOtp })
      });
      const data = await res.json();
      setIsVerifyingEmailOtp(false);
      if (data.success) {
        toast.success("Email verified successfully!", { id: loadingToast });
        setIsEmailVerified(true);
        setShowEmailOtpPanel(false);
      } else {
        toast.error(data.message || "Invalid Email OTP", { id: loadingToast });
      }
    } catch (err) {
      setIsVerifyingEmailOtp(false);
      toast.error("Network error while verifying OTP.", { id: loadingToast });
    }
  };

  const handleProfileContinue = () => {
    if (!username || username.trim().length < 3) {
      setErr("Please enter a valid username (min 3 characters)");
      return;
    }
    if (!email || !email.includes("@")) {
      setErr("Please enter a valid email address");
      return;
    }
    if (!isEmailVerified) {
      setErr("Please verify your email address before continuing");
      toast.error("Please verify your email address first");
      return;
    }
    setErr("");
    go(() => setStep("tpin"));
  };

  const handleCreateAccount = async () => {
    markRegistered(mobile);
    try {
      const res = await fetch(`${API_BASE_URL}/users/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, username, email, dateOfBirth, tpin, referredBy })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const userData = { ...data.data, sessionId: data.sessionId || data.data.sessionId };
        saveLoggedInUser(userData);
        setCurrentUser(userData);
        if (data.sessionId) {
          sessionStorage.setItem("fm_session_id", data.sessionId);
          localStorage.setItem("fm_session_id", data.sessionId);
        }
        toast.success("Account created successfully!", { position: "top-center" });

        // If running inside Mobile APK, trigger Biometric Authentication
        if (Capacitor.isNativePlatform()) {
          try {
            const bioCheck = await checkBiometricAvailability();
            if (bioCheck.isAvailable) {
              const bioResult = await authenticateWithBiometrics(
                "Enable Fingerprint Login",
                "Touch the fingerprint sensor to enable instant biometric access"
              );
              if (bioResult.success) {
                setBiometricLockEnabled(true);
                toast.success("Fingerprint lock enabled for your device!", { position: "top-center" });
              }
            }
          } catch (err) {
            console.warn("Biometric enrollment skipped:", err);
          }
        }

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

  const handleGoToDashboard = () => {
    if (currentUser) {
      saveLoggedInUser(currentUser);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("fm_auth_state_change"));
    }
    onNavigate("dashboard");
  };

  // Removed password strength calculation

  return (
    <div className="w-full min-h-screen flex font-sans bg-white overflow-hidden">
      {/* ── LEFT PANEL (Half of the Page on Desktop) ── */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between relative overflow-hidden bg-gradient-to-b from-[#F0FDF4]/50 via-white to-[#ECFDF5]/70 p-10 xl:p-14 border-r border-slate-100 h-screen">
         {/* Ambient Background Effects */}
         <div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
         <div className="absolute bottom-10 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

         {/* Top Logo */}
         <div className="relative z-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <img src={fipMoneyLogo} className="w-12 h-12 object-contain" alt="Fipmoney Logo" />
               <span className="text-3xl font-black text-slate-900 tracking-tight">Fipmoney</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#047857] text-xs font-bold shadow-xs">
               <ShieldCheck size={14} className="text-[#047857]" />
               <span>100% Insured Vault</span>
            </div>
         </div>

         {/* Center: Large 3D Hero Asset taking the center stage (Half of the page) */}
         <div className="relative z-20 flex-1 flex flex-col items-center justify-center my-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full max-w-[440px] xl:max-w-[480px] flex items-center justify-center"
            >
              {/* Soft emerald glow behind 3D render */}
              <div className="absolute inset-4 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
              <img 
                src={step === "otp" ? "/otp-3d-hero.png" : "/login-3d-hero.png"} 
                alt={step === "otp" ? "Fipmoney 3D OTP Verification" : "Fipmoney Secure Login"} 
                className="w-full h-auto max-h-[440px] xl:max-h-[480px] object-contain drop-shadow-2xl select-none"
              />
            </motion.div>
         </div>

         {/* Bottom Glass Badge Strip */}
         <div className="relative z-20">
            <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl px-6 py-4 flex gap-6 items-center shadow-xs">
              <div className="flex gap-3 items-center">
                 <div className="text-[#047857]"><ShieldCheck size={20} /></div>
                 <div>
                    <div className="text-slate-900 text-[11px] font-black uppercase tracking-wider">Bank-Grade</div>
                    <div className="text-slate-600 text-[10px] font-semibold mt-0.5 leading-[1.1]">256-Bit SSL<br/>Encrypted</div>
                 </div>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="flex gap-3 items-center">
                 <div className="text-[#047857]"><Coins size={20} /></div>
                 <div>
                    <div className="text-slate-900 text-[11px] font-black uppercase tracking-wider">24K 99.9%</div>
                    <div className="text-slate-600 text-[10px] font-semibold mt-0.5 leading-[1.1]">Brink's Insured<br/>Vault Storage</div>
                 </div>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="flex gap-3 items-center">
                 <div className="text-[#047857]"><CheckCircle2 size={20} /></div>
                 <div>
                    <div className="text-slate-900 text-[11px] font-black uppercase tracking-wider">Verified</div>
                    <div className="text-slate-600 text-[10px] font-semibold mt-0.5 leading-[1.1]">Instant Mobile<br/>OTP Access</div>
                 </div>
              </div>
            </div>
         </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="hidden lg:flex flex-1 flex-col relative bg-white h-screen">
         {/* Top Header: Left Back button, Middle FipMoney Logo, Right Language dropdown */}
         <div className="w-full px-4 sm:px-6 py-4 flex items-center justify-between z-20 shrink-0 bg-transparent">
            {/* Left: Back Button */}
            <button 
              onClick={() => onNavigate("home")} 
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 bg-[#f8fafc] text-slate-900 hover:bg-white transition-all active:scale-95 cursor-pointer outline-none shadow-xs"
            >
              <ArrowLeft size={16} strokeWidth={2.5} />
              <span>Back</span>
            </button>
            
            {/* Middle: FipMoney Logo */}
            <div 
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2 cursor-pointer select-none hover:opacity-90 transition-opacity"
            >
              <img src={fipMoneyLogo} alt="FipMoney" className="h-8 w-auto object-contain" />
              <span className="font-black text-xl tracking-tight text-slate-900">Fipmoney</span>
            </div>

            {/* Right: Language Selector */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-[#f8fafc] shadow-xs text-xs font-bold text-slate-900 hover:bg-[#f8fafc] transition-colors cursor-pointer outline-none">
                <Globe size={15} className="text-gray-500" />
                <span className="hidden sm:inline">{lang === 'en' ? 'English' : lang === 'te' ? 'Telugu' : 'Hindi'}</span>
                <span className="sm:hidden">{lang.toUpperCase()}</span>
                <ChevronDown size={13} className="text-gray-500" />
              </button>
              {/* Dropdown menu */}
              <div className="absolute top-full right-0 mt-2 w-32 bg-[#f8fafc] rounded-xl shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                <button onClick={() => setLang('en')} className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-white transition-colors ${lang === 'en' ? 'text-[#047857] bg-white/80 font-bold' : 'text-gray-700'}`}>English</button>
                <button onClick={() => setLang('te')} className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-white transition-colors ${lang === 'te' ? 'text-[#047857] bg-white/80 font-bold' : 'text-gray-700'}`}>Telugu (తెలుగు)</button>
                <button onClick={() => setLang('hi')} className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-white transition-colors ${lang === 'hi' ? 'text-[#047857] bg-white/80 font-bold' : 'text-gray-700'}`}>Hindi (हिंदी)</button>
              </div>
            </div>
         </div>

         {/* Form Container */}
         <div className="flex-1 flex flex-col justify-center max-w-[400px] mx-auto w-full px-6 relative z-10 overflow-hidden hide-scrollbar pb-10 min-h-[520px]">
            
            {/* Action Loading Overlay with spinner-loading.json */}
            <AnimatePresence>
              {isActionLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/95 backdrop-blur-xs z-50 flex flex-col items-center justify-center gap-3 p-6 text-center rounded-2xl"
                >
                  <LoadingSpinner size={90} />
                  <p className="text-sm font-black text-slate-900 animate-pulse">
                    {loadingMsg || "Processing request..."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ══ STEPPER UI (Only for setup steps) ══ */}
            <AnimatePresence mode="wait">
              {(step === "profile" || step === "tpin") && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 w-full flex items-center relative">
                  
                  <button onClick={() => back(() => setStep(step === "tpin" ? "profile" : "otp"))} className="absolute left-0 w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-emerald-800 hover:bg-[#f8fafc] transition-colors bg-[#f8fafc] cursor-pointer outline-none z-10 shrink-0 shadow-sm">
                     <ArrowLeft size={18} />
                  </button>

                  <div className="flex items-center justify-between relative w-full max-w-[220px] mx-auto">
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-200 -z-10 -translate-y-1/2" />
                    <motion.div className="absolute top-1/2 left-0 h-[2px] bg-[#047857] -z-10 -translate-y-1/2" 
                      initial={{ width: "0%" }}
                      animate={{ width: step === "tpin" ? "100%" : "0%" }}
                      transition={{ duration: 0.4 }}
                    />
                    
                    <div className="flex flex-col items-center gap-1.5 bg-white px-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shadow-sm transition-colors ${step === "profile" || step === "tpin" ? "bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] text-white border-2 border-emerald-300 shadow-emerald-900/20" : "bg-[#f8fafc] text-slate-600"}`}>1</div>
                      <span className={`text-[10px] font-bold ${step === "profile" || step === "tpin" ? "text-slate-900" : "text-slate-600"}`}>{t.profile}</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-1.5 bg-white px-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shadow-sm transition-colors ${step === "tpin" ? "bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] text-white border-2 border-emerald-300 shadow-emerald-900/20" : "bg-[#f8fafc] text-slate-600"}`}>2</div>
                      <span className={`text-[10px] font-bold ${step === "tpin" ? "text-slate-900" : "text-slate-600"}`}>{t.security}</span>
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
                        <h2 className="text-[26px] leading-tight font-black text-slate-900 mb-2 tracking-tight">
                          {regStatus === "registered" ? (
                            "Welcome Back 👋"
                          ) : regStatus === "new" ? (
                            "Create Account ✨"
                          ) : checking ? (
                            "Checking Account... 🔍"
                          ) : (
                            "Enter your 10-digit mobile number to proceed"
                          )}
                        </h2>
                        <p className="text-slate-600 text-[14px] font-medium leading-relaxed max-w-[340px] mx-auto">
                          {regStatus === "registered" ? (
                            `Account found for +91 ${mobile}. Enter OTP to access your secure vault.`
                          ) : regStatus === "new" ? (
                            "New user detected! Start saving in 24K Gold & 99.9% Silver in seconds."
                          ) : checking ? (
                            "Checking database for registered account..."
                          ) : (
                            "Save & invest in 24K 99.9% pure gold & silver with Fipmoney"
                          )}
                        </p>
                    </div>

                    <div className="flex justify-center mb-8">
                       <div className="w-[120px] h-[120px] rounded-full bg-white flex items-center justify-center shadow-inner">
                          <img src={fipMoneyLogo} className="w-[95px] h-[95px] object-contain drop-shadow-sm" alt="Logo" />
                       </div>
                    </div>

                    <div className="mb-6">
                       <label className="block text-[14px] font-bold text-slate-900 mb-2.5">{t.enterMobileNumber}</label>
                       <div className={`flex items-center rounded-xl border-2 ${err ? 'border-red-400' : 'border-slate-200'} focus-within:border-[#047857] transition-all bg-[#f8fafc] h-[56px] relative`}>
                          <div className="flex items-center gap-2 px-4 border-r-2 border-slate-200 cursor-pointer h-full rounded-l-xl hover:bg-[#f8fafc] transition-colors">
                             <span className="text-[18px]">🇮🇳</span>
                             <span className="text-[14px] font-bold text-slate-900">+91</span>
                             <ChevronDown size={14} className="text-gray-400" />
                          </div>
                          <input 
                             type="tel" inputMode="numeric" maxLength={10} value={mobile} autoFocus
                             onChange={e => handleMobileChange(e.target.value)}
                             placeholder={t.mobilePlaceholder}
                             className="flex-1 min-w-0 border-none outline-none bg-transparent px-4 text-[15px] font-bold text-slate-900 placeholder:font-medium placeholder:text-gray-400 h-full"
                          />
                          
                          {checking && <div className="absolute right-4"><Loader2 size={18} className="animate-spin text-[#047857]" /></div>}
                       </div>
                       {err && <p className="text-red-500 text-[12px] mt-2 font-semibold">{err}</p>}
                       {!err && regStatus === "registered" && (
                           <p className="text-[#10b981] text-[12px] mt-2 font-bold flex items-center justify-center gap-1 bg-white py-1.5 px-3 rounded-lg border border-slate-200">
                              <CheckCircle size={14}/> {t.registeredAccountFound}
                           </p>
                        )}
                        {!err && regStatus === "new" && (
                           <p className="text-emerald-800 text-[12px] mt-2 font-bold flex items-center justify-center gap-1 bg-white py-1.5 px-3 rounded-lg border border-slate-200">
                              {t.newUserSetup}
                           </p>
                        )}
                    </div>

                    <button 
                      onClick={handlePrimaryBtn}
                      disabled={mobile.length !== 10 || checking}
                      className={`w-full h-[56px] rounded-xl text-[15px] font-bold text-white transition-all shadow-md flex items-center justify-center border border-[#F3F6E8]/30 outline-none cursor-pointer ${
                          mobile.length !== 10 || checking 
                             ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none' 
                             : 'bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] hover:from-[#022c22] hover:via-[#064e3b] hover:to-[#047857] shadow-emerald-900/20 active:scale-[0.99]'
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
                          {t.byContinuing} <span onClick={() => onNavigate("terms")} className="text-emerald-800 hover:text-slate-900 font-bold cursor-pointer hover:underline">{t.termsOfService}</span><br/>{t.and} <span onClick={() => onNavigate("privacy")} className="text-emerald-800 hover:text-slate-900 font-bold cursor-pointer hover:underline">{t.privacyPolicy}</span>
                       </p>
                    </div>

                 </FormSlide>
              )}

              {/* ══ STEP 2: OTP ══ */}
              {step === "otp" && (
                 <FormSlide key="otp" dir={dir}>
                    <div className="mb-8">
                       <button onClick={() => back(() => setStep("mobile"))} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-emerald-800 hover:bg-[#f8fafc] transition-colors bg-[#f8fafc] cursor-pointer outline-none mb-6">
                          <ArrowLeft size={18} />
                       </button>
                       <h2 className="text-[28px] font-black text-slate-900 mb-2 tracking-tight">
                         {t.verifyMobile}
                       </h2>
                       <p className="text-slate-600 text-[14px] font-medium">
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
                           ? <button onClick={reset} className="flex items-center gap-1.5 border-none bg-transparent cursor-pointer font-bold text-[#047857] outline-none hover:underline">
                               <RefreshCw size={14} /> {t.resendOtp}
                             </button>
                           : <span>{t.resendIn}<strong className="text-slate-900">0:{timer.toString().padStart(2,"0")}</strong></span>}
                       </div>
                       
                       <button 
                         onClick={handleOtpVerify}
                         disabled={otp.length !== 6}
                         className={`w-full h-[56px] rounded-xl text-[15px] font-bold text-white transition-all shadow-md flex items-center justify-center border border-[#F3F6E8]/30 outline-none cursor-pointer ${otp.length !== 6 ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none' : 'bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] hover:from-[#022c22] hover:via-[#064e3b] hover:to-[#047857] text-white shadow-md shadow-emerald-900/20 active:scale-[0.99]'}`}
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
                       <h2 className="text-[28px] font-black text-slate-900 mb-2 tracking-tight">
                         {t.completeProfile}
                       </h2>
                       <p className="text-slate-600 text-[14px] font-medium">{t.almostThere}</p>
                    </div>

                    <div className="space-y-5">
                       <div>
                         <label className="block text-[13px] font-bold text-slate-900 mb-2">{t.username}</label>
                         <div className="relative">
                           <input type="text" value={username} 
                             onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 16))}
                             placeholder={t.usernamePlaceholder}
                             className={`w-full h-[56px] rounded-xl border-2 outline-none font-bold text-[14px] text-slate-900 px-4 pr-12 transition-all bg-[#f8fafc]
                                ${usernameStatus === 'taken' ? 'border-red-400' : 'border-slate-200 focus:border-[#047857]'}`}
                           />
                           <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              {usernameStatus === 'checking' && <Loader2 size={18} className="animate-spin text-gray-400" />}
                              {usernameStatus === 'available' && <CheckCircle size={18} className="text-emerald-600" />}
                              {usernameStatus === 'taken' && <XCircle size={18} className="text-red-500" />}
                           </div>
                         </div>
                         {usernameStatus === 'taken' && <p className="text-red-500 text-[12px] mt-2 font-semibold">{t.usernameTaken}</p>}
                         {username && usernameStatus !== 'taken' && username.length < 3 && <p className="text-gray-400 text-[12px] mt-2 font-medium">{t.min3chars}</p>}
                       </div>
                       <div>
                         <label className="block text-[13px] font-bold text-slate-900 mb-2">Date of Birth</label>
                         <input type="date" value={dateOfBirth}
                           onChange={e => setDateOfBirth(e.target.value)}
                           className="w-full h-[56px] rounded-xl border-2 border-slate-200 outline-none text-[14px] font-medium text-slate-900 px-4 focus:border-[#047857] transition-all bg-[#f8fafc]"
                         />
                       </div>

                       <div>
                         <label className="block text-[13px] font-bold text-slate-900 mb-2">{t.referralCode}</label>
                         <div className="relative">
                           <input type="text" value={referredBy}
                             onChange={e => setReferredBy(e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase())} placeholder={t.referralPlaceholder}
                             className={`w-full h-[56px] rounded-xl border-2 outline-none text-[14px] font-bold text-slate-900 px-4 pr-12 transition-all bg-[#f8fafc] uppercase
                                ${referredByStatus === 'invalid' ? 'border-red-400' : 'border-slate-200 focus:border-[#047857]'}`}
                           />
                           <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              {referredByStatus === 'checking' && <Loader2 size={18} className="animate-spin text-gray-400" />}
                              {referredByStatus === 'valid' && <CheckCircle size={18} className="text-emerald-600" />}
                              {referredByStatus === 'invalid' && <XCircle size={18} className="text-red-500" />}
                           </div>
                         </div>
                         {referredByStatus === 'invalid' && <p className="text-red-500 text-[12px] mt-2 font-semibold">Invalid referral code.</p>}
                         {referredByStatus === 'valid' && <p className="text-emerald-600 text-[12px] mt-2 font-semibold flex items-center gap-1"><CheckCircle size={14}/> Found: {referrerName}</p>}
                       </div>
                       
                       <button 
                         onClick={handleProfileContinue}
                         disabled={usernameStatus !== 'available' || !dateOfBirth || referredByStatus === 'invalid'}
                         className={`w-full h-[56px] mt-2 rounded-xl text-[15px] font-bold text-white transition-all shadow-md flex items-center justify-center border border-[#F3F6E8]/30 outline-none cursor-pointer ${(usernameStatus !== 'available' || !dateOfBirth || referredByStatus === 'invalid') ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none' : 'bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] hover:from-[#022c22] hover:via-[#064e3b] hover:to-[#047857] text-white shadow-md shadow-emerald-900/20 active:scale-[0.99]'}`}
                       >
                         {t.continueBtn}
                       </button>

                       <div className="text-center mt-4">
                         <button onClick={() => setShowGuidelinesModal(true)} className="text-[12px] text-[#047857] font-bold bg-transparent border-none outline-none cursor-pointer hover:underline">
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
                       <h2 className="text-[28px] font-black text-slate-900 mb-2 tracking-tight">
                         {t.setupSecurity}
                       </h2>
                       <p className="text-slate-600 text-[14px] font-medium leading-relaxed">
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
                                     ${isActive ? 'border-[#047857] shadow-[0_0_0_4px_rgba(4,120,87,0.2)] bg-white' : char ? 'border-emerald-300 bg-[#f8fafc] text-slate-900' : 'border-slate-200 bg-white text-gray-300'}
                                   `}
                                 >
                                   {char ? (showTpin ? char : "•") : (isActive
                                     ? <motion.div className="w-0.5 h-6 rounded-full bg-[#047857]"
                                         animate={{ opacity: [0,1,0] }} transition={{ duration: 1, repeat: Infinity }} />
                                     : "·")}
                                 </motion.div>
                               );
                             })}
                           </div>
                         </div>
                         <button onClick={() => setShowTpin(!showTpin)} className="flex items-center gap-1.5 text-gray-400 hover:text-emerald-800 bg-transparent border-none cursor-pointer text-[13px] font-bold">
                            {showTpin ? <EyeOff size={16}/> : <Eye size={16}/>} {showTpin ? "Hide" : "Show"} PIN
                         </button>
                         <div className="mt-1 flex items-start gap-2 bg-white border border-emerald-100 rounded-lg p-3">
                           <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                           <p className="text-[11px] font-medium text-emerald-800 m-0 leading-relaxed">
                             Your secure T-PIN is stored in an encrypted format using military-grade <strong className="font-black">SHA-256 one-way cryptographic hashing</strong> to ensure complete privacy.
                           </p>
                         </div>
                       </div>
                       
                       <button 
                         onClick={handleCreateAccount}
                         disabled={tpin.length !== 4}
                         className={`w-full h-[56px] rounded-xl text-[15px] font-bold text-white transition-all shadow-md flex items-center justify-center border border-[#F3F6E8]/30 outline-none cursor-pointer mt-4 ${tpin.length !== 4 ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none' : 'bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] hover:from-[#022c22] hover:via-[#064e3b] hover:to-[#047857] text-white shadow-md shadow-emerald-900/20 active:scale-[0.99]'}`}
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
                         className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center bg-gradient-to-br from-[#064e3b] to-[#047857] border-2 border-amber-400 shadow-[0_0_50px_rgba(4,120,87,0.3)] relative">
                         <div className="absolute inset-1.5 border-2 border-white/40 rounded-full" />
                         <CheckCircle size={48} color="white" strokeWidth={2.5} />
                       </motion.div>
                       <h2 className="font-black text-[32px] text-slate-900 mb-2 tracking-tight">
                         {isNew ? "Account Created!" : "Welcome to Fipmoney!"}
                       </h2>
                       {(currentUser?.userCode || currentUser?.userId) && (
                          <div className="flex flex-col items-center gap-2 mb-4">
                            {currentUser?.userCode && (
                              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-emerald-300 text-emerald-800 text-xs font-black shadow-xs">
                                <span>User Code:</span>
                                <span className="font-mono text-slate-900 tracking-wider">#{currentUser.userCode}</span>
                              </div>
                            )}
                            {currentUser?.userId && (
                              <p className="text-[11px] font-mono text-gray-400">
                                UUID: {currentUser.userId}
                              </p>
                            )}
                          </div>
                        )}
                       <p className="text-[15px] mb-10 text-slate-600 font-medium">Your premium digital gold portfolio awaits.</p>
                       <button 
                         onClick={handleGoToDashboard}
                         className="w-full h-[56px] rounded-xl text-[15px] font-bold text-white bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] hover:from-[#022c22] hover:via-[#064e3b] hover:to-[#047857] border border-[#F3F6E8]/30 shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center outline-none cursor-pointer"
                       >
                         Go to Dashboard <ChevronDown size={16} className="ml-1 -rotate-90 text-amber-300" />
                       </button>
                    </div>
                 </FormSlide>
              )}

            </AnimatePresence>
         </div>
      </div>
      {/* ── MOBILE VIEW (flex lg:hidden) - Modern Redesigned UI ── */}
      <div 
        className="flex lg:hidden min-h-screen bg-[#F8FAFC] flex-col justify-between relative selection:bg-[#047857] selection:text-white w-full px-4 sm:px-6 pb-6 font-sans overflow-y-auto"
        style={{ paddingTop: "max(calc(env(safe-area-inset-top, 0px) + 1.5rem), 3.75rem)" }}
      >
        {/* Soft Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-28 right-0 w-44 h-44 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />

        {/* Top App Header Bar - Safe spacing below notification panel */}
        <div className="w-full flex items-center justify-between z-20 shrink-0 relative mt-1.5 mb-5">
          {/* Left: Back Button or Security Badge */}
          {step !== "mobile" ? (
            <button
              type="button"
              onClick={() => {
                setDir(-1);
                setStep(step === "tpin" ? "profile" : step === "profile" ? "otp" : "mobile");
              }}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-800 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs text-[#047857] text-[11px] font-bold">
              <ShieldCheck size={14} className="text-[#047857]" />
              <span>100% Secure</span>
            </div>
          )}

          {/* Center: Fipmoney Brand Logo */}
          <div className="flex items-center gap-2">
            <img src={fipMoneyLogo} alt="FipMoney" className="h-7 w-auto object-contain" />
            <span className="font-black text-lg tracking-tight text-slate-900">Fipmoney</span>
          </div>

          {/* Right: Need Help Navigation */}
          <button
            type="button"
            onClick={() => onNavigate("help")}
            className="text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <HelpCircle size={13} className="text-[#047857]" />
            <span>Need Help?</span>
          </button>
        </div>

        {/* Action Loading Overlay with LoadingSpinner */}
        <AnimatePresence>
          {isActionLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white/95 backdrop-blur-xs z-50 flex flex-col items-center justify-center gap-3 p-6 text-center"
            >
              <LoadingSpinner size={90} />
              <p className="text-sm font-black text-slate-900 animate-pulse">
                {loadingMsg || "Processing request..."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="w-full max-w-[420px] relative z-10 flex flex-col items-center mx-auto my-auto"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {/* Upper Section: Image + Headers + Form */}
          <div className="w-full flex flex-col items-center my-auto">
            
            {/* Top Asset Container with login-3d-hero.png taking half of the page */}
            <div className="relative w-full flex items-center justify-center mb-2 sm:mb-3">
              <div className="relative w-full max-w-[340px] aspect-[5/4] max-h-[38vh] sm:max-h-[42vh] flex items-center justify-center mx-auto">
                <div className="absolute inset-4 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none -z-10" />
                <img 
                  src={
                    step === "otp"
                      ? "/otp-3d-hero.png"
                      : step === "profile"
                      ? "/account-profile.png"
                      : step === "tpin"
                      ? "/tpin.png"
                      : step === "success"
                      ? "/dashboard-bro.png"
                      : "/login-3d-hero.png"
                  } 
                  alt={
                    step === "otp"
                      ? "OTP Verification"
                      : step === "profile"
                      ? "Account Profile Setup"
                      : step === "tpin"
                      ? "Security TPIN Setup"
                      : step === "success"
                      ? "Dashboard Welcome"
                      : "Fipmoney 3D Secure Login"
                  } 
                  className="w-full h-full object-contain drop-shadow-xl select-none"
                />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="text-center mb-5 w-full px-2">
              <h1 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight leading-snug">
                {step === "mobile" && (
                  regStatus === "registered"
                    ? "Welcome Back 👋"
                    : regStatus === "new"
                    ? "Create Account ✨"
                    : checking
                    ? "Checking Account... 🔍"
                    : "Enter your 10-digit mobile number to proceed"
                )}
                {step === "otp" && "Verify OTP"}
                {step === "profile" && "Complete Profile"}
                {step === "tpin" && "Set Security PIN"}
                {step === "success" && "Welcome to FipMoney"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 max-w-[320px] mx-auto leading-relaxed">
                {step === "mobile" && (
                  regStatus === "registered"
                    ? `Account found for +91 ${mobile}. Please continue to login.`
                    : regStatus === "new"
                    ? "New user detected! Start saving in 24K Gold & 99.9% Silver in seconds."
                    : checking
                    ? "Checking database for registered account..."
                    : "Save & invest in 24K pure gold & 99.9% pure silver seamlessly."
                )}
                {step === "otp" && `Enter 6-digit code sent to +91 ${mobile}`}
                {step === "profile" && "Almost there — just a few details."}
                {step === "tpin" && "Create a 4-digit PIN for securing all your transactions."}
                {step === "success" && "Your account is setup & ready to use"}
              </p>
            </div>

            {/* Stepper Wizard Indicator for Profile & Security steps (Centered) */}
            {(step === "profile" || step === "tpin") && (
              <div className="w-full relative flex items-center justify-center mb-5 px-1">
                <button
                  type="button"
                  onClick={() => { setDir(-1); setStep(step === "tpin" ? "profile" : "otp"); }}
                  className="absolute left-0 w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-900 flex items-center justify-center shadow-xs hover:bg-slate-50 transition-all cursor-pointer z-10"
                >
                  <ArrowLeft size={16} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${step === "profile" ? "bg-[#047857] text-white shadow-md shadow-emerald-700/20" : "bg-emerald-100 text-emerald-800"}`}>
                      1
                    </div>
                    <span className={`text-[11px] font-bold ${step === "profile" ? "text-[#047857] font-extrabold" : "text-slate-500"}`}>Profile</span>
                  </div>
                  <div className="w-14 h-0.5 bg-slate-200 mb-3" />
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${step === "tpin" ? "bg-[#047857] text-white shadow-md shadow-emerald-700/20" : "bg-slate-100 text-slate-400 border border-slate-200"}`}>
                      2
                    </div>
                    <span className={`text-[11px] font-bold ${step === "tpin" ? "text-[#047857] font-extrabold" : "text-slate-400"}`}>Security</span>
                  </div>
                </div>
              </div>
            )}

            {/* Main Interactive Form Card */}
            <div className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
              <AnimatePresence mode="wait" custom={dir}>
                {step === "mobile" && (
                  <FormSlide key="mobile" dir={dir}>
                    <form onSubmit={(e) => { e.preventDefault(); handlePrimaryBtn(); }} className="space-y-4">
                      {/* Mobile Number Field */}
                      <div className="space-y-2">
                        <label htmlFor="identifier" className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                          Mobile Number
                        </label>
                        <div className={`relative flex items-center rounded-2xl border-2 transition-all bg-white h-14 ${
                          err 
                            ? 'border-red-400 bg-red-50/20' 
                            : 'border-slate-200 focus-within:border-[#047857] focus-within:ring-4 focus-within:ring-emerald-500/10'
                        }`}>
                          <div className="flex items-center gap-1.5 px-3.5 border-r border-slate-200 h-full bg-slate-50/70 rounded-l-2xl select-none">
                            <span className="text-base">🇮🇳</span>
                            <span className="text-sm font-bold text-slate-800">+91</span>
                          </div>
                          <input
                            id="identifier"
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            value={mobile}
                            autoFocus
                            onChange={(e) => handleMobileChange(e.target.value)}
                            placeholder="Enter 10-digit mobile number"
                            className="flex-1 h-full px-3.5 text-base sm:text-lg font-bold text-slate-900 tracking-wider placeholder:text-slate-400 placeholder:font-normal placeholder:tracking-normal outline-none bg-transparent"
                          />
                          {checking && (
                            <div className="pr-3.5 flex items-center">
                              <Loader2 className="w-5 h-5 animate-spin text-[#047857]" />
                            </div>
                          )}
                        </div>

                        {/* Live Status Indicators */}
                        {checking && (
                          <p className="text-xs font-bold text-[#047857] flex items-center gap-1.5 pt-1 pl-1">
                            <span>Checking account...</span>
                          </p>
                        )}

                        {regStatus === "registered" && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-[#047857] bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-bold mt-2 shadow-xs"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" />
                            <span>Account found! Welcome back.</span>
                          </motion.div>
                        )}

                        {regStatus === "new" && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-emerald-800 bg-emerald-50/70 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-bold mt-2 shadow-xs"
                          >
                            <User className="w-4 h-4 text-[#047857] shrink-0" />
                            <span>New account will be created upon verification.</span>
                          </motion.div>
                        )}

                        {err && (
                          <p className="text-red-500 text-xs font-bold pl-1 pt-1">
                            {err}
                          </p>
                        )}
                      </div>

                      {/* Primary Action Button */}
                      <button
                        type="submit"
                        disabled={checking || mobile.length !== 10}
                        className={`w-full h-14 rounded-2xl font-black text-base transition-all shadow-md flex items-center justify-center gap-2 outline-none cursor-pointer ${
                          mobile.length !== 10 || checking
                            ? 'bg-slate-100 text-slate-400 border border-slate-200 shadow-none cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#047857] via-[#059669] to-[#047857] hover:brightness-105 text-white shadow-emerald-700/20 active:scale-[0.98]'
                        }`}
                      >
                        {checking ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin text-white" />
                            <span>Verifying...</span>
                          </>
                        ) : regStatus === "registered" ? (
                          <span>Continue to Login →</span>
                        ) : regStatus === "new" ? (
                          <span>Create Account &amp; Continue →</span>
                        ) : (
                          <span>Continue</span>
                        )}
                      </button>
                    </form>

                    {/* Trust & Policy Footer */}
                    <div className="mt-5 pt-4 border-t border-slate-100 text-center space-y-2">
                      <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500">
                        <ShieldCheck size={14} className="text-[#047857]" />
                        <span>256-Bit SSL Encrypted • 100% Insured Brink's Vault</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        By continuing, you agree to our{" "}
                        <span onClick={() => onNavigate("terms")} className="text-emerald-800 font-bold hover:underline cursor-pointer">
                          Terms of Service
                        </span>{" "}
                        and{" "}
                        <span onClick={() => onNavigate("privacy")} className="text-emerald-800 font-bold hover:underline cursor-pointer">
                          Privacy Policy
                        </span>.
                      </p>
                    </div>
                  </FormSlide>
                )}

                {step === "otp" && (
                  <FormSlide key="otp" dir={dir}>
                    <form onSubmit={(e) => { e.preventDefault(); handleOtpVerify(); }} className="space-y-6">
                      <OtpBoxes value={otp} onChange={setOtp} />

                      {err && <p className="text-red-500 text-sm font-semibold text-center">{err}</p>}

                      <div className="flex items-center justify-between text-sm sm:text-base pt-1">
                        <span className="text-slate-400 font-medium">Didn't receive code?</span>
                        <button
                          type="button"
                          disabled={!canResend}
                          onClick={() => handlePrimaryBtn()}
                          className="font-extrabold text-[#047857] hover:underline disabled:opacity-40 cursor-pointer border-none bg-transparent"
                        >
                          {canResend ? "Resend OTP" : `Resend in ${timer}s`}
                        </button>
                      </div>

                      <Button
                        type="submit"
                        disabled={otp.length !== 6 || isActionLoading}
                        className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] hover:from-[#022c22] hover:via-[#064e3b] hover:to-[#047857] text-white font-extrabold text-lg sm:text-xl shadow-lg shadow-emerald-900/20 transition-all duration-300 active:scale-[0.98] mt-7 flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
                      >
                        {isActionLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <span>Verify &amp; Proceed</span>
                        )}
                      </Button>
                    </form>
                  </FormSlide>
                )}

                {step === "profile" && (
                  <FormSlide key="profile" dir={dir}>
                    <form onSubmit={(e) => { e.preventDefault(); handleProfileContinue(); }} className="space-y-5">
                      {/* Username */}
                      <div className="space-y-2">
                        <Label className="text-base sm:text-lg font-bold text-slate-800 block">Username</Label>
                        <Input
                          type="text"
                          value={username}
                          onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                          placeholder="Enter your username"
                          maxLength={16}
                          className="w-full h-14 px-4.5 bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder:text-slate-600/60 focus:bg-[#f8fafc] focus:!border-[#047857] focus:!ring-1 focus:!ring-emerald-500 focus-visible:!border-[#047857] focus-visible:!ring-1 focus-visible:!ring-emerald-500 transition-all rounded-2xl font-medium text-base sm:text-lg outline-none shadow-sm"
                          required
                        />
                        {usernameStatus === 'checking' && <p className="text-xs font-bold text-[#047857]">Checking username availability...</p>}
                        {usernameStatus === 'available' && <p className="text-xs font-bold text-[#047857]">✓ Username is available</p>}
                        {usernameStatus === 'taken' && <p className="text-xs font-bold text-red-500">✗ Username is already taken</p>}
                      </div>

                      {/* Email Address */}
                      <div className="space-y-2">
                        <Label className="text-base sm:text-lg font-bold text-slate-800 block">Email Address</Label>
                        <div className="flex items-center gap-2.5">
                          <div className="relative flex-1">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                              <Mail className="w-5 h-5" />
                            </div>
                            <Input
                              type="email"
                              value={email}
                              disabled={isEmailVerified}
                              onChange={e => {
                                setEmail(e.target.value);
                                setIsEmailVerified(false);
                                setShowEmailOtpPanel(false);
                              }}
                              placeholder="Enter your email address"
                              className={`w-full h-14 pl-12 pr-11 bg-[#f8fafc] border ${
                                emailStatus === 'taken' 
                                  ? 'border-red-400 focus:!border-red-500 focus:!ring-red-500' 
                                  : isEmailVerified || emailStatus === 'available'
                                  ? 'border-amber-400 focus:!border-amber-500 focus:!ring-amber-500'
                                  : 'border-slate-200 focus:!border-amber-500 focus:!ring-amber-500'
                              } text-slate-900 placeholder:text-slate-400 transition-all rounded-2xl font-medium text-base sm:text-lg outline-none shadow-sm disabled:bg-slate-50 disabled:text-slate-600`}
                              required
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                              {emailStatus === 'checking' && (
                                <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                              )}
                              {emailStatus === 'taken' && (
                                <AlertCircle className="w-5 h-5 text-red-500" />
                              )}
                              {(isEmailVerified || (emailStatus === 'available' && !isEmailVerified)) && (
                                <CheckCircle2 className={`w-5 h-5 ${isEmailVerified ? 'text-emerald-600 fill-emerald-500/10' : 'text-emerald-600'}`} />
                              )}
                            </div>
                          </div>

                          {/* Verify / Resend / Verified Button */}
                          {isEmailVerified ? (
                            <div className="h-14 px-5 rounded-2xl bg-white border border-slate-200 text-emerald-800 font-extrabold text-sm sm:text-base flex items-center justify-center gap-1.5 shrink-0 shadow-sm">
                              <CheckCircle2 className="w-4 h-4 text-[#047857]" />
                              <span>Verified</span>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              disabled={!email || !email.includes('@') || emailStatus === 'taken' || emailStatus === 'checking' || isSendingEmailOtp}
                              onClick={handleSendEmailOtp}
                              className="h-14 px-5 sm:px-6 rounded-2xl bg-white hover:bg-amber-100/80 border border-emerald-300 text-slate-900 font-extrabold text-base transition-all duration-200 active:scale-95 shrink-0 shadow-sm disabled:opacity-40"
                            >
                              {isSendingEmailOtp ? (
                                <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                              ) : showEmailOtpPanel ? (
                                "Resend"
                              ) : (
                                "Verify"
                              )}
                            </Button>
                          )}
                        </div>

                        {/* Error message if email already registered */}
                        {emailStatus === 'taken' && (
                          <p className="text-xs sm:text-sm font-semibold text-red-500 flex items-center gap-1.5 pt-0.5">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>Email already registered</span>
                          </p>
                        )}
                      </div>

                      {/* Collapsible Inline Email OTP Panel */}
                      <AnimatePresence>
                        {showEmailOtpPanel && !isEmailVerified && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="bg-white/60 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-slate-800 text-sm sm:text-base">Enter 6-Digit Email OTP</span>
                                <span className="bg-amber-200/80 text-amber-900 font-extrabold text-[11px] sm:text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                                  MAIL SENT
                                </span>
                              </div>

                              {/* 6 Square Input boxes for Email OTP */}
                              <OtpBoxes
                                value={emailOtp}
                                onChange={setEmailOtp}
                              />

                              <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-slate-600">
                                <span>Didn't receive email OTP?</span>
                                <button
                                  type="button"
                                  disabled={!canResendEmailOtp || isSendingEmailOtp}
                                  onClick={handleSendEmailOtp}
                                  className="font-extrabold text-emerald-800 hover:underline disabled:opacity-40 cursor-pointer border-none bg-transparent p-0"
                                >
                                  {canResendEmailOtp ? "Resend OTP" : `Resend in ${emailOtpTimer}s`}
                                </button>
                              </div>

                              <Button
                                type="button"
                                disabled={emailOtp.length !== 6 || isVerifyingEmailOtp}
                                onClick={handleVerifyEmailOtp}
                                className="w-full h-13 rounded-xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] hover:from-[#022c22] hover:via-[#064e3b] hover:to-[#047857] text-white font-extrabold text-base shadow-md shadow-emerald-900/20 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
                              >
                                {isVerifyingEmailOtp ? (
                                  <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Verifying OTP...</span>
                                  </>
                                ) : (
                                  <span>Confirm Email OTP</span>
                                )}
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Referral Code (Optional) */}
                      <div className="space-y-2">
                        <Label className="text-base sm:text-lg font-bold text-slate-800 block">Referral Code (Optional)</Label>
                        <Input
                          type="text"
                          value={referredBy}
                          onChange={e => setReferredBy(e.target.value.toUpperCase())}
                          placeholder="E.G. FIP12345"
                          className="w-full h-14 px-4.5 bg-[#f8fafc] border border-slate-200 text-slate-900 placeholder:text-slate-600/60 focus:bg-[#f8fafc] focus:!border-[#047857] focus:!ring-1 focus:!ring-emerald-500 focus-visible:!border-[#047857] focus-visible:!ring-1 focus-visible:!ring-emerald-500 transition-all rounded-2xl font-medium text-base sm:text-lg outline-none shadow-sm"
                        />
                        {referredByStatus === 'valid' && <p className="text-xs font-bold text-[#047857]">✓ Referred by {referrerName}</p>}
                        {referredByStatus === 'invalid' && <p className="text-xs font-bold text-red-500">✗ Invalid referral code</p>}
                      </div>

                      {err && <p className="text-red-500 text-sm font-semibold">{err}</p>}

                      <Button
                        type="submit"
                        disabled={!username || usernameStatus === 'taken' || !email || !isEmailVerified || isActionLoading}
                        className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] hover:from-[#022c22] hover:via-[#064e3b] hover:to-[#047857] text-white font-extrabold text-lg sm:text-xl shadow-lg shadow-emerald-900/20 transition-all duration-300 active:scale-[0.98] mt-6 flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
                      >
                        Continue
                      </Button>

                      {/* Instructions Footer Link */}
                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => setShowGuidelinesModal(true)}
                          className="text-[#047857] font-extrabold text-sm sm:text-base hover:underline cursor-pointer bg-transparent border-none p-0"
                        >
                          Read username &amp; security instructions - Click here
                        </button>
                      </div>
                    </form>
                  </FormSlide>
                )}

                {step === "tpin" && (
                  <FormSlide key="tpin" dir={dir}>
                    <form onSubmit={(e) => { e.preventDefault(); handleCreateAccount(); }} className="space-y-6">
                      <TpinBoxes value={tpin} onChange={setTpin} />

                      {err && <p className="text-red-500 text-sm font-semibold text-center">{err}</p>}

                      <Button
                        type="submit"
                        disabled={tpin.length !== 4 || isActionLoading}
                        className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] hover:from-[#022c22] hover:via-[#064e3b] hover:to-[#047857] text-white font-extrabold text-lg sm:text-xl shadow-lg shadow-emerald-900/20 transition-all duration-300 active:scale-[0.98] mt-7 flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
                      >
                        {isActionLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Saving PIN...</span>
                          </>
                        ) : (
                          <span>Complete Setup</span>
                        )}
                      </Button>
                    </form>
                  </FormSlide>
                )}

                {step === "success" && (
                  <FormSlide key="success" dir={dir}>
                    <div className="text-center space-y-4 py-3">
                      <div className="w-16 h-16 bg-white text-[#047857] rounded-full flex items-center justify-center mx-auto border border-amber-100/60 shadow-sm">
                        <CheckCircle className="w-10 h-10" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">Setup Complete!</h3>
                        <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
                          Your FipMoney account is verified and ready.
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={handleGoToDashboard}
                        className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] hover:from-[#022c22] hover:via-[#064e3b] hover:to-[#047857] text-white font-extrabold text-lg sm:text-xl shadow-lg shadow-emerald-900/20 transition-all duration-300 active:scale-[0.98] mt-7 flex items-center justify-center gap-2 cursor-pointer border-none disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
                      >
                        Go to Dashboard
                      </Button>
                    </div>
                  </FormSlide>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── GUIDELINES MODAL ── */}
      <AnimatePresence>
        {showGuidelinesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-[400px] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-200/60 flex justify-between items-center">
                 <h3 className="text-[20px] font-black text-slate-900">Security Guidelines</h3>
                 <button onClick={() => setShowGuidelinesModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 border-none cursor-pointer">
                   <XCircle size={18} />
                 </button>
              </div>
              <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                 <div>
                    <h4 className="text-[14px] font-bold text-slate-900 mb-2 flex items-center gap-2"><User size={16} className="text-amber-500"/> Username Instructions</h4>
                    <ul className="text-[13px] text-emerald-800 space-y-1.5 list-disc pl-5 m-0">
                       <li>Must be unique and not already taken.</li>
                       <li>Maximum 16 characters long.</li>
                       <li>Only alphabets, numbers, and underscores (_) are allowed.</li>
                       <li>Spaces and special characters (@, #, etc.) are strictly prohibited.</li>
                    </ul>
                 </div>
                 <div>
                    <h4 className="text-[14px] font-bold text-slate-900 mb-2 flex items-center gap-2"><ShieldCheck size={16} className="text-amber-500"/> T-PIN Security</h4>
                    <p className="text-[13px] text-emerald-800 m-0 leading-relaxed">
                       Your 4-digit Transactional PIN is highly sensitive. We do not store the actual numbers in our database. Instead, it is secured using <strong>SHA-256 one-way cryptographic hashing</strong>.
                    </p>
                 </div>
              </div>
              <div className="p-4 border-t border-gray-100">
                 <button onClick={() => setShowGuidelinesModal(false)} className="w-full py-3 rounded-xl bg-[#047857] text-white font-bold text-[14px] border-none cursor-pointer hover:bg-amber-600">
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
