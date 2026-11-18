import React, { useState, useEffect } from "react";
import { Copy, Gift, Clock, Users, Trophy, ArrowRight, Share2, MessageCircle, Send, Facebook, Twitter, MoreHorizontal, UserPlus, FileText, Maximize2, ThumbsUp, ThumbsDown, ChevronDown, TrendingUp, Coins, CircleDollarSign } from "lucide-react";
import { getLoggedInUser, getUserAvatar } from "../utils/userStorage";
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
  const [summaryData, setSummaryData] = useState({
    totalEarnings: 0,
    pendingEarnings: 0,
    successfulReferrals: 0,
    availableBalance: 0
  });
  const [expandedReferralId, setExpandedReferralId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://fipmoney.com/ref/${userReferralCode}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const [myAvatar, setMyAvatar] = useState<string | null>(() => getUserAvatar(loggedInUser?.mobileNumber));

  useEffect(() => {
    const handleAvatarChange = () => {
      setMyAvatar(getUserAvatar(loggedInUser?.mobileNumber));
    };
    window.addEventListener("fm_avatar_changed", handleAvatarChange);
    return () => window.removeEventListener("fm_avatar_changed", handleAvatarChange);
  }, [loggedInUser?.mobileNumber]);

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

    const mobileNumber = loggedInUser?.mobileNumber;
    if (!mobileNumber) return;

    // Fetch Referral Tracking
    fetch(`${API_BASE_URL}/users/referrals?mobile=${mobileNumber}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReferralsTracked(data.data || []);
        }
      })
      .catch(console.error);

    // Fetch Referral Summary
    fetch(`${API_BASE_URL}/users/referrals/summary?mobile=${mobileNumber}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSummaryData(data.data || {
            totalEarnings: 0,
            pendingEarnings: 0,
            successfulReferrals: 0,
            availableBalance: 0
          });
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
    { id: "faq1", question: "When will I receive my referral bonus?", answer: "You will receive your ₹50 digital gold referral bonus within 24-48 hours after your friend successfully completes a digital gold purchase of at least ₹500 within 30 days of creating their account." },
    { id: "faq2", question: "Is there a limit to how many friends I can refer?", answer: "No, there is no limit! You can refer as many friends as you want and keep earning the ₹50 digital gold bonus for every successful referral." },
    { id: "faq3", question: "What happens if my friend purchases gold after 30 days?", answer: "The referral reward is only applicable if the referee completes their first ₹500+ digital gold purchase within 30 days of account creation." },
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
    <div className="flex-1 h-screen overflow-y-auto bg-white pb-24 text-slate-900 font-sans relative">
      <div className="p-4 lg:p-6 max-w-[1200px] mx-auto space-y-4 relative z-10">

        {/* Dashboard Grid */}
        <div className="flex flex-col xl:grid xl:grid-cols-[1.5fr_1fr] gap-4">

          {/* Left Column (Main Content) */}
          <div className="contents xl:flex xl:flex-col xl:space-y-4 xl:h-full">

            {/* Header */}
            <div className="order-1 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-white text-[#047857] rounded-lg border border-emerald-300">
                  <Gift size={20} className="text-amber-500" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">Refer & Earn</h1>
                  <p className="text-xs text-slate-600 font-medium">Invite your friends to Fipmoney and earn exciting rewards</p>
                </div>
              </div>
            </div>

            {/* Hero Banner Image */}
            <div className="order-2 w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200">
              <img src="/refer_and_earn.png" alt="Refer and Earn" className="w-full h-[160px] sm:h-[200px] md:h-[235px] object-cover object-center" />
            </div>

            {/* Referral Link Card */}
            <div className="order-3 bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Share2 size={18} className="text-[#047857]" />
                <h3 className="font-bold text-slate-900 text-base">Your Referral Link</h3>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#f8fafc] p-1.5 pl-3 rounded-xl border border-slate-200 mb-4">
                <span className="flex-1 text-slate-600 font-medium text-sm truncate w-full sm:w-auto">https://fipmoney.com/ref/{userReferralCode}</span>
                <button onClick={handleCopyLink} className="w-full sm:w-auto bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] hover:from-[#022c22] hover:via-[#064e3b] hover:to-[#047857] text-white font-bold py-2.5 px-6 rounded-lg transition-all flex items-center justify-center gap-1.5 text-sm whitespace-nowrap cursor-pointer border border-[#F3F6E8]/30 outline-none shadow-md shadow-emerald-900/20">
                  <Copy size={16} className="text-amber-300" />
                  {copiedLink ? "Copied!" : "Copy Link"}
                </button>
              </div>

              <div className="relative flex items-center justify-center my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200/60"></div></div>
                <span className="relative bg-white px-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest">or share via</span>
              </div>

              <div className="flex flex-wrap justify-center gap-2.5">
                <button className="flex items-center gap-1.5 bg-[#f8fafc] border border-slate-200 text-emerald-800 px-3.5 py-2 rounded-full font-semibold text-xs hover:bg-[#f8fafc] transition cursor-pointer">
                  <MessageCircle size={16} className="text-green-500" /> WhatsApp
                </button>
                <button className="flex items-center gap-1.5 bg-[#f8fafc] border border-slate-200 text-emerald-800 px-3.5 py-2 rounded-full font-semibold text-xs hover:bg-[#f8fafc] transition cursor-pointer">
                  <Send size={16} className="text-sky-500" /> Telegram
                </button>
                <button className="flex items-center gap-1.5 bg-[#f8fafc] border border-slate-200 text-emerald-800 px-3.5 py-2 rounded-full font-semibold text-xs hover:bg-[#f8fafc] transition cursor-pointer hidden sm:flex">
                  <Facebook size={16} className="text-blue-500" /> Facebook
                </button>
                <button className="flex items-center gap-1.5 bg-[#f8fafc] border border-slate-200 text-emerald-800 px-3.5 py-2 rounded-full font-semibold text-xs hover:bg-[#f8fafc] transition cursor-pointer hidden sm:flex">
                  <Twitter size={16} className="text-sky-400" /> Twitter
                </button>
                <button className="flex items-center gap-1.5 bg-[#f8fafc] border border-slate-200 text-emerald-800 px-3.5 py-2 rounded-full font-semibold text-xs hover:bg-[#f8fafc] transition cursor-pointer">
                  <MoreHorizontal size={16} className="text-slate-400" /> More
                </button>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="order-6 bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              {/* DESKTOP VIEW */}
              <div className="hidden md:block">
                <div className="flex items-center gap-2 mb-6">
                  <Clock size={18} className="text-[#047857]" />
                  <h3 className="font-bold text-slate-900 text-base">How It Works</h3>
                </div>

                <div className="flex flex-row items-center justify-between gap-0 relative">
                  <div className="absolute top-5 left-12 right-12 h-[1px] bg-slate-200 -z-10" />

                  {[
                    { step: 1, title: "Share your link", desc: "Invite your friends using your unique referral link", icon: Share2, color: "text-[#047857]", bg: "bg-[#f8fafc]" },
                    { step: 2, title: "They join & verify", desc: "Your friend signs up and completes KYC", icon: UserPlus, color: "text-amber-500", bg: "bg-amber-50" },
                    { step: 3, title: "Purchase Digital Gold", desc: "Friend purchases ₹500 worth of digital gold within 30 days", icon: Coins, color: "text-amber-600", bg: "bg-amber-50" },
                    { step: 4, title: "You both earn rewards", desc: "You both get ₹50 worth of digital gold as earnings", icon: Gift, color: "text-[#047857]", bg: "bg-[#f8fafc]" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center gap-3 w-1/4 relative bg-white">
                      <div className={`w-10 h-10 rounded-full ${item.bg} ${item.color} flex items-center justify-center border-4 border-white shadow-sm shrink-0`}>
                        <item.icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-0.5 mt-1">Step {item.step}</div>
                        <h4 className="font-bold text-slate-900 text-sm mb-0.5">{item.title}</h4>
                        <p className="text-xs text-slate-600 leading-tight max-w-[150px] mx-auto">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MOBILE VIEW (MATCHING SCREENSHOT 1) */}
              <div className="block md:hidden space-y-4">
                {/* Mobile Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/50">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">How It Works</h3>
                    <p className="text-xs text-slate-400 font-medium">Simple 4-step process</p>
                  </div>
                </div>

                {/* Step 1 Card (Muted Forest Sage) */}
                <div className="bg-[#f8fafc] border border-emerald-300 rounded-2xl p-4 relative shadow-2xs">
                  <div className="flex items-start gap-3.5">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-10 h-10 rounded-full bg-[#485E47] text-white font-extrabold text-base flex items-center justify-center shadow-xs">
                        1
                      </div>
                      <div className="w-[2px] h-6 bg-emerald-300 mt-2" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Share2 size={16} className="text-[#047857]" />
                          <h4 className="font-bold text-slate-900 text-sm">Share Your Link</h4>
                        </div>
                        <ArrowRight size={16} className="text-[#047857]" />
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                        Share your unique referral link with friends and family
                      </p>
                      <button
                        onClick={handleCopyLink}
                        className="mt-3 bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] hover:from-[#022c22] hover:via-[#064e3b] hover:to-[#047857] text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer border border-[#F3F6E8]/30 outline-none flex items-center gap-1.5 shadow-xs"
                      >
                        <Copy size={13} />
                        {copiedLink ? "Copied Link!" : "Copy Link"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 2 Card (Amber) */}
                <div className="bg-[#f8fafc] border border-amber-200/90 rounded-2xl p-4 relative shadow-2xs">
                  <div className="flex items-start gap-3.5">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-10 h-10 rounded-full bg-amber-500 text-white font-extrabold text-base flex items-center justify-center shadow-xs">
                        2
                      </div>
                      <div className="w-[2px] h-6 bg-amber-200/90 mt-2" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserPlus size={16} className="text-amber-500" />
                          <h4 className="font-bold text-slate-900 text-sm">Friend Joins & Invests</h4>
                        </div>
                        <ArrowRight size={16} className="text-amber-400" />
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                        Your friend signs up and makes their first investment of ₹500+
                      </p>
                      <button
                        onClick={() => {
                          const el = document.getElementById("my-referrals-section");
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="mt-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer border-none outline-none flex items-center gap-1.5 shadow-xs"
                      >
                        Track Progress
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 3 Card (Deep Amber) */}
                <div className="bg-[#f8fafc] border border-amber-200/90 rounded-2xl p-4 relative shadow-2xs">
                  <div className="flex items-start gap-3.5">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-10 h-10 rounded-full bg-amber-600 text-white font-extrabold text-base flex items-center justify-center shadow-xs">
                        3
                      </div>
                      <div className="w-[2px] h-6 bg-amber-200/90 mt-2" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coins size={16} className="text-amber-600" />
                          <h4 className="font-bold text-slate-900 text-sm">Purchase Digital Gold</h4>
                        </div>
                        <ArrowRight size={16} className="text-amber-400" />
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                        Friend purchases ₹500 worth of digital gold within 30 days
                      </p>
                      <button
                        onClick={() => onNavigate("vault")}
                        className="mt-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer border-none outline-none flex items-center gap-1.5 shadow-xs"
                      >
                        View Rewards
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 4 Card (Sage Forest Rewards) */}
                <div className="bg-[#f8fafc] border border-emerald-300 rounded-2xl p-4 relative shadow-2xs">
                  <div className="flex items-start gap-3.5">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-10 h-10 rounded-full bg-[#059669] text-white font-extrabold text-base flex items-center justify-center shadow-xs">
                        4
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Gift size={16} className="text-[#047857]" />
                          <h4 className="font-bold text-slate-900 text-sm">Both Earn Rewards</h4>
                        </div>
                        <ArrowRight size={16} className="text-[#047857]" />
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                        You get ₹50, your friend gets ₹50 instantly credited
                      </p>
                      <button
                        onClick={() => onNavigate("vault")}
                        className="mt-3 bg-[#059669] hover:bg-[#485E47] text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer border-none outline-none flex items-center gap-1.5 shadow-xs"
                      >
                        View Rewards
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Mini Terms and Conditions Section */}
            <div className="order-7 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 relative group flex flex-col flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-[#047857]" />
                  <h3 className="font-bold text-slate-900 text-base">Terms & Conditions Apply</h3>
                </div>
                <button onClick={() => onNavigate("referral-terms")} className="text-slate-600 hover:text-[#047857] transition-colors cursor-pointer bg-transparent border-none outline-none">
                  <Maximize2 size={18} />
                </button>
              </div>
              <ul className="list-disc pl-5 text-sm text-emerald-800 space-y-2 font-medium">
                <li>Referral bonus is credited only when your friend completes a minimum digital gold purchase of ₹500 within 30 days of registration.</li>
                <li>Both the referrer and the referee will receive ₹50 worth of digital gold.</li>
                <li>There is absolutely no limit to the number of friends you can refer and the rewards you can earn!</li>
                <li>The referral reward will be added directly to your vault balance.</li>
                <li>You can withdraw the referral reward directly to your linked bank account at any time.</li>
                <li>Any misuse of the referral program or suspicious activity will result in immediate disqualification.</li>
                <li>The referral link shared with the referee has a 30-day expiry from the day of creation.</li>
                <li>Fipmoney referral program for members is automatically terminated upon account closure or bankruptcy.</li>
                <li>Fipmoney at its discretion may terminate or close the referral program without prior notice.</li>
              </ul>
              <button onClick={() => onNavigate("referral-terms")} className="text-xs text-[#047857] font-bold hover:underline mt-4 cursor-pointer bg-transparent border-none outline-none">
                Read Full T&Cs
              </button>
            </div>

          </div>

          {/* Right Column (Sidebar metrics) */}
          <div className="contents xl:flex xl:flex-col xl:space-y-4">

            {/* Earnings Summary / Referral Stats */}
            <div className="order-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              {/* DESKTOP VIEW */}
              <div className="hidden md:block">
                <h3 className="font-bold text-slate-900 text-base mb-4">Your Earnings Summary</h3>

                <div className="grid grid-cols-3 gap-2.5 mb-3">
                  <div className="bg-[#f8fafc] rounded-xl p-3 border border-slate-200">
                    <div className="text-[11px] font-semibold text-[#047857] mb-1 leading-tight">Total Earnings</div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-lg font-black text-slate-900">₹{summaryData.totalEarnings.toLocaleString()}</span>
                      <Coins size={14} className="text-[#047857] ml-auto" />
                    </div>
                  </div>
                  <div className="bg-[#f8fafc] rounded-xl p-3 border border-amber-100">
                    <div className="text-[11px] font-semibold text-amber-600 mb-1 leading-tight">Pending Earnings</div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-lg font-black text-amber-900">₹{summaryData.pendingEarnings.toLocaleString()}</span>
                      <Clock size={14} className="text-amber-400 ml-auto" />
                    </div>
                  </div>
                  <div className="bg-[#f8fafc] rounded-xl p-3 border border-emerald-300">
                    <div className="text-[11px] font-semibold text-[#047857] mb-1 leading-tight">Successful Referrals</div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-lg font-black text-slate-900">{summaryData.successfulReferrals}</span>
                      <Users size={14} className="text-emerald-600 ml-auto" />
                    </div>
                  </div>
                </div>

                <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center border border-emerald-300 shrink-0">
                      <Trophy size={16} className="text-amber-500" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-600">Available Balance</div>
                      <div className="text-base font-black text-slate-900">₹{summaryData.availableBalance.toLocaleString()}</div>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] hover:from-[#022c22] hover:via-[#064e3b] hover:to-[#047857] text-white font-bold py-2 px-3.5 rounded-xl text-xs transition-colors flex items-center gap-1 border border-[#F3F6E8]/30 outline-none cursor-pointer shadow-sm">
                    Withdraw Earnings <ArrowRight size={14} className="text-amber-300" />
                  </button>
                </div>
                <div className="text-left text-[10px] text-slate-600 mt-2 px-1">
                  Minimum withdrawal amount is ₹100
                </div>
              </div>

              {/* MOBILE VIEW (MATCHING SCREENSHOT 2) */}
              <div className="block md:hidden">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-full bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/50">
                    <Trophy size={18} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Your Referral Stats</h3>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  {/* Total Friends */}
                  <div className="bg-[#f8fafc] rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-emerald-300 shadow-2xs">
                    <div className="w-12 h-12 rounded-full bg-[#485E47] text-white flex items-center justify-center mb-2.5 shadow-xs">
                      <Users size={22} />
                    </div>
                    <div className="text-2xl font-black text-slate-900 leading-none mb-1">
                      {referralsTracked.length || summaryData.successfulReferrals || 0}
                    </div>
                    <div className="text-xs font-bold text-[#047857]">Total Friends</div>
                  </div>

                  {/* Successful */}
                  <div className="bg-[#f8fafc] rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-emerald-300 shadow-2xs">
                    <div className="w-12 h-12 rounded-full bg-[#059669] text-white flex items-center justify-center mb-2.5 shadow-xs">
                      <TrendingUp size={22} />
                    </div>
                    <div className="text-2xl font-black text-slate-900 leading-none mb-1">
                      {summaryData.successfulReferrals}
                    </div>
                    <div className="text-xs font-bold text-emerald-600">Successful</div>
                  </div>

                  {/* Total Earned */}
                  <div className="bg-[#f8fafc] rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-amber-100/90 shadow-2xs">
                    <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center mb-2.5 shadow-xs">
                      <Coins size={22} />
                    </div>
                    <div className="text-2xl font-black text-amber-600 leading-none mb-1">
                      ₹{summaryData.totalEarnings}
                    </div>
                    <div className="text-xs font-bold text-amber-600">Total Earned</div>
                  </div>

                  {/* Cashback */}
                  <div className="bg-[#f8fafc] rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-emerald-300 shadow-2xs">
                    <div className="w-12 h-12 rounded-full bg-[#047857] text-white flex items-center justify-center mb-2.5 shadow-xs">
                      <CircleDollarSign size={22} />
                    </div>
                    <div className="text-2xl font-black text-slate-900 leading-none mb-1">
                      ₹{summaryData.availableBalance || summaryData.pendingEarnings}
                    </div>
                    <div className="text-xs font-bold text-[#a855f7]">Cashback</div>
                  </div>
                </div>

                <div className="mt-3.5 bg-[#f8fafc] rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-amber-500 shrink-0 border border-emerald-300">
                      <Trophy size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Available Balance</div>
                      <div className="text-sm font-black text-slate-900">₹{summaryData.availableBalance.toLocaleString()}</div>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] hover:from-[#022c22] hover:via-[#064e3b] hover:to-[#047857] text-white font-bold py-2 px-3 rounded-xl text-xs transition flex items-center gap-1 border border-[#F3F6E8]/30 outline-none cursor-pointer shadow-xs">
                    Withdraw <ArrowRight size={14} className="text-amber-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* My Referrals Tracking */}
            <div id="my-referrals-section" className="order-5 bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-base">My Referrals</h3>
                <button className="text-[#047857] text-xs font-bold bg-transparent border-none outline-none cursor-pointer hover:underline">
                  View All
                </button>
              </div>

              {referralsTracked.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-emerald-800 font-medium">No referrals yet.</p>
                  <p className="text-xs text-slate-600 mt-1">Share your link to start earning!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {referralsTracked.map((user, idx) => (
                    <div key={user.id || idx} className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 bg-[#f8fafc] shadow-xs">
                      <div
                        onClick={() => setExpandedReferralId(expandedReferralId === user.id ? null : user.id)}
                        className="flex items-center gap-3 p-3 bg-[#f8fafc] cursor-pointer hover:bg-[#f8fafc] transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#059669] text-white flex items-center justify-center font-extrabold text-sm shrink-0 uppercase overflow-hidden relative shadow-xs">
                          <span>{(user.name || "U").charAt(0)}</span>
                          {((user.mobileNumber === loggedInUser?.mobileNumber || user.isYou) ? myAvatar : (user.profileImage && user.profileImage.trim() !== "" ? user.profileImage : null)) && (
                            <img
                              src={(user.mobileNumber === loggedInUser?.mobileNumber || user.isYou) ? (myAvatar || "") : user.profileImage}
                              alt={user.name}
                              className="absolute inset-0 w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-slate-900 truncate flex items-center gap-2">
                            {user.name}
                            {user.rewardCredited && (
                              <span className="bg-white text-emerald-800 border border-emerald-300 text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider">Credited</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-600 flex justify-between mt-0.5">
                            <span>Joined: {new Date(user.signupDate).toLocaleDateString()}</span>
                            <span className={user.hasPurchasedGold ? "text-[#047857] font-semibold" : "text-amber-500 font-medium"}>
                              {user.hasPurchasedGold ? "Gold Purchased ✅" : (user.isKycCompleted ? "Purchase Pending" : "KYC Pending")}
                            </span>
                          </div>
                        </div>
                        <ChevronDown
                          size={16}
                          className={`text-slate-600 shrink-0 transition-transform duration-200 ${expandedReferralId === user.id ? 'rotate-180 text-[#047857]' : ''}`}
                        />
                      </div>

                      {/* Expanded Tracking Details */}
                      <div className={`transition-all duration-300 ease-in-out ${expandedReferralId === user.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                        <div className="p-5 border-t border-slate-200/60 bg-white/50">

                          {/* Horizontal Progress Bar */}
                          <div className="relative max-w-sm mx-auto mt-2">
                            {/* Background Track */}
                            <div className="absolute top-5 left-8 right-8 h-[3px] bg-slate-200 rounded-full"></div>
                            {/* Active Track */}
                            <div className="absolute top-5 left-8 h-[3px] bg-[#047857] rounded-full transition-all duration-700 ease-out"
                              style={{ width: user.hasPurchasedGold ? 'calc(100% - 2rem)' : user.isKycCompleted ? '50%' : '0%' }}></div>

                            <div className="relative flex justify-between">
                              {/* Step 1: Shared/Joined */}
                              <div className="flex flex-col items-center gap-2 w-16">
                                <div className="w-10 h-10 rounded-full bg-[#f8fafc] text-[#047857] flex items-center justify-center border-[3px] border-white shadow-sm z-10 relative">
                                  <UserPlus size={16} />
                                </div>
                                <div className="text-[10px] font-bold text-center text-slate-900 leading-tight">Joined</div>
                                <div className="text-[9px] text-slate-600 text-center whitespace-nowrap -mt-1">{new Date(user.signupDate).toLocaleDateString()}</div>
                              </div>

                              {/* Step 2: KYC */}
                              <div className="flex flex-col items-center gap-2 w-16">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-[3px] border-white shadow-sm z-10 relative transition-colors duration-500 ${user.isKycCompleted ? 'bg-[#f8fafc] text-[#047857]' : 'bg-white text-slate-300'}`}>
                                  <FileText size={16} />
                                </div>
                                <div className={`text-[10px] font-bold text-center leading-tight ${user.isKycCompleted ? 'text-slate-900' : 'text-slate-600'}`}>KYC Done</div>
                              </div>

                              {/* Step 3: Purchase */}
                              <div className="flex flex-col items-center gap-2 w-16">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-[3px] border-white shadow-sm z-10 relative transition-colors duration-500 ${user.hasPurchasedGold ? 'bg-[#f8fafc] text-[#047857]' : 'bg-white text-slate-300'}`}>
                                  <Coins size={16} />
                                </div>
                                <div className={`text-[10px] font-bold text-center leading-tight ${user.hasPurchasedGold ? 'text-slate-900' : 'text-slate-600'}`}>₹500+ Gold</div>
                              </div>
                            </div>
                          </div>

                          {/* Reward Status Banner */}
                          <div className={`mt-6 rounded-xl p-3 flex items-center gap-3 border ${user.hasPurchasedGold ? 'bg-[#f8fafc] border-emerald-300' : 'bg-amber-50 border-amber-200'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${user.hasPurchasedGold ? 'bg-white text-[#047857]' : 'bg-amber-100 text-amber-500'}`}>
                              <Gift size={16} />
                            </div>
                            <div>
                              <div className={`text-[11px] font-bold ${user.hasPurchasedGold ? 'text-slate-900' : 'text-amber-800'}`}>
                                {user.hasPurchasedGold ? 'Reward Unlocked!' : 'Reward Pending'}
                              </div>
                              <div className={`text-[10px] ${user.hasPurchasedGold ? 'text-[#047857]' : 'text-amber-600'} leading-tight mt-0.5`}>
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
            <div className="order-8 bg-gradient-to-br from-white to-[#F5F7EA] rounded-2xl p-5 border border-slate-200 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <Gift size={16} className="text-[#047857]" />
                <h3 className="font-bold text-slate-900 text-sm">Referral Rewards</h3>
              </div>

              <div className="flex items-center gap-5 relative z-10">
                <div>
                  <div className="text-[11px] font-semibold text-[#047857] mb-0.5">You Get</div>
                  <div className="text-xl font-black text-slate-900 mb-0.5">₹50</div>
                  <div className="text-[10px] text-slate-600">on friend's first transaction</div>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div>
                  <div className="text-[11px] font-semibold text-[#047857] mb-0.5">Your Friend Gets</div>
                  <div className="text-xl font-black text-slate-900 mb-0.5">₹50</div>
                  <div className="text-[10px] text-slate-600">welcome bonus</div>
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
            <div className="order-9 bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle size={18} className="text-[#047857]" />
                <h3 className="font-bold text-slate-900 text-base">Referral FAQs</h3>
              </div>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {referralFaqs.map(faq => (
                  <div key={faq.id} className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 bg-[#f8fafc] shadow-xs">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-3.5 text-left bg-[#f8fafc] hover:bg-[#f8fafc] transition-colors cursor-pointer border-none outline-none"
                    >
                      <h4 className="text-sm font-bold text-slate-900 pr-4">{faq.question}</h4>
                      <ChevronDown
                        size={16}
                        className={`text-slate-600 shrink-0 transition-transform duration-200 ${expandedFaq === faq.id ? 'rotate-180 text-[#047857]' : ''}`}
                      />
                    </button>

                    {/* Dropdown Content */}
                    <div
                      className={`transition-all duration-300 ease-in-out ${expandedFaq === faq.id ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                    >
                      <div className="p-3.5 pt-2 border-t border-slate-200/60">
                        <p className="text-xs text-slate-600 mb-3 leading-relaxed font-medium">{faq.answer}</p>

                        {/* Feedback Buttons */}
                        <div className="flex items-center gap-4 bg-white p-2 rounded-lg w-fit border border-emerald-300">
                          <span className="text-[10px] text-slate-600 font-bold">Was this helpful?</span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleFeedback(faq.id, 'like')}
                              className={`flex items-center gap-1 text-[11px] cursor-pointer bg-transparent border-none outline-none transition-colors ${userSelections[faq.id] === 'like' ? 'text-[#047857] font-bold' : 'text-slate-600 hover:text-[#047857]'}`}
                            >
                              <ThumbsUp size={12} className={userSelections[faq.id] === 'like' ? 'fill-emerald-100 text-[#047857]' : ''} />
                              <span>{faqStats[faq.id]?.likes || 0}</span>
                            </button>
                            <button
                              onClick={() => handleFeedback(faq.id, 'dislike')}
                              className={`flex items-center gap-1 text-[11px] cursor-pointer bg-transparent border-none outline-none transition-colors ${userSelections[faq.id] === 'dislike' ? 'text-red-500 font-bold' : 'text-slate-600 hover:text-red-500'}`}
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
