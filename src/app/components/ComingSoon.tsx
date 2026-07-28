import React from 'react';
import { Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ComingSoon({ tab }: { tab: string }) {
  const getTitle = () => {
    switch (tab) {
      case 'banking': return 'Banking Services';
      case 'offers': return 'Offers & Rewards';
      case 'help': return 'Help & Support';
      default: return 'Feature';
    }
  };

  return (
    <div className="flex-1 h-screen flex flex-col items-center justify-center bg-[#f8f9fa] p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full bg-white rounded-3xl p-10 border border-gray-100 shadow-sm flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-purple-100/50 relative overflow-hidden">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <Rocket size={40} className="text-purple-600" />
          </motion.div>
          <div className="absolute inset-0 bg-purple-500/10 blur-xl rounded-full" />
        </div>
        
        <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
          {getTitle()}
        </h1>
        <h2 className="text-lg font-bold text-purple-600 mb-4 tracking-wide uppercase text-[13px]">Coming Soon</h2>
        
        <p className="text-sm font-semibold text-gray-500 leading-relaxed px-4">
          We're working hard behind the scenes to bring you an incredible experience. Check back soon for updates!
        </p>

        <div className="mt-8 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-200 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </motion.div>
    </div>
  );
}
