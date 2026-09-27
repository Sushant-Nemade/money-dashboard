import { timingSafeEqual } from 'node:crypto';
export function authorized(request: Request): boolean {
  const expected = process.env.ADMIN_API_TOKEN;
  const provided = request.headers.get('x-api-key');
  if (!expected || expected.length < 32 || !provided) return false;
  const a = Buffer.from(expected); const b = Buffer.from(provided);
  return a.length === b.length && timingSafeEqual(a, b);
}
