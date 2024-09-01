// elysia-with-bun.ts
import { Elysia } from 'elysia';

const app = new Elysia();

app.get('/', () => 'Hello from ElysiaJS with Bun!');

export default {
  port: 3000,
  fetch: app.handle
};
