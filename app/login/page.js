"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize your public Supabase client using environment configurations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Login() {
  const [fullName, setFullName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAccess = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (!fullName.trim()) {
      setErrorMsg("Please enter your registered full name to authenticate access.");
      setLoading(false);
      return;
    }

    try {
      // Upsert profile into public.profiles to establish user metadata session tracking
      // Since it's a passwordless full-name entry, we keep it simple, clean and fast
      const { data: { user }, error: authError } = await supabase.auth.signInAnonymously({
        options: {
          data: { full_name: fullName.trim() }
        }
      });

      if (authError) throw authError;

      // Smooth programmatic push straight into the dashboard workspace
      window.location.href = "/dashboard";
    } catch (err) {
      setErrorMsg(err.message || "Gateway timeout. Verify your data connectivity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#000000] px-4 font-sans text-white antialiased">
      <div className="w-full max-w-md rounded-xl border border-neutral-900 bg-[#0B0E14] p-8 shadow-2xl transition-all duration-300">
        
        {/* Authentic Premium Header & Logo Integration */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center space-x-3">
            <img 
              src="/img/logo.webp" 
              alt="BANKBUGS|FX" 
              className="h-10 w-10 object-contain rounded-md"
              onError={(e) => e.target.style.display = 'none'} // Clean internal fallback if file isn't tracked yet
            />
            <span className="text-2xl font-black tracking-tighter text-white uppercase font-mono">
              BANKBUGS<span className="text-[#00ff00]">|</span>FX
            </span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#00ff00] font-mono">
            Secure Trader Core Gateway
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-lg border border-red-500/10 bg-red-950/20 p-4 text-left text-xs font-medium text-red-400 font-mono">
            ⚡ {errorMsg}
          </div>
        )}

        {/* Input Interface - Premium UI focus over text-heavy panels */}
        <form onSubmit={handleAccess} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2 font-mono">
              Trader Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name to access..."
              className="w-full rounded-lg border border-neutral-800 bg-[#121824] px-4 py-3.5 text-sm text-white placeholder-neutral-600 outline-none transition duration-200 focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00]"
            />
          </div>

          {/* Premium Green-Filled Action Interface Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#00ff00] py-4 text-center text-xs font-black uppercase tracking-widest text-black transition-all duration-200 hover:bg-[#00dd00] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Verifying Token..." : "Authorize System Access"}
          </button>
        </form>

        {/* Alternative Authentication Utilities Section */}
        <div className="my-6 flex items-center justify-between">
          <span className="w-full border-b border-neutral-900"></span>
          <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-neutral-600 font-mono">Or</span>
          <span className="w-full border-b border-neutral-900"></span>
        </div>

        <div>
          <button 
            type="button" 
            onClick={() => window.location.href = "/dashboard"}
            className="flex w-full items-center justify-center space-x-3 rounded-lg border border-neutral-800 bg-[#121824]/50 py-3.5 text-center text-xs font-bold text-neutral-300 transition duration-200 hover:bg-[#121824] hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              <circle cx="12" cy="16" r="1" fill="currentColor"/>
            </svg>
            <span>Continue as VISITOR</span>
          </button>
        </div>

      </div>
    </main>
  );
}
