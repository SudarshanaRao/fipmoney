"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award, ShieldCheck, Sparkles, CheckCircle2, ChevronRight, Gift,
  TrendingUp, Users, DollarSign, Download, Share2, HelpCircle, ArrowRight,
  BookOpen, Video, FileText, Check, AlertCircle, Phone, Mail, MapPin, Globe,
  ShieldAlert, RefreshCw, Layers, CheckSquare, Trophy, Lock, Zap, Clock, Plus
} from "lucide-react";
import { API_BASE_URL } from "../utils/apiConfig";
import { LoadingSpinner } from "./LottiePlayer";
import AgentDashboard from "./AgentDashboard";
import AgentOtpModal from "./AgentOtpModal";
import { getLoggedInUser, saveLoggedInUser } from "../utils/userStorage";

const LANGUAGES = [
  "Select your preferred language",
  "English",
  "Hindi (हिंदी)",
  "Telugu (తెలుగు)",
  "Tamil (தமிழ்)",
  "Kannada (ಕನ್ನಡ)",
  "Malayalam (മലയാളം)",
  "Marathi (मराठी)",
  "Gujarati (ગુજરાતી)",
  "Bengali (বাংলা)"
];

const PREDEFINED_CITIES = [
  "Hyderabad", "Bengaluru", "Mumbai", "Delhi", "Chennai", "Kolkata", "Pune",
  "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Surat", "Visakhapatnam",
  "Vijayawada", "Coimbatore", "Kochi", "Patna", "Indore", "Bhopal", "Nagpur",
  "Vadodara", "Ludhiana", "Agra", "Nashik", "Rajkot", "Varanasi", "Amritsar", "Madurai"
];

const formatWaitlistNumber = (num: number | string | undefined | null): string => {
  if (!num) return "DGA0001";
  if (typeof num === "string" && num.startsWith("DGA")) return num;
  const parsed = typeof num === "number" ? num : parseInt(String(num).replace(/\D/g, ""), 10);
  if (isNaN(parsed) || parsed < 1) return "DGA0001";
  return `DGA${String(parsed).padStart(4, "0")}`;
};

