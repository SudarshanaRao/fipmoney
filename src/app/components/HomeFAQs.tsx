"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Plus, X } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  // FipMoney App FAQs
  {
    id: "1",
    question: "Is FipMoney App safe to use?",
    answer: "FipMoney app is 100% safe and secure for your Gold & Silver investments. All physical gold and silver purchased on FipMoney is stored in high-security, 100% insured physical vaults operated by Brink's India — the global leader in vault logistics. Furthermore, independent Security Trustee Vistra ITCL safeguards customer assets, holding a first exclusive charge over physical bullion on behalf of users.",
    category: "fipmoney-app"
  },
  {
    id: "2",
    question: "Who is the vault custodian and how is my Gold stored?",
    answer: "Our physical gold and silver vaulting partner is Brink's (Brink's Global Services). When you buy digital gold on FipMoney, an allocated physical vault unit is opened on your behalf under your name/account at Brink's. The gold is 24 Karat 999.9 pure and 100% insured against theft, fire, damage, and natural disasters.",
    category: "digital-gold"
  },
  {
    id: "3",
    question: "Who is the Security Trustee and what is their role?",
    answer: "Vistra ITCL (India) Limited ('Vistra') is the independent Security Trustee appointed to protect customer interests. Vistra holds a legal first charge over the physical gold stored in Brink's vaults and conducts periodic independent audits to ensure 100% of user balances match physical gold held in vaults at all times.",
    category: "digital-gold"
  },
  {
    id: "4",
    question: "How does the vault opening process work on FipMoney?",
    answer: "When you buy digital gold starting from ₹1, FipMoney buys equivalent 24K 999.9 pure physical gold and opens/allocates a physical gold vault account unit on your behalf with Brink's. Your gold stays 100% insured in Brink's vaults and legally protected by Security Trustee Vistra until you decide to sell or request physical delivery.",
    category: "digital-gold"
  },
  {
    id: "5",
    question: "What are FipMoney's official email addresses?",
    answer: "For general inquiries: info@fipmoney.com | Customer Support: support@fipmoney.com | Payment & transaction queries: payments@fipmoney.com | Legal & compliance issues: legal@fipmoney.com | Grievances: grievance@fipmoney.com.",
    category: "fipmoney-app"
  },
  {
    id: "6",
    question: "How do I check today's Digital Gold price?",
    answer: "You can check today's digital gold price directly in the FipMoney app on the home screen. The price is updated in real-time based on international gold markets. You can also enable price alerts to get notified when gold reaches your target buying or selling price.",
    category: "digital-gold"
  },
  {
    id: "7",
    question: "What is Digital Gold Leasing?",
    answer: "Digital Gold Leasing is a feature that allows you to earn returns on your gold holdings. Instead of keeping your gold idle, you can lease it to jewelry manufacturers and earn a steady income. This helps your gold investment generate additional returns while maintaining the security of your principal amount.",
    category: "digital-gold"
  },
  {
    id: "8",
    question: "Can I convert digital gold to physical gold?",
    answer: "Yes, you can convert your digital gold to physical gold coins or bars. FipMoney offers options to get gold coins of various denominations delivered to your address. There are minimum quantity requirements and delivery charges may apply based on your location.",
    category: "digital-gold"
  },
  
  // Withdrawal Issues FAQs
  {
    id: "9",
    question: "How long does it take to withdraw money?",
    answer: "Withdrawals are typically processed within 1-2 business days. The money will be credited to your registered bank account. During high-volume periods or due to banking holidays, it might take up to 3-5 business days.",
    category: "withdrawal-issues"
  },
  {
    id: "10",
    question: "What is the minimum withdrawal amount?",
    answer: "The minimum withdrawal amount is ₹100. You can sell any amount of gold worth ₹100 or more and withdraw the money to your bank account. There are no maximum limits on withdrawals.",
    category: "withdrawal-issues"
  },
  {
    id: "11",
    question: "Are there any charges for withdrawing money?",
    answer: "FipMoney charges a small transaction fee of 3% + GST on the gold value when you sell your gold. This covers the platform costs, secure storage, and transaction processing. There are no additional withdrawal charges from FipMoney's side.",
    category: "withdrawal-issues"
  },
  {
    id: "12",
    question: "Why is my withdrawal delayed?",
    answer: "Withdrawal delays can occur due to bank holidays, technical issues, incorrect bank details, or high transaction volumes. If your withdrawal is delayed beyond the expected time, please contact our support team with your transaction ID for immediate assistance.",
    category: "withdrawal-issues"
  },
  {
    id: "13",
    question: "Are there any hidden charges?",
    answer: "No, FipMoney is completely transparent. There are no hidden fees or account maintenance charges. You only pay for what you buy.",
    category: "fipmoney-app"
  },
  {
    id: "14",
    question: "How do I update my profile details?",
    answer: "You can easily update your profile details by going to the Profile section in the app settings.",
    category: "fipmoney-app"
  },
  {
    id: "15",
    question: "Is there a limit on how much gold I can buy?",
    answer: "You can start buying gold with as little as ₹1. There is no upper limit to how much you can invest in digital gold.",
    category: "digital-gold"
  },
  {
    id: "16",
    question: "Can I gift digital gold?",
    answer: "Yes, you can easily gift digital gold to your friends and family directly through the app using their mobile number.",
    category: "digital-gold"
  },
  {
    id: "17",
    question: "What happens to my money if a withdrawal fails?",
    answer: "If a withdrawal fails due to bank issues, the money is instantly and automatically refunded to your FipMoney wallet.",
    category: "withdrawal-issues"
  },
  {
    id: "18",
    question: "Can I withdraw my gold as cash on weekends?",
    answer: "Yes, you can sell your gold and request a withdrawal 24/7, including weekends and public holidays. The amount will be credited to your bank account.",
    category: "withdrawal-issues"
  },
  {
    id: "19",
    question: "When will I receive my referral bonus?",
    answer: "You will receive your ₹50 digital gold referral bonus within 24-48 hours after your friend successfully completes a digital gold purchase of at least ₹250 within 30 days of creating their account.",
    category: "referral-program"
  },
  {
    id: "20",
    question: "Is there a limit to how many friends I can refer?",
    answer: "No, there is no limit! You can refer as many friends as you want and keep earning the ₹50 digital gold bonus for every successful referral.",
    category: "referral-program"
  },
  {
    id: "21",
    question: "What happens if my friend purchases gold after 30 days?",
    answer: "The referral reward is only applicable if the referee completes their first ₹250+ digital gold purchase within 30 days of account creation.",
    category: "referral-program"
  },
  {
    id: "22",
    question: "How do I share my referral link?",
    answer: "You can copy your unique referral link from the dashboard or use the social share buttons to send it directly via WhatsApp, SMS, or Email.",
    category: "referral-program"
  }
];

