"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import securityIllustration from "../../assets/security_banner_illustration.png";

export default function SafetyPriorityCard() {
  return (
    <section className="py-14 md:py-16 bg-white font-sans w-full flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="rounded-3xl bg-gradient-to-r from-[#eef2f8] via-[#f4f7fc] to-white border border-indigo-100/80 p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-xs"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-indigo-150 text-[#1e1b4b] text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-xs">
                <Lock className="w-3.5 h-3.5 text-[#1e1b4b]" />
                YOUR SAFETY IS OUR PRIORITY
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                Bank-Grade Security,<br />Complete Peace of Mind
              </h3>

              <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed max-w-xl">
                Every transaction on FipMoney is protected with end-to-end 256-bit encryption and monitored 24x7 to ensure complete safety of your funds.
              </p>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <img
                src={securityIllustration}
                alt="Secure Transactions Illustration"
                className="max-h-[160px] sm:max-h-[220px] w-auto object-contain drop-shadow-md"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
