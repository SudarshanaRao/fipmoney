"use client";

import { MongoUser } from "./userStorage";

export interface ProfileTaskItem {
  id: string;
  category: "personal" | "bank" | "nominee" | "security";
  title: string;
  description: string;
  weight: number;
  isCompleted: boolean;
  actionText: string;
  targetTab: string;
}

export interface ProfileCompletionResult {
  percentage: number;
  personalScore: number; // Max 40%
  bankScore: number;     // Max 20%
  nomineeScore: number;  // Max 20%
  kycScore: number;      // Max 20%
  personalDone: boolean;
  bankDone: boolean;
  nomineeDone: boolean;
  kycDone: boolean;
  statusLabel: string;
  statusColor: string;
  statusBadgeBg: string;
  progressGradient: string;
}

export function calculateProfileCompletion(
  user: Partial<MongoUser> | null,
  overrideFields?: {
    fullName?: string;
    email?: string;
    mobileNumber?: string;
    hasAvatar?: boolean;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    nomineeName?: string;
    nomineeRelation?: string;
    nomineeDob?: string;
    panNumber?: string;
    aadhaarNumber?: string;
    isPinSet?: boolean;
  }
): ProfileCompletionResult {
  // 1. Avatar Photo (10%)
  let hasAvatar = false;
  if (overrideFields?.hasAvatar !== undefined) {
    hasAvatar = overrideFields.hasAvatar;
  } else if (user?.profileImage && user.profileImage.trim() !== "") {
    hasAvatar = true;
  } else if (typeof window !== "undefined") {
    const cleanMobile = (overrideFields?.mobileNumber || user?.mobileNumber || sessionStorage.getItem("fm_logged_in_mobile") || "").replace(/\D/g, "").slice(-10);
    if (cleanMobile) {
      const localAvatar = localStorage.getItem(`fm_user_avatar_${cleanMobile}`);
      if (localAvatar && localAvatar.trim() !== "") {
        hasAvatar = true;
      }
    }
  }

  // 2. Personal & Basic Info (Max 40%)
  const fullName = (overrideFields?.fullName ?? user?.fullName ?? user?.firstName ?? "").trim();
  const email = (overrideFields?.email ?? user?.email ?? "").trim();
  const mobile = (overrideFields?.mobileNumber ?? user?.mobileNumber ?? "").replace(/\D/g, "");

  const hasName = fullName.length > 0;
  const hasMobile = mobile.length >= 10;
  const hasEmail = email.includes("@") && email.includes(".");

  const personalScore = 
    (hasName ? 10 : 0) +
    (hasMobile ? 10 : 0) +
    (hasEmail ? 10 : 0) +
    (hasAvatar ? 10 : 0);

  const personalDone = personalScore === 40;

  // 3. Bank Account Details (Max 20%)
  const bankAcc = (overrideFields?.accountNumber ?? user?.primaryBankAccountId ?? (typeof window !== "undefined" ? localStorage.getItem(`fm_bank_acc_${user?.mobileNumber || ""}`) || "" : "")).trim();
  const bankIfsc = (overrideFields?.ifscCode ?? (typeof window !== "undefined" ? localStorage.getItem(`fm_bank_ifsc_${user?.mobileNumber || ""}`) || "" : "")).trim();
  const upiId = (user?.defaultUPIId ?? "").trim();

  const bankDone = Boolean((bankAcc.length >= 8 && bankIfsc.length >= 4) || upiId.length > 0);
  const bankScore = bankDone ? 20 : 0;

  // 4. Nominee Setup (Max 20%)
  // CRITICAL FIX: Nominee Name MUST NOT be empty! Default relation dropdown value ("Spouse") does NOT count!
  const nomineeName = (overrideFields?.nomineeName ?? (typeof window !== "undefined" ? localStorage.getItem(`fm_nominee_name_${user?.mobileNumber || ""}`) || "" : "")).trim();
  const nomineeDob = (overrideFields?.nomineeDob ?? (typeof window !== "undefined" ? localStorage.getItem(`fm_nominee_dob_${user?.mobileNumber || ""}`) || "" : "")).trim();

  const nomineeDone = Boolean(nomineeName.length > 0 && nomineeDob.length > 0);
  const nomineeScore = nomineeDone ? 20 : 0;

  // 5. Security & KYC (Max 20%)
  const panNum = (overrideFields?.panNumber ?? "").trim();
  const aadhaarNum = (overrideFields?.aadhaarNumber ?? "").trim();
  const kycDone = Boolean(user?.isKycCompleted || user?.isPanVerified || panNum.length >= 10 || aadhaarNum.length >= 12);
  const kycScore = kycDone ? 20 : 0;

  const percentage = Math.min(100, personalScore + bankScore + nomineeScore + kycScore);

  let statusLabel = "Beginner";
  let statusColor = "text-amber-700 font-extrabold";
  let statusBadgeBg = "bg-amber-100/90 text-amber-800 border-amber-300/80";
  let progressGradient = "from-amber-400 via-amber-500 to-yellow-500";

  if (percentage >= 100) {
    statusLabel = "100% Complete";
    statusColor = "text-emerald-700 font-extrabold";
    statusBadgeBg = "bg-emerald-100/90 text-emerald-800 border-emerald-300/80";
    progressGradient = "from-emerald-400 via-emerald-500 to-teal-500";
  } else if (percentage >= 75) {
    statusLabel = "Almost Complete";
    statusColor = "text-blue-700 font-extrabold";
    statusBadgeBg = "bg-blue-100/90 text-blue-800 border-blue-300/80";
    progressGradient = "from-blue-500 via-indigo-500 to-purple-600";
  } else if (percentage >= 40) {
    statusLabel = "Intermediate";
    statusColor = "text-purple-700 font-extrabold";
    statusBadgeBg = "bg-purple-100/90 text-purple-800 border-purple-300/80";
    progressGradient = "from-purple-500 via-violet-600 to-indigo-600";
  }

  return {
    percentage,
    personalScore,
    bankScore,
    nomineeScore,
    kycScore,
    personalDone,
    bankDone,
    nomineeDone,
    kycDone,
    statusLabel,
    statusColor,
    statusBadgeBg,
    progressGradient
  };
}
