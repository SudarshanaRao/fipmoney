"use client";

import { motion } from "framer-motion";
import { 
  Shield, 
  Zap, 
  Building2, 
  Headphones, 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  Lock, 
  Coins, 
  Database,
  CheckCircle2 
} from "lucide-react";

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const linkGroups = [
    {
      title: 'PRODUCTS',
      icon: Coins,
      links: [
        { label: 'Digital Gold', action: 'digital-gold' },
        { label: 'Digital Silver', action: 'digital-silver' },
        { label: 'Goal-Based Savings', action: 'savings' },
        { label: 'Live Metal Rates', action: 'live-metal-tracker' }
      ]
    },
    {
      title: 'HELP & SUPPORT',
      icon: Headphones,
      links: [
        { label: 'Help Center', action: 'help' },
        { label: 'Contact Us', action: 'contact' },
        { label: 'Security', action: 'security' }
      ]
    },
    {
      title: 'COMPANY',
      icon: Building2,
      links: [
        { label: 'About Us', action: 'about' },
        { label: 'Careers', action: 'careers' },
        { label: 'Terms & Conditions', action: 'terms' },
        { label: 'Privacy Policy', action: 'privacy' },
        { label: 'Delete Account', action: 'delete-account' }
      ]
    }
  ];

  const handleLinkClick = (link: { label: string; action?: string; href?: string }) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (link.action) {
      onNavigate?.(link.action);
    } else if (link.href && link.href.startsWith('#')) {
      const element = document.querySelector(link.href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white relative overflow-hidden pt-10 md:pt-12 flex flex-col" id="contact">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex-1 pb-8 w-full">
        
        {/* Top 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-10">
          
          {/* Brand Section */}
          <div className="md:col-span-12 lg:col-span-4 space-y-5">
            <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => onNavigate?.('home')}>
              <img src="/fipmoney_logo_final.png" alt="FipMoney Logo" className="h-14 w-auto object-contain transition-transform group-hover:scale-105" />
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900 group-hover:text-[#047857] transition-colors tracking-tight font-outfit">FipMoney</span>
                <span className="text-[10px] font-bold text-emerald-800 tracking-[0.2em] uppercase mt-0.5">Digital Gold & Payments</span>
              </div>
            </div>

            <p className="text-emerald-800 text-sm leading-relaxed font-medium">
              India's trusted digital gold and payments platform. Buy, sell, and store digital gold and silver starting from just ₹1. Secured in 100% insured physical vaults by Brink's and protected by independent Security Trustee Vistra.
            </p>
            
            <div className="w-14 h-1 bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] rounded-full mt-5 mb-5 shadow-xs"></div>
            
            <div className="flex items-center gap-3">
              {[
                { Icon: Instagram, href: "https://instagram.com/fipmoney" },
                { Icon: Facebook, href: "https://facebook.com/fipmoney" },
                { Icon: Twitter, href: "https://twitter.com/fipmoney" },
                { Icon: Youtube, href: "https://youtube.com/fipmoney" }
              ].map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-[#f8fafc] border border-emerald-300 flex items-center justify-center text-slate-900 hover:bg-[#064e3b] hover:text-[#fbbf24] hover:border-[#064e3b] transition-all cursor-pointer shadow-xs"
                >
                  <item.Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="md:col-span-12 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {linkGroups.map((group) => (
              <div key={group.title} className="space-y-5">
                <div className="flex flex-col items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-300 flex items-center justify-center text-[#047857] shadow-xs">
                    <group.icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h4 className="text-slate-900 font-black text-[11px] uppercase tracking-widest">{group.title}</h4>
                </div>
                <ul className="space-y-3.5">
                  {group.links.map((link) => (
                    <li key={link.label} className="flex items-center group cursor-pointer" onClick={handleLinkClick(link)}>
                      <span className="text-emerald-800 text-[13px] font-semibold group-hover:text-[#047857] transition-colors">
                        {link.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Banner (Trust Badges) */}
        <div className="bg-white rounded-[24px] shadow-xs border border-slate-200 p-5 md:p-7 mt-10 mb-2 relative overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/60">
            {[
              { title: 'VERIFIED PLATFORM', subtitle: '100% trusted & verified', icon: Shield, logo: null },
              { title: 'SECURE PLATFORM', subtitle: 'Safe payments & data', icon: Lock, logo: null },
              { title: 'BRINK\'S VAULTS', subtitle: '100% insured physical vaults', icon: Database, logo: '/brinks-logo.svg' },
              { title: 'VISTRA TRUSTEE', subtitle: 'Independent legal safeguard', icon: Coins, logo: '/vistra-logo.svg' }
            ].map((item, idx) => (
              <div key={idx} className={`flex items-center gap-4 ${idx !== 0 ? 'pt-5 sm:pt-0 sm:pl-5 lg:pl-7' : ''}`}>
                <div className="w-12 h-12 rounded-full bg-[#f8fafc] border border-emerald-300 flex items-center justify-center shrink-0 p-2 shadow-xs">
                  {item.logo ? (
                    <img src={item.logo} alt={item.title} className="w-full h-full object-contain" />
                  ) : (
                    <item.icon className="w-5 h-5 text-[#047857]" />
                  )}
                </div>
                <div>
                  <h5 className="text-slate-900 font-bold text-[11px] uppercase tracking-wider">{item.title}</h5>
                  <p className="text-slate-600 text-[12px] font-medium mt-0.5">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deep Forest Sage Bottom Bar */}
      <div className="bg-gradient-to-r from-[#022c22] via-[#064e3b] to-[#022c22] border-t border-emerald-300/30 relative z-10 w-full overflow-hidden">
        {/* Absolute Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
              <path fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="5, 5" d="M0,160 C320,300,420,0,740,160 C1060,320,1320,0,1440,160" />
           </svg>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-7 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            
            {/* Left: Copyright & Links */}
            <div className="flex flex-col items-center lg:items-start gap-4 order-2 lg:order-1">
              <p className="text-white text-[10px] font-bold tracking-widest uppercase">
                © 2026 FIPMONEY PVT LTD. ALL RIGHTS RESERVED.
              </p>
              <div className="flex items-center gap-3 text-[11px] text-white/80 font-semibold tracking-wide flex-wrap justify-center">
                <span className="hover:text-amber-300 cursor-pointer transition-colors" onClick={() => onNavigate?.('terms')}>Terms</span>
                <span className="w-1 h-1 bg-amber-400/50 rounded-full" />
                <span className="hover:text-amber-300 cursor-pointer transition-colors" onClick={() => onNavigate?.('privacy')}>Privacy</span>
                <span className="w-1 h-1 bg-amber-400/50 rounded-full" />
                <span className="hover:text-amber-300 cursor-pointer transition-colors" onClick={() => onNavigate?.('risk')}>Risk</span>
                <span className="w-1 h-1 bg-amber-400/50 rounded-full" />
                <span className="hover:text-amber-300 cursor-pointer transition-colors" onClick={() => onNavigate?.('grievance')}>Grievance</span>
                <span className="w-1 h-1 bg-amber-400/50 rounded-full" />
                <span className="hover:text-amber-300 cursor-pointer transition-colors" onClick={() => onNavigate?.('investor-charter')}>Charter</span>
              </div>
            </div>

            {/* Center: Branding Logo Watermark */}
            <div 
              className="flex flex-col items-center justify-center order-1 lg:order-2 text-center py-2 cursor-pointer group"
              onClick={() => onNavigate?.('home')}
            >
              <div className="font-black text-6xl md:text-[4.5rem] lg:text-[6rem] text-white/5 group-hover:text-amber-400/15 transition-colors select-none tracking-tighter leading-none font-outfit uppercase">
                FIPMONEY
              </div>
              <div className="mt-2 text-amber-300 font-bold uppercase tracking-[0.4em] text-[8px] md:text-[9px]">
                Digital Gold & Payments • Est. 2025
              </div>
            </div>

            {/* Right: Partners */}
            <div className="flex items-center gap-6 sm:gap-8 order-3 lg:order-3">
               <div className="flex flex-col items-center gap-1.5">
                 <span className="text-[8px] text-white/80 font-black uppercase tracking-widest">VAULT CUSTODIAN</span>
                 <div className="bg-[#f8fafc] px-3.5 py-1.5 rounded-xl shadow-xs border border-amber-400/40 hover:border-amber-400 flex items-center justify-center h-8 transition-colors">
                   <img src="/brinks-logo.svg" alt="Brink's Vault Custodian" className="h-4.5 w-auto object-contain" />
                 </div>
               </div>
               <div className="flex flex-col items-center gap-1.5">
                 <span className="text-[8px] text-white/80 font-black uppercase tracking-widest">SECURITY TRUSTEE</span>
                 <div className="bg-[#f8fafc] px-3.5 py-1.5 rounded-xl shadow-xs border border-amber-400/40 hover:border-amber-400 flex items-center justify-center h-8 transition-colors">
                   <img src="/vistra-logo.svg" alt="Vistra Security Trustee" className="h-4.5 w-auto object-contain" />
                 </div>
               </div>
            </div>
          </div>
          
          {/* Bottom Edge Warning */}
          <div className="border-t border-emerald-300/20 mt-6 pt-5 flex justify-center text-center">
             <div className="flex items-center gap-2 text-[10px] text-white/80 font-medium">
               <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
               Digital Gold investments are subject to market risks. Stored in 100% insured vaults. Please read disclosures carefully.
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}