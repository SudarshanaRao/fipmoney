// Admin Storage & Audit Trail Utility for FipMoney

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  secretCode: string; // 4-digit secret code, e.g. "2787"
  role: 'Super Admin' | 'Finance Manager' | 'Support Lead' | 'Compliance Officer';
  createdAt: string;
  status: 'Active' | 'Pending Approval' | 'Suspended';
  lastLogin: string;
  permissions: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  adminRole: string;
  action: string;
  category: 'User Management' | 'KYC Audit' | 'Rate Change' | 'System' | 'Auth';
  ipAddress: string;
  severity: 'Info' | 'Warning' | 'Critical';
}

const DEFAULT_ADMINS: AdminUser[] = [
  {
    id: 'ADM-001',
    name: 'Admin User',
    email: 'admin@fipmoney.com',
    mobile: '+91 98765 43210',
    secretCode: '2787',
    role: 'Super Admin',
    createdAt: '2025-01-01',
    status: 'Active',
    lastLogin: '2026-08-08 02:15:00',
    permissions: ['all']
  },
  {
    id: 'ADM-002',
    name: 'Finance Manager',
    email: 'finance@fipmoney.com',
    mobile: '+91 98234 56789',
    secretCode: '1234',
    role: 'Finance Manager',
    createdAt: '2025-03-15',
    status: 'Active',
    lastLogin: '2026-08-07 18:30:12',
    permissions: ['manage_rates', 'view_users', 'export_reports']
  }
];

const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-1089',
    timestamp: '2026-08-08 02:12:30',
    adminName: 'Admin User',
    adminRole: 'Super Admin',
    action: 'Logged into Admin Dashboard via secret URL /admin/2787',
    category: 'Auth',
    ipAddress: '103.21.124.52',
    severity: 'Info'
  },
  {
    id: 'LOG-1088',
    timestamp: '2026-08-08 01:55:10',
    adminName: 'Finance Manager',
    adminRole: 'Finance Manager',
    action: 'Updated 24K Gold Benchmark Selling Price (+0.45%)',
    category: 'Rate Change',
    ipAddress: '182.72.91.14',
    severity: 'Warning'
  },
  {
    id: 'LOG-1087',
    timestamp: '2026-08-07 23:40:18',
    adminName: 'Admin User',
    adminRole: 'Super Admin',
    action: 'Approved Email OTP for newly registered Admin Code #2787',
    category: 'Auth',
    ipAddress: '115.240.88.102',
    severity: 'Info'
  }
];

export const getStoredAdmins = (): AdminUser[] => {
  if (typeof window === 'undefined') return DEFAULT_ADMINS;
  const stored = localStorage.getItem('fm_admin_users');
  if (!stored) {
    localStorage.setItem('fm_admin_users', JSON.stringify(DEFAULT_ADMINS));
    return DEFAULT_ADMINS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_ADMINS;
  }
};

export const getAuditLogs = (): AuditLog[] => {
  if (typeof window === 'undefined') return DEFAULT_AUDIT_LOGS;
  const stored = localStorage.getItem('fm_admin_audit_logs');
  if (!stored) {
    localStorage.setItem('fm_admin_audit_logs', JSON.stringify(DEFAULT_AUDIT_LOGS));
    return DEFAULT_AUDIT_LOGS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_AUDIT_LOGS;
  }
};

export const findAdminBySecretCode = (code: string): AdminUser | undefined => {
  const admins = getStoredAdmins();
  return admins.find(a => a.secretCode === code.trim());
};

export const addAuditLog = (action: string, category: AuditLog['category'], severity: AuditLog['severity'] = 'Info') => {
  const logs = getAuditLogs();
  const currentAdmin = getCurrentAdmin();
  const newLog: AuditLog = {
    id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    adminName: currentAdmin?.name || 'Admin User',
    adminRole: currentAdmin?.role || 'Super Admin',
    action,
    category,
    ipAddress: '127.0.0.1 (Localhost)',
    severity
  };
  const updated = [newLog, ...logs];
  localStorage.setItem('fm_admin_audit_logs', JSON.stringify(updated));
  return updated;
};

