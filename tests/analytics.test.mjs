import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { summarize } from '../lib/analytics.mjs';
test('totals monthly revenue in integer cents', () => {
  const result = summarize([{ amountCents: 100, receivedAt: '2026-01-01', category: 'Client Work' }, { amountCents: 250, receivedAt: '2026-01-02', category: 'Client Work' }]);
  assert.equal(result.totalCents, 350);
  assert.equal(result.months[0].cents, 350);
});
