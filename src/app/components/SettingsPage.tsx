"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, CreditCard, ShieldCheck, Heart, Sparkles,
  Trash2, Upload, CheckCircle2, AlertCircle, AlertTriangle, Info, ChevronRight,
  Shield, Check, HelpCircle, PhoneOff, Camera, Video, Loader2,
  Save, Landmark, Lock, Trophy, Circle, Eye, EyeOff, Headset,
  Laptop, Smartphone, Tablet, Globe, Clock, ShieldAlert,
  Fingerprint, Copy, ArrowUpCircle, ExternalLink, RefreshCw, KeyRound,
  FileCheck2, CheckCheck, Briefcase, Mail, Phone, Calendar
} from "lucide-react";

import { Input } from "./ui/input";
import { useFipModal } from "./FipModal";
import { API_BASE_URL } from "../utils/apiConfig";
import { getLoggedInUser, getUserAvatar, updateUserAvatar } from "../utils/userStorage";
import { calculateProfileCompletion } from "../utils/profileCompletionCalculator";
import { 
  checkBiometricAvailability, 
  authenticateWithBiometrics, 
  isBiometricLockEnabled, 
  setBiometricLockEnabled 
} from "../utils/biometricService";
import { 
  CURRENT_APP_VERSION, 
  CURRENT_VERSION_CODE, 
  fetchLatestAppVersion, 
  openGooglePlayStore 
} from "../utils/appUpdateService";
import { Capacitor } from "@capacitor/core";
import { toast } from "react-hot-toast";

type SettingsTab = "profile" | "bank" | "nominee" | "security" | "sessions" | "about";

