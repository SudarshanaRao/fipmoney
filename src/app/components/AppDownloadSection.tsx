"use client";

import { motion } from "framer-motion";
import { Smartphone, Download, Star, Shield, Zap } from "lucide-react";
import { Button } from "./ui/button";

const AppFeature = ({ icon: Icon, title, description }) => (
  <motion.div
    className="flex items-start space-x-3"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
  >
    <div className="w-10 h-10 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-xl flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </motion.div>
);

const PhoneMockup = ({ delay = 0 }) => (
  <motion.div
    className="relative"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    viewport={{ once: true }}
  >
    {/* Phone Frame */}
    <div className="relative w-72 h-[500px] bg-gray-900 rounded-3xl p-2 shadow-2xl">
      <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
        {/* Status Bar */}
        <div className="bg-gray-50 h-8 flex items-center justify-between px-4">
          <div className="flex items-center space-x-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
          <div className="text-xs font-semibold text-gray-600">9:41</div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
          </div>
        </div>
        
        {/* App Screen */}
        <div className="p-5 h-full bg-gradient-to-br from-white to-gray-50">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Good morning,</h3>
              <p className="text-base text-gray-600">Let's grow your wealth!</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-full flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
          </div>
          
          {/* Portfolio Card */}
          <div className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-2xl p-5 mb-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base opacity-90">Total Portfolio</span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4" />
                <span className="text-sm">+12.5%</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-2">₹1,24,500</div>
            <div className="text-base opacity-90">15.5g Digital Gold</div>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mb-3">
                <Download className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm font-medium text-gray-900">Buy Gold</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm font-medium text-gray-900">Start SIP</div>
            </div>
          </div>
          
          {/* Goals */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 mb-4">
            <div className="text-sm font-medium text-gray-900 mb-3">Emergency Fund</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-[#ffbf00] h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="text-sm text-gray-600">₹65,000 / ₹1,00,000</div>
          </div>
          
          {/* Additional Investment Card */}
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="text-sm font-medium text-gray-900 mb-2">Gold SIP</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Monthly Investment</span>
              <span className="text-sm font-semibold text-[#ffbf00]">₹5,000</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-36 h-1 bg-gray-700 rounded-full"></div>
    </div>
    
    {/* Floating Elements */}
    <motion.div
      className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-3"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <Shield className="w-3 h-3 text-white" />
        </div>
        <div>
          <div className="text-xs font-semibold text-gray-900">Secure</div>
          <div className="text-xs text-gray-500">100%</div>
        </div>
      </div>
    </motion.div>
    
    <motion.div
      className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-3"
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
    >
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-[#ffbf00] rounded-full flex items-center justify-center">
          <Star className="w-3 h-3 text-white" />
        </div>
        <div>
          <div className="text-xs font-semibold text-gray-900">Rating</div>
          <div className="text-xs text-gray-500">4.9★</div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

export default function AppDownloadSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          <defs>
            <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="1" fill="#ffbf00"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#dots)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div>
              <motion.div
                className="inline-flex items-center bg-[#fff8dc] text-[#b38200] px-4 py-2 rounded-full mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                Download Our App
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                Start Your{" "}
                <span className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] bg-clip-text text-transparent">
                  Gold Investment
                </span>{" "}
                Journey Today
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                Join over 10 lakh users who are building wealth with digital gold. Download the FipMoney app and start investing with just ₹1.
              </p>
            </div>

            {/* App Features */}
            <div className="space-y-6">
              <AppFeature
                icon={Shield}
                title="Bank-Grade Security"
                description="Your investments are protected with multi-layer security and full insurance coverage."
              />
              <AppFeature
                icon={Zap}
                title="Instant Transactions"
                description="Buy and sell digital gold instantly, 24/7 with real-time market prices."
              />
              <AppFeature
                icon={Star}
                title="Award-Winning App"
                description="Rated 4.9/5 by users and recognized as the best gold investment platform."
              />
            </div>

            {/* Download Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.button
                className="flex items-center justify-center space-x-3 bg-black text-white px-6 py-4 rounded-2xl hover:bg-gray-800 transition-colors duration-300 min-w-48 interactive-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-8 h-8">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </motion.button>
              
              <motion.button
                className="flex items-center justify-center space-x-3 bg-black text-white px-6 py-4 rounded-2xl hover:bg-gray-800 transition-colors duration-300 min-w-48 interactive-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-8 h-8">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex items-center space-x-8 pt-8 border-t border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              viewport={{ once: true }}
            >
              <div>
                <div className="text-2xl font-bold text-gray-900">10L+</div>
                <div className="text-sm text-gray-600">Downloads</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">4.9★</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">#1</div>
                <div className="text-sm text-gray-600">Gold App</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Single Phone Mockup */}
          <div className="relative flex justify-center">
            <PhoneMockup delay={0.2} />
          </div>
        </div>
      </div>
    </section>
  );
}