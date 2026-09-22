"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("prime_model"); 
  const [isSideDashOpen, setIsSideDashOpen] = useState(false);

  useEffect(() => {
    async function initSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setProfile({ is_active: true, username: "Guest Trader", is_visitor: true });
        setLoading(false);
        return;
      }
      const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      setProfile(data || { is_active: false });
      setLoading(false);
    }
    initSession();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030508]">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#00ff00] border-t-transparent" />
      </div>
    );
  }

  // --- RENDERING HANDLER FOR ACTIVE CANVAS SUBVIEWS ---
  const renderContentCanvas = () => {
    switch (activeView) {
      case "prime_model":
        return (
          <div className="w-full space-y-6">
            <div className="premium-surface rounded-2xl p-8 relative overflow-hidden shadow-2xl">
              <div className="max-w-md relative z-10">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#00ff00] bg-[#00ff00]/10 px-2.5 py-1 rounded-md font-mono">
                  Live Execution Frame
                </span>
                <h2 className="mt-4 text-2xl font-black text-white uppercase tracking-tight font-mono">
                  PRIME Model Architecture
                </h2>
                <p className="mt-2 text-xs text-neutral-400 leading-relaxed max-w-sm">
                  Real-time liquidity tracking active across target ranges. Institutional level delivery configuration.
                </p>
              </div>
              <div className="absolute right-6 bottom-0 top-0 w-1/3 hidden sm:flex items-center justify-center opacity-20">
                <svg viewBox="0 0 24 24" className="h-24 w-24 text-[#00ff00]" fill="none" stroke="currentColor" strokeWidth="1"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="fintech-panel rounded-xl p-6 border border-white/[0.01]">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest font-mono">Liquidity Purge High Boundary</span>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-xl font-black text-white font-mono tracking-tight">STORED RANGE HIGH</span>
                  <span className="text-[10px] font-bold text-[#00ff00] bg-[#00ff00]/5 px-2 py-0.5 rounded font-mono">Active tracking</span>
                </div>
              </div>
              <div className="fintech-panel rounded-xl p-6 border border-white/[0.01]">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest font-mono">Liquidity Purge Low Boundary</span>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-xl font-black text-white font-mono tracking-tight">STORED RANGE LOW</span>
                  <span className="text-[10px] font-bold text-neutral-600 bg-neutral-900 px-2 py-0.5 rounded font-mono">Synced</span>
                </div>
              </div>
            </div>
          </div>
        );
      case "module_1": case "module_2": case "module_3": case "module_4": case "module_5":
        return (
          <div className="w-full space-y-4">
            <div className="premium-surface rounded-2xl p-8">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#00ff00] bg-[#00ff00]/10 px-2.5 py-1 rounded-md font-mono">System Core Stream</span>
              <h2 className="mt-4 text-xl font-black text-white uppercase tracking-tight font-mono">Module 0{activeView.slice(-1)} Stream Framework</h2>
              <div className="mt-6 aspect-video rounded-xl bg-neutral-950/80 border border-white/[0.02] flex items-center justify-center text-xs font-mono text-neutral-600">
                [ Interactive Illustration Asset Fully Bled to Container Edge ]
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full text-center py-24 border border-white/[0.01] bg-[#070A0F]/50 rounded-2xl">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 font-mono">
              [ {activeView.replace("_", " ")} Workspace Workspace ]
            </span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#030508] text-white flex flex-col font-sans antialiased overflow-x-hidden selection:bg-[#00ff00] selection:text-black">
      
      {/* ==========================================
          1. LOCKED THREE-NAVIGATION MULTI-TIER TOP NAV
          ========================================== */}
      <nav className="fixed top-0 left-0 right-0 bg-[#030508]/95 backdrop-blur-md border-b border-white/[0.02] z-50 flex flex-col">
        {/* Tier One Layout */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-white/[0.01]">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsSideDashOpen(!isSideDashOpen)}
              className="flex items-center space-x-2 bg-[#070A0F] border border-white/[0.03] px-3.5 py-2 rounded-xl text-[10px] font-black font-mono uppercase tracking-wider text-white hover:border-[#00ff00] transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              <span>Dashboard</span>
            </button>
            <div className="flex items-center space-x-1.5 bg-black px-2.5 py-1 rounded-lg border border-white/[0.01]">
              <svg viewBox="0 0 24 24" className="h-3 w-3 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 font-mono">Visitor</span>
            </div>
          </div>
          
          <button 
            onClick={() => { setActiveView("members_area"); setIsSideDashOpen(false); }}
            className="rounded-xl bg-[#070A0F] border border-white/[0.03] px-4 py-2 text-[10px] font-black uppercase tracking-wider text-white hover:border-[#00ff00] transition-colors font-mono"
          >
            Members Area
          </button>
        </div>
        
        {/* Tier Two Layout */}
        <div className="h-11 overflow-x-auto flex items-center px-3 space-x-1.5 scrollbar-none bg-[#030508]">
          {[
            { id: "prime_model", label: "PRIME Model" },
            { id: "concepts", label: "Concepts" },
            { id: "mentorship_library", label: "Mentorship Library" },
            { id: "weekly_setups", label: "Weekly Setups" },
            { id: "live_alerts", label: "Live Alerts" },
            { id: "results", label: "Results" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveView(tab.id); setIsSideDashOpen(false); }}
              className={`whitespace-nowrap px-4 h-8 flex items-center rounded-lg text-[10px] font-black uppercase tracking-widest font-mono transition-all ${activeView === tab.id ? "bg-[#00ff00] text-black font-black shadow-[0_0_15px_rgba(0,255,0,0.15)]" : "text-neutral-400 hover:text-white"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ==========================================
          2. SLIDING SIDE DASHBOARD DRAWER (Modules 1-5)
          ========================================== */}
      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-[#070A0F] border-r border-white/[0.02] pt-28 pb-20 z-40 transform transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col p-4 space-y-1.5 ${isSideDashOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="text-[9px] font-black text-neutral-500 uppercase tracking-widest font-mono mb-3 px-3">Ecosystem Sub-Modules</div>
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => { setActiveView(`module_${num}`); setIsSideDashOpen(false); }}
            className={`w-full text-left px-4 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-wider font-mono transition-all ${activeView === `module_${num}` ? "bg-[#00ff00] text-black font-black" : "text-neutral-400 hover:bg-white/[0.01] hover:text-white"}`}
          >
            Module 0{num} Framework
          </button>
        ))}
      </div>

      {isSideDashOpen && (
        <div onClick={() => setIsSideDashOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 transition-opacity" />
      )}

            {/* ==========================================
          3. FULLY BLED VIEWPORT MAIN CONTAINER
          ========================================== */}
      <main className="flex-1 pt-28 pb-32 px-4 max-w-5xl mx-auto w-full transition-all duration-300">
        {renderContentCanvas()}
      </main>

      {/* ==========================================
          4. LOCKED TWO-TIER BOTTOM NAVIGATION BAR
          ========================================== */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#030508] border-t border-white/[0.02] z-50 flex flex-col md:hidden max-h-24">
        {/* Tier One Headband */}
        <div className="h-7 bg-[#070A0F] border-b border-white/[0.01] flex items-center justify-center">
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-neutral-500 font-mono">
            CFD Platforms
          </span>
        </div>
        
        {/* Tier Two Icons Array (Vector SVGs Only) */}
        <div className="h-14 grid grid-cols-5 px-1 bg-[#030508]">
          {[
            { id: "broker", label: "Broker", svg: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg> },
            { id: "apps", label: "Apps", svg: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> },
            { id: "markets", label: "Markets", svg: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
            { id: "payment", label: "Payment", svg: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
            { id: "explore", label: "More", svg: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id); setIsSideDashOpen(false); }}
              className={`flex flex-col items-center justify-center text-[9px] font-bold font-mono tracking-tighter uppercase transition-colors ${activeView === item.id ? "text-[#00ff00]" : "text-neutral-500 hover:text-neutral-300"}`}
            >
              <div className={`mb-1 transition-colors ${activeView === item.id ? "text-[#00ff00]" : "text-neutral-500"}`}>
                {item.svg}
              </div>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </footer>

    </div>
  );
}

