"use client";

import React, { useState } from "react";
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
  Filter
} from "lucide-react";
import { getLoggedInAgent, clearAgentSession, DgaAgent } from "../utils/agentStorage";

interface AgentDashboardProps {
  onLogout?: () => void;
}

type AgentTab = "overview" | "commissions" | "clients" | "leads" | "marketing" | "support" | "profile";

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

  const [activeTab, setActiveTab] = useState<AgentTab>("overview");
  const [copiedLink, setCopiedLink] = useState(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

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

  const handleCopyLink = () => {
    const link = `https://www.test.fipmoney.com/signup?agent=${agent.agentCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      
      {/* Top Agent Bar Header (Light Mode) */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 shadow-md shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-amber-400 text-lg">
                FM
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-base tracking-tight">DGA Partner Console</span>
                <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Award size={12} className="text-amber-600" /> {agent.tier} Agent
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
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 font-extrabold text-xs transition-all cursor-pointer shadow-2xs"
          >
            {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
            {copiedLink ? "Link Copied!" : "Share Agent Link"}
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-black text-sm flex items-center justify-center shadow-xs">
              {agent.name.charAt(0)}
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-black text-slate-900">{agent.name}</span>
              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Verified Partner
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
        <aside className="w-full md:w-64 bg-white border-r border-slate-200/90 p-4 shrink-0 shadow-xs">
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === "overview" ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"}`}
            >
              <TrendingUp size={16} /> Overview & Earnings
            </button>

            <button
              onClick={() => setActiveTab("commissions")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === "commissions" ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"}`}
            >
              <Wallet size={16} /> Commissions & Payouts
            </button>

            <button
              onClick={() => setActiveTab("clients")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === "clients" ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"}`}
            >
              <Users size={16} /> My Clients Portfolio ({clients.length})
            </button>

            <button
              onClick={() => setActiveTab("leads")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === "leads" ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"}`}
            >
              <UserCheck size={16} /> Lead Pipeline ({leads.length})
            </button>

            <button
              onClick={() => setActiveTab("marketing")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === "marketing" ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"}`}
            >
              <QrCode size={16} /> Marketing Kit & QR
            </button>

            <button
              onClick={() => setActiveTab("support")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === "support" ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"}`}
            >
              <HelpCircle size={16} /> Agent Support Desk
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${activeTab === "profile" ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"}`}
            >
              <Building2 size={16} /> Agent Profile & Bank
            </button>
          </nav>

          {/* Agent Tier Progress Card */}
          <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-amber-500/5 border border-amber-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-black text-amber-800 mb-2">
              <span className="flex items-center gap-1"><Award size={14} className="text-amber-600" /> {agent.tier} Rank</span>
              <span>82%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-2">
              <div className="bg-gradient-to-r from-amber-500 to-yellow-500 h-full rounded-full w-[82%]" />
            </div>
            <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
              Manage 15.5g more gold to unlock <strong className="text-amber-800 font-black">Executive Diamond Tier (1.0% Commission)</strong>!
            </p>
          </div>
        </aside>

        {/* Right Tab Content View */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          
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

    </div>
  );
}
