"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, MapPin, ShieldCheck, HelpCircle, Users } from "lucide-react";
import { Button } from "./ui/button";

interface GrievancePolicyProps {
  onBack: () => void;
}

export default function GrievancePolicy({ onBack }: GrievancePolicyProps) {
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
                <span className="block text-[7px] md:text-[8px] font-bold text-[#ffbf00] tracking-wider uppercase mt-0.5">GOLD SIP PLATFORM</span>
              </div>
            </div>
            <h1 className="text-base md:text-xl font-bold text-gray-900 tracking-tight uppercase border-l-2 border-[#ffbf00] pl-3">
              Grievance Policy
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
              Grievance Redressal Policy
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
            {/* Intro */}
            <p className="text-gray-700 leading-relaxed text-base">
              At FipMoney, we are committed to providing the highest quality of service. We believe in transparency and value customer satisfaction above all else. This Grievance Redressal Policy outlines the step-by-step mechanism established by <strong>Finpages Tech Pvt Ltd</strong> to address any concerns or complaints you may experience.
            </p>

            {/* Redressal Steps */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Redressal Escalation Matrix</h3>
              
              {/* Level 1 */}
              <div className="p-6 border border-gray-100 rounded-xl bg-gray-50/50">
                <h4 className="font-bold text-gray-900 text-sm tracking-wider uppercase text-[#ffbf00] mb-2">Level 1: Customer Care</h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  For any query, transactional issue, or delay, please contact our 24/7 customer care team through the in-app chat facility or via email.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 text-xs text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-[#ffbf00]" />
                    <span><strong>Email:</strong> support@fipmoney.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-[#ffbf00]" />
                    <span><strong>Phone:</strong> +91 94918 41941</span>
                  </div>
                </div>
              </div>

              {/* Level 2 */}
              <div className="p-6 border border-gray-100 rounded-xl bg-gray-50/50">
                <h4 className="font-bold text-gray-900 text-sm tracking-wider uppercase text-[#ffbf00] mb-2">Level 2: Grievance Officer</h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  If your issue is not resolved within 7 business days by the Customer Support team, or if you are unsatisfied with the resolution provided, you may escalate the matter to our Grievance Officer.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 text-xs text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-[#ffbf00]" />
                    <span><strong>Email:</strong> grievance@fipmoney.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-[#ffbf00]" />
                    <span><strong>Officer:</strong> Mr. Raghav Rao</span>
                  </div>
                </div>
              </div>

              {/* Level 3 */}
              <div className="p-6 border border-gray-100 rounded-xl bg-gray-50/50">
                <h4 className="font-bold text-gray-900 text-sm tracking-wider uppercase text-[#ffbf00] mb-2">Level 3: Nodal Officer</h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  In extreme cases where the grievance is not resolved to your satisfaction within 15 days of escalation, you can contact our Principal Nodal Officer at our corporate office.
                </p>
                <div className="flex items-start space-x-2 text-xs text-gray-700">
                  <MapPin className="w-4 h-4 text-[#ffbf00] mt-0.5 flex-shrink-0" />
                  <span><strong>Address:</strong> Finpages Tech Pvt Ltd, #709, Gowra FountainHead, Huda techno Enclave, Hitec City, Hyderabad 500081</span>
                </div>
              </div>
            </div>

            {/* Timelines */}
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6">
              <h3 className="font-bold text-yellow-900 mb-2 flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-[#ffbf00]" />
                Resolution Timelines
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-yellow-800 text-sm leading-relaxed">
                <li>Acknowledgement of the grievance: Within 24-48 hours.</li>
                <li>Level 1 (Customer Support) resolution: Within 3 business days.</li>
                <li>Level 2 (Grievance Officer) resolution: Within 7 business days.</li>
                <li>Level 3 (Nodal Officer) resolution: Within 15 business days.</li>
              </ul>
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
