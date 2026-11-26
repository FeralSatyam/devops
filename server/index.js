import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const menu = [
  {
    id: 'classic-pani-puri',
    name: 'Classic Pani Puri',
    description: 'Crisp puris, potato, chickpeas and our tangy house pani.',
    price: 80,
    icon: '🥣',
    label: 'The original',
  },
  {
    id: 'dahi-puri',
    name: 'Dahi Puri',
    description: 'Cool yogurt, sweet chutney, sev and a little bit of magic.',
    price: 100,
    icon: '🥛',
    label: 'Creamy & cool',
  },
  {
    id: 'sukha-puri',
    name: 'Sukha Puri',
    description: 'A crunchy finish filled with masala, chutneys and sev.',
    price: 60,
    icon: '✨',
    label: 'One more bite',
  },
].map((item) => Object.freeze(item));

class RequestError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function readJsonBody(request) {
  const chunks = [];
  let length = 0;

  for await (const chunk of request) {
    length += chunk.length;
    if (length > 16 * 1024) throw new RequestError(413, 'Request body is too large.');
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new RequestError(400, 'Request body must be valid JSON.');
  }
}

function sendJson(response, status, data) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(JSON.stringify(data));
}

export function createAppServer({
  ordersFile = process.env.ORDERS_FILE || resolve('data/orders.json'),
} = {}) {
  let writes = Promise.resolve();

  async function saveOrder(order) {
    const operation = writes.then(async () => {
      let orders = [];
      try {
        const content = await readFile(ordersFile, 'utf8');
        orders = JSON.parse(content);
        if (!Array.isArray(orders)) throw new Error('Order data must be an array.');
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }

      orders.push(order);
      await mkdir(dirname(ordersFile), { recursive: true });
      const temporaryFile = `${ordersFile}.${randomUUID()}.tmp`;
      await writeFile(temporaryFile, `${JSON.stringify(orders, null, 2)}\n`, { mode: 0o600 });
      await rename(temporaryFile, ordersFile);
    });

    writes = operation.then(() => undefined, () => undefined);
    await operation;
  }

  return createServer(async (request, response) => {
    const url = new URL(request.url, 'http://localhost');

    if (request.method === 'GET' && url.pathname === '/api/health') {
      return sendJson(response, 200, { status: 'ok' });
    }

    if (request.method === 'GET' && url.pathname === '/api/menu') {
      return sendJson(response, 200, menu);
    }

    if (request.method === 'POST' && url.pathname === '/api/orders') {
      try {
        const body = await readJsonBody(request);
        if (!body || typeof body !== 'object' || Array.isArray(body)) {
          throw new RequestError(400, 'Order details are required.');
        }

        const name = typeof body.name === 'string' ? body.name.trim() : '';
        const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
        const phoneDigits = phone.replace(/\D/g, '');
        const item = menu.find((entry) => entry.id === body.menuItemId);
        const quantity = body.quantity;

        if (!name || name.length > 100) throw new RequestError(400, 'Enter a name up to 100 characters.');
        if (!/^[+\d\s().-]+$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
          throw new RequestError(400, 'Enter a valid phone number.');
        }
        if (!item) throw new RequestError(400, 'Choose an item from the menu.');
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
          throw new RequestError(400, 'Choose between 1 and 20 plates.');
        }

        const order = {
          id: randomUUID(),
          createdAt: new Date().toISOString(),
          name,
          phone,
          menuItemId: item.id,
          itemName: item.name,
          quantity,
          total: item.price * quantity,
        };
        await saveOrder(order);
        return sendJson(response, 201, { order });
      } catch (error) {
        if (error instanceof RequestError) {
          return sendJson(response, error.status, { error: error.message });
        }
        console.error('Could not save order:', error);
        return sendJson(response, 500, { error: 'We could not save your order. Please try again.' });
      }
    }

    return sendJson(response, 404, { error: 'Not found.' });
  });
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const port = Number(process.env.PORT || 3000);
  createAppServer().listen(port, '127.0.0.1', () => {
    console.log(`Pani Puri House API listening on 127.0.0.1:${port}`);
  });
}
