import { API_BASE_URL as BASE_API } from './apiConfig';
import { addTransaction, getTransactions } from './transactionStorage';
const API_BASE_URL = `${BASE_API}/users/vault`;

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
      if (json.data.values && typeof json.data.values.totalInvested === 'number' && json.data.values.totalInvested > 0) {
        localStorage.setItem(`fip_gold_invested_${mobile}`, String(json.data.values.totalInvested));
      }
      if (Array.isArray(json.data.recentTransactions)) {
        try {
          const localTxs = getTransactions();
          for (const bt of json.data.recentTransactions) {
            const txId = bt.txId || bt._id;
            if (txId && !localTxs.some(t => t.id === txId)) {
              const isBonus = bt.type === 'REFERRAL_BONUS';
              addTransaction({
                type: isBonus ? 'Reward' : (bt.type === 'SELL' ? 'Sell' : 'Buy'),
                category: bt.metal === 'SILVER' ? 'Silver' : 'Gold',
                amount: bt.amount || 0,
                grams: bt.grams ? `${Number(bt.grams).toFixed(4)} g` : undefined,
                status: 'Completed',
                paymentMethod: isBonus ? 'Referral Reward' : (bt.paymentMethod || 'UPI'),
                source: isBonus ? 'Referral Reward' : `${bt.metal === 'SILVER' ? 'Silver' : 'Gold'} Vault`
              });
            }
          }
        } catch (e) {}
      }
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
    const endpoint = params.metal.toLowerCase() === 'gold' ? `${BASE_API}/users/buy-gold` : `${API_BASE_URL}/buy`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const json = await res.json();
    if (json && json.success && json.data) {
      const { updatedBalances, transaction } = json.data;
      if (updatedBalances) {
        localStorage.setItem(`fip_gold_holdings_${params.mobileNumber}`, String(updatedBalances.goldHoldingsGrams));
        localStorage.setItem(`fip_silver_holdings_${params.mobileNumber}`, String(updatedBalances.silverHoldingsGrams));
        if (updatedBalances.portfolioValue !== undefined) {
          localStorage.setItem(`fip_portfolio_value_${params.mobileNumber}`, String(updatedBalances.portfolioValue));
        }
      }
      if (transaction) {
        addTransaction({
          type: transaction.type === 'BUY' ? 'Buy' : 'Sell',
          category: transaction.metal ? (transaction.metal.charAt(0).toUpperCase() + transaction.metal.slice(1).toLowerCase()) : 'Gold',
          amount: transaction.amount,
          grams: `${Number(transaction.grams).toFixed(4)} g`,
          status: 'Completed',
          paymentMethod: transaction.paymentMethod || 'UPI',
          source: transaction.source || `${transaction.metal === 'GOLD' ? 'Gold' : 'Silver'} Vault`,
        });
      }
      return json;
    }
  } catch (err) {
    console.warn("Buy Gold API error, using local fallback:", err);
  }
  return null;
}

export async function buyGoldApi(params: {
  mobileNumber: string;
  amount: number;
  grams: number;
  lockedPrice?: number;
  paymentMethod?: string;
}) {
  return buyGoldOrSilverApi({
    ...params,
    metal: "gold",
  });
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
      const { updatedBalances, transaction } = json.data;
      if (updatedBalances) {
        localStorage.setItem(`fip_gold_holdings_${params.mobileNumber}`, String(updatedBalances.goldHoldingsGrams));
        localStorage.setItem(`fip_silver_holdings_${params.mobileNumber}`, String(updatedBalances.silverHoldingsGrams));
        localStorage.setItem(`fip_cash_balance_${params.mobileNumber}`, String(updatedBalances.cashBalance));
      }
      if (transaction) {
        addTransaction({
          type: transaction.type === 'SELL' ? 'Sell' : 'Buy',
          category: transaction.metal ? (transaction.metal.charAt(0).toUpperCase() + transaction.metal.slice(1).toLowerCase()) : 'Gold',
          amount: transaction.amount,
          grams: `${Number(transaction.grams).toFixed(4)} g`,
          status: 'Completed',
          paymentMethod: transaction.paymentMethod || 'Direct Bank IMPS',
          source: transaction.source || `${transaction.metal === 'GOLD' ? 'Gold' : 'Silver'} Vault`,
        });
      }
      return json;
    }
  } catch (err) {
    console.warn("Sell Gold API error, using local fallback:", err);
  }
  return null;
}

/**
 * Fetch complete user transaction history from MongoDB
 * Automatically persists to local storage cache and returns array of transactions
 */
export async function fetchUserTransactionsApi(mobile: string): Promise<any[]> {
  const localTxns = getTransactions();
  if (!mobile) return localTxns;
  try {
    const res = await fetch(`${BASE_API}/users/transactions?mobile=${encodeURIComponent(mobile)}`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data)) {
        // Merge backend and local transactions by ID so no local recharges/bills are lost
        const mergedMap = new Map<string, any>();
        json.data.forEach((t: any) => { if (t && t.id) mergedMap.set(t.id, t); });
        localTxns.forEach((t: any) => { if (t && t.id && !mergedMap.has(t.id)) mergedMap.set(t.id, t); });

        const mergedList = Array.from(mergedMap.values()).sort(
          (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        if (typeof window !== "undefined") {
          localStorage.setItem("fipmoney_transactions_v2", JSON.stringify(mergedList));
        }
        return mergedList;
      }
    }
  } catch (err) {
    console.warn("fetchUserTransactionsApi error, using local fallback:", err);
  }
  return localTxns;
}

export async function createRechargeTransactionApi(params: {
  mobile: string;
  amount: number;
  category: string;
  billerName: string;
  accountNumber?: string;
  paymentGateway?: string;
}) {
  try {
    const res = await fetch(`${BASE_API}/users/recharge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (err) {
    console.warn("createRechargeTransactionApi error:", err);
    return null;
  }
}
