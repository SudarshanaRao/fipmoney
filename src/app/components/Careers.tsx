"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Briefcase, MapPin, Clock, Users, Heart, Lightbulb,
  Trophy, Coffee, Sparkles, Send, CheckCircle2, ChevronRight,
  ShieldCheck, Laptop, Rocket, ArrowRight, X, DollarSign
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface CareersProps {
  onBack: () => void;
}

export default function Careers({ onBack }: CareersProps) {
  const [selectedDept, setSelectedDept] = useState("all");
  const [applyingJob, setApplyingJob] = useState<any>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantLinkedIn, setApplicantLinkedIn] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const jobs = [
    {
      id: "fe-dev",
      title: "Senior Fullstack / Frontend Engineer",
      location: "Bengaluru, India (Hybrid)",
      type: "Full-Time",
      department: "Engineering",
      experience: "3-6 Years",
      compensation: "₹24L - ₹38L + ESOPs",
      description: "Build blazing-fast, mobile-first fintech interfaces for digital gold and silver savings, real-time bullion order books, and secure payment rails.",
      skills: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Capacitor"],
      posted: "Active Hiring"
    },
    {
      id: "be-eng",
      title: "Senior Backend & Payment Systems Engineer",
      location: "Bengaluru, India (Hybrid)",
      type: "Full-Time",
      department: "Engineering",
      experience: "4-7 Years",
      compensation: "₹28L - ₹45L + ESOPs",
      description: "Architect mission-critical ledger infrastructure, bank payment gateways, UPI AutoPay recurring mandate schedulers, and Brink's vault reconciliation engines.",
      skills: ["Node.js", "Python", "MongoDB", "Redis", "Kafka", "AWS"],
      posted: "Priority Opening"
    },
    {
      id: "pm-fintech",
      title: "Lead Product Manager - Wealth & SIPs",
      location: "Bengaluru, India (On-Site)",
      type: "Full-Time",
      department: "Product",
      experience: "4-8 Years",
      compensation: "₹30L - ₹48L + ESOPs",
      description: "Drive the roadmap for micro-savings, daily gold SIP algorithms, gamified reward loops, and native mobile growth funnels.",
      skills: ["Fintech", "User Growth", "Product Analytics", "A/B Testing", "Agile"],
      posted: "Active Hiring"
    },
    {
      id: "ux-designer",
      title: "Senior Product Designer (UI / UX)",
      location: "Bengaluru, India (Hybrid)",
      type: "Full-Time",
      department: "Design",
      experience: "3-5 Years",
      compensation: "₹20L - ₹32L + ESOPs",
      description: "Craft world-class luxury 3D fintech aesthetics, seamless onboarding flows, and accessible micro-interactions across web and mobile.",
      skills: ["Figma", "Design Systems", "Prototyping", "Fintech UX", "Mobile Design"],
      posted: "Active Hiring"
    },
    {
      id: "data-scientist",
      title: "Quant & Risk Data Scientist",
      location: "Bengaluru, India (Hybrid)",
      type: "Full-Time",
      department: "Analytics",
      experience: "3-6 Years",
      compensation: "₹25L - ₹40L + ESOPs",
      description: "Build algorithmic price prediction models, market-making inventory hedging, and fraud detection classifiers for high-frequency transactions.",
      skills: ["Python", "SQL", "Machine Learning", "Risk Modeling", "Time Series"],
      posted: "Priority Opening"
    },
    {
      id: "growth-lead",
      title: "Growth & Performance Marketing Manager",
      location: "Bengaluru, India (On-Site)",
      type: "Full-Time",
      department: "Growth",
      experience: "3-5 Years",
      compensation: "₹18L - ₹28L + Incentives",
      description: "Lead user acquisition and viral referral loops across India, driving digital gold adoption and customer lifetime value.",
      skills: ["User Acquisition", "Performance Ads", "Attribution", "Funnel Optimization"],
      posted: "Active Hiring"
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Comprehensive Health & Wellness",
      description: "₹10L family floater health cover, zero-deductible OPD benefits, and annual wellness allowances."
    },
    {
      icon: Trophy,
      title: "Wealth Equity & Annual Bonuses",
      description: "Generous ESOP grants with wealth-building upside and transparent quarterly performance bonuses."
    },
    {
      icon: Laptop,
      title: "Top-Tier Hardware & Work Setup",
      description: "Latest Apple MacBook Pro (M3 Max / M4) plus dedicated ergonomic home office setup budget."
    },
    {
      icon: Lightbulb,
      title: "Learning & Conference Budget",
      description: "Annual ₹1.5L personal development budget for tech conferences, books, and certifications."
    },
    {
      icon: Coffee,
      title: "Flexible Hybrid Culture",
      description: "Outcome-driven work culture with flexible hours and unlimited paid leave policy."
    },
    {
      icon: Rocket,
      title: "High-Impact Mission",
      description: "Build financial freedom for the next 100 million Indian households saving in 24K pure gold."
    }
  ];

  const filteredJobs = selectedDept === "all" ? jobs : jobs.filter(j => j.department.toLowerCase() === selectedDept.toLowerCase());

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) return;
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#047857] selection:text-white w-full pb-20">
      {/* ── TOP STICKY HEADER (100% Width) ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs w-full">
        <div className="w-full px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="flex items-center gap-2 cursor-pointer select-none" onClick={onBack}>
              <img src="/fipmoney_logo_final.png" alt="FipMoney" className="h-8 w-auto object-contain" />
              <div>
                <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 block leading-none">
                  Fipmoney
                </span>
                <span className="text-[9px] font-extrabold text-[#047857] tracking-wider uppercase">
                  Careers & Culture
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#047857] text-[11px] font-bold">
              <Sparkles size={14} />
              <span>We're Hiring • {jobs.length} Positions</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER (100% Fluid Width) ── */}
      <section className="w-full bg-gradient-to-b from-white via-[#F0FDF4]/50 to-[#F8FAFC] border-b border-slate-200/80 py-10 sm:py-16 px-4 sm:px-6 lg:px-10 relative overflow-hidden text-center">
        {/* Glow Particles */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-[#047857] text-xs font-black uppercase tracking-wider">
            <Rocket size={14} className="text-[#047857]" />
            <span>Join Our High-Growth Engineering & Product Team</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Build the Future of{" "}
            <span className="bg-gradient-to-r from-[#047857] via-[#059669] to-[#10b981] bg-clip-text text-transparent">
              Digital Wealth
            </span>{" "}
            in India
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            At Fipmoney, we're democratizing 24K pure digital gold and automated micro-savings for millions of Indians. Join an elite, high-ownership team in Bengaluru.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-bold text-slate-600">
            <span className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">🚀 High-Velocity Execution</span>
            <span className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">💰 Generous ESOPs</span>
            <span className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">📍 Koramangala, Bengaluru</span>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT (100% Fluid Width) ── */}
      <main className="w-full px-4 sm:px-6 lg:px-10 py-10 max-w-7xl mx-auto space-y-16">
        
        {/* ── OPEN POSITIONS SECTION ── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Current Openings
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                Explore open roles across Engineering, Product, Design, and Analytics.
              </p>
            </div>

            {/* Department Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {["all", "Engineering", "Product", "Design", "Analytics", "Growth"].map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black capitalize transition-all cursor-pointer border ${
                    selectedDept.toLowerCase() === dept.toLowerCase()
                      ? "bg-[#047857] text-white border-[#047857] shadow-xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-semibold mt-1">
                        <span className="flex items-center gap-1"><MapPin size={13} className="text-[#047857]" /> {job.location}</span>
                        <span className="flex items-center gap-1"><Clock size={13} className="text-[#047857]" /> {job.type}</span>
                        <span className="flex items-center gap-1"><Briefcase size={13} className="text-[#047857]" /> {job.experience}</span>
                      </div>
                    </div>
                    <Badge className="bg-emerald-50 text-[#047857] border border-emerald-200 font-bold text-[10px] shrink-0">
                      {job.department}
                    </Badge>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Compensation</span>
                    <span className="text-xs font-black text-[#064e3b]">{job.compensation}</span>
                  </div>

                  <button
                    onClick={() => {
                      setApplyingJob(job);
                      setIsSubmitted(false);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] hover:from-[#022c22] hover:via-[#064e3b] hover:to-[#047857] text-white text-xs font-black transition-all cursor-pointer border-none shadow-sm flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Apply Now</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── BENEFITS & PERKS GRID ── */}
        <section className="space-y-6 pt-4">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Life & Perks at Fipmoney
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold">
              We take exceptional care of the people who build Fipmoney.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3 hover:border-emerald-300 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#047857] flex items-center justify-center font-bold">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-base font-black text-slate-900">{b.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{b.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── BOTTOM CALL-TO-ACTION BANNER ── */}
        <section className="rounded-3xl bg-gradient-to-r from-[#022c22] via-[#064e3b] to-[#047857] text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 max-w-xl text-center md:text-left relative z-10">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-300">Don't see your specific role?</span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              We always make room for exceptional talent.
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 font-medium">
              Email your portfolio or resume directly to our founders and engineering leadership.
            </p>
          </div>

          <a
            href="mailto:careers@fipmoney.com?subject=Exceptional%20Talent%20Inquiry%20-%20Fipmoney"
            className="px-7 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-emerald-50 font-black text-xs transition-all shadow-md shrink-0 cursor-pointer text-center no-underline relative z-10"
          >
            Email: careers@fipmoney.com
          </a>
        </section>

      </main>

      {/* ── FAST APPLICATION MODAL ── */}
      <AnimatePresence>
        {applyingJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-5 relative"
            >
              <button
                onClick={() => setApplyingJob(null)}
                className="absolute right-5 top-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-black cursor-pointer border-none"
              >
                ✕
              </button>

              <div className="pr-8">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#047857]">Application</span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">{applyingJob.title}</h3>
                <span className="text-xs text-slate-500 font-semibold">{applyingJob.department} • {applyingJob.location}</span>
              </div>

              {isSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
                  <CheckCircle2 size={32} className="text-[#047857] mx-auto" />
                  <h4 className="text-base font-black text-slate-900">Application Received!</h4>
                  <p className="text-xs text-slate-600 font-medium">
                    Thank you, <strong>{applicantName}</strong>. Our hiring team will review your profile and reach out via {applicantEmail} within 2 business days.
                  </p>
                  <button
                    onClick={() => setApplyingJob(null)}
                    className="px-5 py-2 rounded-xl bg-[#047857] text-white text-xs font-bold cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-[#047857] bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-[#047857] bg-slate-50/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-[#047857] bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">LinkedIn / Portfolio URL</label>
                      <input
                        type="url"
                        value={applicantLinkedIn}
                        onChange={(e) => setApplicantLinkedIn(e.target.value)}
                        placeholder="linkedin.com/in/username"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-[#047857] bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] text-white font-black text-xs transition-all cursor-pointer border-none shadow-md shadow-emerald-900/20 mt-2"
                  >
                    Submit Application
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
