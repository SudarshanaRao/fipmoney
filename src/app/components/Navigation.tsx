import React from "react";
import { Home, Wallet, TrendingUp, Zap, Clock, Settings, LogOut, Landmark, Gift, HelpCircle, ChevronLeft } from "lucide-react";
import fipMoneyLogo from "../../imports/fipmoney_logo_final.png";

const G_LT = "#efb652";
const G_DK = "#b87312";

export type Tab = "home" | "portfolio" | "sip" | "bills" | "history" | "settings" | "banking" | "offers" | "help" | "notifications";

export const navItems = [
  { id: "home",      Icon: Home,       label: "Dashboard" },
  { id: "portfolio", Icon: Wallet,     label: "Portfolio"  },
  { id: "sip",       Icon: TrendingUp, label: "Digital Gold & Silver"  },
  { id: "bills",     Icon: Zap,        label: "Bills & Recharges"      },
  { id: "banking",   Icon: Landmark,   label: "Banking Services"   },
  { id: "history",   Icon: Clock,      label: "History"    },
];

interface NavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
}

export const Sidebar = ({ activeTab, onTabChange, onLogout }: NavProps) => (
  <>
  <div className="hidden lg:flex w-64 bg-[#1e1b4b] flex-col py-6 px-4 shrink-0 h-screen sticky top-0 overflow-y-auto hide-scrollbar">
    <div className="flex items-center gap-1.5 mb-8 px-2">
      <img src={fipMoneyLogo} alt="FM" className="w-16 h-16 object-contain hover:scale-105 transition-transform shrink-0" />
      <span className="text-2xl font-bold text-white tracking-wide">Fipmoney</span>
    </div>

    <div className="flex flex-col gap-1.5 flex-1">
      {navItems.map(({ id, Icon, label }) => {
        // We'll map Banking Services to settings just to reuse an existing tab without changing the type
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
        { id: "offers", label: "Offers & Rewards", Icon: Gift },
        { id: "settings", label: "Settings", Icon: Settings },
        { id: "help", label: "Help & Support", Icon: HelpCircle },
      ].map((item, i) => {
        const active = activeTab === item.id;
        return (
          <button key={i} onClick={() => onTabChange(item.id as Tab)}
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-medium text-sm outline-none border-none cursor-pointer
              ${active ? 'text-white shadow-lg bg-gradient-to-r from-[#6d28d9] to-[#8b5cf6]' : 'text-indigo-200 hover:bg-white/10 hover:text-white bg-transparent'}`}
            >
            <item.Icon size={20} strokeWidth={active ? 2.5 : 2} />
            {item.label}
          </button>
        )
      })}

      {/* Red Metallic Logout Button below Help & Support */}
      <button
        onClick={onLogout}
        className="mt-2 w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-sm text-white border border-red-400/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_16px_rgba(220,38,38,0.45)] bg-gradient-to-r from-[#dc2626] via-[#ef4444] to-[#991b1b] hover:from-[#ef4444] hover:via-[#f87171] hover:to-[#b91c1c] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_22px_rgba(220,38,38,0.65)] cursor-pointer outline-none active:scale-[0.98] relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <LogOut size={20} className="text-white drop-shadow-sm shrink-0" strokeWidth={2.5} />
        <span className="tracking-wide">Logout</span>
      </button>
    </div>

    <div className="mt-8 flex flex-col gap-4">
      {/* Invite & Earn Card */}
      <div className="bg-gradient-to-br from-[#4c1d95] to-[#312e81] rounded-2xl p-4 border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <h4 className="text-white font-bold text-sm mb-1 relative z-10">Invite & Earn</h4>
        <p className="text-indigo-200 text-xs mb-4 relative z-10 leading-relaxed">Refer your friends and earn exciting rewards!</p>
        <div className="flex justify-between items-end relative z-10">
          <button className="bg-white text-[#4c1d95] text-xs font-bold py-1.5 px-3 rounded-lg shadow-md hover:bg-gray-50 transition-colors border-none cursor-pointer">
            Invite Now
          </button>
          <Gift size={32} className="text-indigo-300 opacity-80" strokeWidth={1.5} />
        </div>
      </div>


    </div>
  </div>
  <style dangerouslySetInnerHTML={{ __html: `
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}} />
  </>
);

export const MobileNav = ({ activeTab, onTabChange }: Omit<NavProps, "onLogout">) => (
  <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#1e1b4b] border-t border-white/10 flex justify-around items-center px-4 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.2)] pb-safe">
    {navItems.filter(item => ['home', 'portfolio', 'sip', 'bills', 'history', 'settings'].includes(item.id)).map(({ id, Icon, label }) => {
      const active = activeTab === id;
      return (
        <button key={id} onClick={() => onTabChange(id as Tab)} className="flex flex-col items-center gap-1 bg-transparent border-none outline-none cursor-pointer">
          <div className={`p-1.5 rounded-xl transition-all duration-300 ${active ? 'bg-[#7c3aed] shadow-lg' : ''}`} style={active ? { color: 'white' } : { color: '#a5b4fc' }}>
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
          </div>
          <span className={`text-[9px] font-bold transition-colors duration-300 ${active ? 'text-white' : 'text-indigo-200'}`}>
            {label.split(' ')[0]}
          </span>
        </button>
      );
    })}
  </div>
);
