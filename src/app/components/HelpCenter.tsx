"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Search, MessageCircle, Phone, Mail, ChevronDown, ChevronRight,
  HelpCircle, BookOpen, CreditCard, Shield, Settings, TrendingUp, Users,
  Sparkles, Send, CheckCircle2, AlertCircle, Clock, ExternalLink, ThumbsUp,
  ThumbsDown, Copy, Check, Zap, RefreshCw, FileText, Bot, Headphones,
  ShieldCheck, Download, Award, ChevronUp, PhoneCall, CheckCheck, PackageCheck
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface HelpCenterProps {
  onBack?: () => void;
  isDashboardTab?: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

interface Category {
  icon: any;
  title: string;
  description: string;
  count: number;
  id: string;
}

export default function HelpCenter({ onBack, isDashboardTab = false }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState<"faqs" | "tools" | "ai" | "contact">("faqs");
  
  // Interactive AI Module State
  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [copiedAnswer, setCopiedAnswer] = useState(false);

  // Self-Service Order/UTR Status Checker
  const [orderQuery, setOrderQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState<any>(null);
  const [isCheckingOrder, setIsCheckingOrder] = useState(false);

  // Instant Ticket Generator State
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("payments");
  const [ticketMsg, setTicketMsg] = useState("");
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  // FAQ Accordion Open State & Feedback Counters
  const [openFaq, setOpenFaq] = useState<string | null>("How do I start investing in digital gold?");
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, "up" | "down">>({});

  const categories: Category[] = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Basics of 24K pure digital gold & silver savings",
      count: 6,
      id: "getting-started"
    },
    {
      icon: Users,
      title: "Account & KYC",
      description: "Instant PAN, Aadhaar & profile verification",
      count: 5,
      id: "account-kyc"
    },
    {
      icon: CreditCard,
      title: "Payments & Withdrawals",
      description: "UPI Autopay, instant bank payouts & refunds",
      count: 7,
      id: "payments"
    },
    {
      icon: TrendingUp,
      title: "Gold SIP & Goals",
      description: "Automated daily/weekly SIPs and target plans",
      count: 5,
      id: "sip-goals"
    },
    {
      icon: ShieldCheck,
      title: "Institutional Vault & Insurance",
      description: "100% insured physical storage & IDBI trusteeship",
      count: 5,
      id: "security"
    },
    {
      icon: PackageCheck,
      title: "Doorstep Gold Delivery",
      description: "Tamper-proof mint delivery of 24K coins & bars",
      count: 4,
      id: "delivery"
    },
    {
      icon: Settings,
      title: "Technical & Security",
      description: "Biometrics, TPIN, login & security settings",
      count: 4,
      id: "technical"
    }
  ];

  const faqs: FAQ[] = [
    {
      id: "faq-1",
      question: "How do I start investing in digital gold?",
      answer: "Getting started takes less than 60 seconds! Download or open Fipmoney, complete your rapid **KYC verification** with PAN, and start investing with just **₹10**. You can make instant one-time purchases or activate an automated daily/weekly **Gold SIP** via UPI Autopay.",
      category: "getting-started",
      tags: ["investing", "24K gold", "starter", "KYC", "₹10"]
    },
    {
      id: "faq-2",
      question: "How fast do withdrawal proceeds reach my bank account?",
      answer: "Withdrawals on Fipmoney are processed via **Instant IMPS Rails 24/7/365**. Once you sell your 24K gold or silver, the funds are credited directly to your verified bank account usually within **30 seconds to 5 minutes**. No waiting periods or lock-in penalties apply.",
      category: "payments",
      tags: ["withdraw", "instant payout", "bank", "IMPS", "selling"]
    },
    {
      id: "faq-3",
      question: "Is my gold physically stored and insured?",
      answer: "Yes, 100%! Every milligram of 24K pure gold you buy is backed by physical bullion stored in **India's Grade-A Insured Vaults** under the supervision of **IDBI Trustee Administrator**. Your holdings are covered by comprehensive insurance against fire, theft, and natural calamities.",
      category: "security",
      tags: ["vault", "insured", "bank-grade", "idbi trustee", "safety"]
    },
    {
      id: "faq-4",
      question: "How does the Daily Gold SIP work and can I pause it?",
      answer: "With Daily Gold SIP, a fixed amount (as low as ₹10/day) is automatically debited via **UPI AutoPay** to buy 24K pure gold at live wholesale prices. This protects you against market volatility through **Rupee Cost Averaging**. You have 100% flexibility to **pause, modify amount, or cancel** anytime from your Portfolio without charges.",
      category: "sip-goals",
      tags: ["daily sip", "autopay", "rupee cost average", "cancel sip"]
    },
    {
      id: "faq-5",
      question: "What documents are required for KYC verification?",
      answer: "For standard transactions, you only need your **10-digit PAN number**. For higher limits and instant bank withdrawals exceeding ₹50,000, Aadhaar-based OTP verification and bank account verification (penny drop) are performed in real-time.",
      category: "account-kyc",
      tags: ["KYC", "PAN", "Aadhaar", "verification", "limits"]
    },
    {
      id: "faq-6",
      question: "Can I get my digital gold delivered as physical coins?",
      answer: "Yes! You can convert your digital gold balance into certified **24K 99.9% pure gold coins or bars** (from 0.5g up to 50g). The coins arrive in tamper-proof, transit-insured packaging delivered straight to your verified doorstep within 3-5 business days.",
      category: "delivery",
      tags: ["physical gold", "coins", "doorstep delivery", "minting"]
    },
    {
      id: "faq-7",
      question: "What should I do if a payment fails but money was deducted?",
      answer: "Don't worry! Banking UPI rails occasionally experience transient gateway delays. If money was deducted, our auto-reconciliation engine reconciles the transaction within **15 minutes**. If unallocated, your bank will automatically reverse the amount to your source bank within **2-3 business days** as per RBI mandate.",
      category: "payments",
      tags: ["failed payment", "refund", "UPI deduction", "reconciliation"]
    },
    {
      id: "faq-8",
      question: "How do I reset my 4-digit Security TPIN?",
      answer: "Open **Settings > Security & TPIN**, tap 'Forgot TPIN', verify your registered mobile number via OTP, and immediately set your new 4-digit secret transaction PIN.",
      category: "technical",
      tags: ["TPIN", "reset PIN", "security", "biometrics"]
    },
    {
      id: "faq-9",
      question: "Are there any hidden holding or vault charges?",
      answer: "No! Fipmoney provides **100% free physical vaulting and insurance** for your holdings. There are zero maintenance charges (AMC), zero hidden account opening fees, and no holding charges.",
      category: "getting-started",
      tags: ["charges", "free vault", "no amc", "pricing"]
    },
    {
      id: "faq-10",
      question: "What is the role of the independent Trustee Administrator?",
      answer: "The independent Trustee holds a **legal first charge** on all physical bullion stored in the vaults on behalf of Fipmoney customers. This guarantees that your gold is completely legally segregated from company assets and protected at all times.",
      category: "security",
      tags: ["trustee", "legal charge", "safe custody", "audit"]
    }
  ];

  // Filter FAQs based on query and category
  const filteredFAQs = useMemo(() => {
    let list = faqs;
    if (selectedCategory !== "all") {
      list = list.filter(f => f.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(f =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [searchQuery, selectedCategory]);

  // AI Knowledge Answer Simulation
  const handleAskAI = (promptText?: string) => {
    const query = (promptText || aiQuery).trim();
    if (!query) return;
    setAiLoading(true);
    setAiResponse(null);

    setTimeout(() => {
      const q = query.toLowerCase();
      let reply = "";
      if (q.includes("withdraw") || q.includes("bank") || q.includes("sell")) {
        reply = "⚡ **Instant Withdrawal Process:**\n1. Head over to **Portfolio > Sell Gold**.\n2. Enter the grams or amount you wish to withdraw.\n3. Verify with your 4-digit TPIN.\n4. Funds will be transferred to your linked bank account via **IMPS within 30 seconds to 5 minutes**.\n\n*Note: Ensure your bank account is verified under Settings > Bank Details.*";
      } else if (q.includes("insured") || q.includes("vault") || q.includes("safe") || q.includes("security")) {
        reply = "🛡️ **100% Vault Security Guarantee:**\n- All 24K 99.9% fine gold is stored in high-security **India's trusted institutional vaults**.\n- Supervised by an independent **Trustee Administrator (IDBI)**.\n- Insured with global underwriters against fire, theft, and natural perils.\n- You own direct physical title to the bullion at all times.";
      } else if (q.includes("sip") || q.includes("daily") || q.includes("pause") || q.includes("cancel")) {
        reply = "🔄 **Managing your Gold SIP:**\n- You can pause or cancel your SIP anytime from **Portfolio > Manage SIP** with zero cancellation fees.\n- SIPs use official NPCI UPI AutoPay rails.\n- To modify the daily or monthly amount, simply adjust the mandate inside the app.";
      } else if (q.includes("kyc") || q.includes("pan") || q.includes("document")) {
        reply = "📋 **Instant KYC Requirements:**\n- Entering your **10-digit PAN number** unlocks digital purchases up to ₹50,000.\n- For higher transaction tiers, complete instant paperless Aadhaar OTP verification.\n- Verification is completed instantaneously in real-time.";
      } else if (q.includes("delivery") || q.includes("coin") || q.includes("physical")) {
        reply = "📦 **Doorstep Gold Coin Delivery:**\n- Convert digital gold into physical 24K coins (0.5g, 1g, 5g, 10g, 20g, 50g).\n- Shipped in tamper-evident sealed packaging.\n- Insured doorstep transit across 26,000+ Indian pin codes within 3-5 business days.";
      } else {
        reply = `🔍 **Help Summary for "${query}":**\nOur smart system recommends reviewing the verified FAQs below or using our **Live UTR Tracker** for transaction lookups. You can also connect immediately with our 24/7 dedicated support desk via WhatsApp or Helpline (+91 98765 43210).`;
      }
      setAiResponse(reply);
      setAiLoading(false);
    }, 450);
  };

  // Self-Service Order/UTR Check
  const handleCheckOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    setIsCheckingOrder(true);
    setOrderStatus(null);

    setTimeout(() => {
      setIsCheckingOrder(false);
      setOrderStatus({
        reference: orderQuery.toUpperCase(),
        status: "COMPLETED & SECURED",
        asset: "24K 99.9% Pure Gold",
        vaultReceipt: "TRUSTED-VAULT-IN-" + Math.floor(100000 + Math.random() * 900000),
        trusteeVerified: true,
        timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        settlement: "Instant UPI IMPS Rail Verified"
      });
    }, 600);
  };

  // Ticket Generator
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMsg.trim()) return;
    const newId = "FM-" + Math.floor(100000 + Math.random() * 900000);
    setSubmittedTicketId(newId);
  };

  const handleCopyAi = () => {
    if (!aiResponse) return;
    navigator.clipboard.writeText(aiResponse);
    setCopiedAnswer(true);
    setTimeout(() => setCopiedAnswer(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#047857] selection:text-white pb-24 md:pb-16">
      {/* ── TOP MODERN HEADER BAR ── */}
      {!isDashboardTab && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs pt-[env(safe-area-inset-top,0px)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 transition-all cursor-pointer active:scale-95"
                >
                  <ArrowLeft size={16} strokeWidth={2.5} />
                  <span className="hidden sm:inline">Back</span>
                </button>
              )}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#064e3b] to-[#047857] text-white flex items-center justify-center shadow-xs">
                  <HelpCircle size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
                    Need Help?
                  </h1>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Fipmoney 24/7 Smart Help Center
                  </span>
                </div>
              </div>
            </div>

            {/* System Status Pill */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline">All Systems Operational</span>
                <span className="sm:hidden">Live Support</span>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* ── HERO SHOWCASE WITH 3D SUPPORT ASSET & SMART SEARCH ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#F0FDF4]/40 to-[#F8FAFC] border-b border-slate-200/60 py-8 sm:py-12 lg:py-16">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Headlines & Search Input */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-[#047857] text-xs font-black uppercase tracking-wider shadow-2xs">
                <Sparkles size={14} className="text-[#047857]" />
                <span>Next-Gen Smart Resolution Engine</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                How can we assist your{" "}
                <span className="bg-gradient-to-r from-[#047857] via-[#059669] to-[#10b981] bg-clip-text text-transparent">
                  wealth journey
                </span>{" "}
                today?
              </h2>

              <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Instant self-service tools, AI-powered guides, live transaction tracking, and direct 24/7 specialist assistance for 24K digital gold and silver.
              </p>

              {/* Main Search Input */}
              <div className="relative max-w-2xl mx-auto lg:mx-0 pt-2">
                <div className="relative flex items-center shadow-lg shadow-emerald-950/5 rounded-2xl bg-white border-2 border-slate-200 focus-within:border-[#047857] transition-all overflow-hidden p-1.5">
                  <div className="pl-3.5 pr-2 text-slate-400">
                    <Search size={22} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (activeTab !== "faqs") setActiveTab("faqs");
                    }}
                    placeholder="Search keywords: 'instant withdrawal', 'KYC', 'SIP pause'..."
                    className="w-full py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-xs font-bold text-slate-400 hover:text-slate-700 px-2 py-1 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (activeTab !== "faqs") setActiveTab("faqs");
                      const el = document.getElementById("faq-results-section");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="hidden sm:flex items-center gap-1.5 px-5 py-3 rounded-xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] hover:from-[#022c22] hover:via-[#064e3b] hover:to-[#047857] text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer border-none shrink-0"
                  >
                    <span>Search</span>
                    <ArrowLeft size={14} className="rotate-180" />
                  </button>
                </div>

                {/* Popular Search Chips */}
                <div className="flex items-center gap-2 flex-wrap pt-3 justify-center lg:justify-start">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick:</span>
                  {[
                    "Instant Withdrawal",
                    "India's Trusted Vault",
                    "Daily SIP",
                    "KYC Verification",
                    "Doorstep Delivery"
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => {
                        setSearchQuery(chip);
                        if (activeTab !== "faqs") setActiveTab("faqs");
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-[11px] font-semibold text-slate-700 hover:text-[#047857] transition-all cursor-pointer shadow-2xs"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: 3D Support Illustration & Trust Stats */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-square flex items-center justify-center">
                <div className="absolute inset-4 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
                <img
                  src="/fipmoney_support.png"
                  alt="Fipmoney 24/7 Smart Support"
                  className="w-full h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500 pointer-events-none select-none"
                />

                {/* Floating Metric 1 */}
                <div className="absolute -left-2 top-10 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3 shadow-lg flex items-center gap-3 animate-bounce [animation-duration:3s]">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#047857] flex items-center justify-center font-bold">
                    <Clock size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Avg Response</div>
                    <div className="text-xs font-black text-slate-900">&lt; 2 Minutes</div>
                  </div>
                </div>

                {/* Floating Metric 2 */}
                <div className="absolute -right-2 bottom-8 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3 shadow-lg flex items-center gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Vault Protection</div>
                    <div className="text-xs font-black text-slate-900">100% Bank-Grade Insured</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── INTERACTIVE MODULE TABS BAR (Desktop & Mobile Segmented) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-2 shadow-md flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: "faqs", label: "Knowledge Base", icon: BookOpen, badge: `${faqs.length}+` },
            { id: "ai", label: "FipAI Smart Assist", icon: Bot, badge: "New" },
            { id: "tools", label: "Live Resolution Tools", icon: Zap, badge: "Self-Serve" },
            { id: "contact", label: "Contact Specialists", icon: Headphones, badge: "24/7" }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[130px] sm:min-w-0 flex items-center justify-center gap-2 py-3 px-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer border-none outline-none ${
                  isSel
                    ? "bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] text-white shadow-md shadow-emerald-900/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <Icon size={16} strokeWidth={2.5} />
                <span className="whitespace-nowrap">{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`hidden md:inline text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                      isSel ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">

        {/* ══ MODULE 1: AI SMART ASSISTANT TAB ══ */}
        {activeTab === "ai" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-sm space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
                  <Bot size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900">FipAI Wealth Concierge</h3>
                    <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black">
                      AI Powered
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Ask any question about gold vaulting, instant bank withdrawals, SIP mechanics, or security
                  </p>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Trained On</span>
                <span className="text-xs font-black text-emerald-700">Official Fipmoney Custody & Product Protocols</span>
              </div>
            </div>

            {/* Quick Prompt Cards */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                Suggested Prompts:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {[
                  { q: "How fast is my bank withdrawal credited?", icon: Zap },
                  { q: "Where is my physical 24K gold stored?", icon: ShieldCheck },
                  { q: "How do I pause or cancel my daily SIP?", icon: RefreshCw },
                  { q: "What documents are needed for KYC?", icon: FileText },
                  { q: "Can I get 24K gold coins delivered to my home?", icon: PackageCheck },
                  { q: "Are there any hidden vault storage fees?", icon: Award }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setAiQuery(item.q);
                        handleAskAI(item.q);
                      }}
                      className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-300 text-left transition-all cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-white text-emerald-700 flex items-center justify-center shrink-0 border border-slate-200/60 shadow-2xs group-hover:bg-[#047857] group-hover:text-white transition-colors">
                        <Icon size={14} />
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 line-clamp-1">
                        {item.q}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ask AI Input Field */}
            <div className="relative">
              <div className="relative flex items-center rounded-2xl border-2 border-slate-200 focus-within:border-[#047857] bg-white transition-all overflow-hidden p-1.5 shadow-sm">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
                  placeholder="Type any question here, e.g. 'How is gold purity verified?'"
                  className="w-full px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
                />
                <button
                  onClick={() => handleAskAI()}
                  disabled={aiLoading || !aiQuery.trim()}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer border-none shrink-0"
                >
                  {aiLoading ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <>
                      <span>Ask AI</span>
                      <Send size={13} />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Simulated Smart Response Container */}
            <AnimatePresence>
              {(aiLoading || aiResponse) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gradient-to-br from-[#F0FDF4]/80 via-white to-slate-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-[#047857]">
                      <Sparkles size={16} />
                      <span>Verified Knowledge Response</span>
                    </div>
                    {aiResponse && (
                      <button
                        onClick={handleCopyAi}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs cursor-pointer"
                      >
                        {copiedAnswer ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        <span>{copiedAnswer ? "Copied" : "Copy"}</span>
                      </button>
                    )}
                  </div>

                  {aiLoading ? (
                    <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-500">
                      <div className="w-8 h-8 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin" />
                      <span className="text-xs font-semibold">Consulting Fipmoney Custody & Payout Protocols...</span>
                    </div>
                  ) : (
                    <div className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-line">
                      {aiResponse}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ══ MODULE 2: LIVE RESOLUTION TOOLS TAB (Self-Service) ══ */}
        {activeTab === "tools" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Tool 1: Real-time UTR / Order Status Engine */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    Live Transaction & Payout Verifier
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Track any purchase, gold buy/sell, or bank payout using your 12-digit UPI UTR or Order ID
                  </p>
                </div>
              </div>

              <form onSubmit={handleCheckOrder} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="Enter 12-Digit UTR (e.g. 432109876543) or Mobile Number"
                  className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#047857] bg-slate-50/50"
                />
                <button
                  type="submit"
                  disabled={isCheckingOrder || !orderQuery.trim()}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] text-white text-xs sm:text-sm font-black transition-all cursor-pointer border-none shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isCheckingOrder ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Checking Banking Rails...</span>
                    </>
                  ) : (
                    <>
                      <Search size={14} />
                      <span>Verify Status</span>
                    </>
                  )}
                </button>
              </form>

              {/* Verified Result Card */}
              {orderStatus && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 sm:p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={20} className="text-[#047857]" />
                      <span className="text-xs font-black text-[#064e3b] uppercase tracking-wider">
                        Transaction Verified & Settled
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 font-mono">
                      Ref: {orderStatus.reference}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Status</span>
                      <span className="font-extrabold text-[#047857]">{orderStatus.status}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Vault Storage</span>
                      <span className="font-extrabold text-slate-900">{orderStatus.vaultReceipt}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Banking Rail</span>
                      <span className="font-extrabold text-slate-900">{orderStatus.settlement}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Trustee Charge</span>
                      <span className="font-extrabold text-[#047857]">IDBI Confirmed ✓</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Tool 2: Live Payment Rails & Latency Dashboard */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h4 className="text-base font-black text-slate-900">
                Live Banking Network Health & Settlement Latency
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">UPI Instant Mandates</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-xl font-black text-slate-900">99.98%</div>
                  <div className="text-[11px] text-slate-500 font-semibold">Avg Latency: &lt; 8 seconds</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">IMPS Bank Payouts</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-xl font-black text-slate-900">Instant Rail</div>
                  <div className="text-[11px] text-slate-500 font-semibold">Avg Settlement: &lt; 30 seconds</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">India's Trusted Vault Custody</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-xl font-black text-slate-900">100% Backed</div>
                  <div className="text-[11px] text-slate-500 font-semibold">Audited daily by IDBI Trustee</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ══ MODULE 3: KNOWLEDGE BASE & FAQS TAB ══ */}
        {activeTab === "faqs" && (
          <div id="faq-results-section" className="space-y-8">
            {/* Category Filter Pills (Horizontal Scroll on Mobile) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Browse by Category
                </h3>
                {selectedCategory !== "all" && (
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="text-xs font-bold text-[#047857] hover:underline cursor-pointer"
                  >
                    View All ({faqs.length})
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`p-4 rounded-2xl text-left transition-all cursor-pointer border ${
                    selectedCategory === "all"
                      ? "bg-emerald-50 border-emerald-400 text-[#064e3b] shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                      selectedCategory === "all" ? "bg-[#047857] text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                      <HelpCircle size={16} />
                    </div>
                    <span className="text-[11px] font-black opacity-60">{faqs.length}</span>
                  </div>
                  <div className="text-xs font-extrabold">All Topics</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5 line-clamp-1">Complete Knowledge Base</div>
                </button>

                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSel = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-4 rounded-2xl text-left transition-all cursor-pointer border ${
                        isSel
                          ? "bg-emerald-50 border-emerald-400 text-[#064e3b] shadow-xs"
                          : "bg-white border-slate-200 hover:border-slate-300 text-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                          isSel ? "bg-[#047857] text-white" : "bg-slate-100 text-slate-600"
                        }`}>
                          <Icon size={16} />
                        </div>
                        <span className="text-[11px] font-black opacity-60">{cat.count}</span>
                      </div>
                      <div className="text-xs font-extrabold line-clamp-1">{cat.title}</div>
                      <div className="text-[10px] text-slate-500 font-medium mt-0.5 line-clamp-1">{cat.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accordion List with Search Highlighting & Tactical Feedback Buttons */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Showing {filteredFAQs.length} {filteredFAQs.length === 1 ? "article" : "articles"}
                </span>
                {searchQuery && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Filtered by "{searchQuery}"
                  </span>
                )}
              </div>

              {filteredFAQs.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                    <Search size={28} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900">No matching help articles found</h4>
                    <p className="text-xs text-slate-500 font-semibold mt-1 max-w-sm mx-auto">
                      We couldn't find an article matching "{searchQuery}". Try a different keyword or talk directly to our 24/7 support specialists.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
                    >
                      Clear Search
                    </button>
                    <button
                      onClick={() => setActiveTab("contact")}
                      className="px-4 py-2 rounded-xl bg-[#047857] text-xs font-bold text-white hover:bg-[#064e3b] cursor-pointer"
                    >
                      Contact Support
                    </button>
                  </div>
                </div>
              ) : (
                filteredFAQs.map((faq) => {
                  const isOpen = openFaq === faq.question;
                  const userFeedback = feedbackGiven[faq.id];
                  return (
                    <div
                      key={faq.id}
                      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isOpen ? "border-emerald-300 shadow-sm" : "border-slate-200/90 hover:border-slate-300"
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : faq.question)}
                        className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 text-left cursor-pointer border-none bg-transparent outline-none"
                      >
                        <span className="text-xs sm:text-sm font-extrabold text-slate-900 pr-2">
                          {faq.question}
                        </span>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                          isOpen ? "bg-emerald-100 text-[#047857] rotate-180" : "bg-slate-100 text-slate-500"
                        }`}>
                          <ChevronDown size={14} strokeWidth={2.5} />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-slate-100 px-5 sm:px-6 py-4 bg-slate-50/40 space-y-4"
                          >
                            <div className="text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed">
                              {faq.answer.split(/(\*\*.*?\*\*)/g).map((part, idx) => {
                                if (part.startsWith("**") && part.endsWith("**")) {
                                  return (
                                    <strong key={idx} className="font-extrabold text-slate-900">
                                      {part.slice(2, -2)}
                                    </strong>
                                  );
                                }
                                return part;
                              })}
                            </div>

                            {/* Tags and Was This Helpful Feedback */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200/60">
                              <div className="flex flex-wrap gap-1.5">
                                {faq.tags.map((tag, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>

                              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                <span className="text-[11px]">Was this helpful?</span>
                                <button
                                  onClick={() => setFeedbackGiven({ ...feedbackGiven, [faq.id]: "up" })}
                                  className={`p-1.5 rounded-lg border cursor-pointer transition-all ${
                                    userFeedback === "up"
                                      ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-100"
                                  }`}
                                  title="Yes, helpful"
                                >
                                  <ThumbsUp size={13} />
                                </button>
                                <button
                                  onClick={() => setFeedbackGiven({ ...feedbackGiven, [faq.id]: "down" })}
                                  className={`p-1.5 rounded-lg border cursor-pointer transition-all ${
                                    userFeedback === "down"
                                      ? "bg-rose-100 border-rose-300 text-rose-800"
                                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-100"
                                  }`}
                                  title="Not helpful"
                                >
                                  <ThumbsDown size={13} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ══ MODULE 4: 24/7 SPECIALIST SUPPORT & TICKET DOCK ══ */}
        {activeTab === "contact" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Omni-Channel Direct Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* WhatsApp Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4 flex flex-col justify-between hover:border-emerald-300 transition-all">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#047857] flex items-center justify-center font-bold">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black text-slate-900">WhatsApp Instant Desk</h4>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    </div>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      Direct chat with official Fipmoney wealth support on WhatsApp.
                    </p>
                  </div>
                </div>

                <a
                  href="https://wa.me/919876543210?text=Hello%20Fipmoney%20Support,%20I%20need%20assistance%20with%20my%20account."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs text-center transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle size={15} />
                  <span>Start WhatsApp Chat</span>
                </a>
              </div>

              {/* Priority Helpline */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4 flex flex-col justify-between hover:border-emerald-300 transition-all">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <PhoneCall size={24} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900">Toll-Free Priority Line</h4>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      Speak directly with a dedicated portfolio specialist.
                    </p>
                    <div className="text-base font-black text-slate-900 font-mono mt-2">
                      1800 123 4567
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold">
                      Mon - Sat: 9:00 AM – 8:00 PM IST
                    </div>
                  </div>
                </div>

                <a
                  href="tel:18001234567"
                  className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs text-center transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  <Phone size={15} />
                  <span>Call Toll-Free Now</span>
                </a>
              </div>

              {/* Email Desk */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4 flex flex-col justify-between hover:border-emerald-300 transition-all">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900">Official Email Support</h4>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      Formal escalation, account queries, and tax statements.
                    </p>
                    <div className="text-xs font-black text-slate-900 font-mono mt-2">
                      support@fipmoney.com
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold">
                      Guaranteed SLA: Response &lt; 4 business hours
                    </div>
                  </div>
                </div>

                <a
                  href="mailto:support@fipmoney.com?subject=Fipmoney%20Support%20Request"
                  className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-xs text-center transition-all cursor-pointer border border-slate-200 flex items-center justify-center gap-2"
                >
                  <Mail size={15} />
                  <span>Compose Email</span>
                </a>
              </div>
            </div>

            {/* Instant In-App Support Ticket Form */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#047857] flex items-center justify-center font-bold">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900">Raise an Instant Support Ticket</h4>
                  <p className="text-xs text-slate-500 font-semibold">
                    Submit your query directly to our priority support queue with 24-hr resolution guarantee.
                  </p>
                </div>
              </div>

              {submittedTicketId ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-base font-black text-slate-900">
                    Ticket Raised Successfully!
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    Your official tracking ID is{" "}
                    <strong className="text-emerald-800 font-mono text-sm">{submittedTicketId}</strong>.
                    Our technical support specialist will update your registered email & mobile within 2 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmittedTicketId(null);
                      setTicketSubject("");
                      setTicketMsg("");
                    }}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Raise Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateTicket} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Issue Category</label>
                      <select
                        value={ticketCategory}
                        onChange={(e) => setTicketCategory(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#047857] bg-slate-50/50 cursor-pointer"
                      >
                        <option value="payments">Payments & Bank Withdrawals</option>
                        <option value="sip">Gold SIP & Mandates</option>
                        <option value="kyc">KYC & Account Verification</option>
                        <option value="vault">India's Trusted Vault & Bullion Custody</option>
                        <option value="delivery">Physical Coin Delivery</option>
                        <option value="other">General Technical Support</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Subject / Summary</label>
                      <input
                        type="text"
                        required
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        placeholder="e.g. Withdrawal status for transaction"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#047857] bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
                    <textarea
                      required
                      rows={3}
                      value={ticketMsg}
                      onChange={(e) => setTicketMsg(e.target.value)}
                      placeholder="Please provide relevant details, UTR numbers or dates to help us resolve faster..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#047857] bg-slate-50/50 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] hover:from-[#022c22] hover:via-[#064e3b] hover:to-[#047857] text-white font-extrabold text-xs shadow-md shadow-emerald-900/20 cursor-pointer border-none transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={14} />
                    <span>Submit Priority Ticket</span>
                  </button>
                </form>
              )}
            </div>

            {/* Regulatory Grievance Officer Matrix */}
            <div className="bg-slate-100/70 rounded-2xl p-5 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  Statutory Escalation Matrix
                </span>
                <h5 className="text-xs font-extrabold text-slate-900 mt-0.5">
                  Principal Grievance Officer (PGO)
                </h5>
                <p className="text-[11px] text-slate-600 font-medium">
                  For formal regulatory escalations: grievance@fipmoney.com | 080-6922-1200
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#047857]">
                <ShieldCheck size={16} />
                <span>SEBI & RBI Aligned Compliance</span>
              </div>
            </div>
          </motion.div>
        )}

      </main>

      {/* ── STICKY QUICK ACTION DOCK FOR MOBILE DEVICES ── */}
      {!isDashboardTab && (
        <div className="md:hidden fixed bottom-3 left-4 right-4 z-40 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-2.5 shadow-2xl flex items-center justify-between gap-2 border border-slate-800">
          <a
            href="https://wa.me/919876543210?text=Hello%20Fipmoney%20Support"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 no-underline transition-all"
          >
            <MessageCircle size={15} />
            <span>WhatsApp</span>
          </a>

          <a
            href="tel:18001234567"
            className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs flex items-center justify-center gap-1.5 no-underline transition-all"
          >
            <Phone size={15} />
            <span>1800 Helpline</span>
          </a>

          <button
            onClick={() => {
              setActiveTab("ai");
              window.scrollTo({ top: 400, behavior: "smooth" });
            }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#047857] to-[#10b981] text-white flex items-center justify-center shrink-0 cursor-pointer border-none"
            title="Open AI Assistant"
          >
            <Bot size={18} />
          </button>
        </div>
      )}

    </div>
  );
}
