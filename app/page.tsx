"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7 },
};

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glareClassName?: string;
};

function TiltCard({
  children,
  className = "",
  intensity = 12,
  glareClassName = "",
}: TiltCardProps) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const rotateXSpring = useSpring(rotateX, { stiffness: 180, damping: 18 });
  const rotateYSpring = useSpring(rotateY, { stiffness: 180, damping: 18 });

  const transform = useMotionTemplate`perspective(1400px) rotateX(${rotateXSpring}deg) rotateY(${rotateYSpring}deg)`;
  const glow = useMotionTemplate`radial-gradient(circle at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.16), transparent 35%)`;

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    rotateY.set(((x / rect.width) - 0.5) * intensity);
    rotateX.set(((y / rect.height) - 0.5) * -intensity);
    mouseX.set((x / rect.width) * 100);
    mouseY.set((y / rect.height) * 100);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
    mouseX.set(50);
    mouseY.set(50);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d", transform }}
      className={`relative ${className}`}
    >
      <motion.div
        aria-hidden="true"
        style={{ background: glow }}
        className={`pointer-events-none absolute inset-0 rounded-[inherit] ${glareClassName}`}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

type SmallCardProps = {
  title: string;
  text: string;
};

function SmallCard({ title, text }: SmallCardProps) {
  return (
    <TiltCard className="rounded-3xl">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
        <p className="text-2xl font-semibold">{title}</p>
        <p className="mt-2 text-sm leading-6 text-white/55">{text}</p>
      </div>
    </TiltCard>
  );
}

function PrimaryButton({ children }: { children: ReactNode }) {
  return (
    <button className="group relative overflow-hidden rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black shadow-[0_10px_40px_rgba(255,255,255,0.12)] transition duration-300 hover:scale-105 hover:shadow-[0_18px_60px_rgba(255,255,255,0.18)]">
      <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.85)_50%,transparent_100%)] opacity-0 transition duration-500 group-hover:translate-x-full group-hover:opacity-100" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}

function SecondaryButton({ children }: { children: ReactNode }) {
  return (
    <div className="group rounded-full border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-medium text-white/90 backdrop-blur-xl transition duration-300 hover:scale-105 hover:border-white/20 hover:bg-white/10 hover:text-white">
      <span className="inline-flex items-center gap-2">
        <span>{children}</span>
        <span className="transition duration-300 group-hover:translate-x-1">
          →
        </span>
      </span>
    </div>
  );
}

type OrbitChipProps = {
  label: string;
  value: string;
  className?: string;
  duration?: number;
};

function OrbitChip({
  label,
  value,
  className = "",
  duration = 10,
}: OrbitChipProps) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      <TiltCard className="rounded-2xl" intensity={10}>
        <div className="w-44 rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl shadow-[0_14px_40px_rgba(0,0,0,0.22)]">
          <p className="text-xs uppercase tracking-[0.25em] text-white/40">
            {label}
          </p>
          <p className="mt-3 text-2xl font-semibold">{value}</p>
        </div>
      </TiltCard>
    </motion.div>
  );
}

