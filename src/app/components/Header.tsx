"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Calculator, HelpCircle, User, ChevronDown, Coins, Gift, CreditCard, BarChart3, Phone, FileQuestion, BookOpen, Sparkles, PiggyBank, LogIn, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import fipMoneyLogo from "../../imports/fipmoney_logo_final.png";

interface HeaderProps {
  onNavigate?: (page: string) => void;
}

const DropdownMenu = ({ title, items, isOpen, onToggle, onItemClick }) => {
  return (
    <div className="relative">
      <motion.button
        className="flex items-center space-x-1 text-gray-600 hover:text-[#1e1b4b] font-medium transition-colors duration-200"
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
      >
        <span>{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-4 z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {items.map((item, index) => (
              <motion.button
                key={item.name}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-600 hover:text-[#1e1b4b] hover:bg-indigo-50/50 transition-all duration-200"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onItemClick(item.action)}
              >
                {item.icon && <item.icon className="w-4 h-4 text-[#1e1b4b]" />}
                <span className="text-sm">{item.name}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Header({ onNavigate }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleBillClick = (label: string) => {
    if (typeof window !== 'undefined' && sessionStorage.getItem("fm_logged_in_mobile")) {
      sessionStorage.setItem("selectedBillLabel", label);
      onNavigate?.('recharge-details');
    } else {
      onNavigate?.('login');
    }
  };

  const helpItems = [
    { name: "Contact", action: () => onNavigate?.('contact'), icon: Phone },
    { name: "FipMoney How To's", action: () => onNavigate?.('jar-how-tos'), icon: BookOpen },
    { name: "FAQs", action: () => onNavigate?.('faqs'), icon: FileQuestion },
  ];

  const navItems = [
    { name: "About", action: () => onNavigate?.('about') },
  ];

  const handleNavClick = (item) => {
    if (item.action) {
      item.action();
    } else if (item.href.startsWith('#')) {
      const element = document.querySelector(item.href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleDropdownToggle = (dropdown: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleDropdownItemClick = (action: () => void) => {
    action();
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-[env(safe-area-inset-top,0px)] ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-white/80 backdrop-blur-sm lg:bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => onNavigate?.('home')}
          >
            <motion.img
              src={fipMoneyLogo}
              alt="FipMoney Logo"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span 
              className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900"
              whileHover={{ color: "#1e1b4b" }}
              transition={{ duration: 0.3 }}
            >
              FipMoney
            </motion.span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {/* Features Megamenu Trigger */}
            <div className="relative">
              <motion.button
                className="flex items-center space-x-1 text-gray-600 hover:text-[#1e1b4b] font-medium transition-colors duration-200"
                onClick={handleDropdownToggle('features')}
                whileHover={{ scale: 1.05 }}
              >
                <span>Features</span>
                <motion.div
                  animate={{ rotate: activeDropdown === 'features' ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {activeDropdown === 'features' && (
                  <motion.div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[92vw] sm:w-[640px] md:w-[720px] max-w-[720px] bg-white rounded-2xl shadow-2xl border border-gray-150 p-5 md:p-6 z-50 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Digital Gold */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                          <Coins className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-gray-900 text-sm">Digital Gold</span>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleDropdownItemClick(() => onNavigate?.('buy-gold'))}
                          className="w-full text-left text-xs font-semibold text-gray-600 hover:text-amber-500 hover:bg-amber-50/50 p-2 rounded-lg transition-all duration-200"
                        >
                          Buy Digital Gold
                        </button>
                        <button
                          onClick={() => handleDropdownItemClick(() => onNavigate?.('sell-gold'))}
                          className="w-full text-left text-xs font-semibold text-gray-600 hover:text-amber-500 hover:bg-amber-50/50 p-2 rounded-lg transition-all duration-200"
                        >
                          Sell Digital Gold
                        </button>
                        <button
                          onClick={() => handleDropdownItemClick(() => onNavigate?.('live-metal-tracker'))}
                          className="w-full text-left text-xs font-bold text-amber-600 hover:text-amber-700 hover:bg-amber-100/50 p-2 rounded-lg transition-all duration-200 flex items-center justify-between"
                        >
                          <span>Live Metal Rates</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </button>
                      </div>
                    </div>

                    {/* Digital Silver */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-gray-900 text-sm">Digital Silver</span>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleDropdownItemClick(() => onNavigate?.('digital-silver'))}
                          className="w-full text-left text-xs font-semibold text-gray-600 hover:text-slate-700 hover:bg-slate-50 p-2 rounded-lg transition-all duration-200"
                        >
                          Buy Digital Silver
                        </button>
                        <button
                          onClick={() => handleDropdownItemClick(() => onNavigate?.('digital-silver'))}
                          className="w-full text-left text-xs font-semibold text-gray-600 hover:text-slate-700 hover:bg-slate-50 p-2 rounded-lg transition-all duration-200"
                        >
                          Sell Digital Silver
                        </button>
                      </div>
                    </div>

                    {/* Bill Payments */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-gray-900 text-sm">Bill Payments</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        {[
                          { name: "Mobile Prepaid", label: "Mobile Prepaid" },
                          { name: "Electricity", label: "Electricity Bill" },
                          { name: "DTH Connection", label: "DTH Connection" },
                          { name: "Credit Card Bill", label: "Credit Card Rent" }
                        ].map((b) => (
                          <button
                            key={b.name}
                            onClick={() => handleDropdownItemClick(() => handleBillClick(b.label))}
                            className="w-full text-left text-xs font-semibold text-gray-600 hover:text-blue-500 hover:bg-blue-50/50 p-1.5 rounded-lg transition-all duration-200"
                          >
                            {b.name}
                          </button>
                        ))}
                        <button
                          onClick={() => handleDropdownItemClick(() => onNavigate?.('recharge-details'))}
                          className="w-full text-left text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded-lg transition-all duration-200"
                        >
                          View More →
                        </button>
                      </div>
                    </div>

                    {/* Savings Section */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                          <PiggyBank className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-gray-900 text-sm">Gold Savings</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => handleDropdownItemClick(() => onNavigate?.('savings'))}
                          className="w-full text-left text-xs font-semibold text-gray-600 hover:text-purple-600 hover:bg-purple-50/50 p-1.5 rounded-lg transition-all duration-200 flex items-center justify-between"
                        >
                          <span>Daily Savings</span>
                          <span className="text-[9px] bg-purple-100 text-purple-700 font-extrabold px-1.5 py-0.5 rounded">₹100/d</span>
                        </button>
                        <button
                          onClick={() => handleDropdownItemClick(() => onNavigate?.('savings'))}
                          className="w-full text-left text-xs font-semibold text-gray-600 hover:text-purple-600 hover:bg-purple-50/50 p-1.5 rounded-lg transition-all duration-200 flex items-center justify-between"
                        >
                          <span>Weekly Savings</span>
                          <span className="text-[9px] bg-emerald-100 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded">₹1k/wk</span>
                        </button>
                        <button
                          onClick={() => handleDropdownItemClick(() => onNavigate?.('savings'))}
                          className="w-full text-left text-xs font-semibold text-gray-600 hover:text-purple-600 hover:bg-purple-50/50 p-1.5 rounded-lg transition-all duration-200 flex items-center justify-between"
                        >
                          <span>Monthly Savings</span>
                          <span className="text-[9px] bg-amber-100 text-amber-700 font-extrabold px-1.5 py-0.5 rounded">₹5k/mo</span>
                        </button>
                        <button
                          onClick={() => handleDropdownItemClick(() => onNavigate?.('savings'))}
                          className="w-full text-left text-xs font-bold text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-1.5 rounded-lg transition-all duration-200 mt-1"
                        >
                          View Savings Page →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <DropdownMenu
              title="Help"
              items={helpItems}
              isOpen={activeDropdown === 'help'}
              onToggle={handleDropdownToggle('help')}
              onItemClick={handleDropdownItemClick}
            />

            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                className="text-gray-600 hover:text-[#1e1b4b] font-medium transition-colors duration-200"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleNavClick(item)}
              >
                {item.name}
              </motion.button>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <motion.button
              className="flex items-center space-x-1.5 px-5 py-2.5 text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all duration-200 cursor-pointer shadow-2xs"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate?.('login')}
            >
              <LogIn className="w-4 h-4 text-[#1e1b4b]" />
              <span>Login</span>
            </motion.button>
            <motion.button
              className="flex items-center space-x-1.5 px-5.5 py-2.5 text-sm font-black text-white bg-gradient-to-r from-[#1e1b4b] to-[#312e81] hover:from-[#111827] hover:to-[#1e1b4b] rounded-xl shadow-md shadow-[#1e1b4b]/20 transition-all duration-200 cursor-pointer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate?.('signup')}
            >
              <span>Start Savings Now</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-[#ffbf00] transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white shadow-xl border-t border-gray-200 max-h-[80vh] overflow-y-auto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-4">
                {/* Mobile Features Section */}
                <div className="border-b border-gray-200 pb-4 space-y-4">
                  <h4 className="font-bold text-gray-900 text-sm">Features</h4>
                  
                  {/* Digital Gold */}
                  <div className="pl-2 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
                      <Coins className="w-3.5 h-3.5" />
                      <span>Digital Gold</span>
                    </div>
                    <div className="pl-4 flex flex-col space-y-2">
                      <button onClick={() => handleDropdownItemClick(() => onNavigate?.('buy-gold'))} className="text-left text-xs text-gray-600 hover:text-amber-500 py-1 font-semibold bg-transparent border-none">Buy Digital Gold</button>
                      <button onClick={() => handleDropdownItemClick(() => onNavigate?.('sell-gold'))} className="text-left text-xs text-gray-600 hover:text-amber-500 py-1 font-semibold bg-transparent border-none">Sell Digital Gold</button>
                      <button onClick={() => handleDropdownItemClick(() => onNavigate?.('savings'))} className="text-left text-xs text-purple-700 hover:text-purple-900 py-1 font-bold bg-transparent border-none">Gold Savings (SIP)</button>
                    </div>
                  </div>

                  {/* Digital Silver */}
                  <div className="pl-2 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Digital Silver</span>
                    </div>
                    <div className="pl-4 flex flex-col space-y-2">
                      <button onClick={() => handleDropdownItemClick(() => onNavigate?.('digital-silver'))} className="text-left text-xs text-gray-600 hover:text-slate-700 py-1 font-semibold bg-transparent border-none">Buy Digital Silver</button>
                      <button onClick={() => handleDropdownItemClick(() => onNavigate?.('digital-silver'))} className="text-left text-xs text-gray-600 hover:text-slate-700 py-1 font-semibold bg-transparent border-none">Sell Digital Silver</button>
                    </div>
                  </div>

                  {/* Bill Payments */}
                  <div className="pl-2 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Bill Payments</span>
                    </div>
                    <div className="pl-4 flex flex-col space-y-2">
                      <button onClick={() => handleDropdownItemClick(() => handleBillClick("Mobile Prepaid"))} className="text-left text-xs text-gray-600 hover:text-blue-500 py-1 font-semibold bg-transparent border-none">Mobile Prepaid</button>
                      <button onClick={() => handleDropdownItemClick(() => handleBillClick("Electricity Bill"))} className="text-left text-xs text-gray-600 hover:text-blue-500 py-1 font-semibold bg-transparent border-none">Electricity</button>
                      <button onClick={() => handleDropdownItemClick(() => handleBillClick("DTH Connection"))} className="text-left text-xs text-gray-600 hover:text-blue-500 py-1 font-semibold bg-transparent border-none">DTH Connection</button>
                      <button onClick={() => handleDropdownItemClick(() => handleBillClick("Credit Card Rent"))} className="text-left text-xs text-gray-600 hover:text-blue-500 py-1 font-semibold bg-transparent border-none">Credit Card Bill</button>
                    </div>
                  </div>
                </div>



                {/* Mobile Help Section */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Help</h4>
                  {helpItems.map((item, index) => (
                    <motion.button
                      key={item.name}
                      className="flex items-center space-x-3 w-full text-left text-gray-600 hover:text-[#ffbf00] py-2 transition-colors duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleDropdownItemClick(item.action)}
                    >
                      <item.icon className="w-4 h-4 text-[#ffbf00]" />
                      <span className="text-sm">{item.name}</span>
                    </motion.button>
                  ))}
                </div>

                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    className="text-left text-gray-600 hover:text-[#ffbf00] font-medium py-2 transition-colors duration-200 hover-gold"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleNavClick(item)}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </nav>

              <div className="flex flex-col space-y-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="border-[#ffbf00] text-[#b8860b] hover:bg-[#fffbea] font-semibold"
                  onClick={() => handleDropdownItemClick(() => onNavigate?.('login'))}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button
                  className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] hover:from-[#e6a800] hover:to-[#ffbf00] text-gray-900 shadow-lg font-bold"
                  onClick={() => handleDropdownItemClick(() => onNavigate?.('signup'))}
                >
                  Start Savings Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}