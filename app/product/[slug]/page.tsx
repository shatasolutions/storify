import { redirect } from "next/navigation";
import { getProduct } from "@/lib/catalog";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

/**
 * Marketing feature stubs remain here.
 * Commerce SKUs redirect to canonical `/store/[slug]`.
 */
export default async function ProductMarketingPage({ params }: Props) {
  const { slug } = await params;
  if (getProduct(slug)) {
    redirect(`/store/${slug}`);
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white px-6 py-32">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-white/60 text-sm mb-6 block">
          ← Back
        </Link>
        <h1 className="text-4xl font-bold mb-4 capitalize">
          {slug.replace(/-/g, " ")}
        </h1>
        <p className="text-white/60 mb-8">
          Marketing feature overview. Commerce products live under{" "}
          <Link href="/store" className="text-cyan-300 underline">
            /store
          </Link>
          .
        </p>
        <div className="bg-white/5 p-6 rounded-2xl">
          <p className="text-lg">Feature slug:</p>
          <p className="text-cyan-400">{slug}</p>
        </div>
      </div>
    </main>
  );
}
