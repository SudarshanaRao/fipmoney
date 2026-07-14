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
  Calendar
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface DigitalSilverProps {
  onBack: () => void;
}

const HeroSection = () => {
  const [currentSilverPrice, setCurrentSilverPrice] = useState(75);
  const [priceChange, setPriceChange] = useState(+1.5);

  useEffect(() => {
    // Simulate live silver price updates
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 2;
      setCurrentSilverPrice(prev => Math.max(70, prev + change));
      setPriceChange(change);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-24 pb-20 bg-gradient-to-br from-white via-gray-50 to-gray-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          <defs>
            <pattern id="silver-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="#94a3b8"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#silver-pattern)" />
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
              className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-slate-400/20 text-slate-700 px-4 py-2 rounded-full mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Coins className="w-4 h-4 mr-2" />
              99.9% Pure Digital Silver
            </motion.div>

            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Invest in{" "}
              <span className="bg-gradient-to-r from-slate-500 to-slate-700 bg-clip-text text-transparent">
                Digital Silver
              </span>
              <br />
              Starting ₹1
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Buy, sell, and store 99.9% pure silver digitally. Powered by Augmont, start your precious metal investment journey with India's most trusted digital silver platform.
            </p>

            {/* Live Silver Price */}
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-400/20 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Live Silver Rate (per gram)</p>
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{currentSilverPrice.toFixed(1)}
                    </span>
                    <Badge 
                      className={`${priceChange >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    >
                      {priceChange >= 0 ? '+' : ''}₹{priceChange.toFixed(1)}
                    </Badge>
                  </div>
                </div>
                <motion.div
                  className="w-12 h-12 bg-gradient-to-r from-slate-500 to-slate-700 rounded-full flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <TrendingUp className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-gradient-to-r from-slate-500 to-slate-700 hover:from-slate-600 hover:to-slate-800 text-white px-8 py-4 text-lg interactive-button">
                <Coins className="w-5 h-5 mr-2" />
                Start Investing
              </Button>
              <Button variant="outline" className="border-slate-500 text-slate-700 hover:bg-slate-500 hover:text-white px-8 py-4 text-lg">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
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
                className="absolute inset-0 bg-gradient-to-r from-slate-500 to-slate-700 rounded-3xl blur-3xl opacity-20"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <ImageWithFallback
                src="https://mydigisilver.com/digisilver/images/gold995.jpg"
                alt="Digital Silver Investment"
                className="relative z-10 w-full h-[500px] object-cover rounded-3xl shadow-2xl"
              />
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
      title: "Instant Buying & Selling",
      description: "Buy or sell silver instantly 24/7 at live market rates with zero waiting time.",
      color: "bg-blue-500"
    },
    {
      icon: Shield,
      title: "100% Secure Storage",
      description: "Your silver is stored in secure vaults with comprehensive insurance coverage.",
      color: "bg-green-500"
    },
    {
      icon: DollarSign,
      title: "No Hidden Charges",
      description: "Transparent pricing with no storage fees, no lock-in period, and minimal transaction costs.",
      color: "bg-purple-500"
    },
    {
      icon: Smartphone,
      title: "Easy Mobile Access",
      description: "Manage your silver portfolio on-the-go with our user-friendly mobile app.",
      color: "bg-orange-500"
    },
    {
      icon: TrendingUp,
      title: "Real-time Tracking",
      description: "Monitor your investments with live silver prices and portfolio performance analytics.",
      color: "bg-indigo-500"
    },
    {
      icon: Award,
      title: "99.9% Pure Silver",
      description: "Invest in certified pure silver with hallmark guarantee and purity assurance.",
      color: "bg-gray-500"
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
          <Badge className="bg-gray-100 text-slate-700 mb-4">
            Why Choose Digital Silver
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Smart Way to{" "}
            <span className="bg-gradient-to-r from-slate-500 to-slate-700 bg-clip-text text-transparent">
              Own Silver
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the convenience of digital silver investment with all the benefits of physical silver ownership.
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

const DigitalSilverFeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "100% Safe",
      description: "Your silver is securely stored in Augmont's certified vaults—no locker fees, no home storage risk.",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: Coins,
      title: "Buy as low as ₹1",
      description: "FipMoney Digital Silver is accessible to everyone. Our mission is to make silver investment easy for all Indians.",
      gradient: "from-slate-500 to-slate-700"
    },
    {
      icon: ShoppingCart,
      title: "Get Physical Silver or Jewellery",
      description: "Withdraw anytime in cash or convert to silver coins, bars, or jewellery at the lowest price in the market.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Home,
      title: "Sell Anytime from Home",
      description: "You can withdraw anytime with ease from FipMoney App into cash instantly.",
      gradient: "from-blue-500 to-indigo-600"
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
          <Badge className="bg-gray-100 text-slate-700 mb-4">
            Why Choose Digital Silver
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Features of{" "}
            <span className="bg-gradient-to-r from-slate-500 to-slate-700 bg-clip-text text-transparent">
              Digital Silver
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the powerful features that make digital silver investment simple, secure, and accessible.
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

const HowItWorksSection = () => {
  const processSteps = [
    {
      number: "1",
      title: "Select Amount",
      description: "Starting with any amount. Choose between Daily, Weekly and Monthly options.",
      icon: DollarSign,
      image: null
    },
    {
      number: "2",
      title: "Setup One time",
      description: "Once you give permission, savings will happen automatically daily without effort.",
      icon: Calendar,
      image: null
    },
    {
      number: "3",
      title: "Start Saving",
      description: "Your 99.9% pure and secure silver savings keep getting added to your vault.",
      icon: TrendingUp,
      image: null
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          <defs>
            <pattern id="silver-dots" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="1" fill="#94a3b8"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#silver-dots)" />
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
          <Badge className="bg-gray-100 text-slate-700 mb-4">
            Simple Process
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How does{" "}
            <span className="bg-gradient-to-r from-slate-500 to-slate-700 bg-clip-text text-transparent">
              it work?
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start your digital silver investment journey in just 3 simple steps.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.number}
              className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover-lift border border-gray-100 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Connector Line */}
              {index < processSteps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-slate-500/30 z-0" />
              )}
              
              {/* Step Number */}
              <div className="relative z-10 w-16 h-16 bg-gradient-to-r from-slate-500 to-slate-700 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6 mx-auto">
                {step.number}
              </div>
              
              {/* Image or Icon */}
              {step.image ? (
                <div className="mb-6">
                  <ImageWithFallback
                    src={step.image}
                    alt={step.title}
                    className="w-full h-32 object-cover rounded-xl mx-auto"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:bg-gray-200 transition-colors duration-300">
                  <step.icon className="w-8 h-8 text-slate-600" />
                </div>
              )}
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SecuritySection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-gray-100 text-slate-700 mb-4">
              Bank-Level Security
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Your Silver is{" "}
              <span className="bg-gradient-to-r from-slate-500 to-slate-700 bg-clip-text text-transparent">
                100% Safe
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We ensure the highest level of security for your digital silver investments with advanced encryption and secure storage.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Augmont Secured Vaults</h4>
                  <p className="text-gray-600">Your silver is stored in Augmont's highly secure, fully insured vaults with 24/7 monitoring and advanced security systems.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Certified Purity</h4>
                  <p className="text-gray-600">All silver is 99.9% pure, certified by renowned assayers and hallmarked.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Regulatory Compliance</h4>
                  <p className="text-gray-600">Fully compliant with RBI guidelines and regulatory standards.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-slate-500 to-slate-700 rounded-3xl blur-3xl opacity-20"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <ImageWithFallback
                src="https://digitalonlinevault.com/media/catalog/product/cache/1/image/1663x/9df78eab33525d08d6e5fb8d27136e95/v/a/vault-icon-silver.png"
                alt="Secure Silver Storage"
                className="relative z-10 w-full h-[400px] object-contain rounded-3xl shadow-2xl bg-white p-8"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is digital silver and how does it work?",
      answer: "Digital silver represents physical 99.9% pure silver stored securely in vaults. When you buy digital silver, you own actual silver equivalent to your investment amount. You can buy, sell, or convert it to physical silver anytime."
    },
    {
      question: "Is my digital silver investment safe and insured?",
      answer: "Yes, your digital silver is 100% safe. It's stored in secure, insured vaults with comprehensive insurance coverage. We partner with certified refiners and follow strict security protocols."
    },
    {
      question: "What is the minimum amount to invest in digital silver?",
      answer: "You can start investing in digital silver with as little as ₹1. There's no upper limit, and you can invest any amount based on your financial goals."
    },
    {
      question: "How are the silver rates determined?",
      answer: "Silver rates are updated in real-time based on international silver prices and local market conditions. You always buy and sell at live market rates with complete transparency."
    },
    {
      question: "Can I convert my digital silver to physical silver?",
      answer: "Yes, you can convert your digital silver to physical silver coins or bars and get them delivered to your address. Minimum quantity restrictions may apply for physical delivery."
    },
    {
      question: "Are there any charges for buying or selling digital silver?",
      answer: "We charge a small transaction fee for buying and selling. There are no storage fees, no lock-in period, and no hidden charges. All fees are transparently displayed before you transact."
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
          <Badge className="bg-gray-100 text-slate-700 mb-4">
            Got Questions?
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-slate-500 to-slate-700 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about digital silver investment.
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
                      <Minus className="w-5 h-5 text-slate-600" />
                    ) : (
                      <Plus className="w-5 h-5 text-slate-600" />
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

export default function DigitalSilver({ onBack }: DigitalSilverProps) {
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
              className="flex items-center space-x-2 text-gray-600 hover:text-slate-600"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <motion.div
                className="w-8 h-8 bg-gradient-to-r from-slate-500 to-slate-700 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <Coins className="w-4 h-4 text-white" />
              </motion.div>
              <span className="font-bold text-gray-900">FipMoney</span>
            </div>
            
            <Button className="bg-gradient-to-r from-slate-500 to-slate-700 hover:from-slate-600 hover:to-slate-800 text-white">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <HeroSection />
        <DigitalSilverFeaturesSection />
        <HowItWorksSection />
        <BenefitsSection />
        <SecuritySection />
        <FAQSection />
      </main>
    </motion.div>
  );
}