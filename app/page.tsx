'use client';
import { useMemo, useState } from 'react';
import Papa from 'papaparse';
import { summarize } from '../lib/analytics.mjs';
type Income = { id: string; source: string; description: string; amountCents: number; receivedAt: string; category: { name: string } };
const sample: Income[] = [
  { id: '1', source: 'Brand Deal', description: 'Campaign', amountCents: 180000, receivedAt: '2026-07-18', category: { name: 'Brand Deals' } },
  { id: '2', source: 'Digital Product', description: 'Template sales', amountCents: 42000, receivedAt: '2026-07-26', category: { name: 'Product Sales' } },
  { id: '3', source: 'Client Work', description: 'Consulting', amountCents: 96000, receivedAt: '2026-08-12', category: { name: 'Client Work' } },
  { id: '4', source: 'Brand Deal', description: 'Launch', amountCents: 210000, receivedAt: '2026-08-23', category: { name: 'Brand Deals' } },
  { id: '5', source: 'Digital Product', description: 'Template sales', amountCents: 69000, receivedAt: '2026-09-20', category: { name: 'Product Sales' } }
];
const euro = (cents: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR' }).format(cents / 100);
export default function Page() {
  const [token, setToken] = useState('');
  const [rows, setRows] = useState<Income[]>(sample);
  const [status, setStatus] = useState('Showing sample data. Enter your private API token to load or save your records.');
  const [form, setForm] = useState({ source: 'Client Work', category: 'Client Work', description: '', amount: '', receivedAt: new Date().toISOString().slice(0, 10) });
  const report = useMemo(() => summarize(rows), [rows]);
  async function load() {
    const res = await fetch('/api/income', { headers: { 'x-api-key': token } });
    if (!res.ok) { setStatus('Could not load. Check your API token and database setup.'); return; }
    setRows(await res.json()); setStatus('Loaded private records.');
  }
  async function save() {
    const res = await fetch('/api/income', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': token }, body: JSON.stringify(form) });
    if (!res.ok) { setStatus('Could not save. Check the form, token, and database.'); return; }
    setStatus('Income saved.'); await load();
  }
  async function importCsv(file?: File) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setStatus('CSV exceeds 2 MiB.'); return; }
    const parsed = Papa.parse<Record<string, string>>(await file.text(), { header: true, skipEmptyLines: true });
    const incomes = parsed.data.flatMap((item, index) => {
      const amountCents = Math.round(Number(item.amount) * 100);
      const receivedAt = item.receivedAt || item.date;
      return Number.isSafeInteger(amountCents) && amountCents > 0 && /^\d{4}-\d{2}-\d{2}$/.test(receivedAt || '') ? [{ id: `csv-${index}`, source: item.source || 'CSV', description: item.description || '', amountCents, receivedAt, category: { name: item.category || 'Other' } }] : [];
    });
    setRows(incomes); setStatus(`Previewing ${incomes.length} CSV rows locally. Import does not write to the database.`);
  }
  return <main><div className="eyebrow">CREATOR FINANCE · REVENUE ANALYTICS</div><header><h1>Money Dashboard</h1><p>See brand deals, product sales, and client work in one view.</p></header>
    <section className="toolbar"><input aria-label="Private API token" type="password" placeholder="Private API token" value={token} onChange={e => setToken(e.target.value)} /><button onClick={load}>Load my records</button><label className="csv">Preview CSV<input type="file" accept=".csv,text/csv" onChange={e => importCsv(e.target.files?.[0])} /></label><button className="secondary" onClick={() => { setRows(sample); setStatus('Showing sample data.'); }}>Sample</button><p role="status">{status}</p></section>
    <div className="metrics"><article><span>Total revenue</span><strong>{euro(report.totalCents)}</strong></article><article><span>Latest month</span><strong>{euro(report.months.at(-1)?.cents ?? 0)}</strong></article><article><span>Monthly growth</span><strong>{report.growthPercent == null ? '—' : `${report.growthPercent.toFixed(1)}%`}</strong></article></div>
    <div className="grid"><section><h2>Monthly revenue</h2>{report.months.map(item => <div className="barrow" key={item.month}><span>{item.month}</span><div><i style={{ width: `${Math.max(3, item.cents / Math.max(...report.months.map(m => m.cents)) * 100)}%` }} /></div><b>{euro(item.cents)}</b></div>)}</section><section><h2>By category</h2>{report.categories.map(item => <div className="cat" key={item.name}><span>{item.name}</span><b>{euro(item.cents)}</b></div>)}</section></div>
    <section><h2>Add income</h2><div className="form"><input aria-label="Source" placeholder="Source" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} /><input aria-label="Category" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /><input aria-label="Description" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /><input aria-label="Amount in EUR" type="number" min="0.01" step="0.01" placeholder="Amount in EUR" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /><input aria-label="Received date" type="date" value={form.receivedAt} onChange={e => setForm({ ...form, receivedAt: e.target.value })} /><button onClick={save} disabled={!token}>Save to database</button></div></section>
    <section><h2>Recent income</h2><div className="table"><table><thead><tr><th>Date</th><th>Source</th><th>Category</th><th>Description</th><th>Amount</th></tr></thead><tbody>{rows.map(row => <tr key={row.id}><td>{row.receivedAt.slice(0, 10)}</td><td>{row.source}</td><td>{row.category.name}</td><td>{row.description}</td><td>{euro(row.amountCents)}</td></tr>)}</tbody></table></div></section><footer>Sample data is fictional. Private records require an API token and a configured local database.</footer></main>;
}
