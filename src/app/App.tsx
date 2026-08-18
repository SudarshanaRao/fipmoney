"use client";

import React, { useState, useEffect, useRef, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import BenefitsSection from "./components/BenefitsSection";
import FeaturesSection from "./components/FeaturesSection";
import PlatformTrustSection from "./components/PlatformTrustSection";
import BankGradeSecurityBanner from "./components/BankGradeSecurityBanner";
import Footer from "./components/Footer";
import TermsAndConditions from "./components/TermsAndConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import AboutUs from "./components/AboutUs";
import Careers from "./components/Careers";
import HelpCenter from "./components/HelpCenter";
import ContactUs from "./components/ContactUs";
import SecurityCenter from "./components/SecurityCenter";
import FAQs from "./components/FAQs";
import BuyGold from "./components/BuyGold";
import SellGold from "./components/SellGold";
import DailySavings from "./components/DailySavings";
import SavingsPage from "./components/SavingsPage";
import PublicSavingsLandingPage from "./components/PublicSavingsLandingPage";
import DigitalGold from "./components/DigitalGold";
import DigitalSilver from "./components/DigitalSilver";
import MiniMetalTracker from "./components/MiniMetalTracker";
import HomeSavingsSection from "./components/HomeSavingsSection";
import AuthFlow from "./components/AuthFlow";
import Dashboard from "./components/Dashboard";
import RechargeDetails from "./components/RechargeDetails";
import BillShowcaseSection from "./components/BillShowcaseSection";
import ReferralProgramSection from "./components/ReferralProgramSection";
import RiskDisclosure from "./components/RiskDisclosure";
import GrievancePolicy from "./components/GrievancePolicy";
import LiveMetalTracker from "./components/LiveMetalTracker";
import HomeFAQs from "./components/HomeFAQs";
import MandatoryDisclosures from "./components/MandatoryDisclosures";
import SafetyPriorityCard from "./components/SafetyPriorityCard";
import AdminDashboard from "./components/AdminDashboard";
import AdminAuthFlow from "./components/AdminAuthFlow";
import AgentDashboard from "./components/AgentDashboard";
import { OBFUSCATED_ADMIN_PATH } from "./utils/adminStorage";
import { LoadingSpinner } from "./components/LottiePlayer";
import { API_BASE_URL } from "./utils/apiConfig";
import { clearUserSession } from "./utils/userStorage";

type PageType = 'home' | 'login' | 'signup' | 'dashboard' | 'recharge-details' | 'terms' | 'privacy' | 'about' | 'careers' | 'help' | 'contact' | 'security' | 'press' | 'blog' | 'investors' | 'risk' | 'grievance' | 'investor-charter' | 'sip-calculator' | 'gold-sip-calculator' | 'gold-loan-calculator' | 'step-up-sip-calculator' | 'growth-calculator' | 'retirement-calculator' | 'cpc-8th-calculator' | 'cpc-7th-calculator' | 'gold-rate-calculator' | 'buy-gold' | 'sell-gold' | 'daily-savings' | 'savings' | 'digital-gold' | 'digital-silver' | 'instant-loan' | 'round-off' | 'jar-how-tos' | 'faqs' | 'guide' | 'live-metal-tracker' | 'portal-sec-9f8a3d7b2c' | 'admin' | 'admin-login' | 'admin-panel' | 'super-admin' | 'agent/login' | 'agent/dashboard' | 'agent-login' | 'agent-dashboard' | 'agent';

const PageTransition = React.forwardRef<HTMLDivElement, { children: React.ReactNode }>(({ children }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
));
PageTransition.displayName = "PageTransition";

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
  const [showRevokedModal, setShowRevokedModal] = useState(false);
  const [revokedMessage, setRevokedMessage] = useState("");

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('fm_admin_logged_in') === 'true';
    }
    return false;
  });

  const isLoggedIn = typeof window !== 'undefined' ? !!sessionStorage.getItem("fm_logged_in_mobile") : false;

  // 1. Enforce Strict Route Protection Guard
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const currentPath = window.location.pathname.slice(1);

    // Dedicated Standalone Agent Dashboard Environment Route Guard
    if (currentPath === 'agent-dashboard' || currentPath === 'agent/dashboard' || currentPath === 'agent' || currentPage === 'agent-dashboard' as any) {
      if (isLoggedIn) {
        if (currentPage !== 'agent-dashboard') setCurrentPage('agent-dashboard' as PageType);
      } else {
        window.history.replaceState({}, '', '/login');
        setCurrentPage('login');
      }
      return;
    }

    // Unauthenticated user trying to access /dashboard -> redirect to /login
    if (!isLoggedIn && (currentPath === 'dashboard' || currentPath.startsWith('dashboard/') || currentPage === 'dashboard')) {
      window.history.replaceState({}, '', '/login');
      setCurrentPage('login');
      return;
    }

    // Authenticated user trying to access /, /login, or /signup -> redirect to /dashboard
    if (isLoggedIn && (currentPath === '' || currentPath === 'home' || currentPath === 'login' || currentPath === 'signup' || currentPage === 'home' || currentPage === 'login' || currentPage === 'signup')) {
      window.history.replaceState({}, '', '/dashboard');
      setCurrentPage('dashboard');
      return;
    }
  }, [currentPage, isLoggedIn]);

  // 2. Real-time Active Session Status Polling
  useEffect(() => {
    const checkSessionStatus = async () => {
      const mobile = typeof window !== 'undefined' ? sessionStorage.getItem("fm_logged_in_mobile") : null;
      const sessionId = typeof window !== 'undefined' ? (sessionStorage.getItem("fm_session_id") || localStorage.getItem("fm_session_id")) : null;
      if (!mobile || !sessionId) return;

      try {
        const res = await fetch(`${API_BASE_URL}/users/session-status?mobile=${encodeURIComponent(mobile)}`, {
          headers: {
            "Accept": "application/json",
            "x-session-id": sessionId,
            "x-user-mobile": mobile,
          }
        });
        const data = await res.json();
        if (data && data.sessionRevoked) {
          clearUserSession();
          setRevokedMessage(data.message || "Your session is logged out. Kindly login back..!");
          setShowRevokedModal(true);
          window.history.replaceState({}, '', '/login');
          setCurrentPage('login');
        }
      } catch (err) {
        // silent catch
      }
    };

    if (isLoggedIn) {
      checkSessionStatus();
      const interval = setInterval(checkSessionStatus, 4000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

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
    const currentPath = typeof window !== 'undefined' ? window.location.pathname.slice(1) : String(currentPage);

    if (currentPath === 'dashboard' || currentPath.startsWith('dashboard/')) {
      return <Dashboard onNavigate={navigateToPage} />;
    }

    if (currentPath === 'admin/signup') {
      return (
        <AdminAuthFlow
          mode="signup"
          onSuccess={() => setIsAdminLoggedIn(true)}
          onNavigateToSecretCode={(code) => {
            window.history.pushState({}, '', `/admin/${code}`);
            setCurrentPage(`admin/${code}` as any);
          }}
          onBackToMainSite={navigateToHome}
        />
      );
    }

    if (currentPath.startsWith('admin/')) {
      const secretCodeFromUrl = currentPath.split('/')[1] || '2787';
      if (/^\d{4}$/.test(secretCodeFromUrl)) {
        return isAdminLoggedIn ? (
          <AdminDashboard secretCode={secretCodeFromUrl} onBackToMainSite={navigateToHome} />
        ) : (
          <AdminAuthFlow
            mode="login_by_code"
            secretCodeFromUrl={secretCodeFromUrl}
            onSuccess={() => setIsAdminLoggedIn(true)}
            onNavigateToSecretCode={(code) => {
              window.history.pushState({}, '', `/admin/${code}`);
              setCurrentPage(`admin/${code}` as any);
            }}
            onBackToMainSite={navigateToHome}
          />
        );
      }
    }

    switch (currentPage) {
      case 'portal-sec-9f8a3d7b2c':
        return isAdminLoggedIn ? (
          <AdminDashboard secretCode="2787" onBackToMainSite={navigateToHome} />
        ) : (
          <AdminAuthFlow
            mode="login_by_code"
            secretCodeFromUrl="2787"
            onSuccess={() => {
              setIsAdminLoggedIn(true);
              navigateToPage('portal-sec-9f8a3d7b2c' as PageType);
            }}
            onNavigateToSecretCode={(code) => {
              window.history.pushState({}, '', `/admin/${code}`);
              setCurrentPage(`admin/${code}` as any);
            }}
            onBackToMainSite={navigateToHome}
          />
        );

      // Plain /admin without 4-digit secret code returns 404
      case 'admin':
      case 'admin-login':
      case 'admin-panel':
      case 'super-admin':
        return (
          <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col items-center justify-center p-6 text-center font-sans">
            <div className="text-7xl font-black text-[#7C3AED] mb-2 font-mono">404</div>
            <h1 className="text-2xl font-black mb-2 text-slate-900">Access Denied / Not Found</h1>
            <p className="text-xs text-slate-500 max-w-sm mb-6 font-semibold">
              Administrative access requires a valid 4-digit secret code URL (e.g. /admin/2787).
            </p>
            <button
              onClick={navigateToHome}
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black text-xs px-6 py-3 rounded-full cursor-pointer outline-none shadow-md"
            >
              Back to Homepage
            </button>
          </div>
        );

      case 'agent-dashboard':
        return (
          <AgentDashboard
            onLogout={() => {
              window.history.pushState({}, '', '/dashboard');
              setCurrentPage('dashboard');
            }}
          />
        );

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
      case 'weekly-savings':
      case 'monthly-savings':
      case 'savings':
        return (
          <>
            <Header onNavigate={navigateToPage} />
            <PublicSavingsLandingPage onNavigate={navigateToPage} />
          </>
        );
      case 'digital-gold':
        return <DigitalGold onBack={navigateToHome} />;
      case 'digital-silver':
        return <DigitalSilver onBack={navigateToHome} />;
      case 'instant-loan':
        return <ComingSoonPage title="Instant Loan" onBack={navigateToHome} />;
      case 'round-off':
        return <ComingSoonPage title="Round Off Savings" onBack={navigateToHome} />;
      

      case 'step-up-sip-calculator':
        return <ComingSoonPage title="Step Up SIP Calculator" onBack={navigateToHome} />;
      case 'growth-calculator':
        return <ComingSoonPage title="Growth Calculator" onBack={navigateToHome} />;
      case 'retirement-calculator':
        return <ComingSoonPage title="Retirement Calculator" onBack={navigateToHome} />;
      case 'cpc-8th-calculator':
        return <ComingSoonPage title="8th CPC Salary Calculator" onBack={navigateToHome} />;
      case 'cpc-7th-calculator':
        return <ComingSoonPage title="7th CPC Salary Calculator" onBack={navigateToHome} />;
      case 'gold-rate-calculator':
      case 'live-metal-tracker':
        return (
          <LiveMetalTracker
            onBack={navigateToHome}
            onNavigateToHome={navigateToHome}
            onNavigateToBuyGold={() => navigateToPage('buy-gold')}
            onNavigateToBuySilver={() => navigateToPage('digital-silver')}
          />
        );
        
      // Help pages
      case 'jar-how-tos':
      case 'guide':
        return <ComingSoonPage title="Guides & How-Tos" onBack={navigateToHome} />;
        
      // Other pages
      case 'blog':
        return <ComingSoonPage title="Blog" onBack={navigateToHome} />;
      case 'press':
        return <ComingSoonPage title="Press & Media" onBack={navigateToHome} />;
      case 'investors':
        return <ComingSoonPage title="Investor Relations" onBack={navigateToHome} />;
      case 'risk':
        return <RiskDisclosure onBack={navigateToHome} />;
      case 'grievance':
        return <GrievancePolicy onBack={navigateToHome} />;
      case 'investor-charter':
        return <ComingSoonPage title="Investor Charter" onBack={navigateToHome} />;
      default:
        return (
          <>
            {/* Header */}
            <Header onNavigate={navigateToPage} />

            {/* Main Content */}
            <main className="bg-white">
              {/* Hero Section */}
              <HeroSection onNavigate={navigateToPage} />

              {/* Mini Live Metal Rates & Calculator */}
              <MiniMetalTracker onNavigate={navigateToPage} />

              {/* Bank-Grade Security & Independent Custody Banner (Captured Top Section) */}
              <BankGradeSecurityBanner />

              {/* Gold Savings Section (Daily, Weekly & Monthly) */}
              <HomeSavingsSection onNavigate={navigateToPage} />

              {/* Bill Showcase Section (Recharge & Pay Bills) */}
              <BillShowcaseSection onNavigate={navigateToPage} />

              {/* Referral Program Section */}
              <ReferralProgramSection onNavigate={navigateToPage} />

              {/* Platform Trust & Partnerships Section (Remaining Features & Choices) */}
              <PlatformTrustSection />

              {/* FAQs Section */}
              <HomeFAQs />

              {/* Mandatory Disclosures */}
              <MandatoryDisclosures />

              {/* Safety Priority Card */}
              <SafetyPriorityCard />
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
          </>
        );
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-[#f0f4f9] smooth-scroll"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="popLayout">
        {!isTransitioning && (
          <PageTransition key={currentPage}>
            <div className="flex flex-col min-h-screen">
              {/* Main Content */}
              <div className="flex-1">
                {renderMainContent()}
              </div>

              {/* Footer — hidden on auth, user dashboard, agent dashboard and all admin pages */}
              {(() => {
                const currentPath = typeof window !== 'undefined' ? window.location.pathname.slice(1) : String(currentPage);
                const isDashboard = currentPath === 'dashboard' || currentPath.startsWith('dashboard') || currentPage === 'dashboard';
                const isAgentDashboard = currentPath.startsWith('agent') || currentPage.startsWith('agent');
                const isAuthOrAdmin = ['login','signup','recharge-details'].includes(currentPage) || 
                                     ['login','signup','recharge-details'].includes(currentPath) ||
                                     currentPage.startsWith('admin') || currentPath.startsWith('admin') ||
                                     currentPage.startsWith('portal-sec') || currentPath.startsWith('portal-sec');
                
                if (isDashboard || isAgentDashboard || isAuthOrAdmin) {
                  return null;
                }
                return <Footer onNavigate={navigateToPage} />;
              })()}
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
            <LoadingSpinner size={100} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Revoked Session Alert Modal */}
      <AnimatePresence>
        {showRevokedModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 shadow-2xl border border-red-100"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-inner">
                🔒
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">Session Terminated</h3>
                <p className="text-sm font-semibold text-gray-600 mt-2 leading-relaxed">
                  {revokedMessage || "Your session is logged out. Kindly login back..!"}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowRevokedModal(false);
                  clearUserSession();
                  window.history.replaceState({}, '', '/login');
                  setCurrentPage('login');
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-sm shadow-md cursor-pointer transition-all border-none outline-none"
              >
                Kindly Login Back →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}