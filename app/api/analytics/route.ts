import { prisma } from '../../../lib/db';
import { authorized } from '../../../lib/auth';
import { summarize } from '../../../lib/analytics.mjs';
export const runtime = 'nodejs';
export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const incomes = await prisma.income.findMany({ include: { category: true }, orderBy: { receivedAt: 'desc' }, take: 5000 });
  return Response.json(summarize(incomes));
}