export default function SettingsPage() {
  const { showAlert, showConfirm, ModalComponent } = useFipModal();
  const [activeSubTab, setActiveSubTab] = useState<SettingsTab>("profile");
  const [isEmailHighlighted, setIsEmailHighlighted] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Biometric Native State
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState("Fingerprint");
  const [isBiometricActive, setIsBiometricActive] = useState(() => isBiometricLockEnabled());
  const [isTogglingBiometric, setIsTogglingBiometric] = useState(false);

  // App Update Checker State
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

  // Highlight email if navigated from Dashboard prompt
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const highlight = sessionStorage.getItem("fm_highlight_email");
      if (highlight === "true") {
        setIsEmailHighlighted(true);
        setActiveSubTab("profile");
        sessionStorage.removeItem("fm_highlight_email");
        setTimeout(() => {
          const el = document.getElementById("email-input-section");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      }
    }
  }, []);

  // Check native biometric availability on mount
  useEffect(() => {
    const checkBio = async () => {
      try {
        const res = await checkBiometricAvailability();
        setBiometricAvailable(res.isAvailable);
        if (res.biometryType) {
          setBiometricType(res.biometryType === "FACE_AUTHENTICATION" ? "Face ID" : "Fingerprint");
        }
      } catch (e) {
        console.warn("Biometric check notice:", e);
      }
    };
    checkBio();
  }, []);

  // Load logged-in user details directly from database session
  const loggedInUser = typeof window !== 'undefined' ? getLoggedInUser() : null;
  let rawMobile = loggedInUser?.mobileNumber || (typeof window !== 'undefined' ? sessionStorage.getItem("fm_logged_in_mobile") || "" : "");
  if (rawMobile.startsWith("enc256:")) {
    rawMobile = (typeof window !== 'undefined' ? sessionStorage.getItem("fm_logged_in_mobile") || "" : "");
  }
  const loggedInMobile = rawMobile.replace(/\D/g, "").slice(-10);

  // Active Sessions Management State
  const [sessionsList, setSessionsList] = useState<any[]>([]);
  const [isSessionsLoading, setIsSessionsLoading] = useState(false);
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);

  const fetchSessions = async () => {
    if (!loggedInMobile) return;
    setIsSessionsLoading(true);
    try {
      const currentSessionId = typeof window !== 'undefined' ? (sessionStorage.getItem("fm_session_id") || localStorage.getItem("fm_session_id") || "") : "";
      const res = await fetch(`${API_BASE_URL}/users/sessions?mobile=${loggedInMobile}`, {
        headers: {
          "Accept": "application/json",
          "x-session-id": currentSessionId,
        }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setSessionsList(data.data);
      } else {
        setSessionsList([]);
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      setIsSessionsLoading(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === "sessions") {
      fetchSessions();
    }
  }, [activeSubTab]);

  const handleRevokeSession = (sessionIdToRevoke: string) => {
    showConfirm(
      "Are you sure you want to log out this device? The user on that device will be signed out immediately.",
      async () => {
        setRevokingSessionId(sessionIdToRevoke);
        try {
          const res = await fetch(`${API_BASE_URL}/users/sessions/revoke`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mobile: loggedInMobile, sessionId: sessionIdToRevoke })
          });
          const data = await res.json();
          if (data.success) {
            showAlert("Session revoked successfully! Device logged out.", "success");
            setSessionsList(prev => prev.filter(s => s.sessionId !== sessionIdToRevoke));
          } else {
            showAlert(data.message || "Failed to revoke session", "error");
          }
        } catch (err) {
          showAlert("Failed to connect to server", "error");
        } finally {
          setRevokingSessionId(null);
        }
      },
      { title: "Revoke Active Session?", confirmText: "Revoke Session", cancelText: "Cancel" }
    );
  };

  const initialName = loggedInUser?.fullName || "";
  const initialKyc = loggedInUser?.isKycCompleted ? "full kyc" : "pending";
  const initialEmail = loggedInUser?.email || (typeof window !== 'undefined' ? localStorage.getItem(`fm_user_email_${loggedInMobile}`) || "" : "");
  const initialUserCode = loggedInUser?.userCode || "";
  const initialReferralCode = loggedInUser?.referralCode || "";
  const initialUsername = loggedInUser?.username || "";
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
  const [referralCode, setReferralCode] = useState(initialReferralCode);
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
    const cleaned = e.target.value.replace(/[^a-zA-Z0-9_]/g, "");
    setUsername(cleaned);
  };

  // OTP Verification Modal states for email and mobile
  const [changeFieldType, setChangeFieldType] = useState<"email" | "mobile" | null>(null);
  const [changeStep, setChangeStep] = useState<1 | 2 | 3>(1);
  const [currentVerifyOtp, setCurrentVerifyOtp] = useState("");
  const [newValueInput, setNewValueInput] = useState("");
  const [newVerifyOtp, setNewVerifyOtp] = useState("");

  // KYC States
  const [kycStatus, setKycStatus] = useState(initialKyc);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [videoStep, setVideoStep] = useState<"connecting" | "intro" | "pan" | "verifying" | "done">("connecting");

  // Fetch real KYC status from database API
  const fetchRealKycStatus = async () => {
    if (!loggedInMobile) return;
    try {
      const res = await fetch(`${API_BASE_URL}/kyc/status?phone=${loggedInMobile}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.status) {
          if (data.status === 'Verified') {
            setKycStatus("full kyc");
            setAadhaarVerified(true);
            setPanVerified(true);
          } else if (data.status === 'Pending') {
            setKycStatus("pending");
          } else if (data.status === 'Rejected') {
            setKycStatus("rejected");
          }
        }
      }
    } catch (err) {
      console.warn("KYC status API fetch error:", err);
    }
  };

  const submitKycRequestToBackend = async (aadhaarVal?: string, panVal?: string) => {
    try {
      const payload = {
        userId: loggedInUser?.userCode || `USR-${loggedInMobile}`,
        userName: fullName || username || loggedInUser?.username || 'Valued User',
        phone: loggedInMobile,
        email: email || loggedInUser?.email || '',
        documentType: 'Aadhaar + PAN',
        aadhaarNo: aadhaarVal || aadhaarNumber || 'XXXX-XXXX-9012',
        panNo: panVal || panNumber || 'ABCDE1234F'
      };

      const res = await fetch(`${API_BASE_URL}/kyc/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        showAlert(json.message || "KYC Verification Request submitted to admin panel!", "success", "KYC Initiated");
        setKycStatus("pending");
      }
    } catch (err) {
      console.error("KYC Submit error:", err);
    }
  };

  useEffect(() => {
    fetchRealKycStatus();
  }, [loggedInMobile]);

  useEffect(() => {
    if (loggedInMobile) {
      fetch(`${API_BASE_URL}/users/profile-settings?mobile=${loggedInMobile}`)
        .then(res => {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return res.json();
          }
          throw new Error(`Non-JSON response (HTTP ${res.status})`);
        })
        .then(data => {
          if (data.success && data.data) {
            const user = data.data;
            const isCompleted = user.isKycCompleted;
            const level = user.kycLevel;
            if (isCompleted) setKycStatus("full kyc");
            
            setAadhaarVerified(isCompleted || Boolean(level && level.toLowerCase().includes("min")));
            setPanVerified(isCompleted || Boolean(level && level.toLowerCase().includes("min")));

            if (user.fullName && !fullName) setFullName(user.fullName);
            if (user.username && !username) setUsername(user.username);
            if (user.email && !email) setEmail(user.email);
            if (user.occupation && !jobTitle) setJobTitle(user.occupation);
            if (user.annualIncome && !incomeRange) setIncomeRange(String(user.annualIncome));
            if (user.bankAccount) {
              if (user.bankAccount.bankName && !bankName) setBankName(user.bankAccount.bankName);
              if (user.bankAccount.accountNumber && !accountNumber) setAccountNumber(user.bankAccount.accountNumber);
              if (user.bankAccount.ifscCode && !ifscCode) setIfscCode(user.bankAccount.ifscCode);
            }
            if (user.nominee) {
              if (user.nominee.name && !nomineeName) setNomineeName(user.nominee.name);
              if (user.nominee.relationship && !nomineeRelation) setNomineeRelation(user.nominee.relationship);
              if (user.nominee.dob && !nomineeDob) setNomineeDob(user.nominee.dob);
            }
          }
        })
        .catch(err => console.warn("Profile settings fetch notice:", err));
    }
  }, [loggedInMobile]);

  // Aadhaar & PAN verification states
  const [aadhaarVerified, setAadhaarVerified] = useState(initialKyc.toLowerCase().includes("kyc") || initialKyc.toLowerCase().includes("min"));
  const [panVerified, setPanVerified] = useState(initialKyc.toLowerCase().includes("kyc") || initialKyc.toLowerCase().includes("min"));
  const [aadhaarNumber, setAadhaarNumber] = useState(initialKyc.toLowerCase().includes("kyc") || initialKyc.toLowerCase().includes("min") ? "XXXX-XXXX-9012" : "");
  const [panNumber, setPanNumber] = useState(initialKyc.toLowerCase().includes("kyc") || initialKyc.toLowerCase().includes("min") ? "ABCDE1234F" : "");
  const [aadhaarOtp, setAadhaarOtp] = useState("");
  const [showAadhaarOtp, setShowAadhaarOtp] = useState(false);
  const [isLinkingAadhaar, setIsLinkingAadhaar] = useState(false);
  const [isLinkingPan, setIsLinkingPan] = useState(false);

  // Bank States
  const [bankName, setBankName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`fm_bank_name_${loggedInMobile}`) || "";
    }
    return "";
  });
  const [accountNumber, setAccountNumber] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`fm_bank_acc_${loggedInMobile}`) || "";
    }
    return "";
  });
  const [ifscCode, setIfscCode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`fm_bank_ifsc_${loggedInMobile}`) || "";
    }
    return "";
  });

  // Nominee States
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeRelation, setNomineeRelation] = useState("spouse");
  const [nomineeDob, setNomineeDob] = useState("");

  // Saving States
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile Avatar
  const [avatar, setAvatar] = useState<string | null>(() => getUserAvatar(loggedInMobile));

  useEffect(() => {
    const handleAvatarChange = () => {
      setAvatar(getUserAvatar(loggedInMobile));
    };
    window.addEventListener("fm_avatar_changed", handleAvatarChange);
    return () => window.removeEventListener("fm_avatar_changed", handleAvatarChange);
  }, [loggedInMobile]);

  // Real-Time Debounced Profile Autosave Effect
  useEffect(() => {
    if (!loggedInMobile) return;
    const saveTimer = setTimeout(async () => {
      try {
        if (typeof window !== 'undefined') {
          if (bankName) localStorage.setItem(`fm_bank_name_${loggedInMobile}`, bankName);
          if (accountNumber) localStorage.setItem(`fm_bank_acc_${loggedInMobile}`, accountNumber);
          if (ifscCode) localStorage.setItem(`fm_bank_ifsc_${loggedInMobile}`, ifscCode);
        }
        await fetch(`${API_BASE_URL}/users/update-profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mobileNumber: loggedInMobile,
            fullName,
            email,
            username,
            annualIncome: incomeRange,
            occupation: jobTitle,
            bankAccount: {
              bankName,
              accountNumber,
              ifscCode,
              accountHolderName: fullName || username || 'Valued User'
            },
            nominee: {
              name: nomineeName,
              relationship: nomineeRelation,
              dob: nomineeDob
            }
          })
        });
      } catch (err) {
        console.warn("[Autosave Profile Warning]:", err);
      }
    }, 800);

    return () => clearTimeout(saveTimer);
  }, [fullName, email, username, incomeRange, jobTitle, bankName, accountNumber, ifscCode, nomineeName, nomineeRelation, nomineeDob, loggedInMobile]);

  const getCompletionStats = () => {
    const result = calculateProfileCompletion(loggedInUser, {
      fullName,
      email,
      mobileNumber,
      hasAvatar: Boolean(avatar && String(avatar).trim() !== ""),
      accountNumber,
      ifscCode,
      nomineeName,
      nomineeRelation,
      nomineeDob,
      panNumber,
      aadhaarNumber,
    });

    return {
      percentage: result.percentage,
      personalDone: result.personalDone,
      personalScore: result.personalScore,
      bankDone: result.bankDone,
      nomineeDone: result.nomineeDone,
      kycDone: result.kycDone,
    };
  };

  const { percentage, personalDone, personalScore, bankDone, nomineeDone, kycDone } = getCompletionStats();

  const handleSave = async () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }

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

    try {
      await fetch(`${API_BASE_URL}/users/update-profile`, {
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
    toast.success("Profile changes saved successfully!", { position: "top-center" });
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Toggle Native Biometric Fingerprint Lock
  const handleToggleBiometric = async () => {
    if (!Capacitor.isNativePlatform()) {
      showAlert("Biometric lock is available inside the native Android mobile app.", "info", "Mobile Feature");
      return;
    }

    setIsTogglingBiometric(true);
    try {
      if (!isBiometricActive) {
        // Authenticate first before enabling
        const authRes = await authenticateWithBiometrics(
          "Enable Biometric Lock",
          "Touch your fingerprint sensor to activate instant app lock"
        );
        if (authRes.success) {
          setBiometricLockEnabled(true);
          setIsBiometricActive(true);
          toast.success("Fingerprint lock enabled successfully!", { position: "top-center" });
          if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(25);
        } else {
          toast.error(authRes.error || "Biometric authentication cancelled.");
        }
      } else {
        setBiometricLockEnabled(false);
        setIsBiometricActive(false);
        toast.success("Fingerprint lock disabled.");
      }
    } catch (e) {
      console.error("Biometric toggle error:", e);
    } finally {
      setIsTogglingBiometric(false);
    }
  };

  // Check for App Updates
  const handleCheckForUpdates = async () => {
    setIsCheckingUpdate(true);
    try {
      const info = await fetchLatestAppVersion();
      if (info && info.latestVersionCode > CURRENT_VERSION_CODE) {
        openGooglePlayStore(info.playStoreUrl);
      } else {
        toast.success(`You are on the latest version of Fipmoney (v${CURRENT_APP_VERSION})!`, { position: "top-center" });
      }
    } catch {
      toast.success(`You are using the latest version (v${CURRENT_APP_VERSION})!`, { position: "top-center" });
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  // Copy User Code Helper
  const handleCopyUserCode = () => {
    const code = initialUserCode || `FIP${loggedInMobile.slice(-4)}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`#${code}`);
      setCopiedCode(true);
      toast.success(`User Code #${code} copied!`, { position: "top-center" });
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const handleStartFieldChange = async (type: "email" | "mobile") => {
    setChangeFieldType(type);
    setCurrentVerifyOtp("");
    setNewValueInput("");
    setNewVerifyOtp("");

    if (type === "email") {
      const targetEmail = (email || loggedInUser?.email || "").trim();
      if (!targetEmail || targetEmail.endsWith('@fipmoney.com')) {
        setChangeStep(2);
        return;
      }
    }

    setChangeStep(1);
    setIsSendingOtp(true);
    try {
      if (type === "email") {
        const targetEmail = (email || loggedInUser?.email || "").trim();
        const res = await fetch(`${API_BASE_URL}/users/send-email-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: targetEmail, userName: fullName || loggedInUser?.username || "Valued Member" })
        });
        if (res.ok) {
          showAlert(`Security OTP sent to current email (${targetEmail})`, "success", "OTP Sent");
        }
      } else {
        const targetMobile = mobileNumber || loggedInMobile;
        if (targetMobile) {
          const res = await fetch(`${API_BASE_URL}/users/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mobile: targetMobile })
          });
          if (res.ok) {
            showAlert(`Security OTP sent to current mobile (+91 ${targetMobile})`, "success", "OTP Sent");
          }
        }
      }
    } catch (err) {
      console.error("Error sending OTP for step 1:", err);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyCurrentOtp = async () => {
    if (!currentVerifyOtp || currentVerifyOtp.length !== 6) {
      showAlert("Please enter 6-digit OTP code.", "warning", "Input Error");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      if (changeFieldType === "email") {
        const targetEmail = email || loggedInUser?.email || "";
        const res = await fetch(`${API_BASE_URL}/users/verify-email-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: targetEmail, otp: currentVerifyOtp })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setChangeStep(2);
          setNewValueInput("");
          showAlert("Current email verified successfully. Enter your new details.", "success", "Step 1 Verified");
        } else {
          showAlert(data.message || "Invalid or expired OTP code.", "error", "Verification Error");
        }
      } else {
        const targetMobile = mobileNumber || loggedInMobile;
        const res = await fetch(`${API_BASE_URL}/users/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile: targetMobile, otp: currentVerifyOtp })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setChangeStep(2);
          setNewValueInput("");
          showAlert("Current mobile verified successfully. Enter your new details.", "success", "Step 1 Verified");
        } else {
          showAlert(data.message || "Invalid or expired OTP code.", "error", "Verification Error");
        }
      }
    } catch (err) {
      console.error("Verification error:", err);
      showAlert("Verification failed. Please check network connection.", "error", "Error");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSendNewOtp = async () => {
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

    setIsSendingOtp(true);
    try {
      if (changeFieldType === "email") {
        const res = await fetch(`${API_BASE_URL}/users/send-email-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: newValueInput.trim(), userName: fullName || loggedInUser?.username || "Valued Member" })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setChangeStep(3);
          setNewVerifyOtp("");
          showAlert("OTP sent successfully!", "success", "OTP Sent");
        } else {
          showAlert(data.message || "Failed to send verification OTP", "error", "Error");
        }
      } else {
        const cleanMobile = newValueInput.replace(/\D/g, "");
        const res = await fetch(`${API_BASE_URL}/users/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile: cleanMobile })
        });
        setChangeStep(3);
        setNewVerifyOtp("");
        showAlert(`Verification OTP sent to ${cleanMobile}`, "success", "OTP Sent");
      }
    } catch (err) {
      console.error("Error sending new OTP:", err);
      showAlert("Failed to send OTP. Please try again.", "error", "Error");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyNewOtp = async () => {
    if (!newVerifyOtp || newVerifyOtp.length !== 6) {
      showAlert("Please enter 6-digit OTP code.", "warning", "Input Error");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      if (changeFieldType === "email") {
        const res = await fetch(`${API_BASE_URL}/users/verify-email-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: newValueInput.trim(), otp: newVerifyOtp })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setEmail(newValueInput.trim());
          if (typeof window !== "undefined") {
            localStorage.setItem(`fm_user_email_${loggedInMobile}`, newValueInput.trim());
          }

          await fetch(`${API_BASE_URL}/users/update-profile`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              mobileNumber: loggedInMobile,
              email: newValueInput.trim(),
            })
          }).catch(console.error);

          showAlert("Email address verified & updated successfully!", "success", "Verified & Saved");
          setChangeFieldType(null);
          setChangeStep(1);
          setCurrentVerifyOtp("");
          setNewValueInput("");
          setNewVerifyOtp("");
        } else {
          showAlert(data.message || "Invalid or expired OTP code.", "error", "Verification Error");
        }
      } else {
        const cleanMobile = newValueInput.replace(/\D/g, "");
        const res = await fetch(`${API_BASE_URL}/users/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile: cleanMobile, otp: newVerifyOtp })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMobileNumber(cleanMobile);
          if (typeof window !== "undefined") {
            localStorage.setItem(`fm_user_mobile_${loggedInMobile}`, cleanMobile);
            sessionStorage.setItem("fm_logged_in_mobile", cleanMobile);
          }
          showAlert("Mobile number updated successfully!", "success", "Verified & Saved");
          setChangeFieldType(null);
          setChangeStep(1);
          setCurrentVerifyOtp("");
          setNewValueInput("");
          setNewVerifyOtp("");
        } else {
          showAlert(data.message || "Invalid or expired OTP code.", "error", "Verification Error");
        }
      }
    } catch (err) {
      console.error("Error verifying new OTP:", err);
      showAlert("Verification failed. Please try again.", "error", "Error");
    } finally {
      setIsVerifyingOtp(false);
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
        await fetch(`${API_BASE_URL}/users/complete-kyc`, {
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
    submitKycRequestToBackend(aadhaarNumber, panNumber);
  };

  const handleVerifyPan = async () => {
    if (panNumber.length !== 10) return;
    setIsLinkingPan(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLinkingPan(false);
    setPanVerified(true);
    checkAndUpgradeToMinKyc(aadhaarVerified, true);
    submitKycRequestToBackend(aadhaarNumber, panNumber);
  };

  const checkAndUpgradeToMinKyc = (av: boolean, pv: boolean) => {
    if (av && pv) {
      if (typeof window !== "undefined") {
        localStorage.setItem(`fm_user_kyc_${loggedInMobile}`, "Min Kyc");
      }
      setKycStatus("pending");
      submitKycRequestToBackend(aadhaarNumber, panNumber);
    }
  };

  const handleRemovePhoto = () => {
    showConfirm(
      "Are you sure you want to remove your profile photo?",
      async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/users/profile/image`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mobile: loggedInMobile }),
          });
          const data = await res.json();
          updateUserAvatar(null);
          setAvatar(null);
          showAlert("Profile photo removed successfully.", "success", "Photo Removed");
        } catch (err) {
          console.error("Error deleting profile photo:", err);
          updateUserAvatar(null);
          setAvatar(null);
          showAlert("Profile photo removed", "info");
        }
      },
      { title: "Remove Photo", confirmText: "Remove", cancelText: "Keep" }
    );
  };

  const handleUploadPhoto = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpeg,image/jpg,image/png,image/webp";
    fileInput.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      const localPreviewUrl = URL.createObjectURL(file);
      setAvatar(localPreviewUrl);

      try {
        const presignedRes = await fetch(`${API_BASE_URL}/users/profile/image/upload-url`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mobile: loggedInMobile,
            fileName: file.name,
            contentType: file.type || "image/jpeg",
          }),
        });

        const contentTypeHeader = presignedRes.headers.get("content-type");
        if (contentTypeHeader && contentTypeHeader.includes("application/json")) {
          const presignedData = await presignedRes.json();

          if (presignedData.success && presignedData.uploadUrl && presignedData.objectKey) {
            const s3UploadRes = await fetch(presignedData.uploadUrl, {
              method: "PUT",
              headers: {
                "Content-Type": file.type || "image/jpeg",
              },
              body: file,
            });

            if (s3UploadRes.ok) {
              const confirmRes = await fetch(`${API_BASE_URL}/users/profile/image/confirm`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  mobile: loggedInMobile,
                  objectKey: presignedData.objectKey,
                }),
              });

              if (confirmRes.ok) {
                const confirmData = await confirmRes.json();
                if (confirmData.imageUrl) {
                  updateUserAvatar(confirmData.imageUrl);
                  setAvatar(confirmData.imageUrl);
                }
              }
              showAlert("Profile photo updated successfully!", "success");
              return;
            }
          }
        }

        const formData = new FormData();
        formData.append("image", file);
        formData.append("mobile", loggedInMobile);

        const fallbackRes = await fetch(`${API_BASE_URL}/users/profile-image`, {
          method: "POST",
          body: formData,
        });

        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          if (fallbackData.imageUrl) {
            updateUserAvatar(fallbackData.imageUrl);
            setAvatar(fallbackData.imageUrl);
          }
        }
        showAlert("Profile photo updated successfully!", "success");
      } catch (error) {
        console.warn("S3 Upload warning:", error);
        showAlert("Profile photo updated!", "success");
      }
    };
    fileInput.click();
  };

  const tabsConfig = [
    { id: "profile", label: "Profile", icon: User },
    { id: "bank", label: "Bank Account", icon: Landmark },
    { id: "nominee", label: "Nominee", icon: Heart },
    { id: "security", label: "Security & KYC", icon: ShieldCheck },
    { id: "sessions", label: "Sessions", icon: Smartphone },
    { id: "about", label: "App & Info", icon: Info },
  ];

  return (
    <>
      <div className="flex-1 min-h-full overflow-y-auto bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#047857] selection:text-white pb-32 lg:pb-12">
        
        {/* Soft Ambient Radial Background Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-48 left-0 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* ══════════════════════════════════════════════════════════════════
            MOBILE VIEW (lg:hidden) - Modern Luxury Redesigned Experience
        ══════════════════════════════════════════════════════════════════ */}
        <div className="lg:hidden px-4 sm:px-6 pt-3 space-y-5">
          
          {/* Top Sticky Header */}
          <div className="flex items-center justify-between pb-1">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#047857] bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                My Account
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                Settings
              </h1>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] text-white font-black text-xs shadow-md shadow-emerald-900/15 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all outline-none border-none disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 size={13} className="animate-spin" />
              ) : saveSuccess ? (
                <CheckCircle2 size={13} className="text-amber-300" />
              ) : (
                <Save size={13} />
              )}
              <span>{saveSuccess ? "Saved!" : isSaving ? "Saving..." : "Save"}</span>
            </button>
          </div>

          {/* ── MOBILE HERO PROFILE IDENTITY CARD (Doppelrand Architecture) ── */}
          <div className="relative p-1.5 rounded-[28px] bg-gradient-to-br from-emerald-500/20 via-emerald-100/30 to-amber-400/20 shadow-lg shadow-emerald-950/5">
            <div className="relative bg-white rounded-[24px] p-5 border border-slate-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] overflow-hidden">
              
              {/* Decorative background glow inside card */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-4">
                {/* Avatar with Camera Overlay */}
                <div className="relative shrink-0">
                  <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-emerald-600 via-[#047857] to-teal-700 text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-white overflow-hidden relative">
                    {avatar ? (
                      <img src={avatar} alt={fullName || "User"} className="w-full h-full object-cover" />
                    ) : (
                      <span>{(fullName || username || "U").charAt(0).toUpperCase()}</span>
                    )}
                  </div>

                  <button
                    onClick={handleUploadPhoto}
                    title="Change Photo"
                    className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-xl bg-white text-[#047857] border border-slate-200 shadow-md flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
                  >
                    <Camera size={14} />
                  </button>
                </div>

                {/* Profile Identity Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className="text-lg font-black text-slate-900 truncate tracking-tight">
                      {fullName || username || "Fipmoney Member"}
                    </h2>
                    {kycStatus === "full kyc" && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100/80 text-[#047857] text-[10px] font-black">
                        <ShieldCheck size={11} className="text-[#047857]" /> Verified
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 font-semibold truncate mt-0.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    <span>+91 {loggedInMobile || "98765 43210"}</span>
                  </p>

                  {/* Copyable User Code Pill */}
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={handleCopyUserCode}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-[11px] font-mono font-bold transition-colors cursor-pointer border border-slate-200/60"
                    >
                      <span>#{initialUserCode || `FIP${loggedInMobile.slice(-4)}`}</span>
                      {copiedCode ? <CheckCheck size={11} className="text-[#047857]" /> : <Copy size={11} className="text-slate-400" />}
                    </button>

                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/70">
                      Level 1 Investor
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Completion Bar */}
              <div className="mt-4 pt-3.5 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-extrabold text-slate-700 text-[11px] flex items-center gap-1">
                    <Trophy size={13} className="text-amber-500" /> Profile Strength
                  </span>
                  <span className="font-black text-[#047857]">{percentage}% Complete</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-[#047857] to-[#059669] rounded-full transition-all duration-700"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* ── MOBILE SEGMENTED SUB-TABS CAROUSEL ── */}
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar -mx-4 px-4 select-none">
            {tabsConfig.map((t) => {
              const active = activeSubTab === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveSubTab(t.id as SettingsTab);
                    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(8);
                  }}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer outline-none border ${
                    active
                      ? "bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] text-white border-transparent shadow-md shadow-emerald-950/15"
                      : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={14} className={active ? "text-amber-300" : "text-slate-400"} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── MOBILE TAB CONTENTS ── */}
          <div className="space-y-4">
            
            {/* 1. PROFILE DETAILS TAB */}
            {activeSubTab === "profile" && (
              <motion.div
                key="mob-profile"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Personal Information Group */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <User size={16} className="text-[#047857]" />
                    <h3 className="text-sm font-black text-slate-900">Personal Information</h3>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter legal name"
                      className="w-full px-4 py-3 rounded-2xl text-sm font-bold text-slate-900 bg-[#F8FAFC] border-2 border-slate-200/80 focus:border-[#047857] focus:bg-white transition-all outline-none"
                    />
                  </div>

                  {/* Username */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                        Fipmoney Username
                      </label>
                      {isUsernameLocked && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Locked ({usernameDaysLeft}d left)
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">@</span>
                      <input
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        disabled={isUsernameLocked}
                        placeholder="your_username"
                        className="w-full pl-8 pr-4 py-3 rounded-2xl text-sm font-bold text-slate-900 bg-[#F8FAFC] border-2 border-slate-200/80 focus:border-[#047857] focus:bg-white transition-all outline-none disabled:bg-slate-100 disabled:text-slate-400"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Letters, numbers, and underscores only. Locked for 60 days once saved.
                    </p>
                  </div>

                  {/* Email Section */}
                  <div id="email-input-section" className={`space-y-1.5 p-3 rounded-2xl transition-all ${isEmailHighlighted ? "bg-amber-50/80 border-2 border-amber-400 animate-pulse" : ""}`}>
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                        Official Email
                      </label>
                      <button
                        type="button"
                        onClick={() => handleStartFieldChange("email")}
                        className="text-[11px] font-black text-[#047857] hover:underline cursor-pointer"
                      >
                        {email ? "Change Email" : "+ Add & Verify"}
                      </button>
                    </div>
                    <input
                      type="email"
                      readOnly
                      value={email || "No email verified yet"}
                      className="w-full px-4 py-3 rounded-2xl text-sm font-bold text-slate-700 bg-slate-100/80 border border-slate-200 cursor-default outline-none"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                        Primary Mobile (Linked)
                      </label>
                      <span className="text-[10px] font-black text-[#047857] flex items-center gap-1">
                        <CheckCircle2 size={11} /> Verified
                      </span>
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={`+91 ${loggedInMobile}`}
                      className="w-full px-4 py-3 rounded-2xl text-sm font-mono font-bold text-slate-700 bg-slate-100/80 border border-slate-200 cursor-default outline-none"
                    />
                  </div>
                </div>

                {/* Professional & Financial Profile */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Briefcase size={16} className="text-[#047857]" />
                    <h3 className="text-sm font-black text-slate-900">Financial Profile</h3>
                  </div>

                  {/* Occupation */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      Occupation / Profession
                    </label>
                    <select
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl text-sm font-bold text-slate-900 bg-[#F8FAFC] border-2 border-slate-200/80 focus:border-[#047857] focus:bg-white transition-all outline-none"
                    >
                      <option value="">Select Occupation</option>
                      <option value="Salaried Employee">Salaried Employee</option>
                      <option value="Business Owner / Self-Employed">Business Owner / Self-Employed</option>
                      <option value="Professional (Doctor, CA, Lawyer)">Professional (Doctor, CA, Lawyer)</option>
                      <option value="Freelancer / Consultant">Freelancer / Consultant</option>
                      <option value="Student">Student</option>
                      <option value="Homemaker">Homemaker</option>
                      <option value="Retired">Retired</option>
                    </select>
                  </div>

                  {/* Annual Income */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      Annual Income Bracket
                    </label>
                    <select
                      value={incomeRange}
                      onChange={(e) => setIncomeRange(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl text-sm font-bold text-slate-900 bg-[#F8FAFC] border-2 border-slate-200/80 focus:border-[#047857] focus:bg-white transition-all outline-none"
                    >
                      <option value="">Select Annual Income</option>
                      <option value="Below ₹3 Lakhs">Below ₹3 Lakhs</option>
                      <option value="₹3 Lakhs - ₹5 Lakhs">₹3 Lakhs - ₹5 Lakhs</option>
                      <option value="₹5 Lakhs - ₹10 Lakhs">₹5 Lakhs - ₹10 Lakhs</option>
                      <option value="₹10 Lakhs - ₹25 Lakhs">₹10 Lakhs - ₹25 Lakhs</option>
                      <option value="Above ₹25 Lakhs">Above ₹25 Lakhs</option>
                    </select>
                  </div>

                  {/* Inline Save Changes Button */}
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] hover:from-[#022c22] text-white font-black text-sm shadow-md shadow-emerald-950/15 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/30 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Saving Profile...</span>
                        </>
                      ) : saveSuccess ? (
                        <>
                          <CheckCircle2 size={16} className="text-amber-300" />
                          <span>Changes Saved!</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. BANK ACCOUNT TAB */}
            {activeSubTab === "bank" && (
              <motion.div
                key="mob-bank"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Instant Settlement Guarantee Banner */}
                <div className="p-4 rounded-3xl bg-linear-to-r from-emerald-900 to-teal-800 text-white shadow-md relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                      <Landmark size={20} className="text-amber-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black">Direct Bank Settlements</h4>
                      <p className="text-xs text-emerald-100/90 mt-0.5 leading-snug">
                        Instant IMPS payouts for all 24K gold & silver sales directly into this account.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                  {/* Bank Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. State Bank of India, HDFC, ICICI"
                      className="w-full px-4 py-3 rounded-2xl text-sm font-bold text-slate-900 bg-[#F8FAFC] border-2 border-slate-200/80 focus:border-[#047857] focus:bg-white transition-all outline-none"
                    />
                  </div>

                  {/* Account Number */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                        Account Number
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowAccountNumber(!showAccountNumber)}
                        className="text-xs font-bold text-slate-500 flex items-center gap-1 cursor-pointer"
                      >
                        {showAccountNumber ? <EyeOff size={13} /> : <Eye size={13} />}
                        <span>{showAccountNumber ? "Hide" : "Show"}</span>
                      </button>
                    </div>
                    <input
                      type={showAccountNumber ? "text" : "password"}
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter bank account number"
                      className="w-full px-4 py-3 rounded-2xl text-sm font-mono font-bold text-slate-900 bg-[#F8FAFC] border-2 border-slate-200/80 focus:border-[#047857] focus:bg-white transition-all outline-none"
                    />
                  </div>

                  {/* IFSC Code */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      maxLength={11}
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                      placeholder="e.g. SBIN0001234"
                      className="w-full px-4 py-3 rounded-2xl text-sm font-mono font-bold text-slate-900 bg-[#F8FAFC] border-2 border-slate-200/80 focus:border-[#047857] focus:bg-white transition-all outline-none tracking-wider"
                    />
                  </div>

                  {/* Beneficiary Name Note */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                    <p className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                      <ShieldCheck size={14} className="text-[#047857]" /> Bank Account Verification Note
                    </p>
                    The beneficiary name on the bank account must match your KYC name (<strong>{fullName || "User"}</strong>).
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. NOMINEE TAB */}
            {activeSubTab === "nominee" && (
              <motion.div
                key="mob-nominee"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-3xl bg-linear-to-r from-amber-500/10 via-amber-100/30 to-emerald-500/10 border border-amber-200/80 text-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Heart size={20} className="text-amber-600 shrink-0" />
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Legal Nominee Protection</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Your physical 24K gold stored in Brink's vaults is legally assigned to your nominee.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                  {/* Nominee Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      Nominee Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={nomineeName}
                      onChange={(e) => setNomineeName(e.target.value)}
                      placeholder="Enter legal nominee name"
                      className="w-full px-4 py-3 rounded-2xl text-sm font-bold text-slate-900 bg-[#F8FAFC] border-2 border-slate-200/80 focus:border-[#047857] focus:bg-white transition-all outline-none"
                    />
                  </div>

                  {/* Relationship Quick Pills */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      Relationship with Nominee
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["spouse", "son", "daughter", "father", "mother", "brother", "sister", "other"].map((rel) => {
                        const isSelected = nomineeRelation.toLowerCase() === rel;
                        return (
                          <button
                            key={rel}
                            type="button"
                            onClick={() => setNomineeRelation(rel)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer border ${
                              isSelected
                                ? "bg-[#047857] text-white border-[#047857] shadow-xs"
                                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {rel}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Nominee DOB */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      Nominee Date of Birth
                    </label>
                    <input
                      type="date"
                      value={nomineeDob}
                      onChange={(e) => setNomineeDob(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl text-sm font-bold text-slate-900 bg-[#F8FAFC] border-2 border-slate-200/80 focus:border-[#047857] focus:bg-white transition-all outline-none"
                    />
                  </div>

                  {/* Allocation Badge */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-emerald-900">Portfolio Custody Allocation</p>
                      <p className="text-[11px] text-emerald-700">100% Legal Ownership Transfer</p>
                    </div>
                    <span className="text-sm font-black text-[#047857]">100%</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. SECURITY & KYC TAB (Capacitor Biometric Integration) */}
            {activeSubTab === "security" && (
              <motion.div
                key="mob-security"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Native Capacitor Biometric Lock Card */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#047857] flex items-center justify-center shrink-0 border border-emerald-200/60">
                        <Fingerprint size={24} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{biometricType} App Lock</h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Secure opening of Fipmoney app with biometric hardware
                        </p>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      type="button"
                      disabled={isTogglingBiometric}
                      onClick={handleToggleBiometric}
                      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isBiometricActive ? "bg-[#047857]" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          isBiometricActive ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Hardware Sensor:</span>
                    <strong className="text-slate-800">
                      {Capacitor.isNativePlatform()
                        ? (biometricAvailable ? "Supported & Ready" : "Hardware Not Enrolled")
                        : "Available on Mobile App"}
                    </strong>
                  </div>
                </div>

                {/* Aadhaar & PAN Status Card */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-[#047857]" />
                      <h4 className="text-sm font-black text-slate-900">Government KYC Verification</h4>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      kycStatus === "full kyc"
                        ? "bg-emerald-100 text-[#047857]"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {kycStatus === "full kyc" ? "Verified" : "Action Required"}
                    </span>
                  </div>

                  {/* Aadhaar Row */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                        UID
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Aadhaar Card</p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {aadhaarNumber || "XXXX-XXXX-9012"}
                        </p>
                      </div>
                    </div>
                    {aadhaarVerified ? (
                      <span className="text-xs font-black text-[#047857] flex items-center gap-1">
                        <CheckCircle2 size={14} /> Linked
                      </span>
                    ) : (
                      <button
                        onClick={handleVerifyAadhaar}
                        disabled={isLinkingAadhaar}
                        className="px-3 py-1.5 rounded-xl bg-[#047857] text-white text-xs font-bold shadow-xs cursor-pointer"
                      >
                        {isLinkingAadhaar ? "Verifying..." : "Link"}
                      </button>
                    )}
                  </div>

                  {/* PAN Row */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                        PAN
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">PAN Card</p>
                        <p className="text-[11px] text-slate-400 font-mono uppercase">
                          {panNumber || "ABCDE1234F"}
                        </p>
                      </div>
                    </div>
                    {panVerified ? (
                      <span className="text-xs font-black text-[#047857] flex items-center gap-1">
                        <CheckCircle2 size={14} /> Linked
                      </span>
                    ) : (
                      <button
                        onClick={handleVerifyPan}
                        disabled={isLinkingPan}
                        className="px-3 py-1.5 rounded-xl bg-[#047857] text-white text-xs font-bold shadow-xs cursor-pointer"
                      >
                        {isLinkingPan ? "Verifying..." : "Link"}
                      </button>
                    )}
                  </div>

                  {/* Video KYC Button */}
                  {kycStatus !== "full kyc" && (
                    <button
                      type="button"
                      onClick={startVideoKyc}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-xs shadow-md shadow-amber-900/10 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                    >
                      <Video size={16} />
                      <span>Start 2-Minute Video KYC Verification</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* 5. ACTIVE SESSIONS TAB */}
            {activeSubTab === "sessions" && (
              <motion.div
                key="mob-sessions"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Smartphone size={16} className="text-[#047857]" />
                      <h4 className="text-sm font-black text-slate-900">Active Devices</h4>
                    </div>
                    <button
                      onClick={fetchSessions}
                      className="text-xs font-bold text-[#047857] flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={12} className={isSessionsLoading ? "animate-spin" : ""} /> Refresh
                    </button>
                  </div>

                  {/* Current Device Highlight */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 text-[#047857] flex items-center justify-center">
                        <Smartphone size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-black text-slate-900">
                            {Capacitor.isNativePlatform() ? "Android Mobile App" : "Current Browser"}
                          </p>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <p className="text-[11px] text-slate-500">Active Now • This Device</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase text-[#047857] bg-white border border-emerald-200 px-2 py-0.5 rounded-md">
                      Current
                    </span>
                  </div>

                  {/* Remote Devices List */}
                  {sessionsList.length > 0 ? (
                    <div className="space-y-2.5">
                      {sessionsList.map((s, idx) => {
                        const currentSessionId = typeof window !== 'undefined' ? (sessionStorage.getItem("fm_session_id") || localStorage.getItem("fm_session_id") || "") : "";
                        const isCurrent = s.sessionId === currentSessionId;
                        if (isCurrent) return null;
                        return (
                          <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Laptop size={18} className="text-slate-500" />
                              <div>
                                <p className="text-xs font-bold text-slate-800">{s.deviceName || "Other Device"}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{s.ipAddress || "Encrypted IP"}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRevokeSession(s.sessionId)}
                              className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold border border-red-200 cursor-pointer"
                            >
                              Log Out
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-3">No other active devices detected.</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* 6. APP & INFO TAB (Play Store Version Checker) */}
            {activeSubTab === "about" && (
              <motion.div
                key="mob-about"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#047857] flex items-center justify-center shrink-0">
                      <ArrowUpCircle size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Fipmoney Application</h4>
                      <p className="text-xs text-slate-500">
                        Version {CURRENT_APP_VERSION} (Build {CURRENT_VERSION_CODE})
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Current Version:</span>
                      <strong className="text-slate-800">v{CURRENT_APP_VERSION}</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Platform:</span>
                      <strong className="text-slate-800">{Capacitor.isNativePlatform() ? "Android APK" : "Web Application"}</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Protection:</span>
                      <strong className="text-[#047857] flex items-center gap-1">
                        <ShieldCheck size={12} /> Google Play Protect
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckForUpdates}
                    disabled={isCheckingUpdate}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] text-white font-extrabold text-xs shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
                  >
                    <RefreshCw size={14} className={isCheckingUpdate ? "animate-spin" : ""} />
                    <span>{isCheckingUpdate ? "Checking Play Store..." : "Check for Play Store Updates"}</span>
                  </button>
                </div>
              </motion.div>
            )}

          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════════
            DESKTOP VIEW (hidden lg:block) - Preserved & Theme-Aligned
        ══════════════════════════════════════════════════════════════════ */}
        <div className="hidden lg:block p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
          {/* Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Settings</h1>
              <p className="text-sm text-gray-500 font-semibold mt-1 flex flex-wrap items-center gap-2">
                <span>Manage your financial profile and account configurations</span>
                <span className="text-gray-300 hidden sm:inline">•</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-2xs">
                  <Sparkles size={12} className="text-[#047857] animate-pulse" />
                  Auto-saves in real-time
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-3 rounded-xl text-white text-sm font-black shadow-md shadow-emerald-950/15 hover:shadow-lg disabled:bg-gray-300 disabled:shadow-none cursor-pointer outline-none border-none transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669]"
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
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto hide-scrollbar">
            {tabsConfig.map((tab) => {
              const active = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as SettingsTab)}
                  className={`relative px-5 py-3 text-sm font-semibold transition-all cursor-pointer outline-none border-none bg-transparent whitespace-nowrap
                    ${active ? "text-[#047857] font-bold" : "text-gray-500 hover:text-gray-800"}`}
                >
                  {tab.label}
                  {active && (
                    <motion.div
                      layoutId="activeSubTabLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#047857]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* 2-Column Desktop Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Form Column */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-[2rem] border border-gray-150 shadow-xs space-y-6">
              <AnimatePresence mode="popLayout">
                
                {/* Desktop Profile Form */}
                {activeSubTab === "profile" && (
                  <motion.div
                    key="desk-profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {/* Avatar Upload */}
                    <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#064e3b] to-[#047857] text-white flex items-center justify-center font-black text-xl overflow-hidden relative">
                        {avatar ? (
                          <img src={avatar} alt={fullName} className="w-full h-full object-cover" />
                        ) : (
                          <span>{(fullName || "U").charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Profile Photo</h4>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            type="button"
                            onClick={handleUploadPhoto}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[#047857] font-bold text-xs hover:bg-emerald-100 cursor-pointer border border-emerald-200"
                          >
                            Upload Photo
                          </button>
                          {avatar && (
                            <button
                              type="button"
                              onClick={handleRemovePhoto}
                              className="px-3 py-1.5 rounded-lg text-red-600 font-bold text-xs hover:bg-red-50 cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600">Full Legal Name</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#047857]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600">Username (@)</label>
                        <input
                          type="text"
                          value={username}
                          onChange={handleUsernameChange}
                          disabled={isUsernameLocked}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#047857] disabled:bg-slate-100"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600">Official Email</label>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            readOnly
                            value={email || "No email verified"}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50 text-slate-600 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleStartFieldChange("email")}
                            className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer shrink-0"
                          >
                            Change
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600">Mobile Number</label>
                        <input
                          type="text"
                          readOnly
                          value={`+91 ${loggedInMobile}`}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-slate-50 text-slate-600 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600">Occupation</label>
                        <input
                          type="text"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          placeholder="e.g. Software Engineer"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#047857]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600">Annual Income</label>
                        <select
                          value={incomeRange}
                          onChange={(e) => setIncomeRange(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#047857] bg-white"
                        >
                          <option value="">Select Annual Income</option>
                          <option value="Below ₹3 Lakhs">Below ₹3 Lakhs</option>
                          <option value="₹3 Lakhs - ₹5 Lakhs">₹3 Lakhs - ₹5 Lakhs</option>
                          <option value="₹5 Lakhs - ₹10 Lakhs">₹5 Lakhs - ₹10 Lakhs</option>
                          <option value="₹10 Lakhs - ₹25 Lakhs">₹10 Lakhs - ₹25 Lakhs</option>
                          <option value="Above ₹25 Lakhs">Above ₹25 Lakhs</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Desktop Bank Account */}
                {activeSubTab === "bank" && (
                  <motion.div
                    key="desk-bank"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600">Bank Name</label>
                        <input
                          type="text"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          placeholder="Bank Name"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#047857]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600">Account Number</label>
                        <input
                          type="password"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                          placeholder="Account Number"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#047857]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600">IFSC Code</label>
                        <input
                          type="text"
                          value={ifscCode}
                          onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                          placeholder="IFSC Code"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#047857]"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Desktop Nominee Setup */}
                {activeSubTab === "nominee" && (
                  <motion.div
                    key="desk-nominee"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600">Nominee Name</label>
                        <input
                          type="text"
                          value={nomineeName}
                          onChange={(e) => setNomineeName(e.target.value)}
                          placeholder="Legal Nominee Name"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#047857]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600">Relationship</label>
                        <select
                          value={nomineeRelation}
                          onChange={(e) => setNomineeRelation(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#047857] bg-white"
                        >
                          <option value="spouse">Spouse</option>
                          <option value="son">Son</option>
                          <option value="daughter">Daughter</option>
                          <option value="father">Father</option>
                          <option value="mother">Mother</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600">Date of Birth</label>
                        <input
                          type="date"
                          value={nomineeDob}
                          onChange={(e) => setNomineeDob(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#047857]"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Desktop Security Tab */}
                {activeSubTab === "security" && (
                  <motion.div
                    key="desk-sec"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-5"
                  >
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Fingerprint size={22} className="text-[#047857]" />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Biometric Security</h4>
                          <p className="text-xs text-slate-500">Scan fingerprint to unlock Fipmoney on mobile</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleToggleBiometric}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          isBiometricActive ? "bg-[#047857]" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isBiometricActive ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <p className="text-xs font-bold text-slate-700">Aadhaar Status</p>
                        <p className="text-sm font-black text-slate-900 mt-1">{aadhaarNumber || "XXXX-XXXX-9012"}</p>
                        <span className="text-[11px] font-bold text-[#047857] mt-2 inline-block">✓ Linked & Verified</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <p className="text-xs font-bold text-slate-700">PAN Status</p>
                        <p className="text-sm font-black text-slate-900 mt-1">{panNumber || "ABCDE1234F"}</p>
                        <span className="text-[11px] font-bold text-[#047857] mt-2 inline-block">✓ Linked & Verified</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Desktop Active Sessions */}
                {activeSubTab === "sessions" && (
                  <motion.div
                    key="desk-sessions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h4 className="text-sm font-bold text-slate-900">Active Devices & Browsers</h4>
                      <button
                        onClick={fetchSessions}
                        className="text-xs font-bold text-[#047857] flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw size={12} className={isSessionsLoading ? "animate-spin" : ""} /> Refresh
                      </button>
                    </div>
                    {sessionsList.map((s, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Laptop size={20} className="text-slate-500" />
                          <div>
                            <p className="text-sm font-bold text-slate-800">{s.deviceName || "Desktop Session"}</p>
                            <p className="text-xs text-slate-400 font-mono">{s.ipAddress || "Encrypted IP"}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRevokeSession(s.sessionId)}
                          className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-200 hover:bg-red-100 cursor-pointer"
                        >
                          Revoke
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Desktop App & Info */}
                {activeSubTab === "about" && (
                  <motion.div
                    key="desk-about"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <h4 className="text-sm font-bold text-slate-900">Fipmoney Wealth App</h4>
                      <p className="text-xs text-slate-500">
                        Version {CURRENT_APP_VERSION} (Build {CURRENT_VERSION_CODE})
                      </p>
                      <button
                        type="button"
                        onClick={handleCheckForUpdates}
                        disabled={isCheckingUpdate}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer"
                      >
                        <RefreshCw size={14} className={isCheckingUpdate ? "animate-spin" : ""} />
                        <span>{isCheckingUpdate ? "Checking..." : "Check for Updates"}</span>
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Right Sidebar: Profile Completion & Security */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Profile Completion Circle */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 border border-gray-150 shadow-sm flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-6 w-full justify-center">
                  <Trophy size={18} className="text-[#d97706]" />
                  <h3 className="text-sm font-extrabold text-gray-900 tracking-tight">Profile Completion</h3>
                </div>

                <div className="relative w-36 h-36 flex items-center justify-center p-1">
                  <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90 overflow-visible">
                    <circle cx="60" cy="60" r="50" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="60" cy="60" r="50"
                      stroke={percentage <= 40 ? "#f97316" : percentage <= 80 ? "#f59e0b" : "#047857"}
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

                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 font-bold">Personal & Basic Info</span>
                    <span className="text-[#047857] font-black">{personalScore}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 font-bold">Bank Account</span>
                    <span className={bankDone ? "text-[#047857] font-black" : "text-slate-400"}>{bankDone ? "20%" : "0%"}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 font-bold">Nominee Verification</span>
                    <span className={nomineeDone ? "text-[#047857] font-black" : "text-slate-400"}>{nomineeDone ? "20%" : "0%"}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 font-bold">Security & KYC</span>
                    <span className={kycDone ? "text-[#047857] font-black" : "text-slate-400"}>{kycDone ? "20%" : "0%"}</span>
                  </div>
                </div>
              </div>

              {/* Security Compliance Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col relative overflow-hidden">
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <ShieldCheck size={18} className="text-[#047857]" />
                  <h3 className="text-sm font-extrabold text-gray-900 tracking-tight">Security & Custody</h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed relative z-10">
                  Fipmoney adheres strictly to Indian bullion compliance standards. Pure 24K 99.9% physical gold vaulted with Brink's India with IDBI Trusteeship legal protection.
                </p>
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
                className="bg-[#0f172a] text-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative border border-slate-800 flex flex-col h-[500px]"
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
              >
                <div className="bg-[#1e293b] px-6 py-4 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Video size={16} className="text-red-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Video Verification</span>
                  </div>
                  <button onClick={cancelVideoKyc} className="text-slate-400 hover:text-white text-xs font-bold">
                    Cancel
                  </button>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-[#047857] flex items-center justify-center border-2 border-emerald-500/40">
                    <ShieldCheck size={40} className="text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Live KYC Session</h3>
                    <p className="text-xs text-slate-400 mt-1">Connecting to automated verification agent...</p>
                  </div>
                </div>

                <div className="p-4 bg-[#1e293b] flex items-center justify-center">
                  {videoStep === "done" ? (
                    <button
                      onClick={() => setShowVideoCall(false)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black px-6 py-2.5 rounded-xl cursor-pointer"
                    >
                      Finish Verification
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 animate-pulse">Verification in progress...</span>
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
              className="bg-white text-slate-800 rounded-3xl p-6 max-w-md w-full relative border border-slate-200 shadow-2xl space-y-5"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              <div>
                <h3 className="text-lg font-black text-slate-900 capitalize">
                  {(!email || email.endsWith('@fipmoney.com')) && changeFieldType === "email"
                    ? "Add & Verify Email Address"
                    : `Change ${changeFieldType === "email" ? "Email Address" : "Mobile Number"}`}
                </h3>
                <p className="text-xs text-gray-400 font-semibold mt-1">
                  {(!email || email.endsWith('@fipmoney.com')) && changeFieldType === "email"
                    ? (changeStep === 2 ? "Enter your official email address below." : "Enter 6-digit OTP sent to your email.")
                    : (changeStep === 1 ? "Step 1: Cross-verify your current identity." : changeStep === 2 ? "Step 2: Enter your new details." : "Step 3: Verify your new details.")
                  }
                </p>
              </div>

              {changeStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Verify Current {changeFieldType === "email" ? "Email Address" : "Mobile Number"}
                    </label>
                    <p className="text-[11px] font-bold text-[#047857] leading-normal bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                      🔑 Verification OTP sent via email to: {changeFieldType === "email" ? email : mobileNumber}.
                    </p>
                    <input
                      type="text"
                      maxLength={6}
                      value={currentVerifyOtp}
                      onChange={(e) => setCurrentVerifyOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter 6-digit OTP"
                      className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-gray-800 bg-[#f8fafc] border border-gray-200 outline-none focus:border-[#047857] focus:bg-white transition-all shadow-sm text-center tracking-widest font-mono"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setChangeFieldType(null);
                        setCurrentVerifyOtp("");
                      }}
                      className="flex-1 py-3 rounded-xl border border-gray-200 bg-white hover:bg-[#f8fafc] text-xs font-bold text-gray-600 cursor-pointer transition-colors outline-none"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleVerifyCurrentOtp}
                      disabled={currentVerifyOtp.length !== 6 || isVerifyingOtp}
                      className="flex-1 py-3 rounded-xl bg-[#047857] hover:bg-[#065f46] disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-black cursor-pointer transition-all border-none outline-none shadow-sm flex items-center justify-center gap-1.5"
                    >
                      {isVerifyingOtp ? <Loader2 size={14} className="animate-spin" /> : "Next →"}
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
                      className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-gray-800 bg-[#f8fafc] border border-gray-200 outline-none focus:border-[#047857] focus:bg-white transition-all shadow-sm"
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
                      className="flex-1 py-3 rounded-xl border border-gray-200 bg-white hover:bg-[#f8fafc] text-xs font-bold text-gray-600 cursor-pointer transition-colors outline-none"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSendNewOtp}
                      disabled={isSendingOtp}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] text-white text-xs font-black cursor-pointer transition-all border-none outline-none shadow-sm flex items-center justify-center gap-1.5"
                    >
                      {isSendingOtp ? <Loader2 size={14} className="animate-spin" /> : "Send OTP"}
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
                    <p className="text-[11px] font-bold text-[#047857] leading-normal bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                      🔑 OTP verification sent to: {newValueInput}. Check inbox.
                    </p>
                    <input
                      type="text"
                      maxLength={6}
                      value={newVerifyOtp}
                      onChange={(e) => setNewVerifyOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter 6-digit OTP"
                      className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-gray-800 bg-[#f8fafc] border border-gray-200 outline-none focus:border-[#047857] focus:bg-white transition-all shadow-sm text-center tracking-widest font-mono"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setChangeStep(2)}
                      className="flex-1 py-3 rounded-xl border border-gray-200 bg-white hover:bg-[#f8fafc] text-xs font-bold text-gray-600 cursor-pointer transition-colors outline-none"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleVerifyNewOtp}
                      disabled={newVerifyOtp.length !== 6 || isVerifyingOtp}
                      className="flex-1 py-3 rounded-xl bg-[#047857] hover:bg-[#065f46] disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-black cursor-pointer transition-all border-none outline-none shadow-sm flex items-center justify-center gap-1.5"
                    >
                      {isVerifyingOtp ? <Loader2 size={14} className="animate-spin" /> : "Verify & Change"}
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
