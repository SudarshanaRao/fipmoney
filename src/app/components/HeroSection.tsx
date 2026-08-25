"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Coins, Sparkles, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";

const carouselData = [
  {
    id: "gold",
    title: "Digital Gold",
    gradient: "from-[#ffbf00] to-[#ffd152]",
    textGradient: "from-[#ffbf00] to-[#ffd152]",
    description: "Build wealth with digital gold investments. Powered by India's trusted partner, start with just ₹1 and watch your savings grow with India's most trusted digital gold platform.",
    badge: "India's Leading Digital Gold Platform",
    image: "/hero_banner_digital_gold.png",
    alt: "Elegant gold jewelry and coins representing digital gold savings and investment",
    floatingCoins: "gold"
  },
  {
    id: "silver",
    title: "Digital Silver",
    gradient: "from-[#4f46e5] to-[#7c3aed]",
    textGradient: "from-[#4f46e5] to-[#7c3aed]",
    description: "Diversify your portfolio with silver investments. Powered by India's trusted partner, start with just ₹1 and explore the potential of India's premier digital silver platform.",
    badge: "India's Leading Digital Silver Platform",
    image: "/hero_banner_digital_silver.png",
    alt: "Premium silver coins in a futuristic digital landscape representing digital silver investment",
    floatingCoins: "silver"
  },
  {
    id: "bill",
    title: "Bill Payments",
    gradient: "from-[#0ea5e9] to-[#2563eb]",
    textGradient: "from-[#0ea5e9] to-[#2563eb]",
    description: "Pay all your utility bills, mobile recharges, electricity, broadband, and more. Instant, secure, and hassle-free payments powered by Bharat BillPay (BBPS).",
    badge: "Quick & Secure Utility Bill Payments",
    image: "/hero_banner_bill_payments.png",
    alt: "Digital payment screens showing online utility bill payments and secure mobile transactions",
    floatingCoins: "bill"
  }
];

export default function HeroSection({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 6000); // Auto-change every 6 seconds

    return () => clearInterval(interval);
  }, []);

  const currentData = carouselData[currentSlide];

  return (
    <section className="bg-white relative overflow-hidden pt-28 md:pt-32 pb-12 border-b border-indigo-100/60">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <motion.div 
          className={`absolute top-20 left-10 w-32 h-32 rounded-full blur-3xl transition-all duration-1000 ${
            currentData.id === "gold" 
              ? "bg-[#3b82f6]" 
              : currentData.id === "silver" 
                ? "bg-[#4f46e5]" 
                : "bg-[#0ea5e9]"
          }`}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className={`absolute bottom-20 right-10 w-40 h-40 rounded-full blur-3xl transition-all duration-1000 ${
            currentData.id === "gold" 
              ? "bg-[#2563eb]" 
              : currentData.id === "silver" 
                ? "bg-[#7c3aed]" 
                : "bg-[#2563eb]"
          }`}
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="inline-flex items-center px-4 py-2 rounded-full mb-6 transition-all duration-500 bg-purple-50 text-purple-900 border border-purple-200 text-xs font-black"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles className="w-4 h-4 mr-2 text-purple-700" />
                  {currentData.badge}
                </motion.div>

                <motion.h1
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Start Saving in{" "}
                  <span className={`bg-gradient-to-r ${currentData.textGradient} bg-clip-text text-transparent`}>
                    {currentData.title}
                  </span>
                </motion.h1>

                <motion.p
                  className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {currentData.description}
                </motion.p>
              </motion.div>
            </AnimatePresence>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-[#1e1b4b] to-[#312e81] hover:from-[#111827] hover:to-[#1e1b4b] text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-black rounded-2xl cursor-pointer flex items-center justify-center"
                onClick={() => onNavigate?.('signup')}
              >
                <TrendingUp className="w-5 h-5 mr-2 text-amber-400" />
                <span>Start Savings Now</span>
              </Button>
            </motion.div>
          </div>

          {/* Right Content - Hero Carousel */}
          <div className="relative mt-6 lg:mt-0">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentSlide}
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative">
                  {/* Main Hero Image */}
                  <div className="relative z-10">
                    <ImageWithFallback
                      src={currentData.image}
                      alt={currentData.alt}
                      className="w-full max-w-lg sm:max-w-xl lg:max-w-2xl mx-auto rounded-3xl shadow-2xl max-h-[280px] sm:max-h-[360px] md:max-h-[440px] object-cover"
                    />
                  </div>

                  {/* Floating Elements */}
                  <motion.div
                    className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-white rounded-2xl shadow-xl p-2.5 sm:p-4 z-20"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-gray-900">
                          {currentData.id === "gold" ? "+12.5%" : currentData.id === "silver" ? "+8.3%" : "Secure"}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500">
                          {currentData.id === "bill" ? "Transactions" : "This Month"}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 bg-white rounded-2xl shadow-xl p-2.5 sm:p-4 z-20"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentData.id === "gold" 
                          ? "bg-[#ffbf00]" 
                          : currentData.id === "silver" 
                            ? "bg-indigo-600" 
                            : "bg-sky-500"
                      }`}>
                        <Coins className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {currentData.id === "gold" ? "2.5g" : currentData.id === "silver" ? "45g" : "Fast"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {currentData.id === "gold" 
                            ? "Gold Saved" 
                            : currentData.id === "silver" 
                              ? "Silver Saved" 
                              : "Settlement"}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}