"use client";
// Notification drawer updated

import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../utils/apiConfig";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet, Zap, Eye, Send, Plus, CreditCard, ChevronRight,
  Shield, ShieldCheck, CheckCircle2, TrendingUp, ArrowUpRight, ArrowDownRight, User,
  Smartphone, MonitorPlay, GraduationCap, Gift, Play, Flame, Tv, Wifi, Droplets, Car, FileText, Home, AlertCircle,
  Search, Bell, ChevronDown, Check, Building, RefreshCw, Grid, Award, Download, Clock, X, CheckCheck, Coins, Menu,
  Sun, AlertTriangle, Calculator, PiggyBank, Target, MoreHorizontal, UserPlus, Users, Share2, Handshake,
  Calendar, Sparkles
} from "lucide-react";
import { Sidebar, MobileNav, MobileDrawerNav, Tab } from "./Navigation";
import cardBgGold from "../../assets/card_bg_gold.jpg";
import cardBgSilver from "../../assets/card_bg_silver.jpg";
import SettingsPage from "./SettingsPage";
import ComingSoon from "./ComingSoon";
import HelpSupportPage from "./HelpSupportPage";
import DigitalGoldSilver from "./DigitalGoldSilver";
import HistoryPage from "./HistoryPage";
import BillsPage from "./BillsPage";
import PortfolioPage from "./PortfolioPage";
import ReferAndEarn from "./ReferAndEarn";
import TermsAndConditions from "./TermsAndConditions";
import ReferralTermsAndConditions from "./ReferralTermsAndConditions";
import AgentOtpModal from "./AgentOtpModal";
import SavingsPage from "./SavingsPage";
import BecomeAgentPage from "./BecomeAgentPage";
import PersonalizedSuggestionCard from "./PersonalizedSuggestionCard";
import ProfileCompletionWidget from "./ProfileCompletionWidget";
import { clearUserSession, getLoggedInUser, getUserAvatar } from "../utils/userStorage";
import { getTransactions } from "../utils/transactionStorage";
import { fetchVaultSummaryApi } from "../utils/vaultApi";
import { decryptData256 } from "../utils/cryptoUtils";
import React from "react";

type Metal = "gold" | "silver";

const GOLD = { G: "#d89221", G_LT: "#efb652", G_DK: "#b87312", BG: "#fdf8f0" };
const SILVER = { G: "#7c93a8", G_LT: "#a8bfce", G_DK: "#4d6373", BG: "#f4f7f9" };
const POS = "#10b981"; 

const INITIAL_NOTIFICATIONS = [
  {
    id: "n1",
    title: "Gold Rate Alert 📈",
    desc: "Live 24K Gold rate updated to ₹6,420.50/g (+1.4% change today).",
    time: "10 mins ago",
    read: false,
    Icon: TrendingUp,
    iconBg: "bg-amber-50 text-amber-600 border-amber-200/50"
  },
  {
    id: "n2",
    title: "Full KYC Verification Complete 🛡️",
    desc: "Your account is fully verified. Annual digital gold holding limit updated to 1000g.",
    time: "2 hours ago",
    read: false,
    Icon: Shield,
    iconBg: "bg-emerald-50 text-emerald-600 border-emerald-200/50"
  },
  {
    id: "n3",
    title: "Automatic SIP Executed 🪙",
    desc: "₹500 Digital Gold SIP executed for July 2026. Added 0.078g to your vault.",
    time: "1 day ago",
    read: false,
    Icon: Coins,
    iconBg: "bg-purple-50 text-purple-600 border-purple-200/50"
  },
  {
    id: "n4",
    title: "Special Cashback Offer 🎁",
    desc: "Get ₹100 extra gold bonus on purchases above ₹1,000 using code GOLD100.",
    time: "2 days ago",
    read: true,
    Icon: Gift,
    iconBg: "bg-pink-50 text-pink-600 border-pink-200/50"
  }
];

const tabSlugMap: Record<string, string> = {
  home: "dashboard",
  savings: "dashboard/savings",
  history: "dashboard/transactions",
  bills: "dashboard/bills",
  refer: "dashboard/referrals",
  settings: "dashboard/settings",
  "buy-gold": "dashboard/buy-gold",
  "sell-gold": "dashboard/sell-gold",
  "instant-loan": "dashboard/loans"
};

const getInitialUserTab = (): Tab => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.slice(1);
    if (path.startsWith("dashboard/")) {
      const subPath = path.replace("dashboard/", "");
      const slugMap: Record<string, Tab> = {
        overview: "home",
        savings: "savings",
        transactions: "history",
        bills: "bills",
        referrals: "refer",
        settings: "settings",
        "buy-gold": "buy-gold",
        "sell-gold": "sell-gold",
        loans: "instant-loan"
      };
      if (slugMap[subPath]) return slugMap[subPath];
    } else if (path === "savings") return "savings";
    else if (path === "history" || path === "transactions") return "history";
    else if (path === "bills") return "bills";
    else if (path === "refer") return "refer";
    else if (path === "settings") return "settings";

    const saved = sessionStorage.getItem("fm_dashboard_tab");
    if (saved) return saved as Tab;
  }
  return "home";
};

