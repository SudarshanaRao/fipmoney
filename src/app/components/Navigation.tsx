import React from "react";
import { Home, TrendingUp, Zap, Clock, Settings, LogOut, Landmark, Gift, HelpCircle, ChevronLeft, PiggyBank, Award, ChevronRight, X, Sparkles, User, PieChart, Calendar, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Capacitor } from "@capacitor/core";
import fipMoneyLogo from "../../imports/fipmoney_logo_final.png";
import { API_BASE_URL } from "../utils/apiConfig";

const G_LT = "#efb652";
const G_DK = "#b87312";

export type Tab = "home" | "portfolio" | "sip" | "savings" | "silver-savings" | "bills" | "history" | "settings" | "banking" | "offers" | "help" | "notifications" | "refer-and-earn" | "terms" | "referral-terms" | "privacy" | "become-agent" | "menu";

export const navItems = [
  { id: "home",           Icon: Home,       label: "Dashboard" },
  { id: "portfolio",      Icon: PieChart,   label: "Portfolio"  },
  { id: "sip",            Icon: TrendingUp, label: "Digital Gold & Silver"  },
  { id: "savings",        Icon: PiggyBank,  label: "Gold SIP Savings"       },
  { id: "silver-savings", Icon: Sparkles,   label: "Silver SIP Savings"     },
  { id: "bills",          Icon: Zap,        label: "Bills & Recharges"      },
  { id: "history",        Icon: Clock,      label: "History"    },
];

interface NavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
  onBecomeAgent?: () => void;
  profileCompletion?: number;
}

