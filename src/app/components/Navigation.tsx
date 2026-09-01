import React from "react";
import { Home, Wallet, TrendingUp, Zap, Clock, Settings, LogOut, Landmark, Gift, HelpCircle, ChevronLeft, PiggyBank, Award, ChevronRight, X, Sparkles, User, PieChart, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Capacitor } from "@capacitor/core";
import fipMoneyLogo from "../../imports/fipmoney_logo_final.png";
import { API_BASE_URL } from "../utils/apiConfig";

const G_LT = "#efb652";
const G_DK = "#b87312";

export type Tab = "home" | "portfolio" | "sip" | "savings" | "bills" | "history" | "settings" | "banking" | "offers" | "help" | "notifications" | "refer-and-earn" | "terms" | "referral-terms" | "become-agent";

export const navItems = [
  { id: "home",      Icon: Home,       label: "Dashboard" },
  { id: "portfolio", Icon: Wallet,     label: "Portfolio"  },
  { id: "sip",       Icon: TrendingUp, label: "Digital Gold & Silver"  },
  { id: "savings",   Icon: PiggyBank,  label: "Savings (SIP)"          },
  { id: "bills",     Icon: Zap,        label: "Bills & Recharges"      },
  { id: "history",   Icon: Clock,      label: "History"    },
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
    <div className="hidden lg:flex w-64 bg-[#1e1b4b] flex-col py-6 px-4 shrink-0 h-screen sticky top-0 overflow-y-auto hide-scrollbar">
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
                ${active ? 'text-white shadow-lg bg-gradient-to-r from-[#6d28d9] to-[#8b5cf6]' : 'text-indigo-200 hover:bg-white/10 hover:text-white bg-transparent'}`}
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
                ${active ? 'text-white shadow-lg bg-gradient-to-r from-[#6d28d9] to-[#8b5cf6]' : 'text-indigo-200 hover:bg-white/10 hover:text-white bg-transparent'}`}
              >
              <div className="flex items-center gap-4 relative">
                <div className="relative">
                  <item.Icon size={20} strokeWidth={active ? 2.5 : 2} />
                  {item.hasAlert && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1e1b4b] animate-pulse" />
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

