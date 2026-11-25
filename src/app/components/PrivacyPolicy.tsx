"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Shield, Lock, Eye, UserCheck, Database, FileText, Scale,
  Phone, Mail, MapPin, Clock, Search, CheckCircle2, AlertCircle,
  ExternalLink, Printer, ShieldCheck, Download, ChevronRight, Server,
  Fingerprint, Key, RefreshCw, FileCheck2, HelpCircle, CreditCard
} from "lucide-react";
import ScrollToTopProgress from "./ui/ScrollToTopProgress";

interface PrivacyPolicyProps {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  const [activeSection, setActiveSection] = useState("preamble");
  const [searchQuery, setSearchQuery] = useState("");

  const sections = [
    { id: "preamble", title: "1. Scope & Regulatory Framework", icon: Scale },
    { id: "information-collection", title: "2. Personal & Financial Data We Collect", icon: Database },
    { id: "automated-data", title: "3. Automated Telemetry & Device Data", icon: Server },
    { id: "legal-basis", title: "4. Legal Basis & Processing Purposes", icon: FileCheck2 },
    { id: "sharing-disclosure", title: "5. Information Sharing & Custodians", icon: UserCheck },
    { id: "vault-security", title: "6. Bank-Grade Security & Encryption", icon: Lock },
    { id: "data-sovereignty", title: "7. Data Localization & Retention (PMLA)", icon: ShieldCheck },
    { id: "dpdp-rights", title: "8. Your Rights Under DPDP Act 2023", icon: Key },
    { id: "account-deletion", title: "9. Account Deletion & Erasure Policy", icon: AlertCircle },
    { id: "cookies-tracking", title: "10. Cookies & Session Management", icon: Eye },
    { id: "minors", title: "11. Minors & Children's Privacy", icon: Shield },
    { id: "grievance-dpo", title: "12. Data Protection Officer & Grievances", icon: Phone },
  ];

