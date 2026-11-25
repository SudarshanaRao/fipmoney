"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Scale, Shield, FileText, CheckCircle2, AlertTriangle,
  Lock, Coins, CreditCard, PackageCheck, RefreshCw, UserCheck,
  Printer, Clock, ExternalLink, HelpCircle, Phone, ChevronRight,
  ShieldCheck, AlertCircle, Building2, Landmark, DollarSign, Award
} from "lucide-react";
import ScrollToTopProgress from "./ui/ScrollToTopProgress";

interface TermsAndConditionsProps {
  onBack: () => void;
}

export default function TermsAndConditions({ onBack }: TermsAndConditionsProps) {
  const [activeSection, setActiveSection] = useState("preamble");

  const sections = [
    { id: "preamble", title: "1. Regulatory Status & Preamble", icon: Scale },
    { id: "eligibility", title: "2. User Eligibility & KYC Mandate", icon: UserCheck },
    { id: "custodial-structure", title: "3. 100% Physical Custody & Brink's Vaulting", icon: Landmark },
    { id: "trustee-charge", title: "4. Independent Trustee Administrator (IDBI)", icon: ShieldCheck },
    { id: "pricing-gst", title: "5. Spot Wholesale Pricing, Spreads & 3% GST", icon: Coins },
    { id: "purchase-mechanics", title: "6. Buying Digital Gold & Silver", icon: DollarSign },
    { id: "sip-autopay", title: "7. Daily & Monthly SIP Mandates (UPI AutoPay)", icon: RefreshCw },
    { id: "sale-withdrawal", title: "8. Selling & Instant Bank Payouts (IMPS)", icon: CreditCard },
    { id: "physical-delivery", title: "9. Minting & Doorstep Physical Delivery", icon: PackageCheck },
    { id: "insurance-perils", title: "10. Insurance Coverage & Force Majeure", icon: Shield },
    { id: "aml-compliance", title: "11. Anti-Money Laundering (PMLA 2002)", icon: AlertCircle },
    { id: "liability-governing", title: "12. Limitation of Liability & Bengaluru Jurisdiction", icon: Building2 },
    { id: "grievance-escalation", title: "13. Statutory Grievance Redressal Matrix", icon: Phone }
  ];

  // Observe scroll for TOC active states
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
    const container = document.getElementById("terms-scroll-container");
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
      id="terms-scroll-container" 
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
                  Terms of Service
                </span>
                <span className="text-[10px] font-extrabold text-[#047857] tracking-wider uppercase">
                  Custodial Trust & User Agreement
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#047857] text-[11px] font-bold">
              <ShieldCheck size={14} />
              <span>IS 1417:2016 24K 99.9% Pure</span>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Print Terms"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER (100% Fluid Width) ── */}
      <section className="w-full bg-gradient-to-b from-white via-[#F0FDF4]/50 to-[#F8FAFC] border-b border-slate-200/80 py-8 sm:py-12 lg:py-14 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
        {/* Glow Particles */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="w-full max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-[#047857] text-[11px] font-black uppercase tracking-wider">
            <Scale size={12} className="text-[#047857]" />
            <span>Master User Agreement & Custodial Trust Terms</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Terms & Conditions of Service
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium max-w-3xl leading-relaxed">
            Please read these Terms and Conditions carefully. They constitute an enforceable digital contract between you ("Customer", "User", or "You") and <strong>Fipmoney Technologies Private Limited</strong> governing all 24K digital gold, digital silver, SIP savings, vault storage, and instant bank payout operations.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <Clock size={14} className="text-[#047857]" />
              <span>Effective Date: November 2026</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <Landmark size={14} className="text-[#047857]" />
              <span>Custody: Brink's India Vaults</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <ShieldCheck size={14} className="text-[#047857]" />
              <span>Trustee: IDBI Trusteeship Services</span>
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

      {/* ── MAIN TWO-COLUMN 100% FLUID RESPONSIVE CONTAINER ── */}
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT COLUMN: STICKY TOC SIDEBAR (Laptop/Desktop) ── */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileText size={16} className="text-[#047857]" />
                  <span>Terms Index</span>
                </span>
                <span className="text-[11px] font-bold text-slate-400">13 Clauses</span>
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
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                    Customer Support
                  </span>
                  <span className="text-xs font-black text-slate-900 block mt-0.5">
                    1800 123 4567 | support@fipmoney.com
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    Mon - Sat (9:00 AM - 8:00 PM IST)
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
                  1. Regulatory Status & Preamble
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                This electronic record is generated by an automated computer system and does not require any physical or digital signatures. By accessing, downloading, browsing, or utilizing the <strong>Fipmoney Platform</strong> (including mobile applications, web portals, APIs, and associated widgets), you irrevocably accept and agree to be bound by these Terms and Conditions.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
                <div className="font-extrabold text-slate-900">Corporate & Legal Identity:</div>
                <div>
                  Fipmoney Technologies Private Limited operates as an online digital financial technology intermediary connecting retail consumers with certified bullion vault keepers, physical refineries, and licensed payment aggregators.
                </div>
              </div>
            </section>

            {/* CLAUSE 2: USER ELIGIBILITY */}
            <section id="eligibility" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-4">
              <div className="flex items-center gap-3 text-[#047857]">
                <UserCheck size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  2. User Eligibility & KYC Mandate
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                To create an account and transact on Fipmoney, you represent, warrant, and covenant that:
              </p>

              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium list-disc pl-5">
                <li>You are an individual citizen or resident of India who is at least <strong>18 years of age</strong> and competent to contract under the Indian Contract Act, 1872.</li>
                <li>All identification information submitted (including Name, Mobile Number, Email, and Permanent Account Number [PAN]) is genuine, accurate, and belongs strictly to you.</li>
                <li>You will maintain strict confidentiality of your 4-digit Transaction PIN (TPIN) and session tokens. All orders authenticated with your credentials shall be deemed authorized exclusively by you.</li>
                <li>In accordance with RBI and PMLA guidelines, PAN verification is mandatory for transactions exceeding ₹50,000, and reverse penny-drop verification is enforced prior to bank withdrawals.</li>
              </ul>
            </section>

            {/* CLAUSE 3: 100% PHYSICAL CUSTODY & VAULTING */}
            <section id="custodial-structure" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-4">
              <div className="flex items-center gap-3 text-[#047857]">
                <Landmark size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  3. 100% Physical Custody & Brink's Vaulting
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Every unit of digital gold purchased through Fipmoney corresponds to physical fine gold of <strong>24 Karat purity (99.5% minimum, 99.9% standard, or 99.99% fine gold adhering to IS 1417:2016 standards)</strong> physically stored in Grade-A high-security vaults managed by <strong>Brink's India Private Limited</strong>.
              </p>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs text-emerald-950">
                <div className="font-black text-[#064e3b] flex items-center gap-2">
                  <Award size={16} />
                  <span>Mathematical Fine Gold Allocation Formula</span>
                </div>
                <div className="font-medium leading-relaxed">
                  Physical bullion is maintained on a fine gold equivalence basis. If a customer purchases 1.0000g of 99.99% gold, the vault keeper allocates at least <strong>1.0049g of 99.5% pure physical bullion</strong> (Calculation: 1.0000g × 0.9999 / 0.9950 = 1.0049g). You hold direct, unencumbered physical title to your gold weight at all times.
                </div>
              </div>
            </section>

            {/* CLAUSE 4: TRUSTEE ADMINISTRATOR */}
            <section id="trustee-charge" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-4">
              <div className="flex items-center gap-3 text-[#047857]">
                <ShieldCheck size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  4. Independent Trustee Administrator (IDBI)
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                To guarantee that customer holdings are ring-fenced from company assets, Fipmoney has appointed <strong>IDBI Trusteeship Services Limited ("Trustee Administrator")</strong> as the independent fiduciary entity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                  <strong className="text-slate-900 block font-black">Legal First Charge</strong>
                  <span className="text-slate-600 font-medium">The Trustee holds an exclusive legal first charge over all bullion vaulted with Brink's on behalf of customers.</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                  <strong className="text-slate-900 block font-black">Insolvency Protection</strong>
                  <span className="text-slate-600 font-medium">In the event of liquidation of Fipmoney, your gold cannot be claimed by creditors of the company.</span>
                </div>
              </div>
            </section>

            {/* CLAUSE 5: PRICING & GST */}
            <section id="pricing-gst" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-4">
              <div className="flex items-center gap-3 text-[#047857]">
                <Coins size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  5. Spot Wholesale Pricing, Spreads & 3% GST
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Live prices displayed on the Fipmoney portal reflect wholesale spot rates derived from international bullion benchmarks, USD/INR exchange rates, customs duty, and domestic market premiums:
              </p>

              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium list-disc pl-5">
                <li><strong>Goods and Services Tax (GST):</strong> In compliance with the Central Goods and Services Tax Act, 2017, a mandatory <strong>3.0% GST</strong> is levied on all gold purchases and remitted to the Government of India.</li>
                <li><strong>Buy-Sell Spread:</strong> As standard in institutional bullion markets, a commercial spread exists between buying and selling quotes to account for transit, minting, assaying, insurance, hedging, and payment gateway costs.</li>
                <li><strong>Price Lock Window:</strong> When you initiate a buy or sell transaction, the quote is dynamically locked for <strong>5 minutes</strong> to protect you from intra-minute market volatility.</li>
              </ul>
            </section>

            {/* CLAUSE 6: BUYING DIGITAL GOLD */}
            <section id="purchase-mechanics" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-4">
              <div className="flex items-center gap-3 text-[#047857]">
                <DollarSign size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  6. Buying Digital Gold & Silver
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Purchases can be made either in rupee denomination (minimum ₹10) or in weight denomination (up to 4 decimal places). Once a payment is confirmed via UPI, Net Banking, or Debit Card, the physical gold is instantly credited to your encrypted Vault Ledger, and a GST tax invoice is delivered to your registered email.
              </p>
            </section>

            {/* CLAUSE 7: SIP MANDATES */}
            <section id="sip-autopay" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-4">
              <div className="flex items-center gap-3 text-[#047857]">
                <RefreshCw size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  7. Daily & Monthly SIP Mandates (UPI AutoPay)
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Fipmoney provides Systematic Investment Plans (SIP) utilizing NPCI's official <strong>UPI AutoPay framework</strong>:
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
                <div>• <strong>Debits & Execution:</strong> Automated debits occur daily, weekly, or monthly as chosen by you. The purchased gold is credited at the live spot rate at the exact timestamp of execution.</div>
                <div>• <strong>Pause & Cancellation:</strong> You maintain unconditional authority to pause, modify, or cancel your SIP mandate at any time directly from the Fipmoney app with zero cancellation penalties.</div>
              </div>
            </section>

            {/* CLAUSE 8: SELLING & INSTANT BANK PAYOUTS */}
            <section id="sale-withdrawal" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-4">
              <div className="flex items-center gap-3 text-[#047857]">
                <CreditCard size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  8. Selling & Instant Bank Payouts (IMPS)
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                You can sell any portion of your accumulated 24K gold holdings at the live sell price 24 hours a day, 365 days a year:
              </p>

              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium list-disc pl-5">
                <li><strong>Instant IMPS Rails:</strong> Sale proceeds are disbursed directly to your verified bank account via IMPS/NEFT, generally crediting within <strong>30 seconds to 5 minutes</strong>.</li>
                <li><strong>Anti-Fraud Holding Lock:</strong> To prevent money laundering and stolen card fraud, gold purchased via promotional cards may be subject to a standard 24-hour settlement lock before liquidation.</li>
              </ul>
            </section>

            {/* CLAUSE 9: PHYSICAL DELIVERY */}
            <section id="physical-delivery" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-4">
              <div className="flex items-center gap-3 text-[#047857]">
                <PackageCheck size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  9. Minting & Doorstep Physical Delivery
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Customers may elect to convert digital gold grams into hallmarked physical gold coins (0.5g to 50g):
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <strong className="text-slate-900 block font-black">Tamper-Proof CertiCard</strong>
                  <span className="text-slate-600 font-medium">Coins are packaged in certicards bearing certified assay purity hallmarks.</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <strong className="text-slate-900 block font-black">Insured Doorstep Transit</strong>
                  <span className="text-slate-600 font-medium">Deliveries are handled by certified armored couriers with 100% transit insurance.</span>
                </div>
              </div>
            </section>

            {/* CLAUSE 10: INSURANCE COVERAGE */}
            <section id="insurance-perils" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-4">
              <div className="flex items-center gap-3 text-[#047857]">
                <Shield size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  10. Insurance Coverage & Force Majeure
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                100% of the bullion held in Brink's India vaults is insured by leading global underwriters against risks of <strong>burglary, theft, fire, lightning, earthquake, cyclone, and transit perils</strong>.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
                <em>Force Majeure Exclusions:</em> Consistent with standard insurance underwriting worldwide, coverage excludes damage resulting from acts of foreign war, hostile military invasions, civil rebellion, and nuclear radiation.
              </div>
            </section>

            {/* CLAUSE 11: AML COMPLIANCE */}
            <section id="aml-compliance" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-4">
              <div className="flex items-center gap-3 text-[#047857]">
                <AlertCircle size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  11. Anti-Money Laundering (PMLA 2002)
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Fipmoney enforces zero tolerance for financial crimes. If any account displays suspicious layering, multiple third-party payments, or sanctions violations, Fipmoney reserves the right to freeze transactions, report suspicious activity to the <strong>Financial Intelligence Unit - India (FIU-IND)</strong>, and terminate service.
              </p>
            </section>

            {/* CLAUSE 12: LIMITATION OF LIABILITY */}
            <section id="liability-governing" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-4">
              <div className="flex items-center gap-3 text-[#047857]">
                <Building2 size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  12. Limitation of Liability & Bengaluru Jurisdiction
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                These Terms and all disputes arising hereunder shall be governed by and construed in accordance with the <strong>Laws of the Republic of India</strong>. The competent courts in <strong>Bengaluru, Karnataka, India</strong> shall have exclusive jurisdiction over all claims, suits, or arbitrations.
              </p>
            </section>

            {/* CLAUSE 13: GRIEVANCE REDRESSAL */}
            <section id="grievance-escalation" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs space-y-5">
              <div className="flex items-center gap-3 text-[#047857]">
                <Phone size={24} />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  13. Statutory Grievance Redressal Matrix
                </h2>
              </div>

              <div className="bg-gradient-to-br from-emerald-50/70 via-white to-slate-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 space-y-3 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                    <span className="text-[10px] font-black text-slate-400 block uppercase">Level 1: Support Desk</span>
                    <strong className="text-slate-900 block mt-0.5">support@fipmoney.com</strong>
                    <span className="text-[11px] text-slate-500 font-semibold">Toll-Free: 1800 123 4567</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                    <span className="text-[10px] font-black text-slate-400 block uppercase">Level 2: Grievance Officer</span>
                    <strong className="text-slate-900 block mt-0.5">grievance@fipmoney.com</strong>
                    <span className="text-[11px] text-emerald-800 font-bold">Guaranteed SLA: &lt; 24 Hours</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                    <span className="text-[10px] font-black text-slate-400 block uppercase">Level 3: Nodal Officer</span>
                    <strong className="text-slate-900 block mt-0.5">nodal@fipmoney.com</strong>
                    <span className="text-[11px] text-slate-500 font-semibold">Bangalore Corporate HQ</span>
                  </div>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>

      {/* ── BOTTOM RIGHT CIRCULAR PROGRESS SCROLL-TO-TOP BUTTON ── */}
      <ScrollToTopProgress containerId="terms-scroll-container" />
    </div>
  );
}
