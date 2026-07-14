"use client";

import { motion } from "framer-motion";
import { Smartphone, CreditCard, TrendingUp, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import sipImage from "figma:asset/babbcf3125d50a782391be2c619e804356029007.png";

const steps = [
  {
    icon: Smartphone,
    title: "Download & Sign Up",
    description: "Get the FipMoney app and create your account in less than 2 minutes with simple KYC verification.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop&auto=format",
    step: "01",
  },
  {
    icon: CreditCard,
    title: "Start Your SIP",
    description: "Set up automated investments starting from just ₹1. Choose daily, weekly, or monthly SIP plans.",
    image: "https://assets.upstox.com/content/assets/images/news/gold-on-balance.webp",
    step: "02",
  },
  {
    icon: TrendingUp,
    title: "Watch It Grow",
    description: "Track your gold portfolio in real-time. Monitor your investments and returns through our intuitive dashboard. Sell your digital gold instantly or get physical gold delivered to your doorstep whenever you want.",
    image: "https://jupiter.money/content/images/2023/03/investment-gold.jpg",
    step: "03",
  },
];

const StepCard = ({ step, index, isActive }) => {
  const IconComponent = step.icon;
  
  return (
    <motion.div
      className={`relative bg-white rounded-2xl p-6 shadow-lg transition-all duration-500 h-[480px] flex flex-col ${
        isActive ? 'ring-2 ring-[#ffbf00] shadow-xl scale-105' : 'hover:shadow-xl'
      }`}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.2 }}
      whileHover={{ y: -5 }}
      viewport={{ once: true }}
    >
      {/* Step Number */}
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
        {step.step}
      </div>

      {/* Image */}
      <div className="mb-6 overflow-hidden rounded-xl flex-shrink-0">
        <ImageWithFallback
          src={step.image}
          alt={step.title}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* Icon */}
      <motion.div
        className="w-12 h-12 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        <IconComponent className="w-6 h-6 text-white" />
      </motion.div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-semibold text-gray-900 mb-3 flex-shrink-0">{step.title}</h3>
        <p className="text-gray-600 leading-relaxed flex-1">{step.description}</p>
      </div>

      {/* Shimmer Effect */}
      {isActive && (
        <div className="absolute inset-0 rounded-2xl shimmer"></div>
      )}
    </motion.div>
  );
};

const FlowArrow = ({ index, delay = 0 }) => (
  <motion.div
    className="flex items-center justify-center"
    initial={{ opacity: 0, scale: 0, rotate: -180 }}
    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{ delay, duration: 0.6, type: "spring" }}
    viewport={{ once: true }}
  >
    <motion.div
      className="relative"
      animate={{ x: [0, 5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Arrow Background Circle */}
      <div className="w-12 h-12 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-full flex items-center justify-center shadow-lg">
        <ArrowRight className="w-6 h-6 text-white" />
      </div>
      {/* Glow Effect */}
      <div className="absolute inset-0 w-12 h-12 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-full opacity-30 animate-ping"></div>
    </motion.div>
  </motion.div>
);

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#ffbf00" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center bg-[#fff8dc] text-[#b38200] px-4 py-2 rounded-full mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Simple Process
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How{" "}
            <span className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] bg-clip-text text-transparent">
              FipMoney
            </span>{" "}
            Works
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start your digital gold investment journey in just 3 simple steps. It's that easy!
          </p>
        </motion.div>

        {/* Steps with Integrated Arrows - Desktop Layout */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-center space-x-8 mb-16">
            {steps.map((step, index) => (
              <div key={step.title} className="flex items-center">
                {/* Step Card */}
                <div className="w-80 h-[480px]">
                  <StepCard 
                    step={step} 
                    index={index}
                    isActive={false}
                  />
                </div>
                
                {/* Arrow (only show between first two cards) */}
                {index < steps.length - 1 && (
                  <div className="mx-8">
                    <FlowArrow index={index} delay={(index + 1) * 0.3} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Steps Grid - Mobile/Tablet Layout */}
        <div className="block lg:hidden">
          <div className="space-y-12 mb-16">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center">
                {/* Step Card */}
                <div className="w-full max-w-sm h-[480px]">
                  <StepCard 
                    step={step} 
                    index={index}
                    isActive={false}
                  />
                </div>
                
                {/* Vertical Arrow (only show between cards) */}
                {index < steps.length - 1 && (
                  <div className="my-8">
                    <motion.div
                      className="flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0, rotate: -90 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 90 }}
                      transition={{ delay: (index + 1) * 0.3, duration: 0.6, type: "spring" }}
                      viewport={{ once: true }}
                    >
                      <motion.div
                        className="relative"
                        animate={{ y: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {/* Vertical Arrow Background Circle */}
                        <div className="w-12 h-12 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-full flex items-center justify-center shadow-lg">
                          <ArrowRight className="w-6 h-6 text-white transform rotate-90" />
                        </div>
                        {/* Glow Effect */}
                        <div className="absolute inset-0 w-12 h-12 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-full opacity-30 animate-ping"></div>
                      </motion.div>
                    </motion.div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] hover:from-[#e6a800] hover:to-[#ffbf00] text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 interactive-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Gold Journey Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}