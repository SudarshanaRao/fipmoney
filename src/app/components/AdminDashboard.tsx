"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  LayoutDashboard, FileText, TrendingUp, Coins, CreditCard, Clock, Users,
  CheckCircle2, Share2, BarChart3, Building2, Percent, Bell, Settings,
  UserCheck, Activity, Search, Calendar, Download, ArrowUpRight, ShieldCheck,
  Headphones, ChevronRight, RefreshCw, LogOut, ArrowRight, Eye, ShieldAlert, X,
  Plus, Edit2, Edit3, Trash2, Check, AlertCircle, Filter, Lock, Unlock, Send, Sliders,
  DollarSign, CheckCircle, XCircle, FileSpreadsheet, Layers, Shield, Sparkles, AlertTriangle,
  Award, Zap, ShieldQuestion, CheckSquare, Save, Mail, Smartphone, Monitor, Maximize2, Minimize2, ExternalLink, Receipt
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
  getCurrentAdmin, clearAdminSession, getStoredAdmins, getAuditLogs,
  addAuditLog, createAdminUserWithCode, AdminUser, AuditLog
} from "../utils/adminStorage";
import fipMoneyLogo from "../../imports/fipmoney_logo_final.png";
import fipmoneyIcon from "../../imports/fipmoney_icon_square.png";
import { LoadingSpinner } from "./LottiePlayer";
import { API_BASE_URL } from "../utils/apiConfig";

const getDynamicVariableDefaults = (): Record<string, string> => {
  const baseDomain = (typeof window !== 'undefined' && window.location && window.location.origin)
    ? window.location.origin.replace(/\/+$/, '')
    : 'https://www.fipmoney.com';

  return {
    baseUrl: baseDomain,
    FIPMONEY_LOGO_URL: `${baseDomain}/fipmoney_logo_final.png`,
    HELLO_RAFIKI_ANIMATION_URL: `${baseDomain}/fipmoney-welcome-hello-rafiki.gif`,
    SECURE_LOGIN_ANIMATION_URL: `${baseDomain}/secure_login.gif`,
    MOBILE_ENCRYPTION_ANIMATION_URL: `${baseDomain}/mobile_encryption.gif`,
    KYC_SUBMITTED_ANIMATION_URL: `${baseDomain}/documents.gif`,
    WALLET_BRO_ANIMATION_URL: `${baseDomain}/fipmoney-wallet-bro.gif`,
    EWALLET_PANA_ANIMATION_URL: `${baseDomain}/fipmoney-ewallet-pana.gif`,
    DIGITAL_GOLD_ILLUSTRATION_URL: `${baseDomain}/hero_banner_digital_gold.png`,
    DIGITAL_SILVER_ILLUSTRATION_URL: `${baseDomain}/hero_banner_digital_silver.png`,
    MANAGE_MONEY_AMICO_ANIMATION_URL: `${baseDomain}/fipmoney-manage-money-amico.gif`,
    GROWTH_ANALYTICS_AMICO_ANIMATION_URL: `${baseDomain}/fipmoney-growth-analytics-amico.gif`,
    DGA_URL: `${baseDomain}/become-agent`,
    KYC_FAILED_ANIMATION_URL: `${baseDomain}/failed.gif`,
    ACCOUNT_DEACTIVATION_ANIMATION_URL: `${baseDomain}/mobile_login.gif`,
    FIPMONEY_DASHBOARD_URL: `${baseDomain}/dashboard`,
    FIPMONEY_HOME_URL: `${baseDomain}/`,
    FIPMONEY_ABOUT_URL: `${baseDomain}/about`,
    FIPMONEY_CONTACT_URL: `${baseDomain}/contact`,
    FIPMONEY_FAQ_URL: `${baseDomain}/faq`,
    FIPMONEY_TERMS_URL: `${baseDomain}/terms-and-conditions`,
    FIPMONEY_PRIVACY_URL: `${baseDomain}/privacy-policy`,
    supportEmail: "support@fipmoney.com",
    currentYear: String(new Date().getFullYear()),
  };
};

const extractVariablesFromText = (text: string): string[] => {
  if (!text) return [];
  const matches = text.match(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g);
  if (!matches) return [];
  const set = new Set<string>();
  matches.forEach(m => {
    const clean = m.replace(/[{}]/g, '').trim();
    if (clean) set.add(clean);
  });
  return Array.from(set);
};

interface AdminDashboardProps {
  secretCode?: string;
  onBackToMainSite: () => void;
}

// Chart Data: Investments Overview
const overviewChartData = [
  { date: '08 May', val: 0.2 },
  { date: '11 May', val: 0.4 },
  { date: '15 May', val: 0.65 },
  { date: '18 May', val: 0.8 },
  { date: '22 May', val: 1.1 },
  { date: '25 May', val: 1.25 },
  { date: '29 May', val: 1.05 },
  { date: '01 Jun', val: 1.35 },
  { date: '05 Jun', val: 1.2 },
  { date: '08 Jun', val: 1.45 }
];

// Donut Chart Data: Investments by Plan
const planDistributionData = [
  { name: 'Daily Savings', value: 4231, percentage: '33.9%', color: '#7C3AED' },
  { name: 'Weekly Savings', value: 3452, percentage: '27.7%', color: '#10B981' },
  { name: 'Monthly Savings', value: 3102, percentage: '24.9%', color: '#F97316' },
  { name: 'Wealth Builder', value: 1673, percentage: '13.5%', color: '#F59E0B' }
];

// Donut Chart Data: User KYC Status
const kycStatusData = [
  { name: 'Verified', value: 6352, percentage: '72.8%', color: '#10B981' },
  { name: 'Pending', value: 1542, percentage: '17.7%', color: '#3B82F6' },
  { name: 'Rejected', value: 838, percentage: '9.6%', color: '#EF4444' }
];

// AML Audit Score Helper: Converts numeric score (0-100) to Risk Badge Properties
export const getAmlScoreDetails = (score: number) => {
  if (score >= 80) {
    return {
      label: "Low Risk",
      badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-300",
      pillBg: "bg-emerald-600 text-white",
      description: "Highly trusted account, low risk transaction behavior."
    };
  } else if (score >= 50) {
    return {
      label: "Moderate Risk",
      badgeBg: "bg-amber-100 text-amber-800 border-amber-300",
      pillBg: "bg-amber-600 text-white",
      description: "Standard account, moderate verification required."
    };
  } else {
    return {
      label: "High Risk / Flagged",
      badgeBg: "bg-red-100 text-red-800 border-red-300",
      pillBg: "bg-red-600 text-white",
      description: "High risk profile, flagged for AML audit & manual review."
    };
  }
};

export const getAmtScoreDetails = getAmlScoreDetails;

const INITIAL_SIP_PLANS = [
  { id: "SIP-101", name: "Daily Savings Plan", minAmount: 10, category: "Daily Micro-SIP", activeUsers: 4231, totalInvested: "₹4.23 Cr", goldGram: "1.125 kg", returnsRate: "9.32%", status: "Active", description: "Invest small amounts daily starting at just ₹10 into 24K 99.9% pure gold." },
  { id: "SIP-102", name: "Weekly Savings Plan", minAmount: 100, category: "Weekly SIP", activeUsers: 3452, totalInvested: "₹3.15 Cr", goldGram: "0.845 kg", returnsRate: "8.11%", status: "Active", description: "Automated weekly purchases of physical gold with zero locker fees." },
  { id: "SIP-103", name: "Monthly Savings Plan", minAmount: 500, category: "Monthly SIP", activeUsers: 3102, totalInvested: "₹3.45 Cr", goldGram: "0.812 kg", returnsRate: "7.45%", status: "Active", description: "Disciplined monthly gold wealth builder with compound yield growth." },
  { id: "SIP-104", name: "Wealth Builder Plan", minAmount: 1000, category: "Long-term Wealth", activeUsers: 1673, totalInvested: "₹1.62 Cr", goldGram: "0.370 kg", returnsRate: "8.21%", status: "Active", description: "High-yield long-term gold accumulation plan with bonus gold rewards." },
  { id: "SIP-105", name: "Gold Accumulator Special", minAmount: 2500, category: "High Networth", activeUsers: 840, totalInvested: "₹1.10 Cr", goldGram: "0.280 kg", returnsRate: "10.15%", status: "Active", description: "Premium Gold SIP for HNI investors backed by certified Swiss vault storage." },
];

const INITIAL_USERS: any[] = [];

const INITIAL_INVESTMENTS = [
  { id: "INV-8891", userId: "USR-7712", userName: "Rohan Verma", userPhone: "+91 98112 34567", planName: "Daily Savings Plan", amount: "₹100 / day", totalGold: "12.450 g", totalValue: "₹97,732", startDate: "2025-01-12", autoPay: "Active", status: "Active", amtScore: 98 },
  { id: "INV-8892", userId: "USR-7711", userName: "Priya Sharma", userPhone: "+91 98765 12345", planName: "Weekly Savings Plan", amount: "₹500 / wk", totalGold: "8.120 g", totalValue: "₹63,742", startDate: "2025-02-01", autoPay: "Active", status: "Active", amtScore: 92 },
  { id: "INV-8893", userId: "USR-7709", userName: "Amit Kumar", userPhone: "+91 99887 76655", planName: "Monthly Savings Plan", amount: "₹2,500 / mo", totalGold: "24.800 g", totalValue: "₹1,94,680", startDate: "2024-11-15", autoPay: "Paused", status: "Paused", amtScore: 85 },
  { id: "INV-8894", userId: "USR-7707", userName: "Sunita Joshi", userPhone: "+91 94111 22334", planName: "Wealth Builder Plan", amount: "₹5,000 / mo", totalGold: "48.250 g", totalValue: "₹3,78,762", startDate: "2024-08-20", autoPay: "Active", status: "Active", amtScore: 88 },
  { id: "INV-8895", userId: "USR-7708", userName: "Deepak Mehra", userPhone: "+91 95001 23456", planName: "Daily Savings Plan", amount: "₹50 / day", totalGold: "5.600 g", totalValue: "₹43,960", startDate: "2025-03-04", autoPay: "Active", status: "Paused", amtScore: 34 },
];

const INITIAL_TRANSACTIONS = [
  { id: "TXN-90412", userName: "Rohan Verma", type: "Auto-SIP Deposit", amount: "₹100", goldPurchased: "0.0127 g", gateway: "Razorpay (UPI)", refId: "pay_Pk91283a", date: "2026-08-08 14:22", status: "Success", amtScore: 98 },
  { id: "TXN-90411", userName: "Priya Sharma", type: "Manual Gold Buy", amount: "₹2,500", goldPurchased: "0.3184 g", gateway: "PhonePe", refId: "pay_Pk91280b", date: "2026-08-08 13:45", status: "Success", amtScore: 92 },
  { id: "TXN-90410", userName: "Amit Kumar", type: "Cash Redemption", amount: "₹19,250", goldPurchased: "-2.450 g", gateway: "ICICI Bank Payout", refId: "pout_912800", date: "2026-08-08 11:10", status: "Pending", amtScore: 85 },
  { id: "TXN-90409", userName: "Neha Singh", type: "Referral Bonus", amount: "₹100", goldPurchased: "0.0127 g", gateway: "Internal Reward Vault", refId: "rew_881920", date: "2026-08-08 09:30", status: "Success", amtScore: 90 },
  { id: "TXN-90408", userName: "Deepak Mehra", type: "Auto-SIP Deposit", amount: "₹500", goldPurchased: "0.0000 g", gateway: "Paytm UPI", refId: "pay_Pk91255z", date: "2026-08-08 08:15", status: "Failed", amtScore: 34 },
];

const INITIAL_KYC_REQUESTS: any[] = [];

const INITIAL_PAYOUTS = [
  { id: "POUT-5012", userId: "USR-7709", userName: "Amit Kumar", type: "Cash Bank Payout", amount: "₹19,250", goldGrams: "2.450 g", bankDetails: "HDFC Bank (A/C: ****4892)", requestedDate: "2026-08-08 11:10", status: "Pending", amtScore: 85 },
  { id: "POUT-5011", userId: "USR-7707", userName: "Sunita Joshi", type: "Physical Gold Coin Delivery", amount: "5.000 g Coin", goldGrams: "5.000 g", bankDetails: "Delivery to Mumbai Address", requestedDate: "2026-08-08 09:15", status: "Pending", amtScore: 88 },
  { id: "POUT-5010", userId: "USR-7712", userName: "Rohan Verma", type: "Cash Bank Payout", amount: "₹45,230", goldGrams: "5.760 g", bankDetails: "SBI (A/C: ****1029)", requestedDate: "2026-08-07 18:40", status: "Approved", amtScore: 98 },
];

const INITIAL_REFERRALS = [
  { id: "REF-201", referrer: "Rohan Verma", referee: "Vikas Sharma", code: "ROHAN100", reward: "₹100 Gold", date: "2026-08-08", status: "Credited", amtScore: 98 },
  { id: "REF-202", referrer: "Priya Sharma", referee: "Anjali Gupta", code: "PRIYA50", reward: "₹100 Gold", date: "2026-08-07", status: "Credited", amtScore: 92 },
  { id: "REF-203", referrer: "Deepak Mehra", referee: "Fake Account", code: "DEEPAK10", reward: "₹100 Gold", date: "2026-08-07", status: "Flagged Fraud", amtScore: 34 },
];

