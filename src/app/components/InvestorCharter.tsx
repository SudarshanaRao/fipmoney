"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Target, Eye, ShieldAlert, Award, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";

interface InvestorCharterProps {
  onBack: () => void;
}

export default function InvestorCharter({ onBack }: InvestorCharterProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <motion.div
        className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-[#ffbf00] transition-colors font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center space-x-2 md:space-x-3 cursor-pointer" onClick={onBack}>
              <img src="/fipmoney_logo_final.png" alt="FipMoney Logo" className="h-10 w-auto object-contain" />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-base md:text-lg font-extrabold text-gray-900 tracking-tight leading-none">FipMoney</span>
                <span className="block text-[7px] md:text-[8px] font-bold text-[#ffbf00] tracking-wider uppercase mt-0.5">DIGITAL GOLD PLATFORM</span>
              </div>
            </div>
            <h1 className="text-base md:text-xl font-bold text-gray-900 tracking-tight uppercase border-l-2 border-[#ffbf00] pl-3">
              Investor Charter
            </h1>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header text */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Investor Charter
            </h1>
            <p className="text-gray-600 mb-2">Last Updated: January 15, 2025</p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] mx-auto rounded-full"></div>
          </div>

          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Vision and Mission */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-amber-50/50 rounded-xl border border-amber-100">
                <h3 className="font-extrabold text-[#ffbf00] text-sm tracking-widest uppercase mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Our Vision
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  To democratize wealth creation in India by simplifying micro-savings and automated investments. We envision making digital gold systematic, transparent, and accessible to every citizen.
                </p>
              </div>

              <div className="p-6 bg-amber-50/50 rounded-xl border border-amber-100">
                <h3 className="font-extrabold text-[#ffbf00] text-sm tracking-widest uppercase mb-3 flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Our Mission
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  To provide a robust, secure, and user-centric platform operated under the highest guidelines of corporate governance by <strong>Finpages Tech Pvt Ltd</strong>, enabling micro-SIPs starting at ₹1.
                </p>
              </div>
            </div>

            {/* Rights of Investors */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Rights of Investors</h3>
              <div className="space-y-3">
                {[
                  "Right to get clear, unambiguous, and timely statements of their gold holdings.",
                  "Right to buy, sell, or request physical delivery of gold at transparent market rates.",
                  "Right to secure, encrypted transactions and complete data privacy.",
                  "Right to transparent spreads and clear fee breakups on purchase or delivery.",
                  "Right to have grievances addressed timely as per the redressal matrix."
                ].map((right, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-[#ffbf00] mt-0.5 flex-shrink-0" />
                    <span>{right}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Responsibilities of Investors */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Responsibilities of Investors</h3>
              <div className="space-y-3">
                {[
                  "Provide accurate, complete, and authentic information for registration and KYC compliance.",
                  "Keep login credentials, PINs, and authentication keys confidential to prevent unauthorized access.",
                  "Understand the market risks associated with gold and precious metal price fluctuations.",
                  "Regularly monitor transaction history and raise any discrepancies immediately with support."
                ].map((resp, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-sm text-gray-700">
                    <ShieldAlert className="w-4 h-4 text-[#ffbf00] mt-0.5 flex-shrink-0" />
                    <span>{resp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Notice */}
            <div className="text-center text-xs text-gray-400 border-t border-gray-100 pt-6">
              <p>© 2025 Finpages Tech Pvt Ltd. All rights reserved.</p>
              <p>Corporate Office: #709, Gowra FountainHead, Huda techno Enclave, Hitec City, Hyderabad 500081</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
