export interface Transaction {
  id: string;
  type: "Buy" | "Sell" | "Bill Pay";
  category: string; // e.g. "Gold", "Silver", "Mobile Prepaid", "Electricity", "Broadband", etc.
  amount: number;
  grams?: string;
  date: string; // ISO string
  status: "Completed" | "Pending" | "Failed";
  paymentMethod: string; // e.g. "UPI", "Credit Card", "Bank Transfer", "Wallet"
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
    const updated = [newTx, ...list];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return newTx;
}
