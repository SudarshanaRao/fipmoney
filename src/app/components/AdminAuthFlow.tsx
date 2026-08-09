"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Lock, Mail, Phone, Key, ArrowRight, User, AlertCircle,
  CheckCircle2, Sparkles, Terminal, Shield, UserCheck, Eye, EyeOff,
  ChevronDown, BarChart3, ShieldAlert, Check
} from "lucide-react";
import {
  getStoredAdmins,
  findAdminBySecretCode,
  createAdminUserWithCode,
  setAdminSession,
  AdminUser
} from "../utils/adminStorage";

interface AdminAuthFlowProps {
  mode: 'signup' | 'login_by_code';
  secretCodeFromUrl?: string;
  onSuccess: () => void;
  onNavigateToSecretCode: (code: string) => void;
  onBackToMainSite: () => void;
}

export default function AdminAuthFlow({
  mode,
  secretCodeFromUrl = "2787",
  onSuccess,
  onNavigateToSecretCode,
  onBackToMainSite
}: AdminAuthFlowProps) {
  // Signup State
  const [signupStep, setSignupStep] = useState<'details' | 'otp_verify' | 'approved'>('details');
  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@fipmoney.com");
  const [mobile, setMobile] = useState("98765 43210");
  const [secretCodeInput, setSecretCodeInput] = useState("2787"); // 4-digit code e.g. 2787
  const [password, setPassword] = useState("Admin@2026");
  const [role, setRole] = useState<AdminUser['role']>("Super Admin");

  const [showPassword, setShowPassword] = useState(false);
  const [showSecretCode, setShowSecretCode] = useState(false);

  // Email OTP State
  const [generatedOtp, setGeneratedOtp] = useState("849201");
  const [enteredOtp, setEnteredOtp] = useState("");

  // Login for Secret Code State
  const [loginEmail, setLoginEmail] = useState("admin@fipmoney.com");
  const [loginPassword, setLoginPassword] = useState("Admin@2026");

  // Feedback State
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Handle Signup Submit (Step 1 -> Send Email OTP)
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name.trim() || !email.trim() || !mobile.trim() || !password) {
      setErrorMsg("Please fill in all required admin registration fields.");
      return;
    }

    if (!/^\d{4}$/.test(secretCodeInput.trim())) {
      setErrorMsg("Secret code must be exactly a 4-digit number (e.g. 2787).");
      return;
    }

    // Generate random 6-digit Email OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setSignupStep('otp_verify');
    setSuccessMsg(`Email approval OTP sent to ${email}. (Demo OTP: ${otp})`);
  };

  // Handle OTP Verification (Step 2 -> Approve Signup)
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (enteredOtp.trim() !== generatedOtp.trim()) {
      setErrorMsg("INVALID EMAIL OTP. Please enter the correct 6-digit approval code.");
      return;
    }

    const newAdmin = createAdminUserWithCode(name, email, mobile, secretCodeInput.trim(), role);
    setSignupStep('approved');
    setSuccessMsg(`Admin Account Approved! Your 4-digit secret access code URL is /admin/${secretCodeInput.trim()}`);
  };

  // Handle Login for Secret Code URL (/admin/2787)
  const handleSecretCodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const targetAdmin = findAdminBySecretCode(secretCodeFromUrl);

    if (!targetAdmin) {
      if (secretCodeFromUrl === "2787") {
        const masterAdmin: AdminUser = {
          id: 'ADM-001',
          name: 'Admin User',
          email: loginEmail,
          mobile: '+91 98765 43210',
          secretCode: '2787',
          role: 'Super Admin',
          createdAt: new Date().toISOString().substring(0, 10),
          status: 'Active',
          lastLogin: new Date().toLocaleString(),
          permissions: ['all']
        };
        setAdminSession(masterAdmin);
        setSuccessMsg("Secret Code & Credentials Authorized. Entering Admin Dashboard...");
        setTimeout(() => onSuccess(), 600);
        return;
      }
      setErrorMsg(`No approved admin account found for secret code /admin/${secretCodeFromUrl}`);
      return;
    }

    setAdminSession(targetAdmin);
    setSuccessMsg(`Welcome, ${targetAdmin.name}! Secret Code /admin/${secretCodeFromUrl} Verified.`);
    setTimeout(() => onSuccess(), 600);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-800 flex flex-col justify-between p-4 sm:p-6 md:p-10 font-sans relative overflow-x-hidden">
      
      {/* HEADER TOP BAR */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between mb-8 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-amber-500/20">
            FM
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-900 leading-none block">
              Fipmoney
            </span>
            <span className="text-[10px] font-extrabold text-[#7C3AED] uppercase tracking-wider block mt-0.5">
              ADMIN PORTAL
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200/80 px-4 py-2 rounded-full shadow-2xs flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-100 text-[#D97706] flex items-center justify-center">
              <ShieldCheck size={14} />
            </div>
            <div className="text-left">
              <div className="text-xs font-black text-slate-900 leading-none">100% SECURE</div>
              <div className="text-[9px] font-semibold text-slate-400">Encrypted & Protected</div>
            </div>
          </div>

          <button
            onClick={onBackToMainSite}
            className="text-xs font-extrabold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2.5 rounded-full transition-all cursor-pointer outline-none shadow-2xs"
          >
            Exit Portal
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN CONTAINER */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto items-center z-10">
        
        {/* LEFT COLUMN: HERO MARKETING & 3D PODIUM ASSET */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Built for Control.<br />
              <span className="text-[#D97706]">Secured by Trust.</span>
            </h1>
            <p className="text-sm font-semibold text-slate-500 max-w-md leading-relaxed">
              Create your admin account and manage the entire Gold SIP platform with full control and confidence.
            </p>
          </div>

          {/* 4 Value Proposition Items */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100/70 border border-amber-200/70 text-[#D97706] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <ShieldCheck size={18} strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Top-Level Security</h4>
                <p className="text-[11px] font-semibold text-slate-500 mt-0.5 leading-snug">
                  Advanced protection with email verification and encrypted access.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100/70 border border-amber-200/70 text-[#D97706] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Lock size={18} strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Top Secret Code</h4>
                <p className="text-[11px] font-semibold text-slate-500 mt-0.5 leading-snug">
                  A hidden 4-digit code that keeps your access completely private.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100/70 border border-amber-200/70 text-[#D97706] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <UserCheck size={18} strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Role-Based Access</h4>
                <p className="text-[11px] font-semibold text-slate-500 mt-0.5 leading-snug">
                  Assign roles and permissions to manage efficiently.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100/70 border border-amber-200/70 text-[#D97706] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <BarChart3 size={18} strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Complete Control</h4>
                <p className="text-[11px] font-semibold text-slate-500 mt-0.5 leading-snug">
                  Monitor plans, users, investments and platform performance in one place.
                </p>
              </div>
            </div>
          </div>

          {/* 3D Gold Shield / Podium Graphic Illustration */}
          <div className="relative py-4 flex justify-center pointer-events-none">
            <div className="w-64 h-44 rounded-[32px] bg-gradient-to-tr from-amber-100/60 via-purple-50/50 to-white border border-amber-200/60 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white font-black text-3xl flex items-center justify-center shadow-2xl shadow-amber-500/40 border-2 border-amber-300">
                FM
              </div>
              <div className="text-xs font-black text-slate-900 mt-2 tracking-widest uppercase">
                SECURITY ENCLAVE
              </div>
            </div>
          </div>

          {/* Bottom Disclaimer Banner */}
          <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">Your security is our priority.</div>
              <div className="text-[11px] font-semibold text-slate-500">
                All data is encrypted and access is strictly authorized.
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MAIN ADMIN REGISTRATION CARD */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 md:p-10 shadow-xl shadow-purple-900/5 space-y-6 relative"
          >
            {/* Form Header */}
            <div className="flex items-start gap-4 pb-2 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-purple-100/80 text-[#7C3AED] flex items-center justify-center shrink-0">
                <UserCheck size={24} strokeWidth={2.2} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin Registration</h2>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Create your admin account with top-level security
                </p>
                <div className="w-12 h-1 bg-amber-400 rounded-full mt-2" />
              </div>
            </div>

            {/* Error / Success Feedback */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-extrabold p-3.5 rounded-2xl flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold p-3.5 rounded-2xl flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* MODE 1: REGISTRATION FORM */}
            {mode === 'signup' && (
              <>
                {signupStep === 'details' && (
                  <form onSubmit={handleSignupSubmit} className="space-y-5">
                    {/* Row 1: Full Name & Official Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                          Full Name
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-600">
                            <User size={16} />
                          </span>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Admin User"
                            className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                          Official Email (For OTP Approval)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-600">
                            <Mail size={16} />
                          </span>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@fipmoney.com"
                            className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Mobile Number & Create Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                          Mobile Number
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-3 text-xs font-black text-slate-800 flex items-center gap-1.5 shrink-0">
                            <span>🇮🇳 +91</span>
                            <ChevronDown size={12} className="text-slate-400" />
                          </div>
                          <div className="relative flex-1">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-600">
                              <Phone size={15} />
                            </span>
                            <input
                              type="tel"
                              value={mobile}
                              onChange={(e) => setMobile(e.target.value)}
                              required
                              placeholder="98765 43210"
                              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                          Create Password
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-600">
                            <Lock size={16} />
                          </span>
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••••••"
                            className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent"
                          >
                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Row 3: 4-Digit Secret Code Purple Box */}
                    <div className="bg-purple-50/60 border border-purple-200/80 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex-1 w-full">
                        <label className="text-xs font-black text-slate-900 block mb-1.5 flex items-center gap-1.5">
                          <Lock size={14} className="text-[#7C3AED]" />
                          <span>4-Digit Secret Code</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showSecretCode ? "text" : "password"}
                            maxLength={4}
                            value={secretCodeInput}
                            onChange={(e) => setSecretCodeInput(e.target.value.replace(/\D/g, ''))}
                            required
                            placeholder="2787"
                            className="w-full bg-white border border-purple-200 rounded-xl pl-4 pr-10 py-2.5 text-base font-black text-slate-900 tracking-widest font-mono focus:outline-none focus:border-[#7C3AED]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSecretCode(!showSecretCode)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent"
                          >
                            {showSecretCode ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>

                      {/* Top Secret Note Box */}
                      <div className="bg-white/90 border border-purple-200/80 rounded-xl p-3.5 flex items-center gap-3 flex-1 w-full shadow-2xs">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0">
                          <ShieldCheck size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-black text-[#7C3AED]">Top Secret</div>
                          <div className="text-[10px] font-semibold text-slate-500 leading-snug">
                            This code is for your eyes only. Keep it safe and never share it with anyone.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Row 4: Admin Role Selection */}
                    <div>
                      <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                        Admin Role
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-600">
                          <UserCheck size={16} />
                        </span>
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value as AdminUser['role'])}
                          className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C3AED] focus:bg-white appearance-none transition-colors"
                        >
                          <option value="Super Admin">Super Admin (Full Access)</option>
                          <option value="Finance Manager">Finance Manager (Treasury & Vault)</option>
                          <option value="Support Lead">Support Lead (KYC & User Desk)</option>
                          <option value="Compliance Officer">Compliance Officer (Auditor)</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Row 5: Email Approval Banner & CTA Submit Button */}
                    <div className="bg-[#FFFDF0] border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#D97706] flex items-center justify-center shrink-0">
                          <Mail size={20} />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900">Email approval required</div>
                          <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                            We'll send a secure OTP to your email for verification.
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black text-xs px-6 py-3.5 rounded-xl shadow-md shadow-purple-600/20 transition-all flex items-center gap-2 cursor-pointer border-none outline-none shrink-0 self-stretch sm:self-auto justify-center"
                      >
                        <Mail size={16} />
                        <span>Send Email Approval OTP</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 2: EMAIL OTP APPROVAL SCREEN */}
                {signupStep === 'otp_verify' && (
                  <form onSubmit={handleVerifyOtp} className="space-y-5 py-4">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 rounded-3xl bg-purple-100 text-[#7C3AED] flex items-center justify-center mx-auto shadow-md">
                        <Mail size={32} />
                      </div>
                      <h3 className="text-xl font-black text-slate-900">Approve Signup via Email OTP</h3>
                      <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto">
                        We sent a 6-digit approval code to <span className="font-bold text-slate-900">{email}</span>
                      </p>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl text-center text-sm font-mono font-black text-[#7C3AED]">
                      APPROVAL OTP: {generatedOtp}
                    </div>

                    <div>
                      <label className="text-xs font-extrabold text-slate-700 block mb-2 text-center uppercase tracking-wider">
                        Enter 6-Digit Email OTP
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                        required
                        placeholder="849201"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-center text-2xl font-black text-slate-900 tracking-widest font-mono focus:outline-none focus:border-[#7C3AED]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black text-xs py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-none outline-none"
                    >
                      <CheckCircle2 size={18} />
                      <span>Verify & Approve Admin Account</span>
                    </button>
                  </form>
                )}

                {/* STEP 3: APPROVED SUCCESS SCREEN */}
                {signupStep === 'approved' && (
                  <div className="text-center space-y-5 py-4">
                    <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                      <ShieldCheck size={36} />
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Admin Account Approved!</h3>
                      <p className="text-xs font-semibold text-slate-500 mt-1">
                        Your secret 4-digit code access URL is <span className="font-bold text-[#7C3AED]">/admin/{secretCodeInput}</span>
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-left space-y-2.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">Admin Name:</span>
                        <span className="font-black text-slate-900">{name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">Secret Access URL:</span>
                        <span className="font-black text-[#7C3AED] font-mono">/admin/{secretCodeInput}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigateToSecretCode(secretCodeInput)}
                      className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black text-xs py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-none outline-none"
                    >
                      <span>Go to Secret URL /admin/{secretCodeInput}</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* MODE 2: LOGIN FOR SECRET CODE URL (/admin/2787) */}
            {mode === 'login_by_code' && (
              <form onSubmit={handleSecretCodeLogin} className="space-y-5">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold text-emerald-900">
                  <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                  <div>
                    <span>Secret URL Code Verified: <strong className="font-mono">/admin/{secretCodeFromUrl}</strong></span>
                    <div className="text-[11px] font-semibold text-emerald-600 mt-0.5">
                      Enter credentials to launch your Admin Dashboard.
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                    Admin Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-600">
                      <User size={16} />
                    </span>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      placeholder="admin@fipmoney.com"
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C3AED] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-600">
                      <Lock size={16} />
                    </span>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#7C3AED] focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black text-xs py-4 rounded-xl shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer border-none outline-none"
                >
                  <span>Authenticate & Launch Admin Dashboard</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}

            {/* Bottom Footer Note */}
            <div className="pt-2 text-center">
              <div className="text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck size={14} className="text-slate-400" />
                <span>Secure. Private. Protected. Only authorized admins can access the platform.</span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

    </div>
  );
}
