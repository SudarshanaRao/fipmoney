"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Check, Copy, CheckCheck, Download, Zap, 
  ChevronUp, ChevronDown, Coins, Sparkles, ShieldCheck
} from "lucide-react";
import { Transaction, getTransactions } from "../utils/transactionStorage";
import { downloadInvoicePDF } from "./HistoryPage";
import FipmoneySignature from "./ui/FipmoneySignature";

export interface TransactionDetailsPageProps {
  transaction?: Transaction | null;
  onBack: () => void;
  onRepeatInvestment?: (amount: number, category: string) => void;
}

export default function TransactionDetailsPage({
  transaction: propTransaction,
  onBack,
  onRepeatInvestment
}: TransactionDetailsPageProps) {
  // Closed by default
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [copiedTxId, setCopiedTxId] = useState(false);
  const [copiedGoldTxId, setCopiedGoldTxId] = useState(false);
  const [activeTx, setActiveTx] = useState<Transaction | null>(() => {
    if (propTransaction) return propTransaction;
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("fm_selected_tx");
        if (stored) return JSON.parse(stored);
      } catch (e) {}
      const all = getTransactions();
      if (all && all.length > 0) return all[0];
    }
    return null;
  });

  useEffect(() => {
    if (propTransaction) {
      setActiveTx(propTransaction);
      try {
        sessionStorage.setItem("fm_selected_tx", JSON.stringify(propTransaction));
      } catch (e) {}
    }
  }, [propTransaction]);

  // Fallback transaction if none found
  const transaction: Transaction = activeTx || {
    id: "FIP20261126001",
    type: "Buy",
    category: "Gold",
    amount: 515,
    grams: "0.0401",
    date: new Date().toISOString(),
    status: "Completed",
    paymentMethod: "UPI",
    source: "Instant Saving"
  };

  const isGold = !transaction.category || transaction.category.toLowerCase().includes("gold");
  const isSilver = transaction.category?.toLowerCase().includes("silver");
  const metalName = isSilver ? "Silver" : "Gold";
  const metalPurity = isSilver ? "99.9% Pure Silver" : "24K | 99.9% Pure Gold";

  // Calculate pricing breakdown
  const totalAmount = Math.abs(transaction.amount);
  const gstRate = 0.03; // 3% GST
  const netValue = Math.round((totalAmount / (1 + gstRate)) * 100) / 100;
  const gstAmount = Math.round((totalAmount - netValue) * 100) / 100;

  // Weight / Grams calculation if not already present
  let displayGrams = transaction.grams;
  if (!displayGrams) {
    if (isGold) {
      const approxRate = 12446.01;
      displayGrams = (totalAmount / approxRate).toFixed(4);
    } else if (isSilver) {
      const approxRate = 165.50;
      displayGrams = (totalAmount / approxRate).toFixed(3);
    } else {
      displayGrams = "1.000";
    }
  }

  // Rate per gram
  const ratePerGram = displayGrams && parseFloat(displayGrams) > 0 
    ? (netValue / parseFloat(displayGrams)).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : (isGold ? "12,446.01" : "165.50");

  // Date formatting
  const dateObj = new Date(transaction.date || Date.now());
  const formattedDate = dateObj.toLocaleDateString("en-GB", { 
    day: "numeric", 
    month: "short", 
    year: "2-digit" 
  }) + ", " + dateObj.toLocaleTimeString("en-US", { 
    hour: "2-digit", 
    minute: "2-digit", 
    hour12: true 
  });

  // IDs
  const txId = transaction.id || "FIP" + Math.floor(100000 + Math.random() * 900000);
  const goldTxId = "XEKMW" + txId.slice(-4) + "S";
  const shortTxId = "..." + txId.slice(-8);
  const shortGoldTxId = "..." + goldTxId.slice(-8);

  const handleCopy = (text: string, type: "tx" | "gold") => {
    navigator.clipboard.writeText(text);
    if (type === "tx") {
      setCopiedTxId(true);
      setTimeout(() => setCopiedTxId(false), 2000);
    } else {
      setCopiedGoldTxId(true);
      setTimeout(() => setCopiedGoldTxId(false), 2000);
    }
  };

  const handleSaveAgain = () => {
    if (onRepeatInvestment) {
      onRepeatInvestment(totalAmount, transaction.category);
    } else {
      onBack();
    }
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto overflow-x-hidden bg-[#f8fafc] text-slate-900 pb-36 sm:pb-28">
      {/* Top Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 flex items-center justify-center transition-all border-none cursor-pointer outline-none"
              aria-label="Go back"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                Transaction Details
              </h1>
              <p className="text-[11px] font-medium text-slate-500">
                {txId} • {metalName}
              </p>
            </div>
          </div>

          <button
            onClick={() => downloadInvoicePDF(transaction)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 cursor-pointer outline-none active:scale-95 transition-all"
          >
            <Download size={14} strokeWidth={2.5} />
            <span>Invoice</span>
          </button>
        </div>
      </div>

      {/* Main Page Container */}
      <div className="max-w-2xl mx-auto px-4 pt-4 space-y-4">
        
        {/* Card 1: Top Summary Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4.5 sm:p-5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* 3D-styled Coin/Bolt Icon badge with emerald check */}
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 flex items-center justify-center shrink-0 shadow-2xs">
              <Zap size={24} className="text-amber-500 fill-amber-400" />
              <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-[#047857] text-white flex items-center justify-center ring-2 ring-white shadow-2xs">
                <Check size={11} strokeWidth={3.5} />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="flex flex-col text-left">
              <span className="text-[15px] sm:text-base font-black text-slate-900 leading-tight">
                {transaction.source || (transaction.type === "Buy" ? "Instant Saving" : `${transaction.type} ${metalName}`)}
              </span>
              <span className="text-xs text-slate-500 font-medium mt-0.5">
                {metalName} purchased
              </span>
            </div>
          </div>

          {/* Amount & Grams */}
          <div className="flex flex-col items-end text-right">
            <span className="text-xl font-black text-slate-950 tracking-tight">
              ₹{totalAmount.toLocaleString("en-IN")}
            </span>
            <span className="text-xs font-bold text-[#047857] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full mt-0.5">
              {displayGrams} g
            </span>
          </div>
        </div>

        {/* Card 2: Transaction Status Stepper */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
            Transaction Status
          </h2>

          {/* Stepper with Connecting Emerald Lines */}
          <div className="space-y-0.5 pl-1">
            {/* Step 1: Payment */}
            <div className="flex items-start gap-3.5">
              <div className="flex flex-col items-center">
                <div className="w-5.5 h-5.5 rounded-full bg-[#047857] text-white flex items-center justify-center shadow-2xs">
                  <Check size={13} strokeWidth={3.5} />
                </div>
                <div className="w-[2px] h-8 bg-emerald-500/70 my-0.5" />
              </div>
              <div className="flex-1 flex items-center justify-between pt-0.5">
                <span className="text-xs sm:text-sm font-bold text-slate-800">Payment</span>
                <div className="flex flex-col items-end">
                  <span className="bg-emerald-50 border border-emerald-200 text-[#047857] text-[10px] font-black px-2 py-0.5 rounded-md">
                    Success
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2: Metal order */}
            <div className="flex items-start gap-3.5">
              <div className="flex flex-col items-center">
                <div className="w-5.5 h-5.5 rounded-full bg-[#047857] text-white flex items-center justify-center shadow-2xs">
                  <Check size={13} strokeWidth={3.5} />
                </div>
                <div className="w-[2px] h-8 bg-emerald-500/70 my-0.5" />
              </div>
              <div className="flex-1 flex items-center justify-between pt-0.5">
                <span className="text-xs sm:text-sm font-bold text-slate-800">{metalName} order</span>
                <div className="flex flex-col items-end">
                  <span className="bg-emerald-50 border border-emerald-200 text-[#047857] text-[10px] font-black px-2 py-0.5 rounded-md">
                    Success
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 3: Metal purchase */}
            <div className="flex items-start gap-3.5">
              <div className="flex flex-col items-center">
                <div className="w-5.5 h-5.5 rounded-full bg-[#047857] text-white flex items-center justify-center shadow-2xs">
                  <Check size={13} strokeWidth={3.5} />
                </div>
              </div>
              <div className="flex-1 flex items-center justify-between pt-0.5">
                <span className="text-xs sm:text-sm font-bold text-slate-800">{metalName} purchase</span>
                <div className="flex flex-col items-end">
                  <span className="bg-emerald-50 border border-emerald-200 text-[#047857] text-[10px] font-black px-2 py-0.5 rounded-md">
                    Success
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <p className="text-xs text-slate-600 text-center font-medium pt-1">
            {metalName} has been added to your Fipmoney locker.
          </p>

          {/* Action Buttons in Fipmoney Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* Repeat Button */}
            <button
              onClick={handleSaveAgain}
              className="w-full bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] hover:from-[#022c22] hover:via-[#064e3b] hover:to-[#047857] active:scale-[0.98] text-white font-black text-xs sm:text-sm py-3 px-4 rounded-2xl shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 border-none cursor-pointer outline-none transition-all"
            >
              Save ₹{totalAmount.toLocaleString("en-IN")} Again
            </button>

            {/* Invoice Button */}
            <button
              onClick={() => downloadInvoicePDF(transaction)}
              className="w-full bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-800 font-bold text-xs sm:text-sm py-3 px-4 rounded-2xl flex items-center justify-center gap-2 border border-slate-200 cursor-pointer outline-none transition-all"
            >
              <Download size={15} strokeWidth={2.5} />
              <span>Download Invoice</span>
            </button>
          </div>
        </div>

        {/* Card 3: Order Details Accordion (Closed by default) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <button
            onClick={() => setIsOrderDetailsOpen(!isOrderDetailsOpen)}
            className="w-full flex items-center justify-between text-left bg-transparent border-none outline-none cursor-pointer p-0 text-slate-900"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black tracking-tight">Order Details</span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {isOrderDetailsOpen ? "Hide" : "View"}
              </span>
            </div>
            {isOrderDetailsOpen ? (
              <ChevronUp size={18} className="text-slate-500" />
            ) : (
              <ChevronDown size={18} className="text-slate-500" />
            )}
          </button>

          {isOrderDetailsOpen && (
            <div className="pt-4 space-y-4">
              {/* PRICE BREAKDOWN */}
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2.5">
                  PRICE BREAKDOWN
                </h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-medium">{metalName} quantity</span>
                    <span className="font-bold text-slate-900">{displayGrams} g</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-medium">{metalName} purchased at</span>
                    <span className="font-bold text-slate-900">₹{ratePerGram}/g</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-medium">{metalName} value</span>
                    <span className="font-bold text-slate-900">₹{netValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-medium">GST (3%)</span>
                    <span className="font-bold text-slate-900">₹{gstAmount.toFixed(2)}</span>
                  </div>

                  {/* Highlighted Extra added row */}
                  <div className="flex justify-between items-center p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[#047857]">
                    <span className="font-bold text-xs sm:text-sm">Extra {metalName.toLowerCase()} added</span>
                    <span className="font-black text-xs sm:text-sm">+₹15.0</span>
                  </div>

                  <div className="border-t border-slate-100 pt-2.5 flex justify-between items-center text-slate-900">
                    <span className="font-black text-xs sm:text-sm">Total Amount</span>
                    <span className="font-black text-sm sm:text-base text-[#047857]">
                      ₹{totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* TRANSACTION DETAILS */}
              <div className="border-t border-slate-100 pt-3.5">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2.5">
                  TRANSACTION DETAILS
                </h3>
                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Transaction ID</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-700">{shortTxId}</span>
                      <button
                        onClick={() => handleCopy(txId, "tx")}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 border-none cursor-pointer outline-none transition-all"
                        title="Copy ID"
                      >
                        {copiedTxId ? (
                          <CheckCheck size={12} className="text-[#047857]" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">{metalName} transaction ID</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-700">{shortGoldTxId}</span>
                      <button
                        onClick={() => handleCopy(goldTxId, "gold")}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 border-none cursor-pointer outline-none transition-all"
                        title="Copy ID"
                      >
                        {copiedGoldTxId ? (
                          <CheckCheck size={12} className="text-[#047857]" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-medium">Placed on</span>
                    <span className="font-bold text-slate-900">{formattedDate}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-medium">Paid via</span>
                    <span className="font-black text-slate-900 uppercase">{transaction.paymentMethod || "UPI"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Promo Banner (Fipmoney Emerald Gradient) */}
        <div className="bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] rounded-3xl p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
              <span className="text-amber-300 font-black text-sm">3X</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs sm:text-sm font-black text-white leading-tight">
                Reach your goals 3X faster
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-emerald-100">
                by saving daily
              </span>
            </div>
          </div>

          <button
            onClick={handleSaveAgain}
            className="bg-white hover:bg-emerald-50 text-[#047857] font-black text-xs sm:text-sm px-4 py-2 rounded-xl border border-white/20 cursor-pointer outline-none active:scale-95 transition-all shrink-0 shadow-xs"
          >
            Save Now
          </button>
        </div>

        {/* Footer Assurance */}
        <div className="pt-3 pb-2 text-center space-y-1 text-slate-500">
          <p className="text-[10.5px] font-bold tracking-wide text-slate-600">
            100% Secure | {metalPurity}
          </p>
          <p className="text-[10px] font-medium text-slate-400">
            Powered by: <span className="font-bold text-slate-600">Fipmoney Insured Vaults</span>
          </p>
        </div>

      </div>

      <FipmoneySignature />
    </div>
  );
}
