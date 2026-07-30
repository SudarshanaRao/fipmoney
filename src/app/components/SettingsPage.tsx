"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, CreditCard, ShieldCheck, Heart, Sparkles,
  Trash2, Upload, CheckCircle2, AlertCircle, AlertTriangle, Info, ChevronRight,
  Shield, Check, HelpCircle, PhoneOff, Camera, Video, Loader2,
  Save, Landmark, Lock, Trophy, Circle, Eye, Headset
} from "lucide-react";

import { Input } from "./ui/input";
import { useFipModal } from "./FipModal";

import { getLoggedInUser } from "../utils/userStorage";

type SettingsTab = "profile" | "bank" | "nominee" | "security";

export default function SettingsPage() {
  const { showAlert, showConfirm, ModalComponent } = useFipModal();
  const [activeSubTab, setActiveSubTab] = useState<SettingsTab>("profile");

  // Load logged-in user details directly from database session
  const loggedInUser = typeof window !== 'undefined' ? getLoggedInUser() : null;
  const loggedInMobile = loggedInUser?.mobileNumber || (typeof window !== 'undefined' ? sessionStorage.getItem("fm_logged_in_mobile") || "" : "");

  const initialName = loggedInUser?.fullName || loggedInUser?.firstName || (typeof window !== 'undefined' ? localStorage.getItem(`fm_user_name_${loggedInMobile}`) || "" : "");
  const initialKyc = loggedInUser?.isKycCompleted ? "full kyc" : "pending";
  const initialEmail = loggedInUser?.email || (typeof window !== 'undefined' ? localStorage.getItem(`fm_user_email_${loggedInMobile}`) || "" : "");
  const initialUsername = loggedInUser?.userCode || "";
  const initialBio = "";
  const initialJobTitle = loggedInUser?.occupation || "";
  const initialIncomeRange = loggedInUser?.annualIncome ? String(loggedInUser.annualIncome) : "";

  // Form Fields
  const [fullName, setFullName] = useState(initialName);
  const [username, setUsername] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`fm_username_${loggedInMobile}`) || initialUsername || "";
    }
    return initialUsername || "";
  });
  const [email, setEmail] = useState(initialEmail);
  const [mobileNumber, setMobileNumber] = useState(loggedInMobile);
  const [bio, setBio] = useState(initialBio);
  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  const [incomeRange, setIncomeRange] = useState(initialIncomeRange);
  const [sourceOfFunds, setSourceOfFunds] = useState("");

  // Username 60-day lock helper
  const getUsernameLockStatus = () => {
    if (typeof window === 'undefined') return { isLocked: false, daysLeft: 0 };
    const saved = localStorage.getItem(`fm_username_${loggedInMobile}`);
    const lastUpdated = localStorage.getItem(`fm_username_last_updated_${loggedInMobile}`);
    if (!saved || !lastUpdated) return { isLocked: false, daysLeft: 0 };
    const daysPassed = (Date.now() - Number(lastUpdated)) / (1000 * 60 * 60 * 24);
    if (daysPassed < 60) {
      return { isLocked: true, daysLeft: Math.ceil(60 - daysPassed) };
    }
    return { isLocked: false, daysLeft: 0 };
  };

  const { isLocked: isUsernameLocked, daysLeft: usernameDaysLeft } = getUsernameLockStatus();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUsernameLocked) return;
    // Allow ONLY letters, numbers, and underscores (_). No spaces, no other special chars.
    const cleaned = e.target.value.replace(/[^a-zA-Z0-9_]/g, "");
    setUsername(cleaned);
  };

  // OTP Verification Modal states for email and mobile (current -> new verification flow)
  const [changeFieldType, setChangeFieldType] = useState<"email" | "mobile" | null>(null);
  const [changeStep, setChangeStep] = useState<1 | 2 | 3>(1);
  const [currentVerifyOtp, setCurrentVerifyOtp] = useState("");
  const [newValueInput, setNewValueInput] = useState("");
  const [newVerifyOtp, setNewVerifyOtp] = useState("");

  // KYC States
  const [kycStatus, setKycStatus] = useState(initialKyc);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [videoStep, setVideoStep] = useState<"connecting" | "intro" | "pan" | "verifying" | "done">("connecting");

  useEffect(() => {
    if (loggedInMobile) {
      fetch(`http://localhost:5000/api/users/search?mobile=${loggedInMobile}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data && data.data.length > 0) {
            const user = data.data[0];
            const isCompleted = user.isKycCompleted;
            const level = user.kycLevel;
            setKycStatus(isCompleted ? "full kyc" : "pending");
            setAadhaarVerified(isCompleted || level.toLowerCase().includes("min"));
            setPanVerified(isCompleted || level.toLowerCase().includes("min"));
          }
        })
        .catch(err => console.warn("Failed to fetch user details:", err));
    }
  }, [loggedInMobile]);

  // Aadhaar & PAN verification states
  const [aadhaarVerified, setAadhaarVerified] = useState(initialKyc.toLowerCase().includes("kyc") || initialKyc.toLowerCase().includes("min"));
  const [panVerified, setPanVerified] = useState(initialKyc.toLowerCase().includes("kyc") || initialKyc.toLowerCase().includes("min"));
  const [aadhaarNumber, setAadhaarNumber] = useState(initialKyc.toLowerCase().includes("kyc") || initialKyc.toLowerCase().includes("min") ? "489218249419" : "");
  const [panNumber, setPanNumber] = useState(initialKyc.toLowerCase().includes("kyc") || initialKyc.toLowerCase().includes("min") ? "ABCDE1234F" : "");
  const [aadhaarOtp, setAadhaarOtp] = useState("");
  const [showAadhaarOtp, setShowAadhaarOtp] = useState(false);
  const [isLinkingAadhaar, setIsLinkingAadhaar] = useState(false);
  const [isLinkingPan, setIsLinkingPan] = useState(false);

  // Bank details
  const [bankName, setBankName] = useState("HDFC Bank");
  const [accountNumber, setAccountNumber] = useState("50100438290123");
  const [ifscCode, setIfscCode] = useState("HDFC0000104");

  // Nominee Details
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeRelation, setNomineeRelation] = useState("spouse");
  const [nomineeDob, setNomineeDob] = useState("");

  // Saving States
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile Avatar
  const initialSavedAvatar = typeof window !== 'undefined' ? localStorage.getItem(`fm_user_avatar_${loggedInMobile}`) : null;
  const [avatar, setAvatar] = useState(initialSavedAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&auto=format");

  // Dynamically calculate completion percentage based on exact user weights:
  // Personal & Basic Info: 40%
  // Job Title & Income Range: 20%
  // Link Bank Account: 20%
  // Nominee Verification: 20%
  const getCompletionStats = () => {
    const personalDone = Boolean(fullName.trim() && username.trim() && (email.trim() || mobileNumber.trim()));
    const jobDone = Boolean((jobTitle.trim() || sourceOfFunds) && incomeRange);
    const bankDone = Boolean(bankName.trim() && accountNumber.trim() && ifscCode.trim());
    const nomineeDone = Boolean(nomineeName.trim() && nomineeDob.trim());

    let score = 0;
    if (personalDone) score += 40;
    if (jobDone) score += 20;
    if (bankDone) score += 20;
    if (nomineeDone) score += 20;

    return {
      percentage: score,
      personalDone,
      jobDone,
      bankDone,
      nomineeDone,
    };
  };

  const { percentage, personalDone, jobDone, bankDone, nomineeDone } = getCompletionStats();

  const handleSave = async () => {
    if (username.trim()) {
      const isValidFormat = /^[a-zA-Z0-9_]+$/.test(username.trim());
      if (!isValidFormat) {
        showAlert("Username can only contain letters, numbers, and underscores (_). No spaces or special characters allowed.", "warning", "Invalid Username");
        return;
      }
    }

    const savedUsername = typeof window !== 'undefined' ? localStorage.getItem(`fm_username_${loggedInMobile}`) : "";
    const isUsernameChanged = username.trim() !== "" && username !== savedUsername;

    if (isUsernameChanged && isUsernameLocked) {
      showAlert(`Username is fixed and cannot be changed for another ${usernameDaysLeft} days.`, "warning", "Username Locked");
      return;
    }

    setIsSaving(true);

    // Sync with backend API
    try {
      await fetch("http://localhost:5000/api/users/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobileNumber: loggedInMobile,
          username: username.trim(),
          fullName,
          email,
          occupation: jobTitle,
          annualIncome: incomeRange,
        }),
      });
    } catch (err) {
      console.warn("Backend profile update sync error:", err);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(`fm_user_name_${loggedInMobile}`, fullName);
      localStorage.setItem(`fm_user_email_${loggedInMobile}`, email);
      localStorage.setItem(`fm_user_mobile_${loggedInMobile}`, mobileNumber);
      if (isUsernameChanged) {
        localStorage.setItem(`fm_username_${loggedInMobile}`, username.trim());
        localStorage.setItem(`fm_username_last_updated_${loggedInMobile}`, String(Date.now()));
      }
      localStorage.setItem(`fm_bio_${loggedInMobile}`, bio);
      localStorage.setItem(`fm_job_title_${loggedInMobile}`, jobTitle);
      localStorage.setItem(`fm_income_range_${loggedInMobile}`, incomeRange);
      sessionStorage.setItem("fm_logged_in_name", fullName);
    }

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleVerifyCurrentOtp = () => {
    if (currentVerifyOtp === "123456") {
      setChangeStep(2);
      setNewValueInput("");
      showAlert("Current contact ownership verified. Please enter your new details.", "success", "Step 1 Verified");
    } else {
      showAlert("Incorrect OTP. Please enter 123456 to verify.", "error", "Verification Error");
    }
  };

  const handleSendNewOtp = () => {
    if (!newValueInput) {
      showAlert(`Please enter a valid new ${changeFieldType}.`, "warning", "Input Required");
      return;
    }
    if (changeFieldType === "email" && !newValueInput.includes("@")) {
      showAlert("Please enter a valid email address.", "warning", "Invalid Input");
      return;
    }
    if (changeFieldType === "mobile" && newValueInput.replace(/\D/g, "").length !== 10) {
      showAlert("Please enter a valid 10-digit mobile number.", "warning", "Invalid Input");
      return;
    }
    setChangeStep(3);
    setNewVerifyOtp("");
  };

  const handleVerifyNewOtp = () => {
    if (newVerifyOtp === "123456") {
      if (changeFieldType === "email") {
        setEmail(newValueInput);
        if (typeof window !== "undefined") {
          localStorage.setItem(`fm_user_email_${loggedInMobile}`, newValueInput);
        }
        showAlert("Email address updated successfully!", "success", "Verified & Saved");
      } else if (changeFieldType === "mobile") {
        const cleanMobile = newValueInput.replace(/\D/g, "");
        setMobileNumber(cleanMobile);
        if (typeof window !== "undefined") {
          localStorage.setItem(`fm_user_mobile_${loggedInMobile}`, cleanMobile);
          sessionStorage.setItem("fm_logged_in_mobile", cleanMobile);
        }
        showAlert("Mobile number updated successfully!", "success", "Verified & Saved");
      }
      setChangeFieldType(null);
      setChangeStep(1);
      setCurrentVerifyOtp("");
      setNewValueInput("");
      setNewVerifyOtp("");
    } else {
      showAlert("Incorrect OTP. Please enter 123456 to verify.", "error", "Verification Error");
    }
  };

  const startVideoKyc = () => {
    setVideoStep("connecting");
    setShowVideoCall(true);

    const t1 = setTimeout(() => setVideoStep("intro"), 2500);
    const t2 = setTimeout(() => setVideoStep("pan"), 6500);
    const t3 = setTimeout(() => setVideoStep("verifying"), 11000);
    const t4 = setTimeout(async () => {
      setVideoStep("done");
      if (typeof window !== "undefined") {
        localStorage.setItem(`fm_user_kyc_${loggedInMobile}`, "full kyc");
      }
      setKycStatus("full kyc");

      try {
        await fetch("http://localhost:5000/api/users/complete-kyc", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobileNumber: loggedInMobile })
        });
        
        const storedUser = localStorage.getItem("fm_current_logged_in_user");
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          userObj.isKycCompleted = true;
          userObj.kycLevel = "FULL";
          localStorage.setItem("fm_current_logged_in_user", JSON.stringify(userObj));
        }
      } catch (err) {
        console.warn("Backend KYC update sync error:", err);
      }
    }, 15000);

    (window as any)._kycTimers = [t1, t2, t3, t4];
  };

  const cancelVideoKyc = () => {
    if ((window as any)._kycTimers) {
      (window as any)._kycTimers.forEach((t: any) => clearTimeout(t));
    }
    setShowVideoCall(false);
  };

  const handleVerifyAadhaar = async () => {
    if (aadhaarNumber.length !== 12) return;
    setIsLinkingAadhaar(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLinkingAadhaar(false);
    setShowAadhaarOtp(true);
  };

  const handleVerifyAadhaarOtp = async () => {
    if (aadhaarOtp.length < 6) return;
    setIsLinkingAadhaar(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLinkingAadhaar(false);
    setAadhaarVerified(true);
    setShowAadhaarOtp(false);
    checkAndUpgradeToMinKyc(true, panVerified);
  };

  const handleVerifyPan = async () => {
    if (panNumber.length !== 10) return;
    setIsLinkingPan(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLinkingPan(false);
    setPanVerified(true);
    checkAndUpgradeToMinKyc(aadhaarVerified, true);
  };

  const checkAndUpgradeToMinKyc = (av: boolean, pv: boolean) => {
    if (av && pv) {
      if (typeof window !== "undefined") {
        localStorage.setItem(`fm_user_kyc_${loggedInMobile}`, "Min Kyc");
      }
      setKycStatus("Min Kyc");
    }
  };

  const handleRemovePhoto = () => {
    showConfirm(
      "Are you sure you want to remove your profile photo?",
      () => {
        setAvatar("");
        if (typeof window !== 'undefined') {
          localStorage.removeItem(`fm_user_avatar_${loggedInMobile}`);
        }
      },
      { title: "Remove Photo", confirmText: "Remove", cancelText: "Keep" }
    );
  };

  const handleUploadPhoto = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            setAvatar(result);
            if (typeof window !== 'undefined') {
              localStorage.setItem(`fm_user_avatar_${loggedInMobile}`, result);
            }
            showAlert("Profile photo updated successfully from gallery!", "success");
          }
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  return (
    <>
    <div className="flex-1 h-screen overflow-y-auto bg-[#fafbfc]">
      <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 pb-24 lg:pb-10">

        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Settings</h1>
            <p className="text-sm text-gray-500 font-semibold mt-1">Manage your financial profile and account configurations</p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 rounded-lg text-white text-sm font-bold shadow-sm hover:shadow-md disabled:bg-gray-300 disabled:shadow-none cursor-pointer outline-none border-none transition-all flex items-center justify-center gap-2 bg-[#d97706]"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : saveSuccess ? (
              <CheckCircle2 size={16} />
            ) : (
              <Save size={16} />
            )}
            {saveSuccess ? "Saved!" : "Save Changes"}
          </button>
        </div>

        {/* Sub Navigation Tabs (Underline Layout with Framer Motion) */}
        <div className="flex border-b border-gray-200 overflow-x-auto hide-scrollbar">
          {[
            { id: "profile", label: "Profile Details" },
            { id: "bank", label: "Bank Account" },
            { id: "nominee", label: "Nominee Setup" },
            { id: "security", label: "Security & KYC" }
          ].map((tab) => {
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as SettingsTab)}
                className={`relative px-5 py-3 text-sm font-semibold transition-all cursor-pointer outline-none border-none bg-transparent whitespace-nowrap
                  ${active ? "text-amber-600 font-bold" : "text-gray-500 hover:text-gray-800"}`}
              >
                {tab.label}
                {active && (
                  <motion.div
                    layoutId="activeSubTabLine"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: Live Form Column */}
          <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-[2rem] border border-gray-150 shadow-[0_10px_30px_rgba(0,0,0,0.015)] space-y-6">

            <AnimatePresence mode="wait">
              {activeSubTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-50 rounded-full border border-gray-100 text-gray-700">
                       <User size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">Profile Details</h3>
                      <p className="text-sm text-gray-500 font-medium mt-0.5">Update your photo and personal details here.</p>
                    </div>
                  </div>

                  {/* User Code Row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-5 border-b border-gray-100">
                    <div className="md:col-span-4">
                      <label className="text-sm font-semibold text-gray-700">User Code</label>
                      <span className="block text-[11px] text-gray-400 mt-0.5 font-medium">Permanent Account Identifier</span>
                    </div>
                    <div className="md:col-span-8">
                      <span className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-black text-indigo-700 bg-indigo-50 border border-indigo-100 font-mono tracking-wider shadow-xs">
                        #{initialUsername || "FIP0001"}
                      </span>
                    </div>
                  </div>

                  {/* Username Row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-5 border-b border-gray-100">
                    <div className="md:col-span-4">
                      <label className="text-sm font-semibold text-gray-700">Username</label>
                      <span className="block text-[11px] text-gray-400 mt-0.5 font-medium">Letters, numbers & _ only</span>
                    </div>
                    <div className="md:col-span-8">
                      <div className="flex max-w-lg rounded-lg shadow-sm border border-gray-200 overflow-hidden focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-50/55 transition-all">
                        <span className="bg-gray-50 px-3.5 py-2.5 text-sm text-gray-400 font-semibold border-r border-gray-200 select-none">
                          fipmoney.com/
                        </span>
                        <input
                          type="text"
                          value={username}
                          disabled={isUsernameLocked}
                          onChange={handleUsernameChange}
                          placeholder="username_123"
                          className={`flex-1 px-3.5 py-2.5 text-sm font-medium border-none outline-none ${
                            isUsernameLocked ? 'bg-gray-100 text-gray-400 cursor-not-allowed select-none' : 'bg-white text-gray-850'
                          }`}
                        />
                      </div>
                      {isUsernameLocked ? (
                        <p className="text-[11px] font-bold text-amber-600 mt-1.5 flex items-center gap-1">
                          <Lock size={13} /> Username locked. Next editable in {usernameDaysLeft} days (60-day policy).
                        </p>
                      ) : (
                        <p className="text-[11px] font-medium text-gray-400 mt-1.5">
                          Once set, your username is fixed and cannot be changed for 60 days.
                        </p>
                      )}
                    </div>
                  </div>



                  {/* Photo Row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-5 border-b border-gray-100">
                    <div className="md:col-span-4">
                      <label className="text-sm font-semibold text-gray-700">Your photo</label>
                      <span className="block text-xs text-gray-400 mt-1 font-semibold">This will be displayed on your profile.</span>
                    </div>
                    <div className="md:col-span-8 flex items-center gap-5">
                      {avatar ? (
                        <img src={avatar} alt="Avatar" className="w-14 h-14 rounded-full object-cover border border-gray-100 shadow-sm" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-lg border border-amber-100 shadow-sm">
                          {fullName.charAt(0)}
                        </div>
                      )}
                      <div className="flex gap-4">
                        <button
                          onClick={handleUploadPhoto}
                          className="text-xs font-bold text-[#d97706] hover:bg-orange-50 border border-[#d97706] bg-transparent rounded-lg px-4 py-2 cursor-pointer transition-colors outline-none"
                        >
                          Change Photo
                        </button>
                        <button
                          onClick={handleRemovePhoto}
                          className="text-xs font-bold text-red-500 hover:bg-red-50 border border-red-500 bg-transparent rounded-lg px-4 py-2 cursor-pointer transition-colors outline-none"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Full Name Row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-5 border-b border-gray-100">
                    <div className="md:col-span-4">
                      <label className="text-sm font-semibold text-gray-700">Full Name as per PAN</label>
                    </div>
                    <div className="md:col-span-8">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full max-w-lg px-3.5 py-2.5 rounded-lg text-sm font-medium text-gray-800 bg-white border border-gray-200 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-50/55 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-5 border-b border-gray-100">
                    <div className="md:col-span-4">
                      <label className="text-sm font-semibold text-gray-700">Email Address</label>
                    </div>
                    <div className="md:col-span-8 flex gap-3 max-w-lg items-center">
                      <input
                        type="email"
                        value={email}
                        readOnly
                        className="flex-1 px-3.5 py-2.5 rounded-lg text-sm font-medium text-gray-400 bg-gray-50 border border-gray-200 outline-none select-none cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setChangeFieldType("email");
                          setChangeStep(1);
                          setCurrentVerifyOtp("");
                          setNewValueInput("");
                          setNewVerifyOtp("");
                        }}
                        className="bg-[#d97706] hover:bg-orange-600 text-white text-sm font-bold px-5 py-2 rounded-lg transition-all cursor-pointer border-none shrink-0"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  {/* Mobile Row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-5 border-b border-gray-100">
                    <div className="md:col-span-4">
                      <label className="text-sm font-semibold text-gray-700">Mobile Number</label>
                    </div>
                    <div className="md:col-span-8 flex gap-3 max-w-lg items-center">
                      <input
                        type="tel"
                        value={mobileNumber}
                        readOnly
                        className="flex-1 px-3.5 py-2.5 rounded-lg text-sm font-medium text-gray-400 bg-gray-50 border border-gray-200 outline-none select-none cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setChangeFieldType("mobile");
                          setChangeStep(1);
                          setCurrentVerifyOtp("");
                          setNewValueInput("");
                          setNewVerifyOtp("");
                        }}
                        className="bg-[#d97706] hover:bg-orange-600 text-white text-sm font-bold px-5 py-2 rounded-lg transition-all cursor-pointer border-none shrink-0"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  {/* Masked PAN Row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-5 border-b border-gray-100">
                    <div className="md:col-span-4">
                      <label className="text-sm font-semibold text-gray-700">Permanent Account Number (PAN)</label>
                    </div>
                    <div className="md:col-span-8">
                      {panVerified ? (
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-800 font-mono tracking-wider bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                            XXXXX{panNumber.slice(-5, -1)}{panNumber.slice(-1)}
                          </span>
                          <span className="text-xs font-bold px-3 py-1 rounded-md bg-emerald-50 text-emerald-600">
                            Linked & Verified
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-red-500">Not Verified / Linked</span>
                          <button
                            type="button"
                            onClick={() => setActiveSubTab("security")}
                            className="text-xs font-black text-amber-500 hover:text-amber-600 bg-transparent border-none cursor-pointer outline-none"
                          >
                            Link PAN Now &rarr;
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Masked Aadhaar Row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-5 border-b border-gray-100">
                    <div className="md:col-span-4">
                      <label className="text-sm font-semibold text-gray-700">Aadhaar Number</label>
                    </div>
                    <div className="md:col-span-8">
                      {aadhaarVerified ? (
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-800 font-mono tracking-wider bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                            XXXX XXXX {aadhaarNumber.slice(-4)}
                          </span>
                          <span className="text-xs font-bold px-3 py-1 rounded-md bg-emerald-50 text-emerald-600">
                            Linked & Verified
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-red-500">Not Verified / Linked</span>
                          <button
                            type="button"
                            onClick={() => setActiveSubTab("security")}
                            className="text-xs font-black text-amber-500 hover:text-amber-600 bg-transparent border-none cursor-pointer outline-none"
                          >
                            Link Aadhaar Now &rarr;
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Income Range Row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-4">
                    <div className="md:col-span-4">
                      <label className="text-sm font-semibold text-gray-700">Annual Income Range</label>
                    </div>
                    <div className="md:col-span-8">
                      <div className="relative max-w-lg">
                        <select
                          value={incomeRange}
                          onChange={(e) => setIncomeRange(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-gray-800 bg-white border border-gray-200 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-50/55 transition-all cursor-pointer appearance-none shadow-sm"
                        >
                          <option value="" disabled>Select Income Range</option>
                          <option value="under2">Below ₹2 Lakhs</option>
                          <option value="2to5">₹2 Lakhs - ₹5 Lakhs</option>
                          <option value="5to10">₹5 Lakhs - ₹10 Lakhs</option>
                          <option value="above10">Above ₹10 Lakhs</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                          <ChevronRight size={14} className="rotate-90" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSubTab === "bank" && (
                <motion.div
                  key="bank"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Bank Account</h3>
                    <p className="text-xs text-gray-400 mt-1 font-semibold">Verify your linked bank account where investment dividends and cashouts are deposited.</p>
                  </div>

                  {/* Bank Name Row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-5 border-b border-gray-100">
                    <div className="md:col-span-4">
                      <label className="text-sm font-semibold text-gray-700">Bank Name</label>
                    </div>
                    <div className="md:col-span-8">
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full max-w-lg px-3.5 py-2.5 rounded-lg text-sm font-medium text-gray-800 bg-white border border-gray-200 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-50/55 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Account Number Row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-5 border-b border-gray-100">
                    <div className="md:col-span-4">
                      <label className="text-sm font-semibold text-gray-700">Account Number</label>
                    </div>
                    <div className="md:col-span-8">
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full max-w-lg px-3.5 py-2.5 rounded-lg text-sm font-medium text-gray-800 bg-white border border-gray-200 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-50/55 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* IFSC Code Row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-4">
                    <div className="md:col-span-4">
                      <label className="text-sm font-semibold text-gray-700">IFSC Code</label>
                    </div>
                    <div className="md:col-span-8">
                      <input
                        type="text"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                        className="w-full max-w-lg px-3.5 py-2.5 rounded-lg text-sm font-medium text-gray-800 bg-white border border-gray-200 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-50/55 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSubTab === "nominee" && (
                <motion.div
                  key="nominee"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Nominee Setup</h3>
                    <p className="text-xs text-gray-400 mt-1 font-semibold">Add a legal beneficiary to claim your vault balance and gold investments in case of eventualities.</p>
                  </div>

                  {/* Nominee Name */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-5 border-b border-gray-100">
                    <div className="md:col-span-4">
                      <label className="text-sm font-semibold text-gray-700">Nominee Name</label>
                    </div>
                    <div className="md:col-span-8">
                      <input
                        type="text"
                        value={nomineeName}
                        placeholder="Enter Nominee Name"
                        onChange={(e) => setNomineeName(e.target.value)}
                        className="w-full max-w-lg px-3.5 py-2.5 rounded-lg text-sm font-medium text-gray-800 bg-white border border-gray-200 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-50/55 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Relationship */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-5 border-b border-gray-100">
                    <div className="md:col-span-4">
                      <label className="text-sm font-semibold text-gray-700">Relationship</label>
                    </div>
                    <div className="md:col-span-8">
                      <div className="relative max-w-lg">
                        <select
                          value={nomineeRelation}
                          onChange={(e) => setNomineeRelation(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-gray-800 bg-white border border-gray-200 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-50/55 transition-all cursor-pointer appearance-none shadow-sm"
                        >
                          <option value="spouse">Spouse</option>
                          <option value="father">Father</option>
                          <option value="mother">Mother</option>
                          <option value="sibling">Sibling</option>
                          <option value="child">Child</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                          <ChevronRight size={14} className="rotate-90" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nominee Date of Birth */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-4">
                    <div className="md:col-span-4">
                      <label className="text-sm font-semibold text-gray-700">Nominee Date of Birth</label>
                    </div>
                    <div className="md:col-span-8">
                      <input
                        type="date"
                        value={nomineeDob}
                        onChange={(e) => setNomineeDob(e.target.value)}
                        className="w-full max-w-lg px-3.5 py-2.5 rounded-lg text-sm font-medium text-gray-800 bg-white border border-gray-200 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-50/55 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSubTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Security & Compliance</h3>
                    <p className="text-xs text-gray-400 mt-1 font-semibold">Check security configurations and financial compliance parameters.</p>
                  </div>

                  {/* Two-Factor Authentication Toggle */}
                  <div className="flex items-center justify-between py-5 border-b border-gray-100">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">Two-Factor Authentication</h4>
                      <p className="text-xs text-gray-400 mt-1 font-medium">Require secure OTP verification for major cashouts.</p>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer select-none">
                      <div className="w-10 h-6 bg-amber-500 rounded-full flex items-center justify-end px-1 shadow-inner">
                        <div className="w-4.5 h-4.5 bg-white rounded-full shadow" />
                      </div>
                    </div>
                  </div>

                  {/* KYC Verification status */}
                  {/* KYC Verification status */}
                  {kycStatus.toLowerCase() === "pending" ? (
                    <div className="py-5 border-b border-gray-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800">Identity KYC Status</h4>
                          <p className="text-xs text-gray-400 mt-1 font-medium">Verify Aadhaar and PAN database linkage.</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 font-extrabold text-[10px] border border-red-100 flex items-center gap-1">
                          <AlertCircle size={12} /> KYC IS PENDING
                        </span>
                      </div>

                      <div className="bg-amber-50/40 rounded-2xl p-5 border border-amber-100/50 space-y-5">
                        <div>
                          <h5 className="text-xs font-bold text-gray-700">Link Aadhaar & PAN</h5>
                          <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Please provide your Aadhaar and PAN credentials to set up a Minimum KYC tier.</p>
                        </div>

                        {/* Aadhaar Linking Field */}
                        <div className="space-y-2 border-b border-gray-100 pb-4">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">1. 12-Digit Aadhaar Number</label>
                          {aadhaarVerified ? (
                            <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold py-1">
                              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> Aadhaar Linked Successfully (XXXX XXXX {aadhaarNumber.slice(-4)})
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex gap-2">
                                <Input
                                  type="text"
                                  maxLength={12}
                                  value={aadhaarNumber}
                                  onChange={e => setAadhaarNumber(e.target.value.replace(/\D/g, ""))}
                                  placeholder="Enter 12-digit Aadhaar Number"
                                  className="rounded-xl text-xs font-semibold bg-white"
                                  disabled={isLinkingAadhaar || showAadhaarOtp}
                                />
                                <button
                                  onClick={handleVerifyAadhaar}
                                  disabled={aadhaarNumber.length !== 12 || isLinkingAadhaar}
                                  className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-250 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer border-none shrink-0"
                                >
                                  {isLinkingAadhaar ? "Sending..." : "Link"}
                                </button>
                              </div>

                              {showAadhaarOtp && (
                                <div className="bg-white p-3 rounded-xl border border-gray-100 space-y-2.5 shadow-sm max-w-sm">
                                  <p className="text-[10px] font-bold text-amber-600 animate-pulse">✓ OTP sent to your registered UIDAI mobile number</p>
                                  <div className="flex gap-2">
                                    <Input
                                      type="text"
                                      maxLength={6}
                                      value={aadhaarOtp}
                                      onChange={e => setAadhaarOtp(e.target.value.replace(/\D/g, ""))}
                                      placeholder="Enter 6-digit OTP (123456)"
                                      className="rounded-xl text-xs font-semibold bg-white"
                                    />
                                    <button
                                      onClick={handleVerifyAadhaarOtp}
                                      disabled={aadhaarOtp.length < 6 || isLinkingAadhaar}
                                      className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer border-none"
                                    >
                                      Verify
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* PAN Linking Field */}
                        <div className="space-y-2 pt-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">2. 10-Character PAN Number</label>
                          {panVerified ? (
                            <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold py-1">
                              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> PAN Verified Successfully ({panNumber.toUpperCase()})
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <Input
                                type="text"
                                maxLength={10}
                                value={panNumber}
                                onChange={e => setPanNumber(e.target.value.toUpperCase())}
                                placeholder="Enter 10-char PAN (e.g. ABCDE1234F)"
                                className="rounded-xl text-xs font-semibold bg-white"
                                disabled={isLinkingPan}
                              />
                              <button
                                onClick={handleVerifyPan}
                                disabled={panNumber.length !== 10 || isLinkingPan}
                                className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-250 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer border-none shrink-0"
                              >
                                {isLinkingPan ? "Verifying..." : "Verify"}
                              </button>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  ) : kycStatus.toLowerCase().includes("full") ? (
                    <div className="flex items-center justify-between py-5 border-b border-gray-100">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800">Identity KYC Status</h4>
                        <p className="text-xs text-gray-400 mt-1 font-medium">Verify Aadhaar and PAN database linkage.</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-extrabold text-[10px] border border-emerald-100 flex items-center gap-1">
                        <CheckCircle2 size={12} /> FULL KYC COMPLETED
                      </span>
                    </div>
                  ) : (
                    <div className="py-5 border-b border-gray-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800">Identity KYC Status</h4>
                          <p className="text-xs text-gray-400 mt-1 font-medium">Verify Aadhaar and PAN database linkage.</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 font-extrabold text-[10px] border border-amber-100 flex items-center gap-1">
                          <AlertCircle size={12} /> MIN KYC COMPLETED
                        </span>
                      </div>

                      {/* Stepper for Full KYC upgrade */}
                      <div className="bg-amber-50/40 rounded-2xl p-5 border border-amber-100/50 space-y-4">
                        <div>
                          <h5 className="text-xs font-bold text-gray-700">Upgrade to Full KYC</h5>
                          <p className="text-[11px] text-gray-400 font-semibold mt-0.5 font-sans">Full KYC requires Min KYC details + a quick video verification call.</p>
                        </div>

                        <div className="relative pl-6 border-l-2 border-dashed border-amber-200/60 space-y-4 py-1">
                          <div className="relative">
                            <div className="absolute -left-[31px] top-0 w-4.5 h-4.5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[8px] font-black">✓</div>
                            <p className="text-xs font-extrabold text-gray-800">1. Link PAN & Aadhaar (Completed)</p>
                            <p className="text-[10px] text-gray-500 font-semibold">Verified against National Securities Depository portal.</p>
                          </div>

                          <div className="relative">
                            <div className="absolute -left-[31px] top-0 w-4.5 h-4.5 rounded-full bg-amber-500 flex items-center justify-center text-white text-[8px] font-black">2</div>
                            <p className="text-xs font-extrabold text-gray-800">2. Video Call Verification (Pending)</p>
                            <p className="text-[10px] text-gray-500 font-semibold">Join a 2-minute secure live call with a verification officer.</p>

                            <button
                              onClick={startVideoKyc}
                              className="mt-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all cursor-pointer outline-none border-none shadow-sm flex items-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0"
                            >
                              <Sparkles size={12} /> Start Video Call Verification
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* KYC Limits & Tiers Table */}
                  <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-sm space-y-4">
                    <div>
                      <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">KYC Tiers & Storage Limits</h4>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Compare asset buying, daily transfers, and secure storage capacity.</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs font-semibold">
                        <thead>
                          <tr className="border-b border-gray-100 text-[10px] text-gray-450 font-bold uppercase tracking-wider">
                            <th className="py-2.5 pr-2">Tier</th>
                            <th className="py-2.5 pr-2">Buy Limit</th>
                            <th className="py-2.5 pr-2">Transfer/Sell Limit</th>
                            <th className="py-2.5">Max Vault Storage</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-gray-700">
                          <tr className={kycStatus === "pending" ? "bg-amber-50/45 text-amber-900 font-extrabold" : ""}>
                            <td className="py-2.5 flex items-center gap-1.5 font-bold">
                              {kycStatus === "pending" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                              Pending KYC
                            </td>
                            <td className="py-2.5">₹0</td>
                            <td className="py-2.5">₹0</td>
                            <td className="py-2.5">0 g</td>
                          </tr>
                          <tr className={kycStatus === "Min Kyc" ? "bg-amber-50/45 text-amber-900 font-extrabold" : ""}>
                            <td className="py-2.5 flex items-center gap-1.5 font-bold">
                              {kycStatus === "Min Kyc" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                              Minimum KYC
                            </td>
                            <td className="py-2.5">₹10,000 / txn</td>
                            <td className="py-2.5">₹5,000 / day</td>
                            <td className="py-2.5">50 g</td>
                          </tr>
                          <tr className={kycStatus === "full kyc" ? "bg-emerald-50/45 text-emerald-900 font-extrabold" : ""}>
                            <td className="py-2.5 flex items-center gap-1.5 font-bold">
                              {kycStatus === "full kyc" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                              Full KYC
                            </td>
                            <td className="py-2.5">Unlimited (₹25L/day)</td>
                            <td className="py-2.5">Unlimited (₹10L/day)</td>
                            <td className="py-2.5">1,000 g</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Logged in devices */}
                  <div className="py-2">
                    <h4 className="text-sm font-bold text-gray-800 mb-3">Active Device Sessions</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-gray-700">Windows PC • Bangalore, India</p>
                          <p className="text-[10px] text-gray-450 font-semibold">Active session (Current Web Browser)</p>
                        </div>
                        <span className="text-[10px] font-extrabold text-amber-600 uppercase">Current</span>
                      </div>
                      <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-gray-700">iPhone 15 Pro • Bangalore, India</p>
                          <p className="text-[10px] text-gray-455 font-semibold">Logged in 2 days ago</p>
                        </div>
                        <button className="text-[10px] font-extrabold text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer outline-none">Revoke</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* RIGHT: Completion Status Indicator Sidebar Card */}
          <div className="lg:col-span-4 space-y-6">

            {/* Completion Percentage card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-150 shadow-sm flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-6 w-full justify-center">
                <Trophy size={18} className="text-[#d97706]" />
                <h3 className="text-sm font-extrabold text-gray-900 tracking-tight">Profile Completion</h3>
              </div>

              <div className="relative w-36 h-36 flex items-center justify-center p-1">
                <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90 overflow-visible">
                  <circle cx="60" cy="60" r="50" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="60" cy="60" r="50"
                    stroke={
                      percentage <= 20 ? "#ef4444" : percentage <= 40 ? "#f97316" : percentage <= 60 ? "#f59e0b" : percentage <= 80 ? "#3b82f6" : "#10b981"
                    }
                    strokeWidth="8" fill="transparent"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={2 * Math.PI * 50 * (1 - percentage / 100)}
                    strokeLinecap="round" className="transition-all duration-500 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-gray-800 leading-none">{percentage}%</span>
                  <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wider mt-1.5">Completed</span>
                </div>
              </div>

              {/* Status Priority Badge */}
              <div className="mt-5 w-full">
                {percentage <= 20 && (
                  <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center gap-2 text-xs font-bold shadow-2xs">
                    <AlertCircle size={16} className="text-red-500 shrink-0 animate-pulse" />
                    <span>Highest Priority: Action Needed (20%)</span>
                  </div>
                )}
                {percentage === 40 && (
                  <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200 text-orange-800 flex items-center justify-center gap-2 text-xs font-bold shadow-2xs">
                    <AlertTriangle size={16} className="text-orange-500 shrink-0" />
                    <span>High Priority: Action Needed (40%)</span>
                  </div>
                )}
                {percentage === 60 && (
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-center gap-2 text-xs font-bold shadow-2xs">
                    <AlertTriangle size={16} className="text-amber-500 shrink-0" />
                    <span>Medium Priority: Complete Profile (60%)</span>
                  </div>
                )}
                {percentage === 80 && (
                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-center gap-2 text-xs font-bold shadow-2xs">
                    <Info size={16} className="text-blue-500 shrink-0" />
                    <span>Almost Completed (80%)</span>
                  </div>
                )}
                {percentage === 100 && (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center gap-2 text-xs font-bold shadow-2xs">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>100% Profile Complete & Verified 🎉</span>
                  </div>
                )}
              </div>

              {/* Progress checklist detail items */}
              <div className="w-full mt-6 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    {personalDone ? (
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    ) : percentage <= 20 ? (
                      <AlertCircle size={16} className="text-red-500 shrink-0" />
                    ) : (
                      <AlertTriangle size={16} className="text-orange-500 shrink-0" />
                    )}
                    <span className="text-gray-700 font-bold text-[13px]">Personal & Basic Info</span>
                  </div>
                  <span className={`text-xs font-black ${personalDone ? "text-emerald-600" : "text-gray-400"}`}>40%</span>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    {jobDone ? (
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    ) : percentage <= 20 ? (
                      <AlertCircle size={16} className="text-red-500 shrink-0" />
                    ) : (
                      <AlertTriangle size={16} className="text-amber-500 shrink-0" />
                    )}
                    <span className="text-gray-700 font-bold text-[13px]">Job Title & Income Range</span>
                  </div>
                  <span className={`text-xs font-black ${jobDone ? "text-emerald-600" : "text-gray-400"}`}>20%</span>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    {bankDone ? (
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    ) : percentage <= 20 ? (
                      <AlertCircle size={16} className="text-red-500 shrink-0" />
                    ) : (
                      <AlertTriangle size={16} className="text-amber-500 shrink-0" />
                    )}
                    <span className="text-gray-700 font-bold text-[13px]">Link Bank Account</span>
                  </div>
                  <span className={`text-xs font-black ${bankDone ? "text-emerald-600" : "text-gray-400"}`}>20%</span>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    {nomineeDone ? (
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    ) : percentage <= 20 ? (
                      <AlertCircle size={16} className="text-red-500 shrink-0" />
                    ) : (
                      <AlertTriangle size={16} className="text-amber-500 shrink-0" />
                    )}
                    <span className="text-gray-700 font-bold text-[13px]">Nominee Verification</span>
                  </div>
                  <span className={`text-xs font-black ${nomineeDone ? "text-emerald-600" : "text-gray-400"}`}>20%</span>
                </div>
              </div>
            </div>

            {/* Security Compliance Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-150 shadow-sm flex flex-col relative overflow-hidden mt-6">
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <ShieldCheck size={18} className="text-[#d97706]" />
                <h3 className="text-sm font-extrabold text-gray-900 tracking-tight">Security Compliance</h3>
              </div>
              <p className="text-[12px] font-medium text-gray-500 leading-relaxed relative z-10">
                Fipmoney complies with SEBI digital asset registry codes. All PAN and bank details are encrypted locally before transfer.
              </p>
              
              {/* Decorative graphic */}
              <div className="mt-8 flex justify-center items-center relative h-32 w-full">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-50 rounded-full z-0 blur-3xl opacity-60" />
                 <Shield size={110} strokeWidth={1} className="text-orange-100 fill-orange-50 relative z-10" />
                 <Check size={40} strokeWidth={4} className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] z-20" />
                 <Lock size={36} strokeWidth={1.5} className="text-orange-200 fill-orange-50 absolute left-1/2 top-1/2 ml-4 mt-2 z-30 drop-shadow-sm bg-white rounded-md p-1" />
              </div>
            </div>

          </div>
        </div>

        {/* Footer info blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm mt-8">
           <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-50 rounded-full text-purple-600 shrink-0">
                 <Lock size={20} />
              </div>
              <div>
                 <h4 className="text-sm font-extrabold text-gray-900">Secure Data</h4>
                 <p className="text-[11px] text-gray-500 font-semibold mt-1">Your data is protected with bank-grade encryption.</p>
              </div>
           </div>
           <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-50 rounded-full text-orange-600 shrink-0">
                 <ShieldCheck size={20} />
              </div>
              <div>
                 <h4 className="text-sm font-extrabold text-gray-900">Verified Accounts</h4>
                 <p className="text-[11px] text-gray-500 font-semibold mt-1">All accounts are verified and linked for safe transactions.</p>
              </div>
           </div>
           <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-full text-blue-600 shrink-0">
                 <Eye size={20} />
              </div>
              <div>
                 <h4 className="text-sm font-extrabold text-gray-900">Privacy First</h4>
                 <p className="text-[11px] text-gray-500 font-semibold mt-1">We do not share your information with third parties.</p>
              </div>
           </div>
           <div className="flex items-start gap-4">
              <div className="p-3 bg-green-50 rounded-full text-green-600 shrink-0">
                 <Headset size={20} />
              </div>
              <div>
                 <h4 className="text-sm font-extrabold text-gray-900">Need Help?</h4>
                 <p className="text-[11px] text-gray-500 font-semibold mt-1">Our support team is available 24/7 to assist you.</p>
                 <button className="text-[11px] font-bold text-[#d97706] mt-2 bg-transparent border-none p-0 flex items-center gap-1 cursor-pointer">
                    Contact Support <ChevronRight size={12} />
                 </button>
              </div>
           </div>
        </div>

      </div>

      {/* Video KYC Call Overlay */}
      <AnimatePresence>
        {showVideoCall && (
          <motion.div
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#0f172a] text-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl relative border border-slate-850 flex flex-col h-[520px]"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
            >
              {/* Header */}
              <div className="bg-[#1e293b] px-6 py-4 flex items-center justify-between border-b border-slate-850">
                <div className="flex items-center gap-2">
                  <Video size={16} className="text-red-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Video Verification</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-red-500">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  REC 00:{videoStep === "connecting" ? "00" : "12"}
                </div>
              </div>

              {/* Viewport splits */}
              <div className="flex-1 grid grid-cols-2 gap-4 p-6 bg-slate-950">
                {/* Officer Video */}
                <div className="bg-[#1e293b] rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border border-slate-800">
                  {videoStep === "connecting" ? (
                    <div className="text-center space-y-3">
                      <Loader2 size={32} className="animate-spin text-amber-500 mx-auto" />
                      <p className="text-xs font-bold text-slate-400">Connecting to officer...</p>
                    </div>
                  ) : (
                    <>
                      {/* Officer Face Mockup */}
                      <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center border-2 border-amber-500 relative">
                        <User size={48} className="text-slate-400" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-[#1e293b]">
                          <CheckCircle2 size={12} className="text-white" />
                        </div>
                      </div>
                      <p className="text-xs font-bold text-slate-300 mt-3">Sarah (KYC Officer)</p>

                      {/* Voice waveform mockup */}
                      {videoStep !== "verifying" && videoStep !== "done" && (
                        <div className="flex gap-1 items-end h-6 mt-4">
                          {[0, 1, 2, 3, 4, 5, 4, 3, 2, 1].map((h, i) => (
                            <motion.div
                              key={i}
                              className="w-0.5 bg-amber-500 rounded-full"
                              animate={{ height: [4, h * 4, 4] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.05 }}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  <span className="absolute bottom-3 left-3 text-[9px] font-bold bg-black/60 px-2 py-0.5 rounded text-slate-300">Live Agent Feed</span>
                </div>

                {/* User Camera Preview */}
                <div className="bg-[#1e293b] rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border border-slate-800">
                  {videoStep === "connecting" ? (
                    <div className="text-center space-y-2">
                      <Camera size={24} className="text-slate-550 mx-auto" />
                      <p className="text-xs font-bold text-slate-400">Starting camera...</p>
                    </div>
                  ) : (
                    <>
                      {/* User mockup camera picture */}
                      <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-650 relative overflow-hidden">
                        <img src={avatar} className="w-full h-full object-cover" />
                        {videoStep === "pan" && (
                          <div className="absolute inset-0 bg-amber-500/25 flex items-center justify-center text-[10px] font-black text-amber-250">
                            PAN CARD READY
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-bold text-slate-300 mt-3">{fullName}</p>

                      {/* Framing Overlay box */}
                      {videoStep === "pan" ? (
                        <div className="absolute inset-4 border-2 border-dashed border-amber-500/50 rounded-xl flex items-center justify-center pointer-events-none">
                          <span className="text-[8px] bg-amber-500/90 text-black font-black px-2 py-0.5 rounded">ALIGN PAN CARD HERE</span>
                        </div>
                      ) : (
                        <div className="absolute inset-4 border border-dashed border-emerald-500/35 rounded-xl pointer-events-none" />
                      )}
                    </>
                  )}
                  <span className="absolute bottom-3 left-3 text-[9px] font-bold bg-black/60 px-2 py-0.5 rounded text-slate-300">Your Preview</span>
                </div>
              </div>

              {/* Subtitles box */}
              <div className="bg-slate-900 p-4 border-t border-slate-850 text-center min-h-[70px] flex items-center justify-center px-8">
                <p className="text-xs font-medium text-slate-300 italic tracking-wide">
                  {videoStep === "connecting" && "System: Setting up end-to-end encrypted connection with verification office..."}
                  {videoStep === "intro" && "Sarah: Hello! I'm Sarah from the compliance desk. Can you please state your name and confirm you are opening a Fipmoney gold vault?"}
                  {videoStep === "pan" && "Sarah: Great! Now please hold up your physical PAN card to the camera so we can log the database records."}
                  {videoStep === "verifying" && "System: Capturing records. Running AI verification against NSDL database..."}
                  {videoStep === "done" && "Sarah: Verification complete! Everything checks out. Your account has been upgraded to Full KYC."}
                </p>
              </div>

              {/* Footer action bar */}
              <div className="bg-[#1e293b] px-6 py-4 flex items-center justify-between border-t border-slate-850">
                <button
                  onClick={cancelVideoKyc}
                  disabled={videoStep === "done"}
                  className="bg-transparent text-slate-400 hover:text-white hover:bg-slate-850 disabled:opacity-50 text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all cursor-pointer outline-none border border-slate-700 flex items-center gap-1.5"
                >
                  <PhoneOff size={14} /> Cancel call
                </button>

                {videoStep === "done" ? (
                  <button
                    onClick={() => setShowVideoCall(false)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black px-6 py-2.5 rounded-xl transition-all cursor-pointer outline-none border-none shadow-md"
                  >
                    Finish & Upgrade Account
                  </button>
                ) : (
                  <div className="text-[10px] text-slate-400 font-bold animate-pulse">
                    Verification in progress...
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>

    {/* Email / Mobile Change Verification Modal */}
    <AnimatePresence>
      {changeFieldType !== null && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white text-slate-800 rounded-3xl p-6 max-w-md w-full relative border border-slate-100 shadow-2xl space-y-5"
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
          >
            <div>
              <h3 className="text-lg font-black text-slate-900 capitalize">
                Change {changeFieldType === "email" ? "Email Address" : "Mobile Number"}
              </h3>
              <p className="text-xs text-gray-400 font-semibold mt-1">
                {changeStep === 1 && "Step 1: Cross-verify your current identity."}
                {changeStep === 2 && "Step 2: Enter your new details."}
                {changeStep === 3 && "Step 3: Verify your new details."}
              </p>
            </div>

            {changeStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Verify Current {changeFieldType === "email" ? "Email Address" : "Mobile Number"}
                  </label>
                  <p className="text-[11px] font-bold text-amber-600 leading-normal bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
                    🔑 Verification OTP sent to current detail: {changeFieldType === "email" ? email : mobileNumber}. Enter 123456.
                  </p>
                  <input
                    type="text"
                    maxLength={6}
                    value={currentVerifyOtp}
                    onChange={(e) => setCurrentVerifyOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 outline-none focus:border-amber-500 focus:bg-white transition-all shadow-sm text-center tracking-widest font-mono"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setChangeFieldType(null);
                      setCurrentVerifyOtp("");
                    }}
                    className="flex-1 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-605 cursor-pointer transition-colors outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyCurrentOtp}
                    disabled={currentVerifyOtp.length !== 6}
                    className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-black cursor-pointer transition-all border-none outline-none shadow-sm"
                  >
                    Next &rarr;
                  </button>
                </div>
              </div>
            )}

            {changeStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    New {changeFieldType === "email" ? "Email Address" : "Mobile Number"}
                  </label>
                  <input
                    type={changeFieldType === "email" ? "email" : "tel"}
                    value={newValueInput}
                    onChange={(e) => setNewValueInput(e.target.value)}
                    placeholder={changeFieldType === "email" ? "name@example.com" : "Enter 10-digit number"}
                    className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 outline-none focus:border-amber-500 focus:bg-white transition-all shadow-sm"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setChangeFieldType(null);
                      setChangeStep(1);
                      setCurrentVerifyOtp("");
                    }}
                    className="flex-1 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-605 cursor-pointer transition-colors outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendNewOtp}
                    className="flex-1 py-3 rounded-xl text-white text-xs font-black cursor-pointer transition-all border-none outline-none shadow-sm"
                    style={{ background: "linear-gradient(135deg, #b87312, #efb652)" }}
                  >
                    Send OTP
                  </button>
                </div>
              </div>
            )}

            {changeStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Verify New {changeFieldType === "email" ? "Email" : "Mobile"}
                  </label>
                  <p className="text-[11px] font-bold text-amber-600 leading-normal bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
                    🔑 OTP sent to new address: {newValueInput}. Enter 123456.
                  </p>
                  <input
                    type="text"
                    maxLength={6}
                    value={newVerifyOtp}
                    onChange={(e) => setNewVerifyOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 outline-none focus:border-amber-500 focus:bg-white transition-all shadow-sm text-center tracking-widest font-mono"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setChangeStep(2)}
                    className="flex-1 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-605 cursor-pointer transition-colors outline-none"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyNewOtp}
                    disabled={newVerifyOtp.length !== 6}
                    className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-black cursor-pointer transition-all border-none outline-none shadow-sm"
                  >
                    Verify & Change
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {ModalComponent}
    </>
  );
}