export const createAdminUserWithCode = (
  name: string,
  email: string,
  mobile: string,
  secretCode: string,
  role: AdminUser['role']
): AdminUser => {
  const admins = getStoredAdmins();
  const newAdmin: AdminUser = {
    id: `ADM-${Math.floor(100 + Math.random() * 900)}`,
    name,
    email,
    mobile,
    secretCode,
    role,
    createdAt: new Date().toISOString().substring(0, 10),
    status: 'Active',
    lastLogin: 'Just now',
    permissions: role === 'Super Admin' ? ['all'] : ['view_users', 'kyc_approval']
  };
  const updated = [...admins.filter(a => a.secretCode !== secretCode), newAdmin];
  localStorage.setItem('fm_admin_users', JSON.stringify(updated));
  addAuditLog(`New Admin Registered with Code /admin/${secretCode}: ${name} (${role})`, 'Auth', 'Critical');
  return newAdmin;
};

export const getCurrentAdmin = (): AdminUser | null => {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem('fm_current_admin');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const setAdminSession = (admin: AdminUser) => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('fm_current_admin', JSON.stringify(admin));
  sessionStorage.setItem('fm_admin_logged_in', 'true');
  addAuditLog(`Admin Authenticated via Secret URL /admin/${admin.secretCode}`, 'Auth', 'Info');
};

export const clearAdminSession = () => {
  if (typeof window === 'undefined') return;
  const current = getCurrentAdmin();
  if (current) {
    addAuditLog(`Admin Logged Out: ${current.name}`, 'Auth', 'Info');
  }
  sessionStorage.removeItem('fm_current_admin');
  sessionStorage.removeItem('fm_admin_logged_in');
};

/**
 * Calculates dynamic AML (Anti-Money Laundering Audit) Score for users.
 * Baseline:
 * - Unverified / Incomplete KYC: 45 / 100 ("Moderate Risk")
 * - Verified KYC: 85 / 100 ("Low Risk")
 * Abnormal Triggers:
 * - Rapid Buy & Sell (<15m): -25 pts
 * - Bulk Order (>₹2L / >25g): -20 pts
 * - Velocity Surge (>3 txns in <3m): -15 pts
 * - High Value without KYC (>₹50k): -30 pts
 */
export const calculateAmlScore = (
  isKycCompleted: boolean,
  flags?: {
    rapidBuySell?: boolean;
    bulkOrder?: boolean;
    velocitySurge?: boolean;
    unverifiedHighValue?: boolean;
  }
): { score: number; status: 'Low Risk' | 'Moderate Risk' | 'High Risk'; reasons: string[] } => {
  let score = isKycCompleted ? 85 : 45;
  const reasons: string[] = [
    isKycCompleted ? 'Baseline: Verified KYC Trust (+85 Base)' : 'Baseline: Unverified / Incomplete KYC (45 Base)'
  ];

  if (flags?.rapidBuySell) {
    score -= 25;
    reasons.push('Abnormal Activity: Rapid Buy & Sell Turnover within 15 mins (-25 pts)');
  }
  if (flags?.bulkOrder) {
    score -= 20;
    reasons.push('Abnormal Activity: Sudden Bulk Order Spike >₹2,00,000 / >25g (-20 pts)');
  }
  if (flags?.velocitySurge) {
    score -= 15;
    reasons.push('Abnormal Activity: High Transaction Velocity >3 txns in <3 mins (-15 pts)');
  }
  if (flags?.unverifiedHighValue && !isKycCompleted) {
    score -= 30;
    reasons.push('Abnormal Activity: High Value Transaction >₹50,000 without Verified KYC (-30 pts)');
  }

  score = Math.max(5, Math.min(100, score));

  let status: 'Low Risk' | 'Moderate Risk' | 'High Risk' = 'Low Risk';
  if (score < 50) status = 'High Risk';
  else if (score < 80) status = 'Moderate Risk';

  return { score, status, reasons };
};

export const calculateAmtScore = calculateAmlScore;

