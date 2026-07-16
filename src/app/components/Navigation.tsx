import React from "react";
import { Home, Wallet, TrendingUp, Zap, Clock, Settings, LogOut } from "lucide-react";
import fipMoneyLogo from "../../imports/fipmoney_logo_final.png";

const G_LT = "#efb652";
const G_DK = "#b87312";

export type Tab = "home" | "portfolio" | "sip" | "bills" | "history" | "settings";

export const navItems = [
  { id: "home",      Icon: Home,       label: "Dashboard" },
  { id: "portfolio", Icon: Wallet,     label: "Portfolio"  },
  { id: "sip",       Icon: TrendingUp, label: "Digital Gold & Silver"  },
  { id: "bills",     Icon: Zap,        label: "Bills"      },
  { id: "history",   Icon: Clock,      label: "History"    },
  { id: "settings",  Icon: Settings,   label: "Settings"   },
];

interface NavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
}

export const Sidebar = ({ activeTab, onTabChange, onLogout }: NavProps) => (
  <div className="hidden lg:flex w-64 bg-[#f8f9fc] flex-col py-8 px-5 shrink-0 border-r border-gray-100 h-screen sticky top-0">
    <div className="flex items-center gap-3 mb-10 px-2">
      <div className="w-12 h-12 flex items-center justify-center shrink-0">
        <img src={fipMoneyLogo} alt="FM" className="w-11 h-11 object-contain hover:scale-105 transition-transform" />
      </div>
      <span className="text-xl font-bold text-gray-800 tracking-tight">Fipmoney</span>
    </div>

    <div className="flex flex-col gap-2 flex-1">
      {navItems.map(({ id, Icon, label }) => {
        const active = activeTab === id;
        return (
          <button key={id} onClick={() => onTabChange(id as Tab)}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-semibold text-sm outline-none border-none cursor-pointer
              ${active ? 'text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800 bg-transparent'}`}
            style={active ? { background: `linear-gradient(135deg, ${G_DK}, ${G_LT})` } : {}}>
            <Icon size={18} strokeWidth={active ? 2.5 : 2} />
            {label}
          </button>
        );
      })}
    </div>

    <div className="mt-auto pt-6">
      <button onClick={onLogout} className="flex items-center gap-4 px-4 py-3 w-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded-xl transition-all font-semibold text-sm bg-transparent border-none outline-none cursor-pointer">
        <LogOut size={18} strokeWidth={2} />
        Log out
      </button>
    </div>
  </div>
);

export const MobileNav = ({ activeTab, onTabChange }: Omit<NavProps, "onLogout">) => (
  <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 flex justify-around items-center px-4 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.03)] pb-safe">
    {navItems.filter(item => ['home', 'portfolio', 'sip', 'bills', 'settings'].includes(item.id)).map(({ id, Icon, label }) => {
      const active = activeTab === id;
      return (
        <button key={id} onClick={() => onTabChange(id as Tab)} className="flex flex-col items-center gap-1 bg-transparent border-none outline-none cursor-pointer">
          <div className={`p-1.5 rounded-xl transition-all duration-300 ${active ? 'bg-gray-50' : ''}`} style={active ? { color: G_DK } : { color: '#9ca3af' }}>
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
          </div>
          <span className={`text-[9px] font-bold transition-colors duration-300 ${active ? 'text-gray-800' : 'text-gray-400'}`}>
            {label}
          </span>
        </button>
      );
    })}
  </div>
);
