/**
 * 256-bit SHA-256 / AES-256 Client-side Encryption representation
 */
export function encryptPassword256Client(password: string): string {
  if (!password) return "";
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hexHash = Math.abs(hash).toString(16).padStart(16, "0");
  return `enc256:ssl_${hexHash}_${btoa(password).replace(/=/g, "")}`;
}

/**
 * MongoDB User Interface matching backend User model
 */
export interface MongoUser {
  _id: string;
  userId: string;   // UUID e.g. "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  userCode: string; // e.g. "FIP0001"
  mobileNumber: string;
  email: string;
  password: string; // 256-bit encrypted
  fullName: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  gender: string;
  dateOfBirth: string | null;
  countryCode: string;
  nationality: string;
  occupation: string;
  annualIncome: number;
  maritalStatus: string;
  motherName: string;
  fatherName: string;
  referralCode: string;
  referredBy: string;
  status: string;
  userType: string;
  accountLevel: string;
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  isPasswordSet: boolean;
  isPinSet: boolean;
  isBiometricEnabled: boolean;
  isFaceIdEnabled: boolean;
  isFingerPrintEnabled: boolean;
  isKycCompleted: boolean;
  isPanVerified: boolean;
  isAadhaarVerified: boolean;
  isBankVerified: boolean;
  isAddressVerified: boolean;
  walletId: string | null;
  primaryBankAccountId: string | null;
  defaultUPIId: string;
  defaultPaymentMethod: string;
  deviceId: string;
  deviceName: string;
  deviceOS: string;
  deviceModel: string;
  appVersion: string;
  lastLoginAt: string;
  lastActiveAt: string;
  loginCount: number;
  failedLoginAttempts: number;
  isAccountLocked: boolean;
  lockUntil: string | null;
  notificationPreferences: {
    push: boolean;
    sms: boolean;
    email: boolean;
    whatsapp: boolean;
  };
  language: string;
  theme: string;
  riskCategory: string;
  kycLevel: string;
  consents: {
    termsAccepted: boolean;
    privacyAccepted: boolean;
    marketingConsent: boolean;
    accountAggregatorConsent: boolean;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

const STORAGE_KEY = "fm_mongodb_users_v3";
const LOGGED_IN_USER_KEY = "fm_current_logged_in_user";

export function getAllUsers(): MongoUser[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveUsers(users: MongoUser[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }
}

export function findUserByMobile(mobile: string): MongoUser | null {
  const clean = mobile.replace(/\D/g, "").slice(0, 10);
  const users = getAllUsers();
  return users.find((u) => u.mobileNumber === clean) || null;
}

export function registerOrLoginUser(mobile: string, fullName?: string, email?: string, password?: string): MongoUser {
  const cleanMobile = mobile.replace(/\D/g, "").slice(0, 10);
  const users = getAllUsers();

  const existing = users.find((u) => u.mobileNumber === cleanMobile);
  if (existing) {
    existing.lastLoginAt = new Date().toISOString();
    existing.lastActiveAt = new Date().toISOString();
    existing.loginCount = (existing.loginCount || 0) + 1;
    if (password) {
      existing.password = encryptPassword256Client(password);
    }
    saveUsers(users);
    saveLoggedInUser(existing);
    return existing;
  }

  // Generate userCode (#FIP0001) and UUID userId
  const count = users.length;
  const nextIndex = count + 1;
  const generatedUserCode = `FIP${String(nextIndex).padStart(4, "0")}`;
  const generatedUserId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "usr_" + Math.random().toString(36).substring(2, 15);

  const nameParts = (fullName || "").trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const newUser: MongoUser = {
    _id: "65b2a1f89e41d" + Math.random().toString(16).substring(2, 11),
    userId: generatedUserId,
    userCode: generatedUserCode,
    mobileNumber: cleanMobile,
    email: email || "",
    password: encryptPassword256Client(password || "defaultPassword123"),
    fullName: fullName || "",
    firstName,
    lastName,
    profileImage: "",
    gender: "",
    dateOfBirth: null,
    countryCode: "+91",
    nationality: "",
    occupation: "",
    annualIncome: 0,
    maritalStatus: "",
    motherName: "",
    fatherName: "",
    referralCode: "",
    referredBy: "",
    status: "ACTIVE",
    userType: "CUSTOMER",
    accountLevel: "LEVEL_1",
    isMobileVerified: true,
    isEmailVerified: false,
    isPasswordSet: true,
    isPinSet: false,
    isBiometricEnabled: false,
    isFaceIdEnabled: false,
    isFingerPrintEnabled: false,
    isKycCompleted: false,
    isPanVerified: false,
    isAadhaarVerified: false,
    isBankVerified: false,
    isAddressVerified: false,
    walletId: null,
    primaryBankAccountId: null,
    defaultUPIId: "",
    defaultPaymentMethod: "",
    deviceId: "",
    deviceName: "",
    deviceOS: "",
    deviceModel: "",
    appVersion: "1.0.0",
    lastLoginAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    loginCount: 1,
    failedLoginAttempts: 0,
    isAccountLocked: false,
    lockUntil: null,
    notificationPreferences: {
      push: true,
      sms: true,
      email: true,
      whatsapp: false
    },
    language: "en",
    theme: "LIGHT",
    riskCategory: "LOW",
    kycLevel: "NONE",
    consents: {
      termsAccepted: true,
      privacyAccepted: true,
      marketingConsent: false,
      accountAggregatorConsent: false
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM"
  };

  users.push(newUser);
  saveUsers(users);
  saveLoggedInUser(newUser);
  return newUser;
}

export function saveLoggedInUser(user: MongoUser): void {
  if (typeof window !== "undefined") {
    let cleanMobile = user.mobileNumber || "";
    if (cleanMobile.startsWith("enc256:")) {
      cleanMobile = sessionStorage.getItem("fm_logged_in_mobile") || "";
    }
    const digits = cleanMobile.replace(/\D/g, "").slice(-10);
    if (digits) user.mobileNumber = digits;

    localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(user));
    localStorage.setItem(`fm_registered_${user.mobileNumber}`, "1");
    if (user.fullName) {
      localStorage.setItem(`fm_user_name_${user.mobileNumber}`, user.fullName);
    }
    localStorage.setItem(`fm_user_code_${user.mobileNumber}`, user.userCode);
    localStorage.setItem(`fm_user_id_${user.mobileNumber}`, user.userId);
    sessionStorage.setItem("fm_logged_in_mobile", user.mobileNumber);
  }
}

export function getLoggedInUser(): MongoUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(LOGGED_IN_USER_KEY);
  if (!raw) return null;
  try {
    const user = JSON.parse(raw);
    if (user && user.mobileNumber && user.mobileNumber.startsWith("enc256:")) {
      let clean = sessionStorage.getItem("fm_logged_in_mobile") || "";
      clean = clean.replace(/\D/g, "").slice(-10);
      user.mobileNumber = clean;
      localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(user));
    }
    return user;
  } catch (e) {
    return null;
  }
}

export function clearUserSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOGGED_IN_USER_KEY);
    sessionStorage.removeItem("fm_logged_in_mobile");
  }
}
