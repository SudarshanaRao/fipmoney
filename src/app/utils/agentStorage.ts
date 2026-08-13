export interface DgaAgent {
  agentCode: string;
  name: string;
  mobile: string;
  email: string;
  tier: "Silver" | "Gold" | "Platinum" | "Diamond";
  commissionRateGold: number;
  commissionRateSilver: number;
  totalEarned: number;
  monthlyEarned: number;
  pendingPayout: number;
  activeClientsCount: number;
  totalGoldGramsManaged: number;
  panNumber: string;
  bankName: string;
  accountNumberMasked: string;
  ifscCode: string;
  kycVerified: boolean;
  avatarUrl?: string;
}

export const DEFAULT_DEMO_AGENT: DgaAgent = {
  agentCode: "DGA-8842",
  name: "Rajesh Sharma",
  mobile: "9876543210",
  email: "rajesh.agent@fipmoney.com",
  tier: "Diamond",
  commissionRateGold: 0.8,
  commissionRateSilver: 1.2,
  totalEarned: 148250,
  monthlyEarned: 24600,
  pendingPayout: 8400,
  activeClientsCount: 42,
  totalGoldGramsManaged: 184.5,
  panNumber: "ABCDE1234F",
  bankName: "HDFC Bank",
  accountNumberMasked: "•••• •••• 4892",
  ifscCode: "HDFC0001234",
  kycVerified: true,
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
};

export const getLoggedInAgent = (): DgaAgent | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("fm_agent_details") || localStorage.getItem("fm_agent_details");
    if (raw) return JSON.parse(raw);
    const isLoggedIn = sessionStorage.getItem("fm_agent_logged_in") === "true";
    if (isLoggedIn) return DEFAULT_DEMO_AGENT;
  } catch (e) {
    console.error("Error parsing agent storage:", e);
  }
  return null;
};

export const saveLoggedInAgent = (agent: DgaAgent) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("fm_agent_logged_in", "true");
  sessionStorage.setItem("fm_agent_code", agent.agentCode);
  sessionStorage.setItem("fm_agent_details", JSON.stringify(agent));
  localStorage.setItem("fm_agent_logged_in", "true");
  localStorage.setItem("fm_agent_details", JSON.stringify(agent));
};

export const clearAgentSession = () => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("fm_agent_logged_in");
  sessionStorage.removeItem("fm_agent_code");
  sessionStorage.removeItem("fm_agent_details");
  localStorage.removeItem("fm_agent_logged_in");
  localStorage.removeItem("fm_agent_details");
};

export const isAgentLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("fm_agent_logged_in") === "true" || localStorage.getItem("fm_agent_logged_in") === "true";
};
