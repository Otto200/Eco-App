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
  
  // Navigation & Subview Layout UI states
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
      setProfile(data || { is_active: false, is_visitor: false });
      setLoading(false);

      const channel = supabase.channel(`live-profile-layer`)
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${session.user.id}` }, 
        (payload) => setProfile(payload.new))
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
    initSession();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#000000]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#00ff00] border-t-transparent" />
      </div>
    );
  }

  // --- INTERACTIVE SYSTEM CANVAS RENDER LOOP ---
  const renderCanvasView = () => {
    switch (activeView) {
      case "prime_model":
        return (
          <div className="w-full space-y-6">
            <div className="rounded-xl border border-neutral-950 bg-[#0B0E14] p-6 shadow-md">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Liquidity Tracking</div>
              <h2 className="mt-2 text-xl font-black text-white font-mono uppercase tracking-tight">PRIME Model Execution</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="p-4 bg-black rounded-lg border border-neutral-900 font-mono text-xs">
                  <span className="text-neutral-500 block">STORED RANGE HIGH:</span>
                  <span className="text-white text-lg font-bold tracking-tight">Liquidity Purge Target</span>
                </div>
                <div className="p-4 bg-black rounded-lg border border-neutral-900 font-mono text-xs">
                  <span className="text-neutral-500 block">STORED RANGE LOW:</span>
                  <span className="text-white text-lg font-bold tracking-tight">Liquidity Purge Base</span>
                </div>
              </div>
            </div>
          </div>
        );
      case "module_1": case "module_2": case "module_3": case "module_4": case "module_5":
        return (
          <div className="w-full text-center py-20 border border-dashed border-neutral-900 rounded-xl bg-[#0B0E14]/30">
            <h3 className="text-xs font-black uppercase text-[#00ff00] font-mono tracking-widest">{activeView.replace("_", " ")}</h3>
            <p className="text-neutral-500 text-[11px] font-mono mt-2">Core Content Bled Fully into App Canvas Area</p>
          </div>
        );
      default:
        return (
          <div className="w-full text-center py-16 text-neutral-500 font-mono text-xs uppercase tracking-widest">
            [ {activeView.replace("_", " ")} Active Workspace ]
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans antialiased selection:bg-[#00ff00] selection:text-black overflow-x-hidden">
      
      {/* ==========================================
          1. LOCKED TWO-TIER TOP NAVIGATION BAR
          ========================================== */}
      <nav className="fixed top-0 left-0 right-0 border-b border-neutral-950 bg-[#000000] z-50 flex flex-col">
        {/* Tier One Header */}
        <div className="h-14 border-b border-neutral-950/60 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsSideDashOpen(!isSideDashOpen)}
              className="flex items-center space-x-2 bg-[#121824] border border-neutral-900 px-3 py-1.5 rounded-lg text-[10px] font-black font-mono uppercase tracking-wider text-white hover:border-[#00ff00] transition"
            >
              <span>☰</span> <span>Dashboard</span>
            </button>
            <div className="flex items-center space-x-1 bg-neutral-950 border border-neutral-950 px-2 py-1 rounded">
              <span className="text-neutral-500 text-[10px]">👤</span>
              <span className="text-neutral-400 text-[9px] font-bold uppercase tracking-wider font-mono">Visitor</span>
            </div>
          </div>
          <button 
            onClick={() => setActiveView("members_area")}
            className="rounded-lg bg-[#121824] border border-neutral-900 px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-white hover:border-[#00ff00] transition font-mono"
          >
            Members Area
          </button>
        </div>
        
        {/* Tier Two Navigation Buttons */}
        <div className="h-11 overflow-x-auto flex items-center px-2 space-x-1 scrollbar-none bg-[#000000]">
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
              className={`whitespace-nowrap px-4 h-8 flex items-center rounded-md text-[10px] font-bold uppercase tracking-wider font-mono transition-all ${activeView === tab.id ? "bg-[#00ff00]/10 text-[#00ff00] border border-[#00ff00]/20" : "text-neutral-400 hover:text-white"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ==========================================
          2. SLIDING SIDE DASHBOARD DRAWER (Modules 1 to 5)
          ========================================== */}
      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-[#0B0E14] border-r border-neutral-950 pt-28 pb-20 z-40 transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col p-4 space-y-2 ${isSideDashOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="text-[9px] font-black text-neutral-500 uppercase tracking-widest font-mono mb-2 px-3">Ecosystem Streams</div>
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => { setActiveView(`module_${num}`); setIsSideDashOpen(false); }} // Auto Closes side menu
            className={`w-full text-left px-4 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider font-mono transition border ${activeView === `module_${num}` ? "bg-[#00ff00] text-black border-[#00ff00]" : "text-neutral-400 border-neutral-900/40 hover:bg-neutral-900 hover:text-white"}`}
          >
            Module 0{num} System
          </button>
        ))}
      </div>

      {/* Backdrop overlay to safely click close drawer layouts */}
      {isSideDashOpen && (
        <div onClick={() => setIsSideDashOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 transition-opacity" />
      )}

      {/* ==========================================
          3. FULLY BLED MAIN VIEWPORT CONTAINER
          ========================================== */}
      <main className="flex-1 pt-28 pb-32 px-4 max-w-6xl mx-auto w-full transition-all duration-300">
        {renderCanvasView()}
      </main>

      {/* ==========================================
          4. LOCKED TWO-TIER BOTTOM UTILITY NAV
          ========================================== */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#000000] border-t border-neutral-950 z-50 flex flex-col md:hidden">
        {/* Tier One Headband */}
        <div className="h-7 bg-[#0B0E14]/80 border-b border-neutral-950/40 flex items-center justify-center">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-400 font-mono">
            CFD Platforms
          </span>
        </div>
        
        {/* Tier Two Utility Navigation Actions */}
        <div className="h-14 grid grid-cols-5 px-1 bg-[#000000]">
          {[
            { id: "broker", label: "Broker" },
            { id: "apps", label: "Apps" },
            { id: "markets", label: "Markets" },
            { id: "payment", label: "Payment" },
            { id: "explore", label: "More" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id); setIsSideDashOpen(false); }}
              className={`flex flex-col items-center justify-center text-[9px] font-bold font-mono tracking-tighter uppercase transition-colors ${activeView === item.id ? "text-[#00ff00]" : "text-neutral-500 hover:text-neutral-300"}`}
            >
                            <span className="text-xs mb-0.5">
                {item.id === "broker" && "🏛️"}
                {item.id === "apps" && "📱"}
                {item.id === "markets" && "📊"}
                {item.id === "payment" && "💳"}
                {item.id === "explore" && "✨"}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </footer>

    </div>
  );
}
