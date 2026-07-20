"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import BenefitsSection from "./components/BenefitsSection";
import HowItWorksSection from "./components/HowItWorksSection";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";
import TermsAndConditions from "./components/TermsAndConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import AboutUs from "./components/AboutUs";
import Careers from "./components/Careers";
import HelpCenter from "./components/HelpCenter";
import ContactUs from "./components/ContactUs";
import SecurityCenter from "./components/SecurityCenter";
import Blog from "./components/Blog";
import Chatbot from "./components/Chatbot";
import FAQs from "./components/FAQs";
import BuyGold from "./components/BuyGold";
import SellGold from "./components/SellGold";
import DailySavings from "./components/DailySavings";
import DigitalGold from "./components/DigitalGold";
import DigitalSilver from "./components/DigitalSilver";
import RoundOff from "./components/RoundOff";
import Loans from "./components/Loans";
import GoldLoanCalculator from "./components/GoldLoanCalculator";
import HowTos from "./components/HowTos";
import GuideReader from "./components/GuideReader";
import AuthFlow from "./components/AuthFlow";
import Dashboard from "./components/Dashboard";
import RechargeDetails from "./components/RechargeDetails";
import BillShowcaseSection from "./components/BillShowcaseSection";
import RiskDisclosure from "./components/RiskDisclosure";
import GrievancePolicy from "./components/GrievancePolicy";
import InvestorCharter from "./components/InvestorCharter";

type PageType = 'home' | 'login' | 'signup' | 'dashboard' | 'recharge-details' | 'terms' | 'privacy' | 'about' | 'careers' | 'help' | 'contact' | 'security' | 'press' | 'blog' | 'investors' | 'risk' | 'grievance' | 'investor-charter' | 'sip-calculator' | 'gold-sip-calculator' | 'gold-loan-calculator' | 'step-up-sip-calculator' | 'growth-calculator' | 'retirement-calculator' | 'cpc-8th-calculator' | 'cpc-7th-calculator' | 'gold-rate-calculator' | 'buy-gold' | 'sell-gold' | 'daily-savings' | 'digital-gold' | 'digital-silver' | 'instant-loan' | 'round-off' | 'jar-how-tos' | 'faqs' | 'guide';

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

