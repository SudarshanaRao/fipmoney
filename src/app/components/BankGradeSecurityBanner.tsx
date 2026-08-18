"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function BankGradeSecurityBanner() {
  return (
    <section className="py-14 md:py-16 bg-white text-slate-900 relative overflow-hidden">
      {/* LIGHT GRADIENT BLURS */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/40 via-indigo-50/20 to-transparent rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* TOP HEADER */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-[#d89221] text-xs font-black tracking-widest uppercase shadow-xs"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <ShieldCheck className="w-4 h-4 text-[#d89221]" />
            100% BANK-GRADE SECURITY & INDEPENDENT CUSTODY
          </motion.div>

          <motion.h2 
            className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-slate-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Your Gold is <span className="bg-gradient-to-r from-[#d89221] via-[#e6a800] to-amber-600 bg-clip-text text-transparent drop-shadow-2xs">Very Safe & 100% Yours</span>
          </motion.h2>

          <motion.p 
            className="text-sm md:text-base font-semibold text-slate-600 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Every rupee becomes physical 24K gold — stored under bank-grade security and legally held in your name, not ours.
          </motion.p>
        </div>

        {/* OFFICIAL PARTNERS LOGO BANNER (BRINK'S & VISTRA) */}
        <motion.div
          className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">SECURED BY</span>
              <div className="h-6 w-px bg-slate-200" />
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-around gap-8 md:gap-12 w-full">
              {/* Brink's Logo Card */}
              <div className="flex items-center gap-4 bg-slate-50/80 border border-slate-200/70 px-6 py-3.5 rounded-2xl hover:bg-amber-50/40 transition-colors">
                <img src="/brinks-logo.svg" alt="Secured by Brink's" className="h-7 md:h-8 w-auto object-contain" />
                <div className="text-left border-l border-slate-200 pl-4">
                  <div className="text-xs font-black text-slate-900">Brink's Vault Custody</div>
                  <div className="text-[10px] font-bold text-slate-500">24x7 Monitored & 100% Insured</div>
                </div>
              </div>

              {/* Vistra Logo Card */}
              <div className="flex items-center gap-4 bg-slate-50/80 border border-slate-200/70 px-6 py-3.5 rounded-2xl hover:bg-emerald-50/40 transition-colors">
                <img src="/vistra-logo.svg" alt="Vistra Security Trustee" className="h-7 md:h-8 w-auto object-contain" />
                <div className="text-left border-l border-slate-200 pl-4">
                  <div className="text-xs font-black text-slate-900">Vistra Security Trustee</div>
                  <div className="text-[10px] font-bold text-slate-500">Independent Legal Safeguard</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
