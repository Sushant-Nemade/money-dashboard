export function summarize(incomes) {
  const monthly = new Map();
  const categories = new Map();
  for (const item of incomes) {
    const month = new Date(item.receivedAt).toISOString().slice(0, 7);
    const value = Number(item.amountCents);
    monthly.set(month, (monthly.get(month) ?? 0) + value);
    const category = item.category?.name ?? item.category ?? 'Other';
    categories.set(category, (categories.get(category) ?? 0) + value);
  }
  const months = [...monthly].sort(([a], [b]) => a.localeCompare(b)).map(([month, cents]) => ({ month, cents }));
  const last = months.at(-1)?.cents ?? 0;
  const previous = months.at(-2)?.cents ?? 0;
  return { totalCents: incomes.reduce((sum, item) => sum + Number(item.amountCents), 0), months, categories: [...categories].map(([name, cents]) => ({ name, cents })), growthPercent: previous ? ((last - previous) / previous) * 100 : null };
}
