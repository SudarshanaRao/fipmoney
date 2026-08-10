"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, MessageCircle, Phone, Mail, ChevronDown, ChevronRight, HelpCircle, BookOpen, CreditCard, Shield, Settings, TrendingUp, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Badge } from "./ui/badge";

interface HelpCenterProps {
  onBack: () => void;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

interface Category {
  icon: any;
  title: string;
  description: string;
  count: number;
  id: string;
}

const CategoryCard = ({ icon: Icon, title, description, count, isSelected, onClick, delay = 0 }) => (
  <motion.div
    className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 interactive-card cursor-pointer border-2 ${
      isSelected ? 'border-[#ffbf00] bg-gradient-to-br from-[#fff8dc] to-white' : 'border-transparent'
    }`}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
    onClick={onClick}
  >
    <motion.div
      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
        isSelected 
          ? 'bg-gradient-to-r from-[#ffbf00] to-[#ffd152]' 
          : 'bg-gradient-to-r from-gray-100 to-gray-200'
      }`}
      whileHover={{ scale: 1.1, rotate: isSelected ? 0 : 360 }}
      transition={{ duration: 0.6 }}
    >
      <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
    </motion.div>
    <h3 className={`text-lg font-semibold mb-2 ${isSelected ? 'text-[#b38200]' : 'text-gray-900'}`}>
      {title}
    </h3>
    <p className="text-gray-600 text-sm mb-3">{description}</p>
    <div className={`text-xs font-medium ${isSelected ? 'text-[#ffbf00]' : 'text-gray-500'}`}>
      {count} articles
    </div>
    {isSelected && (
      <motion.div
        className="mt-3 pt-3 border-t border-[#ffbf00]"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        transition={{ duration: 0.3 }}
      >
        <Badge className="bg-[#ffbf00] text-white text-xs">Selected</Badge>
      </motion.div>
    )}
  </motion.div>
);

const ContactCard = ({ icon: Icon, title, description, action, delay = 0 }) => (
  <motion.div
    className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 interactive-card"
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
  >
    <motion.div
      className="w-16 h-16 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-2xl flex items-center justify-center mx-auto mb-4"
      whileHover={{ scale: 1.1, rotate: 360 }}
      transition={{ duration: 0.6 }}
    >
      <Icon className="w-8 h-8 text-white" />
    </motion.div>
    <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
    <p className="text-gray-600 text-sm mb-4">{description}</p>
    <Button className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] hover:from-[#e6a800] hover:to-[#ffbf00] text-white border-0 w-full interactive-button">
      {action}
    </Button>
  </motion.div>
);

const renderFormattedAnswer = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