  // Observe scroll to highlight active section in TOC
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    const container = document.getElementById("privacy-scroll-container");
    if (element) {
      if (container) {
        const offset = 80;
        const containerTop = container.getBoundingClientRect().top;
        const elementTop = element.getBoundingClientRect().top;
        const scrollTarget = container.scrollTop + (elementTop - containerTop) - offset;
        container.scrollTo({ top: Math.max(0, scrollTarget), behavior: "smooth" });
      } else {
        const offset = 90;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const offsetPosition = elementRect - bodyRect - offset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      id="privacy-scroll-container" 
      className="flex-1 h-full w-full overflow-y-auto overflow-x-hidden bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#047857] selection:text-white pb-36"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* ── TOP STICKY HEADER (100% Width) ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs w-full pt-[env(safe-area-inset-top,0px)]">
        <div className="w-full px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="flex items-center gap-2 select-none">
              <div>
                <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 block leading-none">
                  Privacy Policy
                </span>
                <span className="text-[10px] font-extrabold text-[#047857] tracking-wider uppercase">
                  Data Governance & Security
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#047857] text-[11px] font-bold">
              <ShieldCheck size={14} />
              <span>DPDP Act 2023 Compliant</span>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Print Policy"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER (100% Width Modern Gradient) ── */}
      <section className="w-full bg-gradient-to-b from-white via-[#F0FDF4]/50 to-[#F8FAFC] border-b border-slate-200/80 py-8 sm:py-12 lg:py-14 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
        {/* Glow Particles */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="w-full max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-[#047857] text-[11px] font-black uppercase tracking-wider">
            <Lock size={12} className="text-[#047857]" />
            <span>Bank-Grade Privacy & Data Protection Policy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Privacy Policy & Data Fiduciary Disclosures
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium max-w-3xl leading-relaxed">
            Fipmoney Technologies Private Limited ("Fipmoney", "we", "us", or "our") is committed to protecting your financial and personal data under the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, the <strong>Information Technology Act, 2000</strong>, and <strong>RBI / PMLA regulatory directives</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <Clock size={14} className="text-[#047857]" />
              <span>Version 3.2 • Effective November 2026</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <Server size={14} className="text-[#047857]" />
              <span>100% Indian Data Sovereignty</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <ShieldCheck size={14} className="text-[#047857]" />
              <span>AES-256 Bit Encryption at Rest</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MOBILE HORIZONTAL TABLE OF CONTENTS CHIPS ── */}
      <div className="lg:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 overflow-x-auto no-scrollbar flex items-center gap-2">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => scrollTo(sec.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all shrink-0 cursor-pointer border ${
              activeSection === sec.id
                ? "bg-[#047857] text-white border-[#047857] shadow-xs"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {sec.title}
          </button>
        ))}
      </div>

      {/* ── MAIN TWO-COLUMN 100% RESPONSIVE CONTAINER ── */}
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT COLUMN: STICKY TOC SIDEBAR (Laptop/Desktop) ── */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileText size={16} className="text-[#047857]" />
                  <span>Table of Contents</span>
                </span>
                <span className="text-[11px] font-bold text-slate-400">12 Clauses</span>
              </div>

              <nav className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
                {sections.map((sec) => {
                  const Icon = sec.icon;
                  const isCur = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollTo(sec.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all cursor-pointer border ${
                        isCur
                          ? "bg-emerald-50 text-[#047857] border-emerald-200 font-extrabold shadow-2xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent"
                      }`}
                    >
                      <Icon size={14} className={isCur ? "text-[#047857]" : "text-slate-400"} />
                      <span className="line-clamp-1">{sec.title}</span>
                      {isCur && <ChevronRight size={14} className="ml-auto shrink-0 text-[#047857]" />}
                    </button>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                    Grievance Officer
                  </span>
                  <span className="text-xs font-black text-slate-900 block mt-0.5">
                    grievance@fipmoney.com
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Response within 24 hours guaranteed
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* ── RIGHT COLUMN: FULL LEGAL CONTENT (100% Fluid Width) ── */}
          <main className="lg:col-span-8 space-y-10">

            {/* CLAUSE 1: PREAMBLE */}
            <section id="preamble" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-4">
              <div className="flex items-center gap-3 text-[#047857]">
                <Scale size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  1. Scope & Regulatory Framework
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                This Privacy Policy outlines how <strong>Fipmoney Technologies Private Limited</strong> (CIN: U66190KA2024PTC184920), having its registered corporate office at Bangalore, Karnataka, India ("Fipmoney", "we", "us", or "our"), acts as a <strong>Data Fiduciary</strong> under the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>.
              </p>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                This document is published in accordance with the provisions of Rule 3(1) of the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>, and Rule 4 of the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (SPDI Rules)</strong>.
              </p>

              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1.5 text-xs text-emerald-950 font-medium">
                <div className="font-black text-[#064e3b] flex items-center gap-1.5">
                  <ShieldCheck size={16} />
                  <span>Key Fiduciary Commitment</span>
                </div>
                <div>
                  Fipmoney will NEVER sell, rent, monetize, or trade your personal or financial data to third-party ad networks or brokers. Your data is used exclusively to facilitate bullion custody, AML statutory compliance, and banking payout settlement.
                </div>
              </div>
            </section>

            {/* CLAUSE 2: INFORMATION WE COLLECT */}
            <section id="information-collection" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-5">
              <div className="flex items-center gap-3 text-[#047857]">
                <Database size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  2. Personal & Financial Data We Collect
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                To enable digital gold/silver transactions and comply with the <strong>Prevention of Money Laundering Act, 2002 (PMLA)</strong>, we collect the following categories of information:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="font-black text-slate-900 flex items-center gap-2">
                    <UserCheck size={16} className="text-[#047857]" />
                    <span>Identity & Profile Data</span>
                  </div>
                  <p className="text-slate-600 font-medium">
                    Full Legal Name, Mobile Number, Verified Email Address, Date of Birth, Gender, Residential Address, and Profile Avatar.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="font-black text-slate-900 flex items-center gap-2">
                    <FileCheck2 size={16} className="text-[#047857]" />
                    <span>KYC & Tax Identification</span>
                  </div>
                  <p className="text-slate-600 font-medium">
                    Permanent Account Number (PAN Card), Aadhaar verification metadata (via DigiLocker / UIDAI mask), and nominee records.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="font-black text-slate-900 flex items-center gap-2">
                    <CreditCard size={16} className="text-[#047857]" />
                    <span>Financial & Banking Payout Data</span>
                  </div>
                  <p className="text-slate-600 font-medium">
                    Bank Account Number, IFSC Code, Bank Branch, UPI ID (VPA), and Penny-Drop verification settlement confirmations.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="font-black text-slate-900 flex items-center gap-2">
                    <Shield size={16} className="text-[#047857]" />
                    <span>Security Credentials</span>
                  </div>
                  <p className="text-slate-600 font-medium">
                    Hashed 4-digit Security TPIN (bcrypt salted, one-way hash; never accessible by staff), SMS OTP verification tokens.
                  </p>
                </div>
              </div>
            </section>

            {/* CLAUSE 3: AUTOMATED DATA */}
            <section id="automated-data" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-4">
              <div className="flex items-center gap-3 text-[#047857]">
                <Server size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  3. Automated Telemetry & Device Data
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                When you use our Android Application, iOS App, or Web Portal, our secure infrastructure automatically logs technical parameters required to detect fraud, prevent SIM-swap attacks, and secure transaction sessions:
              </p>

              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium list-disc pl-5">
                <li><strong>Device Identifiers:</strong> Operating System version, device model, screen resolution, and unique device hardware UUID.</li>
                <li><strong>Network & Geolocation:</strong> IP address, ISP provider, connection type (Wi-Fi/Cellular), and coarse geographic region for fraud telemetry.</li>
                <li><strong>Biometric Authentication Flags:</strong> We check whether biometric unlock (Fingerprint / Face Unlock) is activated via Android KeyStore / Apple Secure Enclave. <em>Note: Your raw fingerprint or facial scan NEVER leaves your hardware device and is never transmitted to or stored by Fipmoney.</em></li>
              </ul>
            </section>

            {/* CLAUSE 4: LEGAL BASIS */}
            <section id="legal-basis" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-4">
              <div className="flex items-center gap-3 text-[#047857]">
                <FileCheck2 size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  4. Legal Basis & Processing Purposes
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                We process your personal data under the following legitimate grounds permitted under Section 4 and Section 7 of the DPDP Act 2023:
              </p>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-[#047857] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
                  <div>
                    <strong className="text-slate-900 block font-extrabold">Fulfillment of Bullion Purchase & Vaulting Mandate:</strong>
                    Allocating physical fine gold (24K 99.9%) corresponding to your purchase in Brink's India vaults under IDBI Trusteeship.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-[#047857] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
                  <div>
                    <strong className="text-slate-900 block font-extrabold">Statutory AML & PMLA Compliance:</strong>
                    Reporting high-value transactions, validating PAN with NSDL/Income Tax Department databases, and enforcing anti-money laundering limits.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-[#047857] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</div>
                  <div>
                    <strong className="text-slate-900 block font-extrabold">Instant Banking Payout Settlement:</strong>
                    Disbursing sale proceeds directly to your linked bank account via NPCI IMPS/NEFT payment switches.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-[#047857] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">4</div>
                  <div>
                    <strong className="text-slate-900 block font-extrabold">Transactional Notifications & Invoicing:</strong>
                    Delivering legal tax invoices (GST compliant), holding statements, and OTP security codes via SMS, WhatsApp, and Email.
                  </div>
                </div>
              </div>
            </section>

            {/* CLAUSE 5: INFORMATION SHARING */}
            <section id="sharing-disclosure" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-4">
              <div className="flex items-center gap-3 text-[#047857]">
                <UserCheck size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  5. Information Sharing & Custodians
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                To deliver our digital gold and financial services, data is shared strictly on a need-to-know basis with regulated entities and verified service providers:
              </p>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-1">
                  <span className="font-black text-slate-900 block">A. Independent Trustee Administrator (IDBI Trusteeship Services Limited)</span>
                  <p className="text-slate-600 font-medium">
                    Bullion balance sheets, holding ledgers, and transaction references are shared with the Trustee Administrator who holds a legal first charge on the gold stored in vaults on your behalf.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-1">
                  <span className="font-black text-slate-900 block">B. Vault Keepers & Insurers (Brink's India & Global Underwriters)</span>
                  <p className="text-slate-600 font-medium">
                    Aggregated physical metal weight schedules and insurance coverage audits are maintained with certified vault custodians.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-1">
                  <span className="font-black text-slate-900 block">C. NPCI, Banks & Licensed Payment Aggregators (Razorpay / Cashfree)</span>
                  <p className="text-slate-600 font-medium">
                    Payment tokens, VPA addresses, and mandate identifiers are shared under RBI Payment Aggregator (PA/PG) guidelines.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-1">
                  <span className="font-black text-slate-900 block">D. Government & Law Enforcement Authorities</span>
                  <p className="text-slate-600 font-medium">
                    We disclose records if mandated by an official court order, regulatory summons, or statutory requirement under the Code of Criminal Procedure, 1973 or PMLA, 2002.
                  </p>
                </div>
              </div>
            </section>

            {/* CLAUSE 6: SECURITY MEASURES */}
            <section id="vault-security" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-4">
              <div className="flex items-center gap-3 text-[#047857]">
                <Lock size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  6. Bank-Grade Security & Encryption
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Fipmoney maintains a formal Information Security Management System (ISMS) adhering to ISO/IEC 27001 standards:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="font-black text-emerald-900">Data in Transit</div>
                  <div className="text-slate-600 font-medium">TLS 1.3 protocol with 256-bit encryption; SSL pinning implemented on mobile apps.</div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="font-black text-emerald-900">Data at Rest</div>
                  <div className="text-slate-600 font-medium">AES-256 bit hardware-level encryption across MongoDB clusters and encrypted backups.</div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="font-black text-emerald-900">Access Governance</div>
                  <div className="text-slate-600 font-medium">Strict zero-trust RBAC (Role-Based Access Control) with biometric 2FA for engineering staff.</div>
                </div>
              </div>
            </section>

            {/* CLAUSE 7: DATA RETENTION */}
            <section id="data-sovereignty" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-4">
              <div className="flex items-center gap-3 text-[#047857]">
                <ShieldCheck size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  7. Data Localization & Retention (PMLA)
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                In strict compliance with the RBI Directive on Storage of Payment System Data (2018) and the DPDP Act 2023, <strong>all customer data, payment logs, and bullion audit ledgers reside exclusively on sovereign servers located within the Republic of India</strong>.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
                <div className="font-black text-slate-900 uppercase tracking-wider text-[11px]">
                  Statutory Retention Periods:
                </div>
                <div>
                  • <strong>KYC & Transaction Ledgers:</strong> Maintained for a mandatory period of <strong>5 years</strong> following account termination or transaction completion, as legally required under Section 12 of the Prevention of Money Laundering Act, 2002.<br/>
                  • <strong>Session & Device Logs:</strong> Retained for <strong>180 days</strong> pursuant to CERT-In cybersecurity directives.
                </div>
              </div>
            </section>

            {/* CLAUSE 8: YOUR RIGHTS */}
            <section id="dpdp-rights" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-4">
              <div className="flex items-center gap-3 text-[#047857]">
                <Key size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  8. Your Rights Under DPDP Act 2023
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                As a <strong>Data Principal</strong> under Indian law, you possess the following legally enforceable rights:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="font-black text-slate-900 block">Right to Access Information</span>
                  <span className="text-slate-500 font-medium">Request a summary of personal data processed and identities of Data Processors.</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="font-black text-slate-900 block">Right to Correction & Updating</span>
                  <span className="text-slate-500 font-medium">Rectify inaccurate, incomplete, or out-of-date personal identifiers via app settings.</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="font-black text-slate-900 block">Right to Grievance Redressal</span>
                  <span className="text-slate-500 font-medium">Access readily available grievance mechanisms before approaching the Data Protection Board.</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="font-black text-slate-900 block">Right to Nominate</span>
                  <span className="text-slate-500 font-medium">Nominate any individual to exercise your rights in the event of death or incapacity.</span>
                </div>
              </div>
            </section>

            {/* CLAUSE 9: ACCOUNT DELETION */}
            <section id="account-deletion" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-4">
              <div className="flex items-center gap-3 text-[#047857]">
                <AlertCircle size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  9. Account Deletion & Erasure Policy
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                In compliance with Google Play Store Policies and Section 12(3) of the DPDP Act 2023, Fipmoney provides a direct, unconditional mechanism for users to request account termination and personal data erasure:
              </p>

              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-2">
                <div className="font-black text-amber-900 text-sm">How to Request Account Deletion:</div>
                <p className="font-medium">
                  1. <strong>In-App Self Service:</strong> Navigate to <strong>Settings &gt; Security &gt; Delete Account</strong>, enter your registered 4-digit TPIN, and confirm deletion.<br/>
                  2. <strong>Direct Web Portal:</strong> Visit our dedicated public account deletion portal at <a href="/delete-account" className="font-black underline text-amber-900">fipmoney.com/delete-account</a>.<br/>
                  3. <strong>Email Request:</strong> Send an email from your registered address to <strong>support@fipmoney.com</strong> with the subject line "Permanent Account Deletion Request".
                </p>
                <div className="text-[11px] text-amber-800 pt-1 border-t border-amber-200">
                  <em>Prerequisite: All digital gold and silver balances must be withdrawn or liquidated before final account purge. Non-financial marketing telemetry will be permanently wiped within 7 working days.</em>
                </div>
              </div>
            </section>

            {/* CLAUSE 10: COOKIES & TRACKING */}
            <section id="cookies-tracking" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-4">
              <div className="flex items-center gap-3 text-[#047857]">
                <Eye size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  10. Cookies & Session Management
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                We use secure, HttpOnly, SameSite cookies and cryptographically signed JWT session tokens strictly necessary to maintain authenticated sessions and protect your wallet. We do NOT deploy invasive cross-site tracking cookies.
              </p>
            </section>

            {/* CLAUSE 11: MINORS */}
            <section id="minors" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-4">
              <div className="flex items-center gap-3 text-[#047857]">
                <Shield size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  11. Minors & Children's Privacy
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Fipmoney services are strictly intended for individuals who are <strong>18 years of age or older</strong> and legally capable of entering into binding contracts under the Indian Contract Act, 1872. We do not knowingly solicit or collect data from minors.
              </p>
            </section>

            {/* CLAUSE 12: GRIEVANCE OFFICER & DPO */}
            <section id="grievance-dpo" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-5">
              <div className="flex items-center gap-3 text-[#047857]">
                <Phone size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  12. Data Protection Officer & Grievance Redressal
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                In compliance with Rule 3(2) of the Information Technology Rules, 2021 and Section 8(9) of the DPDP Act, 2023, the details of our designated <strong>Grievance Officer & Data Protection Officer (DPO)</strong> are provided below:
              </p>

              <div className="bg-gradient-to-br from-emerald-50/70 via-white to-slate-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 space-y-3 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Designated Officer</span>
                    <strong className="text-slate-900 text-sm sm:text-base">Mr. Arvind N. Swaminathan</strong>
                    <span className="text-xs text-emerald-800 font-bold block mt-0.5">Head of Legal, Regulatory Compliance & DPO</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Direct Redressal Email</span>
                    <strong className="text-slate-900 font-mono text-sm sm:text-base">grievance@fipmoney.com</strong>
                    <span className="text-xs text-slate-500 font-semibold block mt-0.5">Copied to: dpo@fipmoney.com</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 font-medium">
                  <div>Corporate Address: Fipmoney Towers, 4th Block, Koramangala, Bangalore - 560034, India</div>
                  <div className="font-extrabold text-[#047857]">SLA: Response within 24 Hours</div>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>

      {/* ── BOTTOM RIGHT CIRCULAR PROGRESS SCROLL-TO-TOP BUTTON ── */}
      <ScrollToTopProgress containerId="privacy-scroll-container" />
    </div>
  );
}