export const Sidebar = ({ activeTab, onTabChange, onLogout, onBecomeAgent, profileCompletion = 100 }: NavProps) => {
  const [isApprovedDga, setIsApprovedDga] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const mobile = sessionStorage.getItem("fm_logged_in_mobile");
      const saved = localStorage.getItem("fm_dga_waitlist_data");
      
      let localIsApproved = false;
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.mobile && mobile && parsed.mobile !== mobile) {
            localStorage.removeItem("fm_dga_waitlist_data");
          } else if (parsed.isApproved || parsed.status === 'approved' || parsed.status === 'APPROVED') {
            localIsApproved = true;
          }
        } catch (e) {
          localStorage.removeItem("fm_dga_waitlist_data");
        }
      }
      setIsApprovedDga(localIsApproved);

      if (mobile) {
        fetch(`${API_BASE_URL}/agent-waitlist/check?mobile=${encodeURIComponent(mobile)}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.success && data.alreadyRegistered) {
              const isAppr = data.isApproved || data.status === 'approved' || data.status === 'APPROVED';
              setIsApprovedDga(isAppr);
              try {
                const existing = saved ? JSON.parse(saved) : {};
                const updatedObj = {
                  ...existing,
                  waitlistNumber: data.waitlistNumber,
                  formattedWaitlistNumber: data.formattedWaitlistNumber,
                  username: data.data?.username || "Agent Partner",
                  alreadyRegistered: true,
                  isApproved: isAppr,
                  status: data.status,
                  mobile: data.data?.mobile || mobile,
                };
                localStorage.setItem("fm_dga_waitlist_data", JSON.stringify(updatedObj));
              } catch (e) {}
            } else if (data && data.success && !data.alreadyRegistered) {
              setIsApprovedDga(false);
              localStorage.removeItem("fm_dga_waitlist_data");
            }
          })
          .catch(() => {});
      }
    }
  }, []);

  return (
    <>
    <div className="hidden lg:flex w-64 bg-gradient-to-b from-[#022c22] via-[#064e3b] to-[#022c22] border-r border-emerald-300/30 flex-col py-6 px-4 shrink-0 h-screen sticky top-0 overflow-y-auto hide-scrollbar">
      <div className="flex items-center gap-1.5 mb-8 px-2">
        <img src={fipMoneyLogo} alt="FM" className="w-16 h-16 object-contain hover:scale-105 transition-transform shrink-0" />
        <span className="text-2xl font-bold text-white tracking-wide">Fipmoney</span>
      </div>

      <div className="flex flex-col gap-1.5 flex-1">
        {navItems.map(({ id, Icon, label }) => {
          const actualId = id;
          const active = activeTab === actualId;
          return (
            <button key={id} onClick={() => onTabChange(actualId as Tab)}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-medium text-sm outline-none border-none cursor-pointer
                ${active ? 'text-white shadow-lg bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] border border-emerald-300/40' : 'text-white/80 hover:bg-white/10 hover:text-white bg-transparent'}`}
              >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              {label}
            </button>
          );
        })}
        
        {/* Secondary Items */}
        {[
          { id: "refer-and-earn", label: "Referral Rewards", Icon: Gift },
          { id: "settings", label: "Settings", Icon: Settings, hasAlert: profileCompletion < 50 },
          { id: "help", label: "Help & Support", Icon: HelpCircle },
        ].map((item, i) => {
          const active = activeTab === item.id;
          return (
            <button key={i} onClick={() => onTabChange(item.id as Tab)}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-medium text-sm outline-none border-none cursor-pointer
                ${active ? 'text-white shadow-lg bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] border border-emerald-300/40' : 'text-white/80 hover:bg-white/10 hover:text-white bg-transparent'}`}
              >
              <div className="flex items-center gap-4 relative">
                <div className="relative">
                  <item.Icon size={20} strokeWidth={active ? 2.5 : 2} />
                  {item.hasAlert && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#064e3b] animate-pulse" />
                  )}
                </div>
                <span>{item.label}</span>
              </div>
              {item.hasAlert && (
                <span className="text-[9px] font-black text-red-300 bg-red-500/20 px-1.5 py-0.5 rounded-full border border-red-400/30">
                  &lt;50%
                </span>
              )}
            </button>
          )
        })}

        {/* Become an Agent / DGA Partner Portal Sidebar Card */}
        <div className="mt-auto mb-3 p-4 rounded-[22px] bg-gradient-to-br from-[#2a2115] via-[#1a140d] to-[#0f0b07] border border-[#d97706]/70 shadow-[0_0_22px_rgba(217,119,6,0.3)] ring-1 ring-amber-400/20 relative overflow-hidden group">
          {/* Metallic Radial Sheen */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.22),transparent_70%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(180,83,9,0.15),transparent_60%)] pointer-events-none" />

          <div className="flex items-center justify-between gap-1 mb-1.5 relative z-10 pr-12">
            <span className="font-extrabold text-[14px] text-[#fde047] tracking-tight drop-shadow-sm">
              {isApprovedDga ? "DGA Portal" : "Become an Agent"}
            </span>
            <span className="bg-[#5c2707]/90 text-[#fde047] border border-[#d97706]/80 text-[9.5px] font-black px-2.5 py-0.5 rounded-full shadow-sm tracking-wide">
              {isApprovedDga ? "Verified" : "New"}
            </span>
          </div>
          
          <p className="text-[11px] font-semibold text-[#fef3c7]/85 leading-snug mb-3.5 relative z-10 pr-10">
            {isApprovedDga
              ? "Access your verified DGA Portal & Agent Terminal console."
              : "Join as a Digital Gold Agent (DGA) and earn exciting rewards and benefits."}
          </p>

          <button
            onClick={() => {
              if (onBecomeAgent) onBecomeAgent();
              else onTabChange("become-agent" as any);
            }}
            className="w-full py-2.5 px-4 rounded-2xl font-black text-[11.5px] text-[#3a1a00] bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#d97706] hover:from-[#fde047] hover:via-[#fbbf24] hover:to-[#f59e0b] active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(245,158,11,0.35)] flex items-center justify-center gap-1.5 border-none cursor-pointer outline-none relative z-10"
          >
            <span>{isApprovedDga ? "Access DGA Portal" : "Become an Agent"}</span>
            <ChevronRight size={14} strokeWidth={3.5} className="text-[#3a1a00]" />
          </button>

          {/* Real DGA Gold Medallion Asset */}
          <img
            src="/digital_gold_agent.png"
            alt="DGA Agent Medal"
            className="absolute -right-1 top-2.5 w-16 h-16 object-contain pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Red Metallic Logout Button below Help & Support */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-sm text-white border border-red-400/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_16px_rgba(220,38,38,0.45)] bg-gradient-to-r from-[#dc2626] via-[#ef4444] to-[#991b1b] hover:from-[#ef4444] hover:via-[#f87171] hover:to-[#b91c1c] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_22px_rgba(220,38,38,0.65)] cursor-pointer outline-none active:scale-[0.98] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <LogOut size={20} className="text-white drop-shadow-sm shrink-0" strokeWidth={2.5} />
          <span className="tracking-wide">Logout</span>
        </button>
      </div>

    </div>
    <style dangerouslySetInnerHTML={{ __html: `
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `}} />
    </>
  );
};

interface MobileDrawerNavProps extends NavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawerNav = (_props: MobileDrawerNavProps) => {
  // Mobile side drawer menu completely removed per design requirement
  return null;
};

export const MobileNav = ({ activeTab, onTabChange, profileCompletion = 100 }: Omit<NavProps, "onLogout">) => {
  return (
    <div className="lg:hidden">
      {/* Android/iOS Bottom Navigation Bar matching screenshot */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] px-3 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom,0px))] rounded-t-3xl">
        <div className="max-w-md mx-auto flex items-center justify-between">
          
          {/* 1. Invest */}
          <button
            onClick={() => onTabChange("sip")}
            className="flex-1 flex flex-col items-center justify-center py-1 cursor-pointer border-none bg-transparent outline-none active:scale-95 transition-transform"
          >
            <div className={`p-1 rounded-full transition-all flex items-center justify-center ${
              activeTab === "sip" || activeTab === "savings" ? "text-[#047857] font-bold" : "text-slate-400 hover:text-slate-600"
            }`}>
              <PieChart size={22} strokeWidth={activeTab === "sip" || activeTab === "savings" ? 2.5 : 2} />
            </div>
            <span className={`text-[11px] mt-0.5 font-bold transition-colors ${
              activeTab === "sip" || activeTab === "savings" ? "text-[#047857] font-black" : "text-slate-500 font-medium"
            }`}>
              Invest
            </span>
          </button>

          {/* 2. Portfolio */}
          <button
            onClick={() => onTabChange("portfolio")}
            className="flex-1 flex flex-col items-center justify-center py-1 cursor-pointer border-none bg-transparent outline-none active:scale-95 transition-transform"
          >
            <div className={`p-1 rounded-full transition-all flex items-center justify-center ${
              activeTab === "portfolio" ? "text-[#047857] font-bold" : "text-slate-400 hover:text-slate-600"
            }`}>
              <PieChart size={22} strokeWidth={activeTab === "portfolio" ? 2.5 : 2} />
            </div>
            <span className={`text-[11px] mt-0.5 font-bold transition-colors ${
              activeTab === "portfolio" ? "text-[#047857] font-black" : "text-slate-500 font-medium"
            }`}>
              Portfolio
            </span>
          </button>

          {/* 3. Home (Centered Raised Active Button) */}
          <div className="relative -top-3 flex flex-col items-center justify-center mx-1">
            <button
              onClick={() => onTabChange("home")}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#064e3b] via-[#047857] to-[#059669] text-white flex items-center justify-center shadow-lg shadow-emerald-900/30 border-2 border-white cursor-pointer outline-none transition-transform active:scale-90"
            >
              <Home size={22} strokeWidth={2.5} />
            </button>
            <span className="text-[10px] font-black text-[#047857] tracking-tight mt-0.5">
              Home
            </span>
          </div>

          {/* 4. History */}
          <button
            onClick={() => onTabChange("history")}
            className="flex-1 flex flex-col items-center justify-center py-1 cursor-pointer border-none bg-transparent outline-none active:scale-95 transition-transform"
          >
            <div className={`p-1 rounded-full transition-all flex items-center justify-center ${
              activeTab === "history" ? "text-[#047857] font-bold" : "text-slate-400 hover:text-slate-600"
            }`}>
              <Calendar size={22} strokeWidth={activeTab === "history" ? 2.5 : 2} />
            </div>
            <span className={`text-[11px] mt-0.5 font-bold transition-colors ${
              activeTab === "history" ? "text-[#047857] font-black" : "text-slate-500 font-medium"
            }`}>
              History
            </span>
          </button>

          {/* 5. Menu (replaces Rewards, includes Rewards Hub inside) */}
          <button
            onClick={() => onTabChange("menu")}
            className="flex-1 flex flex-col items-center justify-center py-1 cursor-pointer border-none bg-transparent outline-none active:scale-95 transition-transform"
          >
            <div className={`p-1 rounded-full transition-all flex items-center justify-center ${
              activeTab === "menu" ? "text-[#047857] font-bold" : "text-slate-400 hover:text-slate-600"
            }`}>
              <Menu size={22} strokeWidth={activeTab === "menu" ? 2.5 : 2} />
            </div>
            <span className={`text-[11px] mt-0.5 font-bold transition-colors ${
              activeTab === "menu" ? "text-[#047857] font-black" : "text-slate-500 font-medium"
            }`}>
              Menu
            </span>
          </button>

        </div>
      </nav>
    </div>
  );
};