const ComingSoonPage = ({ title, onBack }: { title: string; onBack: () => void }) => (
  <motion.div
    className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
  >
    <div className="text-center max-w-2xl mx-auto px-4">
      <motion.div
        className="w-32 h-32 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-full flex items-center justify-center mx-auto mb-8"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <span className="text-4xl">🚧</span>
      </motion.div>
      
      <motion.h1
        className="text-4xl font-bold text-gray-900 mb-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {title}
      </motion.h1>
      
      <motion.p
        className="text-lg text-gray-600 mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        We're working hard to bring you this page. Check back soon for updates!
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <button
          onClick={onBack}
          className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] hover:from-[#e6a800] hover:to-[#ffbf00] text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 interactive-button"
        >
          Back to Home
        </button>
      </motion.div>
    </div>
  </motion.div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.slice(1);
      return (path as PageType) || 'home';
    }
    return 'home';
  });
  const [currentGuideId, setCurrentGuideId] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const homeScrollPosition = useRef(0);
  const isLoggedOut = typeof window !== 'undefined' ? !sessionStorage.getItem("fm_logged_in_mobile") : true;


  useEffect(() => {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Handle browser back/forward buttons
    const handlePopState = () => {
      const path = window.location.pathname.slice(1) || 'home';
      setCurrentPage(path as PageType);
    };

    window.addEventListener('popstate', handlePopState);
    
    // Add magnetic effect to buttons
    const addMagneticEffect = () => {
      const magneticElements = document.querySelectorAll('.magnetic');
      
      magneticElements.forEach(element => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          
          (element as HTMLElement).style.setProperty('--x', `${x * 0.3}px`);
          (element as HTMLElement).style.setProperty('--y', `${y * 0.3}px`);
        };
        
        const handleMouseLeave = () => {
          (element as HTMLElement).style.setProperty('--x', '0px');
          (element as HTMLElement).style.setProperty('--y', '0px');
        };
        
        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);
      });
    };
    
    addMagneticEffect();
    
    // Cleanup
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigateToPage = (page: PageType) => {
    if (page === currentPage) return;
    
    // Save current scroll position if leaving home page
    if (currentPage === 'home') {
      homeScrollPosition.current = window.scrollY;
    }
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentPage(page);
      
      // Update URL without full page reload
      const newUrl = page === 'home' ? '/' : `/${page}`;
      window.history.pushState({ page }, '', newUrl);
      
      // Scroll behavior based on destination page
      if (page === 'home') {
        // Restore previous scroll position when returning to home
        setTimeout(() => {
          window.scrollTo({
            top: homeScrollPosition.current,
            behavior: 'smooth'
          });
        }, 100);
      } else {
        // Scroll to top for other pages
        window.scrollTo(0, 0);
      }
      
      setIsTransitioning(false);
    }, 150);
  };

  const navigateToHome = () => navigateToPage('home');

  const navigateToGuide = (guideId: string) => {
    setCurrentGuideId(guideId);
    navigateToPage('guide');
  };

  const navigateToHowTos = () => navigateToPage('jar-how-tos');

  const renderMainContent = () => {
    switch (currentPage) {
      case 'login':
      case 'signup':
        return <AuthFlow onNavigate={navigateToPage} />;
      case 'dashboard':
        return <Dashboard onNavigate={navigateToPage} />;
      case 'recharge-details':
        return <RechargeDetails onBack={() => navigateToPage('dashboard')} />;
      case 'terms':
        return <TermsAndConditions onBack={navigateToHome} />;
      case 'privacy':
        return <PrivacyPolicy onBack={navigateToHome} />;
      case 'about':
        return <AboutUs onBack={navigateToHome} />;
      case 'careers':
        return <Careers onBack={navigateToHome} />;
      case 'help':
        return <HelpCenter onBack={navigateToHome} />;
      case 'contact':
        return <ContactUs onBack={navigateToHome} />;
      case 'security':
        return <SecurityCenter onBack={navigateToHome} />;
      case 'blog':
        return <Blog onBack={navigateToHome} />;
      case 'sip-calculator':
      case 'gold-sip-calculator':
        return <ComingSoonPage title="SIP Calculator Coming Soon" onBack={navigateToHome} />;
      case 'faqs':
        return <FAQs onBack={navigateToHome} />;
      
      // Feature pages
      case 'buy-gold':
        return <BuyGold onBack={navigateToHome} />;
      case 'sell-gold':
        return <SellGold onBack={navigateToHome} />;
      case 'daily-savings':
        return <DailySavings onBack={navigateToHome} />;
      case 'digital-gold':
        return <DigitalGold onBack={navigateToHome} />;
      case 'digital-silver':
        return <DigitalSilver onBack={navigateToHome} />;
      case 'instant-loan':
        return <Loans onBack={navigateToHome} />;
      case 'round-off':
        return <RoundOff onBack={navigateToHome} />;
      
      // Calculator pages
      case 'gold-loan-calculator':
        return <GoldLoanCalculator onBack={navigateToHome} />;
      case 'step-up-sip-calculator':
        return <ComingSoonPage title="Step Up SIP Calculator Coming Soon" onBack={navigateToHome} />;
      case 'growth-calculator':
        return <ComingSoonPage title="Growth Calculator" onBack={navigateToHome} />;
      case 'retirement-calculator':
        return <ComingSoonPage title="Retirement Calculator" onBack={navigateToHome} />;
      case 'cpc-8th-calculator':
        return <ComingSoonPage title="8th CPC Salary Calculator" onBack={navigateToHome} />;
      case 'cpc-7th-calculator':
        return <ComingSoonPage title="7th CPC Salary Calculator" onBack={navigateToHome} />;
      case 'gold-rate-calculator':
        return <ComingSoonPage title="Gold Rate Calculator" onBack={navigateToHome} />;
        
      // Help pages
      case 'jar-how-tos':
        return <HowTos onBack={navigateToHome} onNavigateToGuide={navigateToGuide} />;
      case 'guide':
        return <GuideReader onBack={navigateToHowTos} onNavigateToGuide={navigateToGuide} guideId={currentGuideId} />;
        
      // Other pages
      case 'press':
        return <ComingSoonPage title="Press & Media" onBack={navigateToHome} />;
      case 'investors':
        return <ComingSoonPage title="Investor Relations" onBack={navigateToHome} />;
      case 'risk':
        return <RiskDisclosure onBack={navigateToHome} />;
      case 'grievance':
        return <GrievancePolicy onBack={navigateToHome} />;
      case 'investor-charter':
        return <InvestorCharter onBack={navigateToHome} />;
      default:
        return (
          <>
            {/* Header */}
            <Header onNavigate={navigateToPage} />

            {/* Main Content */}
            <main>
              {/* Hero Section */}
              <HeroSection onNavigate={navigateToPage} />

              {isLoggedOut ? (
                /* Bill Showcase Section */
                <BillShowcaseSection onNavigate={navigateToPage} />
              ) : (
                <>
                  {/* Benefits Section */}
                  <BenefitsSection />

                  {/* How It Works Section */}
                  <HowItWorksSection />

                  {/* Features Section */}
                  <FeaturesSection onNavigateToCalculator={() => navigateToPage('gold-loan-calculator')} />

                  {/* Bill Showcase Section */}
                  <BillShowcaseSection onNavigate={navigateToPage} />
                </>
              )}


            </main>

            {/* Scroll Progress Indicator */}
            <motion.div
              className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] transform-gpu z-50"
              style={{
                scaleX: 0,
                transformOrigin: "0%",
              }}
              whileInView={{
                scaleX: 1,
              }}
              transition={{
                duration: 0.5,
              }}
              viewport={{
                root: null,
                rootMargin: "0px",
                threshold: 0,
              }}
            />

            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
              {/* Floating Gold Particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-[#ffbf00] rounded-full opacity-20"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0.1, 0.4, 0.1],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* AI Chatbot */}
            <Chatbot />
          </>
        );
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-white smooth-scroll"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <PageTransition key={currentPage}>
            <div className="flex flex-col min-h-screen">
              {/* Main Content */}
              <div className="flex-1">
                {renderMainContent()}
              </div>

              {/* Footer — hidden on auth and dashboard pages */}
              {!['login','signup','dashboard','recharge-details'].includes(currentPage) && (
                <Footer onNavigate={navigateToPage} />
              )}
            </div>
          </PageTransition>
        )}
      </AnimatePresence>

      {/* Loading overlay during transitions */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 bg-white z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="loading-spinner"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}