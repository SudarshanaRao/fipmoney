"use client";

import { useEffect, useState, useRef } from "react";
import { 
  ChevronRight, Smartphone, Car, Tv, MonitorPlay, Flame, 
  Droplets, Zap, FileText, Wifi, GraduationCap, Home, Gift, Play,
  Search, Shield, ChevronLeft, CheckCircle2, Info
} from "lucide-react";
import { Sidebar, MobileNav } from "./Navigation";
// @ts-ignore
import confetti from "canvas-confetti";

const bbpsServices = [
  { label: "Mobile Prepaid", Icon: Smartphone, color: "#d89221", bg: "#fdf8f0" },
  { label: "Electricity", Icon: Zap, color: "#eab308", bg: "#fef08a" },
  { label: "DTH", Icon: Tv, color: "#f59e0b", bg: "#fef3c7" },
  { label: "Tuition Fees", Icon: GraduationCap, color: "#6366f1", bg: "#e0e7ff" },
  { label: "Education Fees", Icon: GraduationCap, color: "#6366f1", bg: "#e0e7ff" },
  { label: "Rent", Icon: Home, color: "#14b8a6", bg: "#ccfbf1" },
  { label: "Mobile Postpaid", Icon: FileText, color: "#d89221", bg: "#fdf8f0" },
  { label: "Gas", Icon: Flame, color: "#f97316", bg: "#ffedd5" },
  { label: "LPG Gas", Icon: Flame, color: "#ef4444", bg: "#fee2e2" },
  { label: "Landline Postpaid", Icon: Wifi, color: "#ec4899", bg: "#fce7f3" },
  { label: "Broadband", Icon: Wifi, color: "#06b6d4", bg: "#cffafe" },
  { label: "Cable TV", Icon: MonitorPlay, color: "#8b5cf6", bg: "#f3e8ff" },
  { label: "FASTag", Icon: Car, color: "#10b981", bg: "#d1fae5" },
  { label: "Health Insurance", Icon: Shield, color: "#f43f5e", bg: "#ffe4e6" },
];

interface Operator {
  operatorId: string;
  operatorName: string;
  operatorCode: string;
  category: string;
  supports: string[];
  circleRequired: boolean;
  status: string;
}

const trackingSteps = [
  { 
    title: "Recharge Initiated", 
    desc: "Recharge request received and registered on Fipmoney.",
    icon: Smartphone
  },
  { 
    title: "Payment Processing", 
    desc: "Securely routing to payment gateway for clearance.",
    icon: Zap
  },
  { 
    title: "Payment Successful", 
    desc: "Transaction authorized. Fund transferred successfully.",
    icon: Shield
  },
  { 
    title: "Order Processing", 
    desc: "Operator verifying details and provision of services.",
    icon: FileText
  },
  { 
    title: "Order Placed", 
    desc: "Recharge complete! Talktime/Data benefits updated on your mobile.",
    icon: CheckCircle2
  }
];