const categories = [
  { id: "fipmoney-app", name: "FipMoney App" },
  { id: "digital-gold", name: "Digital Gold" },
  { id: "withdrawal-issues", name: "Withdrawal Issues" },
  { id: "referral-program", name: "Referral Program" }
];

export default function HomeFAQs() {
  const [activeCategory, setActiveCategory] = useState("fipmoney-app");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = faqs.filter(faq => faq.category === activeCategory);

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <section className="relative py-14 md:py-16 font-sans w-full flex items-center justify-center overflow-hidden bg-white">
      {/* Decorative blurred circles using brand colors */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-amber-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800 tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Our platform is built to help you work smarter, not harder. It adapts to your needs and supports your goals. Make the most of every feature.
          </p>
        </div>

        {/* Two column layout */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-12">
          
          {/* Left Column: Categories */}
          <div className="w-full lg:w-1/3 flex flex-col gap-3">
            {categories.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setExpandedFAQ(null);
                  }}
                  className={`w-full flex items-center justify-between px-6 py-5 rounded-xl transition-all duration-300 font-semibold text-left
                    ${isActive 
                      ? 'bg-amber-100/50 text-[#4a2b75] shadow-sm border border-amber-200/50' 
                      : 'bg-white/40 text-slate-500 hover:bg-white/60 border border-transparent'
                    }
                  `}
                >
                  <span className="text-[15px]">{category.name}</span>
                  <ChevronRight className={`w-5 h-5 transition-transform ${isActive ? 'text-[#ffbf00]' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: FAQs */}
          <div className="w-full lg:w-2/3 flex flex-col gap-3">
            <AnimatePresence mode="wait">
              {filteredFAQs.map((faq) => {
                const isExpanded = expandedFAQ === faq.id;
                return (
                  <motion.div
                    key={faq.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`rounded-xl overflow-hidden transition-all duration-300
                      ${isExpanded 
                        ? 'bg-white shadow-sm' 
                        : 'bg-white/40 hover:bg-white/60'
                      }
                    `}
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full p-5 text-left flex items-start justify-between"
                    >
                      <span className={`pr-4 font-semibold text-[15px] ${isExpanded ? 'text-[#4a2b75]' : 'text-slate-700'}`}>
                        {faq.question}
                      </span>
                      <div className="flex-shrink-0 mt-0.5">
                        {isExpanded ? (
                          <X className="w-5 h-5 text-[#ffbf00]" />
                        ) : (
                          <Plus className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-1">
                            <p className="text-slate-600 text-[14px] leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
