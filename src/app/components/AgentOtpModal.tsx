"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Lock, X, ArrowRight, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

interface AgentOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mobileNumber?: string;
}

export default function AgentOtpModal({
  isOpen,
  onClose,
  onSuccess,
  mobileNumber = "+91 9490841941"
}: AgentOtpModalProps) {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first box when modal opens & reset timer
  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setError("");
      setIsSubmitting(false);
      setResendTimer(30);
      setCanResend(false);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
    }
  }, [isOpen]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer: any;
    if (isOpen && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [isOpen, resendTimer]);

  const handleChange = (index: number, value: string) => {
    // Only accept numeric characters
    const cleanVal = value.replace(/[^0-9]/g, "");
    if (!cleanVal) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // Handle single digit entry
    const digit = cleanVal.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError("");

    // Auto-advance to next input
    if (index < 5 && digit) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (pastedData) {
      const digits = pastedData.split("");
      const newOtp = ["", "", "", "", "", ""];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      setError("");
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleFillDemo = () => {
    setOtp(["1", "2", "3", "4", "5", "6"]);
    setError("");
    inputRefs.current[5]?.focus();
  };

  const handleResendOtp = () => {
    setResendTimer(30);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // Simulate OTP Verification
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="bg-white rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 relative text-center overflow-hidden"
        >
          {/* Top Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer border-none outline-none"
          >
            <X size={18} />
          </button>

          {/* Header Badge (User Dashboard Bluish / Indigo Theme) */}
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-5 shadow-xs">
            <Lock size={28} className="text-indigo-600" />
          </div>

          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Agent Access OTP
          </h3>
          
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed max-w-xs mx-auto">
            Please enter the 6-digit verification code sent to your registered mobile number <strong className="text-slate-900 font-bold">{mobileNumber}</strong>.
          </p>

          {/* Demo OTP Helper Pill */}
          <div className="mt-3">
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50/80 border border-indigo-200/80 text-indigo-700 text-[11px] font-black hover:bg-indigo-100/80 transition-colors cursor-pointer"
            >
              <CheckCircle2 size={12} className="text-indigo-600" /> Auto-fill Demo OTP (123456)
            </button>
          </div>

          {/* OTP Input Form */}
          <form onSubmit={handleVerify} className="mt-6 space-y-6">
            
            {/* 6 Curved Square Boxes */}
            <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`w-11 h-13 sm:w-12 sm:h-14 rounded-2xl border-2 font-mono font-black text-2xl text-center text-slate-900 outline-none transition-all shadow-xs ${
                    digit 
                      ? "border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-600/10 text-indigo-950" 
                      : "border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 bg-slate-50/50"
                  }`}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 py-2 px-3 rounded-xl border border-red-100"
              >
                <AlertCircle size={14} />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Resend Timer & Action */}
            <div className="text-xs font-semibold text-slate-500 flex items-center justify-center gap-1">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-indigo-700 hover:text-indigo-800 font-extrabold flex items-center gap-1 cursor-pointer bg-transparent border-none"
                >
                  <RefreshCw size={13} /> Resend OTP Code
                </button>
              ) : (
                <span>
                  Resend OTP code in <strong className="text-slate-900 font-black">{resendTimer}s</strong>
                </span>
              )}
            </div>

            {/* Action Buttons (User Dashboard Royal Indigo Palette) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1e1b4b] via-[#2d2968] to-[#312e81] hover:from-[#16133a] hover:to-[#252263] text-white font-black text-sm shadow-lg shadow-indigo-950/20 cursor-pointer transition-all flex items-center justify-center gap-2 border-none outline-none disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Verify & Open Agent Dashboard</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
