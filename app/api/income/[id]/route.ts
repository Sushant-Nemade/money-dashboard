import { prisma } from '../../../../lib/db';
import { authorized } from '../../../../lib/auth';
export const runtime = 'nodejs';
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!authorized(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await context.params;
  const existing = await prisma.income.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: 'Not found' }, { status: 404 });
  await prisma.income.delete({ where: { id } });
  return Response.json({ deleted: id });
}
