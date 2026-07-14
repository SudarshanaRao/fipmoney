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
        className="flex items-center space-x-1 text-gray-600 hover:text-[#ffbf00] font-medium transition-colors duration-200 hover-gold"
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
                className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-600 hover:text-[#ffbf00] hover:bg-gray-50 transition-all duration-200"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onItemClick(item.action)}
              >
                {item.icon && <item.icon className="w-4 h-4 text-[#ffbf00]" />}
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

  const featuresItems = [
    { name: "Digital Gold", action: () => onNavigate?.('digital-gold'), icon: Coins },
    { name: "Digital Silver", action: () => onNavigate?.('digital-silver'), icon: Sparkles },
    { name: "Loans", action: () => onNavigate?.('instant-loan'), icon: CreditCard },
    { name: "Round Off", action: () => onNavigate?.('round-off'), icon: PiggyBank },
  ];

  const helpItems = [
    { name: "Contact", action: () => onNavigate?.('contact'), icon: Phone },
    { name: "FipMoney How To's", action: () => onNavigate?.('jar-how-tos'), icon: BookOpen },
    { name: "FAQs", action: () => onNavigate?.('faqs'), icon: FileQuestion },
  ];

  const calculatorItems = [
    { name: "Gold SIP Calculator", action: () => onNavigate?.('gold-sip-calculator'), icon: Calculator },
    { name: "SIP Calculator", action: () => onNavigate?.('sip-calculator'), icon: Calculator },
    { name: "Step Up SIP Calculator", action: () => onNavigate?.('step-up-sip-calculator'), icon: BarChart3 },
    { name: "Gold Loan Calculator", action: () => onNavigate?.('gold-loan-calculator'), icon: BarChart3 },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
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
              className="h-12 md:h-14 w-auto object-contain"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span 
              className="text-2xl md:text-3xl font-bold text-gray-900"
              whileHover={{ color: "#ffbf00" }}
              transition={{ duration: 0.3 }}
            >
              FipMoney
            </motion.span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <DropdownMenu
              title="Features"
              items={featuresItems}
              isOpen={activeDropdown === 'features'}
              onToggle={handleDropdownToggle('features')}
              onItemClick={handleDropdownItemClick}
            />
            
            <DropdownMenu
              title="Calculators"
              items={calculatorItems}
              isOpen={activeDropdown === 'calculators'}
              onToggle={handleDropdownToggle('calculators')}
              onItemClick={handleDropdownItemClick}
            />

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
                className="text-gray-600 hover:text-[#ffbf00] font-medium transition-colors duration-200 hover-gold"
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
              className="flex items-center space-x-1.5 px-5 py-2.5 text-sm font-semibold text-[#b8860b] border border-[#ffbf00] rounded-xl hover:bg-[#fffbea] transition-all duration-200"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate?.('login')}
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </motion.button>
            <motion.button
              className="flex items-center space-x-1.5 px-5 py-2.5 text-sm font-bold text-gray-900 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] hover:from-[#e6a800] hover:to-[#ffbf00] rounded-xl shadow-lg shadow-[#ffbf00]/30 hover:shadow-[#ffbf00]/50 transition-all duration-200"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate?.('signup')}
            >
              <span>Start Investing Now</span>
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
            className="md:hidden bg-white shadow-xl border-t border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-4">
                {/* Mobile Features Section */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
                  {featuresItems.map((item, index) => (
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

                {/* Mobile Calculators Section */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Calculators</h4>
                  {calculatorItems.map((item, index) => (
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
                  Start Investing Now
                </Button>
                <Button
                  className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] hover:from-[#e6a800] hover:to-[#ffbf00] text-white shadow-lg hover:shadow-xl transition-all duration-300 interactive-button"
                  onClick={() => handleDropdownItemClick(() => onNavigate?.('gold-sip-calculator'))}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Start SIP
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}