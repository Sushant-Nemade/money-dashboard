import { prisma } from '../../../lib/db';
import { authorized } from '../../../lib/auth';
export const runtime = 'nodejs';
export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const incomes = await prisma.income.findMany({ include: { category: true }, orderBy: { receivedAt: 'desc' }, take: 500 });
  return Response.json(incomes);
}
export async function POST(request: Request) {
  if (!authorized(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const amountCents = Math.round(Number(body.amount) * 100);
  const date = new Date(body.receivedAt);
  if (!Number.isSafeInteger(amountCents) || amountCents <= 0 || !Number.isFinite(date.valueOf()) || !String(body.category ?? '').trim() || !String(body.source ?? '').trim()) return Response.json({ error: 'Invalid income' }, { status: 400 });
  const email = process.env.ADMIN_EMAIL;
  if (!email) return Response.json({ error: 'ADMIN_EMAIL missing' }, { status: 503 });
  const user = await prisma.user.upsert({ where: { email }, create: { email }, update: {} });
  const category = await prisma.category.upsert({ where: { name: String(body.category).trim() }, create: { name: String(body.category).trim() }, update: {} });
  const income = await prisma.income.create({ data: { userId: user.id, categoryId: category.id, source: String(body.source).slice(0, 80), description: String(body.description ?? '').slice(0, 500), amountCents, receivedAt: date } });
  return Response.json(income, { status: 201 });
}