function HeroObject() {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const moveX = useMotionValue(0);
  const moveY = useMotionValue(0);

  const springRotateX = useSpring(rotateX, { stiffness: 120, damping: 18 });
  const springRotateY = useSpring(rotateY, { stiffness: 120, damping: 18 });
  const springMoveX = useSpring(moveX, { stiffness: 90, damping: 18 });
  const springMoveY = useSpring(moveY, { stiffness: 90, damping: 18 });

  const objectTransform = useMotionTemplate`perspective(1800px) rotateX(${springRotateX}deg) rotateY(${springRotateY}deg) translateX(${springMoveX}px) translateY(${springMoveY}px)`;

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = x / rect.width - 0.5;
    const yPct = y / rect.height - 0.5;

    rotateY.set(xPct * 18);
    rotateX.set(yPct * -18);
    moveX.set(xPct * 14);
    moveY.set(yPct * 14);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
    moveX.set(0);
    moveY.set(0);
  }

  return (
    <div className="relative mx-auto flex h-[500px] w-full max-w-[620px] items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.2, 0.34, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-3xl"
      />

      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative z-10 flex h-[420px] w-[420px] items-center justify-center"
      >
        <motion.div
          style={{ x: springMoveX, y: springMoveY }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="absolute h-[390px] w-[390px] rounded-full border border-cyan-300/15"
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
            className="absolute h-[300px] w-[300px] rounded-full border border-fuchsia-300/15"
          />

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute h-[240px] w-[240px] rounded-full border border-white/10"
          />
        </motion.div>

        <motion.div
          style={{ transform: objectTransform, transformStyle: "preserve-3d" }}
          className="relative z-10"
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <TiltCard
              className="rounded-full"
              intensity={8}
              glareClassName="opacity-90"
            >
              <div className="relative flex h-[220px] w-[220px] items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.22),rgba(255,255,255,0.04)_35%,rgba(8,17,32,0.94)_70%)] shadow-[0_30px_120px_rgba(0,0,0,0.52)] backdrop-blur-2xl">
                <motion.div
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute h-[100px] w-[100px] rounded-full bg-cyan-400/15 blur-2xl"
                />

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute h-[170px] w-[170px] rounded-full border border-cyan-300/15"
                />

                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                  className="absolute h-[130px] w-[130px] rounded-full border border-fuchsia-300/15"
                />

                <div className="relative z-10 text-center">
                  <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">
                    Storify Core
                  </p>
                  <p className="mt-3 text-5xl font-semibold">AI</p>
                  <p className="mt-2 text-sm text-white/55">Commerce Engine</p>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </motion.div>
      </div>

      <OrbitChip
        label="AI Pages"
        value="Auto"
        duration={7}
        className="absolute left-2 top-12 hidden md:block"
      />

      <OrbitChip
        label="SEO"
        value="A+"
        duration={9}
        className="absolute right-2 top-16 hidden md:block"
      />

      <OrbitChip
        label="Orders"
        value="Live"
        duration={8}
        className="absolute bottom-10 left-10 hidden md:block"
      />

      <OrbitChip
        label="Growth"
        value="Built In"
        duration={10}
        className="absolute bottom-6 right-12 hidden md:block"
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="relative overflow-hidden border-b border-white/10 pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.12),transparent_24%),linear-gradient(to_bottom,#020617,#081120)]" />

        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-0 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl"
        />

        <motion.div
          animate={{ y: [0, 18, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-0 top-20 h-[340px] w-[340px] rounded-full bg-fuchsia-500/10 blur-3xl"
        />

        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-24 h-28 w-28 rounded-full bg-cyan-300/10 blur-2xl"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-12 pt-8">

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="max-w-4xl"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-200">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                The AI Commerce Platform
              </div>

              <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
                Build a premium online business with AI, automation, and serious
                platform power.
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/65 md:text-xl">
                Storify helps you launch, manage, and grow a modern ecommerce
                brand with AI content, smart workflows, better SEO control, and
                a premium customer experience that does not feel generic.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <PrimaryButton>Start Building</PrimaryButton>
                <Link href="/product/demo" className="inline-flex">
                  <SecondaryButton>View Demo</SecondaryButton>
                </Link>
              </div>

              <div className="mt-14 grid max-w-3xl gap-4 sm:grid-cols-3">
                <SmallCard
                  title="AI Content"
                  text="Generate product pages, descriptions, FAQs, and SEO content."
                />
                <SmallCard
                  title="Automation"
                  text="Connect orders, workflows, fulfillment, and marketing."
                />
                <SmallCard
                  title="SEO Control"
                  text="Manage metadata, structure, indexing, and scalable content."
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.22 }}
              className="relative"
            >
              <HeroObject />
            </motion.div>
          </div>

          <motion.div
            {...fadeUp}
            className="mt-10 grid gap-4 border-t border-white/10 pt-8 text-center text-sm text-white/45 md:grid-cols-4 md:text-left"
          >
            <div>
              <p className="text-2xl font-semibold text-white">Fast</p>
              <p className="mt-2">Modern frontend experience</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">Smart</p>
              <p className="mt-2">AI-led content and workflows</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">Scalable</p>
              <p className="mt-2">SEO and growth-ready structure</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">Flexible</p>
              <p className="mt-2">Built to evolve into SaaS</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative border-t border-white/10 bg-[#06101f] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            {...fadeUp}
            className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]"
          >
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                Unified Commerce Control
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-6xl">
                One system for content, growth, operations, and brand
                experience.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
                Storify is designed to combine storefront quality with back-end
                control, so the platform feels premium for customers and
                efficient for the business behind it.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <SmallCard
                  title="Storefront Quality"
                  text="High-end layouts, modern motion, and stronger brand presentation."
                />
                <SmallCard
                  title="Operator Control"
                  text="Products, SEO, automation, and content in one connected system."
                />
              </div>
            </div>

            <TiltCard className="rounded-[2rem]" intensity={14}>
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/10 bg-[#0b1220]/85 p-6">
                    <p className="text-sm text-cyan-300">Store Builder</p>
                    <h3 className="mt-3 text-2xl font-semibold">
                      Premium storefront design
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-white/60">
                      Build pages that feel modern, clean, and conversion-ready.
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-[#0b1220]/85 p-6">
                    <p className="text-sm text-fuchsia-300">Growth Layer</p>
                    <h3 className="mt-3 text-2xl font-semibold">
                      Smart SEO and content engine
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-white/60">
                      Generate structured content and improve discoverability.
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-[#0b1220]/85 p-6">
                    <p className="text-sm text-emerald-300">Automation</p>
                    <h3 className="mt-3 text-2xl font-semibold">
                      Connected workflows
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-white/60">
                      Marketing, order routing, and future dropshipping systems.
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-[#0b1220]/85 p-6">
                    <p className="text-sm text-sky-300">Future SaaS</p>
                    <h3 className="mt-3 text-2xl font-semibold">
                      Built to expand
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-white/60">
                      Grow your own platform into software other businesses can
                      use.
                    </p>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#06101f] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="mb-12 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Demo Experience
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-6xl">
              A real product-style layout, not just a homepage concept.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/65 md:text-xl">
              Storify should feel like a real platform people can imagine using.
              This preview section makes the site feel closer to a working
              product.
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <TiltCard className="rounded-[2rem]" intensity={14}>
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                <div className="rounded-[1.5rem] border border-white/10 bg-[#0b1220]/90 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/45">Demo Storefront</p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">
                        Premium Product Detail Experience
                      </h3>
                    </div>
                    <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                      Live Preview
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 md:grid-cols-[0.95fr_1.05fr]">
                    <div className="rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_38%),linear-gradient(to_bottom,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5">
                      <div className="flex h-[280px] items-center justify-center rounded-[1.25rem] border border-white/10 bg-[#081120]">
                        <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-400/10">
                          <div className="absolute h-24 w-24 rounded-full bg-cyan-300/20 blur-2xl" />
                          <div className="relative z-10 text-center">
                            <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/80">
                              Demo Product
                            </p>
                            <p className="mt-2 text-3xl font-semibold text-white">
                              AI
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
                        Smart Product Copy
                      </p>
                      <h4 className="mt-3 text-3xl font-semibold text-white">
                        Product page structure that feels modern and
                        conversion-ready.
                      </h4>
                      <p className="mt-4 text-sm leading-7 text-white/60">
                        This is where premium visuals, pricing, features,
                        reviews, and AI-generated copy come together in a real
                        shopping experience.
                      </p>

                      <div className="mt-6 flex items-center gap-3">
                        <p className="text-3xl font-semibold text-white">
                          $129
                        </p>
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                          In Stock
                        </span>
                      </div>

                      <div className="mt-6 grid gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
                          AI-generated product descriptions and FAQs
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
                          Better SEO structure and metadata control
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
                          Premium visual presentation for higher trust
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <PrimaryButton>Add to Cart</PrimaryButton>
                        <Link href="/product/demo" className="inline-flex">
                          <SecondaryButton>Preview Details</SecondaryButton>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>

            <div className="grid gap-6">
              <TiltCard className="rounded-[1.75rem]" intensity={10}>
                <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
                  <p className="text-sm text-fuchsia-300">Content Engine</p>
                  <p className="mt-3 text-3xl font-semibold text-white">
                    AI-written copy
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/60">
                    Generate descriptions, feature bullets, FAQs, and
                    structured sections faster.
                  </p>
                </div>
              </TiltCard>

              <TiltCard className="rounded-[1.75rem]" intensity={10}>
                <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
                  <p className="text-sm text-emerald-300">Conversion Layer</p>
                  <p className="mt-3 text-3xl font-semibold text-white">
                    Stronger UX
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/60">
                    Create a better shopping flow with premium UI, stronger
                    trust, and clearer product decisions.
                  </p>
                </div>
              </TiltCard>

              <TiltCard className="rounded-[1.75rem]" intensity={10}>
                <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
                  <p className="text-sm text-sky-300">Scalable System</p>
                  <p className="mt-3 text-3xl font-semibold text-white">
                    Ready to grow
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/60">
                    Move from a single store into a bigger software platform
                    without rebuilding everything later.
                  </p>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/10 bg-[#040b18] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Why Storify Feels Different
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Built like a premium brand, engineered like a serious platform.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/65 md:text-xl">
              Storify is designed to combine the visual polish customers expect
              with the operational power store owners need. It is not just a
              storefront — it is the beginning of a complete commerce system.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <TiltCard className="rounded-[2rem]">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/10 bg-[#0b1220]/80 p-6">
                    <p className="text-sm text-cyan-300">Customer Experience</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">
                      Elegant front-end design that feels modern and high trust.
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-white/60">
                      Create an experience that feels more premium than a
                      standard ecommerce template, with strong design, better
                      structure, and room for advanced visuals later.
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-[#0b1220]/80 p-6">
                    <p className="text-sm text-fuchsia-300">Business Control</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">
                      Powerful admin tools built for growth, not just
                      appearance.
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-white/60">
                      Manage products, content, orders, SEO, and automation from
                      one place so the platform grows with your business instead
                      of holding it back.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-gradient-to-r from-cyan-400/10 to-fuchsia-400/10 p-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-white/45">
                    Platform Foundation
                  </p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-sm text-white/45">Storefront</p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        Modern UI system
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-sm text-white/45">Engine</p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        AI + automation ready
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-sm text-white/45">Scale</p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        SaaS-ready structure
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>

            <TiltCard className="rounded-[2rem]">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
                <div className="rounded-[1.5rem] border border-white/10 bg-[#0b1220]/80 p-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
                    What Storify Will Include
                  </p>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-base font-semibold text-white">
                        AI Product Pages
                      </p>
                      <p className="mt-2 text-sm leading-7 text-white/60">
                        Generate descriptions, features, FAQs, and
                        search-friendly content faster.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-base font-semibold text-white">
                        Smart SEO Controls
                      </p>
                      <p className="mt-2 text-sm leading-7 text-white/60">
                        Manage slugs, metadata, schema, internal linking, and
                        site structure with more flexibility.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-base font-semibold text-white">
                        Automation Workflows
                      </p>
                      <p className="mt-2 text-sm leading-7 text-white/60">
                        Connect orders, marketing, content generation, and
                        future dropshipping workflows from one system.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#020617] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            {...fadeUp}
            className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]"
          >
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                Trusted Platform Foundation
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-6xl">
                Designed to help stores look better, move faster, and scale
                smarter.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
                Storify is being built as more than a storefront. It is a system
                that combines design, operations, SEO, AI content, and
                automation into one premium experience.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <TiltCard className="rounded-[1.75rem]">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
                  <p className="text-sm text-white/45">Performance Ready</p>
                  <p className="mt-3 text-3xl font-semibold text-white">
                    Fast UX
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/60">
                    Built with a modern stack so pages feel smooth, responsive,
                    and optimized for a better customer journey.
                  </p>
                </div>
              </TiltCard>

              <TiltCard className="rounded-[1.75rem]">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
                  <p className="text-sm text-white/45">Content Engine</p>
                  <p className="mt-3 text-3xl font-semibold text-white">
                    AI-Led
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/60">
                    Create product descriptions, SEO content, structured copy,
                    and scalable landing pages much faster.
                  </p>
                </div>
              </TiltCard>

              <TiltCard className="rounded-[1.75rem]">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
                  <p className="text-sm text-white/45">Business Control</p>
                  <p className="mt-3 text-3xl font-semibold text-white">
                    Centralized
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/60">
                    Manage products, content, growth systems, and future
                    fulfillment workflows from one place.
                  </p>
                </div>
              </TiltCard>

              <TiltCard className="rounded-[1.75rem]">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
                  <p className="text-sm text-white/45">Future Vision</p>
                  <p className="mt-3 text-3xl font-semibold text-white">
                    SaaS Ready
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/60">
                    The structure is being designed so Storify can grow from
                    your own platform into software other businesses can use.
                  </p>
                </div>
              </TiltCard>
            </div>
          </motion.div>

          <motion.div
            {...fadeUp}
            className="mt-16 grid gap-4 rounded-[2rem] border border-white/10 bg-gradient-to-r from-cyan-400/10 to-fuchsia-400/10 p-6 md:grid-cols-4"
          >
            <TiltCard className="rounded-2xl">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-white/45">Experience</p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  Premium
                </p>
              </div>
            </TiltCard>

            <TiltCard className="rounded-2xl">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-white/45">Automation</p>
                <p className="mt-2 text-3xl font-semibold text-white">Smart</p>
              </div>
            </TiltCard>

            <TiltCard className="rounded-2xl">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-white/45">SEO</p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  Scalable
                </p>
              </div>
            </TiltCard>

            <TiltCard className="rounded-2xl">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-white/45">Growth</p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  Built In
                </p>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#020617] px-6 py-24">
        <motion.div
          {...fadeUp}
          className="mx-auto max-w-5xl rounded-[2.5rem] border border-white/10 bg-gradient-to-r from-cyan-400/10 via-white/[0.03] to-fuchsia-400/10 p-10 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-16"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            Ready To Build
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-6xl">
            Launch the future of your ecommerce business with Storify.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/65 md:text-xl">
            Build a premium online experience, add AI-powered content, prepare
            for automation, and create a platform that can grow into something
            much bigger than a typical store.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <PrimaryButton>Start Building</PrimaryButton>
            <Link href="/product/demo" className="inline-flex">
              <SecondaryButton>Book a Demo</SecondaryButton>
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}