export type IncomeLike = { amountCents: number; receivedAt: string | Date; category?: { name: string } | string };
export type Summary = { totalCents: number; months: { month: string; cents: number }[]; categories: { name: string; cents: number }[]; growthPercent: number | null };
export function summarize(incomes: IncomeLike[]): Summary;
