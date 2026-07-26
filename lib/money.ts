export type Money = {
  amountMinor: number;
  currency: string;
};

export function toMinorUnits(major: number, currency = "usd"): Money {
  if (!Number.isFinite(major) || major < 0) {
    throw new Error("Invalid money amount");
  }
  return {
    amountMinor: Math.round(major * 100),
    currency: currency.toLowerCase(),
  };
}

export function fromMinorUnits(amountMinor: number): number {
  return amountMinor / 100;
}

export function lineTotalMinor(
  unitMinor: number,
  quantity: number
): number {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Invalid quantity");
  }
  if (!Number.isInteger(unitMinor) || unitMinor < 0) {
    throw new Error("Invalid unit amount");
  }
  return unitMinor * quantity;
}
