"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowLeft, Search, HelpCircle } from "lucide-react";
import { Button } from "./ui/button";

interface FAQsProps {
  onBack: () => void;
}

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
    answer: "FipMoney app is 100% safe and secure for your Gold & Silver investments. All physical gold and silver purchased on FipMoney is stored in high-security, 100% insured physical vaults operated by Brink's India — the global leader in vault logistics. Furthermore, independent Security Trustee Vistra ITCL safeguards customer assets, holding a first exclusive charge over the physical bullion on behalf of users.",
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
    question: "What does the FipMoney App do?",
    answer: "FipMoney App helps you save and invest in digital gold through systematic investment plans (SIPs). You can buy gold starting from ₹1, set up automatic savings, track your investments, and sell your gold whenever you need cash. The app also offers features like round-off savings, goal-based investments, and real-time gold price tracking.",
    category: "fipmoney-app"
  },
  {
    id: "7",
    question: "Is digital gold Real gold?",
    answer: "Yes, digital gold represents real, physical gold. When you buy digital gold through FipMoney, you're purchasing actual 24-karat 999.9 pure gold that is stored securely in Brink's certified vaults. Each purchase is backed 1:1 by physical gold.",
    category: "digital-gold"
  },
  {
    id: "8",
    question: "Can I convert digital gold to physical gold?",
    answer: "Yes, you can convert your digital gold to physical 24K gold coins or bars. FipMoney offers options to get gold coins of various denominations delivered to your doorstep in insured, tamper-proof packaging.",
    category: "digital-gold"
  },
  {
    id: "9",
    question: "How long does it take to withdraw money?",
    answer: "Withdrawals are typically processed within 1-2 business days. The money will be credited directly to your registered bank account via UPI or IMPS transfer.",
    category: "withdrawal-issues"
  },
  {
    id: "10",
    question: "What is the minimum withdrawal amount?",
    answer: "The minimum withdrawal amount is ₹100. You can sell any amount of gold worth ₹100 or more and withdraw the money to your bank account with no maximum limit.",
    category: "withdrawal-issues"
  }
];

const categories = [
  { id: "all", name: "All FAQs", count: faqs.length },
  { id: "fipmoney-app", name: "FipMoney app", count: faqs.filter(f => f.category === "fipmoney-app").length },
  { id: "digital-gold", name: "Digital gold", count: faqs.filter(f => f.category === "digital-gold").length },
  { id: "withdrawal-issues", name: "Withdrawal issues", count: faqs.filter(f => f.category === "withdrawal-issues").length }
];

export default function FAQs({ onBack }: FAQsProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-gray-600 hover:text-[#ffbf00] hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center space-x-2 text-gray-900">
              <HelpCircle className="w-5 h-5 text-[#ffbf00]" />
              <span className="font-medium">Help Center</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            All your <span className="text-[#ffbf00]">questions</span>, answered.
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to frequently asked questions about FipMoney, digital gold investments, and more.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffbf00] focus:border-[#ffbf00] shadow-sm"
            />
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-[#ffbf00] text-white shadow-lg transform scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.name}
              <span className={`ml-2 text-sm ${
                activeCategory === category.id ? "text-white/80" : "text-gray-500"
              }`}>
                ({category.count})
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* FAQ List */}
        <motion.div
          className="max-w-4xl mx-auto space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                layout
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-300"
                >
                  <h3 className="text-lg font-medium text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-[#ffbf00]" />
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
                      <div className="px-6 pb-6 border-t border-gray-100">
                        <p className="text-gray-600 leading-relaxed pt-4">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredFAQs.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500">
                Try adjusting your search or browse different categories.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Contact Support */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our support team is here to help you 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.href = 'mailto:support@fipmoney.com'}
                className="bg-[#ffbf00] hover:bg-[#e6a800] text-white font-medium px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Email Support
              </Button>
              <Button
                onClick={() => window.location.href = 'tel:+919876543210'}
                variant="outline"
                className="border-[#ffbf00] text-[#ffbf00] hover:bg-[#ffbf00] hover:text-white font-medium px-8 py-3 rounded-xl transition-all duration-300"
              >
                Call Support
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}