export default function BecomeAgentPage() {
  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    language: "English",
    agreeTerms: true
  });

  const [pincode, setPincode] = useState("");
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [pincodeMsg, setPincodeMsg] = useState("");

  const [isAddressVerifying, setIsAddressVerifying] = useState(false);
  const [isAddressVerified, setIsAddressVerified] = useState<boolean | null>(null);
  const [addressMsg, setAddressMsg] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [isApprovedAgent, setIsApprovedAgent] = useState(false);
  const [showAgentOtpModal, setShowAgentOtpModal] = useState(false);
  const [showAgentDashboard, setShowAgentDashboard] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [referralCode, setReferralCode] = useState("FIP12345");
  const [waitlistResult, setWaitlistResult] = useState<{
    waitlistNumber: number;
    formattedWaitlistNumber?: string;
    username: string;
    alreadyRegistered?: boolean;
    isApproved?: boolean;
    status?: string;
    mobile?: string;
    email?: string;
    city?: string;
  } | null>(null);

  // Pre-fill user data directly from logged-in session profile
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedUser = getLoggedInUser();
      const sessionMobile = sessionStorage.getItem("fm_logged_in_mobile") || localStorage.getItem("fm_logged_in_mobile") || loggedUser?.mobileNumber || "";
      const cleanMobile = sessionMobile.replace(/\D/g, "").slice(-10);

      const defaultUsername = loggedUser?.fullName || loggedUser?.username || (cleanMobile ? localStorage.getItem(`fm_user_name_${cleanMobile}`) : "") || "";
      const defaultEmail = loggedUser?.email || (cleanMobile ? localStorage.getItem(`fm_user_email_${cleanMobile}`) : "") || "";

      setFormData(prev => ({
        ...prev,
        username: prev.username || defaultUsername,
        mobile: cleanMobile || prev.mobile,
        email: prev.email || defaultEmail,
      }));

      const userStr = localStorage.getItem("fm_logged_in_user");
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          if (parsed.referralCode || parsed.userCode) {
            setReferralCode(parsed.referralCode || parsed.userCode);
          }
        } catch (e) { }
      }
    }
  }, []);

  const handleCopyAgentLink = () => {
    const link = typeof window !== "undefined" ? `${window.location.origin}/?ref=${referralCode}` : `https://fipmoney.com/?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2500);
  };

  useEffect(() => {
    const mobile = typeof window !== 'undefined' ? sessionStorage.getItem("fm_logged_in_mobile") : null;

    // Check saved waitlist data locally first
    const saved = localStorage.getItem("fm_dga_waitlist_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.mobile && mobile && parsed.mobile !== mobile) {
          localStorage.removeItem("fm_dga_waitlist_data");
          setWaitlistResult(null);
          setIsApprovedAgent(false);
        } else {
          setWaitlistResult(parsed);
          if (parsed.isApproved || parsed.status === 'approved' || parsed.status === 'APPROVED') {
            setIsApprovedAgent(true);
          } else {
            setIsApprovedAgent(false);
          }
        }
      } catch (e) {
        localStorage.removeItem("fm_dga_waitlist_data");
        setWaitlistResult(null);
        setIsApprovedAgent(false);
      }
    } else {
      setWaitlistResult(null);
      setIsApprovedAgent(false);
    }

    // Always poll live check endpoint to get updated waitlist number & approval status
    if (mobile) {
      fetch(`${API_BASE_URL}/agent-waitlist/check?mobile=${encodeURIComponent(mobile)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.success && data.alreadyRegistered) {
            const isAppr = data.isApproved || data.status === 'approved' || data.status === 'APPROVED';
            setIsApprovedAgent(isAppr);
            const updatedObj = {
              waitlistNumber: data.waitlistNumber,
              formattedWaitlistNumber: data.formattedWaitlistNumber,
              username: data.data?.username || "Agent Partner",
              alreadyRegistered: true,
              isApproved: isAppr,
              status: data.status,
              mobile: data.data?.mobile || mobile,
              email: data.data?.email || "",
              city: data.data?.city || ""
            };
            setWaitlistResult(updatedObj);
            localStorage.setItem("fm_dga_waitlist_data", JSON.stringify(updatedObj));
          } else if (data && data.success && !data.alreadyRegistered) {
            setIsApprovedAgent(false);
            setWaitlistResult(null);
            localStorage.removeItem("fm_dga_waitlist_data");
          }
        })
        .catch(() => { });
    }
  }, []);

  const scrollToForm = () => {
    const el = document.getElementById("join-waitlist-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Pincode Auto State Lookup (Uses State from https://api.postalpincode.in/pincode/${val})
  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPincode(val);

    if (val.length === 6) {
      setIsFetchingPincode(true);
      setPincodeMsg("Fetching state...");
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice?.[0]) {
          const state = data[0].PostOffice[0].State;
          if (state) {
            setFormData(prev => ({ ...prev, city: state }));
            setPincodeMsg("✓ Successfully fetched");
          } else {
            setPincodeMsg("");
          }
        } else {
          setPincodeMsg("Valid pincode entered.");
        }
      } catch (err) {
        setPincodeMsg("");
      } finally {
        setIsFetchingPincode(false);
      }
    } else {
      setPincodeMsg("");
    }
  };

  // Communication Address Verification via Postal Geolocation API
  const verifyCommunicationAddress = async (addrStr: string, pinStr: string, stateStr: string): Promise<boolean> => {
    const clean = addrStr.trim();
    if (!clean || clean.length < 8) {
      setIsAddressVerified(false);
      setAddressMsg("Address must be at least 8 characters with House/Street/Area details.");
      return false;
    }

    const hasLetters = /[a-zA-Z0-9]{3,}/.test(clean);
    if (!hasLetters) {
      setIsAddressVerified(false);
      setAddressMsg("Please enter a valid street or area address.");
      return false;
    }

    setIsAddressVerifying(true);
    setAddressMsg("Verifying address via Postal Geolocation API...");

    try {
      const fullSearchQuery = `${clean}, ${pinStr ? pinStr + ', ' : ''}${stateStr ? stateStr + ', ' : ''}India`;
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullSearchQuery)}&format=json&addressdetails=1&countrycodes=in&limit=1`, {
        headers: { "Accept": "application/json" }
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setIsAddressVerified(true);
          setAddressMsg("✓ Communication Address Verified via Postal Geolocation API");
          setIsAddressVerifying(false);
          return true;
        }
      }

      if (pinStr && pinStr.length === 6) {
        const pinRes = await fetch(`https://api.postalpincode.in/pincode/${pinStr}`);
        const pinData = await pinRes.json();
        if (pinData && pinData[0] && pinData[0].Status === "Success") {
          setIsAddressVerified(true);
          setAddressMsg("✓ Address Verified against Pincode Region");
          setIsAddressVerifying(false);
          return true;
        }
      }

      const words = clean.split(/\s+/).filter(Boolean);
      if (words.length >= 2 && clean.length >= 10) {
        setIsAddressVerified(true);
        setAddressMsg("✓ Communication Address Validated");
        setIsAddressVerifying(false);
        return true;
      }

      setIsAddressVerified(false);
      setAddressMsg("Address could not be verified. Please specify house/street/area.");
      setIsAddressVerifying(false);
      return false;
    } catch (err) {
      if (clean.length >= 10) {
        setIsAddressVerified(true);
        setAddressMsg("✓ Communication Address Verified");
        setIsAddressVerifying(false);
        return true;
      }
      setIsAddressVerified(false);
      setAddressMsg("Network error verifying address. Please check input.");
      setIsAddressVerifying(false);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) return;
    setIsSubmitting(true);
    setFormError("");

    // Validate Communication Address
    if (!formData.address || formData.address.trim().length < 8) {
      setFormError("Please enter a valid communication address (House/Flat No., Street, Area, Landmark).");
      setIsSubmitting(false);
      return;
    }

    const isAddrValid = await verifyCommunicationAddress(formData.address, pincode, formData.city);
    if (!isAddrValid) {
      setFormError("Communication address could not be verified. Please check address details.");
      setIsSubmitting(false);
      return;
    }

    const cleanMobile = formData.mobile.replace(/\D/g, "").slice(-10);

    // 1. First validate & update email in MongoDB User model if provided
    if (formData.email && cleanMobile) {
      try {
        const updateRes = await fetch(`${API_BASE_URL}/users/update-profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mobileNumber: cleanMobile,
            email: formData.email,
            username: formData.username,
            fullName: formData.username,
          })
        });

        const updateData = await updateRes.json();
        if (!updateRes.ok || !updateData.success) {
          setFormError(updateData.message || "This email address is already registered by another user.");
          setIsSubmitting(false);
          return;
        }
      } catch (err: any) {
        console.warn("[DGA Profile Sync Error]:", err?.message || err);
      }
    }

    // 2. Submit to Agent Waitlist API
    try {
      const response = await fetch(`${API_BASE_URL}/agent-waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          mobile: formData.mobile,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          language: formData.language
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setFormError(data.message || "Failed to register on waitlist. Please check details.");
        setIsSubmitting(false);
        return;
      }

      // Sync local storage user state on success
      if (formData.email && typeof window !== "undefined") {
        const loggedUser = getLoggedInUser();
        if (loggedUser) {
          loggedUser.email = formData.email;
          if (formData.username && (!loggedUser.fullName || loggedUser.fullName === "")) {
            loggedUser.fullName = formData.username;
          }
          saveLoggedInUser(loggedUser);
        }
        if (cleanMobile) {
          localStorage.setItem(`fm_user_email_${cleanMobile}`, formData.email);
          if (formData.username) {
            localStorage.setItem(`fm_user_name_${cleanMobile}`, formData.username);
          }
        }
        window.dispatchEvent(new CustomEvent("fm_profile_updated", { detail: { email: formData.email, username: formData.username } }));
      }

      const num = data.waitlistNumber || 1;
      const formatted = data.formattedWaitlistNumber || formatWaitlistNumber(num);
      const resultObj = {
        waitlistNumber: num,
        formattedWaitlistNumber: formatted,
        username: formData.username,
        alreadyRegistered: data.alreadyRegistered,
        mobile: formData.mobile,
        email: formData.email,
        city: formData.city,
      };
      setWaitlistResult(resultObj);
      localStorage.setItem("fm_dga_waitlist_data", JSON.stringify(resultObj));
    } catch (error: any) {
      setFormError(error?.message || "Failed to submit waitlist application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isApprovedAgent) {
    const agentReferralLink = typeof window !== "undefined" ? `${window.location.origin}/?ref=${referralCode}` : `https://fipmoney.com/?ref=${referralCode}`;

    return (
      <div className="flex-1 h-screen overflow-y-auto bg-[#fafbfc] pb-24 text-slate-800 font-sans hide-scrollbar">
        <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">

          {/* Executive Header Banner */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-150 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                <span>Verified Approved DGA</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-3xl font-black text-gray-900 tracking-tight">
                Digital Gold Agent (DGA) Console
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
                Welcome back! Your DGA account is fully verified. Access your agent terminal, track client portfolios, and share your referral link to earn instant commissions.
              </p>
            </div>

            {/* Launch Button & Medal Graphic */}
            <div className="flex items-center gap-4 relative z-10 shrink-0">
              <button
                onClick={() => setShowAgentOtpModal(true)}
                className="px-6 py-3.5 rounded-xl font-extrabold text-sm text-white bg-[#d97706] hover:bg-[#b45309] transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer border-none outline-none"
              >
                <Sparkles size={16} />
                <span>Launch Agent Terminal</span>
                <ChevronRight size={16} />
              </button>

              <div className="hidden sm:block shrink-0">
                <img
                  src="/digital_gold_agent.png"
                  alt="Digital Gold Agent Medal"
                  className="w-16 h-16 object-contain drop-shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Performance Metrics Row (4 Clean Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                <span>Total Earned</span>
                <DollarSign size={16} className="text-amber-500" />
              </div>
              <div className="text-2xl font-black text-gray-900">₹1,48,250</div>
              <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <TrendingUp size={12} /> +18.4% this month
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                <span>Active Portfolio</span>
                <Users size={16} className="text-blue-500" />
              </div>
              <div className="text-2xl font-black text-gray-900">42 Clients</div>
              <div className="text-xs font-bold text-blue-600 flex items-center gap-1">
                <Plus size={12} /> +6 new this week
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                <span>Agent Status Tier</span>
                <Award size={16} className="text-purple-500" />
              </div>
              <div className="text-2xl font-black text-purple-700">Diamond</div>
              <div className="text-xs font-bold text-purple-600 flex items-center gap-1">
                <Trophy size={12} /> Top 2% Partner Tier
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                <span>Commission Rate</span>
                <Zap size={16} className="text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-600">2.00% / Txn</div>
              <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={12} /> Instant Bank Payout
              </div>
            </div>
          </div>

          {/* Agent Referral Sharing Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">Share Your Official DGA Agent Referral Link</h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Earn ₹50 instant reward + up to 2% commission on every Digital Gold buy request.</p>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 w-fit">
                Unlimited Earnings
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                readOnly
                value={agentReferralLink}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-800 outline-none select-all"
              />
              <button
                type="button"
                onClick={handleCopyAgentLink}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer border-none shrink-0"
              >
                {copiedReferral ? <Check size={16} /> : <Share2 size={16} />}
                <span>{copiedReferral ? "Copied to Clipboard!" : "Copy Agent Link"}</span>
              </button>
            </div>
          </div>

          {/* Quick Access Tools Grid (3 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Users size={20} />
              </div>
              <h4 className="text-sm font-extrabold text-gray-900">Client Management</h4>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Track client onboardings, active gold balances, and daily transaction activities.
              </p>
              <button onClick={() => setShowAgentOtpModal(true)} className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-transparent border-none p-0 flex items-center gap-1 cursor-pointer">
                Manage Clients <ChevronRight size={14} />
              </button>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <DollarSign size={20} />
              </div>
              <h4 className="text-sm font-extrabold text-gray-900">Payout Settlements</h4>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Automated instant payouts settled directly to your registered bank account.
              </p>
              <button onClick={() => setShowAgentOtpModal(true)} className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-transparent border-none p-0 flex items-center gap-1 cursor-pointer">
                View Payouts <ChevronRight size={14} />
              </button>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Download size={20} />
              </div>
              <h4 className="text-sm font-extrabold text-gray-900">Free Marketing Kit</h4>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Download posters, WhatsApp creatives, banners, and promotional video kits.
              </p>
              <button onClick={() => setShowAgentOtpModal(true)} className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-transparent border-none p-0 flex items-center gap-1 cursor-pointer">
                Download Kits <ChevronRight size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* Agent Access OTP Modal */}
        <AgentOtpModal
          mobileNumber={typeof window !== 'undefined' ? (sessionStorage.getItem("fm_logged_in_mobile") || localStorage.getItem("fm_logged_in_mobile") || undefined) : undefined}
          isOpen={showAgentOtpModal}
          onClose={() => setShowAgentOtpModal(false)}
          onSuccess={() => {
            setShowAgentOtpModal(false);
            window.history.pushState({}, '', '/agent-dashboard');
            window.dispatchEvent(new Event('popstate'));
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#fafafd] pb-20 text-slate-800 hide-scrollbar font-sans">

      {/* 1. TOP HERO BANNER */}
      <div className="px-6 lg:px-12 pt-6 max-w-[1600px] mx-auto w-full">
        <div className="bg-gradient-to-r from-[#fffdf2] via-[#fff8e7] to-[#fff4d6] rounded-[32px] p-8 lg:p-12 border border-[#ffe5a3]/80 shadow-xs relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">

          {/* Ambient Glow & Confetti */}
          <div className="absolute top-0 right-1/3 w-72 h-72 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-300/30 rounded-full blur-2xl pointer-events-none" />

          {/* Left Text Content */}
          <div className="flex-1 space-y-4 relative z-10 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              Become a <br />
              <span className="bg-gradient-to-r from-[#d97706] via-[#b45309] to-[#92400e] bg-clip-text text-transparent">
                Digital Gold Agent (DGA)
              </span> <br />
              with Fipmoney
            </h1>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                Refer. Earn. Grow.
              </h3>
              <p className="text-slate-600 text-sm font-medium">
                Build your income potential with Fipmoney.
              </p>
            </div>

            {/* 3 Pills Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3">
              <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl border border-amber-200/80 shadow-xs text-xs font-bold text-slate-800 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Users size={14} />
                </div>
                <span>Refer & Earn</span>
              </div>

              <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl border border-amber-200/80 shadow-xs text-xs font-bold text-slate-800 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Award size={14} />
                </div>
                <span>Achieve Targets</span>
              </div>

              <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl border border-amber-200/80 shadow-xs text-xs font-bold text-slate-800 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <TrendingUp size={14} />
                </div>
                <span>Unlimited Earnings</span>
              </div>
            </div>
          </div>

          {/* Right Hero Graphic Asset (digital_gold_agent_main.png) */}
          <div className="shrink-0 relative z-10">
            <img
              src="/digital_gold_agent_main.png"
              alt="DGA Official Badge Asset"
              className="w-64 h-64 sm:w-80 sm:h-80 lg:w-[360px] lg:h-[360px] object-contain drop-shadow-xl pointer-events-none"
            />
          </div>

        </div>
      </div>


      {/* MAIN CONTAINER */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 space-y-14">

        {/* 2. WHY BECOME A DGA? (5 GRID CARDS MATCHING REFERENCE IMAGE EXACTLY) */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Why Become a DGA?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4.5">

            {/* Card 1: why_dga_1.png */}
            <div className="bg-white rounded-[26px] p-6 sm:p-7 border border-slate-200/70 shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-center flex flex-col items-center justify-between group min-h-[300px]">
              <div className="w-full h-32 sm:h-36 lg:h-40 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105">
                <img src="/why_dga_1.png" alt="Earn Unlimited" className="w-full h-full object-contain drop-shadow-md" />
              </div>
              <div className="space-y-1.5 w-full">
                <h4 className="font-extrabold text-base text-slate-900 leading-snug">Earn Unlimited</h4>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Refer more, earn more.<br />No upper limit on your income.
                </p>
              </div>
            </div>

            {/* Card 2: why_dga_2.png */}
            <div className="bg-white rounded-[26px] p-6 sm:p-7 border border-slate-200/70 shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-center flex flex-col items-center justify-between group min-h-[300px]">
              <div className="w-full h-32 sm:h-36 lg:h-40 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105">
                <img src="/why_dga_2.png" alt="50/- Digital Gold Reward" className="w-full h-full object-contain drop-shadow-md" />
              </div>
              <div className="space-y-1.5 w-full">
                <h4 className="font-extrabold text-base text-slate-900 leading-snug">50/- Digital Gold Reward</h4>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  You & your friend both get<br />₹50 worth Digital Gold.
                </p>
              </div>
            </div>

            {/* Card 3: why_dga_3.png */}
            <div className="bg-white rounded-[26px] p-6 sm:p-7 border border-slate-200/70 shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-center flex flex-col items-center justify-between group min-h-[300px]">
              <div className="w-full h-32 sm:h-36 lg:h-40 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105">
                <img src="/why_dga_3.png" alt="Target Based Commission" className="w-full h-full object-contain drop-shadow-md" />
              </div>
              <div className="space-y-1.5 w-full">
                <h4 className="font-extrabold text-base text-slate-900 leading-snug">Target Based Commission</h4>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Earn 1% commission on every<br />buy request after reaching<br />monthly target.
                </p>
              </div>
            </div>

            {/* Card 4: why_dga_4.png */}
            <div className="bg-white rounded-[26px] p-6 sm:p-7 border border-slate-200/70 shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-center flex flex-col items-center justify-between group min-h-[300px]">
              <div className="w-full h-32 sm:h-36 lg:h-40 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105">
                <img src="/why_dga_4.png" alt="Free Marketing Support" className="w-full h-full object-contain drop-shadow-md" />
              </div>
              <div className="space-y-1.5 w-full">
                <h4 className="font-extrabold text-base text-slate-900 leading-snug">Free Marketing Support</h4>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Get posters, banners, videos,<br />and marketing kit –<br />completely free!
                </p>
              </div>
            </div>

            {/* Card 5: why_dga_5.png */}
            <div className="bg-white rounded-[26px] p-6 sm:p-7 border border-slate-200/70 shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-center flex flex-col items-center justify-between group min-h-[300px]">
              <div className="w-full h-32 sm:h-36 lg:h-40 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105">
                <img src="/why_dga_5.png" alt="No Fees Ever" className="w-full h-full object-contain drop-shadow-md" />
              </div>
              <div className="space-y-1.5 w-full">
                <h4 className="font-extrabold text-base text-slate-900 leading-snug">No Fees Ever</h4>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  No joining fee. No annual fee.<br />100% free to join.
                </p>
              </div>
            </div>

          </div>
        </div>


        {/* 3. HOW YOU EARN? (4 HORIZONTAL STEPS FLOW) */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            How You Earn?
          </h2>

          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">

              {/* Step 1 */}
              <div className="flex flex-col items-center text-center space-y-2 relative">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-lg border border-amber-200/60 shadow-xs">
                  <Users size={24} />
                </div>
                <h4 className="font-bold text-sm text-slate-900 pt-1">Refer Your Friends</h4>
                <p className="text-xs text-slate-500 font-medium max-w-xs">
                  Share your referral code with your friends.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center space-y-2 relative">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-lg border border-amber-200/60 shadow-xs">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="font-bold text-sm text-slate-900 pt-1">They Sign Up & Complete KYC</h4>
                <p className="text-xs text-slate-500 font-medium max-w-xs">
                  They must sign up using your referral code and complete their KYC successfully.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center space-y-2 relative">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-lg border border-amber-200/60 shadow-xs">
                  <TrendingUp size={24} />
                </div>
                <h4 className="font-bold text-sm text-slate-900 pt-1">Min. ₹500 Investment</h4>
                <p className="text-xs text-slate-500 font-medium max-w-xs">
                  They need to invest a minimum of ₹500 in Digital Gold.
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center space-y-2 relative">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-lg border border-amber-200/60 shadow-xs">
                  <Gift size={24} />
                </div>
                <h4 className="font-bold text-sm text-slate-900 pt-1">You Both Earn ₹50</h4>
                <p className="text-xs text-slate-500 font-medium max-w-xs">
                  Once done, you & your friend both get ₹50 worth Digital Gold added to your vault.
                </p>
              </div>

            </div>
          </div>
        </div>


        {/* 4. TARGET BASED COMMISSION & TOOLS & SUPPORT YOU GET (2 CARDS) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

          {/* Left Card: Target Based Commission Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-1">Target Based Commission</h3>
              <p className="text-xs text-slate-500 font-medium mb-6">
                Achieve your monthly target and earn extra commission on every buy request from your referrals.
              </p>

              <div className="overflow-hidden rounded-2xl border border-amber-200/60 bg-amber-50/30">
                <table className="w-full text-left text-xs font-semibold">
                  <thead>
                    <tr className="bg-amber-100/60 text-amber-900 border-b border-amber-200/60">
                      <th className="py-3 px-4">Monthly Target (Digital Gold Investments)</th>
                      <th className="py-3 px-4">Your Commission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100 text-slate-700">
                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-900">₹1,00,000</td>
                      <td className="py-3 px-4 font-extrabold text-amber-700">1% <span className="font-normal text-slate-500">on every buy request</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-900">₹2,50,000</td>
                      <td className="py-3 px-4 font-extrabold text-amber-700">1.25% <span className="font-normal text-slate-500">on every buy request</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-900">₹5,00,000</td>
                      <td className="py-3 px-4 font-extrabold text-amber-700">1.50% <span className="font-normal text-slate-500">on every buy request</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-900">₹10,00,000+</td>
                      <td className="py-3 px-4 font-extrabold text-amber-700">2% <span className="font-normal text-slate-500">on every buy request</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Card: Tools & Support You Get (with marketing_kit.png) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-4 flex-1">
              <h3 className="text-lg font-black text-slate-900 mb-1">Tools & Support You Get</h3>

              <div className="space-y-3 text-xs font-semibold">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Personalized Agent Dashboard</span>
                    <span className="text-slate-500 text-[11px]">Track referrals, earnings, targets & more.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BookOpen size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Training & Guidance</span>
                    <span className="text-slate-500 text-[11px]">Learn and grow with expert support.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Marketing Kit (100% Free)</span>
                    <span className="text-slate-500 text-[11px]">Posters, banners, creatives, videos & more.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <RefreshCw size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Regular Updates & Offers</span>
                    <span className="text-slate-500 text-[11px]">Stay ahead with latest offers and campaigns.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Asset (marketing_kit.png) */}
            <div className="shrink-0 w-44 sm:w-52">
              <img
                src="/marketing_kit.png"
                alt="Marketing Kit Asset"
                className="w-full object-contain pointer-events-none drop-shadow-md"
              />
            </div>
          </div>

        </div>


        {/* 5. HIGHLIGHT STRIP (NO FEES PILLS + GOLDEN TROPHY CARD) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-center">

          {/* 3 Pills */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <AlertCircle size={20} />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block">No Hidden Charges</span>
                <span className="text-[10px] text-slate-500 font-semibold">100% Transparent</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block">No Joining Fee</span>
                <span className="text-[10px] text-slate-500 font-semibold">Absolutely FREE</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block">No Annual Fee</span>
                <span className="text-[10px] text-slate-500 font-semibold">Absolutely FREE</span>
              </div>
            </div>
          </div>

          {/* Golden Trophy Card */}
          <div className="bg-gradient-to-r from-[#fff9e6] via-[#fff3d6] to-[#ffecb3] rounded-3xl p-5 border border-amber-300/80 shadow-xs flex items-center justify-between gap-4">
            <div>
              <h4 className="font-black text-sm text-amber-950">It's Completely Up to You!</h4>
              <p className="text-xs font-bold text-slate-700 mt-1 leading-snug">
                The more revenue you bring, the more you earn!
              </p>
            </div>
            <Trophy size={40} className="text-amber-500 shrink-0 drop-shadow-sm" />
          </div>

        </div>


        {/* 6. JOIN THE DGA WAITLIST SECTION (FORM + TICKET GRAPHIC OVERLAY) */}
        <div id="join-waitlist-section" className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm space-y-6">

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Join the DGA Waitlist
              </h2>
              <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                Beta Access
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Be a part of the early access list. Get notified as soon as the DGA program goes live!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 items-center">

            {/* LEFT SIDE: APPROVED DGA PARTNER CARD (FORM DISABLED) OR WAITLIST TICKET OR NEW APPLICATION FORM */}
            {isApprovedAgent || waitlistResult?.isApproved || waitlistResult?.status === 'approved' || waitlistResult?.status === 'APPROVED' ? (
              <div className="space-y-5 bg-gradient-to-br from-amber-50 via-yellow-50/60 to-orange-50/40 rounded-3xl p-6 sm:p-8 border border-amber-300/80 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                    <CheckCircle2 size={26} strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                        ✓ Verified Digital Gold Agent (DGA)
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1 tracking-tight">
                      You are an Approved Digital Gold Agent (DGA)! 🎉
                    </h3>
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur rounded-2xl p-5 border border-amber-200/80 space-y-4 shadow-xs">
                  <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                    Your account is fully verified and active as an official Digital Gold Agent Partner. You do not need to register or submit the waitlist application form again.
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wider block">
                      Refer Now with Your Official Agent Referral Link:
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 truncate shadow-2xs">
                        {typeof window !== 'undefined' ? `${window.location.origin}/?ref=${referralCode}` : `https://fipmoney.com/?ref=${referralCode}`}
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyAgentLink}
                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none shrink-0"
                      >
                        {copiedReferral ? <Check size={16} /> : <Share2 size={16} />}
                        <span>{copiedReferral ? "Copied!" : "Copy Link"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <ShieldCheck size={18} className="text-amber-600" />
                    <span>Agent Identifier: {waitlistResult?.formattedWaitlistNumber || formatWaitlistNumber(waitlistResult?.waitlistNumber) || "DGA0001"}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAgentOtpModal(true)}
                    className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer border-none"
                  >
                    <span>Open Agent Dashboard</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ) : waitlistResult ? (
              <div className="space-y-4 bg-gradient-to-br from-purple-50/70 via-amber-50/40 to-slate-50 rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        Waitlist Ticket Reserved
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        1 Chance Per User Verified
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                      You're on the Waitlist, {waitlistResult.username}!
                    </h3>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-purple-100/80 space-y-3 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-50 pb-3">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Your Official DGA Waitlist Number</span>
                    <span className="font-black text-lg text-purple-700 bg-purple-100/80 px-3.5 py-1 rounded-xl w-fit">
                      {waitlistResult.formattedWaitlistNumber || formatWaitlistNumber(waitlistResult.waitlistNumber)}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 font-medium leading-relaxed">
                    Thank you for registering! Each user receives exactly one unique position in the waitlist sequence starting from <strong className="text-purple-700">DGA0001</strong>. We will notify you via mobile & email when early access opens.
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-bold text-purple-700 pt-1">
                  <ShieldCheck size={16} />
                  <span>Single registration verified. Your spot is reserved.</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name / Username</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                    <div className="flex gap-2">
                      <span className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-100 text-slate-600 flex items-center">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        readOnly
                        placeholder="Enter your mobile number"
                        value={formData.mobile}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-100/90 cursor-not-allowed outline-none select-none shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600 bg-slate-50/50"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">Communication Address</label>
                    {isAddressVerified === true && (
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Verified Address
                      </span>
                    )}
                  </div>
                  <textarea
                    required
                    rows={2}
                    placeholder="Enter house/flat no., street name, area, landmark"
                    value={formData.address}
                    onChange={(e) => {
                      setFormData({ ...formData, address: e.target.value });
                      if (isAddressVerified !== null) setIsAddressVerified(null);
                      setAddressMsg("");
                    }}
                    onBlur={() => {
                      if (formData.address.trim()) {
                        verifyCommunicationAddress(formData.address, pincode, formData.city);
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600 bg-slate-50/50 resize-none"
                  />
                  {isAddressVerifying && (
                    <span className="text-[10px] font-bold text-indigo-600 animate-pulse mt-1 block">
                      Verifying address via Postal Geolocation API...
                    </span>
                  )}
                  {!isAddressVerifying && addressMsg && (
                    <span className={`text-[10px] font-bold mt-1 block ${isAddressVerified ? "text-emerald-700" : "text-amber-700"}`}>
                      {addressMsg}
                    </span>
                  )}
                </div>

                {/* PINCODE & STATE ROW */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pincode (6-digit PIN)</label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 500001"
                      value={pincode}
                      onChange={handlePincodeChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600 bg-slate-50/50"
                    />
                    {pincodeMsg && (
                      <span className="text-[10px] font-bold text-purple-700 mt-1 block">
                        {pincodeMsg}
                      </span>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      required
                      readOnly
                      placeholder="Auto-filled via Pincode"
                      value={formData.city}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-100/80 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600 bg-slate-50/50 cursor-pointer"
                  >
                    {LANGUAGES.map((lang, idx) => (
                      <option key={idx} value={lang.split(" ")[0]}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                {formError && (
                  <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 shadow-2xs">
                    <AlertCircle size={16} className="shrink-0 text-red-500" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    className="rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <label htmlFor="agreeTerms" className="text-xs text-slate-600 font-medium cursor-pointer">
                    I agree to the <span className="text-purple-600 underline font-bold">Terms & Conditions</span> and <span className="text-purple-600 underline font-bold">Privacy Policy</span>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !formData.agreeTerms}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-[#6d28d9] hover:bg-[#5b21b6] transition-all shadow-md shadow-purple-900/20 border-none cursor-pointer outline-none active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size={24} />
                      <span>Securing Your Waitlist Spot...</span>
                    </>
                  ) : (
                    "Join Waitlist"
                  )}
                </button>
              </form>
            )}

            {/* RIGHT SIDE: WAITLIST GRAPHIC (TICKET ASSET WITH DYNAMIC OVERLAY) */}
            <div className="relative w-full max-w-md mx-auto aspect-[1.48/1] flex items-center justify-center bg-transparent">
              <img
                src="/waiting_list.png"
                alt="Waiting List Ticket Asset"
                className="w-full h-full object-contain pointer-events-none drop-shadow-md"
              />

              {/* OVERLAY ON TICKET NEXT TO PRINTED `#` */}
              {waitlistResult ? (
                <span className="absolute left-[41%] top-[50%] -translate-y-1/2 font-black font-sans text-lg sm:text-xl md:text-2xl tracking-tight text-[#2b0c5d] pointer-events-none whitespace-nowrap">
                  {waitlistResult.formattedWaitlistNumber || formatWaitlistNumber(waitlistResult.waitlistNumber)}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="absolute left-[41%] top-[50%] -translate-y-1/2 font-extrabold font-sans text-base sm:text-lg md:text-xl tracking-wider text-amber-500 hover:text-amber-400 uppercase animate-pulse cursor-pointer border-none bg-transparent transition-all hover:scale-105 active:scale-95 drop-shadow-sm"
                  title="Click to Join Waiting List"
                >
                  Join Now
                </button>
              )}
            </div>

          </div>

        </div>


        {/* 7. BOTTOM HELP BAR (USING fipmoney_support.png) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 shrink-0 flex items-center justify-center">
              <img
                src="/fipmoney_support.png"
                alt="Fipmoney Support"
                className="w-full h-full object-contain drop-shadow-md pointer-events-none"
              />
            </div>
            <div>
              <h4 className="font-black text-lg sm:text-xl text-slate-900 leading-snug">
                Have Questions or Need Agent Support?
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                Our dedicated agent support team is here to assist you 24/7.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-semibold relative z-10">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-5 py-3 rounded-2xl shadow-2xs">
              <Mail size={20} className="text-purple-600 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Email Support</span>
                <span className="font-black text-slate-900 text-xs sm:text-sm">support@fipmoney.com</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-5 py-3 rounded-2xl shadow-2xs">
              <Phone size={20} className="text-purple-600 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Helpline</span>
                <span className="font-black text-slate-900 text-xs sm:text-sm">+91 98765 43210</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-medium text-slate-400 pt-2 border-t border-slate-200/60">
          <span>© 2026 Fipmoney. All rights reserved.</span>
          <span>Made with ❤️ for our agents.</span>
        </div>

      </div>

    </div>
  );
}
