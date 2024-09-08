// hono-with-bun.ts
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.text('Hello from HonoJS with Bun!'));

export default {
  port: 3000,
  fetch: app.fetch
};