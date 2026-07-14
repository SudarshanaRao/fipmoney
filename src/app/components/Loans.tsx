"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Coins, 
  Shield, 
  TrendingUp, 
  Zap, 
  Clock, 
  CheckCircle, 
  Star,
  DollarSign,
  Lock,
  Smartphone,
  CreditCard,
  Award,
  Users,
  BarChart3,
  Plus,
  Minus,
  Play,
  Download,
  Vault,
  ShoppingCart,
  Home,
  Calendar,
  Repeat,
  PiggyBank,
  ArrowUpRight,
  Target,
  Wallet,
  Coffee,
  Car,
  ShoppingBag,
  Fuel,
  Receipt,
  Building2,
  UserCheck,
  CreditCardIcon,
  Banknote,
  Timer,
  MessageCircle,
  ArrowRight,
  IndianRupee,
  FileText,
  Globe,
  Handshake
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LoansProps {
  onBack: () => void;
}

const HeroSection = () => {
  const [currentLoanType, setCurrentLoanType] = useState(0);

  const loanTypes = [
    {
      name: "Super Loan",
      description: "Through NBFC partners",
      range: "Higher amounts",
      features: ["NBFC Partners", "Compliance Ready", "Credit Checks"]
    },
    {
      name: "Instant Loan",
      description: "Fast approval & disbursal",
      range: "₹10K - ₹1L",
      features: ["Instant Approval", "Minimal Docs", "Emergency Ready"]
    },
    {
      name: "UPI Loan",
      description: "Peer-to-peer lending",
      range: "Community funded",
      features: ["P2P Platform", "Flexible Terms", "Community Driven"]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLoanType((prev) => (prev + 1) % loanTypes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-24 pb-20 bg-gradient-to-br from-white via-gold-50 to-gold-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          <defs>
            <pattern id="loan-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="#ffbf00"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#loan-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-gold-400/20 text-gold-700 px-4 py-2 rounded-full mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Banknote className="w-4 h-4 mr-2" />
              Smart Lending Solutions
            </motion.div>

            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Flexible{" "}
              <span className="bg-gradient-to-r from-gold-500 to-gold-600 bg-clip-text text-transparent">
                Loans
              </span>
              <br />
              for Every Need
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Access funds when you need them with our three innovative loan solutions - from NBFC partnerships to instant approval and peer-to-peer lending.
            </p>

            {/* Dynamic Loan Type Display */}
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gold-400/20 mb-8"
              key={currentLoanType}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {loanTypes[currentLoanType].name}
                </h3>
                <Badge className="bg-gold-100 text-gold-700">
                  {loanTypes[currentLoanType].range}
                </Badge>
              </div>
              
              <p className="text-gray-600 mb-4">
                {loanTypes[currentLoanType].description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {loanTypes[currentLoanType].features.map((feature, index) => (
                  <span 
                    key={index}
                    className="bg-gold-50 text-gold-700 px-3 py-1 rounded-lg text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-8 py-4 text-lg interactive-button">
                <CreditCard className="w-5 h-5 mr-2" />
                Apply for Loan
              </Button>
              <Button variant="outline" className="border-gold-500 text-gold-700 hover:bg-gold-500 hover:text-white px-8 py-4 text-lg">
                <Play className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gold-500 to-gold-600 rounded-3xl blur-3xl opacity-20"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <ImageWithFallback
                src="https://think360.ai/wp-content/uploads/2024/01/DEC-Blog-3-Banner.jpg"
                alt="Flexible Loans"
                className="relative z-10 w-full h-[500px] object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const LoanTypesSection = () => {
  const loanTypes = [
    {
      title: "Super Loan",
      subtitle: "NBFC Partnership",
      description: "Loans disbursed through trusted NBFC partners like Aditya Birla Finance and Tata Capital.",
      features: [
        "Larger loan amounts",
        "NBFC compliance standards",
        "Comprehensive KYC and credit checks",
        "Competitive interest rates"
      ],
      icon: Building2,
      gradient: "from-blue-500 to-indigo-600",
      partners: ["Aditya Birla Finance", "Tata Capital", "Other NBFCs"]
    },
    {
      title: "Instant Loan",
      subtitle: "₹10,000 - ₹1,00,000",
      description: "Fast-access loans with instant approval, perfect for emergency financial needs.",
      features: [
        "Instant approval and disbursal",
        "Minimal documentation required",
        "Ideal for emergencies",
        "Quick processing"
      ],
      icon: Zap,
      gradient: "from-green-500 to-emerald-600",
      partners: []
    },
    {
      title: "UPI Loan",
      subtitle: "Peer-to-Peer Lending",
      description: "Community-driven lending where borrowers connect with individual lenders on the platform.",
      features: [
        "Decentralized loan platform",
        "Multiple lenders can contribute",
        "24-hour response window",
        "FipMoney guarantees repayment"
      ],
      icon: Users,
      gradient: "from-purple-500 to-violet-600",
      partners: []
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge className="bg-gold-100 text-gold-700 mb-4">
            Loan Options
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Three Ways to{" "}
            <span className="bg-gradient-to-r from-gold-500 to-gold-600 bg-clip-text text-transparent">
              Get Funded
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the loan type that best fits your needs - from traditional NBFC loans to innovative peer-to-peer lending.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {loanTypes.map((loan, index) => (
            <motion.div
              key={loan.title}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${loan.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <loan.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{loan.title}</h3>
                  <p className="text-gold-600 font-medium mb-4">{loan.subtitle}</p>
                  <p className="text-gray-600 mb-6 leading-relaxed">{loan.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    {loan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {loan.partners.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-2">Partners:</p>
                      <div className="flex flex-wrap gap-2">
                        {loan.partners.map((partner, partnerIndex) => (
                          <Badge key={partnerIndex} variant="outline" className="text-xs">
                            {partner}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const P2PLendingSection = () => {
  const [activeExample, setActiveExample] = useState(0);

  const examples = [
    {
      title: "₹10,000 Loan Request",
      borrower: "Mr. A",
      amount: "₹10,000",
      minWallet: "₹2,000 (20%)",
      minLending: "₹5,000",
      lenders: [
        { name: "Ms. B", wallet: "₹6,000", eligible: true, contribution: "₹5,000" },
        { name: "Mr. C", wallet: "₹10,000", eligible: true, contribution: "₹5,000" },
        { name: "Ms. D", wallet: "₹1,500", eligible: false, contribution: "N/A" }
      ],
      outcome: "Loan fully funded by Ms. B and Mr. C"
    },
    {
      title: "₹1,00,000 Loan Request", 
      borrower: "Mr. Ramesh",
      amount: "₹1,00,000",
      minWallet: "₹20,000 (20%)",
      minLending: "₹20,000",
      lenders: [
        { name: "Lender 1", wallet: "₹25,000", eligible: true, contribution: "₹20,000" },
        { name: "Lender 2", wallet: "₹50,000", eligible: true, contribution: "₹80,000" },
        { name: "Lender 3", wallet: "₹18,000", eligible: false, contribution: "N/A" }
      ],
      outcome: "Loan fully funded by 2 lenders"
    },
    {
      title: "₹50,000 No Response",
      borrower: "Ms. Priya", 
      amount: "₹50,000",
      minWallet: "₹10,000 (20%)",
      minLending: "₹10,000",
      lenders: [
        { name: "6 Eligible Lenders", wallet: "Qualified", eligible: true, contribution: "No Response" }
      ],
      outcome: "Switched to Instant Loan after 24 hours"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveExample((prev) => (prev + 1) % examples.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge className="bg-gold-100 text-gold-700 mb-4">
            How P2P Works
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            UPI Loan{" "}
            <span className="bg-gradient-to-r from-gold-500 to-gold-600 bg-clip-text text-transparent">
              Examples
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how peer-to-peer lending works in practice with real scenarios and outcomes.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Process Steps */}
          <div className="space-y-6">
            <motion.div
              className="bg-gray-50 rounded-2xl p-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">How UPI Loans Work:</h3>
              <div className="space-y-4">
                {[
                  "Borrower raises a loan request",
                  "Platform notifies eligible lenders (₹5K+ wallet)",
                  "Lenders can contribute partially or fully",
                  "Multiple lenders can fulfill one request",
                  "If no response in 24hrs, switch to Instant Loan"
                ].map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-gold-50 rounded-2xl p-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="font-bold text-gray-900 mb-3">Lender Requirements:</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• Minimum 20% of requested amount in wallet</p>
                <p>• For ₹1L request: ₹20K minimum wallet balance</p>
                <p>• Minimum lending contribution: varies by request size</p>
                <p>• Interest credited on borrower repayment</p>
                <p>• FipMoney guarantees repayment if borrower defaults</p>
              </div>
            </motion.div>
          </div>

          {/* Live Examples */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Live Example</h3>
              <div className="flex space-x-1">
                {examples.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      activeExample === index ? 'bg-gold-500' : 'bg-gray-300'
                    }`}
                    onClick={() => setActiveExample(index)}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeExample}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900">
                      {examples[activeExample].title}
                    </h4>
                    <Badge className="bg-blue-100 text-blue-700">
                      {examples[activeExample].amount}
                    </Badge>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Borrower:</span> {examples[activeExample].borrower}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Min Wallet:</span> {examples[activeExample].minWallet}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Min Lending:</span> {examples[activeExample].minLending}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-900">Lenders:</h5>
                    {examples[activeExample].lenders.map((lender, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{lender.name}</p>
                          <p className="text-sm text-gray-600">Wallet: {lender.wallet}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            lender.eligible 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {lender.eligible ? 'Eligible' : 'Not Eligible'}
                          </span>
                          {lender.contribution !== "N/A" && lender.contribution !== "No Response" && (
                            <p className="text-sm text-gray-600 mt-1">{lender.contribution}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-green-800">
                      Outcome: {examples[activeExample].outcome}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: "Instant Processing",
      description: "Get approved and receive funds in minutes with our streamlined loan process.",
      color: "bg-yellow-500"
    },
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Bank-grade security ensures all loan transactions are protected and encrypted.",
      color: "bg-green-500"
    },
    {
      icon: Users,
      title: "Community Lending",
      description: "Connect with individual lenders through our innovative P2P platform.",
      color: "bg-blue-500"
    },
    {
      icon: Building2,
      title: "NBFC Partners",
      description: "Access larger loans through our trusted partnerships with leading NBFCs.",
      color: "bg-purple-500"
    },
    {
      icon: BarChart3,
      title: "Flexible Terms",
      description: "Choose repayment terms that work for your financial situation.",
      color: "bg-indigo-500"
    },
    {
      icon: Handshake,
      title: "Guaranteed Repayment",
      description: "Lenders are protected with our repayment guarantee on all P2P loans.",
      color: "bg-red-500"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge className="bg-gold-100 text-gold-700 mb-4">
            Platform Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-gold-500 to-gold-600 bg-clip-text text-transparent">
              FipMoney Loans
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the future of lending with our comprehensive loan platform designed for modern financial needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};



const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What are the different types of loans available?",
      answer: "FipMoney offers three types of loans: Super Loan (through NBFC partners for larger amounts), Instant Loan (₹10K-₹1L with quick approval), and UPI Loan (peer-to-peer lending where community members fund your request)."
    },
    {
      question: "How does the UPI Loan (P2P) system work?",
      answer: "When you request a UPI loan, the platform notifies eligible lenders with sufficient wallet balance. Multiple lenders can contribute to fulfill your request. If no lender responds within 24 hours, you'll be prompted to apply for an Instant Loan instead."
    },
    {
      question: "What are the eligibility criteria for lenders in P2P loans?",
      answer: "Lenders must have at least 20% of the requested loan amount in their wallet. For example, for a ₹1,00,000 request, lenders need at least ₹20,000. The minimum lending contribution varies based on the loan size."
    },
    {
      question: "What happens if a borrower defaults on a P2P loan?",
      answer: "FipMoney guarantees repayment to lenders. If a borrower defaults on a P2P loan, FipMoney will ensure that lenders receive their money back, protecting their investment."
    },
    {
      question: "How quickly can I get an Instant Loan?",
      answer: "Instant Loans are processed within minutes. With minimal documentation and our streamlined approval process, you can receive funds almost immediately after approval."
    },
    {
      question: "Who are the NBFC partners for Super Loans?",
      answer: "We partner with leading NBFCs including Aditya Birla Finance, Tata Capital, and other trusted financial institutions to provide larger loan amounts with competitive terms."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge className="bg-gold-100 text-gold-700 mb-4">
            Got Questions?
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-gold-500 to-gold-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our loan products and lending platform.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-bold text-gray-900">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {openIndex === index ? (
                      <Minus className="w-5 h-5 text-gold-600" />
                    ) : (
                      <Plus className="w-5 h-5 text-gold-600" />
                    )}
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Loans({ onBack }: LoansProps) {
  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gold-600"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <motion.div
                className="w-8 h-8 bg-gradient-to-r from-gold-500 to-gold-600 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <Banknote className="w-4 h-4 text-white" />
              </motion.div>
              <span className="font-bold text-gray-900">FipMoney</span>
            </div>
            
            <Button className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white">
              Apply Now
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <HeroSection />
        <LoanTypesSection />
        <P2PLendingSection />
        <FeaturesSection />
        <FAQSection />
      </main>
    </motion.div>
  );
}