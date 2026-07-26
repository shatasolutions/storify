"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeNextPath(searchParams.get("next"));

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) router.replace(nextPath);
      }
    );
    return () => listener.subscription.unsubscribe();
  }, [router, nextPath]);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setMessage(error.message);
    else router.replace(nextPath);
    setLoading(false);
  }

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else {
      setMessage("Check your email to confirm your account");
      router.replace(nextPath);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-6 pt-24">
      <form
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8"
        onSubmit={handleLogin}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login / Sign Up</h1>

        <label className="block text-sm text-white/70 mb-2" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full mb-4 p-3 rounded-xl bg-white/10 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block text-sm text-white/70 mb-2" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="w-full mb-6 p-3 rounded-xl bg-white/10 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {message && <p className="mb-4 text-sm text-cyan-200">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mb-3 bg-white text-black py-3 rounded-full font-semibold disabled:opacity-50"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={handleSignup}
          className="w-full bg-white/10 py-3 rounded-full font-semibold disabled:opacity-50"
        >
          Sign Up
        </button>
      </form>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
          Loading...
        </main>
      }
    >
      <AuthForm />
    </Suspense>
  );
}