export default function Dashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [tab, setTabState] = useState<Tab>(() => getInitialUserTab());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const setTab = (newTab: Tab) => {
    setTabState(newTab);
    sessionStorage.setItem("fm_dashboard_tab", newTab);
    const slug = tabSlugMap[newTab] || `dashboard/${newTab}`;
    const newUrl = `/${slug}`;
    if (typeof window !== 'undefined' && window.location.pathname !== newUrl) {
      window.history.pushState({ tab: newTab }, '', newUrl);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1);
      if (path.startsWith("dashboard/")) {
        const subPath = path.replace("dashboard/", "");
        const slugMap: Record<string, Tab> = {
          overview: "home",
          savings: "savings",
          transactions: "history",
          bills: "bills",
          referrals: "refer",
          settings: "settings",
          "buy-gold": "buy-gold",
          "sell-gold": "sell-gold",
          loans: "instant-loan"
        };
        if (slugMap[subPath]) setTabState(slugMap[subPath]);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [metal, setMetal] = useState<Metal>("gold");
  const [showBalance, setShowBalance] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [activeTopBannerIndex, setActiveTopBannerIndex] = useState(0);

  // Agent Modal state & Approved DGA state
  const [isApprovedDga, setIsApprovedDga] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showAgentOtpModal, setShowAgentOtpModal] = useState(false);

  useEffect(() => {
    const mobile = typeof window !== 'undefined' ? sessionStorage.getItem("fm_logged_in_mobile") : null;
    const saved = typeof window !== 'undefined' ? localStorage.getItem("fm_dga_waitlist_data") : null;

    let localIsApproved = false;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.mobile && mobile && parsed.mobile !== mobile) {
          localStorage.removeItem("fm_dga_waitlist_data");
        } else if (parsed.isApproved || parsed.status === 'approved' || parsed.status === 'APPROVED') {
          localIsApproved = true;
        }
      } catch (e) {}
    }
    setIsApprovedDga(localIsApproved);

    if (mobile) {
      fetch(`${API_BASE_URL}/agent-waitlist/check?mobile=${encodeURIComponent(mobile)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.success && data.alreadyRegistered) {
            const isAppr = data.isApproved || data.status === 'approved' || data.status === 'APPROVED';
            setIsApprovedDga(isAppr);
            try {
              const existing = saved ? JSON.parse(saved) : {};
              const updatedObj = {
                ...existing,
                waitlistNumber: data.waitlistNumber,
                formattedWaitlistNumber: data.formattedWaitlistNumber,
                username: data.data?.username || "Agent Partner",
                alreadyRegistered: true,
                isApproved: isAppr,
                status: data.status,
                mobile: data.data?.mobile || mobile,
              };
              localStorage.setItem("fm_dga_waitlist_data", JSON.stringify(updatedObj));
            } catch (e) {}
          } else if (data && data.success && !data.alreadyRegistered) {
            setIsApprovedDga(false);
            localStorage.removeItem("fm_dga_waitlist_data");
          }
        })
        .catch(() => {});
    }
  }, []);
  const [agentFormData, setAgentFormData] = useState({
    name: "",
    phone: "",
    city: "",
    experience: "advisor"
  });
  const [agentFormSubmitted, setAgentFormSubmitted] = useState(false);
  const [isSubmittingAgent, setIsSubmittingAgent] = useState(false);

  const handleAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAgent(true);
    setTimeout(() => {
      setIsSubmittingAgent(false);
      setAgentFormSubmitted(true);
    }, 1000);
  };

  // Notification panel states
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (tab === "notifications") {
      setShowNotifications(true);
    }
  }, [tab]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  // Load dynamic logged-in user details directly from database session
  const loggedInUser = typeof window !== 'undefined' ? getLoggedInUser() : null;
  const loggedInMobile = loggedInUser?.mobileNumber || (typeof window !== 'undefined' ? sessionStorage.getItem("fm_logged_in_mobile") || "" : "");
  
  const userEmail = loggedInUser?.email || (typeof window !== 'undefined' ? localStorage.getItem(`fm_user_email_${loggedInMobile}`) || "" : "");
  const hasValidEmail = Boolean(userEmail && userEmail.trim().length > 0 && !userEmail.endsWith('@fipmoney.com'));
  const [showEmailMissingModal, setShowEmailMissingModal] = useState(() => !hasValidEmail);

  const savedUsername = (typeof window !== 'undefined' && localStorage.getItem(`fm_username_${loggedInMobile}`)) || loggedInUser?.username || "";
  const userName = savedUsername ? savedUsername : (loggedInUser?.fullName || (typeof window !== 'undefined' ? localStorage.getItem(`fm_user_name_${loggedInMobile}`) || "Guest User" : "Guest User"));
  const userCode = loggedInUser?.userCode || (typeof window !== 'undefined' ? localStorage.getItem(`fm_user_code_${loggedInMobile}`) || "FIP0001" : "FIP0001");
  const [userAvatar, setUserAvatar] = useState<string | null>(() => getUserAvatar(loggedInMobile));
  const [kycStatus, setKycStatus] = useState(loggedInUser?.isKycCompleted ? "full kyc" : "pending");
  const [heroCarouselIndex, setHeroCarouselIndex] = useState(0);
  const [isRefreshingPortfolio, setIsRefreshingPortfolio] = useState(false);
  const [activeMetalTab, setActiveMetalTab] = useState<"gold" | "silver">("gold");

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroCarouselIndex(prev => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleAvatarChange = () => {
      setUserAvatar(getUserAvatar(loggedInMobile));
    };
    window.addEventListener("fm_avatar_changed", handleAvatarChange);
    return () => window.removeEventListener("fm_avatar_changed", handleAvatarChange);
  }, [loggedInMobile]);

  const calcProfileCompletion = (): number => {
    let score = 0;
    if (userName && userName !== "Guest User") score += 25;
    if (hasValidEmail) score += 25;
    if (loggedInMobile) score += 25;
    if (kycStatus === "full kyc") score += 25;
    return score;
  };
  const profileCompletion = calcProfileCompletion();

  const [virtualCard, setVirtualCard] = useState<{ cardNumber: string, expiry: string, cvv: string, nameOnCard: string } | null>(null);
  const [isLoadingCard, setIsLoadingCard] = useState(true);
  
  const goldPrice = 6420.50;
  const silverPrice = 84.20;
  
  const [backendVault, setBackendVault] = useState<{ gold: number; silver: number; cash: number } | null>(null);

  useEffect(() => {
    if (loggedInMobile) {
      fetchVaultSummaryApi(loggedInMobile).then((data) => {
        if (data) {
          setBackendVault({
            gold: data.goldHoldingsGrams || 0,
            silver: data.silverHoldingsGrams || 0,
            cash: data.cashBalance || 0,
          });
        }
      });
      // Fetch latest user KYC state
      fetch(`${API_BASE_URL}/users/search?mobile=${loggedInMobile}`)
        .then(res => {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return res.json();
          }
          throw new Error(`Non-JSON response (HTTP ${res.status})`);
        })
        .then(data => {
          if (data.success && data.data && data.data.length > 0) {
            const user = data.data[0];
            const isCompleted = user.isKycCompleted;
            const level = user.kycLevel;
            setKycStatus(isCompleted ? "full kyc" : "pending");
            
            const storedUser = localStorage.getItem("fm_current_logged_in_user");
            if (storedUser) {
              const userObj = JSON.parse(storedUser);
              userObj.isKycCompleted = isCompleted;
              userObj.kycLevel = level;
              localStorage.setItem("fm_current_logged_in_user", JSON.stringify(userObj));
            }
            if (user.profileImage) {
              setUserAvatar(user.profileImage);
              if (typeof window !== 'undefined') {
                localStorage.setItem(`fm_user_avatar_${loggedInMobile}`, user.profileImage);
              }
            }
          }
        })
        .catch(err => console.warn("Notice fetching user details:", err.message || err));

      // Fetch dashboard data for premium card
      fetch(`${API_BASE_URL}/users/dashboard?mobile=${loggedInMobile}`)
        .then(res => {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return res.json();
          }
          throw new Error(`Non-JSON response (HTTP ${res.status})`);
        })
        .then(data => {
          if (data.success && data.data && data.data.premiumCardEncrypted) {
            try {
              const decryptedString = decryptData256(data.data.premiumCardEncrypted);
              if (decryptedString) {
                const cardObj = JSON.parse(decryptedString);
                setVirtualCard({
                  cardNumber: decryptData256(cardObj.cardNumber),
                  expiry: decryptData256(cardObj.expiry),
                  cvv: decryptData256(cardObj.cvv),
                  nameOnCard: decryptData256(cardObj.nameOnCard)
                });
              }
            } catch (err) {
              console.error("Failed to decrypt card details", err);
            }
          }
        })
        .catch(err => console.warn("Notice fetching dashboard data:", err.message || err))
        .finally(() => setIsLoadingCard(false));
    } else {
      setIsLoadingCard(false);
    }
  }, [loggedInMobile]);

  // Zero out all predefined mock balances & holdings, reading backend or localStorage
  const goldHoldings = backendVault ? backendVault.gold : (typeof window !== 'undefined' ? parseFloat(localStorage.getItem(`fip_gold_holdings_${loggedInMobile}`) || "0") : 0);
  const silverHoldings = backendVault ? backendVault.silver : (typeof window !== 'undefined' ? parseFloat(localStorage.getItem(`fip_silver_holdings_${loggedInMobile}`) || "0") : 0);
  const cashBalance = backendVault ? backendVault.cash : (typeof window !== 'undefined' ? parseFloat(localStorage.getItem(`fip_cash_balance_${loggedInMobile}`) || "0") : 0);
  
  const totalGrams = goldHoldings + silverHoldings;
  const portfolioVal = (goldHoldings * goldPrice) + (silverHoldings * silverPrice) + cashBalance;
  
  const recentTransactions = typeof window !== 'undefined' ? getTransactions().slice(0, 4) : [];
  
  const P = metal === "gold" ? GOLD : SILVER;
  const { G, G_LT, G_DK } = P;
  const metalName = metal === "gold" ? "Gold" : "Silver";

  const bbpsServices = [
    { label: "Mobile Prepaid", Icon: Smartphone, color: "#8b5cf6", bg: "#f3e8ff" },
    { label: "Electricity", Icon: Zap, color: "#eab308", bg: "#fef08a" },
    { label: "DTH", Icon: Tv, color: "#f59e0b", bg: "#fef3c7" },
    { label: "Credit Card", Icon: CreditCard, color: "#ef4444", bg: "#fee2e2" },
    { label: "Mobile Postpaid", Icon: FileText, color: "#8b5cf6", bg: "#f3e8ff" },
    { label: "Gas", Icon: Flame, color: "#f97316", bg: "#ffedd5" },
    { label: "Water", Icon: Droplets, color: "#3b82f6", bg: "#dbeafe" },
    { label: "FASTag", Icon: Car, color: "#10b981", bg: "#d1fae5" },
    { label: "Broadband", Icon: Wifi, color: "#06b6d4", bg: "#cffafe" },
    { label: "Rent", Icon: Home, color: "#14b8a6", bg: "#ccfbf1" },
  ];

  const handleBillClick = (label: string) => {
    sessionStorage.setItem("selectedBillLabel", label);
    onNavigate("recharge-details");
  };

  const MainDashboard = () => (
    <div className="flex-1 h-screen overflow-y-auto overflow-x-hidden bg-[#fcfdfd] flex flex-col pb-28 sm:pb-32 lg:pb-10">
       {/* Top Bar */}
       <div className="hidden lg:flex h-[72px] border-b border-gray-100 items-center justify-between px-6 md:px-8 shrink-0 bg-white sticky top-0 z-20">
         <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search services, transactions..." className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-purple-200 transition-colors placeholder:text-gray-400 text-gray-700 font-medium" />
         </div>
         <div className="flex items-center gap-6 ml-auto">
            {/* Notification Panel Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative border w-10 h-10 rounded-full flex items-center justify-center shadow-sm cursor-pointer outline-none transition-all ${
                  showNotifications ? 'bg-purple-50 border-purple-300 text-purple-700' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center border-2 border-white animate-pulse">
                    {unreadCount}
                  </div>
                )}
              </button>

              {/* 50% Screen Slide-over Notification Panel */}
              <AnimatePresence>
                {showNotifications && (
                  <>
                    {/* Backdrop Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowNotifications(false)}
                      className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50"
                    />

                    {/* 50% Screen Slide-over Drawer */}
                    <motion.div
                      initial={{ x: "100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "100%" }}
                      transition={{ type: "spring", damping: 28, stiffness: 280 }}
                      className="fixed top-0 right-0 h-full w-full md:w-[50vw] bg-white z-[51] shadow-2xl flex flex-col font-sans border-l border-gray-100"
                    >
                      {/* Panel Header */}
                      <div className="p-6 bg-gradient-to-r from-[#1e1b4b] to-[#312e81] text-white flex items-center justify-between shrink-0 shadow-md">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-amber-400/20 flex items-center justify-center text-amber-400 border border-amber-400/30">
                            <Bell size={22} strokeWidth={2.5} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2.5">
                              <h2 className="text-lg font-black tracking-tight">Notification Panel</h2>
                              {unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                                  {unreadCount} Unread
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-indigo-200 font-medium mt-0.5">Real-time alerts, market updates & transaction logs</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border border-white/15 cursor-pointer outline-none flex items-center gap-1.5"
                            >
                              <CheckCheck size={16} /> Mark all read
                            </button>
                          )}
                          <button
                            onClick={() => setShowNotifications(false)}
                            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-indigo-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer outline-none border-none"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>

                      {/* Panel Body List */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                        {notifications.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                              <Bell size={40} />
                            </div>
                            <h3 className="text-base font-bold text-gray-800 mb-1">No notifications right now</h3>
                            <p className="text-xs text-gray-500 max-w-xs">We'll notify you here when you receive new updates, market signals, or transaction alerts.</p>
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <motion.div
                              key={n.id}
                              layout
                              onClick={() => markAsRead(n.id)}
                              className={`p-5 rounded-2xl border transition-all cursor-pointer relative group flex gap-4 items-start ${
                                n.read
                                  ? 'bg-white border-gray-100 hover:border-gray-200 shadow-xs'
                                  : 'bg-white border-purple-200/80 shadow-md shadow-purple-900/5 ring-1 ring-purple-500/10'
                              }`}
                            >
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-xs ${n.iconBg}`}>
                                <n.Icon size={22} strokeWidth={2.5} />
                              </div>
                              <div className="flex-1 min-w-0 pr-6">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <h4 className={`text-sm font-bold truncate ${n.read ? 'text-gray-800' : 'text-[#1e1b4b] font-black'}`}>
                                    {n.title}
                                  </h4>
                                  <span className="text-xs font-semibold text-gray-400 shrink-0">{n.time}</span>
                                </div>
                                <p className="text-xs text-gray-600 font-medium leading-relaxed mb-2">
                                  {n.desc}
                                </p>
                                {!n.read && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" /> New Alert
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={(e) => deleteNotification(n.id, e)}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-2 transition-all rounded-lg hover:bg-red-50 cursor-pointer border-none bg-transparent outline-none absolute right-3 top-3"
                                title="Dismiss"
                              >
                                <X size={16} />
                              </button>
                            </motion.div>
                          ))
                        )}
                      </div>

                      {/* Panel Footer */}
                      <div className="p-5 bg-white border-t border-gray-100 flex items-center justify-between shrink-0">
                        <button
                          onClick={() => setNotifications([])}
                          disabled={notifications.length === 0}
                          className="text-xs font-bold text-gray-400 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border-none bg-transparent outline-none flex items-center gap-1.5"
                        >
                          <X size={14} /> Clear All Notifications
                        </button>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="px-5 py-2.5 bg-[#1e1b4b] hover:bg-[#111827] text-white font-bold text-xs rounded-xl shadow-md transition-colors border-none cursor-pointer outline-none"
                        >
                          Close Panel
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setTab("settings")}>
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center font-black text-sm shrink-0 uppercase overflow-hidden relative border border-gray-100 shadow-xs">
                 <span>{(userName || "U").charAt(0)}</span>
                 {userAvatar && (
                   <img
                     src={userAvatar}
                     alt={userName}
                     className="absolute inset-0 w-full h-full object-cover"
                     onError={(e) => {
                       (e.target as HTMLElement).style.display = "none";
                     }}
                   />
                 )}
               </div>
               <div className="flex flex-col hidden sm:flex">
                 <span className="text-[11px] text-gray-500 font-medium">Welcome back,</span>
                 <div className="flex items-center gap-1"><span className="text-sm font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{userName}</span> <ChevronDown size={14} className="text-gray-400" /></div>
               </div>
            </div>
         </div>
       </div>

        {/* Mobile View: Screenshot 1 & 2 Layout (< lg) */}
        <div className="lg:hidden px-4 pt-3 pb-24 space-y-4">
          


          {/* Framer Motion Touch/Drag Carousel */}
          <div className="w-full overflow-hidden rounded-3xl relative">
            <motion.div
              className="flex cursor-grab active:cursor-grabbing"
              animate={{ x: `-${activeTopBannerIndex * 100}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(_, info) => {
                const swipeThreshold = 50;
                if (info.offset.x < -swipeThreshold && activeTopBannerIndex < 2) {
                  setActiveTopBannerIndex((prev) => prev + 1);
                } else if (info.offset.x > swipeThreshold && activeTopBannerIndex > 0) {
                  setActiveTopBannerIndex((prev) => prev - 1);
                }
              }}
            >
              {/* Card 1 (Default First Card): Daily, Weekly or Monthly Savings Card */}
              <div className="w-full shrink-0 min-w-full bg-gradient-to-br from-[#fbf9ff] via-[#f5efff] to-[#eee4ff] border border-purple-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden flex flex-col justify-between space-y-2.5 group">
                {/* Top Row: Title Text & Right 3D Asset */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-0.5 max-w-[65%]">
                    <h3 className="text-base sm:text-lg font-black text-slate-950 tracking-tight leading-snug">
                      Start your{" "}
                      <span className="text-purple-600 font-black">Daily, Weekly</span>{" "}
                      or{" "}
                      <span className="text-purple-700 font-black">Monthly</span>{" "}
                      savings with Fipmoney
                    </h3>
                  </div>

                  {/* Right Side 3D Asset Image */}
                  <div className="w-36 h-36 sm:w-44 sm:h-44 shrink-0 relative -mt-4 -mr-2 scale-105">
                    <img 
                      src="/daily_savings.png" 
                      alt="Start Savings" 
                      className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300 pointer-events-none" 
                    />
                  </div>
                </div>

                {/* 3 Savings Frequency Pills */}
                <div className="grid grid-cols-3 gap-1.5 relative z-10">
                  {/* Daily */}
                  <div 
                    onClick={() => setTab("savings")}
                    className="bg-white/80 hover:bg-white backdrop-blur-xs border border-purple-100/90 rounded-xl p-1.5 flex flex-col items-center text-center shadow-2xs cursor-pointer active:scale-95 transition-all"
                  >
                    <div className="w-6 h-6 rounded-lg bg-purple-100/80 text-purple-600 flex items-center justify-center mb-0.5">
                      <Calendar size={14} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black text-slate-900 leading-none">Daily</span>
                    <span className="text-[8.5px] font-bold text-slate-500 leading-tight mt-0.5">Save every day</span>
                  </div>

                  {/* Weekly */}
                  <div 
                    onClick={() => setTab("savings")}
                    className="bg-white/80 hover:bg-white backdrop-blur-xs border border-blue-100/90 rounded-xl p-1.5 flex flex-col items-center text-center shadow-2xs cursor-pointer active:scale-95 transition-all"
                  >
                    <div className="w-6 h-6 rounded-lg bg-blue-100/80 text-blue-600 flex items-center justify-center mb-0.5">
                      <Calendar size={14} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black text-slate-900 leading-none">Weekly</span>
                    <span className="text-[8.5px] font-bold text-slate-500 leading-tight mt-0.5">Save every week</span>
                  </div>

                  {/* Monthly */}
                  <div 
                    onClick={() => setTab("savings")}
                    className="bg-white/80 hover:bg-white backdrop-blur-xs border border-emerald-100/90 rounded-xl p-1.5 flex flex-col items-center text-center shadow-2xs cursor-pointer active:scale-95 transition-all"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-100/80 text-emerald-600 flex items-center justify-center mb-0.5">
                      <Calendar size={14} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black text-slate-900 leading-none">Monthly</span>
                    <span className="text-[8.5px] font-bold text-slate-500 leading-tight mt-0.5">Grow every month</span>
                  </div>
                </div>

                {/* Bottom Action Pill Banner */}
                <div 
                  onClick={() => setTab("savings")}
                  className="bg-purple-100/90 hover:bg-purple-200 border border-purple-200/90 rounded-xl px-2.5 py-1.5 flex items-center justify-between transition-all relative z-10 cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Sparkles size={11} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-black text-purple-950">
                      Small steps today, greater wealth tomorrow
                    </span>
                  </div>
                  <ChevronRight size={14} strokeWidth={3} className="text-purple-700 shrink-0" />
                </div>
              </div>

              {/* Card 2 (Swiped Right): Become DGA Agent / Agent Dashboard Card */}
              <div className="w-full shrink-0 min-w-full bg-gradient-to-br from-[#fbf9ff] via-[#f5efff] to-[#eee4ff] border border-purple-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden flex flex-col justify-between space-y-2.5 group">
                {/* Top Section: Left Info & Right 3D Asset */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-1.5 max-w-[64%]">
                    {/* Verified Partner / Earn Commission Badge */}
                    <div>
                      <span className="bg-amber-100/90 text-amber-800 border border-amber-300/80 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase inline-flex items-center gap-1 shadow-2xs">
                        <ShieldCheck size={11} strokeWidth={2.5} className="text-amber-700" />
                        {isApprovedDga ? "Verified Partner" : "Earn Commission"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-black text-slate-950 tracking-tight leading-snug">
                      {isApprovedDga ? (
                        <>Verified Digital Gold Agent <span className="text-purple-600 font-black">(DGA)</span></>
                      ) : (
                        <>Become a Digital Gold Agent <span className="text-purple-600 font-black">(DGA)</span></>
                      )}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-[11px] font-medium text-slate-600 leading-tight">
                      {isApprovedDga
                        ? "Manage client portfolios & track instant payouts."
                        : "Earn high commissions & exclusive rewards."}
                    </p>

                    {/* Action Button */}
                    <div className="pt-0.5">
                      <button
                        onClick={() => {
                          if (isApprovedDga) {
                            setShowAgentOtpModal(true);
                          } else {
                            setTab("become-agent");
                          }
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-black text-[11px] px-3 py-1.5 rounded-full shadow-md shadow-purple-600/20 inline-flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all outline-none"
                      >
                        <span>{isApprovedDga ? "Open Agent Dashboard" : "Become an Agent"}</span>
                        <div className="w-4 h-4 rounded-full bg-white text-purple-600 flex items-center justify-center shrink-0">
                          <ChevronRight size={12} strokeWidth={3} />
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Right Side 3D Asset Image */}
                  <div className="w-40 h-40 sm:w-48 sm:h-48 shrink-0 relative -mt-5 -mr-2 scale-105">
                    <img 
                      src="/dga_asset.png" 
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/dga_gold_asset.png";
                      }}
                      alt="DGA Agent" 
                      className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300 pointer-events-none" 
                    />
                  </div>
                </div>

                {/* Bottom 3 Feature Badges Row */}
                <div className="grid grid-cols-3 gap-1.5 relative z-10">
                  {/* Pill 1: Manage Clients */}
                  <div className="bg-white/80 backdrop-blur-xs border border-purple-100/90 rounded-xl p-1.5 flex flex-col items-center text-center shadow-2xs">
                    <div className="w-6 h-6 rounded-lg bg-purple-100/80 text-purple-600 flex items-center justify-center mb-0.5">
                      <CreditCard size={14} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black text-slate-900 leading-none">Manage Clients</span>
                    <span className="text-[8.5px] font-bold text-slate-500 leading-tight mt-0.5">Client portfolios</span>
                  </div>

                  {/* Pill 2: Track Earnings */}
                  <div className="bg-white/80 backdrop-blur-xs border border-purple-100/90 rounded-xl p-1.5 flex flex-col items-center text-center shadow-2xs">
                    <div className="w-6 h-6 rounded-lg bg-purple-100/80 text-purple-600 flex items-center justify-center mb-0.5">
                      <TrendingUp size={14} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black text-slate-900 leading-none">Track Earnings</span>
                    <span className="text-[8.5px] font-bold text-slate-500 leading-tight mt-0.5">Real-time payouts</span>
                  </div>

                  {/* Pill 3: Instant Payouts */}
                  <div className="bg-white/80 backdrop-blur-xs border border-purple-100/90 rounded-xl p-1.5 flex flex-col items-center text-center shadow-2xs">
                    <div className="w-6 h-6 rounded-lg bg-purple-100/80 text-purple-600 flex items-center justify-center mb-0.5">
                      <Wallet size={14} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black text-slate-900 leading-none">Instant Payouts</span>
                    <span className="text-[8.5px] font-bold text-slate-500 leading-tight mt-0.5">Direct to wallet</span>
                  </div>
                </div>
              </div>

              {/* Card 3 (Swiped Right): Refer & Earn Card */}
              <div className="w-full shrink-0 min-w-full bg-gradient-to-br from-[#fbf9ff] via-[#f5efff] to-[#eee4ff] border border-purple-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden flex flex-col justify-between space-y-2.5 group">
                {/* Top Section: Left Info & Right 3D Asset */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-1.5 max-w-[62%]">
                    {/* User Plus Top Icon Badge */}
                    <div className="w-8 h-8 rounded-xl bg-purple-100/90 border border-purple-200/80 text-purple-600 flex items-center justify-center shadow-2xs">
                      <UserPlus size={16} strokeWidth={2.5} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-none">
                      Refer <span className="text-purple-600 font-black">& Earn</span>
                    </h3>

                    {/* Subtitle */}
                    <p className="text-[11px] font-medium text-slate-600 leading-tight">
                      Invite your friends to Fipmoney and earn exciting rewards.
                    </p>
                  </div>

                  {/* Right Side 3D Asset Image (refer_card.png) */}
                  <div className="w-40 h-40 sm:w-48 sm:h-48 shrink-0 relative -mt-5 -mr-2 scale-105">
                    <img 
                      src="/refer_card.png" 
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/refer_asset.png";
                      }}
                      alt="Refer and Earn" 
                      className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300 pointer-events-none" 
                    />
                  </div>
                </div>

                {/* Middle 2 Feature Pills Row */}
                <div className="grid grid-cols-2 gap-2 py-0.5 relative z-10 max-w-[65%]">
                  {/* Badge 1: Exciting Rewards */}
                  <div className="bg-white/80 backdrop-blur-xs border border-purple-100/90 rounded-xl p-1.5 flex items-center gap-2 shadow-2xs">
                    <div className="w-6 h-6 rounded-lg bg-purple-100/80 text-purple-600 flex items-center justify-center shrink-0">
                      <Gift size={13} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col text-left leading-none">
                      <span className="text-[10px] font-black text-slate-900">Exciting</span>
                      <span className="text-[8.5px] font-bold text-slate-500 mt-0.5">Rewards</span>
                    </div>
                  </div>

                  {/* Badge 2: Earn on every */}
                  <div className="bg-white/80 backdrop-blur-xs border border-purple-100/90 rounded-xl p-1.5 flex items-center gap-2 shadow-2xs">
                    <div className="w-6 h-6 rounded-lg bg-purple-100/80 text-purple-600 flex items-center justify-center shrink-0">
                      <Wallet size={13} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col text-left leading-none">
                      <span className="text-[10px] font-black text-slate-900">Earn on every</span>
                      <span className="text-[8.5px] font-bold text-slate-500 mt-0.5">successful referral</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Pill Banner */}
                <div 
                  onClick={() => setTab("refer-and-earn")}
                  className="bg-purple-100/90 hover:bg-purple-200 border border-purple-200/90 rounded-xl px-3 py-2 flex items-center justify-between transition-all relative z-10 cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <ChevronRight size={13} strokeWidth={3} />
                    </div>
                    <span className="text-xs font-black text-purple-950">
                      Refer Now
                    </span>
                  </div>
                  <ChevronRight size={15} strokeWidth={3} className="text-purple-700 shrink-0" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Carousel Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-2 pb-1">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setActiveTopBannerIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer border-none outline-none ${
                  activeTopBannerIndex === idx
                    ? "w-6 bg-purple-600 shadow-2xs"
                    : "w-2 bg-purple-200 hover:bg-purple-300"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>



          {/* Quick Actions Card (Light Theme, Placed ABOVE Live Price) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Quick Actions</h3>
            </div>

            {/* Top Grid: 5 Quick Actions Items */}
            <div className="grid grid-cols-5 gap-2 text-center">
              {/* 1. Digital Gold */}
              <button
                onClick={() => setTab("sip")}
                className="flex flex-col items-center group cursor-pointer border-none bg-transparent outline-none"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-center p-1.5 shadow-2xs group-active:scale-95 transition-all mb-1">
                  <img src="/gold-bars.png" alt="Digital Gold" className="w-8 h-8 object-contain drop-shadow-2xs" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 leading-tight">Digital Gold</span>
              </button>

              {/* 2. Digital Silver */}
              <button
                onClick={() => setTab("sip")}
                className="flex flex-col items-center group cursor-pointer border-none bg-transparent outline-none"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-1.5 shadow-2xs group-active:scale-95 transition-all mb-1">
                  <img src="/silver.png" alt="Digital Silver" className="w-8 h-8 object-contain drop-shadow-2xs" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 leading-tight">Digital Silver</span>
              </button>

              {/* 3. Start SIP */}
              <button
                onClick={() => setTab("sip")}
                className="flex flex-col items-center group cursor-pointer border-none bg-transparent outline-none"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shadow-2xs group-active:scale-95 transition-all mb-1">
                  <PiggyBank size={22} strokeWidth={2.2} />
                </div>
                <span className="text-[11px] font-bold text-slate-800 leading-tight">Start SIP</span>
              </button>

              {/* 4. Mobile Recharge */}
              <button
                onClick={() => handleBillClick("Mobile Recharge")}
                className="flex flex-col items-center group cursor-pointer border-none bg-transparent outline-none"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-2xs group-active:scale-95 transition-all mb-1">
                  <Smartphone size={22} strokeWidth={2.2} />
                </div>
                <span className="text-[11px] font-bold text-slate-800 leading-tight">Recharge</span>
              </button>

              {/* 5. Bills */}
              <button
                onClick={() => setTab("bills")}
                className="flex flex-col items-center group cursor-pointer border-none bg-transparent outline-none"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200/80 flex items-center justify-center text-purple-600 shadow-2xs group-active:scale-95 transition-all mb-1">
                  <FileText size={22} strokeWidth={2.2} />
                </div>
                <span className="text-[11px] font-bold text-slate-800 leading-tight">Bills</span>
              </button>
            </div>

            {/* Bottom Row: Gold SIP Banner (~75%) + More Button (~25%) */}
            <div className="flex items-stretch gap-2.5 pt-1">
              {/* Left Banner */}
              <button
                onClick={() => setTab("sip")}
                className="flex-1 bg-slate-100/90 border border-slate-200/90 rounded-2xl px-4 py-3.5 flex items-center justify-between shadow-2xs cursor-pointer hover:bg-slate-200/60 active:scale-[0.99] transition-all text-left outline-none"
              >
                <span className="text-xs font-black text-slate-800 tracking-tight">
                  Gold SIP starts at just ₹10
                </span>
              </button>

              {/* Right More Button -> Navigates to /bills */}
              <button
                onClick={() => setTab("bills")}
                className="w-24 bg-slate-100/90 hover:bg-slate-200/60 border border-slate-200/90 rounded-2xl px-3 py-3.5 flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all text-purple-700 outline-none shrink-0"
              >
                <span className="text-xs font-black">More</span>
                <ChevronRight size={15} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Live Price Card with Gold & Silver Tab Switcher at Right Corner */}
          <div className={`rounded-3xl p-5 border shadow-xs space-y-4 transition-all duration-300 ${
            activeMetalTab === 'gold'
              ? 'bg-[#fffdf5] border-amber-200/80'
              : 'bg-[#f8fafc] border-slate-300'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl ${activeMetalTab === 'gold' ? 'bg-amber-500 shadow-amber-500/20' : 'bg-slate-700 shadow-slate-700/20'} text-white flex items-center justify-center shadow-md transition-all`}>
                  <TrendingUp size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Live Price</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {activeMetalTab === 'gold' ? '24K Gold - 7 Day Trend' : '999 Pure Silver - 7 Day Trend'}
                  </p>
                </div>
              </div>

              {/* Gold & Silver Tab Switcher */}
              <div className={`p-1 rounded-2xl flex items-center border shrink-0 transition-all ${
                activeMetalTab === 'gold'
                  ? 'bg-amber-100/70 border-amber-200/80'
                  : 'bg-slate-200/80 border-slate-300/80'
              }`}>
                <button
                  onClick={() => setActiveMetalTab('gold')}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer border-none outline-none ${
                    activeMetalTab === 'gold'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 bg-transparent'
                  }`}
                >
                  Gold
                </button>
                <button
                  onClick={() => setActiveMetalTab('silver')}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer border-none outline-none ${
                    activeMetalTab === 'silver'
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 bg-transparent'
                  }`}
                >
                  Silver
                </button>
              </div>
            </div>

            {/* Highlighted Price Display (Same Row, No Container Pill) */}
            <div className="pt-1 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Price</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-black tracking-tight ${activeMetalTab === 'gold' ? 'text-amber-600' : 'text-slate-800'}`}>
                  {activeMetalTab === 'gold'
                    ? `₹${(goldPrice || 10250).toLocaleString('en-IN')}`
                    : `₹${(silverPrice || 115).toLocaleString('en-IN')}`}
                </span>
                <span className="text-xs font-bold text-slate-500">/g</span>
              </div>
            </div>

            <div className={`grid grid-cols-3 gap-2.5 pt-2 border-t transition-all ${
              activeMetalTab === 'gold' ? 'border-amber-100' : 'border-slate-200'
            }`}>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-semibold block">Today's Change</span>
                <span className="text-xs font-extrabold text-emerald-600">
                  {activeMetalTab === 'gold' ? '+₹125' : '+₹2.50'}
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-semibold block">7D High</span>
                <span className="text-xs font-extrabold text-slate-900">
                  {activeMetalTab === 'gold' ? '₹10,235' : '₹118'}
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-semibold block">7D Low</span>
                <span className="text-xs font-extrabold text-slate-900">
                  {activeMetalTab === 'gold' ? '₹10,180' : '₹112'}
                </span>
              </div>
            </div>
          </div>

          {/* Gold Saving Plans Section (Mobile Light Theme) */}
          <div className="bg-white rounded-3xl p-4.5 sm:p-5 border border-gray-200/90 shadow-md shadow-gray-900/5 space-y-3.5">
            {/* Header Title */}
            <div className="flex items-center justify-between px-0.5">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Gold Saving plans
              </h3>
              <button
                onClick={() => setTab("savings")}
                className="text-[11px] font-black text-amber-700 hover:text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full flex items-center gap-0.5 cursor-pointer outline-none"
              >
                <span>View All</span>
                <ChevronRight size={13} strokeWidth={3} />
              </button>
            </div>

            {/* 3 Saving Plan Cards */}
            <div className="space-y-3">
              {/* Card 1: Save Daily */}
              <div 
                onClick={() => setTab("savings")}
                className="bg-[#f5f3ff] hover:bg-[#ede9fe] border border-purple-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-purple-100/80 border border-purple-200/60 flex items-center justify-center shrink-0 p-1.5 shadow-2xs">
                    <img 
                      src="/daily_saving.png" 
                      alt="Save Daily" 
                      className="w-full h-full object-contain drop-shadow-xs group-hover:scale-105 transition-transform" 
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-black tracking-tight text-purple-950 leading-tight">Save Daily</h4>
                    <p className="text-xs font-bold text-purple-700 mt-0.5">Starts from just ₹10/day</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-200/80 text-purple-800 flex items-center justify-center shrink-0 group-hover:bg-purple-300/80 transition-all">
                  <ChevronRight size={18} strokeWidth={3} />
                </div>
              </div>

              {/* Card 2: Save Weekly */}
              <div 
                onClick={() => setTab("savings")}
                className="bg-[#f0fdf4] hover:bg-[#dcfce7] border border-emerald-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 border border-emerald-200/60 flex items-center justify-center shrink-0 p-1.5 shadow-2xs">
                    <img 
                      src="/weekly_saving.png" 
                      alt="Save Weekly" 
                      className="w-full h-full object-contain drop-shadow-xs group-hover:scale-105 transition-transform" 
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-black tracking-tight text-emerald-950 leading-tight">Save Weekly</h4>
                    <p className="text-xs font-bold text-emerald-700 mt-0.5">Starts from just ₹50/week</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-200/80 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-300/80 transition-all">
                  <ChevronRight size={18} strokeWidth={3} />
                </div>
              </div>

              {/* Card 3: Save Monthly */}
              <div 
                onClick={() => setTab("savings")}
                className="bg-[#fffbeb] hover:bg-[#fef3c7] border border-amber-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100/80 border border-amber-200/60 flex items-center justify-center shrink-0 p-1.5 shadow-2xs">
                    <img 
                      src="/monthly_saving.png" 
                      alt="Save Monthly" 
                      className="w-full h-full object-contain drop-shadow-xs group-hover:scale-105 transition-transform" 
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-black tracking-tight text-amber-950 leading-tight">Save Monthly</h4>
                    <p className="text-xs font-bold text-amber-700 mt-0.5">Starts from just ₹100/month</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0 group-hover:bg-amber-300/80 transition-all">
                  <ChevronRight size={18} strokeWidth={3} />
                </div>
              </div>
            </div>
          </div>

          {/* Become DGA Agent / Agent Dashboard Card (Below Live Price) */}
          <div className="bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#312e81] text-white rounded-3xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
                  <Coins size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                    {isApprovedDga ? "Verified Partner" : "Earn Commission"}
                  </span>
                  <h3 className="text-base font-black text-white mt-1 leading-tight">
                    {isApprovedDga ? "Verified Digital Gold Agent (DGA)" : "Become a Digital Gold Agent Today!"}
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-xs text-indigo-200 font-medium relative z-10">
              {isApprovedDga
                ? "Access partner console, manage client portfolios & track instant commission payouts."
                : "Earn high commissions, exclusive rewards & unlock a world of benefits."}
            </p>

            <div className="flex items-center gap-2.5 relative z-10 pt-2">
              <button
                onClick={() => {
                  if (isApprovedDga) {
                    setShowAgentOtpModal(true);
                  } else {
                    setTab("become-agent");
                  }
                }}
                className="px-4 py-2.5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 transition-all shadow-md flex items-center gap-1.5 cursor-pointer border-none outline-none"
              >
                <span>{isApprovedDga ? "Open Agent Dashboard" : "Become an Agent"}</span>
                <ChevronRight size={15} strokeWidth={3} />
              </button>
              {!isApprovedDga && (
                <button
                  onClick={() => setTab("become-agent")}
                  className="px-3.5 py-2.5 rounded-xl font-bold text-xs text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer outline-none"
                >
                  Know More
                </button>
              )}
            </div>
          </div>

          {/* Refer & Earn Card (Matching Screenshot Structure with Soft Blue Aesthetic) */}
          <div className="bg-gradient-to-br from-[#f0f4ff] via-[#f5f8ff] to-[#eef4ff] border border-blue-100/90 rounded-3xl p-5 shadow-xs space-y-4">
            {/* Header Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                  <UserPlus size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight">Refer & Earn</h3>
                  <p className="text-xs text-blue-800 font-medium">Invite friends and earn unlimited rewards</p>
                </div>
              </div>

              {/* Earn up to ₹500 Badge */}
              <div className="bg-white/90 border border-blue-100/80 rounded-2xl px-3 py-1.5 text-right shadow-2xs shrink-0">
                <span className="text-[10px] font-bold text-blue-700 block">Earn up to</span>
                <span className="text-sm font-black text-blue-950">₹500</span>
              </div>
            </div>

            {/* Middle Reward Highlight Card */}
            <div 
              onClick={() => setTab("refer-and-earn")}
              className="bg-white/90 border border-blue-100/80 rounded-2xl p-3 flex items-center justify-between shadow-2xs cursor-pointer hover:border-blue-200 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
                  <Coins size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">You earn ₹500 per referral</h4>
                  <p className="text-[11px] font-bold text-blue-700">Friend gets ₹100 bonus</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-emerald-100/80 text-emerald-600 flex items-center justify-center">
                  <Handshake size={16} strokeWidth={2.5} />
                </div>
                <ChevronRight size={16} className="text-slate-400" strokeWidth={2.5} />
              </div>
            </div>

            {/* 3-Step Process Row */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-2xl bg-blue-100/70 border border-blue-200/60 text-blue-700 flex items-center justify-center mb-1.5 shadow-2xs">
                  <Share2 size={18} strokeWidth={2.2} />
                </div>
                <span className="text-[11px] font-bold text-slate-800">Share Link</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-2xl bg-blue-100/70 border border-blue-200/60 text-blue-700 flex items-center justify-center mb-1.5 shadow-2xs">
                  <Users size={18} strokeWidth={2.2} />
                </div>
                <span className="text-[11px] font-bold text-slate-800">Friend Joins</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-2xl bg-blue-100/70 border border-blue-200/60 text-blue-700 flex items-center justify-center mb-1.5 shadow-2xs">
                  <Gift size={18} strokeWidth={2.2} />
                </div>
                <span className="text-[11px] font-bold text-slate-800">Both Earn</span>
              </div>
            </div>

            {/* Bottom Full-Width CTA Button */}
            <button
              onClick={() => setTab("refer-and-earn")}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-xs py-3.5 px-4 rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer border-none outline-none active:scale-[0.98] transition-all"
            >
              <Share2 size={16} strokeWidth={2.5} />
              <span>Start Referring Now</span>
              <ChevronRight size={16} strokeWidth={3} />
            </button>
          </div>

        </div>

        {/* Desktop View (Unchanged Desktop Layout >= lg) */}
        <div className="hidden lg:block">
        {/* Become a Digital Gold Agent (DGA) Banner */}
        <div className="px-6 lg:px-8 pt-4 max-w-[1600px] mx-auto w-full">
          <div className="bg-gradient-to-r from-[#fffef5] via-[#fffbeb] to-[#fff7ed] rounded-[20px] p-4 sm:p-5 border border-amber-200/90 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Background ambient glow */}
            <div className="absolute top-0 right-1/4 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none" />
            
            {/* Left Content */}
            <div className="flex items-center gap-3.5 relative z-10">
              <img
                src="/digital_gold_agent_small.png"
                alt="DGA Icon"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain shrink-0 drop-shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-extrabold text-amber-950 tracking-tight">
                    {isApprovedDga ? "You are an Approved Digital Gold Agent (DGA)!" : "Become a Digital Gold Agent (DGA) Today!"}
                  </h3>
                  <span className="bg-amber-100/90 text-amber-800 border border-amber-300/80 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {isApprovedDga ? "Verified Partner" : "New"}
                  </span>
                </div>
                <p className="text-slate-600 text-xs sm:text-[13px] font-semibold mt-0.5">
                  {isApprovedDga ? "Access your partner console, manage client portfolios, and track instant commission payouts." : "Earn high commissions, exclusive rewards and unlock a world of benefits."}
                </p>
              </div>
            </div>

            {/* Right Actions & Badge */}
            <div className="flex items-center gap-3 relative z-10 shrink-0 self-start md:self-center">
              <button
                onClick={() => {
                  setTab("become-agent");
                }}
                className="px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm text-amber-900 bg-white/90 hover:bg-white border border-amber-300/80 hover:border-amber-400 transition-all shadow-xs cursor-pointer outline-none"
              >
                Know More
              </button>
              <button
                onClick={() => {
                  if (isApprovedDga) {
                    setShowAgentOtpModal(true);
                  } else {
                    setTab("become-agent");
                  }
                }}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 transition-all shadow-md shadow-amber-500/20 hover:shadow-lg flex items-center gap-1.5 cursor-pointer outline-none active:scale-[0.98]"
              >
                <span>{isApprovedDga ? "Open Agent Dashboard" : "Become an Agent"}</span>
                <ChevronRight size={16} strokeWidth={3} />
              </button>

              {/* 3D Gold Medal Ribbon Asset on the right side */}
              <div className="hidden sm:flex items-center justify-center shrink-0 ml-1">
                <img
                  src="/digital_gold_agent.png"
                  alt="Digital Gold Agent Medal"
                  className="w-16 h-16 md:w-20 md:h-20 object-contain pointer-events-none drop-shadow-md hover:scale-105 transition-transform"
                />
              </div>
            </div>
          </div>
        </div>

       <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 pb-28 sm:pb-32 lg:pb-10 max-w-[1600px] mx-auto w-full">
         
         {/* LEFT COLUMN */}
         <div className="flex-1 space-y-8 min-w-0">
            
            {/* Row 1: 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Vault Balance */}
               <div className="bg-[#f3e8ff] rounded-3xl p-6 border border-purple-100 flex flex-col justify-center relative overflow-hidden shadow-sm">
                 <h3 className="text-xs font-bold text-purple-900 mb-3 flex items-center gap-1.5">Vault Balance</h3>
                 <div className="flex items-center gap-3 mb-1 relative z-10">
                   <h2 className="text-[26px] font-black text-[#2e1065] tracking-tight">{showBalance ? `${totalGrams.toFixed(2)} g` : "******"}</h2>
                   <button onClick={() => setShowBalance(!showBalance)} className="bg-transparent border-none outline-none cursor-pointer"><Eye size={18} className="text-purple-400 hover:text-purple-600" /></button>
                 </div>
                 <p className="text-xs font-bold text-purple-800/70 relative z-10">≈ ₹{portfolioVal.toLocaleString('en-IN')}</p>
                 <div className="absolute right-4 bottom-4 w-[52px] h-[52px] bg-white/40 rounded-2xl flex items-center justify-center text-purple-600 shadow-sm backdrop-blur-sm">
                    <Wallet size={24} />
                 </div>
               </div>
               
               {/* Portfolio Value */}
               <div className="bg-[#fffbeb] rounded-3xl p-6 border border-amber-100 flex flex-col justify-center relative overflow-hidden shadow-sm">
                 <h3 className="text-xs font-bold text-amber-900 mb-3">Portfolio Value</h3>
                 <h2 className="text-[26px] font-black text-[#78350f] mb-1 tracking-tight relative z-10">₹{portfolioVal.toLocaleString('en-IN')}</h2>
                 <p className="text-xs font-bold text-amber-800/70 relative z-10">Total Investments</p>
                 <div className="absolute right-4 bottom-4 w-[52px] h-[52px] bg-white/50 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm backdrop-blur-sm">
                    <TrendingUp size={24} />
                 </div>
               </div>

               {/* KYC Status */}
               <div className="bg-white rounded-3xl p-6 border border-emerald-50 flex flex-col justify-center relative overflow-hidden shadow-sm shadow-emerald-500/5">
                 <h3 className="text-xs font-bold text-emerald-900/60 mb-3">KYC Status</h3>
                 <h2 className="text-[26px] font-black text-gray-900 mb-1 tracking-tight relative z-10">{kycStatus === "full kyc" ? "Verified" : "Pending"}</h2>
                 <p className="text-xs font-bold text-gray-500 relative z-10">{kycStatus === "full kyc" ? "Full KYC Completed" : "KYC Pending"}</p>
                 <div className={`absolute right-4 bottom-4 w-[52px] h-[52px] rounded-full flex items-center justify-center text-white shadow-lg ${kycStatus === "full kyc" ? "bg-[#10b981] shadow-emerald-500/30" : "bg-red-500 shadow-red-500/30"}`}>
                    {kycStatus === "full kyc" ? <Check size={28} strokeWidth={3} /> : <X size={28} strokeWidth={3} />}
                 </div>
               </div>
            </div>

            {/* Row 2: Vault & Actions */}
            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-6">
               {/* My Vault */}
               <div className="bg-white rounded-[24px] p-6 lg:p-7 border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col">
                 <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center"><Wallet size={16} /></div>
                    <h3 className="text-lg font-bold text-gray-900">My Vault</h3>
                 </div>
                 
                 <div className="relative z-10 flex-1">
                   <p className="text-xs font-bold text-gray-400 mb-1">Current Balance</p>
                   <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-[28px] font-black text-amber-500 tracking-tight">{goldHoldings.toFixed(2)} g</h2>
                   </div>
                   <p className="text-[13px] font-bold text-gray-400 mb-6">= ₹{(goldHoldings * goldPrice).toFixed(2)}</p>
                   
                   <p className="text-xs font-bold text-gray-400 mb-1">Status: <span className={kycStatus === "full kyc" ? "text-emerald-500" : "text-amber-500"}>{kycStatus === "full kyc" ? "Full KYC" : "Pending KYC"} •</span></p>
                   <p className="text-xs font-bold text-gray-400 mb-8">Max Capacity: <span className="text-gray-900">{kycStatus === "full kyc" ? "1000 g" : "0.00 g"}</span></p>
                   
                   <div className="flex gap-4">
                     <button onClick={() => setTab("sip")} className="flex-1 bg-[#6d28d9] text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 border-none outline-none cursor-pointer hover:bg-[#5b21b6] transition-colors"><Plus size={18}/> Buy Gold</button>
                     <button onClick={() => setTab("sip")} className="flex-1 bg-white text-amber-500 border border-amber-300 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 outline-none cursor-pointer hover:bg-amber-50 transition-colors"><Send size={18}/> Sell Gold</button>
                   </div>
                 </div>
                 
                 {/* Decorative Gold graphic on right */}
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-56 h-56 opacity-90 pointer-events-none hidden sm:block">
                   <div className="absolute right-12 top-14 w-28 h-20 bg-gradient-to-br from-[#ffd66b] via-[#eab308] to-[#b45309] rounded-xl transform -rotate-12 shadow-[0_10px_25px_rgba(234,179,8,0.4)] border border-yellow-300" />
                   <div className="absolute right-4 top-24 w-28 h-20 bg-gradient-to-br from-[#fde047] via-[#eab308] to-[#a16207] rounded-xl transform -rotate-12 shadow-[0_10px_25px_rgba(234,179,8,0.4)] border border-yellow-300" />
                   
                   <div className="absolute right-16 bottom-8 w-12 h-12 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-500 rounded-full shadow-lg border border-gray-100" />
                   <div className="absolute right-32 bottom-14 w-14 h-14 bg-gradient-to-br from-gray-100 via-gray-300 to-gray-400 rounded-full shadow-lg border border-gray-100" />
                   <div className="absolute right-6 bottom-20 w-10 h-10 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 rounded-full shadow-md border border-gray-100" />
                 </div>
               </div>

               {/* Quick Actions */}
               <div className="bg-white rounded-[24px] p-6 lg:p-7 border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 mb-8">Quick Actions</h3>
                  <div className="grid grid-cols-3 gap-y-8 gap-x-2 flex-1 items-center">
                     <div className="flex flex-col items-center gap-3 cursor-pointer group">
                       <div className="w-[52px] h-[52px] rounded-[18px] bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:-translate-y-1 transition-transform border border-emerald-100/50 shadow-sm"><Zap size={22} strokeWidth={2.5}/></div>
                       <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900">UPI Pay</span>
                     </div>
                     <div onClick={() => setTab("sip")} className="flex flex-col items-center gap-3 cursor-pointer group">
                       <div className="w-[52px] h-[52px] rounded-[18px] bg-blue-50 text-blue-500 flex items-center justify-center group-hover:-translate-y-1 transition-transform border border-blue-100/50 shadow-sm"><TrendingUp size={22} strokeWidth={2.5}/></div>
                       <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900">Start SIP</span>
                     </div>
                     <div className="flex flex-col items-center gap-3 cursor-pointer group">
                       <div className="w-[52px] h-[52px] rounded-[18px] bg-purple-50 text-purple-600 flex items-center justify-center group-hover:-translate-y-1 transition-transform border border-purple-100/50 shadow-sm"><Building size={22} strokeWidth={2.5}/></div>
                       <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900 text-center leading-tight whitespace-nowrap">Bank Transfer</span>
                     </div>
                     <div className="flex flex-col items-center gap-3 cursor-pointer group">
                       <div className="w-[52px] h-[52px] rounded-[18px] bg-amber-50 text-amber-500 flex items-center justify-center group-hover:-translate-y-1 transition-transform border border-amber-100/50 shadow-sm"><RefreshCw size={22} strokeWidth={2.5}/></div>
                       <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900 text-center leading-tight whitespace-nowrap">Vault Transfer</span>
                     </div>
                     <div onClick={() => setTab("bills")} className="flex flex-col items-center gap-3 cursor-pointer group">
                       <div className="w-[52px] h-[52px] rounded-[18px] bg-blue-50 text-blue-500 flex items-center justify-center group-hover:-translate-y-1 transition-transform border border-blue-100/50 shadow-sm"><FileText size={22} strokeWidth={2.5}/></div>
                       <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900 text-center leading-tight whitespace-pre-line">{"Bills &\nRecharges"}</span>
                     </div>
                     <div className="flex flex-col items-center gap-3 cursor-pointer group">
                       <div className="w-[52px] h-[52px] rounded-[18px] bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:-translate-y-1 transition-transform border border-emerald-100/50 shadow-sm"><Plus size={22} strokeWidth={2.5}/></div>
                       <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900 whitespace-nowrap">Add Money</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Row 3: Bill Payments & Recharges */}
            <div className="bg-white rounded-[24px] p-6 lg:p-7 border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
               <div className="flex justify-between items-center mb-8">
                 <h3 className="text-lg font-bold text-gray-900">Bill Payments & Recharges</h3>
                 <span onClick={() => setTab("bills")} className="text-xs font-bold text-purple-600 hover:text-purple-800 cursor-pointer transition-colors">View All</span>
               </div>
               <div className="grid grid-cols-4 md:grid-cols-8 gap-y-6 gap-x-2">
                  {[
                    { label: "Mobile\nPrepaid", Icon: Smartphone, color: "#8b5cf6" },
                    { label: "Electricity", Icon: Zap, color: "#eab308" },
                    { label: "DTH", Icon: Tv, color: "#8b5cf6" },
                    { label: "Credit Card", Icon: CreditCard, color: "#ef4444" },
                    { label: "Mobile\nPostpaid", Icon: Smartphone, color: "#8b5cf6" },
                    { label: "Gas", Icon: Flame, color: "#f97316" },
                    { label: "Water", Icon: Droplets, color: "#3b82f6" },
                    { label: "More", Icon: Grid, color: "#9ca3af" },
                  ].map((b, i) => (
                    <div key={i} onClick={() => { if(b.label !== "More") handleBillClick(b.label.replace('\n', ' ')); else setTab("bills"); }} className="flex flex-col items-center gap-3 cursor-pointer group">
                       <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center group-hover:-translate-y-1 transition-transform group-hover:shadow-md group-hover:border-purple-100" style={{ color: b.color }}>
                         <b.Icon size={22} strokeWidth={1.5}/>
                       </div>
                       <span className="text-[11px] font-bold text-gray-600 text-center leading-tight whitespace-pre-line group-hover:text-gray-900">{b.label}</span>
                    </div>
                  ))}
               </div>
            </div>
            
            {/* Row 4: Banner */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50/50 rounded-2xl p-6 border border-purple-100/50 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
               <div className="flex-1 relative z-10">
                  <h3 className="text-lg font-bold text-[#312e81] mb-1">Secure. Simple. Smart.</h3>
                  <p className="text-xs text-gray-600 font-medium">All your financial needs in one place.</p>
               </div>
               <div className="flex flex-wrap gap-4 relative z-10 justify-center">
                  <div className="bg-white/80 backdrop-blur py-2.5 px-4 rounded-xl flex items-center gap-3 border border-white shadow-sm">
                    <Shield size={18} className="text-purple-600"/>
                    <div>
                      <div className="text-[10px] font-bold text-gray-900">100% Secure</div>
                      <div className="text-[8px] text-gray-500 font-medium mt-0.5">Bank-level Security</div>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur py-2.5 px-4 rounded-xl flex items-center gap-3 border border-white shadow-sm">
                    <CheckCircle2 size={18} className="text-purple-600"/>
                    <div>
                      <div className="text-[10px] font-bold text-gray-900">Easy to Use</div>
                      <div className="text-[8px] text-gray-500 font-medium mt-0.5">Simple & Intuitive</div>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur py-2.5 px-4 rounded-xl flex items-center gap-3 border border-white shadow-sm">
                    <Clock size={18} className="text-purple-600"/>
                    <div>
                      <div className="text-[10px] font-bold text-gray-900">24/7 Support</div>
                      <div className="text-[8px] text-gray-500 font-medium mt-0.5">We're here for you</div>
                    </div>
                  </div>
               </div>
               
               {/* Decorative Avatar graphic */}
               <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none hidden lg:block">
                  <Smartphone size={120} />
               </div>
            </div>
            
         </div>
         
         {/* RIGHT COLUMN */}
         <div className="w-full lg:w-[320px] xl:w-[350px] shrink-0 space-y-6">
            
            {/* Personalized Suggestion Card (Replaces Fipmoney Virtual Card) */}
            <PersonalizedSuggestionCard
              userName={userName}
              userId={loggedInUser?.userId || loggedInUser?.userCode}
              mobileNumber={loggedInMobile}
              onNavigate={(page) => setTab(page as any)}
            />
            
            {/* Upgrade Card */}
            <div className="rounded-[24px] p-6 text-white relative overflow-hidden shadow-[0_10px_25px_rgba(76,29,149,0.15)]" style={{ background: 'linear-gradient(135deg, #4c1d95, #6d28d9)' }}>
               <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
               <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-purple-900/40 rounded-full blur-xl pointer-events-none" />
               
               <h3 className="text-lg font-bold mb-2 relative z-10 tracking-tight">Upgrade to Premium</h3>
               <p className="text-[11px] text-purple-200 leading-relaxed max-w-[65%] mb-5 relative z-10 font-medium">Unlock exclusive benefits and higher limits.</p>
               <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-[11px] font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer outline-none relative z-10 backdrop-blur-sm shadow-sm hover:shadow-md">Upgrade Now</button>
               
               <div className="absolute right-2 bottom-4 opacity-100 drop-shadow-xl z-0">
                 {/* Visual placeholder for the crown icon */}
                 <div className="relative">
                   <Award size={64} className="text-[#fcd34d]" strokeWidth={1.5} />
                   <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full blur-[2px]" />
                 </div>
               </div>
            </div>
            
            {/* Recent Transactions */}
            <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-6">
               <div className="flex justify-between items-center">
                 <h3 className="text-[15px] font-bold text-gray-900">Recent Transactions</h3>
                 <span onClick={() => setTab("history")} className="text-[11px] font-bold text-purple-600 hover:text-purple-800 cursor-pointer transition-colors">View All</span>
               </div>
               
               <div className="flex flex-col gap-4">
                 {recentTransactions.length === 0 ? (
                   <div className="py-8 text-center text-gray-400 text-xs font-semibold bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                     No transactions recorded yet
                   </div>
                 ) : (
                   recentTransactions.map((t, i) => (
                     <div key={i} className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-gray-50/50 shadow-sm bg-purple-50 text-purple-600">
                          <Wallet size={16} strokeWidth={2.5} />
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="text-[12px] font-bold text-gray-900 truncate">{t.source || t.category}</div>
                          <div className="text-[10px] font-medium text-gray-400 truncate">{new Date(t.date).toLocaleDateString()}</div>
                       </div>
                       <div className="text-right shrink-0 ml-2">
                          <div className={`text-[12px] font-bold ${t.type === 'Buy' ? 'text-emerald-500' : 'text-gray-900'}`}>{t.type === 'Buy' ? '+' : '-'} ₹{t.amount}</div>
                          <div className="text-[10px] font-medium text-gray-400">{t.status}</div>
                       </div>
                     </div>
                   ))
                 )}
                </div>
                
                <button onClick={() => setTab("history")} className="mt-1 text-[11px] font-bold text-[#6d28d9] border border-purple-100 rounded-xl py-3 w-full hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 cursor-pointer bg-transparent outline-none">
                   <Download size={14} strokeWidth={2.5} /> Download Statement
                </button>
             </div>
             
          </div>

        </div>
      </div>
    </div>
  );

  const NotificationsPage = () => (
    <div className="flex-1 h-screen overflow-y-auto overflow-x-hidden bg-[#fcfdfd] flex flex-col p-6 lg:p-8 max-w-[1200px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#6d28d9] flex items-center justify-center shadow-xs">
              <Bell size={22} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Notification Center</h1>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-1">Manage your updates, security alerts, and investment reminders.</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2.5 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs hover:bg-purple-100 transition-colors border border-purple-200/60 cursor-pointer outline-none flex items-center gap-2 shadow-xs"
            >
              <CheckCheck size={16} /> Mark all as read
            </button>
          )}
          <button
            onClick={() => setNotifications([])}
            disabled={notifications.length === 0}
            className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-bold text-xs hover:bg-gray-200 transition-colors border-none cursor-pointer outline-none disabled:opacity-50"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex-1">
        {notifications.length === 0 ? (
          <div className="p-16 text-center">
            <Bell size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-base font-bold text-gray-700 mb-1">All caught up!</h3>
            <p className="text-xs text-gray-400">You have no active notifications right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`p-6 flex flex-col sm:flex-row items-start gap-4 transition-colors cursor-pointer group ${
                  n.read ? 'bg-white hover:bg-gray-50/80' : 'bg-purple-50/30 hover:bg-purple-50/60'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-xs ${n.iconBg}`}>
                  <n.Icon size={22} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className={`text-sm font-bold ${n.read ? 'text-gray-900' : 'text-purple-950 font-black'}`}>
                      {n.title}
                    </h3>
                    <span className="text-xs font-semibold text-gray-400 shrink-0">{n.time}</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed max-w-3xl">
                    {n.desc}
                  </p>
                </div>
                <button
                  onClick={(e) => deleteNotification(n.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-2 rounded-xl hover:bg-red-50 cursor-pointer border-none bg-transparent outline-none self-start sm:self-center"
                  title="Remove notification"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#fcfdfd] font-sans overflow-hidden text-gray-800">
      <Sidebar activeTab={tab} onTabChange={setTab} profileCompletion={profileCompletion} onLogout={() => {
        if (typeof window !== 'undefined') {
          clearUserSession();
          sessionStorage.removeItem("fm_logged_in_name");
        }
        onNavigate("home");
      }} onBecomeAgent={() => setTab("become-agent")} />

      <MobileDrawerNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={tab}
        onTabChange={setTab}
        onLogout={() => {
          if (typeof window !== 'undefined') {
            clearUserSession();
            sessionStorage.removeItem("fm_logged_in_name");
          }
          onNavigate("home");
        }}
        onBecomeAgent={() => setTab("become-agent")}
        profileCompletion={profileCompletion}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header Bar for Mobile Screens (lg:hidden) */}
        <header className="lg:hidden bg-white border-b border-gray-100 shrink-0 px-4 py-3 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer outline-none border-none bg-transparent"
              aria-label="Toggle Navigation Menu"
              title="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className="flex items-center gap-2">
              <img src="/fipmoney_logo_final.png" alt="FipMoney Logo" className="h-8 w-auto object-contain" />
              <span className="font-black text-slate-900 text-sm tracking-tight">Fipmoney</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowNotifications(prev => !prev)}
              className="relative border w-9 h-9 rounded-full flex items-center justify-center shadow-2xs bg-white border-gray-200 text-gray-600 cursor-pointer outline-none"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white font-bold flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <div
              onClick={() => setTab("settings")}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center font-black text-xs uppercase overflow-hidden relative cursor-pointer shadow-2xs border border-gray-100"
            >
              <span>{(userName || "U").charAt(0)}</span>
              {userAvatar && (
                <img src={userAvatar} alt={userName} className="absolute inset-0 w-full h-full object-cover" />
              )}
            </div>
          </div>
        </header>
        {tab === "home" ? (
          <MainDashboard />
        ) : tab === "portfolio" ? (
          <PortfolioPage onNavigate={(target) => setTab(target as Tab)} />
        ) : tab === "bills" ? (
          <BillsPage onNavigate={onNavigate} />
        ) : tab === "settings" ? (
          <SettingsPage />
        ) : tab === "sip" ? (
          <DigitalGoldSilver onNavigate={(target) => setTab(target as Tab)} kycStatus={kycStatus} />
        ) : tab === "savings" ? (
          <SavingsPage onNavigate={(target) => setTab(target as Tab)} />
        ) : tab === "history" ? (
          <HistoryPage />
        ) : tab === "help" ? (
          <HelpSupportPage />
        ) : tab === "notifications" ? (
          <NotificationsPage />
        ) : ["banking", "offers"].includes(tab) ? (
          <ComingSoon tab={tab} />
        ) : tab === "become-agent" ? (
          <BecomeAgentPage />
        ) : tab === "refer-and-earn" ? (
          <ReferAndEarn onNavigate={(target) => setTab(target as Tab)} />
        ) : tab === "terms" ? (
          <TermsAndConditions onBack={() => setTab("refer-and-earn")} />
        ) : tab === "referral-terms" ? (
          <ReferralTermsAndConditions onBack={() => setTab("refer-and-earn")} />
        ) : (
          <MainDashboard />
        )}
      </div>
      <MobileNav activeTab={tab} onTabChange={setTab} profileCompletion={profileCompletion} />

      {/* Missing Email Modal Popup */}
      <AnimatePresence>
        {showEmailMissingModal && !hasValidEmail && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEmailMissingModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-purple-200 z-10 space-y-5 text-center"
            >
              <button
                onClick={() => setShowEmailMissingModal(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="w-16 h-16 rounded-3xl bg-purple-100 text-[#7C3AED] flex items-center justify-center mx-auto shadow-md shadow-purple-500/10">
                <FileText size={32} />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-slate-900">Add Official Email Address ✉️</h3>
                <p className="text-xs font-semibold text-slate-500 max-w-xs mx-auto leading-relaxed">
                  To protect your 24K digital gold locker, receive transaction invoices, purchase receipts, and security OTPs, please add & verify your email address.
                </p>
              </div>

              <div className="bg-purple-50/80 border border-purple-200 p-3.5 rounded-2xl text-left flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-purple-950">Email Invoice Delivery</div>
                  <div className="text-[10px] font-semibold text-purple-700">Official GST invoices sent directly to your verified inbox</div>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setShowEmailMissingModal(false);
                    if (typeof window !== 'undefined') {
                      sessionStorage.setItem("fm_highlight_email", "true");
                    }
                    setTab("settings");
                  }}
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-[#FFF] font-black text-xs py-3.5 rounded-xl shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer border-none outline-none"
                >
                  <User size={16} />
                  <span>Go to Profile & Add Email</span>
                  <ChevronRight size={16} />
                </button>

                <button
                  onClick={() => setShowEmailMissingModal(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer border-none outline-none"
                >
                  Remind Me Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Agent Modal Popup */}
      <AnimatePresence>
        {showAgentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAgentModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200/60 z-10 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1e1b4b] via-[#2a2468] to-[#1e1b4b] text-white p-6 relative">
                <button
                  onClick={() => {
                    setShowAgentModal(false);
                    if (tab === "become-agent") setTab("home");
                  }}
                  className="absolute right-5 top-5 text-indigo-200 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors border-none cursor-pointer outline-none"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0 font-black">
                    <Award size={26} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-extrabold tracking-tight text-white">Become a Digital Gold Agent</h3>
                      <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">DGA</span>
                    </div>
                    <p className="text-xs text-indigo-200 font-medium mt-0.5">
                      Earn lifetime commissions & exclusive rewards with FipMoney
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto hide-scrollbar space-y-6">
                {!agentFormSubmitted ? (
                  <>
                    {/* Benefits Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-amber-50/70 border border-amber-200/60 p-3.5 rounded-2xl">
                        <div className="text-amber-700 font-extrabold text-xs mb-1">💰 High Commissions</div>
                        <div className="text-[11px] text-gray-600 font-medium">Earn up to 2.5% on every purchase & SIP in your network.</div>
                      </div>
                      <div className="bg-purple-50/70 border border-purple-200/60 p-3.5 rounded-2xl">
                        <div className="text-purple-700 font-extrabold text-xs mb-1">🏆 Gold Rewards</div>
                        <div className="text-[11px] text-gray-600 font-medium">Unlock 24K Gold coins & milestone tech gifts monthly.</div>
                      </div>
                      <div className="bg-blue-50/70 border border-blue-200/60 p-3.5 rounded-2xl">
                        <div className="text-blue-700 font-extrabold text-xs mb-1">📊 Agent Dashboard</div>
                        <div className="text-[11px] text-gray-600 font-medium">Track clients, live volume & instant bank payouts.</div>
                      </div>
                      <div className="bg-emerald-50/70 border border-emerald-200/60 p-3.5 rounded-2xl">
                        <div className="text-emerald-700 font-extrabold text-xs mb-1">🛡️ Free Training</div>
                        <div className="text-[11px] text-gray-600 font-medium">Dedicated relationship manager & free DGA certification.</div>
                      </div>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleAgentSubmit} className="space-y-4 pt-2">
                      <h4 className="text-sm font-bold text-gray-900">Agent Application Details</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            required
                            placeholder="Enter your full name"
                            value={agentFormData.name || userName}
                            onChange={(e) => setAgentFormData({ ...agentFormData, name: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-amber-400 bg-gray-50/50"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number</label>
                            <input
                              type="tel"
                              required
                              placeholder="Mobile number"
                              value={agentFormData.phone}
                              onChange={(e) => setAgentFormData({ ...agentFormData, phone: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-amber-400 bg-gray-50/50"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">City / Location</label>
                            <input
                              type="text"
                              required
                              placeholder="Your City"
                              value={agentFormData.city}
                              onChange={(e) => setAgentFormData({ ...agentFormData, city: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-amber-400 bg-gray-50/50"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingAgent}
                        className="w-full py-3 rounded-2xl font-black text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 transition-all shadow-md shadow-amber-500/20 border-none cursor-pointer outline-none active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        {isSubmittingAgent ? (
                          <span>Submitting Application...</span>
                        ) : (
                          <>
                            <span>Submit DGA Application</span>
                            <ChevronRight size={16} strokeWidth={3} />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 size={36} />
                    </div>
                    <div>
                      <h4 className="text-xl font-extrabold text-gray-900">Application Submitted! 🎉</h4>
                      <p className="text-xs text-gray-600 font-medium max-w-md mx-auto mt-1">
                        Thank you for applying to become a FipMoney Digital Gold Agent (DGA). Our onboard team will review your profile and contact you within 24 hours.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowAgentModal(false);
                        setAgentFormSubmitted(false);
                        if (tab === "become-agent") setTab("home");
                      }}
                      className="px-6 py-2.5 bg-[#1e1b4b] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer border-none outline-none"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Agent Access OTP Modal */}
      <AgentOtpModal
        mobileNumber={loggedInMobile || loggedInUser?.mobileNumber}
        isOpen={showAgentOtpModal}
        onClose={() => setShowAgentOtpModal(false)}
        onSuccess={() => {
          setShowAgentOtpModal(false);
          onNavigate('agent-dashboard');
        }}
      />
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
