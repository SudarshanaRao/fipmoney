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
    answer: "FipMoney app is 100% safe and secure to use for your Daily Savings & Investments in Gold. The gold is stored in world class vaults by MMTC-PAMP. MMTC-PAMP is a global market leader in secure logistics and vault services that stores and safeguards all the gold that you have purchased via FipMoney platform. Furthermore, to safeguard your interest, FipMoney has appointed an independent Administrator, VISTRA.",
    category: "fipmoney-app"
  },
  {
    id: "2",
    question: "What does the FipMoney App do?",
    answer: "FipMoney App helps you save and invest in digital gold through systematic investment plans (SIPs). You can buy gold starting from ₹1, set up automatic savings, track your investments, and sell your gold whenever you need cash. The app also offers features like round-off savings, goal-based investments, and real-time gold price tracking.",
    category: "fipmoney-app"
  },
  {
    id: "3",
    question: "How do I download the FipMoney App?",
    answer: "You can download the FipMoney App from Google Play Store for Android devices or Apple App Store for iOS devices. Simply search for 'FipMoney' and download the official app. You can also scan the QR code on our website to get direct download links.",
    category: "fipmoney-app"
  },
  {
    id: "4",
    question: "How do I create an account on FipMoney?",
    answer: "Creating an account is simple! Download the app, enter your mobile number, verify it with OTP, complete your KYC by uploading Aadhaar and PAN details, and you're ready to start investing in gold. The entire process takes just a few minutes.",
    category: "fipmoney-app"
  },
  
  // Digital Gold FAQs
  {
    id: "5",
    question: "Is digital gold Real gold?",
    answer: "Yes, digital gold represents real, physical gold. When you buy digital gold through FipMoney, you're purchasing actual 24-karat gold that is stored securely in MMTC-PAMP's vaults. Each purchase is backed by equivalent physical gold, and you can even convert your digital gold to physical gold coins or bars if needed.",
    category: "digital-gold"
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