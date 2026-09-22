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
  
  // Track active sub-view rendering on main canvas
  const [activeTab, setActiveTab] = useState("dashboard"); 

  useEffect(() => {
    async function initSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Fallback for easy visitor preview loop
        setProfile({ is_active: true, username: "Guest Trader" });
        setLoading(false);
        return;
      }
      
      const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      setProfile(data || { is_active: false });
      setLoading(false);

      const channel = supabase.channel(`live-p-${session.user.id}`)
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${session.user.id}` }, 
        (payload) => setProfile(payload.new))
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
    initSession();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0E14]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#00ff00] border-t-transparent" />
      </div>
    );
  }

  // --- WHATSAPP ACTIVATION WALL ---
  if (!profile || !profile.is_active) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#000000] px-4 font-sans">
        <div className="w-full max-w-md rounded-xl border border-neutral-900 bg-[#0B0E14] p-8 text-center">
          <div className="mx-auto mb-4 text-xl font-mono text-[#00ff00]">⚠️</div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">Verification Gated</h2>
          <p className="mt-2 text-xs text-neutral-400 leading-relaxed">Activate workspace parameters via the official channel.</p>
          <a href="https://wa.me" target="_blank" rel="noopener noreferrer" className="mt-6 block w-full rounded-lg bg-[#00ff00] py-3.5 text-center text-xs font-black uppercase tracking-widest text-black">
            Request Activation
          </a>
        </div>
      </main>
    );
  }

  // --- RENDERING HANDLER FOR CANVAS CONTENT ---
  const renderMainCanvas = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <section className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-neutral-900 bg-[#0B0E14] p-6">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Liquidity Purge High</div>
                <div className="mt-2 text-xl font-black text-white font-mono">Stored Range High</div>
              </div>
              <div className="rounded-xl border border-neutral-900 bg-[#0B0E14] p-6">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Liquidity Purge Low</div>
                <div className="mt-2 text-xl font-black text-white font-mono">Stored Range Low</div>
              </div>
            </section>
            <div className="rounded-xl border border-neutral-900 bg-[#0B0E14] p-6 h-48 flex items-center justify-center">
              <span className="text-xs text-neutral-600 font-mono uppercase tracking-widest">[ Core Metrics Live Feed ]</span>
            </div>
          </div>
        );
      case "playbook":
        return (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-[#00ff00] font-mono tracking-wider">Daily Setups & Strategies</h3>
            <div className="rounded-xl border border-neutral-900 bg-[#0B0E14] p-6 h-64 flex items-center justify-center">
              <span className="text-xs text-neutral-500 font-mono">[ Manual Playbook Entries Render Here ]</span>
            </div>
          </div>
        );
      case "mentorship":
        return (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-[#00ff00] font-mono tracking-wider">Locked Video Modules</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="aspect-video rounded-xl bg-[#0B0E14] border border-neutral-900 flex items-center justify-center text-xs text-neutral-500 font-mono">Module 1 Video</div>
              <div className="aspect-video rounded-xl bg-[#0B0E14] border border-neutral-900 flex items-center justify-center text-xs text-neutral-500 font-mono">Module 2 Video</div>
            </div>
          </div>
        );
      case "indicators":
        return (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-[#00ff00] font-mono tracking-wider">Expert Advisors & Indicators</h3>
            <div className="rounded-xl border border-neutral-900 bg-[#0B0E14] p-6 text-center text-xs text-neutral-400">
              Download structural configuration files directly into MT5.
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans antialiased selection:bg-[#00ff00] selection:text-black">
      
      {/* 1. TOP LOCKED FIXED HEADER */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-neutral-900 bg-[#000000] z-40 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src="/img/logo.webp" alt="Logo" className="h-6 w-6 object-contain rounded" onError={(e) => e.target.style.display='none'} />
          <span className="text-sm font-black tracking-tighter uppercase font-mono">BANKBUGS<span className="text-[#00ff00]">|</span>FX</span>
        </div>
        <div className="text-[10px] font-bold font-mono tracking-widest text-neutral-500 uppercase bg-neutral-950 px-2 py-1 rounded border border-neutral-900">
          Terminal Connected
        </div>
      </header>

      <div className="flex flex-1 pt-16 pb-16 md:pb-0">
        
        {/* 2. PERSISTENT SIDE NAVIGATION MENU (Hidden on small viewports) */}
        <aside className="fixed left-0 top-16 bottom-0 w-64 border-r border-neutral-900 bg-[#000000] hidden md:flex flex-col p-4 space-y-2 z-30">
          <button onClick={() => setActiveTab("dashboard")} className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider font-mono transition ${activeTab === "dashboard" ? "bg-[#00ff00] text-black" : "text-neutral-400 hover:bg-neutral-900 hover:text-white"}`}>
            📊 Dashboard
          </button>
          <button onClick={() => setActiveTab("playbook")} className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider font-mono transition ${activeTab === "playbook" ? "bg-[#00ff00] text-black" : "text-neutral-400 hover:bg-neutral-900 hover:text-white"}`}>
            📖 Strategy Playbook
          </button>
          <button onClick={() => setActiveTab("mentorship")} className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider font-mono transition ${activeTab === "mentorship" ? "bg-[#00ff00] text-black" : "text-neutral-400 hover:bg-neutral-900 hover:text-white"}`}>
            🎥 Mentorship
          </button>
          <button onClick={() => setActiveTab("indicators")} className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider font-mono transition ${activeTab === "indicators" ? "bg-[#00ff00] text-black" : "text-neutral-400 hover:bg-neutral-900 hover:text-white"}`}>
            ⚙️ MT5 Indicators
          </button>
        </aside>

        {/* 3. DYNAMIC MAIN CANVAS CONTENT HUB */}
        <main className="flex-1 p-6 md:pl-72 max-w-6xl mx-auto w-full transition-all duration-300">
          {renderMainCanvas()}
        </main>

      </div>

      {/* 4. PERSISTENT BOTTOM NAVIGATION BAR (Visible only on mobile screen viewports) */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 border-t border-neutral-900 bg-[#000000] z-40 md:hidden grid grid-cols-4 px-2">
        <button onClick={() => setActiveTab("dashboard")} className={`flex flex-col items-center justify-center text-[9px] font-bold font-mono tracking-tight uppercase ${activeTab === "dashboard" ? "text-[#00ff00]" : "text-neutral-500"}`}>
          <span className="text-base mb-0.5">📊</span>
          <span>Core</span>
        </button>
        <button onClick={() => setActiveTab("playbook")} className={`flex flex-col items-center justify-center text-[9px] font-bold font-mono tracking-tight uppercase ${activeTab === "playbook" ? "text-[#00ff00]" : "text-neutral-500"}`}>
          <span className="text-base mb-0.5">📖</span>
          <span>Setups</span>
        </button>
        <button onClick={() => setActiveTab("mentorship")} className={`flex flex-col items-center justify-center text-[9px] font-bold font-mono tracking-tight uppercase ${activeTab === "mentorship" ? "text-[#00ff00]" : "text-neutral-500"}`}>
          <span className="text-base mb-0.5">🎥</span>
          <span>Videos</span>
        </button>
        <button onClick={() => setActiveTab("indicators")} className={`flex flex-col items-center justify-center text-[9px] font-bold font-mono tracking-tight uppercase ${activeTab === "indicators" ? "text-[#00ff00]" : "text-neutral-500"}`}>
          <span className="text-base mb-0.5">⚙️</span>
          <span>Files</span>
        </button>
      </nav>

    </div>
  );
}
