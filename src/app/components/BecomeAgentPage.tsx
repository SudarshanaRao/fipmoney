"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award, ShieldCheck, Sparkles, CheckCircle2, ChevronRight, Gift,
  TrendingUp, Users, DollarSign, Download, Share2, HelpCircle, ArrowRight,
  BookOpen, Video, FileText, Check, AlertCircle, Phone, Mail, MapPin, Globe,
  ShieldAlert, RefreshCw, Layers, CheckSquare, Trophy, Lock, Zap, Clock
} from "lucide-react";
import { API_BASE_URL } from "../utils/apiConfig";

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

export default function BecomeAgentPage() {
  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    email: "",
    city: "",
    language: "English",
    agreeTerms: true
  });

  const [pincode, setPincode] = useState("");
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [pincodeMsg, setPincodeMsg] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waitlistResult, setWaitlistResult] = useState<{
    waitlistNumber: number;
    username: string;
    alreadyRegistered?: boolean;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("fm_dga_waitlist_data");
    if (saved) {
      try {
        setWaitlistResult(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Pincode Auto City Lookup
  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPincode(val);

    if (val.length === 6) {
      setIsFetchingPincode(true);
      setPincodeMsg("Fetching city...");
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice?.[0]) {
          const district = data[0].PostOffice[0].District || data[0].PostOffice[0].State;
          if (district) {
            setFormData(prev => ({ ...prev, city: district }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/agent-waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          mobile: formData.mobile,
          email: formData.email,
          city: formData.city,
          language: formData.language
        })
      });

      const data = await response.json();

      if (data.success) {
        const resultObj = {
          waitlistNumber: data.waitlistNumber || 1048,
          username: formData.username,
          alreadyRegistered: data.alreadyRegistered
        };
        setWaitlistResult(resultObj);
        localStorage.setItem("fm_dga_waitlist_data", JSON.stringify(resultObj));
      } else {
        const fallbackNum = Math.floor(1048 + Math.random() * 30);
        const resultObj = {
          waitlistNumber: fallbackNum,
          username: formData.username
        };
        setWaitlistResult(resultObj);
        localStorage.setItem("fm_dga_waitlist_data", JSON.stringify(resultObj));
      }
    } catch (error) {
      const fallbackNum = 1048;
      const resultObj = {
        waitlistNumber: fallbackNum,
        username: formData.username
      };
      setWaitlistResult(resultObj);
      localStorage.setItem("fm_dga_waitlist_data", JSON.stringify(resultObj));
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayWaitlistNumber = waitlistResult ? waitlistResult.waitlistNumber : 1048;

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

        {/* 2. WHY BECOME A DGA? (5 GRID CARDS) */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Why Become a DGA?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow text-center flex flex-col items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-3">
                <img src="/digital_gold_agent_small.png" alt="Gold Coins" className="w-10 h-10 object-contain" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Earn Unlimited</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Refer more, earn more. No upper limit on your income.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow text-center flex flex-col items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-3">
                <Gift size={28} className="text-rose-500" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">50/- Digital Gold Reward</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  You & your friend both get ₹50 worth Digital Gold.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow text-center flex flex-col items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
                <TrendingUp size={28} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Target Based Commission</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Earn up to 2% commission on every buy request after reaching monthly target.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow text-center flex flex-col items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-3">
                <FileText size={28} className="text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Free Marketing Support</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Get posters, banners, videos, and marketing kit - completely free!
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow text-center flex flex-col items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-3">
                <ShieldCheck size={28} className="text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">No Fees Ever</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  No joining fee. No annual fee. 100% free to join.
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
                <h4 className="font-bold text-sm text-slate-900 pt-1">Min. ₹250 Investment</h4>
                <p className="text-xs text-slate-500 font-medium max-w-xs">
                  They need to invest a minimum of ₹250 in Digital Gold.
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


        {/* 6. JOIN THE DGA WAITLIST SECTION (FORM + DISSOLVED waiting_list.png ASSET OVERLAY) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm space-y-6">
          
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Join the DGA Waitlist
              </h2>
              <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                Beta
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Be a part of the early access list. Get notified as soon as the DGA program goes live!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
            
            {/* LEFT FORM */}
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
                      placeholder="Enter your mobile number"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600 bg-slate-50/50"
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

              {/* PINCODE & CITY ROW WITH PREDEFINED CITIES & PINCODE AUTO-LOOKUP */}
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
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
                className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-[#6d28d9] hover:bg-[#5b21b6] transition-all shadow-md shadow-purple-900/20 border-none cursor-pointer outline-none active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Join Waitlist"}
              </button>
            </form>

            {/* RIGHT WAITLIST GRAPHIC (DISSOLVED IN BACKGROUND, NO OUTER CARD, ONLY DYNAMIC NUMBER OVERLAY NEXT TO PRINTED HASHTAG) */}
            <div className="relative w-full max-w-md mx-auto aspect-[1.48/1] flex items-center justify-center bg-transparent">
              <img
                src="/waiting_list.png"
                alt="Waiting List Ticket Asset"
                className="w-full h-full object-contain pointer-events-none drop-shadow-md"
              />

              {/* DYNAMIC NUMBER STRING OVERLAY (POSITIONED EXACTLY INSIDE DASHED BOX NEXT TO PRINTED `#`) */}
              <span className="absolute left-[41%] top-[50%] -translate-y-1/2 font-black font-sans text-lg sm:text-xl md:text-2xl tracking-tight text-[#2b0c5d] pointer-events-none whitespace-nowrap">
                DGA{displayWaitlistNumber}
              </span>
            </div>

          </div>

        </div>


        {/* 7. BOTTOM HELP BAR */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Globe size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Have Questions?</h4>
              <p className="text-xs text-slate-500 font-medium">We're here to help!</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-8 text-xs font-semibold">
            <div className="flex items-center gap-2 text-slate-700">
              <Mail size={18} className="text-purple-600" />
              <div>
                <span className="text-slate-400 block text-[10px]">Email us</span>
                <span className="font-bold">support@fipmoney.com</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Phone size={18} className="text-purple-600" />
              <div>
                <span className="text-slate-400 block text-[10px]">Call us</span>
                <span className="font-bold">+91 98765 43210</span>
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
