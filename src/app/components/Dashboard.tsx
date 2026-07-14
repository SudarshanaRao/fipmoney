"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Wallet, TrendingUp, Zap, Clock, Settings, LogOut,
  Bell, Search, RefreshCw, Shield, Phone, Tv, Flame, Wifi, Car,
  Droplets, Heart, Headphones, Landmark,
  Lock, Palette, Info,
  Coins, FileText, HelpCircle,
} from "lucide-react";
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import fipMoneyLogo from "../../imports/fipmoney_logo_final.png";

/* ── palette ──────────────────────────────────────────────────────────────── */
const BG   = "#f7f4ef";
const CARD = "#ffffff";
const TP   = "#111827";
const TS   = "#6b7280";
const POS  = "#10b981";
const NEG  = "#f87171";

/* gold */
const GOLD    = { G:"#d89221", G_LT:"#efb652", G_DK:"#b87312", SIDE:"#140900", SIDE_H:"#2a1400" };
/* silver */
const SILVER  = { G:"#7c93a8", G_LT:"#a8bfce", G_DK:"#4d6373", SIDE:"#0d1b22", SIDE_H:"#1a2e3b" };

type Metal = "gold" | "silver";
type Tab   = "home" | "portfolio" | "sip" | "bills" | "history" | "settings";

