"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CheckCircle, XCircle, RefreshCw,
  LockKeyhole, ShieldCheck, Smartphone, Eye, EyeOff, Loader2,
} from "lucide-react";
import fipMoneyLogo from "../../imports/fipmoney_logo_final.png";
import loginBgFm    from "../../imports/login_bg_fm.png";
import { AnimatedOTPInput } from "../../imports/pasted_text/animated-input-otp";

/* ── palette ── */
const G    = "#d89221";
const G_LT = "#efb652";
const G_DK = "#b87312";
const TP   = "#111827";
const TS   = "#6b7280";
const ease = [0.22, 1, 0.36, 1] as const;

type Step = "mobile" | "otp" | "profile" | "success";

/* localStorage-based registration mock */
const REG_KEY = (m: string) => `fm_registered_${m}`;
const isRegistered  = (m: string) => !!localStorage.getItem(REG_KEY(m));
const markRegistered = (m: string) => localStorage.setItem(REG_KEY(m), "1");

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

/* ── trust badges ── */
const trustBadges = [
  { icon: ShieldCheck, label: "Secure & Safe"   },
  { icon: LockKeyhole, label: "Instant Access"  },
  { icon: CheckCircle, label: "Grow Wealth"     },
  { icon: Smartphone,  label: "24/7 Support"    },
];

/* ══════════════════════════════════════════════════
   SHARED ATOMS
══════════════════════════════════════════════════ */
function FormSlide({ children, dir }: { children: React.ReactNode; dir: number }) {
  return (
    <motion.div
      custom={dir}
      initial={(d: number) => ({ x: d * 32, opacity: 0 })}
      animate={{ x: 0, opacity: 1 }}
      exit={(d: number) => ({ x: d * -32, opacity: 0 })}
      transition={{ duration: 0.26, ease }}
    >
      {children}
    </motion.div>
  );
}

function GoldButton({
  children, onClick, disabled,
}: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick} disabled={disabled}
      whileHover={!disabled ? { translateY: -2, boxShadow: "0 14px 28px rgba(216,146,33,0.38)" } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      className="w-full font-bold tracking-widest uppercase border-none cursor-pointer"
      style={{
        height: 50, borderRadius: 10, fontSize: 13, letterSpacing: "0.13em",
        background: disabled ? "#e5e7eb" : `linear-gradient(135deg, ${G} 0%, ${G_LT} 100%)`,
        color: disabled ? "#9ca3af" : "white",
      }}
    >
      {children}
    </motion.button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9ca3af" }}>
      {children}
    </label>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center justify-center gap-1.5 text-sm border-none bg-transparent cursor-pointer py-1"
      style={{ color: TS }}>
      <ArrowLeft size={13} /> Back
    </button>
  );
}

