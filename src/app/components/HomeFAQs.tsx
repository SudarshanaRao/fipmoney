"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

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
    question: "Is FipMoney App safe and reliable to use?",
    answer: "FipMoney app is 100% safe and secure to use for your Daily Savings & Investments in Gold. The gold is stored in world class vaults by India's trusted vault partner.",
    category: "fipmoney-app"
  },
  {
    id: "2",
    question: "What does the FipMoney App do?",
    answer: "FipMoney App helps you save and invest in digital gold through systematic investment plans (SIPs). You can buy gold starting from ₹1, set up automatic savings, track your investments, and sell your gold whenever you need cash.",
    category: "fipmoney-app"
  },
  {
    id: "3",
    question: "How do I create an account on FipMoney?",
    answer: "Creating an account is simple! Download the app, enter your mobile number, verify it with OTP, complete your KYC by uploading Aadhaar and PAN details, and you're ready to start investing in gold.",
    category: "fipmoney-app"
  },
  
  // Digital Gold FAQs
  {
    id: "4",
    question: "Is digital gold Real gold?",
    answer: "Yes, digital gold represents real, physical gold. When you buy digital gold through FipMoney, you're purchasing actual 24-karat gold that is stored securely in our partner's certified vaults.",
    category: "digital-gold"
  },
  {
    id: "5",
    question: "How to buy digital gold?",
    answer: "You can buy digital gold directly in the FipMoney app. Just select the amount in rupees or weight in grams, and complete the payment using UPI, net banking, or cards.",
    category: "digital-gold"
  },
  {
    id: "6",
    question: "Why is the gold buying price different from the selling price?",
    answer: "The difference between the buying and selling price is called the 'spread'. The buying price includes 3% GST and processing charges, whereas the selling price does not include GST as you are selling your asset.",
    category: "digital-gold"
  },
  
  // Withdrawal FAQs
  {
    id: "7",
    question: "Can I withdraw my gold savings instantly?",
    answer: "Yes, you can sell your digital gold and withdraw the money to your registered bank account instantly. However, for security reasons, there might be a 48-hour lock-in period after your first purchase.",
    category: "withdrawal"
  },
  {
    id: "8",
    question: "What are the charges put by FipMoney on Gold Purchase?",
    answer: "FipMoney does not charge any hidden fees. You only pay the live market price of gold plus the mandatory 3% GST set by the Government of India.",
    category: "withdrawal"
  },
  {
    id: "9",
    question: "Where does the FipMoney app store my digital gold?",
    answer: "Your gold is safely stored with our secure vaulting partners like Brink's or Sequel Logistics, which are 100% insured and independently audited.",
    category: "withdrawal"
  }
];

const categories = [
  { id: "fipmoney-app", name: "FipMoney App" },
  { id: "digital-gold", name: "Digital Gold" },
  { id: "withdrawal", name: "Withdrawal" }
];

export default function HomeFAQs() {
  const [activeCategory, setActiveCategory] = useState("fipmoney-app");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = faqs.filter(faq => faq.category === activeCategory);

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <section className="py-20 bg-[#f9fafb] font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-[#2d1b4e] tracking-tight font-serif mb-4">
            Frequently Asked Questions <br className="hidden md:block" /> (FAQs)
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center items-center gap-4 mb-12 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setExpandedFAQ(null); // reset expanded state when switching tabs
              }}
              className={`px-6 py-2.5 rounded-full font-bold transition-all duration-300 text-sm md:text-base ${
                activeCategory === category.id
                  ? "bg-[#4a2b75] text-white shadow-md"
                  : "text-slate-600 hover:text-[#4a2b75] hover:bg-slate-100"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-3">
          <AnimatePresence mode="wait">
            {filteredFAQs.map((faq) => (
              <motion.div
                key={faq.id}
                className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
                >
                  <span className="text-[15px] md:text-base font-medium text-slate-800 pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {expandedFAQ === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">
                        <div className="w-full h-px bg-slate-100 mb-4" />
                        <p className="text-slate-600 text-[14px] md:text-[15px] leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
