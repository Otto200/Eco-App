"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize your public Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PremiumDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSessionAndProfile() {
      // 1. Fetch authenticated session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }
      setUser(session.user);

      // 2. Fetch active status profile row
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (data) setProfile(data);
      setLoading(false);

      // 3. Realtime listening loop: unlock layout when status changes in database
      const channel = supabase
        .channel(`profile-${session.user.id}`)
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

    getSessionAndProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0E14] text-gray-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  // --- VERIFICATION PAYWALL LAYOUT ---
  if (!profile || !profile.is_active) {
    const activationMessage = encodeURIComponent(`Activate my trading portal. Profile ID: ${user?.id}`);
    const whatsappLink = `https://wa.me/67576766296{activationMessage}`;

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0B0E14] px-4 font-sans text-white">
        <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#121824] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 text-3xl">
            🔒
          </div>
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-white">Unlock Live System Access</h2>
          <p className="mb-8 text-sm text-gray-400 leading-relaxed">
            Your registration is complete. Welcome to the trading environment. Activate your access channel via WhatsApp to reveal daily layouts and market trackers.
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-xl bg-emerald-500 py-3.5 text-center font-semibold text-gray-950 transition-all hover:bg-emerald-400 hover:scale-[1.01] active:scale-[0.99]"
          >
            🚀 Open WhatsApp Verification
          </a>
        </div>
      </main>
    );
  }

  // --- FULL UNLOCKED PREMIUM DASHBOARD ---
  return (
    <main className="min-h-screen bg-[#0B0E14] text-white p-6 md:p-12">
      <header className="mb-10 flex items-center justify-between border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">BANKBUGS|FX</h1>
          <p className="text-xs text-emerald-400 uppercase tracking-widest font-mono mt-1">Live Workspace Enabled</p>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="text-sm font-medium text-gray-400 hover:text-white transition">
          Exit System
        </button>
      </header>

      {/* Visual Analytics Dashboard Cards */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-800 bg-[#121824] p-6 shadow-lg">
          <h3 className="text-sm font-semibold tracking-wide text-gray-400">Market Target Matrix</h3>
          <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-400">Active</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-[#121824] p-6 shadow-lg">
          <h3 className="text-sm font-semibold tracking-wide text-gray-400">Liquidity Purge Trackers</h3>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white">Online</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-[#121824] p-6 shadow-lg">
          <h3 className="text-sm font-semibold tracking-wide text-gray-400">System Notification Sync</h3>
          <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-500">Connected</p>
        </div>
      </section>
    </main>
  );
}
