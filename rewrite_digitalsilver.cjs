const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/components/DigitalGoldSilver.tsx');
const lines = fs.readFileSync(filePath, 'utf8').split('\\n');

let returnLineIndex = -1;
for (let i = 300; i < lines.length; i++) {
  if (lines[i].trim().startsWith('return (') && lines[i].trim().length < 15) {
    returnLineIndex = i;
    break;
  }
}

if (returnLineIndex === -1) {
  console.error("Could not find the return statement");
  process.exit(1);
}

let importIndex = lines.findIndex(line => line.includes('} from "lucide-react"'));
if (importIndex !== -1 && !lines.slice(0, importIndex+1).join('\\n').includes('ArrowRight')) {
  lines[importIndex - 1] = lines[importIndex - 1] + ', ArrowRight';
}

const newJsx = `  return (
    <>
    <div className="flex-1 h-screen overflow-y-auto bg-[#FAFAFA] text-slate-800 font-sans">
      <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 pb-28">

        {/* Dynamic KYC Warning Banner */}
        {isKycPending ? (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertCircle size={24} className="animate-pulse" />
              </div>
              <div>
                <p className="text-base font-extrabold text-red-900">KYC Verification Required</p>
                <p className="text-xs text-red-600/80 mt-1 leading-relaxed">
                  Your digital assets vault is currently locked. Link your Aadhaar and PAN database under profile configurations to activate purchases, transfers, and physical coin deliveries.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate("settings")}
              className="bg-red-500 hover:bg-red-600 text-white text-xs font-black px-5 py-3 rounded-2xl transition-all cursor-pointer border-none shrink-0"
            >
              Verify KYC Profile
            </button>
          </div>
        ) : isMinKyc ? (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-extrabold text-amber-900">Minimum KYC Limits Applied</p>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  You can purchase up to ₹10,000 and sell up to ₹5,000 daily. Finish Video KYC to lift all transaction boundaries.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate("settings")}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl transition-all cursor-pointer border-none shrink-0"
            >
              Complete Video KYC
            </button>
          </div>
        ) : null}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#111827]">Digital Gold & Silver Assets</h1>
            <p className="text-sm text-slate-500 mt-1">Invest in 24K gold & 99.9% pure silver with complete security.</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors">
              <Shield size={14} /> 100% Insured Storage
            </Badge>
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center relative shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </div>
          </div>
        </div>

        {/* Vault Holdings Summary Block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            onClick={() => setMetal("gold")}
            className={\`bg-white border p-5 rounded-2xl shadow-sm flex items-center gap-4 cursor-pointer transition-all hover:shadow-md \${metal === 'gold' ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-100'}\`}
          >
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center text-xl shrink-0">🪙</div>
            <div>
              <p className="text-[11px] font-bold text-slate-400">Digital Gold Balance</p>
              <p className="text-lg font-black text-slate-800 leading-tight">{goldHoldings.toFixed(4)} g</p>
              <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Value at ₹{goldPrice}/g</p>
              <p className="text-sm font-bold text-slate-700 mt-1">₹{Math.round(goldHoldings * goldPrice).toLocaleString()}</p>
            </div>
          </div>
          <div 
            onClick={() => setMetal("silver")}
            className={\`bg-white border p-5 rounded-2xl shadow-sm flex items-center gap-4 cursor-pointer transition-all hover:shadow-md \${metal === 'silver' ? 'border-slate-400 ring-2 ring-slate-100' : 'border-slate-100'}\`}
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xl shrink-0">🥈</div>
            <div>
              <p className="text-[11px] font-bold text-slate-400">Digital Silver Balance</p>
              <p className="text-lg font-black text-slate-800 leading-tight">{silverHoldings.toFixed(4)} g</p>
              <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Value at ₹{silverPrice}/g</p>
              <p className="text-sm font-bold text-slate-700 mt-1">₹{Math.round(silverHoldings * silverPrice).toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-[#FFFDF7] border border-amber-100 p-5 rounded-2xl shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Wallet size={18} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold text-slate-500">Total Vault Value</p>
              <p className="text-xl font-black text-slate-900 leading-tight">₹{Math.round((goldHoldings * goldPrice) + (silverHoldings * silverPrice)).toLocaleString()}</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-[10px] font-semibold text-slate-500 leading-snug">Locker Insured by<br/>Our Certified Partner</p>
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Shield size={12} fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Bar */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-wrap justify-between items-center gap-4 text-[10px] md:text-xs shadow-sm">
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">🪙</div><div className="font-bold text-slate-700">24K Pure Gold <span className="text-slate-400 font-medium block text-[9px] mt-0.5">99.9% Pure</span></div></div>
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500"><Shield size={16} /></div><div className="font-bold text-slate-700">100% Secure <span className="text-slate-400 font-medium block text-[9px] mt-0.5">Insurance Cover</span></div></div>
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg></div><div className="font-bold text-slate-700">Buy & Sell <span className="text-slate-400 font-medium block text-[9px] mt-0.5">Anytime</span></div></div>
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500"><Coins size={16} /></div><div className="font-bold text-slate-700">Low Entry <span className="text-slate-400 font-medium block text-[9px] mt-0.5">Start from ₹1</span></div></div>
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500"><TrendingUp size={16} /></div><div className="font-bold text-slate-700">Real-time Price <span className="text-slate-400 font-medium block text-[9px] mt-0.5">Live Market Rate</span></div></div>
        </div>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Area */}
          <div className="lg:col-span-8 space-y-6">

            {/* Live Chart Container */}
            <Card className="bg-white border-slate-100 rounded-[1.5rem] overflow-hidden text-slate-800 shadow-sm">
              <div className="p-6 pb-2 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-800">Real-time Valuation</span>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">₹{activePrice.toLocaleString()}<span className="text-xs font-semibold text-slate-400"> /gram</span></h2>
                    <span className={\`text-[10px] font-bold flex items-center gap-0.5 \${isPositive ? "text-emerald-500" : "text-rose-500"}\`}>
                      {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {isPositive ? "+" : ""}{performanceChange}%
                    </span>
                  </div>
                </div>

                {/* Timeframe Controls */}
                <div className="flex gap-2">
                  {(["1D", "1W", "1M", "1Y", "5Y"] as TimeFrame[]).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={\`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border-none outline-none cursor-pointer
                        \${timeframe === tf ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}\`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic SVG Drawing Box */}
              <div className="px-6 py-4 relative">
                 <svg viewBox={\`0 0 \${chartWidth} \${chartHeight}\`} className="w-full overflow-visible">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d={fillPath}
                    fill="url(#chartGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.path
                    d={linePath}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                  <circle
                    cx={chartWidth}
                    cy={chartHeight - ((activeDataset[activeDataset.length - 1] - minVal) / valRange) * (chartHeight - 30) - 15}
                    r="4"
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Chart Stats Footer */}
              <div className="flex justify-between items-center px-8 py-5 border-t border-slate-50">
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Lowest Rate</span>
                  <span className="text-sm font-black text-slate-800">₹{minVal.toLocaleString()}/g</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Highest Rate</span>
                  <span className="text-sm font-black text-slate-800">₹{maxVal.toLocaleString()}/g</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Vault Storage Tax</span>
                  <span className="text-sm font-black text-emerald-500">0% (Lifetime Free)</span>
                </div>
              </div>
            </Card>

            {/* Savings Auto-Save Calculator */}
            <Card className="bg-white border-slate-100 rounded-[1.5rem] p-6 text-slate-800 shadow-sm space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="8" x2="16" y1="10" y2="10"/><line x1="8" x2="16" y1="14" y2="14"/><line x1="8" x2="12" y1="18" y2="18"/></svg>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Auto-Save Wealth Estimator</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Estimate your future wealth by auto-saving in pure {label} regularly.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Monthly Investment Amount</span>
                      <span>₹{calcMonthly.toLocaleString()}</span>
                    </div>
                    <input
                      type="range" min="500" max="20000" step="500" value={calcMonthly}
                      onChange={(e) => setCalcMonthly(Number(e.target.value))}
                      className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-700 block">Investment Period</span>
                    <div className="flex gap-3">
                      {[1, 3, 5].map((y) => (
                        <button key={y} onClick={() => setCalcYears(y)}
                          className={\`flex-1 py-2 rounded-lg text-[11px] font-bold outline-none border transition-all cursor-pointer
                            \${calcYears === y ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-200 text-slate-600"}\`}
                        >
                          {y} {y === 1 ? "Year" : "Years"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Projection Results */}
                <div className="flex items-center">
                  <div className="w-full space-y-4">
                     <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-slate-500">Total Invested Capital</span>
                        <span className="text-slate-900">₹{projection.invested.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-slate-500">Estimated {label} Returns (12% p.a.)</span>
                        <span className="text-emerald-500">₹{projection.growth.toLocaleString()}</span>
                     </div>
                     <div className="border-t border-slate-100 pt-3">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">ESTIMATED PORTFOLIO VALUE</span>
                        <span className="text-2xl font-black text-indigo-600">₹{projection.projected.toLocaleString()}</span>
                     </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* "Your Wealth, 100% Secure" Banner */}
            <div className="bg-[#EEF2FF] rounded-[1.5rem] p-6 flex flex-row items-center justify-between overflow-hidden relative">
              <div className="relative z-10 max-w-[60%] space-y-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mb-3 shadow-md">
                  <Shield size={16} fill="currentColor" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">Your Wealth, 100% Secure</h3>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">All your gold & silver is stored in insured vaults with top-tier security.</p>
                <button className="mt-3 bg-white hover:bg-slate-50 text-indigo-600 text-[10px] font-bold py-2 px-4 rounded-full border border-indigo-100 cursor-pointer transition-colors flex items-center gap-1 shadow-sm">
                  Learn More <ArrowRight size={12} />
                </button>
              </div>
              <div className="absolute right-0 bottom-0 top-0 w-[45%] flex items-center justify-center">
                  <div className="text-8xl transform translate-x-4 translate-y-2 opacity-90 drop-shadow-xl">🗄️</div>
              </div>
            </div>

          </div>

          {/* Right Area */}
          <div className="lg:col-span-4 space-y-6">

            {/* Unified Transaction Box */}
            <Card className="bg-white border-slate-100 rounded-[1.5rem] p-5 text-slate-800 shadow-sm flex flex-col">
              <div>
                <div className="flex gap-6 border-b border-slate-100 pb-3 mb-5">
                  <button
                    onClick={() => { setTxType("buy"); setAmount(""); setGrams(""); }}
                    className={\`text-xs font-bold pb-2 bg-transparent cursor-pointer outline-none border-none transition-colors relative
                      \${txType === "buy" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"}\`}
                  >
                    Buy {label}
                    {txType === "buy" && <div className="absolute bottom-[-3px] left-0 right-0 h-[2px] bg-indigo-600 rounded-t-md"></div>}
                  </button>
                  <button
                    onClick={() => { setTxType("sell"); setAmount(""); setGrams(""); }}
                    className={\`text-xs font-bold pb-2 bg-transparent cursor-pointer outline-none border-none transition-colors relative
                      \${txType === "sell" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"}\`}
                  >
                    Sell {label}
                    {txType === "sell" && <div className="absolute bottom-[-3px] left-0 right-0 h-[2px] bg-indigo-600 rounded-t-md"></div>}
                  </button>
                </div>

                {/* KYC Pending Guard */}
                {isKycPending ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 text-xs font-semibold flex items-start gap-2.5">
                    <AlertCircle size={16} className="shrink-0 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-extrabold text-red-900">KYC Verification Required</p>
                      <p className="text-[11px] text-red-700/85 mt-1">Please complete Aadhaar and PAN verification under configurations to unlock buy/sell capabilities.</p>
                      <button
                        onClick={() => onNavigate("settings")}
                        className="mt-3 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black py-1.5 px-3 rounded-lg border-none cursor-pointer outline-none"
                      >
                        Verify Now
                      </button>
                    </div>
                  </div>
                ) : txType === "sell" && vaultLocked ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 text-xs font-semibold flex items-start gap-2">
                    <Lock size={16} className="shrink-0 text-red-500 mt-0.5 animate-pulse" />
                    <div>
                      <p className="font-extrabold text-red-900">Vault Locking Shield is Active</p>
                      <p className="text-[11px] text-red-700/80 mt-1">Turn off the Security Vault Lock below to allow sell orders.</p>
                    </div>
                  </div>
                ) : null}

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500">Investment Amount (INR)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">₹</span>
                      <Input
                        type="text" value={amount} onChange={(e) => handleAmountChange(e.target.value)}
                        placeholder="Enter amount" disabled={isProcessing || isKycPending}
                        className="pl-7 pr-4 py-5 bg-[#F8FAFC] border-slate-100 text-slate-800 focus-visible:ring-indigo-600 font-bold rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500">Weight Equivalent (grams)</label>
                    <div className="relative">
                      <Input
                        type="text" value={grams} onChange={(e) => handleGramsChange(e.target.value)}
                        placeholder="0.0000" disabled={isProcessing || isKycPending}
                        className="pr-8 pl-4 py-5 bg-[#F8FAFC] border-slate-100 text-slate-800 focus-visible:ring-indigo-600 font-bold rounded-xl text-sm"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-800 font-bold text-xs">g</span>
                    </div>
                  </div>

                  {txType === "buy" && !isKycPending && (
                    <div className="flex gap-2">
                      {[500, 1000, 5000].map(val => (
                        <button key={val} onClick={() => handleAmountChange(val.toString())} disabled={isProcessing}
                          className="flex-1 py-2 bg-white text-slate-600 text-[10px] font-bold rounded-lg border border-slate-200 cursor-pointer hover:border-slate-300"
                        >
                          +₹{val.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  )}

                  {!isKycPending && (
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500">
                        <span>Use Daily Limit</span>
                        <span className="text-slate-800">
                          {txType === "buy" ? \`₹\${(Number(amount) || 0).toLocaleString()} / ₹\${dailyBuyLimit.toLocaleString()}\` : \`₹\${(Number(amount) || 0).toLocaleString()} / ₹\${dailySellLimit.toLocaleString()}\`}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full transition-all duration-350"
                          style={{ width: \`\${Math.min(100, ((Number(amount) || 0) / (txType === "buy" ? dailyBuyLimit : dailySellLimit)) * 100)}\` + "%" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 text-center">
                <button
                  onClick={handleTransaction}
                  disabled={isKycPending || isProcessing || !amount || Number(amount) <= 0 || (txType === "sell" && vaultLocked)}
                  className="w-full py-3.5 rounded-xl font-bold text-xs transition-all outline-none border-none shadow-sm cursor-pointer flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500"
                >
                  {isProcessing ? <><Loader2 size={14} className="animate-spin" /> Executing...</> : \`\${txType === 'buy' ? 'Buy' : 'Sell'} 24K \${label}\`}
                </button>
                <div className="mt-3 text-[10px] font-semibold text-slate-500 flex items-center justify-center gap-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                   Live Prices: ₹{activePrice.toLocaleString()}/g
                </div>
              </div>
            </Card>

            {/* Lock Control */}
            <Card className="bg-white border-slate-100 rounded-[1.5rem] p-5 text-slate-800 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Lock size={16} />
                 </div>
                <div>
                  <h4 className="text-[11px] font-extrabold text-slate-800">Security Vault Lock</h4>
                  <p className="text-[9px] text-slate-500 font-medium leading-snug">Protects assets and<br/>transactions if active</p>
                </div>
              </div>
              <Switch checked={vaultLocked} onCheckedChange={setVaultLocked} className="data-[state=checked]:bg-indigo-600" />
            </Card>

            {/* History statements list */}
            <Card className="bg-white border-slate-100 rounded-[1.5rem] p-5 text-slate-800 shadow-sm">
              <h3 className="text-[11px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                Vault Statement Log
              </h3>

              <div className="space-y-4">
                {transactions.slice(0,3).map((tx, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className={\`w-6 h-6 rounded-full flex items-center justify-center mt-0.5
                        \${tx.type === "Buy" ? "bg-emerald-50 text-emerald-500" : "bg-amber-50 text-amber-500"}\`}>
                        {tx.type === "Buy" ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-800">{tx.type} {tx.metal}</p>
                        <p className="text-[9px] text-slate-500 font-medium">{tx.date} • {tx.grams}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-bold text-slate-800">{tx.amount}</p>
                      <span className="text-[9px] font-bold text-emerald-500">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 pt-4 border-t border-slate-100 text-[10px] font-bold text-indigo-600 flex items-center justify-center gap-1 bg-transparent border-none cursor-pointer hover:text-indigo-700 transition-colors">
                View All Transactions <ArrowRight size={12} />
              </button>
            </Card>
          </div>
        </div>

        {/* DOORSTEP COIN DELIVERY */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
             <div>
                <h3 className="text-sm font-extrabold text-slate-900">Doorstep Delivery of Vault Physical Metal</h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Redeem your virtual balance for certified 24K Gold & 99.9% Silver physical coins.</p>
             </div>
             <button className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 bg-transparent border-none cursor-pointer">
                How It Works? <Info size={12} />
             </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {DELIVERY_PRODUCTS.map((prod) => {
              const userHoldings = prod.metal === "gold" ? goldHoldings : silverHoldings;
              const isEligible = userHoldings >= prod.reqHoldings;
              return (
                <Card key={prod.id} className="bg-white border-slate-100 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-3">{prod.image}</div>
                  <h4 className="text-[11px] font-extrabold text-slate-900">{prod.name}</h4>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">{prod.weight}g - {prod.purity}</p>
                  
                  <div className="mt-4 pt-4 w-full border-t border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Requires</span>
                    <span className="text-[11px] font-black text-indigo-600">{prod.reqHoldings} g</span>
                  </div>

                  <button
                    onClick={() => handleRedeemProduct(prod)}
                    className={\`w-full mt-4 py-2.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer border-none outline-none
                      \${isEligible
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-indigo-600 text-white"}\`} 
                  >
                    Redeem Item
                  </button>
                </Card>
              );
            })}
          </div>
        </div>

      </div>

      {/* Checkout Processing Overlay Dialog */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white text-slate-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl border border-slate-100"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto animate-pulse">
                <Loader2 size={28} className="animate-spin" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-extrabold text-slate-900">Connecting to Secure Locker</h3>
                <p className="text-xs text-slate-500 leading-normal px-2">Finalizing weights, backing virtual assets with physical bullion vaults...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction Success Overlay Dialog */}
      <AnimatePresence>
        {txSuccess && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white text-slate-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl border border-slate-100"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-inner">
                <CheckCircle2 size={28} strokeWidth={2.5} />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-900">Transaction Confirmed</h3>
                <p className="text-xs text-emerald-600 font-semibold bg-emerald-50 py-2 px-3 rounded-lg border border-emerald-100 inline-block">{successMsg}</p>
                <p className="text-[10px] text-slate-400 font-bold block pt-2">TX Ref: {lastTxId} • Audited Vault Secure</p>
              </div>

              <Button
                onClick={() => setTxSuccess(false)}
                className="w-full bg-[#111827] text-white hover:bg-black py-3 rounded-xl font-bold text-xs"
              >
                Close Receipt
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Doorstep Physical Delivery Dialog */}
      <AnimatePresence>
        {activeDelivery && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white text-slate-800 rounded-3xl p-6 max-w-md w-full relative border border-slate-100 shadow-2xl space-y-5"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              <button
                onClick={() => setActiveDelivery(null)}
                className="absolute right-4 top-4 bg-transparent border-none text-slate-400 hover:text-slate-800 cursor-pointer outline-none"
              >
                <X size={18} />
              </button>

              <div className="flex gap-4 items-center border-b border-slate-100 pb-4">
                <div className="text-4xl">{activeDelivery.image}</div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-950">{activeDelivery.name}</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Doorstep Insured Transit • {activeDelivery.purity}</p>
                </div>
              </div>

              {deliverySuccess ? (
                <div className="text-center py-4 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-950">Redemption Successful!</h4>
                    <p className="text-[10px] text-slate-400 leading-normal mt-1">Your coins have been securely packed and dispatched. Track your delivery via SMS code in 24 hours.</p>
                  </div>
                  <Button
                    onClick={() => setActiveDelivery(null)}
                    className="w-full bg-[#111827] text-white py-3 rounded-xl font-bold text-xs"
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Vault Reduction</span>
                    <span className="text-sm font-black text-amber-500">-{activeDelivery.reqHoldings} g (Virtual Assets)</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Shipping Address</label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter full shipping address with PIN code..."
                      rows={3}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl focus:outline-none focus:border-indigo-600 resize-none"
                    />
                  </div>

                  <div className="bg-[#f0f9ff] p-3 rounded-xl border border-blue-50 text-[10px] text-slate-500 font-semibold leading-normal">
                    ⚠️ Physical delivery requests will permanently reduce your vault virtual holdings. Insured transit packaging fee is sponsored by our vault partner.
                  </div>

                  <Button
                    disabled={!deliveryAddress || isProcessing}
                    onClick={submitDeliveryRequest}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    {isProcessing ? <Loader2 size={12} className="animate-spin" /> : <Truck size={14} />}
                    Request Physical Delivery
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 text-center text-xs text-slate-500 py-4">
        Powered by <a href="https://metalpriceapi.com/" title="Free Precious Metal Rates API" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-indigo-600 hover:text-indigo-700">MetalpriceAPI.com</a>
      </div>

    </div>
    {ModalComponent}
    </>
  );
}
`;

lines.splice(returnLineIndex, lines.length - returnLineIndex, newJsx);
fs.writeFileSync(filePath, lines.join('\\n'), 'utf8');
console.log("Successfully replaced JSX content properly");
