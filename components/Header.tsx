"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useRef, useSyncExternalStore } from "react";
import { Sparkles, ShoppingCart, Globe, BarChart3, CreditCard, Megaphone, Mail, Tag, LineChart, Wallet, Receipt, Percent } from "lucide-react";
import { useCart } from "@/context/CartContext";

function useIsClient() {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
}

export default function Header() {
  const [productsOpen, setProductsOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items } = useCart();
  const mounted = useIsClient();
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openProducts() {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setProductsOpen(true);
  }
  function closeProducts() {
    closeTimeoutRef.current = setTimeout(() => {
      setProductsOpen(false);
    }, 120);
  }

  const glowRef = useRef<HTMLDivElement | null>(null);

  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  // --- For neural cursor interaction ---
  const lastPos = useRef({ x: 0, y: 0, time: 0 });
  const velocityRef = useRef(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!glowRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const now = Date.now();
    const dx = x - lastPos.current.x;
    const dy = y - lastPos.current.y;
    const dt = now - lastPos.current.time || 16;

    const rawSpeed = Math.sqrt(dx * dx + dy * dy) / dt;
    velocityRef.current = velocityRef.current * 0.7 + rawSpeed * 0.3;
    const speed = velocityRef.current;

    const scale = 1.04 + Math.min(speed * 1.1, 0.22);

    // --- Predictive anticipation for glow movement ---
    const anticipation = Math.min(speed * 4.5, 0.35);
    const predictX = x + dx * anticipation;
    const predictY = y + dy * anticipation;

    // --- Adaptive color zones ---
    const ratio = x / rect.width;
    let color = "rgba(34,211,238,0.25)"; // cyan default
    if (ratio > 0.33 && ratio < 0.66) {
      color = "rgba(168,85,247,0.25)"; // purple (Sell)
    } else if (ratio >= 0.66) {
      color = "rgba(56,189,248,0.25)"; // sky (Marketing)
    }

    // --- Subtle breathing glow intensity ---
    const pulse = 1 + Math.sin(Date.now() / 520) * 0.025;

    // apply color + transform with prediction and breathing pulse
    if (glowRef.current) {
      glowRef.current.style.background = color;
      glowRef.current.style.transform = `translate(${predictX - 120}px, ${predictY - 120}px) scale(${scale * pulse})`;
    }

    lastPos.current = { x, y, time: now };
  }

  function handleItemMove(e: React.MouseEvent<HTMLElement>, index: number) {
    const el = itemRefs.current[index];
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    el.style.transition = "transform 0.06s cubic-bezier(0.16,1,0.3,1)";
    const intensity = 0.08 + Math.min(velocityRef.current * 0.16, 0.1);
    el.style.transform = `translate(${x * intensity}px, ${y * intensity}px)`;
  }

  function handleItemLeave(index: number) {
    const el = itemRefs.current[index];
    if (!el) return;
    el.style.transition = "transform 0.12s cubic-bezier(0.16,1,0.3,1)";
    el.style.transform = `translate(0px, 0px)`;
  }

  // --- Staggered animation variants for premium menu ---
  const listVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 pt-4">
      <div className="mx-auto max-w-7xl rounded-full border border-white/10 bg-gradient-to-r from-cyan-400/10 via-white/5 to-purple-400/10 px-6 py-3 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] overflow-visible">
        <div className="flex items-center justify-between gap-6">

          {/* Logo */}
          <div className="flex items-center gap-3 text-white">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="h-9 w-9 rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-400 to-purple-500 shadow-[0_0_25px_rgba(56,189,248,0.6)]"
            />
            <span className="font-semibold">Storify</span>
          </div>

          {/* Nav */}
          <nav className="relative hidden items-center gap-8 text-sm text-white/65 md:flex overflow-visible">
            <Link href="/" className="transition hover:text-white">
              Platform
            </Link>

            <div
              className="relative"
              onMouseEnter={openProducts}
              onMouseLeave={closeProducts}
            >
              <button
                type="button"
                className="flex items-center gap-2 transition hover:text-white cursor-pointer"
              >
                Products
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 4.5L6 8L9.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {productsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.985 }}
                    transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                    className="pointer-events-none fixed left-1/2 top-[80px] z-50 mt-4 w-[900px] max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#020617]/95 shadow-[0_40px_120px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
                    onMouseMove={(e) => {
                      handleMouseMove(e);
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = (e.clientX - rect.left) / rect.width - 0.5;
                      const y = (e.clientY - rect.top) / rect.height - 0.5;

                      const intensity = 1 + Math.min(Math.abs(x) + Math.abs(y), 1) * 0.01;
                      e.currentTarget.style.transform =
                        `perspective(1400px) rotateX(${y * -3.5}deg) rotateY(${x * 3.5}deg) scale(${intensity})`;
                    }}
                    onMouseLeave={(e) => {
                      closeProducts();
                      e.currentTarget.style.transform =
                        "perspective(1400px) rotateX(0deg) rotateY(0deg) scale(1)";
                    }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div
                      ref={glowRef}
                      className="pointer-events-none absolute h-[140px] w-[140px] rounded-full bg-cyan-400/15 blur-2xl transition-transform duration-50 ease-out"
                    />
                    <motion.div
                      className="pointer-events-none absolute h-[180px] w-[180px] rounded-full blur-2xl"
                      style={{ mixBlendMode: 'overlay', background: 'rgba(255,255,255,0.15)' }}
                      animate={{ opacity: [0.15, 0.25, 0.15] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    {/* Subtle animated backdrop gradient */}
                    <motion.div
                      animate={{ opacity: [0.05, 0.12, 0.05] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-purple-400/5"
                    />
                    <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                    {[
                      [12, 18, 4.2],
                      [28, 64, 5.1],
                      [41, 22, 4.8],
                      [55, 78, 6.0],
                      [67, 35, 4.5],
                      [73, 58, 5.4],
                      [19, 82, 4.9],
                      [88, 14, 5.7],
                      [34, 47, 4.3],
                      [61, 11, 5.2],
                      [8, 51, 4.6],
                      [79, 71, 5.8],
                    ].map(([top, left, duration], i) => (
                      <motion.span
                        key={i}
                        className="pointer-events-none absolute h-1 w-1 rounded-full bg-white/20"
                        style={{
                          top: `${top}%`,
                          left: `${left}%`,
                        }}
                        animate={{
                          y: [0, -10, 0],
                          opacity: [0.2, 0.6, 0.2],
                        }}
                        transition={{
                          duration,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                    <motion.div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                      style={{ opacity: 0.04 }}
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] backdrop-blur-[1px]" />
                    <div className="relative pointer-events-auto">
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition duration-500" />
                      <motion.div layout className="relative">
                        <div className="grid grid-cols-4 gap-8 p-8 text-sm">

                        {/* Build */}
                        <div className="space-y-4">
                          <p className="text-cyan-300 uppercase tracking-[0.2em]">Build</p>
                          {[
                            { name: "Website Builder", icon: Sparkles },
                            { name: "Themes", icon: Sparkles },
                            { name: "Domains", icon: Globe },
                            { name: "Customer Accounts", icon: ShoppingCart },
                            { name: "Sidekick", icon: Sparkles },
                          ].map(({ name, icon: Icon }, index) => (
                            <motion.div key={name} variants={itemVariants}>
                              <Link
                                href={`/product/${name.toLowerCase().replace(/\s+/g, "-")}`}
                                ref={(el) => {
                                  itemRefs.current[index] = el;
                                }}
                                onMouseMove={(e) => handleItemMove(e, index)}
                                onMouseLeave={() => handleItemLeave(index)}
                                className="group relative z-10 flex items-center gap-3 cursor-pointer rounded-xl p-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-white/[0.03]"
                              >
                                <motion.div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-400/12 to-transparent" transition={{ type: 'spring', stiffness: 360, damping: 28 }} />
                                <motion.div className="pointer-events-none absolute inset-0 rounded-xl" initial={false} whileHover={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.10) inset, 0 8px 24px rgba(0,0,0,0.28)" }} transition={{ duration: 0.25 }} />
                                <Icon className="relative h-4 w-4 text-cyan-400 transition group-hover:scale-110 group-hover:-rotate-6" />
                                <p className="relative text-white/80 group-hover:text-white transition group-hover:translate-x-0.5">{name}</p>
                              </Link>
                            </motion.div>
                          ))}
                        </div>

                        {/* Sell */}
                        <div className="space-y-4">
                          <p className="text-cyan-300 uppercase tracking-[0.2em]">Sell</p>
                          {[
                            { name: "Online Store", icon: ShoppingCart },
                            { name: "Point of Sale", icon: CreditCard },
                            { name: "Shop App", icon: Sparkles },
                            { name: "Social & Marketplaces", icon: Globe },
                            { name: "Global", icon: Globe },
                            { name: "B2B", icon: BarChart3 },
                            { name: "Across Markets", icon: Globe },
                          ].map(({ name, icon: Icon }, index) => {
                            const globalIndex = index + 10;
                            return (
                              <motion.div key={name} variants={itemVariants}>
                                <Link
                                  href={`/product/${name.toLowerCase().replace(/\s+/g, "-")}`}
                                  ref={(el) => {
                                    itemRefs.current[globalIndex] = el;
                                  }}
                                  onMouseMove={(e) => handleItemMove(e, globalIndex)}
                                  onMouseLeave={() => handleItemLeave(globalIndex)}
                                  className="group relative z-10 flex items-center gap-3 cursor-pointer rounded-xl p-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-white/[0.03]"
                                >
                                  <motion.div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-400/12 to-transparent" transition={{ type: 'spring', stiffness: 360, damping: 28 }} />
                                  <motion.div className="pointer-events-none absolute inset-0 rounded-xl" initial={false} whileHover={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.10) inset, 0 8px 24px rgba(0,0,0,0.28)" }} transition={{ duration: 0.25 }} />
                                  <Icon className="relative h-4 w-4 text-cyan-400 transition group-hover:scale-110 group-hover:-rotate-6" />
                                  <p className="relative text-white/80 group-hover:text-white transition group-hover:translate-x-0.5">{name}</p>
                                </Link>
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Marketing */}
                        <div className="space-y-4">
                          <p className="text-cyan-300 uppercase tracking-[0.2em]">Marketing</p>
                          <motion.div variants={listVariants} initial="hidden" animate="show" className="space-y-0">
                            {[
                              { name: "Advertising & Campaigns", icon: Megaphone },
                              { name: "Email & Customer Chat", icon: Mail },
                              { name: "Discounts", icon: Tag },
                              { name: "Analytics", icon: LineChart },
                            ].map(({ name, icon: Icon }, index) => (
                              <motion.div key={name} variants={itemVariants}>
                                <Link
                                  href={`/product/${name.toLowerCase().replace(/\s+/g, "-")}`}
                                  ref={(el) => {
                                    itemRefs.current[index + 30] = el;
                                  }}
                                  onMouseMove={(e) => handleItemMove(e, index + 30)}
                                  onMouseLeave={() => handleItemLeave(index + 30)}
                                  className="group relative z-10 flex items-center gap-3 cursor-pointer rounded-xl p-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-white/[0.03]"
                                >
                                  <motion.div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-sky-400/12 to-transparent" transition={{ type: 'spring', stiffness: 360, damping: 28 }} />
                                  <motion.div className="pointer-events-none absolute inset-0 rounded-xl" initial={false} whileHover={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.10) inset, 0 8px 24px rgba(0,0,0,0.28)" }} transition={{ duration: 0.25 }} />
                                  <Icon className="relative h-4 w-4 text-cyan-400 transition group-hover:scale-110 group-hover:-rotate-6" />
                                  <p className="relative text-white/80 group-hover:text-white transition group-hover:translate-x-0.5">{name}</p>
                                </Link>
                              </motion.div>
                            ))}
                          </motion.div>
                          <p className="text-cyan-300 mt-4 uppercase tracking-[0.2em]">Get Paid</p>
                          <motion.div variants={listVariants} initial="hidden" animate="show" className="space-y-0">
                            {[
                              { name: "Checkout", icon: Wallet },
                              { name: "Payments", icon: Receipt },
                              { name: "Taxes", icon: Percent },
                            ].map(({ name, icon: Icon }, index) => (
                              <motion.div key={name} variants={itemVariants}>
                                <Link
                                  href={`/product/${name.toLowerCase().replace(/\s+/g, "-")}`}
                                  ref={(el) => {
                                    itemRefs.current[index + 40] = el;
                                  }}
                                  onMouseMove={(e) => handleItemMove(e, index + 40)}
                                  onMouseLeave={() => handleItemLeave(index + 40)}
                                  className="group relative z-10 flex items-center gap-3 cursor-pointer rounded-xl p-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-white/[0.03]"
                                >
                                  <motion.div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-sky-400/12 to-transparent" transition={{ type: 'spring', stiffness: 360, damping: 28 }} />
                                  <motion.div className="pointer-events-none absolute inset-0 rounded-xl" initial={false} whileHover={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.10) inset, 0 8px 24px rgba(0,0,0,0.28)" }} transition={{ duration: 0.25 }} />
                                  <Icon className="relative h-4 w-4 text-cyan-400 transition group-hover:scale-110 group-hover:-rotate-6" />
                                  <p className="relative text-white/80 group-hover:text-white transition group-hover:translate-x-0.5">{name}</p>
                                </Link>
                              </motion.div>
                            ))}
                          </motion.div>
                        </div>

                        {/* Highlight Panel */}
                        <div className="border-l border-white/10 pl-6 flex flex-col gap-6">

                          <motion.div
                            whileHover={{ scale: 1.06, rotateX: 8, rotateY: -8, y: -4 }}
                            className="rounded-2xl bg-gradient-to-br from-purple-500/30 to-cyan-500/30 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                          >
                            <p className="text-white font-semibold text-lg">Shop Pay</p>
                            <p className="text-white/60 text-sm mt-2">Best checkout experience</p>
                          </motion.div>

                          <motion.div
                            whileHover={{ scale: 1.06, rotateX: -8, rotateY: 8, y: -4 }}
                            className="rounded-2xl bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
                          >
                            <p className="text-white font-semibold text-lg">Sidekick AI</p>
                            <p className="text-white/60 text-sm mt-2">Smart automation assistant</p>
                          </motion.div>

                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/store"
              className="transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-white"
            >
              Store
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setSolutionsOpen(true)}
              onMouseLeave={() => setSolutionsOpen(false)}
            >
              <button className="flex items-center gap-2 transition hover:text-white hover:scale-[1.015]">
                Solutions
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 4.5L6 8L9.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {solutionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-1/2 top-full z-50 mt-4 w-[520px] -translate-x-1/2 rounded-[1.5rem] border border-white/10 bg-[#0b1220]/95 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <Link href="/product/demo" className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]">
                        <p className="text-sm font-semibold text-white">AI Content</p>
                        <p className="mt-2 text-sm text-white/55">Generate product pages, FAQs, and SEO-ready content.</p>
                      </Link>
                      <Link href="/store" className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]">
                        <p className="text-sm font-semibold text-white">Commerce Tools</p>
                        <p className="mt-2 text-sm text-white/55">Explore the core products and storefront tools.</p>
                      </Link>
                      <Link href="/cart" className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]">
                        <p className="text-sm font-semibold text-white">Checkout Flow</p>
                        <p className="mt-2 text-sm text-white/55">Review cart and see how the buying flow works.</p>
                      </Link>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]">
                        <p className="text-sm font-semibold text-white">Automation</p>
                        <p className="mt-2 text-sm text-white/55">Connect workflows, fulfillment, and growth systems.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/pricing"
              className="transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-white"
            >
              Pricing
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-2 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-white"
            >
              <span>Cart</span>
              {mounted && items.length > 0 && (
                <span className="bg-white text-black text-xs px-2 py-0.5 rounded-full font-medium">
                  {items.length}
                </span>
              )}
            </Link>
            <Link href="/demo" className="transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-white">
              Demo Page
            </Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/10 md:block"
            >
              Sign In
            </Link>
            <Link
              href="/auth"
              className="relative overflow-hidden rounded-full bg-white px-5 py-2 text-black font-medium transition hover:scale-105 active:scale-95 duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-purple-400/30 opacity-0 transition hover:opacity-100" />
              <span className="relative">Get Started</span>
            </Link>
            <Link
              href="/dashboard"
              className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 md:block"
            >
              Orders
            </Link>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white md:hidden"
            >
              ☰
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-4 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0b1220]/90 p-4 md:hidden"
            >
              <div className="flex flex-col gap-3 text-sm">
                <Link href="/" className="rounded-xl px-3 py-2 text-white/80 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/8 hover:text-white">
                  Platform
                </Link>
                <Link
                  href="/store"
                  className="rounded-xl px-3 py-2 text-white/80 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/8 hover:text-white"
                >
                  Store
                </Link>
                <Link href="/store" className="rounded-xl px-3 py-2 text-white/80 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/8 hover:text-white">
                  Commerce Tools
                </Link>
                <a href="#" className="rounded-xl px-3 py-2 text-white/80 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/8 hover:text-white">
                  Solutions
                </a>
                <Link href="/cart" className="rounded-xl px-3 py-2 text-white/80 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/8 hover:text-white">
                  Cart
                </Link>
                <Link
                  href="/pricing"
                  className="rounded-xl px-3 py-2 text-white/80 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/8 hover:text-white"
                >
                  Pricing
                </Link>
                <Link href="/demo" className="rounded-xl px-3 py-2 text-white/80 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/8 hover:text-white">
                  Demo Page
                </Link>
                <div className="mt-2 flex flex-col gap-3">
                  <Link
                    href="/auth"
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  >
                    Sign In
                  </Link>
                  <button className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}