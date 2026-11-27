"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Check, Copy, CheckCheck, Download, Zap, 
  ChevronUp, ChevronDown, Coins, Sparkles, ShieldCheck, X
} from "lucide-react";
import { Transaction } from "../utils/transactionStorage";
import { downloadInvoicePDF } from "./HistoryPage";

export interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onRepeatInvestment?: (amount: number, category: string) => void;
}

export default function TransactionDetailsModal({
  isOpen,
  onClose,
  transaction,
  onRepeatInvestment
}: TransactionDetailsModalProps) {
  // Closed by default as requested
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [copiedTxId, setCopiedTxId] = useState(false);
  const [copiedGoldTxId, setCopiedGoldTxId] = useState(false);

  if (!isOpen || !transaction) return null;

  const isBill = transaction.type === "Bill Pay" || Boolean(transaction.category && (
    transaction.category.toLowerCase().includes("bill") ||
    transaction.category.toLowerCase().includes("recharge") ||
    transaction.category.toLowerCase().includes("prepaid") ||
    transaction.category.toLowerCase().includes("postpaid") ||
    transaction.category.toLowerCase().includes("electricity") ||
    transaction.category.toLowerCase().includes("dth") ||
    transaction.category.toLowerCase().includes("fastag")
  ));
  const isReward = transaction.type === "Reward" || transaction.type === "Bonus" || transaction.type === "REFERRAL_BONUS" || Boolean(transaction.category?.toLowerCase().includes("reward"));
  const isGold = !isBill && !isReward && (!transaction.category || transaction.category.toLowerCase().includes("gold"));
  const isSilver = !isBill && !isReward && Boolean(transaction.category?.toLowerCase().includes("silver"));
  const metalName = isSilver ? "Silver" : "Gold";
  const metalPurity = isSilver ? "99.9% Pure Silver" : "24K | 99.9% Pure Gold";

  // Calculate pricing breakdown
  const totalAmount = Math.abs(transaction.amount);
  const gstRate = 0.03; // 3% GST
  const netValue = Math.round((totalAmount / (1 + gstRate)) * 100) / 100;
  const gstAmount = Math.round((totalAmount - netValue) * 100) / 100;

  // Weight / Grams calculation if not already present
  let displayGrams = transaction.grams;
  if (!displayGrams && !isBill) {
    if (isGold) {
      const approxRate = 12446.01;
      displayGrams = (totalAmount / approxRate).toFixed(4);
    } else if (isSilver) {
      const approxRate = 165.50;
      displayGrams = (totalAmount / approxRate).toFixed(3);
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
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {/* Modal Backdrop with proper alignment so top is NEVER cut off */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-5 overflow-hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          className="relative w-full max-w-md max-h-[92vh] sm:max-h-[88vh] bg-[#f8fafc] text-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
        >
          {/* Top Bar Header (Always visible and anchored at top) */}
          <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3.5 bg-white border-b border-slate-200 shrink-0 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 flex items-center justify-center transition-all border-none cursor-pointer outline-none"
                aria-label="Go back"
              >
                <ArrowLeft size={18} strokeWidth={2.5} />
              </button>
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Transaction Details
              </h2>
            </div>
            
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-all border-none cursor-pointer outline-none"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Scrollable Body Content */}
          <div className="flex-1 px-4 py-4 space-y-3.5 overflow-y-auto overscroll-contain">
            
            {/* Card 1: Top Summary Card (Fipmoney Light Emerald Styling) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                {/* 3D-styled Coin/Bolt Icon badge with emerald check */}
                <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 flex items-center justify-center shrink-0 shadow-2xs">
                  <Zap size={22} className="text-amber-500 fill-amber-400" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#047857] text-white flex items-center justify-center ring-2 ring-white shadow-2xs">
                    <Check size={10} strokeWidth={3.5} />
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div className="flex flex-col text-left">
                  <span className="text-[14.5px] font-black text-slate-900 leading-tight">
                    {transaction.source || (isBill ? "Mobile Recharge" : (transaction.type === "Buy" ? "Instant Saving" : `${transaction.type} ${metalName}`))}
                  </span>
                  <span className="text-xs text-slate-500 font-medium mt-0.5">
                    {isBill ? `${transaction.category || "BBPS Service"} · Payment Successful` : isReward ? "Referral Bonus Gold Credited" : `${metalName} purchased`}
                  </span>
                </div>
              </div>

              {/* Amount & Grams */}
              <div className="flex flex-col items-end text-right">
                <span className="text-lg font-black text-slate-950 tracking-tight">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
                {displayGrams && !isBill ? (
                  <span className="text-[11px] font-bold text-[#047857] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full mt-0.5">
                    {displayGrams} g
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full mt-0.5">
                    Completed
                  </span>
                )}
              </div>
            </div>

            {/* Card 2: Transaction Status Stepper */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Transaction Status
              </h3>

              {/* Stepper with Connecting Emerald Lines */}
              <div className="space-y-0.5 pl-1">
                {/* Step 1: Payment */}
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-[#047857] text-white flex items-center justify-center shadow-2xs">
                      <Check size={12} strokeWidth={3.5} />
                    </div>
                    <div className="w-[2px] h-7 bg-emerald-500/70 my-0.5" />
                  </div>
                  <div className="flex-1 flex items-center justify-between pt-0.5">
                    <span className="text-xs font-bold text-slate-800">Payment</span>
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
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-[#047857] text-white flex items-center justify-center shadow-2xs">
                      <Check size={12} strokeWidth={3.5} />
                    </div>
                    <div className="w-[2px] h-7 bg-emerald-500/70 my-0.5" />
                  </div>
                  <div className="flex-1 flex items-center justify-between pt-0.5">
                    <span className="text-xs font-bold text-slate-800">{isBill ? "Biller Clearance" : `${metalName} order`}</span>
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

                {/* Step 3: Metal purchase (Only for bullion) */}
                {!isBill && (
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-[#047857] text-white flex items-center justify-center shadow-2xs">
                        <Check size={12} strokeWidth={3.5} />
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-between pt-0.5">
                      <span className="text-xs font-bold text-slate-800">{metalName} purchase</span>
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
                )}
              </div>

              {/* Status Message */}
              <p className="text-[11.5px] text-slate-600 text-center font-medium pt-1">
                {isBill ? "Payment processed & confirmed by service provider." : isReward ? "Reward credited directly into your 24K Gold locker." : `${metalName} has been added to your Fipmoney locker.`}
              </p>

              {/* Action Buttons in Fipmoney Theme */}
              <div className="space-y-2.5 pt-1">
                {/* Repeat Button */}
                <button
                  onClick={handleSaveAgain}
                  className="w-full bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] hover:from-[#022c22] hover:via-[#064e3b] hover:to-[#047857] active:scale-[0.98] text-white font-black text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 border-none cursor-pointer outline-none transition-all"
                >
                  {isBill ? `Pay ₹${totalAmount.toLocaleString("en-IN")} Again` : `Save ₹${totalAmount.toLocaleString("en-IN")} Again`}
                </button>

                {/* Invoice Button */}
                <button
                  onClick={() => downloadInvoicePDF(transaction)}
                  className="w-full bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-800 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-200 cursor-pointer outline-none transition-all"
                >
                  <Download size={15} strokeWidth={2.5} />
                  <span>Download Invoice</span>
                </button>
              </div>
            </div>

            {/* Card 3: Order Details Accordion (Closed by default) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs">
              <button
                onClick={() => setIsOrderDetailsOpen(!isOrderDetailsOpen)}
                className="w-full flex items-center justify-between text-left bg-transparent border-none outline-none cursor-pointer p-0 text-slate-900"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black tracking-tight">Order Details</span>
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
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2.5">
                      {isBill ? "PAYMENT SUMMARY" : "PRICE BREAKDOWN"}
                    </h4>
                    <div className="space-y-2 text-xs">
                      {isBill ? (
                        <>
                          <div className="flex justify-between items-center text-slate-600">
                            <span className="font-medium">Service / Biller</span>
                            <span className="font-bold text-slate-900">{transaction.source || "Utility"}</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-600">
                            <span className="font-medium">Category</span>
                            <span className="font-bold text-slate-900">{transaction.category || "Recharge"}</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-600">
                            <span className="font-medium">Convenience Fee</span>
                            <span className="font-bold text-emerald-600">₹0.00 (Zero Fee)</span>
                          </div>
                        </>
                      ) : (
                        <>
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
                        </>
                      )}

                      <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-slate-900">
                        <span className="font-black text-xs">Total Amount</span>
                        <span className="font-black text-sm text-[#047857]">₹{totalAmount.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>

                  {/* TRANSACTION DETAILS */}
                  <div className="border-t border-slate-100 pt-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2.5">
                      TRANSACTION DETAILS
                    </h4>
                    <div className="space-y-2.5 text-xs">
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
            <div className="bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] rounded-2xl p-3.5 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
                  <span className="text-amber-300 font-black text-xs">3X</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-black text-white leading-tight">
                    Reach your goals 3X faster
                  </span>
                  <span className="text-[11px] font-medium text-emerald-100">
                    by saving daily
                  </span>
                </div>
              </div>

              <button
                onClick={handleSaveAgain}
                className="bg-white hover:bg-emerald-50 text-[#047857] font-black text-xs px-3.5 py-1.5 rounded-xl border border-white/20 cursor-pointer outline-none active:scale-95 transition-all shrink-0 shadow-xs"
              >
                Save Now
              </button>
            </div>

            {/* Footer Assurance */}
            <div className="pt-2 pb-1 text-center space-y-1 text-slate-500">
              <p className="text-[10px] font-bold tracking-wide text-slate-600">
                100% Secure | {metalPurity}
              </p>
              <p className="text-[9.5px] font-medium text-slate-400">
                Powered by: <span className="font-bold text-slate-600">Fipmoney Insured Vaults</span>
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
