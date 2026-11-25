"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User, PieChart, TrendingUp, PiggyBank, Sparkles, Zap, Clock,
  Gift, Settings, HelpCircle, ShieldCheck, FileText, ChevronRight,
  LogOut, Award, Coins, CreditCard, Lock, Smartphone, Shield,
  CheckCircle2, AlertCircle, ArrowUpRight, Phone, Mail, Landmark
} from "lucide-react";
import { Tab } from "./Navigation";
import { getLoggedInUser, getUserAvatar } from "../utils/userStorage";
import { calculateProfileCompletion } from "../utils/profileCompletionCalculator";
import fipMoneyLogo from "../../imports/fipmoney_logo_final.png";
import { API_BASE_URL } from "../utils/apiConfig";

interface AppMenuPageProps {
  onNavigate: (tab: Tab) => void;
  onLogout: () => void;
  onBecomeAgent?: () => void;
  profileCompletion?: number;
}

export default function AppMenuPage({
  onNavigate,
  onLogout,
  onBecomeAgent,
  profileCompletion: propProfileCompletion
}: AppMenuPageProps) {
  const [isApprovedDga, setIsApprovedDga] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Load user details
  const loggedInUser = typeof window !== "undefined" ? getLoggedInUser() : null;
  const rawMobile = loggedInUser?.mobileNumber || (typeof window !== "undefined" ? sessionStorage.getItem("fm_logged_in_mobile") || "" : "");
  const loggedInMobile = rawMobile ? rawMobile.replace(/\D/g, "").slice(-10) : "";
  const fullName = loggedInUser?.name || loggedInUser?.fullName || (typeof window !== "undefined" ? sessionStorage.getItem("fm_logged_in_name") || "Fipmoney Investor" : "Fipmoney Investor");
  const userAvatar = typeof window !== "undefined" ? getUserAvatar(loggedInMobile) : null;
  const email = loggedInUser?.email || (typeof window !== "undefined" ? sessionStorage.getItem("fm_logged_in_email") || "" : "");

  const profileScore = propProfileCompletion ?? (loggedInUser ? calculateProfileCompletion(loggedInUser) : 85);

  useEffect(() => {
    if (typeof window !== "undefined" && loggedInMobile) {
      const saved = localStorage.getItem("fm_dga_waitlist_data");
      let localIsApproved = false;
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.isApproved || parsed.status === "approved" || parsed.status === "APPROVED") {
            localIsApproved = true;
          }
        } catch (e) {}
      }
      setIsApprovedDga(localIsApproved);

      fetch(`${API_BASE_URL}/agent-waitlist/check?mobile=${encodeURIComponent(loggedInMobile)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.success && data.alreadyRegistered) {
            setIsApprovedDga(data.isApproved || data.status === "approved" || data.status === "APPROVED");
          }
        })
        .catch(() => {});
    }
  }, [loggedInMobile]);

  return (
    <div 
      className="flex-1 h-full w-full overflow-y-auto overflow-x-hidden bg-[#F8FAFC] pb-36 selection:bg-[#047857] selection:text-white"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* ── TOP SUB-HEADER ── */}
      <div 
        className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3.5 sticky top-0 z-20 shadow-2xs"
      >
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#047857] bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
              Explore All
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              App Menu
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#047857] text-[11px] font-bold">
              <ShieldCheck size={14} className="text-[#047857]" />
              <span>256-Bit SSL</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-5 space-y-5">

        {/* ── 1. USER PROFILE IDENTITY HERO CARD ── */}
        <div className="relative p-1 rounded-[26px] bg-gradient-to-br from-emerald-500/20 via-emerald-100/40 to-amber-400/20 shadow-lg shadow-emerald-950/5">
          <div className="bg-white rounded-[22px] p-5 border border-slate-100 overflow-hidden relative">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#064e3b] via-[#047857] to-[#059669] p-0.5 shadow-md shadow-emerald-950/20">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    {userAvatar ? (
                      <img src={userAvatar} alt={fullName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-black text-[#047857]">
                        {fullName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#047857] rounded-full border-2 border-white flex items-center justify-center text-white">
                  <CheckCircle2 size={12} strokeWidth={3} />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-black text-slate-900 truncate">
                    {fullName}
                  </h2>
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0">
                    Verified
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  +91 {loggedInMobile || "7013302191"}
                </p>
                {email && (
                  <p className="text-[11px] font-medium text-slate-400 truncate">
                    {email}
                  </p>
                )}
              </div>
            </div>

            {/* Profile Completion Bar */}
            <div className="mt-4 pt-3.5 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-600 text-[11px]">Profile Setup</span>
                <span className="font-black text-[#047857] text-[11px]">{profileScore}% Completed</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#047857] to-[#10b981] transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(10, profileScore))}%` }}
                />
              </div>
            </div>

            {/* Quick Action: Manage Profile */}
            <button
              onClick={() => onNavigate("settings")}
              className="mt-3.5 w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer transition-colors outline-none"
            >
              <span>Manage Profile & Bank Settings</span>
              <ChevronRight size={15} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* ── 2. FEATURED REWARDS & REFERRAL HUB (Requested by User) ── */}
        <div className="relative p-1 rounded-[26px] bg-gradient-to-br from-amber-400/30 via-emerald-500/20 to-amber-500/30 shadow-xl shadow-amber-950/10">
          <div className="rounded-[22px] bg-gradient-to-br from-[#1a140d] via-[#241a0d] to-[#0f0b07] text-white p-5 border border-amber-400/40 relative overflow-hidden">
            {/* Ambient Gold Radial */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[radial-gradient(circle,rgba(251,191,36,0.25)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[radial-gradient(circle,rgba(4,120,87,0.3)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[#fde047] text-[10px] font-black uppercase tracking-wider">
                  <Gift size={12} className="text-amber-300" />
                  <span>Rewards & Referrals</span>
                </div>
                <h3 className="text-lg font-black text-white tracking-tight">
                  Refer & Earn 24K Pure Gold
                </h3>
                <p className="text-xs text-amber-100/80 font-medium leading-relaxed max-w-[260px]">
                  Invite friends to Fipmoney and receive 24K digital gold rewards credited directly into your vault.
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/30 shrink-0">
                <div className="w-full h-full rounded-[14px] bg-[#241a0d] flex items-center justify-center">
                  <Coins size={28} className="text-[#fde047]" />
                </div>
              </div>
            </div>

            {/* Quick Reward Perks */}
            <div className="grid grid-cols-3 gap-2 mt-4 relative z-10">
              <div className="bg-white/5 border border-amber-400/20 rounded-xl p-2 text-center">
                <span className="block text-[10px] font-bold text-amber-200/70">Reward</span>
                <span className="block text-xs font-black text-[#fde047] mt-0.5">₹500 Gold</span>
              </div>
              <div className="bg-white/5 border border-amber-400/20 rounded-xl p-2 text-center">
                <span className="block text-[10px] font-bold text-amber-200/70">Crediting</span>
                <span className="block text-xs font-black text-emerald-300 mt-0.5">Instant</span>
              </div>
              <div className="bg-white/5 border border-amber-400/20 rounded-xl p-2 text-center">
                <span className="block text-[10px] font-bold text-amber-200/70">Referrals</span>
                <span className="block text-xs font-black text-white mt-0.5">Unlimited</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => onNavigate("refer-and-earn")}
              className="mt-4 w-full py-3 px-4 rounded-xl font-black text-xs text-[#2a1400] bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#d97706] hover:from-[#fde047] active:scale-98 transition-all shadow-md shadow-amber-900/30 flex items-center justify-center gap-2 cursor-pointer border-none outline-none relative z-10"
            >
              <span>View Rewards Hub & Invite Friends</span>
              <ArrowUpRight size={15} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* ── 3. SAVINGS & WEALTH SERVICES ── */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <PiggyBank size={18} className="text-[#047857]" />
              <h3 className="text-sm font-black text-slate-900">Savings & Investment</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              24K Pure Wealth
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Digital Gold & Silver */}
            <button
              onClick={() => onNavigate("sip")}
              className="w-full py-3 flex items-center justify-between text-left group hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors cursor-pointer border-none bg-transparent outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600">
                  <Coins size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#047857] transition-colors">
                    Digital Gold & Silver
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    Buy, sell & track 24K pure precious metals
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
            </button>

            {/* Gold SIP Savings */}
            <button
              onClick={() => onNavigate("savings")}
              className="w-full py-3 flex items-center justify-between text-left group hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors cursor-pointer border-none bg-transparent outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#047857]">
                  <PiggyBank size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#047857] transition-colors flex items-center gap-1.5">
                    <span>Gold SIP Savings</span>
                    <span className="text-[9px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full">Automated</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    Daily or monthly disciplined accumulation
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
            </button>

            {/* Silver SIP Savings */}
            <button
              onClick={() => onNavigate("silver-savings")}
              className="w-full py-3 flex items-center justify-between text-left group hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors cursor-pointer border-none bg-transparent outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#047857] transition-colors">
                    Silver SIP Savings
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    Systematic 99.9% fine silver accumulation
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
            </button>

            {/* Portfolio */}
            <button
              onClick={() => onNavigate("portfolio")}
              className="w-full py-3 flex items-center justify-between text-left group hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors cursor-pointer border-none bg-transparent outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600">
                  <PieChart size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#047857] transition-colors">
                    My Portfolio
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    Holdings valuation, profit/loss & passbook
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
            </button>
          </div>
        </div>

        {/* ── 4. PAYMENTS & TRANSACTIONS ── */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-[#047857]" />
              <h3 className="text-sm font-black text-slate-900">Payments & Bills</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Instant
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Bills & Recharges */}
            <button
              onClick={() => onNavigate("bills")}
              className="w-full py-3 flex items-center justify-between text-left group hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors cursor-pointer border-none bg-transparent outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600">
                  <Zap size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#047857] transition-colors">
                    Bills & Utility Recharges
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    Electricity, DTH, Mobile, Fastag & Credit card rent
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
            </button>

            {/* History */}
            <button
              onClick={() => onNavigate("history")}
              className="w-full py-3 flex items-center justify-between text-left group hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors cursor-pointer border-none bg-transparent outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#047857] transition-colors">
                    Transaction History
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    Invoices, GST receipts & order logs
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
            </button>
          </div>
        </div>

        {/* ── 5. AGENT PARTNER PORTAL ── */}
        <div className="rounded-3xl bg-gradient-to-br from-[#2a2115] via-[#1a140d] to-[#0f0b07] border border-[#d97706]/70 shadow-md p-4 text-white relative overflow-hidden">
          <div className="flex items-center justify-between gap-1 mb-1 relative z-10 pr-12">
            <span className="font-extrabold text-xs text-[#fde047]">
              {isApprovedDga ? "DGA Partner Portal" : "Become an Agent"}
            </span>
            <span className="bg-[#5c2707]/90 text-[#fde047] border border-[#d97706]/80 text-[9px] font-black px-2 py-0.5 rounded-full">
              {isApprovedDga ? "Verified DGA" : "Commission"}
            </span>
          </div>
          <p className="text-[11px] font-semibold text-[#fef3c7]/85 mb-3 relative z-10 max-w-[280px]">
            {isApprovedDga 
              ? "Access your verified DGA Agent terminal & partner console."
              : "Register as a Digital Gold Agent to earn commissions on gold purchases."}
          </p>

          <button
            onClick={() => {
              if (onBecomeAgent) onBecomeAgent();
              else onNavigate("become-agent");
            }}
            className="w-full py-2.5 px-3 rounded-xl font-black text-[11px] text-[#3a1a00] bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#d97706] hover:from-[#fde047] active:scale-98 transition-all flex items-center justify-center gap-1.5 border-none cursor-pointer outline-none relative z-10"
          >
            <span>{isApprovedDga ? "Open DGA Portal" : "Join Partner Program"}</span>
            <ChevronRight size={14} strokeWidth={3} />
          </button>

          <img
            src="/digital_gold_agent.png"
            alt="DGA Medal"
            className="absolute right-0 top-1 w-14 h-14 object-contain pointer-events-none drop-shadow-md"
          />
        </div>

        {/* ── 6. ACCOUNT & PREFERENCES ── */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Settings size={18} className="text-[#047857]" />
              <h3 className="text-sm font-black text-slate-900">Account & Security</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Settings
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Settings & Profile */}
            <button
              onClick={() => onNavigate("settings")}
              className="w-full py-3 flex items-center justify-between text-left group hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors cursor-pointer border-none bg-transparent outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#047857]">
                  <User size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#047857] transition-colors">
                    Personal Information & KYC
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    Aadhaar, PAN & Nominee details
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
            </button>

            {/* Bank Details */}
            <button
              onClick={() => onNavigate("settings")}
              className="w-full py-3 flex items-center justify-between text-left group hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors cursor-pointer border-none bg-transparent outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#047857]">
                  <Landmark size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#047857] transition-colors">
                    Bank Account & Settlement
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    Direct IMPS withdrawal account
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
            </button>

            {/* Help & Support */}
            <button
              onClick={() => onNavigate("help")}
              className="w-full py-3 flex items-center justify-between text-left group hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors cursor-pointer border-none bg-transparent outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#047857] transition-colors">
                    Help & 24x7 Customer Support
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    FAQs, ticket tracker & WhatsApp care
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
            </button>
          </div>
        </div>

        {/* ── 7. LEGAL & POLICIES ── */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between text-xs font-bold text-slate-600">
          <button
            onClick={() => onNavigate("terms")}
            className="hover:text-[#047857] transition-colors cursor-pointer bg-transparent border-none outline-none"
          >
            Terms of Service
          </button>
          <span className="text-slate-300">•</span>
          <button
            onClick={() => onNavigate("referral-terms")}
            className="hover:text-[#047857] transition-colors cursor-pointer bg-transparent border-none outline-none"
          >
            Referral Policy
          </button>
          <span className="text-slate-300">•</span>
          <button
            onClick={() => onNavigate("terms")}
            className="hover:text-[#047857] transition-colors cursor-pointer bg-transparent border-none outline-none"
          >
            Privacy Policy
          </button>
        </div>

        {/* ── 8. LOGOUT ACTION ── */}
        <div className="pt-2">
          {!showLogoutConfirm ? (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full py-3.5 px-4 rounded-2xl font-black text-xs text-white border border-red-400/40 bg-gradient-to-r from-[#dc2626] via-[#ef4444] to-[#991b1b] hover:from-[#ef4444] cursor-pointer outline-none active:scale-98 shadow-md shadow-red-950/15 flex items-center justify-center gap-2 transition-all"
            >
              <LogOut size={16} strokeWidth={2.5} />
              <span>Sign Out of Account</span>
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-3 text-center">
              <p className="text-xs font-bold text-red-900">
                Are you sure you want to sign out of your Fipmoney account?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={onLogout}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold cursor-pointer outline-none border-none shadow-sm"
                >
                  Yes, Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── 9. FOOTER ── */}
        <div className="text-center pt-2 pb-4 space-y-1">
          <div className="flex items-center justify-center gap-2">
            <img src={fipMoneyLogo} alt="FipMoney" className="h-5 w-auto object-contain opacity-70" />
            <span className="text-xs font-black text-slate-400">Fipmoney Wealth</span>
          </div>
          <p className="text-[10px] font-semibold text-slate-400">
            100% Insured Brink's Vault Storage • SSL 256-Bit Encryption
          </p>
        </div>

      </div>
    </div>
  );
}