export const MobileDrawerNav = ({
  activeTab,
  onTabChange,
  onLogout,
  onBecomeAgent,
  profileCompletion = 100,
  isOpen,
  onClose,
}: MobileDrawerNavProps) => {
  const [isApprovedDga, setIsApprovedDga] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const mobile = sessionStorage.getItem("fm_logged_in_mobile");
      const saved = localStorage.getItem("fm_dga_waitlist_data");
      let localIsApproved = false;
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.isApproved || parsed.status === "approved" || parsed.status === "APPROVED") {
            localIsApproved = true;
          }
        } catch (e) {}
      }
      setIsApprovedDga(localIsApproved);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="lg:hidden">
      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[90] transition-opacity"
      />

      {/* Sliding Mobile Navigation Drawer */}
      <div className="fixed top-0 left-0 bottom-0 w-72 bg-[#1e1b4b] text-white z-[91] p-5 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-250">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-indigo-900/60">
            <div className="flex items-center gap-2">
              <img src={fipMoneyLogo} alt="Fipmoney" className="w-10 h-10 object-contain shrink-0" />
              <div className="flex flex-col">
                <span className="text-base font-black text-white leading-none">Fipmoney</span>
                <span className="text-[10px] text-indigo-300 font-bold mt-0.5">User Dashboard</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-200 hover:text-white transition-colors cursor-pointer outline-none border-none"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            <div className="px-3 py-1 text-[10px] font-black text-indigo-300/70 uppercase tracking-wider">
              MAIN MENU
            </div>

            {navItems.map(({ id, Icon, label }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    onTabChange(id as Tab);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-medium text-xs transition-all outline-none border-none cursor-pointer ${
                    active
                      ? "text-white shadow-lg bg-gradient-to-r from-[#6d28d9] to-[#8b5cf6] font-bold"
                      : "text-indigo-200 hover:bg-white/10 hover:text-white bg-transparent"
                  }`}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                  <span>{label}</span>
                </button>
              );
            })}

            <div className="px-3 pt-3 pb-1 text-[10px] font-black text-indigo-300/70 uppercase tracking-wider">
              PREFERENCES & MORE
            </div>

            {[
              { id: "refer-and-earn", label: "Referral Rewards", Icon: Gift },
              { id: "settings", label: "Settings", Icon: Settings, hasAlert: profileCompletion < 50 },
              { id: "help", label: "Help & Support", Icon: HelpCircle },
            ].map((item, i) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={i}
                  onClick={() => {
                    onTabChange(item.id as Tab);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl font-medium text-xs transition-all outline-none border-none cursor-pointer ${
                    active
                      ? "text-white shadow-lg bg-gradient-to-r from-[#6d28d9] to-[#8b5cf6] font-bold"
                      : "text-indigo-200 hover:bg-white/10 hover:text-white bg-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3.5 relative">
                    <div className="relative">
                      <item.Icon size={18} strokeWidth={active ? 2.5 : 2} />
                      {item.hasAlert && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1e1b4b] animate-pulse" />
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
              );
            })}
          </nav>
        </div>

        {/* Footer section: DGA card & Logout */}
        <div className="space-y-3 pt-4 border-t border-indigo-900/60 mt-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#2a2115] via-[#1a140d] to-[#0f0b07] border border-[#d97706]/70 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="font-extrabold text-xs text-[#fde047]">
                {isApprovedDga ? "DGA Portal" : "Become an Agent"}
              </span>
              <span className="bg-[#5c2707]/90 text-[#fde047] border border-[#d97706]/80 text-[9px] font-black px-2 py-0.5 rounded-full">
                {isApprovedDga ? "Verified" : "New"}
              </span>
            </div>
            <p className="text-[10px] font-semibold text-[#fef3c7]/85 mb-2.5">
              {isApprovedDga ? "Access verified DGA Portal & terminal." : "Earn commissions as a Digital Gold Agent."}
            </p>
            <button
              onClick={() => {
                onClose();
                if (onBecomeAgent) onBecomeAgent();
                else onTabChange("become-agent" as any);
              }}
              className="w-full py-2 px-3 rounded-xl font-black text-[11px] text-[#3a1a00] bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#d97706] hover:from-[#fde047] active:scale-[0.98] transition-all flex items-center justify-center gap-1 border-none cursor-pointer outline-none"
            >
              <span>{isApprovedDga ? "Access DGA Portal" : "Become an Agent"}</span>
              <ChevronRight size={13} strokeWidth={3.5} />
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl font-bold text-xs text-white border border-red-400/40 bg-gradient-to-r from-[#dc2626] via-[#ef4444] to-[#991b1b] hover:from-[#ef4444] cursor-pointer outline-none active:scale-[0.98] relative overflow-hidden"
          >
            <LogOut size={18} className="text-white shrink-0" strokeWidth={2.5} />
            <span className="tracking-wide">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
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
              activeTab === "sip" || activeTab === "savings" ? "text-amber-600 font-bold" : "text-slate-400 hover:text-slate-600"
            }`}>
              <PieChart size={22} strokeWidth={activeTab === "sip" || activeTab === "savings" ? 2.5 : 2} />
            </div>
            <span className={`text-[11px] mt-0.5 font-bold transition-colors ${
              activeTab === "sip" || activeTab === "savings" ? "text-amber-600 font-black" : "text-slate-500 font-medium"
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
              activeTab === "portfolio" ? "text-amber-600 font-bold" : "text-slate-400 hover:text-slate-600"
            }`}>
              <Wallet size={22} strokeWidth={activeTab === "portfolio" ? 2.5 : 2} />
            </div>
            <span className={`text-[11px] mt-0.5 font-bold transition-colors ${
              activeTab === "portfolio" ? "text-amber-600 font-black" : "text-slate-500 font-medium"
            }`}>
              Portfolio
            </span>
          </button>

          {/* 3. Home (Centered Raised Active Button) */}
          <div className="relative -top-3 flex flex-col items-center justify-center mx-1">
            <button
              onClick={() => onTabChange("home")}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 border-2 border-white cursor-pointer outline-none transition-transform active:scale-90"
            >
              <Home size={22} strokeWidth={2.5} />
            </button>
            <span className="text-[10px] font-black text-amber-600 tracking-tight mt-0.5">
              Home
            </span>
          </div>

          {/* 4. History */}
          <button
            onClick={() => onTabChange("history")}
            className="flex-1 flex flex-col items-center justify-center py-1 cursor-pointer border-none bg-transparent outline-none active:scale-95 transition-transform"
          >
            <div className={`p-1 rounded-full transition-all flex items-center justify-center ${
              activeTab === "history" ? "text-amber-600 font-bold" : "text-slate-400 hover:text-slate-600"
            }`}>
              <Calendar size={22} strokeWidth={activeTab === "history" ? 2.5 : 2} />
            </div>
            <span className={`text-[11px] mt-0.5 font-bold transition-colors ${
              activeTab === "history" ? "text-amber-600 font-black" : "text-slate-500 font-medium"
            }`}>
              History
            </span>
          </button>

          {/* 5. Rewards */}
          <button
            onClick={() => onTabChange("refer-and-earn")}
            className="flex-1 flex flex-col items-center justify-center py-1 cursor-pointer border-none bg-transparent outline-none active:scale-95 transition-transform"
          >
            <div className={`p-1 rounded-full transition-all flex items-center justify-center ${
              activeTab === "refer-and-earn" ? "text-amber-600 font-bold" : "text-slate-400 hover:text-slate-600"
            }`}>
              <Gift size={22} strokeWidth={activeTab === "refer-and-earn" ? 2.5 : 2} />
            </div>
            <span className={`text-[11px] mt-0.5 font-bold transition-colors ${
              activeTab === "refer-and-earn" ? "text-amber-600 font-black" : "text-slate-500 font-medium"
            }`}>
              Rewards
            </span>
          </button>

        </div>
      </nav>
    </div>
  );
};

