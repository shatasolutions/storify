"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push("/");
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogin() {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("LOGIN RESULT:", data, error);

    if (error) {
      alert(error.message);
    } else {
      router.push("/");
    }

    setLoading(false);
  }

  async function handleSignup() {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email to confirm your account");
      router.push("/");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Login / Sign Up
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded-xl bg-white/10 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 rounded-xl bg-white/10 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full mb-3 bg-white text-black py-3 rounded-full font-semibold"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <button
          onClick={handleSignup}
          className="w-full bg-white/10 py-3 rounded-full font-semibold"
        >
          Sign Up
        </button>

      </div>
    </main>
  );
}