import sys
import re

file_path = 'src/app/components/HistoryPage.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Imports
# Find the lucide-react import and replace it with a comprehensive one
lucide_import_pattern = r'import\s+\{([^}]*)\}\s+from\s+"lucide-react";'
new_lucide_import = '''import { 
  Search, Calendar, ChevronDown, Download, AlertCircle, 
  Filter, Clock, CheckCircle2, XCircle, FileText, IndianRupee,
  Activity, Wifi, Smartphone, Zap, Home, ShieldCheck, AlertTriangle, ChevronRight, CreditCard, Banknote
} from "lucide-react";'''
content = re.sub(lucide_import_pattern, new_lucide_import, content)

# 2. Extract logic before return
return_match = re.search(r'\s+return\s+\(\s*<div className="flex-1 h-screen', content)
if not return_match:
    print("Could not find return block!")
    sys.exit(1)

logic_part = content[:return_match.start()]

# 3. New Return Block
new_return_block = '''  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#f8f9fa]">
      <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-6 pb-24 lg:pb-10">
        
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
                className="space-y-8"
              >
                {Object.entries(grouped).map(([dateKey, group]) => (
                  <div key={dateKey} className="space-y-3">
                    
                    {/* Day Header */}
                    <div 
                      onClick={() => toggleGroup(dateKey)}
                      className="flex justify-between items-center cursor-pointer select-none px-1"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-purple-600" />
                        <span className="text-xs font-black text-gray-800">{dateKey}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-800">Total: ₹{group.total.toLocaleString()}</span>
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
                                <div className="text-gray-400">
                                  {tx.paymentMethod === "UPI" ? (
                                    <span className="font-black italic text-gray-500 text-sm">UPI</span>
                                  ) : tx.paymentMethod === "Credit Card" ? (
                                    <div className="flex">
                                      <div className="w-3 h-3 rounded-full bg-red-500/80 -mr-1 mix-blend-multiply"></div>
                                      <div className="w-3 h-3 rounded-full bg-yellow-500/80 mix-blend-multiply"></div>
                                    </div>
                                  ) : (
                                    <Home size={14} className="text-gray-400" />
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
    </div>
  );
}
'''

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(logic_part + new_return_block)

print("Updated HistoryPage.tsx successfully!")
