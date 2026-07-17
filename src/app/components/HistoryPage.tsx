"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Calendar, ChevronDown, Download, AlertCircle, 
  Filter, Clock, CheckCircle2, XCircle, FileText
} from "lucide-react";
import { getTransactions, Transaction } from "../utils/transactionStorage";
import { useFipModal } from "./FipModal";

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
  
  // Tabs: "all" | "gold" | "silver" | "bills"
  const [activeTab, setActiveTab] = useState<"all" | "gold" | "silver" | "bills">("all");
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Completed" | "Pending" | "Failed">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { showAlert } = useFipModal();

  // Load transactions
  useEffect(() => {
    setAllTransactions(getTransactions());
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

    const csvContent = [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `fipmoney_transactions_${new Date().toISOString().slice(0,10)}.csv`);
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

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#fcfdfd]">
      <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-6 pb-24 lg:pb-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Transaction History</h1>
            <p className="text-xs text-gray-400 font-semibold mt-1">Track and manage your vault & bill payments</p>
          </div>
          
          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-solid font-extrabold text-xs tracking-wide bg-white hover:bg-gray-50 transition-all outline-none cursor-pointer shadow-sm"
            style={{ borderColor: GOLD.G_DK, color: GOLD.G_DK }}
          >
            <Download size={14} strokeWidth={2.5} />
            Export Report
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-center relative overflow-hidden">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Transactions</h3>
            <h2 className="text-3xl font-black text-gray-900">{totalTxCount}</h2>
            <div className="absolute right-0 bottom-0 w-20 h-20 bg-gray-50 rounded-tl-full -mr-4 -mb-4 opacity-50 pointer-events-none" />
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-center relative overflow-hidden">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Volume</h3>
            <h2 className="text-3xl font-black text-gray-900">₹{totalVolume.toLocaleString()}</h2>
            <div className="absolute right-0 bottom-0 w-20 h-20 bg-gray-50 rounded-tl-full -mr-4 -mb-4 opacity-50 pointer-events-none" />
          </div>
        </div>

        {/* Filters Controls Row */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Date Range Picker */}
            <div className="md:col-span-5 flex flex-col sm:flex-row items-center gap-2 w-full">
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Calendar size={14} /></span>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold text-gray-600 bg-[#f8f9fc] border border-gray-200 rounded-xl outline-none focus:border-[#b87312] transition-colors" 
                  placeholder="Start Date"
                />
              </div>
              <span className="text-xs text-gray-400 font-bold hidden sm:inline">—</span>
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Calendar size={14} /></span>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold text-gray-600 bg-[#f8f9fc] border border-gray-200 rounded-xl outline-none focus:border-[#b87312] transition-colors" 
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
                className="w-full pl-9 pr-8 py-2 text-xs font-semibold text-gray-600 bg-[#f8f9fc] border border-gray-200 rounded-xl appearance-none outline-none focus:border-[#b87312] transition-colors cursor-pointer"
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
                placeholder="Search by Transaction ID..."
                className="w-full pl-9 pr-4 py-2 text-xs font-semibold text-gray-600 bg-[#f8f9fc] border border-gray-200 rounded-xl outline-none focus:border-[#b87312] transition-colors"
              />
            </div>

          </div>

          {/* Reset Filters button if active */}
          {(startDate || endDate || searchQuery || statusFilter !== "all") && (
            <div className="flex justify-end">
              <button 
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setStatusFilter("all");
                  setSearchQuery("");
                }}
                className="text-[10px] font-extrabold text-[#b87312] hover:text-[#efb652] transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Sub-tabs List */}
        <div className="flex border-b border-gray-100 overflow-x-auto hide-scrollbar whitespace-nowrap">
          {[
            { id: "all", label: "All Transactions" },
            { id: "gold", label: "Gold Transactions" },
            { id: "silver", label: "Silver Transactions" },
            { id: "bills", label: "Bill Transactions" }
          ].map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3.5 font-bold text-xs relative cursor-pointer bg-transparent border-none transition-colors duration-200 outline-none
                  ${active ? "text-[#b87312]" : "text-gray-400 hover:text-gray-700"}`}
              >
                {tab.label}
                {active && (
                  <motion.div 
                    layoutId="activeHistoryTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b87312]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Transaction History Log list */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
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
                className="space-y-6"
              >
                {Object.entries(grouped).map(([dateKey, group]) => (
                  <div key={dateKey} className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.01)] overflow-hidden">
                    
                    {/* Day Header Row styled as a Gold Banner */}
                    <div 
                      className="px-6 py-4 flex justify-between items-center text-white border-b shadow-sm font-sans"
                      style={{ 
                        background: `linear-gradient(135deg, ${GOLD.G_DK}, ${GOLD.G_LT})`,
                        borderColor: GOLD.G_DK 
                      }}
                    >
                      <span className="text-xs font-black tracking-wide drop-shadow-sm">{dateKey}</span>
                      <span className="text-xs font-black drop-shadow-sm">Total: ₹{group.total.toLocaleString()}</span>
                    </div>

                    {/* Transactions items */}
                    <div className="divide-y divide-gray-100">
                      {group.list.map(tx => {
                        const statusColors = 
                          tx.status === "Completed" 
                            ? { text: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: CheckCircle2 }
                            : tx.status === "Pending"
                            ? { text: "text-amber-700 bg-amber-50 border-amber-200", icon: Clock }
                            : { text: "text-rose-700 bg-rose-50 border-rose-200", icon: XCircle };

                        const StatusIcon = statusColors.icon;
                        const txTime = new Date(tx.date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit"
                        });

                        return (
                          <div key={tx.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                            
                            <div className="flex items-center gap-4 min-w-0 flex-1">
                              {/* Status Badge */}
                              <div className={`px-2.5 py-1 text-[9px] font-black tracking-wide rounded-md border border-solid flex items-center gap-1 uppercase shrink-0 ${statusColors.text}`}>
                                <StatusIcon size={10} strokeWidth={3} />
                                {tx.status === "Completed" ? "Success" : tx.status === "Pending" ? "Pending" : "Failed"}
                              </div>

                              {/* Time & ID */}
                              <div className="flex flex-col gap-0.5 shrink-0 text-left">
                                <span className="text-[11px] font-semibold text-gray-400">{txTime}</span>
                                <span className="text-xs font-bold text-gray-700 font-mono tracking-tight">{tx.id}</span>
                              </div>

                              {/* Channel/Category Detail */}
                              <div className="flex flex-col gap-0.5 min-w-0 text-left">
                                <span className="text-xs font-bold text-gray-900 truncate">{tx.source}</span>
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{tx.type} {tx.grams ? `(${tx.grams})` : ""}</span>
                              </div>
                            </div>

                            {/* Payment Method & Amount */}
                            <div className="flex sm:flex-row items-start sm:items-center gap-4 sm:gap-6 justify-between sm:justify-end shrink-0">
                              <div className="flex flex-col sm:items-end text-left sm:text-right">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Method</span>
                                <span className="text-xs font-bold text-gray-700">{tx.paymentMethod}</span>
                              </div>

                              <div className="text-right flex items-center gap-3">
                                <div className="text-right">
                                  <span className="text-sm font-black text-gray-900">
                                    {tx.type === "Sell" ? "-" : "+"} ₹{tx.amount.toLocaleString()}
                                  </span>
                                </div>
                                <button
                                  onClick={() => downloadInvoicePDF(tx)}
                                  title="Download PDF Invoice"
                                  className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 cursor-pointer transition-colors outline-none shrink-0"
                                >
                                  <FileText size={14} />
                                </button>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>

                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
