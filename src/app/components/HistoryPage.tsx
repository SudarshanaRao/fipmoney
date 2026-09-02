"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Calendar, ChevronDown, Download, AlertCircle, 
  Filter, Clock, CheckCircle2, XCircle, FileText, IndianRupee,
  Activity, Wifi, Smartphone, Zap, Home, ShieldCheck, AlertTriangle, ChevronRight, CreditCard, Banknote, Landmark,
  Coins, TrendingUp, Wallet, Eye, ArrowUpRight, PiggyBank, Gift
} from "lucide-react";
import { getTransactions, Transaction } from "../utils/transactionStorage";
import { useFipModal } from "./FipModal";

import { LoadingSpinner } from "./LottiePlayer";

const GOLD = { G_DK: "#b87312", G_LT: "#efb652", BG: "#fdf8f0" };

// High-fidelity PDF invoice downloader styled after the "Sempurna" template
export function downloadInvoicePDF(tx: Transaction) {
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "0px";
  iframe.style.height = "0px";
  iframe.style.border = "none";
  
  document.body.appendChild(iframe);
  
  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    console.error("Iframe document not accessible");
    return;
  }
  
  let itemName = "Digital Vault Service";
  let itemDescription = "Fipmoney Premium Vault Transaction";
  let unitPrice = tx.amount;
  let qty = "1";
  let total = tx.amount;
  let tax = 0;
  
  if (tx.category.toLowerCase() === "gold") {
    itemName = "24K Digital Gold (Vault)";
    itemDescription = `Purchase/Sale of pure 24K Gold. Amount: ${tx.grams || ""}`;
    qty = tx.grams || "1";
    tax = Math.round((tx.amount * 0.03) * 100) / 100;
    unitPrice = tx.amount - tax;
    total = tx.amount - tax;
  } else if (tx.category.toLowerCase() === "silver") {
    itemName = "99.9 Fine Digital Silver (Vault)";
    itemDescription = `Purchase/Sale of pure 99.9 Silver. Amount: ${tx.grams || ""}`;
    qty = tx.grams || "1";
    tax = Math.round((tx.amount * 0.03) * 100) / 100;
    unitPrice = tx.amount - tax;
    total = tx.amount - tax;
  } else {
    itemName = `${tx.category} Bill Pay`;
    itemDescription = `Utility Bill Payment via BBPS Network. Operator/Service: ${tx.source}`;
    qty = "1";
    tax = 0;
    unitPrice = tx.amount;
    total = tx.amount;
  }
  
  const grandTotal = tx.amount;
  const invoiceDate = new Date(tx.date).toLocaleDateString("en-US", {
    day: "numeric", month: "long", year: "numeric"
  });
  const dateInfo = new Date(tx.date).toLocaleDateString("en-US", {
    day: "2-digit", month: "2-digit", year: "numeric"
  });
  const invoiceNum = tx.id.replace("FIP", "FM-") + "/" + new Date(tx.date).getFullYear();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice - ${tx.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&display=swap');
          
          body {
            font-family: 'Outfit', sans-serif;
            margin: 0;
            padding: 0;
            color: #374151;
            background-color: #ffffff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .invoice-container {
            width: 790px;
            margin: 0 auto;
            background: #ffffff;
            position: relative;
            padding-bottom: 50px;
          }
          
          .header-banner {
            background: linear-gradient(135deg, #7c2d12 0%, #b87312 40%, #f59e0b 100%);
            padding: 40px;
            color: #ffffff;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            min-height: 180px;
          }
          
          .logo-area {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          
          .logo-row {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          
          .logo-img {
            max-height: 48px;
            width: auto;
            object-fit: contain;
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
            border-radius: 8px;
            background: rgba(255,255,255,0.05);
            padding: 2px;
          }
          
          .company-name {
            font-weight: 800;
            font-size: 20px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }
          
          .company-sub {
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.05em;
            opacity: 0.8;
            margin-top: -2px;
          }
          
          .invoice-title-area {
            margin-top: 30px;
          }
          
          .invoice-label {
            font-size: 38px;
            font-weight: 900;
            letter-spacing: 0.02em;
            margin: 0;
            text-transform: uppercase;
          }
          
          .invoice-hash {
            font-size: 16px;
            font-weight: 600;
            opacity: 0.9;
            margin-top: 5px;
          }
          
          .invoice-date-sub {
            font-size: 11px;
            font-weight: 400;
            opacity: 0.8;
            margin-top: 5px;
          }
          
          .header-meta {
            text-align: right;
            display: flex;
            flex-direction: column;
            gap: 15px;
          }
          
          .meta-group {
            display: flex;
            flex-direction: column;
          }
          
          .meta-label {
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            opacity: 0.8;
            margin-bottom: 2px;
          }
          
          .meta-value {
            font-size: 13px;
            font-weight: 600;
          }
          
          .meta-value.due {
            font-weight: 800;
            font-size: 14px;
          }
          
          .content-card {
            background: #ffffff;
            margin: -35px 30px 0 30px;
            border-radius: 24px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.06);
            padding: 30px;
            position: relative;
            z-index: 10;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          
          .items-table th {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #4b5563;
            background-color: #f3f4f6;
            padding: 14px 18px;
            text-align: left;
          }
          
          .items-table th:first-child {
            border-top-left-radius: 12px;
            border-bottom-left-radius: 12px;
          }
          
          .items-table th:last-child {
            border-top-right-radius: 12px;
            border-bottom-right-radius: 12px;
            text-align: right;
          }
          
          .items-table td {
            font-size: 12px;
            font-weight: 600;
            padding: 18px;
            border-bottom: 1px solid #f3f4f6;
            color: #1f2937;
          }
          
          .items-table td.num {
            font-weight: 400;
            color: #9ca3af;
          }
          
          .items-table td.desc-col {
            font-weight: 700;
          }
          
          .items-table td.desc-sub {
            display: block;
            font-size: 10px;
            font-weight: 400;
            color: #6b7280;
            margin-top: 4px;
          }
          
          .items-table td.price, .items-table td.qty {
            color: #4b5563;
          }
          
          .items-table td.total {
            text-align: right;
            font-weight: 700;
            color: #111827;
          }
          
          .summary-block {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            gap: 40px;
          }
          
          .left-block {
            flex: 1.2;
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          
          .right-block {
            flex: 0.8;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          
          .biz-thank {
            font-weight: 800;
            font-size: 14px;
            color: #1f2937;
            margin: 0 0 8px 0;
          }
          
          .biz-contact {
            font-size: 11px;
            font-weight: 600;
            color: #6b7280;
            display: flex;
            flex-direction: column;
            gap: 4px;
            line-height: 1.4;
          }
          
          .payment-info {
            background-color: #fafafa;
            border: 1px solid #f3f4f6;
            border-radius: 12px;
            padding: 15px;
          }
          
          .payment-title {
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #4b5563;
            margin-bottom: 8px;
          }
          
          .payment-detail {
            font-size: 11px;
            font-weight: 600;
            color: #1f2937;
            line-height: 1.5;
          }
          
          .terms-info {
            font-size: 9px;
            color: #9ca3af;
            line-height: 1.5;
          }
          
          .terms-title {
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #6b7280;
            margin-bottom: 4px;
          }
          
          .breakdown-row {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            font-weight: 600;
            color: #4b5563;
            padding: 0 5px;
          }
          
          .breakdown-row.total-row {
            background: linear-gradient(135deg, #7c2d12 0%, #b87312 100%);
            color: #ffffff;
            padding: 12px 18px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 800;
            margin-top: 10px;
            box-shadow: 0 4px 10px rgba(184, 115, 18, 0.15);
          }
          
          .signature-area {
            margin-top: 25px;
            text-align: right;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          }
          
          .signature-title {
            font-size: 13px;
            font-weight: 700;
            color: #1f2937;
          }
          
          .signature-sub {
            font-size: 10px;
            font-weight: 600;
            color: #9ca3af;
            margin-top: 2px;
          }
          
          .signature-img {
            margin-bottom: 2px;
            opacity: 0.9;
          }
          
          @media print {
            body {
              background: none;
              padding: 0;
            }
            .invoice-container {
              width: 100%;
              padding: 0;
              box-shadow: none;
            }
            .content-card {
              box-shadow: none;
              margin-top: -20px;
              padding: 10px 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          
          <div class="header-banner">
            <div class="logo-area">
              <div class="logo-row">
                <img src="/fipmoney_logo_final.png" alt="Fipmoney Logo" class="logo-img" />
                <div>
                  <div class="company-name">Fipmoney</div>
                  <div class="company-sub">Vaults & Payments</div>
                </div>
              </div>
              
              <div class="invoice-title-area">
                <h1 class="invoice-label">Invoice</h1>
                <div class="invoice-hash"># ${tx.id}</div>
                <div class="invoice-date-sub">Fipmoney Inc, ${invoiceDate}</div>
              </div>
            </div>
            
            <div class="header-meta">
              <div class="meta-group">
                <span class="meta-label">Date Information</span>
                <span class="meta-value">${dateInfo}</span>
              </div>
              <div class="meta-group">
                <span class="meta-label">Invoice Number</span>
                <span class="meta-value">${invoiceNum}</span>
              </div>
              <div class="meta-group">
                <span class="meta-label">Invoice To</span>
                <span class="meta-value">Self Account</span>
                <span class="meta-value" style="font-weight: 400; opacity: 0.9;">Fipmoney User</span>
              </div>
              <div class="meta-group">
                <span class="meta-label">Total Due</span>
                <span class="meta-value due">INR: ₹${grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
          
          <div class="content-card">
            <table class="items-table">
              <thead>
                <tr>
                  <th style="width: 8%;">No.</th>
                  <th style="width: 48%;">Item Description</th>
                  <th style="width: 16%;">Price</th>
                  <th style="width: 12%;">Qty.</th>
                  <th style="width: 16%;">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="num">01.</td>
                  <td class="desc-col">
                    ${itemName}
                    <span class="desc-sub">${itemDescription}</span>
                  </td>
                  <td class="price">₹${unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td class="qty">${qty}</td>
                  <td class="total">₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
            
            <div class="summary-block">
              <div class="left-block">
                <div>
                  <h4 class="biz-thank">Thank you for your business</h4>
                  <div class="biz-contact">
                    <span>Phone: +91 94918 41941</span>
                    <span>Email: support@fipmoney.com</span>
                    <span>Address: #709, Gowra FountainHead, Huda techno Enclave, Hitec City, Hyderabad 500081</span>
                  </div>
                </div>
                
                <div class="payment-info">
                  <div class="payment-title">Payment Method</div>
                  <div class="payment-detail">
                    Channel: ${tx.paymentMethod}<br/>
                    Status: SUCCESS<br/>
                    Gateway: BBPS / FIP Secure Pay
                  </div>
                </div>
                
                <div class="terms-info">
                  <div class="terms-title">Terms & Conditions</div>
                  This invoice is generated automatically by Fipmoney. Precious metal purchases are credited to the user's secure gold/silver vaults. Payments are subject to RBI guidelines and partner provider terms.
                </div>
              </div>
              
              <div class="right-block">
                <div class="breakdown-row">
                  <span>Sub total</span>
                  <span>₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div class="breakdown-row">
                  <span>Tax (GST)</span>
                  <span>₹${tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div class="breakdown-row total-row">
                  <span>Total</span>
                  <span>₹${grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                
                <div class="signature-area">
                  <svg class="signature-img" width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 25 C 20 5, 40 5, 50 20 C 60 35, 80 35, 90 20 C 95 10, 80 5, 70 15 C 60 25, 40 35, 30 25 C 20 15, 30 10, 45 18 C 55 25, 65 20, 75 10" stroke="#1f2937" stroke-width="2" stroke-linecap="round" fill="none"/>
                  </svg>
                  <span class="signature-title">Nagababu palanati</span>
                  <span class="signature-sub">Acc Manager</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.parent.postMessage('invoice-printed', '*');
            }, 1000);
          }
        </script>
      </body>
    </html>
  `;
  
  doc.open();
  doc.write(htmlContent);
  doc.close();

  const handleMessage = (event: MessageEvent) => {
    if (event.data === 'invoice-printed') {
      document.body.removeChild(iframe);
      window.removeEventListener('message', handleMessage);
    }
  };
  window.addEventListener('message', handleMessage);
}

export default function HistoryPage() {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<{[key: string]: boolean}>({});
  
  const toggleGroup = (dateKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [dateKey]: prev[dateKey] === false ? true : false
    }));
  };
  
  // Tabs: "all" | "gold" | "silver" | "bills"
  const [activeTab, setActiveTab] = useState<"all" | "gold" | "silver" | "bills">("all");
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Completed" | "Pending" | "Failed">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { showAlert } = useFipModal();
  const [isLoading, setIsLoading] = useState(true);

  // Load transactions
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setAllTransactions(getTransactions());
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Filter logic
  useEffect(() => {
    let result = [...allTransactions];

    // 1. Filter by Tab
    if (activeTab === "gold") {
      result = result.filter(tx => tx.category.toLowerCase() === "gold");
    } else if (activeTab === "silver") {
      result = result.filter(tx => tx.category.toLowerCase() === "silver");
    } else if (activeTab === "bills") {
      result = result.filter(tx => tx.type === "Bill Pay");
    }

    // 2. Filter by Search Query (ID, source or category)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(tx => 
        tx.id.toLowerCase().includes(q) || 
        tx.source.toLowerCase().includes(q) || 
        tx.category.toLowerCase().includes(q)
      );
    }

    // 3. Filter by Status
    if (statusFilter !== "all") {
      result = result.filter(tx => tx.status === statusFilter);
    }

    // 4. Filter by Date Range
    if (startDate !== "") {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      result = result.filter(tx => new Date(tx.date) >= start);
    }
    if (endDate !== "") {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(tx => new Date(tx.date) <= end);
    }

    setFilteredTransactions(result);
  }, [allTransactions, activeTab, searchQuery, statusFilter, startDate, endDate]);

  // Export CSV logic
  const handleExport = () => {
    if (filteredTransactions.length === 0) {
      showAlert("No transactions to export.", "warning");
      return;
    }
    
    // Create CSV content
    const headers = ["Transaction ID", "Type", "Category", "Source", "Amount", "Grams", "Date", "Status", "Payment Method"];
    const rows = filteredTransactions.map(tx => [
      tx.id,
      tx.type,
      tx.category,
      tx.source,
      `₹${tx.amount}`,
      tx.grams || "-",
      new Date(tx.date).toLocaleString(),
      tx.status,
      tx.paymentMethod
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Fipmoney_Transactions_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showAlert("Transaction report exported successfully!", "success");
  };

  // Group by Date
  const groupTransactionsByDate = () => {
    const groups: { [dateStr: string]: { list: Transaction[]; total: number } } = {};
    
    filteredTransactions.forEach(tx => {
      const txDate = new Date(tx.date);
      const key = txDate.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      });

      if (!groups[key]) {
        groups[key] = { list: [], total: 0 };
      }
      groups[key].list.push(tx);
      groups[key].total += tx.amount;
    });

    return groups;
  };

  const grouped = groupTransactionsByDate();

  // Statistics
  const totalVolume = filteredTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalTxCount = filteredTransactions.length;

  const [mobileTab, setMobileTab] = useState<"all" | "gold" | "sip" | "bills" | "rewards">("all");
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Sample transactions matching user screenshots for mobile display
  const sampleMobileTxs = [
    {
      id: "SIP20241216001",
      title: "SIP Investment",
      subtitle: "ICICI Prudential Bluechip Fund",
      category: "sip",
      amount: -3000,
      status: "pending",
      dateStr: "16 Dec 2024",
      timeStr: "10:00",
      refId: "SIP20241216001",
      charges: 7.50,
      gst: 1.35,
      netAmount: 3008.85,
      iconType: "sip"
    },
    {
      id: "GLD20241215001",
      title: "Gold Purchase",
      subtitle: "Bought 2.5g digital gold",
      category: "gold",
      amount: -12500,
      status: "completed",
      dateStr: "15 Dec 2024",
      timeStr: "14:30",
      refId: "GLD20241215001",
      charges: 62.50,
      gst: 11.25,
      netAmount: 12573.75,
      iconType: "gold"
    },
    {
      id: "SIP20241214001",
      title: "SIP Investment",
      subtitle: "HDFC Top 100 Fund",
      category: "sip",
      amount: -5000,
      status: "completed",
      dateStr: "14 Dec 2024",
      timeStr: "09:15",
      refId: "SIP20241214001",
      charges: 12.50,
      gst: 2.25,
      netAmount: 5014.75,
      iconType: "sip"
    },
    {
      id: "BIL20241213002",
      title: "Electricity Bill",
      subtitle: "BESCOM Electricity Payment",
      category: "bills",
      amount: -1450,
      status: "completed",
      dateStr: "13 Dec 2024",
      timeStr: "18:20",
      refId: "BIL20241213002",
      charges: 0.00,
      gst: 0.00,
      netAmount: 1450.00,
      iconType: "bills"
    },
    {
      id: "GLD20241212002",
      title: "Gold Sale",
      subtitle: "Sold 1.2g digital gold",
      category: "gold",
      amount: 6000,
      status: "completed",
      dateStr: "12 Dec 2024",
      timeStr: "11:20",
      refId: "GLD20241212002",
      charges: 30.00,
      gst: 5.40,
      netAmount: 5964.60,
      iconType: "gold"
    },
    {
      id: "REW20241211001",
      title: "Referral Bonus",
      subtitle: "Friend signup reward",
      category: "rewards",
      amount: 500,
      status: "completed",
      dateStr: "11 Dec 2024",
      timeStr: "13:10",
      refId: "REW20241211001",
      charges: 0.00,
      gst: 0.00,
      netAmount: 500.00,
      iconType: "rewards"
    },
    {
      id: "BNK20241210001",
      title: "Bank Transfer",
      subtitle: "Money transferred to bank",
      category: "bank",
      amount: -2500,
      status: "failed",
      dateStr: "10 Dec 2024",
      timeStr: "15:30",
      refId: "BNK20241210001",
      charges: 5.00,
      gst: 0.90,
      netAmount: 2505.90,
      iconType: "bank"
    }
  ];

  // Mobile filtered list computation
  const getMobileDisplayTxs = () => {
    let sourceList = sampleMobileTxs;

    if (allTransactions.length > 0) {
      sourceList = allTransactions.map((tx) => {
        const isPositive = tx.type === "Buy" || tx.type === "Receive" || tx.type === "Sell";
        const amt = (tx.type === "Sell" || tx.type === "Receive") ? tx.amount : -tx.amount;
        const chg = Math.round(tx.amount * 0.0025 * 100) / 100;
        const gstVal = Math.round(chg * 0.18 * 100) / 100;
        const net = Math.abs(amt) + chg + gstVal;

        let iconType = "gold";
        const cat = tx.category.toLowerCase();
        const src = tx.source.toLowerCase();
        if (cat.includes("gold") || cat.includes("silver")) iconType = "gold";
        else if (cat.includes("sip") || src.includes("fund")) iconType = "sip";
        else if (tx.type === "Bill Pay" || cat.includes("bill") || src.includes("electricity") || src.includes("recharge") || src.includes("wifi") || src.includes("fiber")) iconType = "bills";
        else if (cat.includes("reward") || src.includes("referral")) iconType = "rewards";
        else iconType = "bank";

        const dateObj = new Date(tx.date);
        const dateStr = dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
        const timeStr = dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

        return {
          id: tx.id,
          title: tx.source || `${tx.type} ${tx.category}`,
          subtitle: `${tx.type} ${tx.grams ? `(${tx.grams})` : ""}`,
          category: iconType,
          amount: amt,
          status: tx.status.toLowerCase(),
          dateStr: dateStr,
          timeStr: timeStr,
          refId: tx.id,
          charges: chg,
          gst: gstVal,
          netAmount: net,
          iconType: iconType,
          rawTx: tx
        };
      });
    }

    // Filter by Mobile Tab
    if (mobileTab !== "all") {
      sourceList = sourceList.filter(item => item.category === mobileTab);
    }

    // Filter by Search
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      sourceList = sourceList.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.subtitle.toLowerCase().includes(q) || 
        item.refId.toLowerCase().includes(q)
      );
    }

    return sourceList;
  };

  const mobileDisplayList = getMobileDisplayTxs();

  if (isLoading) {
    return (
      <div className="flex-1 h-screen flex flex-col items-center justify-center bg-[#f8f9fa]">
        <LoadingSpinner size={100} />
        <p className="text-xs font-bold text-[#6d28d9] mt-3 tracking-wide animate-pulse">Loading transaction history...</p>
      </div>
    );
  }
  
  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#f8f9fa]">
      
      {/* LAPTOP / DESKTOP SCREENS VIEW (>= md) - UNTOUCHED ORIGINAL DESIGN */}
      <div className="hidden md:block p-8 lg:p-10 max-w-7xl mx-auto space-y-6 pb-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-[28px] font-black text-gray-900 tracking-tight">Transaction History</h1>
            <p className="text-[13px] text-gray-500 font-semibold mt-1">Track and manage your vault & bill payments</p>
          </div>
          
          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-purple-200 text-purple-700 font-bold text-xs bg-white hover:bg-purple-50 transition-all outline-none cursor-pointer shadow-sm"
          >
            <Download size={14} strokeWidth={2.5} />
            Export Report
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
              <Calendar size={20} className="text-purple-600" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Total Transactions</span>
              <span className="text-2xl font-black text-gray-900 leading-tight">{totalTxCount}</span>
              <span className="text-[11px] font-semibold text-gray-400">Across all time</span>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <div className="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                <IndianRupee size={12} className="text-emerald-600" strokeWidth={3} />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Total Volume</span>
              <span className="text-2xl font-black text-gray-900 leading-tight">₹{totalVolume.toLocaleString()}</span>
              <span className="text-[11px] font-semibold text-gray-400">Total amount spent</span>
            </div>
          </div>
        </div>

        {/* Filters Controls Row */}
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Date Range Picker */}
            <div className="md:col-span-5 flex flex-col sm:flex-row items-center gap-2 w-full">
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Calendar size={14} /></span>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold text-gray-600 bg-[#f8f9fc] border border-gray-100 rounded-xl outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-50 transition-all" 
                  placeholder="Start Date"
                />
              </div>
              <span className="text-gray-300 font-bold hidden sm:inline">—</span>
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Calendar size={14} /></span>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold text-gray-600 bg-[#f8f9fc] border border-gray-100 rounded-xl outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-50 transition-all" 
                  placeholder="End Date"
                />
              </div>
            </div>

            {/* Status Select dropdown */}
            <div className="md:col-span-3 relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Filter size={14} /></span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full pl-9 pr-8 py-2.5 text-xs font-semibold text-gray-600 bg-[#f8f9fc] border border-gray-100 rounded-xl appearance-none outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-50 transition-all cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><ChevronDown size={14} /></span>
            </div>

            {/* Search Input ID */}
            <div className="md:col-span-4 relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Search size={14} /></span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Transaction ID, Merchant..."
                className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold text-gray-600 bg-[#f8f9fc] border border-gray-100 rounded-xl outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-50 transition-all"
              />
            </div>

          </div>
        </div>

        {/* Sub-tabs List */}
        <div className="flex border-b border-gray-200 overflow-x-auto hide-scrollbar whitespace-nowrap gap-6">
          {[
            { id: "all", label: "All Transactions" },
            { id: "gold", label: "Gold Transactions" },
            { id: "silver", label: "Silver Transactions" },
            { id: "bills", label: "Bill Payments" }
          ].map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 font-bold text-xs relative cursor-pointer bg-transparent border-none transition-colors duration-200 outline-none
                  ${active ? "text-purple-600" : "text-gray-400 hover:text-gray-700"}`}
              >
                {tab.label}
                {active && (
                  <motion.div 
                    layoutId="activeHistoryTab"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-purple-600 rounded-t-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Transaction History Log list */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {Object.keys(grouped).length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-gray-100 text-center"
              >
                <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-3">
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-sm font-bold text-gray-800">No transactions match your criteria</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-[280px]">Try adjusting your search queries, date range, or filters to view records.</p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {Object.entries(grouped).map(([dateKey, group]) => (
                  <div key={dateKey} className="space-y-3">
                    
                    {/* Day Header */}
                    <div 
                      onClick={group.list.length > 1 ? () => toggleGroup(dateKey) : undefined}
                      className={`flex justify-between items-center select-none px-1 ${group.list.length > 1 ? 'cursor-pointer' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-purple-600" />
                        <span className="text-xs font-black text-gray-800">{dateKey}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-800">Total: ₹{group.total.toLocaleString()}</span>
                        {group.list.length > 1 && (
                          <motion.span
                            animate={{ rotate: expandedGroups[dateKey] === false ? -90 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-center text-gray-400 shrink-0"
                          >
                            <ChevronDown size={16} />
                          </motion.span>
                        )}
                      </div>
                    </div>

                    {/* Transactions list for the day */}
                    {expandedGroups[dateKey] !== false && (
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
                      {group.list.map(tx => {
                        const statusColors = 
                          tx.status === "Completed" 
                            ? { text: "text-emerald-700 bg-emerald-50 border-emerald-100" }
                            : tx.status === "Pending"
                            ? { text: "text-amber-700 bg-amber-50 border-amber-100" }
                            : { text: "text-rose-700 bg-rose-50 border-rose-100" };

                        const txTime = new Date(tx.date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit"
                        });

                        // Determine Icon
                        let TxIcon = <Banknote size={16} className="text-gray-500" />;
                        let iconBg = "bg-gray-100";
                        if (tx.category.toLowerCase() === "gold") {
                           TxIcon = <span className="text-lg">🪙</span>;
                           iconBg = "bg-amber-50";
                        } else if (tx.category.toLowerCase() === "silver") {
                           TxIcon = <span className="text-lg">🪙</span>; // Silver coin emoji variant not widely supported, using standard
                           iconBg = "bg-slate-100";
                        } else if (tx.source.toLowerCase().includes("electricity")) {
                           TxIcon = <Zap size={16} className="text-purple-600" />;
                           iconBg = "bg-purple-50";
                        } else if (tx.source.toLowerCase().includes("recharge")) {
                           TxIcon = <Smartphone size={16} className="text-purple-600" />;
                           iconBg = "bg-purple-50";
                        } else if (tx.source.toLowerCase().includes("fiber") || tx.source.toLowerCase().includes("wifi")) {
                           TxIcon = <Wifi size={16} className="text-blue-600" />;
                           iconBg = "bg-blue-50";
                        } else if (tx.source.toLowerCase().includes("rent") || tx.source.toLowerCase().includes("home")) {
                           TxIcon = <Home size={16} className="text-purple-600" />;
                           iconBg = "bg-purple-50";
                        }

                        // Determine Amount Sign & Color
                        const isPositive = tx.type === "Buy" || tx.type === "Receive";
                        const amountColor = isPositive ? "text-emerald-600" : "text-gray-900";
                        const amountSign = isPositive ? "+" : "-";

                        return (
                          <div 
                            key={tx.id} 
                            onClick={() => downloadInvoicePDF(tx)}
                            className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            
                            {/* Left: Status + Time/ID + Icon + Details */}
                            <div className="flex items-center gap-4 min-w-0 flex-1">
                              {/* Status Badge */}
                              <div className={`px-2 py-1 text-[9px] font-black tracking-wider rounded border flex items-center justify-center uppercase w-16 text-center ${statusColors.text}`}>
                                {tx.status === "Completed" ? "Success" : tx.status === "Pending" ? "Pending" : "Failed"}
                              </div>

                              {/* Time & ID */}
                              <div className="flex flex-col gap-0.5 text-left w-16 shrink-0">
                                <span className="text-[10px] font-bold text-gray-500">{txTime}</span>
                                <span className="text-[9px] font-semibold text-gray-400 font-mono tracking-tight">{tx.id}</span>
                              </div>

                              {/* Icon */}
                              <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center shrink-0`}>
                                {TxIcon}
                              </div>

                              {/* Channel/Category Detail */}
                              <div className="flex flex-col gap-0.5 min-w-0 text-left">
                                <span className="text-xs font-extrabold text-gray-900 truncate">{tx.source}</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                  {tx.type} {tx.grams ? `(${tx.grams} G)` : ""}
                                </span>
                              </div>
                            </div>

                            {/* Right: Method & Amount */}
                            <div className="flex items-center gap-6 shrink-0">
                              
                              <div className="flex items-center gap-2">
                                <div className="flex flex-col text-right">
                                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Method</span>
                                  <span className="text-[11px] font-bold text-gray-700">{tx.paymentMethod}</span>
                                </div>
                                <div className="text-gray-400 w-12 flex items-center justify-end">
                                  {tx.paymentMethod === "UPI" ? (
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-4 object-contain" />
                                  ) : tx.paymentMethod === "Credit Card" ? (
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5 object-contain" />
                                  ) : (
                                    <Landmark size={18} className="text-gray-400" />
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className={`text-sm font-black w-20 text-right ${amountColor}`}>
                                  {amountSign} ₹{tx.amount.toLocaleString()}
                                </span>
                                <ChevronRight size={16} className="text-gray-300" />
                              </div>

                            </div>

                          </div>
                        );
                      })}
                      </div>
                    )}

                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Stats Bar */}
        <div className="bg-[#f8f9fc] border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
           <div className="flex items-center gap-3 w-full sm:w-auto">
             <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <ShieldCheck size={18} className="text-emerald-500" />
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] font-bold text-gray-500">Successful</span>
               <span className="text-xs font-black text-gray-900">
                 {filteredTransactions.filter(t => t.status === "Completed").length} <span className="text-gray-400 text-[10px] font-semibold">({filteredTransactions.length ? Math.round(filteredTransactions.filter(t => t.status === "Completed").length / filteredTransactions.length * 100) : 0}%)</span>
               </span>
             </div>
           </div>
           
           <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

           <div className="flex items-center gap-3 w-full sm:w-auto">
             <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <AlertTriangle size={18} className="text-rose-500" />
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] font-bold text-gray-500">Failed</span>
               <span className="text-xs font-black text-gray-900">
                 {filteredTransactions.filter(t => t.status === "Failed").length} <span className="text-gray-400 text-[10px] font-semibold">({filteredTransactions.length ? Math.round(filteredTransactions.filter(t => t.status === "Failed").length / filteredTransactions.length * 100) : 0}%)</span>
               </span>
             </div>
           </div>

           <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

           <div className="flex items-center gap-3 w-full sm:w-auto">
             <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Clock size={18} className="text-purple-600" />
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] font-bold text-gray-500">This Month</span>
               <span className="text-xs font-black text-gray-900">
                 ₹{filteredTransactions.filter(t => new Date(t.date).getMonth() === new Date().getMonth()).reduce((a, b) => a + b.amount, 0).toLocaleString()}
                 <span className="text-gray-400 text-[10px] font-semibold block">Total Spent</span>
               </span>
             </div>
           </div>

           <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

           <div className="flex items-center gap-3 w-full sm:w-auto">
             <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Home size={18} className="text-purple-600" />
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] font-bold text-gray-500">Avg. Transaction</span>
               <span className="text-xs font-black text-gray-900">
                 ₹{filteredTransactions.length ? Math.round(totalVolume / filteredTransactions.length).toLocaleString() : 0}
                 <span className="text-gray-400 text-[10px] font-semibold block">Per Transaction</span>
               </span>
             </div>
           </div>
        </div>

      </div>


      {/* MOBILE SCREENS VIEW (< md) - EXACT SPECIFICATION MATCHING USER SCREENSHOTS */}
      <div className="block md:hidden p-4 space-y-5 pb-24">
        
        {/* Header Row */}
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Transaction History</h1>
          <p className="text-[12px] text-gray-500 font-medium mt-0.5">
            {mobileDisplayList.length} transactions found
          </p>
        </div>

        {/* Combined Row: Search Input + Filters Icon + Export PDF Icon */}
        <div className="flex items-center gap-2.5 w-full">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions, ref..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#f3f4f6]/80 border border-gray-200/90 rounded-2xl text-[13px] text-gray-800 placeholder-gray-400 outline-none font-medium focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-2xs"
            />
          </div>

          {/* Filter Modal Toggle Button */}
          <button
            onClick={() => setShowFilterModal(!showFilterModal)}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs cursor-pointer border transition-all active:scale-95 outline-none ${
              showFilterModal 
                ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20" 
                : "bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50"
            }`}
            title="Filter Options"
          >
            <Filter size={17} className={showFilterModal ? "text-white" : "text-gray-600"} />
          </button>

          {/* Export PDF Button */}
          <button 
            onClick={handleExport}
            className="w-10 h-10 rounded-2xl bg-white border border-gray-200/80 text-gray-700 flex items-center justify-center shrink-0 shadow-2xs cursor-pointer hover:bg-gray-50 active:scale-95 transition-all outline-none"
            title="Export PDF / CSV"
          >
            <Download size={17} className="text-gray-600" />
          </button>
        </div>

        {/* Filter Options Modal / Drawer */}
        {showFilterModal && (
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-md space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-800">Filter Transactions</span>
              <button onClick={() => setShowFilterModal(false)} className="text-xs font-bold text-blue-600 bg-transparent border-none outline-none cursor-pointer">Close</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Status</label>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full p-2 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Start Date</label>
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Horizontal Scroll Pill Filters with Smooth Tab Shifting */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1 px-0.5">
          {[
            { id: "all", label: "All" },
            { id: "gold", label: "Gold" },
            { id: "sip", label: "SIP" },
            { id: "bills", label: "Bill Payments" },
            { id: "rewards", label: "Rewards" }
          ].map((pill) => {
            const isSelected = mobileTab === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setMobileTab(pill.id as any)}
                className={`relative px-5 py-2 rounded-full text-[13px] font-bold transition-all duration-200 cursor-pointer border-none outline-none whitespace-nowrap ${
                  isSelected 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]" 
                    : "bg-white text-gray-600 hover:text-gray-900 border border-gray-200/70 hover:border-blue-200 shadow-sm"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeMobileTabHighlight"
                    className="absolute inset-0 bg-blue-600 rounded-full -z-0"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{pill.label}</span>
              </button>
            );
          })}
        </div>

        {/* Transaction Cards List with Smooth Animated Shifting */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={mobileTab + searchQuery}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {mobileDisplayList.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-gray-100">
                <p className="text-xs font-bold text-gray-500">No transactions match your criteria</p>
              </div>
            ) : (
              mobileDisplayList.map((tx) => {
                const renderQuickActionIcon = () => {
                  if (tx.iconType === "gold") {
                    return (
                      <div className="w-12 h-12 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-center p-1.5 shadow-2xs shrink-0">
                        <img 
                          src="/gold-bars.png" 
                          alt="Digital Gold" 
                          className="w-8 h-8 object-contain drop-shadow-2xs" 
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                    );
                  } else if (tx.iconType === "silver") {
                    return (
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-1.5 shadow-2xs shrink-0">
                        <img 
                          src="/silver.png" 
                          alt="Digital Silver" 
                          className="w-8 h-8 object-contain drop-shadow-2xs" 
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                    );
                  } else if (tx.iconType === "sip") {
                    return (
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center shadow-2xs shrink-0">
                        <PiggyBank size={22} strokeWidth={2.2} />
                      </div>
                    );
                  } else if (tx.iconType === "bills") {
                    return (
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200/80 text-purple-600 flex items-center justify-center shadow-2xs shrink-0">
                        <FileText size={22} strokeWidth={2.2} />
                      </div>
                    );
                  } else if (tx.iconType === "rewards") {
                    return (
                      <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-200/80 text-pink-600 flex items-center justify-center shadow-2xs shrink-0">
                        <Gift size={22} strokeWidth={2.2} />
                      </div>
                    );
                  } else {
                    return (
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center shadow-2xs shrink-0">
                        <ArrowUpRight size={22} strokeWidth={2.2} />
                      </div>
                    );
                  }
                };

                const isPositive = tx.amount > 0;
                let amountColor = isPositive ? "text-emerald-600" : "text-purple-600";
                if (!isPositive && tx.title.includes("Gold")) amountColor = "text-blue-600";
                if (!isPositive && tx.title.includes("Bank")) amountColor = "text-red-600";

                const statusStyle = 
                  tx.status === "completed" 
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50" 
                    : tx.status === "pending"
                    ? "bg-amber-50 text-amber-600 border border-amber-100/50"
                    : "bg-rose-50 text-rose-600 border border-rose-100/50";

                return (
                  <div 
                    key={tx.id} 
                    className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm space-y-4"
                  >
                  {/* Top Row: Icon + Title/Subtitle + Amount/Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {renderQuickActionIcon()}
                      <div>
                        <h3 className="text-[15px] font-bold text-gray-900 leading-snug">{tx.title}</h3>
                        <p className="text-[12px] text-gray-500 font-medium mt-0.5">{tx.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span className={`text-[17px] font-extrabold ${amountColor}`}>
                        {isPositive ? "+" : "-"}₹{Math.abs(tx.amount).toLocaleString()}
                      </span>
                      <span className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${statusStyle}`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>

                  {/* Middle Row: Date + Time + Ref ID + Eye Icon */}
                  <div className="flex items-center justify-between text-[11px] font-medium text-gray-500 pt-1">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-gray-400" /> {tx.dateStr}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-gray-400" /> {tx.timeStr}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText size={13} className="text-gray-400" /> {tx.refId}
                      </span>
                    </div>

                    <button 
                      onClick={() => tx.rawTx ? downloadInvoicePDF(tx.rawTx) : null}
                      className="text-gray-400 hover:text-gray-700 transition-colors p-1 cursor-pointer outline-none bg-transparent border-none"
                    >
                      <Eye size={16} />
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gray-100" />

                  {/* Bottom 3-Column Metrics */}
                  <div className="grid grid-cols-3 gap-2 pt-0.5">
                    <div>
                      <div className="text-[11px] text-gray-400 font-medium">Charges</div>
                      <div className="text-[13px] text-gray-900 font-bold mt-0.5">₹{tx.charges.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-400 font-medium">GST</div>
                      <div className="text-[13px] text-gray-900 font-bold mt-0.5">₹{tx.gst.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-400 font-medium">Net Amount</div>
                      <div className="text-[13px] text-gray-900 font-bold mt-0.5">₹{tx.netAmount.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>
    </div>

    </div>
  );
}
