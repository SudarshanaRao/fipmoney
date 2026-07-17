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

const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: "FIP839120",
    type: "Buy",
    category: "Gold",
    amount: 5000,
    grams: "0.7788 g",
    date: "2026-07-17T10:14:00.000Z",
    status: "Completed",
    paymentMethod: "UPI",
    source: "Gold Vault"
  },
  {
    id: "FIP981245",
    type: "Bill Pay",
    category: "Electricity",
    amount: 1850,
    date: "2026-07-16T18:45:00.000Z",
    status: "Completed",
    paymentMethod: "UPI",
    source: "BESCOM Electricity"
  },
  {
    id: "FIP942084",
    type: "Bill Pay",
    category: "Mobile Prepaid",
    amount: 299,
    date: "2026-07-15T12:30:00.000Z",
    status: "Completed",
    paymentMethod: "UPI",
    source: "Jio Recharge"
  },
  {
    id: "FIP728193",
    type: "Buy",
    category: "Silver",
    amount: 2500,
    grams: "29.6912 g",
    date: "2026-07-12T14:32:00.000Z",
    status: "Completed",
    paymentMethod: "Credit Card",
    source: "Silver Vault"
  },
  {
    id: "FIP883012",
    type: "Bill Pay",
    category: "Broadband",
    amount: 999,
    date: "2026-07-10T16:15:00.000Z",
    status: "Failed",
    paymentMethod: "Credit Card",
    source: "Airtel Fiber"
  },
  {
    id: "FIP619283",
    type: "Sell",
    category: "Gold",
    amount: 8000,
    grams: "1.2461 g",
    date: "2026-07-05T11:20:00.000Z",
    status: "Completed",
    paymentMethod: "Bank Transfer",
    source: "Gold Vault"
  },
  {
    id: "FIP772091",
    type: "Bill Pay",
    category: "Rent",
    amount: 12000,
    date: "2026-07-02T10:00:00.000Z",
    status: "Completed",
    paymentMethod: "Bank Transfer",
    source: "House Rent Pay"
  },
  {
    id: "FIP510293",
    type: "Buy",
    category: "Gold",
    amount: 150,
    grams: "0.0234 g",
    date: "2026-07-01T09:05:00.000Z",
    status: "Completed",
    paymentMethod: "UPI",
    source: "Gold Vault"
  },
  {
    id: "FIP663920",
    type: "Buy",
    category: "Silver",
    amount: 500,
    grams: "5.9382 g",
    date: "2026-06-28T15:40:00.000Z",
    status: "Completed",
    paymentMethod: "UPI",
    source: "Silver Vault"
  },
  {
    id: "FIP554019",
    type: "Bill Pay",
    category: "FASTag",
    amount: 1000,
    date: "2026-06-25T08:12:00.000Z",
    status: "Pending",
    paymentMethod: "Wallet",
    source: "Paytm FASTag"
  }
];

const STORAGE_KEY = "fipmoney_transactions";

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") return DEFAULT_TRANSACTIONS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TRANSACTIONS));
    return DEFAULT_TRANSACTIONS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Error parsing transactions from localStorage", e);
    return DEFAULT_TRANSACTIONS;
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
