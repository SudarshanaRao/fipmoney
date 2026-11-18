"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, Trash2, AlertTriangle, CheckCircle, Mail, Phone, Lock, FileText, ChevronRight } from "lucide-react";

interface DeleteAccountPageProps {
  onBack: () => void;
}

export default function DeleteAccountPage({ onBack }: DeleteAccountPageProps) {
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("no_longer_needed");
  const [confirmed, setConfirmed] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) return;
    const ticket = `FM-DEL-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedTicket(ticket);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-emerald-700 transition-colors bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft size={18} /> Back to Fipmoney
          </button>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <Shield size={14} className="text-emerald-600" /> Data Safety & Privacy
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#047857] text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-amber-300 mb-3 border border-white/10">
              User Rights & Google Play Compliance
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-3">
              Request Account & Data Deletion
            </h1>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              At Fipmoney, we respect your right to privacy and ownership of your personal information. In accordance with Google Play Developer Policies and applicable data protection regulations, you can permanently request deletion of your account and associated personal data.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-white/80 mt-6 pt-6 border-t border-white/15">
              <span><strong>App:</strong> Fipmoney</span>
              <span>•</span>
              <span><strong>Developer:</strong> Fipmoney Technologies Private Limited</span>
              <span>•</span>
              <span><strong>Package ID:</strong> com.fipmoney.app</span>
            </div>
          </div>
        </div>

        {/* Steps Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Trash2 className="text-emerald-600" size={22} /> Steps to Request Account Deletion
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              You can delete your account directly through the mobile app or via our web request form.
            </p>
          </div>

          {/* In-app Steps */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Method 1: In-App Account Deletion (Instant)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center mb-2">1</div>
                <div className="font-bold text-slate-900">Open Fipmoney</div>
                <p className="text-slate-500 mt-0.5">Sign in to your account with your mobile number.</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center mb-2">2</div>
                <div className="font-bold text-slate-900">Settings</div>
                <p className="text-slate-500 mt-0.5">Navigate to Settings from the bottom or side menu.</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center mb-2">3</div>
                <div className="font-bold text-slate-900">Security & Account</div>
                <p className="text-slate-500 mt-0.5">Select "Delete Account & Associated Data".</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center mb-2">4</div>
                <div className="font-bold text-slate-900">OTP Verification</div>
                <p className="text-slate-500 mt-0.5">Confirm via SMS OTP to finalize deletion.</p>
              </div>
            </div>
          </div>

          {/* Web Form */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Method 2: Web Deletion Request (Without App Installed)</h3>
            <p className="text-xs text-slate-600">
              If you have uninstalled the app, fill out this request form. Our security team will verify your ownership and process the deletion within <strong>7 business days</strong>.
            </p>

            {submittedTicket ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-emerald-900 space-y-2">
                <div className="flex items-center gap-2 font-black text-emerald-800">
                  <CheckCircle size={20} className="text-emerald-600" /> Request Registered Successfully
                </div>
                <p className="text-xs leading-relaxed">
                  Your ticket reference is <strong>{submittedTicket}</strong>. We have logged your deletion request for mobile number <strong>{mobileNumber}</strong>. You will receive an SMS confirmation once verified.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name (as per KYC)</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Registered Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Registered Email Address (optional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Deletion</label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-emerald-600"
                    >
                      <option value="no_longer_needed">No longer saving / investing</option>
                      <option value="privacy_concerns">Privacy concerns</option>
                      <option value="switching_service">Switching to another platform</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300"
                    />
                    <span>
                      I confirm that I want to permanently delete my Fipmoney account. I understand that all remaining vault holdings (24K Gold & 99.9% Silver) must be sold or withdrawn to my bank prior to account closure.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!confirmed}
                  className={`px-6 py-3 rounded-xl font-bold text-xs text-white transition-all border-none cursor-pointer flex items-center gap-2 ${
                    confirmed ? "bg-red-600 hover:bg-red-700 shadow-md" : "bg-slate-300 cursor-not-allowed"
                  }`}
                >
                  <Trash2 size={16} /> Submit Account Deletion Request
                </button>
              </form>
            )}
          </div>

          {/* Metals Vault Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-black text-amber-800 block mb-0.5">Precious Metals Vault Notice</span>
              Before requesting account deletion, please ensure you sell any digital gold or silver holdings. Sale proceeds settle directly to your verified bank account via IMPS.
            </div>
          </div>
        </div>

        {/* Data Retention Table Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <FileText className="text-emerald-600" size={22} /> Types of Data Deleted vs. Retained
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Google Play Policy requires apps to specify the types of data that are permanently deleted and any statutory legal retention periods.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-900 font-black">
                  <th className="p-3">Data Category</th>
                  <th className="p-3">Specific Data Fields</th>
                  <th className="p-3">Deletion Status</th>
                  <th className="p-3">Retention Period & Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="p-3 font-bold text-slate-900">Account & Identity</td>
                  <td className="p-3">Full name, email, profile photo, user code</td>
                  <td className="p-3"><span className="bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded">Permanently Deleted</span></td>
                  <td className="p-3 text-slate-500">Purged within 7 days of confirmation</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Authentication & Security</td>
                  <td className="p-3">Biometric credentials, active sessions, OTP hashes, device tokens</td>
                  <td className="p-3"><span className="bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded">Permanently Deleted</span></td>
                  <td className="p-3 text-slate-500">Revoked immediately upon request</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">App Analytics</td>
                  <td className="p-3">IP addresses, device telemetry, notification tokens</td>
                  <td className="p-3"><span className="bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded">Permanently Deleted</span></td>
                  <td className="p-3 text-slate-500">Purged within 7 days</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Financial Ledger</td>
                  <td className="p-3">Purchase & sale invoices, bank settlement UTR IDs, bullion vault ledger</td>
                  <td className="p-3"><span className="bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded">Legally Retained</span></td>
                  <td className="p-3 text-slate-500"><strong>5 Years</strong> per Section 12 of the <em>Prevention of Money Laundering Act (PMLA), 2002</em> and Income Tax Act, 1961.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">KYC Audit Records</td>
                  <td className="p-3">Aadhaar/PAN verification proofs and compliance logs</td>
                  <td className="p-3"><span className="bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded">Legally Retained</span></td>
                  <td className="p-3 text-slate-500"><strong>5 Years</strong> in encrypted cold storage for statutory audit compliance only.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-900">Contact Data Protection Officer:</div>
            <div>Email: <a href="mailto:support@fipmoney.com" className="text-emerald-700 font-bold">support@fipmoney.com</a> | Phone: <a href="tel:+918001234567" className="text-emerald-700 font-bold">+91 (800) 123-4567</a></div>
            <div>Address: Fipmoney Technologies Private Limited, Financial District, Hyderabad, Telangana 500032.</div>
          </div>
        </div>
      </main>
    </div>
  );
}
