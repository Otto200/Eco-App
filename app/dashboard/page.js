"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initSession() {
      // 1. Get the current active session
      const { data: { session } } = await supabase.auth.getSession();
      
      // Fallback for visitors who bypass login directly
      if (!session) {
        setUser({ id: "visitor_mode" });
        setProfile({ is_active: true, username: "Guest Trader" });
        setLoading(false);
        return;
      }
      
      setUser(session.user);

      // 2. Fetch the actual verification row state from the database
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (data) {
        setProfile(data);
      } else {
        // Fallback placeholder if profile row execution delay happens
        setProfile({ is_active: false, username: "Trader" });
      }
      setLoading(false);

      // 3. Realtime listening mechanism - unlocks instantly when row status alters
      const channel = supabase
        .channel(`live-profile-${session.user.id}`)
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${session.user.id}` },
          (payload) => {
            setProfile(payload.new);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
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

  // ==========================================
  // 🔒 GATED WHATSAPP ACTIVATION INTERFACE
  // ==========================================
  if (!profile || !profile.is_active) {
    const activationURL = `https://wa.me{user?.id}`;

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#000000] px-4 antialiased">
        <div className="w-full max-w-md rounded-xl border border-neutral-900 bg-[#0B0E14] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#00ff00]/10 text-[#00ff00] text-xl font-mono">
            ⚠️
          </div>
          <h2 className="text-xl font-black tracking-tight text-white uppercase font-mono">Portal Verification Required</h2>
          <p className="mt-3 text-xs text-neutral-400 leading-relaxed font-sans px-2">
            Your workspace layout is currently locked. Connect with your system manager via WhatsApp to activate your institutional profile settings.
          </p>
          
          <div className="mt-8">
            <a
              href={activationURL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg bg-[#00ff00] py-4 text-center text-xs font-black uppercase tracking-widest text-black transition-all hover:bg-[#00dd00] active:scale-[0.99]"
            >
              Request Activation Channel
            </a>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // 📈 PREMIUM UNLOCKED ECOSYSTEM INTERFACE
  // ==========================================
  return (
    <main className="min-h-screen bg-[#000000] p-6 text-white antialiased font-sans">
      
      {/* Premium Dashboard Header Component */}
      <header className="mx-auto max-w-6xl mb-10 flex items-center justify-between border-b border-neutral-900 pb-6">
        <div className="flex items-center space-x-3">
          <span className="text-xl font-black tracking-tighter uppercase font-mono">
            BANKBUGS<span className="text-[#00ff00]">|</span>FX
          </span>
          <span className="rounded bg-[#00ff00]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#00ff00] font-mono">
            Core Live v1.0
          </span>
        </div>
        <button 
          onClick={() => { supabase.auth.signOut(); window.location.href = "/login"; }} 
          className="text-xs font-bold text-neutral-500 hover:text-white transition"
        >
          Disconnect
        </button>
      </header>

      {/* Main Premium Card Grid Configuration */}
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Metric Layer: Focusing on Market High & Low Bounds over text fields */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          
          <div className="rounded-xl border border-neutral-900 bg-[#0B0E14] p-6 shadow-md">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Ecosystem Metrics</div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-black text-white font-mono tracking-tight">88 Users</span>
              <span className="text-xs font-bold text-[#00ff00] font-mono">+12% Tracking</span>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-900 bg-[#0B0E14] p-6 shadow-md">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Liquidity Purge High Boundary</div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-black text-white font-mono tracking-tight">Stored Range High</span>
              <span className="h-2 w-2 rounded-full bg-[#00ff00] animate-pulse" />
            </div>
          </div>

          <div className="rounded-xl border border-neutral-900 bg-[#0B0E14] p-6 shadow-md sm:col-span-2 lg:col-span-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Liquidity Purge Low Boundary</div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-black text-white font-mono tracking-tight">Stored Range Low</span>
              <span className="text-xs font-mono text-neutral-600">Sync Complete</span>
            </div>
          </div>

        </section>

        {/* Premium Illustration & Interactive Visual Card Block */}
        <section className="rounded-xl border border-neutral-900 bg-[#0B0E14] p-8 shadow-xl relative overflow-hidden">
          <div className="max-w-md relative z-10">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#00ff00] font-mono bg-[#00ff00]/5 px-2 py-1 rounded">
              Ecosystem System Feed
            </span>
            <h2 className="text-xl font-black tracking-tight text-white mt-4 uppercase font-mono">
              Rule-Based Liquidity Framework
            </h2>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              Automatic alert engines watch high and low structure parameters continuously. Ensure system push alerts are allowed via the main layout setting panels to stream setups onto active screens.
            </p>
          </div>
          
          {/* Stylized premium abstract graphic container acting as the illustration asset */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden md:flex items-center justify-center bg-gradient-to-l from-[#00ff00]/5 to-transparent border-l border-neutral-900/30">
            <div className="text-6xl opacity-20 font-mono select-none">📊</div>
          </div>
        </section>

      </div>
    </main>
  );
}
