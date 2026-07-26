import { lineTotalMinor, toMinorUnits } from "@/lib/money";

export type CatalogProduct = {
  id: string;
  name: string;
  priceMajor: number;
  currency: string;
  category: string;
  status: "active" | "archived";
  description?: string;
};

export type CatalogPlan = {
  id: string;
  name: string;
  priceMajor: number;
  currency: string;
  interval: "month";
};

/** Authoritative catalog — server prices only. */
export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: "ai-commerce-engine",
    name: "AI Commerce Engine",
    priceMajor: 129,
    currency: "usd",
    category: "build",
    status: "active",
    description: "Full AI-powered ecommerce system with automation and SEO tools.",
  },
  {
    id: "smart-marketing-suite",
    name: "Smart Marketing Suite",
    priceMajor: 89,
    currency: "usd",
    category: "marketing",
    status: "active",
  },
  {
    id: "payment-automation",
    name: "Payment Automation",
    priceMajor: 59,
    currency: "usd",
    category: "payments",
    status: "active",
  },
  {
    id: "website-builder",
    name: "Website Builder",
    priceMajor: 99,
    currency: "usd",
    category: "build",
    status: "active",
  },
  {
    id: "online-store",
    name: "Online Store",
    priceMajor: 120,
    currency: "usd",
    category: "sell",
    status: "active",
  },
];

export const CATALOG_PLANS: CatalogPlan[] = [
  { id: "starter", name: "Starter Plan", priceMajor: 29, currency: "usd", interval: "month" },
  { id: "pro", name: "Pro Plan", priceMajor: 69, currency: "usd", interval: "month" },
  { id: "enterprise", name: "Enterprise Plan", priceMajor: 129, currency: "usd", interval: "month" },
];

export function getProduct(id: string): CatalogProduct | undefined {
  return CATALOG_PRODUCTS.find((p) => p.id === id && p.status === "active");
}

export function getPlan(id: string): CatalogPlan | undefined {
  return CATALOG_PLANS.find((p) => p.id === id);
}

export type CheckoutLineInput = {
  id: string;
  quantity: number;
  kind?: "product" | "plan";
};

export type PricedLine = {
  id: string;
  name: string;
  quantity: number;
  unitAmountMinor: number;
  currency: string;
  kind: "product" | "plan";
};

export function priceCheckoutLines(inputs: CheckoutLineInput[]): {
  lines: PricedLine[];
  totalMinor: number;
  currency: string;
} {
  if (!Array.isArray(inputs) || inputs.length === 0) {
    throw new Error("No line items");
  }

  const lines: PricedLine[] = inputs.map((input) => {
    const quantity = Number(input.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new Error(`Invalid quantity for ${input.id}`);
    }

    const kind = input.kind ?? (input.id.startsWith("plan-") ? "plan" : "product");
    if (kind === "plan") {
      const planId = input.id.replace(/^plan-/, "");
      const plan = getPlan(planId);
      if (!plan) throw new Error(`Unknown plan: ${planId}`);
      const money = toMinorUnits(plan.priceMajor, plan.currency);
      return {
        id: `plan-${plan.id}`,
        name: plan.name,
        quantity,
        unitAmountMinor: money.amountMinor,
        currency: money.currency,
        kind: "plan" as const,
      };
    }

    const product = getProduct(input.id);
    if (!product) throw new Error(`Unknown product: ${input.id}`);
    const money = toMinorUnits(product.priceMajor, product.currency);
    return {
      id: product.id,
      name: product.name,
      quantity,
      unitAmountMinor: money.amountMinor,
      currency: money.currency,
      kind: "product" as const,
    };
  });

  const currency = lines[0]!.currency;
  if (lines.some((l) => l.currency !== currency)) {
    throw new Error("Mixed currencies are not supported");
  }

  const totalMinor = lines.reduce(
    (sum, line) => sum + lineTotalMinor(line.unitAmountMinor, line.quantity),
    0
  );

  return { lines, totalMinor, currency };
}
