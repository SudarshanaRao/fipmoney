const API_BASE_URL = 'https://prod-server.fipmoney.com/api/users/vault';

export interface VaultSummary {
  mobileNumber: string;
  goldHoldingsGrams: number;
  silverHoldingsGrams: number;
  cashBalance: number;
  rates: {
    goldPerGram: number;
    silverPerGram: number;
  };
  values: {
    goldVaultValue: number;
    silverVaultValue: number;
    cashBalance: number;
    portfolioValue: number;
  };
  recentTransactions: any[];
}

export async function fetchVaultSummaryApi(mobile: string): Promise<VaultSummary | null> {
  if (!mobile) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/summary?mobile=${encodeURIComponent(mobile)}`);
    if (!res.ok) return null;
    const json = await res.json();
    if (json && json.success && json.data) {
      // Sync to localStorage
      localStorage.setItem(`fip_gold_holdings_${mobile}`, String(json.data.goldHoldingsGrams || 0));
      localStorage.setItem(`fip_silver_holdings_${mobile}`, String(json.data.silverHoldingsGrams || 0));
      localStorage.setItem(`fip_cash_balance_${mobile}`, String(json.data.cashBalance || 0));
      return json.data;
    }
  } catch (err) {
    console.warn("Vault Summary API fetch error, falling back to local:", err);
  }
  return null;
}

export async function buyGoldOrSilverApi(params: {
  mobileNumber: string;
  metal: "gold" | "silver";
  amount: number;
  grams: number;
  lockedPrice?: number;
  paymentMethod?: string;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/buy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const json = await res.json();
    if (json && json.success && json.data) {
      const { updatedBalances } = json.data;
      if (updatedBalances) {
        localStorage.setItem(`fip_gold_holdings_${params.mobileNumber}`, String(updatedBalances.goldHoldingsGrams));
        localStorage.setItem(`fip_silver_holdings_${params.mobileNumber}`, String(updatedBalances.silverHoldingsGrams));
      }
      return json;
    }
  } catch (err) {
    console.warn("Buy Gold API error, using local fallback:", err);
  }
  return null;
}

export async function sellGoldOrSilverApi(params: {
  mobileNumber: string;
  metal: "gold" | "silver";
  amount: number;
  grams: number;
  ratePerGram?: number;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/sell`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const json = await res.json();
    if (json && json.success && json.data) {
      const { updatedBalances } = json.data;
      if (updatedBalances) {
        localStorage.setItem(`fip_gold_holdings_${params.mobileNumber}`, String(updatedBalances.goldHoldingsGrams));
        localStorage.setItem(`fip_silver_holdings_${params.mobileNumber}`, String(updatedBalances.silverHoldingsGrams));
        localStorage.setItem(`fip_cash_balance_${params.mobileNumber}`, String(updatedBalances.cashBalance));
      }
      return json;
    }
  } catch (err) {
    console.warn("Sell Gold API error, using local fallback:", err);
  }
  return null;
}
