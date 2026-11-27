export interface Transaction {
  id: string;
  type: "Buy" | "Sell" | "Bill Pay" | "Reward" | "Bonus" | "REFERRAL_BONUS";
  category: string; // e.g. "Gold", "Silver", "Mobile Prepaid", "Electricity", "Broadband", etc.
  amount: number;
  grams?: string;
  date: string; // ISO string
  status: "Completed" | "Pending" | "Failed";
  paymentMethod: string; // e.g. "UPI", "Credit Card", "Net Banking", "Direct Bank IMPS"
  source: string; // e.g. "Gold Vault", "BESCOM Electricity", "Jio Recharge"
}

const STORAGE_KEY = "fipmoney_transactions_v2";

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

export function addTransaction(tx: Omit<Transaction, "id" | "date">): Transaction {
  const newTx: Transaction = {
    ...tx,
    id: `FIP${Math.floor(100000 + Math.random() * 900000)}`,
    date: new Date().toISOString()
  };
  if (typeof window !== "undefined") {
    const list = getTransactions();
    // Prevent duplicate entries by ID
    const exists = list.some(item => item.id === newTx.id);
    const updated = exists ? list : [newTx, ...list];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('fm_transaction_created', { detail: newTx }));
  }
  return newTx;
}
