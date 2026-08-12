"use client";
// Notification drawer updated

import { useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/apiConfig";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet, Zap, Eye, Send, Plus, CreditCard, ChevronRight,
  Shield, CheckCircle2, TrendingUp, ArrowUpRight, ArrowDownRight,
  Smartphone, MonitorPlay, GraduationCap, Gift, Play, Flame, Tv, Wifi, Droplets, Car, FileText, Home, AlertCircle,
  Search, Bell, ChevronDown, Check, Building, RefreshCw, Grid, Award, Download, Clock, X, CheckCheck, Coins
} from "lucide-react";
import { Sidebar, MobileNav, Tab } from "./Navigation";
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
import SavingsPage from "./SavingsPage";
import BecomeAgentPage from "./BecomeAgentPage";
import { clearUserSession, getLoggedInUser } from "../utils/userStorage";
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

  // Agent Modal state
  const [showAgentModal, setShowAgentModal] = useState(false);
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
  const [userAvatar, setUserAvatar] = useState((typeof window !== 'undefined' && localStorage.getItem(`fm_user_avatar_${loggedInMobile}`)) || "https://i.pravatar.cc/150?img=11");
  const [kycStatus, setKycStatus] = useState(loggedInUser?.isKycCompleted ? "full kyc" : "pending");

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
        .then(res => res.json())
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
        .catch(err => console.warn("Failed to fetch user details:", err));

      // Fetch dashboard data for premium card
      fetch(`${API_BASE_URL}/users/dashboard?mobile=${loggedInMobile}`)
        .then(res => res.json())
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
        .catch(err => console.warn("Failed to fetch dashboard data:", err))
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
    <div className="flex-1 h-screen overflow-y-auto overflow-x-hidden bg-[#fcfdfd] flex flex-col">
       {/* Top Bar */}
       <div className="h-[72px] border-b border-gray-100 flex items-center justify-between px-6 md:px-8 shrink-0 bg-white sticky top-0 z-20">
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
               <img src={userAvatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-gray-100" />
               <div className="flex flex-col hidden sm:flex">
                 <span className="text-[11px] text-gray-500 font-medium">Welcome back,</span>
                 <div className="flex items-center gap-1"><span className="text-sm font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{userName}</span> <ChevronDown size={14} className="text-gray-400" /></div>
               </div>
            </div>
         </div>
       </div>

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
                    Become a Digital Gold Agent (DGA) Today!
                  </h3>
                  <span className="bg-amber-100/90 text-amber-800 border border-amber-300/80 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    New
                  </span>
                </div>
                <p className="text-slate-600 text-xs sm:text-[13px] font-semibold mt-0.5">
                  Earn high commissions, exclusive rewards and unlock a world of benefits.
                </p>
              </div>
            </div>

            {/* Right Actions & Badge */}
            <div className="flex items-center gap-3 relative z-10 shrink-0 self-start md:self-center">
              <button
                onClick={() => setTab("become-agent")}
                className="px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm text-amber-900 bg-white/90 hover:bg-white border border-amber-300/80 hover:border-amber-400 transition-all shadow-xs cursor-pointer outline-none"
              >
                Learn More
              </button>
              <button
                onClick={() => setTab("become-agent")}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl font-black text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 transition-all shadow-md shadow-amber-500/20 hover:shadow-lg flex items-center gap-1.5 cursor-pointer outline-none active:scale-[0.98]"
              >
                <span>Become an Agent</span>
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

       <div className="flex-1 p-6 lg:p-8 flex flex-col lg:flex-row gap-8 pb-24 lg:pb-10 max-w-[1600px] mx-auto w-full">
         
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
            
            {/* Premium Card Component */}
            <div style={{ perspective: 1000 }}>
              <motion.div 
                className="w-full aspect-[1.586/1] relative cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                 {/* FRONT */}
                 <div className="absolute inset-0 rounded-[24px] p-6 text-white shadow-[0_10px_30px_rgba(30,27,75,0.15)] flex flex-col justify-between overflow-hidden" 
                      style={{ backfaceVisibility: "hidden", background: '#1e1b4b' }}>
                    {/* Pattern overlay */}
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, #4c1d95 2px, transparent 2px)', backgroundSize: '12px 12px' }} />
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/30 blur-3xl rounded-full pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-600/30 blur-3xl rounded-full pointer-events-none" />
                    
                    {isLoadingCard && (
                      <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-xl bg-[#1e1b4b]/50">
                        <div className="text-center animate-pulse">
                          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                          <p className="text-sm font-bold text-white tracking-wide">Card Details Loading...!</p>
                        </div>
                      </div>
                    )}

                    <div className="relative z-10 flex justify-between items-center">
                       <span className="font-bold text-sm tracking-wide">Fipmoney Premium</span>
                       <div className="flex items-center gap-2">
                         <button 
                           onClick={(e) => { e.stopPropagation(); setShowCardDetails(!showCardDetails); }} 
                           className="bg-white/10 p-1.5 rounded-md text-indigo-200 hover:text-white border border-transparent hover:border-white/20 cursor-pointer backdrop-blur-sm transition-colors outline-none"
                         >
                           <Eye size={14} />
                         </button>
                         <span className="bg-white/10 px-2.5 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm border border-white/10">Virtual Card</span>
                       </div>
                    </div>
                    
                    <div className="relative z-10 mb-2 mt-auto">
                       <div className="w-[42px] h-[30px] rounded-[4px] bg-gradient-to-br from-[#fde047] via-[#eab308] to-[#a16207] mb-5 relative overflow-hidden shadow-sm border border-yellow-300/50">
                          <div className="absolute inset-x-0 h-[1px] top-[40%] bg-yellow-700/40" />
                          <div className="absolute inset-x-0 h-[1px] top-[60%] bg-yellow-700/40" />
                          <div className="absolute inset-y-0 w-[1px] left-[35%] bg-yellow-700/40" />
                          <div className="absolute inset-y-0 w-[1px] left-[65%] bg-yellow-700/40" />
                       </div>
                       <div className="font-mono text-[22px] tracking-[0.15em] mb-1 opacity-90 drop-shadow-md">
                         {showCardDetails ? (virtualCard ? virtualCard.cardNumber.replace(/(.{4})/g, '$1 ').trim() : "**** **** **** ****") : (virtualCard ? "**** **** **** " + virtualCard.cardNumber.slice(-4) : "**** **** **** ****")}
                       </div>
                    </div>
                    
                    <div className="relative z-10 flex justify-between items-end">
                       <div>
                         <div className="text-[8px] text-indigo-200 uppercase tracking-wider mb-1 font-semibold">Card Holder</div>
                         <div className="text-[13px] font-bold tracking-wide uppercase">{virtualCard ? virtualCard.nameOnCard : ""}</div>
                       </div>
                       <div className="text-right">
                         <div className="text-[8px] text-indigo-200 uppercase tracking-wider mb-1 font-semibold">Expires</div>
                         <div className="text-[13px] font-bold tracking-wide">{virtualCard ? virtualCard.expiry : "**/**"}</div>
                       </div>
                       <Wifi className="rotate-90 opacity-60 ml-2 mb-1" size={24} />
                    </div>
                 </div>

                 {/* BACK */}
                 <div className="absolute inset-0 rounded-[24px] shadow-[0_10px_30px_rgba(30,27,75,0.15)] flex flex-col text-white overflow-hidden"
                      style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: '#1e1b4b' }}>
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, #4c1d95 2px, transparent 2px)', backgroundSize: '12px 12px' }} />
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/30 blur-3xl rounded-full pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-600/30 blur-3xl rounded-full pointer-events-none" />
                    
                    {isLoadingCard && (
                      <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-xl bg-[#1e1b4b]/50">
                        <div className="text-center animate-pulse">
                          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                          <p className="text-sm font-bold text-white tracking-wide">Card Details Loading...!</p>
                        </div>
                      </div>
                    )}

                    <div className="w-full h-12 bg-black/85 relative z-10 mt-6 shadow-md" />
                    
                    <div className="px-6 mt-5 relative z-10 flex flex-col gap-1.5">
                      <div className="text-[8px] uppercase tracking-wider opacity-80 text-indigo-200">Authorized Signature</div>
                      <div className="w-full h-10 bg-white/95 flex items-center justify-between px-3 text-black font-mono rounded-sm shadow-inner relative overflow-hidden">
                         <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 1px, transparent 10px)" }} />
                         <span className="relative z-10 font-bold italic text-gray-700 text-[13px] tracking-wide">{virtualCard ? virtualCard.nameOnCard : ""}</span>
                         <span className="relative z-10 font-bold bg-amber-500 text-white px-2 py-0.5 rounded shadow-sm text-[12px] font-mono tracking-wider">
                           {virtualCard ? virtualCard.cvv : "***"}
                         </span>
                      </div>
                    </div>
                    
                    <div className="px-6 pb-6 relative z-10 flex justify-between items-end mt-auto">
                      <div className="max-w-[70%]">
                        <p className="text-[7px] opacity-70 leading-relaxed text-indigo-100">
                          This card is issued by Fipmoney strictly for authorized use. It remains the property of Fipmoney. If found, please return to Fipmoney.
                        </p>
                      </div>
                      <div className="flex flex-col items-end opacity-95">
                        <span className="text-xs font-extrabold italic tracking-tight mb-0.5">Fipmoney</span>
                        <span className="text-[8px] font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded border border-white/10">Virtual Card</span>
                      </div>
                    </div>
                 </div>
              </motion.div>
            </div>
            
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
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
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