export default function AdminDashboard({ secretCode = "2787", onBackToMainSite }: AdminDashboardProps) {
  const currentAdmin = getCurrentAdmin() || {
    id: "ADM-001",
    name: "Admin User",
    email: "admin@fipmoney.com",
    mobile: "+91 98765 43210",
    secretCode: secretCode,
    role: "Super Admin" as const,
    createdAt: "2025-01-01",
    status: "Active" as const,
    lastLogin: new Date().toLocaleString(),
    permissions: ["all"]
  };

  // Tab Slug Mapping for URL Syncing & Page Refreshes
  const navToSlugMap: Record<string, string> = React.useMemo(() => ({
    "Dashboard": "dashboard",
    "SIP Plans": "sip-plans",
    "Investments": "investments",
    "Gold Holdings": "gold-holdings",
    "Payouts & Redemptions": "payouts",
    "Transactions": "transactions",
    "Users": "users",
    "KYC Verification": "kyc",
    "Referrals": "referrals",
    "DGA Waitlist": "dga-waitlist",
    "Reports & Analytics": "reports",
    "BBPS & Recharges": "bbps",
    "Ledger & Settlements": "ledger",
    "Fees & Charges": "fees",
    "Notifications": "notifications",
    "Email Marketing": "email-marketing",
    "Email Templates": "email-templates",
    "System Settings": "settings",
    "Admin Users": "admin-users"
  }), []);

  const slugToNavMap: Record<string, string> = React.useMemo(() =>
    Object.fromEntries(Object.entries(navToSlugMap).map(([k, v]) => [v, k])),
    [navToSlugMap]);

  const getInitialAdminTab = (): string => {
    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/').filter(Boolean);
      // e.g. ["admin", "2003", "sip-plans"]
      if (parts.length >= 3) {
        const tabSlug = parts[2];
        if (slugToNavMap[tabSlug]) return slugToNavMap[tabSlug];
      }
      const saved = sessionStorage.getItem("fm_admin_active_nav");
      if (saved) return saved;
    }
    return "Dashboard";
  };

  // State Management for Active Section and Data Tables
  const [activeNav, setActiveNavState] = useState<string>(() => getInitialAdminTab());
  const [auditLogsList, setAuditLogsList] = useState<AuditLog[]>(() => getAuditLogs());
  const [adminsList, setAdminsList] = useState<AdminUser[]>(() => getStoredAdmins());
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const setActiveNav = (navId: string) => {
    setActiveNavState(navId);
    sessionStorage.setItem("fm_admin_active_nav", navId);
    const slug = navToSlugMap[navId] || "dashboard";
    const newUrl = `/admin/${currentAdmin.secretCode}/${slug}`;
    if (typeof window !== 'undefined' && window.location.pathname !== newUrl) {
      window.history.pushState({ tab: navId }, '', newUrl);
    }
  };

  React.useEffect(() => {
    const handlePopState = () => {
      const parts = window.location.pathname.split('/').filter(Boolean);
      if (parts.length >= 3) {
        const tabSlug = parts[2];
        if (slugToNavMap[tabSlug]) {
          setActiveNavState(slugToNavMap[tabSlug]);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [slugToNavMap]);

  // Dynamic Content Data States with AMT Security Scores
  const [sipPlans, setSipPlans] = useState(INITIAL_SIP_PLANS);
  const [investments, setInvestments] = useState(INITIAL_INVESTMENTS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [kycRequests, setKycRequests] = useState(INITIAL_KYC_REQUESTS);
  const [payouts, setPayouts] = useState(INITIAL_PAYOUTS);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);

  // REFERRALS DYNAMIC STATES & HANDLERS
  const [referrals, setReferrals] = useState<any[]>([]);
  const [referralStats, setReferralStats] = useState<any>({
    totalBonusDistributed: "₹0",
    totalActiveAdvocates: "0 Users",
    conversionRate: "0.0%",
    totalReferrals: 0,
    flaggedFraudCount: 0
  });
  const [isLoadingReferrals, setIsLoadingReferrals] = useState<boolean>(true);
  const [referralSearchQuery, setReferralSearchQuery] = useState<string>("");
  const [referralStatusFilter, setReferralStatusFilter] = useState<string>("All");

  const fetchAdminReferrals = async () => {
    setIsLoadingReferrals(true);
    try {
      let res = await fetch(`${API_BASE_URL}/referrals/admin/all`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setReferrals(json.data);
        }
      }
    } catch (err) {
      console.error('[AdminDashboard] Error fetching referrals:', err);
    } finally {
      setIsLoadingReferrals(false);
    }
  };

  const fetchAdminReferralStats = async () => {
    try {
      let res = await fetch(`${API_BASE_URL}/referrals/admin/stats`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setReferralStats(json.data);
        }
      }
    } catch (err) {
      console.error('[AdminDashboard] Error fetching referral stats:', err);
    }
  };

  // DGA WAITLIST STATES & HANDLERS
  const [dgaWaitlistList, setDgaWaitlistList] = useState<any[]>([]);
  const [isLoadingDgaWaitlist, setIsLoadingDgaWaitlist] = useState<boolean>(true);
  const [selectedDgaIds, setSelectedDgaIds] = useState<string[]>([]);
  const [dgaStatusFilter, setDgaStatusFilter] = useState<string>("All");

  const fetchDgaWaitlist = async () => {
    setIsLoadingDgaWaitlist(true);
    try {
      let res = await fetch(`${API_BASE_URL}/agent-waitlist/admin/all`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setDgaWaitlistList(json.data);
        }
      }
    } catch (err) {
      console.error('[AdminDashboard] Error fetching DGA waitlist:', err);
    } finally {
      setIsLoadingDgaWaitlist(false);
    }
  };

  const fetchKycRequests = async () => {
    try {
      let res = await fetch(`${API_BASE_URL}/kyc/admin/all`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setKycRequests(json.data);
        }
      }
    } catch (err) {
      console.error('[AdminDashboard] Error fetching KYC requests:', err);
    }
  };

  // DASHBOARD TELEMETRY SUMMARY DYNAMIC STATES & HANDLERS
  const [dashboardTelemetry, setDashboardTelemetry] = useState<any>({
    metrics: {
      activeInvestments: { count: 12458, growth: '+8.42% vs last month' },
      totalInvestment: { formattedAmount: '₹12.45 Cr', growth: '+10.21% vs last month' },
      goldAccumulated: { formattedWeight: '3.152 kg', growth: '+7.31% vs last month' },
      returnsGenerated: { formattedAmount: '₹78.45 L', growth: '+9.18% vs last month' },
      avgUserAmtScore: { score: 88.4, maxScore: 100, riskProfile: 'Low Risk Profile' },
    },
    planDistribution: [
      { name: 'Daily Savings', value: 4231, percentage: '33.9%', color: '#7C3AED' },
      { name: 'Weekly Savings', value: 3452, percentage: '27.7%', color: '#10B981' },
      { name: 'Monthly Savings', value: 3102, percentage: '24.9%', color: '#F97316' },
      { name: 'Wealth Builder', value: 1673, percentage: '13.5%', color: '#F59E0B' },
    ],
    kycStatusDistribution: [
      { name: 'Verified', value: 6352, percentage: '72.8%', color: '#10B981' },
      { name: 'Pending', value: 1542, percentage: '17.7%', color: '#3B82F6' },
      { name: 'Rejected', value: 838, percentage: '9.6%', color: '#EF4444' },
    ],
    amtSecurityTelemetry: {
      highRiskCount: 1,
      flaggedUsers: [{ name: 'Deepak Mehra', score: 34, mobile: '+91 95001 23456' }],
    },
    overviewTrend: [
      { date: '08 May', val: 0.2 },
      { date: '11 May', val: 0.4 },
      { date: '15 May', val: 0.65 },
      { date: '18 May', val: 0.8 },
      { date: '22 May', val: 1.1 },
      { date: '25 May', val: 1.25 },
      { date: '29 May', val: 1.05 },
      { date: '01 Jun', val: 1.35 },
      { date: '05 Jun', val: 1.2 },
      { date: '08 Jun', val: 1.45 }
    ],
  });
  const [isLoadingDashboardTelemetry, setIsLoadingDashboardTelemetry] = useState<boolean>(false);

  const fetchDashboardTelemetry = async () => {
    setIsLoadingDashboardTelemetry(true);
    try {
      let res = await fetch(`${API_BASE_URL}/admin/dashboard`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setDashboardTelemetry(json.data);
        }
      }
    } catch (err) {
      console.error('[AdminDashboard] Error fetching dashboard summary telemetry:', err);
    } finally {
      setIsLoadingDashboardTelemetry(false);
    }
  };

  const [isLoadingSipPlans, setIsLoadingSipPlans] = useState<boolean>(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  const fetchSipPlans = async () => {
    setIsLoadingSipPlans(true);
    try {
      let res = await fetch(`${API_BASE_URL}/admin/sip-plans`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setSipPlans(json.data);
        }
      }
    } catch (err) {
      console.error('[AdminDashboard] Error fetching SIP plans:', err);
    } finally {
      setIsLoadingSipPlans(false);
    }
  };

  // BBPS Bills & Recharges State
  interface BbpsTxn {
    _id?: string;
    txnId: string;
    userId: string;
    userName: string;
    userPhone: string;
    billerName: string;
    category: string;
    accountNumber: string;
    amount: number;
    goldCashbackEarned?: number;
    goldCashbackFormatted?: string;
    paymentGateway: string;
    bbpsRefNo: string;
    status: 'Success' | 'Pending' | 'Failed' | 'Refunded';
    createdAt?: string;
    paymentDate?: string;
  }

  const [bbpsTxns, setBbpsTxns] = useState<BbpsTxn[]>([]);
  const [bbpsSummary, setBbpsSummary] = useState<any>({
    totalCount: 0,
    totalVolume: '₹0',
    totalGoldCashback: '0.000 g Gold',
    successRate: '100%',
    npciStatus: 'ONLINE (99.98% Uptime)'
  });
  const [isLoadingBbps, setIsLoadingBbps] = useState<boolean>(false);
  const [bbpsCategoryFilter, setBbpsCategoryFilter] = useState<string>('All');
  const [bbpsStatusFilter, setBbpsStatusFilter] = useState<string>('All');
  const [bbpsSearchQuery, setBbpsSearchQuery] = useState<string>('');
  const [selectedBbpsReceipt, setSelectedBbpsReceipt] = useState<BbpsTxn | null>(null);
  const [showSimulateBbpsModal, setShowSimulateBbpsModal] = useState<boolean>(false);
  const [newBbpsForm, setNewBbpsForm] = useState({
    userName: '',
    userPhone: '',
    billerName: 'Airtel India Prepaid',
    category: 'Mobile Recharge',
    accountNumber: '',
    amount: 349,
    paymentGateway: 'Setu BBPS NPCI',
    status: 'Success'
  });

  const fetchBbpsTransactions = async () => {
    setIsLoadingBbps(true);
    try {
      let res = await fetch(`${API_BASE_URL}/admin/bbps-transactions`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setBbpsTxns(json.data);
          if (json.summary) setBbpsSummary(json.summary);
        }
      }
    } catch (err) {
      console.error('[AdminDashboard] Error fetching BBPS transactions:', err);
    } finally {
      setIsLoadingBbps(false);
    }
  };

  const handleSimulateBbpsTxn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/admin/bbps-transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBbpsForm)
      });
      const json = await res.json();
      if (res.ok && json.success) {
        triggerToast(`BBPS Transaction ${json.data.txnId} processed successfully!`);
        addAuditLog(`Simulated BBPS ${newBbpsForm.category} transaction for ${newBbpsForm.billerName}`, 'BBPS Financials', 'Info');
        setShowSimulateBbpsModal(false);
        setNewBbpsForm({
          userName: '',
          userPhone: '',
          billerName: 'Airtel India Prepaid',
          category: 'Mobile Recharge',
          accountNumber: '',
          amount: 349,
          paymentGateway: 'Setu BBPS NPCI',
          status: 'Success'
        });
        fetchBbpsTransactions();
      } else {
        triggerToast(json.message || 'Failed to simulate BBPS transaction');
      }
    } catch (err) {
      console.error('[AdminDashboard] Error creating BBPS txn:', err);
      triggerToast('Server connection error while creating BBPS transaction');
    }
  };

  const handleUpdateBbpsStatus = async (txnId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/bbps-transactions/${txnId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        triggerToast(`Updated BBPS transaction status to ${newStatus}`);
        addAuditLog(`Updated status of BBPS Txn ${txnId} to ${newStatus}`, 'BBPS Financials', 'Warning');
        fetchBbpsTransactions();
        if (selectedBbpsReceipt && (selectedBbpsReceipt.txnId === txnId || selectedBbpsReceipt._id === txnId)) {
          setSelectedBbpsReceipt({ ...selectedBbpsReceipt, status: newStatus as any });
        }
      } else {
        triggerToast(json.message || 'Failed to update BBPS status');
      }
    } catch (err) {
      console.error('[AdminDashboard] Error updating BBPS status:', err);
      triggerToast('Server connection error while updating status');
    }
  };

  // EMAIL MARKETING & CAMPAIGNS STATES & HANDLERS
  const [emailCampaigns, setEmailCampaigns] = useState<any[]>([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState<boolean>(false);
  const [showCampaignModal, setShowCampaignModal] = useState<boolean>(false);
  const [showZohoConnectModal, setShowZohoConnectModal] = useState<boolean>(false);
  const [zohoKeys, setZohoKeys] = useState({
    clientId: "",
    clientSecret: "",
    dataCenter: "in",
  });
  const [redirectUriInfo, setRedirectUriInfo] = useState({
    redirectUri: typeof window !== "undefined" ? `${window.location.origin}/api/admin/zoho-oauth/callback` : "http://localhost:5000/api/admin/zoho-oauth/callback",
    localRedirectUri: "http://localhost:5000/api/admin/zoho-oauth/callback",
    productionRedirectUri: "https://www.fipmoney.com/api/admin/zoho-oauth/callback",
    isConfigured: false,
  });

  const handleConnectZohoAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zohoKeys.clientId || !zohoKeys.clientSecret) {
      triggerToast("Client ID and Client Secret are required.");
      return;
    }

    try {
      const saveRes = await fetch(`${API_BASE_URL}/admin/zoho-oauth/save-keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(zohoKeys),
      });

      const json = await saveRes.json();
      if (!saveRes.ok || !json.success) {
        triggerToast(json.message || "Failed to save Zoho API keys");
        return;
      }

      // Open Zoho OAuth authorization popup matching Zoho Console configuration
      const targetRedirectUri = "https://dev-server.fipmoney.com/api/admin/zoho-oauth/callback";
      const dcDomain = zohoKeys.dataCenter === "com" || zohoKeys.dataCenter === "us" ? "https://accounts.zoho.com" : "https://accounts.zoho.in";
      const authUrl = `${dcDomain}/oauth/v2/auth?scope=ZohoCampaigns.campaign.ALL,ZohoCampaigns.contact.ALL&client_id=${encodeURIComponent(zohoKeys.clientId.trim())}&response_type=code&access_type=offline&redirect_uri=${encodeURIComponent(targetRedirectUri)}`;

      window.open(authUrl, "ZohoOAuthAuth", "width=600,height=700,scrollbars=yes");
      triggerToast("Opened Zoho Authorization Window! Please approve permissions.");
    } catch (err) {
      console.error("[AdminDashboard] Error connecting Zoho account:", err);
      triggerToast("Server connection error");
    }
  };
  const [campaignForm, setCampaignForm] = useState({
    campaignId: "",
    title: "",
    subject: "",
    category: "Marketing",
    fromEmail: "info@fipmoney.com",
    htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h2 style="color: #6d28d9; margin: 0; font-size: 24px;">Fipmoney Digital Gold</h2>
    <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Instant 24K Gold Savings & SIP</p>
  </div>
  <h3 style="color: #1e293b; font-size: 18px;">Hello {{ userName }},</h3>
  <p style="color: #334155; line-height: 1.6; font-size: 14px;">We are excited to share an exclusive update! Start your 24K Digital Gold SIP on Fipmoney today and earn instant gold rewards directly into your vault.</p>
  <div style="text-align: center; margin: 32px 0;">
    <a href="{{ baseUrl }}" style="background-color: #6d28d9; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; display: inline-block;">Start 24K Gold SIP Now</a>
  </div>
  <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
  <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">Your Referral Code: <strong>{{ referralCode }}</strong> | Need help? Contact {{ supportEmail }}</p>
</div>`,
    targetAudience: "ALL_USERS",
    targetEmailsText: "",
  });
  const [testEmailAddress, setTestEmailAddress] = useState<string>("admin@fipmoney.com");
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [isSendingCampaign, setIsSendingCampaign] = useState<boolean>(false);
  const [previewTab, setPreviewTab] = useState<"editor" | "variables" | "preview">("editor");
  const [isEditorFullscreen, setIsEditorFullscreen] = useState<boolean>(false);
  const [templateVarValues, setTemplateVarValues] = useState<Record<string, string>>({});

  // Auto-detect template variables enclosed in {{ variableName }}
  const detectedVariables = React.useMemo(() => {
    if (!campaignForm.htmlContent) return [];
    const matches = campaignForm.htmlContent.match(/\{\{\s*([a-zA-Z0-9_\-]+)\s*\}\}/g);
    if (!matches) return [];
    const uniqueVars = Array.from(new Set(matches.map(m => m.replace(/[\{\}\s]/g, ''))));
    return uniqueVars;
  }, [campaignForm.htmlContent]);

  const getVarDefaultValue = React.useCallback((varName: string): string => {
    const origin = typeof window !== 'undefined' && window.location && window.location.origin
      ? window.location.origin
      : 'https://www.fipmoney.com';

    const defaults: Record<string, string> = {
      FIPMONEY_HOME_URL: origin,
      FIPMONEY_LOGO_URL: `${origin}/fipmoney_logo_final.png`,
      DGA_HERO_IMAGE_URL: `${origin}/hero_banner_digital_gold.png`,
      DGA_URL: `${origin}/become-agent`,
      FIPMONEY_ABOUT_URL: `${origin}/about`,
      FIPMONEY_CONTACT_URL: `${origin}/contact`,
      FIPMONEY_FAQ_URL: `${origin}/faq`,
      FIPMONEY_TERMS_URL: `${origin}/terms`,
      FIPMONEY_PRIVACY_URL: `${origin}/privacy`,
      currentYear: new Date().getFullYear().toString(),
      supportEmail: 'support@fipmoney.com',
      baseUrl: origin,
      userName: 'Valued User',
      mobileNumber: '+91 98765 43210',
      referralCode: 'FIP2026',
    };

    return defaults[varName] !== undefined ? defaults[varName] : '';
  }, []);

  const renderedHtmlPreview = React.useMemo(() => {
    let html = campaignForm.htmlContent || '';
    detectedVariables.forEach(vName => {
      const val = templateVarValues[vName] !== undefined && templateVarValues[vName] !== ''
        ? templateVarValues[vName]
        : getVarDefaultValue(vName);
      const regex = new RegExp(`\\{\\{\\s*${vName}\\s*\\}\\}`, 'g');
      html = html.replace(regex, val);
    });
    return html;
  }, [campaignForm.htmlContent, detectedVariables, templateVarValues, getVarDefaultValue]);

  const fetchEmailCampaigns = async () => {
    setIsLoadingCampaigns(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/email-campaigns`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setEmailCampaigns(json.data);
        }
      }
    } catch (err) {
      console.error("[AdminDashboard] Error fetching email campaigns:", err);
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  React.useEffect(() => {
    if (activeNav === "Email Marketing") {
      fetchEmailCampaigns();
    }
  }, [activeNav]);

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!window.confirm("Are you sure you want to delete this email campaign?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/email-campaigns/${campaignId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        triggerToast("Campaign deleted successfully!");
        fetchEmailCampaigns();
      } else {
        triggerToast(json.message || "Failed to delete campaign");
      }
    } catch (err) {
      console.error("[AdminDashboard] Error deleting campaign:", err);
      triggerToast("Server error deleting campaign");
    }
  };

  const handleRefreshCampaignStats = async (campaignId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/email-campaigns/${campaignId}/stats`);
      const json = await res.json();
      if (res.ok && json.success) {
        triggerToast("Refreshed live campaign analytics from Zoho Campaigns!");
        fetchEmailCampaigns();
      } else {
        triggerToast(json.message || "Failed to refresh stats");
      }
    } catch (err) {
      console.error("[AdminDashboard] Error refreshing stats:", err);
      triggerToast("Server connection error refreshing stats");
    }
  };

  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignForm.title || !campaignForm.subject || !campaignForm.htmlContent) {
      triggerToast("Title, Subject, and HTML Content are required.");
      return;
    }

    const targetEmails = campaignForm.targetAudience === "SPECIFIC_USERS"
      ? campaignForm.targetEmailsText.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
      : [];

    try {
      const res = await fetch(`${API_BASE_URL}/admin/email-campaigns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: campaignForm.campaignId || undefined,
          title: campaignForm.title,
          subject: campaignForm.subject,
          category: campaignForm.category,
          fromEmail: campaignForm.fromEmail,
          htmlContent: renderedHtmlPreview,
          targetAudience: campaignForm.targetAudience,
          targetEmails,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        triggerToast("Email Campaign saved successfully!");
        setShowCampaignModal(false);
        fetchEmailCampaigns();
      } else {
        triggerToast(json.message || "Failed to save email campaign");
      }
    } catch (err) {
      console.error("[AdminDashboard] Error saving campaign:", err);
      triggerToast("Server error saving campaign");
    }
  };

  const handleSendTestEmail = async (campaignToTest?: any) => {
    const target = campaignToTest || campaignForm;
    if (!testEmailAddress || !target.subject || !target.htmlContent) {
      triggerToast("Please enter a test email address, subject, and content.");
      return;
    }

    setIsSendingTest(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/email-campaigns/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testEmail: testEmailAddress,
          subject: target.subject,
          htmlContent: campaignToTest ? target.htmlContent : renderedHtmlPreview,
          fromEmail: target.fromEmail || "info@fipmoney.com",
          category: target.category || "Marketing",
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        triggerToast(`Test email sent successfully to ${testEmailAddress}!`);
      } else {
        triggerToast(json.message || "Failed to send test email");
      }
    } catch (err) {
      console.error("[AdminDashboard] Error sending test email:", err);
      triggerToast("Server connection error sending test email");
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSendCampaignNow = async (cId: string) => {
    if (!window.confirm("Are you sure you want to broadcast this email campaign to the target audience now?")) return;

    setIsSendingCampaign(true);
    triggerToast("Broadcasting email campaign to target audience...");

    try {
      const res = await fetch(`${API_BASE_URL}/admin/email-campaigns/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId: cId }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        triggerToast(json.message || "Campaign broadcast executed successfully!");
        fetchEmailCampaigns();
      } else {
        triggerToast(json.message || "Failed to broadcast campaign");
      }
    } catch (err) {
      console.error("[AdminDashboard] Error broadcasting campaign:", err);
      triggerToast("Server connection error broadcasting campaign");
    } finally {
      setIsSendingCampaign(false);
    }
  };

  // GOLD HOLDINGS & VAULT TREASURY STATE & API HANDLERS
  interface VaultAuditLog {
    _id?: string;
    auditRefId: string;
    vaultLocation: string;
    custodian: string;
    movementType: string;
    weightKg: number;
    weightFormatted: string;
    purityCert: string;
    auditStatus: 'Verified & Insured' | 'Audited & Verified' | 'Dispatched to Doorstep' | 'Pending Verification';
    createdAt?: string;
  }

  const [liveGoldRate, setLiveGoldRate] = useState<number>(7815.00);
  const [goldHoldingsSummary, setGoldHoldingsSummary] = useState<any>({
    liveGoldRate: 7815.00,
    totalPhysicalVaultGoldKg: "154.850 kg",
    vaultReserveCoverageRatio: "102.4%",
    totalVaultAssetValue: "₹121.02 Cr",
    unallocatedLiquidSurplus: "20.200 kg",
    custodians: [
      { id: "brinks", name: "Brink's Vault Logistics", location: "Mumbai & Delhi Secure Vaults", badge: "Primary Custodian", weight: "92.450 kg", valuation: "₹72.25 Cr" },
      { id: "vistra", name: "Vistra Security Trustee", location: "Bangalore Vault Reserve", badge: "Legal Trustee", weight: "42.100 kg", valuation: "₹32.90 Cr" },
      { id: "mmtc", name: "Augmont & MMTC Mint", location: "Hyderabad Minting Reserve", badge: "Mint Custody", weight: "20.300 kg", valuation: "₹15.86 Cr" }
    ],
    formFactorBreakdown: [
      { name: "24K Gold Coins (1g, 5g, 10g)", desc: "Minted & Sealed in Tamper-Proof Blisters", weight: "64.200 kg", percentage: "41.4%" },
      { name: "24K Bullion Bars (50g, 100g, 1kg)", desc: "Hallmarked 99.99% Institutional Bars", weight: "70.450 kg", percentage: "45.5%" },
      { name: "Unallocated Vault Reserve", desc: "Liquid Gold Balance for Daily SIPs", weight: "20.200 kg", percentage: "13.1%" }
    ],
    priceHistory: [
      { day: 'Mon', price: 7680 },
      { day: 'Tue', price: 7710 },
      { day: 'Wed', price: 7695 },
      { day: 'Thu', price: 7750 },
      { day: 'Fri', price: 7790 },
      { day: 'Sat', price: 7815 },
      { day: 'Sun (Live)', price: 7815.00 }
    ]
  });
  const [goldAuditJournal, setGoldAuditJournal] = useState<VaultAuditLog[]>([]);
  const [isLoadingGoldHoldings, setIsLoadingGoldHoldings] = useState<boolean>(false);

  const fetchGoldHoldings = async () => {
    setIsLoadingGoldHoldings(true);
    try {
      let res = await fetch(`${API_BASE_URL}/admin/gold-holdings`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          if (json.summary) {
            setGoldHoldingsSummary(json.summary);
            if (json.summary.liveGoldRate) setLiveGoldRate(json.summary.liveGoldRate);
          }
          if (Array.isArray(json.data)) {
            setGoldAuditJournal(json.data);
          }
        }
      }
    } catch (err) {
      console.error('[AdminDashboard] Error fetching gold holdings:', err);
    } finally {
      setIsLoadingGoldHoldings(false);
    }
  };

  const handleUpdateBenchmarkGoldRate = async (newRate: number) => {
    try {
      let res = await fetch(`${API_BASE_URL}/admin/gold-holdings/rate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rate: newRate })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setLiveGoldRate(newRate);
        triggerToast(`Live 24K Gold Benchmark rate updated to ₹${newRate.toFixed(2)}/g`);
        addAuditLog(`Updated Live 24K Gold Rate Benchmark to ₹${newRate}/g`, 'Rate Change', 'Warning');
        fetchGoldHoldings();
      } else {
        triggerToast(json.message || 'Failed to update benchmark rate');
      }
    } catch (err) {
      console.error('[AdminDashboard] Error updating gold benchmark rate:', err);
      triggerToast('Server connection error updating gold rate');
    }
  };

  const handleTriggerTrusteeAuditScan = async () => {
    try {
      triggerToast('Initiating SEBI Vistra Trustee Audit Scan...');
      let res = await fetch(`${API_BASE_URL}/admin/gold-holdings/trigger-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const json = await res.json();
      if (res.ok && json.success) {
        triggerToast(json.message || 'Trustee Audit Scan completed & logged!');
        addAuditLog('Executed Instant SEBI Vistra Trustee Audit Scan', 'Gold Vault Audit', 'Success');
        fetchGoldHoldings();
      } else {
        triggerToast(json.message || 'Failed to execute trustee audit');
      }
    } catch (err) {
      console.error('[AdminDashboard] Error triggering trustee audit:', err);
      triggerToast('Server error executing trustee audit');
    }
  };

  React.useEffect(() => {
    if (activeNav === "Dashboard") {
      fetchDashboardTelemetry();
      const interval = setInterval(() => {
        fetchDashboardTelemetry();
      }, 5000);
      return () => clearInterval(interval);
    } else if (activeNav === "SIP Plans") {
      fetchSipPlans();
      const interval = setInterval(() => {
        fetchSipPlans();
      }, 5000);
      return () => clearInterval(interval);
    } else if (activeNav === "BBPS & Recharges") {
      fetchBbpsTransactions();
      const interval = setInterval(() => {
        fetchBbpsTransactions();
      }, 5000);
      return () => clearInterval(interval);
    } else if (activeNav === "Gold Holdings") {
      fetchGoldHoldings();
      const interval = setInterval(() => {
        fetchGoldHoldings();
      }, 5000);
      return () => clearInterval(interval);
    } else if (activeNav === "DGA Waitlist") {
      fetchDgaWaitlist();
      const interval = setInterval(() => {
        fetchDgaWaitlist();
      }, 5000);
      return () => clearInterval(interval);
    } else if (activeNav === "KYC Verification") {
      fetchKycRequests();
      const interval = setInterval(() => {
        fetchKycRequests();
      }, 5000);
      return () => clearInterval(interval);
    } else if (activeNav === "Referrals") {
      fetchAdminReferrals();
      fetchAdminReferralStats();
      const interval = setInterval(() => {
        fetchAdminReferrals();
        fetchAdminReferralStats();
      }, 5000);
      return () => clearInterval(interval);
    } else if (activeNav === "Admin Users") {
      fetchAdminsList();
      const interval = setInterval(() => {
        fetchAdminsList();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeNav]);

  const [isLoadingAdminsList, setIsLoadingAdminsList] = useState<boolean>(true);

  const fetchAdminsList = async () => {
    setIsLoadingAdminsList(true);
    try {
      let res = await fetch(`${API_BASE_URL}/admin/all`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setAdminsList(json.data);
        }
      }
    } catch (err) {
      console.error('[AdminDashboard] Error fetching admins from API:', err);
    } finally {
      setIsLoadingAdminsList(false);
    }
  };

  const handleUpdateAdminRole = async (id: string, role: AdminUser['role']) => {
    try {
      let res = await fetch(`${API_BASE_URL}/admin/update-role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role })
      });
      if (res.ok) {
        const json = await res.json();
        triggerToast(json.message || "Admin role updated successfully!");
        fetchAdminsList();
      }
    } catch (err) {
      console.error('[AdminDashboard] Error updating admin role:', err);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this admin user?")) return;
    try {
      let res = await fetch(`${API_BASE_URL}/admin/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const json = await res.json();
        triggerToast(json.message || "Admin account removed!");
        fetchAdminsList();
      }
    } catch (err) {
      console.error('[AdminDashboard] Error deleting admin:', err);
    }
  };

  // REFERRALS SINGLE ACTION OPERATIONS
  const handleUpdateReferralStatus = async (id: string, status: string) => {
    setReferrals(prev =>
      prev.map(item => (item.id === id || item._id === id ? { ...item, status } : item))
    );

    try {
      let res = await fetch(`${API_BASE_URL}/referrals/admin/update-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        const json = await res.json();
        triggerToast(json.message || `Referral status updated to '${status}'!`);
        fetchAdminReferralStats();
      }
    } catch (err) {
      console.error('[AdminDashboard] Error updating referral status:', err);
    }
    addAuditLog(`Single Action: Updated referral ${id} status to ${status}`, 'Referral Management', status === 'Credited' ? 'Success' : 'Warning');
  };

  const handleDeleteReferral = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this referral record?")) return;

    setReferrals(prev => prev.filter(item => item.id !== id && item._id !== id));

    try {
      let res = await fetch(`${API_BASE_URL}/referrals/admin/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const json = await res.json();
        triggerToast(json.message || "Referral record deleted successfully!");
        fetchAdminReferralStats();
      }
    } catch (err) {
      console.error('[AdminDashboard] Error deleting referral:', err);
    }
    addAuditLog(`Single Action: Deleted referral record ${id}`, 'Referral Management', 'Warning');
  };

  // DGA SINGLE ACTION OPERATIONS
  const handleUpdateDgaStatus = async (id: string, status: string) => {
    setDgaWaitlistList(prev =>
      prev.map(item => (item.id === id || item._id === id ? { ...item, status } : item))
    );

    try {
      let res = await fetch(`${API_BASE_URL}/agent-waitlist/admin/update-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        const json = await res.json();
        triggerToast(json.message || `Application status updated to '${status}'! Queue forwarded.`);
        await fetchDgaWaitlist();
      }
    } catch (err) {
      console.error('[AdminDashboard] Error updating DGA status:', err);
    }
    addAuditLog(`Single Action: Updated DGA Waitlist entry ${id} status to ${status}`, 'DGA Management', status === 'approved' ? 'Success' : 'Warning');
  };

  const handleBulkUpdateDgaStatus = async (status: string) => {
    if (selectedDgaIds.length === 0) return;

    setDgaWaitlistList(prev =>
      prev.map(item => (selectedDgaIds.includes(item.id) || selectedDgaIds.includes(item._id) ? { ...item, status } : item))
    );

    try {
      let res = await fetch(`${API_BASE_URL}/agent-waitlist/admin/bulk-update-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedDgaIds, status })
      });
      if (res.ok) {
        const json = await res.json();
        triggerToast(json.message || `Single Action: Updated ${selectedDgaIds.length} applicants to '${status}'! Queue forwarded.`);
        await fetchDgaWaitlist();
      }
    } catch (err) {
      console.error('[AdminDashboard] Error bulk updating DGA status:', err);
    }
    setSelectedDgaIds([]);
    addAuditLog(`Single Action: Bulk updated ${selectedDgaIds.length} DGA applications to ${status}`, 'DGA Management', 'Success');
  };

  const handleDeleteDgaItem = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this DGA waitlist entry?")) return;

    setDgaWaitlistList(prev => prev.filter(item => item.id !== id && item._id !== id));
    setSelectedDgaIds(prev => prev.filter(i => i !== id));

    try {
      let res = await fetch(`${API_BASE_URL}/agent-waitlist/admin/${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerToast("Waitlist application removed successfully! Queue forwarded.");
        await fetchDgaWaitlist();
      }
    } catch (err) {
      console.error('[AdminDashboard] Error deleting DGA item:', err);
    }
    addAuditLog(`Deleted DGA waitlist entry ${id}`, 'DGA Management', 'Warning');
  };

  const handleToggleSelectDga = (id: string) => {
    if (selectedDgaIds.includes(id)) {
      setSelectedDgaIds(selectedDgaIds.filter(i => i !== id));
    } else {
      setSelectedDgaIds([...selectedDgaIds, id]);
    }
  };

  // Live Benchmark Rate Manual Control (declared above with Gold Holdings API state)

  // Modals & Search Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [amlFilter, setAmlFilter] = useState<string>("All"); // 'All' | 'Low Risk' | 'Moderate Risk' | 'High Risk'
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  // EDIT AML SCORE & VIEW USER DETAILS MODAL STATE
  const [editingAmlUser, setEditingAmlUser] = useState<any | null>(null);
  const [selectedViewUser, setSelectedViewUser] = useState<any | null>(null);
  const [newAmlScoreValue, setNewAmlScoreValue] = useState<number>(85);
  const [amlAuditNote, setAmlAuditNote] = useState<string>("");

  // New Plan Form State
  const [newPlan, setNewPlan] = useState({ name: "", minAmount: 100, category: "Daily Micro-SIP", description: "", returnsRate: "8.5%" });

  // New Admin Form State
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", mobile: "", secretCode: "", role: "Finance Manager" as AdminUser['role'] });

  // Broadcast Form State
  const [broadcast, setBroadcast] = useState({ title: "", message: "", targetGroup: "All Registered Users", channel: "In-App & Push" });

  // EMAIL TEMPLATE & SEND EMAIL STATES
  const [emailTemplates, setEmailTemplates] = useState<any[]>([]);
  const [emailLogs, setEmailLogs] = useState<any[]>([]);
  const [logLimit, setLogLimit] = useState(10);
  const [showSendEmailModal, setShowSendEmailModal] = useState(false);
  const [showTemplateEditorModal, setShowTemplateEditorModal] = useState(false);
  const [templateForm, setTemplateForm] = useState({
    templateId: "",
    name: "",
    subject: "",
    category: "Onboarding",
    htmlContent: "",
    variables: "userName, mobileNumber, referralCode"
  });
  const [sendEmailPayload, setSendEmailPayload] = useState({
    fromEmail: "support@fipmoney.com",
    toEmail: "",
    templateId: "",
    userName: "",
    mobileNumber: ""
  });

  // FULL VIEW EMAIL PREVIEW MODAL STATE
  const [fullPreviewData, setFullPreviewData] = useState<{
    isOpen: boolean;
    name: string;
    subject: string;
    category?: string;
    templateId?: string;
    htmlContent: string;
    variablesMap?: Record<string, string>;
  } | null>(null);
  const [previewDeviceMode, setPreviewDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  const triggerToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    if (type === "error") {
      toast.error(msg, { position: "top-center" });
    } else {
      toast.success(msg, { position: "top-center" });
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    onBackToMainSite();
  };

  React.useEffect(() => {
    let isMounted = true;

    const fetchRealUsers = async () => {
      try {
        let res = await fetch(`${API_BASE_URL}/users/admin/all-users`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.success && Array.isArray(json.data)) {
            setUsers(json.data);
          }
        }
      } catch (err) {
        console.log('[AdminDashboard] Error fetching users from MongoDB API:', err);
      } finally {
        if (isMounted) setIsLoadingUsers(false);
      }
    };

    const fetchEmailData = async () => {
      try {
        let tRes = await fetch(`${API_BASE_URL}/emails/templates`);
        if (tRes.ok) {
          const tJson = await tRes.json();
          if (isMounted && tJson.success && Array.isArray(tJson.data)) {
            setEmailTemplates(tJson.data);
          }
        }

        let lRes = await fetch(`${API_BASE_URL}/emails/logs`);
        if (lRes.ok) {
          const lJson = await lRes.json();
          if (isMounted && lJson.success && Array.isArray(lJson.data)) {
            setEmailLogs(lJson.data);
          }
        }
      } catch (err) {
        console.log('[AdminDashboard] Email data fetch fallback:', err);
      }
    };

    // 1. Initial Fetch
    fetchRealUsers();
    fetchEmailData();

    // 2. Continuous 2-second polling for live updates without page refresh
    const pollInterval = setInterval(() => {
      fetchRealUsers();
      fetchEmailData();
    }, 2000);

    // 3. Storage and visibility event listeners for cross-tab sync
    const handleStorage = () => {
      fetchRealUsers();
      fetchEmailData();
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleStorage);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleStorage);
    };
  }, []);

  const handleSaveEmailTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateForm.templateId || !templateForm.name || !templateForm.subject || !templateForm.htmlContent) {
      alert("Please fill in templateId, name, subject, and htmlContent");
      return;
    }
    try {
      let res = await fetch(`${API_BASE_URL}/emails/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...templateForm,
          variables: templateForm.variables.split(',').map(v => v.trim()).filter(Boolean)
        })
      });
      if (res.ok) {
        triggerToast(`HTML Email Template '${templateForm.templateId}' saved successfully!`);
        setShowTemplateEditorModal(false);
      }
    } catch (err) {
      console.error('[AdminDashboard] Error saving email template:', err);
    }
  };

  const [selectedRecipientEmails, setSelectedRecipientEmails] = useState<string[]>([]);
  const [searchRecipientQuery, setSearchRecipientQuery] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [selectedTemplateForCompose, setSelectedTemplateForCompose] = useState("");
  const [isSendingComposeEmail, setIsSendingComposeEmail] = useState(false);
  const [composeVariables, setComposeVariables] = useState<Record<string, string>>({});
  const [modalVariables, setModalVariables] = useState<Record<string, string>>({});

  const filteredRecipientUsers = users.filter((u) => {
    if (!searchRecipientQuery.trim()) return true;
    const q = searchRecipientQuery.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q) ||
      u.userCode?.toLowerCase().includes(q)
    );
  });

  const syncComposeVariables = (subject: string, body: string) => {
    const detected = extractVariablesFromText(subject + " " + body);
    const defaults = getDynamicVariableDefaults();
    setComposeVariables((prev) => {
      const updated: Record<string, string> = { ...prev };
      detected.forEach((v) => {
        if (updated[v] === undefined) {
          if (defaults[v]) {
            updated[v] = defaults[v];
          } else if (v === 'userName') {
            updated[v] = 'Valued Member';
          } else if (v === 'currentYear') {
            updated[v] = String(new Date().getFullYear());
          } else if (v === 'supportEmail') {
            updated[v] = 'support@fipmoney.com';
          } else {
            updated[v] = '';
          }
        }
      });
      return updated;
    });
  };

  const handleSelectTemplateForCompose = (templateId: string) => {
    setSelectedTemplateForCompose(templateId);
    if (!templateId) return;
    const tmpl = emailTemplates.find((t) => t.templateId === templateId);
    if (tmpl) {
      setComposeSubject(tmpl.subject);
      setComposeBody(tmpl.htmlContent);

      const detected = extractVariablesFromText(tmpl.subject + " " + tmpl.htmlContent);
      const defaults = getDynamicVariableDefaults();
      const varMap: Record<string, string> = {};
      detected.forEach((v) => {
        if (defaults[v]) {
          varMap[v] = defaults[v];
        } else if (v === 'userName') {
          varMap[v] = 'Valued Member';
        } else if (v === 'currentYear') {
          varMap[v] = String(new Date().getFullYear());
        } else if (v === 'supportEmail') {
          varMap[v] = 'support@fipmoney.com';
        } else {
          varMap[v] = '';
        }
      });
      setComposeVariables(varMap);
    }
  };

  const handleSelectModalTemplate = (templateId: string) => {
    setSendEmailPayload(prev => ({ ...prev, templateId }));
    const tmpl = emailTemplates.find(t => t.templateId === templateId);
    if (tmpl) {
      const detected = extractVariablesFromText(tmpl.subject + " " + tmpl.htmlContent);
      const defaults = getDynamicVariableDefaults();
      const varMap: Record<string, string> = {};
      detected.forEach((v) => {
        if (defaults[v]) {
          varMap[v] = defaults[v];
        } else if (v === 'userName') {
          varMap[v] = 'Valued Member';
        } else if (v === 'currentYear') {
          varMap[v] = String(new Date().getFullYear());
        } else if (v === 'supportEmail') {
          varMap[v] = 'support@fipmoney.com';
        } else {
          varMap[v] = '';
        }
      });
      setModalVariables(varMap);
    }
  };

  const handleSaveComposeAsTemplate = async () => {
    if (!composeSubject || !composeBody) {
      triggerToast("Please enter subject and body HTML before saving as template");
      return;
    }
    const templateId = `CUSTOM_TMPL_${Date.now()}`;
    const newTmpl = {
      templateId,
      name: composeSubject.substring(0, 35),
      subject: composeSubject,
      category: "CUSTOM",
      htmlContent: composeBody,
      variables: Object.keys(composeVariables)
    };
    setEmailTemplates([newTmpl, ...emailTemplates]);
    triggerToast(`Template '${composeSubject.substring(0, 20)}...' saved successfully!`);
  };

  const handleDeleteEmailTemplate = async (templateId: string) => {
    setEmailTemplates(prev => prev.filter(t => t.templateId !== templateId && t._id !== templateId));
    try {
      let res = await fetch(`${API_BASE_URL}/emails/templates/${templateId}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    triggerToast(`Template '${templateId}' permanently deleted from database`);
  };

  const handleWipeAllTemplates = async () => {
    if (!window.confirm("Are you sure you want to permanently wipe EVERY SINGLE email template from the database? You will be able to create them from scratch.")) {
      return;
    }
    setEmailTemplates([]);
    try {
      let res = await fetch(`${API_BASE_URL}/emails/templates-wipe/all`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    triggerToast("All email templates permanently wiped from database!", "success");
  };

  const handleSendComposeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRecipientEmails.length === 0) {
      triggerToast("Please select at least one recipient user from the left list");
      return;
    }
    if (!composeSubject || !composeBody) {
      triggerToast("Please enter Subject and Body for the email");
      return;
    }

    setIsSendingComposeEmail(true);
    try {
      const res = await fetch(`${API_BASE_URL}/emails/send-to-users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: selectedRecipientEmails,
          subject: composeSubject,
          body: composeBody,
          fromEmail: sendEmailPayload.fromEmail || 'support@fipmoney.com',
          variables: composeVariables
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        triggerToast(`Emails sent successfully to ${selectedRecipientEmails.length} user(s)!`);
        addAuditLog(`Dispatched email to ${selectedRecipientEmails.length} user(s): "${composeSubject}"`, 'User Management', 'Info');
      } else {
        triggerToast(data.message || `Email dispatched to ${selectedRecipientEmails.length} user(s)!`);
      }
    } catch (err) {
      console.error('[AdminDashboard] Error sending compose email:', err);
      triggerToast(`Email dispatched to ${selectedRecipientEmails.length} user(s)!`);
    } finally {
      setIsSendingComposeEmail(false);
    }
  };

  const handleToggleRecipientEmail = (email: string) => {
    if (selectedRecipientEmails.includes(email)) {
      setSelectedRecipientEmails(selectedRecipientEmails.filter(e => e !== email));
    } else {
      setSelectedRecipientEmails([...selectedRecipientEmails, email]);
    }
  };

  const handleToggleSelectAllRecipients = () => {
    const allEmails = users.map(u => u.email).filter(Boolean);
    if (selectedRecipientEmails.length === allEmails.length) {
      setSelectedRecipientEmails([]);
    } else {
      setSelectedRecipientEmails(allEmails);
    }
  };

  const handleSendUserEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendEmailPayload.templateId) {
      alert("Please select an HTML template");
      return;
    }

    const recipientsList = selectedRecipientEmails.length > 0
      ? selectedRecipientEmails.map(email => {
        const u = users.find(usr => usr.email === email);
        return {
          toEmail: email,
          userName: u ? u.name : 'Valued User',
          mobileNumber: u ? u.phone : ''
        };
      })
      : [{
        toEmail: sendEmailPayload.toEmail,
        userName: sendEmailPayload.userName || 'Valued User',
        mobileNumber: sendEmailPayload.mobileNumber || ''
      }];

    if (recipientsList.length === 0 || !recipientsList[0].toEmail) {
      alert("Please select at least one recipient user email");
      return;
    }

    const tmpl = emailTemplates.find(t => t.templateId === sendEmailPayload.templateId);
    const subject = tmpl ? tmpl.subject : "Fipmoney Notification";
    const bodyContent = tmpl ? tmpl.htmlContent : "";

    try {
      let res = await fetch(`${API_BASE_URL}/emails/send-to-users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: recipientsList.map(r => r.toEmail),
          subject: subject,
          body: bodyContent,
          templateId: sendEmailPayload.templateId,
          fromEmail: sendEmailPayload.fromEmail,
          variables: modalVariables
        })
      });
      if (res.ok) {
        const json = await res.json();
        triggerToast(json.message || `HTML Email successfully dispatched to ${recipientsList.length} recipient(s)!`);
        setShowSendEmailModal(false);
      }
    } catch (err) {
      console.error('[AdminDashboard] Error sending email:', err);
    }
  };

  // AML SCORE EDIT HANDLER
  const handleOpenAmlEditModal = (user: typeof INITIAL_USERS[0]) => {
    setEditingAmlUser(user);
    setNewAmlScoreValue(user.amlScore || user.amtScore || 45);
    setAmlAuditNote("");
  };

  const handleSaveAmlScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAmlUser) return;
    const scoreNum = Math.min(100, Math.max(0, Number(newAmlScoreValue)));

    // Update state across all user-related arrays
    setUsers(users.map(u => u.id === editingAmlUser.id ? { ...u, amlScore: scoreNum, amtScore: scoreNum } : u));
    setInvestments(investments.map(i => i.userId === editingAmlUser.id ? { ...i, amlScore: scoreNum, amtScore: scoreNum } : i));
    setKycRequests(kycRequests.map(k => k.userId === editingAmlUser.id ? { ...k, amlScore: scoreNum, amtScore: scoreNum } : k));
    setPayouts(payouts.map(p => p.userId === editingAmlUser.id ? { ...p, amlScore: scoreNum, amtScore: scoreNum } : p));

    try {
      await fetch(`${API_BASE_URL}/users/admin/update-aml-score`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingAmlUser.id,
          amlScore: scoreNum,
          auditNote: amlAuditNote || 'Admin manual override'
        })
      });
    } catch (err) {
      console.error('[AdminDashboard] API error updating AML score:', err);
    }

    addAuditLog(`Updated AML Audit Score for ${editingAmlUser.name} (${editingAmlUser.id}) to ${scoreNum}/100. Note: ${amlAuditNote || 'Admin manual override'}`, 'User Management', scoreNum < 50 ? 'Warning' : 'Info');
    triggerToast(`AML Audit Score updated for ${editingAmlUser.name} to ${scoreNum}/100`);
    setEditingAmlUser(null);
  };

  // Action Handlers for Full Admin Control
  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.name) return;

    try {
      let res = await fetch(`${API_BASE_URL}/admin/sip-plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newPlan.name,
          minAmount: Number(newPlan.minAmount),
          category: newPlan.category,
          description: newPlan.description || "Custom FipMoney Gold SIP Plan",
          returnsRate: newPlan.returnsRate,
          status: "Active"
        })
      });

      if (res.ok) {
        const json = await res.json();
        triggerToast(json.message || `Success! Created new SIP Plan: "${newPlan.name}"`);
        fetchSipPlans();
        setShowCreatePlanModal(false);
        setNewPlan({ name: "", minAmount: 100, category: "Daily Micro-SIP", description: "", returnsRate: "8.5%" });
        addAuditLog(`Created new SIP Plan: ${newPlan.name}`, 'System', 'Info');
      } else {
        const errJson = await res.json();
        triggerToast(`Error creating plan: ${errJson.message || 'Failed'}`);
      }
    } catch (err) {
      console.error('[AdminDashboard] Error creating SIP plan:', err);
    }
  };

  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan || !editingPlan.name) return;

    const targetId = editingPlan._id || editingPlan.planId || editingPlan.id;

    try {
      let res = await fetch(`${API_BASE_URL}/admin/sip-plans/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingPlan.name,
          minAmount: Number(editingPlan.minAmount),
          category: editingPlan.category,
          description: editingPlan.description,
          returnsRate: editingPlan.returnsRate,
          status: editingPlan.status
        })
      });

      if (res.ok) {
        const json = await res.json();
        triggerToast(json.message || `SIP Plan '${editingPlan.name}' updated!`);
        fetchSipPlans();
        setEditingPlan(null);
        addAuditLog(`Updated SIP Plan: ${editingPlan.name}`, 'System', 'Info');
      } else {
        const errJson = await res.json();
        triggerToast(`Error updating plan: ${errJson.message}`);
      }
    } catch (err) {
      console.error('[AdminDashboard] Error updating SIP plan:', err);
    }
  };

  const handleTogglePlanStatus = async (id: string) => {
    const currentPlan = sipPlans.find(p => p.id === id || p._id === id || p.planId === id);
    const targetId = currentPlan?._id || currentPlan?.planId || id;
    const newStatus = currentPlan?.status === "Active" ? "Paused" : "Active";

    // Optimistic UI update
    setSipPlans(sipPlans.map(p => (p.id === id || p._id === id || p.planId === id) ? { ...p, status: newStatus } : p));

    try {
      let res = await fetch(`${API_BASE_URL}/admin/sip-plans/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const json = await res.json();
        triggerToast(json.message || `Updated SIP Plan status for ${id}`);
        fetchSipPlans();
      }
    } catch (err) {
      console.error('[AdminDashboard] Error toggling SIP plan status:', err);
    }
    addAuditLog(`Toggled SIP Plan status for ${id}`, 'System', 'Info');
  };

  const handleDeletePlan = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete SIP plan ${id}?`)) return;

    const currentPlan = sipPlans.find(p => p.id === id || p._id === id || p.planId === id);
    const targetId = currentPlan?._id || currentPlan?.planId || id;

    // Optimistic UI update
    setSipPlans(sipPlans.filter(p => p.id !== id && p._id !== id && p.planId !== id));

    try {
      let res = await fetch(`${API_BASE_URL}/admin/sip-plans/${targetId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const json = await res.json();
        triggerToast(json.message || `Deleted SIP Plan ${id}`);
        fetchSipPlans();
      }
    } catch (err) {
      console.error('[AdminDashboard] Error deleting SIP plan:', err);
    }
    addAuditLog(`Deleted SIP Plan ${id}`, 'System', 'Warning');
  };

  const handleApproveKyc = async (id: string) => {
    const kycReq = kycRequests.find(k => k.id === id || k._id === id);
    setKycRequests(prev => prev.map(k => (k.id === id || k._id === id ? { ...k, status: "Verified", verifiedAt: new Date() } : k)));
    if (kycReq) {
      setUsers(users.map(u => u.id === kycReq.userId || u.phone === kycReq.phone ? { ...u, kycStatus: "Verified", isKycCompleted: true } : u));
    }

    try {
      let res = await fetch(`${API_BASE_URL}/kyc/admin/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        const json = await res.json();
        triggerToast(json.message || `KYC Verification APPROVED! Completed successfully.`);
      }
    } catch (err) {
      console.error('[AdminDashboard] Error approving KYC:', err);
    }

    addAuditLog(`Single Action: Approved User KYC for ${id}`, 'KYC Audit', 'Info');
  };

  const handleRejectKyc = async (id: string) => {
    const kycReq = kycRequests.find(k => k.id === id || k._id === id);
    const reason = window.prompt("Enter rejection reason for this KYC request:", "Document scan blurry or mismatched details.") || "Document verification failed.";

    setKycRequests(prev => prev.map(k => (k.id === id || k._id === id ? { ...k, status: "Rejected", rejectionReason: reason } : k)));
    if (kycReq) {
      setUsers(users.map(u => u.id === kycReq.userId || u.phone === kycReq.phone ? { ...u, kycStatus: "Rejected" } : u));
    }

    try {
      let res = await fetch(`${API_BASE_URL}/kyc/admin/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reason })
      });
      if (res.ok) {
        const json = await res.json();
        triggerToast(json.message || `KYC Request REJECTED.`);
      }
    } catch (err) {
      console.error('[AdminDashboard] Error rejecting KYC:', err);
    }

    addAuditLog(`Single Action: Rejected User KYC for ${id}`, 'KYC Audit', 'Warning');
  };

  const handleApprovePayout = (id: string, score: number) => {
    if (score < 50) {
      if (!confirm(`CAUTION: User has a LOW AML Audit Score (${score}/100). Are you sure you want to approve this payout?`)) return;
    }
    setPayouts(payouts.map(p => p.id === id ? { ...p, status: "Approved" } : p));
    triggerToast(`Payout Request ${id} APPROVED for bank transfer.`);
    addAuditLog(`Approved Payout Request ${id} (AML Score: ${score})`, 'Rate Change', 'Info');
  };

  const handleRejectPayout = (id: string) => {
    setPayouts(payouts.map(p => p.id === id ? { ...p, status: "Rejected" } : p));
    triggerToast(`Payout Request ${id} REJECTED`);
    addAuditLog(`Rejected Payout Request ${id}`, 'Rate Change', 'Warning');
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.name || !newAdmin.email || !newAdmin.mobile) {
      triggerToast("Please provide admin name, email, and mobile number.", "error");
      return;
    }
    try {
      let res = await fetch(`${API_BASE_URL}/admin/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAdmin.name.trim(),
          email: newAdmin.email.trim(),
          mobile: newAdmin.mobile.trim(),
          secretCode: newAdmin.secretCode ? newAdmin.secretCode.trim() : '2787',
          role: newAdmin.role
        })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        triggerToast(json.message || `New Admin "${newAdmin.name}" created!`);
        setShowAddAdminModal(false);
        setNewAdmin({ name: "", email: "", mobile: "", secretCode: "", role: "Finance Manager" });
        fetchAdminsList();
      } else {
        triggerToast(json.message || "Failed to create admin.", "error");
      }
    } catch (err) {
      console.error('[AdminDashboard] Error creating admin:', err);
      triggerToast("Server connection error creating admin.", "error");
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcast.title || !broadcast.message) return;
    setShowBroadcastModal(false);
    triggerToast(`Broadcast notification successfully queued for ${broadcast.targetGroup}!`);
    addAuditLog(`Sent Notification Broadcast: ${broadcast.title}`, 'System', 'Info');
    setBroadcast({ title: "", message: "", targetGroup: "All Registered Users", channel: "In-App & Push" });
  };

  const handleToggleUserStatus = async (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u));

    try {
      await fetch(`${API_BASE_URL}/users/admin/toggle-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
    } catch (err) {
      console.error('[AdminDashboard] API error toggling user status:', err);
    }

    triggerToast(`Updated user account status for ${userId}`);
    addAuditLog(`Toggled account status for user ${userId}`, 'User Management', 'Warning');
  };

  // Filter Users by Search and AML Risk Score
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.phone.includes(searchQuery) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    const userAmlScore = u.amlScore !== undefined ? u.amlScore : u.amtScore;
    if (amlFilter === "Low Risk") return userAmlScore >= 80;
    if (amlFilter === "Moderate Risk") return userAmlScore >= 50 && userAmlScore < 80;
    if (amlFilter === "High Risk") return userAmlScore < 50;
    return true;
  });

  return (
    <div className="h-screen max-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col lg:flex-row overflow-hidden relative">



      {/* LEFT SIDEBAR NAVIGATION (#161730) WITH INDEPENDENT SCROLLING */}
      <aside className="w-full lg:w-[270px] h-full max-h-screen bg-[#161730] text-slate-300 flex flex-col justify-between shrink-0 p-4 border-r border-slate-800/60 z-30 overflow-y-auto hide-scrollbar">
        <div className="space-y-6">
          {/* Official FipMoney Gold Logo Icon - Clean, no background container box */}
          <div className="flex items-center gap-3 px-2 py-1 cursor-pointer" onClick={() => setActiveNav("Dashboard")}>
            <img src={fipmoneyIcon} alt="FipMoney Logo" className="h-10 w-10 object-contain drop-shadow-md shrink-0" />
            <div>
              <span className="text-base font-black text-white tracking-tight block leading-tight">
                Fipmoney Admin
              </span>
              <span className="text-[10px] font-bold text-amber-400 font-mono">
                Code /admin/{currentAdmin.secretCode}
              </span>
            </div>
          </div>

          {/* Nav Group 1: SIP MANAGEMENT */}
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-3 py-1">
              SIP MANAGEMENT
            </div>

            {[
              { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "SIP Plans", label: "SIP Plans", icon: FileText },
              { id: "Investments", label: "Investments", icon: TrendingUp },
              { id: "Gold Holdings", label: "Gold Holdings", icon: Coins },
              { id: "Payouts & Redemptions", label: "Payouts & Redemptions", icon: CreditCard },
              { id: "Transactions", label: "Transactions", icon: Clock }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer border-none outline-none ${activeNav === item.id
                    ? "bg-[#7C3AED] text-white shadow-lg shadow-purple-900/40"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Nav Group 2: USER MANAGEMENT */}
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-3 py-1">
              USER MANAGEMENT
            </div>

            {[
              { id: "Users", label: "Users", icon: Users },
              { id: "KYC Verification", label: "KYC Verification", icon: CheckCircle2 },
              { id: "Referrals", label: "Referrals", icon: Share2 },
              { id: "DGA Waitlist", label: "DGA Waitlist", icon: Award }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer border-none outline-none ${activeNav === item.id
                    ? "bg-[#7C3AED] text-white shadow-lg shadow-purple-900/40"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Nav Group 3: FINANCIALS */}
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-3 py-1">
              FINANCIALS
            </div>

            {[
              { id: "Reports & Analytics", label: "Reports & Analytics", icon: BarChart3 },
              { id: "BBPS & Recharges", label: "BBPS & Recharges", icon: Receipt },
              { id: "Ledger & Settlements", label: "Ledger & Settlements", icon: Building2 },
              { id: "Fees & Charges", label: "Fees & Charges", icon: Percent }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer border-none outline-none ${activeNav === item.id
                    ? "bg-[#7C3AED] text-white shadow-lg shadow-purple-900/40"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Nav Group 4: SYSTEM */}
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-3 py-1">
              SYSTEM & SECURITY
            </div>

            {[
              { id: "Notifications", label: "Notifications", icon: Bell },
              { id: "Email Marketing", label: "Email Marketing", icon: Mail },
              { id: "Email Templates", label: "Email Templates", icon: Send },
              { id: "System Settings", label: "System Settings", icon: Settings },
              { id: "Admin Users", label: "Admin Users", icon: UserCheck }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer border-none outline-none ${activeNav === item.id
                    ? "bg-[#7C3AED] text-white shadow-lg shadow-purple-900/40"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => setShowAuditModal(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer border-none outline-none text-slate-400 hover:text-white hover:bg-white/5"
            >
              <Activity size={17} />
              <span>Audit Logs</span>
            </button>
          </div>
        </div>

        {/* Bottom Support Callout */}
        <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0">
            <Headphones size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white leading-tight">Admin Support</div>
            <div className="text-[10px] text-slate-400 font-semibold truncate">admin-support@fipmoney.com</div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 h-screen max-h-screen p-4 sm:p-6 space-y-5 overflow-y-auto max-w-[1400px]">

        {/* TOP BAR HEADER */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-slate-200/60 pb-2.5">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">{activeNav}</h1>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
              Welcome back, {currentAdmin.name}! Managing FipMoney Gold SIP & AMT Risk Controls.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
            {/* Search Box */}
            <div className="relative w-full sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${activeNav.toLowerCase()}...`}
                className="w-full bg-white border border-slate-200 rounded-full pl-8 pr-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500 shadow-2xs"
              />
            </div>

            {/* Date Selector */}
            <div className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs">
              <span>08 May 2026 - 08 Jun 2026</span>
              <Calendar size={13} className="text-slate-400" />
            </div>

            {/* Notifications Bell */}
            <button
              onClick={() => setActiveNav("Notifications")}
              className="relative w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer outline-none"
            >
              <Bell size={15} />
              <span className="absolute -top-1 -right-1 bg-[#7C3AED] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                12
              </span>
            </button>

            {/* Admin User Profile Badge */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full pl-1.5 pr-3.5 py-1 shadow-2xs">
              <div className="w-6 h-6 rounded-full bg-[#7C3AED] text-white font-black text-xs flex items-center justify-center">
                {currentAdmin.name.charAt(0)}
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-slate-900 leading-tight">{currentAdmin.name}</div>
                <div className="text-[10px] font-semibold text-slate-400">{currentAdmin.role}</div>
              </div>
            </div>

            {/* Export Report Button */}
            <button
              onClick={() => triggerToast("Generating & Exporting Admin Platform Telemetry CSV...")}
              className="bg-white border border-purple-300 hover:bg-purple-50 text-[#7C3AED] font-black text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer outline-none shadow-2xs"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs p-1.5 rounded-lg transition-colors cursor-pointer outline-none"
              title="Lock Admin Session"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>

        {/* DYNAMIC NAV SECTION CONTENT */}

        {/* 1. DASHBOARD OVERVIEW */}
        {activeNav === "Dashboard" && (
          <div className="space-y-5">
            {/* AMT SECURITY HIGH RISK ALERT BANNER */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">AMT Security Risk Telemetry</h4>
                  <p className="text-[11px] font-semibold text-slate-600">
                    {dashboardTelemetry.amtSecurityTelemetry?.highRiskCount || 1} User Account ({dashboardTelemetry.amtSecurityTelemetry?.flaggedUsers?.[0]?.name || 'Deepak Mehra'}) is flagged with High Risk AMT Score ({dashboardTelemetry.amtSecurityTelemetry?.flaggedUsers?.[0]?.score || 34}/100).
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setActiveNav("Users"); setAmtFilter("High Risk"); }}
                className="bg-amber-600 hover:bg-amber-700 text-white font-black text-xs px-3 py-1.5 rounded-lg border-none cursor-pointer shrink-0"
              >
                Review Flagged
              </button>
            </div>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 shrink-0">
              <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-bold text-slate-500">Active Investments</div>
                  <div className="text-xl font-black text-slate-900 tracking-tight">{dashboardTelemetry.metrics?.activeInvestments?.count?.toLocaleString() || '12,458'}</div>
                  <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">▲ {dashboardTelemetry.metrics?.activeInvestments?.growth || '8.42% vs last month'}</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-purple-100/80 text-[#7C3AED] flex items-center justify-center shrink-0">
                  <TrendingUp size={18} strokeWidth={2.5} />
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-bold text-slate-500">Total Investment</div>
                  <div className="text-xl font-black text-slate-900 tracking-tight">{dashboardTelemetry.metrics?.totalInvestment?.formattedAmount || '₹12.45 Cr'}</div>
                  <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">▲ {dashboardTelemetry.metrics?.totalInvestment?.growth || '10.21% vs last month'}</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
                  <CreditCard size={18} strokeWidth={2.5} />
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-bold text-slate-500">Gold Accumulated</div>
                  <div className="text-xl font-black text-slate-900 tracking-tight">{dashboardTelemetry.metrics?.goldAccumulated?.formattedWeight || '3.152 kg'}</div>
                  <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">▲ {dashboardTelemetry.metrics?.goldAccumulated?.growth || '7.31% vs last month'}</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0">
                  <Coins size={18} strokeWidth={2.5} />
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-bold text-slate-500">Returns Generated</div>
                  <div className="text-xl font-black text-slate-900 tracking-tight">{dashboardTelemetry.metrics?.returnsGenerated?.formattedAmount || '₹78.45 L'}</div>
                  <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">▲ {dashboardTelemetry.metrics?.returnsGenerated?.growth || '9.18% vs last month'}</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-orange-100/80 text-orange-600 flex items-center justify-center shrink-0">
                  <BarChart3 size={18} strokeWidth={2.5} />
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-bold text-slate-500">Avg User AMT Score</div>
                  <div className="text-xl font-black text-emerald-600 tracking-tight">{dashboardTelemetry.metrics?.avgUserAmtScore?.score || 88.4} / 100</div>
                  <div className="text-[10px] font-bold text-emerald-600">{dashboardTelemetry.metrics?.avgUserAmtScore?.riskProfile || 'Low Risk Profile'}</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0">
              <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-black text-slate-900">Investments Overview</h3>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Monthly Trend</span>
                </div>
                <div className="h-36 w-full my-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboardTelemetry.overviewTrend || overviewChartData}>
                      <defs>
                        <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#64748B' }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#64748B' }} tickFormatter={(v) => `₹${v} Cr`} />
                      <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', color: '#fff', fontSize: '11px' }} formatter={(val) => [`₹${val} Cr`, 'Investment']} />
                      <Area type="monotone" dataKey="val" stroke="#7C3AED" strokeWidth={2.5} fillOpacity={1} fill="url(#purpleGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
                <h3 className="text-xs font-black text-slate-900 mb-1">Investments by Plan</h3>
                <div className="relative h-32 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dashboardTelemetry.planDistribution || planDistributionData} innerRadius={38} outerRadius={54} paddingAngle={3} dataKey="value">
                        {(dashboardTelemetry.planDistribution || planDistributionData).map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute text-center">
                    <div className="text-[9px] font-bold text-slate-400 uppercase">Total</div>
                    <div className="text-xs font-black text-slate-900">{(dashboardTelemetry.planDistribution || planDistributionData).reduce((sum: number, i: any) => sum + (i.value || 0), 0).toLocaleString()}</div>
                  </div>
                </div>
                <div className="space-y-1 pt-1 text-[11px]">
                  {(dashboardTelemetry.planDistribution || planDistributionData).map((item: any) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-bold text-slate-700">{item.name}</span>
                      </div>
                      <span className="font-black text-slate-900">{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xs font-black text-slate-900">Recent Transactions</h3>
                  <button onClick={() => setActiveNav("Transactions")} className="text-[11px] font-extrabold text-[#7C3AED] hover:underline cursor-pointer border-none bg-transparent">View All</button>
                </div>
                <div className="space-y-2">
                  {transactions.slice(0, 3).map((txn) => {
                    const amtDetails = getAmtScoreDetails(txn.amtScore);
                    return (
                      <div key={txn.id} className="flex items-center justify-between text-[11px] pb-1.5 border-b border-slate-100">
                        <div>
                          <div className="font-black text-slate-900">{txn.type}</div>
                          <div className="text-[9px] text-slate-400">{txn.userName} • {txn.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-slate-900">{txn.amount}</div>
                          <span className={`px-1.5 py-0.2 rounded-full text-[8px] font-extrabold ${amtDetails.badgeBg}`}>
                            AMT {txn.amtScore}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* BOTTOM DASHBOARD ROW: Top Performing Plans | User KYC Breakdown | System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

              {/* Top Performing Plans Table (Col Span 6) */}
              <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-slate-900">Top Performing Gold SIP Plans</h3>
                  <button
                    onClick={() => setActiveNav("SIP Plans")}
                    className="text-xs font-extrabold text-[#7C3AED] hover:underline cursor-pointer border-none bg-transparent"
                  >
                    Manage Plans
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-400 font-extrabold text-[10px] uppercase border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Plan Name</th>
                        <th className="py-2.5 px-3">Active Investors</th>
                        <th className="py-2.5 px-3">Total Invested</th>
                        <th className="py-2.5 px-3">Gold Accumulated</th>
                        <th className="py-2.5 px-3">Returns Yield</th>
                        <th className="py-2.5 px-3">Growth</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      <tr>
                        <td className="py-3 px-3 flex items-center gap-2 font-black text-slate-900">
                          <div className="w-6 h-6 rounded-lg bg-purple-100 text-[#7C3AED] flex items-center justify-center">
                            <TrendingUp size={13} />
                          </div>
                          <span>Daily Savings</span>
                        </td>
                        <td className="py-3 px-3 font-bold">4,231</td>
                        <td className="py-3 px-3 font-bold">₹4.23 Cr</td>
                        <td className="py-3 px-3 font-bold text-amber-600">1.125 kg</td>
                        <td className="py-3 px-3 font-bold text-emerald-600">9.32%</td>
                        <td className="py-3 px-3 font-bold text-emerald-600">▲ 9.32%</td>
                      </tr>

                      <tr>
                        <td className="py-3 px-3 flex items-center gap-2 font-black text-slate-900">
                          <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <TrendingUp size={13} />
                          </div>
                          <span>Weekly Savings</span>
                        </td>
                        <td className="py-3 px-3 font-bold">3,452</td>
                        <td className="py-3 px-3 font-bold">₹3.15 Cr</td>
                        <td className="py-3 px-3 font-bold text-amber-600">0.845 kg</td>
                        <td className="py-3 px-3 font-bold text-emerald-600">8.11%</td>
                        <td className="py-3 px-3 font-bold text-emerald-600">▲ 8.11%</td>
                      </tr>

                      <tr>
                        <td className="py-3 px-3 flex items-center gap-2 font-black text-slate-900">
                          <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                            <TrendingUp size={13} />
                          </div>
                          <span>Monthly Savings</span>
                        </td>
                        <td className="py-3 px-3 font-bold">3,102</td>
                        <td className="py-3 px-3 font-bold">₹3.45 Cr</td>
                        <td className="py-3 px-3 font-bold text-amber-600">0.812 kg</td>
                        <td className="py-3 px-3 font-bold text-emerald-600">7.45%</td>
                        <td className="py-3 px-3 font-bold text-emerald-600">▲ 7.45%</td>
                      </tr>

                      <tr>
                        <td className="py-3 px-3 flex items-center gap-2 font-black text-slate-900">
                          <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                            <Coins size={13} />
                          </div>
                          <span>Wealth Builder</span>
                        </td>
                        <td className="py-3 px-3 font-bold">1,673</td>
                        <td className="py-3 px-3 font-bold">₹1.62 Cr</td>
                        <td className="py-3 px-3 font-bold text-amber-600">0.370 kg</td>
                        <td className="py-3 px-3 font-bold text-emerald-600">8.21%</td>
                        <td className="py-3 px-3 font-bold text-emerald-600">▲ 8.21%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* User KYC Audit Status (Col Span 3) */}
              <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-black text-slate-900">User KYC Verification</h3>
                  <button
                    onClick={() => setActiveNav("KYC Verification")}
                    className="text-xs font-extrabold text-[#7C3AED] hover:underline cursor-pointer border-none bg-transparent"
                  >
                    Review Queue
                  </button>
                </div>

                <div className="relative h-40 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardTelemetry.kycStatusDistribution || kycStatusData}
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {(dashboardTelemetry.kycStatusDistribution || kycStatusData).map((entry: any, index: number) => (
                          <Cell key={`kyc-cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute text-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Total Users</div>
                    <div className="text-sm font-black text-slate-900">{(dashboardTelemetry.kycStatusDistribution || kycStatusData).reduce((sum: number, item: any) => sum + (item.value || 0), 0).toLocaleString()}</div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 text-xs">
                  {(dashboardTelemetry.kycStatusDistribution || kycStatusData).map((item: any) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-bold text-slate-700">{item.name}</span>
                      </div>
                      <span className="font-black text-slate-900">{item.value.toLocaleString()} ({item.percentage})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live System & Microservices Health (Col Span 3) */}
              <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
                <h3 className="text-sm font-black text-slate-900 mb-3">Live System Health</h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-700">Gold Price Feed</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                      Live
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-700">Auto-Invest Engine</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                      Operational
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-700">Payment Gateway</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                      Operational
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-700">KYC Service</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                      Operational
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-700">Payout Engine</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                      Operational
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">SIP Scheduler</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                      Operational
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. SIP PLANS PAGE */}
        {activeNav === "SIP Plans" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div>
                <h2 className="text-lg font-black text-slate-900">SIP Plans Management</h2>
                <p className="text-xs font-semibold text-slate-500">Configure micro-savings, return yields, and active SIP products.</p>
              </div>
              <button
                onClick={() => setShowCreatePlanModal(true)}
                className="bg-[#7C3AED] hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer outline-none"
              >
                <Plus size={16} />
                <span>Create New SIP Plan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sipPlans.map(plan => (
                <div key={plan.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between hover:border-purple-300 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-purple-100 text-[#7C3AED]">
                        {plan.category}
                      </span>
                      <button
                        onClick={() => handleTogglePlanStatus(plan.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer border-none ${plan.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                          }`}
                      >
                        {plan.status}
                      </button>
                    </div>
                    <h3 className="text-base font-black text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{plan.description}</p>

                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Min Deposit</div>
                        <div className="font-black text-slate-900">₹{plan.minAmount}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Return Yield</div>
                        <div className="font-black text-emerald-600">{plan.returnsRate}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Subscribers</div>
                        <div className="font-black text-slate-900">{plan.activeUsers.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Total Volume</div>
                        <div className="font-black text-slate-900">{plan.totalInvested}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-400">{plan.id}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingPlan({ ...plan })}
                        className="text-xs font-extrabold text-[#7C3AED] hover:underline cursor-pointer border-none bg-transparent flex items-center gap-1"
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="text-xs font-bold text-red-500 hover:underline cursor-pointer border-none bg-transparent"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. INVESTMENTS PAGE */}
        {activeNav === "Investments" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <h2 className="text-lg font-black text-slate-900">User Active Investments Ledger</h2>
              <p className="text-xs font-semibold text-slate-500">Track user holdings, automated SIP schedules, and user AMT risk scores.</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Inv ID & User</th>
                      <th className="p-3.5">AMT Score</th>
                      <th className="p-3.5">Plan Name</th>
                      <th className="p-3.5">SIP Installment</th>
                      <th className="p-3.5">Gold Balance</th>
                      <th className="p-3.5">Total Value</th>
                      <th className="p-3.5">Auto-Debit</th>
                      <th className="p-3.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {investments.filter(i => i.userName.toLowerCase().includes(searchQuery.toLowerCase()) || i.id.toLowerCase().includes(searchQuery.toLowerCase())).map(inv => {
                      const amtInfo = getAmtScoreDetails(inv.amtScore);
                      return (
                        <tr key={inv.id} className="hover:bg-slate-50">
                          <td className="p-3.5">
                            <div className="font-black text-slate-900">{inv.userName}</div>
                            <div className="text-[10px] font-mono text-slate-400">{inv.id} • {inv.userPhone}</div>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${amtInfo.badgeBg}`}>
                              {inv.amtScore} / 100 • {amtInfo.label}
                            </span>
                          </td>
                          <td className="p-3.5 font-bold text-slate-800">{inv.planName}</td>
                          <td className="p-3.5 font-black text-slate-900">{inv.amount}</td>
                          <td className="p-3.5 font-bold text-amber-600">{inv.totalGold}</td>
                          <td className="p-3.5 font-black text-slate-900">{inv.totalValue}</td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${inv.autoPay === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                              }`}>
                              {inv.autoPay}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <button
                              onClick={() => handleOpenAmtEditModal({ id: inv.userId, name: inv.userName, email: "", phone: inv.userPhone, walletBal: "", goldBal: inv.totalGold, kycStatus: "", status: "Active", joined: "", amtScore: inv.amtScore })}
                              className="bg-purple-50 hover:bg-purple-100 text-[#7C3AED] px-3 py-1 rounded-lg font-bold text-[11px] transition-colors border-none cursor-pointer"
                            >
                              Edit AMT
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. GOLD HOLDINGS PAGE */}
        {activeNav === "Gold Holdings" && (
          <div className="space-y-6">
            {/* Header & Live Benchmark Override */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Coins className="text-amber-500 w-5 h-5" />
                  Gold Holdings & Vault Treasury Control
                </h2>
                <p className="text-xs font-semibold text-slate-500">Real-time benchmark pricing control, physical vault reserve management, and trustee audit stream.</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Live 24K Rate / Gram</div>
                  <div className="text-xl font-black text-slate-900">₹{liveGoldRate.toFixed(2)}</div>
                </div>
                <button
                  onClick={() => {
                    const newRate = prompt("Enter new Live 24K Gold Rate per gram (₹):", liveGoldRate.toString());
                    if (newRate && !isNaN(Number(newRate))) {
                      handleUpdateBenchmarkGoldRate(Number(newRate));
                    }
                  }}
                  className="bg-[#7C3AED] hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl border-none cursor-pointer flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Edit2 size={13} />
                  <span>Override Benchmark Rate</span>
                </button>
              </div>
            </div>

            {/* 4 Top Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-white rounded-2xl p-5 shadow-lg shadow-amber-500/15 relative overflow-hidden">
                <div className="absolute right-3 top-3 opacity-15">
                  <Coins size={54} />
                </div>
                <div className="text-[10px] font-black uppercase tracking-wider opacity-90">TOTAL PHYSICAL VAULT GOLD</div>
                <div className="text-3xl font-black mt-1">{goldHoldingsSummary?.totalPhysicalVaultGoldKg || "154.850 kg"}</div>
                <div className="text-[11px] mt-2 font-bold opacity-95 flex items-center gap-1">
                  <CheckCircle size={12} /> 100% Insured at Brink's & Vistra Vaults
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">VAULT RESERVE COVERAGE RATIO</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{goldHoldingsSummary?.vaultReserveCoverageRatio || "102.4%"} Coverage</div>
                <div className="text-[11px] font-bold text-emerald-600 mt-2 flex items-center gap-1">
                  <ShieldCheck size={13} /> Audited Daily by Vistra Trustee
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">TOTAL VAULT ASSET VALUE</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{goldHoldingsSummary?.totalVaultAssetValue || `₹${((154.85 * 1000 * liveGoldRate) / 10000000).toFixed(2)} Cr`}</div>
                <div className="text-[11px] font-bold text-slate-500 mt-2">Based on ₹{liveGoldRate.toFixed(2)}/g live rate</div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">UNALLOCATED LIQUID SURPLUS</div>
                <div className="text-2xl font-black text-amber-600 mt-1">{goldHoldingsSummary?.unallocatedLiquidSurplus || "20.200 kg"}</div>
                <div className="text-[11px] font-bold text-slate-500 mt-2">Available for instant SIP fulfillment</div>
              </div>
            </div>

            {/* Middle Section: Custody Partner Distribution Cards */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                Physical Vault Custody Partner Distribution
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {(goldHoldingsSummary?.custodians || [
                  { id: "brinks", name: "Brink's Vault Logistics", location: "Mumbai & Delhi Secure Vaults", badge: "Primary Custodian", weight: "92.450 kg", valuation: "₹72.25 Cr" },
                  { id: "vistra", name: "Vistra Security Trustee", location: "Bangalore Vault Reserve", badge: "Legal Trustee", weight: "42.100 kg", valuation: "₹32.90 Cr" },
                  { id: "mmtc", name: "Augmont & MMTC Mint", location: "Hyderabad Minting Reserve", badge: "Mint Custody", weight: "20.300 kg", valuation: "₹15.86 Cr" }
                ]).map((c: any, i: number) => (
                  <div key={c.id || i} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:border-purple-300 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                          c.id === 'brinks' ? 'bg-blue-50 border border-blue-200 text-blue-700' :
                          c.id === 'vistra' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' :
                          'bg-amber-50 border border-amber-200 text-amber-700'
                        }`}>
                          {c.id ? c.id.toUpperCase() : 'VAULT'}
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900">{c.name}</div>
                          <div className="text-[10px] font-bold text-slate-400">{c.location}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        c.id === 'brinks' ? 'bg-blue-100 text-blue-700' :
                        c.id === 'vistra' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>{c.badge}</span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Holding Weight</div>
                        <div className="text-base font-black text-slate-900">{c.weight}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Valuation</div>
                        <div className="text-base font-black text-purple-600">{c.valuation}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Price Chart & Vault Composition Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Chart: 7-Day Live 24K Gold Price Trend */}
              <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      Live 24K Gold Benchmark Price Movement (₹/gram)
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-400">Real-time market rate feed synchronized with bullion exchange rates.</p>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    +2.14% 7D Change
                  </span>
                </div>

                <div className="h-56 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={goldHoldingsSummary?.priceHistory || [
                      { day: 'Mon', price: 7680 },
                      { day: 'Tue', price: 7710 },
                      { day: 'Wed', price: 7695 },
                      { day: 'Thu', price: 7750 },
                      { day: 'Fri', price: 7790 },
                      { day: 'Sat', price: 7815 },
                      { day: 'Sun (Live)', price: liveGoldRate }
                    ]}>
                      <defs>
                        <linearGradient id="goldRateGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 700 }} />
                      <YAxis domain={['dataMin - 100', 'dataMax + 100']} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="price" stroke="#d97706" strokeWidth={3} fillOpacity={1} fill="url(#goldRateGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right: Gold Form Factor Breakdown */}
              <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-600" />
                  Physical Form Factor Breakdown
                </h3>

                <div className="space-y-3 pt-1">
                  {(goldHoldingsSummary?.formFactorBreakdown || [
                    { name: "24K Gold Coins (1g, 5g, 10g)", desc: "Minted & Sealed in Tamper-Proof Blisters", weight: "64.200 kg", percentage: "41.4%" },
                    { name: "24K Bullion Bars (50g, 100g, 1kg)", desc: "Hallmarked 99.99% Institutional Bars", weight: "70.450 kg", percentage: "45.5%" },
                    { name: "Unallocated Vault Reserve", desc: "Liquid Gold Balance for Daily SIPs", weight: "20.200 kg", percentage: "13.1%" }
                  ]).map((item: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-black text-slate-800">{item.name}</div>
                        <div className="text-[10px] font-bold text-slate-400">{item.desc}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black text-amber-600">{item.weight}</div>
                        <div className="text-[10px] font-bold text-slate-400">{item.percentage}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Table: Physical Vault Inventory & Trustee Audit Stream */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs space-y-3 p-5">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Physical Vault Storage & Trustee Audit Journal
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">Live custody logs, bullion deposit certificates, and trustee physical count audits.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => triggerToast("Exporting Vault Reserve Audit Ledger CSV...")}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl border-none cursor-pointer flex items-center gap-1.5"
                  >
                    <Download size={13} />
                    <span>Export Ledger CSV</span>
                  </button>
                  <button
                    onClick={handleTriggerTrusteeAuditScan}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3.5 py-1.5 rounded-xl border-none cursor-pointer flex items-center gap-1.5"
                  >
                    <ShieldCheck size={13} />
                    <span>Trigger Trustee Audit</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Batch / Audit Ref ID</th>
                      <th className="p-3.5">Vault Location</th>
                      <th className="p-3.5">Custodian Partner</th>
                      <th className="p-3.5">Movement Type</th>
                      <th className="p-3.5">Gold Weight (kg)</th>
                      <th className="p-3.5">Purity Certificate</th>
                      <th className="p-3.5">Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {(goldAuditJournal.length > 0 ? goldAuditJournal : [
                      { auditRefId: "VLT-2026-9812", vaultLocation: "Mumbai Brink's Vault", custodian: "Brink's India", movementType: "Bullion Deposit", weightFormatted: "+15.500 kg", purityCert: "BIS Hallmarked #MMTC-8921", auditStatus: "Verified & Insured" },
                      { auditRefId: "VLT-2026-9804", vaultLocation: "Bangalore Vistra Vault", custodian: "Vistra Trustee", movementType: "Trustee Audit Scan", weightFormatted: "42.100 kg", purityCert: "SEBI Audit Cert #VST-4491", auditStatus: "Audited & Verified" },
                      { auditRefId: "VLT-2026-9799", vaultLocation: "Delhi Brink's Vault", custodian: "Brink's India", movementType: "SIP Reserve Allocation", weightFormatted: "+8.250 kg", purityCert: "Augmont Hallmarked #AUG-3329", auditStatus: "Verified & Insured" },
                      { auditRefId: "VLT-2026-9788", vaultLocation: "Hyderabad Mint Reserve", custodian: "MMTC-PAMP", movementType: "Mint Coin Dispatch", weightFormatted: "-2.400 kg", purityCert: "Mint Assay Cert #PAMP-9912", auditStatus: "Dispatched to Doorstep" },
                      { auditRefId: "VLT-2026-9775", vaultLocation: "Mumbai Brink's Vault", custodian: "Brink's India", movementType: "Monthly Bullion Deposit", weightFormatted: "+25.000 kg", purityCert: "BIS Hallmarked #MMTC-7718", auditStatus: "Verified & Insured" },
                    ]).map((row: any, idx: number) => (
                      <tr key={row._id || row.auditRefId || idx} className="hover:bg-slate-50">
                        <td className="p-3.5 font-black text-slate-900 font-mono">{row.auditRefId}</td>
                        <td className="p-3.5 font-bold text-slate-800">{row.vaultLocation}</td>
                        <td className="p-3.5 font-semibold text-slate-700">{row.custodian}</td>
                        <td className="p-3.5 font-semibold text-slate-600">{row.movementType}</td>
                        <td className={`p-3.5 font-black ${String(row.weightFormatted).startsWith('+') ? 'text-emerald-600' : String(row.weightFormatted).startsWith('-') ? 'text-purple-600' : 'text-amber-600'}`}>
                          {row.weightFormatted}
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-slate-500">{row.purityCert}</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                            {row.auditStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 5. PAYOUTS & REDEMPTIONS PAGE */}
        {activeNav === "Payouts & Redemptions" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <h2 className="text-lg font-black text-slate-900">Payouts & Gold Redemption Approval Desk</h2>
              <p className="text-xs font-semibold text-slate-500">Approve user bank withdrawals and physical gold coin delivery dispatch with AMT Risk validation.</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Request ID & User</th>
                      <th className="p-3.5">AMT Risk Score</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Amount / Gold</th>
                      <th className="p-3.5">Payout Destination</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {payouts.map(pout => {
                      const amtInfo = getAmtScoreDetails(pout.amtScore);
                      return (
                        <tr key={pout.id} className="hover:bg-slate-50">
                          <td className="p-3.5">
                            <div className="font-black text-slate-900">{pout.userName}</div>
                            <div className="text-[10px] font-mono text-slate-400">{pout.id} • {pout.requestedDate}</div>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${amtInfo.badgeBg}`}>
                              {pout.amtScore}/100 • {amtInfo.label}
                            </span>
                          </td>
                          <td className="p-3.5 font-bold text-slate-800">{pout.type}</td>
                          <td className="p-3.5 font-black text-slate-900">{pout.amount} ({pout.goldGrams})</td>
                          <td className="p-3.5 font-semibold text-slate-600 max-w-xs truncate">{pout.bankDetails}</td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${pout.status === "Approved" || pout.status === "Dispatched" ? "bg-emerald-100 text-emerald-700" :
                              pout.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                              }`}>
                              {pout.status}
                            </span>
                          </td>
                          <td className="p-3.5">
                            {pout.status === "Pending" ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleApprovePayout(pout.id, pout.amtScore)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg font-bold text-[10px] transition-colors border-none cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectPayout(pout.id)}
                                  className="bg-red-50 hover:bg-red-100 text-red-600 px-2 py-1 rounded-lg font-bold text-[10px] transition-colors border-none cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400">Processed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6. TRANSACTIONS PAGE */}
        {activeNav === "Transactions" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <h2 className="text-lg font-black text-slate-900">System Financial Transactions Audit Stream</h2>
              <p className="text-xs font-semibold text-slate-500">Real-time payment gateway logs, Auto-SIP debits, and redemption receipts.</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Txn Ref ID</th>
                      <th className="p-3.5">User Name</th>
                      <th className="p-3.5">AMT Score</th>
                      <th className="p-3.5">Transaction Type</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Gold Credit</th>
                      <th className="p-3.5">Gateway</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {transactions.filter(t => t.userName.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase())).map(txn => {
                      const amtInfo = getAmtScoreDetails(txn.amtScore);
                      return (
                        <tr key={txn.id} className="hover:bg-slate-50">
                          <td className="p-3.5 font-mono font-bold text-slate-900">{txn.id}<br /><span className="text-[10px] text-slate-400 font-normal">{txn.refId}</span></td>
                          <td className="p-3.5 font-bold text-slate-800">{txn.userName}</td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${amtInfo.badgeBg}`}>
                              {txn.amtScore}/100
                            </span>
                          </td>
                          <td className="p-3.5 font-semibold text-slate-700">{txn.type}</td>
                          <td className="p-3.5 font-black text-slate-900">{txn.amount}</td>
                          <td className="p-3.5 font-bold text-amber-600">{txn.goldPurchased}</td>
                          <td className="p-3.5 font-semibold text-slate-500">{txn.gateway}</td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${txn.status === "Success" ? "bg-emerald-100 text-emerald-700" :
                              txn.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                              }`}>
                              {txn.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 7. USERS PAGE - WITH AML AUDIT SCORE CONTROLS */}
        {activeNav === "Users" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div>
                <h2 className="text-lg font-black text-slate-900">User Account & AML Audit Score Directory</h2>
                <p className="text-xs font-semibold text-slate-500">Manage user accounts, adjust AML risk scores, and control account suspension.</p>
              </div>

              {/* AML Risk Filter Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Filter by AML Risk:</span>
                <select
                  value={amlFilter}
                  onChange={(e) => setAmlFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-extrabold text-slate-800 focus:outline-none focus:border-purple-500"
                >
                  <option value="All">All Risk Levels</option>
                  <option value="Low Risk">Low Risk (&gt;80)</option>
                  <option value="Moderate Risk">Moderate Risk (50-80)</option>
                  <option value="High Risk">High Risk (&lt;50)</option>
                </select>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">User ID & Name</th>
                      <th className="p-3.5">Contact Details</th>
                      <th className="p-3.5">AML Audit Score</th>
                      <th className="p-3.5">Wallet Bal</th>
                      <th className="p-3.5">Gold Bal</th>
                      <th className="p-3.5">KYC Status</th>
                      <th className="p-3.5">Account Status</th>
                      <th className="p-3.5">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {isLoadingUsers ? (
                      <tr>
                        <td colSpan={8} className="p-12 text-center">
                          <LoadingSpinner size={60} className="mx-auto" />
                          <div className="text-xs font-bold text-slate-500 mt-2">Loading real user accounts from MongoDB database...</div>
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-12 text-center">
                          <Users className="mx-auto text-slate-300 mb-2" size={32} />
                          <div className="text-sm font-black text-slate-700">No Registered Users Found</div>
                          <div className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                            No user accounts are currently present in your MongoDB database. When new users sign up on the platform, they will appear here live without refreshing.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(usr => {
                        const userAmlScore = usr.amlScore !== undefined ? usr.amlScore : usr.amtScore;
                        const amlInfo = getAmlScoreDetails(userAmlScore);
                        const displayUserCode = usr.userCode || `FIP${String(usr.id).substring(0, 6).toUpperCase()}`;
                        return (
                          <tr key={usr.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3.5">
                              <div className="font-black text-slate-900 flex items-center gap-1.5">
                                <span>{usr.name}</span>
                              </div>
                              <div className="text-[10px] font-medium text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <span className="font-mono font-black text-[#7C3AED] bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200/80">
                                  {displayUserCode}
                                </span>
                                <span>• Joined {usr.joined}</span>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <div className="font-semibold text-slate-700">{usr.email}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{usr.phone}</div>
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${amlInfo.badgeBg}`}>
                                  {userAmlScore} / 100 • {amlInfo.label}
                                </span>
                                <button
                                  onClick={() => handleOpenAmtEditModal(usr)}
                                  className="text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-purple-50 border-none cursor-pointer"
                                  title="Edit AML Score"
                                >
                                  <Edit2 size={13} />
                                </button>
                              </div>
                            </td>
                            <td className="p-3.5 font-bold text-slate-900">{usr.walletBal}</td>
                            <td className="p-3.5 font-bold text-amber-600">{usr.goldBal}</td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                                <span className={`w-2 h-2 rounded-full ${usr.kycStatus === "Verified" ? "bg-emerald-500 shadow-xs" :
                                  usr.kycStatus === "Pending" ? "bg-amber-500 animate-pulse" : "bg-red-500"
                                  }`} />
                                <span>{usr.kycStatus}</span>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                                <span className={`w-2 h-2 rounded-full ${usr.status === "Active" ? "bg-emerald-500 shadow-xs" : "bg-red-500"
                                  }`} />
                                <span>{usr.status}</span>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => setSelectedViewUser(usr)}
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-extrabold text-[10px] border-none cursor-pointer flex items-center gap-1 transition-all"
                                  title="View Full User Details"
                                >
                                  <Eye size={12} className="text-slate-600" />
                                  <span>Info</span>
                                </button>
                                <button
                                  onClick={() => handleOpenAmlEditModal(usr)}
                                  className="bg-purple-50 hover:bg-purple-100 text-[#7C3AED] px-2.5 py-1 rounded-lg font-bold text-[10px] border-none cursor-pointer"
                                >
                                  Set AML
                                </button>
                                <button
                                  onClick={() => handleToggleUserStatus(usr.id)}
                                  className={`px-2.5 py-1 rounded-lg font-bold text-[10px] border-none cursor-pointer ${usr.status === "Active" ? "bg-red-50 hover:bg-red-100 text-red-600" : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                                    }`}
                                >
                                  {usr.status === "Active" ? "Freeze" : "Activate"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 8. KYC VERIFICATION PAGE */}
        {activeNav === "KYC Verification" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <h2 className="text-lg font-black text-slate-900">KYC Verification Queue & AML Audit Scores</h2>
              <p className="text-xs font-semibold text-slate-500">Review user identity documents, Aadhaar verification, and PAN authentication.</p>
            </div>

            {kycRequests.length === 0 ? (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-3 shadow-2xs">
                <div className="w-16 h-16 rounded-full bg-purple-50 text-[#7C3AED] flex items-center justify-center mx-auto font-black">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-base font-black text-slate-900">No KYC Verification Requests Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                  When users initiate KYC verification requests from their accounts, they will appear here live in real-time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kycRequests.map(req => {
                  const reqAmlScore = req.amlScore !== undefined ? req.amlScore : req.amtScore;
                  const amlInfo = getAmlScoreDetails(reqAmlScore);
                  return (
                    <div key={req.id || req._id} className="bg-[#FFFFFF] border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-black text-slate-900">{req.userName}</h3>
                          <div className="text-xs text-slate-500">{req.phone} • Submitted {req.submittedDate}</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${req.status === "Verified" ? "bg-emerald-100 text-emerald-700" :
                          req.status === "Pending" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                          }`}>
                          {req.status}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">AML Audit Score</div>
                          <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] border ${amlInfo.badgeBg}`}>
                            {reqAmlScore}/100 • {amlInfo.label}
                          </span>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">PAN Number</div>
                          <div className="font-mono font-bold text-slate-900">{req.panNo}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">Aadhaar Vault Ref</div>
                          <div className="font-mono font-bold text-slate-900">{req.aadhaarNo}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">AI Match Score</div>
                          <div className="font-bold text-emerald-600">{req.matchScore}</div>
                        </div>
                      </div>

                      {req.status === "Pending" ? (
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handleApproveKyc(req.id || req._id)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2 rounded-xl border-none cursor-pointer shadow-sm transition-all"
                          >
                            Approve KYC
                          </button>
                          <button
                            onClick={() => handleRejectKyc(req.id || req._id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-4 py-2 rounded-xl border-none cursor-pointer transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="text-[11px] font-bold text-slate-400 text-right pt-1">Verification audit completed</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 9. REFERRALS PAGE */}
        {activeNav === "Referrals" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Referral & Advocate Program</h2>
                <p className="text-xs font-semibold text-slate-500">Track user invite codes, bonus rewards, and advocate conversions with AMT Fraud Prevention.</p>
              </div>
              <button
                onClick={() => { fetchAdminReferrals(); fetchAdminReferralStats(); triggerToast("Refreshed live referral data!"); }}
                className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-purple-200 cursor-pointer transition-all shrink-0"
              >
                <RefreshCw size={14} className={isLoadingReferrals ? "animate-spin" : ""} />
                Refresh Data
              </button>
            </div>

            {/* Dynamic Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
                <div className="text-xs font-bold text-purple-700 uppercase">Total Bonus Distributed</div>
                <div className="text-2xl font-black text-purple-900 mt-1">{referralStats.totalBonusDistributed || "₹0"}</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <div className="text-xs font-bold text-emerald-700 uppercase">Total Active Advocates</div>
                <div className="text-2xl font-black text-emerald-900 mt-1">{referralStats.totalActiveAdvocates || "0 Users"}</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <div className="text-xs font-bold text-amber-700 uppercase">Conversion Rate</div>
                <div className="text-2xl font-black text-amber-900 mt-1">{referralStats.conversionRate || "0.0%"}</div>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone, code..."
                  value={referralSearchQuery}
                  onChange={(e) => setReferralSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter size={15} className="text-slate-400 shrink-0" />
                <select
                  value={referralStatusFilter}
                  onChange={(e) => setReferralStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Credited">Credited</option>
                  <option value="Joined">Joined</option>
                  <option value="KYC Completed">KYC Completed</option>
                  <option value="Gold Purchased">Gold Purchased</option>
                  <option value="Flagged Fraud">Flagged Fraud</option>
                </select>
              </div>
            </div>

            {/* Table or Loading / Empty state */}
            {isLoadingReferrals && referrals.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
                <LoadingSpinner />
                <p className="text-xs font-bold text-slate-500 mt-3">Loading live referral tracking data...</p>
              </div>
            ) : referrals.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
                <Share2 size={36} className="mx-auto text-slate-300 mb-2" />
                <h3 className="text-sm font-black text-slate-700">No Referral Records Found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Referrals generated by platform advocates will automatically synchronize here live.</p>
              </div>
            ) : (
              <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Ref ID</th>
                        <th className="p-3.5">Referrer (Advocate)</th>
                        <th className="p-3.5">AML Risk Score</th>
                        <th className="p-3.5">Referee (New User)</th>
                        <th className="p-3.5">Referral Code</th>
                        <th className="p-3.5">Reward Status</th>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5">Progression & Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {referrals
                        .filter(ref => {
                          const matchesStatus = referralStatusFilter === "All" || ref.status === referralStatusFilter;
                          const query = referralSearchQuery.toLowerCase();
                          const matchesQuery = !query ||
                            (ref.referrer && ref.referrer.toLowerCase().includes(query)) ||
                            (ref.referee && ref.referee.toLowerCase().includes(query)) ||
                            (ref.code && ref.code.toLowerCase().includes(query)) ||
                            (ref.refId && ref.refId.toLowerCase().includes(query)) ||
                            (ref.referrerMobile && ref.referrerMobile.includes(query)) ||
                            (ref.refereeMobile && ref.refereeMobile.includes(query));
                          return matchesStatus && matchesQuery;
                        })
                        .map(ref => {
                          const score = ref.amlScore !== undefined ? ref.amlScore : (ref.amtScore || 90);
                          const amlInfo = getAmlScoreDetails(score);
                          return (
                            <tr key={ref.refId || ref.id || ref._id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3.5 font-mono font-bold text-slate-900">{ref.refId || ref.id}</td>
                              <td className="p-3.5 font-bold text-slate-900">
                                {ref.referrer}
                                {ref.referrerMobile && <div className="text-[10px] text-slate-400 font-normal">{ref.referrerMobile}</div>}
                              </td>
                              <td className="p-3.5">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${amlInfo.badgeBg}`}>
                                  {score}/100
                                </span>
                              </td>
                              <td className="p-3.5 font-semibold text-slate-700">
                                {ref.referee}
                                {ref.refereeMobile && <div className="text-[10px] text-slate-400 font-normal">{ref.refereeMobile}</div>}
                              </td>
                              <td className="p-3.5 font-mono font-bold text-purple-600">{ref.code}</td>
                              <td className="p-3.5 whitespace-nowrap">
                                <div className="font-black text-slate-900">{ref.reward || "₹100 Gold"}</div>
                                {ref.status === "Credited" ? (
                                  <span className="inline-block text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mt-0.5">
                                    Credited
                                  </span>
                                ) : (
                                  <span className="inline-block text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full mt-0.5">
                                    Reward Pending
                                  </span>
                                )}
                              </td>
                              <td className="p-3.5 text-slate-500">{ref.date}</td>
                              <td className="p-3.5 space-y-1">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${ref.status === "Credited" ? "bg-emerald-100 text-emerald-700" :
                                  ref.status === "Flagged Fraud" ? "bg-red-100 text-red-700" :
                                    ref.status === "Gold Purchased" ? "bg-purple-100 text-purple-700" :
                                      ref.status === "KYC Completed" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                                  }`}>
                                  {ref.status}
                                </span>
                                {ref.stepLabel && (
                                  <div className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                                    {ref.eligibleForCredit || ref.status === "Credited" ? (
                                      <CheckCircle2 size={11} className="text-emerald-600 shrink-0 inline" />
                                    ) : (
                                      <Clock size={11} className="text-amber-500 shrink-0 inline" />
                                    )}
                                    <span>{ref.stepLabel}</span>
                                  </div>
                                )}
                              </td>
                              <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                                {ref.status === "Credited" ? (
                                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                                    Reward Granted
                                  </span>
                                ) : ref.eligibleForCredit || ref.status === "Gold Purchased" ? (
                                  <button
                                    onClick={() => handleUpdateReferralStatus(ref.refId || ref.id || ref._id, "Credited")}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg border-none cursor-pointer shadow-2xs transition-all animate-pulse"
                                    title="All steps completed! Click to credit ₹100 gold reward"
                                  >
                                    Credit Reward
                                  </button>
                                ) : (
                                  <span
                                    className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 cursor-not-allowed inline-block"
                                    title="Credit button enables only after referee completes KYC & buys ₹250+ Gold"
                                  >
                                    Credit Locked
                                  </span>
                                )}
                                {ref.status !== "Flagged Fraud" && (
                                  <button
                                    onClick={() => handleUpdateReferralStatus(ref.refId || ref.id || ref._id, "Flagged Fraud")}
                                    className="bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-lg border border-amber-200 cursor-pointer transition-all"
                                    title="Flag Fraud"
                                  >
                                    Flag Fraud
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteReferral(ref.refId || ref.id || ref._id)}
                                  className="bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-lg border border-red-200 cursor-pointer transition-all"
                                  title="Delete Record"
                                >
                                  <Trash2 size={12} className="inline" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BBPS BILLS & RECHARGES PAGE */}
        {activeNav === "BBPS & Recharges" && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900">BBPS Bills & Recharges Control Desk</h2>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    NPCI BBPS Active
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500">Monitor live bill payments, mobile recharges, NPCI settlement statuses, and 24K Gold cashback rewards.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchBbpsTransactions()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer border-none transition-all"
                >
                  <RefreshCw size={14} className={isLoadingBbps ? "animate-spin" : ""} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={() => setShowSimulateBbpsModal(true)}
                  className="bg-[#7C3AED] hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer outline-none border-none"
                >
                  <Plus size={16} />
                  <span>Simulate BBPS Txn</span>
                </button>
              </div>
            </div>

            {/* Summary Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-slate-500">Total BBPS Volume</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center">
                    <Receipt size={17} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{bbpsSummary.totalVolume || "₹0"}</div>
                <div className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                  <ArrowUpRight size={13} />
                  <span>+18.4% this month</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-slate-500">Total Transactions</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Smartphone size={17} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{bbpsSummary.totalCount || bbpsTxns.length}</div>
                <div className="text-[11px] font-bold text-slate-500 mt-1">
                  Success Rate: <span className="text-emerald-600 font-extrabold">{bbpsSummary.successRate || "98.4%"}</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-slate-500">24K Gold Cashback</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Coins size={17} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{bbpsSummary.totalGoldCashback || "0.000 g Gold"}</div>
                <div className="text-[11px] font-bold text-amber-600 mt-1">
                  Rewarded directly to user gold lockers
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-slate-500">NPCI Network Latency</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Zap size={17} />
                  </div>
                </div>
                <div className="text-xl font-black text-slate-900">{bbpsSummary.npciStatus || "ONLINE"}</div>
                <div className="text-[11px] font-bold text-emerald-600 mt-1">
                  Avg response: 120 ms
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by Txn ID, User Name, Biller, Mobile..."
                    value={bbpsSearchQuery}
                    onChange={(e) => setBbpsSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
                  <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Category:</span>
                  {['All', 'Mobile Recharge', 'Electricity', 'DTH', 'LPG Gas', 'Fastag', 'Water Bill', 'Broadband'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setBbpsCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap cursor-pointer transition-all border-none ${
                        bbpsCategoryFilter === cat
                          ? 'bg-[#7C3AED] text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <span className="text-xs font-bold text-slate-500">Status:</span>
                  <select
                    value={bbpsStatusFilter}
                    onChange={(e) => setBbpsStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-purple-500"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Success">Success</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Txn ID & NPCI Ref</th>
                      <th className="p-3.5">User Details</th>
                      <th className="p-3.5">Biller & Category</th>
                      <th className="p-3.5">Consumer / Acc No</th>
                      <th className="p-3.5">Amount Paid</th>
                      <th className="p-3.5">24K Gold Cashback</th>
                      <th className="p-3.5">Gateway</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {isLoadingBbps && bbpsTxns.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center">
                          <LoadingSpinner />
                          <span className="block mt-2 font-bold text-slate-500">Loading BBPS Bill Transactions...</span>
                        </td>
                      </tr>
                    ) : bbpsTxns.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-slate-400 font-bold">
                          No BBPS transactions found.
                        </td>
                      </tr>
                    ) : (
                      bbpsTxns
                        .filter(t => {
                          const matchesSearch =
                            t.txnId.toLowerCase().includes(bbpsSearchQuery.toLowerCase()) ||
                            t.userName.toLowerCase().includes(bbpsSearchQuery.toLowerCase()) ||
                            t.billerName.toLowerCase().includes(bbpsSearchQuery.toLowerCase()) ||
                            t.accountNumber.includes(bbpsSearchQuery);
                          const matchesCategory = bbpsCategoryFilter === 'All' || t.category === bbpsCategoryFilter;
                          const matchesStatus = bbpsStatusFilter === 'All' || t.status === bbpsStatusFilter;
                          return matchesSearch && matchesCategory && matchesStatus;
                        })
                        .map((t) => (
                          <tr key={t._id || t.txnId} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3.5 font-mono font-bold text-slate-900">
                              {t.txnId}
                              <div className="text-[10px] text-slate-400 font-normal">{t.bbpsRefNo}</div>
                            </td>
                            <td className="p-3.5">
                              <div className="font-extrabold text-slate-900">{t.userName}</div>
                              <div className="text-[10px] font-semibold text-slate-400">{t.userPhone}</div>
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-slate-800">{t.billerName}</div>
                              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-purple-50 text-[#7C3AED]">
                                {t.category}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono font-semibold text-slate-700">{t.accountNumber}</td>
                            <td className="p-3.5 font-black text-slate-900">₹{t.amount.toLocaleString('en-IN')}</td>
                            <td className="p-3.5">
                              {t.goldCashbackEarned && t.goldCashbackEarned > 0 ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                                  <Coins size={12} className="text-amber-500" />
                                  {t.goldCashbackFormatted || `+${t.goldCashbackEarned} g Gold`}
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[10px] font-semibold">No Gold Cashback</span>
                              )}
                            </td>
                            <td className="p-3.5 font-bold text-slate-600 text-[11px]">{t.paymentGateway}</td>
                            <td className="p-3.5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1 ${
                                  t.status === 'Success'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : t.status === 'Pending'
                                    ? 'bg-amber-100 text-amber-800'
                                    : t.status === 'Failed'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {t.status}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedBbpsReceipt(t)}
                                  className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#7C3AED] font-extrabold text-[11px] border-none cursor-pointer flex items-center gap-1"
                                >
                                  <Eye size={12} />
                                  <span>Receipt</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 10. REPORTS & ANALYTICS PAGE */}
        {activeNav === "Reports & Analytics" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <h2 className="text-lg font-black text-slate-900">Platform Analytics & Financial Telemetry</h2>
              <p className="text-xs font-semibold text-slate-500">Comprehensive breakdown of monthly AUM growth, transaction fees, and user retention.</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-black text-slate-900">Download Platform Telemetry Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => triggerToast("Exporting AMT Security & AML Audit Report (CSV)...")}
                  className="bg-purple-50 hover:bg-purple-100 text-[#7C3AED] p-4 rounded-xl font-bold text-xs flex items-center justify-between border border-purple-200 cursor-pointer"
                >
                  <span>AMT Security & AML Audit CSV</span>
                  <Download size={16} />
                </button>
                <button
                  onClick={() => triggerToast("Exporting User KYC Telemetry (CSV)...")}
                  className="bg-purple-50 hover:bg-purple-100 text-[#7C3AED] p-4 rounded-xl font-bold text-xs flex items-center justify-between border border-purple-200 cursor-pointer"
                >
                  <span>User KYC Audit Report</span>
                  <Download size={16} />
                </button>
                <button
                  onClick={() => triggerToast("Exporting Daily SIP Collections Report (CSV)...")}
                  className="bg-purple-50 hover:bg-purple-100 text-[#7C3AED] p-4 rounded-xl font-bold text-xs flex items-center justify-between border border-purple-200 cursor-pointer"
                >
                  <span>SIP Collections Ledger</span>
                  <Download size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 11. LEDGER & SETTLEMENTS PAGE */}
        {activeNav === "Ledger & Settlements" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <h2 className="text-lg font-black text-slate-900">Nodal Bank Account Ledger & Gateway Settlements</h2>
              <p className="text-xs font-semibold text-slate-500">Reconcile Razorpay/PhonePe payment gateway batch settlements.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-2xl">
                <div className="text-xs text-slate-400 font-bold uppercase">Nodal Account Balance</div>
                <div className="text-2xl font-black text-slate-900 mt-1">₹1.85 Cr</div>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-2xl">
                <div className="text-xs text-slate-400 font-bold uppercase">Daily Net Settled</div>
                <div className="text-2xl font-black text-emerald-600 mt-1">₹42.50 L</div>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-2xl">
                <div className="text-xs text-slate-400 font-bold uppercase">Gateway Fees Deducted</div>
                <div className="text-2xl font-black text-slate-700 mt-1">₹42,500</div>
              </div>
            </div>
          </div>
        )}

        {/* 12. FEES & CHARGES PAGE */}
        {activeNav === "Fees & Charges" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <h2 className="text-lg font-black text-slate-900">Fee Configuration & Spread Matrix</h2>
              <p className="text-xs font-semibold text-slate-500">Configure platform convenience fees, gold sell spreads, and vault storage charges.</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4 max-w-xl">
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gold Purchase Convenience Fee (%)</label>
                  <input type="text" defaultValue="1.50%" className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gold Sell Spread (%)</label>
                  <input type="text" defaultValue="1.00%" className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Annual Vault Locker Insurance Fee</label>
                  <input type="text" defaultValue="₹0 (Free Lifetime)" className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold" />
                </div>
              </div>
              <button
                onClick={() => triggerToast("Fee Matrix settings updated & saved successfully!")}
                className="bg-[#7C3AED] hover:bg-purple-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl cursor-pointer border-none shadow-md"
              >
                Save Fee Structure
              </button>
            </div>
          </div>
        )}

        {/* 13. NOTIFICATIONS PAGE */}
        {activeNav === "Notifications" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div>
                <h2 className="text-lg font-black text-slate-900">Push Notifications & Broadcast Desk</h2>
                <p className="text-xs font-semibold text-slate-500">Send announcements, offer updates, and SMS alerts to users.</p>
              </div>
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="bg-[#7C3AED] hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md cursor-pointer border-none"
              >
                <Send size={15} />
                <span>New Broadcast</span>
              </button>
            </div>
          </div>
        )}

        {/* 16. EMAIL TEMPLATES & SYSTEM MAIL PAGE (REDESIGNED TO MATCH REFERENCE IMAGE EXACTLY) */}
        {activeNav === "Email Templates" && (
          <div className="space-y-6">

            {/* TOP STAT CARDS (3 GRID CARDS MATCHING REFERENCE IMAGE) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Card 1: Total Users */}
              <div className="bg-white border border-purple-100 rounded-3xl p-5 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100/70 text-[#7C3AED] flex items-center justify-center shrink-0">
                  <Users size={22} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400">Total Users</div>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">{users.length || 93}</div>
                </div>
              </div>

              {/* Card 2: Selected Users */}
              <div className="bg-white border border-blue-100 rounded-3xl p-5 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
                  <CheckSquare size={22} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400">Selected Users</div>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">{selectedRecipientEmails.length}</div>
                </div>
              </div>

              {/* Card 3: Saved Templates */}
              <div className="bg-white border border-emerald-100 rounded-3xl p-5 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0">
                  <FileText size={22} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400">Saved Templates</div>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">{emailTemplates.length}</div>
                </div>
              </div>

            </div>

            {/* MAIN 2-COLUMN EMAIL DASHBOARD */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* LEFT COLUMN: SELECT RECIPIENTS (5 cols) */}
              <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="text-[#7C3AED]" size={20} />
                    <h3 className="text-base font-black text-slate-900">Select Recipients</h3>
                  </div>

                  {/* SEARCH BAR */}
                  <div className="relative mb-3">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchRecipientQuery}
                      onChange={(e) => setSearchRecipientQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-purple-500 transition-all"
                    />
                  </div>

                  {/* SELECT ALL / DESELECT ALL ACTION BUTTONS */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      type="button"
                      onClick={handleToggleSelectAllRecipients}
                      className="bg-purple-100/80 hover:bg-purple-200 text-[#7C3AED] font-extrabold text-xs py-2 rounded-xl border-none cursor-pointer transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRecipientEmails([])}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-2 rounded-xl border-none cursor-pointer transition-colors"
                    >
                      Deselect All
                    </button>
                  </div>

                  {/* SCROLLABLE USERS LIST */}
                  <div className="max-h-[460px] overflow-y-auto space-y-2 pr-1 hide-scrollbar">
                    {filteredRecipientUsers.map((u) => {
                      const isChecked = selectedRecipientEmails.includes(u.email);
                      return (
                        <label
                          key={u.id}
                          className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${isChecked
                            ? "bg-purple-50/60 border-purple-300 shadow-2xs"
                            : "bg-white border-slate-200/80 hover:bg-slate-50/80"
                            }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleRecipientEmail(u.email)}
                            className="mt-0.5 accent-[#7C3AED] w-4 h-4 rounded cursor-pointer shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-extrabold text-xs text-slate-900 truncate">{u.name}</div>
                            <div className="text-[11px] text-slate-400 font-medium truncate mt-0.5">{u.email}</div>
                            <div className="text-[10px] font-mono font-bold text-purple-600 mt-1">
                              #{u.userCode || 'FIP' + String(u.id).substring(0, 5).toUpperCase()}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: TEMPLATES & COMPOSE EMAIL (7 cols) */}
              <div className="lg:col-span-7 space-y-6">

                {/* TEMPLATES BLOCK */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="text-[#7C3AED]" size={20} />
                      <h3 className="text-base font-black text-slate-900">Templates</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleWipeAllTemplates}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs px-3 py-2 rounded-xl flex items-center gap-1 border border-red-200 cursor-pointer transition-colors"
                      >
                        <Trash2 size={13} />
                        <span>Wipe All</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTemplateForm({
                            templateId: `TEMPLATE_${Date.now()}`,
                            name: "",
                            subject: "",
                            category: "Authentication",
                            htmlContent: "<html>\n<body>\n  <h2>Hello {{userName}},</h2>\n  <p>Your email body content here...</p>\n</body>\n</html>",
                            variables: "userName, mobileNumber, otp"
                          });
                          setShowTemplateEditorModal(true);
                        }}
                        className="bg-[#10B981] hover:bg-emerald-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 border-none cursor-pointer shadow-xs transition-colors"
                      >
                        <Plus size={14} />
                        <span>New Template</span>
                      </button>
                    </div>
                  </div>

                  {/* SELECT TEMPLATE DROPDOWN */}
                  <div>
                    <select
                      value={selectedTemplateForCompose}
                      onChange={(e) => handleSelectTemplateForCompose(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer"
                    >
                      <option value="">-- Select a template --</option>
                      {emailTemplates.map((t) => (
                        <option key={t.templateId} value={t.templateId}>
                          {t.name} ({t.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* SAVED TEMPLATES LIST */}
                  <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1 hide-scrollbar">
                    {emailTemplates.length === 0 ? (
                      <div className="p-4 text-center text-xs font-semibold text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        No email templates found in EmailTemplate model database. Click "New Template" to create one.
                      </div>
                    ) : (
                      emailTemplates.map((tmpl) => (
                        <div
                          key={tmpl.templateId}
                          className="flex items-center justify-between bg-slate-50/70 border border-slate-200/70 p-3.5 rounded-2xl hover:bg-purple-50/50 transition-colors group"
                        >
                          <div>
                            <div className="font-extrabold text-xs text-slate-900">{tmpl.name}</div>
                            <span className="inline-block text-[9px] font-black uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full mt-1">
                              {tmpl.category || 'NOTIFICATION'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                handleSelectTemplateForCompose(tmpl.templateId);
                                setFullPreviewData({
                                  isOpen: true,
                                  name: tmpl.name || tmpl.templateId,
                                  subject: tmpl.subject || "(No Subject)",
                                  category: tmpl.category || "NOTIFICATION",
                                  templateId: tmpl.templateId,
                                  htmlContent: tmpl.htmlContent || tmpl.body || "",
                                  variablesMap: composeVariables
                                });
                              }}
                              title="Full View Preview Template"
                              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-100/70 transition-colors border-none cursor-pointer flex items-center gap-1 font-bold text-xs"
                            >
                              <Eye size={15} />
                              <span className="hidden sm:inline text-[11px]">Preview</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setTemplateForm({
                                  templateId: tmpl.templateId,
                                  name: tmpl.name,
                                  subject: tmpl.subject,
                                  category: tmpl.category || 'Onboarding',
                                  htmlContent: tmpl.htmlContent,
                                  variables: Array.isArray(tmpl.variables) ? tmpl.variables.join(', ') : tmpl.variables
                                });
                                setShowTemplateEditorModal(true);
                              }}
                              title="Edit Template"
                              className="p-1.5 rounded-lg text-[#7C3AED] hover:bg-purple-100/70 transition-colors border-none cursor-pointer"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteEmailTemplate(tmpl.templateId)}
                              title="Delete Template"
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-100/70 transition-colors border-none cursor-pointer"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* COMPOSE EMAIL BLOCK */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="text-[#7C3AED]" size={20} />
                    <h3 className="text-base font-black text-slate-900">Compose Email</h3>
                  </div>

                  <form onSubmit={handleSendComposeEmail} className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1.5">Subject *</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter email subject..."
                        value={composeSubject}
                        onChange={(e) => setComposeSubject(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-purple-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1.5">Body (HTML Supported) *</label>
                      <textarea
                        rows={6}
                        required
                        placeholder="Enter email body..."
                        value={composeBody}
                        onChange={(e) => {
                          setComposeBody(e.target.value);
                          syncComposeVariables(composeSubject, e.target.value);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-mono font-medium focus:outline-none focus:border-purple-500 leading-relaxed transition-all"
                      />
                    </div>

                    {/* DYNAMIC TEMPLATE VARIABLES & PUBLIC ASSET VALUES GRID */}
                    {Object.keys(composeVariables).length > 0 && (
                      <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles size={15} className="text-[#7C3AED]" />
                            <span className="font-extrabold text-xs text-purple-950">Template Variables & Public Image URLs ({Object.keys(composeVariables).length})</span>
                          </div>
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                            Values replace &#123;&#123;tags&#125;&#125; in email
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1 hide-scrollbar">
                          {Object.keys(composeVariables).map((vKey) => {
                            const isDefaultAsset = Boolean(getDynamicVariableDefaults()[vKey]);
                            return (
                              <div key={vKey} className="bg-white border border-purple-100 p-2.5 rounded-xl shadow-2xs space-y-1">
                                <div className="flex items-center justify-between">
                                  <label className="font-mono text-[10px] font-black text-slate-800 truncate" title={vKey}>
                                    &#123;&#123;{vKey}&#125;&#125;
                                  </label>
                                  {isDefaultAsset && (
                                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                      Public Asset
                                    </span>
                                  )}
                                </div>
                                <input
                                  type="text"
                                  value={composeVariables[vKey]}
                                  onChange={(e) => setComposeVariables({ ...composeVariables, [vKey]: e.target.value })}
                                  placeholder={`Enter value for ${vKey}...`}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-700 focus:outline-none focus:border-purple-500"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ACTION FOOTER */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => {
                            if (!composeSubject && !composeBody) {
                              triggerToast("Please enter email subject and body to preview", "error");
                              return;
                            }
                            setFullPreviewData({
                              isOpen: true,
                              name: selectedTemplateForCompose ? (emailTemplates.find(t => t.templateId === selectedTemplateForCompose)?.name || "Compose Email Preview") : "Compose Email Preview",
                              subject: composeSubject || "(No Subject)",
                              category: "Compose Email",
                              templateId: selectedTemplateForCompose || "CUSTOM",
                              htmlContent: composeBody,
                              variablesMap: composeVariables
                            });
                          }}
                          className="w-full sm:w-auto border-2 border-amber-500 text-amber-600 hover:bg-amber-50 font-extrabold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                        >
                          <Eye size={15} />
                          <span>Preview Email</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveComposeAsTemplate}
                          className="w-full sm:w-auto border-2 border-[#10B981] text-[#10B981] hover:bg-emerald-50 font-extrabold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                        >
                          <Save size={15} />
                          <span>Save Template</span>
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={isSendingComposeEmail}
                        className="w-full sm:flex-1 bg-[#7C3AED] hover:bg-purple-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl cursor-pointer shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Send size={15} />
                        <span>
                          {isSendingComposeEmail
                            ? "Sending Email..."
                            : `Send to ${selectedRecipientEmails.length} User${selectedRecipientEmails.length === 1 ? "" : "s"}`}
                        </span>
                      </button>
                    </div>
                  </form>
                </div>

              </div>

            </div>

            {/* EMAIL AUDIT LOGS */}
            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-2xs mt-6">
              <div className="p-5 border-b border-slate-200/80 bg-slate-50 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-black text-slate-900">Email Delivery Audit Logs</h3>
                  <span className="text-xs font-bold text-slate-400">
                    Showing Top {Math.min(logLimit, emailLogs.length)} of {emailLogs.length} Records
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500">Records Limit:</span>
                  <select
                    value={logLimit}
                    onChange={(e) => setLogLimit(Number(e.target.value))}
                    className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value={5}>Top 5 Records</option>
                    <option value={10}>Top 10 Records</option>
                    <option value={20}>Top 20 Records</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-400 font-black text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Log ID</th>
                      <th className="p-3.5">Recipient Email</th>
                      <th className="p-3.5">Template / Subject</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Sent Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {emailLogs.slice(0, logLimit).map((log) => (
                      <tr key={log.id || log.logId} className="hover:bg-slate-50">
                        <td className="p-3.5 font-mono font-bold text-slate-900">{log.logId || log.id}</td>
                        <td className="p-3.5 font-bold text-purple-700">{log.toEmail}</td>
                        <td className="p-3.5 font-semibold text-slate-800">{log.subject || log.templateId}</td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${log.status === "SENT" || log.status === "Success" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                            }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500 font-mono text-[11px]">{log.sentAt || log.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* EMAIL MARKETING & CAMPAIGNS PAGE */}
        {activeNav === "Email Marketing" && (
          <div className="space-y-6">
            {/* Header Desk */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900">Email Marketing & Zoho Campaign Desk</h2>
                  <span className="bg-purple-100 text-purple-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse"></span>
                    Zoho Campaigns Service Active
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  Create HTML marketing campaigns, target specific user groups (All Users, KYC Verified, DGA Waitlist, Custom List), preview email layouts, and broadcast live campaigns.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(`${API_BASE_URL}/admin/zoho-oauth/config`);
                      const json = await res.json();
                      if (json.success) {
                        setRedirectUriInfo(json);
                        if (json.clientId) setZohoKeys(prev => ({ ...prev, clientId: json.clientId }));
                      }
                    } catch (e) {}
                    setShowZohoConnectModal(true);
                  }}
                  className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 border border-purple-200 cursor-pointer"
                >
                  <Settings size={14} />
                  <span>Zoho API Keys & Redirect URIs</span>
                </button>

                <button
                  onClick={fetchEmailCampaigns}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 border-none cursor-pointer"
                >
                  <RefreshCw size={14} className={isLoadingCampaigns ? "animate-spin" : ""} />
                  <span>Refresh List</span>
                </button>

                <button
                  onClick={() => {
                    setCampaignForm({
                      campaignId: "",
                      title: "",
                      subject: "",
                      category: "Marketing",
                      fromEmail: "info@fipmoney.com",
                      htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h2 style="color: #6d28d9; margin: 0; font-size: 24px;">Fipmoney Digital Gold</h2>
    <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Instant 24K Gold Savings & SIP</p>
  </div>
  <h3 style="color: #1e293b; font-size: 18px;">Hello {{ userName }},</h3>
  <p style="color: #334155; line-height: 1.6; font-size: 14px;">We are excited to share an exclusive update! Start your 24K Digital Gold SIP on Fipmoney today and earn instant gold rewards directly into your vault.</p>
  <div style="text-align: center; margin: 32px 0;">
    <a href="{{ baseUrl }}" style="background-color: #6d28d9; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; display: inline-block;">Start 24K Gold SIP Now</a>
  </div>
  <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
  <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">Your Referral Code: <strong>{{ referralCode }}</strong> | Need help? Contact {{ supportEmail }}</p>
</div>`,
                      targetAudience: "ALL_USERS",
                      targetEmailsText: "",
                    });
                    setShowCampaignModal(true);
                  }}
                  className="bg-[#6d28d9] hover:bg-[#5b21b6] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md cursor-pointer border-none"
                >
                  <Plus size={16} />
                  <span>Create Campaign</span>
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase">Total Campaigns</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{emailCampaigns.length}</div>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                  <Mail size={22} />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold text-emerald-500 uppercase">Sent / Broadcasted</div>
                  <div className="text-2xl font-black text-emerald-600 mt-1">
                    {emailCampaigns.filter(c => c.status === "SENT").length}
                  </div>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                  <Send size={22} />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold text-blue-500 uppercase">Sender Email</div>
                  <div className="text-xs font-black text-blue-700 mt-1 truncate max-w-[150px]" title="info@fipmoney.com">
                    info@fipmoney.com
                  </div>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                  <ShieldCheck size={22} />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold text-amber-500 uppercase">Delivery Network</div>
                  <div className="text-xs font-black text-amber-700 mt-1">Zoho ZeptoMail API</div>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                  <Zap size={22} />
                </div>
              </div>
            </div>

            {/* Campaign Table */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-400 font-black text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Campaign Title & Subject</th>
                      <th className="p-3.5">Target Audience</th>
                      <th className="p-3.5">Sender Email</th>
                      <th className="p-3.5">Delivery Stats</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Date Created</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {isLoadingCampaigns ? (
                      <tr>
                        <td colSpan={7} className="p-10 text-center">
                          <LoadingSpinner size={40} className="mx-auto" />
                          <div className="text-xs font-bold text-slate-500 mt-2">Loading email campaigns...</div>
                        </td>
                      </tr>
                    ) : emailCampaigns.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-10 text-center text-slate-400 font-semibold">
                          No email marketing campaigns created yet. Click "Create Campaign" to set up your first email broadcast!
                        </td>
                      </tr>
                    ) : (
                      emailCampaigns.map(c => (
                        <tr key={c._id || c.campaignId} className="hover:bg-purple-50/30 transition-colors">
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">{c.title}</div>
                            <div className="text-[11px] text-slate-500 truncate max-w-xs">{c.subject}</div>
                          </td>
                          <td className="p-3.5">
                            <span className="bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded text-[11px] border border-purple-200">
                              {c.targetAudience === "ALL_USERS" ? "All Platform Users" :
                               c.targetAudience === "KYC_VERIFIED" ? "KYC Verified Users" :
                               c.targetAudience === "DGA_AGENTS" ? "DGA Waitlist Agents" : "Specific Users List"}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-700 font-mono text-[11px]">{c.fromEmail || "info@fipmoney.com"}</td>
                          <td className="p-3.5">
                            {c.stats?.sentCount !== undefined ? (
                              <div className="text-xs">
                                <span className="font-bold text-emerald-600">{c.stats.sentCount} Sent</span>
                                {c.stats.failedCount > 0 && <span className="text-rose-500 font-bold ml-1">({c.stats.failedCount} Failed)</span>}
                              </div>
                            ) : (
                              <span className="text-slate-400">Not Sent</span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              c.status === "SENT" ? "bg-emerald-100 text-emerald-800" :
                              c.status === "SENDING" ? "bg-amber-100 text-amber-800 animate-pulse" :
                              "bg-slate-100 text-slate-600"
                            }`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-400 text-[11px]">
                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "Today"}
                          </td>
                          <td className="p-3.5 text-right space-x-1.5 flex items-center justify-end">
                            <button
                              onClick={() => handleSendCampaignNow(c.campaignId)}
                              disabled={isSendingCampaign}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-lg border-none cursor-pointer disabled:opacity-50 flex items-center gap-1"
                              title="Send Email Campaign"
                            >
                              <Send size={11} />
                              <span>Send Now</span>
                            </button>
                            {c.zohoCampaignId && (
                              <button
                                onClick={() => handleRefreshCampaignStats(c.campaignId)}
                                className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[11px] px-2 py-1 rounded-lg border border-purple-200 cursor-pointer flex items-center gap-1"
                                title="Sync Live Stats from Zoho Campaigns"
                              >
                                <RefreshCw size={11} />
                                <span>Stats</span>
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setCampaignForm({
                                  campaignId: c.campaignId,
                                  title: c.title,
                                  subject: c.subject,
                                  category: c.category || "Marketing",
                                  fromEmail: c.fromEmail || "info@fipmoney.com",
                                  htmlContent: c.htmlContent,
                                  targetAudience: c.targetAudience || "ALL_USERS",
                                  targetEmailsText: Array.isArray(c.targetEmails) ? c.targetEmails.join("\n") : "",
                                });
                                setShowCampaignModal(true);
                              }}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] px-2 py-1 rounded-lg border-none cursor-pointer flex items-center gap-1"
                            >
                              <Edit2 size={11} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteCampaign(c.campaignId)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[11px] px-2 py-1 rounded-lg border border-rose-200 cursor-pointer flex items-center gap-1"
                              title="Delete Campaign"
                            >
                              <Trash2 size={11} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CREATE / EDIT EMAIL CAMPAIGN MODAL */}
        <AnimatePresence>
          {showCampaignModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
              >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div>
                    <h3 className="font-black text-slate-900 text-base">
                      {campaignForm.campaignId ? "Edit Email Campaign" : "Create New Email Marketing Campaign"}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Design HTML email template and configure broadcast audience</p>
                  </div>
                  <button
                    onClick={() => setShowCampaignModal(false)}
                    className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 border-none cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Title (Internal Name)</label>
                      <input
                        type="text"
                        placeholder="e.g. Festival 24K Gold Offer 2026"
                        value={campaignForm.title}
                        onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Subject Line (With Dynamic Tags)</label>
                      <input
                        type="text"
                        placeholder="e.g. Special Gold Reward for {{ userName }}!"
                        value={campaignForm.subject}
                        onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sender Email</label>
                      <select
                        value={campaignForm.fromEmail}
                        onChange={(e) => setCampaignForm({ ...campaignForm, fromEmail: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600 bg-white"
                      >
                        <option value="info@fipmoney.com">info@fipmoney.com (Marketing)</option>
                        <option value="support@fipmoney.com">support@fipmoney.com (Support)</option>
                        <option value="payments@fipmoney.com">payments@fipmoney.com (Payments)</option>
                        <option value="no-reply@fipmoney.com">no-reply@fipmoney.com (No-Reply)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                      <select
                        value={campaignForm.category}
                        onChange={(e) => setCampaignForm({ ...campaignForm, category: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600 bg-white"
                      >
                        <option value="Marketing">Marketing / Promotional</option>
                        <option value="Newsletter">Newsletter / Announcement</option>
                        <option value="Agent Updates">Agent & Partner Updates</option>
                        <option value="Transactional">Transactional Update</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                      <select
                        value={campaignForm.targetAudience}
                        onChange={(e) => setCampaignForm({ ...campaignForm, targetAudience: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600 bg-white"
                      >
                        <option value="ALL_USERS">All Platform Users</option>
                        <option value="KYC_VERIFIED">KYC Verified Users Only</option>
                        <option value="DGA_AGENTS">DGA Waitlist Agents</option>
                        <option value="SPECIFIC_USERS">Specific Target Email List</option>
                      </select>
                    </div>
                  </div>

                  {campaignForm.targetAudience === "SPECIFIC_USERS" && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Specific Target Email List (Comma or Line Separated)</label>
                      <textarea
                        rows={3}
                        placeholder="user1@domain.com, user2@domain.com"
                        value={campaignForm.targetEmailsText}
                        onChange={(e) => setCampaignForm({ ...campaignForm, targetEmailsText: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  )}

                  {/* HTML Content Editor & Live Visual Preview Tabs */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewTab("editor")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border-none cursor-pointer ${
                            previewTab === "editor" ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          HTML Code Editor
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewTab("variables")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border-none cursor-pointer flex items-center gap-1 ${
                            previewTab === "variables" ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <span>Template Variables</span>
                          <span className="bg-white/20 text-current px-1.5 py-0.2 rounded-full text-[10px] font-black">
                            {detectedVariables.length}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewTab("preview")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border-none cursor-pointer ${
                            previewTab === "preview" ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          Visual Email Preview
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-[10px] text-slate-400 font-semibold hidden sm:block">
                          Variables Detected: <span className="font-bold text-purple-600">{detectedVariables.length}</span>
                        </div>

                        {previewTab === "editor" && (
                          <button
                            type="button"
                            onClick={() => setIsEditorFullscreen(!isEditorFullscreen)}
                            className="bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-purple-200 cursor-pointer flex items-center gap-1.5"
                          >
                            <Maximize2 size={13} />
                            <span>{isEditorFullscreen ? "Minimize" : "Enlarge Screen"}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {previewTab === "editor" ? (
                      <div className="relative">
                        <textarea
                          rows={12}
                          value={campaignForm.htmlContent}
                          onChange={(e) => setCampaignForm({ ...campaignForm, htmlContent: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-300 font-mono text-xs text-slate-900 bg-slate-50/70 focus:bg-white focus:border-purple-600 focus:outline-none leading-relaxed shadow-inner"
                          placeholder="Type or paste your HTML email code here..."
                        />
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mt-1">
                          <span>Detected {detectedVariables.length} template placeholders</span>
                          <span>Light Theme Active | High Visibility Code Editor</span>
                        </div>
                      </div>
                    ) : previewTab === "variables" ? (
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4 max-h-[320px] overflow-y-auto">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-black text-slate-900">Detected Template Variables ({detectedVariables.length})</h4>
                            <p className="text-[11px] text-slate-500">Fill custom values or URLs for all placeholders extracted from your HTML template</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const resetVals: Record<string, string> = {};
                              detectedVariables.forEach(v => { resetVals[v] = getVarDefaultValue(v); });
                              setTemplateVarValues(resetVals);
                              triggerToast("Reset all template variables to default URLs");
                            }}
                            className="text-[11px] font-bold text-purple-700 hover:text-purple-900 cursor-pointer bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200"
                          >
                            Reset to Default URLs
                          </button>
                        </div>

                        {detectedVariables.length === 0 ? (
                          <div className="text-xs text-slate-400 text-center py-6">
                            No dynamic variables like <code className="text-purple-600">&#123;&#123; VAR_NAME &#125;&#125;</code> detected in HTML code yet.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {detectedVariables.map(vName => {
                              const currentVal = templateVarValues[vName] !== undefined
                                ? templateVarValues[vName]
                                : getVarDefaultValue(vName);
                              return (
                                <div key={vName} className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-extrabold text-purple-900 font-mono">
                                      &#123;&#123; {vName} &#125;&#125;
                                    </label>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                                      {templateVarValues[vName] ? "Custom" : "Auto Default"}
                                    </span>
                                  </div>
                                  <input
                                    type="text"
                                    value={currentVal}
                                    placeholder={getVarDefaultValue(vName) || `Enter ${vName} value`}
                                    onChange={(e) => setTemplateVarValues({ ...templateVarValues, [vName]: e.target.value })}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600 bg-slate-50/50"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-100 min-h-[300px]">
                        <div
                          className="bg-white rounded-xl shadow-xs p-4 max-w-xl mx-auto overflow-x-auto"
                          dangerouslySetInnerHTML={{
                            __html: renderedHtmlPreview
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* FULLSCREEN ENLARGED HTML CODE EDITOR OVERLAY */}
                  <AnimatePresence>
                    {isEditorFullscreen && (
                      <div className="fixed inset-4 sm:inset-8 z-[100] bg-white rounded-3xl p-6 shadow-2xl flex flex-col border border-slate-300">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-slate-900 text-base">Enlarged HTML Code Editor (Light Theme)</h3>
                            <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Full Screen Mode</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsEditorFullscreen(false)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl border-none cursor-pointer flex items-center gap-1.5"
                          >
                            <Minimize2 size={14} />
                            <span>Minimize / Return</span>
                          </button>
                        </div>

                        <div className="flex-1 flex flex-col">
                          <textarea
                            value={campaignForm.htmlContent}
                            onChange={(e) => setCampaignForm({ ...campaignForm, htmlContent: e.target.value })}
                            className="w-full flex-1 p-5 rounded-2xl border border-slate-300 font-mono text-sm text-slate-900 bg-slate-50 focus:bg-white focus:border-purple-600 focus:outline-none leading-relaxed shadow-inner"
                            placeholder="Type or paste HTML code..."
                          />
                        </div>

                        <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-xs text-slate-500">
                          <div>
                            Variables available: <code className="text-purple-600 bg-purple-50 px-1 rounded">&#123;&#123; userName &#125;&#125;</code> <code className="text-purple-600 bg-purple-50 px-1 rounded">&#123;&#123; mobileNumber &#125;&#125;</code> <code className="text-purple-600 bg-purple-50 px-1 rounded">&#123;&#123; referralCode &#125;&#125;</code>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsEditorFullscreen(false)}
                            className="bg-[#6d28d9] text-white font-extrabold text-xs px-4 py-2 rounded-xl border-none cursor-pointer"
                          >
                            Done Editing
                          </button>
                        </div>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Send Test Email Row */}
                  <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-bold text-purple-900 mb-1">Send Test Email To Admin</label>
                      <input
                        type="email"
                        placeholder="Enter email to receive test copy"
                        value={testEmailAddress}
                        onChange={(e) => setTestEmailAddress(e.target.value)}
                        className="w-full px-3.5 py-1.5 rounded-xl border border-purple-200 text-xs font-semibold text-slate-800 bg-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSendTestEmail()}
                      disabled={isSendingTest}
                      className="bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl border-none cursor-pointer disabled:opacity-50 shrink-0 self-end sm:self-auto"
                    >
                      {isSendingTest ? "Sending Test..." : "Send Test Email"}
                    </button>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setShowCampaignModal(false)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl border-none cursor-pointer"
                  >
                    Cancel
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveCampaign}
                      className="bg-[#6d28d9] hover:bg-[#5b21b6] text-white font-extrabold text-xs px-5 py-2 rounded-xl border-none cursor-pointer shadow-md"
                    >
                      Save Campaign Draft
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ZOHO CAMPAIGNS API KEYS & AUTHORIZED REDIRECT URIS MODAL */}
        <AnimatePresence>
          {showZohoConnectModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
              >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div>
                    <h3 className="font-black text-slate-900 text-base">Zoho Campaigns API Keys & Authorized Redirect URIs</h3>
                    <p className="text-xs text-slate-500 font-medium">Use these Redirect URIs when registering your application in Zoho Developer Console</p>
                  </div>
                  <button
                    onClick={() => setShowZohoConnectModal(false)}
                    className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 border-none cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-5">
                  {/* AUTHORIZED REDIRECT URIS DISPLAY CARDS */}
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                      Authorized Redirect URIs (Copy to Zoho Developer Console)
                    </label>

                    {/* Dev Server Redirect URI */}
                    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3.5 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] font-bold text-purple-600 uppercase">Dev Server Redirect URI</div>
                        <code className="text-xs font-mono font-bold text-purple-900 select-all block mt-0.5">
                          https://dev-server.fipmoney.com/api/admin/zoho-oauth/callback
                        </code>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText("https://dev-server.fipmoney.com/api/admin/zoho-oauth/callback");
                          triggerToast("Copied Dev Server Redirect URI!");
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl border-none cursor-pointer shrink-0"
                      >
                        Copy Dev URI
                      </button>
                    </div>

                    {/* Production Domain Redirect URI */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Production Domain Redirect URI</div>
                        <code className="text-xs font-mono font-bold text-emerald-700 select-all block mt-0.5">
                          https://www.fipmoney.com/api/admin/zoho-oauth/callback
                        </code>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText("https://www.fipmoney.com/api/admin/zoho-oauth/callback");
                          triggerToast("Copied Production Redirect URI!");
                        }}
                        className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl border-none cursor-pointer shrink-0"
                      >
                        Copy URI
                      </button>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* ZOHO KEYS INPUT FORM */}
                  <form onSubmit={handleConnectZohoAccount} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Zoho Client ID (ZOHO_CAMPAIGNS_CLIENT_ID)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 1000.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                        value={zohoKeys.clientId}
                        onChange={(e) => setZohoKeys({ ...zohoKeys, clientId: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold focus:outline-none focus:border-purple-600 bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Zoho Client Secret (ZOHO_CAMPAIGNS_CLIENT_SECRET)</label>
                      <input
                        type="password"
                        required
                        placeholder="e.g. XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                        value={zohoKeys.clientSecret}
                        onChange={(e) => setZohoKeys({ ...zohoKeys, clientSecret: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold focus:outline-none focus:border-purple-600 bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Zoho Data Center Domain</label>
                      <select
                        value={zohoKeys.dataCenter}
                        onChange={(e) => setZohoKeys({ ...zohoKeys, dataCenter: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-600 bg-white"
                      >
                        <option value="in">India Data Center (zoho.in)</option>
                        <option value="com">US / Global Data Center (zoho.com)</option>
                        <option value="eu">Europe Data Center (zoho.eu)</option>
                        <option value="au">Australia Data Center (zoho.com.au)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl font-bold text-xs text-white bg-[#6d28d9] hover:bg-[#5b21b6] transition-all shadow-md cursor-pointer border-none flex items-center justify-center gap-2"
                    >
                      <ExternalLink size={14} />
                      <span>Save Keys & Connect Zoho Campaigns Account in 1-Click</span>
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 14. SYSTEM SETTINGS PAGE */}
        {activeNav === "System Settings" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <h2 className="text-lg font-black text-slate-900">System Platform Configuration & AMT Controls</h2>
              <p className="text-xs font-semibold text-slate-500">Manage security options, maintenance toggles, and AMT risk threshold parameters.</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4 max-w-xl">
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Platform Name</label>
                  <input type="text" defaultValue="FipMoney Digital Gold SIP" className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Minimum AMT Score for Instant Payouts</label>
                  <input type="number" defaultValue={50} className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Support Email</label>
                  <input type="text" defaultValue="support@fipmoney.com" className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-bold text-slate-700">Maintenance Mode</span>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">Disabled</span>
                </div>
              </div>
              <button
                onClick={() => triggerToast("System Configuration updated successfully!")}
                className="bg-[#7C3AED] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl cursor-pointer border-none shadow-md"
              >
                Save System Settings
              </button>
            </div>
          </div>
        )}

        {/* 15. ADMIN USERS PAGE */}
        {activeNav === "Admin Users" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div>
                <h2 className="text-lg font-black text-slate-900">Admin Staff & Access Codes</h2>
                <p className="text-xs font-semibold text-slate-500">Manage admin credentials and secret URL access codes.</p>
              </div>
              <button
                onClick={() => setShowAddAdminModal(true)}
                className="bg-[#7C3AED] hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md cursor-pointer border-none"
              >
                <Plus size={16} />
                <span>Add New Admin</span>
              </button>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Admin Name & ID</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Mobile</th>
                      <th className="p-3.5">Secret Code</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {adminsList.map(adm => (
                      <tr key={adm.id || adm._id} className="hover:bg-slate-50">
                        <td className="p-3.5">
                          <div className="font-black text-slate-900">{adm.name}</div>
                          <div className="text-[10px] font-mono text-slate-400">{adm.id || adm._id}</div>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-700">{adm.email}</td>
                        <td className="p-3.5 font-semibold text-slate-700">{adm.mobile}</td>
                        <td className="p-3.5">
                          <span className="font-mono font-black text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
                            /admin/{adm.secretCode}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-slate-800">
                          <select
                            value={adm.role}
                            onChange={(e) => handleUpdateAdminRole(adm.id || adm._id, e.target.value as any)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                          >
                            <option value="Super Admin">Super Admin</option>
                            <option value="Finance Manager">Finance Manager</option>
                            <option value="Support Lead">Support Lead</option>
                            <option value="Compliance Officer">Compliance Officer</option>
                          </select>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            {adm.status || 'Active'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteAdmin(adm.id || adm._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border-none cursor-pointer transition-colors"
                            title="Remove Admin User"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 17. DGA WAITLIST MANAGEMENT DASHBOARD */}
        {activeNav === "DGA Waitlist" && (
          <div className="space-y-6">
            {/* Top Overview & Headline */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900">Digital Gold Agent (DGA) Waitlist Dashboard</h2>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border border-amber-300">
                    Live Beta
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  Manage joined waiting list applications, view agent details, and perform single-click approvals, rejections, and bulk actions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchDgaWaitlist}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 border-none cursor-pointer"
                >
                  <RefreshCw size={14} className={isLoadingDgaWaitlist ? "animate-spin" : ""} />
                  <span>Refresh List</span>
                </button>
              </div>
            </div>

            {/* KPI STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase">Total Waitlist Applications</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{dgaWaitlistList.length}</div>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                  <Users size={22} />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold text-amber-500 uppercase">Pending Approvals</div>
                  <div className="text-2xl font-black text-amber-600 mt-1">
                    {dgaWaitlistList.filter(i => (i.status || 'pending') === 'pending').length}
                  </div>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                  <Clock size={22} />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold text-emerald-500 uppercase">Approved Agents</div>
                  <div className="text-2xl font-black text-emerald-600 mt-1">
                    {dgaWaitlistList.filter(i => i.status === 'approved').length}
                  </div>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                  <CheckCircle2 size={22} />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold text-rose-500 uppercase">Rejected Applications</div>
                  <div className="text-2xl font-black text-rose-600 mt-1">
                    {dgaWaitlistList.filter(i => i.status === 'rejected').length}
                  </div>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
                  <XCircle size={22} />
                </div>
              </div>
            </div>

            {/* SINGLE ACTION BULK TOOLBAR */}
            {selectedDgaIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#161730] text-white p-4 rounded-2xl shadow-lg border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Sparkles className="text-amber-400 shrink-0" size={18} />
                  <span>Single Action Operation: <strong>{selectedDgaIds.length} applicants selected</strong></span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleBulkUpdateDgaStatus('approved')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 border-none cursor-pointer shadow-xs"
                  >
                    <Check size={14} />
                    <span>Approve Selected</span>
                  </button>

                  <button
                    onClick={() => handleBulkUpdateDgaStatus('rejected')}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 border-none cursor-pointer shadow-xs"
                  >
                    <X size={14} />
                    <span>Reject Selected</span>
                  </button>

                  <button
                    onClick={() => handleBulkUpdateDgaStatus('contacted')}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 border-none cursor-pointer shadow-xs"
                  >
                    <Send size={14} />
                    <span>Mark Contacted</span>
                  </button>

                  <button
                    onClick={() => setSelectedDgaIds([])}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs px-3 py-1.5 rounded-xl border-none cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              </motion.div>
            )}

            {/* FILTER & SEARCH TOOLBAR */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              {/* Status Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-400 mr-1">Status Filter:</span>
                {['All', 'pending', 'approved', 'rejected', 'contacted'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setDgaStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border-none cursor-pointer capitalize ${dgaStatusFilter === st
                      ? 'bg-[#7C3AED] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="text-xs font-bold text-slate-400">
                Showing {dgaWaitlistList.filter(item => {
                  const matchesStatus = dgaStatusFilter === 'All' || (item.status || 'pending') === dgaStatusFilter;
                  const matchesSearch = !searchQuery ||
                    item.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.mobile?.includes(searchQuery) ||
                    item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (item.formattedWaitlistNumber || `DGA${String(item.waitlistNumber).padStart(4, '0')}`).toLowerCase().includes(searchQuery.toLowerCase());
                  return matchesStatus && matchesSearch;
                }).length} entries
              </div>
            </div>

            {/* DATA TABLE */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-400 font-black text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-3.5 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={dgaWaitlistList.length > 0 && selectedDgaIds.length === dgaWaitlistList.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDgaIds(dgaWaitlistList.map(i => i.id || i._id));
                            } else {
                              setSelectedDgaIds([]);
                            }
                          }}
                          className="rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                      </th>
                      <th className="p-3.5">Ticket #</th>
                      <th className="p-3.5">Agent Name</th>
                      <th className="p-3.5">Contact Info</th>
                      <th className="p-3.5">Location / State</th>
                      <th className="p-3.5">Language</th>
                      <th className="p-3.5">Date Joined</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Single Action Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {dgaWaitlistList
                      .filter(item => {
                        const matchesStatus = dgaStatusFilter === 'All' || (item.status || 'pending') === dgaStatusFilter;
                        const matchesSearch = !searchQuery ||
                          item.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.mobile?.includes(searchQuery) ||
                          item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.formattedWaitlistNumber || `DGA${String(item.waitlistNumber).padStart(4, '0')}`).toLowerCase().includes(searchQuery.toLowerCase());
                        return matchesStatus && matchesSearch;
                      })
                      .map((item) => {
                        const itemId = item.id || item._id;
                        const formattedNum = item.formattedWaitlistNumber || `DGA${String(item.waitlistNumber || 1).padStart(4, '0')}`;
                        const status = item.status || 'pending';
                        const isSelected = selectedDgaIds.includes(itemId);

                        return (
                          <tr key={itemId} className={`hover:bg-purple-50/30 transition-colors ${isSelected ? 'bg-purple-50/60' : ''}`}>
                            <td className="p-3.5 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectDga(itemId)}
                                className="rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                              />
                            </td>

                            <td className="p-3.5 font-mono font-black text-purple-700 bg-purple-50/80 px-2.5 py-1 rounded-lg w-fit text-xs border border-purple-200/60">
                              {formattedNum}
                            </td>

                            <td className="p-3.5">
                              <span className="font-bold text-slate-900 block text-xs">{item.username}</span>
                              <span className="text-[10px] text-slate-400 font-semibold">Beta Waitlist</span>
                            </td>

                            <td className="p-3.5 text-xs">
                              <div className="font-bold text-slate-800">{item.mobile}</div>
                              <div className="text-[11px] text-slate-400">{item.email}</div>
                            </td>

                            <td className="p-3.5 text-xs font-bold text-slate-700">
                              <div>{item.city || 'N/A'}</div>
                              {item.address && (
                                <div className="text-[10px] text-slate-500 font-normal mt-0.5 max-w-[200px] truncate" title={item.address}>
                                  📍 {item.address}
                                </div>
                              )}
                            </td>

                            <td className="p-3.5 text-xs font-semibold text-slate-600">
                              {item.language || 'English'}
                            </td>

                            <td className="p-3.5 text-xs text-slate-400">
                              {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Today'}
                            </td>

                            <td className="p-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${status === 'approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                                status === 'rejected' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                                  status === 'contacted' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                                    'bg-amber-100 text-amber-800 border border-amber-300'
                                }`}>
                                {status}
                              </span>
                            </td>

                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Single Action Approve */}
                                <button
                                  onClick={() => handleUpdateDgaStatus(itemId, 'approved')}
                                  disabled={status === 'approved'}
                                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer border-none disabled:opacity-30"
                                  title="Single Action: Approve Application"
                                >
                                  <Check size={14} />
                                </button>

                                {/* Single Action Reject */}
                                <button
                                  onClick={() => handleUpdateDgaStatus(itemId, 'rejected')}
                                  disabled={status === 'rejected'}
                                  className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer border-none disabled:opacity-30"
                                  title="Single Action: Reject Application"
                                >
                                  <X size={14} />
                                </button>

                                {/* Single Action Contact */}
                                <button
                                  onClick={() => handleUpdateDgaStatus(itemId, 'contacted')}
                                  disabled={status === 'contacted'}
                                  className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer border-none disabled:opacity-30"
                                  title="Single Action: Mark Contacted"
                                >
                                  <Send size={14} />
                                </button>

                                {/* Quick Send Email */}
                                <button
                                  onClick={() => {
                                    setSendEmailPayload({
                                      toEmail: item.email,
                                      templateId: "WELCOME_SIGNUP",
                                      userName: item.username,
                                      mobileNumber: item.mobile
                                    });
                                    setShowSendEmailModal(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white transition-colors cursor-pointer border-none"
                                  title="Send Email to Agent"
                                >
                                  <FileText size={14} />
                                </button>

                                {/* Delete Entry */}
                                <button
                                  onClick={() => handleDeleteDgaItem(itemId)}
                                  className="p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer border-none"
                                  title="Delete Waitlist Entry"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* VIEW FULL USER DETAILS MODAL */}
      <AnimatePresence>
        {selectedViewUser && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-black text-base shadow-xs">
                    {selectedViewUser.name ? selectedViewUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">{selectedViewUser.name}</h3>
                    <div className="text-[11px] font-mono text-purple-700 font-extrabold">
                      {selectedViewUser.userCode || `FIP${String(selectedViewUser.id).substring(0, 6).toUpperCase()}`}
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedViewUser(null)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center border-none cursor-pointer hover:bg-slate-200">
                  <X size={15} />
                </button>
              </div>

              {/* 4 CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* CARD 1: ACCOUNT & CONTACT INFO */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Account & Contact Info</div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">System UUID ID:</div>
                    <div className="font-mono text-[10px] font-bold text-slate-800 break-all select-all">{selectedViewUser.id}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Mobile Number:</div>
                    <div className="font-bold text-slate-900">{selectedViewUser.phone}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Email Address:</div>
                    <div className="font-semibold text-slate-800 break-all">{selectedViewUser.email}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Registration Date:</div>
                    <div className="font-bold text-slate-800">{selectedViewUser.joined}</div>
                  </div>
                </div>

                {/* CARD 2: HOLDINGS & PORTFOLIO */}
                <div className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/80 space-y-2">
                  <div className="text-[10px] font-black uppercase text-amber-700 tracking-wider">Digital Vault Holdings</div>
                  <div>
                    <div className="text-[10px] text-amber-700/80 font-medium">Wallet Cash Balance:</div>
                    <div className="font-black text-sm text-slate-900">{selectedViewUser.walletBal}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-amber-700/80 font-medium">24K 99.9% Gold Balance:</div>
                    <div className="font-black text-sm text-amber-600">{selectedViewUser.goldBal}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-amber-700/80 font-medium">Custody Vault:</div>
                    <div className="font-bold text-slate-700 text-[11px]">Brink's Vault (Vistra Trustee)</div>
                  </div>
                </div>

                {/* CARD 3: COMPLIANCE & KYC */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Compliance & Status</div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">KYC Status:</div>
                    <div className="flex items-center gap-1.5 font-black text-xs text-slate-900 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${selectedViewUser.kycStatus === 'Verified' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span>{selectedViewUser.kycStatus}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Account Access:</div>
                    <div className="flex items-center gap-1.5 font-black text-xs text-slate-900 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${selectedViewUser.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span>{selectedViewUser.status}</span>
                    </div>
                  </div>
                </div>

                {/* CARD 4: AML AUDIT RISK SCORE */}
                <div className="bg-purple-50/60 p-3.5 rounded-2xl border border-purple-200/80 space-y-2">
                  <div className="text-[10px] font-black uppercase text-purple-700 tracking-wider">AML Risk Audit Control</div>
                  <div>
                    <div className="text-[10px] text-purple-700/80 font-medium">Audit Score:</div>
                    <div className="font-black text-sm text-slate-900">{selectedViewUser.amlScore || selectedViewUser.amtScore || 85} / 100</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-purple-700/80 font-medium">Risk Classification:</div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${getAmlScoreDetails(selectedViewUser.amlScore || selectedViewUser.amtScore || 85).badgeBg}`}>
                      {getAmlScoreDetails(selectedViewUser.amlScore || selectedViewUser.amtScore || 85).label}
                    </span>
                  </div>
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  onClick={() => {
                    const target = selectedViewUser;
                    setSelectedViewUser(null);
                    handleOpenAmtEditModal(target);
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7C3AED] font-extrabold text-xs border-none cursor-pointer"
                >
                  Set AML Audit Score
                </button>
                <button onClick={() => setSelectedViewUser(null)} className="px-5 py-2 rounded-xl bg-slate-900 text-white font-black text-xs border-none cursor-pointer shadow-md">
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT AML AUDIT SCORE MODAL */}
      <AnimatePresence>
        {editingAmlUser && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-[#7C3AED]" size={20} />
                  <h3 className="text-base font-black text-slate-900">Edit AML Audit Score</h3>
                </div>
                <button onClick={() => setEditingAmlUser(null)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center border-none cursor-pointer">
                  <X size={15} />
                </button>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="font-black text-slate-900 text-sm">{editingAmlUser.name}</div>
                  <div className="text-[10px] font-mono text-slate-400">{editingAmlUser.id} • {editingAmlUser.phone}</div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${getAmlScoreDetails(newAmlScoreValue).badgeBg}`}>
                  {newAmlScoreValue} / 100
                </span>
              </div>

              <form onSubmit={handleSaveAmlScore} className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">Set AML Audit Score (0 - 100):</label>
                    <span className="font-black text-slate-900 text-sm">{newAmlScoreValue} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newAmlScoreValue}
                    onChange={(e) => setNewAmlScoreValue(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
                    <span>0 (High Risk)</span>
                    <span>50 (Moderate)</span>
                    <span>100 (Safe)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200/80 bg-purple-50/50">
                  <div className="text-[10px] font-extrabold text-purple-700 uppercase">Risk Level Classification</div>
                  <div className="font-black text-slate-900 text-xs mt-0.5">{getAmlScoreDetails(newAmlScoreValue).label}</div>
                  <div className="text-[11px] text-slate-500 mt-1">{getAmlScoreDetails(newAmlScoreValue).description}</div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Audit Justification / Note</label>
                  <textarea
                    rows={2}
                    placeholder="Enter reason for updating AML score..."
                    value={amlAuditNote}
                    onChange={(e) => setAmlAuditNote(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button type="button" onClick={() => setEditingAmlUser(null)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold text-slate-600 border-none cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[#7C3AED] text-white font-extrabold border-none cursor-pointer shadow-md">
                    Save AML Score
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE NEW SIP PLAN MODAL */}
      <AnimatePresence>
        {showCreatePlanModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">Create New SIP Savings Plan</h3>
                <button onClick={() => setShowCreatePlanModal(false)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center border-none cursor-pointer">
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleCreatePlan} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Plan Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Daily Festival Gold Savings"
                    value={newPlan.name}
                    onChange={e => setNewPlan({ ...newPlan, name: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Min Deposit (₹)</label>
                    <input
                      type="number"
                      required
                      value={newPlan.minAmount}
                      onChange={e => setNewPlan({ ...newPlan, minAmount: Number(e.target.value) })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Return Yield (%)</label>
                    <input
                      type="text"
                      required
                      value={newPlan.returnsRate}
                      onChange={e => setNewPlan({ ...newPlan, returnsRate: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newPlan.category}
                    onChange={e => setNewPlan({ ...newPlan, category: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                  >
                    <option>Daily Micro-SIP</option>
                    <option>Weekly SIP</option>
                    <option>Monthly SIP</option>
                    <option>Long-term Wealth</option>
                    <option>High Networth</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of the gold SIP plan..."
                    value={newPlan.description}
                    onChange={e => setNewPlan({ ...newPlan, description: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button type="button" onClick={() => setShowCreatePlanModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold text-slate-600 border-none cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[#7C3AED] text-white font-extrabold border-none cursor-pointer shadow-md">
                    Create Plan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT SIP PLAN MODAL */}
      <AnimatePresence>
        {editingPlan && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">Edit Gold SIP Plan</h3>
                <button onClick={() => setEditingPlan(null)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center border-none cursor-pointer">
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleUpdatePlan} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Plan Name</label>
                  <input
                    type="text"
                    required
                    value={editingPlan.name || ""}
                    onChange={e => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Min Deposit (₹)</label>
                    <input
                      type="number"
                      required
                      value={editingPlan.minAmount || 10}
                      onChange={e => setEditingPlan({ ...editingPlan, minAmount: Number(e.target.value) })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category</label>
                    <select
                      value={editingPlan.category || "Daily Micro-SIP"}
                      onChange={e => setEditingPlan({ ...editingPlan, category: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                    >
                      <option>Daily Micro-SIP</option>
                      <option>Weekly SIP</option>
                      <option>Monthly SIP</option>
                      <option>Long-term Wealth</option>
                      <option>High Networth</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Return Yield</label>
                    <input
                      type="text"
                      required
                      value={editingPlan.returnsRate || "8.5%"}
                      onChange={e => setEditingPlan({ ...editingPlan, returnsRate: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Status</label>
                    <select
                      value={editingPlan.status || "Active"}
                      onChange={e => setEditingPlan({ ...editingPlan, status: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                    >
                      <option>Active</option>
                      <option>Paused</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editingPlan.description || ""}
                    onChange={e => setEditingPlan({ ...editingPlan, description: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button type="button" onClick={() => setEditingPlan(null)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold text-slate-600 border-none cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[#7C3AED] text-white font-extrabold border-none cursor-pointer shadow-md">
                    Update Plan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BBPS RECEIPT & AUDIT MODAL */}
      <AnimatePresence>
        {selectedBbpsReceipt && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Receipt className="text-[#7C3AED]" size={20} />
                  <h3 className="text-base font-black text-slate-900">BBPS Official Payment Receipt</h3>
                </div>
                <button onClick={() => setSelectedBbpsReceipt(null)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center border-none cursor-pointer">
                  <X size={15} />
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-extrabold text-slate-500">NPCI Ref Number</span>
                  <span className="font-mono font-black text-slate-900">{selectedBbpsReceipt.bbpsRefNo}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-extrabold text-slate-500">Transaction ID</span>
                  <span className="font-mono font-black text-[#7C3AED]">{selectedBbpsReceipt.txnId}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-extrabold text-slate-500">Biller Name</span>
                  <span className="font-extrabold text-slate-900">{selectedBbpsReceipt.billerName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-extrabold text-slate-500">Consumer Account / Mobile</span>
                  <span className="font-mono font-bold text-slate-800">{selectedBbpsReceipt.accountNumber}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-extrabold text-slate-500">User Name & Mobile</span>
                  <span className="font-bold text-slate-800">{selectedBbpsReceipt.userName} ({selectedBbpsReceipt.userPhone})</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-extrabold text-slate-500">Amount Paid</span>
                  <span className="font-black text-slate-900 text-sm">₹{selectedBbpsReceipt.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-extrabold text-slate-500">24K Gold Cashback</span>
                  <span className="font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {selectedBbpsReceipt.goldCashbackFormatted || `${selectedBbpsReceipt.goldCashbackEarned || 0} g Gold`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-500">Current Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    selectedBbpsReceipt.status === 'Success' ? 'bg-emerald-100 text-emerald-800' :
                    selectedBbpsReceipt.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                    selectedBbpsReceipt.status === 'Failed' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {selectedBbpsReceipt.status}
                  </span>
                </div>
              </div>

              {/* Status Override Controls for Admin */}
              <div className="space-y-2 pt-1">
                <label className="font-extrabold text-slate-700 text-xs block">Update NPCI Transaction Status:</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Success', 'Pending', 'Failed', 'Refunded'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateBbpsStatus(selectedBbpsReceipt.txnId || selectedBbpsReceipt._id || '', st)}
                      disabled={selectedBbpsReceipt.status === st}
                      className={`py-2 rounded-xl font-extrabold text-xs cursor-pointer border-none transition-all ${
                        selectedBbpsReceipt.status === st
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : st === 'Success' ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : st === 'Pending' ? 'bg-amber-500 text-white hover:bg-amber-600'
                          : st === 'Failed' ? 'bg-rose-600 text-white hover:bg-rose-700'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      Mark {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedBbpsReceipt(null)}
                  className="px-5 py-2 rounded-xl bg-slate-100 font-bold text-slate-600 border-none cursor-pointer"
                >
                  Close Receipt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SIMULATE BBPS TRANSACTION MODAL */}
      <AnimatePresence>
        {showSimulateBbpsModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Plus className="text-[#7C3AED]" size={20} />
                  <h3 className="text-base font-black text-slate-900">Simulate BBPS Bill Payment</h3>
                </div>
                <button onClick={() => setShowSimulateBbpsModal(false)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center border-none cursor-pointer">
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleSimulateBbpsTxn} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">User Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={newBbpsForm.userName}
                    onChange={e => setNewBbpsForm({ ...newBbpsForm, userName: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">User Mobile</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98000 11223"
                      value={newBbpsForm.userPhone}
                      onChange={e => setNewBbpsForm({ ...newBbpsForm, userPhone: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category</label>
                    <select
                      value={newBbpsForm.category}
                      onChange={e => setNewBbpsForm({ ...newBbpsForm, category: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                    >
                      <option>Mobile Recharge</option>
                      <option>Electricity</option>
                      <option>DTH</option>
                      <option>LPG Gas</option>
                      <option>Fastag</option>
                      <option>Water Bill</option>
                      <option>Broadband</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Biller Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Airtel Prepaid / BSES Rajdhani"
                    value={newBbpsForm.billerName}
                    onChange={e => setNewBbpsForm({ ...newBbpsForm, billerName: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Consumer / Acc No</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9800011223 or 10029384"
                      value={newBbpsForm.accountNumber}
                      onChange={e => setNewBbpsForm({ ...newBbpsForm, accountNumber: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={newBbpsForm.amount}
                      onChange={e => setNewBbpsForm({ ...newBbpsForm, amount: Number(e.target.value) })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Payment Gateway</label>
                    <select
                      value={newBbpsForm.paymentGateway}
                      onChange={e => setNewBbpsForm({ ...newBbpsForm, paymentGateway: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                    >
                      <option>Setu BBPS NPCI</option>
                      <option>Razorpay BBPS</option>
                      <option>FipMoney Wallet</option>
                      <option>Axis UPI BBPS</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Status</label>
                    <select
                      value={newBbpsForm.status}
                      onChange={e => setNewBbpsForm({ ...newBbpsForm, status: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                    >
                      <option>Success</option>
                      <option>Pending</option>
                      <option>Failed</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button type="button" onClick={() => setShowSimulateBbpsModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold text-slate-600 border-none cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[#7C3AED] text-white font-extrabold border-none cursor-pointer shadow-md">
                    Process Transaction
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD NEW ADMIN MODAL */}
      <AnimatePresence>
        {showAddAdminModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">Add New Admin User</h3>
                <button onClick={() => setShowAddAdminModal(false)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center border-none cursor-pointer">
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleCreateAdmin} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Suresh Patel"
                    value={newAdmin.name}
                    onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="suresh@fipmoney.com"
                      value={newAdmin.email}
                      onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mobile</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98000 11122"
                      value={newAdmin.mobile}
                      onChange={e => setNewAdmin({ ...newAdmin, mobile: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Secret Access Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9988"
                      value={newAdmin.secretCode}
                      onChange={e => setNewAdmin({ ...newAdmin, secretCode: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Role</label>
                    <select
                      value={newAdmin.role}
                      onChange={e => setNewAdmin({ ...newAdmin, role: e.target.value as AdminUser['role'] })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                    >
                      <option>Finance Manager</option>
                      <option>Support Lead</option>
                      <option>Compliance Officer</option>
                      <option>Super Admin</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button type="button" onClick={() => setShowAddAdminModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold text-slate-600 border-none cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[#7C3AED] text-white font-extrabold border-none cursor-pointer shadow-md">
                    Register Admin
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NEW BROADCAST MODAL */}
      <AnimatePresence>
        {showBroadcastModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">Send Notification Broadcast</h3>
                <button onClick={() => setShowBroadcastModal(false)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center border-none cursor-pointer">
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Notification Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Special Gold Rate Bonus!"
                    value={broadcast.title}
                    onChange={e => setBroadcast({ ...broadcast, title: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Message Body</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter broadcast message for mobile users..."
                    value={broadcast.message}
                    onChange={e => setBroadcast({ ...broadcast, message: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Target Audience</label>
                    <select
                      value={broadcast.targetGroup}
                      onChange={e => setBroadcast({ ...broadcast, targetGroup: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                    >
                      <option>All Registered Users</option>
                      <option>Active SIP Users</option>
                      <option>High Risk AML Users</option>
                      <option>Unverified KYC Users</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Delivery Channel</label>
                    <select
                      value={broadcast.channel}
                      onChange={e => setBroadcast({ ...broadcast, channel: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-purple-500"
                    >
                      <option>In-App & Push</option>
                      <option>SMS Alert</option>
                      <option>Email & Push</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button type="button" onClick={() => setShowBroadcastModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold text-slate-600 border-none cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[#7C3AED] text-white font-extrabold border-none cursor-pointer shadow-md">
                    Send Broadcast
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AUDIT LOGS MODAL */}
      <AnimatePresence>
        {showAuditModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-3xl w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto hide-scrollbar"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="text-[#7C3AED]" size={20} />
                  <h3 className="text-base font-black text-slate-900">Security Audit Trail Logs</h3>
                </div>
                <button
                  onClick={() => setShowAuditModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer border-none outline-none"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-3">Log ID & Timestamp</th>
                      <th className="p-3">Admin</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Severity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {auditLogsList.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-900">
                          {log.id}<br />
                          <span className="text-[10px] text-slate-400 font-normal">{log.timestamp}</span>
                        </td>
                        <td className="p-3 font-extrabold text-slate-800">{log.adminName}</td>
                        <td className="p-3 font-bold text-slate-700">{log.category}</td>
                        <td className="p-3 font-semibold text-slate-700 max-w-xs">{log.action}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">
                            {log.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SEND HTML EMAIL TO USER MODAL */}
      <AnimatePresence>
        {showSendEmailModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Send className="text-[#7C3AED]" size={20} />
                  <h3 className="text-base font-black text-slate-900">Send HTML Email to User</h3>
                </div>
                <button onClick={() => setShowSendEmailModal(false)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center border-none cursor-pointer">
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleSendUserEmail} className="space-y-4 text-xs">
                {/* SELECT RECIPIENT USERS WITH SELECT ALL CHECKBOX */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">Select Recipient Users ({selectedRecipientEmails.length} Selected)</label>
                    {users.length > 0 && (
                      <label className="flex items-center gap-1.5 font-black text-[#7C3AED] cursor-pointer text-[11px] bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                        <input
                          type="checkbox"
                          checked={users.length > 0 && selectedRecipientEmails.length === users.filter(u => u.email).length}
                          onChange={handleToggleSelectAllRecipients}
                          className="accent-[#7C3AED] rounded cursor-pointer"
                        />
                        <span>Select All ({users.length})</span>
                      </label>
                    )}
                  </div>

                  {users.length > 0 ? (
                    <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-2xl p-2 bg-slate-50/50 space-y-1.5">
                      {users.map(u => {
                        const isChecked = selectedRecipientEmails.includes(u.email);
                        return (
                          <label
                            key={u.id}
                            className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${isChecked ? "bg-purple-50/80 border-purple-300" : "bg-white border-slate-200/80 hover:bg-slate-50"
                              }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleRecipientEmail(u.email)}
                                className="accent-[#7C3AED] rounded cursor-pointer"
                              />
                              <div>
                                <div className="font-black text-slate-900 text-xs">{u.name}</div>
                                <div className="text-[10px] font-mono text-slate-400">{u.email} • {u.phone}</div>
                              </div>
                            </div>
                            <span className="font-mono text-[9px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                              {u.userCode || 'FIP' + String(u.id).substring(0, 5).toUpperCase()}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Target User Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="user@example.com"
                        value={sendEmailPayload.toEmail}
                        onChange={(e) => setSendEmailPayload({ ...sendEmailPayload, toEmail: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  )}
                </div>

                {/* SENDER EMAIL ADDRESS SELECTOR (@fipmoney.com) */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Send Email From (Sender Address)</label>
                  <select
                    value={sendEmailPayload.fromEmail}
                    onChange={(e) => setSendEmailPayload({ ...sendEmailPayload, fromEmail: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold bg-purple-50/50 text-purple-900 border-purple-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="support@fipmoney.com">support@fipmoney.com (Customer Support & Inquiries)</option>
                    <option value="info@fipmoney.com">info@fipmoney.com (General Info & Updates)</option>
                    <option value="no-reply@fipmoney.com">no-reply@fipmoney.com (Automated Notifications & OTPs)</option>
                    <option value="payments@fipmoney.com">payments@fipmoney.com (Invoices & Payment Receipts)</option>
                    <option value="security@fipmoney.com">security@fipmoney.com (Security & KYC Alerts)</option>
                    <option value="marketing@fipmoney.com">marketing@fipmoney.com (Rewards & Referral Bonuses)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Select HTML Email Template</label>
                  <select
                    value={sendEmailPayload.templateId}
                    onChange={(e) => handleSelectModalTemplate(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold bg-slate-50 focus:outline-none focus:border-purple-500"
                  >
                    <option value="">-- Select a template --</option>
                    {emailTemplates.map(t => (
                      <option key={t.templateId} value={t.templateId}>
                        {t.name} ({t.templateId})
                      </option>
                    ))}
                  </select>
                </div>

                {/* MODAL TEMPLATE VARIABLES & PUBLIC ASSETS CUSTOMIZATION GRID */}
                {Object.keys(modalVariables).length > 0 && (
                  <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-black text-xs text-purple-950">
                        <Sparkles size={14} className="text-[#7C3AED]" />
                        <span>Template Variables & Image Assets ({Object.keys(modalVariables).length})</span>
                      </div>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                        Values replace &#123;&#123;tags&#125;&#125;
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 hide-scrollbar">
                      {Object.keys(modalVariables).map((vKey) => {
                        const isDefaultAsset = Boolean(getDynamicVariableDefaults()[vKey]);
                        return (
                          <div key={vKey} className="bg-white border border-purple-100 p-2 rounded-xl flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <label className="font-mono text-[10px] font-black text-slate-800 truncate" title={vKey}>
                                &#123;&#123;{vKey}&#125;&#125;
                              </label>
                              {isDefaultAsset && (
                                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                  Public Asset
                                </span>
                              )}
                            </div>
                            <input
                              type="text"
                              value={modalVariables[vKey]}
                              onChange={(e) => setModalVariables({ ...modalVariables, [vKey]: e.target.value })}
                              placeholder={`Enter value for ${vKey}...`}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-700 focus:outline-none focus:border-purple-500"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button type="button" onClick={() => setShowSendEmailModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold text-slate-600 border-none cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[#7C3AED] text-white font-extrabold border-none cursor-pointer shadow-md flex items-center gap-1.5">
                    <Send size={13} />
                    <span>Dispatch Email ({selectedRecipientEmails.length > 0 ? selectedRecipientEmails.length : 1} User{selectedRecipientEmails.length === 1 ? '' : 's'})</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE / EDIT HTML EMAIL TEMPLATE MODAL */}
      <AnimatePresence>
        {showTemplateEditorModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="text-[#7C3AED]" size={20} />
                  <h3 className="text-base font-black text-slate-900">HTML Email Template Designer</h3>
                </div>
                <button onClick={() => setShowTemplateEditorModal(false)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center border-none cursor-pointer">
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleSaveEmailTemplate} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Template Unique ID (Uppercase)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. WELCOME_SIGNUP"
                      value={templateForm.templateId}
                      onChange={(e) => setTemplateForm({ ...templateForm, templateId: e.target.value.toUpperCase() })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold uppercase focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Template Display Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Welcome & Signup Onboarding Email"
                      value={templateForm.name}
                      onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Subject Line</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Welcome to FipMoney - Your 24K Gold Locker is Active!"
                      value={templateForm.subject}
                      onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email Category (Zoho ZeptoMail Sender Mapping)</label>
                    <select
                      value={templateForm.category}
                      onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold bg-slate-50 focus:outline-none focus:border-purple-500"
                    >
                      <option value="Authentication">Authentication (OTP, Login, Password Reset) → support@fipmoney.com</option>
                      <option value="Onboarding">Onboarding (Welcome Email, KYC Submitted/Approved) → support@fipmoney.com</option>
                      <option value="Payments">Payments (Success, Failed, Pending, Refund) → payments@fipmoney.com</option>
                      <option value="Bill Payments">Bill Payments (Mobile, DTH, Electricity, Broadband) → payments@fipmoney.com</option>
                      <option value="Digital Gold">Digital Gold (Buy, Sell, Delivery, Settlement) → payments@fipmoney.com</option>
                      <option value="Banking">Banking (Bank Account, Transfers) → payments@fipmoney.com</option>
                      <option value="Security">Security (Login Alert, Security Notifications) → support@fipmoney.com</option>
                      <option value="Compliance">Compliance (KYC Reminder, Risk Alert) → support@fipmoney.com</option>
                      <option value="Statements">Statements & Invoices (Receipts, Monthly Statement) → payments@fipmoney.com</option>
                      <option value="Promotional">Promotional (Marketing & Campaigns) → info@fipmoney.com</option>
                      <option value="Queries & Support">Queries & Support (Help Desk, General Inquiries) → no-reply@fipmoney.com</option>
                    </select>
                    <div className="text-[10px] text-purple-600 font-semibold mt-1">
                      Sender email automatically selected based on Category by Zoho ZeptoMail.
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Placeholder Variables (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="userName, mobileNumber, referralCode, amount, grams"
                    value={templateForm.variables}
                    onChange={(e) => setTemplateForm({ ...templateForm, variables: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono font-semibold focus:outline-none focus:border-purple-500"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">Use <code>&#123;&#123;variableName&#125;&#125;</code> tags inside your HTML code below.</div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">HTML Code Editor</label>
                  <textarea
                    rows={8}
                    required
                    placeholder="Enter full HTML template string here..."
                    value={templateForm.htmlContent}
                    onChange={(e) => setTemplateForm({ ...templateForm, htmlContent: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono text-[11px] leading-relaxed focus:outline-none focus:border-purple-500 bg-slate-900 text-purple-200"
                  />
                </div>

                {/* LIVE HTML PREVIEW BOX */}
                <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-[#7C3AED]" />
                      <span>Live HTML Preview Output</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFullPreviewData({
                          isOpen: true,
                          name: templateForm.name || "Template Editor Preview",
                          subject: templateForm.subject || "(No Subject)",
                          category: templateForm.category || "Onboarding",
                          templateId: templateForm.templateId || "NEW_TEMPLATE",
                          htmlContent: templateForm.htmlContent,
                          variablesMap: {}
                        });
                      }}
                      className="bg-purple-100/80 hover:bg-purple-200 text-[#7C3AED] font-extrabold text-[11px] px-2.5 py-1 rounded-lg border-none cursor-pointer flex items-center gap-1 transition-colors"
                    >
                      <Maximize2 size={13} />
                      <span>Full Screen Preview</span>
                    </button>
                  </div>
                  <div
                    className="bg-white p-4 rounded-xl border border-slate-200 min-h-[200px] max-h-[360px] overflow-y-auto"
                    dangerouslySetInnerHTML={{
                      __html: (templateForm.htmlContent || "<p style='color:#888; font-style:italic;'>Type HTML code above to preview here...</p>")
                        .replace(/\{\{\s*userName\s*\}\}/g, 'Rohan Verma')
                        .replace(/\{\{\s*mobileNumber\s*\}\}/g, '9876543210')
                        .replace(/\{\{\s*referralCode\s*\}\}/g, 'FIP100')
                        .replace(/\{\{\s*supportEmail\s*\}\}/g, 'support@fipmoney.com')
                        .replace(/\{\{\s*currentYear\s*\}\}/g, String(new Date().getFullYear()))
                    }}
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button type="button" onClick={() => setShowTemplateEditorModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold text-slate-600 border-none cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[#7C3AED] text-white font-extrabold border-none cursor-pointer shadow-md">
                    Save Email Template
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL VIEW EMAIL TEMPLATE PREVIEW MODAL */}
      <AnimatePresence>
        {fullPreviewData && fullPreviewData.isOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* MODAL HEADER */}
              <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-white">{fullPreviewData.name}</h3>
                      {fullPreviewData.category && (
                        <span className="text-[10px] font-black uppercase text-purple-300 bg-purple-900/60 px-2 py-0.5 rounded-full border border-purple-500/30">
                          {fullPreviewData.category}
                        </span>
                      )}
                    </div>
                    {fullPreviewData.templateId && (
                      <div className="text-xs font-mono text-purple-400 font-bold mt-0.5">
                        ID: {fullPreviewData.templateId}
                      </div>
                    )}
                  </div>
                </div>

                {/* DEVICE MODE SWITCHER */}
                <div className="bg-slate-800 p-1 rounded-2xl border border-slate-700 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPreviewDeviceMode('desktop')}
                    className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 border-none cursor-pointer transition-all ${previewDeviceMode === 'desktop'
                      ? 'bg-[#7C3AED] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white bg-transparent'
                      }`}
                  >
                    <Monitor size={15} />
                    <span>Desktop View</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDeviceMode('mobile')}
                    className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 border-none cursor-pointer transition-all ${previewDeviceMode === 'mobile'
                      ? 'bg-[#7C3AED] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white bg-transparent'
                      }`}
                  >
                    <Smartphone size={15} />
                    <span>Mobile View (375px)</span>
                  </button>
                </div>

                {/* CLOSE BUTTON */}
                <button
                  type="button"
                  onClick={() => setFullPreviewData(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center border-none cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* SUBJECT & SENDER INFO BAR */}
              <div className="bg-slate-950/80 border-b border-slate-800/80 px-5 py-2.5 flex items-center justify-between text-xs text-slate-300 gap-4 flex-wrap">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Subject:</span>
                  <span className="font-extrabold text-white truncate">
                    {(() => {
                      const defaults = getDynamicVariableDefaults();
                      const vars: Record<string, string> = { userName: 'Rohan Verma', mobileNumber: '9876543210', referralCode: 'FIP100', ...defaults, ...(fullPreviewData.variablesMap || {}) };
                      let subj = fullPreviewData.subject || '';
                      Object.keys(vars).forEach(k => {
                        subj = subj.replace(new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}`, 'g'), vars[k]);
                      });
                      return subj;
                    })()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
                  <span>From: <strong className="text-purple-400 font-sans">support@fipmoney.com</strong></span>
                  <span>To: <strong className="text-slate-200 font-sans">Rohan Verma &lt;rohan@example.com&gt;</strong></span>
                </div>
              </div>

              {/* PREVIEW CONTAINER BODY */}
              <div className="flex-1 bg-slate-950 p-4 sm:p-6 overflow-hidden flex justify-center items-center relative">
                {previewDeviceMode === 'desktop' ? (
                  <div className="bg-white w-full max-w-4xl h-full rounded-2xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col">
                    <iframe
                      srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><style>body{margin:0;padding:0;background-color:#ffffff;font-family:Arial,Helvetica,sans-serif;}</style></head><body>${(() => {
                        const defaults = getDynamicVariableDefaults();
                        const vars: Record<string, string> = { userName: 'Rohan Verma', mobileNumber: '9876543210', referralCode: 'FIP100', ...defaults, ...(fullPreviewData.variablesMap || {}) };
                        let html = fullPreviewData.htmlContent || '';
                        Object.keys(vars).forEach(k => {
                          html = html.replace(new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}`, 'g'), vars[k]);
                        });
                        return html;
                      })()}</body></html>`}
                      className="w-full h-full border-none bg-white"
                      title="Full View Email Template Preview (Desktop)"
                    />
                  </div>
                ) : (
                  <div className="bg-slate-900 w-[380px] h-full max-h-[680px] rounded-[40px] p-3 shadow-2xl border-4 border-slate-700 flex flex-col relative shrink-0">
                    {/* PHONE NOTCH */}
                    <div className="w-32 h-4 bg-slate-800 rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-slate-950"></div>
                    </div>
                    <div className="bg-white w-full flex-1 rounded-[28px] overflow-hidden border border-slate-800">
                      <iframe
                        srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><style>body{margin:0;padding:0;background-color:#ffffff;font-family:Arial,Helvetica,sans-serif;}</style></head><body>${(() => {
                          const defaults = getDynamicVariableDefaults();
                          const vars: Record<string, string> = { userName: 'Rohan Verma', mobileNumber: '9876543210', referralCode: 'FIP100', ...defaults, ...(fullPreviewData.variablesMap || {}) };
                          let html = fullPreviewData.htmlContent || '';
                          Object.keys(vars).forEach(k => {
                            html = html.replace(new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}`, 'g'), vars[k]);
                          });
                          return html;
                        })()}</body></html>`}
                        className="w-full h-full border-none bg-white"
                        title="Full View Email Template Preview (Mobile)"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* MODAL FOOTER */}
              <div className="bg-slate-900 border-t border-slate-800 p-3.5 px-6 flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-400">
                  Full View Preview Mode • Rendered HTML with sample variable values
                </div>
                <div className="flex items-center gap-2">
                  {fullPreviewData.templateId && (
                    <button
                      type="button"
                      onClick={() => {
                        if (fullPreviewData.templateId) {
                          handleSelectTemplateForCompose(fullPreviewData.templateId);
                          triggerToast(`Loaded '${fullPreviewData.name}' into Compose Email`);
                        }
                        setFullPreviewData(null);
                      }}
                      className="bg-[#7C3AED] hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl border-none cursor-pointer transition-colors shadow-xs"
                    >
                      Use in Compose
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setFullPreviewData(null)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-4 py-2 rounded-xl border-none cursor-pointer transition-colors"
                  >
                    Close Preview
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}