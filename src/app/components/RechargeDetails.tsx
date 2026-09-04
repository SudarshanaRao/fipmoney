"use client";

import { useEffect, useState, useRef } from "react";
import {
  ChevronRight, Smartphone, Car, Tv, MonitorPlay, Flame,
  Droplets, Zap, FileText, Wifi, GraduationCap, Home, Gift, Play,
  Search, Shield, ChevronLeft, CheckCircle2, Info, CreditCard,
  Building2, QrCode, Phone, Clock, Bolt, CalendarDays, ArrowRight
} from "lucide-react";
import { Sidebar, MobileNav } from "./Navigation";
import { useFipModal } from "./FipModal";
// @ts-ignore
import confetti from "canvas-confetti";
import { addTransaction } from "../utils/transactionStorage";
import { SuccessTick, LoadingSpinner } from "./LottiePlayer";

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
  const { showAlert, showConfirm, ModalComponent } = useFipModal();
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
  const [transferMethod, setTransferMethod] = useState<"bank" | "upi" | "mobile">("bank");
  const [upiId, setUpiId] = useState("");
  const [recipientMobile, setRecipientMobile] = useState("");
  const [transferSpeed, setTransferSpeed] = useState<"instant" | "tomorrow" | "2day">("instant");

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

  const handleNavTabChange = (t: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem("fm_dashboard_tab", t);
    }
    onBack();
  };

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

          // Log bill payment to localStorage history
          const sourceName = isCcToBank 
            ? `${billLabel} (${recipientName || "Self"})` 
            : (selectedProvider?.operatorName || billLabel || "Utility Bill Pay");

          addTransaction({
            type: "Bill Pay",
            category: billLabel || "Bills",
            amount: Number(amount) || 0,
            status: "Completed",
            paymentMethod: isCcToBank ? "Credit Card" : "UPI",
            source: sourceName
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
      showAlert("Please select an operator.", "warning");
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
      // Validate recipient fields based on selected transfer method
      if (transferMethod === "bank") {
        if (!recipientName) {
          showAlert("Please enter the account holder name.", "warning");
          return;
        }
        if (!recipientAccount || recipientAccount.length < 8) {
          showAlert("Please enter a valid recipient bank account number.", "warning");
          return;
        }
        if (!recipientIfsc || recipientIfsc.length !== 11) {
          showAlert("Please enter a valid 11-digit bank IFSC code.", "warning");
          return;
        }
      } else if (transferMethod === "upi") {
        if (!upiId || !upiId.includes("@")) {
          showAlert("Please enter a valid UPI ID (e.g. name@upi).", "warning");
          return;
        }
      } else if (transferMethod === "mobile") {
        if (!recipientMobile || recipientMobile.length !== 10) {
          showAlert("Please enter a valid 10-digit mobile number.", "warning");
          return;
        }
      }
      // Validate credit card details
      if (!ccNumber || ccNumber.length !== 16) {
        showAlert("Please enter a valid 16-digit Credit Card number.", "warning");
        return;
      }
      if (!ccExpiry || !ccExpiry.includes("/")) {
        showAlert("Please enter a valid card expiry (MM/YY).", "warning");
        return;
      }
      if (!ccCvv || ccCvv.length !== 3) {
        showAlert("Please enter a valid 3-digit CVV code.", "warning");
        return;
      }
      if (!amount || parseInt(amount) <= 0) {
        showAlert("Please enter a valid payment amount.", "warning");
        return;
      }
    } else if (isMobile) {
      if (!operator) {
        showAlert("Please select an operator.", "warning");
        return;
      }
      if (!mobileNumber || mobileNumber.length !== 10) {
        showAlert("Please enter a valid 10-digit mobile number.", "warning");
        return;
      }
      if (!amount || parseInt(amount) <= 0) {
        showAlert("Please enter a valid recharge amount.", "warning");
        return;
      }
    } else {
      if (!accountNumber) {
        showAlert("Please enter your account number.", "warning");
        return;
      }
      if (!amount || parseInt(amount) <= 0) {
        showAlert("Please enter a valid bill amount.", "warning");
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

  // RENDER RECHARGE SUCCESSFUL CONFIRMATION SCREEN
  if (showTracking) {
    const isCompleted = currentStep >= 5;
    return (
      <>
        <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden text-gray-800">
          <Sidebar activeTab="bills" onTabChange={handleNavTabChange} onLogout={onBack} />

          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto items-center justify-center p-6 bg-gradient-to-br from-gray-50 via-purple-50/20 to-amber-50/20">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-2xl text-center space-y-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              
              {!isCompleted ? (
                /* Processing State with Lottie Loading Spinner */
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <LoadingSpinner size={110} />
                  <h2 className="text-lg font-black text-gray-900 tracking-tight">Processing Recharge...</h2>
                  <p className="text-xs font-semibold text-gray-500 max-w-xs">Connecting to BBPS network and confirming your payment details.</p>
                </div>
              ) : (
                /* Recharge Successful State with Lottie Success Green Tick */
                <div className="space-y-6">
                  <div className="flex justify-center -mb-4">
                    <SuccessTick size={190} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recharge Successful!</h2>
                    <p className="text-xs font-medium text-gray-500 mt-1">Your payment of <span className="font-extrabold text-gray-900">₹{amount}</span> has been processed successfully.</p>
                  </div>

                  {/* Summary Details Card */}
                  <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 space-y-3 text-left">
                    <div className="flex justify-between items-center pb-2.5 border-b border-gray-200/60">
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Service</span>
                      <span className="text-xs font-extrabold text-gray-900">{billLabel}</span>
                    </div>
                    {isMobile ? (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Mobile Number</span>
                          <span className="text-xs font-extrabold text-gray-900">+91 {mobileNumber}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Operator</span>
                          <span className="text-xs font-extrabold text-gray-900">{operator || "Standard Provider"}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Account ID</span>
                        <span className="text-xs font-extrabold text-gray-900">{accountNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2.5 border-t border-gray-200/60">
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Paid</span>
                      <span className="text-base font-black text-emerald-600">₹{amount}</span>
                    </div>
                  </div>

                  {/* Back to Dashboard Button */}
                  <button
                    onClick={() => {
                      setShowTracking(false);
                      onBack();
                    }}
                    className="w-full py-4 rounded-xl text-white text-sm font-extrabold shadow-lg hover:shadow-xl transition-all cursor-pointer outline-none border-none bg-gradient-to-r from-[#1e1b4b] via-[#312e81] to-[#4c1d95] hover:from-[#111827] hover:to-[#312e81] active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    Back to Dashboard <ChevronRight size={18} strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {ModalComponent}
      </>
    );
  }

  return (
    <>
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden text-gray-800">
      <Sidebar activeTab="bills" onTabChange={handleNavTabChange} onLogout={onBack} />

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
                        {/* Header Banner */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100/60 text-xs font-semibold text-indigo-800 flex items-start gap-2.5">
                          <CreditCard size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-extrabold text-indigo-900">Credit Card to Bank Transfer</p>
                            <p className="text-[11px] text-indigo-600 mt-0.5 leading-relaxed">Transfer {billLabel} from your credit card via Bank, UPI, or Mobile.</p>
                          </div>
                        </div>

                        {/* Transfer Method Tabs */}
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Transfer To</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { key: "bank" as const, label: "Bank Account", icon: Building2 },
                              { key: "upi" as const, label: "UPI ID", icon: QrCode },
                              { key: "mobile" as const, label: "Mobile No.", icon: Phone },
                            ].map((method) => (
                              <button
                                key={method.key}
                                type="button"
                                onClick={() => setTransferMethod(method.key)}
                                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-[10px] font-extrabold border-2 cursor-pointer transition-all outline-none
                                  ${transferMethod === method.key
                                    ? "bg-indigo-50 border-indigo-400 text-indigo-700 shadow-sm"
                                    : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50 hover:border-gray-200"
                                  }`}
                              >
                                <method.icon size={18} strokeWidth={2} />
                                {method.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Recipient Details - Bank Account */}
                        {transferMethod === "bank" && (
                          <>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Account Holder Name</label>
                              <input
                                type="text"
                                placeholder="Enter Account Holder Name"
                                value={recipientName}
                                onChange={(e) => setRecipientName(e.target.value)}
                                className="w-full px-5 py-3.5 rounded-xl text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Account Number</label>
                                <input
                                  type="text"
                                  placeholder="Bank Account No."
                                  value={recipientAccount}
                                  onChange={(e) => setRecipientAccount(e.target.value.replace(/\D/g, ""))}
                                  className="w-full px-5 py-3.5 rounded-xl text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">IFSC Code</label>
                                <input
                                  type="text"
                                  placeholder="IFSC Code"
                                  maxLength={11}
                                  value={recipientIfsc}
                                  onChange={(e) => setRecipientIfsc(e.target.value.toUpperCase())}
                                  className="w-full px-5 py-3.5 rounded-xl text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
                                />
                              </div>
                            </div>
                          </>
                        )}

                        {/* Recipient Details - UPI */}
                        {transferMethod === "upi" && (
                          <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">UPI ID</label>
                            <div className="relative">
                              <QrCode size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input
                                type="text"
                                placeholder="example@upi or 9876543210@upi"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                className="w-full pl-11 pr-5 py-3.5 rounded-xl text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
                              />
                            </div>
                          </div>
                        )}

                        {/* Recipient Details - Mobile */}
                        {transferMethod === "mobile" && (
                          <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Recipient Mobile Number</label>
                            <div className="relative">
                              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input
                                type="tel"
                                placeholder="Enter 10-digit mobile number"
                                maxLength={10}
                                value={recipientMobile}
                                onChange={(e) => setRecipientMobile(e.target.value.replace(/\D/g, ""))}
                                className="w-full pl-11 pr-5 py-3.5 rounded-xl text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
                              />
                            </div>
                          </div>
                        )}

                        {/* CC Details */}
                        <div className="border-t border-slate-100 pt-4 space-y-4">
                          <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-0">Credit Card Details</label>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Card Number</label>
                            <div className="relative">
                              <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input
                                type="text"
                                maxLength={16}
                                placeholder="Enter 16-digit Card Number"
                                value={ccNumber}
                                onChange={(e) => setCcNumber(e.target.value.replace(/\D/g, ""))}
                                className="w-full pl-11 pr-5 py-3.5 rounded-xl text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
                              />
                            </div>
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
                                className="w-full px-5 py-3.5 rounded-xl text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">CVV</label>
                              <input
                                type="password"
                                maxLength={3}
                                placeholder="***"
                                value={ccCvv}
                                onChange={(e) => setCcCvv(e.target.value.replace(/\D/g, ""))}
                                className="w-full px-5 py-3.5 rounded-xl text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
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
                              className="w-full pl-9 pr-5 py-3.5 rounded-xl text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
                            />
                          </div>
                        </div>

                        {/* Transfer Speed Selection */}
                        {amount && Number(amount) > 0 && (() => {
                          const today = new Date();
                          const tomorrow = new Date(today);
                          tomorrow.setDate(today.getDate() + 1);
                          const dayAfter = new Date(today);
                          dayAfter.setDate(today.getDate() + 2);
                          const fmtDate = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

                          const speedOptions = [
                            { key: "instant" as const, label: "Instant Transfer", date: "Today, " + fmtDate(today), rate: 2.2, icon: Bolt, color: "from-amber-500 to-orange-500", borderColor: "border-amber-400", bgColor: "bg-amber-50", textColor: "text-amber-700", badgeColor: "bg-amber-100 text-amber-800", desc: "Funds credited within minutes" },
                            { key: "tomorrow" as const, label: "Next Day Transfer", date: fmtDate(tomorrow), rate: 1.8, icon: Clock, color: "from-blue-500 to-indigo-500", borderColor: "border-blue-400", bgColor: "bg-blue-50", textColor: "text-blue-700", badgeColor: "bg-blue-100 text-blue-800", desc: "Settled by next business day" },
                            { key: "2day" as const, label: "2-Day Transfer", date: fmtDate(dayAfter), rate: 1.2, icon: CalendarDays, color: "from-emerald-500 to-teal-500", borderColor: "border-emerald-400", bgColor: "bg-emerald-50", textColor: "text-emerald-700", badgeColor: "bg-emerald-100 text-emerald-800", desc: "Lowest charges available" },
                          ];

                          const selected = speedOptions.find(s => s.key === transferSpeed)!;
                          const fee = Number(amount) * (selected.rate / 100);
                          const gst = fee * 0.18;
                          const total = Number(amount) + fee + gst;

                          return (
                            <div className="space-y-3">
                              <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Choose Transfer Speed</label>
                              <div className="space-y-2">
                                {speedOptions.map((opt) => {
                                  const SpeedIcon = opt.icon;
                                  const isActive = transferSpeed === opt.key;
                                  const optFee = Number(amount) * (opt.rate / 100);
                                  const optGst = optFee * 0.18;
                                  const optTotal = Number(amount) + optFee + optGst;
                                  return (
                                    <button
                                      key={opt.key}
                                      type="button"
                                      onClick={() => setTransferSpeed(opt.key)}
                                      className={`w-full p-3.5 rounded-2xl border-2 cursor-pointer transition-all outline-none text-left
                                        ${isActive
                                          ? `${opt.bgColor} ${opt.borderColor} shadow-md`
                                          : "bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                                        }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-br ${opt.color} shadow-sm`}>
                                            <SpeedIcon size={15} strokeWidth={2.5} />
                                          </div>
                                          <div>
                                            <p className={`text-xs font-extrabold ${isActive ? opt.textColor : 'text-gray-800'}`}>{opt.label}</p>
                                            <p className="text-[10px] font-semibold text-gray-400">{opt.date} · {opt.desc}</p>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isActive ? opt.badgeColor : 'bg-gray-100 text-gray-600'}`}>
                                            {opt.rate}% + 18% GST
                                          </span>
                                          <p className={`text-[10px] font-bold mt-1 ${isActive ? opt.textColor : 'text-gray-500'}`}>₹{optTotal.toFixed(2)}</p>
                                        </div>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Fee Breakdown */}
                              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs font-semibold space-y-2.5 text-slate-600">
                                <div className="flex justify-between">
                                  <span>Transfer Amount:</span>
                                  <span className="text-slate-800 font-bold">₹{Number(amount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Convenience Fee ({selected.rate}%):</span>
                                  <span className="text-slate-800">₹{fee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>GST (18% on fee):</span>
                                  <span className="text-slate-800">₹{gst.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-t border-slate-200/60 pt-2 font-bold text-slate-900">
                                  <span>Total Card Chargeable:</span>
                                  <span className="text-amber-600 font-extrabold">₹{total.toFixed(2)}</span>
                                </div>
                                <p className="text-[10px] text-gray-400 font-medium pt-1">Settlement: {selected.label} · {selected.date}</p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </>
                  ) : (
                    // GENERAL BBPS BILLS
                    <>
                      {billLabel === "Electricity" && (
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 ml-1 flex items-center gap-1.5">
                            <Zap size={12} className="text-yellow-500" /> Electricity Provider
                          </label>
                          {loadingOperators ? (
                            <div className="w-full px-5 py-4 rounded-2xl text-sm font-semibold text-gray-500 bg-gradient-to-r from-yellow-50/50 to-amber-50/50 border border-yellow-100 flex items-center gap-3">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-500 border-t-transparent" />
                              Loading providers...
                            </div>
                          ) : (
                            <div className="relative">
                              <Zap size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" />
                              <select
                                value={operator}
                                onChange={(e) => setOperator(e.target.value)}
                                className="w-full pl-10 pr-10 py-4 rounded-2xl text-sm font-bold text-gray-800 bg-gradient-to-r from-white to-amber-50/30 border-2 border-amber-100/80 outline-none focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-50 transition-all cursor-pointer appearance-none shadow-sm hover:shadow-md hover:border-amber-200"
                              >
                                <option value="" disabled>Select your provider</option>
                                {operators.map((op) => (
                                  <option key={op.operatorCode} value={op.operatorCode}>
                                    {op.operatorName}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none bg-amber-100 rounded-full w-6 h-6 flex items-center justify-center">
                                <ChevronRight size={13} className="rotate-90 text-amber-600" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 ml-1">
                          {billLabel === "Electricity" ? serviceParamLabel : "Account Number"}
                        </label>
                        <input
                          type="text"
                          placeholder={billLabel === "Electricity" ? `Enter ${serviceParamLabel}` : `Enter ${billLabel} Account ID`}
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          className="w-full px-5 py-4 rounded-2xl text-sm font-bold text-gray-800 bg-gray-50/80 border-2 border-gray-100 outline-none focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-50 transition-all shadow-sm hover:shadow-md hover:border-gray-200"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 ml-1">Bill Amount</label>
                        <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-extrabold text-amber-400">₹</span>
                          <input
                            type="text"
                            placeholder="Enter Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                            className="w-full pl-10 pr-5 py-4 rounded-2xl text-sm font-bold text-gray-800 bg-gray-50/80 border-2 border-gray-100 outline-none focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-50 transition-all shadow-sm hover:shadow-md hover:border-gray-200"
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
                                            {b}
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
                  <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-100 flex flex-col gap-5">
                    <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                      <CreditCard className="text-indigo-500" size={18} /> How It Works
                    </h3>

                    {/* Step-by-step */}
                    <div className="space-y-4">
                      {[
                        { step: "1", title: "Choose Transfer Method", desc: "Select Bank Account, UPI ID, or Mobile Number to send funds.", gradient: "from-indigo-500 to-purple-500" },
                        { step: "2", title: "Enter Card & Amount", desc: "Provide your credit card details and the amount to transfer.", gradient: "from-blue-500 to-cyan-500" },
                        { step: "3", title: "Pick Transfer Speed", desc: "Choose Instant, Next Day, or 2-Day transfer based on your urgency.", gradient: "from-amber-500 to-orange-500" },
                        { step: "4", title: "Receive Funds", desc: "Amount is credited to recipient via IMPS/NEFT/UPI securely.", gradient: "from-emerald-500 to-teal-500" },
                      ].map((item) => (
                        <div key={item.step} className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center shrink-0 font-extrabold text-xs shadow-sm`}>{item.step}</div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-800">{item.title}</h4>
                            <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Benefits */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100/60">
                      <h4 className="text-[11px] font-extrabold text-indigo-800 mb-2">Why use CC to Bank?</h4>
                      <div className="space-y-1.5">
                        {[
                          "Use credit limits for urgent payments — pay CC bill later",
                          "Earn reward points on rent, tuition & education fees",
                          "45-50 days interest-free credit period",
                          "Multiple transfer modes: Bank, UPI, Mobile"
                        ].map((b, i) => (
                          <p key={i} className="text-[10px] font-semibold text-indigo-700 flex items-center gap-1.5">
                            <CheckCircle2 size={11} className="text-indigo-500 shrink-0" /> {b}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Fee comparison */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-100/60 overflow-hidden">
                      <div className="p-3 border-b border-slate-100">
                        <h4 className="text-[11px] font-extrabold text-gray-700">Fee Comparison</h4>
                      </div>
                      <table className="w-full text-[10px] font-semibold">
                        <thead>
                          <tr className="text-gray-400 border-b border-slate-100">
                            <th className="text-left p-2.5 font-bold">Speed</th>
                            <th className="text-center p-2.5 font-bold">Fee</th>
                            <th className="text-right p-2.5 font-bold">+ GST</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-50">
                            <td className="p-2.5 text-amber-700 font-bold">Instant</td>
                            <td className="text-center p-2.5 text-gray-700">2.2%</td>
                            <td className="text-right p-2.5 text-gray-500">+ 18% GST</td>
                          </tr>
                          <tr className="border-b border-slate-50">
                            <td className="p-2.5 text-blue-700 font-bold">Next Day</td>
                            <td className="text-center p-2.5 text-gray-700">1.8%</td>
                            <td className="text-right p-2.5 text-gray-500">+ 18% GST</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 text-emerald-700 font-bold">2-Day</td>
                            <td className="text-center p-2.5 text-gray-700">1.2%</td>
                            <td className="text-right p-2.5 text-gray-500">+ 18% GST</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/60 text-[10px] text-slate-500 font-semibold leading-relaxed">
                      <strong>Note:</strong> Settlements depend on selected speed. Instant transfers via IMPS, others via NEFT. BBPS secured.
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

      <MobileNav activeTab="bills" onTabChange={handleNavTabChange} />

      <style dangerouslySetInnerHTML={{
        __html: `
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
    {ModalComponent}
    </>
  );
}
