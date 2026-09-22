"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize your public Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (isRegistering) {
      // --- SIGN UP FLOW ---
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        setErrorMsg(error.message);
      } else {
        // Automatically sign them in or prompt check email
        alert("Registration complete! Welcome to the workspace.");
        window.location.href = "/dashboard";
      }
    } else {
      // --- SIGN IN FLOW ---
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setErrorMsg("Invalid credentials. Please verify your portal access.");
      } else {
        window.location.href = "/dashboard";
      }
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0E14] px-4 font-sans text-white">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#121824] p-8 shadow-2xl">
        
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">BANKBUGS|FX</h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-emerald-400 font-mono">
            {isRegistering ? "Create Trade Portal" : "Secure Member Workspace"}
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-left text-sm text-red-400">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Workspace Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trader@bankbugsfx.com"
              className="w-full rounded-xl border border-gray-800 bg-[#1A2232] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Secure Gateway Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-800 bg-[#1A2232] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-emerald-400 transition"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 py-3.5 text-center font-bold text-gray-950 transition-all hover:bg-emerald-400 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-gray-950 border-t-transparent" />
            ) : isRegistering ? (
              "Initialize Account Access"
            ) : (
              "Authorize Session"
            )}
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="mt-8 border-t border-gray-800 pt-6 text-center text-sm text-gray-400">
          {isRegistering ? (
            <p>
              Already verified in the ecosystem?{" "}
              <button
                onClick={() => setIsRegistering(false)}
                className="font-semibold text-emerald-400 hover:underline"
              >
                Log In Here
              </button>
            </p>
          ) : (
            <p>
              New to the ecosystem framework?{" "}
              <button
                onClick={() => setIsRegistering(true)}
                className="font-semibold text-emerald-400 hover:underline"
              >
                Register a Portal
              </button>
            </p>
          )}
        </div>

      </div>
    </main>
  );
}
