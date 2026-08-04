import React from "react";
import { Copy, Gift, Clock, Users, Trophy, ArrowRight, Share2, MessageCircle, Send, Facebook, Twitter, MoreHorizontal, UserPlus, Wallet } from "lucide-react";

interface ReferAndEarnProps {
  onNavigate: (page: string) => void;
}

export default function ReferAndEarn({ onNavigate }: ReferAndEarnProps) {
  
  const mockTopReferrers = [
    { rank: 1, name: "Rohit Sharma", amount: "₹12,450", referrals: 124, avatar: "https://i.pravatar.cc/150?img=11" },
    { rank: 2, name: "Priya Mehta", amount: "₹8,750", referrals: 86, avatar: "https://i.pravatar.cc/150?img=5" },
    { rank: 3, name: "Amit Verma", amount: "₹6,320", referrals: 63, avatar: "https://i.pravatar.cc/150?img=12" },
    { rank: 4, name: "Sneha Reddy", amount: "₹4,980", referrals: 48, avatar: "https://i.pravatar.cc/150?img=9" },
    { rank: 5, name: "You (Dharsh)", amount: "₹1,250", referrals: 12, avatar: "https://i.pravatar.cc/150?img=14", isYou: true },
  ];

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-white pb-24 text-slate-800 font-sans relative">
      <div className="p-4 lg:p-6 max-w-[1200px] mx-auto space-y-4 relative z-10">
        
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-4">
          
          {/* Left Column (Main Content) */}
          <div className="space-y-4">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Gift size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">Refer & Earn</h1>
                  <p className="text-xs text-slate-500 font-medium">Invite your friends to Fipmoney and earn exciting rewards</p>
                </div>
              </div>
            </div>
            
            {/* Hero Banner Image */}
            <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <img src="/refer_and_earn.png" alt="Refer and Earn" className="w-full h-[160px] sm:h-[200px] md:h-[235px] object-cover object-center" />
            </div>

            {/* Referral Link Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <Share2 size={18} className="text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-base">Your Referral Link</h3>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50/50 p-1.5 pl-3 rounded-xl border border-slate-200 mb-4">
                <span className="flex-1 text-slate-500 font-medium text-sm truncate w-full sm:w-auto">https://fipmoney.com/ref/DHARSH123</span>
                <button className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5 text-sm whitespace-nowrap cursor-pointer border-none outline-none">
                  <Copy size={16} />
                  Copy Link
                </button>
              </div>

              <div className="relative flex items-center justify-center my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <span className="relative bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">or share via</span>
              </div>

              <div className="flex flex-wrap justify-center gap-2.5">
                <button className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 px-3.5 py-2 rounded-full font-semibold text-xs hover:bg-slate-50 transition cursor-pointer">
                  <MessageCircle size={16} className="text-green-500" /> WhatsApp
                </button>
                <button className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 px-3.5 py-2 rounded-full font-semibold text-xs hover:bg-slate-50 transition cursor-pointer">
                  <Send size={16} className="text-sky-500" /> Telegram
                </button>
                <button className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 px-3.5 py-2 rounded-full font-semibold text-xs hover:bg-slate-50 transition cursor-pointer hidden sm:flex">
                  <Facebook size={16} className="text-blue-500" /> Facebook
                </button>
                <button className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 px-3.5 py-2 rounded-full font-semibold text-xs hover:bg-slate-50 transition cursor-pointer hidden sm:flex">
                  <Twitter size={16} className="text-sky-400" /> Twitter
                </button>
                <button className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 px-3.5 py-2 rounded-full font-semibold text-xs hover:bg-slate-50 transition cursor-pointer">
                  <MoreHorizontal size={16} className="text-slate-400" /> More
                </button>
              </div>
            </div>

            {/* How It Works Horizontal Stepper */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <Clock size={18} className="text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-base">How It Works</h3>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 relative">
                {/* Horizontal line for desktop */}
                <div className="hidden md:block absolute top-5 left-12 right-12 h-[1px] bg-slate-100 -z-10" />

                {[
                  { step: 1, title: "Share your link", desc: "Invite your friends using your unique referral link", icon: Share2, color: "text-emerald-500", bg: "bg-emerald-50" },
                  { step: 2, title: "They join & verify", desc: "Your friend signs up and completes KYC", icon: UserPlus, color: "text-amber-500", bg: "bg-amber-50" },
                  { step: 3, title: "They do first transaction", desc: "When your friend completes their first transaction", icon: Wallet, color: "text-blue-500", bg: "bg-blue-50" },
                  { step: 4, title: "You both earn rewards", desc: "You get rewards and your friend gets benefits too!", icon: Gift, color: "text-purple-500", bg: "bg-purple-50" }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-row md:flex-col items-center md:text-center gap-3 w-full md:w-1/4 relative bg-white">
                    <div className={`w-10 h-10 rounded-full ${item.bg} ${item.color} flex items-center justify-center border-4 border-white shadow-sm shrink-0`}>
                      <item.icon size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 md:mt-1">Step {item.step}</div>
                      <h4 className="font-bold text-slate-700 text-sm mb-0.5">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-tight max-w-[150px] md:mx-auto">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>

          {/* Right Column (Sidebar metrics) */}
          <div className="space-y-4">
            
            {/* Earnings Summary */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 text-base mb-4">Your Earnings Summary</h3>
              
              <div className="grid grid-cols-3 gap-2.5 mb-3">
                <div className="bg-[#faf5ff] rounded-xl p-3 border border-purple-50">
                  <div className="text-[11px] font-semibold text-purple-600 mb-1 leading-tight">Total Earnings</div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-lg font-black text-purple-900">₹1,250</span>
                    <Wallet size={14} className="text-purple-400 ml-auto" />
                  </div>
                </div>
                <div className="bg-[#fffbeb] rounded-xl p-3 border border-amber-50">
                  <div className="text-[11px] font-semibold text-amber-600 mb-1 leading-tight">Pending Earnings</div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-lg font-black text-amber-900">₹450</span>
                    <Clock size={14} className="text-amber-400 ml-auto" />
                  </div>
                </div>
                <div className="bg-[#f0fdf4] rounded-xl p-3 border border-emerald-50">
                  <div className="text-[11px] font-semibold text-emerald-600 mb-1 leading-tight">Successful Referrals</div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-lg font-black text-emerald-900">12</span>
                    <Users size={14} className="text-emerald-400 ml-auto" />
                  </div>
                </div>
              </div>

              <div className="bg-[#fffbeb] rounded-xl p-4 border border-amber-100/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center border border-amber-50 shrink-0">
                    <Trophy size={16} className="text-amber-500" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-500">Available Balance</div>
                    <div className="text-base font-black text-slate-800">₹800</div>
                  </div>
                </div>
                <button className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold py-2 px-3.5 rounded-md text-xs transition-colors flex items-center gap-1 border-none outline-none cursor-pointer shadow-sm">
                  Withdraw Earnings <ArrowRight size={14} />
                </button>
              </div>
              <div className="text-left text-[10px] text-slate-400 mt-2 px-1">
                Minimum withdrawal amount is ₹100
              </div>
            </div>

            {/* Top Referrers */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 text-base">Top Referrers</h3>
                <button className="text-indigo-600 text-xs font-bold bg-transparent border-none outline-none cursor-pointer hover:underline">
                  View All
                </button>
              </div>
              
              <div className="space-y-2">
                {mockTopReferrers.map((user) => (
                  <div key={user.rank} className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${user.isYou ? 'bg-indigo-50/50 border border-indigo-100/50' : 'hover:bg-slate-50'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0
                      ${user.rank === 1 ? 'bg-amber-100 text-amber-700' : 
                        user.rank === 2 ? 'bg-slate-200 text-slate-700' : 
                        user.rank === 3 ? 'bg-orange-100 text-orange-700' : 
                        'bg-slate-100 text-slate-500'}`}
                    >
                      {user.rank}
                    </div>
                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full bg-slate-200 border border-white shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-800 truncate">{user.name}</div>
                      <div className="text-[11px] text-slate-500 leading-none">{user.amount}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-slate-700 leading-none mb-0.5">{user.referrals}</div>
                      <div className="text-[10px] text-slate-400 font-medium">Referrals</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Referral Rewards Banner */}
            <div className="bg-[#f5f3ff] rounded-2xl p-5 border border-indigo-50 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <Gift size={16} className="text-indigo-600" />
                <h3 className="font-bold text-indigo-900 text-sm">Referral Rewards</h3>
              </div>
              
              <div className="flex items-center gap-5 relative z-10">
                <div>
                  <div className="text-[11px] font-semibold text-indigo-500 mb-0.5">You Get</div>
                  <div className="text-xl font-black text-indigo-900 mb-0.5">₹50</div>
                  <div className="text-[10px] text-indigo-400">on friend's first transaction</div>
                </div>
                <div className="w-px h-10 bg-indigo-200/50"></div>
                <div>
                  <div className="text-[11px] font-semibold text-indigo-500 mb-0.5">Your Friend Gets</div>
                  <div className="text-xl font-black text-indigo-900 mb-0.5">₹50</div>
                  <div className="text-[10px] text-indigo-400">welcome bonus</div>
                </div>
              </div>

              {/* Background Image */}
              <div 
                className="absolute inset-0 w-full h-full opacity-100 pointer-events-none z-0"
                style={{ 
                  backgroundImage: "url('/gift_with_confetti.png')", 
                  backgroundSize: "contain", 
                  backgroundRepeat: "no-repeat", 
                  backgroundPosition: "right center" 
                }}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
