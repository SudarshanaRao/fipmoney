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
  Receipt
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface RoundOffProps {
  onBack: () => void;
}

const HeroSection = () => {
  const [totalSavings, setTotalSavings] = useState(2450);
  const [roundOffs, setRoundOffs] = useState(487);

  useEffect(() => {
    // Simulate live savings updates
    const interval = setInterval(() => {
      const randomIncrease = Math.random() * 10;
      setTotalSavings(prev => prev + randomIncrease);
      if (Math.random() > 0.7) {
        setRoundOffs(prev => prev + 1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-24 pb-20 bg-gradient-to-br from-white via-gold-50 to-gold-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          <defs>
            <pattern id="coins-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="#ffbf00"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#coins-pattern)" />
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
              <PiggyBank className="w-4 h-4 mr-2" />
              Automatic Spare Change Investment
            </motion.div>

            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Round-Off &{" "}
              <span className="bg-gradient-to-r from-gold-500 to-gold-600 bg-clip-text text-transparent">
                Save Gold
              </span>
              <br />
              Automatically
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Turn your everyday spending into gold investment. Every purchase gets rounded up to the nearest rupee, and the spare change is automatically invested in 24K pure gold through our secure platform.
            </p>

            {/* Live Stats */}
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gold-400/20 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Savings</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{totalSavings.toFixed(0)}
                    </span>
                    <motion.div
                      className="w-2 h-2 bg-green-500 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Round-Offs Made</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {roundOffs}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-8 py-4 text-lg interactive-button">
                <Repeat className="w-5 h-5 mr-2" />
                Enable Round-Off
              </Button>
              <Button variant="outline" className="border-gold-500 text-gold-700 hover:bg-gold-500 hover:text-white px-8 py-4 text-lg">
                <Play className="w-5 h-5 mr-2" />
                See How It Works
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
                src="https://www.shutterstock.com/image-vector/smart-savings-strategies-financial-security-260nw-2484836893.jpg"
                alt="Round-Off Savings"
                className="relative z-10 w-full h-[500px] object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  const processSteps = [
    {
      number: "1",
      title: "Make Any Purchase",
      description: "Shop anywhere - online, offline, UPI, card payments. Continue your normal spending habits.",
      icon: ShoppingBag,
      example: "Coffee for ₹47.30 → Rounds to ₹48",
      savingsAmount: "₹0.70"
    },
    {
      number: "2",
      title: "Automatic Round-Up",
      description: "Every transaction gets rounded up to the nearest rupee. The spare change is collected automatically.",
      icon: ArrowUpRight,
      example: "Fuel for ₹1,247.25 → Rounds to ₹1,248",
      savingsAmount: "₹0.75"
    },
    {
      number: "3",
      title: "Invest in Gold",
      description: "The rounded amount is instantly invested in 24K pure digital gold at live market rates.",
      icon: Coins,
      example: "Monthly collection: ₹156 → Invested in gold",
      savingsAmount: "₹156.00"
    }
  ];

  const transactions = [
    { name: "Coffee", amount: "₹47.30", roundup: "₹0.70", icon: Coffee },
    { name: "Grocery", amount: "₹234.15", roundup: "₹0.85", icon: ShoppingCart },
    { name: "Fuel", amount: "₹1,247.25", roundup: "₹0.75", icon: Car },
    { name: "Online Shopping", amount: "₹899.45", roundup: "₹0.55", icon: ShoppingBag },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % processSteps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          <defs>
            <pattern id="round-dots" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="1" fill="#ffbf00"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#round-dots)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge className="bg-gold-100 text-gold-700 mb-4">
            Simple Process
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How{" "}
            <span className="bg-gradient-to-r from-gold-500 to-gold-600 bg-clip-text text-transparent">
              Round-Off
            </span>{" "}
            Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your spare change becomes gold investment automatically with every transaction.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Process Steps */}
          <div className="space-y-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.number}
                className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 ${
                  activeStep === index 
                    ? 'border-gold-400 shadow-gold-200' 
                    : 'border-gray-200 hover:border-gold-200'
                }`}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activeStep === index 
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 mb-3">{step.description}</p>
                    <div className="bg-gold-50 rounded-lg p-3">
                      <p className="text-sm text-gold-700">
                        <span className="font-medium">Example:</span> {step.example}
                      </p>
                      <p className="text-sm font-semibold text-gold-800 mt-1">
                        Savings: {step.savingsAmount}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Live Transaction Demo */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-xl"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Recent Round-Offs
            </h3>
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gold-50 transition-colors duration-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center">
                      <transaction.icon className="w-5 h-5 text-gold-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.name}</p>
                      <p className="text-sm text-gray-500">{transaction.amount}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gold-600">{transaction.roundup}</p>
                    <p className="text-xs text-gray-500">to gold</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total This Month:</span>
                <span className="text-xl font-bold text-gold-600">₹156.85</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Zap,
      title: "Effortless Savings",
      description: "Save and invest without thinking. Your spare change works for you automatically with every purchase.",
      color: "bg-blue-500"
    },
    {
      icon: Target,
      title: "Small Amounts, Big Impact",
      description: "Even ₹0.50 round-offs add up to significant gold holdings over time. Every rupee counts.",
      color: "bg-green-500"
    },
    {
      icon: Shield,
      title: "24K Pure Gold",
      description: "Your round-offs are invested in genuine 24K gold stored securely in insured vaults.",
      color: "bg-gold-500"
    },
    {
      icon: Smartphone,
      title: "Works with All Payments",
      description: "UPI, cards, net banking - round-off works seamlessly with all your payment methods.",
      color: "bg-purple-500"
    },
    {
      icon: TrendingUp,
      title: "Build Wealth Gradually",
      description: "Transform everyday spending into long-term wealth creation through consistent gold investment.",
      color: "bg-indigo-500"
    },
    {
      icon: Clock,
      title: "Set & Forget",
      description: "One-time setup enables automatic savings forever. No daily decisions or manual investments needed.",
      color: "bg-orange-500"
    }
  ];

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
            Why Round-Off Savings
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Smart Way to{" "}
            <span className="bg-gradient-to-r from-gold-500 to-gold-600 bg-clip-text text-transparent">
              Build Wealth
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the power of micro-investing with round-off savings that turn your daily expenses into gold wealth.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${benefit.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const RoundOffFeaturesSection = () => {
  const features = [
    {
      icon: Repeat,
      title: "Automatic Round-Up",
      description: "Every transaction is automatically rounded to the nearest rupee. No manual intervention required.",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: Wallet,
      title: "All Payment Methods",
      description: "Works with UPI, debit cards, credit cards, net banking, and mobile wallets seamlessly.",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: Coins,
      title: "Instant Gold Investment",
      description: "Spare change is immediately converted to 24K gold at live market rates with zero delays.",
      gradient: "from-gold-500 to-gold-600"
    },
    {
      icon: BarChart3,
      title: "Track Your Progress",
      description: "Monitor your savings growth, gold accumulation, and investment performance in real-time.",
      gradient: "from-purple-500 to-violet-600"
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
            Key Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Features of{" "}
            <span className="bg-gradient-to-r from-gold-500 to-gold-600 bg-clip-text text-transparent">
              Round-Off Savings
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the powerful features that make round-off savings effortless and rewarding.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed text-center">{feature.description}</p>
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
      question: "How does round-off savings work?",
      answer: "Every time you make a purchase, the amount is automatically rounded up to the nearest rupee. The spare change (round-off amount) is instantly invested in 24K gold at live market rates. For example, if you spend ₹47.30, it rounds to ₹48, and ₹0.70 gets invested in gold."
    },
    {
      question: "Which payment methods support round-off?",
      answer: "Round-off works with all major payment methods including UPI payments, debit cards, credit cards, net banking, and mobile wallets. The feature integrates seamlessly with your existing payment habits."
    },
    {
      question: "Is there a minimum or maximum round-off amount?",
      answer: "The minimum round-off is ₹0.01 and maximum is ₹0.99 per transaction. There's no limit on the number of transactions or total monthly round-offs. You can also set daily or monthly caps if desired."
    },
    {
      question: "Can I withdraw my round-off savings anytime?",
      answer: "Yes, you can sell your accumulated gold and withdraw the amount anytime. You can also convert your digital gold to physical gold coins or bars, or keep it as a long-term investment."
    },
    {
      question: "How do I track my round-off savings?",
      answer: "The FipMoney app provides detailed insights including total round-offs made, amount saved, gold accumulated, current value, and growth over time. You'll get monthly reports and real-time updates."
    },
    {
      question: "Are there any charges for round-off savings?",
      answer: "There are no additional charges for the round-off feature. You only pay the standard transaction fees for gold purchases, which are minimal and transparently displayed in the app."
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
            Find answers to common questions about round-off savings and automatic gold investment.
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
                  <span className="font-semibold text-gray-900">{faq.question}</span>
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

export default function RoundOff({ onBack }: RoundOffProps) {
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
                <PiggyBank className="w-4 h-4 text-white" />
              </motion.div>
              <span className="font-bold text-gray-900">FipMoney</span>
            </div>
            
            <Button className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <HeroSection />
        <HowItWorksSection />
        <RoundOffFeaturesSection />
        <BenefitsSection />
        <FAQSection />
      </main>
    </motion.div>
  );
}