/* 6-box OTP input */
function OtpBoxes({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative" style={{ height: 58 }}>
      <input
        type="tel" inputMode="numeric" maxLength={6} value={value} autoFocus
        onChange={e => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        className="absolute inset-0 opacity-0 w-full h-full cursor-text z-10"
      />
      <div className="flex gap-2 pointer-events-none">
        {[0,1,2,3,4,5].map(i => {
          const char = value[i] || "";
          const isActive = value.length === i;
          return (
            <motion.div key={i} animate={{ scale: char ? 1.07 : 1 }}
              className="flex items-center justify-center text-xl font-black flex-1"
              style={{
                height: 56, borderRadius: 10, fontSize: 22,
                background: char ? "rgba(216,146,33,0.07)" : "#f9fafb",
                border: isActive ? `2px solid ${G}` : char ? `2px solid rgba(216,146,33,0.45)` : "1.5px solid #e5e7eb",
                color: char ? TP : "#d1d5db",
                boxShadow: isActive ? "0 0 0 4px rgba(216,146,33,0.1)" : "none",
                transition: "all 0.15s ease",
              }}>
              {char || (isActive
                ? <motion.div className="w-0.5 h-5 rounded-full" style={{ background: G }}
                    animate={{ opacity: [0,1,0] }} transition={{ duration: 1, repeat: Infinity }} />
                : "·")}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN AUTH FLOW  (single page — login + signup)
══════════════════════════════════════════════════ */
export default function AuthFlow({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [step,     setStep]     = useState<Step>("mobile");
  const [dir,      setDir]      = useState(1);
  const [mobile,   setMobile]   = useState("");
  const [otp,      setOtp]      = useState("");
  const [err,      setErr]      = useState("");

  /* registration-check state */
  const [checking,    setChecking]    = useState(false);   // spinner while "checking"
  const [regStatus,   setRegStatus]   = useState<"registered" | "new" | null>(null);

  /* new-user profile fields */
  const [panName,  setPanName]  = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [showCp,   setShowCp]   = useState(false);

  const { timer, canResend, reset } = useResendTimer(30);

  const go   = (fn: () => void) => { setDir(1);  fn(); };
  const back = (fn: () => void) => { setDir(-1); fn(); };

  /* ── mobile number change: trigger check when 10 digits entered ── */
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

  const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : /[A-Z]/.test(password) && /\d/.test(password) ? 4 : 3;
  const pwColors   = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
  const pwLabels   = ["", "Weak", "Fair", "Good", "Strong"];

  /* ── button label / action depending on registration status ── */
  const isNew        = regStatus === "new";
  const isReg        = regStatus === "registered";
  const btnLabel     = isNew ? "SIGN UP" : "SEND OTP";
  const btnDisabled  = mobile.length !== 10 || checking || regStatus === null;

  const handlePrimaryBtn = () => {
    if (!validateMobile()) return;
    reset();
    go(() => setStep("otp"));
  };

  const handleOtpVerify = () => {
    if (isNew) {
      // new user → go to profile
      go(() => setStep("profile"));
    } else {
      // existing user → mark+go to success
      markRegistered(mobile);
      go(() => setStep("success"));
    }
  };

  const handleCreateAccount = () => {
    markRegistered(mobile);
    go(() => setStep("success"));
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 lg:p-8"
      style={{ background: "linear-gradient(135deg, #fde5b8 0%, #ffd28a 35%, #ffe4b0 65%, #fce8c4 100%)", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* ambient blobs */}
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,200,80,0.5), transparent 70%)", filter: "blur(80px)", transform: "translate(30%,-30%)" }} />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(240,150,30,0.3), transparent 70%)", filter: "blur(70px)", transform: "translate(-30%,30%)" }} />

      <motion.div className="relative w-full flex overflow-hidden"
        style={{ maxWidth: 1100, minHeight: 680, borderRadius: 28, boxShadow: "0 40px 100px rgba(120,70,0,0.18), 0 8px 30px rgba(120,70,0,0.10)" }}
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease }}>

        {/* ── LEFT: full image panel ── */}
        <div className="hidden lg:flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{ width: "50%", background: "linear-gradient(160deg, #f9f3e8 0%, #f2e8d0 60%, #ede0c4 100%)" }}>
          <img src={loginBgFm} alt="FipMoney — Smart Finance, Secure Future"
            className="w-full h-full" style={{ objectFit: "contain", objectPosition: "center" }} draggable={false} />
        </div>

        {/* ── RIGHT: form panel ── */}
        <div className="relative flex flex-col justify-between flex-1 z-10 bg-white" style={{ padding: "44px 52px 32px" }}>

          {/* top bar */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex lg:hidden items-center gap-2">
              <img src={fipMoneyLogo} alt="FipMoney" className="h-8 object-contain" />
              <span className="font-black text-lg" style={{ color: TP }}>FipMoney</span>
            </div>
            <div className="hidden lg:block" />
            <button onClick={() => onNavigate("home")}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border-none cursor-pointer"
              style={{ background: "#f3f4f6", color: TS }}>
              <ArrowLeft size={11} /> Home
            </button>
          </div>

          {/* form area */}
          <div className="flex-1 flex flex-col justify-center" style={{ maxWidth: 380, margin: "0 auto", width: "100%" }}>
            <AnimatePresence mode="wait" custom={dir}>

              {/* ══ STEP 1: MOBILE ══ */}
              {step === "mobile" && (
                <FormSlide key="mobile" dir={dir}>
                  <h2 className="font-black m-0 mb-1 leading-tight"
                    style={{ fontSize: "clamp(26px,3vw,38px)", letterSpacing: -1.2, color: TP }}>
                    Welcome Back!
                  </h2>
                  <p className="mt-2 mb-8 text-sm" style={{ color: TS }}>
                    Login to access your FipMoney account
                  </p>

                  <div className="space-y-4">
                    {/* mobile input */}
                    <div>
                      <FieldLabel>Mobile Number</FieldLabel>
                      <div className={`flex items-center rounded-xl transition-all ${err ? "ring-2 ring-red-400" : mobile.length === 10 && !checking ? "" : "focus-within:ring-2 focus-within:ring-amber-300"}`}
                        style={{ height: 52, padding: "0 14px", border: `1.5px solid ${err ? "#f87171" : regStatus === "new" ? "#f87171" : regStatus === "registered" ? "#10b981" : "#e5e7eb"}`, background: "#f9fafb" }}>
                        <div className="flex items-center gap-2 pr-3 flex-shrink-0" style={{ borderRight: "1.5px solid #e5e7eb" }}>
                          <span style={{ fontSize: 18 }}>🇮🇳</span>
                          <span className="font-bold text-sm" style={{ color: TP }}>+91</span>
                        </div>
                        <input type="tel" inputMode="numeric" maxLength={10} value={mobile} autoFocus
                          onChange={e => handleMobileChange(e.target.value)}
                          placeholder="Enter your number"
                          className="flex-1 min-w-0 border-none outline-none bg-transparent ml-3 text-sm"
                          style={{ color: TP }} />

                        {/* status icon */}
                        <div className="flex-shrink-0 ml-2">
                          {checking && <Loader2 size={18} className="animate-spin" style={{ color: G }} />}
                          {!checking && regStatus === "registered" && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                              <CheckCircle size={20} style={{ color: "#10b981" }} />
                            </motion.div>
                          )}
                          {!checking && regStatus === "new" && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                              <XCircle size={20} style={{ color: "#f87171" }} />
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* status message */}
                      {err && <p className="text-red-500 text-xs mt-1.5">{err}</p>}
                      {!err && regStatus === "registered" && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                          className="text-xs mt-1.5 font-semibold" style={{ color: "#10b981" }}>
                          ✓ Registered account found
                        </motion.p>
                      )}
                      {!err && regStatus === "new" && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                          className="text-xs mt-1.5 font-semibold" style={{ color: "#f87171" }}>
                          ✗ New number — we'll create your account
                        </motion.p>
                      )}
                    </div>

                    {/* CTA — label changes based on status */}
                    <GoldButton disabled={btnDisabled} onClick={handlePrimaryBtn}>
                      {checking ? "CHECKING..." : btnLabel}
                    </GoldButton>

                    {/* OR divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
                      <span className="text-xs font-semibold" style={{ color: "#9ca3af" }}>OR</span>
                      <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
                    </div>

                    <button
                      className="w-full flex items-center justify-center gap-2 font-semibold text-sm border-none cursor-pointer rounded-xl"
                      style={{ height: 50, background: "white", border: "1.5px solid #e5e7eb", color: TP, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
                      onClick={() => onNavigate("home")}
                    >
                      <img src={fipMoneyLogo} className="h-5 w-5 object-contain" alt="" />
                      Continue with FipMoney App
                    </button>
                  </div>
                </FormSlide>
              )}

              {/* ══ STEP 2: OTP ══ */}
              {step === "otp" && (
                <FormSlide key="otp" dir={dir}>
                  <h2 className="font-black m-0 mb-1 leading-tight"
                    style={{ fontSize: "clamp(26px,3vw,38px)", letterSpacing: -1.2, color: TP }}>
                    Verify OTP
                  </h2>
                  <p className="mt-2 mb-8 text-sm" style={{ color: TS }}>
                    Code sent to{" "}
                    <button onClick={() => back(() => setStep("mobile"))}
                      className="font-semibold border-none bg-transparent cursor-pointer" style={{ color: G_DK }}>
                      +91 {mobile} ✏️
                    </button>
                  </p>
                  <div className="space-y-5">
                    <OtpBoxes value={otp} onChange={setOtp} />
                    <div className="text-sm" style={{ color: TS }}>
                      {canResend
                        ? <button onClick={reset} className="flex items-center gap-1.5 border-none bg-transparent cursor-pointer font-semibold" style={{ color: G_DK }}>
                            <RefreshCw size={12} /> Resend OTP
                          </button>
                        : <span>Resend in <strong style={{ color: TP }}>0:{timer.toString().padStart(2,"0")}</strong></span>}
                    </div>
                    <GoldButton disabled={otp.length !== 6} onClick={handleOtpVerify}>
                      {isNew ? "VERIFY & CONTINUE" : "VERIFY & LOGIN"}
                    </GoldButton>
                    <BackBtn onClick={() => back(() => setStep("mobile"))} />
                  </div>
                </FormSlide>
              )}

              {/* ══ STEP 3: PROFILE (new users only) ══ */}
              {step === "profile" && (
                <FormSlide key="profile" dir={dir}>
                  <h2 className="font-black m-0 mb-1 leading-tight"
                    style={{ fontSize: "clamp(24px,2.8vw,34px)", letterSpacing: -1, color: TP }}>
                    Complete Profile
                  </h2>
                  <p className="mt-2 mb-6 text-sm" style={{ color: TS }}>Almost there — just a few details</p>
                  <div className="space-y-4">
                    <div>
                      <FieldLabel>Full Name (as per PAN)</FieldLabel>
                      <input type="text" value={panName} onChange={e => setPanName(e.target.value.toUpperCase())}
                        placeholder="RAHUL KUMAR SHARMA"
                        className="w-full rounded-xl border-none outline-none font-semibold uppercase tracking-wide text-sm"
                        style={{ height: 50, padding: "0 14px", border: "1.5px solid #e5e7eb", background: "#f9fafb", color: TP }} />
                    </div>
                    <div>
                      <FieldLabel>Create Password</FieldLabel>
                      <div className="relative">
                        <input type={showPw ? "text" : "password"} value={password}
                          onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters"
                          className="w-full rounded-xl border-none outline-none text-sm"
                          style={{ height: 50, padding: "0 44px 0 14px", border: "1.5px solid #e5e7eb", background: "#f9fafb", color: TP }} />
                        <button onClick={() => setShowPw(v => !v)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer" style={{ color: TS }}>
                          {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
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
                          <p className="text-xs font-semibold m-0" style={{ color: pwColors[pwStrength] }}>{pwLabels[pwStrength]}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <FieldLabel>Confirm Password</FieldLabel>
                      <div className="relative">
                        <input type={showCp ? "text" : "password"} value={confirm}
                          onChange={e => setConfirm(e.target.value)} placeholder="Re-enter password"
                          className="w-full rounded-xl border-none outline-none text-sm"
                          style={{ height: 50, padding: "0 44px 0 14px", border: `1.5px solid ${confirm && password !== confirm ? "#f87171" : "#e5e7eb"}`, background: "#f9fafb", color: TP }} />
                        <button onClick={() => setShowCp(v => !v)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer" style={{ color: TS }}>
                          {showCp ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      {confirm && password !== confirm && <p className="text-red-500 text-xs mt-1.5">Passwords don't match</p>}
                    </div>
                    <GoldButton
                      disabled={!panName || password.length < 8 || password !== confirm}
                      onClick={handleCreateAccount}>
                      CREATE ACCOUNT
                    </GoldButton>
                    <BackBtn onClick={() => back(() => setStep("otp"))} />
                  </div>
                </FormSlide>
              )}

              {/* ══ STEP 4: SUCCESS ══ */}
              {step === "success" && (
                <FormSlide key="success" dir={dir}>
                  <div className="text-center py-6">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 14 }}
                      className="w-24 h-24 rounded-full mx-auto mb-5 flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${G}, ${G_LT})`, boxShadow: "0 0 50px rgba(216,146,33,0.4)" }}>
                      <CheckCircle size={48} color="white" />
                    </motion.div>
                    <h2 className="font-black text-3xl m-0 mb-2" style={{ color: TP }}>
                      {isNew ? "Account Created!" : "Welcome back!"}
                    </h2>
                    <p className="text-sm mb-8" style={{ color: TS }}>Your gold portfolio awaits.</p>
                    <GoldButton onClick={() => onNavigate("dashboard")}>GO TO DASHBOARD</GoldButton>
                  </div>
                </FormSlide>
              )}

            </AnimatePresence>
          </div>

          {/* trust badges */}
          <div className="grid grid-cols-4 gap-2 mt-8 pt-6" style={{ borderTop: "1px solid #f3f4f6" }}>
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(216,146,33,0.1)" }}>
                  <Icon size={16} style={{ color: G }} />
                </div>
                <span className="text-xs font-semibold leading-tight" style={{ color: TS }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
