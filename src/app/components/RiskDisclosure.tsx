"use client";

import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle, ShieldAlert, TrendingDown, Percent, Info, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";

interface RiskDisclosureProps {
  onBack: () => void;
}

export default function RiskDisclosure({ onBack }: RiskDisclosureProps) {
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
              Risk Disclosure
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
              Risk Disclosure Document
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
            {/* Warning Banner */}
            <div className="bg-[#fff8dc] border border-[#ffd152] rounded-xl p-6 flex items-start space-x-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-[#ffbf00]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Important Market Notice</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Digital gold and precious metal investments are subject to market risks. Values may fluctuate based on macroeconomic factors, international commodity rates, and currency valuations. Please understand the risks before initiating a systematic investment plan.
                </p>
              </div>
            </div>

            {/* Risk Categories */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mb-4">
                  <TrendingDown className="w-5 h-5 text-[#ffbf00]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Price Volatility Risk</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Precious metal prices can be volatile and are influenced by international markets, supply and demand, geopolitical situations, and currency rate movements. There is no guaranteed return on investments.
                </p>
              </div>

              <div className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mb-4">
                  <Percent className="w-5 h-5 text-[#ffbf00]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Inflation & Currency Risk</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  While gold is traditionally viewed as an inflation hedge, macroeconomic shifts, domestic tax/tariff changes, and rupee-dollar exchanges directly impact procurement prices, which may diminish purchasing power.
                </p>
              </div>

              <div className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mb-4">
                  <ShieldAlert className="w-5 h-5 text-[#ffbf00]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Storage and Custody Risk</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Although your physical gold is stored securely in 100% insured vaults managed by our certified vault partner, systemic disruptions or technical failures may cause temporary delays in trade settlement or physical delivery fulfillment.
                </p>
              </div>

              <div className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mb-4">
                  <Info className="w-5 h-5 text-[#ffbf00]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Liquidity Risk</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  FipMoney allows instant selling of gold balance back to standard rates. However, during market closures, technical outages, or banking holidays, sellbacks may experience settlement lag.
                </p>
              </div>
            </div>

            {/* General Disclaimers */}
            <div className="space-y-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Platform Disclaimers</h3>
              <p>
                1. <strong>Finpages Tech Pvt Ltd</strong> operates the FipMoney technology platform. Finpages Tech Pvt Ltd does not act as a custodian, trustee, or direct seller of digital gold. Sourcing, custody, and vaulting are managed exclusively by certified gold provider partners (India's trusted vault partner).
              </p>
              <p>
                2. Sells and purchases are bound by buyer-seller agreements and terms determined by the partner provider. Investors are requested to read product documents, transaction fees, and spreads before executing transactions.
              </p>
              <p>
                3. Past performance is not indicative of future returns. Any calculation tool or projection showing historical yields is for informational purposes only.
              </p>
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