export default function RechargeDetails({ onBack }: { onBack: () => void }) {
  const [billLabel, setBillLabel] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Form Fields & API States
  const [operator, setOperator] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loadingOperators, setLoadingOperators] = useState<boolean>(false);
  const [rawPlansData, setRawPlansData] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Credit Card to Bank Transfer States
  const [recipientName, setRecipientName] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [recipientIfsc, setRecipientIfsc] = useState("");
  const [ccNumber, setCcNumber] = useState("");
  const [ccExpiry, setCcExpiry] = useState("");
  const [ccCvv, setCcCvv] = useState("");

  // Search & Filter States
  const [activePlanTab, setActivePlanTab] = useState<string>("All");
  const [searchPlanQuery, setSearchPlanQuery] = useState<string>("");

  // Order Tracking States
  const [showTracking, setShowTracking] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [stepTimes, setStepTimes] = useState<string[]>([]);
  const [stepDates, setStepDates] = useState<string[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedBillLabel");
    if (stored) {
      setBillLabel(stored);
    } else {
      setBillLabel("Mobile Prepaid"); 
    }
  }, []);

  const isMobile = billLabel ? billLabel.includes("Mobile") : false;
  const isPostpaid = billLabel ? billLabel.toLowerCase().includes("postpaid") : false;
  const isCcToBank = billLabel ? ["Tuition Fees", "Education Fees", "Rent", "House Rent"].includes(billLabel) : false;
  const selectedProvider = operators.find(op => op.operatorCode === operator);
  const serviceParamLabel = selectedProvider?.customerParams?.[0]?.name || "Service Number";

  // Fetch operators/providers list when category is Mobile or Electricity
  useEffect(() => {
    const hasProviders = isMobile || billLabel === "Electricity";
    if (hasProviders) {
      setLoadingOperators(true);
      setOperators([]);
      setRawPlansData(null);
      setPlans([]);
      setOperator("");
      setMobileNumber("");
      setAmount("");
      setError(null);

      const url = billLabel === "Electricity"
        ? "https://api.mockfly.dev/mocks/f8eb65bd-22cf-4f70-9842-44afcbc6922b/electricity/providers"
        : "https://api.mockfly.dev/mocks/f8eb65bd-22cf-4f70-9842-44afcbc6922b/mobile-recharge/operator";

      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch providers");
          return res.json();
        })
        .then((data) => {
          if ((data.success || data.status) && data.data) {
            const list = data.data.map((item: any) => ({
              operatorId: item.id || item.operatorId,
              operatorCode: item.providerCode || item.operatorCode,
              operatorName: item.providerName || item.operatorName,
              customerParams: item.customerParams
            }));
            setOperators(list);
            if (list.length > 0) {
              setOperator(list[0].operatorCode);
            }
          } else {
            setError("Failed to fetch provider list.");
          }
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to connect to the payment service.");
        })
        .finally(() => {
          setLoadingOperators(false);
        });
    } else {
      // Reset states for other bill types
      setOperator("");
      setMobileNumber("");
      setAmount("");
      setAccountNumber("");
      setRawPlansData(null);
      setPlans([]);
      setError(null);
    }
  }, [billLabel, isMobile]);

  // Dynamically compute and switch plans list between prepaid and postpaid when billLabel or rawPlansData changes
  useEffect(() => {
    if (rawPlansData) {
      let plansList: any[] = [];
      if (rawPlansData.data) {
        if (isPostpaid) {
          plansList = rawPlansData.data.postpaid || [];
        } else {
          plansList = rawPlansData.data.prepaid || [];
        }
      } else if (rawPlansData.plans) {
        // Fallback to old API structure
        plansList = rawPlansData.plans || [];
      } else if (Array.isArray(rawPlansData)) {
        plansList = rawPlansData;
      }
      setPlans(plansList);
      setActivePlanTab("All");
      setSearchPlanQuery("");
    } else {
      setPlans([]);
    }
  }, [billLabel, rawPlansData, isPostpaid]);

  // Handle Order Tracking Auto-Advancing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showTracking && currentStep < 5) {
      // Add current time when starting a step
      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 5);
      const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      setStepTimes(prev => {
        const next = [...prev];
        next[currentStep] = timeStr;
        return next;
      });
      setStepDates(prev => {
        const next = [...prev];
        next[currentStep] = dateStr;
        return next;
      });

      // delays for each step: Initiating, Payment Gateway, Gateway Response, Operator Processing, Finished
      const delays = [1500, 2000, 1500, 2000, 1000];
      
      timer = setTimeout(() => {
        if (currentStep === 4) {
          setCurrentStep(5);
          // Sparkle Confetti on complete
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#d89221", "#efb652", "#b87312", "#ffffff"]
          });
        } else {
          setCurrentStep(prev => prev + 1);
        }
      }, delays[currentStep]);
    }
    return () => clearTimeout(timer);
  }, [showTracking, currentStep]);

  const handleFetchPlans = () => {
    if (!operator) {
      alert("Please select an operator.");
      return;
    }
    setLoadingPlans(true);
    setRawPlansData(null);
    setError(null);

    fetch(`https://api.mockfly.dev/mocks/f8eb65bd-22cf-4f70-9842-44afcbc6922b/mobile-recharge/plans?operator=${operator}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch plans");
        return res.json();
      })
      .then((data) => {
        setRawPlansData(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to retrieve recharge plans. Please try again.");
      })
      .finally(() => {
        setLoadingPlans(false);
      });
  };

  const handleScroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = dir === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSelect = (label: string) => {
    setBillLabel(label);
    sessionStorage.setItem("selectedBillLabel", label);
  };

  const handleProceedRecharge = () => {
    if (isCcToBank) {
      if (!recipientName) {
        alert("Please enter recipient account name.");
        return;
      }
      if (!recipientAccount || recipientAccount.length < 8) {
        alert("Please enter a valid recipient bank account number.");
        return;
      }
      if (!recipientIfsc || recipientIfsc.length !== 11) {
        alert("Please enter a valid 11-digit bank IFSC code.");
        return;
      }
      if (!ccNumber || ccNumber.length !== 16) {
        alert("Please enter a valid 16-digit Credit Card number.");
        return;
      }
      if (!ccExpiry || !ccExpiry.includes("/")) {
        alert("Please enter a valid card expiry (MM/YY).");
        return;
      }
      if (!ccCvv || ccCvv.length !== 3) {
        alert("Please enter a valid 3-digit CVV code.");
        return;
      }
      if (!amount || parseInt(amount) <= 0) {
        alert("Please enter a valid payment amount.");
        return;
      }
    } else if (isMobile) {
      if (!operator) {
        alert("Please select an operator.");
        return;
      }
      if (!mobileNumber || mobileNumber.length !== 10) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
      }
      if (!amount || parseInt(amount) <= 0) {
        alert("Please enter a valid recharge amount.");
        return;
      }
    } else {
      if (!accountNumber) {
        alert("Please enter your account number.");
        return;
      }
      if (!amount || parseInt(amount) <= 0) {
        alert("Please enter a valid bill amount.");
        return;
      }
    }

    // Set states to trigger tracking page screen
    setShowTracking(true);
    setCurrentStep(0);
    setStepTimes([]);
    setStepDates([]);
  };

  if (!billLabel) return null;

  // Extract unique plan types for tab filtering
  const planTypes = ["All", ...Array.from(new Set(plans.map((p) => p.planType || (isPostpaid ? "Postpaid" : "Prepaid"))))];

  const filteredPlans = plans.filter((p) => {
    const pType = p.planType || (isPostpaid ? "Postpaid" : "Prepaid");
    const matchesTab = activePlanTab === "All" || pType === activePlanTab;
    
    const desc = p.description || p.planName || "";
    const matchesQuery = 
      desc.toLowerCase().includes(searchPlanQuery.toLowerCase()) ||
      p.amount.toString().includes(searchPlanQuery) ||
      pType.toLowerCase().includes(searchPlanQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  // RENDER ORDER TRACKING SCREEN IF COMMITTED
  if (showTracking) {
    return (
      <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden text-gray-800">
        <Sidebar activeTab="bills" onTabChange={(t) => { if (t==='home') onBack(); }} onLogout={onBack} />
        
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gray-50/20">
          <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6">
            
            {/* Header / Back */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  if (currentStep >= 5) {
                    setShowTracking(false);
                    onBack();
                  } else {
                    if (confirm("Cancel transaction tracking and return?")) {
                      setShowTracking(false);
                    }
                  }
                }}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm hover:bg-gray-50 cursor-pointer outline-none transition-all"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-black text-gray-900 tracking-tight">Order Tracking</h1>
                <p className="text-[10px] font-bold text-gray-400">Recharge Transaction ID: FIP{Math.floor(100000 + Math.random() * 900000)}</p>
              </div>
            </div>

            {/* Main Order Status Card */}
            <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-8">
              
              {/* Order Quick Details */}
              <div className="bg-[#fdf8f0] border border-[#fdf8f0] rounded-2xl p-5 flex flex-wrap justify-between items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold uppercase text-[#b87312] tracking-wider">Service Type</span>
                  <h3 className="text-xs font-bold text-gray-800">{billLabel}</h3>
                </div>
                {isMobile ? (
                  <>
                    <div className="space-y-1">
                      <span className="text-[9px] font-extrabold uppercase text-[#b87312] tracking-wider">Mobile Number</span>
                      <h3 className="text-xs font-bold text-gray-800">+91 {mobileNumber}</h3>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-extrabold uppercase text-[#b87312] tracking-wider">Operator</span>
                      <h3 className="text-xs font-bold text-gray-800">{operator}</h3>
                    </div>
                  </>
                ) : (
                  <div className="space-y-1">
                    <span className="text-[9px] font-extrabold uppercase text-[#b87312] tracking-wider">Account ID</span>
                    <h3 className="text-xs font-bold text-gray-800">{accountNumber}</h3>
                  </div>
                )}
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold uppercase text-[#b87312] tracking-wider">Amount Paid</span>
                  <h3 className="text-xs font-extrabold text-gray-900">₹{amount}</h3>
                </div>
              </div>

              {/* Steps timeline */}
              <div className="relative pl-2 md:pl-6 space-y-8">
                
                {/* Vertical line joining steps */}
                <div className="absolute left-[39px] md:left-[55px] top-6 bottom-6 w-0.5 bg-gray-100 z-0">
                  {/* Active highlight line */}
                  <div 
                    className="w-full bg-gradient-to-b from-[#b87312] to-[#efb652] transition-all duration-500"
                    style={{ height: `${Math.min(100, Math.max(0, ((currentStep) / 4) * 100))}%` }}
                  />
                </div>

                {trackingSteps.map((step, idx) => {
                  const isCompleted = idx < currentStep;
                  const isActive = idx === currentStep;
                  const isPending = idx > currentStep;
                  const StepIcon = step.icon;

                  return (
                    <div key={idx} className="relative z-10 flex gap-4 md:gap-6 items-start">
                      
                      {/* Left: Time Stamp */}
                      <div className="w-16 md:w-20 text-right shrink-0 mt-1 space-y-0.5">
                        {stepTimes[idx] ? (
                          <>
                            <p className="text-xs font-black text-gray-800 font-mono">{stepTimes[idx]}</p>
                            <p className="text-[9px] font-bold text-gray-400">{stepDates[idx]}</p>
                          </>
                        ) : (
                          <p className="text-xs font-bold text-gray-300 font-mono">--:--</p>
                        )}
                      </div>

                      {/* Center: Circle Icon */}
                      <div className="relative shrink-0">
                        {isCompleted ? (
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100"
                            style={{ background: `linear-gradient(135deg, #b87312, #efb652)` }}>
                            <StepIcon size={18} strokeWidth={2.5} />
                          </div>
                        ) : isActive ? (
                          <div className="relative">
                            {/* Pulse waves */}
                            <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
                            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-white border-2 border-amber-500 text-[#b87312] shadow-md">
                              <StepIcon size={18} strokeWidth={2.5} className="animate-pulse" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-white border border-gray-150 text-gray-300 shadow-inner">
                            <StepIcon size={16} strokeWidth={2} />
                          </div>
                        )}
                      </div>

                      {/* Right: Info */}
                      <div className="space-y-1 flex-1 mt-1.5 md:mt-2">
                        <h4 className={`text-xs md:text-sm font-extrabold tracking-tight transition-colors duration-300
                          ${isActive ? "text-amber-600 font-black" : isPending ? "text-gray-400" : "text-gray-800"}`}>
                          {step.title}
                        </h4>
                        <p className={`text-[10px] md:text-xs font-medium leading-relaxed transition-colors duration-300
                          ${isPending ? "text-gray-300" : "text-gray-550"}`}>
                          {step.desc}
                        </p>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Bottom Action */}
              <div className="pt-4 border-t border-gray-100 flex flex-col items-center gap-4">
                {currentStep >= 5 ? (
                  <>
                    <button 
                      onClick={() => {
                        setShowTracking(false);
                        onBack();
                      }}
                      className="px-8 py-4 rounded-xl text-white text-sm font-extrabold shadow-[0_4px_14px_rgba(184,115,18,0.3)] hover:shadow-[0_6px_20px_rgba(184,115,18,0.4)] hover:-translate-y-0.5 transition-all outline-none border-none cursor-pointer flex items-center justify-center gap-2"
                      style={{ background: "linear-gradient(135deg, #b87312, #efb652)", width: "240px" }}
                    >
                      Back to Dashboard <ChevronRight size={18} strokeWidth={2.5} />
                    </button>
                    <p className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                      🎉 Recharge completed successfully! Confetti sent.
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-500 border-t-transparent" />
                      Processing recharge step {currentStep + 1} of 5...
                    </div>
                    <p className="text-[10px] font-semibold text-gray-400">Do not close this page or hit back button</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden text-gray-800">
      <Sidebar activeTab="bills" onTabChange={(t) => { if (t==='home') onBack(); }} onLogout={onBack} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6">
          
          {/* Top Horizontal BBPS Slider */}
          <div className="bg-white rounded-3xl p-4 md:p-6 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex items-center relative">
            <button onClick={() => handleScroll('left')} className="hidden md:flex w-10 h-10 rounded-full bg-gray-50 items-center justify-center border border-gray-100 hover:bg-gray-100 absolute left-4 z-10 cursor-pointer outline-none transition-colors">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            
            <div ref={scrollRef} className="flex-1 overflow-x-auto hide-scrollbar flex gap-3 md:gap-6 px-2 md:px-14">
              {bbpsServices.map((item, i) => {
                const active = item.label === billLabel;
                return (
                  <div key={i} onClick={() => handleSelect(item.label)} 
                    className={`flex flex-col items-center cursor-pointer min-w-[100px] shrink-0 p-3 rounded-2xl transition-all
                      ${active ? 'bg-gray-50 border border-gray-200' : 'hover:bg-gray-50 border border-transparent'}`}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-sm bg-white" style={{ color: item.color }}>
                       <item.Icon size={22} strokeWidth={2.5} />
                    </div>
                    <span className={`text-[11px] text-center leading-tight transition-colors
                      ${active ? 'font-extrabold text-gray-900' : 'font-bold text-gray-500'}`}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <button onClick={() => handleScroll('right')} className="hidden md:flex w-10 h-10 rounded-full bg-gray-50 items-center justify-center border border-gray-100 hover:bg-gray-100 absolute right-4 z-10 cursor-pointer outline-none transition-colors">
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>

          {/* 2-Column Details Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
            
            {/* LEFT COLUMN: Input Form */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                <h2 className="text-lg font-extrabold text-amber-600 mb-1">Recharge {billLabel.split(' ')[0]}</h2>
                <p className="text-xs font-bold text-gray-400 mb-8">Enter your details to proceed with your payment</p>

                <div className="space-y-6">
                  {isMobile ? (
                    // MOBILE INPUTS
                    <>
                      {/* Operator Dropdown */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Operator Name</label>
                        {loadingOperators ? (
                          <div className="w-full px-5 py-4 rounded-xl text-sm font-semibold text-gray-500 bg-gray-50 border border-gray-100 flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-500 border-t-transparent" />
                            Loading operators...
                          </div>
                        ) : (
                          <div className="relative">
                            <select 
                              value={operator} 
                              onChange={(e) => setOperator(e.target.value)}
                              className="w-full px-5 py-4 rounded-xl text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-50 transition-all cursor-pointer appearance-none"
                            >
                              <option value="" disabled>Select Operator</option>
                              {operators.map((op) => (
                                <option key={op.operatorId} value={op.operatorCode}>
                                  {op.operatorName}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                              <ChevronRight size={16} className="rotate-90" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Mobile Number */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Mobile Number</label>
                        <input 
                          type="tel" 
                          placeholder="Enter 10-digit number" 
                          maxLength={10}
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                          className="w-full px-5 py-4 rounded-xl text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-50 transition-all" 
                        />
                      </div>

                      {/* Recharge Amount with Fetch Plans beside it */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Recharge Amount</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-extrabold text-gray-400">₹</span>
                            <input 
                              type="text" 
                              placeholder="Amount" 
                              value={amount}
                              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                              className="w-full pl-9 pr-5 py-4 rounded-xl text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-50 transition-all" 
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={handleFetchPlans}
                            disabled={loadingPlans || !operator}
                            className="px-5 rounded-xl text-white text-xs font-black bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(37,99,235,0.2)] transition-all outline-none border-none cursor-pointer flex items-center gap-1.5 shrink-0"
                          >
                            {loadingPlans ? (
                              <>
                                <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                                Fetching...
                              </>
                            ) : (
                              "Fetch Plans"
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : isCcToBank ? (
                    // CREDIT CARD TO BANK TRANSFER FOR RENT/EDUCATION/TUITION
                    <>
                      <div className="space-y-4">
                        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 text-xs font-semibold text-blue-800 flex items-start gap-2.5">
                          <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-extrabold text-blue-900">Credit Card to Bank Transfer</p>
                            <p className="text-[11px] text-blue-700 mt-0.5 leading-relaxed">Direct transfer to any bank account from your credit card. Charges: 1.8% convenience fee + 18% GST on fee.</p>
                          </div>
                        </div>

                        {/* Recipient Details */}
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Recipient Account Name</label>
                          <input 
                            type="text" 
                            placeholder="Enter Account Holder Name" 
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            className="w-full px-5 py-3.5 rounded-xl text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 outline-none focus:border-amber-500 focus:bg-white transition-all" 
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Account Number</label>
                            <input 
                              type="text" 
                              placeholder="Bank Account No." 
                              value={recipientAccount}
                              onChange={(e) => setRecipientAccount(e.target.value.replace(/\D/g,""))}
                              className="w-full px-5 py-3.5 rounded-xl text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 outline-none focus:border-amber-500 focus:bg-white transition-all" 
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Bank IFSC Code</label>
                            <input 
                              type="text" 
                              placeholder="IFSC Code" 
                              maxLength={11}
                              value={recipientIfsc}
                              onChange={(e) => setRecipientIfsc(e.target.value.toUpperCase())}
                              className="w-full px-5 py-3.5 rounded-xl text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 outline-none focus:border-amber-500 focus:bg-white transition-all" 
                            />
                          </div>
                        </div>

                        {/* CC Details */}
                        <div className="border-t border-slate-100 pt-4 space-y-4">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Credit Card Number</label>
                            <input 
                              type="text" 
                              maxLength={16}
                              placeholder="Enter 16-digit Card Number" 
                              value={ccNumber}
                              onChange={(e) => setCcNumber(e.target.value.replace(/\D/g,""))}
                              className="w-full px-5 py-3.5 rounded-xl text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 outline-none focus:border-amber-500 focus:bg-white transition-all" 
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Expiry (MM/YY)</label>
                              <input 
                                type="text" 
                                maxLength={5}
                                placeholder="MM/YY" 
                                value={ccExpiry}
                                onChange={(e) => setCcExpiry(e.target.value)}
                                className="w-full px-5 py-3.5 rounded-xl text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 outline-none focus:border-amber-500 focus:bg-white transition-all" 
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">CVV</label>
                              <input 
                                type="password" 
                                maxLength={3}
                                placeholder="***" 
                                value={ccCvv}
                                onChange={(e) => setCcCvv(e.target.value.replace(/\D/g,""))}
                                className="w-full px-5 py-3.5 rounded-xl text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 outline-none focus:border-amber-500 focus:bg-white transition-all" 
                              />
                            </div>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="border-t border-slate-100 pt-4">
                          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Transfer Amount</label>
                          <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-extrabold text-gray-400">₹</span>
                            <input 
                              type="text" 
                              placeholder="Enter Amount" 
                              value={amount}
                              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                              className="w-full pl-9 pr-5 py-3.5 rounded-xl text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 outline-none focus:border-amber-500 focus:bg-white transition-all" 
                            />
                          </div>
                        </div>

                        {/* Calculations Panel */}
                        {amount && Number(amount) > 0 && (
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs font-semibold space-y-2.5 text-slate-600 shadow-inner">
                            <div className="flex justify-between">
                              <span>Transfer Amount:</span>
                              <span className="text-slate-800">₹{Number(amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Convenience Charge (1.8%):</span>
                              <span className="text-slate-800">₹{(Number(amount) * 0.018).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>GST (18% on convenience fee):</span>
                              <span className="text-slate-800">₹{(Number(amount) * 0.018 * 0.18).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-200/60 pt-2 font-bold text-slate-900">
                              <span>Total Card Chargeable:</span>
                              <span className="text-amber-600 font-extrabold">₹{(Number(amount) + (Number(amount) * 0.018) + (Number(amount) * 0.018 * 0.18)).toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    // GENERAL BBPS BILLS
                    <>
                      {billLabel === "Electricity" && (
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Electricity Provider</label>
                          {loadingOperators ? (
                            <div className="w-full px-5 py-4 rounded-xl text-sm font-semibold text-gray-500 bg-gray-50 border border-gray-100 flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-500 border-t-transparent" />
                              Loading providers...
                            </div>
                          ) : (
                            <div className="relative">
                              <select 
                                value={operator} 
                                onChange={(e) => setOperator(e.target.value)}
                                className="w-full px-5 py-4 rounded-xl text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-50 transition-all cursor-pointer appearance-none"
                              >
                                <option value="" disabled>Select Provider</option>
                                {operators.map((op) => (
                                  <option key={op.operatorCode} value={op.operatorCode}>
                                    {op.operatorName}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <ChevronRight size={16} className="rotate-90" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                          {billLabel === "Electricity" ? serviceParamLabel : "Account Number"}
                        </label>
                        <input 
                          type="text" 
                          placeholder={billLabel === "Electricity" ? `Enter ${serviceParamLabel}` : `Enter ${billLabel} Account ID`} 
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          className="w-full px-5 py-4 rounded-xl text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-50 transition-all" 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Bill Amount</label>
                        <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-extrabold text-gray-400">₹</span>
                          <input 
                            type="text" 
                            placeholder="Enter Amount" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                            className="w-full pl-9 pr-5 py-4 rounded-xl text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-50 transition-all" 
                          />
                        </div>
                      </div>
                    </>
                  )}
                  
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[11px] font-bold text-red-500 text-center leading-relaxed">
                      {error}
                    </div>
                  )}

                  <button 
                    onClick={handleProceedRecharge}
                    className="w-full py-4 rounded-xl text-white text-sm font-extrabold shadow-[0_4px_14px_rgba(184,115,18,0.25)] hover:shadow-[0_6px_20px_rgba(184,115,18,0.35)] hover:-translate-y-0.5 transition-all outline-none border-none cursor-pointer flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #b87312, #efb652)" }}
                  >
                    Proceed to pay <ChevronRight size={18} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="mt-8 flex items-center gap-2 text-gray-500 text-xs font-semibold justify-center">
                   <Shield size={16} className="text-amber-500" strokeWidth={2.5} /> 100% Secure & Instant Recharge
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Browse Plans / Disclaimer */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                      <Search size={14} className="text-amber-500" strokeWidth={3} />
                    </div>
                    <h2 className="text-lg font-extrabold text-gray-900">Browse Plans</h2>
                  </div>
                  {isMobile && plans.length > 0 && (
                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                      {filteredPlans.length} Plans Available
                    </span>
                  )}
                </div>

                {isMobile ? (
                  <>
                    {plans.length === 0 ? (
                      <div className="flex-1 bg-[#f8fafc] rounded-2xl flex flex-col items-center justify-center p-8 text-center min-h-[250px] border border-gray-50">
                        <Smartphone size={40} className="text-gray-300 mb-4 animate-bounce" />
                        <p className="text-sm font-bold text-gray-700 mb-1">No plans loaded</p>
                        <p className="text-xs font-semibold text-gray-500 max-w-sm">
                          Select your operator, enter your mobile number, and click "Fetch Plans" to browse available options.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6 flex-1 flex flex-col min-h-0">
                        {/* Search and Tabs */}
                        <div className="space-y-4">
                          <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                              type="text" 
                              placeholder="Search by amount, validity, billing cycle, or keywords..." 
                              value={searchPlanQuery}
                              onChange={(e) => setSearchPlanQuery(e.target.value)}
                              className="w-full pl-11 pr-5 py-3.5 rounded-xl text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-100 outline-none focus:border-amber-500 focus:bg-white transition-all" 
                            />
                          </div>

                          {/* Plan Type Tabs */}
                          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                            {planTypes.map((type) => (
                              <button 
                                key={type}
                                onClick={() => setActivePlanTab(type)}
                                className={`px-4 py-2 rounded-lg text-xs font-extrabold border cursor-pointer transition-all whitespace-nowrap outline-none
                                  ${activePlanTab === type 
                                    ? "bg-amber-500 text-white border-amber-500 shadow-sm" 
                                    : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50"
                                  }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Plans List Scroll Container */}
                        <div className="flex-1 overflow-y-auto max-h-[460px] pr-2 space-y-4 rounded-xl custom-scrollbar">
                          {filteredPlans.length === 0 ? (
                            <div className="text-center py-10">
                              <p className="text-sm font-bold text-gray-400">No matching plans found</p>
                            </div>
                          ) : (
                            filteredPlans.map((plan) => {
                              const planTypeStr = plan.planType || (isPostpaid ? "Postpaid" : "Prepaid");
                              const isSelected = amount === plan.amount.toString();
                              
                              return (
                                <div 
                                  key={plan.planId} 
                                  onClick={() => setAmount(plan.amount.toString())}
                                  className={`p-4 md:p-5 rounded-2xl border bg-white hover:border-amber-400 hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group relative overflow-hidden
                                    ${isSelected ? "border-amber-500 ring-2 ring-amber-50" : "border-gray-100"}`}
                                >
                                  <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                      <span className="text-lg font-black text-gray-900">₹{plan.amount}</span>
                                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700">
                                        {planTypeStr}
                                      </span>
                                      {(plan.validity || plan.billingCycle) && (
                                        <span className="text-xs font-bold text-gray-400">
                                          {plan.billingCycle ? `Billing: ${plan.billingCycle}` : `Validity: ${plan.validity}`}
                                        </span>
                                      )}
                                    </div>
                                    
                                    <h4 className="text-xs font-bold text-gray-800">
                                      {plan.planName || (isPostpaid ? `${operator} Postpaid Package` : `${operator} Prepaid Package`)}
                                    </h4>

                                    {plan.description && (
                                      <p className="text-xs font-semibold text-gray-500 leading-relaxed">{plan.description}</p>
                                    )}
                                    
                                    {/* Sub-features */}
                                    <div className="flex gap-4 text-[10px] font-extrabold text-gray-400 flex-wrap">
                                      {plan.data && plan.data !== "NA" && (
                                        <span>DATA: <span className="text-gray-700">{plan.data}</span></span>
                                      )}
                                      {plan.calls && plan.calls !== "NA" && (
                                        <span>CALLS: <span className="text-gray-700">{plan.calls}</span></span>
                                      )}
                                      {plan.sms && plan.sms !== "NA" && (
                                        <span>SMS: <span className="text-gray-700">{plan.sms}</span></span>
                                      )}
                                    </div>

                                    {/* Benefits Badge Badges */}
                                    {plan.benefits && plan.benefits.length > 0 && (
                                      <div className="flex gap-1.5 flex-wrap mt-2 pt-1">
                                        {plan.benefits.map((b: string, idx: number) => (
                                          <span key={idx} className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1">
                                            ✨ {b}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  <button 
                                    type="button"
                                    className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all outline-none border cursor-pointer whitespace-nowrap self-start md:self-auto
                                      ${isSelected 
                                        ? "bg-amber-500 text-white border-amber-500 shadow-sm" 
                                        : "bg-white text-gray-700 border-gray-200 group-hover:bg-amber-50 group-hover:text-amber-700 group-hover:border-amber-300"
                                      }`}
                                  >
                                    {isSelected ? "Selected" : "Select Plan"}
                                  </button>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : isCcToBank ? (
                  <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-100 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                        <Shield className="text-amber-500" size={18} /> Transfer Guidelines & Benefits
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-sm">✓</div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-800">Optimize Cash Liquidity</h4>
                            <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">Use your credit card limits to handle essential costs like Rent, School Fees, or Tuition Fees instantly, and pay back in 45-50 days.</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-sm">✓</div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-800">Earn Credit Card Rewards</h4>
                            <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">Transactions count towards credit cards spends limits, helping you meet annual fee waivers and unlock standard credit reward points.</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-sm">✓</div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-800">Direct Recipient Settlements</h4>
                            <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">Funds are settled directly in the recipient's bank account via IMPS/NEFT within minutes of transaction clearance.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/60 text-[10px] text-slate-500 font-semibold leading-relaxed mt-6">
                      <strong>Note on Settlement:</strong> Settlements are instant by default but can occasionally take up to 2 hours depending on recipient bank's network availability. BBPS secure guarantees credit protection.
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 bg-[#f8fafc] rounded-2xl flex items-center justify-center p-8 text-center min-h-[200px] border border-gray-50">
                    <p className="text-sm font-semibold text-gray-500">
                      Enter your {billLabel} details and amount, then tap "Proceed to pay" to complete secure transaction.
                    </p>
                  </div>
                )}

                <div className="mt-6 bg-[#f0f9ff] rounded-2xl p-5 border border-blue-50">
                  <h4 className="text-xs font-extrabold text-green-600 mb-1">Disclaimer:</h4>
                  <p className="text-[11px] font-semibold text-gray-500 leading-relaxed">
                    While we support most recharges, please verify with your operator before proceeding. Fipmoney ensures secure transactions through BBPS.
                  </p>
                </div>
              </div>

              <div className="text-center pb-4">
                 <p className="text-xs font-bold text-gray-500">Trusted by <span className="font-extrabold text-gray-800">UIDAI BBPS Network</span></p>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <MobileNav activeTab="bills" onTabChange={(t) => { if (t==='home') onBack(); }} />
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}} />
    </div>
  );
}
