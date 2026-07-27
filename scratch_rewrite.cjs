const fs = require('fs');
const file = 'c:/Users/purna/fipmoney_/fipmoney/src/app/components/PortfolioPage.tsx';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

const startIdx = lines.findIndex(l => l.includes('return ('));
const endIdx = lines.findIndex(l => l.includes('{/* QUICK SELL MODAL DIALOG */}'));

if (startIdx === -1 || endIdx === -1) {
  console.log("Could not find bounds");
  process.exit(1);
}

const newJsx = `  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#fcfdfd] pb-24 relative font-sans text-gray-800">

      <div className="relative z-10 p-6 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">My Portfolio</h1>
            <p className="text-[13px] font-medium text-gray-500 mt-0.5">Real-time valuation of your precious metal holdings and cash balance.</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2.5 rounded-xl text-xs font-bold border border-emerald-100">
            <ShieldCheck size={16} /> Secure Vault Storage Verified
          </div>
        </div>

        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
           {/* PREMIUM ASSET VAULT */}
           <div className="bg-[#1a1525] rounded-[24px] p-6 lg:p-8 relative overflow-hidden text-white flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.12)] min-h-[280px]">
             {/* Background glow and graph */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-3xl rounded-full pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900/40 blur-3xl rounded-full pointer-events-none" />
             <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 500 250">
                <path d="M0,180 C100,180 180,80 250,130 C350,200 420,100 500,80 L500,250 L0,250 Z" fill="url(#wave-grad)" opacity="0.4" />
                <path d="M0,180 C100,180 180,80 250,130 C350,200 420,100 500,80" fill="none" stroke="#818cf8" strokeWidth="2.5" style={{ filter: 'drop-shadow(0px 0px 6px rgba(129,140,248,0.6))' }} />
                <circle cx="250" cy="130" r="4" fill="#fff" style={{ filter: 'drop-shadow(0px 0px 6px #fff)' }} />
                <defs>
                  <linearGradient id="wave-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </linearGradient>
                </defs>
             </svg>
             
             <div className="relative z-10 flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-amber-500 font-bold text-[11px] tracking-wider uppercase">
                   <Crown size={16} /> Premium Asset Vault
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-bold">
                   <Activity size={12} className="text-amber-400" /> Live Feed
                </div>
             </div>
             
             <div className="relative z-10">
                <div className="flex items-center gap-2 text-gray-300 text-[13px] font-medium mb-1">
                   Total Portfolio Value <Eye size={14} className="cursor-pointer hover:text-white transition-colors" />
                </div>
                <div className="text-[40px] font-black text-white tracking-tight leading-none mb-3">
                   ₹{Math.round(totalValue).toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                   <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-[11px] font-bold border border-emerald-500/20">
                      <ArrowUp size={12} strokeWidth={3} /> ₹{Math.round(Math.abs(totalGain)).toLocaleString()} ({totalGainPercent.toFixed(2)}%)
                   </span>
                   <span className="text-[12px] text-gray-400 font-medium">Absolute Gain</span>
                </div>
             </div>
             
             <div className="relative z-10 grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
                <div className="flex flex-col gap-1.5 border-r border-white/10">
                   <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Coins size={12} className="text-amber-400"/></div>
                      Bullion Value
                   </div>
                   <div className="text-[16px] font-bold ml-8">₹{Math.round(goldValue + silverValue).toLocaleString()}</div>
                </div>
                <div className="flex flex-col gap-1.5 border-r border-white/10 pl-2">
                   <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Wallet size={12} className="text-amber-500"/></div>
                      Cash Balance
                   </div>
                   <div className="text-[16px] font-bold text-amber-500 ml-8">₹{Math.round(cashBalance).toLocaleString()}</div>
                </div>
                <div className="flex flex-col gap-1.5 pl-2">
                   <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><LineChart size={12} className="text-gray-300"/></div>
                      Cost Basis
                   </div>
                   <div className="text-[16px] font-bold ml-8">₹{Math.round(totalCostBasis).toLocaleString()}</div>
                </div>
             </div>
           </div>
           
           {/* ASSET ALLOCATION */}
           <div className="bg-white rounded-[24px] p-6 lg:p-8 border border-gray-100 shadow-sm flex flex-col min-h-[280px]">
              <h3 className="text-[15px] font-bold text-gray-900 mb-6">Asset Allocation</h3>
              
              <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8">
                 {/* Donut Chart */}
                 <div className="relative w-40 h-40 shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                       <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#f1f5f9" strokeWidth="6" />
                       <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#10b981" strokeWidth="6" strokeDasharray={\`\${cashAlloc} \${100 - cashAlloc}\`} strokeDashoffset="0" />
                       <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#94a3b8" strokeWidth="6" strokeDasharray={\`\${silverAlloc} \${100 - silverAlloc}\`} strokeDashoffset={-cashAlloc} />
                       <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#fbbf24" strokeWidth="6" strokeDasharray={\`\${goldAlloc} \${100 - goldAlloc}\`} strokeDashoffset={-(cashAlloc + silverAlloc)} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white m-4 rounded-full shadow-inner">
                       <span className="text-[10px] font-bold text-gray-400 uppercase">Total</span>
                       <span className="text-[18px] font-black text-gray-900">100%</span>
                    </div>
                 </div>
                 
                 {/* Legend */}
                 <div className="flex-1 space-y-4 w-full">
                    <div className="flex justify-between items-start">
                       <div>
                          <div className="flex items-center gap-2 text-[12px] font-bold text-gray-900 mb-1">
                             <div className="w-2.5 h-2.5 rounded-full bg-amber-400" /> 24K Gold
                          </div>
                          <div className="text-[11px] text-gray-500 font-medium ml-4 pl-0.5">₹{Math.round(goldValue).toLocaleString()}</div>
                       </div>
                       <span className="text-[13px] font-bold text-gray-900">{goldAlloc.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-start">
                       <div>
                          <div className="flex items-center gap-2 text-[12px] font-bold text-gray-900 mb-1">
                             <div className="w-2.5 h-2.5 rounded-full bg-slate-400" /> 99.9 Silver
                          </div>
                          <div className="text-[11px] text-gray-500 font-medium ml-4 pl-0.5">₹{Math.round(silverValue).toLocaleString()}</div>
                       </div>
                       <span className="text-[13px] font-bold text-gray-900">{silverAlloc.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-start">
                       <div>
                          <div className="flex items-center gap-2 text-[12px] font-bold text-gray-900 mb-1">
                             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Cash Wallet
                          </div>
                          <div className="text-[11px] text-gray-500 font-medium ml-4 pl-0.5">₹{Math.round(cashBalance).toLocaleString()}</div>
                       </div>
                       <span className="text-[13px] font-bold text-gray-900">{cashAlloc.toFixed(1)}%</span>
                    </div>
                 </div>
              </div>
              
              <div className="mt-6 flex items-center gap-1.5 text-[11px] text-gray-400 font-medium pt-4 border-t border-gray-50">
                 Diversify your portfolio for better returns. <Info size={12} />
              </div>
           </div>
        </div>

        {/* Vault Holdings Section */}
        <div className="mt-8">
           <div className="flex justify-between items-center mb-4">
              <h2 className="text-[15px] font-bold text-gray-900">Vault Holdings</h2>
              <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 cursor-pointer hover:text-indigo-800 transition-colors">View All Holdings <ArrowRight size={12}/></span>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gold Vault Card */}
              <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
                 <div className="flex justify-between items-start mb-6 relative z-10">
                    <span className="bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md">24K GOLD VAULT</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center"><BarChart2 size={16}/></div>
                 </div>
                 
                 <div className="flex justify-between items-end relative z-10 mb-6">
                    <div>
                       <div className="text-[26px] font-bold text-gray-900 leading-tight mb-1">{goldHoldings.toFixed(4)} grams</div>
                       <div className="text-[11px] text-gray-500 font-medium mb-6">Average Buy Price: ₹{avgGoldBuyPrice.toLocaleString()}/g</div>
                       
                       <div className="flex gap-8">
                          <div>
                             <div className="text-[11px] text-gray-500 font-medium mb-1">Current Value</div>
                             <div className="text-[15px] font-bold text-gray-900">₹{Math.round(goldValue).toLocaleString()}</div>
                          </div>
                          <div>
                             <div className="text-[11px] text-gray-500 font-medium mb-1">Total Returns</div>
                             <div className="text-[15px] font-bold text-emerald-500 flex items-center gap-1"><ArrowUp size={12} strokeWidth={3}/> {(((goldValue - goldCostBasis) / (goldCostBasis || 1)) * 100).toFixed(2)}%</div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="absolute -right-4 bottom-16 w-32 h-32 opacity-90 pointer-events-none hidden sm:block">
                       <div className="absolute top-4 right-8 w-20 h-24 bg-gradient-to-br from-[#fef08a] via-[#eab308] to-[#854d0e] rounded-lg transform rotate-12 shadow-lg border border-yellow-300 flex items-center justify-center flex-col">
                          <span className="text-[8px] font-bold text-yellow-700 uppercase tracking-widest opacity-60">FIP</span>
                          <span className="text-[10px] font-black text-yellow-900 uppercase">GOLD</span>
                          <span className="text-[8px] font-bold text-yellow-700 uppercase tracking-widest opacity-80">24K</span>
                       </div>
                       <div className="absolute bottom-2 right-4 w-12 h-6 bg-gradient-to-br from-[#fde047] via-[#ca8a04] to-[#713f12] rounded-full shadow-md border border-yellow-400/50" />
                       <div className="absolute bottom-4 right-12 w-10 h-5 bg-gradient-to-br from-[#fde047] via-[#ca8a04] to-[#713f12] rounded-full shadow-md border border-yellow-400/50" />
                    </div>
                 </div>
                 
                 <button onClick={() => handleSellInitiate("gold")} className="w-full relative z-10 flex items-center justify-center gap-2 py-3 rounded-xl border border-amber-200 text-amber-600 bg-transparent font-bold text-[13px] hover:bg-amber-50 cursor-pointer transition-colors outline-none">
                    <Lock size={14} /> Sell Gold Instantly
                 </button>
              </div>

              {/* Silver Vault Card */}
              <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
                 <div className="flex justify-between items-start mb-6 relative z-10">
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md">99.9 SILVER VAULT</span>
                    <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center"><BarChart2 size={16}/></div>
                 </div>
                 
                 <div className="flex justify-between items-end relative z-10 mb-6">
                    <div>
                       <div className="text-[26px] font-bold text-gray-900 leading-tight mb-1">{silverHoldings.toFixed(4)} grams</div>
                       <div className="text-[11px] text-gray-500 font-medium mb-6">Average Buy Price: ₹{avgSilverBuyPrice.toLocaleString()}/g</div>
                       
                       <div className="flex gap-8">
                          <div>
                             <div className="text-[11px] text-gray-500 font-medium mb-1">Current Value</div>
                             <div className="text-[15px] font-bold text-gray-900">₹{Math.round(silverValue).toLocaleString()}</div>
                          </div>
                          <div>
                             <div className="text-[11px] text-gray-500 font-medium mb-1">Total Returns</div>
                             <div className="text-[15px] font-bold text-emerald-500 flex items-center gap-1"><ArrowUp size={12} strokeWidth={3}/> {(((silverValue - silverCostBasis) / (silverCostBasis || 1)) * 100).toFixed(2)}%</div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="absolute -right-4 bottom-16 w-32 h-32 opacity-90 pointer-events-none hidden sm:block">
                       <div className="absolute top-4 right-8 w-20 h-24 bg-gradient-to-br from-[#f8fafc] via-[#cbd5e1] to-[#64748b] rounded-lg transform rotate-12 shadow-lg border border-slate-300 flex items-center justify-center flex-col">
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest opacity-60">FIP</span>
                          <span className="text-[10px] font-black text-slate-700 uppercase">SILVER</span>
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest opacity-80">999</span>
                       </div>
                       <div className="absolute bottom-2 right-4 w-12 h-6 bg-gradient-to-br from-[#e2e8f0] via-[#94a3b8] to-[#475569] rounded-full shadow-md border border-slate-400/50" />
                       <div className="absolute bottom-4 right-12 w-10 h-5 bg-gradient-to-br from-[#e2e8f0] via-[#94a3b8] to-[#475569] rounded-full shadow-md border border-slate-400/50" />
                    </div>
                 </div>
                 
                 <button onClick={() => handleSellInitiate("silver")} className="w-full relative z-10 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-slate-600 bg-transparent font-bold text-[13px] hover:bg-slate-50 cursor-pointer transition-colors outline-none">
                    <Lock size={14} /> Sell Silver Instantly
                 </button>
              </div>
           </div>
        </div>

        {/* Third Row (Bottom 3 columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
           {/* Cash Balance */}
           <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div>
                 <div className="flex items-center gap-2 text-[14px] font-bold text-gray-900 mb-4">
                    <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center"><Wallet size={12}/></div> Cash Balance
                 </div>
                 <div className="text-[22px] font-bold text-gray-900 mb-0.5">₹{cashBalance.toFixed(2)}</div>
                 <div className="text-[10px] text-gray-500 font-medium mb-6">Available Balance</div>
              </div>
              <div className="relative z-10">
                 <button className="w-[120px] bg-emerald-50 text-emerald-600 font-bold text-[12px] py-2.5 rounded-xl border-none outline-none cursor-pointer hover:bg-emerald-100 transition-colors mb-4 block text-center">
                    Add Money
                 </button>
                 <div className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 cursor-pointer hover:text-indigo-800 transition-colors">View Transactions <ArrowRight size={12}/></div>
              </div>
              <div className="absolute -right-4 bottom-4 opacity-[0.03] pointer-events-none">
                 <Wallet size={120} />
              </div>
           </div>
           
           {/* Performance Summary */}
           <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-[14px] font-bold text-gray-900">Performance Summary</h3>
                 <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 rounded-lg text-[11px] font-medium text-gray-600 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                    Today <ChevronDown size={12}/>
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-[12px]">
                    <span className="text-gray-500 font-medium">Today's Gain</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1"><ArrowUp size={10} strokeWidth={3}/> ₹1,250 (1.12%)</span>
                 </div>
                 <div className="w-full h-px bg-gray-50" />
                 <div className="flex justify-between items-center text-[12px]">
                    <span className="text-gray-500 font-medium">Total Gain</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1"><ArrowUp size={10} strokeWidth={3}/> ₹{Math.round(Math.abs(totalGain)).toLocaleString()} ({totalGainPercent.toFixed(2)}%)</span>
                 </div>
                 <div className="w-full h-px bg-gray-50" />
                 <div className="flex justify-between items-center text-[12px]">
                    <span className="text-gray-500 font-medium">All Time Returns</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1"><ArrowUp size={10} strokeWidth={3}/> 12.48%</span>
                 </div>
                 <div className="w-full h-px bg-gray-50" />
                 <div className="flex justify-between items-center text-[12px]">
                    <span className="text-gray-500 font-medium">Invested Amount</span>
                    <span className="text-gray-900 font-bold">₹{Math.round(totalCostBasis).toLocaleString()}</span>
                 </div>
              </div>
           </div>
           
           {/* Market Updates */}
           <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[14px] font-bold text-gray-900">Market Updates</h3>
                    <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 cursor-pointer hover:text-indigo-800 transition-colors">View More <ArrowRight size={12}/></span>
                 </div>
                 
                 <div className="space-y-5">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0"><Coins size={16}/></div>
                       <div className="flex-1">
                          <div className="text-[11px] text-gray-500 font-medium mb-0.5">Gold Price (24K)</div>
                          <div className="flex items-center gap-2">
                             <span className="text-[13px] font-bold text-gray-900">₹{goldPrice.toLocaleString()} /g</span>
                             <span className="text-[10px] font-bold text-emerald-500 flex items-center"><ArrowUp size={10}/> 0.65%</span>
                          </div>
                       </div>
                       <div className="w-16 h-8 flex items-end opacity-80">
                          <svg viewBox="0 0 64 32" className="w-full h-full" preserveAspectRatio="none">
                             <path d="M0,20 L10,15 L20,22 L30,12 L40,16 L50,8 L64,12" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
                          </svg>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center shrink-0"><Coins size={16}/></div>
                       <div className="flex-1">
                          <div className="text-[11px] text-gray-500 font-medium mb-0.5">Silver Price (99.9%)</div>
                          <div className="flex items-center gap-2">
                             <span className="text-[13px] font-bold text-gray-900">₹{silverPrice.toLocaleString()} /g</span>
                             <span className="text-[10px] font-bold text-emerald-500 flex items-center"><ArrowUp size={10}/> 0.43%</span>
                          </div>
                       </div>
                       <div className="w-16 h-8 flex items-end opacity-80">
                          <svg viewBox="0 0 64 32" className="w-full h-full" preserveAspectRatio="none">
                             <path d="M0,25 L10,22 L20,24 L30,18 L40,20 L50,15 L64,12" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                          </svg>
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium pt-4 border-t border-gray-50 mt-4">
                 <Clock size={10}/> Prices updated just now
              </div>
           </div>
        </div>

        {/* Quick Actions (bottom) */}
        <div className="mt-8 pb-10">
           <h3 className="text-[14px] font-bold text-gray-900 mb-4">Quick Actions</h3>
           <div className="flex flex-wrap gap-3">
              <button onClick={() => onNavigate?.("sip")} className="flex items-center justify-center gap-2 bg-amber-50/50 text-amber-600 font-bold text-[12px] py-3.5 px-6 rounded-xl border border-amber-50 cursor-pointer hover:bg-amber-100 transition-colors flex-1 min-w-[140px] outline-none">
                 <Coins size={14} /> Buy Gold
              </button>
              <button onClick={() => onNavigate?.("sip")} className="flex items-center justify-center gap-2 bg-slate-50 text-slate-600 font-bold text-[12px] py-3.5 px-6 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors flex-1 min-w-[140px] outline-none">
                 <Coins size={14} /> Buy Silver
              </button>
              <button onClick={() => handleSellInitiate("gold")} className="flex items-center justify-center gap-2 bg-orange-50/30 text-orange-600 font-bold text-[12px] py-3.5 px-6 rounded-xl border border-orange-50 cursor-pointer hover:bg-orange-50 transition-colors flex-1 min-w-[140px] outline-none">
                 <Lock size={14} /> Sell Gold
              </button>
              <button onClick={() => handleSellInitiate("silver")} className="flex items-center justify-center gap-2 bg-slate-50/50 text-slate-600 font-bold text-[12px] py-3.5 px-6 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors flex-1 min-w-[140px] outline-none">
                 <Lock size={14} /> Sell Silver
              </button>
              <button onClick={() => onNavigate?.("history")} className="flex items-center justify-center gap-2 bg-indigo-50/50 text-indigo-600 font-bold text-[12px] py-3.5 px-6 rounded-xl border border-indigo-50 cursor-pointer hover:bg-indigo-50 transition-colors flex-1 min-w-[160px] outline-none">
                 <Activity size={14} /> Transaction Logs <ChevronRight size={14}/>
              </button>
           </div>
        </div>

      </div>`;

lines.splice(startIdx, endIdx - startIdx, newJsx);

fs.writeFileSync(file, lines.join('\\n'));
console.log("Successfully replaced the UI block");
