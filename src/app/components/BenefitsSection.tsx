"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Clock, Target, TrendingUp, Lock } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "100% Safe & Secure",
    description: "Your gold is stored in secure vaults with full insurance coverage and MMTC-PAMP certification.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Zap,
    title: "Super Easy to Use",
    description: "Start investing in just 2 minutes. No paperwork, no hassle - just simple and intuitive investing.",
    color: "from-[#ffbf00] to-[#ffd152]",
  },
  {
    icon: Clock,
    title: "Quick & Instant",
    description: "Buy or sell digital gold instantly. Get immediate access to your investments 24/7.",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Target,
    title: "Goal-Based Savings",
    description: "Set financial goals and automate your gold investments to achieve them systematically.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: TrendingUp,
    title: "Better Returns",
    description: "Historical data shows gold has delivered consistent returns and acts as a hedge against inflation.",
    color: "from-red-500 to-red-600",
  },
  {
    icon: Lock,
    title: "Bank-Grade Security",
    description: "Multi-layer security protocols and encrypted transactions ensure your investments are protected.",
    color: "from-gray-600 to-gray-700",
  },
];

const BenefitCard = ({ benefit, index }) => {
  const IconComponent = benefit.icon;
  
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      viewport={{ once: true }}
    >
      <motion.div
        className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        <IconComponent className="w-6 h-6 text-white" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
      <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
    </motion.div>
  );
};

export default function BenefitsSection() {
  return (
    <section className="py-20 bg-gray-50 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-[#ffbf00] rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#ffd152] rounded-full blur-3xl"></div>
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
            Why Choose FipMoney?
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            The Smartest Way to{" "}
            <span className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] bg-clip-text text-transparent">
              Invest in Gold
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the future of gold investment with our cutting-edge platform designed for modern investors.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard key={benefit.title} benefit={benefit} index={index} />
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          className="mt-16 bg-white rounded-2xl p-8 shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-[#ffbf00] mb-2">MMTC-PAMP</div>
              <div className="text-sm text-gray-600">Certified Gold</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#ffbf00] mb-2">₹10Cr</div>
              <div className="text-sm text-gray-600">Insurance Coverage</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#ffbf00] mb-2">24/7</div>
              <div className="text-sm text-gray-600">Customer Support</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#ffbf00] mb-2">99.9%</div>
              <div className="text-sm text-gray-600">Pure Gold</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}