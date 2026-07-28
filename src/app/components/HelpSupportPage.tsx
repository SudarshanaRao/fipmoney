import React, { useState } from "react";
import { 
  Search, Phone, FileText, UserCheck, Wallet, Zap, Coins, 
  ChevronRight, MessageSquare, Mail, ShieldCheck, Send,
  Shield, Users, Clock, RefreshCw, HelpCircle, PhoneCall
} from "lucide-react";
import { motion } from "framer-motion";

export default function HelpSupportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { title: "FAQs", desc: "Find answers to common questions", icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Account & KYC", desc: "Update KYC, profile or account details", icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Payments & Wallet", desc: "Issues with payments, wallet or transactions", icon: Wallet, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Bills & Recharges", desc: "Help with bill payments and recharges", icon: Zap, color: "text-orange-500", bg: "bg-orange-50" },
    { title: "Gold & Silver", desc: "Buying, selling and delivery support", icon: Coins, color: "text-rose-500", bg: "bg-rose-50" },
  ];

  const popularTopics = [
    { title: "How to complete KYC verification?", desc: "Step-by-step guide to verify your account" },
    { title: "How to withdraw money?", desc: "Withdraw to bank account easily" },
    { title: "How to add money to my wallet?", desc: "Multiple ways to add money securely" },
    { title: "Why is my payment failed?", desc: "Common reasons and how to resolve" },
    { title: "How to buy digital gold?", desc: "Learn how to buy 24K gold in simple steps" },
    { title: "How to view transaction history?", desc: "Track all your transactions and payments" },
  ];

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#fcfdfd]">
      <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-10 pb-24 lg:pb-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-black text-gray-900 tracking-tight">Help & Support</h1>
            <p className="text-[13px] font-semibold text-gray-500 mt-1">We're here to help you. Find answers, get support and stay updated.</p>
          </div>
          <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
               <PhoneCall size={18} className="text-purple-600" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold text-gray-800">Need immediate help?</div>
              <div className="text-[11px] font-medium text-gray-500 mt-0.5">
                Call us 24/7 on <span className="font-bold text-purple-700">1800 123 4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Search Section */}
        <div className="bg-gradient-to-r from-[#f5f3ff] to-[#eef2ff] rounded-3xl p-8 md:p-12 border border-purple-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 relative z-10 w-full max-w-lg">
            <h2 className="text-2xl font-black text-[#2e1065] mb-2 tracking-tight">How can we help you today?</h2>
            <p className="text-[13px] font-medium text-purple-800/70 mb-6">Search for help articles, topics or features</p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Search size={18} /></span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help topics..."
                className="w-full bg-white rounded-xl py-4 pl-12 pr-4 text-[13px] font-semibold text-gray-800 border-none outline-none shadow-sm focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
          
          {/* Decorative Chat Graphic */}
          <div className="relative z-10 hidden md:flex items-center justify-center w-48 h-48">
            <div className="absolute w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-60" />
            <div className="relative">
              <div className="w-24 h-24 bg-purple-600 rounded-[24px] rounded-br-sm shadow-xl flex items-center justify-center transform -rotate-6">
                <HelpCircle size={48} className="text-white" />
              </div>
              <div className="absolute -bottom-4 -right-8 w-16 h-12 bg-amber-400 rounded-2xl rounded-bl-sm shadow-lg flex items-center justify-center transform rotate-6">
                 <div className="flex gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-white" />
                   <div className="w-1.5 h-1.5 rounded-full bg-white" />
                   <div className="w-1.5 h-1.5 rounded-full bg-white" />
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-start gap-4"
            >
              <div className={`w-10 h-10 rounded-xl ${cat.bg} flex items-center justify-center shrink-0`}>
                 <cat.icon size={20} className={cat.color} />
              </div>
              <div className="flex flex-col gap-1.5 flex-1 w-full">
                 <h3 className="text-[13px] font-black text-gray-900 leading-tight">{cat.title}</h3>
                 <p className="text-[11px] font-semibold text-gray-500 leading-snug">{cat.desc}</p>
              </div>
              <div className="mt-auto pt-2 text-gray-300">
                <ChevronRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Popular Help Topics */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <h3 className="text-lg font-black text-gray-900 tracking-tight">Popular Help Topics</h3>
             <button className="text-[11px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none transition-colors">
               View All Articles <ChevronRight size={14} />
             </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularTopics.map((topic, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4 hover:border-purple-200 transition-colors cursor-pointer group shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 group-hover:bg-purple-100 transition-colors">
                  <FileText size={18} className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[13px] font-bold text-gray-800 truncate">{topic.title}</h4>
                  <p className="text-[11px] font-medium text-gray-400 truncate mt-0.5">{topic.desc}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-purple-400 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support Team */}
        <div className="space-y-6">
          <h3 className="text-lg font-black text-gray-900 tracking-tight">Contact Our Support Team</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Live Chat */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center gap-3 relative">
               <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mb-1">
                  <MessageSquare size={20} />
               </div>
               <div>
                 <h4 className="text-[13px] font-black text-gray-900">Live Chat</h4>
                 <p className="text-[10px] font-semibold text-gray-500 mt-1 max-w-[140px]">Chat with our support executive</p>
               </div>
               <button className="w-full py-2.5 mt-2 rounded-xl border border-purple-200 text-purple-700 text-[11px] font-bold hover:bg-purple-50 transition-colors bg-white outline-none cursor-pointer">
                 Start Chat
               </button>
               <div className="flex items-center gap-1.5 mt-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                 <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Online</span>
               </div>
            </div>

            {/* WhatsApp */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center gap-3">
               <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-1">
                  <MessageSquare size={20} /> {/* Can use MessageCircle or custom Whatsapp SVG here, lucide has MessageCircle */}
               </div>
               <div>
                 <h4 className="text-[13px] font-black text-gray-900">WhatsApp Support</h4>
                 <p className="text-[10px] font-semibold text-gray-500 mt-1 max-w-[140px]">Message us on WhatsApp for quick help</p>
               </div>
               <button className="w-full py-2.5 mt-2 rounded-xl border border-emerald-200 text-emerald-700 text-[11px] font-bold hover:bg-emerald-50 transition-colors bg-white outline-none cursor-pointer">
                 Chat on WhatsApp
               </button>
               <div className="mt-1 text-[11px] font-bold text-emerald-600">+91 98765 43210</div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center gap-3">
               <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-1">
                  <Mail size={20} />
               </div>
               <div>
                 <h4 className="text-[13px] font-black text-gray-900">Email Support</h4>
                 <p className="text-[10px] font-semibold text-gray-500 mt-1 max-w-[140px]">Drop us an email and we'll respond to you</p>
               </div>
               <button className="w-full py-2.5 mt-2 rounded-xl border border-orange-200 text-orange-600 text-[11px] font-bold hover:bg-orange-50 transition-colors bg-white outline-none cursor-pointer">
                 Send Email
               </button>
               <div className="mt-1 text-[10px] font-bold text-orange-500">support@fipmoney.com</div>
            </div>

            {/* Call */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center gap-3">
               <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-1">
                  <Phone size={20} />
               </div>
               <div>
                 <h4 className="text-[13px] font-black text-gray-900">Call Support</h4>
                 <p className="text-[10px] font-semibold text-gray-500 mt-1 max-w-[140px]">Speak with our support executive</p>
               </div>
               <button className="w-full py-2.5 mt-2 rounded-xl border border-blue-200 text-blue-700 text-[11px] font-bold hover:bg-blue-50 transition-colors bg-white outline-none cursor-pointer">
                 Call Now
               </button>
               <div className="mt-1 flex flex-col">
                 <span className="text-[11px] font-bold text-blue-600">1800 123 4567</span>
                 <span className="text-[9px] font-semibold text-gray-400">24/7 Available</span>
               </div>
            </div>

          </div>
        </div>

        {/* System Status */}
        <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm shadow-emerald-500/20 shrink-0">
               <ShieldCheck size={24} />
             </div>
             <div>
               <h3 className="text-sm font-black text-emerald-800">All Systems Operational</h3>
               <p className="text-[11px] font-medium text-emerald-700/80 mt-1">We're not experiencing any technical issues. All services are running smoothly.</p>
             </div>
          </div>
          <button className="shrink-0 px-5 py-2.5 rounded-xl border border-emerald-200 text-emerald-700 text-[11px] font-bold hover:bg-emerald-100 transition-colors bg-white flex items-center gap-2 outline-none cursor-pointer shadow-sm">
             <Shield size={14} /> View Service Status
          </button>
        </div>

        {/* Support Form Section */}
        <div className="bg-white rounded-3xl p-8 lg:p-10 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-12">
          <div className="flex-1 max-w-sm">
            <h3 className="text-xl font-black text-gray-900 mb-2">Still Need Help?</h3>
            <p className="text-[13px] font-medium text-gray-500 leading-relaxed mb-8">Can't find what you're looking for? Raise a support request and we'll get back to you.</p>
            
            {/* Illustration */}
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 bg-purple-50 rounded-full blur-2xl opacity-60" />
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                 <div className="w-32 h-24 bg-purple-100 rounded-xl relative shadow-sm border border-purple-200 flex items-center justify-center">
                   <div className="absolute top-0 w-0 h-0 border-l-[64px] border-l-transparent border-r-[64px] border-r-transparent border-t-[40px] border-t-purple-200" />
                   <div className="w-16 h-10 bg-white rounded shadow-sm border border-gray-100 mt-4 flex flex-col p-2 gap-1">
                     <div className="w-full h-1 bg-gray-200 rounded-full" />
                     <div className="w-3/4 h-1 bg-gray-200 rounded-full" />
                   </div>
                 </div>
                 <div className="absolute top-4 right-4 text-purple-600 transform rotate-45 animate-pulse">
                   <Send size={32} />
                 </div>
              </div>
            </div>
          </div>

          <div className="flex-[1.5] flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input 
                type="text" 
                placeholder="Your Name" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-50 transition-all placeholder:text-gray-400"
              />
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Phone size={14} /></span>
                <input 
                  type="text" 
                  placeholder="Registered Mobile Number" 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-50 transition-all placeholder:text-gray-400"
                />
              </div>
            </div>
            
            <div className="relative w-full">
              <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-50 transition-all appearance-none cursor-pointer">
                <option value="" disabled selected>Select a Category</option>
                <option value="kyc">KYC & Account</option>
                <option value="payment">Payments & Wallet</option>
                <option value="gold">Gold & Silver Vault</option>
                <option value="other">Other Issues</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronRight size={14} className="rotate-90" />
              </span>
            </div>

            <textarea 
              rows={4}
              placeholder="Describe your issue in detail" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-50 transition-all placeholder:text-gray-400 resize-none"
            />

            <div className="flex items-center justify-between mt-2">
              <div className="text-[10px] font-semibold text-gray-400">We typically respond within a few hours</div>
              <button className="bg-[#5b21b6] hover:bg-[#4c1d95] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-md shadow-purple-900/20 transition-all outline-none border-none cursor-pointer flex items-center gap-2">
                Submit Request <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
               <Shield size={16} />
             </div>
             <div>
               <div className="text-[10px] font-extrabold text-gray-900">Safe & Secure</div>
               <div className="text-[9px] font-medium text-gray-500 mt-0.5 leading-tight">Your data is 100% safe<br/>and encrypted</div>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
               <Users size={16} />
             </div>
             <div>
               <div className="text-[10px] font-extrabold text-gray-900">Trusted by Millions</div>
               <div className="text-[9px] font-medium text-gray-500 mt-0.5 leading-tight">Join millions of happy<br/>Fipmoney users</div>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
               <Clock size={16} />
             </div>
             <div>
               <div className="text-[10px] font-extrabold text-gray-900">24/7 Support</div>
               <div className="text-[9px] font-medium text-gray-500 mt-0.5 leading-tight">We're here to help you<br/>anytime, anywhere</div>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
               <RefreshCw size={16} />
             </div>
             <div>
               <div className="text-[10px] font-extrabold text-gray-900">Regular Updates</div>
               <div className="text-[9px] font-medium text-gray-500 mt-0.5 leading-tight">Get the latest updates<br/>and new features</div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