const cardStyle: React.CSSProperties = {
  background: CARD, borderRadius: 16,
  boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: 20,
};
const hover = { whileHover: { y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" } };

export default function Dashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [tab,   setTab]   = useState<Tab>("home");
  const [hov,   setHov]   = useState<string | null>(null);
  const [metal, setMetal] = useState<Metal>("gold");

  const P = metal === "gold" ? GOLD : SILVER;
  const { G, G_LT, G_DK, SIDE } = P;
  const metalName   = metal === "gold" ? "Gold" : "Silver";
  const metalSymbol = metal === "gold" ? "24K" : "999";
  const metalRate   = metal === "gold" ? "₹6,420/g" : "₹89/g";
  const metalGrams  = metal === "gold" ? "18.4 gm" : "284 gm";
  const metalValue  = metal === "gold" ? "₹1,18,128" : "₹25,276";
  const metalPortfolio = metal === "gold" ? "₹1,24,350" : "₹52,800";

  /* settings state */
  const [sec,         setSec]         = useState("profile");
  const [notifSIP,    setNotifSIP]    = useState(true);
  const [notifPrice,  setNotifPrice]  = useState(true);
  const [notifBill,   setNotifBill]   = useState(false);
  const [notifNews,   setNotifNews]   = useState(false);
  const [twoFA,       setTwoFA]       = useState(false);
  const [darkMode,    setDarkMode]    = useState(false);
  const [compactUI,   setCompactUI]   = useState(false);
  const [profName,    setProfName]    = useState("Rahul Kumar");
  const [profEmail,   setProfEmail]   = useState("rahul@email.com");
  const [profPhone,   setProfPhone]   = useState("+91 98765 43210");
  const [editProf,    setEditProf]    = useState(false);

  const navItems = [
    { id:"home",      Icon:Home,       label:"Dashboard" },
    { id:"portfolio", Icon:Wallet,     label:"Portfolio"  },
    { id:"sip",       Icon:TrendingUp, label:"SIP Plans"  },
    { id:"bills",     Icon:Zap,        label:"Bills"      },
    { id:"history",   Icon:Clock,      label:"History"    },
    { id:"settings",  Icon:Settings,   label:"Settings"   },
  ];

  const billCategories = [
    { id:"mobile",      label:"Mobile Recharge",  Icon:Phone,      color:"#f59e0b", bg:"#fef3c7" },
    { id:"dth",         label:"DTH",              Icon:Tv,         color:"#8b5cf6", bg:"#ede9fe" },
    { id:"electricity", label:"Electricity",       Icon:Zap,        color:"#f97316", bg:"#ffedd5" },
    { id:"gas",         label:"Gas Cylinder",      Icon:Flame,      color:"#ef4444", bg:"#fee2e2" },
    { id:"broadband",   label:"Broadband",          Icon:Wifi,       color:"#3b82f6", bg:"#dbeafe" },
    { id:"fastag",      label:"FASTag",             Icon:Car,        color:"#10b981", bg:"#d1fae5" },
    { id:"water",       label:"Water Bill",         Icon:Droplets,   color:"#06b6d4", bg:"#cffafe" },
    { id:"health",      label:"Health Insurance",   Icon:Heart,      color:"#ec4899", bg:"#fce7f3" },
    { id:"ott",         label:"OTT Platform",       Icon:Headphones, color:"#6366f1", bg:"#e0e7ff" },
    { id:"cable",       label:"Cable TV",           Icon:Tv,         color:"#a855f7", bg:"#f3e8ff" },
    { id:"loan",        label:"Loan Repayment",     Icon:Landmark,   color:G_DK,      bg:"#fef3c7" },
    { id:"insurance",   label:"Life Insurance",     Icon:Shield,     color:G,         bg:"#fef9c3" },
    { id:"municipal",   label:"Municipal Tax",      Icon:FileText,   color:"#64748b", bg:"#f1f5f9" },
    { id:"education",   label:"Education Fee",      Icon:HelpCircle, color:"#0ea5e9", bg:"#e0f2fe" },
    { id:"postpaid",    label:"Postpaid Bill",       Icon:Phone,      color:"#d97706", bg:"#fde68a" },
    { id:"society",     label:"Housing Society",    Icon:Home,       color:"#16a34a", bg:"#dcfce7" },
  ];

  const portfolioData = [{v:62000},{v:78000},{v:71000},{v:95000},{v:88000},{v:110000},{v:104000},{v:124350}];
  const sparkData     = [{v:10},{v:14},{v:11},{v:18},{v:15},{v:22}];
  const txns = [
    { label:`${metalName} SIP`,      date:"Nov 18", amount:"+₹500",   pos:true  },
    { label:"Bill Payment",          date:"Nov 17", amount:"-₹399",   pos:false },
    { label:`${metalName} Purchase`, date:"Nov 16", amount:"+₹2,000", pos:true  },
    { label:"SIP Auto-debit",        date:"Nov 15", amount:"+₹1,000", pos:true  },
  ];

  /* ── METAL TOGGLE ────────────────────────────────────────────────────────── */
  const MetalToggle = () => (
    <motion.div layout
      style={{
        display:"flex", alignItems:"center", borderRadius:28,
        background: metal === "gold" ? "#fef3c7" : "#e2eaf0",
        border: `1.5px solid ${G}40`,
        padding:3, gap:0, cursor:"pointer",
        boxShadow:`0 2px 12px ${G}30`,
      }}>
      {(["gold","silver"] as Metal[]).map(m => (
        <motion.div key={m} onClick={() => setMetal(m)} layout
          animate={{ background: metal === m ? `linear-gradient(135deg, ${metal===m ? (m==="gold"?GOLD.G_DK:SILVER.G_DK) : "transparent"}, ${metal===m ? (m==="gold"?GOLD.G_LT:SILVER.G_LT):"transparent"})` : "transparent" }}
          style={{
            padding:"6px 16px", borderRadius:24, cursor:"pointer",
            background: metal === m ? `linear-gradient(135deg, ${m==="gold"?GOLD.G_DK:SILVER.G_DK}, ${m==="gold"?GOLD.G_LT:SILVER.G_LT})` : "transparent",
            boxShadow: metal === m ? `0 2px 8px ${m==="gold"?GOLD.G:SILVER.G}50` : "none",
            transition:"all 0.25s",
          }}>
          <span style={{ fontSize:12, fontWeight:700, color: metal===m ? "#fff" : TS, display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ fontSize:14 }}>{m==="gold" ? "🪙" : "🥈"}</span>
            {m === "gold" ? "Gold" : "Silver"}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );

  /* ── SIDEBAR ─────────────────────────────────────────────────────────────── */
  const Sidebar = () => (
    <div style={{
      width:76, minHeight:"100vh", background:SIDE, flexShrink:0,
      display:"flex", flexDirection:"column", alignItems:"center",
      paddingTop:16, paddingBottom:20, gap:0, position:"relative", zIndex:10,
      transition:"background 0.4s",
    }}>
      {/* Logo — fills the sidebar width */}
      <div style={{
        width:60, height:60, borderRadius:16, marginBottom:24,
        overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center",
        background:`linear-gradient(135deg, ${G_DK}33, ${G_LT}44)`,
        boxShadow:`0 4px 16px ${G}40`,
        flexShrink:0,
      }}>
        <img src={fipMoneyLogo as unknown as string} alt="FM"
          style={{ width:54, height:54, objectFit:"contain" }} />
      </div>

      {/* Nav items */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:6, width:"100%", padding:"0 10px" }}>
        {navItems.map(({ id, Icon, label }) => {
          const active = tab === id;
          return (
            <div key={id} style={{ position:"relative" }}
              onMouseEnter={() => setHov(id)} onMouseLeave={() => setHov(null)}>
              <motion.div onClick={() => setTab(id as Tab)} whileTap={{ scale:0.92 }}
                style={{
                  width:"100%", height:48, borderRadius:14, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  background: active ? `linear-gradient(135deg, ${G_DK}, ${G_LT})` : "rgba(255,255,255,0.05)",
                  boxShadow: active ? `0 4px 18px ${G}55, inset 0 1px 0 rgba(255,255,255,0.15)` : "none",
                  transition:"background 0.3s, box-shadow 0.3s",
                }}>
                <Icon size={20} color={active ? "#fff" : "rgba(255,255,255,0.45)"} strokeWidth={active ? 2.2 : 1.8} />
              </motion.div>
              {active && (
                <div style={{
                  position:"absolute", right:-2, top:"50%", transform:"translateY(-50%)",
                  width:3, height:24, borderRadius:2,
                  background:`linear-gradient(${G_LT}, ${G_DK})`,
                }} />
              )}
              <AnimatePresence>
                {hov === id && (
                  <motion.div initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-6 }}
                    style={{
                      position:"absolute", left:"calc(100% + 12px)", top:"50%", transform:"translateY(-50%)",
                      background:G, color:"#fff", fontSize:11, fontWeight:700,
                      padding:"5px 12px", borderRadius:8, whiteSpace:"nowrap", zIndex:999, pointerEvents:"none",
                      boxShadow:"0 4px 12px rgba(0,0,0,0.25)",
                    }}>
                    {label}
                    <div style={{ position:"absolute", left:-5, top:"50%", transform:"translateY(-50%)",
                      width:0, height:0, borderTop:"5px solid transparent",
                      borderBottom:"5px solid transparent", borderRight:`5px solid ${G}` }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Logout + avatar */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, padding:"0 10px", width:"100%" }}>
        <div style={{ position:"relative" }}
          onMouseEnter={() => setHov("logout")} onMouseLeave={() => setHov(null)}>
          <motion.div whileTap={{ scale:0.93 }} onClick={() => onNavigate("home")}
            style={{ width:56, height:46, borderRadius:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(255,255,255,0.05)" }}>
            <LogOut size={18} color="rgba(255,255,255,0.35)" strokeWidth={1.8} />
          </motion.div>
          <AnimatePresence>
            {hov === "logout" && (
              <motion.div initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
                style={{ position:"absolute", left:"calc(100% + 12px)", top:"50%", transform:"translateY(-50%)", background:"#374151", color:"#fff", fontSize:11, fontWeight:700, padding:"5px 12px", borderRadius:8, whiteSpace:"nowrap", zIndex:999, pointerEvents:"none" }}>
                Log Out
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div style={{ width:40, height:40, borderRadius:12, background:`linear-gradient(135deg, ${G}, ${G_DK})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:800, boxShadow:`0 2px 8px ${G}50`, cursor:"pointer", transition:"background 0.4s" }}>RK</div>
      </div>
    </div>
  );

  /* ── HEADER ──────────────────────────────────────────────────────────────── */
  const Header = () => (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 24px", background:BG, borderBottom:"1px solid rgba(0,0,0,0.06)", flexShrink:0 }}>
      <div>
        <div style={{ fontSize:22, fontWeight:800, color:TP }}>Hello, Rahul! {metal==="gold"?"🪙":"🥈"}</div>
        <div style={{ fontSize:13, color:TS, marginTop:2 }}>Explore your {metalName.toLowerCase()} portfolio and investments</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        {/* Metal toggle */}
        <MetalToggle />
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"#fff", border:"1px solid #e5e7eb", borderRadius:24, padding:"8px 16px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
          <Search size={15} color={TS} />
          <input placeholder="Search..." style={{ border:"none", outline:"none", fontSize:13, color:TP, background:"transparent", width:120 }} />
        </div>
        <motion.div whileHover={{ rotate:180 }} transition={{ duration:0.4 }}
          style={{ width:36, height:36, borderRadius:10, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>
          <RefreshCw size={16} color={TS} />
        </motion.div>
        <div style={{ position:"relative" }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,0.08)" }}>
            <Bell size={16} color={TS} />
          </div>
          <div style={{ position:"absolute", top:6, right:6, width:8, height:8, borderRadius:"50%", background:G, border:"1.5px solid #fff", transition:"background 0.4s" }} />
        </div>
      </div>
    </div>
  );

  /* ── HOME CONTENT ────────────────────────────────────────────────────────── */
  const HomeContent = () => {
    const bars     = [40,55,45,70,60,80,75,95];
    const ringData = [{ v:80 },{ v:20 }];
    /* silver card gradient */
    const metalCardBg = metal === "gold"
      ? `linear-gradient(135deg, ${G_DK} 0%, ${G} 55%, ${G_LT} 100%)`
      : `linear-gradient(135deg, #2d4556 0%, #4d6d82 45%, #8aaabb 80%, #6a8fa5 100%)`;

    return (
      <main style={{ flex:1, overflow:"auto", padding:24, display:"flex", flexDirection:"column", gap:20 }}>

        {/* ── Row 1: stat cards ── */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}
          style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:16 }}>

          {/* Portfolio card */}
          <motion.div {...hover} style={{ ...cardStyle }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
              <Coins size={14} color={G} />
              <span style={{ fontSize:12, color:TS, fontWeight:500 }}>{metalName} Portfolio</span>
            </div>
            <div style={{ fontSize:24, fontWeight:800, color:TP, marginBottom:10 }}>{metalPortfolio}</div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:34 }}>
              {bars.map((h, i) => (
                <div key={i} style={{ flex:1, height:`${h}%`, borderRadius:3, background: i===7 ? G : G_LT, opacity:0.85, transition:"background 0.4s" }} />
              ))}
            </div>
            <div style={{ fontSize:11, color:POS, marginTop:8, fontWeight:600 }}>+18.4% this month</div>
          </motion.div>

          {/* SIPs */}
          <motion.div {...hover} style={{ ...cardStyle }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
              <TrendingUp size={14} color={G} />
              <span style={{ fontSize:12, color:TS, fontWeight:500 }}>Active SIPs</span>
            </div>
            <div style={{ fontSize:24, fontWeight:800, color:TP, marginBottom:8 }}>3</div>
            <div style={{ height:38 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData}>
                  <defs><linearGradient id="sGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={G} stopOpacity={0.3}/><stop offset="100%" stopColor={G} stopOpacity={0}/></linearGradient></defs>
                  <Area type="monotone" dataKey="v" stroke={G} strokeWidth={2} fill="url(#sGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ fontSize:11, color:POS, marginTop:4, fontWeight:600 }}>₹1,500/mo total</div>
          </motion.div>

          {/* Returns */}
          <motion.div {...hover} style={{ ...cardStyle }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
              <Wallet size={14} color={G} />
              <span style={{ fontSize:12, color:TS, fontWeight:500 }}>Monthly Returns</span>
            </div>
            <div style={{ fontSize:24, fontWeight:800, color:TP, marginBottom:6 }}>₹2,840</div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
              <span style={{ fontSize:12, color:POS, fontWeight:700 }}>+12.4% this month</span>
            </div>
            <div style={{ height:26 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData}>
                  <defs><linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={POS} stopOpacity={0.25}/><stop offset="100%" stopColor={POS} stopOpacity={0}/></linearGradient></defs>
                  <Area type="monotone" dataKey="v" stroke={POS} strokeWidth={1.5} fill="url(#rGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Rate card — full gradient metal theme */}
          <motion.div {...hover} style={{ ...cardStyle, background:metalCardBg, transition:"background 0.5s" }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
              <Zap size={14} color="rgba(255,255,255,0.85)" />
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.8)", fontWeight:500 }}>Today's {metalName} Rate</span>
            </div>
            <div style={{ fontSize:24, fontWeight:800, color:"#fff", marginBottom:4 }}>{metalRate}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginBottom:10 }}>{metalSymbol} Pure {metalName} • Live</div>
            <div style={{ height:30 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[{v:6200},{v:6350},{v:6300},{v:6380},{v:6420},{v:6400},{v:6420}]}>
                  <defs><linearGradient id="grGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fff" stopOpacity={0.35}/><stop offset="100%" stopColor="#fff" stopOpacity={0}/></linearGradient></defs>
                  <Area type="monotone" dataKey="v" stroke="#fff" strokeWidth={1.5} fill="url(#grGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.85)", fontWeight:600, marginTop:4 }}>+0.8% today</div>
          </motion.div>
        </motion.div>

        {/* ── Row 2 ── */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4, delay:0.1 }}
          style={{ display:"flex", gap:16 }}>

          {/* Portfolio chart */}
          <motion.div {...hover} style={{ ...cardStyle, flex:2 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:TP }}>Portfolio Balance</div>
                <div style={{ display:"flex", gap:8, marginTop:6 }}>
                  <span style={{ background:"#dcfce7", color:"#15803d", fontSize:11, fontWeight:600, padding:"2px 10px", borderRadius:20 }}>On track</span>
                  <span style={{ background: metal==="gold" ? "#fef3c7":"#e2eaf0", color:G_DK, fontSize:11, fontWeight:600, padding:"2px 10px", borderRadius:20, transition:"background 0.4s" }}>Monthly</span>
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:13, color:TS }}>Balance</div>
                <div style={{ fontSize:20, fontWeight:800, color:TP }}>{metalPortfolio}</div>
                <div style={{ fontSize:11, color:NEG, fontWeight:600 }}>-4.75% this week</div>
              </div>
            </div>
            <div style={{ fontSize:22, fontWeight:800, color:G, marginBottom:4, transition:"color 0.4s" }}>43.50%</div>
            <div style={{ fontSize:11, color:POS, fontWeight:600, marginBottom:14 }}>+2.49% vs last month</div>
            <div style={{ height:155 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioData} margin={{ top:5, right:5, left:5, bottom:5 }}>
                  <defs><linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={G} stopOpacity={0.25}/><stop offset="100%" stopColor={G} stopOpacity={0}/></linearGradient></defs>
                  <Area type="monotone" dataKey="v" stroke={G} strokeWidth={2.5} fill="url(#pGrad)" dot={false} />
                  <Tooltip contentStyle={{ background:SIDE, border:"none", borderRadius:8, color:"#fff", fontSize:12 }} formatter={(v: number) => [`₹${v.toLocaleString()}`, "Value"]} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Ring */}
          <motion.div {...hover} style={{ ...cardStyle, flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
            <div style={{ fontSize:15, fontWeight:700, color:TP, alignSelf:"flex-start", marginBottom:2 }}>Returns</div>
            <div style={{ fontSize:12, color:TS, alignSelf:"flex-start", marginBottom:14 }}>Total Invested</div>
            <div style={{ fontSize:28, fontWeight:800, color:TP, alignSelf:"flex-start", marginBottom:4 }}>₹98,000</div>
            <div style={{ fontSize:11, color:POS, fontWeight:600, alignSelf:"flex-start", marginBottom:14 }}>Profit 26.8% more than last month</div>
            <div style={{ position:"relative", width:128, height:128 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{ v:80 },{ v:20 }]} dataKey="v" innerRadius={40} outerRadius={56} startAngle={90} endAngle={-270} strokeWidth={0}>
                    <Cell fill={G} /><Cell fill="#f3f4f6" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center" }}>
                <div style={{ fontSize:20, fontWeight:800, color:G, transition:"color 0.4s" }}>80%</div>
                <div style={{ fontSize:9, color:TS }}>filled</div>
              </div>
            </div>
          </motion.div>

          {/* Profile card */}
          <motion.div {...hover} style={{ ...cardStyle, flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
            <div style={{ width:56, height:56, borderRadius:14, background:`linear-gradient(135deg, ${G_LT}, ${G_DK})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:800, color:"#fff", marginBottom:10, boxShadow:`0 4px 16px ${G}40`, transition:"background 0.4s, box-shadow 0.4s" }}>RK</div>
            <div style={{ fontSize:16, fontWeight:700, color:TP }}>Rahul Kumar</div>
            <div style={{ fontSize:12, color:TS, marginBottom:16 }}>+91 98765 43210</div>
            <div style={{ display:"flex", gap:16, marginBottom:20 }}>
              {[["SIPs","3"],["Grams","18.4"],["Since","2022"]].map(([l,v]) => (
                <div key={l}><div style={{ fontSize:16, fontWeight:800, color:G, transition:"color 0.4s" }}>{v}</div><div style={{ fontSize:10, color:TS }}>{l}</div></div>
              ))}
            </div>
            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={() => setTab("settings")}
              style={{ background:`linear-gradient(90deg, ${G_DK}, ${G_LT})`, color:"#fff", border:"none", borderRadius:24, padding:"9px 24px", fontSize:13, fontWeight:700, cursor:"pointer", transition:"background 0.4s" }}>
              View Profile
            </motion.button>
          </motion.div>
        </motion.div>

        {/* ── Row 3 ── */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4, delay:0.2 }}
          style={{ display:"flex", gap:16 }}>

          {/* Vault card */}
          <motion.div {...hover} style={{ ...cardStyle, flex:1.3 }}>
            <div style={{ fontSize:15, fontWeight:700, color:TP, marginBottom:4 }}>Digital {metalName} in Vault</div>
            <div style={{ fontSize:12, color:TS, marginBottom:14 }}>Your {metalSymbol} pure {metalName.toLowerCase()}, safely stored</div>
            <motion.div animate={{ rotateY:[0,4,0,-4,0] }} transition={{ repeat:Infinity, duration:5, ease:"easeInOut" }}
              style={{
                background: metal === "gold"
                  ? `linear-gradient(135deg, ${G_DK} 0%, ${G} 45%, ${G_LT} 80%, ${G} 100%)`
                  : `linear-gradient(135deg, #1e3340 0%, #3a5c70 35%, #6a9ab5 70%, #4d7d95 100%)`,
                borderRadius:14, padding:"18px 20px", marginBottom:14,
                boxShadow:`0 8px 32px ${G}35`,
                position:"relative", overflow:"hidden", transition:"background 0.5s, box-shadow 0.5s",
              }}>
              {/* Shimmer stripe */}
              <div style={{ position:"absolute", top:-30, left:-60, width:100, height:200, background:"rgba(255,255,255,0.1)", transform:"rotate(30deg)", pointerEvents:"none" }} />
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
                <img src={fipMoneyLogo as unknown as string} alt="FM" style={{ width:26, height:26, objectFit:"contain", borderRadius:6, background:"rgba(255,255,255,0.2)", padding:2 }} />
                <span style={{ fontSize:10, color:"rgba(255,255,255,0.75)", fontWeight:600, letterSpacing:1 }}>PURE {metalSymbol}</span>
              </div>
              <div style={{ fontSize:28, fontWeight:900, color:"#fff", letterSpacing:1 }}>{metalGrams}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.7)", marginTop:4 }}>≈ {metalValue} at current rate</div>
            </motion.div>
            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
              style={{ width:"100%", background:`linear-gradient(90deg, ${G_DK}, ${G_LT})`, color:"#fff", border:"none", borderRadius:10, padding:"11px", fontSize:14, fontWeight:700, cursor:"pointer", transition:"background 0.4s" }}>
              Buy More {metalName} +
            </motion.button>
          </motion.div>

          {/* Transactions */}
          <motion.div {...hover} style={{ ...cardStyle, flex:1.3 }}>
            <div style={{ fontSize:15, fontWeight:700, color:TP, marginBottom:16 }}>Recent Transactions</div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {txns.map(({ label, date, amount, pos }, i) => (
                <motion.div key={`${metal}-${i}`} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.07 }}
                  style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background: pos ? "#dcfce7" : "#fee2e2", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Coins size={16} color={pos ? POS : NEG} />
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:TP }}>{label}</div>
                      <div style={{ fontSize:11, color:TS }}>{date}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:13, fontWeight:700, color: pos ? POS : NEG }}>{amount}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Security */}
          <motion.div {...hover} style={{ ...cardStyle, flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
            <div style={{ width:64, height:64, borderRadius:16, background:`${G}22`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14, transition:"background 0.4s" }}>
              <Shield size={32} color={G} />
            </div>
            <div style={{ fontSize:15, fontWeight:700, color:TP, marginBottom:8 }}>Keep your account safe!</div>
            <div style={{ fontSize:12, color:TS, marginBottom:20, lineHeight:1.6 }}>Update security settings and enable 2FA for protection</div>
            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={() => setTab("settings")}
              style={{ background:`linear-gradient(90deg, ${G_DK}, ${G_LT})`, color:"#fff", border:"none", borderRadius:24, padding:"9px 20px", fontSize:13, fontWeight:700, cursor:"pointer", transition:"background 0.4s" }}>
              Update Security
            </motion.button>
          </motion.div>
        </motion.div>
      </main>
    );
  };

  /* ── BILLS ───────────────────────────────────────────────────────────────── */
  const BillsContent = () => {
    const sections = [
      { title:"Recharge",            items:billCategories.slice(0,3)  },
      { title:"Utilities",           items:billCategories.slice(3,8)  },
      { title:"Finance & Insurance", items:billCategories.slice(8,12) },
      { title:"Others",              items:billCategories.slice(12)   },
    ];
    return (
      <main style={{ flex:1, overflow:"auto", padding:28 }}>
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:20, fontWeight:800, color:TP }}>Bills & Recharge</div>
          <div style={{ fontSize:13, color:TS, marginTop:4 }}>Pay all your bills in one place, instantly</div>
        </div>
        {sections.map(({ title, items }) => (
          <div key={title} style={{ marginBottom:28 }}>
            <div style={{ fontSize:13, fontWeight:700, color:TS, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:14 }}>{title}</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(130px, 1fr))", gap:14 }}>
              {items.map(({ id, label, Icon, color, bg }) => (
                <motion.div key={id} whileHover={{ y:-4, boxShadow:`0 12px 28px ${color}22` }} whileTap={{ scale:0.96 }}
                  style={{ background:CARD, borderRadius:16, padding:"20px 14px", display:"flex", flexDirection:"column", alignItems:"center", gap:10, cursor:"pointer", boxShadow:"0 2px 10px rgba(0,0,0,0.06)", border:`1.5px solid ${bg}` }}>
                  <div style={{ width:52, height:52, borderRadius:14, background:bg, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 4px 12px ${color}25` }}>
                    <Icon size={24} color={color} strokeWidth={1.8} />
                  </div>
                  <div style={{ fontSize:12, fontWeight:700, color:TP, textAlign:"center", lineHeight:1.4 }}>{label}</div>
                  <div style={{ fontSize:10, color, fontWeight:600 }}>Pay Now →</div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </main>
    );
  };

  /* ── SETTINGS ────────────────────────────────────────────────────────────── */
  const Toggle = ({ on, setOn }: { on: boolean; setOn: (v: boolean) => void }) => (
    <div onClick={() => setOn(!on)} style={{ cursor:"pointer", display:"flex", alignItems:"center" }}>
      <div style={{ width:44, height:24, borderRadius:12, position:"relative", transition:"background 0.2s", background: on ? G : "#e5e7eb", boxShadow: on ? `0 0 12px ${G}60` : "none" }}>
        <motion.div animate={{ x: on ? 22 : 2 }} transition={{ type:"spring", stiffness:400, damping:28 }}
          style={{ position:"absolute", top:3, width:18, height:18, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }} />
      </div>
    </div>
  );

  const settingsSections = [
    { id:"profile",  Icon:Home,      label:"Profile"       },
    { id:"security", Icon:Lock,      label:"Security"      },
    { id:"notif",    Icon:Bell,      label:"Notifications" },
    { id:"appear",   Icon:Palette,   label:"Appearance"    },
    { id:"about",    Icon:Info,      label:"About"         },
  ];

  const SettingsContent = () => (
    <main style={{ flex:1, overflow:"auto", padding:28, display:"flex", gap:20 }}>
      <div style={{ width:210, flexShrink:0, display:"flex", flexDirection:"column", gap:4 }}>
        <div style={{ fontSize:18, fontWeight:800, color:TP, marginBottom:16 }}>Settings</div>
        {settingsSections.map(({ id, Icon, label }) => {
          const active = sec === id;
          return (
            <motion.div key={id} onClick={() => setSec(id)} whileHover={{ x:4 }}
              style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 14px", borderRadius:12, cursor:"pointer", background: active ? `linear-gradient(90deg, ${G}18, ${G_LT}10)` : "rgba(0,0,0,0)", borderLeft: active ? `3px solid ${G}` : "3px solid rgba(0,0,0,0)", transition:"background 0.15s" }}>
              <Icon size={16} color={active ? G : TS} />
              <span style={{ fontSize:13, fontWeight: active ? 700 : 500, color: active ? G_DK : TS }}>{label}</span>
            </motion.div>
          );
        })}
      </div>

      <div style={{ flex:1 }}>
        <AnimatePresence mode="wait">
          <motion.div key={sec} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.2 }}
            style={{ background:CARD, borderRadius:20, padding:28, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>

            {sec === "profile" && (
              <div>
                <div style={{ fontSize:17, fontWeight:800, color:TP, marginBottom:24 }}>Profile Information</div>
                <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:28 }}>
                  <div style={{ width:72, height:72, borderRadius:18, background:`linear-gradient(135deg, ${G_LT}, ${G_DK})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, fontWeight:900, color:"#fff", boxShadow:`0 4px 20px ${G}40` }}>RK</div>
                  <div>
                    <div style={{ fontSize:16, fontWeight:700, color:TP }}>{profName}</div>
                    <div style={{ fontSize:13, color:TS, marginTop:2 }}>FipMoney Member since 2022</div>
                    <motion.button whileTap={{ scale:0.96 }} onClick={() => setEditProf(!editProf)}
                      style={{ marginTop:8, background:`${G}18`, color:G_DK, border:`1px solid ${G}40`, borderRadius:8, padding:"5px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                      {editProf ? "Cancel" : "Edit Profile"}
                    </motion.button>
                  </div>
                </div>
                {[
                  { label:"Full Name",     val:profName,  set:setProfName,  type:"text"  },
                  { label:"Email Address", val:profEmail, set:setProfEmail, type:"email" },
                  { label:"Mobile Number", val:profPhone, set:setProfPhone, type:"tel"   },
                ].map(({ label, val, set, type }) => (
                  <div key={label} style={{ marginBottom:18 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:TS, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</div>
                    <input type={type} value={val} onChange={e => set(e.target.value)} disabled={!editProf}
                      style={{ width:"100%", padding:"12px 16px", borderRadius:12, fontSize:14, fontWeight:500, color:TP, background: editProf ? "#f9fafb" : "transparent", border: editProf ? `1.5px solid ${G}60` : "1.5px solid #f3f4f6", outline:"none", boxSizing:"border-box", transition:"all 0.2s" }} />
                  </div>
                ))}
                {editProf && (
                  <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} onClick={() => setEditProf(false)}
                    style={{ marginTop:8, background:`linear-gradient(90deg, ${G_DK}, ${G_LT})`, color:"#fff", border:"none", borderRadius:12, padding:"12px 28px", fontSize:14, fontWeight:700, cursor:"pointer" }}>
                    Save Changes
                  </motion.button>
                )}
              </div>
            )}

            {sec === "security" && (
              <div>
                <div style={{ fontSize:17, fontWeight:800, color:TP, marginBottom:24 }}>Security Settings</div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 0", borderBottom:"1px solid #f3f4f6" }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:TP }}>Two-Factor Authentication</div>
                    <div style={{ fontSize:12, color:TS, marginTop:3 }}>Add an extra layer of security to your account</div>
                  </div>
                  <Toggle on={twoFA} setOn={setTwoFA} />
                </div>
                <div style={{ marginTop:24 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:TP, marginBottom:6 }}>Change MPIN</div>
                  <div style={{ fontSize:12, color:TS, marginBottom:14 }}>Use a strong 6-digit MPIN</div>
                  {["Current MPIN","New MPIN","Confirm MPIN"].map(p => (
                    <input key={p} type="password" maxLength={6} placeholder={p}
                      style={{ display:"block", width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #e5e7eb", fontSize:14, marginBottom:10, outline:"none", background:"#f9fafb", boxSizing:"border-box" }} />
                  ))}
                  <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                    style={{ background:`linear-gradient(90deg, ${G_DK}, ${G_LT})`, color:"#fff", border:"none", borderRadius:10, padding:"11px 24px", fontSize:13, fontWeight:700, cursor:"pointer", marginTop:4 }}>
                    Update MPIN
                  </motion.button>
                </div>
                <div style={{ marginTop:28, padding:18, borderRadius:14, background:"#fef2f2", border:"1px solid #fecaca" }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"#dc2626", marginBottom:4 }}>Delete Account</div>
                  <div style={{ fontSize:12, color:"#6b7280", marginBottom:12 }}>This action is permanent and cannot be undone</div>
                  <motion.button whileTap={{ scale:0.97 }}
                    style={{ background:"#dc2626", color:"#fff", border:"none", borderRadius:8, padding:"9px 18px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                    Delete My Account
                  </motion.button>
                </div>
              </div>
            )}

            {sec === "notif" && (
              <div>
                <div style={{ fontSize:17, fontWeight:800, color:TP, marginBottom:24 }}>Notification Preferences</div>
                {[
                  { label:"SIP Reminders",     desc:"Get notified before each SIP deduction",  on:notifSIP,   set:setNotifSIP   },
                  { label:`${metalName} Price Alerts`, desc:`Alert when ${metalName.toLowerCase()} price changes by 1%+`, on:notifPrice, set:setNotifPrice },
                  { label:"Bill Due Reminders", desc:"Remind me 3 days before bill due date",   on:notifBill,  set:setNotifBill  },
                  { label:"Investment News",    desc:"Weekly market & metal investment updates", on:notifNews,  set:setNotifNews  },
                ].map(({ label, desc, on, set }) => (
                  <div key={label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 0", borderBottom:"1px solid #f3f4f6" }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:TP }}>{label}</div>
                      <div style={{ fontSize:12, color:TS, marginTop:3 }}>{desc}</div>
                    </div>
                    <Toggle on={on} setOn={set} />
                  </div>
                ))}
              </div>
            )}

            {sec === "appear" && (
              <div>
                <div style={{ fontSize:17, fontWeight:800, color:TP, marginBottom:24 }}>Appearance</div>
                {[
                  { label:"Dark Mode",  desc:"Switch to a dark colour scheme",     on:darkMode,  set:setDarkMode  },
                  { label:"Compact UI", desc:"Reduce spacing for a denser layout", on:compactUI, set:setCompactUI },
                ].map(({ label, desc, on, set }) => (
                  <div key={label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 0", borderBottom:"1px solid #f3f4f6" }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:TP }}>{label}</div>
                      <div style={{ fontSize:12, color:TS, marginTop:3 }}>{desc}</div>
                    </div>
                    <Toggle on={on} setOn={set} />
                  </div>
                ))}
                <div style={{ marginTop:24 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:TP, marginBottom:16 }}>Theme Colour</div>
                  <div style={{ display:"flex", gap:12 }}>
                    {[G,"#6d28d9","#0ea5e9","#10b981","#f59e0b"].map(c => (
                      <motion.div key={c} whileHover={{ scale:1.15 }} whileTap={{ scale:0.9 }}
                        style={{ width:36, height:36, borderRadius:10, background:c, cursor:"pointer", boxShadow: c===G ? `0 0 0 3px #fff, 0 0 0 5px ${c}` : "none" }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {sec === "about" && (
              <div>
                <div style={{ fontSize:17, fontWeight:800, color:TP, marginBottom:24 }}>About FipMoney</div>
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28, padding:20, borderRadius:14, background:BG }}>
                  <img src={fipMoneyLogo as unknown as string} alt="FM" style={{ width:52, height:52, objectFit:"contain", borderRadius:12 }} />
                  <div>
                    <div style={{ fontSize:16, fontWeight:800, color:TP }}>FipMoney</div>
                    <div style={{ fontSize:12, color:TS }}>Smart Finance · Secure Future</div>
                    <div style={{ fontSize:11, color:G, fontWeight:600, marginTop:4 }}>Version 1.0.0</div>
                  </div>
                </div>
                {[
                  ["Registered","FipMoney Technologies Pvt. Ltd."],
                  ["CIN","U74999TS2022PTC123456"],
                  ["SEBI Reg.","INZ000123456"],
                  ["Gold Partner","MMTC-PAMP India Pvt. Ltd."],
                  ["Headquarters","HITEC City, Hyderabad, TS 500081"],
                ].map(([k,v]) => (
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:"1px solid #f3f4f6" }}>
                    <span style={{ fontSize:13, color:TS }}>{k}</span>
                    <span style={{ fontSize:13, fontWeight:600, color:TP, textAlign:"right", maxWidth:"55%" }}>{v}</span>
                  </div>
                ))}
                <div style={{ marginTop:20, display:"flex", gap:10, flexWrap:"wrap" }}>
                  {["Privacy Policy","Terms of Use","Grievance"].map(l => (
                    <motion.button key={l} whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                      style={{ background:`${G}15`, color:G_DK, border:`1px solid ${G}30`, borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                      {l}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );

  const ComingSoon = ({ name }: { name: string }) => (
    <main style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
      <div style={{ fontSize:48 }}>🚧</div>
      <div style={{ fontSize:20, fontWeight:700, color:TP }}>{name}</div>
      <div style={{ fontSize:14, color:TS }}>Coming Soon</div>
    </main>
  );

  const renderContent = () => {
    if (tab === "home")     return <HomeContent />;
    if (tab === "bills")    return <BillsContent />;
    if (tab === "settings") return <SettingsContent />;
    const labels: Record<string, string> = { portfolio:"Portfolio", sip:"SIP Plans", history:"History" };
    return <ComingSoon name={labels[tab] ?? tab} />;
  };

  return (
    <div style={{ display:"flex", height:"100vh", background:BG, fontFamily:"'Inter','Segoe UI',sans-serif", overflow:"hidden" }}>
      <Sidebar />
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <Header />
        {renderContent()}
      </div>
    </div>
  );
}
