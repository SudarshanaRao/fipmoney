import React, { useState, useEffect } from "react";
import { Copy, Gift, Clock, Users, Trophy, ArrowRight, Share2, MessageCircle, Send, Facebook, Twitter, MoreHorizontal, UserPlus, Wallet, FileText, Maximize2, ThumbsUp, ThumbsDown, ChevronDown } from "lucide-react";
import { getLoggedInUser } from "../utils/userStorage";
import { API_BASE_URL } from "../utils/apiConfig";

interface ReferAndEarnProps {
  onNavigate: (page: string) => void;
}

export default function ReferAndEarn({ onNavigate }: ReferAndEarnProps) {
  const loggedInUser = typeof window !== 'undefined' ? getLoggedInUser() : null;
  // Use user.userId or userCode as UUID
  const userId = loggedInUser?.userId || loggedInUser?.userCode || loggedInUser?.mobileNumber || "guest";
  const userReferralCode = loggedInUser?.referralCode || loggedInUser?.userCode || "DHARSH123";

  const [faqStats, setFaqStats] = useState<Record<string, { likes: number, dislikes: number }>>({});
  const [userSelections, setUserSelections] = useState<Record<string, string>>({});
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [referralsTracked, setReferralsTracked] = useState<any[]>([]);
  const [expandedReferralId, setExpandedReferralId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || userId === "guest") return;
    fetch(`${API_BASE_URL}/faqs/feedback?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFaqStats(data.stats || {});
          setUserSelections(data.userSelections || {});
        }
      })
      .catch(console.error);

    // Fetch Referral Tracking
    fetch(`${API_BASE_URL}/users/referrals/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReferralsTracked(data.data || []);
        }
      })
      .catch(console.error);
  }, [userId]);

  const handleFeedback = async (faqId: string, action: string) => {
    if (!userId || userId === "guest") return;
    const prevSelection = userSelections[faqId];
    if (prevSelection === action) action = 'none'; // Toggle off

    setUserSelections(prev => ({ ...prev, [faqId]: action }));
    
    setFaqStats(prev => {
      const stats = prev[faqId] || { likes: 0, dislikes: 0 };
      let { likes, dislikes } = stats;
      if (prevSelection === 'like') likes = Math.max(0, likes - 1);
      if (prevSelection === 'dislike') dislikes = Math.max(0, dislikes - 1);
      if (action === 'like') likes++;
      if (action === 'dislike') dislikes++;
      return { ...prev, [faqId]: { likes, dislikes } };
    });

    try {
      await fetch(`${API_BASE_URL}/faqs/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faqId, userId, action })
      });
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  const referralFaqs = [
    { id: "faq1", question: "When will I receive my referral bonus?", answer: "You will receive your ₹50 digital gold referral bonus within 24-48 hours after your friend successfully completes a digital gold purchase of at least ₹250 within 30 days of creating their account." },
    { id: "faq2", question: "Is there a limit to how many friends I can refer?", answer: "No, there is no limit! You can refer as many friends as you want and keep earning the ₹50 digital gold bonus for every successful referral." },
    { id: "faq3", question: "What happens if my friend purchases gold after 30 days?", answer: "The referral reward is only applicable if the referee completes their first ₹250+ digital gold purchase within 30 days of account creation." },
    { id: "faq4", question: "Can I withdraw the digital gold?", answer: "Yes, you can sell your digital gold at any time and withdraw the cash to your linked bank account." },
    { id: "faq5", question: "How do I share my referral link?", answer: "You can copy your unique referral link from the dashboard or use the social share buttons to send it directly via WhatsApp, SMS, or Email." },
    { id: "faq6", question: "Where can I track my referrals?", answer: "You can track the status of all your referrals and pending earnings directly in the 'Your Earnings Summary' section." }
  ];

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
          <div className="flex flex-col space-y-4 h-full">
            
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
                <span className="flex-1 text-slate-500 font-medium text-sm truncate w-full sm:w-auto">https://fipmoney.com/ref/{userReferralCode}</span>
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
                  { step: 3, title: "Purchase Digital Gold", desc: "Friend purchases ₹250 worth of digital gold within 30 days", icon: Wallet, color: "text-blue-500", bg: "bg-blue-50" },
                  { step: 4, title: "You both earn rewards", desc: "You both get ₹50 worth of digital gold as earnings", icon: Gift, color: "text-purple-500", bg: "bg-purple-50" }
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

            {/* Mini Terms and Conditions Section */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative group flex flex-col flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-indigo-600" />
                  <h3 className="font-bold text-slate-800 text-base">Terms & Conditions Apply</h3>
                </div>
                <button onClick={() => onNavigate("referral-terms")} className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer bg-transparent border-none outline-none">
                  <Maximize2 size={18} />
                </button>
              </div>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
                <li>Referral bonus is credited only when your friend completes a minimum digital gold purchase of ₹250 within 30 days of registration.</li>
                <li>Both the referrer and the referee will receive ₹50 worth of digital gold.</li>
                <li>There is absolutely no limit to the number of friends you can refer and the rewards you can earn!</li>
                <li>The referral reward will be added directly to your vault balance.</li>
                <li>You can withdraw the referral reward directly to your linked bank account at any time.</li>
                <li>Any misuse of the referral program or suspicious activity will result in immediate disqualification.</li>
                <li>The referral link shared with the referee has a 30-day expiry from the day of creation.</li>
                <li>Fipmoney referral program for members is automatically terminated upon account closure or bankruptcy.</li>
                <li>Fipmoney at its discretion may terminate or close the referral program without prior notice.</li>
              </ul>
              <button onClick={() => onNavigate("referral-terms")} className="text-xs text-indigo-600 font-bold hover:underline mt-4 cursor-pointer bg-transparent border-none outline-none">
                Read Full T&Cs
              </button>
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

            {/* My Referrals Tracking */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 text-base">My Referrals</h3>
                <button className="text-indigo-600 text-xs font-bold bg-transparent border-none outline-none cursor-pointer hover:underline">
                  View All
                </button>
              </div>
              
              {referralsTracked.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-slate-500 font-medium">No referrals yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Share your link to start earning!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {referralsTracked.map((user, idx) => (
                    <div key={user.id || idx} className="border border-slate-100 rounded-xl overflow-hidden transition-all duration-200 bg-white shadow-xs">
                      <div 
                        onClick={() => setExpandedReferralId(expandedReferralId === user.id ? null : user.id)}
                        className="flex items-center gap-3 p-3 bg-slate-50 cursor-pointer hover:bg-slate-100/70 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-slate-800 truncate flex items-center gap-2">
                            {user.name}
                            {user.rewardCredited && (
                              <span className="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider">Credited</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex justify-between mt-0.5">
                            <span>Joined: {new Date(user.signupDate).toLocaleDateString()}</span>
                            <span className={user.hasPurchasedGold ? "text-emerald-600 font-semibold" : "text-amber-500 font-medium"}>
                              {user.hasPurchasedGold ? "Gold Purchased ✅" : "Purchase Pending"}
                            </span>
                          </div>
                        </div>
                        <ChevronDown 
                          size={16} 
                          className={`text-slate-400 shrink-0 transition-transform duration-200 ${expandedReferralId === user.id ? 'rotate-180 text-indigo-500' : ''}`} 
                        />
                      </div>
                      
                      {/* Expanded Tracking Details */}
                      <div className={`transition-all duration-300 ease-in-out ${expandedReferralId === user.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                        <div className="p-5 border-t border-slate-100 bg-slate-50/50">
                          
                          {/* Horizontal Progress Bar */}
                          <div className="relative max-w-sm mx-auto mt-2">
                            {/* Background Track */}
                            <div className="absolute top-5 left-8 right-8 h-[3px] bg-slate-200 rounded-full"></div>
                            {/* Active Track */}
                            <div className="absolute top-5 left-8 h-[3px] bg-emerald-500 rounded-full transition-all duration-700 ease-out" 
                                 style={{ width: user.hasPurchasedGold ? 'calc(100% - 2rem)' : user.isKycCompleted ? '50%' : '0%' }}></div>
                            
                            <div className="relative flex justify-between">
                              {/* Step 1: Shared/Joined */}
                              <div className="flex flex-col items-center gap-2 w-16">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-[3px] border-white shadow-sm z-10 relative">
                                  <UserPlus size={16} />
                                </div>
                                <div className="text-[10px] font-bold text-center text-slate-700 leading-tight">Joined</div>
                                <div className="text-[9px] text-slate-400 text-center whitespace-nowrap -mt-1">{new Date(user.signupDate).toLocaleDateString()}</div>
                              </div>

                              {/* Step 2: KYC */}
                              <div className="flex flex-col items-center gap-2 w-16">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-[3px] border-white shadow-sm z-10 relative transition-colors duration-500 ${user.isKycCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-white text-slate-300'}`}>
                                  <FileText size={16} />
                                </div>
                                <div className={`text-[10px] font-bold text-center leading-tight ${user.isKycCompleted ? 'text-slate-700' : 'text-slate-400'}`}>KYC Done</div>
                              </div>

                              {/* Step 3: Purchase */}
                              <div className="flex flex-col items-center gap-2 w-16">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-[3px] border-white shadow-sm z-10 relative transition-colors duration-500 ${user.hasPurchasedGold ? 'bg-emerald-50 text-emerald-600' : 'bg-white text-slate-300'}`}>
                                  <Wallet size={16} />
                                </div>
                                <div className={`text-[10px] font-bold text-center leading-tight ${user.hasPurchasedGold ? 'text-slate-700' : 'text-slate-400'}`}>₹250+ Gold</div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Reward Status Banner */}
                          <div className={`mt-6 rounded-xl p-3 flex items-center gap-3 border ${user.hasPurchasedGold ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${user.hasPurchasedGold ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-500'}`}>
                               <Gift size={16} />
                             </div>
                             <div>
                               <div className={`text-[11px] font-bold ${user.hasPurchasedGold ? 'text-emerald-800' : 'text-amber-800'}`}>
                                 {user.hasPurchasedGold ? 'Reward Unlocked!' : 'Reward Pending'}
                               </div>
                               <div className={`text-[10px] ${user.hasPurchasedGold ? 'text-emerald-600' : 'text-amber-600'} leading-tight mt-0.5`}>
                                 {user.hasPurchasedGold ? '₹50 Digital Gold has been credited to you.' : 'Waiting for friend to purchase digital gold.'}
                               </div>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

            {/* Referral FAQs Section */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle size={18} className="text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-base">Referral FAQs</h3>
              </div>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {referralFaqs.map(faq => (
                  <div key={faq.id} className="border border-slate-100 rounded-xl overflow-hidden transition-all duration-200 bg-white shadow-xs">
                    <button 
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-3.5 text-left bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer border-none outline-none"
                    >
                      <h4 className="text-sm font-bold text-slate-700 pr-4">{faq.question}</h4>
                      <ChevronDown 
                        size={16} 
                        className={`text-slate-400 shrink-0 transition-transform duration-200 ${expandedFaq === faq.id ? 'rotate-180 text-indigo-500' : ''}`} 
                      />
                    </button>
                    
                    {/* Dropdown Content */}
                    <div 
                      className={`transition-all duration-300 ease-in-out ${expandedFaq === faq.id ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                    >
                      <div className="p-3.5 pt-2 border-t border-slate-50">
                        <p className="text-xs text-slate-500 mb-3 leading-relaxed">{faq.answer}</p>
                        
                        {/* Feedback Buttons */}
                        <div className="flex items-center gap-4 bg-slate-50/50 p-2 rounded-lg w-fit">
                          <span className="text-[10px] text-slate-400 font-medium">Was this helpful?</span>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleFeedback(faq.id, 'like')}
                              className={`flex items-center gap-1 text-[11px] cursor-pointer bg-transparent border-none outline-none transition-colors ${userSelections[faq.id] === 'like' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-indigo-500'}`}
                            >
                              <ThumbsUp size={12} className={userSelections[faq.id] === 'like' ? 'fill-indigo-100' : ''} />
                              <span>{faqStats[faq.id]?.likes || 0}</span>
                            </button>
                            <button 
                              onClick={() => handleFeedback(faq.id, 'dislike')}
                              className={`flex items-center gap-1 text-[11px] cursor-pointer bg-transparent border-none outline-none transition-colors ${userSelections[faq.id] === 'dislike' ? 'text-red-500 font-bold' : 'text-slate-400 hover:text-red-500'}`}
                            >
                              <ThumbsDown size={12} className={userSelections[faq.id] === 'dislike' ? 'fill-red-100' : ''} />
                              <span>{faqStats[faq.id]?.dislikes || 0}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
