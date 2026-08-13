"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Award,
  TrendingUp,
  Users,
  Headphones,
  Zap,
  Megaphone,
  Clock,
  Sparkles,
  ChevronRight,
  KeyRound
} from "lucide-react";
import { saveLoggedInAgent, DEFAULT_DEMO_AGENT } from "../utils/agentStorage";

interface AgentAuthFlowProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export default function AgentAuthFlow({ onLoginSuccess, onNavigateHome }: AgentAuthFlowProps) {
  const [authMode, setAuthMode] = useState<"password" | "otp">("password");
  const [accountInput, setAccountInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      saveLoggedInAgent(DEFAULT_DEMO_AGENT);
      onLoginSuccess();
    }, 700);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (accountInput.replace(/\D/g, '').length < 10) {
      setErrorMsg("Please enter your 10-digit registered mobile number.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      saveLoggedInAgent(DEFAULT_DEMO_AGENT);
      onLoginSuccess();
    }, 800);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      saveLoggedInAgent(DEFAULT_DEMO_AGENT);
      onLoginSuccess();
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-slate-900 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#cb912e] selection:text-white">
      
      {/* Background Artwork Layer */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <img
          src="/dga_login_bg.png"
          alt="DGA Login Artwork Background"
          className="w-full h-full object-cover object-center opacity-95"
        />
        {/* Subtle ambient lighting overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/30 to-transparent pointer-events-none" />
      </div>

      {/* Top Header Bar */}
      <header className="px-6 lg:px-12 py-5 flex items-center justify-between z-20 relative">
        <div className="flex items-center gap-4 cursor-pointer" onClick={onNavigateHome}>
          {/* FipMoney Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#cb912e] via-[#d6a03a] to-[#b37a1c] p-0.5 shadow-md shadow-amber-600/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-amber-400 text-xl tracking-tighter">
                FM
              </div>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-[#b87c1e] block leading-none">FIPMONEY</span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-600 block mt-0.5">
                Empowering Digital Finance
              </span>
            </div>
          </div>

          {/* DGA Badge Next to Logo */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/90 border border-amber-200/90 shadow-sm backdrop-blur-md">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold">
              👑
            </div>
            <div>
              <span className="text-[11px] font-black tracking-wider text-slate-900 block leading-none">DGA</span>
              <span className="text-[9px] font-extrabold tracking-wider text-slate-500 uppercase">DIGITAL GOLD AGENT</span>
            </div>
          </div>
        </div>

        <button
          onClick={onNavigateHome}
          className="text-xs font-black text-slate-700 hover:text-slate-950 transition-all bg-white/80 hover:bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs cursor-pointer"
        >
          ← Return to Main Site
        </button>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-6 sm:py-10 flex-1 flex items-center justify-center z-10 relative">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Panel Typography & Feature Showcase */}
          <div className="lg:col-span-6 space-y-6 text-left pr-0 lg:pr-6">
            
            {/* Title Section */}
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-700 block mb-1">
                WELCOME TO YOUR
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#b37a1c] via-[#d6a03a] to-[#966311]">
                DGA PORTAL
              </h1>

              {/* Star Divider Line */}
              <div className="flex items-center gap-3 my-3">
                <div className="h-[1.5px] w-16 bg-gradient-to-r from-[#cb912e] to-amber-200" />
                <span className="text-[#cb912e] text-xs">★</span>
                <div className="h-[1.5px] w-32 bg-gradient-to-r from-amber-200 to-transparent" />
              </div>

              <p className="text-slate-700 text-sm sm:text-base font-extrabold leading-snug">
                Empower India with Digital Gold. <br />
                <span className="text-[#b87c1e] font-black">You Grow. We Grow.</span>
              </p>
            </div>

            {/* 4 Feature Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
              
              <div className="p-3.5 rounded-2xl bg-white/80 border border-white shadow-xs backdrop-blur-md flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center font-bold shrink-0">
                  <Users size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Trusted Network</h4>
                  <p className="text-[11px] text-slate-600 font-semibold leading-tight mt-0.5">Join 1000+ agents growing together.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/80 border border-white shadow-xs backdrop-blur-md flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center font-bold shrink-0">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">High Earnings</h4>
                  <p className="text-[11px] text-slate-600 font-semibold leading-tight mt-0.5">Earn high commissions on every transaction.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/80 border border-white shadow-xs backdrop-blur-md flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center font-bold shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Secure & Reliable</h4>
                  <p className="text-[11px] text-slate-600 font-semibold leading-tight mt-0.5">Backed by advanced security and trust.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/80 border border-white shadow-xs backdrop-blur-md flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center font-bold shrink-0">
                  <Headphones size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Agent Support</h4>
                  <p className="text-[11px] text-slate-600 font-semibold leading-tight mt-0.5">24x7 dedicated support whenever you need us.</p>
                </div>
              </div>

            </div>

            {/* Bottom Floating Banner Card */}
            <div className="max-w-lg p-4 rounded-3xl bg-white/90 border border-white shadow-lg backdrop-blur-md flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d6a03a] via-[#cb912e] to-[#966311] flex items-center justify-center text-white shadow-md shrink-0">
                <ShieldCheck size={26} />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-extrabold block">You are logging in as an</span>
                <h3 className="text-xs sm:text-sm font-black text-[#85550a] tracking-wide uppercase">
                  AUTHORIZED DIGITAL GOLD AGENT
                </h3>
                <span className="text-[11px] text-slate-600 font-bold block mt-0.5">Partner. Earn. Grow. Succeed.</span>
              </div>
            </div>

          </div>

          {/* Right Floating Agent Login Card (Pixel-Perfect to Target Design) */}
          <div className="lg:col-span-6 w-full max-w-[450px] mx-auto">
            <div className="bg-white/95 border border-white backdrop-blur-xl rounded-[32px] p-6 sm:p-9 shadow-2xl relative space-y-6">
              
              {/* Header Agent Avatar Circle */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full border-2 border-[#d6a03a] bg-[#fffcf7] flex items-center justify-center mx-auto shadow-md relative mb-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#e0ab44] to-[#b37a1c] text-white flex items-center justify-center text-2xl shadow-inner font-bold">
                    👤
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#cb912e] text-white flex items-center justify-center text-xs shadow-md border-2 border-white">
                    🛡️
                  </div>
                </div>

                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  Welcome Back, <span className="text-[#b87c1e]">Agent!</span>
                </h2>
                <p className="text-xs text-slate-500 font-extrabold mt-1">
                  Login to your <strong className="text-[#b87c1e]">DGA</strong> account to continue
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Login Form: Password Mode vs OTP Mode */}
              {authMode === "password" ? (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  
                  {/* Field 1: Agent ID / Mobile */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                      Agent ID / Mobile Number
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={accountInput}
                        onChange={(e) => setAccountInput(e.target.value)}
                        placeholder="Enter your registered mobile number"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-extrabold text-xs focus:border-[#cb912e] focus:bg-white focus:outline-none transition-colors shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Field 2: Password */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-extrabold text-xs focus:border-[#cb912e] focus:bg-white focus:outline-none transition-colors shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <div className="text-right mt-1.5">
                      <button
                        type="button"
                        onClick={handleDemoLogin}
                        className="text-xs font-extrabold text-[#b87c1e] hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#cb912e] via-[#d6a03a] to-[#b37a1c] hover:from-[#b37a1c] hover:to-[#cb912e] text-white font-extrabold text-sm shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all border-none outline-none disabled:opacity-50"
                  >
                    {isLoading ? "Authenticating..." : <>➡️ Login to Agent Dashboard</>}
                  </button>

                  {/* Separator */}
                  <div className="flex items-center gap-3 my-4">
                    <div className="h-[1px] flex-1 bg-slate-200" />
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">OR</span>
                    <div className="h-[1px] flex-1 bg-slate-200" />
                  </div>

                  {/* Secondary Button: Login with OTP */}
                  <button
                    type="button"
                    onClick={() => { setAuthMode("otp"); setErrorMsg(""); }}
                    className="w-full py-3.5 rounded-2xl border border-[#cb912e] bg-[#fffdfa] hover:bg-[#fff7e8] text-[#b87c1e] font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-2xs"
                  >
                    <Shield size={16} /> Login with OTP
                  </button>

                </form>
              ) : (
                <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                  {!otpSent ? (
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                        Registered Agent Mobile Number
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          maxLength={10}
                          value={accountInput}
                          onChange={(e) => setAccountInput(e.target.value.replace(/\D/g, ''))}
                          placeholder="Enter 10-digit mobile number"
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-extrabold text-xs focus:border-[#cb912e] focus:bg-white focus:outline-none transition-colors shadow-2xs"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                        Enter 4-Digit Security OTP
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 1234"
                        className="w-full px-4 py-3 text-center tracking-[0.5em] rounded-2xl bg-slate-50 border border-slate-200 text-[#b87c1e] font-black text-2xl focus:border-[#cb912e] focus:bg-white focus:outline-none transition-colors shadow-2xs"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#cb912e] via-[#d6a03a] to-[#b37a1c] hover:from-[#b37a1c] hover:to-[#cb912e] text-white font-extrabold text-sm shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all border-none outline-none disabled:opacity-50"
                  >
                    {isLoading ? "Processing..." : (!otpSent ? "Send OTP Code →" : "Verify & Login →")}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => { setAuthMode("password"); setOtpSent(false); }}
                      className="text-xs font-extrabold text-[#b87c1e] hover:underline cursor-pointer"
                    >
                      ← Back to Password Login
                    </button>
                  </div>
                </form>
              )}

              {/* Bottom 4 Feature Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-100 text-center">
                <div className="p-2 rounded-xl bg-slate-50 flex flex-col items-center justify-center">
                  <Headphones size={16} className="text-[#cb912e] mb-1" />
                  <span className="text-[10px] font-extrabold text-slate-700 leading-tight">Dedicated Agent Support</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 flex flex-col items-center justify-center">
                  <Zap size={16} className="text-[#cb912e] mb-1" />
                  <span className="text-[10px] font-extrabold text-slate-700 leading-tight">Real-time Payouts</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 flex flex-col items-center justify-center">
                  <Megaphone size={16} className="text-[#cb912e] mb-1" />
                  <span className="text-[10px] font-extrabold text-slate-700 leading-tight">Marketing Resources</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 flex flex-col items-center justify-center">
                  <Clock size={16} className="text-[#cb912e] mb-1" />
                  <span className="text-[10px] font-extrabold text-slate-700 leading-tight">24x7 Assistance</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 px-6 text-center text-[11px] text-slate-500 font-extrabold border-t border-white/60 bg-white/70 backdrop-blur-md z-20">
        © 2026 FipMoney Digital Gold Agent Network. All Rights Reserved.
      </footer>
    </div>
  );
}
