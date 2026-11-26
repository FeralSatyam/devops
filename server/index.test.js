import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { createAppServer, menu } from './index.js';

async function withServer(run) {
  const directory = await mkdtemp(join(tmpdir(), 'pani-puri-house-'));
  const server = createAppServer({ ordersFile: join(directory, 'orders.json') });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();

  try {
    await run(`http://127.0.0.1:${address.port}`, directory);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
    await rm(directory, { recursive: true, force: true });
  }
}

test('menu endpoint returns items and health endpoint responds', async () => {
  await withServer(async (baseUrl) => {
    const [menuResponse, healthResponse] = await Promise.all([
      fetch(`${baseUrl}/api/menu`),
      fetch(`${baseUrl}/api/health`),
    ]);

    assert.equal(menuResponse.status, 200);
    assert.deepEqual(await menuResponse.json(), menu);
    assert.deepEqual(await healthResponse.json(), { status: 'ok' });
  });
});

test('valid orders are priced by the server and persisted; invalid orders are rejected', async () => {
  await withServer(async (baseUrl, directory) => {
    const response = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '  Sam  ',
        phone: '+977 980-000-0000',
        menuItemId: 'dahi-puri',
        quantity: 2,
      }),
    });

    assert.equal(response.status, 201);
    const { order } = await response.json();
    assert.equal(order.name, 'Sam');
    assert.equal(order.total, 200);
    const savedOrders = JSON.parse(await readFile(join(directory, 'orders.json'), 'utf8'));
    assert.deepEqual(savedOrders, [order]);

    const invalidResponse = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sam',
        phone: '1234567',
        menuItemId: 'not-on-the-menu',
        quantity: 1,
      }),
    });
    assert.equal(invalidResponse.status, 400);
  });
});
