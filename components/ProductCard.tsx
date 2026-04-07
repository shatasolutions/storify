"use client";

import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

function TiltCard({ children }: { children: React.ReactNode }) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const rX = useSpring(rotateX, { stiffness: 180, damping: 18 });
  const rY = useSpring(rotateY, { stiffness: 180, damping: 18 });
  const transform = useMotionTemplate`perspective(1200px) rotateX(${rX}deg) rotateY(${rY}deg)`;

  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        rotateX.set(y * -10);
        rotateY.set(x * 10);
      }}
      onMouseLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
      style={{ transform }}
      className="relative"
    >
      {children}
    </motion.div>
  );
}

export default function ProductCard({ product }: any) {
  return (
    <Link href={`/product/${product.slug}`} className="group">
      <TiltCard>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition group-hover:bg-white/[0.05]">

          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(56,189,248,0.25), transparent 60%)",
            }}
          />

          <div className="relative h-40 flex items-center justify-center mb-6">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-4xl font-bold text-cyan-300"
            >
              AI
            </motion.div>
          </div>

          <h2 className="text-xl font-semibold">{product.name}</h2>
          <p className="mt-2 text-white/60">{product.price}</p>

        </div>
      </TiltCard>
    </Link>
  );
}