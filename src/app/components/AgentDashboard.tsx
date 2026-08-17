"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Users,
  Wallet,
  Coins,
  Award,
  QrCode,
  Share2,
  PhoneCall,
  MessageSquare,
  Plus,
  Building2,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  Download,
  Copy,
  Check,
  ShieldCheck,
  UserCheck,
  Zap,
  Briefcase,
  Layers,
  Search,
  Filter,
  LayoutGrid,
  Video,
  Pause,
  Play,
  Square,
  Calendar,
  BarChart3
} from "lucide-react";
import { getLoggedInAgent, clearAgentSession, DgaAgent } from "../utils/agentStorage";

interface AgentDashboardProps {
  onLogout?: () => void;
}

type AgentTab = "dashboard" | "overview" | "commissions" | "clients" | "leads" | "marketing" | "support" | "profile";

export default function AgentDashboard({ onLogout }: AgentDashboardProps) {
  const [agent, setAgent] = useState<DgaAgent>(() => getLoggedInAgent() || {
    agentCode: "DGA-8842",
    name: "Rajesh Sharma",
    mobile: "9876543210",
    email: "rajesh.agent@fipmoney.com",
    tier: "Diamond",
    commissionRateGold: 0.8,
    commissionRateSilver: 1.2,
    totalEarned: 148250,
    monthlyEarned: 24600,
    pendingPayout: 8400,
    activeClientsCount: 42,
    totalGoldGramsManaged: 184.5,
    panNumber: "ABCDE1234F",
    bankName: "HDFC Bank",
    accountNumberMasked: "•••• •••• 4892",
    ifscCode: "HDFC0001234",
    kycVerified: true,
  });

  const [activeTab, setActiveTab] = useState<AgentTab>("dashboard");
  const [copiedLink, setCopiedLink] = useState(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

  // Time Tracker State for Donezo Dashboard
  const [timeTrackerSeconds, setTimeTrackerSeconds] = useState(5048); // 01:24:08
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeTrackerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimeTracker = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Past 6 months (26 weeks / 182 days) Project Analytics Heatmap Data Generator
  const heatmapDays = React.useMemo(() => {
    const days = [];
    const baseDate = new Date(2026, 1, 16); // Feb 16, 2026 (Past 6 months starting Monday)

    // Seed pattern logic matching GitHub heatmap density & sales volume rules
    // 0 = 0g (no color), 1 = 0-2g (light green), 2 = 3-4g (3 lite green), 3 = 5-9g (5g little light), 4 = >10g (dark green)
    for (let i = 0; i < 182; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);

      let level = 0;
      let grams = 0;

      // Peak activity in March-May (indices 20 - 100)
      if (i >= 20 && i <= 105) {
        const rand = (i * 9301 + 49297) % 233280 / 233280;
        if (rand > 0.18) {
          if (rand > 0.85) { level = 4; grams = 12.8 + (rand * 5); } // > 10g
          else if (rand > 0.65) { level = 3; grams = 6.4 + (rand * 2.8); } // 5-9.9g
          else if (rand > 0.40) { level = 2; grams = 3.2 + (rand * 1.5); } // 3-4.9g
          else { level = 1; grams = 0.8 + (rand * 1.1); } // 0.1-2g
        }
      } else if (i >= 140 && i <= 180) { // July-August recent sales
        const rand = (i * 12345 + 6789) % 233280 / 233280;
        if (rand > 0.45) {
          if (rand > 0.82) { level = 4; grams = 10.5; }
          else if (rand > 0.65) { level = 3; grams = 7.2; }
          else if (rand > 0.45) { level = 2; grams = 3.8; }
          else { level = 1; grams = 1.4; }
        }
      } else { // Normal days
        const rand = (i * 7890 + 1234) % 233280 / 233280;
        if (rand > 0.78) {
          if (rand > 0.94) { level = 3; grams = 5.5; }
          else if (rand > 0.88) { level = 2; grams = 3.1; }
          else { level = 1; grams = 0.9; }
        }
      }

      days.push({
        id: i,
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        grams: parseFloat(grams.toFixed(1)),
        level
      });
    }
    return days;
  }, []);

  const getHeatmapColorClass = (level: number) => {
    switch (level) {
      case 4: return "bg-[#1e1b4b] shadow-xs"; // >10g: Dark Royal Indigo Blue
      case 3: return "bg-[#2563eb]";           // 5g-9.9g: Medium Blue
      case 2: return "bg-[#3b82f6]";           // 3g-4.9g: Sky/Cobalt Blue
      case 1: return "bg-[#93c5fd]";           // 0.1g-2g: Light Blue
      default: return "bg-slate-100/90 border border-slate-200/50"; // 0g: No Color
    }
  };

  // Sample Clients Data
  const [clients] = useState([
    { id: "C-101", name: "Vikram Mehta", mobile: "9812345678", goldGrams: 28.5, silverGrams: 150, totalSIP: "₹5,000/mo", totalEarned: "₹14,250", status: "Active", joined: "12 Jan 2026" },
    { id: "C-102", name: "Ananya Deshmukh", mobile: "9876512340", goldGrams: 42.0, silverGrams: 300, totalSIP: "₹10,000/mo", totalEarned: "₹28,400", status: "Active", joined: "04 Feb 2026" },
    { id: "C-103", name: "Suresh Reddy", mobile: "9988776655", goldGrams: 14.2, silverGrams: 50, totalSIP: "₹2,500/mo", totalEarned: "₹6,800", status: "Active", joined: "18 Feb 2026" },
    { id: "C-104", name: "Priya Nair", mobile: "9765432109", goldGrams: 65.8, silverGrams: 500, totalSIP: "₹15,000/mo", totalEarned: "₹42,100", status: "Active", joined: "01 Mar 2026" },
    { id: "C-105", name: "Ketan Kapoor", mobile: "9845012345", goldGrams: 8.0, silverGrams: 0, totalSIP: "₹1,000/mo", totalEarned: "₹2,400", status: "KYC Pending", joined: "10 Mar 2026" },
  ]);

  // Sample Lead Pipeline Data
  const [leads, setLeads] = useState([
    { id: "L-201", name: "Ramesh Verma", mobile: "9822114433", stage: "Interested", expectedInvestment: "₹50,000", followUpDate: "15 Mar 2026", notes: "Wants to invest in 24K Gold SIP" },
    { id: "L-202", name: "Sneha Patel", mobile: "9899887711", stage: "Contacted", expectedInvestment: "₹25,000", followUpDate: "16 Mar 2026", notes: "Sent marketing PDF via WhatsApp" },
    { id: "L-203", name: "Amitabh Roy", mobile: "9833445566", stage: "KYC Done", expectedInvestment: "₹1,000,000", followUpDate: "14 Mar 2026", notes: "High Net-Worth Individual" },
  ]);

  // New Lead Form State
  const [newLead, setNewLead] = useState({ name: "", mobile: "", investment: "", notes: "" });

  // WhatsApp Purchase Reminder State & Handler
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsappSentSuccess, setWhatsappSentSuccess] = useState(false);

  const handleCopyLink = () => {
    const link = `https://www.test.fipmoney.com/signup?agent=${agent.agentCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendWhatsAppReminder = (clientMobile?: string, clientName?: string) => {
    const text = clientName 
      ? `Hi ${clientName}, this is a gentle reminder from your FipMoney Partner (${agent.name}) for your monthly 24K Gold purchase. Secure your gold SIP today: https://www.fipmoney.com`
      : `Hi! Gentle reminder from FipMoney for your monthly 24K Gold purchase. Secure your gold SIP today: https://www.fipmoney.com`;
    
    const phone = clientMobile ? clientMobile.replace(/\D/g, '') : '';
    const whatsappUrl = phone 
      ? `https://api.whatsapp.com/send?phone=91${phone}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;

    window.open(whatsappUrl, '_blank');
    setWhatsappSentSuccess(true);
    setTimeout(() => setWhatsappSentSuccess(false), 3500);
  };

  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.mobile) return;
    setLeads([
      {
        id: `L-${Date.now().toString().slice(-3)}`,
        name: newLead.name,
        mobile: newLead.mobile,
        stage: "Prospect",
        expectedInvestment: newLead.investment ? `₹${newLead.investment}` : "₹10,000",
        followUpDate: "Tomorrow",
        notes: newLead.notes || "New lead added from agent console"
      },
      ...leads
    ]);
    setNewLead({ name: "", mobile: "", investment: "", notes: "" });
    setShowAddLeadModal(false);
  };

  return (
    <div className="min-h-screen bg-[#FCFDFD] text-slate-900 flex flex-col font-sans selection:bg-[#1e1b4b] selection:text-white">
      
      {/* Top Agent Bar Header (User Dashboard Themed) */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1e1b4b] p-0.5 shadow-md shadow-[#1e1b4b]/20 flex items-center justify-center">
              <span className="font-black text-amber-400 text-lg">FM</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-base tracking-tight">DGA Partner Console</span>
                <span className="bg-purple-50 text-purple-900 border border-purple-200 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Award size={12} className="text-purple-700" /> {agent.tier} Agent
                </span>
              </div>
              <span className="text-xs text-slate-500 font-bold">Agent ID: <strong className="text-slate-900 font-black">{agent.agentCode}</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (onLogout) onLogout();
              else {
                window.history.pushState({}, '', '/dashboard');
                window.location.reload();
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-extrabold text-xs transition-all cursor-pointer shadow-2xs"
          >
            ← Return to User Dashboard
          </button>

          <button
            onClick={handleCopyLink}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-extrabold text-xs transition-all cursor-pointer shadow-2xs"
          >
            {copiedLink ? <Check size={14} className="text-purple-700" /> : <Share2 size={14} />}
            {copiedLink ? "Link Copied!" : "Share Agent Link"}
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1e1b4b] to-[#312e81] text-white font-black text-sm flex items-center justify-center shadow-xs">
              {agent.name.charAt(0)}
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-black text-slate-900">{agent.name}</span>
              <span className="text-[10px] text-purple-700 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping" /> Verified Partner
              </span>
            </div>
            <button
              onClick={() => {
                clearAgentSession();
                if (onLogout) onLogout();
                else {
                  window.history.pushState({}, '', '/dashboard');
                  window.location.reload();
                }
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Logout from Agent Console"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-[1700px] w-full mx-auto">
        
        {/* Left Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200/90 p-4 shrink-0 shadow-xs flex flex-col justify-between">
          <nav className="space-y-1.5">
            
            <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              MENU
            </div>

            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === "dashboard" ? "bg-[#1e1b4b] text-white font-black shadow-md shadow-[#1e1b4b]/20" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"}`}
            >
              <LayoutGrid size={16} /> Dashboard
            </button>

            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === "overview" ? "bg-[#1e1b4b] text-white font-black shadow-md shadow-[#1e1b4b]/20" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"}`}
            >
              <TrendingUp size={16} /> Tasks & Analytics
            </button>

            <button
              onClick={() => setActiveTab("commissions")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === "commissions" ? "bg-[#1e1b4b] text-white font-black shadow-md shadow-[#1e1b4b]/20" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"}`}
            >
              <Wallet size={16} /> Commissions & Payouts
            </button>

            <button
              onClick={() => setActiveTab("clients")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === "clients" ? "bg-[#1e1b4b] text-white font-black shadow-md shadow-[#1e1b4b]/20" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"}`}
            >
              <Users size={16} /> My Clients Portfolio ({clients.length})
            </button>

            <button
              onClick={() => setActiveTab("leads")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === "leads" ? "bg-[#1e1b4b] text-white font-black shadow-md shadow-[#1e1b4b]/20" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"}`}
            >
              <UserCheck size={16} /> Lead Pipeline ({leads.length})
            </button>

            <button
              onClick={() => setActiveTab("marketing")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === "marketing" ? "bg-[#1e1b4b] text-white font-black shadow-md shadow-[#1e1b4b]/20" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"}`}
            >
              <QrCode size={16} /> Marketing Kit & QR
            </button>

            <div className="px-3 pt-4 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              GENERAL
            </div>

            <button
              onClick={() => setActiveTab("support")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === "support" ? "bg-[#1e1b4b] text-white font-black shadow-md shadow-[#1e1b4b]/20" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"}`}
            >
              <HelpCircle size={16} /> Help & Support
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === "profile" ? "bg-[#1e1b4b] text-white font-black shadow-md shadow-[#1e1b4b]/20" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"}`}
            >
              <Building2 size={16} /> Agent Settings
            </button>
          </nav>

          {/* Download Mobile App Promo Widget (User Dashboard Indigo Palette) */}
          <div className="mt-8 p-4 rounded-3xl bg-gradient-to-r from-[#1e1b4b] to-[#312e81] text-white space-y-3 relative overflow-hidden shadow-lg border border-purple-900/30">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              📲
            </div>
            <div>
              <h4 className="font-extrabold text-sm leading-tight text-white">Download Mobile App</h4>
              <p className="text-[11px] text-indigo-200 font-medium mt-0.5">Manage portfolios on the go</p>
            </div>
            <button
              onClick={() => alert("Downloading DGA Agent Mobile App APK...")}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer transition-colors shadow-sm border-none outline-none"
            >
              Download APK
            </button>
          </div>
        </aside>

        {/* Right Tab Content View */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          
          {/* TAB 0: DONEZO DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 max-w-[1500px] mx-auto pb-10">
              
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Plan, prioritize, and accomplish your tasks with ease.</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAddLeadModal(true)}
                    className="px-5 py-2.5 rounded-full bg-[#1e1b4b] hover:bg-[#111827] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 border-none outline-none"
                  >
                    <Plus size={16} /> Add Project
                  </button>

                  <button
                    onClick={() => alert("Import Data feature initialized. Uploading CSV dataset...")}
                    className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
                  >
                    Import Data
                  </button>
                </div>
              </div>

              {/* Top Stat Cards Grid (Original DGA Data in Cleaned UI Layout) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 pt-5 pb-2">
                
                {/* Card 1: REFERRAL STATS */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 pt-7 relative shadow-md hover:shadow-lg transition-all flex flex-col justify-between overflow-visible min-h-[160px]">
                  {/* Floating Top Left Icon Badge */}
                  <div className="absolute -top-5 left-5 w-10 h-10 rounded-2xl bg-[#98EECC] border-2 border-white shadow-md flex items-center justify-center text-base shrink-0">
                    👥
                  </div>

                  {/* Card Title */}
                  <h3 className="text-center font-extrabold text-slate-800 text-xs tracking-wider uppercase mb-3">
                    REFERRAL STATS
                  </h3>

                  {/* Dual Columns with Dashed Separator */}
                  <div className="flex items-center justify-between text-center my-1">
                    <div className="flex-1">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">New Users</span>
                      <span className="text-xl font-black text-slate-900">14</span>
                    </div>

                    <div className="h-8 border-r border-dashed border-slate-300 mx-1" />

                    <div className="flex-1">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">Total Users</span>
                      <span className="text-xl font-black text-slate-900">56</span>
                    </div>
                  </div>

                  {/* Bottom Footer Bar */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1.5 flex items-center justify-center mt-3">
                    <span className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-0.5">
                      ▲ 12%
                    </span>
                  </div>
                </div>

                {/* Card 2: REFERRAL BREAKDOWN */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 pt-7 relative shadow-md hover:shadow-lg transition-all flex flex-col justify-between overflow-visible min-h-[160px]">
                  {/* Floating Top Left Icon Badge */}
                  <div className="absolute -top-5 left-5 w-10 h-10 rounded-2xl bg-[#D8B4F8] border-2 border-white shadow-md flex items-center justify-center text-base shrink-0">
                    📊
                  </div>

                  {/* Card Title */}
                  <h3 className="text-center font-extrabold text-slate-800 text-xs tracking-wider uppercase mb-3">
                    REFERRAL STATUS
                  </h3>

                  {/* Dual Columns with Dashed Separator */}
                  <div className="flex items-center justify-between text-center my-1">
                    <div className="flex-1">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">Successful</span>
                      <span className="text-xl font-black text-slate-900">42</span>
                    </div>

                    <div className="h-8 border-r border-dashed border-slate-300 mx-1" />

                    <div className="flex-1">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">Pending KYC</span>
                      <span className="text-xl font-black text-slate-900">14</span>
                    </div>
                  </div>

                  {/* Bottom Footer Bar */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1.5 flex items-center justify-center mt-3">
                    <span className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-0.5">
                      ▲ 8%
                    </span>
                  </div>
                </div>

                {/* Card 3: CLIENT STATS */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 pt-7 relative shadow-md hover:shadow-lg transition-all flex flex-col justify-between overflow-visible min-h-[160px]">
                  {/* Floating Top Left Icon Badge */}
                  <div className="absolute -top-5 left-5 w-10 h-10 rounded-2xl bg-[#FFC999] border-2 border-white shadow-md flex items-center justify-center text-base shrink-0">
                    🤝
                  </div>

                  {/* Card Title */}
                  <h3 className="text-center font-extrabold text-slate-800 text-xs tracking-wider uppercase mb-3">
                    CLIENT STATS
                  </h3>

                  {/* Dual Columns with Dashed Separator */}
                  <div className="flex items-center justify-between text-center my-1">
                    <div className="flex-1">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">New Client</span>
                      <span className="text-xl font-black text-slate-900">4</span>
                    </div>

                    <div className="h-8 border-r border-dashed border-slate-300 mx-1" />

                    <div className="flex-1">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">Active Client</span>
                      <span className="text-xl font-black text-slate-900">{agent.activeClientsCount}</span>
                    </div>
                  </div>

                  {/* Bottom Footer Bar */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1.5 flex items-center justify-center mt-3">
                    <span className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-0.5">
                      ▲ 8%
                    </span>
                  </div>
                </div>

                {/* Card 4: REVENUE STATS */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 pt-7 relative shadow-md hover:shadow-lg transition-all flex flex-col justify-between overflow-visible min-h-[160px]">
                  {/* Floating Top Left Icon Badge */}
                  <div className="absolute -top-5 left-5 w-10 h-10 rounded-2xl bg-[#90E0EF] border-2 border-white shadow-md flex items-center justify-center text-base shrink-0">
                    💰
                  </div>

                  {/* Card Title */}
                  <h3 className="text-center font-extrabold text-slate-800 text-xs tracking-wider uppercase mb-3">
                    COMMISSION STATS
                  </h3>

                  {/* Dual Columns with Dashed Separator */}
                  <div className="flex items-center justify-between text-center my-1">
                    <div className="flex-1">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">Growth</span>
                      <span className="text-[15px] font-black text-emerald-600">+18.4%</span>
                    </div>

                    <div className="h-8 border-r border-dashed border-slate-300 mx-1" />

                    <div className="flex-1">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">Total Earned</span>
                      <span className="text-[15px] font-black text-slate-900">₹{agent.totalEarned.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {/* Bottom Footer Bar */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1.5 flex items-center justify-center mt-3">
                    <span className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-0.5">
                      ▲ 18.4%
                    </span>
                  </div>
                </div>

                {/* Card 5: PAYOUT STATS */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 pt-7 relative shadow-md hover:shadow-lg transition-all flex flex-col justify-between overflow-visible min-h-[160px]">
                  {/* Floating Top Left Icon Badge */}
                  <div className="absolute -top-5 left-5 w-10 h-10 rounded-2xl bg-[#FFAAA6] border-2 border-white shadow-md flex items-center justify-center text-base shrink-0">
                    🏅
                  </div>

                  {/* Card Title */}
                  <h3 className="text-center font-extrabold text-slate-800 text-xs tracking-wider uppercase mb-3">
                    PAYOUT STATS
                  </h3>

                  {/* Dual Columns with Dashed Separator */}
                  <div className="flex items-center justify-between text-center my-1">
                    <div className="flex-1">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">Pending</span>
                      <span className="text-[14px] font-black text-amber-700">₹{agent.pendingPayout.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="h-8 border-r border-dashed border-slate-300 mx-1" />

                    <div className="flex-1">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">Paid Month</span>
                      <span className="text-[14px] font-black text-slate-900">₹{agent.monthlyEarned.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {/* Bottom Footer Bar */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1.5 flex items-center justify-center mt-3">
                    <span className="text-[11px] font-extrabold text-red-500 flex items-center gap-0.5">
                      ▼ 0%
                    </span>
                  </div>
                </div>

                {/* Card 6: GOLD STATS */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 pt-7 relative shadow-md hover:shadow-lg transition-all flex flex-col justify-between overflow-visible min-h-[160px]">
                  {/* Floating Top Left Icon Badge */}
                  <div className="absolute -top-5 left-5 w-10 h-10 rounded-2xl bg-[#FFE066] border-2 border-white shadow-md flex items-center justify-center text-base shrink-0">
                    ✨
                  </div>

                  {/* Card Title */}
                  <h3 className="text-center font-extrabold text-slate-800 text-xs tracking-wider uppercase mb-3">
                    GOLD STATS
                  </h3>

                  {/* Dual Columns with Dashed Separator */}
                  <div className="flex items-center justify-between text-center my-1">
                    <div className="flex-1">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">Vault</span>
                      <span className="text-[13px] font-extrabold text-slate-800">Brink's</span>
                    </div>

                    <div className="h-8 border-r border-dashed border-slate-300 mx-1" />

                    <div className="flex-1">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">Managed</span>
                      <span className="text-base font-black text-slate-900">{agent.totalGoldGramsManaged}g</span>
                    </div>
                  </div>

                  {/* Bottom Footer Bar */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1.5 flex items-center justify-center mt-3">
                    <span className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-0.5">
                      ▲ 5%
                    </span>
                  </div>
                </div>

              </div>

              {/* Middle Section Grid: Project Analytics (Full Width Heatmap), Reminders, Project List */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Project Analytics Card - 6 Months GitHub Style Heatmap (Half Width) */}
                <div className="lg:col-span-6 p-5 rounded-[28px] bg-white border border-slate-100 shadow-sm flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base tracking-tight">Project Analytics</h3>
                      <span className="bg-blue-50 text-blue-900 border border-blue-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        6 Months
                      </span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-xl text-[11px] font-black text-slate-700">
                      Managed: <strong className="text-blue-800 font-black">{agent.totalGoldGramsManaged}g</strong>
                    </div>
                  </div>

                  {/* Heatmap Grid Wrapper (Reduced Spacing, 26-Week Past 6 Months View) */}
                  <div className="py-0 overflow-x-auto scrollbar-none">
                    <div className="w-full min-w-[340px]">
                      {/* Months Header Labels (Past 6 Months) */}
                      <div className="flex text-[10px] font-bold text-slate-400 mb-1 pl-7 justify-between pr-1">
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                        <span>Aug</span>
                      </div>

                      {/* Heatmap Matrix Row Layout */}
                      <div className="flex items-start gap-2">
                        {/* Day of Week Labels */}
                        <div className="flex flex-col justify-between text-[9px] font-black text-slate-400 h-[84px] py-0.5 select-none shrink-0">
                          <span>M</span>
                          <span>W</span>
                          <span>F</span>
                        </div>

                        {/* 26 Columns Grid (7 rows high = 182 days) */}
                        <div className="flex-1 grid grid-flow-col grid-rows-7 gap-[3px]">
                          {heatmapDays.map((day) => (
                            <div
                              key={day.id}
                              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2.5px] transition-all cursor-pointer hover:scale-125 hover:z-20 relative group ${getHeatmapColorClass(day.level)}`}
                            >
                              {/* Hover Tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col items-center pointer-events-none z-30 whitespace-nowrap">
                                <div className="bg-slate-900 text-white text-[10px] font-extrabold py-1 px-2.5 rounded-md shadow-xl border border-slate-700">
                                  {day.grams > 0 ? (
                                    <span className="flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                      <strong>{day.grams}g Gold</strong> on {day.date}
                                    </span>
                                  ) : (
                                    <span className="text-slate-300">No purchases on {day.date}</span>
                                  )}
                                </div>
                                <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-1" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Heatmap Legend Footer */}
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 pt-1.5 border-t border-slate-100 gap-2">
                    <a
                      href="#contributions"
                      onClick={(e) => { e.preventDefault(); alert("Contributions represent total daily client gold purchases and vault allocations."); }}
                      className="text-slate-400 hover:text-slate-700 transition-colors truncate"
                    >
                      How we count contributions
                    </a>

                    {/* Threshold Legend */}
                    <div className="flex items-center gap-1.5 text-slate-600 font-extrabold shrink-0">
                      <span className="text-[10px] font-bold text-slate-400">Less</span>
                      
                      <div className="flex items-center gap-0.5">
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-100/90 border border-slate-200/50" title="0g (No purchases)" />
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-[#93c5fd]" title="0.1g - 2g (Light Blue)" />
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-[#3b82f6]" title="3g - 4.9g (Medium-Light Blue)" />
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-[#2563eb]" title="5g - 9.9g (Medium Blue)" />
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-[#1e1b4b]" title="10g+ (Dark Royal Blue)" />
                      </div>

                      <span className="text-[10px] font-bold text-slate-400">More</span>
                    </div>
                  </div>
                </div>

                {/* Reminders Card */}
                <div className="lg:col-span-3 p-5 rounded-[28px] bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="font-bold text-slate-900 text-base">Reminders</h3>
                    <span className="bg-emerald-50 text-emerald-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-emerald-200">
                      Active Alert
                    </span>
                  </div>

                  {/* WhatsApp Gold Purchase Reminder for Active Clients */}
                  <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/90 space-y-3 shadow-2xs flex-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-ping" /> WhatsApp Reminder
                      </span>
                      <span className="bg-[#25D366] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                        {clients.filter(c => c.status === "Active").length} Active
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-slate-900 leading-tight">Gold Purchase Reminder</h4>
                      <p className="text-[10px] text-slate-600 font-medium mt-1 leading-relaxed">
                        Send WhatsApp monthly buy alert to active clients.
                      </p>
                    </div>

                    {whatsappSentSuccess && (
                      <div className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 p-1.5 rounded-lg flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-600" /> WhatsApp Reminder Sent!
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={() => handleSendWhatsAppReminder()}
                        className="flex-1 py-2 px-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer border-none outline-none shadow-2xs"
                      >
                        <MessageSquare size={13} fill="white" /> Send WhatsApp
                      </button>

                      <button
                        onClick={() => setShowWhatsAppModal(true)}
                        className="py-2 px-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-[11px] border border-slate-200 cursor-pointer transition-colors shadow-2xs"
                        title="Select Active Clients"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>

                {/* Top Clients Card (Sorted by Highest Gold Holdings) */}
                <div className="lg:col-span-3 p-5 rounded-[28px] bg-white border border-slate-100 shadow-sm flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-slate-900 text-base">Top Clients</h3>
                      <button
                        onClick={() => setActiveTab("clients")}
                        className="text-[10px] font-extrabold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-full cursor-pointer transition-colors"
                      >
                        View All
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {[...clients]
                        .sort((a, b) => b.goldGrams - a.goldGrams)
                        .slice(0, 3)
                        .map((client, idx) => (
                          <div key={client.id} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100/80 hover:bg-slate-100/60 transition-colors">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-2xs ${
                                idx === 0 ? "bg-amber-400 text-amber-950" :
                                idx === 1 ? "bg-slate-300 text-slate-900" :
                                "bg-amber-700/20 text-amber-900"
                              }`}>
                                #{idx + 1}
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-black text-slate-900 truncate">{client.name}</div>
                                <div className="text-[10px] text-slate-500 font-bold">{client.totalSIP}</div>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <div className="text-xs font-black text-emerald-700">{client.goldGrams}g</div>
                              <div className="text-[9px] font-bold text-slate-400">24K Gold</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("clients")}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors border-none outline-none"
                  >
                    View All {clients.length} Clients <ChevronRight size={14} />
                  </button>
                </div>

              </div>

              {/* Bottom Section Grid: Team Collaboration, Project Progress, Time Tracker */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Recent Client Transactions Card */}
                <div className="lg:col-span-5 p-6 rounded-[28px] bg-white border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">Recent Client Transactions</h3>
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    </div>
                    <span className="bg-slate-100 text-slate-600 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full">
                      Live Feed
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: "TXN-901", clientName: "Priya Nair", type: "24K Gold Buy", grams: "+5.2g Gold", amount: "₹42,500", date: "Today, 02:45 PM", status: "Completed" },
                      { id: "TXN-902", clientName: "Ananya Deshmukh", type: "Monthly Gold SIP", grams: "+2.5g Gold", amount: "₹20,000", date: "Today, 11:15 AM", status: "Completed" },
                      { id: "TXN-903", clientName: "Vikram Mehta", type: "24K Gold Buy", grams: "+1.8g Gold", amount: "₹15,000", date: "Yesterday, 04:30 PM", status: "Completed" },
                      { id: "TXN-904", clientName: "Suresh Reddy", type: "Monthly Gold SIP", grams: "+0.8g Gold", amount: "₹6,500", date: "Yesterday, 09:10 AM", status: "Processing" },
                    ].map((txn) => (
                      <div key={txn.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-slate-100/60 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 shadow-2xs ${
                            txn.status === "Completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          }`}>
                            <Coins size={16} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-black text-slate-900 truncate">{txn.clientName}</div>
                            <div className="text-[10px] text-slate-500 font-semibold">{txn.type} • <span className="text-slate-400">{txn.date}</span></div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs font-black text-slate-900">{txn.grams}</div>
                          <div className="flex items-center justify-end gap-1.5 mt-0.5">
                            <span className="text-[10px] font-bold text-slate-500">{txn.amount}</span>
                            <span className={`px-1.5 py-0.2 text-[9px] font-black rounded-md uppercase ${
                              txn.status === "Completed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                            }`}>
                              {txn.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveTab("clients")}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-none outline-none"
                  >
                    View All Client Activity <ChevronRight size={14} />
                  </button>
                </div>

                {/* Referral Progress Gauge Card */}
                <div className="lg:col-span-4 p-6 rounded-[28px] bg-white border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-base">Referral Progress</h3>
                    <span className="bg-indigo-50 text-[#1e1b4b] font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-indigo-100">
                      26 Total Leads
                    </span>
                  </div>

                  {/* Semi-Circular Arch Gauge Chart */}
                  <div className="flex flex-col items-center justify-center py-2 relative">
                    <div className="w-56 h-28 relative overflow-hidden flex items-end justify-center">
                      {/* SVG Semi-Circle Arch */}
                      <svg viewBox="0 0 200 100" className="w-56 h-28">
                        <defs>
                          <pattern id="hatchedArch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <line x1="0" y1="0" x2="0" y2="8" stroke="#CBD5E1" strokeWidth="3" />
                          </pattern>
                        </defs>
                        {/* Background Hatched Arch */}
                        <path
                          d="M 15 100 A 85 85 0 0 1 185 100"
                          fill="none"
                          stroke="url(#hatchedArch)"
                          strokeWidth="28"
                          strokeLinecap="round"
                        />
                        {/* Foreground Completed Arch (#1e1b4b) */}
                        <path
                          d="M 15 100 A 85 85 0 0 1 142 22"
                          fill="none"
                          stroke="#1e1b4b"
                          strokeWidth="28"
                          strokeLinecap="round"
                        />
                      </svg>

                      {/* Inner Percentage Readout */}
                      <div className="absolute bottom-0 text-center">
                        <div className="text-3xl font-black text-slate-900 leading-none">69%</div>
                        <div className="text-[11px] font-bold text-slate-400 mt-1">Completed</div>
                      </div>
                    </div>
                  </div>

                  {/* Referral Progress Legend */}
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 pt-3 border-t border-slate-100 px-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1e1b4b] shrink-0" />
                      <span className="text-slate-700">Completed <strong className="text-slate-900 font-black ml-0.5">(18)</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-slate-700">In Progress <strong className="text-slate-900 font-black ml-0.5">(5)</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full border border-slate-400 bg-slate-200 shrink-0" />
                      <span className="text-slate-700">Pending <strong className="text-slate-900 font-black ml-0.5">(3)</strong></span>
                    </div>
                  </div>
                </div>

                {/* Time Tracker Card (Royal Indigo Gradient Card) */}
                <div className="lg:col-span-3 p-6 rounded-[28px] bg-gradient-to-r from-[#1e1b4b] to-[#312e81] text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                  {/* Background Decorative Wavy Pattern */}
                  <div className="absolute inset-0 opacity-15 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z" fill="white" />
                      <path d="M0,70 Q25,50 50,70 T100,70 V100 H0 Z" fill="white" opacity="0.5" />
                    </svg>
                  </div>

                  <div className="relative z-10">
                    <span className="text-xs font-semibold text-indigo-200 tracking-wide">Time Tracker</span>
                    <div className="text-4xl sm:text-5xl font-black font-mono tracking-wider mt-4 text-white drop-shadow-sm">
                      {formatTimeTracker(timeTrackerSeconds)}
                    </div>
                  </div>

                  <div className="flex items-center justify-start gap-4 relative z-10 pt-4">
                    {/* Pause / Play Button */}
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="w-12 h-12 rounded-full bg-white text-[#1e1b4b] hover:bg-slate-100 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer border-none outline-none shadow-md"
                      title={isTimerRunning ? "Pause Timer" : "Resume Timer"}
                    >
                      {isTimerRunning ? <Pause size={20} fill="#1e1b4b" /> : <Play size={20} fill="#1e1b4b" className="ml-0.5" />}
                    </button>

                    {/* Record / Stop Button */}
                    <button
                      onClick={() => {
                        setIsTimerRunning(false);
                        setTimeTrackerSeconds(0);
                      }}
                      className="w-12 h-12 rounded-full bg-[#EF4444] text-white hover:bg-red-600 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer border-none outline-none shadow-md"
                      title="Reset / Stop Timer"
                    >
                      <Square size={16} fill="white" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}
          
          {/* TAB 1: OVERVIEW & EARNINGS */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              
              {/* Welcome Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-50 via-yellow-50 to-white p-6 rounded-3xl border border-amber-200/90 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-amber-700 font-extrabold text-xs uppercase tracking-wider">
                    <Sparkles size={14} className="text-amber-600" /> Agent Terminal Active
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Welcome back, {agent.name}!</h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">Here is your Digital Gold portfolio performance and earnings breakdown.</p>
                </div>
                
                <button
                  onClick={() => setShowAddLeadModal(true)}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2 transition-all border-none outline-none"
                >
                  <Plus size={16} /> Add New Client Prospect
                </button>
              </div>

              {/* High-level KPI Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-extrabold mb-3">
                    <span>Total Commissions Earned</span>
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <Wallet size={18} />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-600">₹{agent.totalEarned.toLocaleString('en-IN')}</div>
                  <div className="text-[11px] text-emerald-700 font-extrabold mt-2 flex items-center gap-1">
                    <ArrowUpRight size={14} /> +18.4% this month
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-extrabold mb-3">
                    <span>This Month's Payout</span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <TrendingUp size={18} />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600">₹{agent.monthlyEarned.toLocaleString('en-IN')}</div>
                  <div className="text-[11px] text-slate-600 font-semibold mt-2">
                    Pending Payout: <strong className="text-amber-700 font-black">₹{agent.pendingPayout.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-extrabold mb-3">
                    <span>Active Gold Clients</span>
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      <Users size={18} />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">{agent.activeClientsCount} Clients</div>
                  <div className="text-[11px] text-indigo-700 font-bold mt-2">
                    +4 new clients this week
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-extrabold mb-3">
                    <span>Gold Managed (Grams)</span>
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <Coins size={18} />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-purple-700">{agent.totalGoldGramsManaged} g</div>
                  <div className="text-[11px] text-slate-500 font-semibold mt-2">
                    Stored in Brink's Insured Vaults
                  </div>
                </div>
              </div>

              {/* Commission Rate Cards & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Active Commission Schedule */}
                <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                      <Award className="text-amber-600" size={18} /> Your Agent Commission Rates
                    </h3>
                    <span className="text-xs font-black bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-300">
                      Diamond Tier
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-black text-slate-900">24K Digital Gold Purchases</div>
                        <div className="text-xs text-slate-500 font-semibold">Earned on all client gold buy orders</div>
                      </div>
                      <div className="text-xl font-black text-amber-600">{agent.commissionRateGold}%</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-black text-slate-900">24K Digital Silver Purchases</div>
                        <div className="text-xs text-slate-500 font-semibold">Earned on all client silver buy orders</div>
                      </div>
                      <div className="text-xl font-black text-slate-700">{agent.commissionRateSilver}%</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-black text-slate-900">Monthly Gold SIP Investments</div>
                        <div className="text-xs text-slate-500 font-semibold">Recurring passive monthly income</div>
                      </div>
                      <div className="text-xl font-black text-emerald-600">1.00%</div>
                    </div>
                  </div>
                </div>

                {/* Quick Client Summary Table */}
                <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                      <Users className="text-indigo-600" size={18} /> Top Performing Clients
                    </h3>
                    <button onClick={() => setActiveTab("clients")} className="text-xs font-black text-amber-600 hover:underline cursor-pointer">
                      View All ({clients.length}) →
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {clients.slice(0, 3).map((client) => (
                      <div key={client.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:bg-slate-100/80 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-black flex items-center justify-center text-sm">
                            {client.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-900">{client.name}</div>
                            <div className="text-[11px] text-slate-500 font-semibold">{client.goldGrams}g Gold • {client.totalSIP}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-black text-emerald-700">{client.totalEarned}</div>
                          <div className="text-[10px] text-slate-500 font-bold">Earned</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: COMMISSIONS & PAYOUTS */}
          {activeTab === "commissions" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Commissions & Bank Payouts</h1>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Track payout statements, TDS deductions, and bank transfer logs.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-extrabold text-emerald-800">
                    Next Scheduled Payout: <strong className="text-slate-900">15th March 2026</strong>
                  </div>
                </div>
              </div>

              {/* Payout History Table */}
              <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-black text-slate-900 text-sm">Completed Bank Transfers</h3>
                  <span className="text-xs text-slate-500 font-extrabold">TDS Rate: 5.0% (Section 194H)</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-black text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="p-4">Payout ID / Date</th>
                        <th className="p-4">Gross Commission</th>
                        <th className="p-4">TDS Deducted (5%)</th>
                        <th className="p-4">Net Payout Transferred</th>
                        <th className="p-4">Bank Account</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="font-black text-slate-900">TXN-8849201</div>
                          <div className="text-[10px] text-slate-500">28 Feb 2026</div>
                        </td>
                        <td className="p-4 font-black text-slate-900">₹25,894.00</td>
                        <td className="p-4 text-red-600 font-bold">₹1,294.70</td>
                        <td className="p-4 font-black text-emerald-700 text-sm">₹24,599.30</td>
                        <td className="p-4 text-slate-600">{agent.bankName} ({agent.accountNumberMasked})</td>
                        <td className="p-4">
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">
                            Success (NEFT)
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="font-black text-slate-900">TXN-7738192</div>
                          <div className="text-[10px] text-slate-500">31 Jan 2026</div>
                        </td>
                        <td className="p-4 font-black text-slate-900">₹32,100.00</td>
                        <td className="p-4 text-red-600 font-bold">₹1,605.00</td>
                        <td className="p-4 font-black text-emerald-700 text-sm">₹30,495.00</td>
                        <td className="p-4 text-slate-600">{agent.bankName} ({agent.accountNumberMasked})</td>
                        <td className="p-4">
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">
                            Success (IMPS)
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MY CLIENTS PORTFOLIO */}
          {activeTab === "clients" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Referred Client Portfolio</h1>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Manage all clients who registered under your agent referral link.</p>
                </div>
              </div>

              {/* Client List */}
              <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="relative max-w-xs w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search client by name..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <span className="text-xs font-black text-slate-500">Showing {clients.length} Clients</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-black text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="p-4">Client Name</th>
                        <th className="p-4">Mobile</th>
                        <th className="p-4">Gold Holdings</th>
                        <th className="p-4">Active SIP</th>
                        <th className="p-4">Commission Generated</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {clients.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <div className="font-black text-slate-900">{c.name}</div>
                            <div className="text-[10px] text-slate-500">Joined: {c.joined}</div>
                          </td>
                          <td className="p-4 text-slate-600">+91 {c.mobile}</td>
                          <td className="p-4 font-black text-amber-700">{c.goldGrams}g Gold</td>
                          <td className="p-4 text-emerald-700 font-black">{c.totalSIP}</td>
                          <td className="p-4 font-black text-slate-900">{c.totalEarned}</td>
                          <td className="p-4">
                            <a
                              href={`https://wa.me/91${c.mobile}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-black text-[11px] border border-emerald-200 transition-colors"
                            >
                              <MessageSquare size={13} /> WhatsApp
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LEAD PIPELINE */}
          {activeTab === "leads" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Customer Acquisition Pipeline</h1>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Track prospective clients, follow-up dates, and conversion status.</p>
                </div>
                <button
                  onClick={() => setShowAddLeadModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-md hover:bg-amber-600 flex items-center gap-2 cursor-pointer transition-all border-none outline-none"
                >
                  <Plus size={16} /> Add Prospect Lead
                </button>
              </div>

              {/* Lead Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {leads.map((lead) => (
                  <div key={lead.id} className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3 relative hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                        {lead.stage}
                      </span>
                      <span className="text-[10px] text-slate-500 font-extrabold">Follow up: {lead.followUpDate}</span>
                    </div>

                    <div>
                      <h3 className="font-black text-slate-900 text-base">{lead.name}</h3>
                      <p className="text-xs text-slate-500 font-bold mt-0.5">+91 {lead.mobile}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                      <div className="text-slate-600 font-semibold">Expected Investment: <strong className="text-emerald-700 font-black">{lead.expectedInvestment}</strong></div>
                      <div className="text-slate-500 font-medium italic">"{lead.notes}"</div>
                    </div>

                    <a
                      href={`https://wa.me/91${lead.mobile}?text=${encodeURIComponent(`Hi ${lead.name}, this is Rajesh Sharma your FipMoney Digital Gold Agent. Have you had a chance to look at the 24K Gold SIP details?`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <MessageSquare size={14} /> Send WhatsApp Follow-up
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MARKETING KIT & QR */}
          {activeTab === "marketing" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-200">
                <h1 className="text-2xl font-black text-slate-900">Agent Marketing Kit & QR Code</h1>
                <p className="text-xs text-slate-500 font-semibold mt-1">Use these personalized tools to acquire clients and grow your agent earnings.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* QR Code Card */}
                <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase border border-amber-300">
                    <QrCode size={14} /> Digital Agent QR
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl w-52 h-52 mx-auto flex items-center justify-center shadow-inner border border-slate-200">
                    {/* Clean Scannable QR Code Graphic */}
                    <div className="w-full h-full bg-white rounded-xl p-3 flex flex-col items-center justify-center text-slate-900 font-black text-xs text-center border-4 border-slate-900">
                      <QrCode size={100} className="text-slate-900 mx-auto" />
                      <span className="text-[10px] text-amber-700 mt-1 uppercase font-black tracking-wider">{agent.agentCode}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black text-slate-900 text-base">Scan to Register under Agent {agent.agentCode}</h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1">Show this QR code to prospective clients in person.</p>
                  </div>
                </div>

                {/* Referral Link & WhatsApp Copy */}
                <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wider">
                      Your Exclusive Agent Registration Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`https://www.test.fipmoney.com/signup?agent=${agent.agentCode}`}
                        className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-amber-800 font-black focus:outline-none"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs cursor-pointer transition-all shrink-0 border-none outline-none shadow-md"
                      >
                        {copiedLink ? "Copied!" : "Copy Link"}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">Ready WhatsApp Message Copy</h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                      "Namaste! Start building your wealth with 24K 99.9% Pure Digital Gold on FipMoney starting with just ₹10. Fully insured in Brink's Vaults. Register here: https://www.test.fipmoney.com/signup?agent={agent.agentCode}"
                    </p>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`Namaste! Start building your wealth with 24K 99.9% Pure Digital Gold on FipMoney starting with just ₹10. Fully insured in Brink's Vaults. Register here: https://www.test.fipmoney.com/signup?agent=${agent.agentCode}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
                    >
                      <MessageSquare size={16} /> Share directly on WhatsApp
                    </a>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: AGENT SUPPORT & FAQS */}
          {activeTab === "support" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-200">
                <h1 className="text-2xl font-black text-slate-900">Agent Relationship Support Desk</h1>
                <p className="text-xs text-slate-500 font-semibold mt-1">Get 24/7 dedicated assistance for client onboarding, payouts, and marketing support.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Dedicated RM Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-yellow-50 to-white border border-amber-200/90 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 font-black text-lg flex items-center justify-center shadow-md">
                      S
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-base">Siddharth Varma</h3>
                      <span className="text-xs text-amber-800 font-black">Your Dedicated Agent Relationship Manager</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Available Monday - Saturday (9:00 AM - 7:00 PM) for VIP agent support, high-value client onboarding, and payout queries.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-500/20"
                    >
                      <MessageSquare size={16} /> Chat on WhatsApp
                    </a>
                    <a
                      href="tel:1800123456"
                      className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <PhoneCall size={16} /> Call RM
                    </a>
                  </div>
                </div>

                {/* Priority Ticket Form */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                  <h3 className="font-black text-slate-900 text-base">Raise Priority Support Ticket</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Ticket Subject (e.g. Client KYC assistance)"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                    <textarea
                      rows={3}
                      placeholder="Describe your issue or query in detail..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={() => alert("Priority agent ticket submitted successfully! Response time < 2 hours.")}
                      className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs cursor-pointer hover:bg-amber-600 transition-colors shadow-md border-none outline-none"
                    >
                      Submit Priority Ticket
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 7: AGENT PROFILE & BANK */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-200">
                <h1 className="text-2xl font-black text-slate-900">Agent Profile & Verified Bank Payouts</h1>
                <p className="text-xs text-slate-500 font-semibold mt-1">Review your KYC verification, PAN details, and bank account for automated payouts.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Profile Details */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                  <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <ShieldCheck className="text-emerald-600" size={18} /> Agent Identity Credentials
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500 font-semibold">Agent Partner Name</span>
                      <span className="font-black text-slate-900">{agent.name}</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500 font-semibold">Agent Code</span>
                      <span className="font-black text-amber-700 font-mono">{agent.agentCode}</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500 font-semibold">Mobile Number</span>
                      <span className="font-black text-slate-900">+91 {agent.mobile}</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500 font-semibold">PAN Number</span>
                      <span className="font-black text-slate-900 uppercase">{agent.panNumber}</span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="text-slate-500 font-semibold">Partner KYC Status</span>
                      <span className="bg-emerald-100 text-emerald-800 font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase border border-emerald-300">
                        Verified Partner
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bank Account */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                  <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <Building2 className="text-amber-600" size={18} /> Payout Bank Account Details
                  </h3>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">Bank Name</span>
                      <span className="font-black text-slate-900">{agent.bankName}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">Account Number</span>
                      <span className="font-black text-emerald-700 font-mono">{agent.accountNumberMasked}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">IFSC Code</span>
                      <span className="font-black text-slate-900 uppercase">{agent.ifscCode}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                    All monthly agent commissions are automatically transferred to this bank account on the 15th of every month after TDS compliance.
                  </p>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* Modal: Add New Lead / Prospect */}
      <AnimatePresence>
        {showAddLeadModal && (
          <motion.div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-black text-slate-900 text-lg">Add Client Prospect</h3>
                <button onClick={() => setShowAddLeadModal(false)} className="text-slate-400 hover:text-slate-900 font-bold">✕</button>
              </div>

              <form onSubmit={handleAddLeadSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-black text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    placeholder="Prospect's full name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={newLead.mobile}
                    onChange={(e) => setNewLead({ ...newLead, mobile: e.target.value.replace(/\D/g, '') })}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 mb-1">Expected Gold Investment (₹)</label>
                  <input
                    type="number"
                    value={newLead.investment}
                    onChange={(e) => setNewLead({ ...newLead, investment: e.target.value })}
                    placeholder="e.g. 50000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 mb-1">Notes / Preferences</label>
                  <input
                    type="text"
                    value={newLead.notes}
                    onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                    placeholder="e.g. Interested in Gold SIP"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddLeadModal(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black cursor-pointer border-none outline-none shadow-md"
                  >
                    Save Prospect Lead
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Active Clients WhatsApp Purchase Reminder Selection */}
      <AnimatePresence>
        {showWhatsAppModal && (
          <motion.div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center font-bold shadow-sm">
                    <MessageSquare size={18} fill="white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">WhatsApp Reminders</h3>
                    <p className="text-[11px] text-slate-500 font-semibold">Active Clients Monthly Gold Purchase Alerts</p>
                  </div>
                </div>
                <button onClick={() => setShowWhatsAppModal(false)} className="text-slate-400 hover:text-slate-900 font-bold cursor-pointer">✕</button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {clients.map((c) => (
                  <div key={c.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-xs truncate">{c.name}</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded-md border border-emerald-200">
                          {c.goldGrams}g Gold
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-semibold font-mono block mt-0.5">
                        +91 {c.mobile} • {c.totalSIP}
                      </span>
                    </div>

                    <button
                      onClick={() => handleSendWhatsAppReminder(c.mobile, c.name)}
                      className="py-1.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer border-none outline-none shadow-2xs shrink-0"
                    >
                      <MessageSquare size={12} fill="white" /> Send WhatsApp
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    handleSendWhatsAppReminder();
                    setShowWhatsAppModal(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border-none outline-none shadow-md"
                >
                  <MessageSquare size={14} fill="white" /> Broadcast Reminder to All Active Clients
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