const FAQItem = ({ faq, isHighlighted, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <AccordionItem
      value={faq.question}
      className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all duration-300 ${
        isHighlighted ? 'border-[#ffbf00] bg-gradient-to-r from-[#fff8dc] to-white' : 'border-transparent'
      }`}
    >
      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 transition-colors">
        <div className="flex items-start justify-between w-full">
          <span className="text-left font-medium text-gray-900 pr-4">{faq.question}</span>
          {isHighlighted && (
            <Badge className="bg-[#ffbf00] text-white text-xs">Match</Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-4">
        <p className="text-gray-600 leading-relaxed mb-3">{renderFormattedAnswer(faq.answer)}</p>
        <div className="flex flex-wrap gap-2">
          {faq.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs text-gray-500 border-gray-300">
              {tag}
            </Badge>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  </motion.div>
);

export default function HelpCenter({ onBack }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories: Category[] = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn the basics of digital gold investment",
      count: 12,
      id: "getting-started"
    },
    {
      icon: Users,
      title: "Account & KYC",
      description: "Account setup, verification, and security",
      count: 8,
      id: "account-kyc"
    },
    {
      icon: CreditCard,
      title: "Buying & Selling",
      description: "How to make transactions and manage investments",
      count: 15,
      id: "buying-selling"
    },
    {
      icon: TrendingUp,
      title: "SIP & Goals",
      description: "Setting up SIPs and achieving financial goals",
      count: 10,
      id: "sip-goals"
    },
    {
      icon: Shield,
      title: "Security & Safety",
      description: "Account security and investment protection",
      count: 6,
      id: "security"
    },
    {
      icon: Shield,
      title: "Trustee, Vaulting & Insurance",
      description: "Insurance coverage, Trustee protection, and safe keeping arrangements",
      count: 7,
      id: "insurance-trustee"
    },
    {
      icon: Settings,
      title: "Technical Support",
      description: "App issues and technical troubleshooting",
      count: 9,
      id: "technical"
    }
  ];

  const faqs: FAQ[] = [
    {
      question: "How do I start investing in digital gold?",
      answer: "Getting started is simple! Download the FipMoney app, complete your **KYC verification**, and you can start investing with just **₹1**. You can buy gold instantly or set up a **SIP** for regular investments.",
      category: "getting-started",
      tags: ["investment", "digital gold", "getting started", "KYC"]
    },
    {
      question: "Is my gold investment safe and secure?",
      answer: "Yes, absolutely! Your digital gold is stored in highly secure vaults with our **trusted vault partner's certification**. We use bank-grade security measures, including **256-bit SSL encryption** and **multi-factor authentication** to protect your investments.",
      category: "security",
      tags: ["security", "safety", "vaults", "encryption"]
    },
    {
      question: "Is my Digital Gold insured, and what risks are covered or excluded?",
      answer: "Yes, **100% of your digital gold and silver** stored with certified **Vault Keepers** is covered by **comprehensive insurance** aligned with global industry practices. It covers losses due to **fire, lightning, theft, cyclone, earthquake, flood, etc.** Coverage excludes extraordinary force majeure events such as **war, revolution, derelict weapons of war, and nuclear radiation**.",
      category: "insurance-trustee",
      tags: ["insurance", "security", "vaults", "covered risks", "force majeure"]
    },
    {
      question: "How much gold percentage is stored/insured and on what purity basis is it calculated?",
      answer: "**100% of the fine gold weight** corresponding to your purchase is stored and insured in secure vaults. Bullion bars are maintained at a minimum of **99.5% purity or higher** (99.5%, 99.9%, or 99.99%). Stored amounts are calculated based on **24 Karat gold**. **Illustration:** If you purchase 1g of 99.99% pure gold, at least **1.0049g of 99.5% purity gold** is physically stored for you in the vault (**1g × 99.99% / 99.5% = 1.0049g**).",
      category: "insurance-trustee",
      tags: ["gold percentage", "purity", "24K", "vault calculation", "insurance"]
    },
    {
      question: "What is the role of Intermediaries and the Trustee Administrator?",
      answer: "DGIPL appoints **Intermediaries** including an independent **Trustee Administrator** and **Vault Keepers** to assist in storing and protecting your metal. The Trustee Administrator holds a **legal first charge** over the bullion and monitors vault balances on your behalf. In default scenarios, the Trustee Administrator is empowered to sell a portion of the metal to satisfy outstanding operational charges and distribute your assets safely.",
      category: "insurance-trustee",
      tags: ["trustee administrator", "intermediaries", "safe keeping", "vaulting", "protection"]
    },
    {
      question: "What are the fees for buying and selling gold?",
      answer: "We charge a minimal transaction fee of 0.5% + GST for both buying and selling. SIP investments have no additional charges, and storage is free for the first year.",
      category: "buying-selling",
      tags: ["fees", "charges", "buying", "selling", "transaction"]
    },
    {
      question: "Can I get physical gold delivered?",
      answer: "Yes! You can convert your digital gold to physical gold (coins or bars) and get it delivered to your doorstep. Minimum quantity and delivery charges apply.",
      category: "buying-selling",
      tags: ["physical gold", "delivery", "conversion", "coins", "bars"]
    },
    {
      question: "How do SIP investments work?",
      answer: "SIP (Systematic Investment Plan) allows you to invest a fixed amount regularly (daily, weekly, or monthly). This helps you benefit from rupee cost averaging and build wealth systematically over time.",
      category: "sip-goals",
      tags: ["SIP", "systematic investment", "regular investment", "rupee cost averaging"]
    },
    {
      question: "What documents do I need for KYC?",
      answer: "You need a valid PAN card, Aadhaar card, and a bank account. The verification process is completely digital and usually takes 5-10 minutes to complete.",
      category: "account-kyc",
      tags: ["KYC", "documents", "PAN", "Aadhaar", "verification"]
    },
    {
      question: "How can I track gold prices?",
      answer: "You can track real-time gold prices directly in the FipMoney app. We also send price alerts and market updates to help you make informed investment decisions.",
      category: "getting-started",
      tags: ["gold prices", "tracking", "real-time", "alerts", "market updates"]
    },
    {
      question: "What happens if I want to close my account?",
      answer: "You can close your account anytime. Simply sell all your gold holdings and withdraw the proceeds to your bank account. Contact our support team for assistance with account closure.",
      category: "account-kyc",
      tags: ["close account", "withdrawal", "account closure", "support"]
    },
    {
      question: "Why can't I log into my account?",
      answer: "Login issues can occur due to incorrect credentials, account suspension, or technical problems. Try resetting your password first. If the issue persists, contact our support team for immediate assistance.",
      category: "technical",
      tags: ["login issues", "password reset", "account access", "technical support"]
    },
    {
      question: "How do I set up two-factor authentication?",
      answer: "Go to Settings > Security in your app, then enable 2FA. You can choose SMS or authenticator app. We highly recommend enabling 2FA for enhanced account security.",
      category: "security",
      tags: ["2FA", "two-factor authentication", "security", "settings", "SMS"]
    },
    {
      question: "What are investment goals and how do I set them?",
      answer: "Investment goals help you save for specific purposes like emergency fund, vacation, or retirement. You can set goals in the app, specify target amount and timeline, and we'll suggest suitable SIP amounts.",
      category: "sip-goals",
      tags: ["goals", "target amount", "timeline", "emergency fund", "retirement"]
    },
    {
      question: "How do I update my bank account details?",
      answer: "You can update your bank account through Settings > Bank Details in the app. You'll need to verify the new account with a small deposit. Changes take 2-3 business days to reflect.",
      category: "account-kyc",
      tags: ["bank account", "update details", "verification", "settings"]
    }
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      action: "Start Chat"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our experts",
      action: "Call Now"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us your questions via email",
      action: "Send Email"
    }
  ];

  // Filter FAQs based on search query and selected category
  const filteredFAQs = useMemo(() => {
    let filtered = faqs;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  // Check if FAQ should be highlighted (matches search)
  const isHighlighted = (faq: FAQ) => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase();
    return faq.question.toLowerCase().includes(query) ||
           faq.answer.toLowerCase().includes(query) ||
           faq.tags.some(tag => tag.toLowerCase().includes(query));
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? "all" : categoryId);
  };

  const handleSearch = () => {
    // Scroll to FAQ section when search is triggered
    const faqSection = document.getElementById('faq-section');
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-[#fff8dc] to-[#ffe485] border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-[#ffbf00] interactive-button"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-[#ffbf00]" />
              <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section with Search */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-[#ffbf00] rounded-full blur-3xl float-animation"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#ffd152] rounded-full blur-3xl" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              How can we{" "}
              <span className="gradient-text">help you</span>{" "}
              today?
            </motion.h2>
            
            <motion.p
              className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Find answers to your questions about digital gold investment, account management, and more
            </motion.p>

            <motion.div
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="relative flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search for help articles, FAQs, and guides..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-6 text-lg rounded-2xl border-2 border-gray-200 focus:border-[#ffbf00] transition-colors w-full"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] hover:from-[#e6a800] hover:to-[#ffbf00] text-white border-0 interactive-button px-8 py-6 rounded-2xl"
                >
                  Search
                </Button>
              </div>
              
              {/* Active Filters */}
              {(searchQuery || selectedCategory !== "all") && (
                <motion.div
                  className="mt-4 flex flex-wrap items-center gap-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {searchQuery && (
                    <Badge className="bg-blue-100 text-blue-800">
                      Search: "{searchQuery}"
                    </Badge>
                  )}
                  {selectedCategory !== "all" && (
                    <Badge className="bg-[#fff8dc] text-[#b38200]">
                      Category: {categories.find(c => c.id === selectedCategory)?.title}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs text-gray-500 hover:text-[#ffbf00]"
                  >
                    Clear all
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the information you need organized by topic
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                icon={category.icon}
                title={category.title}
                description={category.description}
                count={category.count}
                isSelected={selectedCategory === category.id}
                onClick={() => handleCategoryClick(category.id)}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faq-section" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {searchQuery || selectedCategory !== "all" 
                ? `Search Results (${filteredFAQs.length} found)`
                : "Frequently Asked Questions"
              }
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {searchQuery || selectedCategory !== "all"
                ? "Here are the most relevant answers to your query"
                : "Quick answers to the most common questions about FipMoney"
              }
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {filteredFAQs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <FAQItem
                    key={`${faq.question}-${index}`}
                    faq={faq}
                    isHighlighted={isHighlighted(faq)}
                    delay={index * 0.1}
                  />
                ))}
              </Accordion>
            ) : (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">No results found</h4>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or browse different categories
                </p>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="border-[#ffbf00] text-[#ffbf00] hover:bg-[#ffbf00] hover:text-white"
                >
                  Clear filters
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Still Need Help?</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our support team is here to help you 24/7
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {contactOptions.map((option, index) => (
              <ContactCard
                key={option.title}
                icon={option.icon}
                title={option.title}
                description={option.description}
                action={option.action}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}